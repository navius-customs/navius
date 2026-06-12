(function () {
  'use strict';

  /* 저작권 연도 자동 업데이트 */
  var yearEl = document.getElementById('copyright-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ==============================================
     언어별 이미지 매핑
     KO: 한글 이미지 / EN: 영문(_eng) 이미지
  ============================================== */
  var IMG_MAP = {
    ko: {
      hero:   ['image/main1.png', 'image/main2.png', 'image/main3.png'],
      about:  'image/officeinfo.jpg',
      why:    'image/why2.jpg',
      banner:['image/카톡상담_배너_이미지_나비어스.png', 'image/네이버블로그_배너_이미지_나비어스.png']
    },
    en: {
      hero:   ['image/main1_eng.png', 'image/main2_eng.png', 'image/main3_eng.png'],
      about:  'image/officeinfo_eng.png',
      why:    'image/why2_eng.png',
      banner:['image/kakaotalk.png', 'image/blog.png']
    }
  };

  /* ==============================================
     HERO SLIDER
  ============================================== */
  var heroImg = document.getElementById('hero-img');
  var dots    = Array.from(document.querySelectorAll('.hero-dots .dot'));
  var prevBtn = document.querySelector('.hero-arrow.prev');
  var nextBtn = document.querySelector('.hero-arrow.next');
  var cur     = 0;
  var timer   = null;
  var lang    = 'ko';

  function goTo(n) {
    n = ((n % 3) + 3) % 3;
    if (!heroImg) return;
    heroImg.classList.add('fading');
    setTimeout(function () {
      heroImg.src = IMG_MAP[lang].hero[n];
      heroImg.classList.remove('fading');
      cur = n;
      dots.forEach(function (d, i) { d.classList.toggle('active', i === n); });
    }, 500);
  }

  function startAuto() {
    clearInterval(timer);
    timer = setInterval(function () { goTo(cur + 1); }, 5000);
  }

  dots.forEach(function (d) {
    d.addEventListener('click', function () { goTo(+d.dataset.index); startAuto(); });
  });
  if (prevBtn) prevBtn.addEventListener('click', function () { goTo(cur - 1); startAuto(); });
  if (nextBtn) nextBtn.addEventListener('click', function () { goTo(cur + 1); startAuto(); });

  /* 스와이프 */
  var tx = 0;
  if (heroImg) {
    heroImg.addEventListener('touchstart', function (e) { tx = e.changedTouches[0].clientX; }, { passive: true });
    heroImg.addEventListener('touchend',   function (e) {
      var dx = e.changedTouches[0].clientX - tx;
      if (Math.abs(dx) > 50) { goTo(dx < 0 ? cur + 1 : cur - 1); startAuto(); }
    }, { passive: true });
  }

  /* 초기 hero 이미지 세팅 */
  if (heroImg) heroImg.src = IMG_MAP['ko'].hero[0];
  startAuto();

  /* ==============================================
     이미지 교체 함수 (언어 전환 시 호출)
  ============================================== */
  function swapImages(l) {
    /* hero — 현재 슬라이드 인덱스 유지하면서 언어에 맞는 이미지로 교체 */
    if (heroImg) {
      heroImg.classList.add('fading');
      setTimeout(function () {
        heroImg.src = IMG_MAP[l].hero[cur];
        heroImg.classList.remove('fading');
      }, 300);
    }

    /* about 이미지 */
    var aboutImg = document.querySelector('.about-full-img');
    if (aboutImg) {
      aboutImg.classList.add('fading');
      setTimeout(function () {
        aboutImg.src = IMG_MAP[l].about;
        aboutImg.classList.remove('fading');
      }, 300);
    }

    /* why 이미지 */
    var whyImg = document.querySelector('.why-full-img');
    if (whyImg) {
      whyImg.classList.add('fading');
      setTimeout(function () {
        whyImg.src = IMG_MAP[l].why;
        whyImg.classList.remove('fading');
      }, 300);
    }

    /* banner 이미지 */
    var kakaoImg = document.querySelector('.contact-card.kakao img');
    if (kakaoImg) kakaoImg.src = IMG_MAP[l].banner[0];  // kakao → banner[0]

    var blogImg = document.querySelector('.contact-card.naver img');
    if (blogImg) blogImg.src = IMG_MAP[l].banner[1];    // blog → banner[1]
  }

  /* ==============================================
     LANGUAGE TOGGLE
  ============================================== */
  var langBtn = document.getElementById('lang-toggle');
  var langKo  = langBtn ? langBtn.querySelector('.lang-ko') : null;
  var langEn  = langBtn ? langBtn.querySelector('.lang-en') : null;

  function applyLang(l) {
    lang = l;

    /* 텍스트 교체 */
    document.querySelectorAll('[data-ko]').forEach(function (el) {
      var txt = l === 'ko' ? el.getAttribute('data-ko') : el.getAttribute('data-en');
      if (txt) el.innerHTML = txt;
    });

    /* 이미지 교체 */
    swapImages(l);

    /* 토글 버튼 상태 */
    if (langKo) langKo.classList.toggle('active', l === 'ko');
    if (langEn) langEn.classList.toggle('active', l === 'en');

    /* 모바일 버튼 */
    document.querySelectorAll('.mobile-lang button').forEach(function (b) {
      b.classList.toggle('active', b.dataset.lang === l);
    });

    document.documentElement.lang = l;
  }

  if (langBtn) langBtn.addEventListener('click', function () {
    applyLang(lang === 'ko' ? 'en' : 'ko');
  });

  /* ==============================================
     HEADER SCROLL
  ============================================== */
  /* 헤더는 항상 네이비 — scrolled 클래스는 그림자 강도만 조절 */
  var header = document.getElementById('site-header');
  function updateHeader() {
    if (header) header.classList.toggle('scrolled', window.scrollY > 50);
  }
  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();

  /* ==============================================
     MOBILE NAV
  ============================================== */
  var hamburger = document.getElementById('hamburger');
  var overlay   = document.createElement('div');
  var panel     = document.createElement('div');
  overlay.className = 'mobile-nav-overlay';
  panel.className   = 'mobile-nav-panel';
  document.body.appendChild(overlay);

  document.querySelectorAll('.main-nav a').forEach(function (link) {
    var a = document.createElement('a');
    a.href = link.getAttribute('href');
    a.setAttribute('data-ko', link.getAttribute('data-ko') || link.textContent);
    a.setAttribute('data-en', link.getAttribute('data-en') || link.textContent);
    a.textContent = link.getAttribute('data-ko') || link.textContent;
    a.addEventListener('click', closeNav);
    panel.appendChild(a);
  });
  var mlDiv = document.createElement('div');
  mlDiv.className = 'mobile-lang';
  ['ko','en'].forEach(function (l) {
    var b = document.createElement('button');
    b.textContent = l.toUpperCase(); b.dataset.lang = l;
    if (l === lang) b.classList.add('active');
    b.addEventListener('click', function () { applyLang(l); });
    mlDiv.appendChild(b);
  });
  panel.appendChild(mlDiv);
  document.body.appendChild(panel);

  function openNav()  {
    overlay.classList.add('open'); panel.classList.add('open');
    if (hamburger) hamburger.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeNav() {
    overlay.classList.remove('open'); panel.classList.remove('open');
    if (hamburger) hamburger.classList.remove('open');
    document.body.style.overflow = '';
  }
  if (hamburger) hamburger.addEventListener('click', function () {
    panel.classList.contains('open') ? closeNav() : openNav();
  });
  overlay.addEventListener('click', closeNav);

  /* ==============================================
     SMOOTH SCROLL
  ============================================== */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var t = document.querySelector(a.getAttribute('href'));
      if (t) {
        e.preventDefault();
        window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - 70, behavior: 'smooth' });
      }
    });
  });

  /* ==============================================
     SCROLL REVEAL
  ============================================== */
  document.querySelectorAll('.why-dark-text,.service-card,.broker-grid,.contact-channels,.contact-info-row').forEach(function (el, i) {
    el.classList.add('reveal');
    el.style.transitionDelay = (i % 4) * 0.08 + 's';
  });
  var ro = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('visible'); ro.unobserve(e.target); }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(function (el) { ro.observe(el); });

  /* ==============================================
     ACTIVE NAV
  ============================================== */
  var navLinks = document.querySelectorAll('.main-nav a');
  var sections = ['about','why','services','contact']
    .map(function(id){ return document.getElementById(id); })
    .filter(Boolean);
  var so = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        navLinks.forEach(function (a) {
          a.classList.toggle('nav-active', a.getAttribute('href') === '#' + e.target.id);
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  sections.forEach(function (s) { so.observe(s); });

})();
