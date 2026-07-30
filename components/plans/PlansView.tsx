"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Select } from "@/components/ui/Field";
import { IconEdit, IconPlus, IconPrinter } from "@/components/ui/Icons";
import { formatDate, formatDateTime, formatMoney } from "@/lib/format";
import { can } from "@/lib/permissions";
import { useData } from "@/lib/store/DataProvider";
import type { Block, PaymentPlan, UnitType } from "@/lib/types";
import { PlanFormModal } from "./PlanFormModal";

export function PlansView() {
  const { plans, printLogs, users, leads, logPrint, role } = useData();
  const canManage = can(role, "plans.manage");
  const [blockFilter, setBlockFilter] = useState<"" | Block>("");
  const [typeFilter, setTypeFilter] = useState<"" | UnitType>("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<PaymentPlan | undefined>(undefined);

  const filtered = plans.filter(
    (p) =>
      (blockFilter === "" || p.block === blockFilter) &&
      (typeFilter === "" || p.unitType === typeFilter)
  );

  const userName = (id: string) => users.find((u) => u.id === id)?.name ?? "·";
  const leadName = (id?: string) =>
    id ? (leads.find((l) => l.id === id)?.name ?? "·") : "·";
  const planName = (id: string) => plans.find((p) => p.id === id)?.name ?? "·";

  const sortedLogs = [...printLogs].sort((a, b) => b.at.localeCompare(a.at));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        <div className="w-36 shrink-0">
          <Select
            value={blockFilter}
            onChange={(e) => setBlockFilter(e.target.value as "" | Block)}
            aria-label="Blok filtresi"
          >
            <option value="">Tüm bloklar</option>
            <option value="A">A Blok</option>
            <option value="B">B Blok</option>
            <option value="C">C Blok</option>
          </Select>
        </div>
        <div className="w-32 shrink-0">
          <Select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as "" | UnitType)}
            aria-label="Daire tipi filtresi"
          >
            <option value="">Tüm tipler</option>
            <option value="1+1">1+1</option>
            <option value="2+1">2+1</option>
            <option value="3+1">3+1</option>
          </Select>
        </div>
        <div className="flex-1" />
        {canManage ? (
          <Button
            variant="gold"
            onClick={() => {
              setEditing(undefined);
              setFormOpen(true);
            }}
          >
            <IconPlus className="h-4 w-4" /> Yeni plan
          </Button>
        ) : (
          <p className="text-xs text-ink-400">
            Plan ekleme ve düzenleme yönetici yetkisindedir
          </p>
        )}
      </div>

      {/* Plan kartları */}
      {filtered.length === 0 ? (
        <Card>
          <EmptyState
            title="Bu filtrede plan yok"
            description="Seçili blok ve daire tipi için tanımlı plan bulunmuyor."
            action={
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setBlockFilter("");
                  setTypeFilter("");
                }}
              >
                Filtreleri temizle
              </Button>
            }
          />
        </Card>
      ) : null}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((p) => {
          const down = Math.round((p.listPrice * p.downPaymentPct) / 100);
          const monthly = Math.round(
            (p.listPrice - down) / p.installmentMonths
          );
          return (
            <Card key={p.id} className="flex flex-col">
              <div className="flex items-start justify-between gap-3 px-5 pt-5">
                <div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-ink-900 px-2.5 py-0.5 text-[11px] font-medium text-gold-400">
                    {p.block} Blok · {p.unitType}
                  </span>
                  <h3 className="mt-2 text-sm font-semibold text-ink-900">
                    {p.name}
                  </h3>
                </div>
                {canManage ? (
                  <button
                    onClick={() => {
                      setEditing(p);
                      setFormOpen(true);
                    }}
                    className="rounded-lg p-1.5 text-ink-300 hover:bg-ink-100 hover:text-ink-700"
                    title="Planı düzenle"
                  >
                    <IconEdit className="h-4 w-4" />
                  </button>
                ) : null}
              </div>
              <div className="px-5 pt-4">
                <p className="font-serif text-3xl font-semibold text-ink-900">
                  {formatMoney(p.listPrice)}
                </p>
                <p className="mt-1 text-xs text-ink-400">
                  %{p.downPaymentPct} peşinat ({formatMoney(down)}) +{" "}
                  {p.installmentMonths} ay × {formatMoney(monthly)}
                </p>
                {p.cashPrice !== undefined ? (
                  <p className="mt-2 inline-flex rounded-md bg-gold-50 px-2.5 py-1 text-xs font-medium text-gold-800 ring-1 ring-inset ring-gold-200">
                    Peşin ödemede {formatMoney(p.cashPrice)}
                  </p>
                ) : null}
              </div>
              <ul className="flex-1 space-y-1.5 px-5 py-4">
                {p.highlights.map((h) => (
                  <li
                    key={h}
                    className="flex items-start gap-2 text-xs text-ink-500"
                  >
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-500" />
                    {h}
                  </li>
                ))}
              </ul>
              <div className="flex items-center justify-between border-t border-ink-100 px-5 py-3">
                <span className="text-[11px] text-ink-300">
                  Güncelleme: {formatDate(p.updatedAt)}
                </span>
                <Link
                  href={`/yazdir/plan/${p.id}`}
                  onClick={() => logPrint(p.id)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-ink-900 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-ink-800"
                >
                  <IconPrinter className="h-4 w-4" /> Yazdırılabilir görünüm
                </Link>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Çıktı geçmişi */}
      <Card>
        <CardHeader
          title="Çıktı geçmişi"
          subtitle="Hangi temsilci, hangi planı, ne zaman yazdırdı"
        />
        <div className="thin-scroll overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-ink-100 text-xs text-ink-400">
                <th className="px-5 py-3 font-medium">Plan</th>
                <th className="px-4 py-3 font-medium">Temsilci</th>
                <th className="px-4 py-3 font-medium">Müşteri</th>
                <th className="px-4 py-3 font-medium">Tarih</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-50">
              {sortedLogs.slice(0, 12).map((log) => (
                <tr key={log.id}>
                  <td className="px-5 py-3 text-ink-900">
                    {planName(log.planId)}
                  </td>
                  <td className="px-4 py-3 text-ink-600">
                    {userName(log.agentId)}
                  </td>
                  <td className="px-4 py-3 text-ink-600">
                    {log.leadId ? (
                      <Link
                        href={`/musteriler/${log.leadId}`}
                        className="hover:text-gold-700"
                      >
                        {leadName(log.leadId)}
                      </Link>
                    ) : (
                      "·"
                    )}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-ink-400">
                    {formatDateTime(log.at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <PlanFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        plan={editing}
      />
    </div>
  );
}
