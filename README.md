# All Denims - Denim Maliyet Hesaplama

Denim üretim maliyetlerini hesaplayan React uygulaması.

## 🚀 Canlı Demo

**[https://alldenims.vercel.app/](https://all-denim-client.vercel.app/)**

## 🚀 Özellikler

- Firma yönetimi (ekleme/görüntüleme)
- Paket tipi seçimi (0-50, 51-100, 101-200 adet)
- İşlem maliyetleri girişi (TRY)
- Çoklu para birimi (EUR, TRY, USD, GBP)
- Gerçek zamanlı döviz kurları
- Hesaplama geçmişi
- Excel export
- Responsive tasarım

## 🛠️ Teknolojiler

- React 19 + Vite
- Tailwind CSS
- Radix UI
- Lucide React

## 📦 Kurulum

```bash
git clone https://github.com/arslanberatt/all-denim-client.git
cd all-denim-client

npm install

cp .env.example .env
# VITE_API_URL= api urlsi

npm run dev

npm run build
```

## 🌐 API

- `GET /companies` - Firma listesi
- `POST /companies` - Yeni firma
- `POST /calculations` - Maliyet hesaplama
- `GET /calculations` - Hesaplama geçmişi

## 🚀 Deploy

### Vercel

1. GitHub'a push et
2. Vercel'e bağla
3. Environment variable ayarla: `VITE_API_URL`

## 📱 Kullanım

1. Firma seç veya yeni ekle
2. Paket tipini seç
3. İşlem maliyetlerini gir (TRY)
4. Hesapla
5. Excel export yap
