"use client";

import { useState } from "react";
import { CVItem, JobDescriptionItem, MatchResultItem, runCvMatch, ApiClientError } from "@/src/lib/api";
import { Zap, Sparkles, FileText, Target, AlertCircle, ArrowRight } from "../ui/Icons";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";

interface MatchLauncherProps {
  cvs: CVItem[];
  jds: JobDescriptionItem[];
  onMatchComplete: (result: MatchResultItem) => void;
}

export function MatchLauncher({ cvs, jds, onMatchComplete }: MatchLauncherProps) {
  const [selectedCvId, setSelectedCvId] = useState<string>(cvs[0]?.id || "");
  const [selectedJdId, setSelectedJdId] = useState<string>(jds[0]?.id || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRunMatch = async () => {
    if (!selectedCvId) {
      setError("Vui lòng chọn 1 CV để phân tích");
      return;
    }
    if (!selectedJdId) {
      setError("Vui lòng chọn 1 Job Description để đối chiếu");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const res = await runCvMatch(selectedCvId, selectedJdId);
      onMatchComplete(res.matchResult);
    } catch (err: any) {
      if (err instanceof ApiClientError) {
        setError(err.message);
      } else {
        setError("Quá trình phân tích gặp sự cố. Vui lòng thử lại sau giây lát.");
      }
    } finally {
      setLoading(false);
    }
  };

  const isReady = cvs.length > 0 && jds.length > 0;

  return (
    <Card className="rounded-3xl p-6 sm:p-8 border border-indigo-500/30 glow-indigo relative overflow-hidden space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">
              AI Match Engine (Gemini 2.5 Flash)
            </h3>
            <p className="text-xs text-slate-400">
              So khớp thông minh giữa hồ sơ ứng viên và yêu cầu tuyển dụng
            </p>
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>AI Sẵn sàng</span>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3 text-rose-300 text-sm animate-in fade-in">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-400 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {!isReady ? (
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 text-center space-y-3">
          <p className="text-sm text-slate-300 font-medium">
            Bạn cần có ít nhất <strong>1 CV</strong> và <strong>1 Job Description</strong> để bắt đầu so khớp.
          </p>
          <p className="text-xs text-slate-500">
            {cvs.length === 0 ? "⚠️ Chưa có CV. Hãy tải lên CV ở Bước 1. " : "✓ Đã có CV. "}
            {jds.length === 0 ? "⚠️ Chưa có JD. Hãy dán JD ở Bước 2." : "✓ Đã có JD."}
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Select CV */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-blue-400" />
                <span>1. Chọn CV của bạn</span>
              </label>
              <select
                value={selectedCvId}
                onChange={(e) => setSelectedCvId(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 cursor-pointer"
              >
                {cvs.map((cv) => (
                  <option key={cv.id} value={cv.id}>
                    {cv.fileName} ({new Date(cv.createdAt).toLocaleDateString("vi-VN")})
                  </option>
                ))}
              </select>
            </div>

            {/* Select JD */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-indigo-400" />
                <span>2. Chọn Job Description (JD)</span>
              </label>
              <select
                value={selectedJdId}
                onChange={(e) => setSelectedJdId(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 cursor-pointer"
              >
                {jds.map((jd) => (
                  <option key={jd.id} value={jd.id}>
                    {jd.title || "Vị trí tuyển dụng"}{jd.company ? ` @ ${jd.company}` : ""}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Action Button & Loading */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-400">
              * AI sẽ đối chiếu kỹ năng, kinh nghiệm và tạo báo cáo cải thiện chuẩn ATS.
            </p>

            <Button
              size="lg"
              onClick={handleRunMatch}
              loading={loading}
              disabled={loading || !selectedCvId || !selectedJdId}
              icon={<Zap className="w-4 h-4" />}
              className="w-full sm:w-auto px-8 shadow-xl shadow-indigo-500/30 font-bold"
            >
              {loading ? "Đang chạy AI phân tích (~5-10s)..." : "Bắt đầu so khớp ngay"}
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
