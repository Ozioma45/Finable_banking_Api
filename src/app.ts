import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import accountRoutes from "./routes/account.routes";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api", accountRoutes);

// Health check route
app.get("/", (_req, res) => {
  res.send("API is working 🚀");
});

export default app;
