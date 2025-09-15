// server.js (type: module)
import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json({ limit: '6mb' }));

const OPENAI_KEY = process.env.OPENAI_API_KEY || null;
const PORT = process.env.PORT || 3000;

async function callOpenAIChat(prompt, temperature = 0.9) {
  if (!OPENAI_KEY) throw new Error('OPENAI_API_KEY yok');
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${OPENAI_KEY}` },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a creative, empathetic and culturally-aware Turkish dream interpreter and fortune teller. Provide rich, varied, non-repetitive answers.' },
        { role: 'user', content: prompt }
      ],
      temperature,
      max_tokens: 900
    })
  });
  const j = await res.json();
  if (!res.ok) throw new Error(j?.error?.message || 'OpenAI hatası');
  return j.choices?.[0]?.message?.content || '';
}

function localDreamGenerator(text, zodiac, isPremium) {
  const templates = [
    `Bu rüya içsel bir davetiye: ${zodiac} için duygusal bir temizlenme süreci var.`,
    `Gördüğün semboller yeni bir yöne işaret ediyor; ${zodiac} enerjisiyle adım at.`,
    `Rüyanda tekrar eden imgeler geçmişten gelen bir mesaj gibi; dikkatle dinle.`,
    `Rüya, yakın zamanda olacak küçük ama önemli bir olayın habercisi olabilir.`
  ];
  const endings = [
    'Sağlık: dinlenmeye önem ver.',
    'İlişkiler: açık iletişim kur.',
    'Kariyer: yeni bir teklif olabilir.',
    'Finans: temkinli adım at.'
  ];
  let base = templates[Math.floor(Math.random() * templates.length)];
  if (text.toLowerCase().includes('su')) base += ' Su imgeleri duygusal bir temizlenmeye işarettir.';
  if (isPremium) base += ' (Premium not: geleceğe yönelik somut adım önerileri eklenir.)';
  base += ' ' + endings[Math.floor(Math.random() * endings.length)];
  return base;
}

app.post('/api/analyzeDream', async (req, res) => {
  try {
    const { text, zodiac, isPremium } = req.body || {};
    if (!text) return res.status(400).json({ error: 'text gerekli' });

    if (OPENAI_KEY) {
      const prompt = `Burç: ${zodiac}\nRüya: ${text}\nLütfen ayrıntılı, özgün ve ilham verici bir rüya tabiri yaz. Premium=${!!isPremium}`;
      const analysis = await callOpenAIChat(prompt, isPremium ? 0.95 : 0.8);
      return res.json({ analysis });
    } else {
      const analysis = localDreamGenerator(text, zodiac, isPremium);
      return res.json({ analysis });
    }
  } catch (err) {
    console.error('analyzeDream error', err);
    res.status(500).json({ error: err.message || 'Sunucu hatası' });
  }
});

app.post('/api/analyzeFortune', async (req, res) => {
  try {
    const { type, imageBase64, isPremium, forceRandom } = req.body || {};
    if (!type) return res.status(400).json({ error: 'type gerekli' });

    if (OPENAI_KEY && !forceRandom) {
      // we send a descriptive prompt; image analysis not implemented here — for image-capable models you'd pass the image to a vision model
      const prompt = `Tür: ${type}\nKısa açıklama: kullanıcı bir fal görüntüsü gönderdi veya göndermedi.\nLütfen nazik, detaylı ve özgün bir fal yorumu yaz. Premium=${!!isPremium}`;
      const comment = await callOpenAIChat(prompt, isPremium ? 0.9 : 0.6);
      return res.json({ comment });
    } else {
      const pool = {
        kahve: ['Kahve falında güzel bir yol görünüyor.', 'Küçük bir sürpriz kapıda—hazırlıklı ol.'],
        el: ['El falında liderlik çizgisi var.', 'Sağlık konusunda küçük uyarılar mevcut, dikkatli ol.'],
        tarot: ['Tarot: dönüşüm ve yeni fırsat zamanı.', 'Tarot: denge ve sabır gerektiren bir dönem.']
      };
      const arr = pool[type] || ['Fal bulunamadı.'];
      const comment = arr[Math.floor(Math.random() * arr.length)];
      return res.json({ comment });
    }
  } catch (err) {
    console.error('analyzeFortune error', err);
    res.status(500).json({ error: err.message || 'Sunucu hatası' });
  }
});

app.post('/api/visualize', async (req, res) => {
  try {
    const { text, isPremium } = req.body || {};
    if (!text) return res.status(400).json({ error: 'text gerekli' });

    if (OPENAI_KEY) {
      // NOTE: image generation integration depends on your chosen provider.
      // Below is a placeholder response. Implement images API call here for true generation.
      return res.json({ imageUrl: 'https://via.placeholder.com/640x360?text=Generated+Dream' });
    } else {
      return res.json({ imageUrl: 'https://via.placeholder.com/640x360?text=Dream+Placeholder' });
    }
  } catch (err) {
    console.error('visualize error', err);
    res.status(500).json({ error: err.message || 'Sunucu hatası' });
  }
});

app.get('/health', (req, res) => res.json({ ok: true, openai: !!OPENAI_KEY }));

app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT} (OPENAI=${!!OPENAI_KEY})`));
