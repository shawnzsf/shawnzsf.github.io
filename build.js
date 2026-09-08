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
    let leadParagraphs = '';

    for (const tok of tokens) {
        if (tok.type === 'paragraph') {
            leadParagraphs += marked.parse(tok.raw);
        } else if (tok.type === 'blockquote') {
            const inner = marked.parse(tok.text).replace(/<\/?p>/g, '');
            sideCards.push(inner);
        }
    }

    html += `<div class="bracket-lead">
        <div class="bracket-meta">
            <span class="reg-target">⌖</span>
            <span>RESEARCH PROFILE // OVERVIEW</span>
            <span style="opacity:0.6;">· HKG 22.3°N</span>
        </div>
        <div class="bracket-body">
            ${leadParagraphs}
        </div>
    </div>`;

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
    let html = '<div class="edu-timeline">';

    for (let i = 0; i < tokens.length; i++) {
        const tok = tokens[i];
        if (tok.type === 'heading' && tok.depth === 3) {
            const parts = tok.text.split('·').map((s) => s.trim());
            const date = parts[0] || '';
            const title = parts[1] || tok.text;

            let role = '';
            let gpa = '';
            let awards = [];
            let courses = [];
            for (let j = i + 1; j < tokens.length; j++) {
                const next = tokens[j];
                if (next.type === 'heading') break;
                if (next.type === 'list') {
                    for (const item of next.items) {
                        const text = item.text;
                        const roleM = text.match(/\*\*Role:\*\*\s*(.+)/);
                        const gpaM = text.match(/^(CGPA|QPA|GPA)[\s:]*(.+)/i);
                        const courseM = text.match(/^Core Courses?[\s:]*(.+)/i);
                        if (roleM) {
                            role = roleM[1].trim();
                        } else if (gpaM) {
                            gpa = text;
                        } else if (courseM) {
                            const raw = courseM[1];
                            const parts = [];
                            let depth = 0, start = 0;
                            for (let k = 0; k < raw.length; k++) {
                                if (raw[k] === '(') depth++;
                                else if (raw[k] === ')') depth--;
                                else if (raw[k] === ',' && depth === 0) {
                                    parts.push(raw.slice(start, k).trim());
                                    start = k + 1;
                                }
                            }
                            parts.push(raw.slice(start).trim());
                            courses = parts.filter(Boolean);
                        } else {
                            awards.push(text);
                        }
                    }
                }
            }

            html += `<article class="edu-card reveal">`;
            html += `<div class="edu-accent" aria-hidden="true"></div>`;
            html += `<div class="edu-header">`;
            html += `<div class="edu-title-row">`;
            html += `<h3 class="edu-school">${esc(title)}</h3>`;
            html += `<span class="edu-date">${esc(date)}</span>`;
            html += `</div>`;
            if (role) html += `<p class="edu-role">${esc(role)}</p>`;
            html += `</div>`;

            const hasDetails = gpa || awards.length || courses.length;
            if (hasDetails) {
                html += `<div class="edu-details">`;

                if (gpa) {
                    html += `<div class="edu-stat">`;
                    html += `<span class="edu-stat-label">GPA</span>`;
                    html += `<span class="edu-stat-value">${marked.parseInline(gpa)}</span>`;
                    html += `</div>`;
                }

                if (awards.length) {
                    html += `<div class="edu-awards">`;
                    html += `<span class="edu-detail-label">Awards</span>`;
                    html += `<ul>`;
                    awards.forEach((a) => {
                        html += `<li>${marked.parseInline(a)}</li>`;
                    });
                    html += `</ul></div>`;
                }

                if (courses.length) {
                    html += `<div class="edu-courses">`;
                    html += `<span class="edu-detail-label">Courses</span>`;
                    html += `<div class="edu-course-pills">`;
                    courses.forEach((c) => {
                        html += `<span class="edu-pill">${esc(c)}</span>`;
                    });
                    html += `</div></div>`;
                }

                html += `</div>`;
            }

            html += `</article>`;
        }
    }
    html += '</div>';
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

function buildSection(navItem, contentHtml) {
    return `
            <section class="folio-sec" id="${navItem.id}" data-section-num="${navItem.num}">
                <div class="folio-sec-head reveal">
                    <div class="folio-sec-tag">
                        <span class="sec-kanji-num">${navItem.num}</span>
                        <span class="sec-label-text">${esc(navItem.label)}</span>
                    </div>
                    <div class="sec-ornament" aria-hidden="true">
                        <span class="sec-ornament-line"></span>
                        <span class="sec-crosshair">⌖</span>
                    </div>
                </div>
                <div class="folio-sec-body">
                    ${contentHtml}
                </div>
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
cfg.nav.forEach((navItem) => {
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
    mainHtml += buildSection(navItem, content);
});

/* Hero Landing Section */
const heroKicker = cfg.hero_kicker || "SYSTEMS HARDWARE · LENS & STREET · QUIET CURIOSITY";
const heroTitle = cfg.hero_title || "Grounded in physical reality, guided by quiet curiosity.";
const heroThesis = cfg.hero_thesis || "I work at the junction where digital intelligence meets physical matter—designing autonomous systems that confront friction, gravity, and open-world uncertainty. Beyond engineering, I walk city streets with a camera, capturing the unscripted poetry of ordinary life. Guided by craftsmanship and quiet resolve: building things that endure reality, and walking steadily through the rain.";

const heroHtml = `
    <section class="hero-landing" id="hero">
        <div class="hero-content">
            <div class="hero-masthead reveal">
                <div class="hero-seal-badge">
                    <span class="seal" title="${esc(cfg.name_jp)}">${esc(cfg.name_jp.charAt(0))}</span>
                    <span class="hero-name-kanji">${esc(cfg.name_jp)}</span>
                    <span class="hero-sep">/</span>
                    <span class="hero-name-en">${esc(cfg.name_en)}</span>
                </div>
                <div class="hero-folio-tag">
                    <span class="hero-coord">ARCHIVE SPECIMEN · VOL. MMXXVI</span>
                    <span class="hero-tag-bullet">·</span>
                    <span class="hero-edition">EDITION NO. 0026 / 1000</span>
                </div>
            </div>

            <div class="hero-centerpiece reveal">
                <div class="hero-kicker">${esc(heroKicker)}</div>
                <h1 class="hero-title">${esc(heroTitle)}</h1>
                <p class="hero-thesis">
                    ${esc(heroThesis)}
                </p>
            </div>

            <div class="hero-foot reveal">
                <div class="hero-status-pill">
                    <span class="dot"></span>
                    <span class="hero-status-txt">${esc(cfg.status)}</span>
                    <span class="status-sep">·</span>
                    <span class="hero-affil-txt">${esc(cfg.affiliation)}</span>
                </div>
                <a href="#about" class="hero-scroll-cue" aria-label="Scroll to read folio">
                    <span class="scroll-cue-txt">EXPLORE FOLIO</span>
                    <span class="scroll-cue-arrow">↓</span>
                </a>
            </div>
        </div>
    </section>`;

/* Floating Retractable Navigation Dock */
const navDockHtml = `
    <nav class="nav-dock" id="navDock" aria-label="Quick Navigation">
        <div class="nav-dock-inner">
            <a href="#hero" class="nav-dock-brand" title="Return to Top">
                <span class="dock-seal">${esc(cfg.name_jp.charAt(0))}</span>
                <span class="dock-name">${esc(cfg.name_jp)}</span>
                <span class="dock-collapsed-cue" aria-hidden="true">
                    <span class="dock-cue-bullet">·</span>
                    <span class="dock-cue-txt">導覽</span>
                </span>
            </a>
            <div class="nav-dock-divider" aria-hidden="true"></div>
            <div class="nav-dock-links" id="dockLinks">
                <div class="dock-mobile-header" aria-hidden="true">
                    <span class="dock-m-title">FOLIO DIRECTORY / 導覽目錄</span>
                    <span class="dock-m-badge">VOL. MMXXVI</span>
                </div>
                <a href="#about" class="dock-link" data-sec="about"><span class="dock-num">壹</span><span class="dock-txt">About</span><span class="dock-arrow" aria-hidden="true">→</span></a>
                <a href="#education" class="dock-link" data-sec="education"><span class="dock-num">貳</span><span class="dock-txt">Education</span><span class="dock-arrow" aria-hidden="true">→</span></a>
                <a href="#experience" class="dock-link" data-sec="experience"><span class="dock-num">叁</span><span class="dock-txt">Works</span><span class="dock-arrow" aria-hidden="true">→</span></a>
                <a href="#skills" class="dock-link" data-sec="skills"><span class="dock-num">肆</span><span class="dock-txt">Skills</span><span class="dock-arrow" aria-hidden="true">→</span></a>
                <a href="#contact" class="dock-link" data-sec="contact"><span class="dock-num">伍</span><span class="dock-txt">Contact</span><span class="dock-arrow" aria-hidden="true">→</span></a>
                <span class="dock-sep" aria-hidden="true">·</span>
                <div class="dock-mobile-sep" aria-hidden="true">
                    <span class="dock-sep-text">PUBLICATIONS & ART / 筆記與影像</span>
                </div>
                <a href="blog/index.html" class="dock-link dock-link-ext"><span class="dock-num">筆</span><span class="dock-txt">Blog</span><span class="dock-arrow" aria-hidden="true">↗</span></a>
                <a href="gallery/index.html" class="dock-link dock-link-ext"><span class="dock-num">影</span><span class="dock-txt">Gallery</span><span class="dock-arrow" aria-hidden="true">↗</span></a>
            </div>
            <button class="nav-dock-toggle" id="dockToggle" aria-label="Toggle Navigation Dock">
                <span></span><span></span>
            </button>
        </div>
    </nav>
    <div class="nav-dock-backdrop" id="dockBackdrop" aria-hidden="true"></div>`;

/* Archival Colophon */
const colophonHtml = `
    <footer class="archival-colophon" id="colophon">
        <div class="colophon-inner">
            <div class="colophon-grid">
                <div class="colophon-identity">
                    <div class="seal-wrap">
                        <div class="seal" title="${esc(cfg.name_jp)}">${esc(cfg.name_jp.charAt(0))}</div>
                        <div class="seal-sub">${esc(cfg.name_jp.slice(1))}</div>
                    </div>
                    <h3 class="colophon-name-en">${esc(cfg.name_en)}</h3>
                    <p class="colophon-name-jp">${esc(cfg.name_jp)}</p>
                    <p class="colophon-sub">${esc(cfg.title)}</p>
                    <p class="colophon-affil">${esc(cfg.affiliation)}</p>
                    <p class="colophon-vertical-deco" aria-hidden="true">${esc(cfg.vertical_deco)}</p>
                </div>

                <div class="colophon-facts">
                    <h4 class="colophon-heading">REGISTRATION &amp; DOSSIER</h4>
                    <dl class="colophon-dl">
                        <div><dt>LOCATION</dt><dd>${esc(cfg.location)}</dd></div>
                        <div><dt>COORDINATES</dt><dd>22.3058° N, 114.1734° E</dd></div>
                        <div><dt>STATUS</dt><dd><span class="dot"></span>${esc(cfg.status)}</dd></div>
                        <div><dt>RESEARCH</dt><dd>${esc(cfg.focus)}</dd></div>
                    </dl>
                </div>

                <div class="colophon-directory">
                    <h4 class="colophon-heading">FOLIO DIRECTORY</h4>
                    <nav class="colophon-nav">
                        <a href="#about"><span class="colophon-num">壹</span>About</a>
                        <a href="#education"><span class="colophon-num">貳</span>Education</a>
                        <a href="#experience"><span class="colophon-num">叁</span>Experience &amp; Works</a>
                        <a href="#skills"><span class="colophon-num">肆</span>Skills</a>
                        <a href="#contact"><span class="colophon-num">伍</span>Contact</a>
                        <a href="blog/index.html"><span class="colophon-num">筆</span>Writing &amp; Blog</a>
                        <a href="gallery/index.html"><span class="colophon-num">影</span>Photography Gallery</a>
                    </nav>
                </div>

                <div class="colophon-dispatch">
                    <h4 class="colophon-heading">TRANSMISSION</h4>
                    <p class="colophon-lead">Open to research discussions, hardware collaborations, and robotics inquiry.</p>
                    <div class="colophon-links">
                        <a href="mailto:${esc(cfg.email)}" class="colophon-btn"><span class="btn-k">Email</span> <span class="btn-v">${esc(cfg.email)}</span></a>
                        <a href="${esc(cfg.github)}" target="_blank" rel="noopener" class="colophon-btn"><span class="btn-k">GitHub</span> <span class="btn-v">${esc(cfg.github_handle)}</span></a>
                        <a href="${esc(cfg.rednote)}" target="_blank" rel="noopener" class="colophon-btn"><span class="btn-k">RedNote</span> <span class="btn-v">${esc(cfg.rednote_label)}</span></a>
                    </div>
                </div>
            </div>

            <div class="colophon-bottom">
                <span class="colophon-edition">ARCHIVAL FOLIO · NO. 0026 / 1000 · RISOGRAPH MONOCHROME</span>
                <span class="colophon-copy">© 2026 ${esc(cfg.name_jp)} · ALL RIGHTS RESERVED</span>
            </div>
        </div>
    </footer>`;

/* Compile & Write index.html */
let template = fs.readFileSync(TEMPLATE_PATH, 'utf8');
template = template.replace('<!-- NAV_DOCK -->', navDockHtml);
template = template.replace('<!-- HERO -->', heroHtml);
template = template.replace('<!-- MAIN -->', mainHtml);
template = template.replace('<!-- COLOPHON -->', colophonHtml);
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
    tpl = tpl.replace(/href="#([a-z0-9\-]+)"/g, `href="${prefix}index.html#$1"`);
    tpl = tpl.replace(/href="blog\/index\.html"/g, `href="${prefix}blog/index.html"`);
    tpl = tpl.replace(/href="gallery\/index\.html"/g, `href="${prefix}gallery/index.html"`);
    tpl = tpl.replace(/href="\.\.\/index\.html"/g, `href="${prefix}index.html"`);
    return tpl;
}

if (posts.length > 0) {
    ensureDir(BLOG_OUT_DIR);

    /* Blog Index */
    const allTags = new Set();
    posts.forEach((p) => p.tags.forEach((t) => allTags.add(t)));
    const uniqueTags = Array.from(allTags).sort();

    const blogFilterBar = uniqueTags.length > 1
        ? `<div class="blog-filters reveal">
            <button class="blog-filter is-active" data-tag="all">All</button>
            ${uniqueTags.map((t) => `<button class="blog-filter" data-tag="${esc(t)}">${esc(t)}</button>`).join('')}
        </div>`
        : '';

    const postItems = posts
        .map((p) => {
            const tagSpans = p.tags.map((t) => `<span>${esc(t)}</span>`).join('');
            const dataTags = p.tags.join(' ');
            return `<li class="reveal" data-tags="${esc(dataTags)}">
                <a href="/blog/${p.slug}/" class="post-link" data-slug="${p.slug}">
                    <div class="post-item-top">
                        <span class="post-title">${esc(p.title)}</span>
                        <div class="post-meta-right">
                            <span class="reading-time">${esc(p.readingTime)}</span>
                            <time class="post-date">${formatDate(p.date)}</time>
                        </div>
                    </div>
                    ${p.excerpt ? `<p class="post-excerpt">${esc(p.excerpt)}</p>` : ''}
                    <div class="post-item-foot">
                        <div class="post-tags">${tagSpans}</div>
                        <span class="post-read-arrow">Read →</span>
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
    blogTemplate = blogTemplate.replace('<!-- NAV_DOCK -->', navDockHtml);
    blogTemplate = blogTemplate.replace('<!-- MAIN -->', blogIndexMain);
    blogTemplate = blogTemplate.replace('<!-- COLOPHON -->', colophonHtml);
    blogTemplate = adjustTemplateForDepth(blogTemplate, 1);

    fs.writeFileSync(path.join(BLOG_OUT_DIR, 'index.html'), blogTemplate, 'utf8');
    console.log(`✓ Built blog/index.html (${posts.length} posts)`);

    /* Individual Post Pages */
    posts.forEach((p, idx) => {
        const postDir = path.join(BLOG_OUT_DIR, p.slug);
        ensureDir(postDir);

        const bodyHtml = marked.parse(p.content);
        const tagSpans = p.tags.map((t) => `<span>${esc(t)}</span>`).join('');

        const prevPost = idx < posts.length - 1 ? posts[idx + 1] : null;
        const nextPost = idx > 0 ? posts[idx - 1] : null;
        let postNavHtml = '';
        if (prevPost || nextPost) {
            postNavHtml = '<nav class="post-nav">';
            if (prevPost) {
                postNavHtml += `<a href="/blog/${prevPost.slug}/" class="post-nav-item prev">
                    <span class="post-nav-label">← Previous</span>
                    <span class="post-nav-title">${esc(prevPost.title)}</span>
                </a>`;
            } else {
                postNavHtml += '<div></div>';
            }
            if (nextPost) {
                postNavHtml += `<a href="/blog/${nextPost.slug}/" class="post-nav-item next">
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
                <header class="post-head">
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
        postTemplate = postTemplate.replace('<!-- NAV_DOCK -->', navDockHtml);
        postTemplate = postTemplate.replace('<!-- MAIN -->', postMain);
        postTemplate = postTemplate.replace('<!-- COLOPHON -->', colophonHtml);
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
            const plateNo = String(idx + 1).padStart(2, '0');
            return `<figure class="gallery-item reveal" data-category="${esc(cat)}" style="transition-delay:${idx * 40}ms">
                <span class="washi-tape washi-tape-tl" aria-hidden="true"></span>
                <span class="washi-tape washi-tape-tr" aria-hidden="true"></span>
                <img src="${esc(p.src)}" alt="${esc(p.title)}">
                <figcaption>
                    <span class="gallery-item-cat">${esc(p.category || '')}</span>
                    <h3 class="gallery-item-title">${esc(p.title)}</h3>
                    <p class="gallery-item-desc">${esc(p.description || '')}</p>
                </figcaption>
                <div class="gallery-item-plate-meta">
                    <span class="gallery-item-plate-num">Pl. ${plateNo}</span>
                    <span class="gallery-item-plate-tech">35mm · Hong Kong</span>
                </div>
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
    galleryTemplate = galleryTemplate.replace('<!-- NAV_DOCK -->', navDockHtml);
    galleryTemplate = galleryTemplate.replace('<!-- MAIN -->', galleryMain);
    galleryTemplate = galleryTemplate.replace('<!-- COLOPHON -->', colophonHtml);
    galleryTemplate = adjustTemplateForDepth(galleryTemplate, 1);

    fs.writeFileSync(path.join(GALLERY_OUT_DIR, 'index.html'), galleryTemplate, 'utf8');
    console.log(`✓ Built gallery/index.html (${galleryData.photos.length} photos)`);
}

console.log('\n✨ Build successfully completed.');
