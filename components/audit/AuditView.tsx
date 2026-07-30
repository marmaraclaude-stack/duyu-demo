"use client";

import { useState } from "react";
import { Card, CardHeader } from "@/components/ui/Card";
import { Select } from "@/components/ui/Field";
import { IconCheck, IconX } from "@/components/ui/Icons";
import { Avatar } from "@/components/ui/Avatar";
import { formatDateTime } from "@/lib/format";
import { useData } from "@/lib/store/DataProvider";

// Rol matrisi: PDF'teki yetki modeli özeti
const MATRIX: { module: string; admin: string; agent: string }[] = [
  { module: "Genel bakış paneli", admin: "Tüm ekip verisi", agent: "Kendi verisi" },
  { module: "Müşteri listesi", admin: "Tüm kayıtlar", agent: "Atanan kayıtlar" },
  { module: "Müşteri düzenleme ve silme", admin: "Evet", agent: "Kendi kayıtları" },
  { module: "Temsilci atama ve değiştirme", admin: "Evet", agent: "Hayır" },
  { module: "Hatırlatmalar", admin: "Tüm ekip + gecikenler", agent: "Kendi listesi" },
  { module: "Ödeme planı kütüphanesi", admin: "Ekleme ve düzenleme", agent: "Görüntüleme ve yazdırma" },
  { module: "Raporlama", admin: "Evet", agent: "Hayır" },
  { module: "Yetki ve kayıt izi", admin: "Evet", agent: "Hayır" },
  { module: "CSV/Excel dışa aktarma", admin: "Evet", agent: "Kendi listesi" },
  { module: "Meta kuyruğu · lead düşürme", admin: "Evet", agent: "İzleme" },
];

export function AuditView() {
  const { auditLogs, users } = useData();
  const [userFilter, setUserFilter] = useState("");

  const filtered = auditLogs.filter(
    (a) => !userFilter || a.userId === userFilter
  );
  const userName = (id: string) => users.find((u) => u.id === id)?.name ?? "·";

  return (
    <div className="space-y-6">
      {/* Rol matrisi */}
      <Card>
        <CardHeader
          title="Rol matrisi"
          subtitle="Yönetici ve temsilci yetkilerinin özeti"
        />
        <div className="thin-scroll overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-ink-100 text-xs text-ink-400">
                <th className="px-5 py-3 font-medium">Modül</th>
                <th className="px-4 py-3 font-medium">Yönetici · Adil Can K.</th>
                <th className="px-4 py-3 font-medium">Temsilciler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-50">
              {MATRIX.map((row) => (
                <tr key={row.module}>
                  <td className="px-5 py-3 font-medium text-ink-900">
                    {row.module}
                  </td>
                  {[row.admin, row.agent].map((cell, i) => (
                    <td key={i} className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1.5 ${
                          cell === "Hayır" ? "text-ink-300" : "text-ink-600"
                        }`}
                      >
                        {cell === "Hayır" ? (
                          <IconX className="h-4 w-4 text-ink-300" />
                        ) : (
                          <IconCheck className="h-4 w-4 text-gold-600" />
                        )}
                        {cell}
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* İşlem logu */}
      <Card>
        <CardHeader
          title="İşlem kaydı"
          subtitle="Kim, neyi, ne zaman yaptı · en yeni üstte"
          action={
            <div className="w-44 shrink-0">
              <Select
                value={userFilter}
                onChange={(e) => setUserFilter(e.target.value)}
                aria-label="Kullanıcı filtresi"
              >
                <option value="">Tüm kullanıcılar</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </Select>
            </div>
          }
        />
        <div className="thin-scroll overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-ink-100 text-xs text-ink-400">
                <th className="px-5 py-3 font-medium">Kullanıcı</th>
                <th className="px-4 py-3 font-medium">İşlem</th>
                <th className="px-4 py-3 font-medium">Hedef</th>
                <th className="px-4 py-3 font-medium">Detay</th>
                <th className="px-4 py-3 font-medium">Zaman</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-50">
              {filtered.slice(0, 30).map((a) => (
                <tr key={a.id}>
                  <td className="whitespace-nowrap px-5 py-3">
                    <span className="flex items-center gap-2 font-medium text-ink-900">
                      <Avatar name={userName(a.userId)} size="sm" />
                      {userName(a.userId)}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <span className="rounded-md bg-ink-100 px-2 py-0.5 text-xs font-medium text-ink-600">
                      {a.action}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-ink-900">{a.target}</td>
                  <td className="px-4 py-3 text-xs text-ink-400">
                    {a.detail ?? "·"}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 tabular text-xs text-ink-400">
                    {formatDateTime(a.at)}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-sm text-ink-400">
                    Bu kullanıcı için kayıt bulunamadı.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
