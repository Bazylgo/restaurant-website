// utils/auth.js
import { PrismaClient } from "../../generated/prisma";

const prisma = new PrismaClient();

async function isEmailAllowed(email) {
  const allowedEmail = await prisma.allowedEmail.findUnique({
    where: { email: email.toLowerCase() },
  });

  return !!allowedEmail;
}

module.exports = { isEmailAllowed };
