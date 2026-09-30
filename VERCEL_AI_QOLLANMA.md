# 🚀 Muhammadrizo Portfolio — Vercel AI Integratsiyasi Qo'llanmasi

Ushbu portfolio sayti endi **Vercel AI & Serverless Architecture** bilan to'liq integratsiya qilindi. Sayt bir vaqtning o'zida ham **GitHub Pages** (statik), ham **Vercel** (jonli serverless AI) platformalarida uzluksiz ishlaydi.

---

## 🌟 Nimalar Yaratildi va Ulandi?

1. **`api/chat.js` (Vercel Serverless Edge Function)**:
   - Dunyo bo'ylab eng tezkor **Vercel Edge Runtime**da ishlaydi.
   - **Google Gemini** (`GEMINI_API_KEY`), **Groq Llama-3.3** (`GROQ_API_KEY`) yoki **OpenAI** (`OPENAI_API_KEY`) modellarini qo'llab-quvvatlaydi.
   - API kalit kiritilmagan taqdirda ham Muhammadrizo haqidagi barcha ma'lumotlarni (yoshi, Qorako'l maktabi, AI loyihalari, 2 yillik Telegram savdosi, Taekwondo medallari, Garvard BBA rejasi) biluvchi ichki aqlli AI tizimi faol ishlaydi.

2. **Saytdagi AI Terminal (`script.js` & `index.html`)**:
   - `About` bo'limidagi interaktiv kiber-terminal to'g'ridan-to'g'ri Vercel AI ga ulandi.
   - Har qanday erkin savol yozilganda, Vercel AI real vaqtda tahlil qilib yozuv mashinkasi (typewriter) effekti bilan javob beradi.

3. **Yangi Floating Vercel AI Chat Vidjeti**:
   - Saytning pastki o'ng burchagida neon-to'q sariq dizayndagi zamonaviy AI yordamchi qo'shildi.
   - Istalgan sahifadan turib Muhammadrizo AI bilan jonli suhbatlashish, tezkor savollar berish va suhbat tarixini tozalash mumkin.

4. **`vercel.json` va `package.json`**:
   - Vercel ga bir klikda joylashtirish (deploy) uchun rasmiy xavfsizlik va marshrutlash sozlamalari tayyorlandi.

5. **`yangilash_sayt.bat`**:
   - Endi bitta bosish bilan yangilanishlar ham GitHub Pages ga, ham Vercel ga avtomatik tarzda jo'natiladi.

---

## ⚡ Vercel'ga 2 Daqiqada Bepul Joylash (Qadamba-Qadam)

### 1-Qadam: O'zgarishlarni GitHub ga yuklang
Loyiha papkasidagi [yangilash_sayt.bat](file:///c:/Users/muham/OneDrive/Desktop/portfolio/yangilash_sayt.bat) faylini ishga tushiring yoki terminalda quyidagini bajaring:
```bash
git add .
git commit -m "Vercel AI va Floating Chatbot integratsiyasi"
git push origin master
```

### 2-Qadam: Vercel saytiga kiring
1. Brauzerda [vercel.com](https://vercel.com) saytiga kiring.
2. **"Sign In"** yoki **"Sign Up"** tugmasini bosib, **"Continue with GitHub"** orqali kiring.

### 3-Qadam: Portfolioni Vercel ga ulang
1. Vercel bosh sahifasida **"Add New..."** -> **"Project"** tugmasini bosing.
2. Sizning GitHub ro'yxatingizdagi `portfolio` loyihasi yonidagi **"Import"** tugmasini bosing.
3. Sozlamalarni o'zgartirish shart emas — shunchaki **"Deploy"** tugmasini bosing!
4. 20-30 soniyadan so'ng sizga shaxsiy bepul havola beriladi (masalan: `https://muhammadrizo-portfolio.vercel.app`).

---

## 🔑 (Ixtiyoriy) Jonli Gemini / Groq AI Kalitini Qo'shish

Saytingizdagi AI terminal va chat hozirning o'zidayoq to'liq ishlaydi. Agar siz unga tashqi eng so'nggi Gemini yoki Groq generativ modelini ulamoqchi bo'lsangiz:

1. [Google AI Studio](https://aistudio.google.com/) saytiga kirib, **"Get API key"** tugmasini bosing (100% bepul).
   *(Yoki [Groq Console](https://console.groq.com/) dan Llama-3.3 uchun Groq API kalit oling).*
2. Vercel boshqaruv panelida loyihangizga kiring:
   - **Settings** -> **Environment Variables** bo'limiga o'ting.
   - **Key**: `GEMINI_API_KEY` (yoki `GROQ_API_KEY`)
   - **Value**: olingan API kalitni joylang.
   - **Save** tugmasini bosing.
3. **Deployments** bo'limiga o'tib, oxirgi versiya yonidagi 3 nuqtani bosib **"Redeploy"** qiling.

Endi sizning portfolioingiz dunyoning eng ilg'or Sun'iy Intellekt modellari bilan qurollangan to'liq avtonom Vercel AI platformasida ishlaydi!
