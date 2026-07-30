"use client";

import Link from "next/link";
import { Funnel } from "@/components/charts/Funnel";
import { Card, CardHeader } from "@/components/ui/Card";
import {
  IconArrowRight,
  IconCheck,
  IconClock,
  IconPhone,
} from "@/components/ui/Icons";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Avatar } from "@/components/ui/Avatar";
import {
  FUNNEL,
  TODAY_CALLS,
  TODAY_REACH_RATE,
  TODAY_TOTAL_CALLS,
} from "@/lib/data/stats";
import { formatNumber, formatTime } from "@/lib/format";
import { REMINDER_TYPE_LABELS } from "@/lib/labels";
import {
  overdueReminders,
  scopeReminders,
  todayCalls,
  todayReminders,
} from "@/lib/queries";
import { useData } from "@/lib/store/DataProvider";

export function DashboardView() {
  const { role, currentUser, users, leads, calls, reminders, completeReminder } =
    useData();

  const isAdmin = role === "yonetici";
  const myStats = TODAY_CALLS.find((t) => t.agentId === currentUser.id);

  // Temsilci kendi rakamlarını, yönetici ekip toplamını görür.
  const callCount = isAdmin ? TODAY_TOTAL_CALLS : (myStats?.calls ?? 0);
  const reachRate = isAdmin
    ? TODAY_REACH_RATE
    : myStats
      ? Math.round((myStats.reached / myStats.calls) * 100)
      : 0;

  const scopedReminders = scopeReminders(reminders, currentUser.id, role);
  const openToday = todayReminders(scopedReminders).filter((r) => !r.done);
  const overdue = overdueReminders(scopedReminders);
  const appointmentsToday = openToday.filter((r) => r.type === "randevu").length;

  const scopedCalls = isAdmin
    ? todayCalls(calls)
    : todayCalls(calls).filter((c) => c.agentId === currentUser.id);

  const leadName = (id: string) => leads.find((l) => l.id === id)?.name ?? "·";
  const agentName = (id: string) =>
    users.find((u) => u.id === id)?.name ?? "·";

  const stats = [
    {
      label: "Bugünkü toplam arama",
      value: formatNumber(callCount),
      hint: isAdmin ? "3 temsilcinin toplamı" : "size ait aramalar",
    },
    {
      label: "Ulaşma oranı",
      value: `%${reachRate}`,
      hint: "cevaplanan / toplam arama",
    },
    {
      label: "Bugünkü randevular",
      value: formatNumber(appointmentsToday),
      hint: "satış ofisi görüşmeleri",
    },
    {
      label: "Geciken arama",
      value: formatNumber(overdue.length),
      hint: overdue.length > 0 ? "hemen aksiyon bekliyor" : "gecikme yok",
      alert: overdue.length > 0,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Üst istatistik kartları */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label} className="px-5 py-4">
            <p className="text-xs font-medium text-ink-400">{s.label}</p>
            <p
              className={`mt-2 font-mono text-2xl font-semibold ${
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
        {/* Dönüşüm hunisi */}
        <Card className="xl:col-span-2">
          <CardHeader
            title="Dönüşüm hunisi"
            subtitle="Kampanya dönemi · lead'den satışa"
            action={
              <Link
                href="/raporlar"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-gold-700 hover:text-gold-600"
              >
                Rapor detayı <IconArrowRight className="h-3.5 w-3.5" />
              </Link>
            }
          />
          <div className="px-5 py-5">
            <Funnel data={FUNNEL} />
          </div>
        </Card>

        {/* Temsilci bazlı arama sayıları */}
        <Card>
          <CardHeader
            title="Temsilci bazlı aramalar"
            subtitle="Bugün · adet"
          />
          <div className="space-y-4 px-5 py-5">
            {TODAY_CALLS.map((t) => {
              const max = Math.max(...TODAY_CALLS.map((x) => x.calls));
              const name = agentName(t.agentId);
              return (
                <div key={t.agentId}>
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="flex items-center gap-2 text-sm text-ink-700">
                      <Avatar name={name} size="sm" />
                      {name}
                    </span>
                    <span className="font-mono text-sm font-semibold text-ink-900">
                      {t.calls}
                      <span className="ml-1.5 font-sans text-[11px] font-normal text-ink-400">
                        %{Math.round((t.reached / t.calls) * 100)} ulaşma
                      </span>
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-ink-50">
                    <div
                      className="h-full rounded-full bg-gold-500"
                      style={{ width: `${(t.calls / max) * 100}%` }}
                    />
                  </div>
                </div>
              );
            })}
            <p className="pt-1 text-[11px] leading-snug text-ink-300">
              Ulaşma oranı, temsilcinin cevaplanan aramalarının toplam
              aramalarına oranıdır.
            </p>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        {/* Bugünkü hatırlatmalar */}
        <Card>
          <CardHeader
            title="Bugünkü hatırlatmalar"
            subtitle={`${openToday.length} açık · ${overdue.length} geciken`}
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
            {[...overdue, ...openToday].slice(0, 6).map((r) => {
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
                        : "bg-gold-50 text-gold-700"
                    }`}
                  >
                    <IconClock className="h-4 w-4" />
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
                      {isAdmin ? ` · ${agentName(r.agentId)}` : ""}
                    </p>
                  </div>
                  <span
                    className={`font-mono text-xs font-semibold ${
                      late ? "text-danger-600" : "text-ink-700"
                    }`}
                  >
                    {formatTime(r.dueAt)}
                    {late ? " · gecikti" : ""}
                  </span>
                  <button
                    onClick={() => completeReminder(r.id)}
                    className="rounded-lg p-1.5 text-ink-300 transition-colors hover:bg-gold-50 hover:text-gold-700"
                    title="Tamamlandı işaretle"
                  >
                    <IconCheck className="h-4 w-4" />
                  </button>
                </li>
              );
            })}
            {openToday.length === 0 && overdue.length === 0 ? (
              <li className="px-5 py-8 text-center text-sm text-ink-400">
                Bugün için açık hatırlatma kalmadı.
              </li>
            ) : null}
          </ul>
        </Card>

        {/* Son aramalar */}
        <Card>
          <CardHeader
            title="Son aramalar"
            subtitle="Bugün kaydedilen görüşmeler"
          />
          <ul className="divide-y divide-ink-50">
            {scopedCalls.slice(0, 6).map((c) => (
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
                  <p className="truncate text-xs text-ink-400">
                    {isAdmin ? `${agentName(c.agentId)} · ` : ""}
                    {c.note}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  <StatusBadge status={c.result} />
                  <span className="font-mono text-[11px] text-ink-400">
                    {formatTime(c.at)}
                  </span>
                </div>
              </li>
            ))}
            {scopedCalls.length === 0 ? (
              <li className="px-5 py-8 text-center text-sm text-ink-400">
                Bugün henüz arama kaydı girilmedi.
              </li>
            ) : null}
          </ul>
        </Card>
      </div>
    </div>
  );
}
