import { Request, Response } from "express";
import {
  createNewAccount,
  getAllAccountsWithDecryption,
  decryptClientPayload,
} from "../services/account.service";

export const createAccount = async (req: Request, res: Response) => {
  try {
    const data = await createNewAccount(req.body);
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to create account" });
  }
};

export const getAllAccounts = async (req: Request, res: Response) => {
  const result = await getAllAccountsWithDecryption();
  res.status(200).json(result);
};

export const decryptFromClientData = async (req: Request, res: Response) => {
  const decrypted = decryptClientPayload(req.body);
  res.status(200).json({ decrypted });
};
