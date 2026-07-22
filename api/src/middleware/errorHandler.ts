import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      error: err.message,
      code: err.code,
    });
  }

  // Lỗi không lường trước - log đầy đủ ở server, nhưng không lộ chi tiết cho client
  console.error("Unhandled error:", err);
  return res.status(500).json({
    error: "Đã có lỗi xảy ra, vui lòng thử lại sau",
    code: "INTERNAL_ERROR",
  });
}