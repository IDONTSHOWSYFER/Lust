/* ==========================================================================
   ESTEBAN LUIZ — Portfolio JS
   Vanilla, zero dependencies (except EmailJS on /contact)
   ========================================================================== */

(function () {
  'use strict';

  /* ----------------------------------------------------------------------
     1. Header — scrolled state
     ---------------------------------------------------------------------- */
  const header = document.getElementById('header');
  if (header) {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          header.classList.toggle('header--scrolled', window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ----------------------------------------------------------------------
     2. Mobile navigation
     ---------------------------------------------------------------------- */
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobile-nav');
  if (hamburger && mobileNav) {
    const toggleNav = (open) => {
      const isOpen = open ?? !mobileNav.classList.contains('nav-mobile--active');
      mobileNav.classList.toggle('nav-mobile--active', isOpen);
      hamburger.classList.toggle('hamburger--active', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen);
      mobileNav.setAttribute('aria-hidden', !isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    };
    hamburger.addEventListener('click', () => toggleNav());
    mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => toggleNav(false)));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileNav.classList.contains('nav-mobile--active')) toggleNav(false);
    });
  }

  /* ----------------------------------------------------------------------
     3. Reveal on scroll — IntersectionObserver
     ---------------------------------------------------------------------- */
  const reveals = document.querySelectorAll('.reveal, .img-reveal');
  if (reveals.length && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (entry.target.classList.contains('img-reveal')) {
            entry.target.classList.add('img-reveal--visible');
          }
          if (entry.target.classList.contains('reveal')) {
            entry.target.classList.add('reveal--visible');
          }
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    reveals.forEach(el => io.observe(el));
  } else {
    reveals.forEach(el => {
      el.classList.add('reveal--visible');
      el.classList.add('img-reveal--visible');
    });
  }

  /* ----------------------------------------------------------------------
     4. Hero title — line reveal
     ---------------------------------------------------------------------- */
  const heroLines = document.querySelectorAll('.hero__title .line__inner');
  const heroSub = document.querySelector('.hero__sub');
  const heroCta = document.querySelector('.hero__cta');
  const heroOver = document.querySelector('.hero__overtitle');
  if (heroLines.length) {
    heroLines.forEach((el, i) => {
      el.style.transform = 'translateY(110%)';
      el.style.transition = 'transform 0.9s cubic-bezier(0.16,1,0.3,1)';
      el.style.transitionDelay = `${0.1 + i * 0.12}s`;
    });
    requestAnimationFrame(() => {
      heroLines.forEach(el => { el.style.transform = 'translateY(0)'; });
    });
  }
  if (heroOver) {
    heroOver.style.opacity = '0';
    heroOver.style.transition = 'opacity 0.7s ease';
    requestAnimationFrame(() => { heroOver.style.opacity = '1'; });
  }
  if (heroSub) {
    heroSub.style.opacity = '0';
    heroSub.style.transform = 'translateY(20px)';
    heroSub.style.transition = 'opacity 0.8s ease 0.5s, transform 0.8s cubic-bezier(0.16,1,0.3,1) 0.5s';
    requestAnimationFrame(() => { heroSub.style.opacity = '1'; heroSub.style.transform = 'translateY(0)'; });
  }
  if (heroCta) {
    heroCta.style.opacity = '0';
    heroCta.style.transform = 'translateY(20px)';
    heroCta.style.transition = 'opacity 0.8s ease 0.7s, transform 0.8s cubic-bezier(0.16,1,0.3,1) 0.7s, background 0.4s, color 0.4s, border-color 0.4s';
    requestAnimationFrame(() => { heroCta.style.opacity = '1'; heroCta.style.transform = 'translateY(0)'; });
  }

  /* ----------------------------------------------------------------------
     5. Animated counters
     ---------------------------------------------------------------------- */
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length && 'IntersectionObserver' in window) {
    const counterIO = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.count, 10);
          const duration = 1800;
          const start = performance.now();
          const tick = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(eased * target);
            if (progress < 1) requestAnimationFrame(tick);
            else el.textContent = target;
          };
          requestAnimationFrame(tick);
          counterIO.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(el => counterIO.observe(el));
  }

  /* ----------------------------------------------------------------------
     6. Portfolio filters
     ---------------------------------------------------------------------- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const grid = document.getElementById('portfolio-grid');
  if (filterBtns.length && grid) {
    const items = Array.from(grid.querySelectorAll('[data-category]'));
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('filter-btn--active'));
        btn.classList.add('filter-btn--active');
        const filter = btn.dataset.filter;
        items.forEach(item => {
          const match = filter === 'all' || item.dataset.category === filter;
          if (match) {
            item.style.display = '';
            requestAnimationFrame(() => {
              item.style.opacity = '1';
              item.style.transform = 'translateY(0)';
            });
          } else {
            item.style.opacity = '0';
            item.style.transform = 'translateY(8px)';
            setTimeout(() => { item.style.display = 'none'; }, 300);
          }
        });
        // Update lightbox total based on visible items
        updateLightboxList();
      });
    });
    items.forEach(item => {
      item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    });
  }

  /* ----------------------------------------------------------------------
     7. Lightbox
     ---------------------------------------------------------------------- */
  const lightbox = document.getElementById('lightbox');
  const lbImg = document.getElementById('lightbox-img');
  const lbCurrent = document.getElementById('lb-current');
  const lbTotal = document.getElementById('lb-total');
  let lbList = [];
  let lbIndex = 0;

  const updateLightboxList = () => {
    lbList = Array.from(document.querySelectorAll('[data-lightbox]'))
      .filter(el => el.offsetParent !== null)
      .map(el => {
        const img = el.querySelector('img');
        return img ? { src: img.src, alt: img.alt } : null;
      })
      .filter(Boolean);
    if (lbTotal) lbTotal.textContent = lbList.length;
  };

  const openLightbox = (index) => {
    if (!lightbox || !lbImg || !lbList.length) return;
    lbIndex = index;
    lbImg.src = lbList[lbIndex].src;
    lbImg.alt = lbList[lbIndex].alt;
    if (lbCurrent) lbCurrent.textContent = lbIndex + 1;
    lightbox.classList.add('lightbox--active');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    if (!lightbox) return;
    lightbox.classList.remove('lightbox--active');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  const navLightbox = (dir) => {
    if (!lbList.length) return;
    lbIndex = (lbIndex + dir + lbList.length) % lbList.length;
    lbImg.style.opacity = '0';
    setTimeout(() => {
      lbImg.src = lbList[lbIndex].src;
      lbImg.alt = lbList[lbIndex].alt;
      if (lbCurrent) lbCurrent.textContent = lbIndex + 1;
      lbImg.style.opacity = '1';
    }, 150);
  };

  if (lightbox) {
    updateLightboxList();
    document.querySelectorAll('[data-lightbox]').forEach((el) => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        updateLightboxList();
        const img = el.querySelector('img');
        if (!img) return;
        const idx = lbList.findIndex(item => item.src === img.src);
        if (idx >= 0) openLightbox(idx);
      });
    });
    lightbox.querySelector('.lightbox__close')?.addEventListener('click', closeLightbox);
    lightbox.querySelector('.lightbox__prev')?.addEventListener('click', () => navLightbox(-1));
    lightbox.querySelector('.lightbox__next')?.addEventListener('click', () => navLightbox(1));
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox || e.target.classList.contains('lightbox__img-wrap')) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('lightbox--active')) return;
      if (e.key === 'Escape') closeLightbox();
      else if (e.key === 'ArrowRight') navLightbox(1);
      else if (e.key === 'ArrowLeft') navLightbox(-1);
    });
    lbImg.style.transition = 'opacity 0.25s ease';
  }

  /* ----------------------------------------------------------------------
     8. Testimonials slider
     ---------------------------------------------------------------------- */
  const slides = document.querySelectorAll('.testimonial-slide');
  const testPrev = document.getElementById('test-prev');
  const testNext = document.getElementById('test-next');
  const testCurrent = document.getElementById('test-current');
  const testTotal = document.getElementById('test-total');
  if (slides.length && testPrev && testNext) {
    let testIdx = 0;
    if (testTotal) testTotal.textContent = String(slides.length).padStart(2, '0');
    const showSlide = (i) => {
      slides.forEach((s, idx) => s.classList.toggle('testimonial-slide--active', idx === i));
      if (testCurrent) testCurrent.textContent = String(i + 1).padStart(2, '0');
    };
    testPrev.addEventListener('click', () => {
      testIdx = (testIdx - 1 + slides.length) % slides.length;
      showSlide(testIdx);
    });
    testNext.addEventListener('click', () => {
      testIdx = (testIdx + 1) % slides.length;
      showSlide(testIdx);
    });
    // Auto-advance every 6s
    let auto = setInterval(() => {
      testIdx = (testIdx + 1) % slides.length;
      showSlide(testIdx);
    }, 6000);
    [testPrev, testNext].forEach(b => b.addEventListener('click', () => {
      clearInterval(auto);
    }));
  }

  /* ----------------------------------------------------------------------
     9. Smooth back-to-top
     ---------------------------------------------------------------------- */
  const backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    backToTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ----------------------------------------------------------------------
     10. Contact form — EmailJS
     ---------------------------------------------------------------------- */
  const form = document.getElementById('contact-form');
  if (form) {
    const submitBtn = document.getElementById('form-submit');
    const feedback = document.getElementById('form-feedback');

    const initEmailJS = () => {
      if (typeof emailjs !== 'undefined') {
        try { emailjs.init('cgjiLXg6Si4G14GEb'); } catch (e) {}
        return true;
      }
      return false;
    };

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = form.querySelector('#contact-name').value.trim();
      const email = form.querySelector('#contact-email').value.trim();
      const message = form.querySelector('#contact-message').value.trim();

      if (!name || !email || !message) {
        feedback.className = 'form__feedback form__feedback--error';
        feedback.textContent = 'Veuillez remplir tous les champs obligatoires.';
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        feedback.className = 'form__feedback form__feedback--error';
        feedback.textContent = 'Veuillez entrer une adresse email valide.';
        return;
      }

      submitBtn.disabled = true;
      submitBtn.querySelector('span').textContent = 'Envoi en cours...';

      const send = () => {
        emailjs.sendForm('service_v60hg29', 'template_ekdr0iw', form)
          .then(() => {
            window.location.href = 'merci.html';
          })
          .catch(() => {
            feedback.className = 'form__feedback form__feedback--error';
            feedback.textContent = "Une erreur est survenue. Veuillez réessayer ou m'écrire directement.";
            submitBtn.disabled = false;
            submitBtn.querySelector('span').textContent = 'Envoyer le message';
          });
      };

      if (initEmailJS()) {
        send();
      } else {
        // Wait for emailjs to load
        let tries = 0;
        const wait = setInterval(() => {
          tries++;
          if (initEmailJS()) { clearInterval(wait); send(); }
          else if (tries > 30) {
            clearInterval(wait);
            feedback.className = 'form__feedback form__feedback--error';
            feedback.textContent = "Service indisponible. Écrivez-moi directement à estebanluizantonio@gmail.com";
            submitBtn.disabled = false;
            submitBtn.querySelector('span').textContent = 'Envoyer le message';
          }
        }, 100);
      }
    });
  }

})();
