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
  initStatsCounter();
  initPortfolioFilter();
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
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
    });

    // Close when clicking nav links
    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
      });
    });
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
      name: 'Sherzodbek Qodirov',
      category: '🚀 Yangi Loyiha / Buyurtma',
      question: 'Assalomu alaykum! Yangi fintech startapimiz uchun to\'liq brending va mobil ilova dizayni kerak edi. Ish boshlash uchun qanday ma\'lumotlar talab qilinadi?',
      answer: 'Assalomu alaykum! Loyihaning maqsadli auditoriyasi, raqobatchilari va asosiy funksiyalari ko\'rsatilgan qisqacha brif (texnik topshiriq) kifoya. Telegram orqali bog\'lansangiz, tayyor brif shaklini yuboraman.',
      time: 'Kecha, 16:40'
    },
    {
      id: 2,
      name: 'Malika Karimova',
      category: '💰 Dizayn Narxlari & Muddat',
      question: 'Logotip va firma stili (brandbook) tayyorlash o\'rtacha qancha vaqt oladi?',
      answer: 'Logotip va brendbuk to\'plami barcha vektor fayllar va qo\'llash qoidalari bilan birga odatda 7-10 ish kunida tayyorlanadi.',
      time: '3 kun oldin'
    },
    {
      id: 3,
      name: 'Azizbek R.',
      category: '💡 Shaxsiy Maslahat / Mentorlik',
      question: 'Blender 3D va kinetik harakatli grafikalarni o\'rganish bo\'yicha portfolioingizdagi kabi loyihalarni qanday texnologiyalarda chiqargansiz?',
      answer: 'Asosan Blender 3D, Cycles/Octane render dvigatellari hamda post-processing uchun After Effects dasturidan foydalanaman.',
      time: '1 hafta oldin'
    }
  ];

  let storedQuestions = [];
  try {
    const local = localStorage.getItem('ratan_portfolio_qa');
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
                <strong class="feed-answer-author">RATAN (MUHAMMAD) JAVOBI:</strong>
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
        localStorage.setItem('ratan_portfolio_qa', JSON.stringify(storedQuestions));
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
const LIVE_24_7_URL = 'https://ratan-design.surge.sh';

function initQRCodeFeature() {
  const canvas = document.getElementById('qr-code-canvas');
  const urlDisplay = document.getElementById('share-url-text');
  const copyBtn = document.getElementById('copy-url-btn');
  const copyLabel = document.getElementById('copy-btn-label');
  const downloadBtn = document.getElementById('download-qr-btn');

  // If page is hosted on live public domain, use it; otherwise use the permanent 24/7 URL
  const isLocal = window.location.hostname === 'localhost' || 
                  window.location.hostname === '127.0.0.1' || 
                  window.location.protocol === 'file:';

  const currentUrl = isLocal ? LIVE_24_7_URL : window.location.href;

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
      hdCanvas.width = 1200;
      hdCanvas.height = 1200;
      drawStandardQRCode(hdCanvas, currentUrl, true);

      const link = document.createElement('a');
      link.download = 'Ratan_Design_24_7_Portfolio_QRCode.png';
      link.href = hdCanvas.toDataURL('image/png');
      link.click();
    });
  }
}

/**
 * Generates an authentic, 100% camera-scannable ISO/IEC 18004 QR Code
 * Compatible with iPhone (iOS Camera), Android (Google Lens, Samsung), & all scanners
 */
function drawStandardQRCode(canvas, text, isHD = false) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const size = canvas.width;

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
  const margin = 4; // Standard quiet zone
  const totalCells = moduleCount + margin * 2;
  const cellSize = size / totalCells;

  // Pure white background for maximum contrast & instant camera recognition
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, size, size);

  // Deep obsidian black modules for sharp clarity
  ctx.fillStyle = '#060608';
  for (let r = 0; r < moduleCount; r++) {
    for (let c = 0; c < moduleCount; c++) {
      if (qr.isDark(r, c)) {
        ctx.fillRect(
          Math.floor((c + margin) * cellSize),
          Math.floor((r + margin) * cellSize),
          Math.ceil(cellSize),
          Math.ceil(cellSize)
        );
      }
    }
  }

  // Draw stylish fiery outer boundary accents (placed in outer margin safe zone)
  const accentWidth = isHD ? 12 : 3;
  const cornerLength = isHD ? 80 : 20;
  const inset = isHD ? 16 : 4;

  ctx.strokeStyle = '#ff5500';
  ctx.lineWidth = accentWidth;

  // Top-Left
  ctx.beginPath();
  ctx.moveTo(inset, inset + cornerLength);
  ctx.lineTo(inset, inset);
  ctx.lineTo(inset + cornerLength, inset);
  ctx.stroke();

  // Top-Right
  ctx.beginPath();
  ctx.moveTo(size - inset - cornerLength, inset);
  ctx.lineTo(size - inset, inset);
  ctx.lineTo(size - inset, inset + cornerLength);
  ctx.stroke();

  // Bottom-Left
  ctx.beginPath();
  ctx.moveTo(inset, size - inset - cornerLength);
  ctx.lineTo(inset, size - inset);
  ctx.lineTo(inset + cornerLength, size - inset);
  ctx.stroke();

  // Bottom-Right
  ctx.beginPath();
  ctx.moveTo(size - inset - cornerLength, size - inset);
  ctx.lineTo(size - inset, size - inset);
  ctx.lineTo(size - inset, size - inset - cornerLength);
  ctx.stroke();
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

  if (modal) modal.classList.add('active');
};

window.openCertificateModal = function(title, imgSrc, description) {
  const modal = document.getElementById('cert-modal');
  const img = document.getElementById('modal-cert-img');
  const titleEl = document.getElementById('modal-cert-title');
  const descEl = document.getElementById('modal-cert-desc');

  if (img) img.src = imgSrc;
  if (titleEl) titleEl.textContent = title;
  if (descEl) descEl.textContent = description;

  if (modal) modal.classList.add('active');
};

window.closeAllModals = closeAllModals;
