"use client";

import { useEffect, useRef, useState } from "react";
import { Avatar } from "@/components/ui/Avatar";
import { IconCheck, IconChevronDown } from "@/components/ui/Icons";
import { useData } from "@/lib/store/DataProvider";

export function RoleSwitcher() {
  const { users, currentUser, setCurrentUserId } = useData();
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
        <div className="absolute right-0 z-40 mt-2 w-72 rounded-xl border border-ink-100 bg-white p-2 shadow-pop">
          <p className="section-label px-3 pb-2 pt-1.5">Rol değiştir · demo</p>
          {users.map((u) => (
            <button
              key={u.id}
              onClick={() => {
                setCurrentUserId(u.id);
                setOpen(false);
              }}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-ink-50 ${
                u.id === currentUser.id ? "bg-gold-50" : ""
              }`}
            >
              <Avatar name={u.name} size="sm" />
              <span className="flex-1">
                <span className="block text-sm font-medium text-ink-900">
                  {u.name}
                </span>
                <span className="block text-xs text-ink-400">
                  {u.role === "yonetici" ? "Yönetici" : "Temsilci"} · {u.title}
                </span>
              </span>
              {u.id === currentUser.id ? (
                <IconCheck className="h-4 w-4 text-gold-600" />
              ) : null}
            </button>
          ))}
          <p className="border-t border-ink-100 px-3 pb-1.5 pt-2 text-[11px] leading-snug text-ink-400">
            Temsilci yalnızca kendisine atanan kayıtları görür, yönetici tüm
            veriye ve raporlara erişir.
          </p>
        </div>
      ) : null}
    </div>
  );
}
