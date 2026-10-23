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
import { JdInputCard } from "@/src/components/jd/JdInputCard";
import { JdList } from "@/src/components/jd/JdList";
import { getCvs, getJobDescriptions, CVItem, JobDescriptionItem } from "@/src/lib/api";

export default function DashboardPage() {
  const { user } = useAuth();
  const [cvs, setCvs] = useState<CVItem[]>([]);
  const [jds, setJds] = useState<JobDescriptionItem[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // Active view: 'all' | 'cv' | 'jd'
  const [activeTab, setActiveTab] = useState<"overview" | "cv" | "jd">("overview");

  useEffect(() => {
    async function loadWorkspaceData() {
      try {
        const [cvRes, jdRes] = await Promise.all([
          getCvs().catch(() => ({ cvs: [] })),
          getJobDescriptions().catch(() => ({ jobDescriptions: [] })),
        ]);
        setCvs(cvRes.cvs || []);
        setJds(jdRes.jobDescriptions || []);
      } finally {
        setLoadingData(false);
      }
    }

    if (user) {
      loadWorkspaceData();
    }
  }, [user]);

  const handleCvUploadSuccess = (newCv: CVItem) => {
    setCvs((prev) => [newCv, ...prev]);
  };

  const handleCvDeleteSuccess = (deletedId: string) => {
    setCvs((prev) => prev.filter((item) => item.id !== deletedId));
  };

  const handleJdSuccess = (newJd: JobDescriptionItem) => {
    setJds((prev) => [newJd, ...prev]);
  };

  const handleJdDeleteSuccess = (deletedId: string) => {
    setJds((prev) => prev.filter((item) => item.id !== deletedId));
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
              Quản lý hồ sơ CV và các bản mô tả công việc (JD) mục tiêu của bạn. Chuẩn bị so khớp thông minh bằng AI.
            </p>
          </div>
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div onClick={() => setActiveTab("cv")} className="cursor-pointer">
            <Card className="flex items-center gap-4 hover:border-blue-500/60 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-black text-white">
                  {loadingData ? "--" : cvs.length}
                </div>
                <div className="text-xs text-slate-400 font-medium">CV đã lưu trữ</div>
              </div>
            </Card>
          </div>

          <div onClick={() => setActiveTab("jd")} className="cursor-pointer">
            <Card className="flex items-center gap-4 hover:border-indigo-500/60 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <Target className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-black text-white">
                  {loadingData ? "--" : jds.length}
                </div>
                <div className="text-xs text-slate-400 font-medium">Job Description đã lưu</div>
              </div>
            </Card>
          </div>

          <div>
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
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-3 border-b border-slate-800 pb-2">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              activeTab === "overview"
                ? "bg-slate-800 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Tổng quan (Quy trình)
          </button>
          <button
            onClick={() => setActiveTab("cv")}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "cv"
                ? "bg-blue-600/20 text-blue-300 border border-blue-500/30"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Hồ sơ CV ({cvs.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("jd")}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "jd"
                ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/30"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Target className="w-4 h-4" />
            <span>Job Description ({jds.length})</span>
          </button>
        </div>

        {/* Tab 1: Overview Flow */}
        {activeTab === "overview" && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Step Action Cards */}
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white tracking-tight">
                Quy trình chuẩn bị phân tích
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Step 1: Upload CV */}
                <div onClick={() => setActiveTab("cv")} className="cursor-pointer">
                  <Card className="group relative flex flex-col justify-between h-full hover:border-blue-500/50">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                          <UploadCloud className="w-5 h-5" />
                        </div>
                        <Badge variant={cvs.length > 0 ? "success" : "info"} size="sm">
                          {cvs.length > 0 ? `Đã có (${cvs.length})` : "Bước 1"}
                        </Badge>
                      </div>
                      <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors">
                        1. Tải lên CV (PDF / DOCX)
                      </h3>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Tải file CV để hệ thống bóc tách kinh nghiệm, kỹ năng và lưu trữ an toàn.
                      </p>
                    </div>
                    <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center text-xs text-blue-400 font-semibold group-hover:translate-x-1 transition-transform">
                      <span>Quản lý CV</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </div>
                  </Card>
                </div>

                {/* Step 2: Paste JD */}
                <div onClick={() => setActiveTab("jd")} className="cursor-pointer">
                  <Card className="group relative flex flex-col justify-between h-full hover:border-indigo-500/50">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                          <Target className="w-5 h-5" />
                        </div>
                        <Badge variant={jds.length > 0 ? "success" : "info"} size="sm">
                          {jds.length > 0 ? `Đã có (${jds.length})` : "Bước 2"}
                        </Badge>
                      </div>
                      <h3 className="text-base font-bold text-white group-hover:text-indigo-400 transition-colors">
                        2. Nhập Job Description (JD)
                      </h3>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Dán yêu cầu tuyển dụng mục tiêu từ LinkedIn, TopCV, ITviec để đối chiếu.
                      </p>
                    </div>
                    <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center text-xs text-indigo-400 font-semibold group-hover:translate-x-1 transition-transform">
                      <span>Quản lý JD</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </div>
                  </Card>
                </div>

                {/* Step 3: Match */}
                <div>
                  <Card className="group relative flex flex-col justify-between h-full hover:border-purple-500/50">
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
                        3. AI So khớp & Chấm điểm
                      </h3>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Chạy Gemini 2.5 Flash để đối chiếu chi tiết, phát hiện lỗ hổng kỹ năng và gợi ý chỉnh sửa.
                      </p>
                    </div>
                    <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center text-xs text-purple-400 font-semibold">
                      <span>Chuẩn bị trong Phase 4</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </div>
                  </Card>
                </div>
              </div>
            </div>

            {/* Quick Preview of both CV & JD */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-400" />
                    <span>CV gần đây ({cvs.length})</span>
                  </h3>
                  <button
                    onClick={() => setActiveTab("cv")}
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
                  >
                    Xem tất cả & Tải lên
                  </button>
                </div>
                {cvs.length > 0 ? (
                  <CvList cvs={cvs.slice(0, 2)} onDeleteSuccess={handleCvDeleteSuccess} />
                ) : (
                  <Card className="text-center py-8 text-xs text-slate-400">
                    Chưa có CV nào. Bấm vào tab "Hồ sơ CV" để tải lên!
                  </Card>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Target className="w-4 h-4 text-indigo-400" />
                    <span>Job Description gần đây ({jds.length})</span>
                  </h3>
                  <button
                    onClick={() => setActiveTab("jd")}
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
                  >
                    Xem tất cả & Thêm mới
                  </button>
                </div>
                {jds.length > 0 ? (
                  <JdList jds={jds.slice(0, 2)} onDeleteSuccess={handleJdDeleteSuccess} />
                ) : (
                  <Card className="text-center py-8 text-xs text-slate-400">
                    Chưa có JD nào. Bấm vào tab "Job Description" để dán JD!
                  </Card>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: CV Management */}
        {activeTab === "cv" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <Card className="p-6 sm:p-8">
              <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-blue-400" />
                <span>Tải lên CV mới</span>
              </h2>
              <DropzoneUpload onUploadSuccess={handleCvUploadSuccess} />
            </Card>

            <CvList cvs={cvs} onDeleteSuccess={handleCvDeleteSuccess} />
          </div>
        )}

        {/* Tab 3: JD Management */}
        {activeTab === "jd" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <JdInputCard onSuccess={handleJdSuccess} />
            <JdList jds={jds} onDeleteSuccess={handleJdDeleteSuccess} />
          </div>
        )}
      </main>
    </ProtectedRoute>
  );
}