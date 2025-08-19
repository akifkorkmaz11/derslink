# 🚀 Derslink Migration Guide

Bu rehber, Derslink sisteminin kurulumu ve veritabanı migration işlemlerini açıklar

## 📋 Ön Gereksinimler

- Supabase hesabı
- Node.js 16+ 
- npm veya yarn

## 🗄️ Veritabanı Kurulumu

### 1. Supabase Projesi Oluşturma

1. [Supabase](https://supabase.com) hesabınıza giriş yapın
2. Yeni proje oluşturun
3. Proje URL ve API anahtarlarını not edin

### 2. Veritabanı Şeması

Supabase SQL Editor'de sırasıyla şu dosyaları çalıştırın:

#### Adım 1: Ana Şema
```sql
-- database-schema.sql dosyasının içeriğini kopyalayıp yapıştırın
```

#### Adım 2: Öğretmenler
```sql
-- create-teachers-table.sql dosyasının içeriğini kopyalayıp yapıştırın
```

#### Adım 3: Program Sütunu Düzeltme (Eğer Gerekirse)
```sql
-- fix-program-column.sql dosyasının içeriğini kopyalayıp yapıştırın
```

#### Adım 4: Enrollment Status Sütunu Ekleme (Eğer Gerekirse)
```sql
-- fix-enrollment-status.sql dosyasının içeriğini kopyalayıp yapıştırın
```

#### Adım 5: YKS Sistemi
```sql
-- create-yks-teachers-and-classes.sql dosyasının içeriğini kopyalayıp yapıştırın
```

#### Adım 6: Enrollment Sayılarını Düzelt
```sql
-- fix-enrollment-counts.sql dosyasının içeriğini kopyalayıp yapıştırın
```

#### Adım 7: LGS Sınıfları (Opsiyonel)
```sql
-- seed-lgs-classes.sql dosyasının içeriğini kopyalayıp yapıştırın
```

#### Adım 8: Örnek Veriler (Opsiyonel)
```sql
-- seed-data.sql dosyasının içeriğini kopyalayıp yapıştırın
```

## 🔧 Proje Kurulumu

### 1. Proje Klonlama
```bash
git clone https://github.com/your-repo/derslink.git
cd derslink
```

### 2. Bağımlılıkları Yükleme
```bash
npm install
```

### 3. Çevre Değişkenleri
`.env` dosyası oluşturun:

```env
# Supabase
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# İyzico (Opsiyonel)
IYZICO_API_KEY=your_iyzico_api_key
IYZICO_SECRET_KEY=your_iyzico_secret_key
```

### 4. Supabase Konfigürasyonu
`supabase-config.js` dosyasını güncelleyin:

```javascript
const SUPABASE_URL = 'your_supabase_project_url';
const SUPABASE_ANON_KEY = 'your_supabase_anon_key';
```

## 🎯 Sistem Özellikleri

### LGS Sistemi
- **Sınıf Türleri**: Hafta içi, hafta sonu, karma
- **Dersler**: Matematik, Türkçe, Fen, Sosyal, İngilizce
- **Kapasite**: 25 öğrenci/sınıf

### YKS Sistemi
- **TYT/AYT Hocaları**: Hoca1-Hoca16
- **Alanlar**: Sayısal, Eşit Ağırlık, Sözel
- **Detaylı Programlar**: Her alan için özel ders dağılımı

## 🔍 Veritabanı Kontrolü

### Tabloları Kontrol Etme
```sql
-- Kullanıcıları kontrol et
SELECT * FROM users LIMIT 5;

-- Öğretmenleri kontrol et
SELECT * FROM teachers;

-- Sınıfları kontrol et
SELECT * FROM classes WHERE program = 'YKS';

-- Ders programlarını kontrol et
SELECT * FROM class_schedules WHERE program = 'YKS' LIMIT 10;
```

### İndeksleri Kontrol Etme
```sql
-- İndeksleri listele
SELECT indexname, tablename FROM pg_indexes WHERE schemaname = 'public';
```

## 🚀 Deployment

### Vercel (Önerilen)
```bash
# Vercel CLI kurulumu
npm i -g vercel

# Deploy
vercel

# Environment variables ayarla
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
```

### Netlify
```bash
# Build
npm run build

# Netlify'e yükle ve environment variables ayarla
```

## 🔧 Sorun Giderme

### Yaygın Hatalar

#### 1. Supabase Bağlantı Hatası
```javascript
// supabase-config.js'de URL'yi kontrol edin
console.log('Supabase URL:', SUPABASE_URL);
```

#### 2. Tablo Bulunamadı Hatası
```sql
-- Tabloları kontrol edin
\dt

-- Tablo yapısını kontrol edin
\d table_name
```

#### 3. İndeks Hatası
```sql
-- İndeksleri yeniden oluşturun
REINDEX DATABASE your_database_name;
```

### Log Kontrolü
```bash
# Browser console'da hataları kontrol edin
F12 > Console

# Network sekmesinde API çağrılarını kontrol edin
F12 > Network
```

## 📊 Performans Optimizasyonu

### Veritabanı İndeksleri
```sql
-- Performans için ek indeksler
CREATE INDEX IF NOT EXISTS idx_class_schedules_teacher ON class_schedules(teacher_name);
CREATE INDEX IF NOT EXISTS idx_class_schedules_subject ON class_schedules(subject);
```

### Row Level Security (RLS)
```sql
-- Güvenlik için RLS aktifleştirin
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_schedules ENABLE ROW LEVEL SECURITY;
```

## 🔄 Güncelleme

### Yeni Özellik Ekleme
1. Veritabanı şemasını güncelleyin
2. Frontend kodunu güncelleyin
3. Test edin
4. Deploy edin

### Veri Migration
```sql
-- Yeni sütun ekleme
ALTER TABLE table_name ADD COLUMN new_column_name VARCHAR(255);

-- Veri güncelleme
UPDATE table_name SET new_column_name = 'default_value';
```

## 📞 Destek

- **GitHub Issues**: [Repo Issues](https://github.com/your-repo/issues)
- **E-posta**: support@derslink.com
- **Dokümantasyon**: [Docs](https://docs.derslink.com)

---

**Migration tamamlandı!** 🎉

Sisteminiz artık kullanıma hazır. Herhangi bir sorun yaşarsanız yukarıdaki destek kanallarından yardım alabilirsiniz.
