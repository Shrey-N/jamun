// Loading Screen Animation
window.addEventListener('load', function() {
    const loadingScreen = document.getElementById('loading-screen');
    setTimeout(() => {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 150);
    }, 100);
});

// Navigation Scroll Effect
window.addEventListener('scroll', function() {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile Navigation Toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

hamburger.addEventListener('click', function() {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        // Only apply smooth scrolling to anchors within the same page
        // Skip anchors that are part of a different page URL (like committees.html#unga)
        if (!this.href.includes('.html')) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// Animated Counter
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start);
        }
    }, 16);
}

// Intersection Observer for Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            entry.target.classList.remove('hidden');
            
            // Animate counters when hero section is visible
            if (entry.target.classList.contains('hero')) {
                const counters = document.querySelectorAll('.stat-number');
                counters.forEach(counter => {
                    const target = parseInt(counter.getAttribute('data-target'));
                    animateCounter(counter, target);
                });
            }
            
            // Add staggered animation to committee cards
            if (entry.target.classList.contains('committees-grid')) {
                const cards = entry.target.querySelectorAll('.committee-card');
                cards.forEach((card, index) => {
                    setTimeout(() => {
                        card.style.animation = `fadeInUp 0.6s ease-out ${index * 0.1}s both`;
                    }, index * 100);
                });
            }
            
            // Add staggered animation to about cards
            if (entry.target.classList.contains('about-grid')) {
                const cards = entry.target.querySelectorAll('.about-card');
                cards.forEach((card, index) => {
                    setTimeout(() => {
                        card.style.animation = `fadeInUp 0.6s ease-out ${index * 0.1}s both`;
                    }, index * 150);
                });
            }
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', function() {
    const animatedElements = document.querySelectorAll('.hero, .about-grid, .committees-grid, .secretariat-grid, .contact-grid');
    animatedElements.forEach(el => {
        el.classList.add('hidden');
        observer.observe(el);
    });
    
    // Trigger counter animation on page load
    setTimeout(() => {
        const counters = document.querySelectorAll('.stat-number');
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            animateCounter(counter, target);
        });
    }, 300);
    
    // Initialize particles
    createParticles();
    
    // Initialize form validation
    initFormValidation();
});

// Particle Animation
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const numberOfParticles = 50;
    
    for (let i = 0; i < numberOfParticles; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random position
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        
        // Random animation delay
        particle.style.animationDelay = Math.random() * 6 + 's';
        particle.style.animationDuration = (Math.random() * 3 + 3) + 's';
        
        particlesContainer.appendChild(particle);
    }
}

// Committee Card Hover Effects
document.addEventListener('DOMContentLoaded', function() {
    const committeeCards = document.querySelectorAll('.committee-card');
    
    committeeCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
        
        // Add click animation
        card.addEventListener('click', function() {
            this.style.transform = 'translateY(-5px) scale(0.98)';
            setTimeout(() => {
                this.style.transform = 'translateY(-10px) scale(1.02)';
            }, 150);
        });
    });
});

// Form Validation and Submission
function initFormValidation() {
    const form = document.getElementById('registration-form');
    const inputs = form.querySelectorAll('input, select');
    
    // Add real-time validation
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
    
    // Handle form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        let isValid = true;
        inputs.forEach(input => {
            if (!validateField(input)) {
                isValid = false;
            }
        });
        
        if (isValid) {
            submitForm(form);
        }
    });
}

function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    
    // Remove previous error styling
    field.classList.remove('error');
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Check if field is required and empty
    if (field.hasAttribute('required') && !value) {
        showFieldError(field, 'This field is required');
        isValid = false;
    }
    
    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showFieldError(field, 'Please enter a valid email address');
            isValid = false;
        }
    }
    
    return isValid;
}

function showFieldError(field, message) {
    field.classList.add('error');
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    errorElement.style.color = '#ff6b6b';
    errorElement.style.fontSize = '0.85rem';
    errorElement.style.marginTop = '5px';
    field.parentNode.appendChild(errorElement);
}

function submitForm(form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Registering...';
    submitBtn.disabled = true;
    
    // Simulate form submission
    setTimeout(() => {
        showSuccessMessage();
        form.reset();
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }, 2000);
}

function showSuccessMessage() {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.innerHTML = `
        <div style="
            background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
            color: white;
            padding: 20px;
            border-radius: 10px;
            text-align: center;
            margin-top: 20px;
            animation: fadeInUp 0.5s ease-out;
        ">
            <i class="fas fa-check-circle" style="font-size: 2rem; margin-bottom: 10px;"></i>
            <h3 style="margin: 0 0 10px 0;">Registration Successful!</h3>
            <p style="margin: 0; opacity: 0.9;">Thank you for registering for JAMUN'25. We'll contact you soon with further details.</p>
        </div>
    `;
    
    const form = document.getElementById('registration-form');
    form.appendChild(successDiv);
    
    // Remove success message after 5 seconds
    setTimeout(() => {
        successDiv.remove();
    }, 5000);
}

// Parallax Effect for Hero Section
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.hero-background');
    
    parallaxElements.forEach(element => {
        const speed = 0.5;
        element.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// Advanced Hover Effects for Secretariat Members
document.addEventListener('DOMContentLoaded', function() {
    const memberCards = document.querySelectorAll('.secretariat-member');
    
    memberCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            // Add subtle glow effect
            this.style.boxShadow = '0 20px 60px rgba(79, 172, 254, 0.3)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.boxShadow = '0 10px 40px rgba(0, 0, 0, 0.08)';
        });
    });
});

// Dynamic Navigation Highlighting
window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        const sectionHeight = section.clientHeight;
        if (sectionTop <= 200 && sectionTop + sectionHeight > 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Add CSS for active nav links
const style = document.createElement('style');
style.textContent = `
    .nav-link.active {
        color: #1e3c72 !important;
    }
    
    .nav-link.active::after {
        width: 100% !important;
    }
    
    .form-group input.error,
    .form-group select.error {
        border-color: #ff6b6b !important;
        background: rgba(255, 107, 107, 0.1) !important;
    }
    
    @media (max-width: 768px) {
        .hamburger.active span:nth-child(1) {
            transform: rotate(45deg) translate(5px, 5px);
        }
        
        .hamburger.active span:nth-child(2) {
            opacity: 0;
        }
        
        .hamburger.active span:nth-child(3) {
            transform: rotate(-45deg) translate(7px, -6px);
        }
    }
`;
document.head.appendChild(style);

// Add click handlers for background guide buttons (if they exist)
document.addEventListener('DOMContentLoaded', function() {
    const guideButtons = document.querySelectorAll('[class*="background"]');
    guideButtons.forEach(button => {
        // Remove default click behavior - buttons will work normally with their href
        button.addEventListener('click', function(e) {
            // Let the link work normally, don't prevent default
        });
    });
});

// Performance optimization: Debounce scroll events
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

// Apply debouncing to scroll events
const debouncedScrollHandler = debounce(function() {
    // Your scroll handling code here
}, 16);

window.addEventListener('scroll', debouncedScrollHandler);

// Add loading states to all interactive elements
document.addEventListener('DOMContentLoaded', function() {
    const interactiveElements = document.querySelectorAll('button, .btn-primary, .btn-secondary');
    
    interactiveElements.forEach(element => {
        element.addEventListener('click', function() {
            // Add subtle loading animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
});

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('JAMUN\'25 Website Initialized Successfully! 🎉');
    
    // Add entrance animations to hero elements
    setTimeout(() => {
        const heroElements = document.querySelectorAll('.hero-badge, .un-emblem, .hero-title, .hero-subtitle, .hero-stats, .hero-buttons');
        heroElements.forEach((element, index) => {
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 200);
        });
    }, 500);
});