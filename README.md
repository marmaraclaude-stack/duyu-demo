# Duyu Konutları · Satış CRM Demo

Duyu Konutları için hazırlanan teklif dosyasındaki 8 modülü birebir karşılayan,
tıklanabilir ve çalışan demo CRM panosu. Satış sunumunda "sisteminiz böyle
çalışacak" diye gösterilmek üzere tasarlandı: tüm ekranlar gerçekçi Türkçe
veriyle doludur, CRUD işlemleri optimistik olarak yerel state üzerinde çalışır.

## Çalıştırma

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # üretim derlemesi
```

## Roller

Topbar'daki kullanıcı menüsünden anında rol değiştirilir:

- Yönetici · Adil Can K.: tüm kayıtlar, raporlama, yetki ve kayıt izi
- Temsilciler · Ayşe Y., Mehmet T., Zeynep A.: yalnızca kendilerine atanan
  müşteriler ve hatırlatmalar

## Modüller

| Sayfa | İçerik |
| --- | --- |
| Genel bakış | Bugünkü arama toplamı, ulaşma oranı, dönüşüm hunisi, temsilci bazlı aramalar, bugünkü hatırlatmalar, son aramalar |
| Müşteriler | Renk kodlu durum rozetleri, gelişmiş filtre çubuğu + aktif filtre çipleri, kayıtlı listeler, arama, CSV/Excel aktarımı, ekleme/düzenleme/silme |
| Müşteri kartı | İletişim + kaynak + daire + bütçe özeti, tarih damgalı arama zaman tüneli, sonraki arama tarihinden otomatik hatırlatma, ödeme planı yazdırma ve çıktı geçmişi |
| Hatırlatmalar | Geciken aramalar (kırmızı), bugünün saatli programı, tamamla ve ertele aksiyonları |
| Ödeme planları | Blok ve daire tipi bazlı plan kartları, plan ekleme/düzenleme, yazdırılabilir görünüm, çıktı geçmişi |
| Raporlama (yönetici) | Dönüşüm hunisi, durum dağılımı, günlük arama hacmi, temsilci performans tablosu, tarih filtresi, CSV aktarımı · tüm grafikler bağımlılıksız SVG |
| Yetki ve kayıt izi (yönetici) | Rol matrisi özeti + işlem logu tablosu |
| Meta lead kuyruğu | "Yeni lead düştü" simülasyonu: kuyruk → mükerrer numara kontrolü → en az yüklü temsilciye otomatik atama |

## Canlı Supabase bağlantısı

`.env.local` (veya Vercel ortam değişkenleri) tanımlıysa uygulama açılışta
veriyi Supabase'ten yükler ve her CRUD işlemini arka planda veritabanına
yazar; tanımlı değilse yerel demo verisiyle çalışır. Sol alt köşedeki rozet
hangi kaynağın aktif olduğunu gösterir.

```bash
cp .env.example .env.local   # değerleri Supabase panelinden doldurun
```

Şema ve tohum verisi `supabase/` klasöründedir: `migrations/0001_crm_schema.sql`
(tablolar + RLS), `migrations/0002_demo_write_policies.sql` (demo yazma
politikaları), `seed.sql` (güne göre üretilen demo kayıtlar).

## Mimari notlar

- Next.js 14 App Router + TypeScript + Tailwind. Sayfalar server component,
  etkileşimli parçalar ayrı client component.
- Demo verisi `lib/data/*` altında; okuma katmanı `lib/queries.ts` içinde saf
  seçicilerdir ve veri kaynağından bağımsızdır.
- Tüm CRUD `lib/store/DataProvider.tsx` üzerinde optimistik çalışır; Supabase
  yapılandırılmışsa her mutasyon `lib/supabase/*` üzerinden kalıcı yazılır ve
  her işlem kayıt izine (audit log) düşer.
- Demo saati güne sabitlenmiştir (`lib/demo-time.ts`): yerel tohum verisi her
  gün "bugüne göre" taze görünür; SQL tohumları da `current_date` üzerinden
  aynı davranışı gösterir.
