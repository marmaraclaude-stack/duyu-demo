"use client";

// Temsilci panosu: "bugün neye odaklanmalıyım" sorusuna yanıt verir ·
// kişisel hedef ilerlemesi, günün programı, son aramalar ve portföy durumu.

import Link from "next/link";
import { Card, CardHeader } from "@/components/ui/Card";
import {
  IconArrowRight,
  IconCheck,
  IconClock,
  IconPhone,
  IconUsers,
} from "@/components/ui/Icons";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { demoNow } from "@/lib/demo-time";
import { TODAY_CALLS } from "@/lib/data/stats";
import { formatDate, formatDayName, formatNumber, formatTime } from "@/lib/format";
import { REMINDER_TYPE_LABELS, STATUS_DOT_CLASSES, STATUS_LABELS } from "@/lib/labels";
import {
  overdueReminders,
  scopeReminders,
  statusCounts,
  todayCalls,
  todayReminders,
  visibleLeads,
} from "@/lib/queries";
import { useData } from "@/lib/store/DataProvider";
import type { LeadStatus } from "@/lib/types";

const DAILY_TARGET = 50;

export function RepDashboard() {
  const { currentUser, leads, calls, reminders, completeReminder } = useData();

  const myStats = TODAY_CALLS.find((t) => t.agentId === currentUser.id);
  const myCalls = myStats?.calls ?? 0;
  const myReach = myStats
    ? Math.round((myStats.reached / myStats.calls) * 100)
    : 0;

  const myLeads = visibleLeads(leads, currentUser.id, "temsilci");
  const myReminders = scopeReminders(reminders, currentUser.id, "temsilci");
  const overdue = overdueReminders(myReminders);
  const openToday = todayReminders(myReminders).filter(
    (r) => !r.done && !overdue.includes(r)
  );
  const appointmentsToday = openToday.filter((r) => r.type === "randevu").length;
  const myTodayCalls = todayCalls(calls).filter(
    (c) => c.agentId === currentUser.id
  );

  const leadName = (id: string) => leads.find((l) => l.id === id)?.name ?? "·";
  const now = demoNow();
  const firstName = currentUser.name.split(" ")[0];
  const greeting = now.getHours() < 12 ? "Günaydın" : "İyi günler";
  const targetPct = Math.min(100, Math.round((myCalls / DAILY_TARGET) * 100));

  // Portföy durum dağılımı: en kalabalık 5 durum
  const counts = statusCounts(myLeads);
  const topStatuses = (Object.entries(counts) as [LeadStatus, number][])
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  const maxStatus = Math.max(...topStatuses.map(([, n]) => n), 1);

  return (
    <div className="space-y-6">
      {/* Karşılama + günlük hedef */}
      <Card className="overflow-hidden">
        <div className="flex flex-col gap-6 bg-ink-950 px-6 py-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-medium tracking-[0.06em] text-gold-400">
              {formatDayName(now.toISOString())} · {formatDate(now.toISOString())}
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-white">
              {greeting}, {firstName}
            </h2>
            <p className="mt-1.5 text-sm text-ink-300">
              Bugün {overdue.length + openToday.length} açık hatırlatmanız ve{" "}
              {appointmentsToday} satış ofisi randevunuz var.
            </p>
          </div>
          <div className="w-full sm:w-72">
            <div className="mb-1.5 flex items-baseline justify-between">
              <span className="text-xs text-ink-300">Günlük arama hedefi</span>
              <span className="font-mono text-sm font-medium text-gold-300">
                {myCalls}/{DAILY_TARGET}
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-ink-800">
              <div
                className="h-full rounded-full bg-gold-500 transition-all"
                style={{ width: `${targetPct}%` }}
              />
            </div>
            <p className="mt-1.5 text-[11px] text-ink-400">
              Hedefin %{targetPct}&apos;i tamamlandı
              {targetPct >= 100 ? " · tebrikler" : ""}
            </p>
          </div>
        </div>
      </Card>

      {/* Kişisel istatistikler */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {[
          {
            label: "Bugünkü aramalarım",
            value: formatNumber(myCalls),
            hint: "size ait kayıtlar",
          },
          {
            label: "Ulaşma oranım",
            value: `%${myReach}`,
            hint: "cevaplanan / toplam",
          },
          {
            label: "Portföyümdeki müşteri",
            value: formatNumber(myLeads.length),
            hint: "size atanan kayıtlar",
          },
          {
            label: "Geciken aramam",
            value: formatNumber(overdue.length),
            hint: overdue.length > 0 ? "önce bunları arayın" : "gecikme yok",
            alert: overdue.length > 0,
          },
        ].map((s) => (
          <Card key={s.label} className="px-5 py-4">
            <p className="text-xs font-medium text-ink-400">{s.label}</p>
            <p
              className={`mt-2 text-3xl font-semibold ${
                s.alert ? "text-danger-600" : "text-ink-900"
              }`}
            >
              {s.value}
            </p>
            <p className="mt-1 text-[11px] text-ink-300">{s.hint}</p>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        {/* Bugünün programı */}
        <Card className="xl:col-span-2">
          <CardHeader
            title="Bugünün programı"
            subtitle="Gecikenler önce · saat sırasıyla"
            action={
              <Link
                href="/hatirlatmalar"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-gold-700 hover:text-gold-600"
              >
                Tümü <IconArrowRight className="h-3.5 w-3.5" />
              </Link>
            }
          />
          <ul className="divide-y divide-ink-50">
            {[...overdue, ...openToday].slice(0, 7).map((r) => {
              const late = overdue.includes(r);
              return (
                <li
                  key={r.id}
                  className={`flex items-center gap-3 px-5 py-3 ${
                    late ? "bg-danger-50/50" : ""
                  }`}
                >
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                      late
                        ? "bg-danger-50 text-danger-600"
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
                    <Link
                      href={`/musteriler/${r.leadId}`}
                      className="block truncate text-sm font-medium text-ink-900 hover:text-gold-700"
                    >
                      {leadName(r.leadId)}
                    </Link>
                    <p className="truncate text-xs text-ink-400">
                      {REMINDER_TYPE_LABELS[r.type]}
                      {r.note ? ` · ${r.note}` : ""}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 font-mono text-sm font-medium ${
                      late ? "text-danger-600" : "text-ink-900"
                    }`}
                  >
                    {formatTime(r.dueAt)}
                  </span>
                  <button
                    onClick={() => completeReminder(r.id)}
                    className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-ink-900 px-2.5 py-1.5 text-xs font-medium text-white transition-colors hover:bg-ink-800"
                  >
                    <IconCheck className="h-3.5 w-3.5" /> Tamamla
                  </button>
                </li>
              );
            })}
            {overdue.length === 0 && openToday.length === 0 ? (
              <li className="px-5 py-10 text-center text-sm text-ink-400">
                Bugünkü programınız tamamlandı, yeni arama kaydı ekleyerek devam
                edebilirsiniz.
              </li>
            ) : null}
          </ul>
        </Card>

        {/* Portföy durumu */}
        <Card>
          <CardHeader
            title="Portföyüm"
            subtitle="Durumlara göre dağılım"
            action={
              <Link
                href="/musteriler"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-gold-700 hover:text-gold-600"
              >
                <IconUsers className="h-3.5 w-3.5" /> Listem
              </Link>
            }
          />
          <div className="space-y-3 px-5 py-5">
            {topStatuses.map(([status, count]) => (
              <div key={status}>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 text-ink-600">
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT_CLASSES[status]}`}
                    />
                    {STATUS_LABELS[status]}
                  </span>
                  <span className="font-mono font-medium text-ink-900">
                    {count}
                  </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-ink-50">
                  <div
                    className={`h-full rounded-full ${STATUS_DOT_CLASSES[status]}`}
                    style={{ width: `${(count / maxStatus) * 100}%` }}
                  />
                </div>
              </div>
            ))}
            {topStatuses.length === 0 ? (
              <p className="py-4 text-center text-sm text-ink-400">
                Henüz size atanmış müşteri yok.
              </p>
            ) : null}
          </div>
        </Card>
      </div>

      {/* Son aramalarım */}
      <Card>
        <CardHeader title="Son aramalarım" subtitle="Bugün kaydettiğiniz görüşmeler" />
        <ul className="divide-y divide-ink-50">
          {myTodayCalls.slice(0, 5).map((c) => (
            <li key={c.id} className="flex items-center gap-3 px-5 py-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink-100 text-ink-500">
                <IconPhone className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1">
                <Link
                  href={`/musteriler/${c.leadId}`}
                  className="block truncate text-sm font-medium text-ink-900 hover:text-gold-700"
                >
                  {leadName(c.leadId)}
                </Link>
                <p className="truncate text-xs text-ink-400">{c.note}</p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1">
                <StatusBadge status={c.result} />
                <span className="font-mono text-[11px] text-ink-400">
                  {formatTime(c.at)}
                </span>
              </div>
            </li>
          ))}
          {myTodayCalls.length === 0 ? (
            <li className="px-5 py-8 text-center text-sm text-ink-400">
              Bugün henüz arama kaydı girmediniz.
            </li>
          ) : null}
        </ul>
      </Card>
    </div>
  );
}
