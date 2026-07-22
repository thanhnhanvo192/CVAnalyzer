import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { errorHandler } from "./middleware/errorHandler";
import { prisma } from "./lib/prisma";
import { ApiError } from "./utils/ApiError";

const app = express();

// Security headers
app.use(helmet());

// CORS - chỉ cho phép frontend gọi vào, siết lại thay vì mở toàn bộ
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);

// Log mọi request - "dev" format ngắn gọn, có màu, phù hợp cho môi trường dev
app.use(morgan("dev"));

app.use(express.json());

// Routes
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/health/db", async (req, res) => {
  const count = await prisma.user.count();
  res.json({ status: "ok", userCount: count });
});

// route test
app.get("/test-error", () => {
  throw new ApiError(400, "TEST_ERROR", "Đây là lỗi test");
});

// Error handler LUÔN đặt sau cùng, sau tất cả Routes
app.use(errorHandler);

export default app;