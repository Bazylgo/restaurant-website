// utils/auth.js
import prisma from '@/lib/prisma';

async function isEmailAllowed(email) {
  const allowedEmail = await prisma.allowedEmail.findUnique({
    where: { email: email.toLowerCase() },
  });

  return !!allowedEmail;
}

module.exports = { isEmailAllowed };
