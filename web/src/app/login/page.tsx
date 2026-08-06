"use client";

import { useAuth } from "@/src/contexts/AuthContext";
import { ApiClientError } from "@/src/lib/api";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await login(email, password);
      router.push("/dashboard");
    } catch (error) {
      if (error instanceof ApiClientError) {
        setError(error.message);
      } else {
        setError("Đã có lỗi xảy ra");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main style={{ maxWidth: 400, margin: "60px auto"}}>
      <h1>Đăng nhập</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button type="submit" disabled={submitting}>
          {submitting ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>
      </form>
    </main>
  )
}