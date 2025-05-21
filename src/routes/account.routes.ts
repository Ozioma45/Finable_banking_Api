import express from "express";
import { createAccount } from "../controllers/account.controller";

const router = express.Router();
router.post("/accounts", createAccount);

export default router;
