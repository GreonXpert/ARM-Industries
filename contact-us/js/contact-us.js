// ============================================
// Contact Page JavaScript
// ============================================

document.addEventListener('DOMContentLoaded', function() {
  
  // ============================================
  // Form Validation and Submission
  // ============================================
  
  const form = document.getElementById('contactForm');
  const successMessage = document.getElementById('successMessage');
  
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
  const inputs = form.querySelectorAll('input, select, textarea');
  inputs.forEach(input => {
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
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Validate all fields
    let isValid = true;
    inputs.forEach(input => {
      if (!validateField(input)) {
        isValid = false;
      }
    });
    
    if (!isValid) {
      // Scroll to first error
      const firstError = form.querySelector('.error');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstError.focus();
      }
      return;
    }
    
    // If validation passes, show success message
    // In a real application, you would send the form data to a server here
    
    // Hide form and show success message
    form.style.display = 'none';
    successMessage.style.display = 'block';
    
    // Scroll to success message
    successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Reset form after 5 seconds (optional)
    setTimeout(() => {
      form.reset();
      form.style.display = 'flex';
      successMessage.style.display = 'none';
    }, 5000);
  });
  
});