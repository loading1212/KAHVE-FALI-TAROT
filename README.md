# DreamWeaver AI (Web PWA)

## Dosyalar
- index.html
- manifest.json
- sw.js
- offline.html
- (opsiyonel) server.js + package.json (mock backend)

## Local test
1. Repo köküne icon-192x192.png ve icon-512x512.png ekleyin.
2. (Opsiyonel) Mock backend çalıştırmak için:
   - `npm install`
   - `npm start` -> http://localhost:3000
3. Basit test: `npx http-server -p 8080` veya GitHub Pages ile barındırın.
4. Tarayıcıda siteyi açın; service worker register olur.

## APKCreator / WebView -> APK
- Eğer APKCreator kullanıyorsanız:
  - GitHub Pages veya herhangi bir HTTPS URL üzerinden barındırın (PWA için HTTPS zorunlu).
  - WebView içeren APK oluştururken `start_url` ve manifest kullanımına dikkat: bazı WebView uygulamaları service worker ile tam uyumlu çalışmayabilir.
  - Görselleri yerel olarak (apk içine) gömmek isterseniz, `index.html` içindeki tüm harici URL'leri (Google Fonts, placeholder) local kopyalarla değiştirin.

## AI entegrasyonu
- `analyzeDream`, `visualize`, `analyzeFortune` fonksiyonları backend çağrıları yapacak şekilde hazırlandı.
- Gerçek AI için OpenAI veya başka bir görsel üretim API'si bağladığınızda backend'den çağırın (API anahtarlarını güvenli sunucu tarafında saklayın).

## Güvenlik & Gizlilik
- Kullanıcı verilerini localStorage'da saklıyoruz — hassas veriler için server-side saklama önerilir.
- API anahtarları & ödemeler için sunucu entegrasyonu gereklidir.

