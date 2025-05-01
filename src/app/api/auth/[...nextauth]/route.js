//[...nextauth]/route.js
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from '@/lib/prisma';
import nodemailer from "nodemailer";
import { isEmailAllowed } from "../../../utils/auth"; // Import the utility function

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorizationUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
      callbackUrl: `${process.env.NEXTAUTH_URL}/api/auth/callback/google`,  // Ensure this is correct
    }),
    EmailProvider({
      async sendVerificationRequest({ identifier: email, url, provider }) {
        // Check if the email is in the allowed list before sending the email
        const allowed = await isEmailAllowed(email); // Use the database check
        if (!allowed) {
          console.log(`Unauthorized email attempt blocked: ${email}`);
          return;
        }

        // Use environment variables for production email
        const transport = process.env.NODE_ENV === 'production'
          ? nodemailer.createTransport({
              host: process.env.EMAIL_SERVER_HOST,
              port: process.env.EMAIL_SERVER_PORT,
              secure: process.env.EMAIL_SERVER_SECURE === 'true',
              auth: {
                user: process.env.EMAIL_SERVER_USER,
                pass: process.env.EMAIL_SERVER_PASSWORD,
              },
            })
          : await createTestTransport();

        // Send the email with your existing template
        const info = await transport.sendMail({
          from: process.env.EMAIL_FROM || '"Gabriel" <noreply@doggie-oasis.com>',
          to: email,
          subject: "Sign in to RestoVibe",
          text: `Click this link to sign in: ${url}`,
          html: `
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #ed8936; margin-bottom: 20px;">RestoVibe Login</h2>
              <p>Click the button below to sign in to your account:</p>
              <p style="margin: 30px 0;">
                <a href="${url}" style="background-color: #ed8936; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
                  Sign In
                </a>
              </p>
              <p style="color: #666; font-size: 14px;">If you didn't request this email, you can safely ignore it.</p>
            </div>
          `,
        });

        if (process.env.NODE_ENV !== 'production') {
          console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        }
      }
    }),
    // Add Credentials provider for direct login of allowed users
    CredentialsProvider({
      id: "email-login",
      name: "Email Direct Login",
      credentials: {
        email: { label: "Email", type: "email" }
      },
      async authorize(credentials, req) {
        if (!credentials?.email) return null;

        const email = credentials.email;
        console.log(`Attempting direct login for: ${email}`);

        // Check if the email is allowed
        const allowed = await isEmailAllowed(email);
        if (!allowed) {
          console.log(`Email not allowed for direct login: ${email}`);
          return null;
        }

        // Check if user already exists
        let user = await prisma.user.findUnique({
          where: { email }
        });

        // If user doesn't exist yet, create them
        if (!user) {
          console.log(`Creating new user for direct login: ${email}`);
          user = await prisma.user.create({
            data: {
              email,
              emailVerified: new Date(),
            }
          });
        } else if (!user.emailVerified) {
          // If user exists but email isn't verified, update it
          console.log(`Verifying email for existing user: ${email}`);
          user = await prisma.user.update({
            where: { id: user.id },
            data: { emailVerified: new Date() }
          });
        }

        console.log(`Direct login successful for: ${email}`);
        return {
          id: user.id,
          email: user.email,
          emailVerified: user.emailVerified
        };
      }
    }),
  ],
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error',
    verifyRequest: '/auth/verify-request',
  },
  callbacks: {
    async jwt({ token, user, account }) {
      // If we have a user, add their id to the token
      if (user) {
        token.userId = user.id;
      }
      return token;
    },

    async session({ session, token, user }) {
      // For the JWT strategy, use the token
      if (token?.userId) {
        session.user.id = token.userId;
      }
      // For database strategy, use the user
      else if (user?.id) {
        session.user.id = user.id;
      }
      return session;
    },

    async signIn({ user, account, profile, email, credentials }) {
      // Check if user has an email (safety check)
      if (!user.email) {
        return false;
      }

      console.log(`Sign-in attempt from: ${user.email} via ${account?.provider || credentials ? 'credentials' : 'email'}`);

      // If using credentials provider, we've already verified the email is allowed in the authorize function
      if (credentials) {
        return true;
      }

      // For other providers, always check if the email is allowed first
      const allowed = await isEmailAllowed(user.email);

      if (!allowed) {
        // For Google provider, handle new user notification
        if (account?.provider === 'google') {
          // First check if the user already exists
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email },
            include: { accounts: true }
          });

          // If user exists but doesn't have a Google account -> block sign-in (prevent linking)
          if (existingUser && existingUser.accounts.length > 0 &&
              !existingUser.accounts.some(acc => acc.provider === 'google')) {
            console.log(`Account conflict for: ${user.email} - already has non-Google account`);
            return `/auth/error?error=OAuthAccountNotLinked`;
          }

          // If it's a new user, notify admin
          if (!existingUser) {
            console.log(`New Google user, sending notification: ${user.email}`);
            try {
              await notifyAdmin(user.email, user.name || profile?.name || 'N/A'); // Use profile name if available
              console.log(`Admin notification sent for: ${user.email}`);
            } catch (error) {
              console.error(`Failed to notify admin for: ${user.email}`, error);
              // Optionally, you might want to handle this error more gracefully
            }
          }
        } else {
          console.log(`Unauthorized email sign-in attempt: ${user.email}`);
        }
        return `/auth/error?error=PendingGoogleAuth`; // Consistent redirect for unauthorized access
      }

      // If we get here, the email is allowed, so allow the sign-in
      return true;
    },

    async redirect({ url, baseUrl }) {
      // Secure redirect logic
      if (url.startsWith('/') || url.startsWith(baseUrl)) {
        return url;
      }
      return baseUrl;
    }
  },

  // Use JWT for faster authentication and less database queries
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  // Enable CSRF protection
  secret: process.env.NEXTAUTH_SECRET || "your-secret-key-change-in-production",
  // Debug mode based on environment
  debug: process.env.NODE_ENV === 'development',
};

// Helper function to create test transport for development
async function createTestTransport() {
  const testAccount = await nodemailer.createTestAccount();
  return nodemailer.createTransport({
    host: testAccount.smtp.host,
    port: testAccount.smtp.port,
    secure: testAccount.smtp.secure,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
}

// Function to notify admin directly without using fetch
async function notifyAdmin(email, name) {
  try {
    console.log(`Starting admin notification process for: ${email}`);

    // Store pending request
    await prisma.pendingUserRequest.upsert({
      where: { email },
      update: { name },
      create: { email, name },
    });
    console.log(`Pending user request created for: ${email}`);

    // Create token for access granting
    const crypto = require('crypto');
    const hmac = crypto.createHmac('sha256', process.env.NEXTAUTH_SECRET);
    hmac.update(email);
    const token = hmac.digest('hex');

    const grantLink = `${process.env.NEXTAUTH_URL}/api/admin/grant-access?email=${encodeURIComponent(email)}&token=${token}`;
    console.log(`Grant link generated for: ${email}`);

    // Set up email transport
    const transport = process.env.NODE_ENV === 'production'
      ? nodemailer.createTransport({
          host: process.env.EMAIL_SERVER_HOST,
          port: process.env.EMAIL_SERVER_PORT,
          secure: process.env.EMAIL_SERVER_SECURE === 'true',
          auth: {
            user: process.env.EMAIL_SERVER_USER,
            pass: process.env.EMAIL_SERVER_PASSWORD,
          },
        })
      : await createTestTransport();

    console.log(`Email transport created for: ${email}`);

    // Send notification email
    const info = await transport.sendMail({
      from: '"Doggie-oasis Access Request" <no-reply@doggie-oasis.com>',
      to: process.env.EMAIL_SERVER_USER,
      subject: 'User Requested Access',
      html: `
        <h2>New User Request</h2>
        <ul>
          <li><strong>Email:</strong> ${email}</li>
          <li><strong>Name:</strong> ${name || 'N/A'}</li>
          <li><strong>Provider:</strong> Google</li>
          <li><strong>Time:</strong> ${new Date().toLocaleString()}</li>
        </ul>
        <p><a href="${grantLink}" style="display:inline-block;padding:10px 20px;background:#28a745;color:white;text-decoration:none;border-radius:5px;">Grant Access</a></p>
      `,
    });

    // Log email preview URL in development
    if (process.env.NODE_ENV !== 'production' && nodemailer.getTestMessageUrl) {
      console.log(`Admin notification email for ${email} sent!`);
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    } else {
      console.log(`Admin notification email for ${email} sent to ${process.env.EMAIL_SERVER_USER}`);
    }

    return true;
  } catch (error) {
    console.error(`Admin notification error for ${email}:`, error);
    throw error;
  }
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };