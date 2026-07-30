import { Router } from "express";
import bcrypt from "bcrypt";
import { loginSchema, registerSchema } from "../schemas/auth.schema";
import { ApiError } from "../utils/ApiError";
import { prisma } from "../lib/prisma";
import { signToken } from "../utils/jwt";
import { success } from "zod";
import { AuthRequest, requireAuth } from "../middleware/requireAuth";


const router = Router();

const COOKIE_NAME = "token";
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

router.post("/register", async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);

  if (!parsed.success) {
    throw new ApiError(400, "VALIDATION_ERROR", parsed.error.errors[0].message);
  }
  const { email, password, name } = parsed.data;

  const existingUser = await prisma.user.findUnique({ where: { email }});
  if (existingUser) {
    throw new ApiError(409, "EMAIL_TAKEN", "Email đã được sử dụng");
  }

  const passwordHash = await bcrypt.hash(password, 10);
  
  const user = await prisma.user.create({
    data: { email, passwordHash, name }
  });

  const token = signToken({ userId: user.id});
  
  res.cookie(COOKIE_NAME, token, COOKIE_OPTIONS);

  res.status(201).json({
    user: { id: user.id, email: user.email, name: user.name}
  });
});

router.post("/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new ApiError(400, "VALIDATION_ERROR", parsed.error.errors[0].message);
  }

  const { email, password } = parsed.data;
  const user = await prisma.user.findUnique({ where: { email }});
  if (!user) {
    throw new ApiError(401, "INVALID_CREDENTIALS", "Email hoặc mật khẩu không đúng");
  }
  
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    throw new ApiError(401, "INVALID_CREDENTIALS", "Email hoặc mật khẩu không đúng");
  }

  const token = signToken({ userId: user.id});
  res.cookie(COOKIE_NAME, token, COOKIE_OPTIONS);

  res.json({
    user: { id: user.id, email: user.email, name: user.name }
  });
});

router.post("/logout", (req, res) => {
  res.clearCookie(COOKIE_NAME);
  res.json({ success: true });
});

router.get("/me", requireAuth, async (req: AuthRequest, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.userId },
    select: { id: true, email: true, name: true, createdAt: true },
  });
  if (!user) {
    throw new ApiError(404, "USER_NOT_FOUND", "User không tồn tại");
  }

  res.json({ user });
});

export default router;