/* ==========================================================================
   build.js — Markdown → HTML Static Site Generator
   Reads content.md, posts/, gallery.json, and compiles index.html,
   blog pages, and photography gallery.
   ========================================================================== */

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { marked } = require('marked');
const markedKatex = require('marked-katex-extension');

const ROOT = __dirname;
const CONTENT_PATH = path.join(ROOT, 'content.md');
const TEMPLATE_PATH = path.join(ROOT, 'template.html');
const OUT_PATH = path.join(ROOT, 'index.html');
const BLOG_TEMPLATE_PATH = path.join(ROOT, 'blog-template.html');
const POSTS_DIR = path.join(ROOT, 'posts');
const BLOG_OUT_DIR = path.join(ROOT, 'blog');
const GALLERY_OUT_DIR = path.join(ROOT, 'gallery');
const GALLERY_DATA_PATH = path.join(ROOT, 'gallery.json');

/* ------------------------------------------------------------------ */
/* 1. Read & parse content.md                                          */
/* ------------------------------------------------------------------ */
if (!fs.existsSync(CONTENT_PATH)) {
    console.error('Error: content.md not found.');
    process.exit(1);
}
const raw = fs.readFileSync(CONTENT_PATH, 'utf8');
const { data: cfg, content: body } = matter(raw);

/* ------------------------------------------------------------------ */
/* 2. Configure marked & extensions                                    */
/* ------------------------------------------------------------------ */
marked.setOptions({
    gfm: true,
    breaks: false
});

// KaTeX math rendering: $...$ inline, $$...$$ block
marked.use(
    markedKatex({
        throwOnError: false,
        output: 'html'
    })
);

// Custom renderer for code blocks with language badge and copy button
const renderer = new marked.Renderer();
const originalCode = renderer.code.bind(renderer);

renderer.code = function (code, infostring, escaped) {
    const lang = (infostring || '').match(/\S*/)[0];
    const displayLang = lang ? lang.toUpperCase() : 'CODE';
    const rawHtml = originalCode(code, infostring, escaped);
    return `<div class="code-block-wrap">
        <div class="code-block-header">
            <span class="code-lang">${esc(displayLang)}</span>
            <button class="code-copy-btn" aria-label="Copy code">Copy</button>
        </div>
        ${rawHtml}
    </div>`;
};

marked.use({ renderer });

/* ------------------------------------------------------------------ */
/* 3. Utility Helpers                                                 */
/* ------------------------------------------------------------------ */
function esc(str) {
    return String(str || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function ensureDir(dir) {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function slugify(name) {
    return name
        .toLowerCase()
        .replace(/\.md$/, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

function formatDate(dateStr) {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return esc(dateStr);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

function estimateReadingTime(text) {
    const words = (text || '').trim().split(/\s+/).length;
    const cjkChars = (text.match(/[\u4e00-\u9fa5\u3040-\u30ff]/g) || []).length;
    const totalUnits = words + cjkChars;
    const mins = Math.max(1, Math.ceil(totalUnits / 220));
    return `${mins} min read`;
}

function splitSections(md) {
    const lines = md.split('\n');
    const sections = [];
    let current = null;
    let buffer = [];

    for (const line of lines) {
        const h2 = line.match(/^##\s+(.+)$/);
        if (h2) {
            if (current) {
                sections.push({ title: current, body: buffer.join('\n').trim() });
            }
            current = h2[1].trim();
            buffer = [];
        } else if (current) {
            buffer.push(line);
        }
    }
    if (current) {
        sections.push({ title: current, body: buffer.join('\n').trim() });
    }
    return sections;
}

/* ------------------------------------------------------------------ */
/* 4. Section Renderers (Homepage)                                     */
/* ------------------------------------------------------------------ */

function renderAbout(md) {
    const tokens = marked.lexer(md);
    let html = '<div class="about-cols"><div class="about-text reveal">';
    const sideCards = [];

    for (const tok of tokens) {
        if (tok.type === 'paragraph') {
            html += marked.parse(tok.raw);
        } else if (tok.type === 'blockquote') {
            const inner = marked.parse(tok.text).replace(/<\/?p>/g, '');
            sideCards.push(inner);
        }
    }

    if (cfg.quote) {
        html += `<p class="quote"><span class="quote-mark">「</span>${esc(cfg.quote)}<span class="quote-mark">」</span></p>`;
    }
    html += '</div>';

    if (sideCards.length) {
        html += '<aside class="about-side reveal">';
        sideCards.forEach((card) => {
            const labelMatch = card.match(/<strong>(.*?)<\/strong>/);
            const label = labelMatch ? labelMatch[1] : '';
            const rest = card.replace(/<strong>.*?<\/strong>/, '').trim();
            html += `<div class="mini-card"><span class="mini-label">${esc(label)}</span>${rest}</div>`;
        });
        html += '</aside>';
    }
    html += '</div>';
    return html;
}

function renderEntries(md) {
    const tokens = marked.lexer(md);
    let html = '<ul class="entries">';

    for (let i = 0; i < tokens.length; i++) {
        const tok = tokens[i];
        if (tok.type === 'heading' && tok.depth === 3) {
            const parts = tok.text.split('·').map((s) => s.trim());
            const date = parts[0] || '';
            const title = parts[1] || tok.text;

            html += '<li>';
            html += `<div class="entry-date">${esc(date)}</div>`;
            html += '<div class="entry-body">';
            html += `<strong>${esc(title)}</strong>`;

            let role = '';
            let notes = [];
            for (let j = i + 1; j < tokens.length; j++) {
                const next = tokens[j];
                if (next.type === 'heading') break;
                if (next.type === 'list') {
                    for (const item of next.items) {
                        const text = item.text;
                        const roleM = text.match(/\*\*Role:\*\*\s*(.+)/);
                        if (roleM) {
                            role = roleM[1].trim();
                        } else {
                            notes.push(text);
                        }
                    }
                }
            }

            if (role) html += `<span class="entry-role">${esc(role)}</span>`;
            if (notes.length) {
                html += '<ul class="entry-notes">';
                notes.forEach((n) => {
                    html += `<li>${marked.parseInline(n)}</li>`;
                });
                html += '</ul>';
            }
            html += '</div></li>';
        }
    }
    html += '</ul>';
    return html;
}

function renderWorks(md) {
    const tokens = marked.lexer(md);
    let html = '<div class="works">';
    let currentNo = 0;

    for (let i = 0; i < tokens.length; i++) {
        const tok = tokens[i];
        if (tok.type === 'heading' && tok.depth === 3) {
            currentNo++;
            const parts = tok.text.split('·').map((s) => s.trim());
            const date = parts[0] || '';
            const title = parts[1] || tok.text;

            html += `<article class="work reveal">`;
            html += `<div class="work-no">${String(currentNo).padStart(2, '0')}</div>`;
            html += `<div class="work-main">`;

            let meta = { role: '', tags: [] };
            let desc = '';
            let extraNotes = [];
            for (let j = i + 1; j < tokens.length; j++) {
                const next = tokens[j];
                if (next.type === 'heading' && next.depth === 3) break;
                if (next.type === 'list') {
                    for (const item of next.items) {
                        const text = item.text;
                        const roleM = text.match(/\*\*Role:\*\*\s*(.+)/);
                        const tagsM = text.match(/\*\*Tags:\*\*\s*(.+)/);
                        if (roleM) meta.role = roleM[1].trim();
                        else if (tagsM) meta.tags = tagsM[1].split(',').map((t) => t.trim());
                        else extraNotes.push(text);
                    }
                } else if (next.type === 'paragraph') {
                    desc = next.text;
                }
            }

            html += `<div class="work-meta"><span>${esc(date)}</span>`;
            if (meta.role) html += ` · <span>${esc(meta.role)}</span>`;
            html += `</div>`;
            html += `<h3>${esc(title)}</h3>`;
            if (desc) html += `<p>${marked.parseInline(desc)}</p>`;
            if (extraNotes.length) {
                html += '<ul class="work-notes">';
                extraNotes.forEach((n) => {
                    html += `<li>${marked.parseInline(n)}</li>`;
                });
                html += '</ul>';
            }
            if (meta.tags.length) {
                html += '<div class="tags">';
                meta.tags.forEach((t) => {
                    html += `<span>${esc(t)}</span>`;
                });
                html += '</div>';
            }
            html += `</div></article>`;
        }
    }
    html += '</div>';
    return html;
}

function renderSkills(md) {
    const tokens = marked.lexer(md);
    let html = '<div class="skills">';

    for (let i = 0; i < tokens.length; i++) {
        const tok = tokens[i];
        if (tok.type === 'heading' && tok.depth === 3) {
            html += `<div class="skill-col reveal"><h3>${esc(tok.text)}</h3><ul>`;
            for (let j = i + 1; j < tokens.length; j++) {
                const next = tokens[j];
                if (next.type === 'heading') break;
                if (next.type === 'list') {
                    for (const item of next.items) {
                        html += `<li>${marked.parseInline(item.text)}</li>`;
                    }
                }
            }
            html += '</ul></div>';
        }
    }
    html += '</div>';
    return html;
}

function renderContact(md) {
    const tokens = marked.lexer(md);
    let lead = '';
    for (const tok of tokens) {
        if (tok.type === 'paragraph') {
            lead = marked.parse(tok.raw).replace(/<\/?p>/g, '');
            break;
        }
    }

    let html = `<div class="contact reveal">`;
    if (lead) html += `<p class="contact-lead">${lead}</p>`;
    html += '<div class="contact-grid">';
    html += `<a href="mailto:${esc(cfg.email)}" class="contact-item"><span class="contact-k">Email</span><span class="contact-v">${esc(cfg.email)}</span></a>`;
    html += `<a href="${esc(cfg.github)}" target="_blank" rel="noopener" class="contact-item"><span class="contact-k">GitHub</span><span class="contact-v">${esc(cfg.github_handle)}</span></a>`;
    html += `<a href="${esc(cfg.rednote)}" target="_blank" rel="noopener" class="contact-item"><span class="contact-k">RedNote</span><span class="contact-v">${esc(cfg.rednote_label)}</span></a>`;
    html += '</div></div>';
    html += '<div class="end-mark" aria-hidden="true">— 終 —</div>';
    return html;
}

function buildSection(navItem, contentHtml, alt) {
    const cls = alt ? 'sec sec-alt' : 'sec';
    return `
            <section class="${cls}" id="${navItem.id}">
                <div class="sec-head reveal">
                    <h2><span class="sec-num">${navItem.num}</span>${esc(navItem.label)}</h2>
                    <span class="sec-rule"></span>
                </div>
                ${contentHtml}
            </section>`;
}

/* ------------------------------------------------------------------ */
/* 5. Assemble Homepage HTML                                          */
/* ------------------------------------------------------------------ */
const sections = splitSections(body);
const sectionMap = {};
sections.forEach((s) => {
    const id = s.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    sectionMap[id] = s;
});

let mainHtml = '';
cfg.nav.forEach((navItem, idx) => {
    const sec = sectionMap[navItem.id];
    if (!sec) return;
    let content = '';
    switch (navItem.id) {
        case 'about':
            content = renderAbout(sec.body);
            break;
        case 'education':
            content = renderEntries(sec.body);
            break;
        case 'experience':
        case 'works':
            content = renderWorks(sec.body);
            break;
        case 'skills':
            content = renderSkills(sec.body);
            break;
        case 'contact':
            content = renderContact(sec.body);
            break;
    }
    mainHtml += buildSection(navItem, content, idx % 2 === 1);
});

/* Sidebar */
const sidebarHtml = `
        <aside class="sidebar" aria-label="Personal profile and navigation">
            <div class="sidebar-inner">
                <div class="seal-wrap">
                    <div class="seal" title="${esc(cfg.name_jp)}">${esc(cfg.name_jp.charAt(0))}</div>
                    <div class="seal-sub">${esc(cfg.name_jp.slice(1))}</div>
                </div>

                <div class="identity">
                    <h1 class="name-en">${esc(cfg.name_en)}</h1>
                    <p class="name-jp">${esc(cfg.name_jp)}</p>
                    <p class="name-title">${esc(cfg.title)}</p>
                    <p class="name-affil">${esc(cfg.affiliation)}</p>
                </div>

                <div class="vertical-deco" aria-hidden="true">${esc(cfg.vertical_deco)}</div>

                <dl class="facts">
                    <div class="fact">
                        <dt>Location</dt>
                        <dd>${esc(cfg.location)}</dd>
                    </div>
                    <div class="fact">
                        <dt>Status</dt>
                        <dd><span class="dot"></span>${esc(cfg.status)}</dd>
                    </div>
                    <div class="fact">
                        <dt>Focus</dt>
                        <dd>${esc(cfg.focus)}</dd>
                    </div>
                </dl>

                <nav class="side-nav" aria-label="Main Navigation">
                    ${cfg.nav
                        .map(
                            (n) =>
                                `<a href="#${n.id}" class="side-link"><span class="side-num">${n.num}</span>${esc(n.label)}</a>`
                        )
                        .join('\n                    ')}
                    <a href="blog/index.html" class="side-link side-link-external"><span class="side-num">筆</span>Blog</a>
                    <a href="gallery/index.html" class="side-link side-link-external"><span class="side-num">影</span>Gallery</a>
                </nav>

                <div class="side-contact">
                    <a href="mailto:${esc(cfg.email)}" class="side-contact-link">Email</a>
                    <a href="${esc(cfg.github)}" target="_blank" rel="noopener" class="side-contact-link">GitHub</a>
                    <a href="${esc(cfg.rednote)}" target="_blank" rel="noopener" class="side-contact-link">RedNote</a>
                </div>

                <p class="side-foot">© <span id="year"></span> ${esc(cfg.name_jp)}</p>
            </div>
        </aside>`;

/* Mobile header & menu drawer */
const mobileHtml = `
            <div class="topbar">
                <span class="topbar-name">${esc(cfg.name_jp)} · ${esc(cfg.name_en)}</span>
                <button class="topbar-toggle" id="topbarToggle" aria-label="Toggle navigation menu">
                    <span></span><span></span><span></span>
                </button>
            </div>

            <div class="mobile-panel" id="mobilePanel">
                <nav class="mobile-nav" aria-label="Mobile Navigation">
                    ${cfg.nav
                        .map((n) => `<a href="#${n.id}" class="mobile-link">${esc(n.label)}</a>`)
                        .join('\n                    ')}
                    <a href="blog/index.html" class="mobile-link">Blog</a>
                    <a href="gallery/index.html" class="mobile-link">Gallery</a>
                </nav>
            </div>`;

/* Compile & Write index.html */
let template = fs.readFileSync(TEMPLATE_PATH, 'utf8');
template = template.replace('<!-- SIDEBAR -->', sidebarHtml);
template = template.replace('<!-- MOBILE -->', mobileHtml);
template = template.replace('<!-- MAIN -->', mainHtml);
fs.writeFileSync(OUT_PATH, template, 'utf8');
console.log('✓ Built index.html from content.md');

/* ------------------------------------------------------------------ */
/* 6. BLOG — build blog index & individual post pages                 */
/* ------------------------------------------------------------------ */
let posts = [];
if (fs.existsSync(POSTS_DIR)) {
    const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith('.md'));
    posts = files.map((file) => {
        const rawPost = fs.readFileSync(path.join(POSTS_DIR, file), 'utf8');
        const { data, content: postBody } = matter(rawPost);
        return {
            slug: slugify(file),
            title: data.title || file,
            date: data.date || '',
            tags: data.tags || [],
            excerpt: data.excerpt || '',
            readingTime: estimateReadingTime(postBody),
            content: postBody
        };
    });
    posts.sort((a, b) => new Date(b.date) - new Date(a.date));
}

function adjustTemplateForDepth(tpl, depth) {
    const prefix = '../'.repeat(depth);
    tpl = tpl.replace(/href="\.\.\/css\/style\.css"/g, `href="${prefix}css/style.css"`);
    tpl = tpl.replace(/src="\.\.\/js\/main\.js"/g, `src="${prefix}js/main.js"`);
    tpl = tpl.replace(/href="#([a-z]+)"/g, `href="${prefix}index.html#$1"`);
    tpl = tpl.replace(/href="blog\/index\.html"/g, `href="${prefix}blog/index.html"`);
    tpl = tpl.replace(/href="gallery\/index\.html"/g, `href="${prefix}gallery/index.html"`);
    return tpl;
}

if (posts.length > 0) {
    ensureDir(BLOG_OUT_DIR);

    /* Blog Index */

    // Collect unique tags for filter bar
    const allTags = new Set();
    posts.forEach((p) => p.tags.forEach((t) => allTags.add(t)));
    const uniqueTags = Array.from(allTags).sort();

    const blogFilterBar = uniqueTags.length > 1
        ? `<div class="blog-filters reveal">
            <button class="blog-filter is-active" data-filter="all">All</button>
            ${uniqueTags.map((t) => `<button class="blog-filter" data-filter="${esc(t)}">${esc(t)}</button>`).join('')}
        </div>`
        : '';

    const postItems = posts
        .map((p) => {
            const tagSpans = p.tags.map((t) => `<span>${esc(t)}</span>`).join('');
            const tagsAttr = p.tags.map((t) => esc(t)).join(',');
            return `<li class="post-item reveal" data-tags="${tagsAttr}">
                <a href="${p.slug}/index.html" class="post-link">
                    <div class="post-meta-col">
                        <span class="post-date">${formatDate(p.date)}</span>
                        <span class="post-reading-pill">${esc(p.readingTime)}</span>
                    </div>
                    <div class="post-body">
                        <h2 class="post-h">${esc(p.title)}</h2>
                        <p class="post-excerpt">${esc(p.excerpt)}</p>
                        <div class="post-tags">${tagSpans}</div>
                    </div>
                </a>
            </li>`;
        })
        .join('\n                    ');

    const blogIndexMain = `
        <header class="blog-head reveal">
            <div class="blog-head-meta"><a href="../index.html" class="back-link">← Home</a></div>
            <h1 class="blog-title">Blog<span class="blog-title-jp">筆記</span></h1>
            <p class="blog-sub">Writings on hardware, computer systems, and machine learning.</p>
        </header>
        ${blogFilterBar}
        <ul class="post-list">${postItems}</ul>
        <div class="end-mark" aria-hidden="true">— 終 —</div>`;

    let blogTemplate = fs.readFileSync(BLOG_TEMPLATE_PATH, 'utf8');
    blogTemplate = blogTemplate.replace(/<!-- TITLE -->/g, 'Blog');
    blogTemplate = blogTemplate.replace(/<!-- DESCRIPTION -->/g, 'Writings on hardware, systems, and machine learning by Shoufeng Zhang.');
    blogTemplate = blogTemplate.replace('<!-- SIDEBAR -->', sidebarHtml);
    blogTemplate = blogTemplate.replace('<!-- MOBILE -->', mobileHtml);
    blogTemplate = blogTemplate.replace('<!-- MAIN -->', blogIndexMain);
    blogTemplate = adjustTemplateForDepth(blogTemplate, 1);

    fs.writeFileSync(path.join(BLOG_OUT_DIR, 'index.html'), blogTemplate, 'utf8');
    console.log(`✓ Built blog/index.html (${posts.length} posts)`);

    /* Individual Post Pages */
    posts.forEach((p, idx) => {
        const postDir = path.join(BLOG_OUT_DIR, p.slug);
        ensureDir(postDir);

        const bodyHtml = marked.parse(p.content);
        const tagSpans = p.tags.map((t) => `<span>${esc(t)}</span>`).join('');

        // Prev/Next navigation
        const prevPost = idx < posts.length - 1 ? posts[idx + 1] : null;
        const nextPost = idx > 0 ? posts[idx - 1] : null;
        let postNavHtml = '';
        if (prevPost || nextPost) {
            postNavHtml = '<nav class="post-nav">';
            if (prevPost) {
                postNavHtml += `<a href="../${prevPost.slug}/index.html" class="post-nav-item prev">
                    <span class="post-nav-label">← Previous</span>
                    <span class="post-nav-title">${esc(prevPost.title)}</span>
                </a>`;
            } else {
                postNavHtml += '<div></div>';
            }
            if (nextPost) {
                postNavHtml += `<a href="../${nextPost.slug}/index.html" class="post-nav-item next">
                    <span class="post-nav-label">Next →</span>
                    <span class="post-nav-title">${esc(nextPost.title)}</span>
                </a>`;
            } else {
                postNavHtml += '<div></div>';
            }
            postNavHtml += '</nav>';
        }

        const postMain = `
            <article class="post-article">
                <header class="post-head reveal">
                    <div class="post-head-meta">
                        <a href="../index.html" class="back-link">← Blog</a>
                        <div style="display:flex; gap:16px; align-items:center;">
                            <span class="reading-time">${esc(p.readingTime)}</span>
                            <time class="post-head-date">${formatDate(p.date)}</time>
                        </div>
                    </div>
                    <h1 class="post-head-title">${esc(p.title)}</h1>
                    <div class="post-head-tags">${tagSpans}</div>
                </header>
                <div class="post-body">${bodyHtml}</div>
                ${postNavHtml}
                <footer class="post-foot"><a href="../index.html" class="back-link">← Back to Blog</a></footer>
            </article>`;

        let postTemplate = fs.readFileSync(BLOG_TEMPLATE_PATH, 'utf8');
        postTemplate = postTemplate.replace(/<!-- TITLE -->/g, esc(p.title));
        postTemplate = postTemplate.replace(/<!-- DESCRIPTION -->/g, esc(p.excerpt || p.title));
        postTemplate = postTemplate.replace('<!-- SIDEBAR -->', sidebarHtml);
        postTemplate = postTemplate.replace('<!-- MOBILE -->', mobileHtml);
        postTemplate = postTemplate.replace('<!-- MAIN -->', postMain);
        postTemplate = adjustTemplateForDepth(postTemplate, 2);

        fs.writeFileSync(path.join(postDir, 'index.html'), postTemplate, 'utf8');
    });
    console.log(`✓ Built ${posts.length} post pages in blog/`);
}

/* ------------------------------------------------------------------ */
/* 7. GALLERY — build photography gallery page with Lightbox           */
/* ------------------------------------------------------------------ */
if (fs.existsSync(GALLERY_DATA_PATH)) {
    ensureDir(GALLERY_OUT_DIR);

    const galleryData = JSON.parse(fs.readFileSync(GALLERY_DATA_PATH, 'utf8'));
    const categories = {};
    galleryData.photos.forEach((p) => {
        const cat = p.category || 'Other';
        if (!categories[cat]) categories[cat] = [];
        categories[cat].push(p);
    });

    const categoryNames = Object.keys(categories);

    const filterBar = `
        <div class="gallery-filters reveal">
            <button class="gallery-filter is-active" data-filter="all">All</button>
            ${categoryNames.map((c) => `<button class="gallery-filter" data-filter="${esc(c.toLowerCase())}">${esc(c)}</button>`).join('')}
        </div>`;

    const photoCards = galleryData.photos
        .map((p, idx) => {
            const cat = (p.category || 'other').toLowerCase();
            return `<figure class="gallery-item reveal" data-category="${esc(cat)}" style="transition-delay:${idx * 40}ms">
                <img src="${esc(p.src)}" alt="${esc(p.title)}" loading="lazy">
                <figcaption>
                    <span class="gallery-item-cat">${esc(p.category || '')}</span>
                    <h3 class="gallery-item-title">${esc(p.title)}</h3>
                    <p class="gallery-item-desc">${esc(p.description || '')}</p>
                </figcaption>
            </figure>`;
        })
        .join('\n                    ');

    const lightboxModalHtml = `
        <div class="lightbox" id="galleryLightbox" aria-hidden="true" role="dialog">
            <div class="lightbox-backdrop"></div>
            <button class="lightbox-close" aria-label="Close photo preview">✕</button>
            <button class="lightbox-nav lightbox-prev" aria-label="Previous photo">‹</button>
            <button class="lightbox-nav lightbox-next" aria-label="Next photo">›</button>
            <div class="lightbox-box">
                <div class="lightbox-img-wrap">
                    <img class="lightbox-img" src="" alt="">
                </div>
                <div class="lightbox-meta">
                    <h3 class="lightbox-title"></h3>
                    <p class="lightbox-caption"></p>
                </div>
            </div>
        </div>`;

    const galleryMain = `
        <header class="blog-head reveal">
            <div class="blog-head-meta"><a href="../index.html" class="back-link">← Home</a></div>
            <h1 class="blog-title">${esc(galleryData.title || 'Gallery')}<span class="blog-title-jp">影集</span></h1>
            <p class="blog-sub">${esc(galleryData.description || 'A curated collection of photography works.')}</p>
        </header>
        ${filterBar}
        <div class="gallery-grid">${photoCards}</div>
        ${lightboxModalHtml}
        <div class="end-mark" aria-hidden="true">— 終 —</div>`;

    let galleryTemplate = fs.readFileSync(BLOG_TEMPLATE_PATH, 'utf8');
    galleryTemplate = galleryTemplate.replace(/<!-- TITLE -->/g, esc(galleryData.title || 'Gallery'));
    galleryTemplate = galleryTemplate.replace(/<!-- DESCRIPTION -->/g, esc(galleryData.description || 'Photography Gallery'));
    galleryTemplate = galleryTemplate.replace('<!-- SIDEBAR -->', sidebarHtml);
    galleryTemplate = galleryTemplate.replace('<!-- MOBILE -->', mobileHtml);
    galleryTemplate = galleryTemplate.replace('<!-- MAIN -->', galleryMain);
    galleryTemplate = adjustTemplateForDepth(galleryTemplate, 1);

    fs.writeFileSync(path.join(GALLERY_OUT_DIR, 'index.html'), galleryTemplate, 'utf8');
    console.log(`✓ Built gallery/index.html (${galleryData.photos.length} photos)`);
}

console.log('\n✨ Build successfully completed.');
