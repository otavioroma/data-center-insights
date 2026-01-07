/**
 * Data Center Sustainability Presentation
 * JavaScript functionality for interactive elements
 */

(function() {
    'use strict';

    // DOM Elements
    const nav = document.getElementById('nav');
    const menuBtn = document.getElementById('menuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const progressBar = document.getElementById('progressBar');
    const backToTopBtn = document.getElementById('backToTop');

    // State
    let lastScrollY = 0;
    let ticking = false;

    /**
     * Initialize the presentation
     */
    function init() {
        setupScrollObserver();
        setupNavigation();
        setupMobileMenu();
        setupBackToTop();
        setupAnimations();
        setupSmoothScroll();
    }

    /**
     * Setup scroll observer for animations and progress
     */
    function setupScrollObserver() {
        window.addEventListener('scroll', function() {
            if (!ticking) {
                window.requestAnimationFrame(function() {
                    handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    /**
     * Handle scroll events
     */
    function handleScroll() {
        const scrollY = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        
        // Update progress bar
        const progress = (scrollY / docHeight) * 100;
        progressBar.style.width = progress + '%';

        // Hide/show navigation
        if (scrollY > lastScrollY && scrollY > 100) {
            nav.classList.add('hidden');
        } else {
            nav.classList.remove('hidden');
        }
        lastScrollY = scrollY;

        // Show/hide back to top button
        if (scrollY > 500) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    }

    /**
     * Setup navigation active states
     */
    function setupNavigation() {
        const sections = document.querySelectorAll('.slide[id]');
        const navLinks = document.querySelectorAll('.nav-links a, .mobile-menu a');

        const observerOptions = {
            root: null,
            rootMargin: '-50% 0px -50% 0px',
            threshold: 0
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    navLinks.forEach(function(link) {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === '#' + id) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, observerOptions);

        sections.forEach(function(section) {
            observer.observe(section);
        });
    }

    /**
     * Setup mobile menu toggle
     */
    function setupMobileMenu() {
        menuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('active');
            menuBtn.classList.toggle('active');
        });

        // Close menu when clicking a link
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(function(link) {
            link.addEventListener('click', function() {
                mobileMenu.classList.remove('active');
                menuBtn.classList.remove('active');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!mobileMenu.contains(e.target) && !menuBtn.contains(e.target)) {
                mobileMenu.classList.remove('active');
                menuBtn.classList.remove('active');
            }
        });
    }

    /**
     * Setup back to top button
     */
    function setupBackToTop() {
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    /**
     * Setup scroll-triggered animations
     */
    function setupAnimations() {
        const animatedElements = document.querySelectorAll('.animate-on-scroll');

        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -100px 0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        animatedElements.forEach(function(el) {
            observer.observe(el);
        });

        // Animate ranking bars on scroll
        const rankingBars = document.querySelectorAll('.rank-bar, .wue-bar-fill');
        const barObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.style.width = entry.target.style.getPropertyValue('--bar-width') || 
                                               entry.target.style.getPropertyValue('--wue-width') ||
                                               entry.target.dataset.width;
                    barObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        rankingBars.forEach(function(bar) {
            const computedWidth = getComputedStyle(bar).getPropertyValue('--bar-width') || 
                                  getComputedStyle(bar).getPropertyValue('--wue-width');
            if (computedWidth) {
                bar.dataset.width = computedWidth;
                bar.style.width = '0';
            }
            barObserver.observe(bar);
        });
    }

    /**
     * Setup smooth scrolling for anchor links
     */
    function setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const navHeight = nav.offsetHeight;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - navHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    /**
     * Keyboard navigation
     */
    document.addEventListener('keydown', function(e) {
        const slides = document.querySelectorAll('.slide');
        let currentSlideIndex = -1;

        // Find current slide
        slides.forEach(function(slide, index) {
            const rect = slide.getBoundingClientRect();
            if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
                currentSlideIndex = index;
            }
        });

        // Arrow down or Page Down - next slide
        if ((e.key === 'ArrowDown' || e.key === 'PageDown') && currentSlideIndex < slides.length - 1) {
            e.preventDefault();
            slides[currentSlideIndex + 1].scrollIntoView({ behavior: 'smooth' });
        }

        // Arrow up or Page Up - previous slide
        if ((e.key === 'ArrowUp' || e.key === 'PageUp') && currentSlideIndex > 0) {
            e.preventDefault();
            slides[currentSlideIndex - 1].scrollIntoView({ behavior: 'smooth' });
        }

        // Home - first slide
        if (e.key === 'Home') {
            e.preventDefault();
            slides[0].scrollIntoView({ behavior: 'smooth' });
        }

        // End - last slide
        if (e.key === 'End') {
            e.preventDefault();
            slides[slides.length - 1].scrollIntoView({ behavior: 'smooth' });
        }
    });

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();