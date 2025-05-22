import { PrismaClient } from "@prisma/client";
import { encrypt, decrypt } from "../utils/encryption";
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

  const encryptedPhone = encrypt(phoneNumber);
  const encryptedDob = encrypt(dateOfBirth);

  const account = await prisma.account.create({
    data: {
      firstName,
      surname,
      email,
      phoneNumber: JSON.stringify(encryptedPhone),
      dateOfBirth: JSON.stringify(encryptedDob),
      accountNumber,
    },
  });

  // Create a virtual card for the account
  let cardNumber;
  do {
    cardNumber = generateCardNumber();
    existing = await prisma.card.findUnique({ where: { cardNumber } });
  } while (existing);

  const encryptedCardNumber = encrypt(cardNumber);
  const encryptedCVV = encrypt(generateCVV());
  const encryptedExpiry = encrypt(getExpiryDate());

  const card = await prisma.card.create({
    data: {
      cardNumber: JSON.stringify(encryptedCardNumber),
      cvv: JSON.stringify(encryptedCVV),
      expiryDate: JSON.stringify(encryptedExpiry),
      accountId: account.id,
    },
  });

  return {
    account: {
      ...account,
      phoneNumber: {
        encrypted: encryptedPhone,
        decrypted: decrypt(encryptedPhone),
      },
      dateOfBirth: {
        encrypted: encryptedDob,
        decrypted: decrypt(encryptedDob),
      },
    },
    virtualCard: {
      ...card,
      cardNumber: {
        encrypted: encryptedCardNumber,
        decrypted: decrypt(encryptedCardNumber),
      },
      cvv: {
        encrypted: encryptedCVV,
        decrypted: decrypt(encryptedCVV),
      },
      expiryDate: {
        encrypted: encryptedExpiry,
        decrypted: decrypt(encryptedExpiry),
      },
    },
  };
};

export const getAllAccountsWithDecryption = async () => {
  const accounts = await prisma.account.findMany();

  return accounts
    .map((acc) => {
      try {
        const encryptedPhone = JSON.parse(acc.phoneNumber as string);
        const encryptedDob = JSON.parse(acc.dateOfBirth as string);

        return {
          accountNumber: acc.accountNumber,
          fullName: `${acc.firstName} ${acc.surname}`,
          phoneNumber: {
            encrypted: encryptedPhone,
            decrypted: decrypt(encryptedPhone),
          },
          dateOfBirth: {
            encrypted: encryptedDob,
            decrypted: decrypt(encryptedDob),
          },
        };
      } catch (err) {
        console.error(
          `Skipping invalid entry for account ${acc.accountNumber}`,
          err
        );
        return null; // or filter later
      }
    })
    .filter(Boolean);
};

// Utility to decrypt data sent from client
type EncryptedField = { iv: string; content: string };
type DecryptionInput = Partial<Record<string, EncryptedField>>;

export const decryptClientPayload = (payload: DecryptionInput) => {
  const decrypted: Record<string, string> = {};
  for (const key in payload) {
    const encrypted = payload[key];
    if (encrypted) {
      decrypted[key] = decrypt(encrypted);
    }
  }
  return decrypted;
};
