import type { User } from "../types";

export const USERS: User[] = [
  {
    id: "u-adil",
    name: "Adil Can K.",
    role: "yonetici",
    title: "Satış Direktörü",
    initials: "AK",
    phone: "0532 481 10 01",
  },
  {
    id: "u-ayse",
    name: "Ayşe Y.",
    role: "temsilci",
    title: "Satış Temsilcisi",
    initials: "AY",
    phone: "0532 481 10 02",
  },
  {
    id: "u-mehmet",
    name: "Mehmet T.",
    role: "temsilci",
    title: "Satış Temsilcisi",
    initials: "MT",
    phone: "0532 481 10 03",
  },
  {
    id: "u-zeynep",
    name: "Zeynep A.",
    role: "temsilci",
    title: "Satış Temsilcisi",
    initials: "ZA",
    phone: "0532 481 10 04",
  },
];

export const AGENTS = USERS.filter((u) => u.role === "temsilci");

export function userById(id: string): User | undefined {
  return USERS.find((u) => u.id === id);
}
