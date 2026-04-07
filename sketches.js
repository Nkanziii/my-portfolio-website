/* ============================================================
   NIKI KHANEZAI — SKETCHES SCRIPT (sketches.html)
   ============================================================ */

/* ── CUSTOM CURSOR ── */
const cur  = document.getElementById('cur');
const ring = document.getElementById('cur-ring');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

(function animCur() {
  cur.style.left  = mx + 'px';
  cur.style.top   = my + 'px';
  rx += (mx - rx) * .25;
  ry += (my - ry) * .25;
  ring.style.left = rx + 'px';
  ring.style.top  = ry + 'px';
  requestAnimationFrame(animCur);
})();

document.querySelectorAll('a, .sketch-card').forEach(el => {
  el.addEventListener('mouseenter', () => { cur.style.width = '18px'; cur.style.height = '18px'; cur.style.background = '#bb101e'; });
  el.addEventListener('mouseleave', () => { cur.style.width = '10px'; cur.style.height = '10px'; cur.style.background = '#D9C3A9'; });
});


/* ── TWINKLING STARS ── */
const sc   = document.getElementById('starsCanvas');
const sctx = sc.getContext('2d');
let W, H;

function resize() { W = sc.width = window.innerWidth; H = sc.height = window.innerHeight; }
resize();
window.addEventListener('resize', resize);

const stars = Array.from({ length: 90 }, () => ({
  x:     Math.random(),
  y:     Math.random(),
  size:  Math.random() * 6 + 2,
  phase: Math.random() * Math.PI * 2,
  speed: Math.random() * .008 + .003,
  type:  Math.random() < .55 ? 'dot' : 'spark'
}));

function drawSpark(x, y, s, a) {
  sctx.save(); sctx.globalAlpha = a; sctx.fillStyle = '#D9C3A9';
  sctx.beginPath();
  sctx.moveTo(x, y-s); sctx.lineTo(x+s*.18, y-s*.18); sctx.lineTo(x+s, y);
  sctx.lineTo(x+s*.18, y+s*.18); sctx.lineTo(x, y+s);
  sctx.lineTo(x-s*.18, y+s*.18); sctx.lineTo(x-s, y);
  sctx.lineTo(x-s*.18, y-s*.18); sctx.closePath(); sctx.fill(); sctx.restore();
}

function drawDot(x, y, s, a) {
  sctx.save(); sctx.globalAlpha = a; sctx.fillStyle = '#D9C3A9';
  sctx.beginPath(); sctx.arc(x, y, s * .6, 0, Math.PI * 2); sctx.fill(); sctx.restore();
}

function animStars(t) {
  sctx.clearRect(0, 0, W, H);
  stars.forEach(s => {
    const a = .1 + .8 * (Math.sin(t * s.speed + s.phase) * .5 + .5);
    s.type === 'spark' ? drawSpark(s.x * W, s.y * H, s.size, a)
                       : drawDot  (s.x * W, s.y * H, s.size, a);
  });
  requestAnimationFrame(animStars);
}
requestAnimationFrame(animStars);


/* ── SCROLL REVEAL ── */
const reveals = document.querySelectorAll('.reveal');
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('on'); obs.unobserve(e.target); }
  });
}, { threshold: 0, rootMargin: '0px 0px -10px 0px' });
reveals.forEach(el => obs.observe(el));


/* ============================================================
   P5.JS SKETCHES
   ============================================================ */

/* ── SKETCH 01 — Transformation Visuals ── */
new p5(function(p) {
  let colors = ["#E89C5D","#0E05F2","#AA05F2","#5C05F2","#0547F2","#E8C45D","#E8845D","#E8D45D"];
  let angle = 0, count = 20, t = 0.01;

  p.setup = function() {
    let canvas = p.createCanvas(500, 500);
    canvas.parent("container1");
    p.angleMode(p.DEGREES);
    p.rectMode(p.CENTER);
    p.frameRate(50);
  };

  p.draw = function() {
    p.background(0);
    let scl = p.map(p.sin(t), -1, 1, 0.5, 1);
    p.push(); p.translate(p.width/2, p.height/2); p.rotate(angle); p.scale(scl);
    tiles();
    p.pop();
    angle += 1; t += 1;
  };

  function tiles() {
    let sz = 50;
    for (let i = -count/2; i < count/2; i++) {
      for (let j = -count/2; j < count/2; j++) {
        let x = j * sz, y = i * sz;
        let idx = p.round(i + j + p.frameCount/2.5) % colors.length;
        let col = colors[idx]; if (col) p.stroke(col); p.noFill();
        p.square(x, y, sz*2); p.circle(x, y, sz*2);
        p.triangle(-x, -y, x, -y, x, y); p.rotate(180);
      }
    }
  }
});


/* ── SKETCH 02 — Generative Expressions ── */
new p5(function(p) {
  let skinColor = "#E1A596", currentExpression = 0, expressions = [], bgSeed = 1;

  p.setup = function() {
    let canvas = p.createCanvas(450, 450);
    canvas.parent("container2");
    expressions = [emotionOne, emotionTwo, emotionThree];
  };

  p.draw = function() {
    p.randomSeed(bgSeed);
    alwaysSame(); expressions[currentExpression]();
  };

  p.mousePressed = function() {
    currentExpression = (currentExpression + 1) % expressions.length;
    bgSeed = p.floor(p.random(100000));
  };

  function alwaysSame() {
    let cs=33,mx=10,my=10,vs=5,hs=5;
    for(let i=0;i<11;i++){for(let j=0;j<11;j++){
      let x=20+i*(cs+hs)+mx, y=20+j*(cs+vs)+my;
      p.noStroke();
      p.fill(p.random(255),p.random(220),p.random(180)); p.circle(x,y,cs);
      let sm=p.random(cs*.2,cs*.8); p.fill(p.random(255),p.random(220),p.random(180)); p.circle(x,y,sm);
      let sml=p.random(cs*.2,cs*.6); p.fill(p.random(255),p.random(220),p.random(180)); p.circle(x,y,sml);
    }}
    p.rectMode(p.CENTER); p.noStroke();
    p.fill("rgb(88,39,39)"); p.rect(220,300,178,210);
    p.fill("#E08771"); p.rect(220,245,180,60,70);
    p.fill("#E13518"); p.arc(220,445,250,220,0,p.TWO_PI);
    p.fill("#E08771"); p.rect(223,300,60,130,30);
    p.fill(skinColor); p.rect(220,220,162,200,90); p.noStroke();
    p.beginShape(); p.vertex(148,275); p.vertex(165,310); p.vertex(218,340); p.vertex(227,340); p.vertex(275,310); p.vertex(293,275); p.endShape(p.CLOSE);
    p.fill("#E19284"); p.ellipse(218,280,30,10);
    p.fill("rgb(88,39,39)");
    p.beginShape(); p.curveVertex(215,150); p.curveVertex(140,210); p.curveVertex(140,145); p.curveVertex(215,110); p.curveVertex(297,140); p.curveVertex(300,210); p.endShape(p.CLOSE);
  }

  function emotionOne() {
    p.fill(255); p.noStroke(); p.ellipse(180,240,40,25); p.ellipse(255,240,40,25);
    p.strokeWeight(4); p.stroke("rgb(88,39,39)"); p.noFill();
    p.arc(180,240,40,20,p.PI,p.TWO_PI); p.triangle(160,240,160,235,150,233);
    p.arc(255,240,40,20,p.PI,p.TWO_PI); p.triangle(275,240,275,235,285,233);
    p.noStroke(); p.fill("rgb(88,39,39)");
    p.beginShape(); p.vertex(160,210); p.vertex(195,220); p.vertex(200,213); p.endShape(p.CLOSE);
    p.beginShape(); p.vertex(230,210); p.vertex(240,217); p.vertex(275,213); p.endShape(p.CLOSE);
    p.fill("#E65D5D"); p.noStroke();
    p.beginShape(); p.vertex(190,300); p.vertex(195,305); p.vertex(243,305); p.vertex(248,300); p.vertex(230,295); p.vertex(220,300); p.vertex(210,295); p.endShape(p.CLOSE);
    p.fill("#E67C81"); p.ellipse(219,315,30,10);
    let lx=180,ly=240,rx=255,ry=240,mmx=7,mmy=4;
    let lpx=p.constrain(p.mouseX,lx-mmx,lx+mmx), lpy=p.constrain(p.mouseY,ly-mmy,ly+mmy);
    let rpx=p.constrain(p.mouseX,rx-mmx,rx+mmx), rpy=p.constrain(p.mouseY,ry-mmy,ry+mmy);
    p.fill(0); p.circle(lpx,lpy,15); p.circle(rpx,rpy,15);
  }

  function emotionTwo() {
    p.fill(255); p.noStroke(); p.ellipse(180,240,40,22); p.ellipse(255,240,40,22);
    p.stroke("rgb(88,39,39)"); p.strokeWeight(3); p.noFill();
    p.arc(180,238,40,16,p.PI,p.TWO_PI); p.arc(255,238,40,16,p.PI,p.TWO_PI);
    let lx=183,ly=242,rx=258,ry=242,mmx=4,mmy=3;
    let lpx=p.constrain(p.mouseX,lx-mmx,lx+mmx), lpy=p.constrain(p.mouseY,ly-mmy,ly+mmy);
    let rpx=p.constrain(p.mouseX,rx-mmx,rx+mmx), rpy=p.constrain(p.mouseY,ry-mmy,ry+mmy);
    p.fill(0); p.noStroke(); p.circle(lpx,lpy,13); p.circle(rpx,rpy,13);
    p.fill("rgb(88,39,39)");
    p.beginShape(); p.vertex(160,212); p.vertex(193,218); p.vertex(200,214); p.endShape(p.CLOSE);
    p.beginShape(); p.vertex(230,205); p.vertex(245,210); p.vertex(278,202); p.endShape(p.CLOSE);
    p.noFill(); p.stroke("#E65D5D"); p.strokeWeight(4);
    p.arc(220,300,55,25,0.2,p.PI-0.4); p.line(245,294,252,302);
  }

  function emotionThree() {
    p.fill(255); p.noStroke(); p.ellipse(180,242,40,23); p.ellipse(255,242,40,23);
    p.stroke("rgb(88,39,39)"); p.strokeWeight(3); p.noFill();
    p.arc(180,238,40,18,p.PI,p.TWO_PI); p.arc(255,238,40,18,p.PI,p.TWO_PI);
    let lx=180,ly=246,rx=255,ry=246,mmx=4,mmy=3;
    let lpx=p.constrain(p.mouseX,lx-mmx,lx+mmx), lpy=p.constrain(p.mouseY,ly-mmy,ly+mmy);
    let rpx=p.constrain(p.mouseX,rx-mmx,rx+mmx), rpy=p.constrain(p.mouseY,ry-mmy,ry+mmy);
    p.fill(0); p.noStroke(); p.circle(lpx,lpy,13); p.circle(rpx,rpy,13);
    p.fill("rgb(88,39,39)");
    p.beginShape(); p.vertex(160,215); p.vertex(190,210); p.vertex(200,220); p.endShape(p.CLOSE);
    p.beginShape(); p.vertex(230,220); p.vertex(240,210); p.vertex(275,215); p.endShape(p.CLOSE);
    p.noFill(); p.stroke("#E65D5D"); p.strokeWeight(4);
    p.arc(220,315,60,35,p.PI,p.TWO_PI);
  }
});


/* ── SKETCH 07 — Asteroid API ── */
new p5(function(p) {
  let myData;
  let seed;
  let particles = [];
  let angle = 1;
  let colors = ["#4880F0", "#7C48F0", "#484BF0", "#48B5F0", "#48B5F0", "#F0DA48"];

  p.preload = function() {
    myData = p.loadJSON("aestroid.JSON", 
      function() { console.log("JSON loaded ok", myData); },
      function() { console.error("JSON failed to load — check the filename and location"); }
    );
  };

  p.setup = function() {
    let canvas = p.createCanvas(500, 360);
    canvas.parent("container7");
    p.angleMode(p.DEGREES);
    seed = p.random(9999999);

    let asteroids = myData.asteroids;
    for (let i = 0; i < asteroids.length; i++) {
      let asteroid = asteroids[i];
      particles.push({
        x: p.random(p.width),
        y: p.random(p.height),
        size: asteroid.diameter * 100,
        hazardous: asteroid.hazardous,
      });
    }
  };

  p.draw = function() {
    p.background(0);
    p.randomSeed(seed);
    back();

    p.translate(p.width / 2, p.height / 2);
    for (let i = 0; i < particles.length; i++) {
      let pt = particles[i];
      p.push();
      p.rotate(angle);
      p.fill(pt.hazardous ? "#F04861" : "#FF9E3B");

      if (pt.x > p.width)  pt.x = 0;
      if (pt.x < 0)        pt.x = p.width;
      if (pt.y > p.height) pt.y = 0;
      if (pt.y < 0)        pt.y = p.height;

      p.noStroke();
      p.circle(pt.x - p.width / 2, pt.y - p.height / 2, pt.size);
      p.pop();
    }
    angle += 1;
  };

  function back() {
    for (let i = 0; i < 200; i++) {
      p.stroke(colors[Math.floor(p.random(colors.length))]);
      p.strokeWeight(2);
      p.point(p.random(p.width), p.random(p.height));
    }
  }
});

/* ── SKETCH 08 — Arabic Text Image ── */
new p5(function(p) {
  let myImage;
  let size;
  const txt = [
    "وَعَاشِرُوهُنَّ", "بِالْمَعْرُوفِ",
    "وَلَهُنَّ", "مِثْلُ", "الَّذِي", "عَلَيْهِنَّ", "بِالْمَعْرُوفِ",
    "يَا", "أَيُّهَا", "النَّاسُ", "اتَّقُوا", "رَبَّكُمُ", "الَّذِي", "خَلَقَكُم", "مِّن", "نَّفْسٍ", "وَاحِدَةٍ"
  ];
 
  p.preload = function() {
    myImage = p.loadImage("woman.jpg",
      function() { console.log("Image loaded ok"); },
      function() { console.error("woman.jpg failed to load — check filename and location"); }
    );
  };
 
  p.setup = function() {
    let canvas = p.createCanvas(280, 380);
    canvas.parent("container8");
    p.frameRate(10); /* lower rate — pixel loop is heavy */
    myImage.resize(80, 0); /* smaller = much faster */
    size = p.width / myImage.width;
    myImage.loadPixels();
  };
 
  p.draw = function() {
    p.background(0);
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(size * 2);
    for (let i = 0; i < myImage.width; i++) {
      for (let j = 0; j < myImage.height; j++) {
        let pixelsIndex = (i + j * myImage.width) * 4;
        let r = myImage.pixels[pixelsIndex];
        let g = myImage.pixels[pixelsIndex + 1];
        let b = myImage.pixels[pixelsIndex + 2];
        let bright = (r + g + b) / 3;
        let tIndex = (i + j * myImage.width) % txt.length;
        let x = i * size + size / 2;
        let y = j * size + size / 2;
        let offset = (p.frameCount * 2 + j * 20) % (size * txt[tIndex].length);
        p.fill(bright * 3);
        p.drawingContext.save();
        p.drawingContext.beginPath();
        p.drawingContext.rect(i * size, j * size, size, size);
        p.drawingContext.clip();
        p.text(txt[tIndex], x - offset, y);
        p.drawingContext.restore();
      }
    }
  };
});

/* ── SKETCH 09 — Rotating Persian Calligraphy ── */
new p5(function(p) {
  let words = `دیروز باهوش بودم، می‌خواستم دنیا را تغییر دهم.
امروز خردمندم، خودم را تغییر می‌دهم.`;
  let t = 0;
  let colors = ["#D0BAF5", "#0E05F2", "#AA05F2", "#5C05F2", "#0547F2", "#0547F2"];

  p.setup = function() {
    let canvas = p.createCanvas(500, 380);
    canvas.parent("container9");
    p.textAlign(p.CENTER, p.CENTER);
    p.frameRate(30);
  };

  p.draw = function() {
    p.background(0);
    p.translate(p.width / 2, p.height / 2);

    let layers = 5;
    let points = 20;

    for (let j = 1; j <= layers; j++) {
      let radius = j * 35; /* slightly reduced so it fits the card */
      for (let i = 0; i < points; i++) {
        let angle = p.TWO_PI / points * i + t;
        let colorDist = p.floor(p.map(radius, 0, p.width / 2, 0, colors.length));
        let x = radius * p.cos(angle);
        let y = radius * p.sin(angle);
        p.push();
        p.translate(x, y);
        p.rotate(angle + p.HALF_PI);
        p.textSize(10);
        p.fill(colors[colorDist]);
        p.text(words, 0, 0);
        p.pop();
      }
    }
    t += 0.01;
  };
});
 
/* ── SKETCH 11 — Recursive Circles ── */
new p5(function(p) {
  let initialSize = 300;
  let colors = ["#E89C5D", "#0E05F2", "#AA05F2", "#5C05F2", "#0547F2", "#0547F2", "#E8C45D", "#E8845D", "#E8D45D"];
  let count = 20;

  p.setup = function() {
    let canvas = p.createCanvas(500, 380);
    canvas.parent("container11");
    p.rectMode(p.CENTER);
    p.frameRate(30);
  };

  p.draw = function() {
    p.background(0);
    p.noFill();

    for (let i = 0; i < count; i++) {
      for (let j = 0; j < count; j++) {
        let selectedColorIndex = p.round(i + j + p.frameCount / 2.5) % colors.length;
        let selectedColor = colors[selectedColorIndex];
        if (selectedColor) p.stroke(selectedColor);
      }
    }
    recursiveDrawCircles(p.width / 2, p.height / 2, initialSize);
  };

  function recursiveDrawCircles(x, y, size) {
    if (size < 6) return;
    p.circle(x, y, size);
    let newSize = size / 2;
    recursiveDrawCircles(x - newSize, y, newSize);
    recursiveDrawCircles(x + newSize, y, newSize);
    let noiseShift = p.noise(p.frameCount / 100) * 100;
    recursiveDrawCircles(x, y + newSize + noiseShift, newSize);
    recursiveDrawCircles(x, y - newSize - noiseShift, newSize);
  }
});
 
/* ── PAUSE SKETCHES WHEN OFF SCREEN (must be last) ── */
window.addEventListener('load', function() {
  const sketchObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      const canvas = e.target.querySelector('canvas');
      if (!canvas || !canvas._pInst) return;
      e.isIntersecting ? canvas._pInst.loop() : canvas._pInst.noLoop();
    });
  }, { threshold: 0.1 });
 
  document.querySelectorAll('[id^="container"]').forEach(el => sketchObs.observe(el));
});