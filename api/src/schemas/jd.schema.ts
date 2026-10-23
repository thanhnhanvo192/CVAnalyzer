import { z } from "zod";

export const createJdSchema = z.object({
  title: z.string().trim().max(120).optional(),
  company: z.string().trim().max(120).optional(),
  rawText: z
    .string({
      error: "Mô tả công việc (Job Description) là bắt buộc",
    })
    .trim()
    .min(30, "Mô tả công việc quá ngắn (tối thiểu 30 ký tự)")
    .max(30000, "Mô tả công việc quá dài (tối đa 30,000 ký tự)"),
});

export type CreateJdInput = z.infer<typeof createJdSchema>;
