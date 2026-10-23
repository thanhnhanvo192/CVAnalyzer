import { Router } from "express";
import multer from "multer";
import { AuthRequest, requireAuth } from "../middleware/requireAuth";
import { prisma } from "../lib/prisma";
import { ApiError } from "../utils/ApiError";
import { parseCvDocument } from "../services/parser.service";
import { uploadCvFile } from "../services/cloudinary.service";

const router = Router();

// Multer memory storage (keeps file buffer in RAM for processing)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword",
    ];

    if (
      allowedMimes.includes(file.mimetype) ||
      file.originalname.match(/\.(pdf|docx|doc)$/i)
    ) {
      cb(null, true);
    } else {
      cb(
        new ApiError(
          400,
          "INVALID_FILE_TYPE",
          "Chỉ chấp nhận file định dạng .pdf hoặc .docx"
        )
      );
    }
  },
});

/**
 * POST /api/cv
 * Upload and parse a new CV
 */
router.post(
  "/",
  requireAuth,
  upload.single("file"),
  async (req: AuthRequest, res) => {
    if (!req.file) {
      throw new ApiError(400, "FILE_REQUIRED", "Vui lòng chọn file CV để tải lên");
    }

    const userId = req.userId!;
    const { originalname, buffer, mimetype } = req.file;

    // 1. Extract text from the file
    let rawText = "";
    try {
      rawText = await parseCvDocument(buffer, originalname, mimetype);
    } catch (parseError: any) {
      // Record failed parse in database if desired or return error
      throw parseError;
    }

    // 2. Upload file to Cloudinary (or local storage fallback)
    let fileUrl = "";
    try {
      fileUrl = await uploadCvFile(buffer, originalname);
    } catch (uploadError: any) {
      throw new ApiError(
        500,
        "STORAGE_ERROR",
        `Lỗi khi lưu trữ file CV: ${uploadError.message}`
      );
    }

    // 3. Save CV into database
    const cv = await prisma.cV.create({
      data: {
        userId,
        fileName: originalname,
        fileUrl,
        rawText,
        status: "READY",
      },
    });

    res.status(201).json({
      message: "Tải lên và xử lý CV thành công",
      cv: {
        id: cv.id,
        fileName: cv.fileName,
        fileUrl: cv.fileUrl,
        rawText: cv.rawText,
        status: cv.status,
        createdAt: cv.createdAt,
      },
    });
  }
);

/**
 * GET /api/cv
 * List all CVs for the authenticated user
 */
router.get("/", requireAuth, async (req: AuthRequest, res) => {
  const userId = req.userId!;

  const cvs = await prisma.cV.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      fileName: true,
      fileUrl: true,
      rawText: true,
      status: true,
      errorMessage: true,
      createdAt: true,
    },
  });

  res.json({ cvs });
});

/**
 * GET /api/cv/:id
 * Retrieve a specific CV by ID
 */
router.get("/:id", requireAuth, async (req: AuthRequest, res) => {
  const userId = req.userId!;
  const id = String(req.params.id);

  const cv = await prisma.cV.findFirst({
    where: { id, userId },
  });

  if (!cv) {
    throw new ApiError(404, "CV_NOT_FOUND", "Không tìm thấy CV");
  }

  res.json({ cv });
});

/**
 * DELETE /api/cv/:id
 * Delete a CV
 */
router.delete("/:id", requireAuth, async (req: AuthRequest, res) => {
  const userId = req.userId!;
  const id = String(req.params.id);

  const cv = await prisma.cV.findFirst({
    where: { id, userId },
  });

  if (!cv) {
    throw new ApiError(404, "CV_NOT_FOUND", "Không tìm thấy CV để xóa");
  }

  await prisma.cV.delete({
    where: { id },
  });

  res.json({ success: true, message: "Đã xóa CV thành công" });
});

export default router;
