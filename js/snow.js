var Snow = {
  canvas: null,
  ctx: null,
  flakes: [],
  animId: null,
  running: false,
  config: {},

  init: function(cfg) {
    this.config = cfg || CONFIG.snow || {};
    if (!this.config.enable) return;
    this.canvas = document.getElementById('snow-canvas');
    if (!this.canvas) {
      this.canvas = document.createElement('canvas');
      this.canvas.id = 'snow-canvas';
      document.body.appendChild(this.canvas);
    }
    this.ctx = this.canvas.getContext('2d');
    this.resize();
    var self = this;
    window.addEventListener('resize', function() { self.resize(); });
    this.start();
  },

  resize: function() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  },

  start: function() {
    if (this.running) return;
    this.running = true;
    this.flakes = [];
    var cfg = this.config;
    var count = Math.min(cfg.maxCount || 60, Math.floor(window.innerWidth / 15));
    for (var i = 0; i < count; i++) {
      this.flakes.push(this.createFlake(true));
    }
    this.animate();
  },

  stop: function() {
    this.running = false;
    if (this.animId) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },

  createFlake: function(randomY) {
    var cfg = this.config;
    var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    return {
      x: Math.random() * this.canvas.width,
      y: randomY ? Math.random() * this.canvas.height : -10,
      r: cfg.sizeMin + Math.random() * (cfg.sizeMax - cfg.sizeMin),
      speed: (0.5 + Math.random() * 0.8) * (cfg.speed || 1),
      wind: -0.3 + Math.random() * 0.6,
      opacity: 0.3 + Math.random() * 0.7,
      color: isDark ? (cfg.colorDark || '#cce0ff') : (cfg.colorLight || '#ffffff')
    };
  },

  animate: function() {
    if (!this.running) return;
    var self = this;
    this.animId = requestAnimationFrame(function() { self.animate(); });
    var ctx = this.ctx;
    var w = this.canvas.width;
    var h = this.canvas.height;
    ctx.clearRect(0, 0, w, h);
    for (var i = 0; i < this.flakes.length; i++) {
      var f = this.flakes[i];
      f.y += f.speed;
      f.x += f.wind;
      if (f.y > h + 10 || f.x < -10 || f.x > w + 10) {
        this.flakes[i] = this.createFlake(false);
        continue;
      }
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
      ctx.fillStyle = f.color;
      ctx.globalAlpha = f.opacity;
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  },

  toggle: function() {
    if (this.running) {
      this.stop();
    } else {
      this.start();
    }
  }
};
