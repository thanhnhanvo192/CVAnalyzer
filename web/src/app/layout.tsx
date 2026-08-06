import React from "react";
import { AuthProvider } from "../contexts/AuthContext";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body>
        <AuthProvider>{ children }</AuthProvider>
      </body>
    </html>
  );
}