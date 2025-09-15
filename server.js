// server.js — basit mock API. Gerçek AI için OpenAI veya başka bir servise bağlayın.
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
app.use(cors());
app.use(bodyParser.json({limit:'2mb'}));
app.use(express.static('public')); // statik dosyalar için

app.post('/api/analyzeDream', (req, res) => {
  const { text, zodiac, isPremium } = req.body || {};
  // Basit kurallara dayalı mock response
  const base = isPremium ? "Premium detay: Derin bir dönüşüm ve fırsat dönemi." : "Ücretsiz özet: Yeni başlangıçlara hazırlanın.";
  res.json({ analysis: `${base} (burç: ${zodiac}) — kısaca: ${text.slice(0,120)}` });
});

app.post('/api/analyzeFortune', (req, res) => {
  const { type } = req.body || {};
  const pool = {
    kahve: ['Kahvede sevgi işareti.', 'Yakında yolculuk olabilir.'],
    el: ['Elinizde liderlik var.', 'Sağlık için dikkat.'],
    tarot: ['Kart: Dönüşüm', 'Kart: Denge']
  };
  res.json({ comment: pool[type] ? pool[type][Math.floor(Math.random()*pool[type].length)] : 'Fal yorumlanamadı.' });
});

app.post('/api/visualize', (req, res) => {
  // Gerçek uygulamada buradan bir image-generation servisi çağrılır.
  res.json({ imageUrl: 'https://via.placeholder.com/640x360?text=Generated+Image' });
});

const port = process.env.PORT || 3000;
app.listen(port, ()=>console.log(`Mock API running on http://localhost:${port}`));
