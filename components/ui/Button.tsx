"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "gold";
type Size = "sm" | "md";

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-ink-900 text-white hover:bg-ink-800 focus-visible:outline-ink-900",
  gold: "bg-gold-600 text-ink-950 hover:bg-gold-500 focus-visible:outline-gold-600",
  secondary:
    "bg-white text-ink-700 ring-1 ring-inset ring-ink-200 hover:bg-ink-50 focus-visible:outline-ink-400",
  ghost: "text-ink-500 hover:bg-ink-100 hover:text-ink-800",
  danger:
    "bg-white text-danger-600 ring-1 ring-inset ring-danger-100 hover:bg-danger-50",
};

const SIZES: Record<Size, string> = {
  sm: "px-2.5 py-1.5 text-xs gap-1.5",
  md: "px-3.5 py-2 text-sm gap-2",
};

export function Button({
  variant = "secondary",
  size = "md",
  className = "",
  children,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
}) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
