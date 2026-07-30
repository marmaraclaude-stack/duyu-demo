"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { IconSearch } from "@/components/ui/Icons";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatPhone } from "@/lib/format";
import { visibleLeads } from "@/lib/queries";
import { useData } from "@/lib/store/DataProvider";

export function GlobalSearch() {
  const { leads, currentUser, role } = useData();
  const [q, setQ] = useState("");
  const [focus, setFocus] = useState(false);
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setFocus(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const scope = visibleLeads(leads, currentUser.id, role);
  const norm = q.trim().toLocaleLowerCase("tr");
  const results =
    norm.length >= 2
      ? scope
          .filter(
            (l) =>
              l.name.toLocaleLowerCase("tr").includes(norm) ||
              l.phone.replace(/\s/g, "").includes(norm.replace(/\s/g, ""))
          )
          .slice(0, 6)
      : [];

  return (
    <div className="relative w-full max-w-md" ref={ref}>
      <IconSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onFocus={() => setFocus(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && q.trim()) {
            router.push(`/musteriler?q=${encodeURIComponent(q.trim())}`);
            setFocus(false);
          }
        }}
        placeholder="Müşteri veya telefon ara"
        className="w-full rounded-lg border border-ink-200 bg-white py-2 pl-9 pr-3 text-sm text-ink-900 placeholder:text-ink-300 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/30"
      />
      {focus && results.length > 0 ? (
        <div className="absolute left-0 right-0 z-40 mt-2 overflow-hidden rounded-xl border border-ink-100 bg-white shadow-pop">
          {results.map((l) => (
            <button
              key={l.id}
              onClick={() => {
                router.push(`/musteriler/${l.id}`);
                setFocus(false);
                setQ("");
              }}
              className="flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left transition-colors hover:bg-ink-50"
            >
              <span>
                <span className="block text-sm font-medium text-ink-900">
                  {l.name}
                </span>
                <span className="block font-mono text-xs text-ink-400">
                  {formatPhone(l.phone)}
                </span>
              </span>
              <StatusBadge status={l.status} />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
