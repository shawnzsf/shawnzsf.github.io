/* ==========================================================================
   張寿峰 — Personal Website
   Interactivity: ambient spotlight, scroll progress, sidebar scroll-spy,
   mobile menu, staggered reveals, code copy, blog tag filtering,
   gallery category filtering, lightbox with touch gestures, back-to-top
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
       2. Ambient Spotlight — cursor-tracking vermillion radial glow
       -------------------------------------------------------------------- */
    const spotlight = document.querySelector('.spotlight');
    if (spotlight) {
        let rafPending = false;
        document.addEventListener('mousemove', function (e) {
            if (rafPending) return;
            rafPending = true;
            requestAnimationFrame(function () {
                spotlight.style.background =
                    'radial-gradient(600px circle at ' +
                    e.clientX + 'px ' + e.clientY + 'px, ' +
                    'rgba(200, 68, 42, 0.04), transparent 60%)';
                rafPending = false;
            });
        }, { passive: true });
    }

    /* --------------------------------------------------------------------
       3. Scroll progress bar
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
       4. Back-to-top button
       -------------------------------------------------------------------- */
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        function toggleBackToTop() {
            if (window.scrollY > 400) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        }

        toggleBackToTop();
        window.addEventListener('scroll', toggleBackToTop, { passive: true });

        backToTop.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* --------------------------------------------------------------------
       5. Mobile menu toggle (topbar)
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
       6. Reveal-on-scroll animations with staggered delays
       -------------------------------------------------------------------- */
    const revealEls = document.querySelectorAll('.reveal');

    if ('IntersectionObserver' in window) {
        // Add stagger delays to sibling .reveal elements
        const processed = new Set();
        revealEls.forEach(function (el) {
            if (processed.has(el)) return;
            const parent = el.parentElement;
            if (!parent) return;

            const siblings = parent.querySelectorAll(':scope > .reveal');
            if (siblings.length > 1) {
                siblings.forEach(function (sib, i) {
                    sib.style.transitionDelay = (i * 80) + 'ms';
                    processed.add(sib);
                });
            }
        });

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
                threshold: 0.08,
                rootMargin: '0px 0px -30px 0px'
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
       7. Active nav link via scroll spy (sidebar + mobile)
       -------------------------------------------------------------------- */
    const sections = document.querySelectorAll('main section[id]');
    const sideLinks = document.querySelectorAll('.side-link');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    function setActiveLink(id) {
        sideLinks.forEach(function (link) {
            var href = link.getAttribute('href');
            link.classList.toggle('active', href === '#' + id || href.endsWith('#' + id));
        });
        mobileLinks.forEach(function (link) {
            var href = link.getAttribute('href');
            link.classList.toggle('active', href === '#' + id || href.endsWith('#' + id));
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
       8. Smooth-scroll offset for fixed header
       -------------------------------------------------------------------- */
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var href = this.getAttribute('href');
            if (href === '#' || href.length < 2) return;

            var target = document.querySelector(href);
            if (!target) return;

            e.preventDefault();
            var top = target.getBoundingClientRect().top + window.scrollY - 20;

            window.scrollTo({
                top: top,
                behavior: 'smooth'
            });
        });
    });

    /* --------------------------------------------------------------------
       9. Code Block Copy Buttons
       -------------------------------------------------------------------- */
    document.querySelectorAll('.code-copy-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
            var wrap = this.closest('.code-block-wrap');
            if (!wrap) return;
            var codeEl = wrap.querySelector('pre code') || wrap.querySelector('pre');
            if (!codeEl) return;

            var text = codeEl.innerText;
            navigator.clipboard.writeText(text).then(function () {
                btn.textContent = '✓ Copied';
                btn.classList.add('copied');
                setTimeout(function () {
                    btn.textContent = 'Copy';
                    btn.classList.remove('copied');
                }, 2000);
            }).catch(function () {
                btn.textContent = 'Failed';
                setTimeout(function () {
                    btn.textContent = 'Copy';
                }, 2000);
            });
        });
    });

    /* --------------------------------------------------------------------
       10. Blog: Tag Filter Bar
       -------------------------------------------------------------------- */
    const blogFilters = document.querySelectorAll('.blog-filter');
    const postItems = document.querySelectorAll('.post-item');

    if (blogFilters.length && postItems.length) {
        blogFilters.forEach(function (btn) {
            btn.addEventListener('click', function () {
                blogFilters.forEach(function (b) { b.classList.remove('is-active'); });
                this.classList.add('is-active');

                var filter = this.getAttribute('data-filter');

                postItems.forEach(function (item) {
                    if (filter === 'all') {
                        item.classList.remove('is-hidden');
                        return;
                    }

                    var tags = item.getAttribute('data-tags');
                    if (tags && tags.toLowerCase().indexOf(filter.toLowerCase()) !== -1) {
                        item.classList.remove('is-hidden');
                    } else {
                        item.classList.add('is-hidden');
                    }
                });
            });
        });
    }

    /* --------------------------------------------------------------------
       11. Gallery: Category Filter & Lightbox
       -------------------------------------------------------------------- */
    const filters = document.querySelectorAll('.gallery-filter');
    const items = document.querySelectorAll('.gallery-item');

    if (filters.length && items.length) {
        filters.forEach(function (btn) {
            btn.addEventListener('click', function () {
                filters.forEach(function (b) { b.classList.remove('is-active'); });
                this.classList.add('is-active');

                var filter = this.getAttribute('data-filter');

                items.forEach(function (item) {
                    var cat = item.getAttribute('data-category');
                    var show = filter === 'all' || cat === filter;
                    if (show) {
                        item.classList.remove('is-hidden');
                    } else {
                        item.classList.add('is-hidden');
                    }
                });
            });
        });
    }

    // Lightbox implementation with touch swipe support
    const lightbox = document.getElementById('galleryLightbox');
    if (lightbox) {
        const lbImg = lightbox.querySelector('.lightbox-img');
        const lbTitle = lightbox.querySelector('.lightbox-title');
        const lbCaption = lightbox.querySelector('.lightbox-caption');
        const lbClose = lightbox.querySelector('.lightbox-close');
        const lbPrev = lightbox.querySelector('.lightbox-prev');
        const lbNext = lightbox.querySelector('.lightbox-next');
        const lbBackdrop = lightbox.querySelector('.lightbox-backdrop');

        let currentIndex = 0;
        let visibleItems = [];

        function updateVisibleItems() {
            visibleItems = Array.from(items).filter(function (it) {
                return !it.classList.contains('is-hidden');
            });
        }

        function showPhoto(index) {
            updateVisibleItems();
            if (!visibleItems.length) return;

            currentIndex = (index + visibleItems.length) % visibleItems.length;
            var currentItem = visibleItems[currentIndex];
            var img = currentItem.querySelector('img');
            var title = currentItem.querySelector('.gallery-item-title');
            var desc = currentItem.querySelector('.gallery-item-desc');

            // Add crossfade transition
            if (lbImg) {
                lbImg.style.opacity = '0';
                setTimeout(function () {
                    if (img) {
                        lbImg.src = img.src;
                        lbImg.alt = img.alt || '';
                    }
                    lbImg.style.opacity = '1';
                }, 150);
            }
            if (lbTitle && title) lbTitle.textContent = title.textContent;
            if (lbCaption && desc) lbCaption.textContent = desc.textContent;
        }

        function openLightbox(index) {
            showPhoto(index);
            lightbox.classList.add('is-open');
            document.body.style.overflow = 'hidden';
        }

        function closeLightbox() {
            lightbox.classList.remove('is-open');
            document.body.style.overflow = '';
        }

        items.forEach(function (item) {
            item.addEventListener('click', function () {
                updateVisibleItems();
                var idx = visibleItems.indexOf(this);
                if (idx !== -1) {
                    openLightbox(idx);
                }
            });
        });

        if (lbClose) lbClose.addEventListener('click', closeLightbox);
        if (lbBackdrop) lbBackdrop.addEventListener('click', closeLightbox);
        if (lbPrev) lbPrev.addEventListener('click', function () { showPhoto(currentIndex - 1); });
        if (lbNext) lbNext.addEventListener('click', function () { showPhoto(currentIndex + 1); });

        // Keyboard navigation
        document.addEventListener('keydown', function (e) {
            if (!lightbox.classList.contains('is-open')) return;
            if (e.key === 'Escape') closeLightbox();
            else if (e.key === 'ArrowLeft') showPhoto(currentIndex - 1);
            else if (e.key === 'ArrowRight') showPhoto(currentIndex + 1);
        });

        // Touch swipe support
        let touchStartX = 0;
        let touchEndX = 0;

        lightbox.addEventListener('touchstart', function (e) {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        lightbox.addEventListener('touchend', function (e) {
            touchEndX = e.changedTouches[0].screenX;
            var diff = touchStartX - touchEndX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    showPhoto(currentIndex + 1); // swipe left → next
                } else {
                    showPhoto(currentIndex - 1); // swipe right → prev
                }
            }
        }, { passive: true });
    }

    /* --------------------------------------------------------------------
       12. Body fade-in on load
       -------------------------------------------------------------------- */
    document.body.classList.add('is-loaded');

})();
