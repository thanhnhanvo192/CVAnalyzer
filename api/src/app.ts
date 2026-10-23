import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { errorHandler } from "./middleware/errorHandler";
import { prisma } from "./lib/prisma";
import { ApiError } from "./utils/ApiError";
import authRoutes from "./routes/auth.routes";
import cvRoutes from "./routes/cv.routes";
import cookieParser from "cookie-parser";
import path from "path";

const app = express();

// Security headers
app.use(helmet({
  crossOriginResourcePolicy: false, // Allows cross-origin for static files like uploaded CVs
}));

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

// Serve uploaded CV files locally when Cloudinary is not used
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

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

// auth routes
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/cv", cvRoutes);

// Error handler LUÔN đặt sau cùng, sau tất cả Routes
app.use(errorHandler);

export default app;