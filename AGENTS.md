# Project Overview

This is a **Hexo-based static personal website and blog** for Shoufeng Zhang (张寿峰), hosted on GitHub Pages at https://shawnzsf.github.io. The site serves as a personal portfolio showcasing academic background, projects, and technical blog posts.

## Technology Stack

- **Static Site Generator:** Hexo 8.1.1 (Node.js-based)
- **Templating Engine:** EJS (Embedded JavaScript)
- **Styling:** Stylus preprocessor + Custom CSS (Kachi-iro inspired dark theme)
- **Markdown Renderer:** kramed (with MathJax support for LaTeX)
- **Code Highlighting:** highlight.js (One Dark inspired theme)
- **Image Lightbox:** GLightbox
- **Deployment:** Git-based deployment via `hexo-deployer-git` to GitHub Pages

## Project Structure

```
.
├── _config.yml              # Main Hexo configuration
├── package.json             # Node.js dependencies and npm scripts
├── source/                  # Content source files
│   └── _posts/              # Blog posts (Markdown with YAML frontmatter)
├── themes/                  # Theme files
│   └── ultimate-minimalfolio/    # Custom active theme
│       ├── _config.yml      # Theme-specific configuration
│       ├── layout/          # EJS templates
│       │   ├── layout.ejs   # Base layout template
│       │   ├── index.ejs    # Homepage/CV template
│       │   ├── post.ejs     # Blog post template
│       │   ├── archive.ejs  # Blog archive listing
│       │   ├── gallery.ejs  # Photo gallery template
│       │   └── _partial/    # Partial templates (sidebar, footer)
│       ├── source/          # Theme assets
│       │   ├── css/         # Stylesheets (style.css, gallery.css)
│       │   └── js/          # JavaScript files
│       └── scripts/         # Hexo generator scripts
│           └── gallery-generator.js  # Custom gallery pagination
├── scaffolds/               # Templates for new content
│   ├── post.md              # New blog post template
│   ├── page.md              # New page template
│       └── draft.md             # New draft template
├── public/                  # Generated static site output (gitignored)
└── .deploy_git/             # Git deployment working directory (gitignored)
```

## Build and Development Commands

All commands are defined in `package.json`:

```bash
# Install dependencies
npm install

# Start local development server (default: http://localhost:4000)
npm run server

# Generate static site (output to `public/`)
npm run build

# Deploy to GitHub Pages
npm run deploy

# Clean generated files and cache
npm run clean
```

## Content Management

### Creating New Posts

Use Hexo CLI to create new content:

```bash
# Create a new blog post
npx hexo new post "Post Title"

# Create a new page
npx hexo new page "Page Title"

# Create a new draft
npx hexo new draft "Draft Title"
```

### Post Frontmatter Format

Blog posts use YAML frontmatter at the top of Markdown files:

```yaml
---
title: 'Post Title'
date: 2024-06-27 14:52:18
tags: Tag Name
categories: Category Name
abbrlink: custom-permalink-id
description: Brief description for SEO/summary
---
```

### Content Location

- **Blog posts:** `source/_posts/*.md`
- **Post assets (images):** Place in `source/_posts/` alongside the post or in a subfolder with the same name as the post

## Theme Configuration

The active theme is `ultimate-minimalfolio`, a custom minimalist dark theme with Japanese aesthetic influences.

### Key Theme Settings (`themes/ultimate-minimalfolio/_config.yml`)

- **Navigation menu:** Home, Blog, Gallery, About links
- **CV/Profile data:** Personal info, education, achievements, projects
- **MathJax settings:** Configured for inline math with single `$` delimiter
- **Color scheme:** Dark theme with Kachi-iro (勝色) navy and gold accents

### Layout Structure

- **Homepage (`index.ejs`):** CV/Portfolio style with sections for Introduction, Education, Experience, and Selected Works
- **Blog posts (`post.ejs`):** Article layout with right-side table of contents (auto-highlighting on scroll)
- **Archive (`archive.ejs`):** Chronological listing of all blog posts
- **Gallery (`gallery.ejs`):** Photo gallery with pagination (custom generator)

## Deployment Configuration

Deployment is configured in `_config.yml`:

```yaml
deploy:
  type: git
  repo:
    github: https://github.com/shawnzsf/shawnzsf.github.io.git,main
```

The `npm run deploy` command:
1. Generates the static site to `public/`
2. Commits the generated files to the `.deploy_git` directory
3. Pushes to the `main` branch of the GitHub Pages repository

## Development Conventions

### Code Style

- **CSS:** Uses CSS variables for theming (defined in `:root`)
- **Templates:** EJS syntax with partials for reusable components
- **JavaScript:** ES6+ features, IntersectionObserver for scroll effects

### Typography

- **Sans-serif:** Inter (body text, UI elements)
- **Serif:** Noto Serif JP (Japanese characters, headings)
- **Monospace:** Fira Code (code blocks)

### Color Palette

- Background: `#181a1f` (deep matte dark)
- Text Main: `#c0c5ce` (off-white/silver)
- Accent Gold: `#d4af37` (Kintsugi gold for links/highlights)
- Accent Red: `#8c2727` (lacquer red for special elements)

## Dependencies

Key npm packages (see `package.json` for full list):

- `hexo` - Core framework
- `hexo-generator-*` - Content generators (index, archive, category, tag)
- `hexo-renderer-ejs` - EJS template renderer
- `hexo-renderer-kramed` - Markdown renderer
- `hexo-renderer-mathjax` - LaTeX math support
- `hexo-renderer-stylus` - Stylus CSS preprocessor
- `hexo-deployer-git` - Git deployment
- `hexo-server` - Local development server

## Automated Maintenance

- **Dependabot:** Configured in `.github/dependabot.yml` to check for npm dependency updates daily (max 20 open PRs)

## Special Features

1. **MathJax Support:** LaTeX math rendering enabled on pages that need it (set `mathjax: true` in frontmatter)
2. **Table of Contents:** Auto-generated TOC for blog posts with scroll-based active highlighting
3. **Image Lightbox:** GLightbox integration for gallery and post images
4. **Gallery Generator:** Custom Hexo generator (`gallery-generator.js`) for paginated photo galleries
5. **Wabi-sabi Design:** Subtle noise texture overlay for organic aesthetic

## Notes for AI Agents

- When editing blog posts, preserve existing YAML frontmatter
- The theme is custom and self-contained in `themes/ultimate-minimalfolio/`
- Always run `npm run build` locally to verify changes before deploying
- The `public/` and `.deploy_git/` directories are gitignored and regenerated on build
- Post content supports both English and Chinese (中文)
- Math equations use standard LaTeX syntax with `$...$` for inline and `$$...$$` for block
