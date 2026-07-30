-- Duyu Konutları CRM · demo tohum verisi
-- lib/data/* ile aynı kayıtlar; tarihler çalıştırma gününe göre üretilir.

insert into app_users (id, name, role, title, initials, phone) values
  ('u-adil',   'Yönetici',            'yonetici', 'Satış Direktörü',  'YN', '0532 481 10 01'),
  ('u-ayse',   'Satış Temsilcisi 1',  'temsilci', 'Satış Temsilcisi', 'T1', '0532 481 10 02'),
  ('u-mehmet', 'Satış Temsilcisi 2',  'temsilci', 'Satış Temsilcisi', 'T2', '0532 481 10 03'),
  ('u-zeynep', 'Satış Temsilcisi 3',  'temsilci', 'Satış Temsilcisi', 'T3', '0532 481 10 04');

insert into leads (id, name, phone, email, status, source, blok, unit_no, unit_type, budget, assigned_to, note, created_at, updated_at) values
  ('l-mehmetk',   'Mehmet K.',     '0532 214 45 67', 'mehmetk@example.com', 'arandi',          'instagram-form', 'B', 3,  '2+1', 3450000, 'u-ayse',   'B Blok Daire 3 ile yakından ilgili, eşiyle birlikte örnek daireyi gezdi.', current_date - 18 + time '10:24', current_date + time '09:42'),
  ('l-omerc',     'Ömer Ç.',       '0533 682 91 14', null,                  'butce-asiyor',    'facebook-form',  'C', 12, '3+1', 4500000, 'u-mehmet', '3+1 istiyor ancak bütçesi liste fiyatının altında, uzun vade sorulacak.', current_date - 12 + time '14:05', current_date - 2 + time '11:30'),
  ('l-ersink',    'Ersin K.',      '0542 377 20 83', null,                  'mesgul',          'instagram-form', 'A', 8,  '2+1', 3200000, 'u-ayse',   'Meşgul, 17:00''den sonra arayın.', current_date - 37 + time '12:40', current_date + time '11:05'),
  ('l-sabahattin','Sabahattin D.', '0535 908 33 71', null,                  'ilgilenmiyor',    'instagram-form', null, null, '1+1', 2200000, 'u-zeynep', 'Formu doldurmuş ancak aramada yatırım düşünmediğini söyledi.', current_date - 9 + time '16:22', current_date - 8 + time '10:15'),
  ('l-nurettin',  'Nurettin A.',   '0536 145 62 09', null,                  'tekrar-aranacak', 'web-form',       'A', 14, '3+1', 4650000, 'u-mehmet', 'Kredi ön onayını bekliyor, bu hafta netleşecek.', current_date - 15 + time '09:10', current_date - 1 + time '15:45'),
  ('l-yildiz',    'Yıldız K.',     '0537 761 48 25', 'yildizk@example.com', 'ofise-gelecek',   'referans',       'B', 7,  '3+1', 4900000, 'u-zeynep', 'Bugün 16:00 satış ofisi randevusu, ödeme planı çıktısı hazırlanacak.', current_date - 6 + time '13:32', current_date + time '10:20'),
  ('l-elif',      'Elif S.',       '0538 224 90 41', null,                  'arandi',          'instagram-form', 'A', 5,  '1+1', 2400000, 'u-ayse',   'Yatırım amaçlı, kira getirisi sordu.', current_date - 4 + time '11:12', current_date + time '09:15'),
  ('l-burak',     'Burak Ö.',      '0539 415 77 30', null,                  'cevapsiz',        'facebook-form',  'B', 11, '2+1', 3300000, 'u-mehmet', null, current_date - 3 + time '15:48', current_date + time '10:05'),
  ('l-hatice',    'Hatice G.',     '0541 336 12 58', null,                  'beklemede',       'web-form',       'C', 2,  '2+1', 3550000, 'u-zeynep', 'Mevcut evinin satışını bekliyor.', current_date - 21 + time '10:05', current_date - 5 + time '14:20'),
  ('l-kemal',     'Kemal V.',      '0542 558 84 16', null,                  'ofise-gelecek',   'telefon',        'C', 18, '3+1', 5300000, 'u-ayse',   'Cumartesi 11:00 için ofis randevusu istedi.', current_date - 8 + time '12:50', current_date - 1 + time '09:40'),
  ('l-selin',     'Selin D.',      '0543 671 29 93', null,                  'formu-dolduran',  'instagram-form', null, null, '2+1', 3100000, 'u-zeynep', null, current_date + time '08:47', current_date + time '08:47'),
  ('l-orhan',     'Orhan B.',      '0544 782 45 07', null,                  'tekrar-aranacak', 'referans',       'A', 21, '2+1', 3400000, 'u-ayse',   'Yurt dışında, hafta sonu dönüyor.', current_date - 11 + time '16:35', current_date - 2 + time '10:10'),
  ('l-fatma',     'Fatma T.',      '0545 893 61 74', null,                  'arandi',          'facebook-form',  'B', 15, '1+1', 2550000, 'u-mehmet', null, current_date - 7 + time '09:28', current_date + time '11:32'),
  ('l-cem',       'Cem A.',        '0546 904 18 62', null,                  'butce-asiyor',    'web-form',       'B', 9,  '3+1', 4100000, 'u-zeynep', '3+1 için bütçe artırımı mümkün değil, 2+1 önerilecek.', current_date - 14 + time '13:15', current_date - 3 + time '16:05'),
  ('l-gul',       'Gül E.',        '0547 115 73 29', null,                  'mesgul',          'instagram-form', 'A', 3,  '1+1', 2350000, 'u-ayse',   'Mesai saatlerinde ulaşmak zor, öğle arası denenecek.', current_date - 5 + time '10:55', current_date - 1 + time '12:30'),
  ('l-serkan',    'Serkan M.',     '0548 226 84 15', null,                  'cevapsiz',        'instagram-form', 'C', 6,  '2+1', 3600000, 'u-mehmet', null, current_date - 2 + time '14:42', current_date + time '09:58'),
  ('l-derya',     'Derya P.',      '0549 337 95 08', null,                  'arandi',          'referans',       'B', 19, '2+1', 3500000, 'u-zeynep', 'Site içi sosyal alanları sordu, kataloğu iletildi.', current_date - 10 + time '11:18', current_date + time '12:14'),
  ('l-halil',     'Halil İ.',      '0551 448 06 91', null,                  'beklemede',       'telefon',        'A', 10, '3+1', 4400000, 'u-ayse',   'Şubat ayında yatırım kararı verecek.', current_date - 26 + time '15:05', current_date - 6 + time '10:45'),
  ('l-melis',     'Melis K.',      '0552 559 17 84', null,                  'formu-dolduran',  'facebook-form',  null, null, '3+1', 4800000, 'u-mehmet', null, current_date + time '10:12', current_date + time '10:12'),
  ('l-tolga',     'Tolga N.',      '0553 661 28 73', null,                  'tekrar-aranacak', 'web-form',       'C', 14, '2+1', 3650000, 'u-zeynep', 'Faiz oranlarını karşılaştırıyor, perşembe tekrar aranacak.', current_date - 6 + time '09:50', current_date - 1 + time '11:25'),
  ('l-sule',      'Şule R.',       '0554 772 39 62', null,                  'arandi',          'instagram-form', 'A', 17, '2+1', 3250000, 'u-ayse',   null, current_date - 13 + time '14:08', current_date - 4 + time '15:55'),
  ('l-volkan',    'Volkan H.',     '0555 883 40 51', null,                  'ilgilenmiyor',    'facebook-form',  null, null, '1+1', 2100000, 'u-mehmet', 'Farklı bir bölgeden konut almış.', current_date - 19 + time '12:33', current_date - 16 + time '09:20'),
  ('l-emine',     'Emine C.',      '0556 994 51 40', null,                  'ofise-gelecek',   'instagram-form', 'B', 22, '1+1', 2600000, 'u-zeynep', 'Yarın 14:00 ofis randevusu teyit edildi.', current_date - 4 + time '16:12', current_date + time '11:48'),
  ('l-baris',     'Barış U.',      '0557 105 62 38', null,                  'cevapsiz',        'web-form',       'A', 24, '2+1', 3350000, 'u-ayse',   null, current_date - 1 + time '13:27', current_date + time '10:40'),
  ('l-neslihan',  'Neslihan F.',   '0558 216 73 25', null,                  'beklemede',       'referans',       'C', 20, '3+1', 5100000, 'u-mehmet', 'Aile kararı bekleniyor.', current_date - 17 + time '10:44', current_date - 7 + time '13:10'),
  ('l-osman',     'Osman L.',      '0559 327 84 12', null,                  'butce-asiyor',    'telefon',        'C', 16, '3+1', 4300000, 'u-zeynep', 'C Blok 3+1 için bütçesi yetersiz, B Blok alternatifi sunulacak.', current_date - 8 + time '11:56', current_date - 2 + time '14:35'),
  ('l-pelin',     'Pelin T.',      '0561 438 95 03', null,                  'tekrar-aranacak', 'instagram-form', 'B', 13, '1+1', 2500000, 'u-ayse',   'Öğleden sonra müsait, 15:30 için not alındı.', current_date - 3 + time '09:22', current_date + time '09:05'),
  ('l-ibrahim',   'İbrahim D.',    '0562 549 06 97', null,                  'arandi',          'facebook-form',  'A', 12, '3+1', 4550000, 'u-mehmet', 'Örnek daire videosu istedi, iletildi.', current_date - 5 + time '15:38', current_date + time '13:22'),
  ('l-ceren',     'Ceren Y.',      '0563 651 17 86', null,                  'formu-dolduran',  'instagram-form', null, null, '2+1', 3000000, 'u-zeynep', null, current_date + time '12:03', current_date + time '12:03'),
  ('l-murat',     'Murat G.',      '0564 762 28 75', null,                  'cevapsiz',        'referans',       'B', 4,  '2+1', 3480000, 'u-mehmet', null, current_date - 2 + time '10:15', current_date + time '12:50'),
  ('l-huseyin',   'Hüseyin B.',    '0565 873 39 64', null,                  'ilgilenmiyor',    'web-form',       null, null, '2+1', 2900000, 'u-ayse',   'Kiralık arıyormuş, satılık ile ilgilenmiyor.', current_date - 23 + time '14:27', current_date - 20 + time '11:05');

insert into calls (id, lead_id, agent_id, at, result, note, next_call_at) values
  ('c-01', 'l-mehmetk',    'u-ayse',   current_date - 17 + time '11:10', 'arandi',          'İlk görüşme yapıldı, B Blok 2+1 planları anlatıldı.', current_date - 14 + time '14:00'),
  ('c-02', 'l-mehmetk',    'u-ayse',   current_date - 14 + time '14:05', 'arandi',          'Örnek daire gezisi için hafta sonu randevusu verildi.', null),
  ('c-03', 'l-mehmetk',    'u-ayse',   current_date + time '09:42',      'arandi',          'Gezinin ardından fiyat netleştirme görüşmesi, ödeme planı istendi.', current_date + time '16:30'),
  ('c-04', 'l-omerc',      'u-mehmet', current_date - 11 + time '10:20', 'arandi',          'C Blok 3+1 fiyatı paylaşıldı, bütçesinin üzerinde kaldı.', current_date - 2 + time '11:30'),
  ('c-05', 'l-omerc',      'u-mehmet', current_date - 2 + time '11:30',  'butce-asiyor',    '48 ay vade seçeneği anlatıldı, düşünecek.', null),
  ('c-06', 'l-ersink',     'u-ayse',   current_date - 36 + time '16:40', 'mesgul',          'Meşgul, 17:00''den sonra arayın dedi.', current_date - 36 + time '17:15'),
  ('c-07', 'l-ersink',     'u-ayse',   current_date - 36 + time '17:16', 'arandi',          '17:15 hatırlatmasıyla tekrar arandı, proje bilgisi verildi.', null),
  ('c-08', 'l-ersink',     'u-ayse',   current_date + time '11:05',      'mesgul',          'Toplantıda olduğunu söyledi, akşam saatleri istedi.', current_date + time '17:15'),
  ('c-09', 'l-sabahattin', 'u-zeynep', current_date - 8 + time '10:15',  'ilgilenmiyor',    'Formu yanlışlıkla doldurduğunu, alım planı olmadığını iletti.', null),
  ('c-10', 'l-nurettin',   'u-mehmet', current_date - 1 + time '15:45',  'tekrar-aranacak', 'Kredi ön onayı bekleniyor, sabah tekrar aranması istendi.', current_date + time '10:30'),
  ('c-11', 'l-yildiz',     'u-zeynep', current_date + time '10:20',      'ofise-gelecek',   'Bugünkü 16:00 randevusu teyit edildi, ödeme planı hazırlanacak.', current_date + time '16:00'),
  ('c-12', 'l-elif',       'u-ayse',   current_date + time '09:15',      'arandi',          'Kira getirisi projeksiyonu paylaşıldı.', null),
  ('c-13', 'l-burak',      'u-mehmet', current_date + time '10:05',      'cevapsiz',        'Ulaşılamadı, mesaj bırakıldı.', current_date + time '15:30'),
  ('c-14', 'l-serkan',     'u-mehmet', current_date + time '09:58',      'cevapsiz',        'İki kez denendi, yanıt yok.', null),
  ('c-15', 'l-derya',      'u-zeynep', current_date + time '12:14',      'arandi',          'Sosyal alan soruları yanıtlandı, karar aşamasında.', current_date + time '17:45'),
  ('c-16', 'l-fatma',      'u-mehmet', current_date + time '11:32',      'arandi',          'B Blok 1+1 stok bilgisi verildi.', null),
  ('c-17', 'l-baris',      'u-ayse',   current_date + time '10:40',      'cevapsiz',        'Ulaşılamadı, akşam tekrar denenecek.', current_date + time '18:00'),
  ('c-18', 'l-emine',      'u-zeynep', current_date + time '11:48',      'ofise-gelecek',   'Yarınki randevu için konum bilgisi iletildi.', null),
  ('c-19', 'l-ibrahim',    'u-mehmet', current_date + time '13:22',      'arandi',          'Video sonrası soruları yanıtlandı, eşiyle değerlendirecek.', null),
  ('c-20', 'l-murat',      'u-mehmet', current_date + time '12:50',      'cevapsiz',        'Ulaşılamadı.', null),
  ('c-21', 'l-pelin',      'u-ayse',   current_date + time '09:05',      'tekrar-aranacak', 'Öğleden sonra müsait olacağını söyledi.', current_date + time '15:30');

insert into reminders (id, lead_id, agent_id, type, due_at, note, done, created_at) values
  ('r-01', 'l-nurettin', 'u-mehmet', 'arama',   current_date + time '10:30',      'Kredi ön onayı sonucu sorulacak.', false, current_date - 1 + time '15:45'),
  ('r-02', 'l-gul',      'u-ayse',   'arama',   current_date + time '12:15',      'Öğle arasında ulaşmayı dene.', false, current_date - 1 + time '12:30'),
  ('r-03', 'l-pelin',    'u-ayse',   'arama',   current_date + time '15:30',      'Öğleden sonra müsait, B Blok 1+1 fiyatı paylaşılacak.', false, current_date + time '09:05'),
  ('r-04', 'l-burak',    'u-mehmet', 'arama',   current_date + time '15:30',      'Mesaj bırakıldı, tekrar denenecek.', false, current_date + time '10:05'),
  ('r-05', 'l-yildiz',   'u-zeynep', 'randevu', current_date + time '16:00',      'Satış ofisi görüşmesi · B Blok 3+1 ödeme planı çıktısı hazır olsun.', false, current_date + time '10:20'),
  ('r-06', 'l-mehmetk',  'u-ayse',   'arama',   current_date + time '16:30',      'Ödeme planı üzerinden fiyat netleştirilecek.', false, current_date + time '09:42'),
  ('r-07', 'l-ersink',   'u-ayse',   'arama',   current_date + time '17:15',      '17:00 sonrası müsait, proje sunumu tamamlanacak.', false, current_date + time '11:05'),
  ('r-08', 'l-derya',    'u-zeynep', 'arama',   current_date + time '17:45',      'Karar görüşmesi.', false, current_date + time '12:14'),
  ('r-09', 'l-baris',    'u-ayse',   'arama',   current_date + time '18:00',      'Gün sonunda tekrar dene.', false, current_date + time '10:40'),
  ('r-10', 'l-emine',    'u-zeynep', 'randevu', current_date + 1 + time '14:00',  'Yarın 14:00 ofis randevusu · hazırlık kontrolü bugün yapılacak.', false, current_date + time '11:48'),
  ('r-11', 'l-tolga',    'u-zeynep', 'arama',   current_date - 1 + time '16:00',  'Faiz karşılaştırması sonrası dönüş bekleniyordu.', false, current_date - 6 + time '09:50'),
  ('r-12', 'l-ersink',   'u-ayse',   'arama',   current_date - 36 + time '17:15', 'Meşguldü, 17:00 sonrası tekrar aranacak (24.06 · 17:15).', true, current_date - 36 + time '16:40'),
  ('r-13', 'l-kemal',    'u-ayse',   'randevu', current_date + 2 + time '11:00',  'Hafta sonu 11:00 satış ofisi randevusu.', false, current_date - 1 + time '09:40');

insert into payment_plans (id, name, blok, unit_type, list_price, down_payment_pct, installment_months, cash_price, highlights, updated_at) values
  ('p-a-1p1', 'A Blok · 1+1 · Standart Plan',    'A', '1+1', 2350000, 30, 24, 2150000, array['%30 peşinat + 24 ay eşit taksit', 'Peşin ödemede özel fiyat', 'Tapu masrafları firmaya ait'], current_date - 21 + time '10:00'),
  ('p-a-2p1', 'A Blok · 2+1 · Standart Plan',    'A', '2+1', 3280000, 25, 36, 2990000, array['%25 peşinat + 36 ay eşit taksit', 'İlk 6 ay ara ödemesiz', 'Peşin ödemede özel fiyat'], current_date - 21 + time '10:05'),
  ('p-a-3p1', 'A Blok · 3+1 · Standart Plan',    'A', '3+1', 4450000, 25, 36, 4090000, array['%25 peşinat + 36 ay eşit taksit', 'Banka kredisi ile birleştirilebilir'], current_date - 14 + time '11:20'),
  ('p-b-1p1', 'B Blok · 1+1 · Standart Plan',    'B', '1+1', 2480000, 30, 24, 2280000, array['%30 peşinat + 24 ay eşit taksit', 'Yatırımcıya kira garantisi seçeneği'], current_date - 14 + time '11:25'),
  ('p-b-2p1', 'B Blok · 2+1 · Standart Plan',    'B', '2+1', 3450000, 25, 36, 3190000, array['%25 peşinat + 36 ay eşit taksit', 'Peşin ödemede özel fiyat', 'Teslimde %10 ara ödeme'], current_date - 7 + time '09:45'),
  ('p-b-3p1', 'B Blok · 3+1 · Prestij Plan',     'B', '3+1', 4750000, 25, 36, 4390000, array['%25 peşinat + 36 ay eşit taksit', 'Peşin ödemede özel fiyat', 'Manzara cephesi önceliği'], current_date - 7 + time '09:50'),
  ('p-c-2p1', 'C Blok · 2+1 · Uzun Vade Planı',  'C', '2+1', 3680000, 20, 48, 3390000, array['%20 peşinat + 48 ay eşit taksit', 'Düşük peşinatlı giriş seçeneği'], current_date - 3 + time '16:10'),
  ('p-c-3p1', 'C Blok · 3+1 · Prestij Plan',     'C', '3+1', 5400000, 30, 30, 4990000, array['%30 peşinat + 30 ay eşit taksit', 'Peşin ödemede özel fiyat', 'Çift balkon ve ebeveyn banyosu'], current_date - 3 + time '16:15');

insert into print_logs (id, plan_id, agent_id, lead_id, at) values
  ('pl-01', 'p-b-2p1', 'u-ayse',   'l-mehmetk', current_date - 14 + time '14:20'),
  ('pl-02', 'p-c-3p1', 'u-mehmet', 'l-omerc',   current_date - 11 + time '10:35'),
  ('pl-03', 'p-b-3p1', 'u-zeynep', 'l-yildiz',  current_date - 5 + time '15:10'),
  ('pl-04', 'p-a-2p1', 'u-ayse',   'l-sule',    current_date - 4 + time '16:05'),
  ('pl-05', 'p-c-2p1', 'u-zeynep', 'l-tolga',   current_date - 1 + time '11:40'),
  ('pl-06', 'p-b-3p1', 'u-zeynep', 'l-yildiz',  current_date + time '10:25');

insert into audit_logs (id, user_id, action, target, detail, at) values
  ('a-01', 'u-adil',   'Rapor görüntüleme',       'Haftalık performans raporu', null, current_date - 1 + time '18:05'),
  ('a-02', 'u-ayse',   'Arama kaydı ekleme',      'Mehmet K.', 'Sonuç: Arandı · sonraki arama bugün 16:30', current_date + time '09:42'),
  ('a-03', 'u-zeynep', 'Ödeme planı yazdırma',    'B Blok · 3+1 · Prestij Plan', 'Müşteri: Yıldız K.', current_date + time '10:25'),
  ('a-04', 'u-mehmet', 'Durum güncelleme',        'Ömer Ç.', 'Beklemede → Bütçesini Aşıyor', current_date - 2 + time '11:32'),
  ('a-05', 'u-adil',   'Lead atama',              'Selin D.', 'Meta kuyruğundan Zeynep A. üzerine', current_date + time '08:49'),
  ('a-06', 'u-ayse',   'CSV dışa aktarma',        'Müşteri listesi (filtre: Bugün aranacaklar)', null, current_date - 1 + time '17:12'),
  ('a-07', 'u-adil',   'Ödeme planı güncelleme',  'C Blok · 2+1 · Uzun Vade Planı', 'Vade 36 ay → 48 ay', current_date - 3 + time '16:10'),
  ('a-08', 'u-zeynep', 'Hatırlatma tamamlama',    'Derya P.', 'Öğle araması yapıldı', current_date + time '12:16'),
  ('a-09', 'u-mehmet', 'Yeni müşteri ekleme',     'Murat G.', 'Kaynak: Referans', current_date - 2 + time '10:15'),
  ('a-10', 'u-adil',   'Yetki güncelleme',        'Zeynep A.', 'Rapor görüntüleme izni talebi reddedildi', current_date - 4 + time '09:30'),
  ('a-11', 'u-ayse',   'Ödeme planı yazdırma',    'A Blok · 2+1 · Standart Plan', 'Müşteri: Şule R.', current_date - 4 + time '16:05'),
  ('a-12', 'u-adil',   'Sisteme giriş',           'Yönetici paneli', null, current_date + time '08:30');
