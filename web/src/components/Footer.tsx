import React from "react";
import Link from "next/link";
import { Sparkles, ShieldCheck } from "./ui/Icons";

export function Footer() {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950/60 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-200">
                Smart CV Analyzer & Job Match
              </p>
              <p className="text-xs text-slate-400">
                Đồng hành tối ưu hồ sơ ứng tuyển bằng AI tốc độ cao
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs text-slate-400">
            <div className="flex items-center gap-1.5 text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Bảo mật dữ liệu tuyệt đối</span>
            </div>
            <span>•</span>
            <Link href="/" className="hover:text-slate-200 transition-colors">
              Trang chủ
            </Link>
            <Link href="/dashboard" className="hover:text-slate-200 transition-colors">
              Bảng điều khiển
            </Link>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-900 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} CV Analyzer. Xây dựng cho Career Switchers & Developers.
        </div>
      </div>
    </footer>
  );
}
