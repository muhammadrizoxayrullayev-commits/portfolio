/**
 * RATAN DESIGN - PORTFOLIO INTERACTIVE CORE
 * Features:
 * 1. Floating Ember Particles (Canvas)
 * 2. Pure Offline QR Code Generator & Sharing System
 * 3. Interactive Q&A Form & Community Question Board (LocalStorage)
 * 4. Animated Stats Counters
 * 5. Portfolio Filter System
 * 6. Glassmorphism Modals (QR, Project Lightbox, Certificate, Showreel)
 */

document.addEventListener('DOMContentLoaded', () => {
  initEmbersCanvas();
  initNavbarScroll();
  initCyberAudio();
  initStatsCounter();
  initPortfolioFilter();
  initAITerminal();
  initPitchDeckSystem();
  initInlineDeckSystem();
  initQASystem();
  initModals();
  initQRCodeFeature();
});

/* ==========================================================================
   1. CANVAS FLOATING EMBERS PARTICLE SYSTEM
   ========================================================================== */
function initEmbersCanvas() {
  const canvas = document.getElementById('embers-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const emberCount = window.innerWidth < 768 ? 40 : 85;
  const embers = [];

  const colors = [
    'rgba(255, 68, 0, ',
    'rgba(255, 119, 0, ',
    'rgba(255, 170, 0, ',
    'rgba(255, 230, 160, '
  ];

  class Ember {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : height + 15;
      this.radius = Math.random() * 2.2 + 0.6;
      this.speedY = Math.random() * 1.4 + 0.4;
      this.speedX = (Math.random() - 0.5) * 0.8;
      this.colorBase = colors[Math.floor(Math.random() * colors.length)];
      this.alpha = Math.random() * 0.7 + 0.3;
      this.fadeSpeed = Math.random() * 0.006 + 0.002;
      this.pulseSpeed = Math.random() * 0.03 + 0.01;
      this.angle = Math.random() * Math.PI * 2;
    }

    update() {
      this.y -= this.speedY;
      this.x += Math.sin(this.angle) * 0.6 + this.speedX;
      this.angle += this.pulseSpeed;

      this.alpha -= this.fadeSpeed;
      if (this.y < -10 || this.alpha <= 0) {
        this.reset();
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.colorBase + Math.max(0, this.alpha) + ')';
      ctx.shadowBlur = this.radius * 6;
      ctx.shadowColor = '#ff5500';
      ctx.fill();
    }
  }

  for (let i = 0; i < emberCount; i++) {
    embers.push(new Ember());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < embers.length; i++) {
      embers[i].update();
      embers[i].draw();
    }
    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   2. NAVBAR SCROLL & MOBILE MENU
   ========================================================================== */
function initNavbarScroll() {
  const header = document.getElementById('navbar');
  const mobileToggle = document.getElementById('mobile-nav-toggle');
  const navMenu = document.getElementById('nav-links');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      navMenu.classList.toggle('open');
      mobileToggle.classList.toggle('active');
    });

    // Close when clicking nav links
    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        mobileToggle.classList.remove('active');
      });
    });

    // Close when tapping outside the menu on mobile
    document.addEventListener('click', (e) => {
      if (navMenu.classList.contains('open') && !navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
        navMenu.classList.remove('open');
        mobileToggle.classList.remove('active');
      }
    });

    // Close on touch outside or scroll
    window.addEventListener('scroll', () => {
      if (navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
        mobileToggle.classList.remove('active');
      }
    }, { passive: true });
  }
}

/* ==========================================================================
   3. ANIMATED STATS COUNTER
   ========================================================================== */
function initStatsCounter() {
  const counters = document.querySelectorAll('.counter');
  let animated = false;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !animated) {
          animated = true;
          counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            let current = 0;
            const duration = 1800;
            const stepTime = Math.abs(Math.floor(duration / target));

            const timer = setInterval(() => {
              current += 1;
              counter.textContent = current;
              if (current >= target) {
                counter.textContent = target;
                clearInterval(timer);
              }
            }, Math.max(stepTime, 12));
          });
        }
      });
    },
    { threshold: 0.5 }
  );

  const statsSection = document.querySelector('.hero-stats-row');
  if (statsSection) {
    observer.observe(statsSection);
  }
}

/* ==========================================================================
   4. PORTFOLIO FILTER SYSTEM
   ========================================================================== */
function initPortfolioFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const items = document.querySelectorAll('.portfolio-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      playCyberSound('click');

      const filter = btn.getAttribute('data-filter');

      items.forEach(item => {
        const cat = item.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          item.style.display = 'flex';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
          }, 20);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'translateY(15px)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 250);
        }
      });
    });
  });
}

/* ==========================================================================
   5. INTERACTIVE Q&A & ASK ME ANYTHING SYSTEM
   ========================================================================== */
function initQASystem() {
  const form = document.getElementById('ask-question-form');
  const toast = document.getElementById('qa-toast');
  const feedList = document.getElementById('community-qa-list');
  const countBadge = document.getElementById('qa-count-badge');

  // Seed default community questions
  const defaultQuestions = [
    {
      id: 1,
      name: 'Jasurbek Oripov',
      category: '🤖 AI & Bot Proyektlar',
      question: 'Assalomu alaykum! Do\'konimiz uchun Telegramda sun\'iy intellekt orqali mijozlarga avtomatik mahsulot tavsiya qiluvchi aqlli bot qilib bera olasizmi?',
      answer: 'Assalomu alaykum! Albatta, do\'koningiz mahsulotlar bazasini AI modeli bilan integratsiya qilib, xaridor savollariga insondek aniq javob beruvchi va buyurtma oluvchi Telegram bot tizimini ishlab chiqaman.',
      time: 'Kecha, 18:20'
    },
    {
      id: 2,
      name: 'Otabek N.',
      category: '💼 Telegram E-Commerce & Savdo',
      question: '2 yildan beri Telegram orqali savdo qilar ekansiz. Yangi boshlovchilar uchun doimiy mijozlar bazasini shakllantirish bo\'yicha qanday maslahat berasiz?',
      answer: 'Eng muhimi — ishonch, mahsulot sifati va mijozlarga tezkor javob berish. Telegramda kontent va sotuv voronkasini to\'g\'ri yo\'lga qo\'ysangiz, mijozlar o\'zlari sizni boshqalarga tavsiya qilishadi.',
      time: '2 kun oldin'
    },
    {
      id: 3,
      name: 'Madina Rahimova',
      category: '🇺🇸 Harvard & AQSh O\'qish (BBA)',
      question: 'Qorako\'l maktabida o\'qib, 16 yoshda biznes, sport va AI bilan shug\'ullanish bilan birga Harvard BBA ga tayyorgarlikni qanday ulguryapsiz?',
      answer: 'Hammasi qat\'iy vaqt taqsimoti va Taekwondodan o\'rgangan temir intizomim orqali. Maktabdagi darslarim, til o\'rganish, sport va amaliy loyihalarim uchun aniq reja asosida ishlayman.',
      time: '5 kun oldin'
    }
  ];

  let storedQuestions = [];
  try {
    const local = localStorage.getItem('muhammadrizo_portfolio_qa_v2');
    storedQuestions = local ? JSON.parse(local) : defaultQuestions;
  } catch (e) {
    storedQuestions = defaultQuestions;
  }

  function renderQuestions() {
    if (!feedList) return;
    feedList.innerHTML = '';

    storedQuestions.forEach(q => {
      const card = document.createElement('div');
      card.className = 'feed-card';
      card.innerHTML = `
        <div class="feed-card-header">
          <span class="feed-user">${escapeHTML(q.name)}</span>
          <span class="feed-category">${escapeHTML(q.category)}</span>
        </div>
        <p class="feed-question">${escapeHTML(q.question)}</p>
        ${
          q.answer
            ? `<div class="feed-answer-box">
                <strong class="feed-answer-author">MUHAMMADRIZO XAYRULLAYEV JAVOBI:</strong>
                <p class="feed-answer-text">${escapeHTML(q.answer)}</p>
              </div>`
            : `<div class="feed-answer-box" style="border-left-color: #ffaa00; background: rgba(255, 170, 0, 0.08);">
                <strong class="feed-answer-author" style="color: #ffaa00;">⏳ KO'RIB CHIQILMOQDA...</strong>
                <p class="feed-answer-text">Savolingiz qabul qilindi. Tez orada javob beriladi.</p>
              </div>`
        }
      `;
      feedList.appendChild(card);
    });

    if (countBadge) {
      countBadge.textContent = `${storedQuestions.length} ta savol`;
    }
  }

  renderQuestions();

  // Form submission handler
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('user-name');
      const contactInput = document.getElementById('user-contact');
      const categorySelect = document.getElementById('question-category');
      const questionInput = document.getElementById('user-question');

      const name = nameInput.value.trim();
      const contact = contactInput.value.trim();
      const category = categorySelect.value;
      const question = questionInput.value.trim();

      if (!name || !question) return;

      const newQ = {
        id: Date.now(),
        name: name,
        contact: contact,
        category: category,
        question: question,
        answer: null, // Pending answer
        time: 'Hozirgina'
      };

      storedQuestions.unshift(newQ);
      try {
        localStorage.setItem('muhammadrizo_portfolio_qa_v2', JSON.stringify(storedQuestions));
      } catch (err) {
        console.error(err);
      }

      renderQuestions();

      // Show toast
      if (toast) {
        toast.textContent = `Rahmat, ${name}! Savolingiz muvaffaqiyatli qabul qilindi. Tez orada ${contact} orqali bog'lanamiz!`;
        toast.classList.remove('hidden');
        setTimeout(() => {
          toast.classList.add('hidden');
        }, 5000);
      }

      form.reset();
    });
  }
}

function escapeHTML(str) {
  if (!str) return '';
  return str.replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}

/* ==========================================================================
   6. 100% SCANNABLE QR CODE GENERATOR & 24/7 SHARING SYSTEM
   ========================================================================== */
const LIVE_24_7_URL = 'https://muhammadrizoxayrullayev-commits.github.io/portfolio/';

function initQRCodeFeature() {
  const canvas = document.getElementById('qr-code-canvas');
  const urlDisplay = document.getElementById('share-url-text');
  const copyBtn = document.getElementById('copy-url-btn');
  const copyLabel = document.getElementById('copy-btn-label');
  const downloadBtn = document.getElementById('download-qr-btn');

  // Always encode the official 24/7 public URL so any camera can scan and open it
  const currentUrl = LIVE_24_7_URL;

  if (urlDisplay) {
    urlDisplay.textContent = currentUrl;
    if (urlDisplay.tagName === 'A') {
      urlDisplay.href = currentUrl;
    }
  }

  // Draw 100% standard, camera-readable QR Code onto canvas
  if (canvas) {
    drawStandardQRCode(canvas, currentUrl);
  }

  // Also redraw whenever QR modal opens to guarantee sharp rendering
  const openQrBtn = document.getElementById('open-qr-btn');
  const floatingQrBtn = document.getElementById('floating-qr-trigger');
  const contactQrBtn = document.getElementById('contact-qr-btn');
  [openQrBtn, floatingQrBtn, contactQrBtn].forEach(btn => {
    if (btn) {
      btn.addEventListener('click', () => {
        if (canvas) drawStandardQRCode(canvas, currentUrl);
      });
    }
  });

  // 1-Click Copy link
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(currentUrl).then(() => {
        if (copyLabel) copyLabel.textContent = 'Nusxalandi! ✓';
        copyBtn.style.background = '#10b981';
        setTimeout(() => {
          if (copyLabel) copyLabel.textContent = 'Nusxalash';
          copyBtn.style.background = '#ff5500';
        }, 2200);
      }).catch(() => {
        // Fallback
        const dummy = document.createElement('input');
        document.body.appendChild(dummy);
        dummy.value = currentUrl;
        dummy.select();
        document.execCommand('copy');
        document.body.removeChild(dummy);
        if (copyLabel) copyLabel.textContent = 'Nusxalandi! ✓';
        setTimeout(() => {
          if (copyLabel) copyLabel.textContent = 'Nusxalash';
        }, 2200);
      });
    });
  }

  // Download High-Resolution QR Code as PNG (for CV, business cards, printing)
  if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
      const hdCanvas = document.createElement('canvas');
      drawStandardQRCode(hdCanvas, currentUrl, true);

      const link = document.createElement('a');
      link.download = 'Muhammadrizo_Xayrullayev_Portfolio_QRCode.png';
      link.href = hdCanvas.toDataURL('image/png');
      link.click();
    });
  }
}

/**
 * Generates an authentic, 100% camera-scannable ISO/IEC 18004 QR Code
 * Zero distortion, exact integer pixel modules, 4-cell white quiet zone.
 * Instantly scannable by iPhone Camera, Android Google Lens, & all scanners.
 */
function drawStandardQRCode(canvas, text, isHD = false) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let qr;
  try {
    qr = qrcode(0, 'M');
    qr.addData(text);
    qr.make();
  } catch (err) {
    try {
      qr = qrcode(0, 'L');
      qr.addData(text);
      qr.make();
    } catch (e) {
      console.error('QR generation error:', e);
      return;
    }
  }

  const moduleCount = qr.getModuleCount();
  const margin = 4; // Standard 4-cell quiet zone required for camera edge detection
  const totalCells = moduleCount + margin * 2;
  const cellSize = isHD ? 24 : 10;
  const fullSize = totalCells * cellSize;

  canvas.width = fullSize;
  canvas.height = fullSize;

  // 1. Pure solid white background & quiet zone (Maximum contrast ratio)
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, fullSize, fullSize);

  // 2. Pure solid black modules (Exact integer pixel geometry without subpixel blur)
  ctx.fillStyle = '#000000';
  for (let r = 0; r < moduleCount; r++) {
    for (let c = 0; c < moduleCount; c++) {
      if (qr.isDark(r, c)) {
        ctx.fillRect(
          (c + margin) * cellSize,
          (r + margin) * cellSize,
          cellSize,
          cellSize
        );
      }
    }
  }
}

/* ==========================================================================
   7. MODALS HANDLER (QR, LIGHTBOX, CERTIFICATES, SHOWREEL)
   ========================================================================== */
function initModals() {
  const qrModal = document.getElementById('qr-modal');
  const projectModal = document.getElementById('project-modal');
  const certModal = document.getElementById('cert-modal');
  const showreelModal = document.getElementById('showreel-modal');

  // Trigger buttons
  const openQrBtn = document.getElementById('open-qr-btn');
  const contactQrBtn = document.getElementById('contact-qr-btn');
  const floatingQrBtn = document.getElementById('floating-qr-trigger');
  const showreelBtn = document.getElementById('watch-showreel-btn');

  // Close buttons
  const closeQrBtn = document.getElementById('close-qr-modal');
  const closeProjectBtn = document.getElementById('close-project-modal');
  const closeCertBtn = document.getElementById('close-cert-modal');
  const closeShowreelBtn = document.getElementById('close-showreel-modal');

  // Open QR Modal
  const openQR = () => {
    if (qrModal) qrModal.classList.add('active');
  };
  if (openQrBtn) openQrBtn.addEventListener('click', openQR);
  if (contactQrBtn) contactQrBtn.addEventListener('click', openQR);
  if (floatingQrBtn) floatingQrBtn.addEventListener('click', openQR);

  // Open Showreel Modal
  if (showreelBtn && showreelModal) {
    showreelBtn.addEventListener('click', () => {
      showreelModal.classList.add('active');
    });
  }

  // Close bindings
  if (closeQrBtn && qrModal) {
    closeQrBtn.addEventListener('click', () => qrModal.classList.remove('active'));
  }
  if (closeProjectBtn && projectModal) {
    closeProjectBtn.addEventListener('click', () => projectModal.classList.remove('active'));
  }
  if (closeCertBtn && certModal) {
    closeCertBtn.addEventListener('click', () => certModal.classList.remove('active'));
  }
  if (closeShowreelBtn && showreelModal) {
    closeShowreelBtn.addEventListener('click', () => showreelModal.classList.remove('active'));
  }

  // Close on outside click
  [qrModal, projectModal, certModal, showreelModal].forEach(modal => {
    if (!modal) return;
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
  });

  // Close on Escape key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllModals();
    }
  });
}

function closeAllModals() {
  document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.classList.remove('active');
  });
}

// Global modal helpers for inline onclick handlers
window.openProjectModal = function(title, imgSrc, category, description) {
  const modal = document.getElementById('project-modal');
  const img = document.getElementById('modal-project-img');
  const cat = document.getElementById('modal-project-cat');
  const titleEl = document.getElementById('modal-project-title');
  const descEl = document.getElementById('modal-project-desc');

  if (img) img.src = imgSrc;
  if (cat) cat.textContent = category;
  if (titleEl) titleEl.textContent = title;
  if (descEl) descEl.textContent = description;

  if (modal) {
    modal.classList.add('active');
    playCyberSound('click');
  }
};

window.openCertificateModal = function(title, imgSrc, description) {
  const modal = document.getElementById('cert-modal');
  const img = document.getElementById('modal-cert-img');
  const titleEl = document.getElementById('modal-cert-title');
  const descEl = document.getElementById('modal-cert-desc');

  if (img) img.src = imgSrc;
  if (titleEl) titleEl.textContent = title;
  if (descEl) descEl.textContent = description;

  if (modal) {
    modal.classList.add('active');
    playCyberSound('beep');
  }
};

window.closeAllModals = closeAllModals;

/* ==========================================================================
   8. CYBER AUDIO FX SYSTEM (HTML5 WEB AUDIO API SYNTHESIZER)
   ========================================================================== */
let audioCtx = null;
let soundEnabled = true;

function initCyberAudio() {
  const savedSound = localStorage.getItem('muhammadrizo_sound_enabled');
  soundEnabled = savedSound !== null ? savedSound === 'true' : true;

  const toggleBtn = document.getElementById('sound-toggle-btn');
  const icon = document.getElementById('sound-icon');

  const updateUI = () => {
    if (icon) icon.textContent = soundEnabled ? '🔊' : '🔇';
    if (toggleBtn) {
      if (soundEnabled) {
        toggleBtn.classList.remove('muted');
        toggleBtn.title = "Ovoz effektlari yoqilgan (O'chirish uchun bosing)";
      } else {
        toggleBtn.classList.add('muted');
        toggleBtn.title = "Ovoz effektlari o'chirilgan (Yoqish uchun bosing)";
      }
    }
  };

  updateUI();

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      localStorage.setItem('muhammadrizo_sound_enabled', soundEnabled);
      updateUI();
      if (soundEnabled) playCyberSound('beep');
    });
  }
}

function playCyberSound(type = 'click') {
  if (!soundEnabled) return;
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    if (type === 'click') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.05);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
      osc.start(now);
      osc.stop(now + 0.05);
    } else if (type === 'beep') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(587.33, now);
      osc.frequency.setValueAtTime(880, now + 0.06);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.14);
      osc.start(now);
      osc.stop(now + 0.14);
    } else if (type === 'whoosh') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(250, now);
      osc.frequency.exponentialRampToValueAtTime(950, now + 0.12);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.005, now + 0.12);
      osc.start(now);
      osc.stop(now + 0.12);
    } else if (type === 'success') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, now);
      osc.frequency.setValueAtTime(659.25, now + 0.08);
      osc.frequency.setValueAtTime(783.99, now + 0.16);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.28);
      osc.start(now);
      osc.stop(now + 0.28);
    }
  } catch (e) {
    // Audio context not allowed or failed
  }
}

/* ==========================================================================
   9. INTERACTIVE AI TERMINAL & PLAYGROUND SYSTEM
   ========================================================================== */
function initAITerminal() {
  const screen = document.getElementById('terminal-screen-output');
  const chips = document.querySelectorAll('.cmd-chip');
  const form = document.getElementById('terminal-custom-form');
  const input = document.getElementById('terminal-user-input');

  if (!screen) return;

  const responses = {
    profile: `[SYS_AUTH: VERIFIED] Loading profile: Muhammadrizo Xayrullayev...
--------------------------------------------------
✦ YOSH & MAKTAB : 16 yosh | Qorako'l maktabi (10-sinf)
✦ ASOSIY FOKUS  : Sun'iy Intellekt, LLM va Avtonom Agentlar
✦ BIZNES TAJRIBA: 2 yillik Telegram E-Commerce (2024 - 2026)
✦ SPORT YUTUG'I : Taekwondo sovrindori (Bir nechta medallar)
✦ SOVRIN        : Robototexnika tanlovida 2 000 000 so'm yutug'i
✦ TIL BILISHI   : Fluent English (Erkin so'zlashuv)
✦ MAQSAD        : Garvard (Harvard University) BBA darajasi
--------------------------------------------------
> STATUS: Kelajak sari 100% fokus va qat'iy intizomda.`,

    agents: `[RUNNING: ./ai-agents.sh] Nexus Multi-Agent Architecture
--------------------------------------------------
[✓] Core Engine   : LangChain & LLM Chaining
[✓] Agent 01      : Bozor tahlili va ma'lumotlar tahlili
[✓] Agent 02      : Telegram API integratsiyasi va xaridor muloqoti
[✓] Agent 03      : Avtonom vazifalar boshqaruvi va hisobotlar
[✓] Vision Modul  : YOLOv8 real-time obyekt deteksiyasi
[✓] Voice Modul   : Whisper asosidagi o'zbek tili STT & TTS
--------------------------------------------------
> XULOSA: Tizim to'liq avtonom ishlaydi va biznes jarayonlarini 10x tezlashtiradi.`,

    business: `[RUNNING: ./ecommerce-stats.sh] 2 Yillik Savdo Metriklari
--------------------------------------------------
[✓] Davomiylik    : 2024-yildan buyon uzluksiz (2 yil)
[✓] Platforma     : Telegram tarmog'i va bot ekotizimi
[✓] Konversiya    : Yuqori mijozlar sadoqati va qayta xaridlar
[✓] Ko'nikmalar   : Mahsulot tanlash, marketing, mijozlar psixologiyasi,
                    yetkazib berish logistikasi va to'lov nazorati.
--------------------------------------------------
> NATIJA: Mustaqil moliyaviy boshqaruv va amaliy tadbirkorlik tajribasi.`,

    harvard: `[RUNNING: ./harvard-bba.sh] Strategic Roadmap (2026-2030)
--------------------------------------------------
[✓] Maqsad Oliygoh: Harvard Business School (BBA / Management)
[✓] Asosiy Poydevor: Qorako'l maktabi aniq fanlar va liderlik
[✓] Til darajasi   : Fluent English (Xalqaro imtihonlar tayyorgarligi)
[✓] Strategik Reja :
    1. AI loyihalar va biznes natijalarini xalqaro miqyosga olib chiqish
    2. Garvard va AQSh TOP universitetlariga hujjat topshirish
    3. Global Sun'iy Intellekt venchur startap fondiga asos solish
--------------------------------------------------
> SHIOR: "Bilim + Amaliyot + Intizom = Cheksiz Imkoniyatlar!"`,

    discipline: `[RUNNING: ./discipline.sh] Temir Intizom & Muhandislik
--------------------------------------------------
[✓] Taekwondo     : Bir nechta chempionat medallari sohibi.
                    Sport intizomi menga jismoniy kuch, stressga
                    bardoshlilik va g'alabaga intilishni o'rgatdi.
[✓] Robototexnika : Tanlovda 2 000 000 so'mlik bosh mukofot va sertifikatlar.
                    Aqlli datchiklar, avtomatika va amaliy muhandislik.
--------------------------------------------------
> XULOSA: Kundalik qat'iy reja va iroda — har qanday yutuqning garovidir.`
  };

  let typewriterTimer = null;

  function typeOutput(text) {
    if (typewriterTimer) clearInterval(typewriterTimer);
    screen.innerHTML = '';
    const pre = document.createElement('pre');
    pre.style.whiteSpace = 'pre-wrap';
    pre.style.fontFamily = 'inherit';
    pre.style.margin = '0';
    screen.appendChild(pre);

    let i = 0;
    const speed = 10;
    typewriterTimer = setInterval(() => {
      if (i < text.length) {
        pre.textContent += text.charAt(i);
        i++;
        screen.scrollTop = screen.scrollHeight;
      } else {
        clearInterval(typewriterTimer);
        const cursor = document.createElement('span');
        cursor.className = 'terminal-cursor';
        pre.appendChild(cursor);
      }
    }, speed);
  }

  // Initial execution
  typeOutput(responses.profile);

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      playCyberSound('click');

      const cmd = chip.getAttribute('data-cmd');
      if (cmd === 'clear') {
        if (typewriterTimer) clearInterval(typewriterTimer);
        screen.innerHTML = '<span class="terminal-cursor"></span>';
      } else if (responses[cmd]) {
        typeOutput(responses[cmd]);
      }
    });
  });

  if (form && input) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = input.value.trim();
      if (!val) return;
      playCyberSound('beep');

      const lower = val.toLowerCase();
      let reply = '';

      if (lower.includes('ai') || lower.includes('sun\'iy') || lower.includes('bot') || lower.includes('proyekt')) {
        reply = responses.agents;
      } else if (lower.includes('biznes') || lower.includes('savdo') || lower.includes('pul') || lower.includes('telegram')) {
        reply = responses.business;
      } else if (lower.includes('harvard') || lower.includes('garvard') || lower.includes('universitet') || lower.includes('oqish')) {
        reply = responses.harvard;
      } else if (lower.includes('sport') || lower.includes('taekwondo') || lower.includes('robot')) {
        reply = responses.discipline;
      } else if (lower.includes('kim') || lower.includes('haqida') || lower.includes('salom')) {
        reply = responses.profile;
      } else {
        reply = `[SO'ROV QABUL QILINDI: "${escapeHTML(val)}"]
--------------------------------------------------
Assalomu alaykum! Muhammadrizo Xayrullayev bilan bog'liq har qanday savolingiz bo'yicha:
- Yuqoridagi tezkor buyruqlarni bosishingiz mumkin.
- Saytdagi Q&A bo'limida savol yozib qoldirishingiz mumkin.
- Shuningdek, Telegram orqali (@suxbz) bevosita bog'lanishingiz mumkin!
--------------------------------------------------
> Muhammadrizo AI tizimi har doim xizmatingizda!`;
      }

      typeOutput(reply);
      input.value = '';
    });
  }
}

/* ==========================================================================
   10. INTERACTIVE MULTI-SLIDE PRESENTATION DECK SYSTEM
   ========================================================================== */
let currentDeckSlide = 0;
const totalDeckSlides = 5;

function updateDeckSlideUI() {
  const slides = document.querySelectorAll('.deck-slide');
  const bullets = document.querySelectorAll('.deck-bullet');
  const indicator = document.getElementById('deck-slide-indicator');
  const progressFill = document.getElementById('deck-progress-fill');
  const prevBtn = document.getElementById('deck-prev-btn');
  const nextBtn = document.getElementById('deck-next-btn');

  slides.forEach((s, idx) => {
    if (idx === currentDeckSlide) {
      s.classList.add('active');
    } else {
      s.classList.remove('active');
    }
  });

  bullets.forEach((b, idx) => {
    if (idx === currentDeckSlide) {
      b.classList.add('active');
    } else {
      b.classList.remove('active');
    }
  });

  if (indicator) {
    indicator.textContent = `Slayd ${currentDeckSlide + 1} / ${totalDeckSlides}`;
  }

  if (progressFill) {
    progressFill.style.width = `${((currentDeckSlide + 1) / totalDeckSlides) * 100}%`;
  }

  if (prevBtn) prevBtn.disabled = currentDeckSlide === 0;
  if (nextBtn) nextBtn.disabled = currentDeckSlide === totalDeckSlides - 1;
}

window.jumpToDeckSlide = function(idx) {
  if (idx >= 0 && idx < totalDeckSlides) {
    currentDeckSlide = idx;
    updateDeckSlideUI();
    playCyberSound('whoosh');
  }
};

window.nextDeckSlide = function() {
  if (currentDeckSlide < totalDeckSlides - 1) {
    currentDeckSlide++;
    updateDeckSlideUI();
    playCyberSound('whoosh');
  }
};

window.prevDeckSlide = function() {
  if (currentDeckSlide > 0) {
    currentDeckSlide--;
    updateDeckSlideUI();
    playCyberSound('whoosh');
  }
};

/* Media Switcher for Slide 4 (Taekwondo vs Robotics Certificate) */
window.switchSlide4Media = function(type) {
  const img = document.getElementById('deck-slide4-img');
  const tag = document.getElementById('deck-slide4-tag');
  const btnTkd = document.getElementById('tab-btn-tkd');
  const btnRobot = document.getElementById('tab-btn-robot');

  if (type === 'tkd') {
    if (img) img.src = 'assets/taekwondo-medals.jpg';
    if (tag) tag.textContent = '🥇 Taekwondo Musobaqalari Medali & Temir Intizom';
    if (btnTkd) btnTkd.classList.add('active');
    if (btnRobot) btnRobot.classList.remove('active');
    playCyberSound('click');
  } else if (type === 'robot') {
    if (img) img.src = 'assets/award.jpg';
    if (tag) tag.textContent = '🏆 2 000 000 So\'m Robototexnika Tanlovi Sovrini & Sertifikat';
    if (btnRobot) btnRobot.classList.add('active');
    if (btnTkd) btnTkd.classList.remove('active');
    playCyberSound('beep');
  }
};

/* Autoplay / Video Presentation Mode */
let autoplayInterval = null;
let isDeckAutoplaying = false;

function stopDeckAutoplay() {
  if (autoplayInterval) {
    clearInterval(autoplayInterval);
    autoplayInterval = null;
  }
  isDeckAutoplaying = false;
  const btn = document.getElementById('deck-autoplay-btn');
  const icon = document.getElementById('deck-play-icon');
  const text = document.getElementById('deck-play-text');
  if (btn) btn.classList.remove('playing');
  if (icon) icon.textContent = '▶';
  if (text) text.textContent = 'Video / Avto-Play';
}

function startDeckAutoplay() {
  isDeckAutoplaying = true;
  const btn = document.getElementById('deck-autoplay-btn');
  const icon = document.getElementById('deck-play-icon');
  const text = document.getElementById('deck-play-text');
  if (btn) btn.classList.add('playing');
  if (icon) icon.textContent = '⏸';
  if (text) text.textContent = 'Pauza';
  playCyberSound('success');

  autoplayInterval = setInterval(() => {
    if (currentDeckSlide < totalDeckSlides - 1) {
      window.nextDeckSlide();
    } else {
      window.jumpToDeckSlide(0);
    }
  }, 5200);
}

window.toggleDeckAutoplay = function() {
  if (isDeckAutoplaying) {
    stopDeckAutoplay();
    playCyberSound('click');
  } else {
    startDeckAutoplay();
  }
};

window.openPitchDeckModal = function(initialIndex = 0) {
  const modal = document.getElementById('pitchdeck-modal');
  if (!modal) return;
  currentDeckSlide = initialIndex || 0;
  updateDeckSlideUI();
  modal.classList.add('active');
  playCyberSound('success');
};

function initPitchDeckSystem() {
  const modal = document.getElementById('pitchdeck-modal');
  const closeBtn = document.getElementById('close-pitchdeck-modal');
  const autoplayBtn = document.getElementById('deck-autoplay-btn');

  if (autoplayBtn) {
    autoplayBtn.addEventListener('click', () => {
      window.toggleDeckAutoplay();
    });
  }

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => {
      stopDeckAutoplay();
      modal.classList.remove('active');
      playCyberSound('click');
    });
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        stopDeckAutoplay();
        modal.classList.remove('active');
      }
    });
  }

  window.addEventListener('keydown', (e) => {
    if (modal && modal.classList.contains('active')) {
      if (e.key === 'ArrowRight') {
        window.nextDeckSlide();
      } else if (e.key === 'ArrowLeft') {
        window.prevDeckSlide();
      }
    }
  });
}

/* ==========================================================================
   11. INLINE EMBEDDED PRESENTATION DECK (ON-PAGE LIVE SHOWCASE)
   ========================================================================== */
window.inlineCurrentIndex = 0;

const inlineSlideData = [
  {
    img: 'assets/hero.jpg',
    tag: 'SLAYD 1: 16 YOSHLI INNOVATOR',
    caption: 'Muhammadrizo Xayrullayev — 16 yoshli innovator, Qorako\'l maktabi 10-sinf o\'quvchisi va yosh tadbirkor.'
  },
  {
    img: 'assets/project-agent.jpg',
    tag: 'SLAYD 2: KO\'P AGENTLI AI TIZIMI',
    caption: 'Nexus Multi-Agent: LangChain asosida bozor tahlili va 24/7 topshiriqlarni avtonom bajaruvchi AI tizimi.'
  },
  {
    img: 'assets/project-brand.jpg',
    tag: 'SLAYD 3: 2 YILLIK TELEGRAM SAVDO',
    caption: 'Telegram E-Commerce: 2024-yildan buyon mahsulot savdosi, mijozlar bazasi va barqaror savdo oqimi.'
  },
  {
    img: 'assets/taekwondo-medals.jpg',
    tag: 'SLAYD 4: SPORT MEDALLARI & 2 MLN YUTUQ',
    caption: 'Taekwondo chempionati medallari, temir intizom va Robototexnika tanlovidagi 2 000 000 so\'mlik sovrin.'
  },
  {
    img: 'assets/project-pitchdeck.jpg',
    tag: 'SLAYD 5: HARVARD BBA GLOBAL REJA',
    caption: 'Garvard (Harvard) va AQSh TOP universitetlari BBA darajasi hamda global AI startaplar yo\'l xaritasi.'
  }
];

let inlineAutoplayTimer = null;
let isInlineAutoplaying = false;

window.setInlineDeckSlide = function(idx) {
  if (idx < 0 || idx >= inlineSlideData.length) return;
  window.inlineCurrentIndex = idx;

  const data = inlineSlideData[idx];
  const imgEl = document.getElementById('inline-stage-img');
  const tagEl = document.getElementById('inline-stage-tag');
  const captionEl = document.getElementById('inline-stage-caption');
  const progressEl = document.getElementById('inline-stage-progress');
  const cards = document.querySelectorAll('.inline-deck-card');

  // Update active card on the left
  cards.forEach((card, i) => {
    if (i === idx) {
      card.classList.add('active');
    } else {
      card.classList.remove('active');
    }
  });

  // Smooth image swap with slight zoom animation
  if (imgEl) {
    imgEl.style.opacity = '0.4';
    imgEl.style.transform = 'scale(1.01)';
    setTimeout(() => {
      imgEl.src = data.img;
      imgEl.style.opacity = '1';
      imgEl.style.transform = 'scale(1.04)';
    }, 180);
  }

  if (tagEl) tagEl.textContent = data.tag;
  if (captionEl) captionEl.textContent = data.caption;
  if (progressEl) progressEl.style.width = `${((idx + 1) / inlineSlideData.length) * 100}%`;

  playCyberSound('whoosh');
};

window.nextInlineSlide = function() {
  const nextIdx = (window.inlineCurrentIndex + 1) % inlineSlideData.length;
  window.setInlineDeckSlide(nextIdx);
};

window.prevInlineSlide = function() {
  const prevIdx = (window.inlineCurrentIndex - 1 + inlineSlideData.length) % inlineSlideData.length;
  window.setInlineDeckSlide(prevIdx);
};

window.toggleInlineAutoplay = function() {
  const btn = document.getElementById('inline-video-toggle-btn');
  const icon = document.getElementById('inline-video-icon');
  const label = document.getElementById('inline-video-label');

  if (isInlineAutoplaying) {
    // Stop autoplay
    clearInterval(inlineAutoplayTimer);
    inlineAutoplayTimer = null;
    isInlineAutoplaying = false;
    if (btn) btn.classList.remove('playing');
    if (icon) icon.textContent = '▶';
    if (label) label.textContent = 'Video / Avto-Play Taqdimot';
    playCyberSound('click');
  } else {
    // Start autoplay
    isInlineAutoplaying = true;
    if (btn) btn.classList.add('playing');
    if (icon) icon.textContent = '⏸';
    if (label) label.textContent = 'Pauza (To\'xtatish)';
    playCyberSound('success');

    inlineAutoplayTimer = setInterval(() => {
      window.nextInlineSlide();
    }, 4200);
  }
};

function initInlineDeckSystem() {
  // Set initial state
  window.setInlineDeckSlide(0);
}



