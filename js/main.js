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
       2. Ambient Spotlight — cursor-tracking ocean blue radial glow
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
                    'rgba(43, 92, 138, 0.025), transparent 60%)';
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

        // Immediately reveal elements already in viewport on page load
        // Small delay to ensure layout is computed
        setTimeout(function() {
            revealEls.forEach(function(el) {
                if (el.classList.contains('visible')) return;
                const rect = el.getBoundingClientRect();
                const inView = rect.top < window.innerHeight * 0.9 && rect.bottom > 0;
                if (inView) {
                    el.classList.add('visible');
                }
            });
        }, 100);
    } else {
        revealEls.forEach(function (el) {
            el.classList.add('visible');
        });
    }

    /* --------------------------------------------------------------------
       7. Active nav link via scroll spy (dock + sidebar + mobile)
       -------------------------------------------------------------------- */
    const sections = document.querySelectorAll('section[id], main section[id]');
    const sideLinks = document.querySelectorAll('.side-link');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    const dockLinks = document.querySelectorAll('.dock-link');

    function setActiveLink(id) {
        sideLinks.forEach(function (link) {
            var href = link.getAttribute('href');
            link.classList.toggle('active', href === '#' + id || href.endsWith('#' + id));
        });
        mobileLinks.forEach(function (link) {
            var href = link.getAttribute('href');
            link.classList.toggle('active', href === '#' + id || href.endsWith('#' + id));
        });
        dockLinks.forEach(function (link) {
            var href = link.getAttribute('href');
            var sec = link.getAttribute('data-sec');
            link.classList.toggle('active', href === '#' + id || sec === id);
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
                threshold: 0.2,
                rootMargin: '-80px 0px -50% 0px'
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
       12. 3D Fine Blue Sand Tray & Magnetic Field Wave Simulation
       Models an authentic tactile Zen sand tray with fine oceanic blue sand
       grains organized in 3D harmonic magnetic flux streamlines and waves.
       Features granular dry-sand physics with viscous damping and gentle
       cursor repulsion ("温柔地挪动一点").
       -------------------------------------------------------------------- */
    try {
        const sandCanvas = document.getElementById('sandCanvas');
        if (sandCanvas && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            const ctx = sandCanvas.getContext('2d');
            const heroSec = document.getElementById('hero') || sandCanvas.parentElement;
            let isRunning = true;
            let rafId = null;
            let width = 0;
            let height = 0;
            let dpr = 1;

            // Granular risograph sand pigments (mineral, non-glossy, matte)
            const sandColors = [
                'rgba(29, 68, 108, ',  // Prussian Deep Indigo (42%)
                'rgba(43, 92, 138, ',  // Ultramarine Ocean Blue (35%)
                'rgba(77, 125, 159, ', // Slate Blue Dust (18%)
                'rgba(200, 68, 42, '   // Cinnabar Iron-Oxide Accent (5%)
            ];

            const PARTICLE_COUNT = 3000;
            const STREAMLINE_COUNT = 38;

            // Bank of screenprint & Risograph ink stipples (丝网印迹 / 矿物细网点 / 套印偏差)
            const SPRITE_COUNT = 32;
            const mineralSprites = [];
            const SPRITE_BASE_PX = 8;

            function createMineralSprites() {
                mineralSprites.length = 0;
                // Screenprint / Risograph ink palette:
                // Prussian Indigo, Ultramarine Blue, Slate Mineral, Carbon Umber, Cinnabar Seal
                const printInks = [
                    '#152C4A', // Deep Prussian Indigo (40%)
                    '#1E4774', // Mineral Ultramarine (35%)
                    '#3B678D', // Weathered Slate Blue (15%)
                    '#4A3C32', // Carbon Umber (6%)
                    '#B83924'  // Cinnabar Seal Red (4%)
                ];

                for (let s = 0; s < SPRITE_COUNT; s++) {
                    const sc = document.createElement('canvas');
                    sc.width = Math.round(SPRITE_BASE_PX * dpr);
                    sc.height = Math.round(SPRITE_BASE_PX * dpr);
                    const sctx = sc.getContext('2d');
                    sctx.scale(dpr, dpr);

                    let inkColor;
                    if (s < 14) inkColor = printInks[0];
                    else if (s < 24) inkColor = printInks[1];
                    else if (s < 28) inkColor = printInks[2];
                    else if (s < 30) inkColor = printInks[3];
                    else inkColor = printInks[4];

                    const center = SPRITE_BASE_PX * 0.5; // 4.0
                    const baseRadius = 1.3 + (s % 4) * 0.35; // 1.3 ~ 2.35px
                    const numVertices = 4 + (s % 4); // 4 to 7 edges

                    // 1. Base screenprint ink deposit with organic paper edge tooth
                    sctx.beginPath();
                    for (let v = 0; v < numVertices; v++) {
                        const angle = (v / numVertices) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
                        const r = baseRadius * (0.75 + Math.random() * 0.5);
                        const vx = center + Math.cos(angle) * r;
                        const vy = center + Math.sin(angle) * r;
                        if (v === 0) sctx.moveTo(vx, vy);
                        else sctx.lineTo(vx, vy);
                    }
                    sctx.closePath();
                    sctx.fillStyle = inkColor;
                    sctx.fill();

                    // 2. Ink overprinting (油墨叠压) & porous paper texture
                    if (s % 3 === 1) {
                        // Microscopic fiber void (paper tooth showing through uneven ink)
                        sctx.clearRect(center + (Math.random() - 0.5) * 1.0, center + (Math.random() - 0.5) * 1.0, 0.9, 0.9);
                    } else if (s % 3 === 2) {
                        // Ink overprint glaze (dense core)
                        sctx.fillStyle = '#0F1E33';
                        sctx.fillRect(center - 0.5, center - 0.5, 1.2, 1.2);
                    }

                    // 3. Risograph misregistration (轻微套印偏差)
                    // ~30% of sprites carry a micro offset mark in a secondary ink layer
                    if (s % 3 === 0) {
                        const misColor = (s % 6 === 0) ? '#B83924' : '#5A483B';
                        const misOffsetX = (Math.random() - 0.4) * 1.1;
                        const misOffsetY = (Math.random() - 0.4) * 1.1;
                        sctx.fillStyle = misColor;
                        sctx.fillRect(center + misOffsetX, center + misOffsetY, 0.85, 0.85);
                    }

                    mineralSprites.push(sc);
                }
            }

            // Coordinate & physics buffers (zero per-frame allocations)
            const baseRad = new Float32Array(PARTICLE_COUNT);
            const baseAng = new Float32Array(PARTICLE_COUNT);
            const baseAmp = new Float32Array(PARTICLE_COUNT);

            // Precomputed static trigonometry & phase offsets
            const unitX = new Float32Array(PARTICLE_COUNT);
            const unitY = new Float32Array(PARTICLE_COUNT);
            const phase1 = new Float32Array(PARTICLE_COUNT);
            const phase3 = new Float32Array(PARTICLE_COUNT);
            const basePixelSize = new Float32Array(PARTICLE_COUNT);

            // Dynamic perturbations from mouse interaction
            const dispX = new Float32Array(PARTICLE_COUNT);
            const dispY = new Float32Array(PARTICLE_COUNT);
            const velX = new Float32Array(PARTICLE_COUNT);
            const velY = new Float32Array(PARTICLE_COUNT);

            // Visual traits
            const grainSize = new Float32Array(PARTICLE_COUNT);
            const grainSprite = new Uint8Array(PARTICLE_COUNT);
            const streamlineIdx = new Uint8Array(PARTICLE_COUNT);

            // Initialize sand particles along magnetic flux lines and ambient surface
            let pIdx = 0;
            const particlesPerLine = Math.floor((PARTICLE_COUNT * 0.82) / STREAMLINE_COUNT);

            for (let s = 0; s < STREAMLINE_COUNT; s++) {
                const normRing = (s + 0.5) / STREAMLINE_COUNT; // 0..1
                const ringRad = 0.12 + Math.pow(normRing, 0.85) * 0.86; // Distributed across tray

                for (let k = 0; k < particlesPerLine && pIdx < PARTICLE_COUNT; k++) {
                    const ang = (k / particlesPerLine) * Math.PI * 2 + (s * 0.18);
                    const jitterR = (Math.random() - 0.5) * 0.032;
                    const jitterA = (Math.random() - 0.5) * 0.045;

                    const r = Math.min(1.0, Math.max(0.05, ringRad + jitterR));
                    const a = ang + jitterA;
                    baseRad[pIdx] = r;
                    baseAng[pIdx] = a;
                    baseAmp[pIdx] = 0.7 + Math.random() * 0.6;

                    // Precompute static unit coordinates & phases
                    unitX[pIdx] = Math.cos(a) * r;
                    unitY[pIdx] = Math.sin(a) * r;
                    phase1[pIdx] = r * 4.2 + a * 2.0;
                    phase3[pIdx] = a * 3.0;

                    // Fine sand grain size (~2.5px to 4px)
                    grainSize[pIdx] = 0.35 + Math.random() * 0.35;
                    basePixelSize[pIdx] = SPRITE_BASE_PX * grainSize[pIdx];
                    grainSprite[pIdx] = Math.floor(Math.random() * SPRITE_COUNT);

                    streamlineIdx[pIdx] = s;
                    pIdx++;
                }
            }

            // Fill remaining particles with organic scattered ambient sand
            while (pIdx < PARTICLE_COUNT) {
                const r = Math.sqrt(Math.random()) * 0.98;
                const a = Math.random() * Math.PI * 2;
                baseRad[pIdx] = r;
                baseAng[pIdx] = a;
                baseAmp[pIdx] = 0.5 + Math.random() * 0.5;

                unitX[pIdx] = Math.cos(a) * r;
                unitY[pIdx] = Math.sin(a) * r;
                phase1[pIdx] = r * 4.2 + a * 2.0;
                phase3[pIdx] = a * 3.0;

                grainSize[pIdx] = 0.30 + Math.random() * 0.32;
                basePixelSize[pIdx] = SPRITE_BASE_PX * grainSize[pIdx];
                grainSprite[pIdx] = Math.floor(Math.random() * SPRITE_COUNT);
                streamlineIdx[pIdx] = 255;
                pIdx++;
            }

            // Mouse interaction state with cached rect to avoid synchronous reflows
            let mouseX = -9999;
            let mouseY = -9999;
            let targetMouseX = -9999;
            let targetMouseY = -9999;
            let mouseActive = false;
            let canvasLeft = 0;
            let canvasTop = 0;

            function updateCanvasRect() {
                if (sandCanvas) {
                    const rect = sandCanvas.getBoundingClientRect();
                    canvasLeft = rect.left;
                    canvasTop = rect.top;
                }
            }

            function onMouseMove(e) {
                targetMouseX = e.clientX - canvasLeft;
                targetMouseY = e.clientY - canvasTop;
                mouseActive = true;
            }

            function onMouseLeave() {
                targetMouseX = -9999;
                targetMouseY = -9999;
                mouseActive = false;
            }

            if (heroSec) {
                heroSec.addEventListener('mouseenter', updateCanvasRect, { passive: true });
                heroSec.addEventListener('mousemove', onMouseMove, { passive: true });
                heroSec.addEventListener('mouseleave', onMouseLeave, { passive: true });
                heroSec.addEventListener('touchmove', function (e) {
                    if (e.touches && e.touches[0]) {
                        targetMouseX = e.touches[0].clientX - canvasLeft;
                        targetMouseY = e.touches[0].clientY - canvasTop;
                        mouseActive = true;
                    }
                }, { passive: true });
                heroSec.addEventListener('touchend', onMouseLeave, { passive: true });
            }

            window.addEventListener('scroll', updateCanvasRect, { passive: true });

            // Resize canvas to match display size (capping DPR to 1.5 for optimal performance)
            function resize() {
                if (!sandCanvas) return;
                dpr = Math.min(window.devicePixelRatio || 1, 1.5);
                width = sandCanvas.clientWidth || window.innerWidth;
                height = sandCanvas.clientHeight || window.innerHeight;
                sandCanvas.width = Math.round(width * dpr);
                sandCanvas.height = Math.round(height * dpr);
                ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
                createMineralSprites();
                updateCanvasRect();
            }

            window.addEventListener('resize', resize, { passive: true });
            resize();

            // IntersectionObserver to pause animation when scrolled past hero
            if ('IntersectionObserver' in window && heroSec) {
                const observer = new IntersectionObserver(function (entries) {
                    entries.forEach(function (entry) {
                        isRunning = entry.isIntersecting;
                        if (isRunning && !rafId) {
                            rafId = requestAnimationFrame(render);
                        }
                    });
                }, { threshold: 0.05 });
                observer.observe(heroSec);
            }

            // High-Performance 3D Rendering & Simulation Loop
            let startTime = performance.now();
            const TILT = 52 * (Math.PI / 180);
            const COS_TILT = Math.cos(TILT);
            const SIN_TILT = Math.sin(TILT);
            const FOCAL = 620;

            function render(now) {
                if (!isRunning) {
                    rafId = null;
                    return;
                }

                // Smooth mouse interpolation
                if (mouseActive) {
                    mouseX += (targetMouseX - mouseX) * 0.18;
                    mouseY += (targetMouseY - mouseY) * 0.18;
                } else {
                    mouseX += (targetMouseX - mouseX) * 0.1;
                    mouseY += (targetMouseY - mouseY) * 0.1;
                }

                ctx.clearRect(0, 0, width, height);

                const elapsed = now - startTime;
                const yaw = elapsed * 0.00012;
                const cosYaw = Math.cos(yaw);
                const sinYaw = Math.sin(yaw);

                const t1 = elapsed * 0.0015;
                const t2a = elapsed * 0.0011;
                const t2b = elapsed * 0.0007;
                const t3 = elapsed * 0.0005;

                // Tray dimensions & center
                const cx = width * 0.5;
                const cy = height * 0.52;
                const trayRadius = Math.min(width, height) * 0.58;
                const waveAmp = Math.min(48, height * 0.065);

                // Draw subtle sand bed boundary contour (tactile Zen raked boundary)
                ctx.beginPath();
                ctx.ellipse(cx, cy, trayRadius * 0.98, trayRadius * 0.98 * COS_TILT, 0, 0, Math.PI * 2);
                ctx.strokeStyle = 'rgba(21, 44, 74, 0.08)';
                ctx.lineWidth = 1;
                ctx.setLineDash([3, 5]);
                ctx.stroke();

                const hoverRadius = 135;
                const hoverRadiusSq = hoverRadius * hoverRadius;
                const hasMouse = mouseActive && mouseX > -500;

                // Update & Project particles (zero allocation, precomputed trig, vectorized fast path)
                for (let i = 0; i < PARTICLE_COUNT; i++) {
                    const localX = unitX[i] * trayRadius;
                    const localY = unitY[i] * trayRadius;
                    const rNorm = baseRad[i];

                    // 3D Magnetic Wave Elevation
                    const wave1 = Math.sin(phase1[i] - t1);
                    const wave2 = Math.cos(localX * 0.008 + t2a) * Math.sin(localY * 0.008 - t2b);
                    const wave3 = Math.sin(phase3[i] - t3) * 0.4;
                    const zElevation = (wave1 * 0.7 + wave2 * 0.5 + wave3) * (waveAmp * baseAmp[i]) * (1 - rNorm * 0.25);

                    // 3D Yaw Rotation
                    const rotX = localX * cosYaw - localY * sinYaw;
                    const rotY = localX * sinYaw + localY * cosYaw;

                    // 3D Perspective Pitch
                    const projY = rotY * COS_TILT - zElevation * SIN_TILT;
                    const projZ = rotY * SIN_TILT + zElevation * COS_TILT;

                    // Perspective Scale
                    const pScale = FOCAL / (FOCAL + projZ * 0.45);

                    // Screen equilibrium position
                    const screenBaseX = cx + rotX * pScale;
                    const screenBaseY = cy + projY * pScale;

                    // Current screen position with displacement
                    const curX = screenBaseX + dispX[i];
                    const curY = screenBaseY + dispY[i];

                    // Fast AABB-culled cursor interaction ("温柔地挪动一点")
                    if (hasMouse) {
                        const mdx = curX - mouseX;
                        const mdy = curY - mouseY;
                        if (mdx > -hoverRadius && mdx < hoverRadius && mdy > -hoverRadius && mdy < hoverRadius) {
                            const distSq = mdx * mdx + mdy * mdy;
                            if (distSq < hoverRadiusSq && distSq > 0.01) {
                                const dist = Math.sqrt(distSq);
                                const force = 1 - dist / hoverRadius;
                                const forceSq = force * force;
                                const invDist = 1 / dist;
                                const nx = mdx * invDist;
                                const ny = mdy * invDist;
                                velX[i] += (nx * 1.35 - ny * 0.55) * forceSq;
                                velY[i] += (ny * 1.35 + nx * 0.55) * forceSq;
                            }
                        }
                    }

                    // Viscous damping & spring return to equilibrium
                    velX[i] = (velX[i] - 0.038 * dispX[i]) * 0.88;
                    velY[i] = (velY[i] - 0.038 * dispY[i]) * 0.88;
                    dispX[i] += velX[i];
                    dispY[i] += velY[i];

                    // Render sand grain as Risograph ink stipple
                    const depthFactor = pScale < 0.65 ? 0.65 : (pScale > 1.25 ? 1.25 : pScale);
                    const dw = basePixelSize[i] * depthFactor;
                    const sprite = mineralSprites[grainSprite[i]];
                    if (sprite) {
                        ctx.drawImage(sprite, curX - dw * 0.5, curY - dw * 0.5, dw, dw);
                    }
                }

                rafId = requestAnimationFrame(render);
            }

            rafId = requestAnimationFrame(render);
        }
    } catch (e) {
        console.error('Sand canvas error:', e);
    }

    /* --------------------------------------------------------------------
       12.5 Floating Navigation Dock (#navDock) & Toggle
       Handles expand/collapse toggle for mobile/compact view, backdrop
       blur dismissal, and smooth synchronization with page sections.
       -------------------------------------------------------------------- */
    try {
        const navDock = document.getElementById('navDock');
        const dockToggle = document.getElementById('dockToggle');
        const dockBackdrop = document.getElementById('dockBackdrop');

        function setNavExpanded(expanded) {
            if (!navDock) return;
            navDock.classList.toggle('expanded', expanded);
            if (dockBackdrop) {
                dockBackdrop.classList.toggle('is-active', expanded);
            }
        }

        if (navDock) {
            // Tapping toggle button
            if (dockToggle) {
                dockToggle.addEventListener('click', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    const willExpand = !navDock.classList.contains('expanded');
                    setNavExpanded(willExpand);
                });
            }

            // On mobile / compact devices, tapping the header capsule when collapsed expands it
            const dockInner = navDock.querySelector('.nav-dock-inner');
            if (dockInner) {
                dockInner.addEventListener('click', function (e) {
                    if (window.innerWidth <= 768) {
                        // If link inside dropdown was clicked, let link handler run
                        if (e.target.closest('.dock-link')) {
                            return;
                        }
                        // If toggle was clicked, dockToggle handler handled it
                        if (e.target.closest('#dockToggle')) {
                            return;
                        }
                        // If expanded and user clicked the brand, close dock and let navigation happen
                        if (navDock.classList.contains('expanded')) {
                            if (e.target.closest('.nav-dock-brand')) {
                                setNavExpanded(false);
                            }
                            return;
                        }
                        // If collapsed, prevent jump and expand menu
                        e.preventDefault();
                        e.stopPropagation();
                        setNavExpanded(true);
                    }
                });
            }

            // Close when any dock link is clicked
            navDock.querySelectorAll('.dock-link').forEach(function (link) {
                link.addEventListener('click', function () {
                    setNavExpanded(false);
                });
            });

            // Close on backdrop tap
            if (dockBackdrop) {
                dockBackdrop.addEventListener('click', function () {
                    setNavExpanded(false);
                });
            }

            // Close on outside click
            document.addEventListener('click', function (e) {
                if (navDock.classList.contains('expanded') && !navDock.contains(e.target)) {
                    setNavExpanded(false);
                }
            });

            // Close on Escape key
            document.addEventListener('keydown', function (e) {
                if (e.key === 'Escape' && navDock.classList.contains('expanded')) {
                    setNavExpanded(false);
                }
            });
        }
    } catch (e) {
        console.error('Nav dock error:', e);
    }

    /* --------------------------------------------------------------------
       13. Blog Post Navigation Normalization (Eliminates clean-URL 404s)
       -------------------------------------------------------------------- */
    try {
        // Normalize directory URL to have trailing slash if served without it (e.g. /blog on serve)
        if (window.location.pathname.endsWith('/blog')) {
            window.history.replaceState(null, '', window.location.pathname + '/' + window.location.search + window.location.hash);
        }

        // Handle local file:// protocol if viewing without an HTTP web server
        if (window.location.protocol === 'file:') {
            document.querySelectorAll('.post-link').forEach(function (link) {
                const slug = link.getAttribute('data-slug');
                if (slug) {
                    link.setAttribute('href', slug + '/index.html');
                }
            });
        }
    } catch (e) {
        console.error('Blog nav normalization error:', e);
    }

    /* --------------------------------------------------------------------
       14. Body fade-in on load
       -------------------------------------------------------------------- */
    document.body.classList.add('is-loaded');

})();
