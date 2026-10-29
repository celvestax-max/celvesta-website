/* Celvesta hero: flowing 3D particle wave (canvas, no libraries) */
(function () {
  var hero = document.querySelector(".hero");
  if (!hero || !window.HTMLCanvasElement) return;
  var cv = document.createElement("canvas");
  cv.className = "hero-wave";
  cv.setAttribute("aria-hidden", "true");
  hero.insertBefore(cv, hero.firstChild);
  var ctx = cv.getContext("2d");
  if (!ctx) return;

  /* colour: add data-wave="teal" to the .hero element for a teal wave; default is Celvesta gold */
  var teal = hero.getAttribute("data-wave") === "teal";
  var C0 = teal ? [20, 110, 140] : [200, 120, 40];      /* trough colour */
  var C1 = teal ? [150, 240, 255] : [255, 228, 150];    /* crest highlight */
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var W = 0, H = 0, dpr = 1, cols = 0, rows = 0, t = 0, visible = true, raf = 0;

  function size() {
    var r = hero.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = r.width; H = r.height;
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    var small = W < 700;
    cols = small ? 90 : 170;
    rows = small ? 26 : 40;
  }

  function draw() {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    ctx.globalCompositeOperation = "lighter";
    for (var j = 0; j < rows; j++) {
      var d = j / (rows - 1);                          /* 0 = far, 1 = near */
      var z = 8 - d * 7;
      var spread = W * (0.9 + d * 1.3);
      for (var i = 0; i < cols; i++) {
        var u = i / (cols - 1);
        var x = (u - 0.5) * 16;
        /* layered waves give the "ocean of data" motion */
        var y = Math.sin(x * 0.55 + t * 0.9 + z * 0.35) * 0.55
              + Math.sin(x * 0.23 - t * 0.6 + z * 0.8) * 0.75
              + Math.cos(z * 0.9 + t * 0.45) * 0.35;
        var base = H * (0.34 + 0.58 * Math.pow(d, 1.25)) - (u - 0.5) * H * 0.26;  /* diagonal sweep */
        var px = W * 0.5 + (u - 0.5) * spread;
        var py = base - y * H * (0.05 + d * 0.10);           /* taller waves */
        if (px < -8 || px > W + 8 || py < -8 || py > H + 8) continue;
        var crest = Math.max(0, Math.min(1, (y + 1.2) / 2.4));  /* 0 trough .. 1 crest */
        var a = (0.16 + Math.pow(crest, 1.4) * 1.0) * (0.40 + d * 0.60);
        var r = (0.6 + d * 1.4) * (0.7 + crest * 0.7);
        var c = C0;
        var R = c[0] + crest * (C1[0] - c[0]), G = c[1] + crest * (C1[1] - c[1]), B = c[2] + crest * (C1[2] - c[2]);
        var rgb = (R | 0) + "," + (G | 0) + "," + (B | 0);
        if (crest > 0.62) {                                   /* soft glow on the crests */
          var g = r * 3.2;
          ctx.fillStyle = "rgba(" + rgb + "," + (a * 0.16).toFixed(3) + ")";
          ctx.beginPath(); ctx.arc(px, py, g, 0, 6.2832); ctx.fill();
        }
        ctx.fillStyle = "rgba(" + rgb + "," + Math.min(1, a).toFixed(3) + ")";
        ctx.fillRect(px - r, py - r, r * 2, r * 2);
      }
    }
    ctx.globalCompositeOperation = "source-over";
  }

  function loop() {
    t += 0.016;
    draw();
    raf = visible ? requestAnimationFrame(loop) : 0;
  }

  size();
  if (reduce) { draw(); }
  else {
    loop();
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (e) {
        visible = e[0].isIntersecting;
        if (visible && !raf) raf = requestAnimationFrame(loop);
      }).observe(hero);
    }
  }
  var to;
  window.addEventListener("resize", function () {
    clearTimeout(to);
    to = setTimeout(function () { size(); if (reduce) draw(); }, 150);
  });
})();
