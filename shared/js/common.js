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

// ============================================
// TEAM SHOWCASE - Accordion Interaction
// ============================================

(function() {
  'use strict';
  
  function initTeamAccordion() {
    const accordion = document.querySelector('.team-accordion');
    if (!accordion) return;
    
    const cards = accordion.querySelectorAll('.team-card');
    let activeIndex = 0;
    let isHovering = false;
    
    // Initialize first card as active
    function setActiveCard(index) {
      cards.forEach((card, i) => {
        if (i === index) {
          card.classList.add('active');
        } else {
          card.classList.remove('active');
        }
      });
      activeIndex = index;
    }
    
    // Mouse enter handler
    cards.forEach((card, index) => {
      card.addEventListener('mouseenter', function() {
        isHovering = true;
        setActiveCard(index);
      });
      
      // Touch support for mobile
      card.addEventListener('touchstart', function(e) {
        e.preventDefault();
        setActiveCard(index);
      }, { passive: false });
      
      // Click handling for links inside
      const links = card.querySelectorAll('a');
      links.forEach(link => {
        link.addEventListener('click', function(e) {
          e.stopPropagation();
        });
      });
    });
    
    // Reset to first card when leaving accordion (desktop only)
    accordion.addEventListener('mouseleave', function() {
      if (window.innerWidth > 768) {
        isHovering = false;
        setActiveCard(0);
      }
    });
    
    // Keyboard accessibility
    accordion.addEventListener('keydown', function(e) {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        const nextIndex = (activeIndex + 1) % cards.length;
        setActiveCard(nextIndex);
        cards[nextIndex].focus();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        const prevIndex = (activeIndex - 1 + cards.length) % cards.length;
        setActiveCard(prevIndex);
        cards[prevIndex].focus();
      }
    });
    
    // Add tabindex for keyboard navigation
    cards.forEach(card => {
      card.setAttribute('tabindex', '0');
      card.setAttribute('role', 'button');
      card.setAttribute('aria-expanded', 'false');
      
      // Update aria-expanded
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
            const isActive = card.classList.contains('active');
            card.setAttribute('aria-expanded', isActive ? 'true' : 'false');
          }
        });
      });
      
      observer.observe(card, { attributes: true });
    });
    
    // Intersection Observer for entrance animation
    const observerOptions = {
      threshold: 0.2,
      rootMargin: '-50px'
    };
    
    const entranceObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          entranceObserver.unobserve(entry.target);
        }
      });
    }, observerOptions);
    
    cards.forEach((card, index) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(40px)';
      card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
      entranceObserver.observe(card);
    });
  }
  
  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTeamAccordion);
  } else {
    initTeamAccordion();
  }
  
})();

// ============================================
// Parallax Effect for Team Section Background
// ============================================

(function() {
  const teamSection = document.querySelector('.team-showcase-section');
  if (!teamSection) return;
  
  let ticking = false;
  
  function updateParallax() {
    const scrolled = window.pageYOffset;
    const sectionTop = teamSection.offsetTop;
    const sectionHeight = teamSection.offsetHeight;
    const windowHeight = window.innerHeight;
    
    if (scrolled + windowHeight > sectionTop && scrolled < sectionTop + sectionHeight) {
      const relativeScroll = scrolled - sectionTop;
      const glow = teamSection.querySelector('::before');
      if (glow) {
        // We can't directly animate pseudo-elements with JS, so we use a div if needed
        // But here we'll just use CSS animation which is smoother
      }
    }
    
    ticking = false;
  }
  
  window.addEventListener('scroll', function() {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }, { passive: true });
})();
// ============================================
// TEAM SHOWCASE - Accordion Interaction
// ============================================

(function() {
  'use strict';
  
  function initTeamAccordion() {
    const accordion = document.querySelector('.team-accordion');
    if (!accordion) return;
    
    const cards = accordion.querySelectorAll('.team-card');
    let activeIndex = 0;
    
    // Initialize first card as active
    function setActiveCard(index) {
      cards.forEach((card, i) => {
        if (i === index) {
          card.classList.add('active');
          card.setAttribute('aria-expanded', 'true');
        } else {
          card.classList.remove('active');
          card.setAttribute('aria-expanded', 'false');
        }
      });
      activeIndex = index;
    }
    
    // Set first card active on load
    setActiveCard(0);
    
    // Mouse enter handler for desktop
    cards.forEach((card, index) => {
      card.addEventListener('mouseenter', function() {
        if (window.innerWidth > 768) {
          setActiveCard(index);
        }
      });
      
      // Click handler for mobile/touch
      card.addEventListener('click', function(e) {
        if (window.innerWidth <= 768) {
          // If clicking a link inside, don't toggle
          if (e.target.closest('.card-link')) return;
          
          if (activeIndex === index) {
            // If already active, do nothing (or close if you prefer)
            return;
          } else {
            setActiveCard(index);
          }
        }
      });
      
      // Touch support for mobile
      card.addEventListener('touchstart', function(e) {
        if (window.innerWidth <= 768 && !e.target.closest('.card-link')) {
          e.preventDefault();
          if (activeIndex !== index) {
            setActiveCard(index);
          }
        }
      }, { passive: false });
    });
    
    // Reset to first card when leaving accordion (desktop only)
    accordion.addEventListener('mouseleave', function() {
      if (window.innerWidth > 768) {
        setActiveCard(0);
      }
    });
    
    // Keyboard accessibility
    accordion.addEventListener('keydown', function(e) {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        const nextIndex = (activeIndex + 1) % cards.length;
        setActiveCard(nextIndex);
        cards[nextIndex].focus();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        const prevIndex = (activeIndex - 1 + cards.length) % cards.length;
        setActiveCard(prevIndex);
        cards[prevIndex].focus();
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const link = cards[activeIndex].querySelector('.card-link');
        if (link) link.click();
      }
    });
    
    // Add accessibility attributes
    cards.forEach((card, index) => {
      card.setAttribute('tabindex', '0');
      card.setAttribute('role', 'button');
      card.setAttribute('aria-expanded', index === 0 ? 'true' : 'false');
    });
    
    // Intersection Observer for entrance animation
    const observerOptions = {
      threshold: 0.2,
      rootMargin: '-50px'
    };
    
    const entranceObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          entranceObserver.unobserve(entry.target);
        }
      });
    }, observerOptions);
    
    cards.forEach((card, index) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(40px)';
      card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
      entranceObserver.observe(card);
    });
  }
  
  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTeamAccordion);
  } else {
    initTeamAccordion();
  }
})();

// ============================================
// VIDEO HERO - Performance & Loading Handler
// ============================================

document.addEventListener('DOMContentLoaded', function() {
  const videoHero = document.querySelector('.page-hero-video');
  const video = document.querySelector('.hero-video');
  const videoContainer = document.querySelector('.video-container');
  
  if (video && videoContainer) {
    // Add loading state
    videoContainer.classList.add('loading');
    
    // Handle video load
    video.addEventListener('loadeddata', function() {
      videoContainer.classList.remove('loading');
      video.classList.add('loaded');
    });
    
    // Fallback if video fails to load
    video.addEventListener('error', function() {
      videoContainer.classList.remove('loading');
      videoContainer.style.display = 'none';
      if (videoHero) {
        videoHero.style.backgroundImage = "url('assets/images/about-fallback.jpg')";
        videoHero.style.backgroundSize = 'cover';
        videoHero.style.backgroundPosition = 'center';
      }
    });
    
    // Intersection Observer for performance (pause when not visible)
    const videoObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (video.paused && video.readyState >= 3) {
            video.play().catch(e => console.log('Video autoplay prevented:', e));
          }
        } else {
          if (!video.paused) {
            video.pause();
          }
        }
      });
    }, {
      threshold: 0.1
    });
    
    videoObserver.observe(videoHero);
    
    // Mobile touch handling - ensure video plays on mobile
    const playVideo = () => {
      if (video.paused) {
        video.play().catch(e => console.log('Video play failed:', e));
      }
    };
    
    document.addEventListener('touchstart', playVideo, { once: true });
    document.addEventListener('scroll', playVideo, { once: true, passive: true });
  }
  
  // Smooth scroll for hero buttons
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
});

// ============================================
// ENHANCED MISSION SECTION - Fixed Counters & 3D Image
// ============================================

document.addEventListener('DOMContentLoaded', function() {
  
  const missionSection = document.querySelector('.mission-enhanced');
  
  if (missionSection) {
    
    // FIXED: Counter Animation Function (Supports large numbers like 1990)
    const animateCounter = (element, target, duration = 2500) => {
      let start = null;
      const startTime = performance.now();
      
      // Determine if it's a year (1990) or regular stat
      const isYear = target > 1000;
      const step = (timestamp) => {
        if (!start) start = timestamp;
        const progress = Math.min((timestamp - start) / duration, 1);
        
        // Ease out cubic for smooth slowdown
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(easeOut * target);
        
        // Format number with commas if it's a year
        element.textContent = isYear ? current.toLocaleString() : current;
        
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          element.textContent = isYear ? target.toLocaleString() : target;
        }
      };
      requestAnimationFrame(step);
    };

    // FIXED: Observe Year Badge Counter (1990)
    const yearNumber = missionSection.querySelector('.year-number');
    if (yearNumber) {
      const yearObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const target = parseInt(yearNumber.getAttribute('data-count')) || 1990;
            // Longer duration for year to make it readable
            animateCounter(yearNumber, target, 3000);
            yearObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });
      
      yearObserver.observe(yearNumber);
    }

    // FIXED: Observe Stats Row Counters (34, 60, 99)
    const statsRow = missionSection.querySelector('.mission-stats-row');
    if (statsRow) {
      const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const counters = entry.target.querySelectorAll('.stat-value[data-count]');
            counters.forEach((counter, index) => {
              const target = parseInt(counter.getAttribute('data-count'));
              // Stagger animations
              setTimeout(() => {
                animateCounter(counter, target, 2000);
              }, index * 200);
            });
            statsObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });

      statsObserver.observe(statsRow);
    }

    // ENHANCED: 3D Image Tilt Effect
    const image3dContainer = missionSection.querySelector('.image-3d-container');
    const missionIcon3d = missionSection.querySelector('.mission-icon-3d');
    
    if (image3dContainer && missionIcon3d) {
      missionIcon3d.addEventListener('mousemove', (e) => {
        const rect = missionIcon3d.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        // Calculate rotation (max 25deg)
        const rotateX = ((y - centerY) / centerY) * -25;
        const rotateY = ((x - centerX) / centerX) * 25;
        
        // Add shine effect based on mouse position
        const shineX = (x / rect.width) * 100;
        const shineY = (y / rect.height) * 100;
        
        image3dContainer.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
        image3dContainer.classList.add('tilted');
        
        // Add dynamic shadow based on tilt
        const shadowX = (x - centerX) / 10;
        const shadowY = (y - centerY) / 10 + 20;
        missionIcon3d.querySelector('.mission-image-3d').style.filter = 
          `drop-shadow(${shadowX}px ${shadowY}px 30px rgba(230, 126, 34, 0.3))`;
      });
      
      missionIcon3d.addEventListener('mouseleave', () => {
        image3dContainer.style.transform = 'perspective(1200px) rotateX(0) rotateY(0) scale(1)';
        image3dContainer.classList.remove('tilted');
        missionIcon3d.querySelector('.mission-image-3d').style.filter = 
          'drop-shadow(0 20px 40px rgba(230, 126, 34, 0.25)) drop-shadow(0 10px 20px rgba(0, 0, 0, 0.15))';
      });
    }

    // Typewriter Effect
    const typewriterElement = missionSection.querySelector('.typewriter-text');
    if (typewriterElement) {
      const text = typewriterElement.textContent;
      typewriterElement.textContent = '';
      typewriterElement.style.borderRight = '3px solid var(--accent-orange)';
      
      let i = 0;
      const typeWriter = () => {
        if (i < text.length) {
          typewriterElement.textContent += text.charAt(i);
          i++;
          setTimeout(typeWriter, 40); // Slightly slower for readability
        } else {
          // Blinking cursor after typing
          setInterval(() => {
            const currentBorder = typewriterElement.style.borderRightColor;
            typewriterElement.style.borderRightColor = 
              currentBorder === 'transparent' ? 'var(--accent-orange)' : 'transparent';
          }, 800);
        }
      };

      const textObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setTimeout(typeWriter, 800);
            textObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });

      textObserver.observe(typewriterElement);
    }

    // Title Reveal Animation
    const titleRows = missionSection.querySelectorAll('.title-row, .title-outline');
    const titleObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }, index * 150);
          titleObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    titleRows.forEach(row => {
      row.style.opacity = '0';
      row.style.transform = 'translateY(30px)';
      row.style.transition = 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)';
      titleObserver.observe(row);
    });
    
    // Blueprint Grid Parallax
    let ticking = false;
    const gridLines = missionSection.querySelector('.grid-lines');
    
    window.addEventListener('scroll', () => {
      if (!ticking && gridLines) {
        requestAnimationFrame(() => {
          const scrolled = window.pageYOffset;
          const sectionTop = missionSection.offsetTop;
          const relativeScroll = (scrolled - sectionTop) * 0.05;
          gridLines.style.transform = `translate(${relativeScroll}px, ${relativeScroll}px)`;
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }
});

// ============================================
// ENHANCED TIMELINE - Scroll Progress & Animation
// ============================================

(function() {
  const timelineSection = document.querySelector('.timeline-section');
  if (!timelineSection) return;

  const progressBar = timelineSection.querySelector('.timeline-track-progress');
  const timelineRows = timelineSection.querySelectorAll('.timeline-row');
  
  // Intersection Observer for row animations
  const rowObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        
        // Stagger child animations
        const card = entry.target.querySelector('.timeline-card');
        const content = entry.target.querySelector('.timeline-content');
        
        if (card) {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => {
            card.style.transition = 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 100);
        }
        
        rowObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.2,
    rootMargin: '-50px'
  });

  timelineRows.forEach(row => {
    rowObserver.observe(row);
  });

  // Scroll Progress Bar
  function updateProgress() {
    if (!progressBar) return;
    
    const rect = timelineSection.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    
    // Calculate how much of the timeline is visible
    const sectionTop = rect.top;
    const sectionHeight = rect.height;
    
    if (sectionTop < windowHeight && rect.bottom > 0) {
      // Calculate progress percentage
      const totalScrollable = sectionHeight - windowHeight;
      const scrolled = (windowHeight - sectionTop);
      const progress = Math.min(Math.max(scrolled / sectionHeight, 0), 1);
      
      progressBar.style.height = `${progress * 100}%`;
    }
  }

  // Throttled scroll listener
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateProgress();
        ticking = false;
      });
      ticking = true;
    }
  });

  // Initialize
  updateProgress();

  // Parallax effect on images
  const images = timelineSection.querySelectorAll('.timeline-image-wrap img');
  if (images.length > 0 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.addEventListener('scroll', () => {
      images.forEach(img => {
        const rect = img.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          const speed = 0.1;
          const offset = (window.innerHeight - rect.top) * speed;
          img.style.transform = `translateY(${offset}px) scale(1.1)`;
        }
      });
    });
  }

  // Hover tilt effect for cards (desktop only)
  if (window.innerWidth > 968) {
    timelineRows.forEach(row => {
      const card = row.querySelector('.timeline-card');
      if (!card) return;
      
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px) scale(1.02)`;
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }
})();

// ============================================
// ENHANCED CORE VALUES - FIXED VERSION
// Cards visible by default, animate only if JS works
// ============================================

(function() {
  'use strict';
  
  function initEnhancedValues() {
    const valuesSection = document.querySelector('.values-enhanced');
    if (!valuesSection) return;
    
    const valueCards = valuesSection.querySelectorAll('.value-card-enhanced');
    
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // If reduced motion, keep cards visible and static
    if (prefersReducedMotion) {
      valueCards.forEach(card => {
        card.classList.remove('value-card-hidden');
        card.classList.add('value-card-visible');
        card.style.opacity = '1';
        card.style.transform = 'none';
      });
      return;
    }
    
    // Intersection Observer for scroll animations
    const observerOptions = {
      threshold: 0.15,
      rootMargin: '-50px 0px'
    };
    
    const cardObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          // Staggered entrance animation
          setTimeout(() => {
            entry.target.classList.remove('value-card-hidden');
            entry.target.classList.add('value-card-visible');
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0) rotateX(0)';
          }, index * 150);
          
          cardObserver.unobserve(entry.target);
        }
      });
    }, observerOptions);
    
    // Initialize - cards start visible as fallback, then we animate them
    valueCards.forEach((card, index) => {
      // Only animate if within view or approaching
      // Start with hidden class for animation, but with CSS fallback
      card.classList.add('value-card-hidden');
      
      // Safety: If observer fails, show cards after 3 seconds
      setTimeout(() => {
        if (card.classList.contains('value-card-hidden')) {
          card.classList.remove('value-card-hidden');
          card.classList.add('value-card-visible');
          card.style.opacity = '1';
          card.style.transform = 'none';
        }
      }, 3000 + (index * 200));
      
      cardObserver.observe(card);
    });
    
    // 3D tilt effect on mouse move (desktop only)
    if (window.matchMedia('(pointer: fine)').matches) {
      valueCards.forEach(card => {
        card.addEventListener('mousemove', handleTilt);
        card.addEventListener('mouseleave', resetTilt);
      });
    }
    
    function handleTilt(e) {
      const card = this;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -10;
      const rotateY = ((x - centerX) / centerX) * 10;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-12px) scale(1.02)`;
    }
    
    function resetTilt() {
      this.style.transform = '';
    }
    
    // Parallax effect for background orbs
    const orbs = valuesSection.querySelectorAll('.values-orb');
    let ticking = false;
    
    function updateParallax() {
      const scrolled = window.pageYOffset;
      const valuesTop = valuesSection.offsetTop;
      const relativeScroll = scrolled - valuesTop;
      
      orbs.forEach((orb, index) => {
        const speed = (index + 1) * 0.05;
        const yPos = relativeScroll * speed;
        orb.style.transform = `translateY(${yPos}px)`;
      });
      
      ticking = false;
    }
    
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }, { passive: true });
  }
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initEnhancedValues);
  } else {
    initEnhancedValues();
  }
})();

// 3D Tilt Effect for Partner Cards
(function() {
  'use strict';
  
  const cards = document.querySelectorAll('.partner-3d-card');
  
  cards.forEach(card => {
    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);
  });
  
  function handleMouseMove(e) {
    const card = this;
    const wrapper = card.querySelector('.card-3d-wrapper');
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -15;
    const rotateY = ((x - centerX) / centerX) * 15;
    
    wrapper.style.transform = `translateY(-20px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(50px)`;
    
    // Dynamic shadow based on tilt
    const shadowX = (x - centerX) / 5;
    const shadowY = (y - centerY) / 5 + 20;
    wrapper.style.boxShadow = `${shadowX}px ${shadowY}px 60px rgba(0,0,0,0.15), 0 20px 40px rgba(230, 126, 34, 0.1)`;
  }
  
  function handleMouseLeave() {
    const wrapper = this.querySelector('.card-3d-wrapper');
    wrapper.style.transform = '';
    wrapper.style.boxShadow = '';
  }
  
  // Entrance Animation
  const observerOptions = {
    threshold: 0.2,
    rootMargin: '-50px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, index * 150);
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  cards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(40px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
    observer.observe(card);
  });
})();

// ============================================
// SERVICES HERO - Interactive Effects
// ============================================

(function() {
  const servicesHero = document.querySelector('.services-hero-video');
  if (!servicesHero) return;

  // Video Performance: Pause when not in viewport
  const heroVideo = servicesHero.querySelector('.hero-video-bg');
  if (heroVideo && 'IntersectionObserver' in window) {
    const videoObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          heroVideo.play().catch(e => console.log('Autoplay prevented'));
        } else {
          heroVideo.pause();
        }
      });
    }, { threshold: 0.1 });
    
    videoObserver.observe(servicesHero);
  }

  // Mouse Parallax Effect for Floating Elements
  const floatingElements = servicesHero.querySelectorAll('[data-parallax-speed]');
  let ticking = false;
  let mouseX = 0, mouseY = 0;

  servicesHero.addEventListener('mousemove', (e) => {
    const rect = servicesHero.getBoundingClientRect();
    mouseX = (e.clientX - rect.left - rect.width / 2) / rect.width;
    mouseY = (e.clientY - rect.top - rect.height / 2) / rect.height;
    
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  });

  function updateParallax() {
    floatingElements.forEach(el => {
      const speed = parseFloat(el.getAttribute('data-parallax-speed')) || 0.05;
      const x = mouseX * speed * 100;
      const y = mouseY * speed * 100;
      
      // Add to existing transform (rotation) without overwriting
      const currentTransform = el.style.transform.replace(/translate\([^)]+\)/g, '').trim();
      el.style.transform = `${currentTransform} translate(${x}px, ${y}px)`;
    });
    ticking = false;
  }

  // Counter Animation for Stats
  const counters = servicesHero.querySelectorAll('.spec-value[data-count]');
  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = parseFloat(entry.target.getAttribute('data-count'));
        const duration = 2000;
        const start = performance.now();
        const element = entry.target;
        
        const updateCount = (currentTime) => {
          const elapsed = currentTime - start;
          const progress = Math.min(elapsed / duration, 1);
          
          // Easing function
          const easeOutQuart = 1 - Math.pow(1 - progress, 4);
          const current = target * easeOutQuart;
          
          // Handle decimals
          if (target < 1) {
            element.textContent = current.toFixed(3);
          } else {
            element.textContent = Math.floor(current);
          }
          
          if (progress < 1) {
            requestAnimationFrame(updateCount);
          } else {
            element.textContent = target;
          }
        };
        
        requestAnimationFrame(updateCount);
        countObserver.unobserve(element);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => countObserver.observe(counter));

  // Smooth scroll on scroll-hint click
  const scrollHint = servicesHero.querySelector('.scroll-hint');
  if (scrollHint) {
    scrollHint.addEventListener('click', () => {
      const nextSection = servicesHero.nextElementSibling;
      if (nextSection) {
        nextSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
})();

// Add this to your existing scroll handling
function initServicesHeroAnimations() {
  const hero = document.querySelector('.services-hero-video');
  if (!hero) return;
  
  // Intersection Observer for staggered animations
  const animatedElements = hero.querySelectorAll('[data-animate]');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.getAttribute('data-delay') || 0;
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, delay * 1000);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  
  animatedElements.forEach(el => observer.observe(el));
}

// Call on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initServicesHeroAnimations);
} else {
  initServicesHeroAnimations();
}

// ============================================
// ENHANCED PROCESS SECTION - Pipeline Animation
// ============================================

(function() {
  const processSection = document.querySelector('.process-section-enhanced');
  if (!processSection) return;

  // Animate SVG Pipeline Line on Scroll
  const pipeProgress = processSection.querySelector('.pipe-progress');
  const processNodes = processSection.querySelectorAll('.process-node');

  if (pipeProgress && 'IntersectionObserver' in window) {
    const pipeObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Animate the line drawing
          pipeProgress.style.strokeDashoffset = '0';
          
          // Stagger animate the nodes
          processNodes.forEach((node, index) => {
            setTimeout(() => {
              node.classList.add('active');
              
              // Animate the card content
              const card = node.querySelector('.process-card-enhanced');
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }, index * 200);
          });
          
          pipeObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    pipeObserver.observe(processSection);
  }

  // Counter Animation for any numeric values in specs
  const animateValue = (element, start, end, duration, suffix = '') => {
    let current = start;
    const range = end - start;
    const increment = end > start ? 1 : -1;
    const stepTime = Math.abs(Math.floor(duration / range));
    
    // For decimal values like 0.001
    const isDecimal = end < 1;
    const decimalPlaces = isDecimal ? 3 : 0;
    
    const timer = setInterval(() => {
      if (isDecimal) {
        current += 0.001;
        if (current >= end) {
          current = end;
          clearInterval(timer);
        }
        element.textContent = current.toFixed(decimalPlaces) + suffix;
      } else {
        current += increment;
        if (current === end) {
          clearInterval(timer);
        }
        element.textContent = current + suffix;
      }
    }, stepTime);
  };

  // Intersection Observer for individual cards
  const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const card = entry.target;
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
        
        // Animate spec values if they exist
        const specValues = card.querySelectorAll('.spec-value');
        specValues.forEach(spec => {
          const finalValue = parseFloat(spec.getAttribute('data-value'));
          if (!isNaN(finalValue)) {
            const suffix = spec.getAttribute('data-suffix') || '';
            animateValue(spec, 0, finalValue, 1000, suffix);
          }
        });
        
        cardObserver.unobserve(card);
      }
    });
  }, { threshold: 0.2 });

  // Initialize cards with hidden state
  processNodes.forEach(node => {
    const card = node.querySelector('.process-card-enhanced');
    if (card) {
      card.style.opacity = '0';
      card.style.transform = 'translateY(30px)';
      card.style.transition = 'opacity 0.6s ease, transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
      cardObserver.observe(card);
    }
  });

  // Hover interactions between connected nodes
  processNodes.forEach((node, index) => {
    node.addEventListener('mouseenter', () => {
      // Highlight previous nodes in the chain (show progress)
      processNodes.forEach((prevNode, prevIndex) => {
        if (prevIndex <= index) {
          prevNode.classList.add('active');
        }
      });
      
      // If this is the last node, trigger completion effect
      if (index === processNodes.length - 1) {
        node.classList.add('complete');
      }
    });
    
    node.addEventListener('mouseleave', () => {
      processNodes.forEach((prevNode, prevIndex) => {
        if (prevIndex > index) {
          prevNode.classList.remove('active');
        }
      });
      node.classList.remove('complete');
    });
  });

  // Parallax effect for floating orbs on mouse move
  const orbs = processSection.querySelectorAll('.process-bg-orb');
  let ticking = false;

  processSection.addEventListener('mousemove', (e) => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const rect = processSection.getBoundingClientRect();
        const mouseX = (e.clientX - rect.left) / rect.width - 0.5;
        const mouseY = (e.clientY - rect.top) / rect.height - 0.5;

        orbs.forEach((orb, index) => {
          const speed = (index + 1) * 20;
          orb.style.transform = `translate(${mouseX * speed}px, ${mouseY * speed}px)`;
        });
        
        ticking = false;
      });
      ticking = true;
    }
  });
})();

// Optional: Add intersection observer for fade-up animations if not already present
const initProcessAnimations = () => {
  const animatedElements = document.querySelectorAll('[data-animate="fade-up"]');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.getAttribute('data-delay') || 0;
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, delay * 1000);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initProcessAnimations);
} else {
  initProcessAnimations();
}
// ============================================
// ENHANCED FAQ - Technical Documentation System
// ============================================

(function() {
  const faqSection = document.querySelector('.faq-enhanced-section');
  if (!faqSection) return;

  const faqCards = faqSection.querySelectorAll('.faq-card-enhanced');
  const faqTriggers = faqSection.querySelectorAll('.faq-trigger');

  // Accordion Functionality
  faqTriggers.forEach(trigger => {
    trigger.addEventListener('click', function() {
      const card = this.closest('.faq-card-enhanced');
      const panel = card.querySelector('.faq-panel');
      const isExpanded = this.getAttribute('aria-expanded') === 'true';
      
      // Close all other cards (optional - remove for multiple open)
      faqCards.forEach(otherCard => {
        if (otherCard !== card && otherCard.classList.contains('active')) {
          const otherTrigger = otherCard.querySelector('.faq-trigger');
          const otherPanel = otherCard.querySelector('.faq-panel');
          
          otherCard.classList.remove('active');
          otherTrigger.setAttribute('aria-expanded', 'false');
          otherPanel.setAttribute('hidden', '');
          otherPanel.style.maxHeight = null;
        }
      });
      
      // Toggle current card
      if (!isExpanded) {
        card.classList.add('active');
        this.setAttribute('aria-expanded', 'true');
        panel.removeAttribute('hidden');
        
        // Calculate actual height for smooth animation
        const panelHeight = panel.scrollHeight;
        panel.style.maxHeight = panelHeight + 'px';
        
        // Smooth scroll into view if needed
        setTimeout(() => {
          const rect = card.getBoundingClientRect();
          if (rect.bottom > window.innerHeight) {
            card.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 100);
        
      } else {
        card.classList.remove('active');
        this.setAttribute('aria-expanded', 'false');
        panel.style.maxHeight = null;
        setTimeout(() => {
          panel.setAttribute('hidden', '');
        }, 500);
      }
    });
  });

  // Keyboard Navigation (Arrow keys)
  faqSection.addEventListener('keydown', (e) => {
    const currentTrigger = document.activeElement;
    if (!currentTrigger.classList.contains('faq-trigger')) return;
    
    const currentIndex = Array.from(faqTriggers).indexOf(currentTrigger);
    let nextIndex;
    
    switch(e.key) {
      case 'ArrowDown':
        e.preventDefault();
        nextIndex = (currentIndex + 1) % faqTriggers.length;
        faqTriggers[nextIndex].focus();
        break;
      case 'ArrowUp':
        e.preventDefault();
        nextIndex = (currentIndex - 1 + faqTriggers.length) % faqTriggers.length;
        faqTriggers[nextIndex].focus();
        break;
      case 'Home':
        e.preventDefault();
        faqTriggers[0].focus();
        break;
      case 'End':
        e.preventDefault();
        faqTriggers[faqTriggers.length - 1].focus();
        break;
    }
  });

  // Intersection Observer for entrance animations
  const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const card = entry.target;
        const delay = card.getAttribute('data-faq') * 0.1;
        
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, delay * 1000);
        
        cardObserver.unobserve(card);
      }
    });
  }, { threshold: 0.2, rootMargin: '-50px' });

  // Initialize cards
  faqCards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
    cardObserver.observe(card);
  });

  // Auto-expand first item on desktop (optional UX enhancement)
 if (window.innerWidth > 768 && faqCards.length > 0 && window.location.hash === '#faq') {
  setTimeout(() => {
    const firstTrigger = faqCards[0].querySelector('.faq-trigger');
    if (firstTrigger) firstTrigger.click();
  }, 300);
}

  // Search functionality (Optional enhancement)
  // Add a search input with class "faq-search" to enable
  const searchInput = faqSection.querySelector('.faq-search');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const searchTerm = e.target.value.toLowerCase();
      
      faqCards.forEach(card => {
        const question = card.querySelector('h3').textContent.toLowerCase();
        const answer = card.querySelector('.panel-content').textContent.toLowerCase();
        
        if (question.includes(searchTerm) || answer.includes(searchTerm)) {
          card.style.display = 'grid';
          card.style.opacity = '1';
        } else {
          card.style.opacity = '0.3';
        }
      });
    });
  }
})();

// Initialize FAQ when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  // The IIFE above runs automatically, but ensure it's called
  if (document.querySelector('.faq-enhanced-section')) {
    console.log('FAQ Enhanced initialized');
  }
});

// ============================================
// CONTACT PAGE - Enhanced Form Handling
// ============================================

document.addEventListener('DOMContentLoaded', function() {
  
  // Initialize Contact Form
  initContactForm();
  
  // Initialize Scroll Animations for Contact Page
  initContactAnimations();
  
  // Initialize Parallax for CTA
  initCTAParallax();
});

// Contact Form Handling
function initContactForm() {
  const contactForm = document.getElementById('contactForm');
  const successMessage = document.getElementById('successMessage');
  
  if (!contactForm) return;
  
  // Validation patterns
  const patterns = {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phone: /^[\d\s\-\+\(\)]+$/
  };
  
  // Real-time validation
  const inputs = contactForm.querySelectorAll('input, select, textarea');
  inputs.forEach(input => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => {
      if (input.classList.contains('error')) validateField(input);
    });
  });
  
  function validateField(field) {
    const value = field.value.trim();
    const name = field.name;
    let isValid = true;
    let message = '';
    
    // Reset
    field.classList.remove('error');
    const errorEl = field.parentElement.querySelector('.error-message');
    if (errorEl) errorEl.classList.remove('visible');
    
    // Required check
    if (field.hasAttribute('required') && !value) {
      isValid = false;
      message = 'This field is required';
    }
    
    // Pattern checks
    if (isValid && value) {
      if (name === 'email' && !patterns.email.test(value)) {
        isValid = false;
        message = 'Please enter a valid email';
      }
      if (name === 'phone' && !patterns.phone.test(value)) {
        isValid = false;
        message = 'Please enter a valid phone number';
      }
    }
    
    if (!isValid) {
      field.classList.add('error');
      if (errorEl) {
        errorEl.textContent = message;
        errorEl.classList.add('visible');
      }
    }
    
    return isValid;
  }
  
  // Form Submission
  contactForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Validate all
    let isValid = true;
    inputs.forEach(input => {
      if (!validateField(input)) isValid = false;
    });
    
    if (!isValid) {
      // Shake animation for error feedback
      contactForm.classList.add('shake');
      setTimeout(() => contactForm.classList.remove('shake'), 500);
      
      // Focus first error
      const firstError = contactForm.querySelector('.error');
      if (firstError) firstError.focus();
      return;
    }
    
    // Show loading state
    const submitBtn = contactForm.querySelector('.btn-submit');
    submitBtn.classList.add('loading');
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Hide form, show success
    contactForm.style.display = 'none';
    if (successMessage) {
      successMessage.style.display = 'block';
      successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    submitBtn.classList.remove('loading');
  });
}

// Reset form function (global scope for onclick)
window.resetForm = function() {
  const contactForm = document.getElementById('contactForm');
  const successMessage = document.getElementById('successMessage');
  
  if (contactForm) {
    contactForm.reset();
    contactForm.style.display = 'flex';
    contactForm.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
  }
  if (successMessage) {
    successMessage.style.display = 'none';
  }
};

// Scroll to map function
window.scrollToMap = function() {
  const mapSection = document.getElementById('map-section');
  if (mapSection) {
    mapSection.scrollIntoView({ behavior: 'smooth' });
  }
};

// Contact Page Animations
function initContactAnimations() {
  const animatedElements = document.querySelectorAll('.quick-contact-item, .form-card, .contact-info-card-enhanced');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, index * 100);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '-50px'
  });
  
  animatedElements.forEach((el, index) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
    observer.observe(el);
  });
}

// Shake animation keyframes (add via JS since it's dynamic)
const style = document.createElement('style');
style.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-10px); }
    75% { transform: translateX(10px); }
  }
  .shake {
    animation: shake 0.5s ease;
  }
`;
document.head.appendChild(style);