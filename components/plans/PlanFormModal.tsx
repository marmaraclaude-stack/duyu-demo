"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Field, MoneyInput, Select, TextArea, TextInput } from "@/components/ui/Field";
import { Modal } from "@/components/ui/Modal";
import { useData } from "@/lib/store/DataProvider";
import type { Block, PaymentPlan, UnitType } from "@/lib/types";

const BLOCKS: Block[] = ["A", "B", "C"];
const UNIT_TYPES: UnitType[] = ["1+1", "2+1", "3+1"];

interface FormState {
  name: string;
  block: Block;
  unitType: UnitType;
  listPrice: string;
  downPaymentPct: string;
  installmentMonths: string;
  cashPrice: string;
  highlights: string;
}

const EMPTY: FormState = {
  name: "",
  block: "A",
  unitType: "2+1",
  listPrice: "",
  downPaymentPct: "25",
  installmentMonths: "36",
  cashPrice: "",
  highlights: "",
};

export function PlanFormModal({
  open,
  onClose,
  plan,
}: {
  open: boolean;
  onClose: () => void;
  plan?: PaymentPlan;
}) {
  const { addPlan, updatePlan } = useData();
  const [form, setForm] = useState<FormState>(EMPTY);

  useEffect(() => {
    if (!open) return;
    if (plan) {
      setForm({
        name: plan.name,
        block: plan.block,
        unitType: plan.unitType,
        listPrice: String(plan.listPrice),
        downPaymentPct: String(plan.downPaymentPct),
        installmentMonths: String(plan.installmentMonths),
        cashPrice: plan.cashPrice !== undefined ? String(plan.cashPrice) : "",
        highlights: plan.highlights.join("\n"),
      });
    } else {
      setForm(EMPTY);
    }
  }, [open, plan]);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const pct = Number(form.downPaymentPct);
  const months = Number(form.installmentMonths);
  const valid =
    form.name.trim().length >= 3 &&
    Number(form.listPrice) > 0 &&
    pct >= 1 &&
    pct <= 99 &&
    months >= 1 &&
    months <= 120 &&
    (!form.cashPrice || Number(form.cashPrice) < Number(form.listPrice));

  const submit = () => {
    if (!valid) return;
    const payload = {
      name: form.name.trim(),
      block: form.block,
      unitType: form.unitType,
      listPrice: Number(form.listPrice),
      downPaymentPct: Number(form.downPaymentPct),
      installmentMonths: Number(form.installmentMonths),
      cashPrice: form.cashPrice ? Number(form.cashPrice) : undefined,
      highlights: form.highlights
        .split("\n")
        .map((h) => h.trim())
        .filter(Boolean),
    };
    if (plan) {
      updatePlan(plan.id, payload);
    } else {
      addPlan(payload);
    }
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={plan ? "Planı düzenle" : "Yeni ödeme planı"}
      subtitle="Planlar blok ve daire tipine göre müşteri kartlarında listelenir"
      wide
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Field label="Plan adı">
            <TextInput
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="Örn. B Blok · 3+1 · Prestij Plan"
            />
          </Field>
        </div>
        <Field label="Blok">
          <Select
            value={form.block}
            onChange={(e) => set("block", e.target.value as Block)}
          >
            {BLOCKS.map((b) => (
              <option key={b} value={b}>
                {b} Blok
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Daire tipi">
          <Select
            value={form.unitType}
            onChange={(e) => set("unitType", e.target.value as UnitType)}
          >
            {UNIT_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Liste fiyatı (₺)">
          <MoneyInput
            value={form.listPrice}
            onValueChange={(d) => set("listPrice", d)}
            placeholder="4.750.000"
          />
        </Field>
        <Field
          label="Peşin ödeme özel fiyatı (₺, isteğe bağlı)"
          hint={
            form.cashPrice &&
            form.listPrice &&
            Number(form.cashPrice) >= Number(form.listPrice)
              ? "Peşin fiyat liste fiyatının altında olmalı"
              : undefined
          }
        >
          <MoneyInput
            value={form.cashPrice}
            onValueChange={(d) => set("cashPrice", d)}
            placeholder="4.390.000"
          />
        </Field>
        <Field label="Peşinat oranı (%)" hint="1 ile 99 arası">
          <TextInput
            value={form.downPaymentPct}
            onChange={(e) =>
              set("downPaymentPct", e.target.value.replace(/\D/g, "").slice(0, 2))
            }
            className="tabular"
          />
        </Field>
        <Field label="Taksit süresi (ay)" hint="1 ile 120 arası">
          <TextInput
            value={form.installmentMonths}
            onChange={(e) =>
              set("installmentMonths", e.target.value.replace(/\D/g, "").slice(0, 3))
            }
            className="tabular"
          />
        </Field>
        <div className="sm:col-span-2">
          <Field
            label="Öne çıkanlar"
            hint="Her satır ayrı bir madde olarak listelenir"
          >
            <TextArea
              value={form.highlights}
              onChange={(e) => set("highlights", e.target.value)}
              placeholder={"%25 peşinat + 36 ay eşit taksit\nPeşin ödemede özel fiyat"}
            />
          </Field>
        </div>
      </div>
      <div className="mt-5 flex justify-end gap-2 border-t border-ink-100 pt-4">
        <Button variant="secondary" onClick={onClose}>
          Vazgeç
        </Button>
        <Button variant="gold" onClick={submit} disabled={!valid}>
          {plan ? "Değişiklikleri kaydet" : "Planı ekle"}
        </Button>
      </div>
    </Modal>
  );
}
