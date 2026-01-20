// ============================================
// Enhanced Home Page JavaScript with Fade Effect
// ============================================

document.addEventListener('DOMContentLoaded', function () {

  // ============================================
  // ✨ Hero Swiper with Fade Effect
  // ============================================

  const heroSwiper = new Swiper('.hero-swiper', {
    loop: true,
    speed: 1200,
    grabCursor: true,
    autoplay: {
      delay: 6000,
      disableOnInteraction: false,
    },
    effect: 'fade',  // ✨ Changed to fade for dissolve effect
    fadeEffect: {
      crossFade: true  // ✨ Smooth cross-fade between slides
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
    // ✨ Enhanced keyboard navigation
    keyboard: {
      enabled: true,
      onlyInViewport: true,
    },
    // ✨ Add parallax effect for smoother transitions
    on: {
      slideChangeTransitionStart: function () {
        // Add animation class to content
        const activeSlide = this.slides[this.activeIndex];
        const content = activeSlide.querySelector('.hero-left');
        if (content) {
          content.style.opacity = '0';
          content.style.transform = 'translateY(20px)';
        }
      },
      slideChangeTransitionEnd: function () {
        // Fade in content with delay
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

  // ============================================
  // Counter Animation for Metrics
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

  document.querySelectorAll('.metric-item').forEach(item => {
    metricObserver.observe(item);
  });

  // ============================================
  // Scroll Header Effect
  // ============================================

  const header = document.querySelector('.header');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
  });

  // ============================================
  // Smooth Scroll for Anchor Links
  // ============================================

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // ============================================
  // Intersection Observer for Fade-in Animations
  // ============================================

  const fadeElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right');
  
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

});