/* ==========================================================================
   PORTFOLIO • KAIQUE MATEUS
   Interações, animações e efeitos
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- 1) YEAR ---------- */
  document.getElementById('year').textContent = new Date().getFullYear();

  /* ---------- 2) NAVBAR SCROLL EFFECT + PROGRESS ---------- */
  const navbar = document.getElementById('navbar');
  const progress = document.getElementById('scrollProgress');
  const backToTop = document.getElementById('backToTop');

  const onScroll = () => {
    const y = window.scrollY;
    navbar.classList.toggle('scrolled', y > 50);
    backToTop.classList.toggle('visible', y > 400);

    const h = document.documentElement.scrollHeight - window.innerHeight;
    const pct = (y / h) * 100;
    progress.style.width = pct + '%';

    // Update active nav based on section in view
    updateActiveNav();
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ---------- 3) MOBILE MENU ---------- */
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.querySelector('.nav-links');
  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('open');
    navLinks.classList.toggle('mobile-open');
  });
  document.querySelectorAll('.nav-link').forEach(a => {
    a.addEventListener('click', () => {
      menuToggle.classList.remove('open');
      navLinks.classList.remove('mobile-open');
    });
  });

  /* ---------- 4) ACTIVE NAV LINK ---------- */
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-link');

  const updateActiveNav = () => {
    const scrollPos = window.scrollY + 150;
    let currentId = 'home';
    sections.forEach(sec => {
      if (scrollPos >= sec.offsetTop) currentId = sec.id;
    });
    navAnchors.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === `#${currentId}`);
    });
  };

  /* ---------- 5) TYPEWRITER ---------- */
  const typedEl = document.getElementById('typed');
  const roles = [
    'Analista de Dados & BI',
    'Especialista em Power BI',
    'Automação com Python',
    'SQL • DAX • M',
    'Dashboards Executivos',
    'ETL & Data Warehouse'
  ];

  let roleIdx = 0, charIdx = 0, deleting = false;

  const typeLoop = () => {
    const current = roles[roleIdx];
    if (!deleting) {
      typedEl.textContent = current.slice(0, ++charIdx);
      if (charIdx === current.length) {
        deleting = true;
        setTimeout(typeLoop, 1600);
        return;
      }
    } else {
      typedEl.textContent = current.slice(0, --charIdx);
      if (charIdx === 0) {
        deleting = false;
        roleIdx = (roleIdx + 1) % roles.length;
      }
    }
    setTimeout(typeLoop, deleting ? 40 : 75);
  };
  typeLoop();

  /* ---------- 6) REVEAL ON SCROLL ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
  revealEls.forEach(el => io.observe(el));

  /* ---------- 7) COUNTERS ---------- */
  const counters = document.querySelectorAll('.stat-num');
  const counterIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target, 10);
        let current = 0;
        const duration = 1600;
        const startTime = performance.now();
        const tick = (now) => {
          const t = Math.min((now - startTime) / duration, 1);
          const eased = 1 - Math.pow(1 - t, 3);
          current = Math.floor(eased * target);
          el.textContent = current;
          if (t < 1) requestAnimationFrame(tick);
          else el.textContent = target;
        };
        requestAnimationFrame(tick);
        counterIO.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => counterIO.observe(c));

  /* ---------- 8) PROJECT FILTERS ---------- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      projectCards.forEach(card => {
        const match = filter === 'all' || card.dataset.cat === filter;
        if (match) {
          card.classList.remove('hidden');
          // Retrigger reveal animation
          card.style.animation = 'none';
          void card.offsetWidth;
          card.style.animation = 'fadeIn 0.5s var(--ease-out) forwards';
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  /* ---------- 9) PARTICLES CANVAS ---------- */
  const canvas = document.getElementById('particles');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const initParticles = () => {
      const density = window.innerWidth < 768 ? 30 : 60;
      particles = Array.from({ length: density }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 1.6 + 0.4,
        opacity: Math.random() * 0.5 + 0.2
      }));
    };
    initParticles();

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(99, 102, 241, ${0.15 * (1 - dist / 130)})`;
            ctx.lineWidth = 0.6;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw particles
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(139, 92, 246, ${p.opacity})`;
        ctx.fill();
      });

      animId = requestAnimationFrame(draw);
    };

    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      draw();
    }

    // Pause animation when page hidden
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        cancelAnimationFrame(animId);
      } else {
        draw();
      }
    });
  }

  /* ---------- 10) TERMINAL 3D TILT ---------- */
  const terminal = document.querySelector('.terminal-card');
  const visual = document.querySelector('.hero-visual');
  if (terminal && visual && window.matchMedia('(hover: hover)').matches) {
    visual.addEventListener('mousemove', (e) => {
      const rect = visual.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      terminal.style.transform = `rotateY(${x * 12}deg) rotateX(${-y * 8}deg)`;
    });
    visual.addEventListener('mouseleave', () => {
      terminal.style.transform = 'rotateY(-5deg) rotateX(3deg)';
    });
  }

  /* ---------- 11) MAGNETIC BUTTONS ---------- */
  const magneticEls = document.querySelectorAll('.btn-primary, .contact-card > i, .stat-card');
  if (window.matchMedia('(hover: hover)').matches) {
    magneticEls.forEach(el => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) * 0.15;
        const y = (e.clientY - rect.top - rect.height / 2) * 0.15;
        el.style.transform = `translate(${x}px, ${y}px)`;
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = '';
      });
    });
  }

  /* ---------- 12) PROJECT CARD MOUSE GLOW ---------- */
  projectCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.background = `
        radial-gradient(600px circle at ${x}px ${y}px, rgba(99, 102, 241, 0.12), transparent 40%),
        rgba(20, 24, 40, 0.55)
      `;
    });
    card.addEventListener('mouseleave', () => {
      card.style.background = '';
    });
  });

  /* ---------- 13) INITIAL CALLS ---------- */
  onScroll();

  console.log('%c✨ Portfolio carregado!', 'color: #8b5cf6; font-size: 16px; font-weight: bold;');
  console.log('%cKaique Mateus • Analista de Dados & BI', 'color: #06b6d4; font-size: 13px;');
  console.log('%cInteressado no código? github.com/KaiqueMateus', 'color: #a7b0c4; font-size: 12px;');

});

/* ---------- 14) WHATSAPP FLOAT BUTTON ---------- */
(function() {
  const phone = '5521981028708';
  const msg = 'Olá Kaique! Vi seu portfólio e gostaria de conversar.';
  const url = 'https://wa.me/' + phone + '?text=' + encodeURIComponent(msg);

  const wpp = document.createElement('a');
  wpp.href = url;
  wpp.target = '_blank';
  wpp.rel = 'noopener';
  wpp.className = 'whatsapp-float';
  wpp.setAttribute('aria-label', 'Falar no WhatsApp');
  wpp.innerHTML = '<i class="bi bi-whatsapp"></i><span class="wpp-tooltip">Fale comigo no WhatsApp</span>';
  document.body.appendChild(wpp);
})();

/* ---------- 15) WHATSAPP CONTACT CARD ---------- */
(function() {
  const grid = document.querySelector('.contact-grid');
  if (!grid) return;

  const phone = '5521981028708';
  const msg = 'Olá Kaique! Vi seu portfólio e gostaria de conversar.';
  const url = 'https://wa.me/' + phone + '?text=' + encodeURIComponent(msg);

  const card = document.createElement('a');
  card.href = url;
  card.target = '_blank';
  card.rel = 'noopener';
  card.className = 'contact-card contact-card-whatsapp reveal visible';
  card.innerHTML = `
    <i class="bi bi-whatsapp"></i>
    <h3>WhatsApp</h3>
    <p>+55 (21) 98102-8708</p>
    <span class="contact-cta">Chamar agora <i class="bi bi-arrow-right"></i></span>
  `;
  // insere logo depois do card do e-mail (primeiro filho)
  grid.insertBefore(card, grid.children[1]);
})();