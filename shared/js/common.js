// ============================================
// AMR Industrials - Universal Common JavaScript
// Combines all page-specific functionality
// ============================================

document.addEventListener('DOMContentLoaded', function() {
  
  // ============================================
  // Mobile Navigation Toggle
  // ============================================
  
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const body = document.body;
  
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function() {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isExpanded);
      navMenu.classList.toggle('active');
      body.classList.toggle('nav-open');
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
      if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
        navMenu.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        body.classList.remove('nav-open');
      }
    });
    
    // Close menu when clicking on a link
    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(link => {
      link.addEventListener('click', function() {
        navMenu.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        body.classList.remove('nav-open');
      });
    });
  }
  
  // ============================================
  // Active Navigation State
  // ============================================
  
  function setActiveNav() {
    const currentPage = window.location.pathname.split('/').pop() || 'navbar.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
      const linkPage = link.getAttribute('href').split('/').pop();
      if (linkPage === currentPage || 
          (currentPage === '' && linkPage === 'navbar.html') ||
          (currentPage === 'navbar.html' && linkPage === 'navbar.html')) {
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