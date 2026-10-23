"use client";

import { useState } from "react";
import { CVItem, deleteCv } from "@/src/lib/api";
import { FileText, Eye, ExternalLink, Trash2, X, CheckCircle2 } from "../ui/Icons";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";

interface CvListProps {
  cvs: CVItem[];
  onDeleteSuccess: (deletedId: string) => void;
}

export function CvList({ cvs, onDeleteSuccess }: CvListProps) {
  const [selectedCv, setSelectedCv] = useState<CVItem | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleDelete = async (id: string, fileName: string) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa file CV "${fileName}"?`)) return;

    setDeletingId(id);
    try {
      await deleteCv(id);
      onDeleteSuccess(id);
    } catch {
      alert("Không thể xóa CV. Vui lòng thử lại.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (cvs.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
          <span>Danh sách CV đã lưu ({cvs.length})</span>
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cvs.map((cv) => (
          <div
            key={cv.id}
            className="glass-card rounded-2xl p-5 flex flex-col justify-between gap-4 border border-slate-800 hover:border-slate-700"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-white truncate max-w-[200px] sm:max-w-[260px]" title={cv.fileName}>
                    {cv.fileName}
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {new Date(cv.createdAt).toLocaleDateString("vi-VN", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>

              <Badge
                variant={
                  cv.status === "READY"
                    ? "success"
                    : cv.status === "PROCESSING"
                    ? "warning"
                    : "error"
                }
                size="sm"
              >
                {cv.status === "READY"
                  ? "Sẵn sàng"
                  : cv.status === "PROCESSING"
                  ? "Đang xử lý"
                  : "Lỗi parse"}
              </Badge>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedCv(cv)}
                  icon={<Eye className="w-3.5 h-3.5" />}
                  className="text-xs py-1 px-2.5"
                >
                  Xem text đã bóc
                </Button>

                {cv.fileUrl && (
                  <a
                    href={cv.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-slate-400 hover:text-indigo-400 transition-colors py-1 px-2"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>File gốc</span>
                  </a>
                )}
              </div>

              <button
                onClick={() => handleDelete(cv.id, cv.fileName)}
                disabled={deletingId === cv.id}
                title="Xóa CV"
                className="text-slate-500 hover:text-rose-400 transition-colors p-1.5 rounded-lg hover:bg-rose-500/10 cursor-pointer disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Raw Text Viewer Modal */}
      {selectedCv && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="glass-card bg-slate-900 border border-slate-700/80 rounded-3xl max-w-2xl w-full max-h-[80vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-400" />
                  <span>Nội dung Text bóc tách ({selectedCv.fileName})</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Độ dài: {selectedCv.rawText.length} ký tự (~{selectedCv.rawText.split(/\s+/).length} từ)
                </p>
              </div>

              <button
                onClick={() => setSelectedCv(null)}
                className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1 font-mono text-xs text-slate-300 leading-relaxed whitespace-pre-wrap bg-slate-950/60 rounded-xl m-4 border border-slate-800 select-text">
              {selectedCv.rawText}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-800 flex items-center justify-between bg-slate-900/80">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCopyText(selectedCv.rawText)}
                icon={copied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : undefined}
              >
                {copied ? "Đã copy vào clipboard!" : "Copy toàn bộ text"}
              </Button>

              <Button
                variant="secondary"
                size="sm"
                onClick={() => setSelectedCv(null)}
              >
                Đóng
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
