"use client";

// Rol bazlı pano: yönetici ekip görünümünü, temsilci kişisel görünümünü alır.

import { useData } from "@/lib/store/DataProvider";
import { AdminDashboard } from "./AdminDashboard";
import { RepDashboard } from "./RepDashboard";

export function DashboardView() {
  const { role } = useData();
  return role === "yonetici" ? <AdminDashboard /> : <RepDashboard />;
}
