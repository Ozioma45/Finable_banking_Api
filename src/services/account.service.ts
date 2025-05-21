import { PrismaClient } from "@prisma/client";
import { generateAccountNumber } from "../utils/generateAccountNum";

const prisma = new PrismaClient();

export const createNewAccount = async (data: any) => {
  const { firstName, surname, email, phoneNumber, dateOfBirth } = data;

  // Ensure unique account number
  let accountNumber: string;
  let existing;
  do {
    accountNumber = generateAccountNumber();
    existing = await prisma.account.findUnique({ where: { accountNumber } });
  } while (existing);

  const account = await prisma.account.create({
    data: {
      firstName,
      surname,
      email,
      phoneNumber,
      dateOfBirth,
      accountNumber,
    },
  });

  return account;
};
