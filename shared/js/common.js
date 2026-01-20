// ============================================
// AMR Industrials - Universal Common JavaScript
// Combines all page-specific functionality
// ============================================

document.addEventListener('DOMContentLoaded', function() {
  
  // ============================================
  // Mobile Navigation Toggle - FIXED VERSION
  // ============================================
  
  const navToggle = document.querySelector('.nav-toggle');
  const pillNav = document.querySelector('.pill-nav');
  const navMenu = document.querySelector('.nav-menu');
  const navBackdrop = document.querySelector('.nav-backdrop');
  const body = document.body;
  
  if (navToggle && navMenu) {
    // Toggle menu when clicking the hamburger button
    navToggle.addEventListener('click', function(e) {
      e.stopPropagation(); // Prevent immediate closing
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      
      // Toggle all necessary states
      navToggle.setAttribute('aria-expanded', !isExpanded);
      navToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
      if (pillNav) pillNav.classList.toggle('active');
      if (navBackdrop) navBackdrop.classList.toggle('active');
      body.classList.toggle('nav-open');
    });
    
    // Close menu when clicking the backdrop
    if (navBackdrop) {
      navBackdrop.addEventListener('click', function() {
        closeMenu();
      });
    }
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
      if (!navMenu.contains(e.target) && !navToggle.contains(e.target) && !pillNav.contains(e.target)) {
        closeMenu();
      }
    });
    
    // Close menu when clicking on a link
    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(link => {
      link.addEventListener('click', function() {
        closeMenu();
      });
    });
    
    // Helper function to close menu
    function closeMenu() {
      navMenu.classList.remove('active');
      if (pillNav) pillNav.classList.remove('active');
      navToggle.classList.remove('active');
      if (navBackdrop) navBackdrop.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
      body.classList.remove('nav-open');
    }
  }
  
  // ============================================
  // Active Navigation State
  // ============================================
  
  function setActiveNav() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
      const linkPage = link.getAttribute('href').split('/').pop();
      if (linkPage === currentPage || 
          (currentPage === '' && linkPage === 'index.html') ||
          (currentPage === 'index.html' && linkPage === 'index.html')) {
        link.classList.add('active');
      }
    });
  }
  
  setActiveNav();
  
  // ============================================
  // Header Scroll Effect
  // ============================================
  
  const header = document.querySelector('.header');
  let lastScroll = 0;
  
  if (header) {
    window.addEventListener('scroll', function() {
      const currentScroll = window.pageYOffset;
      
      if (currentScroll > 100) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
      
      lastScroll = currentScroll;
    });
  }
  
  // ============================================
  // Smooth Scroll for Anchor Links
  // ============================================
  
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
  
  // ============================================
  // Scroll Reveal Animations
  // ============================================
  
  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  // Observe all elements with animation classes
  const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right');
  animatedElements.forEach(el => observer.observe(el));
  
  // ============================================
  // Current Year in Footer
  // ============================================
  
  const yearElement = document.querySelector('.current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
  
  // ============================================
  // HOME PAGE: Hero Swiper with Fade Effect
  // ============================================
  
  const heroSwiper = document.querySelector('.hero-swiper');
  if (heroSwiper && typeof Swiper !== 'undefined') {
    new Swiper('.hero-swiper', {
      loop: true,
      speed: 1200,
      grabCursor: true,
      autoplay: {
        delay: 6000,
        disableOnInteraction: false,
      },
      effect: 'fade',
      fadeEffect: {
        crossFade: true
      },
      pagination: {
        el: '.hero-pagination',
        clickable: true,
        renderBullet: function (index, className) {
          return '<span class="' + className + '"></span>';
        },
      },
      navigation: {
        nextEl: '.hero-next',
        prevEl: '.hero-prev',
      },
      keyboard: {
        enabled: true,
        onlyInViewport: true,
      },
      on: {
        slideChangeTransitionStart: function () {
          const activeSlide = this.slides[this.activeIndex];
          const content = activeSlide.querySelector('.hero-left');
          if (content) {
            content.style.opacity = '0';
            content.style.transform = 'translateY(20px)';
          }
        },
        slideChangeTransitionEnd: function () {
          const activeSlide = this.slides[this.activeIndex];
          const content = activeSlide.querySelector('.hero-left');
          if (content) {
            setTimeout(() => {
              content.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
              content.style.opacity = '1';
              content.style.transform = 'translateY(0)';
            }, 300);
          }
        }
      }
    });
  }
  
  // ============================================
  // HOME PAGE: Counter Animation for Metrics
  // ============================================
  
  function animateCounter(element, target, suffix = '') {
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        element.textContent = target + suffix;
        clearInterval(timer);
      } else {
        element.textContent = Math.ceil(current) + suffix;
      }
    }, 30);
  }
  
  const metricItems = document.querySelectorAll('.metric-item');
  if (metricItems.length > 0) {
    const metricObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const number = entry.target.querySelector('.metric-number');
          if (!number) return;
          
          const text = number.textContent;
          const value = parseInt(text.replace(/\D/g, ''));
          const suffix = text.includes('+') ? '+' : '';
          
          animateCounter(number, value, suffix);
          metricObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    
    metricItems.forEach(item => {
      metricObserver.observe(item);
    });
  }
  
  // ============================================
  // HOME PAGE: Fade-in Animations for Elements
  // ============================================
  
  const fadeElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right');
  
  if (fadeElements.length > 0) {
    const fadeObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0) translateX(0)';
          fadeObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });
    
    fadeElements.forEach(element => {
      element.style.opacity = '0';
      if (element.classList.contains('slide-in-left')) {
        element.style.transform = 'translateX(-30px)';
      } else if (element.classList.contains('slide-in-right')) {
        element.style.transform = 'translateX(30px)';
      } else {
        element.style.transform = 'translateY(30px)';
      }
      element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
      fadeObserver.observe(element);
    });
  }
  
  // ============================================
  // CONTACT PAGE: Form Validation and Submission
  // ============================================
  
  const contactForm = document.getElementById('contactForm');
  const successMessage = document.getElementById('successMessage');
  
  if (contactForm) {
    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    // Phone validation regex (basic)
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    
    function showError(input, message) {
      const formGroup = input.closest('.form-group');
      const errorMessage = formGroup.querySelector('.error-message');
      
      input.classList.add('error');
      errorMessage.textContent = message;
      errorMessage.classList.add('visible');
    }
    
    function clearError(input) {
      const formGroup = input.closest('.form-group');
      const errorMessage = formGroup.querySelector('.error-message');
      
      input.classList.remove('error');
      errorMessage.textContent = '';
      errorMessage.classList.remove('visible');
    }
    
    function validateField(input) {
      const value = input.value.trim();
      const fieldName = input.name;
      
      // Clear previous error
      clearError(input);
      
      // Check required fields
      if (input.hasAttribute('required') && value === '') {
        showError(input, 'This field is required');
        return false;
      }
      
      // Validate email
      if (fieldName === 'email' && value !== '') {
        if (!emailRegex.test(value)) {
          showError(input, 'Please enter a valid email address');
          return false;
        }
      }
      
      // Validate phone (if provided)
      if (fieldName === 'phone' && value !== '') {
        if (!phoneRegex.test(value)) {
          showError(input, 'Please enter a valid phone number');
          return false;
        }
      }
      
      // Validate subject
      if (fieldName === 'subject' && value === '') {
        showError(input, 'Please select a subject');
        return false;
      }
      
      return true;
    }
    
    // Real-time validation
    const formInputs = contactForm.querySelectorAll('input, select, textarea');
    formInputs.forEach(input => {
      input.addEventListener('blur', function() {
        validateField(this);
      });
      
      input.addEventListener('input', function() {
        if (this.classList.contains('error')) {
          validateField(this);
        }
      });
    });
    
    // Form submission
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Validate all fields
      let isValid = true;
      formInputs.forEach(input => {
        if (!validateField(input)) {
          isValid = false;
        }
      });
      
      if (!isValid) {
        // Scroll to first error
        const firstError = contactForm.querySelector('.error');
        if (firstError) {
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
          firstError.focus();
        }
        return;
      }
      
      // If validation passes, show success message
      contactForm.style.display = 'none';
      if (successMessage) {
        successMessage.style.display = 'block';
        
        // Scroll to success message
        successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Reset form after 5 seconds
        setTimeout(() => {
          contactForm.reset();
          contactForm.style.display = 'flex';
          successMessage.style.display = 'none';
        }, 5000);
      }
    });
  }
  
  // ============================================
  // SERVICE PAGE: FAQ Accordion
  // ============================================
  
  const faqQuestions = document.querySelectorAll('.faq-question');
  
  if (faqQuestions.length > 0) {
    faqQuestions.forEach(question => {
      question.addEventListener('click', function() {
        const isExpanded = this.getAttribute('aria-expanded') === 'true';
        const answer = this.nextElementSibling;
        
        // Close all other FAQs
        faqQuestions.forEach(q => {
          if (q !== this) {
            q.setAttribute('aria-expanded', 'false');
            q.nextElementSibling.style.maxHeight = null;
          }
        });
        
        // Toggle current FAQ
        this.setAttribute('aria-expanded', !isExpanded);
        
        if (!isExpanded) {
          answer.style.maxHeight = answer.scrollHeight + 'px';
        } else {
          answer.style.maxHeight = null;
        }
      });
    });
  }
  
  // ============================================
  // TEAM PAGE: Highlights Swiper
  // ============================================
  
  const highlightsSwiper = document.querySelector('.highlights-swiper');
  if (highlightsSwiper && typeof Swiper !== 'undefined') {
    new Swiper('.highlights-swiper', {
      loop: true,
      speed: 600,
      autoplay: {
        delay: 4000,
        disableOnInteraction: false,
      },
      slidesPerView: 1,
      spaceBetween: 30,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      breakpoints: {
        768: {
          slidesPerView: 2,
          spaceBetween: 30,
        },
        1024: {
          slidesPerView: 3,
          spaceBetween: 40,
        }
      }
    });
  }
  
});

// ============================================
// Utility Functions
// ============================================

// Debounce function for performance
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Check if element is in viewport
function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

// ============================================
// CLEAN CIRCULAR METRICS - Pop Out Effect
// ============================================

(function() {
  const metricsSection = document.querySelector('.metrics-section');
  if (!metricsSection) return;

  // Smooth easing function
  const easeOutCubic = (t) => {
    return 1 - Math.pow(1 - t, 3);
  };

  // Counter animation with easing
  const animateCounter = (element, target, suffix = '', duration = 2500) => {
    const startTime = performance.now();
    
    const updateCounter = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutCubic(progress);
      const current = Math.floor(easedProgress * target);
      
      // Format number with commas
      element.textContent = current.toLocaleString() + suffix;
      
      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        element.textContent = target.toLocaleString() + suffix;
      }
    };
    
    requestAnimationFrame(updateCounter);
  };

  // Animate circular progress
  const animateCircleProgress = (circle, percentage) => {
    const radius = 85;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;
    
    setTimeout(() => {
      circle.style.strokeDashoffset = offset;
    }, 200);
  };

  // Intersection Observer for scroll-triggered animation
  const metricsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const metricItem = entry.target;
        metricItem.classList.add('visible');
        
        // Animate number counter
        const numberEl = metricItem.querySelector('.metric-number');
        if (numberEl) {
          const target = parseInt(numberEl.getAttribute('data-target'));
          const suffix = numberEl.getAttribute('data-suffix') || '';
          animateCounter(numberEl, target, suffix);
        }
        
        // Animate progress circle
        const progressCircle = metricItem.querySelector('.progress-ring-circle');
        if (progressCircle) {
          const progress = parseInt(progressCircle.getAttribute('data-progress'));
          animateCircleProgress(progressCircle, progress);
        }
        
        metricsObserver.unobserve(metricItem);
      }
    });
  }, {
    threshold: 0.2,
    rootMargin: '-50px'
  });

  // Observe all metric items
  const metricItems = document.querySelectorAll('.metric-item');
  metricItems.forEach(item => {
    metricsObserver.observe(item);
  });

  // Add magnetic cursor effect on hover (optional enhancement)
  metricItems.forEach(item => {
    const container = item.querySelector('.metric-circle-container');
    
    item.addEventListener('mousemove', (e) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      const moveX = x * 0.1;
      const moveY = y * 0.1;
      
      container.style.transform = `translate(${moveX}px, ${moveY}px) translateY(-20px) scale(1.12)`;
    });
    
    item.addEventListener('mouseleave', () => {
      container.style.transform = '';
    });
  });

  // Parallax effect for background decorations
  let ticking = false;
  const decoCircles = document.querySelectorAll('.deco-circle');
  
  const updateParallax = () => {
    const scrolled = window.pageYOffset;
    const sectionTop = metricsSection.offsetTop;
    const sectionHeight = metricsSection.offsetHeight;
    
    if (scrolled + window.innerHeight > sectionTop && 
        scrolled < sectionTop + sectionHeight) {
      const relativeScroll = scrolled - sectionTop;
      
      decoCircles.forEach((circle, index) => {
        const speed = (index + 1) * 0.05;
        const yPos = relativeScroll * speed;
        circle.style.transform = `translateY(${yPos}px)`;
      });
    }
    
    ticking = false;
  };
  
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  });
})();

/* ============================================
   ENHANCED ABOUT SECTION - PARALLAX JAVASCRIPT
   ============================================ */

(function() {
  'use strict';
  
  // Wait for DOM to be fully loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAboutParallax);
  } else {
    initAboutParallax();
  }
  
  function initAboutParallax() {
    const aboutSection = document.getElementById('about-section');
    if (!aboutSection) return;
    
    // Initialize AOS (Animate On Scroll)
    initAOS();
    
    // Initialize Parallax Effects
    initParallaxScroll();
    
    // Initialize Floating Cards
    initFloatingCards();
    
    // Initialize Interactive Hover Effects
    initInteractiveHovers();
  }
  
  /* ============================================
     AOS - ANIMATE ON SCROLL INITIALIZATION
     ============================================ */
  
  function initAOS() {
    // Simple AOS-like functionality
    const observerOptions = {
      threshold: 0.15,
      rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('aos-animate');
          // Don't unobserve so animations can repeat if needed
        }
      });
    }, observerOptions);
    
    // Observe all elements with data-aos attribute
    const aosElements = document.querySelectorAll('[data-aos]');
    aosElements.forEach(el => {
      observer.observe(el);
    });
  }
  
  /* ============================================
     PARALLAX SCROLL EFFECTS
     ============================================ */
  
  function initParallaxScroll() {
    const parallaxElements = document.querySelectorAll('[data-parallax-speed]');
    if (parallaxElements.length === 0) return;
    
    let ticking = false;
    
    function updateParallax() {
      const scrolled = window.pageYOffset;
      const windowHeight = window.innerHeight;
      
      parallaxElements.forEach(element => {
        const rect = element.getBoundingClientRect();
        const elementTop = rect.top + scrolled;
        const elementHeight = rect.height;
        
        // Check if element is in viewport
        if (rect.top < windowHeight && rect.bottom > 0) {
          const speed = parseFloat(element.getAttribute('data-parallax-speed')) || 0.5;
          
          // Calculate parallax offset
          const yPos = (scrolled - elementTop) * speed;
          
          // Apply transform
          element.style.transform = `translateY(${yPos}px)`;
        }
      });
      
      ticking = false;
    }
    
    function requestTick() {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }
    
    // Initial update
    updateParallax();
    
    // Update on scroll
    window.addEventListener('scroll', requestTick, { passive: true });
    
    // Update on resize
    window.addEventListener('resize', debounce(updateParallax, 100));
  }
  
  /* ============================================
     FLOATING CARDS ENHANCED ANIMATION
     ============================================ */
  
  function initFloatingCards() {
    const floatingCards = document.querySelectorAll('.stat-float-card');
    if (floatingCards.length === 0) return;
    
    floatingCards.forEach(card => {
      // Add magnetic hover effect
      card.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        const moveX = x * 0.15;
        const moveY = y * 0.15;
        
        this.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.05)`;
      });
      
      card.addEventListener('mouseleave', function() {
        this.style.transform = '';
      });
    });
  }
  
  /* ============================================
     INTERACTIVE HOVER EFFECTS
     ============================================ */
  
  function initInteractiveHovers() {
    // Milestone Icons
    const milestoneIcons = document.querySelectorAll('.milestone-icon');
    milestoneIcons.forEach(icon => {
      icon.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.15) rotate(5deg)';
      });
      
      icon.addEventListener('mouseleave', function() {
        this.style.transform = '';
      });
    });
    
    // Value Cards
    const valueCards = document.querySelectorAll('.value-card-enhanced');
    valueCards.forEach((card, index) => {
      card.addEventListener('mouseenter', function() {
        // Add subtle tilt based on mouse position
        this.addEventListener('mousemove', handleCardTilt);
      });
      
      card.addEventListener('mouseleave', function() {
        this.removeEventListener('mousemove', handleCardTilt);
        this.style.transform = '';
      });
    });
    
    function handleCardTilt(e) {
      const card = this;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 10;
      const rotateY = (centerX - x) / 10;
      
      card.style.transform = `
        perspective(1000px)
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
        translateY(-12px)
        scale(1.02)
      `;
    }
  }
  
  /* ============================================
     SCROLL PROGRESS INDICATOR (OPTIONAL)
     ============================================ */
  
  function initScrollProgress() {
    const aboutSection = document.getElementById('about-section');
    if (!aboutSection) return;
    
    let ticking = false;
    
    function updateScrollProgress() {
      const rect = aboutSection.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate how much of the section is visible
      let progress = 0;
      
      if (rect.top < windowHeight && rect.bottom > 0) {
        const visibleHeight = Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
        progress = visibleHeight / rect.height;
      }
      
      // Apply progress-based effects
      const journeyPath = aboutSection.querySelector('.journey-timeline-path');
      if (journeyPath) {
        journeyPath.style.transform = `scaleY(${progress})`;
        journeyPath.style.transformOrigin = 'top';
      }
      
      ticking = false;
    }
    
    function requestTick() {
      if (!ticking) {
        requestAnimationFrame(updateScrollProgress);
        ticking = true;
      }
    }
    
    window.addEventListener('scroll', requestTick, { passive: true });
  }
  
  /* ============================================
     UTILITY FUNCTIONS
     ============================================ */
  
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
  
  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  
  if (prefersReducedMotion.matches) {
    // Disable all animations for users who prefer reduced motion
    document.documentElement.style.setProperty('--transition-base', '0ms');
    document.documentElement.style.setProperty('--transition-slow', '0ms');
  }
  
})();

// ============================================
// SERVICES SHOWCASE - Enhanced Hover Effects
// ============================================

(function() {
  'use strict';
  
  // Wait for DOM to be fully loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initServicesShowcase);
  } else {
    initServicesShowcase();
  }
  
  function initServicesShowcase() {
    const serviceBlocks = document.querySelectorAll('.service-block');
    
    if (serviceBlocks.length === 0) return;
    
    serviceBlocks.forEach(block => {
      const imageContainer = block.querySelector('.service-image-container');
      const serviceNumber = block.querySelector('.service-number');
      const serviceInfo = block.querySelector('.service-info');
      
      if (!imageContainer || !serviceNumber || !serviceInfo) return;
      
      // Hover enter
      block.addEventListener('mouseenter', function() {
        // Add active class
        this.classList.add('service-active');
        
        // Smooth zoom animation
        gsap.to(imageContainer, {
          duration: 0.6,
          scale: 1.08,
          ease: 'power2.out'
        });
        
        // Number animation
        gsap.to(serviceNumber, {
          duration: 0.5,
          scale: 1,
          ease: 'back.out(1.7)',
          delay: 0.1
        });
        
        // Info animation
        gsap.to(serviceInfo, {
          duration: 0.5,
          y: 0,
          opacity: 1,
          ease: 'power2.out',
          delay: 0.2
        });
      });
      
      // Hover leave
      block.addEventListener('mouseleave', function() {
        // Remove active class
        this.classList.remove('service-active');
        
        // Reset zoom
        gsap.to(imageContainer, {
          duration: 0.4,
          scale: 1,
          ease: 'power2.inOut'
        });
        
        // Reset number
        gsap.to(serviceNumber, {
          duration: 0.4,
          scale: 0.7,
          ease: 'power2.inOut'
        });
        
        // Reset info
        gsap.to(serviceInfo, {
          duration: 0.3,
          y: 15,
          opacity: 0,
          ease: 'power2.in'
        });
      });
      
      // Click to navigate
      block.addEventListener('click', function() {
        const serviceNum = this.getAttribute('data-service');
        const serviceLinks = {
          '1': 'service.html#cnc',
          '2': 'service.html#turning',
          '3': 'service.html#grinding',
          '4': 'service.html#custom'
        };
        
        if (serviceLinks[serviceNum]) {
          window.location.href = serviceLinks[serviceNum];
        }
      });
      
      // Add keyboard accessibility
      block.setAttribute('tabindex', '0');
      block.setAttribute('role', 'button');
      
      block.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.click();
        }
      });
    });
    
    // Parallax effect on mouse move
    const servicesSection = document.querySelector('.services-showcase-section');
    
    if (servicesSection) {
      servicesSection.addEventListener('mousemove', function(e) {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        const bgGradient1 = this.querySelector('.bg-gradient-1');
        const bgGradient2 = this.querySelector('.bg-gradient-2');
        
        if (bgGradient1) {
          gsap.to(bgGradient1, {
            duration: 1,
            x: mouseX * 30,
            y: mouseY * 30,
            ease: 'power1.out'
          });
        }
        
        if (bgGradient2) {
          gsap.to(bgGradient2, {
            duration: 1.2,
            x: mouseX * -20,
            y: mouseY * -20,
            ease: 'power1.out'
          });
        }
      });
    }
  }
  
})();

/* ============================================
   ENHANCED SERVICES SHOWCASE - Interactive Features
   ============================================ */

(function() {
  'use strict';
  
  function initServicesShowcase() {
    const serviceCards = document.querySelectorAll('.service-showcase-card');
    
    if (serviceCards.length === 0) return;
    
    // Service navigation mapping
    const serviceLinks = {
      '1': 'service.html#cnc',
      '2': 'service.html#turning',
      '3': 'service.html#grinding',
      '4': 'service.html#custom'
    };
    
    serviceCards.forEach(card => {
      // Click navigation
      card.addEventListener('click', function() {
        const serviceNum = this.getAttribute('data-service');
        if (serviceLinks[serviceNum]) {
          window.location.href = serviceLinks[serviceNum];
        }
      });
      
      // Keyboard navigation
      card.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.click();
        }
      });
      
      // Add hover sound effect (optional)
      card.addEventListener('mouseenter', function() {
        // Optional: Add subtle audio feedback
        // playHoverSound();
      });
    });
    
    // Intersection Observer for scroll animations
    const observerOptions = {
      threshold: 0.2,
      rootMargin: '-50px'
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);
    
    serviceCards.forEach((card, index) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(40px)';
      card.style.transition = `all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) ${index * 0.1}s`;
      observer.observe(card);
    });
  }
  
  // Initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initServicesShowcase);
  } else {
    initServicesShowcase();
  }
  
})();

// ============================================
// ENHANCED CTA SECTION - Parallax & Animations
// ============================================

(function() {
  'use strict';
  
  function initEnhancedCTA() {
    const ctaSection = document.querySelector('.cta-enhanced-section');
    if (!ctaSection) return;
    
    // Initialize Parallax Effect
    initCTAParallax();
    
    // Initialize Interactive Elements
    initInteractiveButtons();
    
    // Initialize Particle Animation
    initParticleAnimation();
  }
  
  /* ============================================
     PARALLAX SCROLL EFFECT
     ============================================ */
  
  function initCTAParallax() {
    const parallaxLayers = document.querySelectorAll('.cta-parallax-bg .parallax-layer');
    if (parallaxLayers.length === 0) return;
    
    let ticking = false;
    
    function updateParallax() {
      const scrolled = window.pageYOffset;
      const ctaSection = document.querySelector('.cta-enhanced-section');
      
      if (!ctaSection) return;
      
      const rect = ctaSection.getBoundingClientRect();
      const sectionTop = rect.top + scrolled;
      const sectionHeight = rect.height;
      const windowHeight = window.innerHeight;
      
      // Check if section is in viewport
      if (rect.top < windowHeight && rect.bottom > 0) {
        parallaxLayers.forEach(layer => {
          const speed = parseFloat(layer.getAttribute('data-speed')) || 0.5;
          const yPos = (scrolled - sectionTop) * speed;
          layer.style.transform = `translateY(${yPos}px)`;
        });
      }
      
      ticking = false;
    }
    
    function requestTick() {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }
    
    // Initial update
    updateParallax();
    
    // Update on scroll
    window.addEventListener('scroll', requestTick, { passive: true });
    
    // Update on resize
    window.addEventListener('resize', debounce(updateParallax, 100));
  }
  
  /* ============================================
     INTERACTIVE BUTTON EFFECTS
     ============================================ */
  
  function initInteractiveButtons() {
    const ctaButtons = document.querySelectorAll('.btn-cta');
    
    ctaButtons.forEach(button => {
      // Magnetic effect on mouse move
      button.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        const moveX = x * 0.1;
        const moveY = y * 0.1;
        
        this.style.transform = `translate(${moveX}px, ${moveY}px) translateY(-4px)`;
      });
      
      button.addEventListener('mouseleave', function() {
        this.style.transform = '';
      });
    });
  }
  
  /* ============================================
     PARTICLE ANIMATION
     ============================================ */
  
  function initParticleAnimation() {
    const particles = document.querySelectorAll('.cta-particles .particle');
    
    particles.forEach((particle, index) => {
      // Random initial position
      const randomX = Math.random() * 100;
      const randomY = Math.random() * 100;
      particle.style.left = randomX + '%';
      particle.style.top = randomY + '%';
      
      // Add glow effect on hover
      particle.addEventListener('mouseenter', function() {
        this.style.boxShadow = '0 0 20px rgba(255, 255, 255, 0.8)';
        this.style.transform = 'scale(2)';
      });
      
      particle.addEventListener('mouseleave', function() {
        this.style.boxShadow = '';
        this.style.transform = '';
      });
    });
  }
  
  /* ============================================
     FLOATING CARDS INTERACTION
     ============================================ */
  
  function initFloatingCards() {
    const floatingCards = document.querySelectorAll('.floating-stat-card');
    
    floatingCards.forEach(card => {
      // Add tilt effect on mouse move
      card.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        this.style.transform = `
          perspective(1000px)
          rotateX(${rotateX}deg)
          rotateY(${rotateY}deg)
          translateY(-8px)
          scale(1.05)
        `;
      });
      
      card.addEventListener('mouseleave', function() {
        this.style.transform = '';
      });
    });
  }
  
  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initEnhancedCTA);
  } else {
    initEnhancedCTA();
  }
  
  // Re-initialize floating cards
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFloatingCards);
  } else {
    initFloatingCards();
  }
  
})();

