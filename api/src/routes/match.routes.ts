import { Router } from "express";
import { AuthRequest, requireAuth } from "../middleware/requireAuth";
import { prisma } from "../lib/prisma";
import { ApiError } from "../utils/ApiError";
import { matchRequestSchema } from "../schemas/match.schema";
import { getAIProvider } from "../services/ai/ai.factory";

const router = Router();

/**
 * POST /api/match
 * Run AI match between a CV and a Job Description
 */
router.post("/", requireAuth, async (req: AuthRequest, res) => {
  const parsed = matchRequestSchema.safeParse(req.body);

  if (!parsed.success) {
    throw new ApiError(400, "VALIDATION_ERROR", parsed.error.issues[0].message);
  }

  const userId = req.userId!;
  const { cvId, jdId } = parsed.data;

  // 1. Verify CV exists and belongs to user
  const cv = await prisma.cV.findFirst({
    where: { id: cvId, userId },
  });

  if (!cv) {
    throw new ApiError(404, "CV_NOT_FOUND", "Không tìm thấy CV hợp lệ");
  }

  if (cv.status === "FAILED" || !cv.rawText) {
    throw new ApiError(
      400,
      "CV_NOT_READY",
      "File CV này chưa sẵn sàng hoặc không thể bóc tách nội dung"
    );
  }

  // 2. Verify Job Description exists and belongs to user
  const jobDescription = await prisma.jobDescription.findFirst({
    where: { id: jdId, userId },
  });

  if (!jobDescription) {
    throw new ApiError(
      404,
      "JD_NOT_FOUND",
      "Không tìm thấy Job Description hợp lệ"
    );
  }

  // 3. Call AI Provider
  const aiProvider = getAIProvider();
  let analysis;
  try {
    analysis = await aiProvider.matchCvToJob(cv.rawText, jobDescription.rawText);
  } catch (aiError: any) {
    throw new ApiError(
      502,
      "AI_SERVICE_ERROR",
      `Lỗi từ dịch vụ AI: ${aiError.message || "Không thể phân tích hồ sơ"}`
    );
  }

  // 4. Save Match Result to Database
  const matchResult = await prisma.matchResult.create({
    data: {
      userId,
      cvId: cv.id,
      jobDescriptionId: jobDescription.id,
      overallScore: analysis.overallScore,
      summary: analysis.summary,
      matchedSkills: analysis.matchedSkills as any,
      missingSkills: analysis.missingSkills as any,
      recommendations: analysis.recommendations as any,
    },
    include: {
      cv: {
        select: {
          id: true,
          fileName: true,
          fileUrl: true,
        },
      },
      jobDescription: {
        select: {
          id: true,
          title: true,
          company: true,
        },
      },
    },
  });

  res.status(201).json({
    message: "Phân tích và so khớp thành công",
    matchResult,
  });
});

/**
 * GET /api/match
 * List all match results for the current user
 */
router.get("/", requireAuth, async (req: AuthRequest, res) => {
  const userId = req.userId!;

  const matchResults = await prisma.matchResult.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      cv: {
        select: {
          id: true,
          fileName: true,
        },
      },
      jobDescription: {
        select: {
          id: true,
          title: true,
          company: true,
        },
      },
    },
  });

  res.json({ matchResults });
});

/**
 * GET /api/match/:id
 * Retrieve a single match result
 */
router.get("/:id", requireAuth, async (req: AuthRequest, res) => {
  const userId = req.userId!;
  const id = String(req.params.id);

  const matchResult = await prisma.matchResult.findFirst({
    where: { id, userId },
    include: {
      cv: {
        select: {
          id: true,
          fileName: true,
          fileUrl: true,
        },
      },
      jobDescription: {
        select: {
          id: true,
          title: true,
          company: true,
          rawText: true,
        },
      },
    },
  });

  if (!matchResult) {
    throw new ApiError(404, "RESULT_NOT_FOUND", "Không tìm thấy kết quả phân tích");
  }

  res.json({ matchResult });
});

/**
 * DELETE /api/match/:id
 * Delete a match result
 */
router.delete("/:id", requireAuth, async (req: AuthRequest, res) => {
  const userId = req.userId!;
  const id = String(req.params.id);

  const matchResult = await prisma.matchResult.findFirst({
    where: { id, userId },
  });

  if (!matchResult) {
    throw new ApiError(404, "RESULT_NOT_FOUND", "Không tìm thấy kết quả để xóa");
  }

  await prisma.matchResult.delete({
    where: { id },
  });

  res.json({ success: true, message: "Đã xóa kết quả phân tích thành công" });
});

export default router;
