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
       12. Multi-Section Morphing Sand Particle Simulation Engine
       Living physical mineral sand grains that persist across the entire page,
       morphing and self-propagating into thematic organizations corresponding
       to each section's discipline:
         0. Hero:        3D Harmonic Sand Dune & Magnetic Flux Streamlines
         1. About:       Kinematic Coordinate Lattice & Rigid Joint Nodes
         2. Education:   Fourier Harmonic Waveforms & Quantized Strata
         3. Works:       State-Space Trajectories & Autonomous Waypoint Splines
         4. Skills:      3D LiDAR Cylindrical Point Cloud & 360° Radar Sweep
         5. Contact:     Quiet Settled Sediment & Archival Seal Halo
       Features window-wide gentle cursor repulsion ("温柔地挪动一点"),
       smooth Hermite scroll-blending with aerodynamic wind turbulence,
       and zero-allocation 60 FPS animation.
       -------------------------------------------------------------------- */
    try {
        const sandCanvas = document.getElementById('sandCanvas');
        if (sandCanvas && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            const ctx = sandCanvas.getContext('2d');
            let isRunning = true;
            let rafId = null;
            let width = 0;
            let height = 0;
            let dpr = 1;

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
                        sctx.clearRect(center + (Math.random() - 0.5) * 1.0, center + (Math.random() - 0.5) * 1.0, 0.9, 0.9);
                    } else if (s % 3 === 2) {
                        sctx.fillStyle = '#0F1E33';
                        sctx.fillRect(center - 0.5, center - 0.5, 1.2, 1.2);
                    }

                    // 3. Risograph misregistration (轻微套印偏差)
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

            // Pre-allocated static buffers for all particles (zero per-frame GC allocations)
            const pRand1 = new Float32Array(PARTICLE_COUNT);
            const pRand2 = new Float32Array(PARTICLE_COUNT);
            const pRand3 = new Float32Array(PARTICLE_COUNT);
            const pRandAngle = new Float32Array(PARTICLE_COUNT);

            // Mode 0 (Hero) specific buffers
            const heroRad = new Float32Array(PARTICLE_COUNT);
            const heroAng = new Float32Array(PARTICLE_COUNT);
            const heroAmp = new Float32Array(PARTICLE_COUNT);
            const heroUnitX = new Float32Array(PARTICLE_COUNT);
            const heroUnitY = new Float32Array(PARTICLE_COUNT);
            const heroPhase1 = new Float32Array(PARTICLE_COUNT);
            const heroPhase3 = new Float32Array(PARTICLE_COUNT);

            // Visual traits & physics displacement buffers
            const grainSize = new Float32Array(PARTICLE_COUNT);
            const basePixelSize = new Float32Array(PARTICLE_COUNT);
            const grainSprite = new Uint8Array(PARTICLE_COUNT);
            const dispX = new Float32Array(PARTICLE_COUNT);
            const dispY = new Float32Array(PARTICLE_COUNT);
            const velX = new Float32Array(PARTICLE_COUNT);
            const velY = new Float32Array(PARTICLE_COUNT);

            // Initialize random attributes and Hero streamline distribution
            let pIdx = 0;
            const particlesPerLine = Math.floor((PARTICLE_COUNT * 0.82) / STREAMLINE_COUNT);

            for (let s = 0; s < STREAMLINE_COUNT; s++) {
                const normRing = (s + 0.5) / STREAMLINE_COUNT;
                const ringRad = 0.12 + Math.pow(normRing, 0.85) * 0.86;

                for (let k = 0; k < particlesPerLine && pIdx < PARTICLE_COUNT; k++) {
                    const ang = (k / particlesPerLine) * Math.PI * 2 + (s * 0.18);
                    const jitterR = (Math.random() - 0.5) * 0.032;
                    const jitterA = (Math.random() - 0.5) * 0.045;

                    const r = Math.min(1.0, Math.max(0.05, ringRad + jitterR));
                    const a = ang + jitterA;
                    heroRad[pIdx] = r;
                    heroAng[pIdx] = a;
                    heroAmp[pIdx] = 0.7 + Math.random() * 0.6;
                    heroUnitX[pIdx] = Math.cos(a) * r;
                    heroUnitY[pIdx] = Math.sin(a) * r;
                    heroPhase1[pIdx] = r * 4.2 + a * 2.0;
                    heroPhase3[pIdx] = a * 3.0;

                    pRand1[pIdx] = Math.random();
                    pRand2[pIdx] = Math.random();
                    pRand3[pIdx] = Math.random();
                    pRandAngle[pIdx] = Math.random() * Math.PI * 2;

                    grainSize[pIdx] = 0.35 + Math.random() * 0.35;
                    basePixelSize[pIdx] = SPRITE_BASE_PX * grainSize[pIdx];
                    grainSprite[pIdx] = Math.floor(Math.random() * SPRITE_COUNT);
                    pIdx++;
                }
            }

            while (pIdx < PARTICLE_COUNT) {
                const r = Math.sqrt(Math.random()) * 0.98;
                const a = Math.random() * Math.PI * 2;
                heroRad[pIdx] = r;
                heroAng[pIdx] = a;
                heroAmp[pIdx] = 0.5 + Math.random() * 0.5;
                heroUnitX[pIdx] = Math.cos(a) * r;
                heroUnitY[pIdx] = Math.sin(a) * r;
                heroPhase1[pIdx] = r * 4.2 + a * 2.0;
                heroPhase3[pIdx] = a * 3.0;

                pRand1[pIdx] = Math.random();
                pRand2[pIdx] = Math.random();
                pRand3[pIdx] = Math.random();
                pRandAngle[pIdx] = Math.random() * Math.PI * 2;

                grainSize[pIdx] = 0.30 + Math.random() * 0.32;
                basePixelSize[pIdx] = SPRITE_BASE_PX * grainSize[pIdx];
                grainSprite[pIdx] = Math.floor(Math.random() * SPRITE_COUNT);
                pIdx++;
            }

            // Window-wide cursor interaction ("温柔地挪动一点")
            let mouseX = -9999;
            let mouseY = -9999;
            let targetMouseX = -9999;
            let targetMouseY = -9999;
            let mouseActive = false;

            window.addEventListener('mousemove', function (e) {
                targetMouseX = e.clientX;
                targetMouseY = e.clientY;
                mouseActive = true;
            }, { passive: true });

            window.addEventListener('mouseleave', function () {
                targetMouseX = -9999;
                targetMouseY = -9999;
                mouseActive = false;
            }, { passive: true });

            window.addEventListener('touchmove', function (e) {
                if (e.touches && e.touches[0]) {
                    targetMouseX = e.touches[0].clientX;
                    targetMouseY = e.touches[0].clientY;
                    mouseActive = true;
                }
            }, { passive: true });

            window.addEventListener('touchend', function () {
                targetMouseX = -9999;
                targetMouseY = -9999;
                mouseActive = false;
            }, { passive: true });

            // Section tracking & continuous scroll interpolation
            const sectionIds = ['hero', 'about', 'education', 'experience', 'skills', 'contact'];
            let sectionEls = [];

            function querySectionElements() {
                sectionEls = sectionIds.map(function (id) {
                    return document.getElementById(id);
                }).filter(Boolean);
            }
            querySectionElements();

            let targetSectionProgress = 0;
            let currentSectionProgress = 0;

            function computeScrollProgress() {
                if (!sectionEls.length) return 0;
                const scrollY = window.scrollY || window.pageYOffset || 0;
                const vh = window.innerHeight || 800;
                const vpMid = scrollY + vh * 0.45;

                if (scrollY <= 15) return 0;

                const count = sectionEls.length;
                const centers = [];
                for (let i = 0; i < count; i++) {
                    const rect = sectionEls[i].getBoundingClientRect();
                    const docTop = rect.top + scrollY;
                    const h = rect.height;
                    centers.push(docTop + h * 0.45);
                }

                if (vpMid <= centers[0]) return 0;
                if (vpMid >= centers[count - 1]) return count - 1;

                for (let i = 0; i < count - 1; i++) {
                    if (vpMid >= centers[i] && vpMid < centers[i + 1]) {
                        const span = centers[i + 1] - centers[i];
                        const ratio = span > 0 ? (vpMid - centers[i]) / span : 0;
                        return i + Math.max(0, Math.min(1, ratio));
                    }
                }
                return 0;
            }

            // Canvas resize handler
            function resize() {
                if (!sandCanvas) return;
                dpr = Math.min(window.devicePixelRatio || 1, 1.5);
                width = window.innerWidth;
                height = window.innerHeight;
                sandCanvas.width = Math.round(width * dpr);
                sandCanvas.height = Math.round(height * dpr);
                ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
                createMineralSprites();
                querySectionElements();
            }

            window.addEventListener('resize', resize, { passive: true });
            resize();

            // Document visibility handler (power saving)
            document.addEventListener('visibilitychange', function () {
                if (document.hidden) {
                    isRunning = false;
                } else {
                    isRunning = true;
                    if (!rafId) rafId = requestAnimationFrame(render);
                }
            });

            // Mathematical Formations & 3D Constants
            const startTime = performance.now();
            const TILT = 52 * (Math.PI / 180);
            const COS_TILT = Math.cos(TILT);
            const SIN_TILT = Math.sin(TILT);
            const FOCAL = 620;

            // Intermediate computation objects (reused to avoid allocation)
            const p1 = { x: 0, y: 0, scale: 1, alpha: 1 };
            const p2 = { x: 0, y: 0, scale: 1, alpha: 1 };

            function calculateModePoint(mode, i, now, out) {
                const cx = width * 0.5;
                const cy = height * 0.5;

                switch (mode) {
                    case 0: {
                        // Section 0: Hero — 3D Harmonic Magnetic Sand Dune
                        const trayRadius = Math.min(width, height) * 0.58;
                        const waveAmp = Math.min(48, height * 0.065);
                        const yaw = now * 0.00012;
                        const cosYaw = Math.cos(yaw);
                        const sinYaw = Math.sin(yaw);

                        const localX = heroUnitX[i] * trayRadius;
                        const localY = heroUnitY[i] * trayRadius;
                        const rNorm = heroRad[i];

                        const wave1 = Math.sin(heroPhase1[i] - now * 0.0015);
                        const wave2 = Math.cos(localX * 0.008 + now * 0.0011) * Math.sin(localY * 0.008 - now * 0.0007);
                        const wave3 = Math.sin(heroPhase3[i] - now * 0.0005) * 0.4;
                        const zElev = (wave1 * 0.7 + wave2 * 0.5 + wave3) * (waveAmp * heroAmp[i]) * (1 - rNorm * 0.25);

                        const rotX = localX * cosYaw - localY * sinYaw;
                        const rotY = localX * sinYaw + localY * cosYaw;
                        const projY = rotY * COS_TILT - zElev * SIN_TILT;
                        const projZ = rotY * SIN_TILT + zElev * COS_TILT;
                        const pScale = FOCAL / (FOCAL + projZ * 0.45);

                        out.x = cx + rotX * pScale;
                        out.y = (height * 0.52) + projY * pScale;
                        out.scale = pScale;
                        out.alpha = 0.95;
                        break;
                    }
                    case 1: {
                        // Section 1: About — Kinematic Coordinate Lattice & Rigid Joint Nodes
                        if (i < 2000) {
                            // Orthogonal Coordinate Lattice with elastic wave breathing
                            const cols = 28;
                            const rows = 18;
                            const c = i % cols;
                            const r = Math.floor(i / cols) % rows;
                            const gx = (c / (cols - 1)) * (width * 0.92) + width * 0.04;
                            const gy = (r / (rows - 1)) * (height * 0.86) + height * 0.07;
                            const dwx = Math.sin(gy * 0.005 + now * 0.0012) * 7.5;
                            const dwy = Math.cos(gx * 0.005 - now * 0.0014) * 7.5;
                            out.x = gx + dwx + (pRand1[i] - 0.5) * 12;
                            out.y = gy + dwy + (pRand2[i] - 0.5) * 12;
                            out.scale = 0.86;
                            out.alpha = 0.72;
                        } else {
                            // Linkage kinematics in margins (robotic multi-joint articulation)
                            const isLeft = (i % 2 === 0);
                            const baseX = isLeft ? width * 0.07 : width * 0.93;
                            const baseY = height * (0.18 + ((i - 2000) % 9) * 0.08);
                            const armPhase = now * 0.0009 + (i % 25) * 0.25;
                            const a1 = Math.sin(armPhase) * 0.85;
                            const a2 = Math.cos(armPhase * 1.3) * 1.15;
                            const l1 = Math.min(width, height) * 0.055;
                            const l2 = Math.min(width, height) * 0.045;
                            const subT = pRand3[i];
                            out.x = baseX + (Math.cos(a1) * l1 + Math.cos(a1 + a2) * l2) * subT + (pRand1[i] - 0.5) * 6;
                            out.y = baseY + (Math.sin(a1) * l1 + Math.sin(a1 + a2) * l2) * subT + (pRand2[i] - 0.5) * 6;
                            out.scale = 0.90;
                            out.alpha = 0.80;
                        }
                        break;
                    }
                    case 2: {
                        // Section 2: Education — Fourier Harmonic Waveforms & Quantized Strata
                        const band = i % 6;
                        const baseY = height * (0.15 + band * 0.135);
                        const freq = (band + 1) * 1.6;
                        const speed = 0.000035 * (band + 1) * ((band % 2 === 0) ? 1 : -1);
                        let u = (pRand1[i] + now * speed) % 1.0;
                        if (u < 0) u += 1.0;

                        const waveY = Math.sin(u * freq * Math.PI * 2 + now * (0.0011 + band * 0.0003)) * (16 + band * 4) +
                                      Math.cos(u * Math.PI * 4 - now * 0.0012) * 5.5;
                        out.x = u * width + (pRand2[i] - 0.5) * 8;
                        out.y = baseY + waveY + (pRand3[i] - 0.5) * 8;
                        out.scale = 0.84;
                        out.alpha = 0.72;
                        break;
                    }
                    case 3: {
                        // Section 3: Works — State-Space Trajectories & Waypoint Splines
                        const trk = i % 5;
                        const speed = 0.000065 + trk * 0.000022;
                        let u = (pRand1[i] + now * speed) % 1.0;
                        if (u < 0) u += 1.0;

                        let px = 0;
                        let py = 0;
                        if (trk === 0) {
                            // Left margin autonomous path
                            px = width * (0.05 + Math.sin(u * Math.PI * 3 + now * 0.0008) * 0.04);
                            py = u * height;
                        } else if (trk === 1) {
                            // Right margin autonomous path
                            px = width * (0.95 - Math.sin(u * Math.PI * 3 - now * 0.0008) * 0.04);
                            py = u * height;
                        } else if (trk === 2) {
                            // Upper serpentine transversal
                            px = u * width;
                            py = height * (0.22 + Math.sin(u * Math.PI * 2) * 0.12);
                        } else if (trk === 3) {
                            // Lower serpentine transversal
                            px = (1 - u) * width;
                            py = height * (0.78 + Math.cos(u * Math.PI * 2) * 0.11);
                        } else {
                            // Central orbital loop around waypoints
                            const theta = u * Math.PI * 2;
                            const rTrk = Math.min(width, height) * 0.34;
                            px = cx + Math.cos(theta) * rTrk;
                            py = cy + Math.sin(theta) * (rTrk * 0.55);
                        }

                        out.x = px + (pRand2[i] - 0.5) * 10;
                        out.y = py + (pRand3[i] - 0.5) * 10;
                        out.scale = 0.88;
                        out.alpha = 0.78;
                        break;
                    }
                    case 4: {
                        // Section 4: Skills — 3D LiDAR Cylindrical Point Cloud & 360° Radar Sweep
                        const ring = i % 8;
                        const r = (0.13 + ring * 0.10) * Math.min(width, height);
                        const ang = pRandAngle[i];
                        const tiltAngle = 36 * (Math.PI / 180);

                        const lx = Math.cos(ang) * r;
                        const ly = Math.sin(ang) * r * Math.cos(tiltAngle);
                        const lz = Math.sin(ang) * r * Math.sin(tiltAngle);
                        const pScale = 580 / (580 + lz * 0.45);

                        const sweep = (now * 0.0016) % (Math.PI * 2);
                        let dAng = (sweep - ang) % (Math.PI * 2);
                        if (dAng < 0) dAng += Math.PI * 2;
                        const inBeam = dAng < 0.65;
                        const beamIntensity = inBeam ? (1.0 - dAng / 0.65) : 0;

                        out.x = cx + lx * pScale + (pRand1[i] - 0.5) * 6;
                        out.y = cy + ly * pScale + (pRand2[i] - 0.5) * 6;
                        out.scale = pScale * (0.80 + beamIntensity * 0.40);
                        out.alpha = 0.68 + beamIntensity * 0.32;
                        break;
                    }
                    default: {
                        // Section 5: Contact & Colophon — Quiet Settled Sediment & Archival Seal Halo
                        if (i < 2100) {
                            // Settled mineral sediment across bottom 28% of viewport
                            const depth = Math.sqrt(pRand1[i]);
                            out.x = pRand2[i] * width;
                            out.y = height * (0.72 + depth * 0.26) + Math.sin(now * 0.0006 + i * 0.1) * 3.5;
                            out.scale = 0.80;
                            out.alpha = 0.65;
                        } else {
                            // Circular Zen halo encircling the archival seal
                            const rSeal = Math.min(width, height) * (0.22 + pRand1[i] * 0.08);
                            const ang = pRandAngle[i] + now * 0.0002;
                            out.x = cx + Math.cos(ang) * rSeal;
                            out.y = cy + Math.sin(ang) * (rSeal * 0.85);
                            out.scale = 0.85;
                            out.alpha = 0.70;
                        }
                        break;
                    }
                }
            }

            // High-Performance 60 FPS Render Loop
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
                    mouseX += (targetMouseX - mouseX) * 0.10;
                    mouseY += (targetMouseY - mouseY) * 0.10;
                }

                ctx.clearRect(0, 0, width, height);

                const elapsed = now - startTime;

                // Update continuous scroll progress
                targetSectionProgress = computeScrollProgress();
                currentSectionProgress += (targetSectionProgress - currentSectionProgress) * 0.08;

                const k1 = Math.max(0, Math.min(4, Math.floor(currentSectionProgress)));
                const k2 = Math.min(5, k1 + 1);
                const blendFrac = currentSectionProgress - k1;
                // Hermite smoothstep curve
                const smoothTau = blendFrac * blendFrac * (3 - 2 * blendFrac);
                // Aerodynamic wind turbulence kicks up grains during scroll transitions
                const gust = Math.sin(Math.PI * blendFrac) * 26;
                const tGust = elapsed * 0.002;

                // Draw subtle Zen raked boundary contour for Hero mode
                const heroBoundaryAlpha = Math.max(0, 1.0 - currentSectionProgress * 2.5);
                if (heroBoundaryAlpha > 0.01) {
                    const cx = width * 0.5;
                    const cy = height * 0.52;
                    const trayRadius = Math.min(width, height) * 0.58;
                    ctx.save();
                    ctx.beginPath();
                    ctx.ellipse(cx, cy, trayRadius * 0.98, trayRadius * 0.98 * COS_TILT, 0, 0, Math.PI * 2);
                    ctx.strokeStyle = 'rgba(21, 44, 74, ' + (0.08 * heroBoundaryAlpha) + ')';
                    ctx.lineWidth = 1;
                    ctx.setLineDash([3, 5]);
                    ctx.stroke();
                    ctx.restore();
                }

                const hoverRadius = 125;
                const hoverRadiusSq = hoverRadius * hoverRadius;
                const hasMouse = mouseActive && mouseX > -500;

                // Project and render all particles
                for (let i = 0; i < PARTICLE_COUNT; i++) {
                    // Compute formation coordinates for adjacent sections
                    calculateModePoint(k1, i, elapsed, p1);
                    calculateModePoint(k2, i, elapsed, p2);

                    // Blend between section formations
                    let curX = (1 - smoothTau) * p1.x + smoothTau * p2.x;
                    let curY = (1 - smoothTau) * p1.y + smoothTau * p2.y;
                    const pScale = (1 - smoothTau) * p1.scale + smoothTau * p2.scale;
                    const pAlpha = (1 - smoothTau) * p1.alpha + smoothTau * p2.alpha;

                    // Apply flight turbulence during scroll transitions
                    if (gust > 0.05) {
                        curX += Math.sin(i * 17.3 + tGust) * gust;
                        curY += Math.cos(i * 23.9 + tGust) * gust;
                    }

                    // Add dynamic mouse displacement
                    curX += dispX[i];
                    curY += dispY[i];

                    // Gentle cursor repulsion ("温柔地挪动一点")
                    if (hasMouse) {
                        const mdx = curX - mouseX;
                        const mdy = curY - mouseY;
                        if (mdx > -hoverRadius && mdx < hoverRadius && mdy > -hoverRadius && mdy < hoverRadius) {
                            const distSq = mdx * mdx + mdy * mdy;
                            if (distSq < hoverRadiusSq && distSq > 0.01) {
                                const dist = Math.sqrt(distSq);
                                const force = (1 - dist / hoverRadius);
                                const forceSq = force * force;
                                const invDist = 1 / dist;
                                const nx = mdx * invDist;
                                const ny = mdy * invDist;
                                velX[i] += (nx * 1.30 - ny * 0.50) * forceSq;
                                velY[i] += (ny * 1.30 + nx * 0.50) * forceSq;
                            }
                        }
                    }

                    // Viscous damping & spring return
                    velX[i] = (velX[i] - 0.038 * dispX[i]) * 0.88;
                    velY[i] = (velY[i] - 0.038 * dispY[i]) * 0.88;
                    dispX[i] += velX[i];
                    dispY[i] += velY[i];

                    // Render sand grain as Risograph ink stipple
                    const depthFactor = pScale < 0.65 ? 0.65 : (pScale > 1.25 ? 1.25 : pScale);
                    const dw = basePixelSize[i] * depthFactor;
                    const sprite = mineralSprites[grainSprite[i]];
                    if (sprite) {
                        // In content sections, subtly soften particles in the reading column for pristine text legibility
                        let finalAlpha = pAlpha;
                        if (currentSectionProgress > 0.4) {
                            const inReadingCol = curX > width * 0.10 && curX < width * 0.90;
                            if (inReadingCol) {
                                finalAlpha *= (width < 768 ? 0.38 : 0.68);
                            }
                        }
                        ctx.globalAlpha = finalAlpha;
                        ctx.drawImage(sprite, curX - dw * 0.5, curY - dw * 0.5, dw, dw);
                    }
                }

                ctx.globalAlpha = 1.0;
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
