var Snow = {
  container: null,
  flakes: [],
  animId: null,
  running: false,
  config: {},
  isMobile: false,

  init: function(cfg) {
    this.config = cfg || CONFIG.snow || {};
    if (!this.config.enable) return;
    this.isMobile = window.innerWidth < 768;
    this.createContainer();
    this.start();
  },

  createContainer: function() {
    this.container = document.getElementById('snow-container');
    if (this.container) return;
    this.container = document.createElement('div');
    this.container.id = 'snow-container';
    this.container.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:0;overflow:hidden;';
    document.body.insertBefore(this.container, document.body.firstChild);
  },

  start: function() {
    if (this.running) return;
    this.running = true;
    this.flakes = [];
    var count = this.config.maxCount || (this.isMobile ? 20 : 40);
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
    for (var i = this.flakes.length - 1; i >= 0; i--) {
      var f = this.flakes[i];
      if (f.el && f.el.parentNode) {
        f.el.parentNode.removeChild(f.el);
      }
    }
    this.flakes = [];
  },

  createFlake: function(randomY) {
    var minSize = this.config.minSize || 8;
    var maxSize = this.config.maxSize || 40;
    var w = window.innerWidth;
    var h = window.innerHeight;
    var size = minSize + Math.random() * (maxSize - minSize);
    var norm = (size - minSize) / (maxSize - minSize);
    var opacity = 0.5 + Math.random() * 0.5;
    var el = document.createElement('span');
    el.textContent = '❄';
    el.style.cssText = 'position:absolute;left:0;top:0;font-size:' + size + 'px;line-height:1;white-space:nowrap;pointer-events:none;color:rgba(255,255,255,' + opacity + ');text-shadow:0 0 4px rgba(0,0,0,0.2),0 0 8px rgba(0,0,0,0.1);will-change:transform;';
    this.container.appendChild(el);
    return {
      el: el,
      x: Math.random() * w,
      y: randomY ? Math.random() * h : -size,
      speed: 0.6 + norm * 2.4,
      wind: -0.8 + Math.random() * 1.6,
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
    var w = window.innerWidth;
    var h = window.innerHeight;
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
      f.el.style.transform = 'translate3d(' + (f.x + Math.sin(f.swayPhase) * f.swayAmp) + 'px,' + f.y + 'px,0) rotate(' + f.rot + 'rad)';
    }
  },

  toggle: function() {
    if (this.running) this.stop();
    else this.start();
  }
};
