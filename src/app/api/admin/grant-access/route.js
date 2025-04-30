import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import crypto from 'crypto';

function isValidToken(email, token) {
  const hmac = crypto.createHmac('sha256', process.env.NEXTAUTH_SECRET);
  hmac.update(email);
  const validToken = hmac.digest('hex');
  return token === validToken;
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');
  const token = searchParams.get('token');

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  if (!isValidToken(email, token)) {
    return new NextResponse('❌ Invalid or expired access token.', { status: 401 });
  }

  try {
    // Get from pending requests
    const pending = await prisma.pendingUserRequest.findUnique({
      where: { email },
    });

    if (!pending) {
      return NextResponse.json({ error: 'No pending request found' }, { status: 404 });
    }

    // Add to allowed emails
    await prisma.allowedEmail.create({
      data: {
        email: pending.email,
        name: pending.name,
      },
    });

    // Remove from pending
    await prisma.pendingUserRequest.delete({ where: { email } });

    return new NextResponse(`
      <html>
        <body style="font-family: sans-serif; text-align: center; padding: 40px;">
          <h2>Access Granted!</h2>
          <p>${email} has been added to the allowed list. Please try signing in again :) </p>
        </body>
      </html>
    `, { headers: { "Content-Type": "text/html" } });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
