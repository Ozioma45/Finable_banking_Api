import express from "express";
import {
  createAccount,
  getAllAccounts,
  decryptFromClientData,
} from "../controllers/account.controller";

const router = express.Router();
router.post("/create", createAccount);
router.get("/accounts", getAllAccounts);
router.post("/decrypt", decryptFromClientData);

export default router;
