import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { prisma } from "./lib/prisma";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "ok" });
}); 

app.get("/health/db", async (req: Request, res: Response) => {
  const count = await prisma.user.count();
  res.json({ status: "ok", userCount: count});
});

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});