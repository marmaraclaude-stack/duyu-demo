"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Card, CardHeader } from "@/components/ui/Card";
import {
  IconCheck,
  IconChevronDown,
  IconClock,
  IconPhone,
} from "@/components/ui/Icons";
import { Avatar } from "@/components/ui/Avatar";
import { demoNow } from "@/lib/demo-time";
import { formatDate, formatTime, relativeDay } from "@/lib/format";
import { REMINDER_TYPE_LABELS } from "@/lib/labels";
import {
  minutesLate,
  overdueReminders,
  scopeReminders,
  todayReminders,
  upcomingReminders,
} from "@/lib/queries";
import { useData } from "@/lib/store/DataProvider";
import type { Reminder } from "@/lib/types";

function PostponeMenu({
  reminder,
  onPostpone,
}: {
  reminder: Reminder;
  onPostpone: (id: string, dueAt: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const options: { label: string; compute: () => string }[] = [
    {
      label: "1 saat sonra",
      compute: () => {
        const d = new Date();
        d.setHours(d.getHours() + 1, 0, 0, 0);
        return d.toISOString();
      },
    },
    {
      label: "Bugün 17:00",
      compute: () => {
        const d = demoNow();
        d.setHours(17, 0, 0, 0);
        return d.toISOString();
      },
    },
    {
      label: "Yarın 09:30",
      compute: () => {
        const d = demoNow();
        d.setDate(d.getDate() + 1);
        d.setHours(9, 30, 0, 0);
        return d.toISOString();
      },
    },
    {
      label: "Gelecek hafta",
      compute: () => {
        const d = demoNow();
        d.setDate(d.getDate() + 7);
        d.setHours(10, 0, 0, 0);
        return d.toISOString();
      },
    },
  ];

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-ink-500 transition-colors hover:bg-ink-100 hover:text-ink-800"
      >
        Ertele <IconChevronDown className="h-3.5 w-3.5" />
      </button>
      {open ? (
        <div className="absolute right-0 z-30 mt-1 w-40 rounded-xl border border-ink-100 bg-white p-1 shadow-pop">
          {options.map((o) => (
            <button
              key={o.label}
              onClick={() => {
                onPostpone(reminder.id, o.compute());
                setOpen(false);
              }}
              className="block w-full rounded-lg px-3 py-1.5 text-left text-xs text-ink-600 hover:bg-ink-50"
            >
              {o.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function RemindersView() {
  const {
    reminders,
    leads,
    users,
    currentUser,
    role,
    completeReminder,
    postponeReminder,
  } = useData();

  const isAdmin = role === "yonetici";
  const scoped = scopeReminders(reminders, currentUser.id, role);
  const overdue = overdueReminders(scoped);
  const openToday = todayReminders(scoped).filter(
    (r) => !r.done && !overdue.includes(r)
  );
  const upcoming = upcomingReminders(scoped).filter(
    (r) => !overdue.includes(r)
  );
  const doneToday = todayReminders(scoped).filter((r) => r.done);

  const leadName = (id: string) =>
    leads.find((l) => l.id === id)?.name ?? "Silinmiş kayıt";
  const agentName = (id: string) =>
    users.find((u) => u.id === id)?.name ?? "·";

  const row = (r: Reminder, late: boolean) => (
    <li
      key={r.id}
      className={`flex flex-wrap items-center gap-3 px-5 py-3.5 sm:flex-nowrap ${
        late ? "bg-danger-50/50" : ""
      }`}
    >
      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
          late
            ? "bg-danger-50 text-danger-600 ring-1 ring-inset ring-danger-100"
            : r.type === "randevu"
              ? "bg-gold-500/15 text-gold-700"
              : "bg-gold-50 text-gold-700"
        }`}
      >
        {r.type === "randevu" ? (
          <IconClock className="h-4 w-4" />
        ) : (
          <IconPhone className="h-4 w-4" />
        )}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2">
          <Link
            href={`/musteriler/${r.leadId}`}
            className="text-sm font-medium text-ink-900 hover:text-gold-700"
          >
            {leadName(r.leadId)}
          </Link>
          <span className="text-xs text-ink-400">
            {REMINDER_TYPE_LABELS[r.type]}
          </span>
          {isAdmin ? (
            <span className="flex items-center gap-1.5 text-xs text-ink-400">
              · <Avatar name={agentName(r.agentId)} size="sm" />
              {agentName(r.agentId)}
            </span>
          ) : null}
        </div>
        {r.note ? (
          <p className="mt-0.5 truncate text-xs text-ink-400">{r.note}</p>
        ) : null}
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <span
          className={`font-mono text-sm font-semibold ${
            late ? "text-danger-600" : "text-ink-900"
          }`}
        >
          {formatTime(r.dueAt)}
        </span>
        {late ? (
          <span className="rounded-full bg-danger-50 px-2 py-0.5 text-[11px] font-medium text-danger-600 ring-1 ring-inset ring-danger-100">
            {minutesLate(r.dueAt) >= 1440
              ? `${Math.floor(minutesLate(r.dueAt) / 1440)} gün gecikti`
              : `${Math.floor(minutesLate(r.dueAt) / 60)} sa ${minutesLate(r.dueAt) % 60} dk gecikti`}
          </span>
        ) : null}
        <PostponeMenu reminder={r} onPostpone={postponeReminder} />
        <button
          onClick={() => completeReminder(r.id)}
          className="inline-flex items-center gap-1 rounded-lg bg-ink-900 px-2.5 py-1.5 text-xs font-medium text-white transition-colors hover:bg-ink-800"
        >
          <IconCheck className="h-3.5 w-3.5" /> Tamamla
        </button>
      </div>
    </li>
  );

  return (
    <div className="space-y-6">
      {/* Geciken aramalar */}
      <Card>
        <CardHeader
          title="Geciken aramalar"
          subtitle={
            overdue.length > 0
              ? `${overdue.length} kayıt aksiyon bekliyor`
              : "Geciken arama yok"
          }
        />
        {overdue.length === 0 ? (
          <p className="px-5 py-6 text-sm text-ink-400">
            Tüm aramalar zamanında yapıldı.
          </p>
        ) : (
          <ul className="divide-y divide-ink-50">
            {overdue.map((r) => row(r, true))}
          </ul>
        )}
      </Card>

      {/* Bugünün programı */}
      <Card>
        <CardHeader
          title="Bugün aranacaklar ve randevular"
          subtitle={`${formatDate(demoNow().toISOString())} · ${openToday.length} açık kayıt`}
        />
        {openToday.length === 0 ? (
          <p className="px-5 py-6 text-sm text-ink-400">
            Bugün için açık hatırlatma kalmadı.
          </p>
        ) : (
          <ul className="divide-y divide-ink-50">
            {openToday.map((r) => row(r, false))}
          </ul>
        )}
        {doneToday.length > 0 ? (
          <p className="border-t border-ink-100 px-5 py-3 text-xs text-ink-400">
            Bugün {doneToday.length} hatırlatma tamamlandı.
          </p>
        ) : null}
      </Card>

      {/* Yaklaşan */}
      <Card>
        <CardHeader title="Yaklaşan" subtitle="Sonraki günler" />
        {upcoming.length === 0 ? (
          <p className="px-5 py-6 text-sm text-ink-400">
            İleri tarihli hatırlatma yok.
          </p>
        ) : (
          <ul className="divide-y divide-ink-50">
            {upcoming.map((r) => (
              <li key={r.id} className="flex items-center gap-3 px-5 py-3.5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink-100 text-ink-500">
                  {r.type === "randevu" ? (
                    <IconClock className="h-4 w-4" />
                  ) : (
                    <IconPhone className="h-4 w-4" />
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-2">
                    <Link
                      href={`/musteriler/${r.leadId}`}
                      className="text-sm font-medium text-ink-900 hover:text-gold-700"
                    >
                      {leadName(r.leadId)}
                    </Link>
                    <span className="text-xs text-ink-400">
                      {REMINDER_TYPE_LABELS[r.type]}
                      {isAdmin ? ` · ${agentName(r.agentId)}` : ""}
                    </span>
                  </div>
                  {r.note ? (
                    <p className="mt-0.5 truncate text-xs text-ink-400">
                      {r.note}
                    </p>
                  ) : null}
                </div>
                <span className="shrink-0 text-right">
                  <span className="block text-xs font-medium text-ink-700">
                    {relativeDay(r.dueAt, demoNow())}
                  </span>
                  <span className="block font-mono text-xs text-ink-400">
                    {formatDate(r.dueAt)} · {formatTime(r.dueAt)}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
