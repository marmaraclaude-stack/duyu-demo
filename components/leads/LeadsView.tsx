"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Field, MoneyInput, TextInput } from "@/components/ui/Field";
import {
  IconDownload,
  IconEdit,
  IconFilter,
  IconPlus,
  IconSearch,
  IconTrash,
  IconX,
} from "@/components/ui/Icons";
import { Modal } from "@/components/ui/Modal";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Avatar } from "@/components/ui/Avatar";
import { downloadCsv } from "@/lib/csv";
import { formatDate, formatDateOnly, formatMoney, formatPhone } from "@/lib/format";
import {
  ALL_SOURCES,
  ALL_STATUSES,
  SOURCE_LABELS,
  SOURCE_SHORT_LABELS,
  STATUS_LABELS,
} from "@/lib/labels";
import { filterLeads, visibleLeads } from "@/lib/queries";
import { useData } from "@/lib/store/DataProvider";
import type {
  Block,
  Lead,
  LeadFilterParams,
  LeadSource,
  LeadStatus,
  UnitType,
} from "@/lib/types";
import { LeadFormModal } from "./LeadFormModal";

const BLOCKS: Block[] = ["A", "B", "C"];
const UNIT_TYPES: UnitType[] = ["1+1", "2+1", "3+1"];

function toggleItem<T>(arr: T[] | undefined, item: T): T[] | undefined {
  const cur = arr ?? [];
  const next = cur.includes(item)
    ? cur.filter((x) => x !== item)
    : [...cur, item];
  return next.length ? next : undefined;
}

export function LeadsView({ initialQuery }: { initialQuery: string }) {
  const {
    leads,
    users,
    currentUser,
    role,
    savedFilters,
    saveFilter,
    removeSavedFilter,
    deleteLead,
    logExport,
  } = useData();

  const [params, setParams] = useState<LeadFilterParams>(
    initialQuery ? { q: initialQuery } : {}
  );
  const [panelOpen, setPanelOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Lead | undefined>(undefined);
  const [deleting, setDeleting] = useState<Lead | undefined>(undefined);
  const [saveOpen, setSaveOpen] = useState(false);
  const [saveName, setSaveName] = useState("");
  const [activeSaved, setActiveSaved] = useState<string | null>(null);

  const isAdmin = role === "yonetici";
  const agents = users.filter((u) => u.role === "temsilci");

  const scope = visibleLeads(leads, currentUser.id, role);
  const filtered = useMemo(
    () =>
      filterLeads(scope, params).sort((a, b) =>
        b.updatedAt.localeCompare(a.updatedAt)
      ),
    [scope, params]
  );

  const agentName = (id: string) =>
    users.find((u) => u.id === id)?.name ?? "·";

  const set = (patch: Partial<LeadFilterParams>) => {
    setActiveSaved(null);
    setParams((p) => ({ ...p, ...patch }));
  };

  const applySaved = (id: string) => {
    const sf = savedFilters.find((f) => f.id === id);
    if (!sf) return;
    setParams(sf.params);
    setActiveSaved(id);
  };

  const clearAll = () => {
    setParams({});
    setActiveSaved(null);
  };

  // Aktif filtre çipleri: her biri tek tıkla kaldırılabilir
  const chips: { key: string; label: string; onRemove: () => void }[] = [];
  if (params.q)
    chips.push({
      key: "q",
      label: `Arama: ${params.q}`,
      onRemove: () => set({ q: undefined }),
    });
  for (const s of params.status ?? [])
    chips.push({
      key: `st-${s}`,
      label: STATUS_LABELS[s],
      onRemove: () => set({ status: toggleItem(params.status, s) }),
    });
  for (const a of params.agent ?? [])
    chips.push({
      key: `ag-${a}`,
      label: agentName(a),
      onRemove: () => set({ agent: toggleItem(params.agent, a) }),
    });
  for (const b of params.block ?? [])
    chips.push({
      key: `bl-${b}`,
      label: `${b} Blok`,
      onRemove: () => set({ block: toggleItem(params.block, b) }),
    });
  for (const t of params.unitType ?? [])
    chips.push({
      key: `ut-${t}`,
      label: t,
      onRemove: () => set({ unitType: toggleItem(params.unitType, t) }),
    });
  for (const s of params.source ?? [])
    chips.push({
      key: `so-${s}`,
      label: SOURCE_SHORT_LABELS[s],
      onRemove: () => set({ source: toggleItem(params.source, s) }),
    });
  if (params.budgetMin !== undefined)
    chips.push({
      key: "bmin",
      label: `Bütçe ≥ ${formatMoney(params.budgetMin)}`,
      onRemove: () => set({ budgetMin: undefined }),
    });
  if (params.budgetMax !== undefined)
    chips.push({
      key: "bmax",
      label: `Bütçe ≤ ${formatMoney(params.budgetMax)}`,
      onRemove: () => set({ budgetMax: undefined }),
    });
  if (params.dateFrom)
    chips.push({
      key: "df",
      label: `Başlangıç: ${formatDateOnly(params.dateFrom)}`,
      onRemove: () => set({ dateFrom: undefined }),
    });
  if (params.dateTo)
    chips.push({
      key: "dt",
      label: `Bitiş: ${formatDateOnly(params.dateTo)}`,
      onRemove: () => set({ dateTo: undefined }),
    });

  const exportCsv = () => {
    downloadCsv(
      "duyu-crm-musteriler.csv",
      [
        "Ad soyad",
        "Telefon",
        "E-posta",
        "Durum",
        "Kaynak",
        "Blok",
        "Daire",
        "Tip",
        "Bütçe (₺)",
        "Temsilci",
        "Kayıt tarihi",
        "Not",
      ],
      filtered.map((l) => [
        l.name,
        l.phone,
        l.email ?? "",
        STATUS_LABELS[l.status],
        SOURCE_LABELS[l.source],
        l.block ? `${l.block} Blok` : "",
        l.unitNo ?? "",
        l.unitType ?? "",
        l.budget ?? "",
        agentName(l.assignedTo),
        formatDate(l.createdAt),
        l.note ?? "",
      ])
    );
    logExport(`Müşteri listesi (${filtered.length} kayıt)`);
  };

  const checkboxCls =
    "h-4 w-4 rounded border-ink-300 accent-[#C9A227] focus:ring-gold-500";

  return (
    <div className="space-y-4">
      {/* Üst araç çubuğu */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-[220px] flex-1 sm:max-w-xs">
          <IconSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <TextInput
            value={params.q ?? ""}
            onChange={(e) => set({ q: e.target.value || undefined })}
            placeholder="Ad, telefon veya e-posta"
            className="pl-9"
          />
        </div>
        <Button
          variant={panelOpen ? "primary" : "secondary"}
          onClick={() => setPanelOpen((v) => !v)}
        >
          <IconFilter className="h-4 w-4" /> Filtreler
        </Button>
        <Button variant="secondary" onClick={exportCsv}>
          <IconDownload className="h-4 w-4" /> CSV/Excel&apos;e aktar
        </Button>
        <Button
          variant="gold"
          onClick={() => {
            setEditing(undefined);
            setFormOpen(true);
          }}
        >
          <IconPlus className="h-4 w-4" /> Yeni müşteri
        </Button>
      </div>

      {/* Kayıtlı listeler */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="section-label">Kayıtlı listeler</span>
        {savedFilters.map((sf) => (
          <span
            key={sf.id}
            className={`inline-flex items-center overflow-hidden rounded-full text-xs font-medium ring-1 ring-inset transition-colors ${
              activeSaved === sf.id
                ? "bg-ink-900 text-gold-400 ring-ink-900"
                : "bg-white text-ink-600 ring-ink-200 hover:bg-ink-50"
            }`}
          >
            <button className="py-1 pl-3 pr-1.5" onClick={() => applySaved(sf.id)}>
              {sf.name}
            </button>
            <button
              onClick={() => {
                removeSavedFilter(sf.id);
                if (activeSaved === sf.id) clearAll();
              }}
              className={`py-1 pl-0.5 pr-2 ${
                activeSaved === sf.id
                  ? "text-ink-400 hover:text-white"
                  : "text-ink-300 hover:text-danger-600"
              }`}
              title="Kayıtlı listeyi sil"
            >
              <IconX className="h-3 w-3" />
            </button>
          </span>
        ))}
        <button
          onClick={() => {
            setSaveName("");
            setSaveOpen(true);
          }}
          className="text-xs font-medium text-gold-700 hover:text-gold-600"
        >
          + Filtreyi kaydet
        </button>
      </div>

      {/* Gelişmiş filtre paneli */}
      {panelOpen ? (
        <Card className="p-5">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            <div>
              <p className="section-label mb-2">Durum</p>
              <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                {ALL_STATUSES.map((s) => (
                  <label key={s} className="flex items-center gap-2 text-sm text-ink-600">
                    <input
                      type="checkbox"
                      className={checkboxCls}
                      checked={(params.status ?? []).includes(s)}
                      onChange={() => set({ status: toggleItem(params.status, s) })}
                    />
                    {STATUS_LABELS[s]}
                  </label>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              {isAdmin ? (
                <div>
                  <p className="section-label mb-2">Temsilci</p>
                  <div className="space-y-1.5">
                    {agents.map((a) => (
                      <label key={a.id} className="flex items-center gap-2 text-sm text-ink-600">
                        <input
                          type="checkbox"
                          className={checkboxCls}
                          checked={(params.agent ?? []).includes(a.id)}
                          onChange={() => set({ agent: toggleItem(params.agent, a.id) })}
                        />
                        {a.name}
                      </label>
                    ))}
                  </div>
                </div>
              ) : null}
              <div>
                <p className="section-label mb-2">Blok</p>
                <div className="flex gap-3">
                  {BLOCKS.map((b) => (
                    <label key={b} className="flex items-center gap-2 text-sm text-ink-600">
                      <input
                        type="checkbox"
                        className={checkboxCls}
                        checked={(params.block ?? []).includes(b)}
                        onChange={() => set({ block: toggleItem(params.block, b) })}
                      />
                      {b}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <p className="section-label mb-2">Daire tipi</p>
                <div className="flex gap-3">
                  {UNIT_TYPES.map((t) => (
                    <label key={t} className="flex items-center gap-2 text-sm text-ink-600">
                      <input
                        type="checkbox"
                        className={checkboxCls}
                        checked={(params.unitType ?? []).includes(t)}
                        onChange={() => set({ unitType: toggleItem(params.unitType, t) })}
                      />
                      {t}
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <p className="section-label mb-2">Kaynak</p>
                <div className="space-y-1.5">
                  {ALL_SOURCES.map((s) => (
                    <label key={s} className="flex items-center gap-2 text-sm text-ink-600">
                      <input
                        type="checkbox"
                        className={checkboxCls}
                        checked={(params.source ?? []).includes(s)}
                        onChange={() => set({ source: toggleItem(params.source, s) })}
                      />
                      {SOURCE_LABELS[s]}
                    </label>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Bütçe alt sınır (₺)">
                  <MoneyInput
                    value={params.budgetMin !== undefined ? String(params.budgetMin) : ""}
                    onValueChange={(d) =>
                      set({ budgetMin: d ? Number(d) : undefined })
                    }
                    placeholder="2.000.000"
                  />
                </Field>
                <Field label="Bütçe üst sınır (₺)">
                  <MoneyInput
                    value={params.budgetMax !== undefined ? String(params.budgetMax) : ""}
                    onValueChange={(d) =>
                      set({ budgetMax: d ? Number(d) : undefined })
                    }
                    placeholder="5.000.000"
                  />
                </Field>
                <Field label="Kayıt · başlangıç">
                  <TextInput
                    type="date"
                    value={params.dateFrom ?? ""}
                    onChange={(e) =>
                      set({ dateFrom: e.target.value || undefined })
                    }
                  />
                </Field>
                <Field label="Kayıt · bitiş">
                  <TextInput
                    type="date"
                    value={params.dateTo ?? ""}
                    onChange={(e) =>
                      set({ dateTo: e.target.value || undefined })
                    }
                  />
                </Field>
              </div>
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-2 border-t border-ink-100 pt-4">
            <Button variant="ghost" size="sm" onClick={clearAll}>
              Filtreleri temizle
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setSaveName("");
                setSaveOpen(true);
              }}
            >
              Filtreyi kaydet
            </Button>
          </div>
        </Card>
      ) : null}

      {/* Aktif filtre çipleri */}
      {chips.length > 0 ? (
        <div className="flex flex-wrap items-center gap-2">
          {chips.map((c) => (
            <span
              key={c.key}
              className="inline-flex items-center gap-1 rounded-full bg-gold-50 py-1 pl-3 pr-1.5 text-xs font-medium text-gold-800 ring-1 ring-inset ring-gold-200"
            >
              {c.label}
              <button
                onClick={c.onRemove}
                className="rounded-full p-0.5 hover:bg-gold-100"
                title="Filtreyi kaldır"
              >
                <IconX className="h-3 w-3" />
              </button>
            </span>
          ))}
          <button
            onClick={clearAll}
            className="text-xs font-medium text-ink-400 hover:text-ink-700"
          >
            Tümünü temizle
          </button>
        </div>
      ) : null}

      {/* Tablo */}
      <Card>
        <div className="flex items-center justify-between border-b border-ink-100 px-5 py-3">
          <p className="text-sm font-medium text-ink-700">
            {filtered.length} kayıt
            <span className="ml-2 text-xs font-normal text-ink-400">
              {isAdmin ? "tüm temsilciler" : "size atanan müşteriler"}
            </span>
          </p>
        </div>
        {filtered.length === 0 ? (
          <EmptyState
            title="Filtreye uyan kayıt bulunamadı"
            description="Filtreleri gevşetmeyi veya aramayı temizlemeyi deneyin."
            action={
              <Button variant="secondary" size="sm" onClick={clearAll}>
                Filtreleri temizle
              </Button>
            }
          />
        ) : (
          <div className="thin-scroll overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead>
                <tr className="border-b border-ink-100 text-xs text-ink-400">
                  <th className="px-5 py-3 font-medium">Müşteri</th>
                  <th className="px-4 py-3 font-medium">Durum</th>
                  <th className="px-4 py-3 font-medium">İlgilendiği daire</th>
                  <th className="px-4 py-3 font-medium">Bütçe</th>
                  <th className="px-4 py-3 font-medium">Kaynak</th>
                  {isAdmin ? (
                    <th className="px-4 py-3 font-medium">Temsilci</th>
                  ) : null}
                  <th className="px-4 py-3 font-medium">Kayıt</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-50">
                {filtered.map((l) => (
                  <tr key={l.id} className="group transition-colors hover:bg-ink-50/60">
                    <td className="px-5 py-3">
                      <Link href={`/musteriler/${l.id}`} className="block">
                        <span className="block font-medium text-ink-900 group-hover:text-gold-700">
                          {l.name}
                        </span>
                        <span className="block font-mono text-xs text-ink-400">
                          {formatPhone(l.phone)}
                        </span>
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={l.status} />
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-ink-600">
                      {l.block
                        ? `${l.block} Blok · Daire ${l.unitNo ?? "·"} · ${l.unitType ?? ""}`
                        : (l.unitType ?? "Belirlenmedi")}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 font-mono text-ink-900">
                      {l.budget !== undefined ? formatMoney(l.budget) : "·"}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-ink-600">
                      {SOURCE_SHORT_LABELS[l.source]}
                    </td>
                    {isAdmin ? (
                      <td className="whitespace-nowrap px-4 py-3">
                        <span className="flex items-center gap-2 text-ink-600">
                          <Avatar name={agentName(l.assignedTo)} size="sm" />
                          {agentName(l.assignedTo)}
                        </span>
                      </td>
                    ) : null}
                    <td className="whitespace-nowrap px-4 py-3 text-xs text-ink-400">
                      {formatDate(l.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                        <button
                          onClick={() => {
                            setEditing(l);
                            setFormOpen(true);
                          }}
                          className="rounded-lg p-1.5 text-ink-400 hover:bg-ink-100 hover:text-ink-800"
                          title="Düzenle"
                        >
                          <IconEdit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeleting(l)}
                          className="rounded-lg p-1.5 text-ink-400 hover:bg-danger-50 hover:text-danger-600"
                          title="Sil"
                        >
                          <IconTrash className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Ekle / düzenle modalı */}
      <LeadFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        lead={editing}
      />

      {/* Silme onayı */}
      <Modal
        open={deleting !== undefined}
        onClose={() => setDeleting(undefined)}
        title="Müşteriyi sil"
        subtitle="Bu işlem arama geçmişini ve hatırlatmaları da kaldırır"
      >
        <p className="text-sm text-ink-600">
          <span className="font-medium text-ink-900">{deleting?.name}</span>{" "}
          kaydını silmek istediğinize emin misiniz?
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setDeleting(undefined)}>
            Vazgeç
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              if (deleting) deleteLead(deleting.id);
              setDeleting(undefined);
            }}
          >
            Evet, sil
          </Button>
        </div>
      </Modal>

      {/* Filtre kaydetme */}
      <Modal
        open={saveOpen}
        onClose={() => setSaveOpen(false)}
        title="Filtreyi kaydet"
        subtitle="Kayıtlı listeler ekibin tamamında görünür"
      >
        <Field label="Liste adı">
          <TextInput
            value={saveName}
            onChange={(e) => setSaveName(e.target.value)}
            placeholder="Örn. Bu hafta aranacaklar"
            autoFocus
          />
        </Field>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setSaveOpen(false)}>
            Vazgeç
          </Button>
          <Button
            variant="gold"
            disabled={saveName.trim().length < 3}
            onClick={() => {
              saveFilter({ name: saveName.trim(), params });
              setSaveOpen(false);
            }}
          >
            Kaydet
          </Button>
        </div>
      </Modal>
    </div>
  );
}
