import type { Metadata, Viewport } from "next";
import { DM_Mono, Manrope, Playfair_Display } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/shell/AppShell";
import { DataProvider } from "@/lib/store/DataProvider";

// Tipografi: Manrope (arayüz metni, yüksek okunabilirlik), Playfair Display
// (marka, sayfa başlıkları ve büyük rakamlar · lüks seri ciddiyeti),
// DM Mono (telefon, ID, saat ve tablo tutarları).
const manrope = Manrope({
  subsets: ["latin", "latin-ext"],
  variable: "--font-sans",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin", "latin-ext"],
  variable: "--font-display",
  display: "swap",
});

const dmMono = DM_Mono({
  weight: ["400", "500"],
  subsets: ["latin", "latin-ext"],
  variable: "--font-mono",
  display: "swap",
});

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
    <html
      lang="tr"
      className={`${manrope.variable} ${playfair.variable} ${dmMono.variable}`}
    >
      <body className="font-sans">
        <DataProvider>
          <AppShell>{children}</AppShell>
        </DataProvider>
      </body>
    </html>
  );
}
