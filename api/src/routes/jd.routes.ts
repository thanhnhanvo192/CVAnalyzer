import { Router } from "express";
import { AuthRequest, requireAuth } from "../middleware/requireAuth";
import { prisma } from "../lib/prisma";
import { ApiError } from "../utils/ApiError";
import { createJdSchema } from "../schemas/jd.schema";

const router = Router();

/**
 * POST /api/job-descriptions
 * Create and save a new Job Description
 */
router.post("/", requireAuth, async (req: AuthRequest, res) => {
  const parsed = createJdSchema.safeParse(req.body);

  if (!parsed.success) {
    throw new ApiError(400, "VALIDATION_ERROR", parsed.error.issues[0].message);
  }

  const userId = req.userId!;
  let { title, company, rawText } = parsed.data;

  // Auto infer title if not provided
  if (!title) {
    const firstLine = rawText.split("\n").find((l) => l.trim().length > 0) || "";
    title = firstLine.trim().slice(0, 80) || "Vị trí tuyển dụng";
  }

  const jobDescription = await prisma.jobDescription.create({
    data: {
      userId,
      title,
      company: company || null,
      rawText,
    },
  });

  res.status(201).json({
    message: "Lưu Job Description thành công",
    jobDescription: {
      id: jobDescription.id,
      title: jobDescription.title,
      company: jobDescription.company,
      rawText: jobDescription.rawText,
      createdAt: jobDescription.createdAt,
    },
  });
});

/**
 * GET /api/job-descriptions
 * List all Job Descriptions for the authenticated user
 */
router.get("/", requireAuth, async (req: AuthRequest, res) => {
  const userId = req.userId!;

  const jobDescriptions = await prisma.jobDescription.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      company: true,
      rawText: true,
      createdAt: true,
    },
  });

  res.json({ jobDescriptions });
});

/**
 * GET /api/job-descriptions/:id
 * Retrieve a specific Job Description by ID
 */
router.get("/:id", requireAuth, async (req: AuthRequest, res) => {
  const userId = req.userId!;
  const id = String(req.params.id);

  const jobDescription = await prisma.jobDescription.findFirst({
    where: { id, userId },
  });

  if (!jobDescription) {
    throw new ApiError(404, "JD_NOT_FOUND", "Không tìm thấy Job Description");
  }

  res.json({ jobDescription });
});

/**
 * DELETE /api/job-descriptions/:id
 * Delete a Job Description
 */
router.delete("/:id", requireAuth, async (req: AuthRequest, res) => {
  const userId = req.userId!;
  const id = String(req.params.id);

  const jobDescription = await prisma.jobDescription.findFirst({
    where: { id, userId },
  });

  if (!jobDescription) {
    throw new ApiError(
      404,
      "JD_NOT_FOUND",
      "Không tìm thấy Job Description để xóa"
    );
  }

  await prisma.jobDescription.delete({
    where: { id },
  });

  res.json({ success: true, message: "Đã xóa Job Description thành công" });
});

export default router;
