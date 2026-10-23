import React from "react";
import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "../contexts/AuthContext";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";

export const metadata: Metadata = {
  title: "Smart CV Analyzer & Job Match | AI Career Copilot",
  description:
    "Phân tích CV, đối chiếu Job Description và gợi ý cải thiện kỹ năng thông minh bằng AI hàng đầu.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className="dark">
      <body className="min-h-screen flex flex-col bg-[#0b0f19] text-slate-100 antialiased selection:bg-indigo-500 selection:text-white">
        <div className="ambient-bg" />
        <AuthProvider>
          <Navbar />
          <div className="flex-1 flex flex-col">{children}</div>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}