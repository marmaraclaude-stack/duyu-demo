"use client";

import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { IconMenu } from "@/components/ui/Icons";
import { useData } from "@/lib/store/DataProvider";
import { GlobalSearch } from "./GlobalSearch";
import { NotificationsBell } from "./NotificationsBell";
import { RoleSwitcher } from "./RoleSwitcher";
import { Sidebar } from "./Sidebar";

const TITLES: Record<string, string> = {
  "/musteriler": "Müşteriler",
  "/hatirlatmalar": "Hatırlatmalar · Bugün aranacaklar",
  "/odeme-planlari": "Ödeme planı kütüphanesi",
  "/lead-kuyrugu": "Meta lead kuyruğu",
  "/raporlar": "Raporlama",
  "/yetki": "Yetki ve kayıt izi",
};

function pageTitle(pathname: string, role: string): string {
  if (pathname.startsWith("/musteriler/")) return "Müşteri kartı";
  return (
    TITLES[pathname] ?? (role === "yonetici" ? "Yönetici panosu" : "Panom")
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { role } = useData();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Yazdırma görünümleri kabuk olmadan, temiz beyaz sayfada açılır.
  if (pathname.startsWith("/yazdir")) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen">
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className="flex min-h-screen flex-col lg:pl-64">
        <header className="sticky top-0 z-20 border-b border-ink-100 bg-white/90 backdrop-blur">
          <div className="flex items-center gap-3 px-4 py-3 sm:px-6">
            <button
              onClick={() => setMobileOpen(true)}
              className="rounded-lg p-2 text-ink-500 hover:bg-ink-100 lg:hidden"
              aria-label="Menüyü aç"
            >
              <IconMenu className="h-5 w-5" />
            </button>
            <h1 className="hidden min-w-fit text-lg font-semibold text-ink-900 md:block">
              {pageTitle(pathname, role)}
            </h1>
            <div className="flex flex-1 justify-center px-2">
              <GlobalSearch />
            </div>
            <NotificationsBell />
            <RoleSwitcher />
          </div>
          <h1 className="border-t border-ink-100 px-4 py-2 text-base font-semibold text-ink-900 md:hidden">
            {pageTitle(pathname, role)}
          </h1>
        </header>
        <main className="flex-1 px-4 py-6 sm:px-6">{children}</main>
      </div>
    </div>
  );
}
