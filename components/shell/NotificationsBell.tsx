"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { IconBell, IconClock } from "@/components/ui/Icons";
import { isToday } from "@/lib/demo-time";
import { formatDateShort, formatTime } from "@/lib/format";
import {
  overdueReminders,
  scopeReminders,
  todayReminders,
} from "@/lib/queries";
import { useData } from "@/lib/store/DataProvider";
import { REMINDER_TYPE_LABELS } from "@/lib/labels";

// Bildirimler bugünkü hatırlatmalardan otomatik üretilir.
export function NotificationsBell() {
  const { reminders, leads, currentUser, role } = useData();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const scoped = scopeReminders(reminders, currentUser.id, role);
  const overdue = overdueReminders(scoped);
  const upcoming = todayReminders(scoped).filter(
    (r) => !r.done && !overdue.includes(r)
  );
  const count = overdue.length + upcoming.length;

  const leadName = (id: string) =>
    leads.find((l) => l.id === id)?.name ?? "Silinmiş kayıt";

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative rounded-lg p-2 text-ink-500 transition-colors hover:bg-ink-100 hover:text-ink-800"
        aria-label="Bildirimler"
      >
        <IconBell className="h-5 w-5" />
        {count > 0 ? (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold-600 px-1 tabular text-[10px] font-semibold text-ink-950">
            {count}
          </span>
        ) : null}
      </button>

      {open ? (
        <div className="absolute right-0 z-40 mt-2 w-80 rounded-xl border border-ink-100 bg-white shadow-pop">
          <div className="flex items-center justify-between border-b border-ink-100 px-4 py-3">
            <p className="text-sm font-semibold text-ink-900">Bildirimler</p>
            <span className="text-xs text-ink-400">
              bugünkü hatırlatmalardan
            </span>
          </div>
          <div className="thin-scroll max-h-80 overflow-y-auto p-2">
            {count === 0 ? (
              <p className="px-3 py-6 text-center text-xs text-ink-400">
                Bekleyen bildirim yok, tüm hatırlatmalar tamamlandı.
              </p>
            ) : (
              <>
                {overdue.map((r) => (
                  <Link
                    key={r.id}
                    href="/hatirlatmalar"
                    onClick={() => setOpen(false)}
                    className="flex items-start gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-ink-50"
                  >
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-danger-50 text-danger-600">
                      <IconClock className="h-4 w-4" />
                    </span>
                    <span>
                      <span className="block text-sm font-medium text-ink-900">
                        {leadName(r.leadId)} · gecikti
                      </span>
                      <span className="block text-xs text-ink-400">
                        {REMINDER_TYPE_LABELS[r.type]} · plan{" "}
                        {isToday(r.dueAt)
                          ? `bugün ${formatTime(r.dueAt)}`
                          : `${formatDateShort(r.dueAt)} · ${formatTime(r.dueAt)}`}{" "}
                        idi
                      </span>
                    </span>
                  </Link>
                ))}
                {upcoming.map((r) => (
                  <Link
                    key={r.id}
                    href="/hatirlatmalar"
                    onClick={() => setOpen(false)}
                    className="flex items-start gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-ink-50"
                  >
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gold-50 text-gold-700">
                      <IconBell className="h-4 w-4" />
                    </span>
                    <span>
                      <span className="block text-sm font-medium text-ink-900">
                        {leadName(r.leadId)}
                      </span>
                      <span className="block text-xs text-ink-400">
                        {REMINDER_TYPE_LABELS[r.type]} · bugün{" "}
                        {formatTime(r.dueAt)}
                      </span>
                    </span>
                  </Link>
                ))}
              </>
            )}
          </div>
          <Link
            href="/hatirlatmalar"
            onClick={() => setOpen(false)}
            className="block border-t border-ink-100 px-4 py-2.5 text-center text-xs font-medium text-gold-700 hover:bg-gold-50"
          >
            Tüm hatırlatmaları aç
          </Link>
        </div>
      ) : null}
    </div>
  );
}
