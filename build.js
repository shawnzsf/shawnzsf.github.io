/* ==========================================================================
   build.js — Markdown → HTML renderer
   Reads content.md, generates index.html with sidebar + main content
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
const raw = fs.readFileSync(CONTENT_PATH, 'utf8');
const { data: cfg, content: body } = matter(raw);

/* ------------------------------------------------------------------ */
/* 2. Configure marked                                                 */
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

/* ------------------------------------------------------------------ */
/* 3. Split body into H2 sections                                      */
/* ------------------------------------------------------------------ */
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

const sections = splitSections(body);
const sectionMap = {};
sections.forEach((s) => {
    const id = s.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    sectionMap[id] = s;
});

/* ------------------------------------------------------------------ */
/* 4. HTML escape helper                                               */
/* ------------------------------------------------------------------ */
function esc(str) {
    return String(str)
        .replace(/&/g, '\u0026amp;')
        .replace(/</g, '\u0026lt;')
        .replace(/>/g, '\u0026gt;')
        .replace(/"/g, '\u0026quot;');
}

/* ------------------------------------------------------------------ */
/* 5. Section renderers                                                */
/* ------------------------------------------------------------------ */

/* About: paragraphs + blockquotes (rendered as mini-cards) */
function renderAbout(md) {
    const tokens = marked.lexer(md);
    let html = '<div class="about-cols"><div class="about-text reveal">';
    const sideCards = [];

    for (const tok of tokens) {
        if (tok.type === 'paragraph') {
            html += marked.parse(tok.raw);
        } else if (tok.type === 'blockquote') {
            // Render blockquote content as a mini-card
            const inner = marked.parse(tok.text).replace(/<\/?p>/g, '');
            sideCards.push(inner);
        }
    }

    // Quote
    if (cfg.quote) {
        html += `<p class="quote"><span class="quote-mark">「</span>${esc(cfg.quote)}<span class="quote-mark">」</span></p>`;
    }
    html += '</div>';

    // Side cards
    if (sideCards.length) {
        html += '<aside class="about-side reveal">';
        sideCards.forEach((card) => {
            // First line/strong becomes the label
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

/* Education / Experience: H3 blocks (multi-line) or tables → entries */
function renderEntries(md, hasInstitution) {
    const tokens = marked.lexer(md);
    let html = '<ul class="entries">';

    for (let i = 0; i < tokens.length; i++) {
        const tok = tokens[i];
        if (tok.type === 'heading' && tok.depth === 3) {
            // New H3 format: "Date · Title"
            const parts = tok.text.split('·').map((s) => s.trim());
            const date = parts[0] || '';
            const title = parts[1] || '';

            html += '<li>';
            html += `<div class="entry-date">${esc(date)}</div>`;
            html += '<div class="entry-body">';
            html += `<strong>${esc(title)}</strong>`;

            // Collect following list items
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
        } else if (tok.type === 'table') {
            // Backward compatibility with table format
            for (const row of tok.rows) {
                const cells = row.map((c) => c.text.trim());
                let date, title, role, note;
                if (hasInstitution) {
                    [date, title, role, note] = cells;
                } else {
                    [date, title, note] = cells;
                }
                html += '<li>';
                html += `<div class="entry-date">${esc(date)}</div>`;
                html += '<div class="entry-body">';
                html += `<strong>${esc(title)}</strong>`;
                if (role) html += `<span class="entry-role">${esc(role)}</span>`;
                if (note) html += `<span class="entry-note">${esc(note)}</span>`;
                html += '</div></li>';
            }
        }
    }
    html += '</ul>';
    return html;
}

/* Experience & Works (merged): H3 blocks → work cards with multi-line support */
function renderWorks(md) {
    const tokens = marked.lexer(md);
    let html = '<div class="works">';
    let currentNo = 0;

    for (let i = 0; i < tokens.length; i++) {
        const tok = tokens[i];
        if (tok.type === 'heading' && tok.depth === 3) {
            currentNo++;
            // Parse "Date · Title" format
            const parts = tok.text.split('·').map((s) => s.trim());
            const date = parts[0] || '';
            const title = parts[1] || tok.text;

            html += `<article class="work reveal">`;
            html += `<div class="work-no">${String(currentNo).padStart(2, '0')}</div>`;
            html += `<div class="work-main">`;

            // Collect following list + paragraph until next H3 or end
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

/* Skills: H3 blocks → skill columns */
function renderSkills(md) {
    const tokens = marked.lexer(md);
    let html = '<div class="skills">';

    for (let i = 0; i < tokens.length; i++) {
        const tok = tokens[i];
        if (tok.type === 'heading' && tok.depth === 3) {
            html += `<div class="skill-col reveal"><h3>${esc(tok.text)}</h3><ul>`;
            // Collect following list
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

/* Contact: paragraph + contact items from frontmatter */
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
    html += `<p class="contact-lead">${lead}</p>`;
    html += '<div class="contact-grid">';
    html += `<a href="mailto:${esc(cfg.email)}" class="contact-item"><span class="contact-k">Email</span><span class="contact-v">${esc(cfg.email)}</span></a>`;
    html += `<a href="${esc(cfg.github)}" target="_blank" rel="noopener" class="contact-item"><span class="contact-k">GitHub</span><span class="contact-v">${esc(cfg.github_handle)}</span></a>`;
    html += `<a href="${esc(cfg.rednote)}" target="_blank" rel="noopener" class="contact-item"><span class="contact-k">RedNote</span><span class="contact-v">${esc(cfg.rednote_label)}</span></a>`;
    html += '</div></div>';
    html += '<div class="end-mark" aria-hidden="true">— 終 —</div>';
    return html;
}

/* ------------------------------------------------------------------ */
/* 6. Build section HTML                                               */
/* ------------------------------------------------------------------ */
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
/* 7. Assemble main content                                            */
/* ------------------------------------------------------------------ */
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
            content = renderEntries(sec.body, true);
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

/* ------------------------------------------------------------------ */
/* 8. Build sidebar                                                    */
/* ------------------------------------------------------------------ */
const sidebarHtml = `
        <aside class="sidebar">
            <div class="sidebar-inner">
                <div class="seal-wrap">
                    <div class="seal">${esc(cfg.name_jp.charAt(0))}</div>
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

                <nav class="side-nav">
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

/* ------------------------------------------------------------------ */
/* 9. Mobile topbar + panel                                            */
/* ------------------------------------------------------------------ */
const mobileHtml = `
            <div class="topbar">
                <span class="topbar-name">${esc(cfg.name_jp)} · ${esc(cfg.name_en)}</span>
                <button class="topbar-toggle" id="topbarToggle" aria-label="Menu">
                    <span></span><span></span><span></span>
                </button>
            </div>

            <div class="mobile-panel" id="mobilePanel">
                <nav class="mobile-nav">
                    ${cfg.nav
                        .map((n) => `<a href="#${n.id}" class="mobile-link">${esc(n.label)}</a>`)
                        .join('\n                    ')}
                    <a href="blog/index.html" class="mobile-link">Blog</a>
                    <a href="gallery/index.html" class="mobile-link">Gallery</a>
                </nav>
            </div>`;

/* ------------------------------------------------------------------ */
/* 10. Read template & inject                                          */
/* ------------------------------------------------------------------ */
let template = fs.readFileSync(TEMPLATE_PATH, 'utf8');

template = template.replace('<!-- SIDEBAR -->', sidebarHtml);
template = template.replace('<!-- MOBILE -->', mobileHtml);
template = template.replace('<!-- MAIN -->', mainHtml);

/* ------------------------------------------------------------------ */
/* 11. Write output                                                    */
/* ------------------------------------------------------------------ */
fs.writeFileSync(OUT_PATH, template, 'utf8');
console.log('✓ Built index.html from content.md');
console.log(`  Sections: ${cfg.nav.map((n) => n.label).join(', ')}`);
console.log(`  Output: ${OUT_PATH}`);
/* ------------------------------------------------------------------ */
/* 12. BLOG — read posts/, build blog index + post pages               */
/* ------------------------------------------------------------------ */

// Slugify a filename into a URL-safe slug
function slugify(name) {
    return name
        .toLowerCase()
        .replace(/\.md$/, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

// Format date as "Aug 22, 2024"
function formatDate(dateStr) {
    const d = new Date(dateStr);
    if (isNaN(d)) return esc(dateStr);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
}

// Collect all posts
let posts = [];
if (fs.existsSync(POSTS_DIR)) {
    const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith('.md'));
    posts = files.map((file) => {
        const raw = fs.readFileSync(path.join(POSTS_DIR, file), 'utf8');
        const { data, content } = matter(raw);
        return {
            slug: slugify(file),
            title: data.title || file,
            date: data.date || '',
            tags: data.tags || [],
            excerpt: data.excerpt || '',
            content: content
        };
    });
    // Sort by date descending
    posts.sort((a, b) => new Date(b.date) - new Date(a.date));
}

// Ensure blog output directory exists
function ensureDir(dir) {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

// Adjust template paths for a given depth (1 = blog/, 2 = blog/slug/)
function adjustTemplateForDepth(tpl, depth) {
    const prefix = '../'.repeat(depth);
    tpl = tpl.replace('href="../css/style.css"', 'href="' + prefix + 'css/style.css"');
    tpl = tpl.replace('src="../js/main.js"', 'src="' + prefix + 'js/main.js"');
    tpl = tpl.replace(/href="#([a-z]+)"/g, 'href="' + prefix + 'index.html#$1"');
    tpl = tpl.replace(/href="blog\/index\.html"/g, 'href="' + prefix + 'blog/index.html"');
    tpl = tpl.replace(/href="gallery\/index\.html"/g, 'href="' + prefix + 'gallery/index.html"');
    return tpl;
}

if (posts.length === 0) {
    console.log('No posts found in posts/ - skipping blog build.');
} else {
    ensureDir(BLOG_OUT_DIR);

    /* --- 12a. Blog index page --- */
    const postItems = posts.map((p) => {
        const tagSpans = p.tags.map((t) => '<span>' + esc(t) + '</span>').join('');
        return '<li class="post-item reveal">' +
            '<a href="' + p.slug + '/index.html" class="post-link">' +
            '<div class="post-date">' + formatDate(p.date) + '</div>' +
            '<div class="post-body">' +
            '<h2 class="post-h">' + esc(p.title) + '</h2>' +
            '<p class="post-excerpt">' + esc(p.excerpt) + '</p>' +
            '<div class="post-tags">' + tagSpans + '</div>' +
            '</div></a></li>';
    }).join('\n                    ');

    const blogIndexMain =
        '<header class="blog-head reveal">' +
            '<div class="blog-head-meta"><a href="../index.html" class="back-link">← Home</a></div>' +
            '<h1 class="blog-title">Blog<span class="blog-title-jp">筆記</span></h1>' +
            '<p class="blog-sub">Writings on hardware, systems, and machine learning.</p>' +
        '</header>' +
        '<ul class="post-list">' + postItems + '</ul>' +
        '<div class="end-mark" aria-hidden="true">— 終 —</div>';

    let blogTemplate = fs.readFileSync(BLOG_TEMPLATE_PATH, 'utf8');
    blogTemplate = blogTemplate.replace('<!-- TITLE -->', 'Blog');
    blogTemplate = blogTemplate.replace('<!-- SIDEBAR -->', sidebarHtml);
    blogTemplate = blogTemplate.replace('<!-- MOBILE -->', mobileHtml);
    blogTemplate = blogTemplate.replace('<!-- MAIN -->', blogIndexMain);
    blogTemplate = adjustTemplateForDepth(blogTemplate, 1);

    fs.writeFileSync(path.join(BLOG_OUT_DIR, 'index.html'), blogTemplate, 'utf8');
    console.log('Built blog/index.html (' + posts.length + ' posts)');

    /* --- 12b. Individual post pages --- */
    posts.forEach((p) => {
        const postDir = path.join(BLOG_OUT_DIR, p.slug);
        ensureDir(postDir);

        const bodyHtml = marked.parse(p.content);
        const tagSpans = p.tags.map((t) => '<span>' + esc(t) + '</span>').join('');

        const postMain =
            '<article class="post-article">' +
                '<header class="post-head reveal">' +
                    '<div class="post-head-meta">' +
                        '<a href="../index.html" class="back-link">← Blog</a>' +
                        '<time class="post-head-date">' + formatDate(p.date) + '</time>' +
                    '</div>' +
                    '<h1 class="post-head-title">' + esc(p.title) + '</h1>' +
                    '<div class="post-head-tags">' + tagSpans + '</div>' +
                '</header>' +
                '<div class="post-body">' + bodyHtml + '</div>' +
                '<footer class="post-foot"><a href="../index.html" class="back-link">← Back to Blog</a></footer>' +
            '</article>';

        let postTemplate = fs.readFileSync(BLOG_TEMPLATE_PATH, 'utf8');
        postTemplate = postTemplate.replace('<!-- TITLE -->', esc(p.title));
        postTemplate = postTemplate.replace('<!-- SIDEBAR -->', sidebarHtml);
        postTemplate = postTemplate.replace('<!-- MOBILE -->', mobileHtml);
        postTemplate = postTemplate.replace('<!-- MAIN -->', postMain);
        postTemplate = adjustTemplateForDepth(postTemplate, 2);

        fs.writeFileSync(path.join(postDir, 'index.html'), postTemplate, 'utf8');
    });
    console.log('Built ' + posts.length + ' post page(s) in blog/');
}

/* ------------------------------------------------------------------ */
/* 13. GALLERY — read gallery.json, build gallery page                 */
/* ------------------------------------------------------------------ */

if (fs.existsSync(GALLERY_DATA_PATH)) {
    ensureDir(GALLERY_OUT_DIR);

    const galleryData = JSON.parse(fs.readFileSync(GALLERY_DATA_PATH, 'utf8'));

    // Group photos by category
    const categories = {};
    galleryData.photos.forEach((p) => {
        const cat = p.category || 'Other';
        if (!categories[cat]) categories[cat] = [];
        categories[cat].push(p);
    });

    const categoryNames = Object.keys(categories);

    // Build filter bar
    const filterBar =
        '<div class="gallery-filters reveal">' +
            '<button class="gallery-filter is-active" data-filter="all">All</button>' +
            categoryNames.map((c) =>
                '<button class="gallery-filter" data-filter="' + esc(c.toLowerCase()) + '">' + esc(c) + '</button>'
            ).join('') +
        '</div>';

    // Build photo grid
    const photoCards = galleryData.photos.map((p, idx) => {
        const cat = (p.category || 'other').toLowerCase();
        return '<figure class="gallery-item reveal" data-category="' + esc(cat) + '" style="transition-delay:' + (idx * 40) + 'ms">' +
            '<img src="' + esc(p.src) + '" alt="' + esc(p.title) + '" loading="lazy">' +
            '<figcaption>' +
                '<span class="gallery-item-cat">' + esc(p.category || '') + '</span>' +
                '<h3 class="gallery-item-title">' + esc(p.title) + '</h3>' +
                '<p class="gallery-item-desc">' + esc(p.description || '') + '</p>' +
            '</figcaption>' +
        '</figure>';
    }).join('\n                    ');

    const galleryMain =
        '<header class="blog-head reveal">' +
            '<div class="blog-head-meta"><a href="../index.html" class="back-link">← Home</a></div>' +
            '<h1 class="blog-title">' + esc(galleryData.title || 'Gallery') + '<span class="blog-title-jp">影集</span></h1>' +
            '<p class="blog-sub">' + esc(galleryData.description || '') + '</p>' +
        '</header>' +
        filterBar +
        '<div class="gallery-grid">' + photoCards + '</div>' +
        '<div class="end-mark" aria-hidden="true">— 終 —</div>';

    let galleryTemplate = fs.readFileSync(BLOG_TEMPLATE_PATH, 'utf8');
    galleryTemplate = galleryTemplate.replace('<!-- TITLE -->', esc(galleryData.title || 'Gallery'));
    galleryTemplate = galleryTemplate.replace('<!-- SIDEBAR -->', sidebarHtml);
    galleryTemplate = galleryTemplate.replace('<!-- MOBILE -->', mobileHtml);
    galleryTemplate = galleryTemplate.replace('<!-- MAIN -->', galleryMain);
    galleryTemplate = adjustTemplateForDepth(galleryTemplate, 1);

    fs.writeFileSync(path.join(GALLERY_OUT_DIR, 'index.html'), galleryTemplate, 'utf8');
    console.log('Built gallery/index.html (' + galleryData.photos.length + ' photos)');
} else {
    console.log('No gallery.json found - skipping gallery build.');
}

console.log('\nDone. Open index.html to view.');
