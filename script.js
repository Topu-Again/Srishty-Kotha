/**
 * SRISHTYKOTHA — FULL INTERACTION ENGINE
 * Features: Smart Scroll Inactivity Timer, Drawer Nav, Custom Cursor, Gallery Filter & Lightbox
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // --- GLOBAL STATE ---
  const state = {
    currentImageIndex: 0,
    galleryItems: [],
    testimonialIndex: 0,
    cursorPos: { x: 0, y: 0 },
    mousePos: { x: 0, y: 0 },
    scrollTimer: null
  };

  // --- DOM SELECTORS ---
  const cursor = document.getElementById('cursor');
  const cursorText = document.getElementById('cursor-text');
  const header = document.getElementById('main-header');
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navBackdrop = document.getElementById('nav-backdrop');
  const btnNavCta = document.querySelector('.btn-nav-cta');
  const filterBtns = document.querySelectorAll('.filter-btn');

  // Lightbox
  const lightbox = document.getElementById('lightbox');
  const lightboxOverlay = document.getElementById('lightbox-overlay');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');
  const lbCategory = document.getElementById('lb-category');
  const lbTitle = document.getElementById('lb-title');
  const lbYear = document.getElementById('lb-year');

  // Testimonials
  const slides = document.querySelectorAll('.testimonial-slide');
  const slidePrev = document.getElementById('slide-prev');
  const slideNext = document.getElementById('slide-next');
  const dotsContainer = document.getElementById('slider-dots');

  // --- 1. SMART SCROLL INACTIVITY TIMER (ATTENTION SYSTEM) ---
  const INACTIVITY_DELAY = 2500; // Trigger gentle glow after 2.5s stationary

  function enableAttentionHighlight() {
    if (btnNavCta) btnNavCta.classList.add('is-attention-needed');
    if (mobileToggle) mobileToggle.classList.add('is-attention-needed');
  }

  function disableAttentionHighlight() {
    if (btnNavCta) btnNavCta.classList.remove('is-attention-needed');
    if (mobileToggle) mobileToggle.classList.remove('is-attention-needed');
  }

  function handleScrollInactivity() {
    disableAttentionHighlight();
    clearTimeout(state.scrollTimer);
    state.scrollTimer = setTimeout(enableAttentionHighlight, INACTIVITY_DELAY);
  }

  window.addEventListener('scroll', handleScrollInactivity, { passive: true });
  state.scrollTimer = setTimeout(enableAttentionHighlight, INACTIVITY_DELAY);

  // --- 2. HEADER SCROLL COMPACT ---
  window.addEventListener('scroll', () => {
    header.classList.toggle('is-scrolled', window.scrollY > 40);
  }, { passive: true });

  // --- 3. MOBILE MENU DRAWER ---
  function toggleMobileMenu(open) {
    const shouldOpen = open !== undefined ? open : !navMenu.classList.contains('is-open');
    navMenu.classList.toggle('is-open', shouldOpen);
    navBackdrop.classList.toggle('is-open', shouldOpen);
    mobileToggle.classList.toggle('is-active', shouldOpen);
    mobileToggle.setAttribute('aria-expanded', shouldOpen ? 'true' : 'false');
    document.body.style.overflow = shouldOpen ? 'hidden' : '';

    if (shouldOpen) disableAttentionHighlight();
  }

  if (mobileToggle) mobileToggle.addEventListener('click', () => toggleMobileMenu());
  if (navBackdrop) navBackdrop.addEventListener('click', () => toggleMobileMenu(false));

  // --- 4. GALLERY DATA & LIGHTBOX ---
  const rawItems = document.querySelectorAll('.gallery-item');
  rawItems.forEach((item, idx) => {
    const card = item.querySelector('.gallery-card');
    const img = item.querySelector('img');
    const title = item.querySelector('.item-title').textContent;
    const category = item.querySelector('.item-category').textContent;
    const year = item.querySelector('.item-year').textContent;

    state.galleryItems.push({
      element: item,
      src: img.src,
      alt: img.alt,
      title,
      category,
      year,
      index: idx
    });

    card.addEventListener('click', () => openLightbox(idx));
  });

  function openLightbox(index) {
    state.currentImageIndex = index;
    updateLightbox();
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function updateLightbox() {
    const item = state.galleryItems[state.currentImageIndex];
    lightboxImg.src = item.src;
    lightboxImg.alt = item.alt;
    lbCategory.textContent = item.category;
    lbTitle.textContent = item.title;
    lbYear.textContent = item.year;
  }

  function nextImage() {
    state.currentImageIndex = (state.currentImageIndex + 1) % state.galleryItems.length;
    updateLightbox();
  }

  function prevImage() {
    state.currentImageIndex = (state.currentImageIndex - 1 + state.galleryItems.length) % state.galleryItems.length;
    updateLightbox();
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxOverlay) lightboxOverlay.addEventListener('click', closeLightbox);
  if (lightboxNext) lightboxNext.addEventListener('click', nextImage);
  if (lightboxPrev) lightboxPrev.addEventListener('click', prevImage);

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('is-open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
  });

  // --- 5. CATEGORY FILTERING ---
  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => {
        b.classList.remove('is-active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('is-active');
      btn.setAttribute('aria-selected', 'true');

      const filter = btn.getAttribute('data-filter');

      state.galleryItems.forEach((item) => {
        const cat = item.element.getAttribute('data-category');
        if (filter === 'all' || filter === cat) {
          item.element.classList.remove('is-hidden');
          item.element.style.opacity = '1';
          item.element.style.transform = 'translateY(0)';
        } else {
          item.element.style.opacity = '0';
          item.element.style.transform = 'translateY(16px)';
          setTimeout(() => item.element.classList.add('is-hidden'), 300);
        }
      });
    });
  });

  // --- 6. MAGNETIC CURSOR ---
  if (cursor && window.matchMedia('(pointer: fine)').matches) {
    window.addEventListener('mousemove', (e) => {
      state.mousePos.x = e.clientX;
      state.mousePos.y = e.clientY;
    });

    const renderCursor = () => {
      state.cursorPos.x += (state.mousePos.x - state.cursorPos.x) * 0.15;
      state.cursorPos.y += (state.mousePos.y - state.cursorPos.y) * 0.15;
      cursor.style.transform = `translate3d(${state.cursorPos.x}px, ${state.cursorPos.y}px, 0)`;
      requestAnimationFrame(renderCursor);
    };
    requestAnimationFrame(renderCursor);

    document.querySelectorAll('[data-cursor]').forEach((el) => {
      el.addEventListener('mouseenter', () => {
        const type = el.getAttribute('data-cursor');
        if (type === 'view') {
          cursor.classList.add('is-view');
          cursorText.textContent = 'View';
        } else {
          cursor.classList.add('is-hovered');
        }
      });

      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('is-hovered', 'is-view');
        cursorText.textContent = '';
      });
    });
  }

  // --- 7. TESTIMONIAL SLIDER ---
  if (slides.length > 0) {
    slides.forEach((_, idx) => {
      const dot = document.createElement('div');
      dot.classList.add('dot');
      if (idx === 0) dot.classList.add('is-active');
      dot.addEventListener('click', () => goToSlide(idx));
      dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll('.dot');

    function goToSlide(index) {
      slides[state.testimonialIndex].classList.remove('is-active');
      dots[state.testimonialIndex].classList.remove('is-active');

      state.testimonialIndex = index;

      slides[state.testimonialIndex].classList.add('is-active');
      dots[state.testimonialIndex].classList.add('is-active');
    }

    if (slideNext) slideNext.addEventListener('click', () => goToSlide((state.testimonialIndex + 1) % slides.length));
    if (slidePrev) slidePrev.addEventListener('click', () => goToSlide((state.testimonialIndex - 1 + slides.length) % slides.length));
  }

  // --- 8. SMOOTH SCROLL ---
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        toggleMobileMenu(false);
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
});