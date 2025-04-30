import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import prisma from '@/lib/prisma';
import crypto from 'crypto';

function generateAccessToken(email) {
  const hmac = crypto.createHmac('sha256', process.env.NEXTAUTH_SECRET);
  hmac.update(email);
  return hmac.digest('hex');
}

export async function POST(req) {
  const { email, name } = await req.json();

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  try {
    // Store pending request
    await prisma.pendingUserRequest.upsert({
      where: { email },
      update: { name },
      create: { email, name },
    });

    // Email link that will call your grant-access API with a token
    const token = generateAccessToken(email);
    const grantLink = `${process.env.NEXTAUTH_URL}/api/admin/grant-access?email=${encodeURIComponent(email)}&token=${token}`;

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER_HOST,
      port: process.env.EMAIL_SERVER_PORT,
      secure: process.env.EMAIL_SERVER_SECURE,
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: '"Doggie-oasis Access Request" <no-reply@doggie-oasis.com>',
      to: process.env.EMAIL_SERVER_USER,
      subject: 'User Requested Access',
      html: `
        <h2>New User Request</h2>
        <ul>
          <li><strong>Email:</strong> ${email}</li>
          <li><strong>Name:</strong> ${name || 'N/A'}</li>
        </ul>
        <p><a href="${grantLink}" style="display:inline-block;padding:10px 20px;background:#28a745;color:white;text-decoration:none;border-radius:5px;">Grant Access</a></p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to save request or send email' }, { status: 500 });
  }
}