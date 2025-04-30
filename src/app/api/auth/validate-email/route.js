import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const allowed = await prisma.allowedEmail.findUnique({
      where: { email: email.toLowerCase() },
    });

    return NextResponse.json({ allowed: !!allowed });
  } catch (error) {
    console.error("Error validating email:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}