export const config = {
  runtime: 'edge',
};

// System prompt defining Muhammadrizo Xayrullayev's persona, biography, and achievements
const SYSTEM_PROMPT = `
Siz — 16 yoshli iqtidorli dasturchi va yosh tadbirkor Muhammadrizo Xayrullayevning shaxsiy Vercel AI Assistentisiz.
Sizning vazifangiz Muhammadrizo nomidan yoki uning shaxsiy AI yordamchisi sifatida foydalanuvchilar, mijozlar va investorlar bilan do'stona, professional, aniq va ilhomlantiruvchi tarzda muloqot qilishdir.

Muhammadrizo haqida to'liq va rasmiy ma'lumotlar:
- Yosh: 16 yosh (2026-yil holatiga)
- Ta'lim: Qorako'l xalqaro matematika va aniq fanlar maktabi (10-sinf o'quvchisi)
- Yo'nalish: Sun'iy Intellekt muhandisi (LLM, LangChain, ko'p agentli avtonom tizimlar, YOLOv8 vision, Whisper voice)
- Biznes: 2 yillik uzluksiz Telegram E-Commerce va avtomatlashtirilgan botlar savdo tizimi tajribasi (2024-2026)
- Sport: Taekwondo bo'yicha chempionat sovrindori, bir nechta medallar sohibi (sport intizomi, temir iroda)
- Robototexnika: Respublika tanlovida 2 000 000 so'mlik bosh mukofot sohibi (aqlli datchiklar, avtomatika)
- Maqsad va orzu: Garvard Universiteti (Harvard Business School / BBA) ga kirish, global AI venchur startap fondiga asos solish
- Tillar: O'zbek tili (ona tili), Ingliz tili (Fluent / Erkin muloqot), Rus tili (yaxshi)
- Aloqa: Telegram: @suxbz

Qoidalar:
1. Foydalanuvchi qaysi tilda murojaat qilsa (o'zbek, ingliz, rus), o'sha tilda chiroyli, tushunarli va ravon javob bering.
2. Muhammadrizoning yutuqlari, texnologik bilimlari va rejalari haqida g'urur va aniq faktlar bilan gapiring.
3. Agar hamkorlik yoki loyiha buyurtmasi haqida so'ralsa, Telegram orqali (@suxbz) bog'lanishni taklif qiling.
4. Javoblar ixcham, o'qilishi qulay (punktlar yoki qisqa xatboshilar bilan) bo'lsin.
`;

export default async function handler(req) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Faqat POST so\'rovi qabul qilinadi.' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }

  try {
    const body = await req.json();
    const prompt = (body.prompt || body.message || '').trim();

    if (!prompt) {
      return new Response(JSON.stringify({ error: 'Iltimos, so\'rov matnini kiriting.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }

    // 1. Try Google Gemini API if key is present
    const geminiKey = process.env.GEMINI_API_KEY;
    if (geminiKey) {
      try {
        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [
                {
                  role: 'user',
                  parts: [
                    { text: SYSTEM_PROMPT },
                    { text: `Foydalanuvchi so'rovi: "${prompt}"\nIltimos, ushbu so'rovga yuqoridagi kontekst asosida ixcham va professional javob bering.` }
                  ],
                },
              ],
              generationConfig: {
                maxOutputTokens: 800,
                temperature: 0.7,
              },
            }),
          }
        );

        if (geminiRes.ok) {
          const geminiData = await geminiRes.json();
          const reply = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
          if (reply) {
            return new Response(JSON.stringify({ reply, model: 'Gemini 1.5 Flash (Vercel AI)' }), {
              status: 200,
              headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
            });
          }
        }
      } catch (err) {
        console.warn('Gemini API call failed, trying next provider or fallback...', err);
      }
    }

    // 2. Try Groq API if key is present (Ultra-fast Llama-3.3-70b)
    const groqKey = process.env.GROQ_API_KEY;
    if (groqKey) {
      try {
        const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${groqKey}`,
          },
          body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages: [
              { role: 'system', content: SYSTEM_PROMPT },
              { role: 'user', content: prompt },
            ],
            max_tokens: 800,
            temperature: 0.7,
          }),
        });

        if (groqRes.ok) {
          const groqData = await groqRes.json();
          const reply = groqData.choices?.[0]?.message?.content;
          if (reply) {
            return new Response(JSON.stringify({ reply, model: 'Groq Llama-3.3 (Vercel AI)' }), {
              status: 200,
              headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
            });
          }
        }
      } catch (err) {
        console.warn('Groq API call failed...', err);
      }
    }

    // 3. Try OpenAI API if key is present
    const openaiKey = process.env.OPENAI_API_KEY;
    if (openaiKey) {
      try {
        const oaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${openaiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: SYSTEM_PROMPT },
              { role: 'user', content: prompt },
            ],
            max_tokens: 800,
            temperature: 0.7,
          }),
        });

        if (oaiRes.ok) {
          const oaiData = await oaiRes.json();
          const reply = oaiData.choices?.[0]?.message?.content;
          if (reply) {
            return new Response(JSON.stringify({ reply, model: 'GPT-4o-mini (Vercel AI)' }), {
              status: 200,
              headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
            });
          }
        }
      } catch (err) {
        console.warn('OpenAI API call failed...', err);
      }
    }

    // 4. Built-in Smart Intelligent Knowledge Engine (Zero external dependencies needed)
    // Ensures instant, intelligent responses even if API keys are not configured yet!
    const reply = generateSmartFallbackReply(prompt);
    return new Response(JSON.stringify({ 
      reply, 
      model: 'Vercel Edge AI Core (Offline/Static Mode)',
      note: 'Vercel loyihangizga GEMINI_API_KEY yoki GROQ_API_KEY qo\'shsangiz, to\'liq jonli LLM orqali ishlaydi.' 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message || 'Serverda xatolik yuz berdi.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }
}

function generateSmartFallbackReply(prompt) {
  const p = prompt.toLowerCase();

  if (p.includes('salom') || p.includes('assalom') || p.includes('hello') || p.includes('hi') || p.includes('privet')) {
    return `Assalomu alaykum! Men Muhammadrizo Xayrullayevning Vercel AI Assistentiman.
Sizga Muhammadrizoning sun'iy intellekt loyihalari, Qorako'l maktabidagi o'qishi, 2 yillik Telegram biznesi, Taekwondo yutuqlari yoki Garvard (Harvard BBA) maqsadlari haqida qanday ma'lumot bera olaman?`;
  }

  if (p.includes('kim') || p.includes('haqida') || p.includes('o\'zi') || p.includes('tanish') || p.includes('who')) {
    return `[MUHAMMADRIZO XAYRULLAYEV HAQIDA]
✦ Yoshi: 16 yoshda (2026-yil)
✦ O'qishi: Qorako'l xalqaro matematika va aniq fanlar maktabi (10-sinf)
✦ Mutaxassisligi: Sun'iy Intellekt, LLM va ko'p agentli avtonom tizimlar
✦ Tadbirkorlik: 2 yillik muvaffaqiyatli Telegram E-Commerce tajribasi (2024-2026)
✦ Sport: Taekwondo bo'yicha bir nechta chempionat medallari sohibi
✦ Sovrin: Respublika Robototexnika tanlovida 2 000 000 so'm bosh mukofot
✦ Maqsad: Harvard Business School (BBA) va Global AI venchur fondi!`;
  }

  if (p.includes('ai') || p.includes('sun\'iy') || p.includes('agent') || p.includes('model') || p.includes('texnolog') || p.includes('langchain')) {
    return `[SUN'IY INTELLEKT & AVTONOM AGENTLAR]
Muhammadrizo AI sohasida quyidagi ilg'or yechimlarni ishlab chiqqan:
1. Ko'p Agentli Nexus Tizimi: LangChain va LLM zanjirlari orqali 24/7 ishlovchi avtonom yordamchilar.
2. Kompyuter Ko'rishi (Computer Vision): YOLOv8 asosidagi real vaqtdagi obyektlarni aniqlash.
3. Ovozli Tizimlar: Whisper modeli yordamida o'zbek tilidagi nutqni matnga o'girish (STT) va matndan ovoz yaratish (TTS).
4. E-Commerce AI Integratsiyasi: Telegram do'konlarda mijozlar bilan insondek muloqot qiluvchi va buyurtmalarni boshqaruvchi botlar.`;
  }

  if (p.includes('biznes') || p.includes('savdo') || p.includes('telegram') || p.includes('pul') || p.includes('daromad') || p.includes('bot')) {
    return `[2 YILLIK TELEGRAM BIZNES TAJRIBASI]
Muhammadrizo 2024-yildan beri Telegram platformasida e-commerce savdo tizimlarini yuritib keladi:
✦ Buyurtmalar va mijozlar oqimini to'liq avtomatlashtirish
✦ CRM va savdo voronkalari orqali konversiyani oshirish
✦ Xaridorlar bilan professional muloqot, logistika va xavfsiz to'lov nazorati
✦ Natija: 16 yoshda mustaqil moliyaviy barqarorlik va real biznes boshqaruvi tajribasi.`;
  }

  if (p.includes('harvard') || p.includes('garvard') || p.includes('universitet') || p.includes('oqish') || p.includes('kelajak') || p.includes('bba')) {
    return `[STRATEGIK ROADMAP: HARVARD BBA (2026-2030)]
Muhammadrizoning asosiy maqsadi:
1. Harvard Business School (BBA / Management) dasturiga kirish.
2. Qorako'l maktabi aniq fanlar poydevori va Fluent English orqali xalqaro testlarda eng yuqori ballarni olish.
3. Sun'iy intellekt va tadbirkorlik uyg'unligida global AI venchur fondiga asos solish.
Shiori: "Bilim + Amaliyot + Intizom = Cheksiz Imkoniyatlar!"`;
  }

  if (p.includes('sport') || p.includes('taekwondo') || p.includes('jang') || p.includes('robot') || p.includes('yutuq') || p.includes('intizom')) {
    return `[SPORT VA ROBOTOTEXNIKA YUTUQLARI]
✦ Taekwondo: Bir nechta chempionat medallari sovrindori. Sport Muhammadrizoga temir intizom, stressga chidamlilik va har doim g'alabaga intilishni o'rgatgan.
✦ Robototexnika: O'tkazilgan nufuzli muhandislik tanlovida 2 000 000 so'mlik bosh mukofot va sertifikatlar egasi.
Kundalik reja va qat'iy intizom — uning har bir sohadagi muvaffaqiyat garovidir.`;
  }

  if (p.includes('aloqa') || p.includes('bog\'lan') || p.includes('kontakt') || p.includes('telefon') || p.includes('telegram') || p.includes('contact')) {
    return `[BOG'LANISH VA HAMKORLIK]
Muhammadrizo bilan to'g'ridan-to'g'ri bog'lanish uchun:
✦ Telegram: @suxbz (https://t.me/suxbz)
✦ Saytdagi Q&A yoki kontakt formasi orqali
U AI loyihalar, maslahat va istiqbolli hamkorliklar uchun doimo ochiq!`;
  }

  return `[VERCEL AI JAVOBI: "${prompt}"]
Assalomu alaykum! Sizning so'rovingiz qabul qilindi. 
Muhammadrizo Xayrullayev 16 yoshli iqtidorli AI dasturchi, Qorako'l maktabi o'quvchisi va 2 yillik Telegram biznes egasidir.

U bilan bog'liq aniq ma'lumotlar:
- Sun'iy intellekt va avtonom agent loyihalari
- 2 yillik Telegram savdo tajribasi
- Garvard BBA strategiyasi
- Taekwondo va robototexnika sovrinlari
- Telegram orqali aloqa: @suxbz

Qo'shimcha savolingiz bo'lsa, marhamat so'rashingiz mumkin!`;
}
