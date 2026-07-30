import type { ReactNode } from "react";

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 px-6 py-12 text-center">
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gold-50 text-gold-600">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          className="h-5 w-5"
        >
          <circle cx="11" cy="11" r="6.5" />
          <path d="m20 20-3.8-3.8" strokeLinecap="round" />
        </svg>
      </div>
      <p className="text-sm font-medium text-ink-700">{title}</p>
      {description ? (
        <p className="max-w-xs text-xs text-ink-400">{description}</p>
      ) : null}
      {action}
    </div>
  );
}
