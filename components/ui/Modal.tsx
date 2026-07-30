"use client";

import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { IconX } from "./Icons";

// Modallar document.body altına portallanır: kabuktaki yapışkan topbar ve
// stacking context'lerden bağımsız olarak tüm görünümü tek örtüyle kaplar.
export function Modal({
  open,
  onClose,
  title,
  subtitle,
  children,
  wide = false,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
  wide?: boolean;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open || !mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className="absolute inset-0 animate-overlay-in bg-ink-950/75"
        onClick={onClose}
      />
      <div
        className={`relative z-10 max-h-[92vh] w-full animate-modal-in overflow-y-auto overscroll-contain rounded-t-2xl bg-white shadow-pop sm:rounded-2xl ${
          wide ? "sm:max-w-2xl" : "sm:max-w-lg"
        }`}
      >
        <div className="sticky top-0 flex items-start justify-between gap-4 border-b border-ink-100 bg-white px-5 py-4">
          <div>
            <h2 className="font-serif text-lg font-semibold text-ink-900">
              {title}
            </h2>
            {subtitle ? (
              <p className="mt-0.5 text-xs text-ink-400">{subtitle}</p>
            ) : null}
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-ink-400 hover:bg-ink-100 hover:text-ink-700"
            aria-label="Kapat"
          >
            <IconX className="h-5 w-5" />
          </button>
        </div>
        <div className="px-5 py-4">{children}</div>
      </div>
    </div>,
    document.body
  );
}
