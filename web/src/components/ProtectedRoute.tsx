"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";
import { useEffect } from "react";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  if (loading) return <p>Đang tải...</p>
  if (!user) return null;

  return <>{children}</>;
}