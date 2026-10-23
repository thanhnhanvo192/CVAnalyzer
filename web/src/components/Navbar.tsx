"use client";

import Link from "next/link";
import { useAuth } from "@/src/contexts/AuthContext";
import { Sparkles, LogOut, User as UserIcon, LayoutDashboard } from "./ui/Icons";
import { Button } from "./ui/Button";

export function Navbar() {
  const { user, logout, loading } = useAuth();

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
              CV Analyzer
            </span>
            <span className="text-[10px] tracking-wider uppercase font-semibold text-indigo-400 -mt-1">
              Smart AI Match
            </span>
          </div>
        </Link>

        {/* Center Nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm text-slate-300 font-medium">
          <Link
            href="/"
            className="hover:text-white transition-colors py-1 hover:border-b-2 hover:border-indigo-500"
          >
            Trang chủ
          </Link>
          <Link
            href="/dashboard"
            className="hover:text-white transition-colors py-1 hover:border-b-2 hover:border-indigo-500"
          >
            Bảng điều khiển
          </Link>
        </nav>

        {/* User / CTA actions */}
        <div className="flex items-center gap-3">
          {loading ? (
            <div className="w-24 h-9 bg-slate-800/60 rounded-xl animate-pulse" />
          ) : user ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/60 text-xs">
                <div className="w-6 h-6 rounded-full bg-indigo-600/30 text-indigo-300 flex items-center justify-center font-bold">
                  {user.name ? user.name[0].toUpperCase() : <UserIcon className="w-3.5 h-3.5" />}
                </div>
                <span className="text-slate-200 font-medium">{user.name || user.email}</span>
              </div>

              <Link href="/dashboard">
                <Button variant="secondary" size="sm" icon={<LayoutDashboard className="w-4 h-4" />}>
                  Dashboard
                </Button>
              </Link>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => logout()}
                title="Đăng xuất"
                icon={<LogOut className="w-4 h-4 text-slate-400 hover:text-rose-400 transition-colors" />}
              >
                <span className="hidden sm:inline">Thoát</span>
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Đăng nhập
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="primary" size="sm">
                  Đăng ký ngay
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
