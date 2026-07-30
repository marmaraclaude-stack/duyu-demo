import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { AppShell } from "@/components/shell/AppShell";
import { DataProvider } from "@/lib/store/DataProvider";

export const metadata: Metadata = {
  title: "Duyu Konutları · Satış CRM",
  description:
    "Duyu Konutları satış ekibi için lead takibi, hatırlatma ve raporlama paneli · demo sürüm",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

// Demo saati "bugün"e göre üretildiği için sayfalar istek anında render edilir;
// böylece sunucu HTML'i ile istemci hidrasyonu her zaman aynı günü görür.
export const dynamic = "force-dynamic";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="font-sans">
        <DataProvider>
          <AppShell>{children}</AppShell>
        </DataProvider>
      </body>
    </html>
  );
}
