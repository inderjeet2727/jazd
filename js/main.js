/* Jaz Dhami – parallax + signup form
   ---------------------------------------------------------------------------
   Progress p for a section: 0 when it enters the bottom of the viewport,
   1 when it has left the top.

   • Background photos move *slower* than the page (they drift against the
     scroll direction), so the photography feels far away.
   • [data-depth] groups move at their own pace on top of the page scroll:
        depth > 0  faster than the page (foreground text)
        depth < 0  slower than the page (mid‑ground HUD graphics)

   Desktop (≥1024px): each photo is placed exactly as in the Figma frame
   (data-w / data-x / data-y on .bg are the Figma size + offset as fractions of
   the section width) and travels up/down from that position. That resting
   position is shown when the section is centred in the viewport (the hero:
   at page load).
   Tablet/mobile: the photo simply covers the section and drifts.

   Tune with data-parallax (section, 0 = off, ~0.3 = default) and data-depth.
   Honours prefers-reduced-motion (no movement, exact Figma crop).
*/
(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var desktopMQ = window.matchMedia('(min-width: 1024px)');
  var toArr = function (l) { return Array.prototype.slice.call(l); };

  var sections = toArr(document.querySelectorAll('[data-parallax]')).map(function (el) {
    var bg = el.querySelector('.bg');
    var geo = bg && bg.hasAttribute('data-w') ? {
      w: parseFloat(bg.getAttribute('data-w')),
      x: parseFloat(bg.getAttribute('data-x')),
      y: parseFloat(bg.getAttribute('data-y')),
      aspect: parseFloat(bg.getAttribute('data-aspect')) || 1.25
    } : null;
    return {
      el: el,
      bg: bg,
      img: bg ? bg.querySelector('img') : null,
      geo: geo,
      exact: el.hasAttribute('data-exact'),
      rate: parseFloat(el.getAttribute('data-parallax')) || 0,
      layers: toArr(el.querySelectorAll('[data-depth]')).map(function (l) {
        return { el: l, depth: parseFloat(l.getAttribute('data-depth')) || 0 };
      }),
      slack: 0, p0: 0.5, useGeo: false,
      W: 0, H: 0, imgH: 0, yr: 0, S: 0
    };
  });

  var vh = window.innerHeight, vw = window.innerWidth, ticking = false;
  var enabled = function () { return !reduce.matches; };

  function measure() {
    vh = window.innerHeight; vw = window.innerWidth;
    var desk = desktopMQ.matches;

    sections.forEach(function (s) {
      var W = s.el.offsetWidth, H = s.el.offsetHeight;
      var top = s.el.getBoundingClientRect().top + window.pageYOffset;
      var pLoad = (vh - top) / (vh + H);
      // "rest" = moment the layout equals the Figma frame: hero at load, others centred
      s.p0 = pLoad > 0.05 ? pLoad : 0.5;
      var want = enabled() ? s.rate * (vh + H) / 2 : 0;          // desired half-travel (px)

      s.useGeo = !!(desk && s.geo && s.img);
      s.el.classList.toggle('geo', s.useGeo);

      if (s.useGeo) {
        // ----- desktop: exact Figma placement + travel that never exposes an edge -----
        var g = s.geo, imgW = g.w * W, imgH = imgW * g.aspect, yr = g.y * W;
        var plo = s.exact ? s.p0 : 0, phi = 1, S = want;
        if (S > 0) {
          if (s.exact) {                                            // keep the load-time crop exact
            var maxUp = (-yr) / (2 * (phi - s.p0));                 // y(phi) must stay ≤ 0
            S = Math.min(S, Math.max(maxUp, 0));
          } else {
            // Figma crop leaves little room above the photo: allow a small, capped shift
            // (≤ 9% of the section width) of the resting crop so the layer can still travel.
            var need = (phi - s.p0) * 2 * S, excess = need + yr;     // yr is negative
            if (excess > 0) yr -= Math.min(excess, 0.09 * W);
            S = Math.min(S, Math.max(-yr, 0) / (2 * (phi - s.p0)));  // never expose the top edge
          }
          if (plo < s.p0) {                                         // y(plo) must stay ≥ H - imgH
            S = Math.min(S, (yr - (H - imgH)) / (2 * (s.p0 - plo)));
          }
        }
        s.S = Math.max(S, 0); s.yr = yr; s.W = W; s.H = H; s.imgH = imgH;
        var st = s.img.style;
        st.position = 'absolute'; st.left = (g.x * W) + 'px'; st.top = '0';
        st.width = imgW + 'px'; st.height = imgH + 'px'; st.maxWidth = 'none'; st.objectFit = 'fill';
        s.el.style.removeProperty('--slack');
        s.slack = 0;
      } else {
        // ----- tablet / mobile: photo covers the section, layer drifts -----
        if (s.img) { s.img.removeAttribute('style'); }
        s.slack = Math.round(s.bg ? Math.min(want, H * 0.3) : 0);
        s.el.style.setProperty('--slack', s.slack + 'px');
      }
    });
    update(true);
  }

  function update(force) {
    ticking = false;
    var on = enabled();
    var damp = vw < 1024 ? 0.3 : 1;                               // keep stacked text from colliding

    sections.forEach(function (s) {
      var r = s.el.getBoundingClientRect();
      if (force !== true && (r.bottom < -300 || r.top > vh + 300)) return;   // skip off-screen work (but always place on measure)

      var p = (vh - r.top) / (vh + r.height);
      var c = on ? p - s.p0 : 0;

      if (s.useGeo) {
        var y = s.yr + c * 2 * s.S;
        y = Math.max(s.H - s.imgH, Math.min(0, y));
        s.img.style.transform = 'translate3d(0,' + y.toFixed(1) + 'px,0)';
      } else if (s.bg) {
        s.bg.style.transform = on && s.slack ? 'translate3d(0,' + (c * 2 * s.slack).toFixed(1) + 'px,0)' : '';
      }

      var travel = (vh + r.height) * damp;
      s.layers.forEach(function (l) {
        l.el.style.transform = on ? 'translate3d(0,' + (-c * l.depth * travel).toFixed(1) + 'px,0)' : '';
      });
    });
  }

  function onScroll() {
    if (!ticking) { ticking = true; window.requestAnimationFrame(function () { update(); }); }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', measure);
  window.addEventListener('orientationchange', measure);
  window.addEventListener('load', measure);
  [reduce, desktopMQ].forEach(function (m) {
    if (m.addEventListener) m.addEventListener('change', measure);
  });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);
  measure();

  /* ---------- Signup form (Netlify Forms; harmless elsewhere) ---------- */
  var form = document.getElementById('tribe-form');
  var msg = document.getElementById('tribe-msg');
  if (form && msg) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = form.querySelector('button[type="submit"]');
      var data = new URLSearchParams(new FormData(form)).toString();
      btn.disabled = true; msg.className = 'tribe__msg'; msg.textContent = 'Sending…';
      fetch(form.getAttribute('action') || '/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: data
      }).then(function (res) {
        if (!res.ok) throw new Error('bad status ' + res.status);
        form.reset(); msg.className = 'tribe__msg is-ok'; msg.textContent = 'Welcome to the tribe.';
      }).catch(function () {
        msg.className = 'tribe__msg'; msg.textContent = 'Couldn’t sign you up just now – please try again.';
      }).then(function () { btn.disabled = false; });
    });
  }
})();
