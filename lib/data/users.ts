import type { User } from "../types";

// Demo hesaplar: jenerik isimler ve basit şifreler. Tam sürümde gerçek
// kişiler ve güvenli kimlik doğrulama (Supabase Auth) ile değiştirilecek.

export const USERS: User[] = [
  {
    id: "u-adil",
    name: "Yönetici",
    role: "yonetici",
    title: "Satış Direktörü",
    initials: "YN",
    phone: "0532 481 10 01",
    username: "yonetici",
    password: "duyu2026",
  },
  {
    id: "u-ayse",
    name: "Satış Temsilcisi 1",
    role: "temsilci",
    title: "Satış Temsilcisi",
    initials: "T1",
    phone: "0532 481 10 02",
    username: "temsilci1",
    password: "satis2026",
  },
  {
    id: "u-mehmet",
    name: "Satış Temsilcisi 2",
    role: "temsilci",
    title: "Satış Temsilcisi",
    initials: "T2",
    phone: "0532 481 10 03",
    username: "temsilci2",
    password: "satis2026",
  },
  {
    id: "u-zeynep",
    name: "Satış Temsilcisi 3",
    role: "temsilci",
    title: "Satış Temsilcisi",
    initials: "T3",
    phone: "0532 481 10 04",
    username: "temsilci3",
    password: "satis2026",
  },
];

export const AGENTS = USERS.filter((u) => u.role === "temsilci");

export function userById(id: string): User | undefined {
  return USERS.find((u) => u.id === id);
}
