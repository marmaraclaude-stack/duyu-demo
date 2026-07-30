"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { IconArrowRight, IconShield } from "@/components/ui/Icons";
import { useData } from "@/lib/store/DataProvider";

// Yalnızca yönetici hesabıyla görüntülenebilen sayfalar için sarmalayıcı.
export function AdminOnly({ children }: { children: ReactNode }) {
  const { role } = useData();

  if (role === "yonetici") return <>{children}</>;

  return (
    <div className="mx-auto mt-10 max-w-md rounded-xl border border-ink-100 bg-white p-8 text-center shadow-card">
      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gold-50 text-gold-600">
        <IconShield className="h-6 w-6" />
      </span>
      <h2 className="mt-4 text-base font-semibold text-ink-900">
        Bu sayfa yönetici hesabına özel
      </h2>
      <p className="mt-2 text-sm text-ink-400">
        Raporlama ve kayıt izi ekranlarına yalnızca yönetici hesabı erişebilir.
        Görüntülemek için yönetici hesabıyla giriş yapın.
      </p>
      <Link
        href="/"
        className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-gold-700 hover:text-gold-600"
      >
        Panoma dön <IconArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
