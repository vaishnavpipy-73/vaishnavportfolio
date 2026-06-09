/* ==========================================================================
   INITIALIZATION & UTILITIES
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // Detect Touch Device to disable custom cursor and adjust features
  const isTouchDevice = () => {
    return (('ontouchstart' in window) ||
      (navigator.maxTouchPoints > 0) ||
      (navigator.msMaxTouchPoints > 0));
  };

  if (isTouchDevice()) {
    document.body.classList.add('touch-device');
  }

  /* ==========================================================================
     MOBILE NAVIGATION TOGGLE
     ========================================================================== */
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('open');
      navMenu.classList.toggle('open');
    });

    // Close menu when a link is clicked
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('open');
        navMenu.classList.remove('open');
      });
    });
  }

  /* ==========================================================================
     CUSTOM CURSOR (DESKTOP)
     ========================================================================== */
  const customCursor = document.getElementById('customCursor');
  const customCursorGlow = document.getElementById('customCursorGlow');

  if (customCursor && customCursorGlow && !isTouchDevice()) {
    let mouseX = 0, mouseY = 0;
    let posX = 0, posY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      // Instantly position the small dot
      customCursor.style.left = `${mouseX}px`;
      customCursor.style.top = `${mouseY}px`;
    });

    // Smoothly animate the outer glow (lerping)
    const animateCursor = () => {
      const lerpFactor = 0.12;
      posX += (mouseX - posX) * lerpFactor;
      posY += (mouseY - posY) * lerpFactor;

      customCursorGlow.style.left = `${posX}px`;
      customCursorGlow.style.top = `${posY}px`;

      requestAnimationFrame(animateCursor);
    };
    animateCursor();

    // Hover states for links and buttons
    const hoverElements = document.querySelectorAll('.text-hover, a, button, input, textarea, .project-card, .skills-card');
    hoverElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        document.body.classList.add('cursor-hover');
      });
      el.addEventListener('mouseleave', () => {
        document.body.classList.remove('cursor-hover');
      });
    });
  }

  /* ==========================================================================
     LENIS SMOOTH SCROLLING
     ========================================================================== */
  let lenisInstance = null;
  if (typeof Lenis !== 'undefined') {
    lenisInstance = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    const scrollFn = (time) => {
      lenisInstance.raf(time);
      requestAnimationFrame(scrollFn);
    };
    requestAnimationFrame(scrollFn);

    // Sync Lenis scroll updates with GSAP ScrollTrigger
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      lenisInstance.on('scroll', ScrollTrigger.update);

      gsap.ticker.add((time) => {
        lenisInstance.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    }
  }

  /* ==========================================================================
     HERO ORBIT PARTICLES
     ========================================================================== */
  const particleEmitter = document.getElementById('particleEmitter');
  if (particleEmitter) {
    const particleCount = 20;
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.classList.add('emitter-particle');
      
      // Random initial position inside the graphic container
      const size = Math.random() * 3 + 1;
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 100 + 40;
      const x = Math.cos(angle) * radius + 160;
      const y = Math.sin(angle) * radius + 160;

      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;
      particle.style.opacity = Math.random() * 0.5 + 0.1;
      
      particleEmitter.appendChild(particle);

      // Simple GSAP orbit animation if GSAP is available
      if (typeof gsap !== 'undefined') {
        gsap.to(particle, {
          x: `+=${Math.sin(angle) * 30}`,
          y: `+=${Math.cos(angle) * -30}`,
          opacity: Math.random() * 0.8 + 0.2,
          duration: Math.random() * 3 + 2,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut'
        });
      }
    }
  }

  /* ==========================================================================
     INTERACTIVE BACKGROUND ORBS
     ========================================================================== */
  const orb1 = document.getElementById('orb1');
  const orb2 = document.getElementById('orb2');
  const orb3 = document.getElementById('orb3');

  if (typeof gsap !== 'undefined' && (orb1 || orb2 || orb3)) {
    // Ambient floating animations
    gsap.to(orb1, {
      x: '+=60',
      y: '+=80',
      duration: 8,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });
    gsap.to(orb2, {
      x: '-=50',
      y: '+=100',
      duration: 10,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });
    gsap.to(orb3, {
      x: '+=70',
      y: '-=60',
      duration: 12,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });

    // Parallax effect on mouse movement (Desktop only)
    if (!isTouchDevice()) {
      document.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;

        gsap.to(orb1, {
          x: (mouseX - 0.5) * 80,
          y: (mouseY - 0.5) * 80,
          duration: 1.5,
          ease: 'power2.out',
          overwrite: 'auto'
        });
        gsap.to(orb2, {
          x: (mouseX - 0.5) * -70,
          y: (mouseY - 0.5) * 70,
          duration: 1.5,
          ease: 'power2.out',
          overwrite: 'auto'
        });
        gsap.to(orb3, {
          x: (mouseX - 0.5) * 90,
          y: (mouseY - 0.5) * -90,
          duration: 1.5,
          ease: 'power2.out',
          overwrite: 'auto'
        });
      });
    }
  }

  /* ==========================================================================
     MAGNETIC BUTTONS INTERACTION
     ========================================================================== */
  if (typeof gsap !== 'undefined' && !isTouchDevice()) {
    const magneticBtns = document.querySelectorAll('.btn-magnetic');
    
    magneticBtns.forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        gsap.to(btn, {
          x: x * 0.35,
          y: y * 0.35,
          scale: 1.02,
          duration: 0.3,
          ease: 'power2.out'
        });
        
        // Slightly pull internal content
        const span = btn.querySelector('span');
        const icon = btn.querySelector('i');
        if (span) {
          gsap.to(span, {
            x: x * 0.15,
            y: y * 0.15,
            duration: 0.3,
            ease: 'power2.out'
          });
        }
        if (icon) {
          gsap.to(icon, {
            x: x * 0.2,
            y: y * 0.2,
            duration: 0.3,
            ease: 'power2.out'
          });
        }
      });

      btn.addEventListener('mouseleave', () => {
        gsap.to(btn, {
          x: 0,
          y: 0,
          scale: 1,
          duration: 0.5,
          ease: 'elastic.out(1, 0.3)'
        });
        
        const span = btn.querySelector('span');
        const icon = btn.querySelector('i');
        if (span) gsap.to(span, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.3)' });
        if (icon) gsap.to(icon, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.3)' });
      });
    });
  }

  /* ==========================================================================
     PRELOADER & PAGE REVEAL SEQUENCE
     ========================================================================== */
  const preloader = document.getElementById('preloader');
  const progressBar = document.getElementById('progressBar');
  const progressPercentage = document.getElementById('progressPercentage');

  if (preloader && progressBar && progressPercentage) {
    let progress = 0;
    const duration = 1500; // 1.5 seconds loading time simulation
    const intervalTime = 30;
    const step = 100 / (duration / intervalTime);

    const updateLoader = setInterval(() => {
      progress += step;
      if (progress >= 100) {
        progress = 100;
        clearInterval(updateLoader);
        
        // Loading complete, start reveal sequence
        setTimeout(revealPage, 200);
      }
      
      const displayVal = Math.floor(progress);
      progressBar.style.width = `${displayVal}%`;
      progressPercentage.innerText = `${displayVal}%`;
    }, intervalTime);
  } else {
    // If no preloader elements, directly setup scroll reveals
    setupScrollReveals();
  }

  const revealPage = () => {
    if (typeof gsap !== 'undefined') {
      const tl = gsap.timeline();
      
      // Fade out preloader
      tl.to(preloader, {
        opacity: 0,
        pointerEvents: 'none',
        duration: 0.8,
        ease: 'power3.inOut'
      });
      
      // Hide preloader element
      tl.set(preloader, { display: 'none' });
      
      // Trigger animations for Hero content
      tl.fromTo('.hero-badge', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.3');
      tl.fromTo('.hero-title', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.5');
      tl.fromTo('.hero-subheadline', { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.6, ease: 'power2.out' }, '-=0.5');
      tl.fromTo('.hero-description', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.5');
      tl.fromTo('.hero-actions', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.5');
      tl.fromTo('.hero-socials', { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.4');
      tl.fromTo('.hero-graphic-core', { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 1, ease: 'power2.out' }, '-=1');
      
      // Setup the rest of scroll-triggered animations
      tl.add(() => {
        setupScrollReveals();
      });
    } else {
      // Fallback display if GSAP fails to load
      if (preloader) preloader.style.display = 'none';
    }
  };

  /* ==========================================================================
     GSAP SCROLLTRIGGER REVEALS
     ========================================================================== */
  function setupScrollReveals() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    // Section title reveals
    const headers = document.querySelectorAll('.section-header');
    headers.forEach(header => {
      gsap.from(header, {
        scrollTrigger: {
          trigger: header,
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: 'power2.out'
      });
    });

    // About section fade-in
    const aboutCard = document.querySelector('.about-text-card');
    if (aboutCard) {
      gsap.from(aboutCard, {
        scrollTrigger: {
          trigger: aboutCard,
          start: 'top 80%',
          toggleActions: 'play none none none'
        },
        opacity: 0,
        y: 40,
        duration: 1,
        ease: 'power3.out'
      });
    }

    // Skills grid item reveals (staggered)
    const skillCards = document.querySelectorAll('.skills-card');
    if (skillCards.length > 0) {
      gsap.from(skillCards, {
        scrollTrigger: {
          trigger: '.skills-grid',
          start: 'top 80%',
          toggleActions: 'play none none none'
        },
        opacity: 0,
        y: 40,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power2.out'
      });
    }

    // Featured Projects cards reveals (staggered)
    const projectCards = document.querySelectorAll('.project-card');
    if (projectCards.length > 0) {
      gsap.from(projectCards, {
        scrollTrigger: {
          trigger: '.projects-grid',
          start: 'top 80%',
          toggleActions: 'play none none none'
        },
        opacity: 0,
        y: 50,
        duration: 0.9,
        stagger: 0.2,
        ease: 'power2.out'
      });
    }

    // TechNext dedicated card show
    const technextCard = document.querySelector('.technext-card');
    if (technextCard) {
      gsap.from(technextCard, {
        scrollTrigger: {
          trigger: technextCard,
          start: 'top 80%',
          toggleActions: 'play none none none'
        },
        opacity: 0,
        y: 50,
        duration: 1,
        ease: 'power3.out'
      });
    }

    // Contact sections reveal
    const contactInfo = document.querySelector('.contact-info');
    const contactForm = document.querySelector('.contact-form-container');
    if (contactInfo && contactForm) {
      gsap.from(contactInfo, {
        scrollTrigger: {
          trigger: '.contact-grid',
          start: 'top 80%',
          toggleActions: 'play none none none'
        },
        opacity: 0,
        x: -40,
        duration: 0.8,
        ease: 'power2.out'
      });
      gsap.from(contactForm, {
        scrollTrigger: {
          trigger: '.contact-grid',
          start: 'top 80%',
          toggleActions: 'play none none none'
        },
        opacity: 0,
        x: 40,
        duration: 0.8,
        ease: 'power2.out'
      });
    }

    // Nav active link tracking on scroll
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
      const sectionId = section.getAttribute('id');
      const navLink = document.getElementById(`link-${sectionId}`);
      
      if (navLink) {
        ScrollTrigger.create({
          trigger: section,
          start: 'top 30%',
          end: 'bottom 30%',
          onEnter: () => activateLink(navLink),
          onEnterBack: () => activateLink(navLink),
        });
      }
    });

    const activateLink = (activeLink) => {
      navLinks.forEach(link => link.classList.remove('active'));
      activeLink.classList.add('active');
    };
  }

  /* ==========================================================================
     CONTACT FORM SUBMISSION (PREMIUM MOCKUP)
     ========================================================================== */
  const contactForm = document.getElementById('contactForm');
  const successMessage = document.getElementById('formSuccessMessage');
  const submitBtn = document.getElementById('formSubmitBtn');

  if (contactForm && successMessage && submitBtn) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Submit feedback styling
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>Sending...</span> <div class="loader-dot"></div>`;

      // Mocking submission delay
      setTimeout(() => {
        // Fade out form and activate success state
        contactForm.style.opacity = '0';
        successMessage.classList.add('active');
        
        // Store name locally as premium touch
        const userName = document.getElementById('formName').value;
        const welcomeText = successMessage.querySelector('p');
        if (userName && welcomeText) {
          welcomeText.innerHTML = `Thank you, ${userName}. I will get back to you within 24 hours.`;
        }

        // Reset submit button state
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }, 1500);
    });
  }
});
