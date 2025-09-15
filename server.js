import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app=express();
app.use(cors());
app.use(express.json({limit:"2mb"}));

app.post("/api/analyzeDream",async(req,res)=>{
  const {text,zodiac,isPremium}=req.body;
  const prompt=`Burç: ${zodiac}\nRüya: ${text}\nPremium:${isPremium}\nLütfen detaylı ve ilham verici rüya tabiri yap.`;
  const r=await fetch("https://api.openai.com/v1/chat/completions",{
    method:"POST",
    headers:{"Content-Type":"application/json","Authorization":"Bearer "+process.env.OPENAI_API_KEY},
    body:JSON.stringify({model:"gpt-4o-mini",messages:[{role:"user",content:prompt}]})
  });
  const j=await r.json();
  res.json({analysis:j.choices[0].message.content});
});

app.post("/api/analyzeFortune",(req,res)=>{
  const {type}=req.body;
  const pool={
    kahve:["Kahvede yol görünüyor.","Sevgi işareti belirdi."],
    el:["Elinizde güçlü çizgiler var.","Uzun ömür sembolleri mevcut."],
    tarot:["Kart: Dönüşüm zamanı.","Kart: Aşk kapıda."]
  };
  const c=pool[type][Math.floor(Math.random()*pool[type].length)];
  res.json({comment:c});
});

app.post("/api/visualize",(req,res)=>{
  res.json({imageUrl:"https://via.placeholder.com/640x360?text=Rüya+Görseli"});
});

app.listen(3000,()=>console.log("API çalışıyor http://localhost:3000"));
