import { z } from "zod";

export const matchRequestSchema = z.object({
  cvId: z.string({
    error: "cvId là bắt buộc",
  }).min(1, "Vui lòng chọn CV để so khớp"),
  jdId: z.string({
    error: "jdId là bắt buộc",
  }).min(1, "Vui lòng chọn Job Description để so khớp"),
});

export type MatchRequestInput = z.infer<typeof matchRequestSchema>;
