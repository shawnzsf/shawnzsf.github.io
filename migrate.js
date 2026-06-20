/* ==========================================================================
   migrate.js — Migrate old Hexo blog posts to the new design
   Reads from ../blog/source/_posts/, writes to posts/ and images/
   ========================================================================== */

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const OLD_POSTS_DIR = path.join(__dirname, '..', 'blog', 'source', '_posts');
const OLD_IMAGES_DIR = path.join(__dirname, '..', 'blog', 'source', 'images');
const OLD_GALLERY_FILE = path.join(__dirname, '..', 'blog', 'source', 'gallery', 'index.md');
const NEW_POSTS_DIR = path.join(__dirname, 'posts');
const NEW_IMAGES_DIR = path.join(__dirname, 'images');

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function slugify(text) {
    return text
        .toLowerCase()
        .replace(/\.md$/, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

function hasChinese(str) {
    return /[\u4e00-\u9fff]/.test(str);
}

function ensureDir(dir) {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

/* ------------------------------------------------------------------ */
/* 1. Collect all images (loose + asset folders + gallery)             */
/* ------------------------------------------------------------------ */

function collectImages() {
    const images = new Map(); // filename -> source path

    function addImage(filePath) {
        const filename = path.basename(filePath);
        if (!images.has(filename)) {
            images.set(filename, filePath);
        }
    }

    // Loose images in _posts
    fs.readdirSync(OLD_POSTS_DIR).forEach((f) => {
        const fullPath = path.join(OLD_POSTS_DIR, f);
        if (fs.statSync(fullPath).isFile() && /\.(png|jpg|jpeg|gif|svg|webp)$/i.test(f)) {
            addImage(fullPath);
        }
    });

    // Images in asset folders
    fs.readdirSync(OLD_POSTS_DIR).forEach((f) => {
        const fullPath = path.join(OLD_POSTS_DIR, f);
        if (fs.statSync(fullPath).isDirectory()) {
            fs.readdirSync(fullPath).forEach((inner) => {
                if (/\.(png|jpg|jpeg|gif|svg|webp)$/i.test(inner)) {
                    addImage(path.join(fullPath, inner));
                }
            });
        }
    });

    // Gallery images
    if (fs.existsSync(OLD_IMAGES_DIR)) {
        fs.readdirSync(OLD_IMAGES_DIR).forEach((f) => {
            if (/\.(png|jpg|jpeg|gif|svg|webp)$/i.test(f)) {
                addImage(path.join(OLD_IMAGES_DIR, f));
            }
        });
    }

    return images;
}

/* ------------------------------------------------------------------ */
/* 2. Rewrite image paths in markdown content                          */
/* ------------------------------------------------------------------ */

function rewriteImagePaths(content) {
    // Match ![alt](url) including angle-bracket URLs with spaces
    return content.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match, alt, url) => {
        let cleanUrl = url.trim();
        // Remove angle brackets
        if (cleanUrl.startsWith('<') && cleanUrl.endsWith('>')) {
            cleanUrl = cleanUrl.slice(1, -1).trim();
        }
        // Extract filename from any path format
        const filename = path.basename(cleanUrl);
        // Build new relative path from blog/<slug>/ to images/
        const newPath = '../../images/' + filename;
        // Use angle brackets if filename has spaces
        if (/\s/.test(filename)) {
            return `![${alt}](<${newPath}>)`;
        }
        return `![${alt}](${newPath})`;
    });
}

/* ------------------------------------------------------------------ */
/* 3. Normalize frontmatter                                            */
/* ------------------------------------------------------------------ */

function normalizeTags(tags) {
    if (!tags) return [];
    if (Array.isArray(tags)) return tags;
    // Hexo may use "Tag1/Tag2" or "Tag1, Tag2"
    return String(tags)
        .split(/[,/]/)
        .map((t) => t.trim())
        .filter(Boolean);
}

function extractExcerpt(data, content) {
    if (data.description) return data.description;
    if (data.excerpt) return data.excerpt;

    // Remove HTML comments and frontmatter
    const body = content
        .replace(/<!--[\s\S]*?-->/g, '')
        .replace(/<!-- more -->/g, '')
        .trim();

    const lines = body.split('\n');
    for (const line of lines) {
        const trimmed = line.trim();
        if (
            trimmed &&
            !trimmed.startsWith('#') &&
            !trimmed.startsWith('!') &&
            !trimmed.startsWith('|') &&
            !trimmed.startsWith('```') &&
            !trimmed.startsWith('-') &&
            !trimmed.startsWith('>')
        ) {
            // Strip markdown formatting and limit length
            let text = trimmed
                .replace(/[*_`]/g, '')
                .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
                .substring(0, 160);
            if (text.length >= 160) text += '...';
            return text;
        }
    }
    return '';
}

/* ------------------------------------------------------------------ */
/* 4. Main migration                                                   */
/* ------------------------------------------------------------------ */

function migrate() {
    ensureDir(NEW_POSTS_DIR);
    ensureDir(NEW_IMAGES_DIR);

    // --- Copy images ---
    const images = collectImages();
    let imgCount = 0;
    images.forEach((srcPath, filename) => {
        const destPath = path.join(NEW_IMAGES_DIR, filename);
        fs.copyFileSync(srcPath, destPath);
        imgCount++;
    });
    console.log(`✓ Copied ${imgCount} images to images/`);

    // --- Migrate posts ---
    const mdFiles = fs.readdirSync(OLD_POSTS_DIR).filter((f) => f.endsWith('.md'));
    let postCount = 0;
    const migrated = [];

    mdFiles.forEach((file) => {
        const raw = fs.readFileSync(path.join(OLD_POSTS_DIR, file), 'utf8');
        const { data, content } = matter(raw);

        // Determine slug
        let slug;
        if (data.abbrlink && hasChinese(file)) {
            slug = data.abbrlink;
        } else if (data.abbrlink && hasChinese(data.title || '')) {
            slug = data.abbrlink;
        } else {
            slug = slugify(file);
            if (!slug) slug = data.abbrlink || 'post-' + postCount;
        }

        // Normalize frontmatter
        const newFrontmatter = {
            title: data.title || file.replace(/\.md$/, ''),
            date: data.date ? new Date(data.date).toISOString().split('T')[0] : '',
            tags: normalizeTags(data.tags),
            excerpt: extractExcerpt(data, content),
        };

        // Rewrite image paths
        const newContent = rewriteImagePaths(content);

        // Write new post
        const newRaw = matter.stringify(newContent, newFrontmatter);
        fs.writeFileSync(path.join(NEW_POSTS_DIR, slug + '.md'), newRaw, 'utf8');
        postCount++;
        migrated.push({ slug, title: newFrontmatter.title, date: newFrontmatter.date });
    });

    console.log(`✓ Migrated ${postCount} posts to posts/`);
    migrated
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .forEach((p) => console.log(`  ${p.date}  ${p.slug}  —  ${p.title}`));

    // --- Migrate gallery data ---
    if (fs.existsSync(OLD_GALLERY_FILE)) {
        const galleryRaw = fs.readFileSync(OLD_GALLERY_FILE, 'utf8');
        const { data } = matter(galleryRaw);
        if (data.photos) {
            const galleryData = {
                title: data.title || 'Gallery',
                description: data.description || '',
                photos: data.photos.map((p) => ({
                    src: '../images/' + path.basename(p.src),
                    title: p.title || '',
                    description: p.description || '',
                    category: p.category || '',
                })),
            };
            fs.writeFileSync(
                path.join(__dirname, 'gallery.json'),
                JSON.stringify(galleryData, null, 2),
                'utf8'
            );
            console.log(`✓ Migrated gallery (${galleryData.photos.length} photos) to gallery.json`);
        }
    }

    console.log('\nMigration complete. Run "npm run build" to generate the site.');
}

migrate();