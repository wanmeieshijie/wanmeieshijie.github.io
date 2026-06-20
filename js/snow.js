var Snow = {
  config: {},

  init: function(cfg) {
    this.config = cfg || CONFIG.snow || {};
    if (!this.config.enable) return;
    this.injectStyle();
    this.createContainer();
  },

  injectStyle: function() {
    if (document.getElementById('snow-style')) return;
    var s = document.createElement('style');
    s.id = 'snow-style';
    s.textContent = '@keyframes sf0{0%{transform:translateY(-40px) translateX(0) rotate(0deg)}100%{transform:translateY(110vh) translateX(40px) rotate(360deg)}}@keyframes sf1{0%{transform:translateY(-40px) translateX(0) rotate(0deg)}100%{transform:translateY(110vh) translateX(-35px) rotate(-360deg)}}@keyframes sf2{0%{transform:translateY(-40px) translateX(0) rotate(0deg)}100%{transform:translateY(110vh) translateX(50px) rotate(720deg)}}@keyframes sf3{0%{transform:translateY(-40px) translateX(0) rotate(0deg)}100%{transform:translateY(110vh) translateX(-45px) rotate(-720deg)}}';
    document.head.appendChild(s);
  },

  createContainer: function() {
    var c = document.getElementById('snow-container');
    if (c) return;
    c = document.createElement('div');
    c.id = 'snow-container';
    c.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:0;overflow:hidden;';
    document.body.insertBefore(c, document.body.firstChild);
    var isMobile = window.innerWidth < 768;
    var count = this.config.maxCount || (isMobile ? 20 : 40);
    var names = ['sf0','sf1','sf2','sf3'];
    for (var i = 0; i < count; i++) {
      var el = document.createElement('span');
      var size = 8 + Math.random() * 32;
      var opacity = 0.5 + Math.random() * 0.5;
      var dur = 10 + Math.random() * 14;
      var name = names[Math.floor(Math.random() * 4)];
      el.textContent = '❄';
      el.style.cssText = 'position:absolute;top:-40px;left:' + (Math.random() * 100) + '%;font-size:' + size + 'px;line-height:1;white-space:nowrap;pointer-events:none;color:rgba(255,255,255,' + opacity + ');text-shadow:0 0 4px rgba(0,0,0,0.2),0 0 8px rgba(0,0,0,0.1);animation:' + name + ' ' + dur + 's -' + (Math.random() * dur) + 's linear infinite;';
      c.appendChild(el);
    }
  }
};
