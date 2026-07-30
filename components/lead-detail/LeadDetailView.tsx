"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader } from "@/components/ui/Card";
import { Field, Select, TextArea, TextInput } from "@/components/ui/Field";
import {
  IconArrowRight,
  IconBell,
  IconClock,
  IconEdit,
  IconPhone,
  IconPrinter,
} from "@/components/ui/Icons";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Avatar } from "@/components/ui/Avatar";
import { LeadFormModal } from "@/components/leads/LeadFormModal";
import {
  formatDate,
  formatDateTime,
  formatMoney,
  formatPhone,
  formatTime,
} from "@/lib/format";
import {
  ALL_STATUSES,
  REMINDER_TYPE_LABELS,
  SOURCE_LABELS,
  STATUS_LABELS,
} from "@/lib/labels";
import {
  callsForLead,
  plansForUnit,
  remindersForLead,
} from "@/lib/queries";
import { useData } from "@/lib/store/DataProvider";
import type { LeadStatus, ReminderType } from "@/lib/types";

export function LeadDetailView({ leadId }: { leadId: string }) {
  const { leads, calls, reminders, plans, printLogs, users, currentUser, role, addCall, logPrint } =
    useData();

  const [editOpen, setEditOpen] = useState(false);
  const [result, setResult] = useState<LeadStatus>("arandi");
  const [note, setNote] = useState("");
  const [nextDate, setNextDate] = useState("");
  const [nextTime, setNextTime] = useState("");
  const [remType, setRemType] = useState<ReminderType>("arama");
  const [flash, setFlash] = useState<string | null>(null);

  const lead = leads.find((l) => l.id === leadId);

  if (!lead || (role === "temsilci" && lead.assignedTo !== currentUser.id)) {
    return (
      <Card className="mx-auto mt-10 max-w-md p-8 text-center">
        <h2 className="text-base font-semibold text-ink-900">
          Kayıt bulunamadı
        </h2>
        <p className="mt-2 text-sm text-ink-400">
          Bu müşteri silinmiş olabilir veya görüntüleme yetkiniz yok.
        </p>
        <Link
          href="/musteriler"
          className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-gold-700 hover:text-gold-600"
        >
          Müşteri listesine dön <IconArrowRight className="h-4 w-4" />
        </Link>
      </Card>
    );
  }

  const leadCalls = callsForLead(calls, lead.id);
  const leadReminders = remindersForLead(reminders, lead.id).filter(
    (r) => !r.done
  );
  const unitPlans = plansForUnit(plans, lead.block, lead.unitType);
  const fallbackPlans =
    unitPlans.length > 0 ? unitPlans : plansForUnit(plans, undefined, lead.unitType);
  const leadPrints = printLogs
    .filter((p) => p.leadId === lead.id)
    .sort((a, b) => b.at.localeCompare(a.at));

  const agent = users.find((u) => u.id === lead.assignedTo);
  const userName = (id: string) => users.find((u) => u.id === id)?.name ?? "·";
  const planName = (id: string) => plans.find((p) => p.id === id)?.name ?? "·";

  const submitCall = () => {
    if (!note.trim()) return;
    let nextCallAt: string | undefined;
    if (nextDate && nextTime) {
      nextCallAt = new Date(`${nextDate}T${nextTime}:00`).toISOString();
    } else if (nextDate) {
      nextCallAt = new Date(`${nextDate}T09:00:00`).toISOString();
    }
    addCall({
      leadId: lead.id,
      result,
      note: note.trim(),
      nextCallAt,
      reminderType: remType,
    });
    setNote("");
    setNextDate("");
    setNextTime("");
    setFlash(
      nextCallAt
        ? "Arama kaydedildi, sonraki arama için hatırlatma otomatik oluşturuldu."
        : "Arama kaydedildi."
    );
    window.setTimeout(() => setFlash(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Üst kart: kimlik ve özet */}
      <Card className="p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <Avatar name={lead.name} size="lg" />
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-xl font-semibold text-ink-900">
                  {lead.name}
                </h2>
                <StatusBadge status={lead.status} />
              </div>
              <p className="mt-1 tabular text-sm text-ink-500">
                {formatPhone(lead.phone)}
                {lead.email ? (
                  <span className="ml-3 font-sans text-ink-400">{lead.email}</span>
                ) : null}
              </p>
            </div>
          </div>
          <Button variant="secondary" size="sm" onClick={() => setEditOpen(true)}>
            <IconEdit className="h-4 w-4" /> Düzenle
          </Button>
        </div>

        <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-ink-100 pt-5 text-sm lg:grid-cols-4">
          <div>
            <dt className="text-xs text-ink-400">Kaynak</dt>
            <dd className="mt-1 font-medium text-ink-900">
              {SOURCE_LABELS[lead.source]}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-ink-400">İlgilendiği daire</dt>
            <dd className="mt-1 font-medium text-ink-900">
              {lead.block
                ? `${lead.block} Blok · Daire ${lead.unitNo ?? "·"} · ${lead.unitType ?? ""}`
                : (lead.unitType ?? "Belirlenmedi")}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-ink-400">Bütçe</dt>
            <dd className="tabular mt-1 font-semibold text-ink-900">
              {lead.budget !== undefined ? formatMoney(lead.budget) : "Belirtilmedi"}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-ink-400">Atanan temsilci</dt>
            <dd className="mt-1 flex items-center gap-2 font-medium text-ink-900">
              {agent ? (
                <>
                  <Avatar name={agent.name} size="sm" /> {agent.name}
                </>
              ) : (
                "·"
              )}
            </dd>
          </div>
        </dl>
        {lead.note ? (
          <p className="mt-4 rounded-lg bg-gold-50 px-4 py-3 text-sm text-gold-900 ring-1 ring-inset ring-gold-100">
            {lead.note}
          </p>
        ) : null}
      </Card>

      <div className="grid gap-6 xl:grid-cols-3">
        {/* Sol: arama geçmişi */}
        <div className="space-y-6 xl:col-span-2">
          <Card>
            <CardHeader
              title="Yeni arama kaydı"
              subtitle="Sonraki arama tarihi girildiğinde hatırlatma otomatik oluşur"
            />
            <div className="grid grid-cols-1 gap-4 px-5 py-4 sm:grid-cols-2">
              <Field label="Görüşme sonucu">
                <Select
                  value={result}
                  onChange={(e) => setResult(e.target.value as LeadStatus)}
                >
                  {ALL_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {STATUS_LABELS[s]}
                    </option>
                  ))}
                </Select>
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Sonraki arama tarihi">
                  <TextInput
                    type="date"
                    value={nextDate}
                    onChange={(e) => setNextDate(e.target.value)}
                  />
                </Field>
                <Field label="Saat">
                  <TextInput
                    type="time"
                    value={nextTime}
                    onChange={(e) => setNextTime(e.target.value)}
                  />
                </Field>
              </div>
              <div className="sm:col-span-2">
                <Field label="Not">
                  <TextArea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Örn. Meşgul, 17:00'den sonra arayın"
                    rows={2}
                  />
                </Field>
              </div>
              <Field label="Hatırlatma türü">
                <Select
                  value={remType}
                  onChange={(e) => setRemType(e.target.value as ReminderType)}
                >
                  <option value="arama">Geri arama</option>
                  <option value="randevu">Satış ofisi randevusu</option>
                </Select>
              </Field>
              <div className="flex items-end justify-end">
                <Button variant="gold" onClick={submitCall} disabled={!note.trim()}>
                  <IconPhone className="h-4 w-4" /> Aramayı kaydet
                </Button>
              </div>
            </div>
            {flash ? (
              <p className="border-t border-gold-100 bg-gold-50 px-5 py-2.5 text-xs font-medium text-gold-800">
                {flash}
              </p>
            ) : null}
          </Card>

          <Card>
            <CardHeader
              title="Arama geçmişi"
              subtitle={`${leadCalls.length} görüşme · en yeni üstte`}
            />
            {leadCalls.length === 0 ? (
              <p className="px-5 py-8 text-center text-sm text-ink-400">
                Henüz arama kaydı yok. İlk görüşmeyi yukarıdan ekleyin.
              </p>
            ) : (
              <ol className="px-5 py-4">
                {leadCalls.map((c, i) => (
                  <li key={c.id} className="relative flex gap-4 pb-6 last:pb-1">
                    {i < leadCalls.length - 1 ? (
                      <span className="absolute left-[15px] top-9 h-[calc(100%-28px)] w-px bg-ink-100" />
                    ) : null}
                    <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink-900 text-gold-400">
                      <IconPhone className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <StatusBadge status={c.result} />
                        <span className="tabular text-xs text-ink-400">
                          {formatDateTime(c.at)}
                        </span>
                        <span className="text-xs text-ink-400">
                          · {userName(c.agentId)}
                        </span>
                      </div>
                      <p className="mt-1.5 text-sm text-ink-700">{c.note}</p>
                      {c.nextCallAt ? (
                        <p className="mt-1.5 inline-flex items-center gap-1.5 rounded-md bg-ink-50 px-2 py-1 text-xs text-ink-500">
                          <IconBell className="h-3.5 w-3.5 text-gold-600" />
                          Sonraki arama: {formatDateTime(c.nextCallAt)}
                        </p>
                      ) : null}
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </Card>
        </div>

        {/* Sağ: hatırlatmalar + ödeme planı */}
        <div className="space-y-6">
          <Card>
            <CardHeader title="Açık hatırlatmalar" />
            {leadReminders.length === 0 ? (
              <p className="px-5 py-6 text-center text-sm text-ink-400">
                Bu müşteri için açık hatırlatma yok.
              </p>
            ) : (
              <ul className="divide-y divide-ink-50">
                {leadReminders.map((r) => (
                  <li key={r.id} className="flex items-start gap-3 px-5 py-3">
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gold-50 text-gold-700">
                      <IconClock className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-ink-900">
                        {REMINDER_TYPE_LABELS[r.type]}
                      </p>
                      <p className="tabular text-xs text-ink-500">
                        {formatDate(r.dueAt)} · {formatTime(r.dueAt)}
                      </p>
                      {r.note ? (
                        <p className="mt-1 text-xs text-ink-400">{r.note}</p>
                      ) : null}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card>
            <CardHeader
              title="Ödeme planı"
              subtitle={
                lead.block
                  ? `${lead.block} Blok · ${lead.unitType ?? ""} için tanımlı planlar`
                  : "Daire tipine göre uygun planlar"
              }
            />
            {fallbackPlans.length === 0 ? (
              <p className="px-5 py-6 text-center text-sm text-ink-400">
                Uygun plan bulunamadı. Kütüphaneden plan tanımlayabilirsiniz.
              </p>
            ) : (
              <ul className="divide-y divide-ink-50">
                {fallbackPlans.map((p) => (
                  <li key={p.id} className="px-5 py-4">
                    <p className="text-sm font-semibold text-ink-900">{p.name}</p>
                    <p className="tabular mt-1 text-sm font-semibold text-ink-700">
                      {formatMoney(p.listPrice)}
                    </p>
                    <p className="mt-0.5 text-xs text-ink-400">
                      %{p.downPaymentPct} peşinat + {p.installmentMonths} ay taksit
                      {p.cashPrice
                        ? ` · peşin ${formatMoney(p.cashPrice)}`
                        : ""}
                    </p>
                    <div className="mt-3">
                      <Link
                        href={`/yazdir/plan/${p.id}?lead=${lead.id}`}
                        onClick={() => logPrint(p.id, lead.id)}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-ink-900 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-ink-800"
                      >
                        <IconPrinter className="h-4 w-4" /> Yazdır / PDF indir
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card>
            <CardHeader title="Çıktı geçmişi" subtitle="Bu müşteri için alınan plan çıktıları" />
            {leadPrints.length === 0 ? (
              <p className="px-5 py-6 text-center text-sm text-ink-400">
                Henüz çıktı alınmadı.
              </p>
            ) : (
              <ul className="divide-y divide-ink-50">
                {leadPrints.map((p) => (
                  <li key={p.id} className="px-5 py-3">
                    <p className="text-sm text-ink-700">{planName(p.planId)}</p>
                    <p className="mt-0.5 tabular text-xs text-ink-400">
                      {formatDateTime(p.at)} · {userName(p.agentId)}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </div>

      <LeadFormModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        lead={lead}
      />
    </div>
  );
}
