import { Request, Response } from "express";
import { createNewAccount } from "../services/account.service";

export const createAccount = async (req: Request, res: Response) => {
  try {
    const data = await createNewAccount(req.body);
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to create account" });
  }
};
