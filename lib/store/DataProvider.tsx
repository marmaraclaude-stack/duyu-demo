"use client";

// Demo veri deposu: tüm CRUD işlemleri yerel state üzerinde optimistik
// çalışır. Supabase'e geçişte aksiyon gövdeleri sorgulara bağlanır,
// bileşen arayüzü değişmez.

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { AUDIT_LOGS } from "../data/audit";
import { CALLS, LEADS, REMINDERS } from "../data/leads";
import { PLANS, PRINT_LOGS } from "../data/plans";
import { USERS } from "../data/users";
import { demoNow } from "../demo-time";
import type {
  AuditLog,
  CallRecord,
  Lead,
  PaymentPlan,
  PrintLog,
  QueueItem,
  Reminder,
  Role,
  SavedFilter,
  User,
} from "../types";

interface AddCallInput {
  leadId: string;
  result: Lead["status"];
  note: string;
  nextCallAt?: string;
  reminderType?: Reminder["type"];
}

interface DataContextValue {
  users: User[];
  currentUser: User;
  role: Role;
  setCurrentUserId: (id: string) => void;

  leads: Lead[];
  calls: CallRecord[];
  reminders: Reminder[];
  plans: PaymentPlan[];
  printLogs: PrintLog[];
  auditLogs: AuditLog[];
  savedFilters: SavedFilter[];
  queue: QueueItem[];

  addLead: (input: Omit<Lead, "id" | "createdAt" | "updatedAt">) => Lead;
  updateLead: (id: string, patch: Partial<Lead>) => void;
  deleteLead: (id: string) => void;
  addCall: (input: AddCallInput) => void;
  completeReminder: (id: string) => void;
  postponeReminder: (id: string, newDueAt: string) => void;
  addPlan: (input: Omit<PaymentPlan, "id" | "updatedAt">) => void;
  updatePlan: (id: string, patch: Partial<PaymentPlan>) => void;
  logPrint: (planId: string, leadId?: string) => void;
  saveFilter: (filter: Omit<SavedFilter, "id">) => void;
  removeSavedFilter: (id: string) => void;
  simulateIncomingLead: () => void;
  logExport: (target: string) => void;
}

const DataContext = createContext<DataContextValue | null>(null);

let seq = 100;
function nextId(prefix: string): string {
  seq += 1;
  return `${prefix}-${seq}`;
}

const DEFAULT_FILTERS: SavedFilter[] = [
  {
    id: "sf-bugun",
    name: "Bugün aranacaklar",
    params: { status: ["tekrar-aranacak", "mesgul", "cevapsiz"] },
  },
  {
    id: "sf-butce",
    name: "Bütçesini aşanlar",
    params: { status: ["butce-asiyor"] },
  },
  {
    id: "sf-meta",
    name: "Meta form kayıtları",
    params: { source: ["instagram-form", "facebook-form"] },
  },
];

// Meta kuyruğu simülasyonunda sırayla düşecek örnek başvurular.
// Üçüncü kayıt mevcut bir müşterinin numarasını taşır: mükerrer senaryosu.
const INCOMING_POOL = [
  {
    name: "Leyla Ş.",
    phone: "0530 118 42 96",
    source: "instagram-form" as const,
    campaign: "3+1 Bahçe Dubleks · Temmuz kampanyası",
    unitType: "3+1" as const,
  },
  {
    name: "Kaan D.",
    phone: "0531 229 53 87",
    source: "facebook-form" as const,
    campaign: "1+1 Yatırım Fırsatı",
    unitType: "1+1" as const,
  },
  {
    name: "Mehmet K.",
    phone: "0532 214 45 67",
    source: "instagram-form" as const,
    campaign: "2+1 Aile Konutları",
    unitType: "2+1" as const,
  },
  {
    name: "Sevgi O.",
    phone: "0533 340 64 78",
    source: "instagram-form" as const,
    campaign: "2+1 Aile Konutları",
    unitType: "2+1" as const,
  },
  {
    name: "Ferhat E.",
    phone: "0534 451 75 69",
    source: "facebook-form" as const,
    campaign: "3+1 Bahçe Dubleks · Temmuz kampanyası",
    unitType: "3+1" as const,
  },
];

export function DataProvider({ children }: { children: ReactNode }) {
  const [currentUserId, setCurrentUserId] = useState("u-adil");
  const [leads, setLeads] = useState<Lead[]>(LEADS);
  const [calls, setCalls] = useState<CallRecord[]>(CALLS);
  const [reminders, setReminders] = useState<Reminder[]>(REMINDERS);
  const [plans, setPlans] = useState<PaymentPlan[]>(PLANS);
  const [printLogs, setPrintLogs] = useState<PrintLog[]>(PRINT_LOGS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(AUDIT_LOGS);
  const [savedFilters, setSavedFilters] =
    useState<SavedFilter[]>(DEFAULT_FILTERS);
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const poolIndex = useRef(0);

  // Zamanlayıcılar için her zaman güncel lead listesi
  const leadsRef = useRef(leads);
  leadsRef.current = leads;

  const currentUser = USERS.find((u) => u.id === currentUserId) ?? USERS[0];
  const role: Role = currentUser.role;

  const audit = useCallback(
    (action: string, target: string, detail?: string) => {
      setAuditLogs((prev) => [
        {
          id: nextId("a"),
          userId: currentUserId,
          action,
          target,
          detail,
          at: new Date().toISOString(),
        },
        ...prev,
      ]);
    },
    [currentUserId]
  );

  const addLead = useCallback(
    (input: Omit<Lead, "id" | "createdAt" | "updatedAt">): Lead => {
      const now = new Date().toISOString();
      const lead: Lead = { ...input, id: nextId("l"), createdAt: now, updatedAt: now };
      setLeads((prev) => [lead, ...prev]);
      audit("Yeni müşteri ekleme", lead.name, `Kaynak üzerinden manuel kayıt`);
      return lead;
    },
    [audit]
  );

  const updateLead = useCallback(
    (id: string, patch: Partial<Lead>) => {
      setLeads((prev) =>
        prev.map((l) =>
          l.id === id
            ? { ...l, ...patch, updatedAt: new Date().toISOString() }
            : l
        )
      );
      const lead = leads.find((l) => l.id === id);
      audit("Müşteri güncelleme", lead?.name ?? id);
    },
    [audit, leads]
  );

  const deleteLead = useCallback(
    (id: string) => {
      const lead = leads.find((l) => l.id === id);
      setLeads((prev) => prev.filter((l) => l.id !== id));
      setReminders((prev) => prev.filter((r) => r.leadId !== id));
      audit("Müşteri silme", lead?.name ?? id);
    },
    [audit, leads]
  );

  const addCall = useCallback(
    (input: AddCallInput) => {
      const now = new Date().toISOString();
      const call: CallRecord = {
        id: nextId("c"),
        leadId: input.leadId,
        agentId: currentUserId,
        at: now,
        result: input.result,
        note: input.note,
        nextCallAt: input.nextCallAt,
      };
      setCalls((prev) => [call, ...prev]);
      setLeads((prev) =>
        prev.map((l) =>
          l.id === input.leadId
            ? { ...l, status: input.result, updatedAt: now }
            : l
        )
      );
      // Sonraki arama tarihi girildiği anda hatırlatma otomatik oluşur.
      if (input.nextCallAt) {
        setReminders((prev) => [
          {
            id: nextId("r"),
            leadId: input.leadId,
            agentId: currentUserId,
            type: input.reminderType ?? "arama",
            dueAt: input.nextCallAt!,
            note: input.note,
            done: false,
            createdAt: now,
          },
          ...prev,
        ]);
      }
      const lead = leads.find((l) => l.id === input.leadId);
      audit(
        "Arama kaydı ekleme",
        lead?.name ?? input.leadId,
        input.nextCallAt ? "Sonraki arama için hatırlatma oluşturuldu" : undefined
      );
    },
    [audit, currentUserId, leads]
  );

  const completeReminder = useCallback(
    (id: string) => {
      setReminders((prev) =>
        prev.map((r) => (r.id === id ? { ...r, done: true } : r))
      );
      const rem = reminders.find((r) => r.id === id);
      const lead = leads.find((l) => l.id === rem?.leadId);
      audit("Hatırlatma tamamlama", lead?.name ?? id);
    },
    [audit, leads, reminders]
  );

  const postponeReminder = useCallback(
    (id: string, newDueAt: string) => {
      setReminders((prev) =>
        prev.map((r) => (r.id === id ? { ...r, dueAt: newDueAt } : r))
      );
      const rem = reminders.find((r) => r.id === id);
      const lead = leads.find((l) => l.id === rem?.leadId);
      audit("Hatırlatma erteleme", lead?.name ?? id);
    },
    [audit, leads, reminders]
  );

  const addPlan = useCallback(
    (input: Omit<PaymentPlan, "id" | "updatedAt">) => {
      const plan: PaymentPlan = {
        ...input,
        id: nextId("p"),
        updatedAt: new Date().toISOString(),
      };
      setPlans((prev) => [plan, ...prev]);
      audit("Ödeme planı ekleme", plan.name);
    },
    [audit]
  );

  const updatePlan = useCallback(
    (id: string, patch: Partial<PaymentPlan>) => {
      setPlans((prev) =>
        prev.map((p) =>
          p.id === id
            ? { ...p, ...patch, updatedAt: new Date().toISOString() }
            : p
        )
      );
      const plan = plans.find((p) => p.id === id);
      audit("Ödeme planı güncelleme", plan?.name ?? id);
    },
    [audit, plans]
  );

  const logPrint = useCallback(
    (planId: string, leadId?: string) => {
      setPrintLogs((prev) => [
        {
          id: nextId("pl"),
          planId,
          agentId: currentUserId,
          leadId,
          at: new Date().toISOString(),
        },
        ...prev,
      ]);
      const plan = plans.find((p) => p.id === planId);
      const lead = leadId ? leads.find((l) => l.id === leadId) : undefined;
      audit(
        "Ödeme planı yazdırma",
        plan?.name ?? planId,
        lead ? `Müşteri: ${lead.name}` : undefined
      );
    },
    [audit, currentUserId, leads, plans]
  );

  const saveFilter = useCallback(
    (filter: Omit<SavedFilter, "id">) => {
      setSavedFilters((prev) => [...prev, { ...filter, id: nextId("sf") }]);
      audit("Filtre kaydetme", filter.name);
    },
    [audit]
  );

  const removeSavedFilter = useCallback((id: string) => {
    setSavedFilters((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const logExport = useCallback(
    (target: string) => {
      audit("CSV dışa aktarma", target);
    },
    [audit]
  );

  // Meta lead simülasyonu: kuyruğa düşme → numara kontrolü → atama/mükerrer
  const simulateIncomingLead = useCallback(() => {
    const profile = INCOMING_POOL[poolIndex.current % INCOMING_POOL.length];
    poolIndex.current += 1;
    const id = nextId("q");
    const item: QueueItem = {
      id,
      name: profile.name,
      phone: profile.phone,
      source: profile.source,
      campaign: profile.campaign,
      unitType: profile.unitType,
      stage: "kuyrukta",
      arrivedAt: new Date().toISOString(),
    };
    setQueue((prev) => [item, ...prev]);

    window.setTimeout(() => {
      setQueue((prev) =>
        prev.map((q) => (q.id === id ? { ...q, stage: "kontrol" } : q))
      );
    }, 1200);

    window.setTimeout(() => {
      const currentLeads = leadsRef.current;
      const normalized = profile.phone.replace(/\s/g, "");
      const duplicate = currentLeads.find(
        (l) => l.phone.replace(/\s/g, "") === normalized
      );

      if (duplicate) {
        setQueue((prev) =>
          prev.map((q) =>
            q.id === id
              ? { ...q, stage: "mukerrer", duplicateOf: duplicate.id }
              : q
          )
        );
        setAuditLogs((prev) => [
          {
            id: nextId("a"),
            userId: "u-adil",
            action: "Mükerrer numara engellendi",
            target: profile.name,
            detail: `Mevcut kayıt: ${duplicate.name} · ${duplicate.phone}`,
            at: new Date().toISOString(),
          },
          ...prev,
        ]);
        return;
      }

      // En az yüklü temsilciye otomatik atama
      const counts: Record<string, number> = {
        "u-ayse": 0,
        "u-mehmet": 0,
        "u-zeynep": 0,
      };
      for (const l of currentLeads) {
        if (counts[l.assignedTo] !== undefined) counts[l.assignedTo] += 1;
      }
      const agentId = Object.entries(counts).sort((a, b) => a[1] - b[1])[0][0];
      const now = new Date().toISOString();
      const lead: Lead = {
        id: nextId("l"),
        name: profile.name,
        phone: profile.phone,
        status: "formu-dolduran",
        source: profile.source,
        unitType: profile.unitType,
        assignedTo: agentId,
        note: `Meta kampanyası: ${profile.campaign}`,
        createdAt: now,
        updatedAt: now,
      };
      setLeads((prev) => [lead, ...prev]);
      setQueue((prev) =>
        prev.map((q) =>
          q.id === id ? { ...q, stage: "atandi", assignedTo: agentId } : q
        )
      );
      const agent = USERS.find((u) => u.id === agentId);
      setAuditLogs((prev) => [
        {
          id: nextId("a"),
          userId: "u-adil",
          action: "Lead atama",
          target: profile.name,
          detail: `Meta kuyruğundan ${agent?.name ?? agentId} üzerine`,
          at: now,
        },
        ...prev,
      ]);
    }, 2600);
  }, []);

  const value = useMemo<DataContextValue>(
    () => ({
      users: USERS,
      currentUser,
      role,
      setCurrentUserId,
      leads,
      calls,
      reminders,
      plans,
      printLogs,
      auditLogs,
      savedFilters,
      queue,
      addLead,
      updateLead,
      deleteLead,
      addCall,
      completeReminder,
      postponeReminder,
      addPlan,
      updatePlan,
      logPrint,
      saveFilter,
      removeSavedFilter,
      simulateIncomingLead,
      logExport,
    }),
    [
      currentUser,
      role,
      leads,
      calls,
      reminders,
      plans,
      printLogs,
      auditLogs,
      savedFilters,
      queue,
      addLead,
      updateLead,
      deleteLead,
      addCall,
      completeReminder,
      postponeReminder,
      addPlan,
      updatePlan,
      logPrint,
      saveFilter,
      removeSavedFilter,
      simulateIncomingLead,
      logExport,
    ]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData(): DataContextValue {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData, DataProvider içinde kullanılmalı");
  return ctx;
}

export { demoNow };
