"use client";

import { useAuth } from "@/src/contexts/AuthContext";
import { ApiClientError } from "@/src/lib/api";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { FormEvent } from "react";


export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await register(email, password);
      router.push("/dashboard");
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(err.message);
      } else {
        setError("Đã có lỗi xảy ra");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main style={{ maxWidth: 400, margin: "60px auto" }}>
      <h1>Đăng ký</h1>
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
            minLength={8}
          />
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit" disabled={submitting}>
          {submitting ? "Đang xử lý..." : "Đăng ký"}
        </button>
      </form>
    </main>
  )
}