# 📚 Derslink - LGS & YKS Sınıf Yönetim Sistemi

Modern ve kullanıcı dostu bir sınıf yönetim sistemi. LGS ve YKS öğrencileri için özel olarak tasarlanmış, Supabase backend ile güçlendirilmiş web uygulaması.

## 🚀 Özellikler

### 📖 LGS Sistemi
- **Sınıf Yönetimi**: Hafta içi, hafta sonu ve karma sınıflar
- **Ders Programları**: Çakışmayan, optimize edilmiş ders saatleri
- **Öğretmen Yönetimi**: LGS öğretmenleri ve ders dağılımları
- **Öğrenci Takibi**: Kayıt, devam durumu ve performans takibi
- **Otomatik Sınıf Yerleştirme**: Yeni kayıt olan öğrenciler otomatik olarak uygun sınıfa yerleştirilir

### 🎯 YKS Sistemi
- **TYT/AYT Hocaları**: Gerçek TYT/AYT öğretmenleri (Hoca1-Hoca16)
- **Alan Seçimi**: Sayısal, Eşit Ağırlık, Sözel alanları
- **Detaylı Programlar**: 
  - **Sayısal**: 2 TYT Matematik, 3 AYT Matematik, 3 Fizik, 2 Kimya, 2 Biyoloji
  - **Eşit Ağırlık**: 2 TYT Matematik, 2 AYT Matematik, 2 Edebiyat, 1 Coğrafya, 1 Tarih, 1 Felsefe, 1 Kimya, 1 Fizik, 1 Biyoloji
  - **Sözel**: 2 TYT Matematik, 2 Edebiyat, 2 Coğrafya, 2 Tarih, 1 Felsefe, 1 Fizik, 1 Kimya, 1 Biyoloji
- **12 Sınıf Sistemi**: 4 Hafta İçi + 4 Hafta Sonu + 4 Karma sınıf
- **Otomatik Sınıf Yerleştirme**: YKS öğrencileri de otomatik olarak uygun sınıfa yerleştirilir

### 🔧 Genel Özellikler
- **Gerçek Zamanlı Enrollment Takibi**: Sınıf kapasiteleri otomatik güncellenir
- **Admin Paneli**: Öğrenci sınıf atama ve yönetimi
- **Dashboard**: Öğrenci programları ve sınıf bilgileri
- **Ödeme Sistemi**: İyzico entegrasyonu

### 🔧 Teknik Özellikler
- **Modern UI/UX**: Responsive tasarım
- **Real-time Updates**: Canlı veri güncellemeleri
- **Admin Paneli**: Kapsamlı yönetim araçları
- **Ödeme Sistemi**: İyzico entegrasyonu
- **Güvenlik**: Supabase Auth ile güvenli kimlik doğrulama

## 🛠️ Kurulum

### 1. Veritabanı Kurulumu

#### Supabase SQL Editor'de çalıştırın:

```sql
-- 1. Veritabanı şemasını oluştur
-- database-schema.sql dosyasının içeriğini kopyalayıp yapıştırın

-- 2. Öğretmenleri ekle
-- create-teachers-table.sql dosyasının içeriğini kopyalayıp yapıştırın

-- 3. YKS sistemini kur
-- create-yks-teachers-and-classes.sql dosyasının içeriğini kopyalayıp yapıştırın
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

### 2. Proje Kurulumu

```bash
# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat
npm run dev

# Production build
npm run build
```

### 3. Çevre Değişkenleri

`.env` dosyası oluşturun:

```env
# Supabase
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# İyzico
# Iyzico Production Configuration
IYZICO_API_KEY=your_production_api_key_here
IYZICO_SECRET_KEY=your_production_secret_key_here
IYZICO_URI=https://api.iyzipay.com

# Sandbox Configuration (test için)
# IYZICO_API_KEY=sandbox-afXhZPW0MQlE4dCUUlHcEopnMBgXnAZI
# IYZICO_SECRET_KEY=sandbox-wbwpzKJDmlGqJxlzQpGgddCtB1QbT2Hq
# IYZICO_URI=https://sandbox-api.iyzipay.com
```

## 📁 Proje Yapısı

```
derslink/
├── 📄 database-schema.sql          # Ana veritabanı şeması
├── 📄 create-teachers-table.sql    # Öğretmen tablosu ve verileri
├── 📄 create-yks-teachers-and-classes.sql  # YKS sistemi kurulumu
├── 📄 seed-lgs-classes.sql         # LGS sınıf verileri
├── 📄 seed-data.sql               # Örnek veriler
├── 📄 admin.html                  # Admin paneli
├── 📄 admin-yks.html              # YKS admin paneli
├── 📄 admin-lgs.html              # LGS admin paneli
├── 📄 dashboard.html              # Öğrenci dashboard
├── 📄 index.html                  # Ana sayfa
├── 📄 admin.js                    # Admin paneli JavaScript
├── 📄 admin-yks.js                # YKS admin JavaScript
├── 📄 dashboard.js                # Dashboard JavaScript
├── 📄 script.js                   # Ana JavaScript
├── 📄 styles.css                  # Ana CSS
├── 📄 supabase-config.js          # Supabase konfigürasyonu
├── 📄 iyzico-config.js            # İyzico konfigürasyonu
└── 📄 package.json                # Proje bağımlılıkları
```

## 🎯 Kullanım

### Admin Paneli
- **LGS Admin**: `/admin-lgs.html` - LGS sınıfları ve öğretmenleri yönetimi
- **YKS Admin**: `/admin-yks.html` - YKS sınıfları ve TYT/AYT hocaları yönetimi
- **Genel Admin**: `/admin.html` - Tüm sistem yönetimi

### Öğrenci Dashboard
- **Ana Dashboard**: `/dashboard.html` - Öğrenci bilgileri ve sınıf programları
- **Sınıf Seçimi**: Program türüne göre sınıf kayıt işlemleri

## 🔧 YKS Sistemi Detayları

### TYT/AYT Hocaları
- **Hoca1-Hoca2**: TYT Matematik
- **Hoca3-Hoca5**: AYT Matematik
- **Hoca6-Hoca8**: Fizik (TYT/AYT)
- **Hoca9-Hoca10**: Kimya (TYT/AYT)
- **Hoca11-Hoca12**: Biyoloji (TYT/AYT)
- **Hoca13**: Edebiyat (AYT)
- **Hoca14**: Coğrafya (TYT/AYT)
- **Hoca15**: Tarih (TYT/AYT)
- **Hoca16**: Felsefe (TYT/AYT)

### Sınıf Türleri
- **Hafta İçi**: Pazartesi-Cuma
- **Hafta Sonu**: Cumartesi-Pazar
- **Karma**: Hafta içi + Hafta sonu

## 🚀 Deployment

### Vercel (Önerilen)
```bash
# Vercel CLI kurulumu
npm i -g vercel

# Deploy
vercel
```

### Netlify
```bash
# Build
npm run build

# Netlify'e yükle
```

## 📞 Destek

Herhangi bir sorun yaşarsanız:
- GitHub Issues açın
- E-posta gönderin
- Dokümantasyonu kontrol edin

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

---

**Derslink** - Eğitimde dijital dönüşüm 🚀