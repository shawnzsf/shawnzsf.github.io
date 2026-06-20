/* ==========================================================================
   張寿峰 — Personal Website
   Interactivity: scroll progress, sidebar scroll-spy, mobile menu, reveals
   ========================================================================== */

(function () {
    'use strict';

    /* --------------------------------------------------------------------
       1. Footer year
       -------------------------------------------------------------------- */
    const yearEl = document.getElementById('year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }

    /* --------------------------------------------------------------------
       2. Scroll progress bar
       -------------------------------------------------------------------- */
    const progress = document.getElementById('scrollProgress');

    function updateScroll() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        if (progress) progress.style.width = pct + '%';
    }

    updateScroll();
    window.addEventListener('scroll', updateScroll, { passive: true });

    /* --------------------------------------------------------------------
       3. Mobile menu toggle (topbar)
       -------------------------------------------------------------------- */
    const topbarToggle = document.getElementById('topbarToggle');
    const mobilePanel = document.getElementById('mobilePanel');

    function closeMobileMenu() {
        if (topbarToggle) topbarToggle.classList.remove('open');
        if (mobilePanel) mobilePanel.classList.remove('open');
    }

    function openMobileMenu() {
        if (topbarToggle) topbarToggle.classList.add('open');
        if (mobilePanel) mobilePanel.classList.add('open');
    }

    if (topbarToggle && mobilePanel) {
        topbarToggle.addEventListener('click', function () {
            if (mobilePanel.classList.contains('open')) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        });

        mobilePanel.querySelectorAll('.mobile-link').forEach(function (link) {
            link.addEventListener('click', closeMobileMenu);
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') closeMobileMenu();
        });
    }

    /* --------------------------------------------------------------------
       4. Reveal-on-scroll animations (IntersectionObserver)
       -------------------------------------------------------------------- */
    const revealEls = document.querySelectorAll('.reveal');

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.12,
                rootMargin: '0px 0px -60px 0px'
            }
        );

        revealEls.forEach(function (el) {
            observer.observe(el);
        });
    } else {
        revealEls.forEach(function (el) {
            el.classList.add('visible');
        });
    }

    /* --------------------------------------------------------------------
       5. Active nav link via scroll spy (sidebar + mobile)
       -------------------------------------------------------------------- */
    const sections = document.querySelectorAll('main section[id]');
    const sideLinks = document.querySelectorAll('.side-link');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    function setActiveLink(id) {
        sideLinks.forEach(function (link) {
            link.classList.toggle('active', link.getAttribute('href') === '#' + id);
        });
        mobileLinks.forEach(function (link) {
            link.classList.toggle('active', link.getAttribute('href') === '#' + id);
        });
    }

    if ('IntersectionObserver' in window && sections.length) {
        const spyObserver = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        setActiveLink(entry.target.getAttribute('id'));
                    }
                });
            },
            {
                threshold: 0.25,
                rootMargin: '-80px 0px -55% 0px'
            }
        );

        sections.forEach(function (section) {
            spyObserver.observe(section);
        });
    }

    /* --------------------------------------------------------------------
       6. Smooth-scroll offset for fixed header (native fallback)
       -------------------------------------------------------------------- */
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#' || href.length < 2) return;

            const target = document.querySelector(href);
            if (!target) return;

            e.preventDefault();
            const top = target.getBoundingClientRect().top + window.scrollY - 20;

            window.scrollTo({
                top: top,
                behavior: 'smooth'
            });
        });
    });
})();
/* --------------------------------------------------------------------
   Gallery: category filter
   -------------------------------------------------------------------- */
(function () {
    const filters = document.querySelectorAll('.gallery-filter');
    const items = document.querySelectorAll('.gallery-item');
    if (!filters.length || !items.length) return;

    filters.forEach(function (btn) {
        btn.addEventListener('click', function () {
            // Update active state
            filters.forEach((b) => b.classList.remove('is-active'));
            this.classList.add('is-active');

            const filter = this.getAttribute('data-filter');

            items.forEach(function (item) {
                const cat = item.getAttribute('data-category');
                const show = filter === 'all' || cat === filter;
                if (show) {
                    item.classList.remove('is-hidden');
                } else {
                    item.classList.add('is-hidden');
                }
            });
        });
    });
})();
