"use client";

import { useAuth } from "@/src/contexts/AuthContext";
import { ProtectedRoute } from "../../components/ProtectedRoute";
import { useState } from "react";
import { ApiClientError } from "@/src/lib/api";

export default function DashboardPage() {
  const { logout } = useAuth();
  const [error, setError] = useState<string | null>(null);

  async function handleLogout() {
    try {
      await logout();
    } catch (error) {
      if (error instanceof ApiClientError) {
        setError(error.message);
      } else {
        setError("Đã có lỗi xảy ra");
      }
    }
  }
  return (

    <ProtectedRoute>
      <main style={{ padding: 40 }}>
        <h1>Dashboard</h1>
        <p>Trang này chỉ hiện khi đã đăng nhập.</p>
        <button onClick={handleLogout}>Logout</button>
      </main>
    </ProtectedRoute>
  );
}