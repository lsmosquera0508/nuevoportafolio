document.addEventListener('DOMContentLoaded', function() {

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // ==========================================
    // PRELOADER
    // ==========================================
    const preloader = document.querySelector('.preloader');
    
    window.addEventListener('load', function() {
        setTimeout(function() {
            preloader.classList.add('hidden');
            document.querySelector('.hero').classList.add('loaded');
        }, 1500);
    });
    
    // ==========================================
    // CUSTOM CURSOR (Desktop only)
    // ==========================================
    if (!reduceMotion && window.matchMedia('(min-width: 992px)').matches) {
        const cursor = document.createElement('div');
        cursor.className = 'cursor';
        document.body.appendChild(cursor);
        
        const cursorFollower = document.createElement('div');
        cursorFollower.className = 'cursor-follower';
        document.body.appendChild(cursorFollower);
        
        let mouseX = 0, mouseY = 0;
        let cursorX = 0, cursorY = 0;
        let followerX = 0, followerY = 0;
        
        document.addEventListener('mousemove', function(e) {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });
        
        function animateCursor() {
            // Smooth follow for main cursor
            cursorX += (mouseX - cursorX) * 0.2;
            cursorY += (mouseY - cursorY) * 0.2;
            
            // Slower follow for follower
            followerX += (mouseX - followerX) * 0.1;
            followerY += (mouseY - followerY) * 0.1;
            
            cursor.style.left = cursorX - 10 + 'px';
            cursor.style.top = cursorY - 10 + 'px';
            
            cursorFollower.style.left = followerX - 20 + 'px';
            cursorFollower.style.top = followerY - 20 + 'px';
            
            requestAnimationFrame(animateCursor);
        }
        animateCursor();
        
        // Hover effect on interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .btn, .gallery-item, .specialty-card, .blog-card');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', function() {
                cursor.classList.add('hover');
                cursorFollower.style.width = '60px';
                cursorFollower.style.height = '60px';
            });
            el.addEventListener('mouseleave', function() {
                cursor.classList.remove('hover');
                cursorFollower.style.width = '40px';
                cursorFollower.style.height = '40px';
            });
        });
    }
    
    // ==========================================
    // NAVBAR SCROLL EFFECT
    // ==========================================
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
    
    // ==========================================
    // MOBILE MENU TOGGLE
    // ==========================================
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    if (navbarToggler) {
        navbarToggler.addEventListener('click', function() {
            this.classList.toggle('active');
        });
    }
    
    // Close mobile menu on link click
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            if (navbarCollapse.classList.contains('show')) {
                navbarToggler.click();
            }
        });
    });
    
    // ==========================================
    // SMOOTH SCROLL
    // ==========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // ==========================================
    // CHEF'S TABLE / TASTING MENU SECTION
    // ==========================================
    const tastingTrack = document.getElementById('tastingTrack');
    const tastingProgress = document.getElementById('tastingProgress');
    const tastingParallaxBg = document.getElementById('tastingParallaxBg');

    // Horizontal drag-to-scroll (desktop)
    if (tastingTrack) {
        let isDown = false;
        let startX;
        let scrollLeft;

        tastingTrack.addEventListener('mousedown', function(e) {
            isDown = true;
            startX = e.pageX - tastingTrack.offsetLeft;
            scrollLeft = tastingTrack.scrollLeft;
        });

        tastingTrack.addEventListener('mouseleave', function() {
            isDown = false;
            tastingTrack.classList.remove('dragging');
        });

        tastingTrack.addEventListener('mouseup', function() {
            isDown = false;
            tastingTrack.classList.remove('dragging');
        });

        tastingTrack.addEventListener('mousemove', function(e) {
            if (!isDown) return;
            e.preventDefault();
            tastingTrack.classList.add('dragging');
            const x = e.pageX - tastingTrack.offsetLeft;
            tastingTrack.scrollLeft = scrollLeft - (x - startX);
        });

        // Update progress bar
        function updateTastingProgress() {
            const max = tastingTrack.scrollWidth - tastingTrack.clientWidth;
            const pct = max > 0 ? (tastingTrack.scrollLeft / max) * 100 : 0;
            tastingProgress.style.width = Math.max(15, pct) + '%';
        }

        tastingTrack.addEventListener('scroll', updateTastingProgress, { passive: true });
        window.addEventListener('resize', updateTastingProgress);
        updateTastingProgress();
    }

    // Parallax background on scroll
    if (tastingParallaxBg && !reduceMotion) {
        const tastingSection = tastingParallaxBg.closest('.tasting-section');
        let ticking = false;

        function updateTastingParallax() {
            const rect = tastingSection.getBoundingClientRect();
            const windowH = window.innerHeight;
            if (rect.bottom > 0 && rect.top < windowH) {
                // Progress from -1 to 1 as the section passes through the viewport
                const progress = (rect.top + rect.height / 2 - windowH / 2) / (windowH / 2 + rect.height / 2);
                tastingParallaxBg.style.transform = 'translateY(' + (progress * -60) + 'px)';
            }
            ticking = false;
        }

        window.addEventListener('scroll', function() {
            if (!ticking) {
                window.requestAnimationFrame(updateTastingParallax);
                ticking = true;
            }
        }, { passive: true });

        updateTastingParallax();
    }

    // ==========================================
    // AOS INITIALIZATION (Animate On Scroll)
    // ==========================================
    if (typeof AOS !== 'undefined') {
        AOS.init({
            disable: reduceMotion,
            duration: 1000,
            easing: 'ease-out-cubic',
            once: true,
            offset: 100,
            delay: 100
        });
    }
    
    // ==========================================
    // SWIPER SLIDERS
    // ==========================================
    
    // Testimonials Slider
    if (document.querySelector('.testimonials-slider')) {
        new Swiper('.testimonials-slider', {
            slidesPerView: 1,
            spaceBetween: 30,
            loop: true,
            autoplay: reduceMotion ? false : {
                delay: 5000,
                disableOnInteraction: false,
            },
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
                },
                992: {
                    slidesPerView: 3,
                }
            }
        });
    }
    
    // Gallery Slider (if exists)
    if (document.querySelector('.gallery-slider')) {
        new Swiper('.gallery-slider', {
            slidesPerView: 1,
            spaceBetween: 20,
            loop: true,
            autoplay: reduceMotion ? false : {
                delay: 4000,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            breakpoints: {
                576: {
                    slidesPerView: 2,
                },
                768: {
                    slidesPerView: 3,
                },
                992: {
                    slidesPerView: 4,
                }
            }
        });
    }
    
    // Hero Slider (if exists on other pages)
    if (document.querySelector('.hero-slider')) {
        new Swiper('.hero-slider', {
            slidesPerView: 1,
            spaceBetween: 0,
            loop: true,
            effect: 'fade',
            fadeEffect: {
                crossFade: true
            },
            autoplay: reduceMotion ? false : {
                delay: 6000,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            }
        });
    }
    
    // ==========================================
    // FORM VALIDATION & SUBMISSION
    // ==========================================
    
    // Phone input - only numbers
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            this.value = this.value.replace(/[^0-9+\-\s()]/g, '');
        });
    });
    
    // Reservation, contact, private-event and newsletter forms.
    // Every form is validated in the browser. To actually send the data, add a
    // data-endpoint="https://..." attribute to the <form> (Formspree, Netlify,
    // your own API). Without it the form runs in demo mode: it validates and
    // shows the confirmation, but sends nothing.
    const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    const PHONE_RE = /^[0-9+\-\s()]{7,20}$/;
    const FORM_MESSAGES = {
        reservationForm: ['Reservation Received', 'Thank you for your reservation. We will confirm your booking shortly.'],
        contactForm: ['Message Sent', 'Thank you for contacting us. We will respond within 24 hours.'],
        newsletter: ['Subscribed!', 'Thank you for subscribing to our newsletter.']
    };
    let fieldCounter = 0;

    function clearError(field) {
        field.classList.remove('is-invalid');
        field.removeAttribute('aria-invalid');
        field.removeAttribute('aria-describedby');
        const scope = field.closest('.form-group') || field.parentElement;
        const err = scope && scope.querySelector('.field-error');
        if (err) err.remove();
    }

    function fieldProblem(field) {
        const value = field.value.trim();
        if (field.required && !value) return 'This field is required.';
        if (!value) return '';
        if (field.type === 'email' && !EMAIL_RE.test(value)) return 'Enter a valid email address.';
        if (field.type === 'tel' && !PHONE_RE.test(value)) return 'Enter a valid phone number.';
        if (field.type === 'date' && field.min && value < field.min) return 'Choose today or a later date.';
        if (field.type === 'number') {
            const n = Number(value);
            if (field.min && n < Number(field.min)) return 'The minimum is ' + field.min + '.';
            if (field.max && n > Number(field.max)) return 'The maximum is ' + field.max + '.';
        }
        return '';
    }

    function showError(field, message) {
        field.classList.add('is-invalid');
        field.setAttribute('aria-invalid', 'true');
        if (field.closest('.input-group')) return; // compact newsletter field: highlight only
        if (!field.id) field.id = 'field-' + (++fieldCounter);
        const err = document.createElement('div');
        err.className = 'field-error';
        err.id = field.id + '-error';
        err.setAttribute('role', 'alert');
        err.textContent = message;
        field.insertAdjacentElement('afterend', err);
        field.setAttribute('aria-describedby', err.id);
    }

    function validateForm(form) {
        let firstInvalid = null;
        form.querySelectorAll('input, select, textarea').forEach(function(field) {
            if (['radio', 'checkbox', 'hidden', 'submit', 'button'].indexOf(field.type) !== -1 || field.disabled) return;
            clearError(field);
            const problem = fieldProblem(field);
            if (problem) {
                showError(field, problem);
                if (!firstInvalid) firstInvalid = field;
            }
        });
        if (firstInvalid) firstInvalid.focus();
        return !firstInvalid;
    }

    function showFormStatus(form, message) {
        let status = form.querySelector('.form-status');
        if (!status) {
            status = document.createElement('p');
            status.className = 'form-status';
            status.setAttribute('role', 'alert');
            form.appendChild(status);
        }
        status.textContent = message;
    }

    function submitForm(form) {
        const btn = form.querySelector('button[type="submit"]');
        const original = btn ? btn.innerHTML : '';
        const status = form.querySelector('.form-status');
        if (status) status.remove();
        if (btn) { btn.disabled = true; btn.innerHTML = '<span class="loading"></span>'; }

        const messages = FORM_MESSAGES[form.id] || FORM_MESSAGES[form.classList.contains('newsletter-form') ? 'newsletter' : ''] || ['Thank you', 'Your request has been received.'];
        const title = form.dataset.successTitle || messages[0];
        const text = form.dataset.successText || messages[1];
        const finish = function() { if (btn) { btn.innerHTML = original; btn.disabled = false; } };
        const succeed = function() { showModal(title, text); form.reset(); finish(); };
        const fail = function() { showFormStatus(form, 'Something went wrong. Please try again or contact us directly.'); finish(); };

        if (!form.dataset.endpoint) { setTimeout(succeed, 800); return; } // demo mode
        fetch(form.dataset.endpoint, { method: 'POST', body: new FormData(form), headers: { 'Accept': 'application/json' } })
            .then(function(response) { return response.ok ? succeed() : fail(); })
            .catch(fail);
    }

    document.querySelectorAll('form.reservation-form, form.newsletter-form').forEach(function(form) {
        form.setAttribute('novalidate', '');
        form.addEventListener('input', function(e) { if (e.target.classList && e.target.classList.contains('is-invalid')) clearError(e.target); });
        form.addEventListener('change', function(e) { if (e.target.classList && e.target.classList.contains('is-invalid')) clearError(e.target); });
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            if (validateForm(form)) submitForm(form);
        });
    });
    
    // ==========================================
    // MODAL FUNCTIONALITY
    // ==========================================
    function showModal(title, text) {
        // Remove existing modal
        const existingModal = document.querySelector('.modal-overlay');
        if (existingModal) {
            existingModal.remove();
        }
        
        // Create modal
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        modal.setAttribute('aria-labelledby', 'modalTitle');
        modal.innerHTML = `
            <div class="modal-content">
                <button class="modal-close" aria-label="Close">&times;</button>
                <div class="modal-icon">✓</div>
                <h3 class="modal-title" id="modalTitle">${title}</h3>
                <p class="modal-text">${text}</p>
                <button class="btn btn-primary modal-btn">Close</button>
            </div>
        `;
        
        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';
        
        // Trigger animation
        setTimeout(() => {
            modal.classList.add('active');
            modal.querySelector('.modal-btn').focus();
        }, 10);
        
        // Close handlers
        const closeModal = function() {
            modal.classList.remove('active');
            setTimeout(() => {
                modal.remove();
                document.body.style.overflow = '';
            }, 300);
        };
        
        modal.querySelector('.modal-close').addEventListener('click', closeModal);
        modal.querySelector('.modal-btn').addEventListener('click', closeModal);
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });
        
        // Close on Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeModal();
            }
        });
    }
    
    // Make showModal globally available
    window.showModal = showModal;
    
    // ==========================================
    // GALLERY LIGHTBOX
    // ==========================================
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    if (galleryItems.length > 0) {
        galleryItems.forEach(item => {
            item.addEventListener('click', function() {
                const img = this.querySelector('img');
                const src = img.getAttribute('src');
                
                // Create lightbox
                const lightbox = document.createElement('div');
                lightbox.className = 'lightbox';
                lightbox.innerHTML = `
                    <button class="lightbox-close">&times;</button>
                    <img src="${src}" alt="Gallery Image">
                `;
                
                document.body.appendChild(lightbox);
                document.body.style.overflow = 'hidden';
                
                setTimeout(() => {
                    lightbox.classList.add('active');
                }, 10);
                
                const closeLightbox = function() {
                    lightbox.classList.remove('active');
                    setTimeout(() => {
                        lightbox.remove();
                        document.body.style.overflow = '';
                    }, 300);
                };
                
                lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
                lightbox.addEventListener('click', function(e) {
                    if (e.target === lightbox) {
                        closeLightbox();
                    }
                });
                
                document.addEventListener('keydown', function(e) {
                    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
                        closeLightbox();
                    }
                });
            });
        });
    }
    
    // ==========================================
    // PARALLAX EFFECT
    // ==========================================
    const parallaxElements = document.querySelectorAll('.parallax-bg');
    
    if (!reduceMotion && parallaxElements.length > 0 && window.matchMedia('(min-width: 992px)').matches) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            
            parallaxElements.forEach(el => {
                const speed = el.dataset.speed || 0.5;
                const yPos = -(scrolled * speed);
                el.style.transform = `translateY(${yPos}px)`;
            });
        });
    }
    
    // ==========================================
    // COUNTER ANIMATION
    // ==========================================
    const counters = document.querySelectorAll('.counter');
    
    if (counters.length > 0) {
        const animateCounter = function(el) {
            const target = parseInt(el.getAttribute('data-target'));
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;
            
            const timer = setInterval(function() {
                current += step;
                if (current >= target) {
                    el.textContent = target;
                    clearInterval(timer);
                } else {
                    el.textContent = Math.floor(current);
                }
            }, 16);
        };
        
        // Intersection Observer for counters
        const counterObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        counters.forEach(counter => {
            counterObserver.observe(counter);
        });
    }
    
    // ==========================================
    // LAZY LOADING IMAGES
    // ==========================================
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        img.classList.add('loaded');
                    }
                    imageObserver.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    // ==========================================
    // DATE INPUT MIN VALUE (today)
    // ==========================================
    const dateInputs = document.querySelectorAll('input[type="date"]');
    const now = new Date();
    const today = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0');
    
    dateInputs.forEach(input => {
        input.setAttribute('min', today);
    });
    
    // ==========================================
    // SCROLL REVEAL FOR MENU ITEMS
    // ==========================================
    const menuItems = document.querySelectorAll('.menu-item');
    
    if (menuItems.length > 0 && !reduceMotion) {
        const menuObserver = new IntersectionObserver(function(entries) {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateX(0)';
                    }, index * 100);
                    menuObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        
        menuItems.forEach(item => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(-20px)';
            item.style.transition = 'all 0.6s ease';
            menuObserver.observe(item);
        });
    }
    
    // ==========================================
    // NAVBAR ACTIVE LINK
    // ==========================================
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
            link.classList.add('active');
        }
    });
    
    // ==========================================
    // TOOLTIP INITIALIZATION (Bootstrap)
    // ==========================================
    if (typeof bootstrap !== 'undefined') {
        const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
        tooltipTriggerList.forEach(function(tooltipTriggerEl) {
            new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }
    
    // ==========================================
    // COMING SOON POPUP (for unfinished links)
    // ==========================================
    document.querySelectorAll('[data-coming-soon]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            showModal('Coming Soon', 'This feature will be available in the next update. Stay tuned!');
        });
    });
    
});

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

// Debounce function
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

// Throttle function
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Format currency
function formatCurrency(amount, currency = 'USD') {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency
    }).format(amount);
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