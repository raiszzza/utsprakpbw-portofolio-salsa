
// ── CURSOR ──────────────────────────────────
const cursor    = document.getElementById('cursor');
const cursorDot = document.getElementById('cursorDot');
let mouseX = 0, mouseY = 0, dotX = 0, dotY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
});
function animateCursor() {
  dotX += (mouseX - dotX) * 0.12;
  dotY += (mouseY - dotY) * 0.12;
  cursor.style.transform = `translate(${dotX}px, ${dotY}px)`;
  requestAnimationFrame(animateCursor);
}
animateCursor();

document.querySelectorAll('a, button, .skill-card, .project-card, .contact-card').forEach(el => {
  el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
});

// ── TYPING EFFECT ────────────────────────────
const phrases = [
  'Computer Science Student',
  'Web Developer in Training',
  'Data Enthusiast',
  'UI/UX Learner',
  'Problem Solver'
];
let pIdx = 0, cIdx = 0, deleting = false;
const typingEl = document.getElementById('typingText');

function typeLoop() {
  const current = phrases[pIdx];
  if (!deleting) {
    typingEl.textContent = current.slice(0, ++cIdx);
    if (cIdx === current.length) { deleting = true; setTimeout(typeLoop, 1800); return; }
  } else {
    typingEl.textContent = current.slice(0, --cIdx);
    if (cIdx === 0) { deleting = false; pIdx = (pIdx + 1) % phrases.length; }
  }
  setTimeout(typeLoop, deleting ? 45 : 80);
}
typeLoop();

// ── NAVBAR ──────────────────────────────────
const nav = document.getElementById('nav');

window.addEventListener('scroll', () => {
  document.querySelectorAll('section[id]').forEach(sec => {
    const top    = sec.offsetTop - 120;
    const bottom = top + sec.offsetHeight;
    if (window.scrollY >= top && window.scrollY < bottom) {
      document.querySelectorAll('.nav-links a').forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === '#' + sec.id);
      });
    }
  });
});

// ── SCROLL REVEAL ────────────────────────────
const revealConfig = [
  { selector: '.reveal-up',    from: 'translateY(36px)' },
  { selector: '.reveal-left',  from: 'translateX(-44px)' },
  { selector: '.reveal-right', from: 'translateX(44px)' },
  { selector: '.reveal-scale', from: 'scale(0.88)' },
];

revealConfig.forEach(({ selector, from }) => {
  document.querySelectorAll(selector).forEach(el => {
    el.style.opacity    = '0';
    el.style.transform  = from;
    el.style.transition = 'opacity 0.85s cubic-bezier(.16,1,.3,1), transform 0.85s cubic-bezier(.16,1,.3,1)';

    const delays = { d1:80, d2:180, d3:280, d4:380, d5:480, d6:580 };
    const delay  = Object.entries(delays).find(([cls]) => el.classList.contains(cls))?.[1] ?? 0;
    el.style.transitionDelay = delay + 'ms';

    new IntersectionObserver((entries, obs) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.style.opacity   = '1';
          e.target.style.transform = 'none';
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 }).observe(el);
  });
});

// ── SKILL BAR ANIMATION ──────────────────────
new IntersectionObserver((entries, obs) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.skill-fill').forEach(fill => {
        const level = fill.style.getPropertyValue('--level');
        fill.style.width = '0%';
        setTimeout(() => { fill.style.width = level; }, 300);
      });
      obs.unobserve(e.target);
    }
  });
}, { threshold: 0.15 }).observe(document.getElementById('skills'));

// ── HALFTONE (kept for compatibility, repurposed as star-dot art) ──
// (Original halftone calls removed; replaced by star field canvases below)

// ── ★ STAR FIELD CANVAS ──────────────────────
/**
 * Draws a dreamy star field on a canvas.
 * @param {string|HTMLCanvasElement} target  canvas id or element
 * @param {object} opts  configuration
 */
function drawStarField(target, opts = {}) {
  const canvas = typeof target === 'string' ? document.getElementById(target) : target;
  if (!canvas) return;

  const {
    count       = 120,
    color       = 'rgba(201,168,76,1)',
    color2      = 'rgba(244,237,227,1)',
    maxRadius   = 2.2,
    minRadius   = 0.3,
    glow        = true,
    constellations = false,
  } = opts;

  const W = canvas.offsetWidth  || canvas.width  || 400;
  const H = canvas.offsetHeight || canvas.height || 300;
  canvas.width  = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, W, H);

  // Generate star positions
  const stars = Array.from({ length: count }, () => ({
    x:    Math.random() * W,
    y:    Math.random() * H,
    r:    minRadius + Math.random() * (maxRadius - minRadius),
    a:    0.15 + Math.random() * 0.7,
    gold: Math.random() > 0.4,
  }));

  // Optional: draw faint constellation lines between nearby stars
  if (constellations) {
    ctx.strokeStyle = color;
    ctx.lineWidth   = 0.4;
    for (let i = 0; i < stars.length; i++) {
      for (let j = i + 1; j < stars.length; j++) {
        const dx   = stars[i].x - stars[j].x;
        const dy   = stars[i].y - stars[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 80) {
          const alpha = (1 - dist / 80) * 0.12;
          ctx.globalAlpha = alpha;
          ctx.beginPath();
          ctx.moveTo(stars[i].x, stars[i].y);
          ctx.lineTo(stars[j].x, stars[j].y);
          ctx.stroke();
        }
      }
    }
    ctx.globalAlpha = 1;
  }

  // Draw each star
  stars.forEach(s => {
    ctx.globalAlpha = s.a;

    if (glow && s.r > 1.2) {
      const gradient = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 3);
      const baseColor = s.gold ? color : color2;
      gradient.addColorStop(0, baseColor);
      gradient.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r * 3, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = s.gold ? color : color2;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fill();

    // Draw a tiny 4-point cross sparkle on larger stars
    if (s.r > 1.6) {
      const len = s.r * 4;
      ctx.globalAlpha = s.a * 0.5;
      ctx.strokeStyle = s.gold ? color : color2;
      ctx.lineWidth   = 0.6;
      ctx.beginPath();
      ctx.moveTo(s.x - len, s.y); ctx.lineTo(s.x + len, s.y);
      ctx.moveTo(s.x, s.y - len); ctx.lineTo(s.x, s.y + len);
      ctx.stroke();
    }
  });

  ctx.globalAlpha = 1;
}

// ── ★ MILKY WAY BAND (for skills section) ────
function drawMilkyWay(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const W = canvas.offsetWidth || window.innerWidth || 1200;
  const H = 100;
  canvas.width  = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

  // Soft nebula gradient band
  const band = ctx.createLinearGradient(0, 0, W, 0);
  band.addColorStop(0,    'rgba(201,168,76,0)');
  band.addColorStop(0.2,  'rgba(201,168,76,0.06)');
  band.addColorStop(0.5,  'rgba(244,237,227,0.09)');
  band.addColorStop(0.8,  'rgba(201,168,76,0.06)');
  band.addColorStop(1,    'rgba(201,168,76,0)');

  ctx.fillStyle = band;
  ctx.beginPath();
  ctx.ellipse(W / 2, H / 2, W / 2, 28, 0, 0, Math.PI * 2);
  ctx.fill();

  // Scatter tiny stars across the band
  for (let i = 0; i < 220; i++) {
    const x = Math.random() * W;
    const y = 20 + Math.random() * 60;
    const r = 0.3 + Math.random() * 1.4;
    const a = 0.1 + Math.random() * 0.55;
    ctx.globalAlpha = a;
    ctx.fillStyle   = Math.random() > 0.45 ? 'rgba(201,168,76,1)' : 'rgba(244,237,227,1)';
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

// ── ★ ANIMATED STAR FIELD (hero + contact) ───
/**
 * Creates an animated, twinkling star field on a canvas.
 * Stars gently pulse in opacity.
 */
function animatedStarField(canvasId, opts = {}) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const parent = canvas.parentElement;
  const W = parent.offsetWidth  || 800;
  const H = parent.offsetHeight || 600;
  canvas.width  = W;
  canvas.height = H;

  const {
    count       = 160,
    goldRatio   = 0.55,
    constellations = true,
  } = opts;

  const GOLD  = [201, 168,  76];
  const CREAM = [244, 237, 227];

  const stars = Array.from({ length: count }, () => {
    const isGold = Math.random() < goldRatio;
    const [r, g, b] = isGold ? GOLD : CREAM;
    return {
      x:        Math.random() * W,
      y:        Math.random() * H,
      r:        0.3 + Math.random() * 1.8,
      baseA:    0.15 + Math.random() * 0.65,
      phase:    Math.random() * Math.PI * 2,
      speed:    0.3 + Math.random() * 1.2,
      r_color:  r, g_color: g, b_color: b,
      isBright: Math.random() > 0.78,
    };
  });

  // Pre-compute constellation edges (nearby pairs)
  const edges = [];
  if (constellations) {
    for (let i = 0; i < stars.length; i++) {
      for (let j = i + 1; j < stars.length; j++) {
        const dx   = stars[i].x - stars[j].x;
        const dy   = stars[i].y - stars[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 90 && Math.random() > 0.75) {
          edges.push([i, j, dist]);
        }
      }
    }
  }

  const ctx = canvas.getContext('2d');
  let frame = 0;

  function drawFrame() {
    ctx.clearRect(0, 0, W, H);
    const t = frame * 0.012;

    // Draw constellation lines first
    edges.forEach(([i, j, dist]) => {
      const alpha = (1 - dist / 90) * 0.1 * (0.7 + 0.3 * Math.sin(t + i));
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = `rgba(201,168,76,1)`;
      ctx.lineWidth   = 0.4;
      ctx.beginPath();
      ctx.moveTo(stars[i].x, stars[i].y);
      ctx.lineTo(stars[j].x, stars[j].y);
      ctx.stroke();
    });

    // Draw stars
    stars.forEach(s => {
      const twinkle = 0.5 + 0.5 * Math.sin(t * s.speed + s.phase);
      const alpha   = s.baseA * (0.4 + 0.6 * twinkle);
      const { r_color: rc, g_color: gc, b_color: bc } = s;

      // Glow halo for bright stars
      if (s.isBright && s.r > 1.2) {
        const grd = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 5);
        grd.addColorStop(0, `rgba(${rc},${gc},${bc},${(alpha * 0.4).toFixed(3)})`);
        grd.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.globalAlpha = 1;
        ctx.fillStyle   = grd;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r * 5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Star body
      ctx.globalAlpha = alpha;
      ctx.fillStyle   = `rgb(${rc},${gc},${bc})`;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();

      // Cross sparkle for bright large stars
      if (s.isBright && s.r > 1.2) {
        const len = s.r * 4.5;
        ctx.globalAlpha = alpha * 0.6;
        ctx.strokeStyle = `rgb(${rc},${gc},${bc})`;
        ctx.lineWidth   = 0.7;
        ctx.beginPath();
        ctx.moveTo(s.x - len, s.y); ctx.lineTo(s.x + len, s.y);
        ctx.moveTo(s.x, s.y - len); ctx.lineTo(s.x, s.y + len);
        ctx.stroke();
        // Diagonal hints
        const dlen = len * 0.55;
        ctx.globalAlpha = alpha * 0.25;
        ctx.beginPath();
        ctx.moveTo(s.x - dlen, s.y - dlen); ctx.lineTo(s.x + dlen, s.y + dlen);
        ctx.moveTo(s.x + dlen, s.y - dlen); ctx.lineTo(s.x - dlen, s.y + dlen);
        ctx.stroke();
      }
    });

    ctx.globalAlpha = 1;
    frame++;
    requestAnimationFrame(drawFrame);
  }

  drawFrame();
}

// ── ★ PERIODIC SHOOTING STAR ON CANVAS ───────
function spawnShootingStar(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  function fireShot() {
    const ctx = canvas.getContext('2d');
    const W   = canvas.width;
    const H   = canvas.height;

    // Start from random point on top half
    const startX = Math.random() * W * 0.6 + W * 0.2;
    const startY = Math.random() * H * 0.3;
    const angle  = Math.PI / 6 + Math.random() * Math.PI / 6; // 30–60°
    const length = 80 + Math.random() * 100;
    const endX   = startX + Math.cos(angle) * length;
    const endY   = startY + Math.sin(angle) * length;

    let progress = 0;

    function drawShot() {
      if (progress >= 1) {
        setTimeout(fireShot, 4000 + Math.random() * 6000);
        return;
      }

      // Fade in then fade out
      const alpha = progress < 0.3
        ? progress / 0.3
        : 1 - (progress - 0.3) / 0.7;

      const curX = startX + (endX - startX) * progress;
      const curY = startY + (endY - startY) * progress;
      const tailX = startX + (endX - startX) * Math.max(0, progress - 0.4);
      const tailY = startY + (endY - startY) * Math.max(0, progress - 0.4);

      const grad = ctx.createLinearGradient(tailX, tailY, curX, curY);
      grad.addColorStop(0, `rgba(201,168,76,0)`);
      grad.addColorStop(1, `rgba(201,168,76,${(alpha * 0.7).toFixed(2)})`);

      ctx.save();
      ctx.globalAlpha = 1;
      ctx.strokeStyle = grad;
      ctx.lineWidth   = 1.5;
      ctx.lineCap     = 'round';
      ctx.beginPath();
      ctx.moveTo(tailX, tailY);
      ctx.lineTo(curX, curY);
      ctx.stroke();

      // Head sparkle
      ctx.globalAlpha = alpha * 0.9;
      ctx.fillStyle   = 'rgba(244,237,227,1)';
      ctx.beginPath();
      ctx.arc(curX, curY, 1.8, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      progress += 0.018;
      requestAnimationFrame(drawShot);
    }
    drawShot();
  }

  // Kick off with a small initial delay
  setTimeout(fireShot, 1500 + Math.random() * 2000);
}

// ── INIT all star canvases ────────────────────
window.addEventListener('load', () => {
  // Animated star fields (hero + contact)
  animatedStarField('starfieldHero',    { count: 180, goldRatio: 0.5, constellations: true });
  animatedStarField('starfieldContact', { count: 140, goldRatio: 0.55, constellations: true });

  // Milky-way band (skills section top)
  drawMilkyWay('milkywaySkills');

  // Shooting star overlays on hero + contact canvases
  spawnShootingStar('starfieldHero');
  spawnShootingStar('starfieldContact');
});

// ── FLOATING PARTICLES (hero — DOM-based, small dots) ──
(function () {
  const hero = document.getElementById('home');
  if (!hero) return;
  const count = 14;
  for (let i = 0; i < count; i++) {
    const dot   = document.createElement('div');
    const size  = Math.random() * 2.5 + 0.5;
    const top   = Math.random() * 90;
    const left  = Math.random() * 90;
    const colors = ['rgba(201,168,76,', 'rgba(244,237,227,'];
    const color  = colors[Math.floor(Math.random() * colors.length)];
    const alpha  = (Math.random() * 0.18 + 0.06).toFixed(2);
    const dur    = (Math.random() * 14 + 10).toFixed(1);
    const delay  = (Math.random() * -20).toFixed(1);

    dot.style.cssText = `
      position:absolute; border-radius:50%; pointer-events:none; z-index:1;
      width:${size}px; height:${size}px;
      top:${top}%; left:${left}%;
      background:${color}${alpha});
      animation:particleFloat ${dur}s ${delay}s ease-in-out infinite;
    `;
    hero.appendChild(dot);
  }
})();

(function injectParticleKeyframes() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes particleFloat {
      0%,100% { transform:translateY(0px) translateX(0px); opacity:0.6; }
      25%     { transform:translateY(-18px) translateX(8px); opacity:1; }
      50%     { transform:translateY(-8px) translateX(-6px); opacity:0.7; }
      75%     { transform:translateY(-22px) translateX(4px); opacity:0.9; }
    }
  `;
  document.head.appendChild(style);
})();

// ── SECTION LABEL LINE ENTRANCE ──────────────
document.querySelectorAll('.label-line').forEach(line => {
  line.style.width      = '0px';
  line.style.transition = 'width .6s ease .3s';
  new IntersectionObserver((entries, obs) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.style.width = '28px'; obs.unobserve(e.target); }
    });
  }, { threshold: 0.5 }).observe(line);
});

// ── STATS COUNT-UP ───────────────────────────
function animateCountUp(el) {
  const rawText = el.textContent.trim();
  const hasPlus = rawText.includes('+');
  const hasDot  = rawText.includes('y.o') || rawText.includes('y');
  const num     = parseInt(rawText);
  if (isNaN(num)) return;

  let start = 0;
  const duration = 900;
  const step = timestamp => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3);
    const current  = Math.floor(eased * num);
    el.textContent = current + (hasPlus ? '+' : '') + (hasDot ? ' y.o' : '');
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = rawText;
  };
  requestAnimationFrame(step);
}

document.querySelectorAll('.hstat-num, .astat-num').forEach(el => {
  new IntersectionObserver((entries, obs) => {
    entries.forEach(e => {
      if (e.isIntersecting) { animateCountUp(e.target); obs.unobserve(e.target); }
    });
  }, { threshold: 0.5 }).observe(el);
});
