# Iyzico Production Konfigürasyonu

## 🚀 Sandbox'tan Production'a Geçiş

Bu dosya, Iyzico'yu sandbox ortamından gerçek production ortamına geçirmek için gerekli adımları içerir.

## 📋 Gerekli Değişiklikler

### 1. Environment Variables

Vercel dashboard'unda aşağıdaki environment variables'ları ayarlayın:

```bash
IYZICO_API_KEY=your_production_api_key_here
IYZICO_SECRET_KEY=your_production_secret_key_here
IYZICO_URI=https://api.iyzipay.com
```

### 2. Kod Değişiklikleri

✅ **Tamamlandı:**
- `api/server.js` dosyasında Iyzico konfigürasyonu production'a çevrildi
- Test kartı kontrolü kaldırıldı
- Gerçek kart ödemeleri aktif hale getirildi

### 3. Iyzico Dashboard Ayarları

1. **Iyzico Merchant Dashboard**'a giriş yapın
2. **Settings > API Keys** bölümüne gidin
3. Production API Key ve Secret Key'i alın
4. **Webhook URL**'ini ayarlayın (isteğe bağlı)

### 4. Test Etme

Production'a geçmeden önce:

1. **Test Kartları** ile ödeme testi yapın
2. **Küçük tutarlar** ile gerçek ödeme testi yapın
3. **Webhook** entegrasyonunu test edin

## 🔧 Geri Alma (Rollback)

Eğer sorun yaşarsanız, sandbox'a geri dönmek için:

```javascript
// api/server.js dosyasında
const iyzipay = new Iyzipay({
    apiKey: 'sandbox-afXhZPW0MQlE4dCUUlHcEopnMBgXnAZI',
    secretKey: 'sandbox-wbwpzKJDmlGqJxlzQpGgddCtB1QbT2Hq',
    uri: 'https://sandbox-api.iyzipay.com'
});
```

## 📞 Destek

- **Iyzico Destek:** https://www.iyzico.com/tr/destek
- **API Dokümantasyonu:** https://dev.iyzipay.com/tr

## ⚠️ Önemli Notlar

1. **API Key'leri güvenli tutun** - asla kod içinde paylaşmayın
2. **Test ortamında** yeterince test yapın
3. **Logları takip edin** - ödeme hatalarını izleyin
4. **Backup alın** - değişiklik öncesi kodun yedeğini alın

## 🎯 Sonraki Adımlar

1. ✅ Environment variables'ları Vercel'e ekleyin
2. ✅ Kodu deploy edin
3. ✅ Test ödemesi yapın
4. ✅ Monitoring kurun
5. ✅ Webhook entegrasyonu (isteğe bağlı)
