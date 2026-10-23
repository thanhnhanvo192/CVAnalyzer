"use client";

import { useState } from "react";
import { JobDescriptionItem, deleteJobDescription } from "@/src/lib/api";
import { Target, Briefcase, Eye, Trash2, X, CheckCircle2 } from "../ui/Icons";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";

interface JdListProps {
  jds: JobDescriptionItem[];
  onDeleteSuccess: (deletedId: string) => void;
}

export function JdList({ jds, onDeleteSuccess }: JdListProps) {
  const [selectedJd, setSelectedJd] = useState<JobDescriptionItem | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleDelete = async (id: string, title?: string | null) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa Job Description "${title || "này"}"?`)) return;

    setDeletingId(id);
    try {
      await deleteJobDescription(id);
      onDeleteSuccess(id);
    } catch {
      alert("Không thể xóa Job Description. Vui lòng thử lại.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (jds.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
          <span>Danh sách Job Description đã lưu ({jds.length})</span>
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {jds.map((jd) => (
          <div
            key={jd.id}
            className="glass-card rounded-2xl p-5 flex flex-col justify-between gap-4 border border-slate-800 hover:border-slate-700"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                    <Target className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white leading-snug">
                      {jd.title || "Vị trí tuyển dụng"}
                    </h4>
                    {jd.company && (
                      <p className="text-xs text-indigo-300 font-medium">
                        {jd.company}
                      </p>
                    )}
                  </div>
                </div>

                <Badge variant="neutral" size="sm">
                  {new Date(jd.createdAt).toLocaleDateString("vi-VN", {
                    day: "2-digit",
                    month: "2-digit",
                  })}
                </Badge>
              </div>

              {/* Snippet preview */}
              <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed font-sans">
                {jd.rawText}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedJd(jd)}
                icon={<Eye className="w-3.5 h-3.5" />}
                className="text-xs py-1 px-2.5"
              >
                Xem toàn bộ JD
              </Button>

              <button
                onClick={() => handleDelete(jd.id, jd.title)}
                disabled={deletingId === jd.id}
                title="Xóa JD"
                className="text-slate-500 hover:text-rose-400 transition-colors p-1.5 rounded-lg hover:bg-rose-500/10 cursor-pointer disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* JD Modal */}
      {selectedJd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="glass-card bg-slate-900 border border-slate-700/80 rounded-3xl max-w-2xl w-full max-h-[80vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Target className="w-4 h-4 text-indigo-400" />
                  <span>{selectedJd.title || "Chi tiết Job Description"}</span>
                </h3>
                {selectedJd.company && (
                  <p className="text-xs text-indigo-300 font-medium mt-0.5">
                    Công ty: {selectedJd.company}
                  </p>
                )}
              </div>

              <button
                onClick={() => setSelectedJd(null)}
                className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1 font-sans text-xs text-slate-300 leading-relaxed whitespace-pre-wrap bg-slate-950/60 rounded-xl m-4 border border-slate-800 select-text">
              {selectedJd.rawText}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-800 flex items-center justify-between bg-slate-900/80">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCopyText(selectedJd.rawText)}
                icon={copied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : undefined}
              >
                {copied ? "Đã copy vào clipboard!" : "Copy nội dung JD"}
              </Button>

              <Button
                variant="secondary"
                size="sm"
                onClick={() => setSelectedJd(null)}
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
