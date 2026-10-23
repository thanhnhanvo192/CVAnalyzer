import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "success" | "warning" | "error" | "info" | "neutral";
  size?: "sm" | "md";
  className?: string;
}

export function Badge({
  children,
  variant = "info",
  size = "md",
  className = "",
}: BadgeProps) {
  const sizeStyles = {
    sm: "px-2 py-0.5 text-xs font-medium",
    md: "px-2.5 py-1 text-xs font-semibold tracking-wide",
  };

  const variantStyles = {
    success:
      "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30",
    warning:
      "bg-amber-500/10 text-amber-400 border border-amber-500/30",
    error:
      "bg-rose-500/10 text-rose-400 border border-rose-500/30",
    info:
      "bg-blue-500/10 text-blue-400 border border-blue-500/30",
    neutral:
      "bg-slate-800 text-slate-300 border border-slate-700",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full uppercase ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
