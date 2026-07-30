"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { can } from "@/lib/permissions";
import { useData } from "@/lib/store/DataProvider";
import { overdueReminders, scopeReminders, todayReminders } from "@/lib/queries";
import {
  IconBuilding,
  IconCalendar,
  IconCard,
  IconChart,
  IconGrid,
  IconInbox,
  IconShield,
  IconUsers,
  IconX,
} from "@/components/ui/Icons";

interface NavItem {
  href: string;
  label: string;
  icon: (p: { className?: string }) => JSX.Element;
  adminOnly?: boolean;
  badge?: number;
}

export function Sidebar({
  mobileOpen,
  onClose,
}: {
  mobileOpen: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const { role, currentUser, reminders, queue, dataSource } = useData();

  const scoped = scopeReminders(reminders, currentUser.id, role);
  const openToday = todayReminders(scoped).filter((r) => !r.done).length;
  const overdue = overdueReminders(scoped).length;
  const queueActive = queue.filter(
    (q) => q.stage === "kuyrukta" || q.stage === "kontrol"
  ).length;

  const items: NavItem[] = [
    { href: "/", label: role === "yonetici" ? "Yönetici panosu" : "Panom", icon: IconGrid },
    { href: "/musteriler", label: "Müşteriler", icon: IconUsers },
    {
      href: "/hatirlatmalar",
      label: "Hatırlatmalar",
      icon: IconCalendar,
      badge: openToday + overdue,
    },
    { href: "/odeme-planlari", label: "Ödeme planları", icon: IconCard },
    {
      href: "/lead-kuyrugu",
      label: "Meta lead kuyruğu",
      icon: IconInbox,
      badge: queueActive,
    },
    { href: "/raporlar", label: "Raporlama", icon: IconChart, adminOnly: true },
    {
      href: "/yetki",
      label: "Yetki ve kayıt izi",
      icon: IconShield,
      adminOnly: true,
    },
  ];

  const visible = items.filter(
    (i) =>
      !i.adminOnly ||
      (i.href === "/raporlar"
        ? can(role, "reports.view")
        : can(role, "audit.view"))
  );

  const nav = (
    <nav className="flex flex-1 flex-col gap-1 px-3">
      <p className="section-label mb-2 mt-6 px-3">Çalışma alanı</p>
      {visible.map((item) => {
        const active =
          item.href === "/"
            ? pathname === "/"
            : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClose}
            className={`group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
              active
                ? "bg-ink-800 font-medium text-gold-300"
                : "text-ink-300 hover:bg-ink-850 hover:text-white"
            }`}
          >
            {active ? (
              <span className="absolute inset-y-2 left-0 w-0.5 rounded-full bg-gold-500" />
            ) : null}
            <item.icon
              className={`h-5 w-5 ${active ? "text-gold-400" : "text-ink-500 group-hover:text-ink-300"}`}
            />
            <span className="flex-1">{item.label}</span>
            {item.badge ? (
              <span className="rounded-full bg-gold-600 px-1.5 py-0.5 font-mono text-[10px] font-semibold leading-none text-ink-950">
                {item.badge}
              </span>
            ) : null}
          </Link>
        );
      })}
    </nav>
  );

  const header = (
    <div className="flex items-center gap-3 px-6 pt-6">
      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold-600 text-ink-950">
        <IconBuilding className="h-5 w-5" />
      </span>
      <div>
        <p className="font-serif text-base font-semibold tracking-wide text-white">
          Duyu Konutları
        </p>
        <p className="text-[11px] tracking-[0.18em] text-gold-400">
          Satış CRM
        </p>
      </div>
    </div>
  );

  const footer = (
    <div className="border-t border-ink-800 px-6 py-4">
      <p className="flex items-center gap-2 text-xs text-ink-500">
        <span
          className={`h-1.5 w-1.5 rounded-full ${
            dataSource === "supabase" ? "bg-gold-500" : "bg-ink-600"
          }`}
        />
        {dataSource === "supabase" ? "Canlı veri · Supabase" : "Demo veri · yerel"}
      </p>
      <p className="mt-1 text-xs text-ink-500">
        {role === "yonetici" ? "Yönetici görünümü" : "Temsilci görünümü"}
      </p>
    </div>
  );

  return (
    <>
      {/* Masaüstü: sabit koyu sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col bg-ink-950 lg:flex">
        {header}
        {nav}
        {footer}
      </aside>

      {/* Mobil: drawer */}
      {mobileOpen ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-ink-950/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <aside className="absolute inset-y-0 left-0 flex w-72 flex-col bg-ink-950 shadow-pop">
            <div className="flex items-center justify-between pr-4">
              {header}
              <button
                onClick={onClose}
                className="mt-6 rounded-lg p-2 text-ink-400 hover:bg-ink-800 hover:text-white"
                aria-label="Menüyü kapat"
              >
                <IconX className="h-5 w-5" />
              </button>
            </div>
            {nav}
            {footer}
          </aside>
        </div>
      ) : null}
    </>
  );
}
