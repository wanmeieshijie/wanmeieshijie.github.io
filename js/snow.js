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
    this.createCanvas();
    this.start();
  },

  createCanvas: function() {
    this.canvas = document.getElementById('snow-canvas');
    if (!this.canvas) {
      this.canvas = document.createElement('canvas');
      this.canvas.id = 'snow-canvas';
      this.canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:0;';
      document.body.insertBefore(this.canvas, document.body.firstChild);
    }
    this.ctx = this.canvas.getContext('2d');
    this.resize();
    var self = this;
    window.addEventListener('resize', function() { self.resize(); });
  },

  resize: function() {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = window.innerWidth * dpr;
    this.canvas.height = window.innerHeight * dpr;
    this._dpr = dpr;
  },

  start: function() {
    if (this.running) return;
    this.running = true;
    this.flakes = [];
    var isMobile = window.innerWidth < 768;
    var count = this.config.maxCount || (isMobile ? 20 : 40);
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
  },

  createFlake: function(randomY) {
    var w = window.innerWidth;
    var h = window.innerHeight;
    var size = 8 + Math.random() * 32;
    var norm = (size - 8) / 32;
    return {
      x: Math.random() * w,
      y: randomY ? Math.random() * h : -40,
      size: size,
      speed: 0.6 + norm * 2.4,
      wind: -0.8 + Math.random() * 1.6,
      opacity: 0.5 + Math.random() * 0.5,
      swayPhase: Math.random() * Math.PI * 2,
      swaySpeed: 0.005 + Math.random() * 0.015,
      swayAmp: 15 + Math.random() * 25,
      rot: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.02
    };
  },

  animate: function() {
    if (!this.running) return;
    var self = this;
    this.animId = requestAnimationFrame(function() { self.animate(); });
    var ctx = this.ctx;
    var dpr = this._dpr;
    var w = window.innerWidth;
    var h = window.innerHeight;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (var i = 0; i < this.flakes.length; i++) {
      var f = this.flakes[i];
      f.wind += (Math.random() - 0.5) * 0.08;
      if (f.wind > 1.5) f.wind = 1.5;
      if (f.wind < -1.5) f.wind = -1.5;
      f.swayPhase += f.swaySpeed;
      f.x += f.wind;
      f.y += f.speed;
      f.rot += f.rotSpeed;
      if (f.y > h + 40) {
        f.y = -40;
        f.x = Math.random() * w;
        f.wind = -0.8 + Math.random() * 1.6;
      }
      if (f.x < -60) f.x = w + 60;
      if (f.x > w + 60) f.x = -60;
      var screenX = (f.x + Math.sin(f.swayPhase) * f.swayAmp) * dpr;
      var screenY = f.y * dpr;
      var fontSize = f.size * dpr;
      ctx.save();
      ctx.translate(screenX, screenY);
      ctx.rotate(f.rot);
      ctx.font = fontSize + 'px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = 'rgba(0,0,0,0.1)';
      ctx.fillText('\u2744', 0.5, 0.5);
      ctx.fillStyle = 'rgba(255,255,255,' + f.opacity + ')';
      ctx.fillText('\u2744', 0, 0);
      ctx.restore();
    }
  },

  toggle: function() {
    if (this.running) this.stop();
    else this.start();
  }
};
