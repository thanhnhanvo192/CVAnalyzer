import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  glow?: boolean;
}

export function Card({ children, glow = false, className = "", ...props }: CardProps) {
  return (
    <div
      className={`glass-card rounded-2xl p-6 ${glow ? "glow-indigo" : ""} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
