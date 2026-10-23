"use client";

import { useState, useRef } from "react";
import { UploadCloud, FileText, CheckCircle2, AlertCircle } from "../ui/Icons";
import { Button } from "../ui/Button";
import { uploadCv, CVItem, ApiClientError } from "@/src/lib/api";

interface DropzoneUploadProps {
  onUploadSuccess: (cv: CVItem) => void;
}

export function DropzoneUpload({ onUploadSuccess }: DropzoneUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await processFile(e.target.files[0]);
    }
  };

  const processFile = async (file: File) => {
    setError(null);
    setSuccessMsg(null);

    // Validate extension
    const validExtensions = [".pdf", ".docx"];
    const ext = "." + file.name.split(".").pop()?.toLowerCase();
    if (!validExtensions.includes(ext)) {
      setError("Chỉ chấp nhận file định dạng PDF (.pdf) hoặc Word (.docx)");
      return;
    }

    // Validate size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError("Kích thước file không được vượt quá 10MB");
      return;
    }

    setUploading(true);

    try {
      const result = await uploadCv(file);
      setSuccessMsg(`Đã tải lên & trích xuất thành công: ${file.name}`);
      onUploadSuccess(result.cv);

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err: any) {
      if (err instanceof ApiClientError) {
        setError(err.message);
      } else {
        setError("Không thể tải lên file. Vui lòng kiểm tra kết nối.");
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full space-y-4">
      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3 text-rose-300 text-sm animate-in fade-in">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-400 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-3 text-emerald-300 text-sm animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400 mt-0.5" />
          <span>{successMsg}</span>
        </div>
      )}

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !uploading && fileInputRef.current?.click()}
        className={`relative rounded-3xl p-8 border-2 border-dashed transition-all duration-300 cursor-pointer text-center flex flex-col items-center justify-center gap-3 ${
          isDragging
            ? "border-indigo-400 bg-indigo-500/10 scale-[1.01]"
            : "border-slate-700/80 hover:border-indigo-500/50 bg-slate-900/40 hover:bg-slate-900/70"
        } ${uploading ? "opacity-75 cursor-not-allowed" : ""}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx"
          onChange={handleFileChange}
          disabled={uploading}
          className="hidden"
        />

        <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shadow-lg shadow-indigo-500/10">
          {uploading ? (
            <svg
              className="animate-spin h-8 w-8 text-indigo-400"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              />
            </svg>
          ) : (
            <UploadCloud className="w-8 h-8" />
          )}
        </div>

        <div>
          <p className="text-base font-semibold text-white">
            {uploading ? "Đang xử lý & trích xuất nội dung CV..." : "Kéo thả file CV vào đây, hoặc click để chọn file"}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Hỗ trợ file PDF hoặc DOCX (tối đa 10MB)
          </p>
        </div>

        <div className="flex items-center gap-2 mt-2">
          <span className="px-2.5 py-1 rounded-md bg-slate-800 border border-slate-700 text-slate-300 text-[11px] font-mono">
            .PDF
          </span>
          <span className="px-2.5 py-1 rounded-md bg-slate-800 border border-slate-700 text-slate-300 text-[11px] font-mono">
            .DOCX
          </span>
        </div>
      </div>
    </div>
  );
}
