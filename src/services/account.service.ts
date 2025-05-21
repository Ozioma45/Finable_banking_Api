import { PrismaClient } from "@prisma/client";
import { generateAccountNumber } from "../utils/generateAccountNum";
import {
  generateCardNumber,
  generateCVV,
  getExpiryDate,
} from "../utils/generateCardDetails";

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
  // Create a virtual card for the account
  let cardNumber;
  do {
    cardNumber = generateCardNumber();
    existing = await prisma.card.findUnique({ where: { cardNumber } });
  } while (existing);

  const card = await prisma.card.create({
    data: {
      cardNumber,
      cvv: generateCVV(),
      expiryDate: getExpiryDate(),
      accountId: account.id,
    },
  });

  return {
    ...account,
    virtualCard: card,
  };
};
