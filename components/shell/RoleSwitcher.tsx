"use client";

// Kullanıcı menüsü: aktif hesabı gösterir ve çıkış yapmayı sağlar.
// Farklı role geçiş, giriş ekranından ilgili hesapla oturum açılarak yapılır.

import { useEffect, useRef, useState } from "react";
import { Avatar } from "@/components/ui/Avatar";
import { IconChevronDown } from "@/components/ui/Icons";
import { useData } from "@/lib/store/DataProvider";

export function RoleSwitcher() {
  const { currentUser, role, logout } = useData();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2.5 rounded-lg py-1.5 pl-1.5 pr-2.5 transition-colors hover:bg-ink-100"
      >
        <Avatar name={currentUser.name} />
        <span className="hidden text-left sm:block">
          <span className="block text-sm font-medium leading-tight text-ink-900">
            {currentUser.name}
          </span>
          <span className="block text-xs leading-tight text-ink-400">
            {currentUser.title}
          </span>
        </span>
        <IconChevronDown className="h-4 w-4 text-ink-400" />
      </button>

      {open ? (
        <div className="absolute right-0 z-40 mt-2 w-64 rounded-xl border border-ink-100 bg-white p-2 shadow-pop">
          <div className="flex items-center gap-3 rounded-lg bg-ink-50 px-3 py-2.5">
            <Avatar name={currentUser.name} size="sm" />
            <span>
              <span className="block text-sm font-medium text-ink-900">
                {currentUser.name}
              </span>
              <span className="block text-xs text-ink-400">
                {role === "yonetici" ? "Yönetici" : "Temsilci"} ·{" "}
                {currentUser.title}
              </span>
            </span>
          </div>
          <button
            onClick={() => {
              setOpen(false);
              logout();
            }}
            className="mt-1.5 block w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-danger-600 transition-colors hover:bg-danger-50"
          >
            Çıkış yap
          </button>
          <p className="border-t border-ink-100 px-3 pb-1.5 pt-2 text-[11px] leading-snug text-ink-400">
            Farklı bir hesapla devam etmek için çıkış yapıp o hesapla giriş
            yapın.
          </p>
        </div>
      ) : null}
    </div>
  );
}
