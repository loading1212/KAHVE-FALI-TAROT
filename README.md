DreamWeaver — Full paket (frontend + backend)

1) Dosya yapısı (repo root):
 - index.html
 - manifest.json
 - sw.js
 - offline.html
 - icon-192x192.png
 - icon-512x512.png
 - server.js
 - package.json
 - .gitignore
 - README.md

2) Backend (API)
 - Node 18+ önerilir.
 - Terminal:
    npm install
    OPENAI_API_KEY="YOUR_KEY" npm start
 - Sunucu 3000'de açılır. Eğer OPENAI_API_KEY yoksa local fallback çalışır.

3) Frontend (dev)
 - Ayrı terminalde proje kökünde:
    npx http-server -p 8080
 - Tarayıcıda: http://localhost:8080

4) Production / GitHub Pages + Hosted API
 - Frontend'i GitHub Pages'e push et (HTTPS).
 - Backend'i Render / Vercel (Node) veya Heroku üzerinde çalıştır.
 - FRONTEND'deki API çağrılarını (API_BASE) gerekirse backend URL'sine güncelle.

5) APKCreator
 - GitHub Pages URL'sini ver. HTTPS olmalı.
 - WebView ayarlarında JS etkin olsun.
 - Not: bazı WebView'larda service worker tam desteklenmez; offline özellikler sınırlı olabilir.

6) OpenAI
 - OPENAI_API_KEY env değişkeni ile backend'e ekle.
 - Production için API anahtarlarını sunucuda sakla (asla client-side gönderme).

7) Öneriler
 - Görseller: icon-*.png yerel ekle.
 - Görsel üretimi istersen backend `visualize` kısmını DALL·E / image api ile bağlayalım.
