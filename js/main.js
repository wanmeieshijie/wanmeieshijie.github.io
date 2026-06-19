var Blog = {
  init: function() {
    this.initTheme();
    this.initNav();
    this.initSnow();
    this.renderPage();
  },

  initTheme: function() {
    var saved = localStorage.getItem('blog-theme');
    if (saved === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
    var btn = document.getElementById('theme-btn');
    if (btn) {
      var self = this;
      btn.addEventListener('click', function() {
        self.toggleTheme();
      });
    }
  },

  toggleTheme: function() {
    var html = document.documentElement;
    var isDark = html.getAttribute('data-theme') === 'dark';
    if (isDark) {
      html.removeAttribute('data-theme');
      localStorage.setItem('blog-theme', 'light');
    } else {
      html.setAttribute('data-theme', 'dark');
      localStorage.setItem('blog-theme', 'dark');
    }
    if (Snow && Snow.flakes) {
      for (var i = 0; i < Snow.flakes.length; i++) {
        var f = Snow.flakes[i];
        var isDarkNow = html.getAttribute('data-theme') === 'dark';
        f.color = isDarkNow ? (Snow.config.colorDark || '#cce0ff') : (Snow.config.colorLight || '#ffffff');
      }
    }
  },

  initNav: function() {
    var toggle = document.getElementById('menu-toggle');
    var links = document.getElementById('nav-links');
    if (toggle && links) {
      toggle.addEventListener('click', function() {
        links.classList.toggle('open');
      });
      document.addEventListener('click', function(e) {
        if (!toggle.contains(e.target) && !links.contains(e.target)) {
          links.classList.remove('open');
        }
      });
    }
    var current = window.location.pathname.split('/').pop() || 'index.html';
    var navLinks = document.querySelectorAll('.nav-links a');
    for (var i = 0; i < navLinks.length; i++) {
      var href = navLinks[i].getAttribute('href');
      if (href === current) {
        navLinks[i].classList.add('active');
      }
    }
  },

  initSnow: function() {
    if (typeof Snow !== 'undefined' && CONFIG.snow && CONFIG.snow.enable) {
      Snow.init(CONFIG.snow);
    }
  },

  renderPage: function() {
    var pageType = document.body.getAttribute('data-page');
    if (pageType === 'home') {
      this.renderHome();
    } else if (pageType === 'post') {
      this.renderPost();
    } else if (pageType === 'archive') {
      this.renderArchive();
    } else if (pageType === 'category') {
      this.renderCategory();
    } else if (pageType === 'about') {
      this.renderAbout();
    }
  },

  getPosts: function(callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'posts/posts.json?' + Date.now(), true);
    xhr.onload = function() {
      if (xhr.status === 200) {
        try {
          var posts = JSON.parse(xhr.responseText);
          callback(posts);
        } catch(e) {
          callback([]);
        }
      } else {
        callback([]);
      }
    };
    xhr.onerror = function() {
      callback([]);
    };
    xhr.send();
  },

  loadMarkdown: function(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onload = function() {
      if (xhr.status === 200) {
        callback(xhr.responseText);
      } else {
        callback(null);
      }
    };
    xhr.onerror = function() {
      callback(null);
    };
    xhr.send();
  },

  renderMarkdown: function(text) {
    var lines = text.split('\n');
    var html = '';
    var inCode = false;
    var codeBuf = [];
    var codeLang = '';

    for (var i = 0; i < lines.length; i++) {
      var line = lines[i];

      if (line.indexOf('```') === 0) {
        if (inCode) {
          html += '<pre><code>' + this.escapeHtml(codeBuf.join('\n')) + '</code></pre>\n';
          codeBuf = [];
          inCode = false;
          codeLang = '';
        } else {
          inCode = true;
          codeLang = line.slice(3).trim();
        }
        continue;
      }

      if (inCode) {
        codeBuf.push(line);
        continue;
      }

      var processed = this.processInline(line);

      if (line.trim() === '') {
        html += '\n';
        continue;
      }

      if (line.indexOf('---') === 0) {
        html += '<hr>\n';
        continue;
      }

      var headerMatch = line.match(/^(#{1,6})\s+(.+)$/);
      if (headerMatch) {
        var level = headerMatch[1].length;
        html += '<h' + level + '>' + headerMatch[2] + '</h' + level + '>\n';
        continue;
      }

      var blockquoteMatch = line.match(/^>\s?(.*)$/);
      if (blockquoteMatch) {
        html += '<blockquote><p>' + this.processInline(blockquoteMatch[1]) + '</p></blockquote>\n';
        continue;
      }

      var liMatch = line.match(/^[-*+]\s+(.+)$/);
      if (liMatch) {
        html += '<li>' + this.processInline(liMatch[1]) + '</li>\n';
        continue;
      }

      var olMatch = line.match(/^\d+\.\s+(.+)$/);
      if (olMatch) {
        html += '<li>' + this.processInline(olMatch[1]) + '</li>\n';
        continue;
      }

      var tableMatch = line.match(/^\|(.+)\|$/);
      if (tableMatch) {
        html += '<p>' + processed + '</p>\n';
        continue;
      }

      html += '<p>' + processed + '</p>\n';
    }

    if (inCode && codeBuf.length > 0) {
      html += '<pre><code>' + this.escapeHtml(codeBuf.join('\n')) + '</code></pre>\n';
    }

    html = html.replace(/(<li>.*<\/li>\n)+/g, function(match) {
      var isOrdered = /^\d+\./.test(lines[lines.indexOf(match.split('\n')[0].trim())]);
      var tag = 'ul';
      match = match.replace(/<\/li>\n<li>/g, '</li><li>');
      return '<' + tag + '>' + match + '</' + tag + '>\n';
    });

    html = html.replace(/<(ul|ol)>\n<li>/g, '<$1><li>');
    html = html.replace(/<\/li>\n<\/(ul|ol)>/g, '</li></$1>');

    return html;
  },

  processInline: function(text) {
    text = this.escapeHtml(text);
    text = text.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">');
    text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
    text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    text = text.replace(/\*(.+?)\*/g, '<em>$1</em>');
    text = text.replace(/`(.+?)`/g, '<code>$1</code>');
    text = text.replace(/~~(.+?)~~/g, '<del>$1</del>');
    return text;
  },

  escapeHtml: function(text) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(text));
    return div.innerHTML;
  },

  formatDate: function(dateStr) {
    var parts = dateStr.split('-');
    if (parts.length === 3) {
      return parts[0] + '年' + parseInt(parts[1]) + '月' + parseInt(parts[2]) + '日';
    }
    return dateStr;
  },

  renderHome: function() {
    var list = document.getElementById('post-list');
    if (!list) return;
    this.getPosts(function(posts) {
      if (posts.length === 0) {
        list.innerHTML = '<div class="loading" style="text-align:center;padding:40px;color:var(--text-light)">暂无文章，请添加 .md 文件到 posts 目录</div>';
        return;
      }
      var html = '';
      for (var i = posts.length - 1; i >= 0; i--) {
        var p = posts[i];
        html += '<article class="post-card">';
        html += '<h2 class="post-card-title"><a href="?post=' + encodeURIComponent(p.file) + '">' + p.title + '</a></h2>';
        html += '<div class="post-card-meta">';
        html += '<span>' + this.formatDate(p.date) + '</span>';
        if (p.category) html += '<span class="tag" style="background:' + (this.getCategoryColor(p.category) || 'var(--tag-bg)') + '33">' + p.category + '</span>';
        html += '</div>';
        if (p.excerpt) html += '<div class="post-card-excerpt">' + p.excerpt + '</div>';
        if (p.tags) {
          html += '<div class="post-card-tags">';
          for (var j = 0; j < p.tags.length; j++) {
            html += '<span class="tag">#' + p.tags[j] + '</span>';
          }
          html += '</div>';
        }
        html += '</article>';
      }
      list.innerHTML = html;
    }.bind(this));
  },

  renderPost: function() {
    var params = new URLSearchParams(window.location.search);
    var postFile = params.get('post');
    if (!postFile) return;
    var container = document.getElementById('post-content');
    if (!container) return;
    this.loadMarkdown('posts/' + postFile, function(content) {
      if (content === null) {
        container.innerHTML = '<div class="loading">文章加载失败</div>';
        return;
      }
      var html = this.renderMarkdown(content);
      container.innerHTML = html;
      document.title = document.title + ' - ' + postFile;
    }.bind(this));
  },

  renderArchive: function() {
    var list = document.getElementById('archive-list');
    if (!list) return;
    this.getPosts(function(posts) {
      if (posts.length === 0) {
        list.innerHTML = '<div class="loading" style="text-align:center;padding:40px;color:var(--text-light)">暂无文章</div>';
        return;
      }
      var sorted = posts.slice().sort(function(a, b) {
        return b.date.localeCompare(a.date);
      });
      var years = {};
      for (var i = 0; i < sorted.length; i++) {
        var year = sorted[i].date.split('-')[0];
        if (!years[year]) years[year] = [];
        years[year].push(sorted[i]);
      }
      var html = '';
      var yearKeys = Object.keys(years).sort().reverse();
      for (var y = 0; y < yearKeys.length; y++) {
        html += '<h3 class="archive-year">' + yearKeys[y] + '</h3>';
        html += '<ul class="archive-list">';
        for (var k = 0; k < years[yearKeys[y]].length; k++) {
          var p = years[yearKeys[y]][k];
          html += '<li class="archive-item">';
          html += '<span class="archive-date">' + p.date + '</span>';
          html += '<a class="archive-title" href="?post=' + encodeURIComponent(p.file) + '">' + p.title + '</a>';
          html += '</li>';
        }
        html += '</ul>';
      }
      list.innerHTML = html;
    }.bind(this));
  },

  renderCategory: function() {
    var list = document.getElementById('category-list');
    if (!list) return;
    var self = this;
    this.getPosts(function(posts) {
      var cats = {};
      var catConfig = {};
      if (typeof CONFIG !== 'undefined' && CONFIG.categories) {
        for (var c = 0; c < CONFIG.categories.length; c++) {
          catConfig[CONFIG.categories[c].name] = CONFIG.categories[c].color;
        }
      }
      for (var i = 0; i < posts.length; i++) {
        var cat = posts[i].category || '未分类';
        if (!cats[cat]) cats[cat] = { name: cat, color: catConfig[cat] || '#FFB5C2', posts: [] };
        cats[cat].posts.push(posts[i]);
      }
      var catNames = Object.keys(cats).sort();
      if (catNames.length === 0) {
        list.innerHTML = '<div class="loading" style="text-align:center;padding:40px;color:var(--text-light)">暂无分类</div>';
        return;
      }
      var html = '<div class="cat-list">';
      for (var j = 0; j < catNames.length; j++) {
        var cat = cats[catNames[j]];
        html += '<div class="cat-card">';
        html += '<div class="cat-card-header">';
        html += '<span class="cat-dot" style="background:' + cat.color + '"></span>';
        html += '<span class="cat-card-name">' + cat.name + '</span>';
        html += '<span class="cat-card-count">' + cat.posts.length + ' 篇</span>';
        html += '</div>';
        html += '<ul class="cat-card-posts">';
        for (var k = 0; k < cat.posts.length; k++) {
          html += '<li><a href="?post=' + encodeURIComponent(cat.posts[k].file) + '">' + cat.posts[k].title + '</a></li>';
        }
        html += '</ul></div>';
      }
      html += '</div>';
      list.innerHTML = html;
    });
  },

  renderAbout: function() {
    var container = document.getElementById('about-content');
    if (!container || typeof CONFIG === 'undefined') return;
    var cfg = CONFIG.site || {};
    var social = CONFIG.social || [];
    var html = '';
    html += '<img class="about-avatar" src="' + (cfg.avatar || CONFIG.defaultAvatar) + '" alt="avatar" onerror="this.src=\'' + CONFIG.defaultAvatar + '\'">';
    html += '<h2 class="about-name">' + (cfg.author || '') + '</h2>';
    html += '<div class="about-bio">' + (cfg.description || '') + '</div>';
    if (social.length > 0) {
      html += '<div class="about-social">';
      for (var i = 0; i < social.length; i++) {
        html += '<a href="' + social[i].url + '" target="_blank">' + social[i].icon + ' ' + social[i].label + '</a>';
      }
      html += '</div>';
    }
    container.innerHTML = html;
  },

  getCategoryColor: function(name) {
    if (typeof CONFIG === 'undefined' || !CONFIG.categories) return null;
    for (var i = 0; i < CONFIG.categories.length; i++) {
      if (CONFIG.categories[i].name === name) return CONFIG.categories[i].color;
    }
    return null;
  }
};

document.addEventListener('DOMContentLoaded', function() {
  Blog.init();
});
