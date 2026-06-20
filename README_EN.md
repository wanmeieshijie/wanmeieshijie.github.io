[![中文](https://img.shields.io/badge/lang-中文-red.svg)](README.md)

# 🧸 Magic Notes-Ayong — GitHub Pages Personal Blog

A **whimsical-style** personal static blog powered by GitHub Pages — no backend or database required.

## Live Preview

Upload the project to GitHub and enable GitHub Pages to view it (see deployment guide below).

## Project Structure

```
blog-main/
├── index.html        # Homepage (article list)
├── about.html        # About page
├── archive.html      # Article archive
├── category.html     # Article categories
├── 404.html          # 404 page
├── css/
│   └── style.css     # Global styles (responsive + whimsical)
├── js/
│   ├── config.js     # Configuration (personal info, snow params, etc.)
│   ├── snow.js       # ❄️ Snowflake animation (DOM-based)
│   └── main.js       # Core functionality (theme toggle, nav, Markdown render)
├── posts/            # Article directory
│   ├── posts.json    # Article metadata (title, date, category, excerpt)
│   └── *.md          # Markdown articles
├── README.md         # 中文说明
└── README_EN.md      # English README
```

## Quick Start

### 1. Edit Configuration

Open `config.js` and modify:

- **Site info**: title, subtitle, author name, avatar, etc.
- **Navigation menu**: customize nav links
- **Social links**: GitHub, Weibo, etc.
- **Hero area**: height, background image, gradient mask
- **Snow params**: toggle on/off, flake count

### 2. Add Articles

1. Create a `.md` file in `posts/` directory (suggested naming: `2026-01-01-article-title.md`)
2. Edit `posts/posts-data.js` to add article data (the `content` field holds the full article):

```javascript
{
  "file": "2026-01-01-article-title.md",
  "title": "Article Title",
  "date": "2026-01-01",
  "category": "Category Name",
  "tags": ["tag1", "tag2"],
  "excerpt": "Article excerpt",
  "content": "# Article Title\n\nArticle content..."
}
```

### 3. Deploy to GitHub Pages

1. Create a repository on GitHub named `yourusername.github.io` (or any name)
2. Upload **all files** from the `blog-main/` directory to the repository
3. Go to Settings → Pages, select the deployment branch (main or gh-pages)
4. Wait a few minutes, then visit `https://yourusername.github.io`

> If the repository is not named `username.github.io`, the URL will be `https://yourusername.github.io/repo-name/`

### 4. Change Hero Image

The hero image defaults to an Unsplash image URL. Edit `hero.imgUrl` in `config.js` to use any image URL.

For local images, place the image in the project directory and use a relative path (e.g., `images/hero.jpg`).

## Features

### ✅ Completed Features

| Feature | Description |
|---------|-------------|
| 📱 Responsive Layout | Adapts to phones, tablets, and desktops |
| 🌗 Dark/Light Mode | One-click toggle with auto-saved preference |
| ❄️ Snow Animation | ❄️ emoji DOM rendering, configurable |
| 📝 Markdown Rendering | Native JS parser, zero dependencies |
| 🏷️ Categories/Archive | Organize articles by category and date |
| 🎨 Whimsical Style | Rounded corners, soft shadows, warm colors |
| 🚀 Pure Static | No Node.js needed, upload and go |

## Customize Snow

Find the `snow` config block in `config.js`:

```javascript
snow: {
  enable: true,       // enable snow effect
  maxCount: 40        // maximum flake count (default 40)
}
```

Set `enable` to `false` to disable the snow effect.

## Tech Stack

- **HTML5 + CSS3** — Semantic structure + CSS variable theming system
- **Vanilla JavaScript** — Zero dependencies, lightweight
- **CSS Animations + DOM** — ❄️ Snowflake rendering
- **GitHub Pages** — Static hosting

## License

This project is open source and released under the [MIT License](LICENSE).

---

*See the world with childlike wonder 👀*
