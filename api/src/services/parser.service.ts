import mammoth from "mammoth";
import path from "path";
import { ApiError } from "../utils/ApiError";

// pdf-parse can be a function or have a PDFParse class depending on version
const pdfModule = require("pdf-parse");

/**
 * Parses and extracts raw text from PDF and DOCX files.
 */
export async function parseCvDocument(
  buffer: Buffer,
  originalName: string,
  mimetype: string
): Promise<string> {
  const ext = path.extname(originalName).toLowerCase();
  let extractedText = "";

  try {
    if (ext === ".pdf" || mimetype === "application/pdf") {
      if (typeof pdfModule === "function") {
        const parsed = await pdfModule(buffer);
        extractedText = parsed.text || "";
      } else if (pdfModule.PDFParse) {
        const parser = new pdfModule.PDFParse({ data: buffer });
        const parsed = await parser.getText();
        extractedText = parsed.text || "";
      } else if (typeof pdfModule.default === "function") {
        const parsed = await pdfModule.default(buffer);
        extractedText = parsed.text || "";
      } else {
        throw new Error("Không thể khởi tạo bộ đọc PDF");
      }
    } else if (
      ext === ".docx" ||
      mimetype ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      const result = await mammoth.extractRawText({ buffer });
      extractedText = result.value || "";
    } else if (ext === ".doc" || mimetype === "application/msword") {
      throw new ApiError(
        400,
        "UNSUPPORTED_FORMAT",
        "Định dạng .doc cũ không được hỗ trợ. Vui lòng lưu file sang định dạng .pdf hoặc .docx"
      );
    } else {
      throw new ApiError(
        400,
        "INVALID_FILE_TYPE",
        "Chỉ hỗ trợ file CV định dạng .pdf hoặc .docx"
      );
    }
  } catch (err: any) {
    if (err instanceof ApiError) throw err;
    throw new ApiError(
      422,
      "PARSE_FAILED",
      `Không thể đọc nội dung file: ${err.message || "File có thể bị mã hóa hoặc lỗi cấu trúc"}`
    );
  }

  // Clean and normalize extracted text
  const cleanedText = extractedText
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/\t/g, " ")
    .replace(/ +/g, " ")
    .replace(/\n\s*\n\s*\n+/g, "\n\n")
    .trim();

  if (!cleanedText || cleanedText.length < 50) {
    throw new ApiError(
      422,
      "EMPTY_CV_CONTENT",
      "Nội dung file CV quá ngắn hoặc chỉ chứa hình ảnh scan không có text. Vui lòng tải file PDF/DOCX có text có thể sao chép được."
    );
  }

  return cleanedText;
}
