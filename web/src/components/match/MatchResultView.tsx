"use client";

import { useState } from "react";
import { MatchResultItem } from "@/src/lib/api";
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  FileText,
  Target,
  ArrowRight,
} from "../ui/Icons";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";

interface MatchResultViewProps {
  result: MatchResultItem;
  onBack?: () => void;
}

export function MatchResultView({ result, onBack }: MatchResultViewProps) {
  const [copied, setCopied] = useState(false);

  const score = result.overallScore;

  // Determine score color
  const getScoreColor = (s: number) => {
    if (s >= 80) return "text-emerald-400 stroke-emerald-400";
    if (s >= 60) return "text-indigo-400 stroke-indigo-400";
    if (s >= 40) return "text-amber-400 stroke-amber-400";
    return "text-rose-400 stroke-rose-400";
  };

  const getScoreVerdict = (s: number) => {
    if (s >= 85) return { label: "Xuất sắc • Cơ hội phỏng vấn rất cao", variant: "success" as const };
    if (s >= 70) return { label: "Tương đối tốt • Chuẩn bị phỏng vấn", variant: "info" as const };
    if (s >= 50) return { label: "Tiềm năng • Cần bổ sung từ khóa", variant: "warning" as const };
    return { label: "Khoảng cách lớn • Cần chỉnh sửa nhiều", variant: "error" as const };
  };

  const verdict = getScoreVerdict(score);

  // SVG Circular Gauge calculation
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const handleCopyRecommendations = () => {
    const text = result.recommendations.map((r, i) => `${i + 1}. ${r}`).join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header bar with Back button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-semibold mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Kết quả phân tích AI</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Báo cáo So khớp Hồ sơ & Yêu cầu Công việc
          </h2>
        </div>

        {onBack && (
          <Button variant="outline" size="sm" onClick={onBack}>
            ← Quay lại chọn CV khác
          </Button>
        )}
      </div>

      {/* Target & Candidate Summary Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Score Radial Gauge Card */}
        <Card className="flex flex-col items-center justify-center text-center p-6 glow-indigo md:col-span-1">
          <div className="relative w-36 h-36 flex items-center justify-center my-2">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r={radius}
                className="stroke-slate-800"
                strokeWidth="10"
                fill="transparent"
              />
              <circle
                cx="60"
                cy="60"
                r={radius}
                className={`${getScoreColor(score)} transition-all duration-1000 ease-out`}
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className={`text-4xl font-black ${getScoreColor(score).split(" ")[0]}`}>
                {score}%
              </span>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                Match Score
              </span>
            </div>
          </div>

          <Badge variant={verdict.variant} size="md" className="mt-2">
            {verdict.label}
          </Badge>
        </Card>

        {/* Comparison Context Card */}
        <Card className="p-6 md:col-span-2 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-slate-800">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                    CV Ứng viên
                  </p>
                  <p className="text-sm font-bold text-white truncate" title={result.cv?.fileName}>
                    {result.cv?.fileName || "Bản CV đã chọn"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0">
                  <Target className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                    Vị trí ứng tuyển
                  </p>
                  <p className="text-sm font-bold text-white truncate">
                    {result.jobDescription?.title || "Vị trí tuyển dụng"}
                    {result.jobDescription?.company ? ` @ ${result.jobDescription.company}` : ""}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <p className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>Đánh giá tổng quan từ AI:</span>
              </p>
              <p className="text-sm text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
                {result.summary}
              </p>
            </div>
          </div>

          <div className="text-xs text-slate-500 text-right">
            Phân tích lúc: {new Date(result.createdAt).toLocaleDateString("vi-VN", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </Card>
      </div>

      {/* 2 Column Skills Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Matched Skills */}
        <Card className="p-6 space-y-4 border-emerald-500/20">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Kỹ năng đáp ứng tốt ({result.matchedSkills.length})</span>
            </h3>
            <span className="text-[11px] text-emerald-400 font-medium">✓ Điểm cộng lớn</span>
          </div>

          <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
            {result.matchedSkills.map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-950/60 border border-emerald-500/15 space-y-1"
              >
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span className="text-xs font-bold text-emerald-300">
                    {item.skill}
                  </span>
                </div>
                {item.evidence && (
                  <p className="text-xs text-slate-400 pl-3.5 leading-relaxed">
                    {item.evidence}
                  </p>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Missing Skills */}
        <Card className="p-6 space-y-4 border-amber-500/20">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-amber-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400" />
              <span>Kỹ năng còn thiếu hoặc chưa làm rõ ({result.missingSkills.length})</span>
            </h3>
            <span className="text-[11px] text-amber-400 font-medium">! Cần bổ sung</span>
          </div>

          <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
            {result.missingSkills.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">
                Không phát hiện thiếu sót lớn nào! CV của bạn bao phủ hầu hết yêu cầu.
              </p>
            ) : (
              result.missingSkills.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-white">
                      {item.skill}
                    </span>
                    <Badge
                      variant={
                        item.importance === "HIGH"
                          ? "error"
                          : item.importance === "MEDIUM"
                          ? "warning"
                          : "neutral"
                      }
                      size="sm"
                    >
                      {item.importance === "HIGH"
                        ? "Ưu tiên cao"
                        : item.importance === "MEDIUM"
                        ? "Quan trọng"
                        : "Khuyến khích"}
                    </Badge>
                  </div>
                  {item.reason && (
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {item.reason}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      {/* Actionable Recommendations Card */}
      <Card className="p-6 sm:p-8 space-y-5 bg-gradient-to-r from-indigo-950/40 via-purple-950/20 to-slate-950/40 border border-indigo-500/30">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Đề xuất cải thiện CV chuẩn ATS
              </h3>
              <p className="text-xs text-slate-400">
                Các bước hành động cụ thể để nâng cao tỷ lệ đậu phỏng vấn
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyRecommendations}
            className="text-xs"
          >
            {copied ? "✓ Đã sao chép gợi ý!" : "Sao chép toàn bộ gợi ý"}
          </Button>
        </div>

        <div className="space-y-3 pt-2">
          {result.recommendations.map((tip, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-900/80 border border-slate-700/60"
            >
              <div className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                {idx + 1}
              </div>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                {tip}
              </p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
