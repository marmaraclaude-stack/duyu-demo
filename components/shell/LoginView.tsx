"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { IconBuilding } from "@/components/ui/Icons";
import { inputCls } from "@/components/ui/Field";
import { useData } from "@/lib/store/DataProvider";

// Demo giriş ekranı: hesaplar lib/data/users.ts içinde tanımlıdır.
// Tam sürümde gerçek kimlik doğrulama (Supabase Auth) ile değiştirilecek.
export function LoginView() {
  const { login, users } = useData();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const submit = () => {
    if (!login(username, password)) {
      setError(true);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-950 px-4 py-10">
      <div className="w-full max-w-sm">
        {/* Marka */}
        <div className="mb-8 flex flex-col items-center text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gold-500 text-ink-950">
            <IconBuilding className="h-7 w-7" />
          </span>
          <h1 className="mt-4 text-xl font-semibold text-white">
            Duyu Konutları
          </h1>
          <p className="mt-1 text-xs font-medium tracking-[0.06em] text-gold-400">
            Satış CRM
          </p>
        </div>

        {/* Giriş kartı */}
        <form
          className="rounded-2xl bg-white p-6 shadow-pop"
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
        >
          <h2 className="text-base font-semibold text-ink-900">Giriş yap</h2>
          <p className="mt-1 text-xs text-ink-400">
            Hesabınızla oturum açarak panonuza ulaşın
          </p>

          <label className="mt-5 block">
            <span className="mb-1.5 block text-xs font-medium text-ink-500">
              Kullanıcı adı
            </span>
            <input
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setError(false);
              }}
              placeholder="yonetici"
              autoComplete="username"
              className={inputCls}
              autoFocus
            />
          </label>
          <label className="mt-4 block">
            <span className="mb-1.5 block text-xs font-medium text-ink-500">
              Şifre
            </span>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              placeholder="••••••••"
              autoComplete="current-password"
              className={inputCls}
            />
          </label>

          {error ? (
            <p className="mt-3 rounded-lg bg-danger-50 px-3 py-2 text-xs font-medium text-danger-600 ring-1 ring-inset ring-danger-100">
              Kullanıcı adı veya şifre hatalı, tekrar deneyin.
            </p>
          ) : null}

          <Button
            type="submit"
            variant="gold"
            className="mt-5 w-full"
            disabled={!username.trim() || !password}
          >
            Giriş yap
          </Button>
        </form>

        {/* Demo hesap bilgileri */}
        <div className="mt-5 rounded-xl border border-ink-800 bg-ink-900 p-4">
          <p className="text-xs font-medium tracking-[0.06em] text-gold-400">
            Demo hesaplar
          </p>
          <ul className="mt-2.5 space-y-1.5">
            {users.map((u) => (
              <li
                key={u.id}
                className="flex items-center justify-between text-xs"
              >
                <span className="text-ink-300">{u.name}</span>
                <span className="tabular text-ink-400">
                  {u.username} · {u.password}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-2.5 text-[11px] leading-snug text-ink-500">
            Tam sürümde bu hesaplar gerçek kişilerle ve güvenli şifrelerle
            değiştirilecektir.
          </p>
        </div>
      </div>
    </div>
  );
}
