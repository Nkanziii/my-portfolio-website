/* ============================================================
   NIKI KHANEZAI — PORTFOLIO SCRIPT (index.html)
   ============================================================ */

/* ── CUSTOM CURSOR ── */
const cur  = document.getElementById('cur');
const ring = document.getElementById('cur-ring');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

(function animCur() {
  cur.style.left  = mx + 'px';
  cur.style.top   = my + 'px';
  rx += (mx - rx) * .1;
  ry += (my - ry) * .1;
  ring.style.left = rx + 'px';
  ring.style.top  = ry + 'px';
  requestAnimationFrame(animCur);
})();

document.querySelectorAll('a, button, .tab, .cv').forEach(el => {
  el.addEventListener('mouseenter', () => { cur.style.width = '18px'; cur.style.height = '18px'; cur.style.background = '#bb101e'; });
  el.addEventListener('mouseleave', () => { cur.style.width = '10px'; cur.style.height = '10px'; cur.style.background = '#D9C3A9'; });
});


/* ── TWINKLING STARS ── */
const sc   = document.getElementById('starsCanvas');
const sctx = sc.getContext('2d');
let W, H;

function resize() { W = sc.width = window.innerWidth; H = sc.height = window.innerHeight; }
resize();
window.addEventListener('resize', resize);

const stars = Array.from({ length: 90 }, () => ({
  x:     Math.random(),
  y:     Math.random(),
  size:  Math.random() * 6 + 2,
  phase: Math.random() * Math.PI * 2,
  speed: Math.random() * .008 + .003,
  type:  Math.random() < .55 ? 'dot' : 'spark'
}));

function drawSpark(x, y, s, a) {
  sctx.save(); sctx.globalAlpha = a; sctx.fillStyle = '#D9C3A9';
  sctx.beginPath();
  sctx.moveTo(x, y-s); sctx.lineTo(x+s*.18, y-s*.18); sctx.lineTo(x+s, y);
  sctx.lineTo(x+s*.18, y+s*.18); sctx.lineTo(x, y+s);
  sctx.lineTo(x-s*.18, y+s*.18); sctx.lineTo(x-s, y);
  sctx.lineTo(x-s*.18, y-s*.18); sctx.closePath(); sctx.fill(); sctx.restore();
}

function drawDot(x, y, s, a) {
  sctx.save(); sctx.globalAlpha = a; sctx.fillStyle = '#D9C3A9';
  sctx.beginPath(); sctx.arc(x, y, s * .6, 0, Math.PI * 2); sctx.fill(); sctx.restore();
}

function animStars(t) {
  sctx.clearRect(0, 0, W, H);
  stars.forEach(s => {
    const a = .1 + .8 * (Math.sin(t * s.speed + s.phase) * .5 + .5);
    s.type === 'spark' ? drawSpark(s.x * W, s.y * H, s.size, a)
                       : drawDot  (s.x * W, s.y * H, s.size, a);
  });
  requestAnimationFrame(animStars);
}
requestAnimationFrame(animStars);


/* ── SCROLL REVEAL ── */
const reveals = document.querySelectorAll('.reveal');
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('on'); obs.unobserve(e.target); }
  });
}, { threshold: 0, rootMargin: '0px 0px -10px 0px' });
reveals.forEach(el => obs.observe(el));


/* ── NAV SCROLL ── */
const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => {
  nav.style.background = window.scrollY > 60
    ? 'rgba(75,8,13,.88)'
    : 'rgba(75,8,13,.55)';
});

/* ── MOBILE DRAWER ── */
const menuBtn     = document.querySelector('.menu-btn');
const drawer      = document.querySelector('.nav-drawer');
const overlay     = document.querySelector('.nav-overlay');
const drawerClose = document.querySelector('.nav-drawer-close');
const drawerLinks = document.querySelectorAll('.nav-drawer-link');

function openDrawer() {
  drawer.classList.add('open');
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeDrawer() {
  drawer.classList.remove('open');
  overlay.classList.remove('open');
  document.body.style.overflow = '';
}

menuBtn.addEventListener('click', openDrawer);
drawerClose.addEventListener('click', closeDrawer);
overlay.addEventListener('click', closeDrawer);
drawerLinks.forEach(link => link.addEventListener('click', closeDrawer));
