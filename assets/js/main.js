/* ============================================================
   FULL CIRCLE — Homepage Animations
   Stack: GSAP + ScrollTrigger
   ============================================================ */

(function () {
  'use strict';

  /* ── Register GSAP plugins ─────────────────────────────── */
  gsap.registerPlugin(ScrollTrigger);

  /* ── Custom cursor ─────────────────────────────────────── */
  const cursor = document.querySelector('.cursor');
  const cursorRing = document.querySelector('.cursor-ring');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const coarsePointer = window.matchMedia('(hover: none), (pointer: coarse)');

  if (cursor && cursorRing) {
    if (coarsePointer.matches) {
      const startX = window.innerWidth * 0.74;
      const startY = Math.min(window.innerHeight * 0.28, 220);

      cursor.style.display = 'none';
      gsap.set(cursorRing, {
        xPercent: -50,
        yPercent: -50,
        x: startX,
        y: startY,
        opacity: 0.88,
      });

      gsap.to(cursorRing, {
        rotation: 8,
        scale: 1.04,
        duration: 2.2,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      });

      const moveTouchCursor = (event) => {
        const touch = event.touches && event.touches[0];
        if (!touch) return;
        gsap.to(cursorRing, {
          x: touch.clientX,
          y: touch.clientY,
          duration: 0.28,
          ease: 'power3.out',
          overwrite: 'auto',
        });
      };

      window.addEventListener('touchstart', moveTouchCursor, { passive: true });
      window.addEventListener('touchmove', moveTouchCursor, { passive: true });
    } else {
      let mouseX = window.innerWidth / 2;
      let mouseY = window.innerHeight / 2;

      gsap.set(cursor,     { xPercent: -50, yPercent: -50, x: mouseX, y: mouseY });
      gsap.set(cursorRing, { xPercent: -50, yPercent: -50, x: mouseX, y: mouseY });

      window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        gsap.to(cursor, {
          x: mouseX,
          y: mouseY,
          duration: 0.06,
          ease: 'none',
          overwrite: 'auto',
        });
        gsap.to(cursorRing, {
          x: mouseX,
          y: mouseY,
          duration: 0.16,
          ease: 'power2.out',
          overwrite: 'auto',
        });
      });

      document.addEventListener('mouseleave', () => {
        gsap.to([cursor, cursorRing], { opacity: 0, duration: 0.15, overwrite: 'auto' });
      });

      document.addEventListener('mouseenter', () => {
        gsap.to([cursor, cursorRing], { opacity: 1, duration: 0.15, overwrite: 'auto' });
      });
    }
  }

  /* ── Utility: split text into animated words ───────────── */
  function splitWords(el) {
    const text = el.textContent.trim();
    el.innerHTML = '';
    text.split(' ').forEach((word, i) => {
      const span = document.createElement('span');
      span.className = 'word';
      const inner = document.createElement('span');
      inner.className = 'word-inner';
      inner.textContent = word;
      span.appendChild(inner);
      el.appendChild(span);
      if (i < text.split(' ').length - 1) {
        el.appendChild(document.createTextNode(' '));
      }
    });
  }

  /* ── Number counter animation ──────────────────────────── */
  function animateCount(el, target, suffix = '') {
    gsap.to({ val: 0 }, {
      val: target,
      duration: 2,
      ease: 'power3.out',
      onUpdate: function () {
        el.textContent = Math.round(this.targets()[0].val) + suffix;
      },
    });
  }

  /* ── Hero entrance — cinematic dramatic sequence ──────── */
  function initHero() {
    const flash     = document.querySelector('.hero-flash');
    const markImg   = document.querySelector('.hero-mark img');
    const stmtLines = document.querySelectorAll('.hero-stmt-inner');
    const scan      = document.querySelector('.hero-scan');
    const scroll    = document.querySelector('.hero-scroll');
    const sideLabel = document.querySelector('.hero-side-label');
    const yearEl    = document.querySelector('.hero-year');
    const navLogo   = document.querySelector('.nav-logo');
    const navRight  = document.querySelector('.nav-right');
    const videoEl   = document.querySelector('.hero-video');

    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

    /* Flash — very restrained flare, not a gimmick */
    if (flash) {
      tl.fromTo(flash,
        { opacity: 1 },
        { opacity: 0, duration: 1.1, ease: 'power2.out' },
        0
      );
    }

    /* Scan — restrained editorial sweep */
    if (scan) {
      tl.fromTo(scan,
        { scaleX: 0, opacity: 0 },
        { scaleX: 1, opacity: 0.68, duration: 0.62, ease: 'power3.inOut', transformOrigin: 'left center' },
        0.1
      );
      tl.to(scan, { opacity: 0, duration: 0.42, ease: 'power2.out' }, 0.58);
    }

    /* Video — rises quietly behind the composition */
    if (videoEl) {
      tl.to(videoEl, { opacity: 0.44, duration: 1.8, ease: 'power2.inOut' }, 0.35);
    }

    /* Nav */
    tl.to([navLogo, navRight], { opacity: 1, y: 0, duration: 0.9, stagger: 0.15 }, 0.15);

    /* Brand mark — settle, not bounce */
    if (markImg) {
      tl.fromTo(markImg,
        { opacity: 0, y: 24, scale: 0.96, filter: 'blur(4px)' },
        { opacity: 1, y: 0,  scale: 1, duration: 1.25, ease: 'power3.out', filter: 'blur(0px)' },
        0.55
      );
    }

    /* Statement lines — premium rise, no PowerPoint fold */
    if (stmtLines.length) {
      tl.fromTo(stmtLines[0],
        { y: 18, opacity: 0, filter: 'blur(8px)' },
        { y: 0, opacity: 1, filter: 'blur(0px)', duration: 1.15, ease: 'power3.out' },
        0.82
      );
      if (stmtLines[1]) {
        tl.fromTo(stmtLines[1],
          { y: 18, opacity: 0, filter: 'blur(8px)' },
          { y: 0, opacity: 1, filter: 'blur(0px)', duration: 1.15, ease: 'power3.out' },
          0.98
        );
      }
    }

    /* Peripherals */
    if (sideLabel) tl.to(sideLabel, { opacity: 1, duration: 1.1 }, 1.6);
    if (yearEl)    tl.to(yearEl,    { opacity: 1, duration: 1.1 }, 1.6);
    if (scroll)    tl.to(scroll,    { opacity: 1, duration: 1.0 }, 1.8);

    /* Brand mark gentle float after entrance */
    if (markImg) {
      gsap.to(markImg, {
        y: -8,
        duration: 5,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        delay: 3.5,
      });
    }

    /* Video parallax on scroll */
    if (videoEl) {
      gsap.to(videoEl, {
        scale: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 1.5,
        },
      });
    }
  }

  /* ── Manifesto section ─────────────────────────────────── */
  function initManifesto() {
    const section = document.querySelector('.manifesto');
    if (!section) return;

    const label  = section.querySelector('.manifesto-label');
    const textEl = section.querySelector('.manifesto-text');
    const note   = section.querySelector('.manifesto-note');
    const stats  = section.querySelectorAll('.manifesto-stat');

    if (label) {
      ScrollTrigger.create({
        trigger: label,
        start: 'top 85%',
        onEnter: () => gsap.to(label, { opacity: 1, y: 0, duration: 0.9, ease: 'power4.out' }),
      });
    }

    if (textEl) {
      ScrollTrigger.create({
        trigger: textEl,
        start: 'top 78%',
        onEnter: () => {
          gsap.to(textEl, { opacity: 1, y: 0, duration: 1.4, ease: 'power4.out' });
        },
      });
    }

    if (stats.length) {
      ScrollTrigger.create({
        trigger: stats[0],
        start: 'top 85%',
        onEnter: () => {
          gsap.to(stats, { opacity: 1, y: 0, duration: 1.0, stagger: 0.18, ease: 'power4.out' });
          stats.forEach((stat) => {
            const countEl = stat.querySelector('.count');
            if (!countEl) return;
            animateCount(countEl, parseFloat(countEl.dataset.target), countEl.dataset.suffix || '');
          });
        },
      });
    }

    if (note) {
      ScrollTrigger.create({
        trigger: note,
        start: 'top 88%',
        onEnter: () => gsap.to(note, { opacity: 1, y: 0, duration: 1.0, ease: 'power4.out' }),
      });
    }
  }

  /* ── Services section ──────────────────────────────────── */
  function initServices() {
    const section = document.querySelector('.services');
    if (!section) return;

    const label    = section.querySelector('.services-label');
    const headline = section.querySelector('.services-headline');
    const intro    = section.querySelector('.services-intro');
    const cards    = section.querySelectorAll('.service-card');

    const headerTl = gsap.timeline({
      scrollTrigger: { trigger: section, start: 'top 80%' },
    });

    if (label)    headerTl.to(label,    { opacity: 1, y: 0, duration: 0.8, ease: 'power4.out' }, 0);
    if (headline) headerTl.to(headline, { opacity: 1, y: 0, duration: 1.0, ease: 'power4.out' }, 0.15);
    if (intro)    headerTl.to(intro,    { opacity: 1, y: 0, duration: 1.0, ease: 'power4.out' }, 0.3);

    cards.forEach((card, i) => {
      ScrollTrigger.create({
        trigger: card,
        start: 'top 88%',
        onEnter: () => {
          gsap.to(card, {
            opacity: 1,
            y: 0,
            duration: 1.1,
            ease: 'power4.out',
            delay: (i % 2) * 0.15,
          });
        },
      });
    });
  }

  /* ── Audience section ──────────────────────────────────── */
  function initAudience() {
    const section = document.querySelector('.audience');
    if (!section) return;

    const label   = section.querySelector('.audience-label');
    const headline = section.querySelector('.audience-headline');
    const body    = section.querySelector('.audience-body');
    const ctaLink = section.querySelector('.audience-cta-link');
    const items   = section.querySelectorAll('.audience-item');

    if (label) {
      ScrollTrigger.create({
        trigger: label,
        start: 'top 85%',
        onEnter: () => gsap.to(label, { opacity: 1, y: 0, duration: 0.9, ease: 'power4.out' }),
      });
    }

    if (headline) {
      splitWords(headline);
      const words = headline.querySelectorAll('.word-inner');
      ScrollTrigger.create({
        trigger: headline,
        start: 'top 80%',
        onEnter: () => gsap.to(words, { y: '0%', duration: 1.1, ease: 'power4.out', stagger: 0.07 }),
      });
    }

    if (body || ctaLink) {
      ScrollTrigger.create({
        trigger: body || ctaLink,
        start: 'top 85%',
        onEnter: () => {
          if (body)    gsap.to(body,    { opacity: 1, y: 0, duration: 1.0, ease: 'power4.out' });
          if (ctaLink) gsap.to(ctaLink, { opacity: 1, y: 0, duration: 1.0, ease: 'power4.out', delay: 0.18 });
        },
      });
    }

    items.forEach((item, i) => {
      ScrollTrigger.create({
        trigger: item,
        start: 'top 90%',
        onEnter: () => {
          gsap.to(item, { opacity: 1, x: 0, duration: 1.0, ease: 'power4.out', delay: i * 0.12 });
        },
      });
    });
  }

  /* ── Method section ────────────────────────────────────── */
  function initMethod() {
    const section = document.querySelector('.method');
    if (!section) return;

    const label = section.querySelector('.method-label');
    const steps = section.querySelectorAll('.method-step');

    if (label) {
      ScrollTrigger.create({
        trigger: label,
        start: 'top 85%',
        onEnter: () => gsap.to(label, { opacity: 1, y: 0, duration: 0.9, ease: 'power4.out' }),
      });
    }

    const stepsContainer = section.querySelector('.method-steps');
    if (stepsContainer) {
      ScrollTrigger.create({
        trigger: stepsContainer,
        start: 'top 75%',
        onEnter: () => stepsContainer.classList.add('line-animated'),
      });
    }

    steps.forEach((step, i) => {
      ScrollTrigger.create({
        trigger: step,
        start: 'top 88%',
        onEnter: () => {
          gsap.to(step, { opacity: 1, y: 0, duration: 1.1, ease: 'power4.out', delay: i * 0.18 });
        },
      });
    });
  }

  /* ── CTA section ───────────────────────────────────────── */
  function initCTA() {
    const section = document.querySelector('.cta-section');
    if (!section) return;

    const eyebrow = section.querySelector('.cta-eyebrow');
    const sub     = section.querySelector('.cta-sub');
    const button  = section.querySelector('.cta-button');
    const contact = section.querySelector('.contact-grid');
    const socials = section.querySelector('.social-links');

    ScrollTrigger.create({
      trigger: eyebrow || sub,
      start: 'top 82%',
      onEnter: () => {
        if (eyebrow) gsap.to(eyebrow, { opacity: 1, y: 0, duration: 1.3, ease: 'power4.out' });
        if (sub)     gsap.to(sub,    { opacity: 1, y: 0, duration: 1.0, ease: 'power4.out', delay: 0.22 });
        if (button)  gsap.to(button, { opacity: 1, y: 0, duration: 1.0, ease: 'power4.out', delay: 0.38 });
        if (contact) gsap.to(contact,{ opacity: 1, y: 0, duration: 1.0, ease: 'power4.out', delay: 0.55 });
        if (socials) gsap.to(socials,{ opacity: 1, y: 0, duration: 0.9, ease: 'power4.out', delay: 0.68 });
      },
    });
  }

  /* ── Nav scroll behaviour ──────────────────────────────── */
  function initNav() {
    const nav = document.querySelector('nav');
    if (!nav) return;

    ScrollTrigger.create({
      start: 'top -80px',
      onToggle: (self) => nav.classList.toggle('scrolled', self.isActive),
    });
  }

  /* ── Parallax on hero inner ────────────────────────────── */
  function initParallax() {
    const heroInner = document.querySelector('.hero-inner');
    if (!heroInner) return;

    gsap.to(heroInner, {
      y: 90,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    });
  }

  /* ── Init all ──────────────────────────────────────────── */
  function init() {
    initHero();
    initNav();
    initParallax();
    initManifesto();
    initServices();
    initAudience();
    initMethod();
    initCTA();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
