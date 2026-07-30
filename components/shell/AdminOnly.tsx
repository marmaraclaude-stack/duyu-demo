"use client";

import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { IconShield } from "@/components/ui/Icons";
import { useData } from "@/lib/store/DataProvider";

// Yalnızca yönetici rolünde görüntülenebilen sayfalar için sarmalayıcı.
export function AdminOnly({ children }: { children: ReactNode }) {
  const { role, setCurrentUserId } = useData();

  if (role === "yonetici") return <>{children}</>;

  return (
    <div className="mx-auto mt-10 max-w-md rounded-xl border border-ink-100 bg-white p-8 text-center shadow-card">
      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gold-50 text-gold-600">
        <IconShield className="h-6 w-6" />
      </span>
      <h2 className="mt-4 text-base font-semibold text-ink-900">
        Bu sayfa yönetici rolüne özel
      </h2>
      <p className="mt-2 text-sm text-ink-400">
        Raporlama ve kayıt izi ekranlarına yalnızca yönetici hesabı erişebilir.
        Demo için rol değiştirebilirsiniz.
      </p>
      <Button
        variant="gold"
        className="mt-5"
        onClick={() => setCurrentUserId("u-adil")}
      >
        Yönetici olarak devam et
      </Button>
    </div>
  );
}
