# 🧸 魔法手记-啊勇 — GitHub Pages 个人博客

一个充满**童趣风格**的个人静态博客，基于 GitHub Pages 部署，无需后端和数据库。

## 在线预览

将项目上传至 GitHub 后，启用 GitHub Pages 即可访问（详见下方部署教程）。

## 项目结构

```
blog-main/
├── index.html        # 首页（文章列表）
├── about.html        # 关于页
├── archive.html      # 文章归档
├── category.html     # 文章分类
├── 404.html          # 404 页面
├── css/
│   └── style.css     # 全局样式（响应式 + 童趣风格）
├── js/
│   ├── config.js     # 配置文件（修改个人信息、雪景参数等）
│   ├── snow.js       # ❄️ 雪花动画（DOM 渲染）
│   └── main.js       # 核心功能（主题切换、导航、Markdown 渲染等）
├── posts/            # 文章目录
│   ├── posts.json    # 文章元数据（标题、日期、分类、摘要）
│   └── *.md          # Markdown 文章
└── README.md         # 本文件
```

## 快速开始

### 1. 修改配置

打开 `config.js`，修改以下内容：

- **站点信息**：标题、副标题、作者名、头像等
- **导航菜单**：自定义导航链接
- **社交链接**：GitHub、微博等
- **海报区域**：高度、背景图、渐变色
- **雪景参数**：开启/关闭、雪花数量、速度、颜色

### 2. 添加文章

1. 在 `posts/` 目录下创建 `.md` 文件，建议命名格式：`2026-01-01-文章标题.md`
2. 编辑 `posts/posts-data.js`，添加文章数据（含 `content` 字段为文章完整内容）：
```javascript
{
  "file": "2026-01-01-文章标题.md",
  "title": "文章标题",
  "date": "2026-01-01",
  "category": "分类名",
  "tags": ["标签1", "标签2"],
  "excerpt": "文章摘要",
  "content": "# 文章标题\n\n文章内容..."
}
```

### 3. 部署到 GitHub Pages

1. 在 GitHub 上创建仓库，命名为 `你的用户名.github.io`（或任意名称）
2. 将 `blog-main/` 目录下**所有文件**上传至仓库
3. 进入仓库 Settings → Pages，选择部署分支（main 或 gh-pages）
4. 等待几分钟，访问 `https://你的用户名.github.io` 即可

> 如果不是 `用户名.github.io` 仓库，访问地址为 `https://你的用户名.github.io/仓库名/`

### 4. 修改海报图片

海报默认使用 Unsplash 的图片链接，可在 `config.js` 中修改 `hero.imgUrl` 为任意图片地址。

如需使用本地图片，将图片放入项目目录，路径改为相对路径（如 `images/hero.jpg`）。

## 功能特性

### ✅ 已完成功能

| 功能 | 说明 |
|------|------|
| 📱 响应式布局 | 手机、平板、电脑自适应 |
| 🌗 深色/浅色模式 | 一键切换，自动记忆偏好 |
| ❄️ 雪景动画 | ❄️ 字符 DOM 渲染，参数可配置 |
| 📝 Markdown 渲染 | 原生 JS 解析，无第三方依赖 |
| 🏷️ 分类/归档 | 按分类和日期整理文章 |
| 🎨 童趣风格 | 圆角、柔和阴影、温暖配色 |
| 🚀 纯静态部署 | 无需 Node.js，直接上传即用 |

## 自定义雪景

在 `config.js` 中找到 `snow` 配置段：

```javascript
snow: {
  enable: true,       // 开启雪景
  maxCount: 40        // 最大雪花数量（默认 40）
}
```

将 `enable` 设为 `false` 即可关闭雪景。

## 技术栈

- **HTML5 + CSS3** — 语义化结构 + CSS 变量主题系统
- **原生 JavaScript** — 零依赖，性能轻量
- **DOM 操作 + requestAnimationFrame** — ❄️ 雪花动画渲染
- **GitHub Pages** — 静态托管

## 许可

本项目为开源项目，基于 [MIT License](LICENSE) 发布。

---

*用童真的眼睛看世界 👀*
