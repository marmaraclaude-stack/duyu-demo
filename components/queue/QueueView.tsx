"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader } from "@/components/ui/Card";
import { IconArrowRight, IconInbox, IconSpark } from "@/components/ui/Icons";
import { Avatar } from "@/components/ui/Avatar";
import { formatPhone, formatTime } from "@/lib/format";
import { QUEUE_STAGE_LABELS, SOURCE_LABELS } from "@/lib/labels";
import { can } from "@/lib/permissions";
import { useData } from "@/lib/store/DataProvider";
import type { QueueItem, QueueStage } from "@/lib/types";

const STAGE_ORDER: QueueStage[] = ["kuyrukta", "kontrol", "atandi"];

function StageTracker({ item }: { item: QueueItem }) {
  const activeIdx =
    item.stage === "mukerrer" ? 1 : STAGE_ORDER.indexOf(item.stage);
  return (
    <div className="flex items-center gap-1.5">
      {STAGE_ORDER.map((s, i) => {
        const isDuplicateEnd = item.stage === "mukerrer" && i === 2;
        const reached = i <= activeIdx;
        const current = i === activeIdx && item.stage !== "atandi";
        return (
          <div key={s} className="flex items-center gap-1.5">
            <span
              className={`h-2 w-2 rounded-full transition-colors ${
                isDuplicateEnd
                  ? "bg-danger-500"
                  : reached
                    ? "bg-gold-500"
                    : "bg-ink-200"
              } ${current ? "animate-pulse" : ""}`}
            />
            {i < STAGE_ORDER.length - 1 ? (
              <span
                className={`h-px w-6 ${
                  i < activeIdx ? "bg-gold-400" : "bg-ink-200"
                }`}
              />
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

export function QueueView() {
  const { queue, users, leads, simulateIncomingLead, role, currentUser } =
    useData();
  const canTrigger = can(role, "queue.trigger");
  const isAdmin = role === "yonetici";

  const agentName = (id?: string) =>
    id ? (users.find((u) => u.id === id)?.name ?? "·") : "·";

  // Temsilci yalnızca sahipsiz (işlenmekte olan) başvuruları ve kendisine
  // atananları görür; diğer temsilcilerin iş akışı gizli kalır.
  const visibleQueue = isAdmin
    ? queue
    : queue.filter(
        (q) =>
          q.stage === "kuyrukta" ||
          q.stage === "kontrol" ||
          (q.stage === "atandi" && q.assignedTo === currentUser.id)
      );
  const assignedVisible = visibleQueue.filter((q) => q.stage === "atandi");
  const activeCount = visibleQueue.filter(
    (q) => q.stage === "kuyrukta" || q.stage === "kontrol"
  ).length;

  return (
    <div className="space-y-6">
      {/* Açıklama + tetikleme */}
      <Card className="overflow-hidden">
        <div className="flex flex-col gap-5 bg-ink-950 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-xl">
            <p className="text-xs font-medium tracking-[0.06em] text-gold-500">
              Canlı simülasyon
            </p>
            <h2 className="mt-1.5 text-lg font-semibold text-white">
              Meta reklam formundan CRM&apos;e otomatik akış
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-300">
              Instagram veya Facebook formu doldurulduğunda başvuru saniyeler
              içinde kuyruğa düşer, mükerrer numara kontrolünden geçer ve uygun
              temsilciye otomatik atanır.
              {canTrigger ? " Düğmeye basarak örnek bir başvuru düşürün." : ""}
            </p>
          </div>
          {canTrigger ? (
            <Button variant="gold" size="md" onClick={simulateIncomingLead}>
              <IconSpark className="h-4 w-4" /> Yeni lead düştü
            </Button>
          ) : (
            <p className="max-w-[200px] text-xs leading-relaxed text-ink-400">
              Simülasyonu yönetici tetikler; size atanan başvurular burada ve
              müşteri listenizde görünür.
            </p>
          )}
        </div>
        <div className="grid grid-cols-1 gap-px bg-ink-100 sm:grid-cols-3">
          {[
            {
              step: "1 · Kuyruk",
              text: "Form başvurusu webhook ile anında kuyruğa alınır.",
            },
            {
              step: "2 · Numara kontrolü",
              text: "Telefon numarası mevcut kayıtlarla karşılaştırılır, mükerrer başvuru engellenir.",
            },
            {
              step: "3 · Otomatik atama",
              text: "Kayıt, yükü en az olan temsilciye atanır ve listesine düşer.",
            },
          ].map((s) => (
            <div key={s.step} className="bg-white px-5 py-4">
              <p className="text-xs font-semibold text-gold-700">{s.step}</p>
              <p className="mt-1 text-xs leading-relaxed text-ink-500">
                {s.text}
              </p>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-2">
        {/* Kuyruk */}
        <Card>
          <CardHeader
            title="Başvuru kuyruğu"
            subtitle={
              activeCount > 0
                ? `${activeCount} başvuru işleniyor`
                : "Kuyruk boş · yeni başvuru bekleniyor"
            }
          />
          {visibleQueue.length === 0 ? (
            <div className="flex flex-col items-center gap-2 px-6 py-12 text-center">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gold-50 text-gold-600">
                <IconInbox className="h-5 w-5" />
              </span>
              <p className="text-sm font-medium text-ink-700">
                Henüz başvuru düşmedi
              </p>
              <p className="max-w-xs text-xs text-ink-400">
                Yukarıdaki düğme ile Meta formundan gelen bir başvuruyu canlı
                izleyebilirsiniz.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-ink-50">
              {visibleQueue.map((q) => (
                <li key={q.id} className="px-5 py-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-ink-900">
                        {q.name}
                        <span className="ml-2 tabular text-xs text-ink-400">
                          {formatPhone(q.phone)}
                        </span>
                      </p>
                      <p className="mt-0.5 text-xs text-ink-400">
                        {SOURCE_LABELS[q.source]} · {q.campaign} · {q.unitType}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <StageTracker item={q} />
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ring-1 ring-inset ${
                          q.stage === "atandi"
                            ? "bg-gold-50 text-gold-800 ring-gold-200"
                            : q.stage === "mukerrer"
                              ? "bg-danger-50 text-danger-600 ring-danger-100"
                              : "bg-ink-100 text-ink-600 ring-ink-200"
                        }`}
                      >
                        {QUEUE_STAGE_LABELS[q.stage]}
                      </span>
                    </div>
                  </div>
                  {q.stage === "atandi" ? (
                    <p className="mt-2 flex items-center gap-2 rounded-lg bg-gold-50 px-3 py-2 text-xs text-gold-900 ring-1 ring-inset ring-gold-100">
                      <Avatar name={agentName(q.assignedTo)} size="sm" />
                      {agentName(q.assignedTo)} listesine eklendi ·{" "}
                      {formatTime(q.arrivedAt)}
                    </p>
                  ) : null}
                  {q.stage === "mukerrer" ? (
                    <p className="mt-2 rounded-lg bg-danger-50 px-3 py-2 text-xs leading-relaxed text-danger-700 ring-1 ring-inset ring-danger-100">
                      Mükerrer numara: bu telefon{" "}
                      <span className="font-medium">
                        {isAdmin
                          ? (leads.find((l) => l.id === q.duplicateOf)?.name ??
                            "mevcut bir müşteri")
                          : "mevcut bir müşteri"}
                      </span>{" "}
                      kaydıyla eşleşti. Yeni kayıt açılmadı, başvuru mevcut
                      müşterinin temsilcisine bildirildi.
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </Card>

        {/* Atama sonucu */}
        <Card>
          <CardHeader
            title={isAdmin ? "Bu oturumda atanan leadler" : "Size atanan başvurular"}
            subtitle={
              isAdmin
                ? "Atama sonrası kayıt doğrudan müşteri listesine düşer"
                : "Atama sonrası kayıt doğrudan listenize düşer"
            }
          />
          {assignedVisible.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-ink-400">
              {isAdmin
                ? "Henüz atama gerçekleşmedi. Bir başvuru düşürüp süreci izleyin."
                : "Bu oturumda size atanan yeni başvuru yok."}
            </p>
          ) : (
            <ul className="divide-y divide-ink-50">
              {assignedVisible.map((q) => {
                const lead = leads.find(
                  (l) => l.phone.replace(/\s/g, "") === q.phone.replace(/\s/g, "")
                );
                return (
                  <li
                    key={q.id}
                    className="flex items-center justify-between gap-3 px-5 py-3.5"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-ink-900">
                        {q.name}
                      </p>
                      <p className="mt-0.5 text-xs text-ink-400">
                        {agentName(q.assignedTo)} · {q.unitType} ·{" "}
                        {formatTime(q.arrivedAt)}
                      </p>
                    </div>
                    {lead ? (
                      <Link
                        href={`/musteriler/${lead.id}`}
                        className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-gold-700 hover:text-gold-600"
                      >
                        Kartı aç <IconArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
