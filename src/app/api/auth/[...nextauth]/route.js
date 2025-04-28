import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "../../../../generated/prisma";
import nodemailer from "nodemailer";
import { isEmailAllowed } from "../../../utils/auth"; // Import the utility function

const prisma = new PrismaClient();

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    EmailProvider({
      async sendVerificationRequest({ identifier: email, url, provider }) {
        // Check if the email is in the allowed list before sending the email
        const allowed = await isEmailAllowed(email); // Use the database check
        if (!allowed) {
          console.log(`Unauthorized email attempt blocked: ${email}`);

          return;
        }

        // Create a test account for development (this is what you had originally)
        const testAccount = await nodemailer.createTestAccount();

        // Create a transporter with the test account
        const transport = nodemailer.createTransport({
          host: testAccount.smtp.host,
          port: testAccount.smtp.port,
          secure: testAccount.smtp.secure,
          auth: {
            user: testAccount.user,
            pass: testAccount.pass,
          },
        });

        // Send the email with your existing template
        const info = await transport.sendMail({
          from: '"RestoVibe" <noreply@restovibe.com>',
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

        // Log the URL where you can preview the email (this is important for testing)
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
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
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },

    async signIn({ user, account, profile, email, credentials }) {
      // Check if user has an email (safety check)
      if (!user.email) {
        return false;
      }

      //  Check if the email is allowed
      const allowed = await isEmailAllowed(user.email);
      if (!allowed) {
        console.log(`Unauthorized sign-in attempt: ${user.email}`);
        return `/auth/error?error=UnauthorizedEmail`;
      }

      // For Google authentication - prevent provider conflicts
      if (account?.provider === 'google') {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
          include: { accounts: true }
        });

        // If user exists but doesn't have a Google account -> block sign-in
        if (existingUser && existingUser.accounts.length > 0 &&
            !existingUser.accounts.some(acc => acc.provider === 'google')) {
          return `/auth/error?error=OAuthAccountNotLinked`;
        }
      }

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
  // Add stronger session security
  session: {
    strategy: "database",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  // Enable CSRF protection
  secret: process.env.NEXTAUTH_SECRET || "your-secret-key-change-in-production",
  // Debug mode based on environment
  debug: process.env.NODE_ENV === 'development',
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };