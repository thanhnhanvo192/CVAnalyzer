"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";
import { useEffect } from "react";
import { Sparkles } from "./ui/Icons";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="relative">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white animate-pulse shadow-lg shadow-indigo-500/30">
            <Sparkles className="w-6 h-6 animate-spin" />
          </div>
        </div>
        <p className="text-xs font-medium text-slate-400 tracking-wide uppercase">
          Đang xác thực tài khoản...
        </p>
      </div>
    );
  }

  if (!user) return null;

  return <>{children}</>;
}