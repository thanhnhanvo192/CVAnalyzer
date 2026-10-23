import { z } from "zod";

export const matchResultZodSchema = z.object({
  overallScore: z.number().int().min(0).max(100),
  summary: z.string().min(10),
  matchedSkills: z.array(
    z.object({
      skill: z.string(),
      evidence: z.string().default("Được tìm thấy trong hồ sơ ứng viên"),
    })
  ).default([]),
  missingSkills: z.array(
    z.object({
      skill: z.string(),
      importance: z.enum(["HIGH", "MEDIUM", "LOW"]).default("MEDIUM"),
      reason: z.string().default("Chưa thấy đề cập rõ ràng trong CV"),
    })
  ).default([]),
  recommendations: z.array(z.string()).min(1),
});

export type MatchResultParsed = z.infer<typeof matchResultZodSchema>;
