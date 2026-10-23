"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuth } from "@/src/contexts/AuthContext";
import { ProtectedRoute } from "../../components/ProtectedRoute";
import {
  Sparkles,
  UploadCloud,
  FileText,
  Target,
  Zap,
  History,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
} from "@/src/components/ui/Icons";
import { Button } from "@/src/components/ui/Button";
import { Card } from "@/src/components/ui/Card";
import { Badge } from "@/src/components/ui/Badge";
import { DropzoneUpload } from "@/src/components/cv/DropzoneUpload";
import { CvList } from "@/src/components/cv/CvList";
import { getCvs, CVItem } from "@/src/lib/api";

export default function DashboardPage() {
  const { user } = useAuth();
  const [cvs, setCvs] = useState<CVItem[]>([]);
  const [loadingCvs, setLoadingCvs] = useState(true);
  const [showUploadBox, setShowUploadBox] = useState(false);

  useEffect(() => {
    async function fetchUserCvs() {
      try {
        const data = await getCvs();
        setCvs(data.cvs || []);
      } catch {
        // If unauthenticated or network error
      } finally {
        setLoadingCvs(false);
      }
    }

    if (user) {
      fetchUserCvs();
    }
  }, [user]);

  const handleUploadSuccess = (newCv: CVItem) => {
    setCvs((prev) => [newCv, ...prev]);
  };

  const handleDeleteSuccess = (deletedId: string) => {
    setCvs((prev) => prev.filter((item) => item.id !== deletedId));
  };

  return (
    <ProtectedRoute>
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
        {/* Welcome Banner */}
        <div className="relative rounded-3xl p-8 bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-purple-900/20 border border-indigo-500/30 overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Career Workspace</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Xin chào, {user?.name || user?.email?.split("@")[0]}! 👋
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Sẵn sàng tối ưu hồ sơ cho đợt ứng tuyển tiếp theo? Tải lên CV của bạn và dán JD mục tiêu để AI bắt đầu so khớp ngay lập tức.
            </p>
          </div>
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <Card className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-white">
                {loadingCvs ? "--" : cvs.length}
              </div>
              <div className="text-xs text-slate-400 font-medium">CV đã lưu trữ</div>
            </div>
          </Card>

          <Card className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-white">0</div>
              <div className="text-xs text-slate-400 font-medium">Job Description đã lưu</div>
            </div>
          </Card>

          <Card className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-white">-- %</div>
              <div className="text-xs text-slate-400 font-medium">Điểm khớp trung bình</div>
            </div>
          </Card>
        </div>

        {/* Action Modules */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white tracking-tight">
            Thao tác nhanh
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1: Upload CV */}
            <div
              onClick={() => setShowUploadBox((v) => !v)}
              className="cursor-pointer"
            >
              <Card
                className={`group relative flex flex-col justify-between h-full transition-all ${
                  showUploadBox
                    ? "border-blue-500 ring-2 ring-blue-500/20 bg-blue-950/20"
                    : "hover:border-blue-500/50"
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                      <UploadCloud className="w-5 h-5" />
                    </div>
                    <Badge variant={showUploadBox ? "info" : "neutral"} size="sm">
                      {showUploadBox ? "Đang mở" : "Bước 1"}
                    </Badge>
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors">
                    Tải lên CV (PDF / DOCX)
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Tải file CV bản mới nhất lên hệ thống để AI tự động bóc tách kỹ năng, kinh nghiệm và dự án.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center text-xs text-blue-400 font-semibold group-hover:translate-x-1 transition-transform">
                  <span>{showUploadBox ? "Ẩn khung tải lên" : "Bắt đầu tải lên"}</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </div>
              </Card>
            </div>

            {/* Step 2: Paste JD */}
            <Card className="group relative flex flex-col justify-between hover:border-indigo-500/50 opacity-90">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                    <Target className="w-5 h-5" />
                  </div>
                  <Badge variant="neutral" size="sm">
                    Bước 2 (Phase 3)
                  </Badge>
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-indigo-400 transition-colors">
                  Dán Job Description
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Dán nội dung yêu cầu công việc mục tiêu để AI xác định từ khóa cốt lõi và tiêu chí đánh giá.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center text-xs text-indigo-400 font-semibold group-hover:translate-x-1 transition-transform">
                <span>Nhập mô tả việc làm</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </Card>

            {/* Step 3: Match */}
            <Card className="group relative flex flex-col justify-between hover:border-purple-500/50 opacity-90">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
                    <Zap className="w-5 h-5" />
                  </div>
                  <Badge variant="neutral" size="sm">
                    Bước 3 (Phase 4)
                  </Badge>
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-purple-400 transition-colors">
                  So khớp & Chấm điểm
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Chạy AI Engine để nhận báo cáo đối chiếu, bảng điểm ATS và danh sách các gợi ý sửa đổi.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center text-xs text-purple-400 font-semibold group-hover:translate-x-1 transition-transform">
                <span>Xem phân tích AI</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </Card>
          </div>
        </div>

        {/* Upload Box (Collapsible or Promoted) */}
        {(showUploadBox || cvs.length === 0) && (
          <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-indigo-400" />
                <span>Khu vực tải lên CV mới</span>
              </h2>
              {cvs.length > 0 && (
                <button
                  onClick={() => setShowUploadBox(false)}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  Thu gọn
                </button>
              )}
            </div>

            <Card className="p-6">
              <DropzoneUpload onUploadSuccess={handleUploadSuccess} />
            </Card>
          </div>
        )}

        {/* User's CVs List */}
        <div className="space-y-4">
          <CvList cvs={cvs} onDeleteSuccess={handleDeleteSuccess} />
        </div>

        {/* Empty State when no CVs */}
        {!loadingCvs && cvs.length === 0 && !showUploadBox && (
          <Card className="text-center py-12 px-4 border-dashed border-slate-800">
            <div className="w-16 h-16 rounded-3xl bg-slate-800/60 text-slate-400 flex items-center justify-center mx-auto mb-4 border border-slate-700/60">
              <History className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-white mb-1">
              Chưa có file CV nào được lưu
            </h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mb-6 leading-relaxed">
              Hãy tải lên bản CV mới nhất của bạn (PDF hoặc DOCX) để hệ thống tự động bóc tách kỹ năng!
            </p>
            <Button
              variant="primary"
              size="md"
              onClick={() => setShowUploadBox(true)}
              icon={<UploadCloud className="w-4 h-4" />}
            >
              Tải lên CV ngay
            </Button>
          </Card>
        )}
      </main>
    </ProtectedRoute>
  );
}