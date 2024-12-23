/* public/assets/js/main.js */

document.addEventListener('DOMContentLoaded', () => {
  // Initialisation AOS
  if (typeof AOS !== 'undefined') {
    AOS.init({ duration: 800, easing: 'ease-in-out', once: true, mirror: false });
  }

  // Initialisation Swiper pour Portfolio
  let portfolioSwiper;
  if (typeof Swiper !== 'undefined') {
    portfolioSwiper = new Swiper('.portfolio-swiper', {
      slidesPerView: 3,
      spaceBetween: 20,
      loop: true,
      autoplay: { delay: 3000, disableOnInteraction: false },
      pagination: { el: '.portfolio-swiper .swiper-pagination', clickable: true },
      navigation: {
        nextEl: '.portfolio-swiper .swiper-button-next',
        prevEl: '.portfolio-swiper .swiper-button-prev',
      },
      breakpoints: {
        1024: { slidesPerView: 3 },
        768: { slidesPerView: 2 },
        480: { slidesPerView: 1 },
      },
    });

    // Initialisation Swiper pour Témoignages
    const testimonialsSwiper = new Swiper('.testimonials-swiper', {
      slidesPerView: 1,
      spaceBetween: 20,
      loop: true,
      autoplay: { delay: 5000, disableOnInteraction: false },
      pagination: { el: '.testimonials-swiper .swiper-pagination', clickable: true },
      navigation: {
        nextEl: '.testimonials-swiper .swiper-button-next',
        prevEl: '.testimonials-swiper .swiper-button-prev',
      },
    });
  }

  // Gestion du Formulaire de Contact avec EmailJS
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Vérification des champs
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const message = document.getElementById('message').value.trim();

      if (!name || !email || !message) {
        alert('Veuillez remplir tous les champs.');
        return;
      }

      // Envoi du formulaire via EmailJS
      emailjs.sendForm('service_v60hg29', 'template_ekdr0iw', form)
        .then((response) => {
          console.log('SUCCESS!', response.status, response.text);
          alert('Merci pour votre message ! Je vous recontacterai bientôt.');
          form.reset();
        }, (error) => {
          console.error('FAILED...', error);
          alert('Erreur lors de l\'envoi du message. Veuillez réessayer.');
        });
    });
  }

  // Gestion du Menu Hamburger
  const hamburger = document.querySelector('.hamburger');
  const navUl = document.querySelector('.nav ul');
  if (hamburger && navUl) {
    hamburger.addEventListener('click', () => {
      navUl.classList.toggle('active');
      hamburger.classList.toggle('active');
      const expanded = hamburger.classList.contains('active');
      hamburger.setAttribute('aria-expanded', expanded);
      hamburger.setAttribute('aria-label', expanded ? 'Fermer le menu' : 'Ouvrir le menu');
    });
  }

  // Navigation avec Smooth Scroll
  const links = document.querySelectorAll('a[href^="#"]');
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        const headerOffset = document.querySelector('.header').offsetHeight;
        const offsetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerOffset - 20;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        if (navUl.classList.contains('active')) {
          navUl.classList.remove('active');
          hamburger.classList.remove('active');
          hamburger.setAttribute('aria-expanded', 'false');
        }
      }
    });
  });

  // Effet de Scroll sur le Header et Bouton Retour en Haut
  const header = document.querySelector('.header');
  const scrollToTopBtn = document.getElementById('scrollToTopBtn');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    if (typeof gsap !== 'undefined') {
      if (window.scrollY > 300) {
        scrollToTopBtn.style.display = 'flex';
        gsap.to(scrollToTopBtn, { opacity: 1, duration: 0.5 });
      } else {
        gsap.to(scrollToTopBtn, { opacity: 0, duration: 0.5, onComplete: () => {
          scrollToTopBtn.style.display = 'none';
        }});
      }
    } else {
      scrollToTopBtn.style.display = (window.scrollY > 300) ? 'flex' : 'none';
    }
  });

  if (scrollToTopBtn) {
    scrollToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Filtrage du Portfolio avec Animations GSAP
  const filterButtons = document.querySelectorAll('.filter-btn, .landscape-btn, .portrait-btn, .architecture-btn, .events-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      const filter = button.getAttribute('data-filter');
      if (portfolioSwiper) {
        portfolioSwiper.slideToLoop(0);
      }
      galleryItems.forEach(item => {
        if (filter === 'all' || item.getAttribute('data-category') === filter) {
          item.style.display = 'block';
          if (typeof gsap !== 'undefined') {
            gsap.to(item, { opacity: 1, scale: 1, duration: 0.5, delay: 0.1 });
          }
        } else {
          if (typeof gsap !== 'undefined') {
            gsap.to(item, { opacity: 0, scale: 0.95, duration: 0.3, onComplete: () => {
              item.style.display = 'none';
            }});
          } else {
            item.style.display = 'none';
          }
        }
      });
    });
  });

  // Galerie d'Images avec Modal et Animations GSAP
  const modal = document.getElementById('image-modal');
  const modalImg = document.getElementById('modal-img');
  const captionText = document.getElementById('caption');
  const closeModal = document.querySelector('.close');
  const prevBtn = document.querySelector('.prev');
  const nextBtn = document.querySelector('.next');
  const galleryImages = Array.from(document.querySelectorAll('.gallery-item img'));
  let currentImageIndex = 0;

  function openModal(src, alt) {
    modal.style.display = 'block';
    modalImg.src = src;
    captionText.innerHTML = alt;
    if (typeof gsap !== 'undefined') {
      gsap.fromTo(modalImg, { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.5 });
    }
    modal.setAttribute('aria-hidden', 'false');
  }

  function closeModalFunction() {
    if (typeof gsap !== 'undefined') {
      gsap.to(modalImg, { opacity: 0, scale: 0.8, duration: 0.5, onComplete: () => {
        modal.style.display = 'none';
        modal.setAttribute('aria-hidden', 'true');
      }});
    } else {
      modal.style.display = 'none';
      modal.setAttribute('aria-hidden', 'true');
    }
  }

  function showNextImage() {
    currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
    const nextImg = galleryImages[currentImageIndex];
    modalImg.src = nextImg.src;
    captionText.innerHTML = nextImg.alt;
    if (typeof gsap !== 'undefined') {
      gsap.fromTo(modalImg, { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.5 });
    }
  }

  function showPrevImage() {
    currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
    const prevImg = galleryImages[currentImageIndex];
    modalImg.src = prevImg.src;
    captionText.innerHTML = prevImg.alt;
    if (typeof gsap !== 'undefined') {
      gsap.fromTo(modalImg, { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.5 });
    }
  }

  galleryImages.forEach((img, index) => {
    img.addEventListener('click', () => {
      currentImageIndex = index;
      openModal(img.src, img.alt);
    });
  });

  if (closeModal) {
    closeModal.addEventListener('click', closeModalFunction);
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', showNextImage);
  }
  if (prevBtn) {
    prevBtn.addEventListener('click', showPrevImage);
  }
  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModalFunction();
    }
  });
  document.addEventListener('keydown', (event) => {
    if (modal.style.display === 'block') {
      if (event.key === 'ArrowRight') {
        showNextImage();
      } else if (event.key === 'ArrowLeft') {
        showPrevImage();
      } else if (event.key === 'Escape') {
        closeModalFunction();
      }
    }
  });

  // Animations GSAP pour la section Hero
  if (typeof gsap !== 'undefined') {
    gsap.from('.hero-content h2', { duration: 1, y: -50, opacity: 0, ease: "power2.out" });
    gsap.from('.hero-content p', { duration: 1, y: 50, opacity: 0, delay: 0.5, ease: "power2.out" });
    gsap.from('.hero-content .btn', { duration: 1, scale: 0.8, opacity: 0, delay: 1, ease: "power2.out" });
  }

  /* Theme Toggle */
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('light');
      themeToggle.classList.toggle('active');
      const sunIcon = themeToggle.querySelector('.fa-sun');
      const moonIcon = themeToggle.querySelector('.fa-moon');
      if (document.body.classList.contains('light')) {
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'block';
        // Animation avec GSAP (facultatif)
        if (typeof gsap !== 'undefined') {
          gsap.to('.header', { backgroundColor: 'rgba(255, 255, 255, 0.95)', duration: 0.5 });
        }
      } else {
        sunIcon.style.display = 'block';
        moonIcon.style.display = 'none';
        // Animation avec GSAP (facultatif)
        if (typeof gsap !== 'undefined') {
          gsap.to('.header', { backgroundColor: 'rgba(0, 0, 0, 0.95)', duration: 0.5 });
        }
      }
    });

    document.getElementById('portfolio-link').addEventListener('click', function(event) {
      // Empêcher le comportement par défaut du lien
      event.preventDefault();
  
      // Défilement vers l'ancre #portfolio
      const portfolioSection = document.getElementById('portfolio');
      if (portfolioSection) {
        portfolioSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
  
      // Ouvrir l'URL externe dans un nouvel onglet
      window.open('https://sthdpixs.myportfolio.com/work', '_blank');
    });

    // Initialisation du thème en fonction des préférences de l'utilisateur
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      // Default to dark mode
      document.body.classList.remove('light');
      themeToggle.classList.remove('active');
      const sunIcon = themeToggle.querySelector('.fa-sun');
      const moonIcon = themeToggle.querySelector('.fa-moon');
      sunIcon.style.display = 'block';
      moonIcon.style.display = 'none';
      if (typeof gsap !== 'undefined') {
        gsap.to('.header', { backgroundColor: 'rgba(0, 0, 0, 0.95)', duration: 0.5 });
      }
    } else {
      // Default to light mode
      document.body.classList.add('light');
      themeToggle.classList.add('active');
      const sunIcon = themeToggle.querySelector('.fa-sun');
      const moonIcon = themeToggle.querySelector('.fa-moon');
      sunIcon.style.display = 'none';
      moonIcon.style.display = 'block';
      if (typeof gsap !== 'undefined') {
        gsap.to('.header', { backgroundColor: 'rgba(255, 255, 255, 0.95)', duration: 0.5 });
      }
    }
  }
});