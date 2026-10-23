"use client";

import { useState } from "react";
import { MatchResultItem, deleteMatchResult } from "@/src/lib/api";
import {
  History,
  Search,
  FileText,
  Target,
  Eye,
  Trash2,
  ArrowRight,
  Sparkles,
} from "../ui/Icons";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";

interface MatchHistoryViewProps {
  results: MatchResultItem[];
  onSelectResult: (result: MatchResultItem) => void;
  onDeleteSuccess: (deletedId: string) => void;
}

export function MatchHistoryView({
  results,
  onSelectResult,
  onDeleteSuccess,
}: MatchHistoryViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [scoreFilter, setScoreFilter] = useState<"all" | "high" | "med" | "low">("all");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!confirm("Bạn có chắc chắn muốn xóa kết quả phân tích này?")) return;

    setDeletingId(id);
    try {
      await deleteMatchResult(id);
      onDeleteSuccess(id);
    } catch {
      alert("Không thể xóa kết quả. Vui lòng thử lại.");
    } finally {
      setDeletingId(null);
    }
  };

  // Filter logic
  const filtered = results.filter((item) => {
    const term = searchTerm.toLowerCase();
    const titleMatch = item.jobDescription?.title?.toLowerCase().includes(term);
    const companyMatch = item.jobDescription?.company?.toLowerCase().includes(term);
    const cvMatch = item.cv?.fileName.toLowerCase().includes(term);

    const matchesSearch = !searchTerm || titleMatch || companyMatch || cvMatch;

    if (!matchesSearch) return false;

    if (scoreFilter === "high") return item.overallScore >= 80;
    if (scoreFilter === "med") return item.overallScore >= 60 && item.overallScore < 80;
    if (scoreFilter === "low") return item.overallScore < 60;
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <History className="w-5 h-5 text-indigo-400" />
            <span>Lịch sử các lần phân tích ({results.length})</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Xem lại báo cáo đối chiếu, theo dõi sự tiến bộ và tối ưu CV theo thời gian
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo CV, vị trí, công ty..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-white placeholder-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-2 text-xs">
        <span className="text-slate-400 font-medium">Lọc theo điểm:</span>
        {[
          { id: "all", label: "Tất cả" },
          { id: "high", label: "Điểm cao (≥80%)" },
          { id: "med", label: "Tiềm năng (60-79%)" },
          { id: "low", label: "Cần cải thiện (<60%)" },
        ].map((chip) => (
          <button
            key={chip.id}
            onClick={() => setScoreFilter(chip.id as any)}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              scoreFilter === chip.id
                ? "bg-indigo-600 text-white shadow-sm"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* Results Grid */}
      {filtered.length === 0 ? (
        <Card className="text-center py-12 px-4 border-dashed border-slate-800">
          <div className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-white mb-1">
            {results.length === 0
              ? "Chưa có lượt phân tích nào"
              : "Không tìm thấy kết quả phù hợp"}
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {results.length === 0
              ? "Hãy chọn CV và JD trong mục 'So khớp AI' để tạo báo cáo đầu tiên."
              : "Thử thay đổi từ khóa tìm kiếm hoặc bỏ bộ lọc điểm số."}
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectResult(item)}
              className="glass-card rounded-2xl p-5 border border-slate-800 hover:border-indigo-500/50 cursor-pointer transition-all space-y-4 flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">
                    {new Date(item.createdAt).toLocaleDateString("vi-VN", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  <Badge
                    variant={
                      item.overallScore >= 80
                        ? "success"
                        : item.overallScore >= 60
                        ? "info"
                        : "warning"
                    }
                    size="sm"
                  >
                    {item.overallScore}% Match
                  </Badge>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-1">
                    {item.jobDescription?.title || "Vị trí tuyển dụng"}
                  </h4>
                  {item.jobDescription?.company && (
                    <p className="text-xs text-indigo-400 font-medium line-clamp-1 mt-0.5">
                      @{item.jobDescription.company}
                    </p>
                  )}
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-300 truncate">
                    <FileText className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span className="truncate">{item.cv?.fileName || "CV"}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-900">
                    <span className="text-emerald-400">✓ {item.matchedSkills?.length || 0} kỹ năng đạt</span>
                    <span className="text-amber-400">! {item.missingSkills?.length || 0} cần bổ sung</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-indigo-400 font-semibold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                  <span>Xem báo cáo</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>

                <button
                  onClick={(e) => handleDelete(e, item.id)}
                  disabled={deletingId === item.id}
                  title="Xóa kết quả"
                  className="text-slate-500 hover:text-rose-400 transition-colors p-1.5 rounded-lg hover:bg-rose-500/10 cursor-pointer disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
