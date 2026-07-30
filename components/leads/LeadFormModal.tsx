"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Field, MoneyInput, Select, TextArea, TextInput } from "@/components/ui/Field";
import { Modal } from "@/components/ui/Modal";
import { ALL_SOURCES, ALL_STATUSES, SOURCE_LABELS, STATUS_LABELS } from "@/lib/labels";
import { useData } from "@/lib/store/DataProvider";
import type { Block, Lead, LeadSource, LeadStatus, UnitType } from "@/lib/types";

const BLOCKS: Block[] = ["A", "B", "C"];
const UNIT_TYPES: UnitType[] = ["1+1", "2+1", "3+1"];

interface FormState {
  name: string;
  phone: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  block: "" | Block;
  unitNo: string;
  unitType: "" | UnitType;
  budget: string;
  assignedTo: string;
  note: string;
}

function emptyForm(defaultAgent: string): FormState {
  return {
    name: "",
    phone: "",
    email: "",
    status: "formu-dolduran",
    source: "instagram-form",
    block: "",
    unitNo: "",
    unitType: "",
    budget: "",
    assignedTo: defaultAgent,
    note: "",
  };
}

export function LeadFormModal({
  open,
  onClose,
  lead,
}: {
  open: boolean;
  onClose: () => void;
  lead?: Lead;
}) {
  const { users, role, currentUser, addLead, updateLead } = useData();
  const agents = users.filter((u) => u.role === "temsilci");
  const defaultAgent =
    role === "temsilci" ? currentUser.id : (agents[0]?.id ?? "");

  const [form, setForm] = useState<FormState>(emptyForm(defaultAgent));

  useEffect(() => {
    if (!open) return;
    if (lead) {
      setForm({
        name: lead.name,
        phone: lead.phone,
        email: lead.email ?? "",
        status: lead.status,
        source: lead.source,
        block: lead.block ?? "",
        unitNo: lead.unitNo !== undefined ? String(lead.unitNo) : "",
        unitType: lead.unitType ?? "",
        budget: lead.budget !== undefined ? String(lead.budget) : "",
        assignedTo: lead.assignedTo,
        note: lead.note ?? "",
      });
    } else {
      setForm(emptyForm(defaultAgent));
    }
  }, [open, lead, defaultAgent]);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const valid = form.name.trim().length >= 2 && form.phone.trim().length >= 7;

  const submit = () => {
    if (!valid) return;
    const payload = {
      name: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim() || undefined,
      status: form.status,
      source: form.source,
      block: form.block || undefined,
      unitNo: form.unitNo ? Number(form.unitNo) : undefined,
      unitType: form.unitType || undefined,
      budget: form.budget ? Number(form.budget) : undefined,
      assignedTo: form.assignedTo,
      note: form.note.trim() || undefined,
    };
    if (lead) {
      updateLead(lead.id, payload);
    } else {
      addLead(payload);
    }
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={lead ? "Müşteriyi düzenle" : "Yeni müşteri"}
      subtitle={
        lead
          ? `${lead.name} kaydında değişiklik yapıyorsunuz`
          : "Kayıt, seçilen temsilcinin listesine düşer"
      }
      wide
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Ad soyad">
          <TextInput
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="Örn. Mehmet K."
          />
        </Field>
        <Field label="Telefon">
          <TextInput
            value={form.phone}
            onChange={(e) => set("phone", e.target.value)}
            placeholder="05xx xxx xx xx"
            className="font-mono"
          />
        </Field>
        <Field label="E-posta (isteğe bağlı)">
          <TextInput
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            placeholder="ornek@eposta.com"
          />
        </Field>
        <Field label="Durum">
          <Select
            value={form.status}
            onChange={(e) => set("status", e.target.value as LeadStatus)}
          >
            {ALL_STATUSES.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABELS[s]}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Kaynak">
          <Select
            value={form.source}
            onChange={(e) => set("source", e.target.value as LeadSource)}
          >
            {ALL_SOURCES.map((s) => (
              <option key={s} value={s}>
                {SOURCE_LABELS[s]}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Atanan temsilci">
          <Select
            value={form.assignedTo}
            onChange={(e) => set("assignedTo", e.target.value)}
            disabled={role === "temsilci"}
          >
            {agents.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </Select>
        </Field>
        <div className="grid grid-cols-3 gap-3 sm:col-span-2">
          <Field label="Blok">
            <Select
              value={form.block}
              onChange={(e) => set("block", e.target.value as "" | Block)}
            >
              <option value="">Seçilmedi</option>
              {BLOCKS.map((b) => (
                <option key={b} value={b}>
                  {b} Blok
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Daire no">
            <TextInput
              value={form.unitNo}
              onChange={(e) =>
                set("unitNo", e.target.value.replace(/\D/g, ""))
              }
              placeholder="3"
              className="font-mono"
            />
          </Field>
          <Field label="Daire tipi">
            <Select
              value={form.unitType}
              onChange={(e) =>
                set("unitType", e.target.value as "" | UnitType)
              }
            >
              <option value="">Seçilmedi</option>
              {UNIT_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </Select>
          </Field>
        </div>
        <Field label="Bütçe (₺)">
          <MoneyInput
            value={form.budget}
            onValueChange={(d) => set("budget", d)}
            placeholder="3.450.000"
          />
        </Field>
        <div className="sm:col-span-2">
          <Field label="Not">
            <TextArea
              value={form.note}
              onChange={(e) => set("note", e.target.value)}
              placeholder="Görüşme notu, tercih edilen saat aralığı vb."
            />
          </Field>
        </div>
      </div>
      <div className="mt-5 flex justify-end gap-2 border-t border-ink-100 pt-4">
        <Button variant="secondary" onClick={onClose}>
          Vazgeç
        </Button>
        <Button variant="gold" onClick={submit} disabled={!valid}>
          {lead ? "Değişiklikleri kaydet" : "Müşteriyi ekle"}
        </Button>
      </div>
    </Modal>
  );
}
