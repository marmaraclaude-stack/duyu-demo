"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { IconPrinter } from "@/components/ui/Icons";
import { formatDate, formatMoney, formatPhone } from "@/lib/format";
import { demoNow } from "@/lib/demo-time";
import { useData } from "@/lib/store/DataProvider";

export function PlanPrintView({
  planId,
  leadId,
}: {
  planId: string;
  leadId?: string;
}) {
  const { plans, leads, currentUser } = useData();
  const plan = plans.find((p) => p.id === planId);
  const lead = leadId ? leads.find((l) => l.id === leadId) : undefined;

  if (!plan) {
    return (
      <div className="mx-auto mt-16 max-w-md rounded-xl border border-ink-100 bg-white p-8 text-center">
        <p className="text-sm font-medium text-ink-700">Plan bulunamadı.</p>
        <Link
          href="/odeme-planlari"
          className="mt-3 inline-block text-sm font-medium text-gold-700"
        >
          Plan kütüphanesine dön
        </Link>
      </div>
    );
  }

  const down = Math.round((plan.listPrice * plan.downPaymentPct) / 100);
  const remaining = plan.listPrice - down;
  const monthly = Math.round(remaining / plan.installmentMonths);

  return (
    <div className="min-h-screen bg-ink-100 px-4 py-8 print:bg-white print:p-0">
      {/* Araç çubuğu: yazdırmada gizlenir */}
      <div className="no-print mx-auto mb-5 flex max-w-3xl items-center justify-between">
        <Link
          href={lead ? `/musteriler/${lead.id}` : "/odeme-planlari"}
          className="text-sm font-medium text-ink-500 hover:text-ink-800"
        >
          ← Geri dön
        </Link>
        <Button variant="gold" onClick={() => window.print()}>
          <IconPrinter className="h-4 w-4" /> Yazdır / PDF indir
        </Button>
      </div>

      {/* Çıktı sayfası */}
      <div className="print-page mx-auto max-w-3xl overflow-hidden rounded-xl bg-white shadow-card">
        <header className="flex items-center justify-between bg-ink-950 px-8 py-6">
          <div>
            <p className="text-xl font-semibold tracking-wide text-white">
              Duyu Konutları
            </p>
            <p className="mt-0.5 text-[11px] tracking-[0.2em] text-gold-400">
              Ödeme planı teklifi
            </p>
          </div>
          <div className="text-right text-xs text-ink-300">
            <p>{formatDate(demoNow().toISOString())}</p>
            <p className="mt-0.5">Belge no: {plan.id.replace("p-", "DP-").toLocaleUpperCase("tr")}</p>
          </div>
        </header>

        <div className="px-8 py-7">
          <h1 className="text-2xl font-semibold text-ink-900">
            {plan.name}
          </h1>
          <p className="mt-1 text-sm text-ink-400">
            {plan.block} Blok · {plan.unitType} daire tipi için hazırlanmıştır
          </p>

          {lead ? (
            <div className="mt-5 grid grid-cols-1 gap-4 rounded-lg bg-ink-50 px-5 py-4 text-sm sm:grid-cols-3">
              <div>
                <p className="text-xs text-ink-400">Sayın</p>
                <p className="mt-0.5 font-medium text-ink-900">{lead.name}</p>
              </div>
              <div>
                <p className="text-xs text-ink-400">Telefon</p>
                <p className="mt-0.5 font-mono text-ink-900">
                  {formatPhone(lead.phone)}
                </p>
              </div>
              <div>
                <p className="text-xs text-ink-400">İlgilenilen daire</p>
                <p className="mt-0.5 font-medium text-ink-900">
                  {lead.block
                    ? `${lead.block} Blok · Daire ${lead.unitNo ?? "·"}`
                    : (lead.unitType ?? "·")}
                </p>
              </div>
            </div>
          ) : null}

          <table className="mt-6 w-full text-sm">
            <tbody>
              <tr className="border-b border-ink-100">
                <td className="py-3 text-ink-500">Liste fiyatı</td>
                <td className="py-3 tabular text-right font-semibold text-ink-900">
                  {formatMoney(plan.listPrice)}
                </td>
              </tr>
              <tr className="border-b border-ink-100">
                <td className="py-3 text-ink-500">
                  Peşinat (%{plan.downPaymentPct})
                </td>
                <td className="py-3 tabular text-right font-semibold text-ink-900">
                  {formatMoney(down)}
                </td>
              </tr>
              <tr className="border-b border-ink-100">
                <td className="py-3 text-ink-500">Kalan tutar</td>
                <td className="py-3 tabular text-right text-ink-900">
                  {formatMoney(remaining)}
                </td>
              </tr>
              <tr className="border-b border-ink-100">
                <td className="py-3 text-ink-500">
                  Aylık taksit ({plan.installmentMonths} ay)
                </td>
                <td className="py-3 tabular text-right font-semibold text-ink-900">
                  {formatMoney(monthly)}
                </td>
              </tr>
              {plan.cashPrice !== undefined ? (
                <tr>
                  <td className="py-3 font-medium text-gold-800">
                    Peşin ödemede özel fiyat
                  </td>
                  <td className="py-3 tabular text-right text-lg font-semibold text-gold-700">
                    {formatMoney(plan.cashPrice)}
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>

          {plan.highlights.length > 0 ? (
            <div className="mt-6">
              <p className="section-label mb-2">Plan koşulları</p>
              <ul className="space-y-1.5">
                {plan.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-2 text-sm text-ink-600">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-500" />
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <footer className="mt-8 flex flex-wrap items-end justify-between gap-4 border-t border-ink-100 pt-5">
            <div className="text-xs text-ink-400">
              <p className="font-medium text-ink-600">{currentUser.name}</p>
              <p className="mt-0.5">{currentUser.title} · Duyu Konutları</p>
              <p className="mt-0.5 font-mono">{currentUser.phone}</p>
            </div>
            <p className="max-w-xs text-right text-[10px] leading-snug text-ink-300">
              Bu belge bilgilendirme amaçlıdır, fiyat ve koşullar sözleşme
              aşamasında kesinleşir. Geçerlilik: 7 gün.
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}
