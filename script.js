// ══════════════════════════════════════════
//  STATE
// ══════════════════════════════════════════
let currentMode = 'post';
let accentColor = '#e0001b';
let animStyle   = 'slide';
let currentLang = 'en';
let guestImgSrc = null;

const DIMS = {
  post:   { w: 450, h: 800 },
  reel:   { w: 405, h: 720 },
};

// ── SCALE ──
function scaleCard() {
  const vp   = document.querySelector('.viewport');
  const card = document.getElementById('card');
  if (!card.offsetWidth) return;
  const s = Math.min(
    (vp.clientWidth  - 40) / card.offsetWidth,
    (vp.clientHeight - 40) / card.offsetHeight,
    1
  );
  document.getElementById('vp-inner').style.transform = `scale(${s})`;
}
window.addEventListener('resize', scaleCard);

// ── CLOCK ──
function updateClock() {
  const n  = new Date();
  const mn = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
  const dy = ['SUN','MON','TUE','WED','THU','FRI','SAT'];
  document.getElementById('el-clock').textContent =
    n.toLocaleTimeString('en-US', { hour12: false });
  document.getElementById('el-date').textContent =
    `${dy[n.getDay()]} ${n.getDate()} ${mn[n.getMonth()]} ${n.getFullYear()}`;
}
updateClock(); setInterval(updateClock, 1000);

// ══════════════════════════════════════════
//  MODE
// ══════════════════════════════════════════
function setMode(mode, btn) {
  currentMode = mode;
  document.querySelectorAll('.mode-tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const d    = DIMS[mode];
  const card = document.getElementById('card');
  card.style.width  = d.w + 'px';
  card.style.height = d.h + 'px';
  positionElements();
  initCanvas();
  document.getElementById('btn-play').style.display      = mode === 'reel' ? 'block' : 'none';
  document.getElementById('anim-sec').style.opacity      = mode === 'reel' ? '1' : '.4';
  document.getElementById('anim-sec').style.pointerEvents= mode === 'reel' ? 'auto' : 'none';
  if (mode === 'post') showAll(); else resetAnim();
  setTimeout(scaleCard, 60);
}

function positionElements() {
  const d = DIMS[currentMode];
  const catBottom = Math.round(d.h * 0.335);
  document.getElementById('el-cattag').style.bottom = catBottom + 'px';
  document.getElementById('el-guest').style.bottom  = (catBottom + 5) + 'px';
}

// ══════════════════════════════════════════
//  SYNC — push input values to card
// ══════════════════════════════════════════
function sync() {
  const name  = document.getElementById('i-name').value.trim();
  const hl    = document.getElementById('i-hl').value.trim();
  const sub   = document.getElementById('i-sub').value.trim();
  const tick  = document.getElementById('i-tick').value.trim();
  const web   = document.getElementById('i-web').value.trim();
  const gn    = document.getElementById('i-gname').value.trim();
  const gt    = document.getElementById('i-gtitle').value.trim();
  const badge = document.getElementById('i-livebadge').value.trim();
  const pw    = document.getElementById('i-powered').value.trim();

  document.getElementById('el-cname').textContent    = name || 'Your Channel';
  document.getElementById('el-logo-txt').textContent = name
    ? name.replace(/\s.*/, '').slice(0, 4).toUpperCase() : 'NEWS';
  document.getElementById('el-src').textContent      = name
    ? name.split(/[\s—–-]/)[0] : 'Channel';
  document.getElementById('el-live').textContent     = badge || '● LIVE';
  document.getElementById('el-wm').textContent       = pw || 'Powered By John';

  const hlEl = document.getElementById('el-hl');
  hlEl.textContent = hl || 'Your headline will appear here';
  setAnimClass(hlEl);

  document.getElementById('el-sub').textContent = sub || 'Source';
  document.getElementById('t1').textContent     = tick || 'Scrolling ticker • Stay tuned';
  document.getElementById('t2').textContent     = tick || 'Scrolling ticker • Stay tuned';
  document.getElementById('el-web').textContent = web || 'yoursite.com';
  document.getElementById('el-gname').textContent  = gn || '—';
  document.getElementById('el-gtitle').textContent = gt || '—';

  if (currentMode === 'post') showAll();
}

// ══════════════════════════════════════════
//  CATEGORY
// ══════════════════════════════════════════
function setCat(main, sub, btn, color) {
  document.querySelectorAll('.chip').forEach(b => b.classList.remove('active'));
  if (btn && btn.classList) btn.classList.add('active');
  accentColor = color;
  document.getElementById('el-ccat').textContent    = main;
  document.getElementById('el-ccatsub').textContent = sub;
  document.getElementById('el-tflag').textContent   = main;
  
  const redEls = [
    document.getElementById('el-live'),
    document.getElementById('el-ccat'),
    document.getElementById('el-cbar'),
    document.getElementById('el-gplate'),
  ];
  redEls.forEach(el => { if (el) el.style.background = color; });
  
  // Handle Logo badge background (make transparent if image uploaded)
  const logoBadge = document.getElementById('el-badge');
  if (document.getElementById('el-logo-img').src && document.getElementById('el-logo-img').style.display === 'block') {
      logoBadge.style.background = 'transparent';
  } else {
      logoBadge.style.background = color;
  }

  document.querySelector('.c-gframe').style.borderBottomColor = color;
  document.getElementById('el-ltbar').style.borderTopColor    = color;
  
  const isVeryDark = color === '#252525';
  document.getElementById('el-tflag').style.background = isVeryDark ? '#555' : '#f0b400';
  document.getElementById('el-tflag').style.color      = isVeryDark ? '#fff' : '#000';
  if (currentMode === 'post') showAll();
}

// ══════════════════════════════════════════
//  LANGUAGE
// ══════════════════════════════════════════
function setLang(l, btn) {
  document.querySelectorAll('.ltab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  currentLang = l;
  const hlEl  = document.getElementById('el-hl');
  const subEl = document.getElementById('el-sub');
  if (l === 'np') { hlEl.classList.add('np'); subEl.classList.add('np'); }
  else            { hlEl.classList.remove('np'); subEl.classList.remove('np'); }
}

// ══════════════════════════════════════════
//  ANIMATION
// ══════════════════════════════════════════
function setAnim(s, btn) {
  document.querySelectorAll('.ac').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  animStyle = s;
}

function setAnimClass(el) {
  ['av-fade','av-scale','av-blur','av-split','av-glitch'].forEach(c => el.classList.remove(c));
  if (animStyle !== 'slide') el.classList.add('av-' + animStyle);
}

function showAll() {
  ['el-brand','el-dt','el-cattag','el-ltbar','el-hl','el-sub','el-ticker','el-footer']
    .forEach(id => { const el = document.getElementById(id); if (el) el.classList.add('in'); });
  if (guestImgSrc && document.getElementById('tog-guest').classList.contains('on')) {
    const g = document.getElementById('el-guest');
    g.classList.add('show','in');
  }
}

function resetAnim() {
  ['el-brand','el-dt','el-cattag','el-ltbar','el-hl','el-sub','el-ticker','el-footer']
    .forEach(id => { const el = document.getElementById(id); if (el) el.classList.remove('in'); });
  const g = document.getElementById('el-guest');
  g.classList.remove('in');
  g.style.opacity = '0'; g.style.transform = 'translateX(40px)';
}

function playAnim() {
  resetAnim();
  const hlEl = document.getElementById('el-hl');
  setAnimClass(hlEl);
  const seq = [
    { id:'el-brand',   d:80   },
    { id:'el-dt',      d:300  },
    { id:'el-cattag',  d:550  },
    { id:'el-ltbar',   d:850  },
    { id:'el-hl',      d:1050 },
    { id:'el-sub',     d:1180 },
    { id:'el-ticker',  d:1380 },
    { id:'el-footer',  d:1500 },
  ];
  seq.forEach(({ id, d }) => setTimeout(() => {
    const el = document.getElementById(id);
    if (el) el.classList.add('in');
  }, d));
  if (guestImgSrc) {
    setTimeout(() => {
      const g = document.getElementById('el-guest');
      g.style.opacity = '1'; g.style.transform = 'translateX(0)';
    }, 700);
  }
}

// ══════════════════════════════════════════
//  SECTION TOGGLES
// ══════════════════════════════════════════
function toggleSection(bodyId, trackId) {
  const body  = document.getElementById(bodyId);
  const track = document.getElementById(trackId);
  const isOn  = track.classList.contains('on');
  track.classList.toggle('on', !isOn);
  const label = track.nextElementSibling;
  if (label) label.textContent = isOn ? 'Off' : 'On';
  body.classList.toggle('collapsed', isOn);

  const sectionCardMap = {
    'cat-body':    ['el-cattag'],
    'ticker-body': ['el-ticker'],
    'dt-body':     ['el-dt'],
    'live-body':   ['el-live'],
    'pw-body':     ['el-wm'],
    'guest-body':  ['el-guest'],
  };
  if (sectionCardMap[bodyId]) {
    sectionCardMap[bodyId].forEach(elId => {
      const el = document.getElementById(elId);
      if (!el) return;
      el.style.visibility = isOn ? 'hidden' : 'visible';
      el.style.opacity = isOn ? '0' : '';
    });
    if (bodyId === 'guest-body') {
      const g = document.getElementById('el-guest');
      if (isOn) { g.classList.remove('show','in'); }
      else if (guestImgSrc) { g.classList.add('show'); if (currentMode === 'post') g.classList.add('in'); }
    }
  }
}

function toggleEl(name, trackId) {
  const track = document.getElementById(trackId);
  const isOn  = track.classList.contains('on');
  track.classList.toggle('on', !isOn);
  const label = track.nextElementSibling;
  if (label) label.textContent = isOn ? 'Off' : 'On';

  const map = {
    brand:  'el-brand',
    lt:     'el-lower',
    footer: 'el-footer',
    flare:  'el-flare',
    grain:  'el-grain',
    cin:    'el-cin',
  };
  const el = document.getElementById(map[name]);
  if (!el) return;
  if (name === 'flare') {
    el.style.display = isOn ? 'none' : 'block';
  } else {
    el.style.visibility = isOn ? 'hidden' : 'visible';
    el.style.opacity    = isOn ? '0' : '';
  }
}

// ══════════════════════════════════════════
//  CROPPER SYSTEM
// ══════════════════════════════════════════
let cropperInstance = null;
let cropCallback = null;

function openCropper(file, ratio, callback) {
  const reader = new FileReader();
  reader.onload = (e) => {
    const modal = document.getElementById('crop-modal');
    const img = document.getElementById('crop-image');
    img.src = e.target.result;
    modal.classList.add('open');

    if (cropperInstance) { cropperInstance.destroy(); }
    cropperInstance = new Cropper(img, {
      aspectRatio: ratio,
      viewMode: 1,
      background: false,
      dragMode: 'move',
      autoCropArea: 1,
    });
    cropCallback = callback;
  };
  reader.readAsDataURL(file);
}

function closeCropper() {
  document.getElementById('crop-modal').classList.remove('open');
  if (cropperInstance) { cropperInstance.destroy(); cropperInstance = null; }
  
  // Reset file inputs so they trigger onchange if same file selected again
  if(document.getElementById('logo-inp')) document.getElementById('logo-inp').value = '';
  if(document.getElementById('guest-inp')) document.getElementById('guest-inp').value = '';
}

function applyCrop() {
  if (!cropperInstance) return;
  // Get image as PNG so it keeps transparency (crucial for logos)
  const canvas = cropperInstance.getCroppedCanvas();
  const base64 = canvas.toDataURL('image/png');
  closeCropper();
  if (cropCallback) cropCallback(base64);
}

// ══════════════════════════════════════════
//  LOGO UPLOAD
// ══════════════════════════════════════════
function handleLogoUpload(e) {
  const file = e.target.files[0]; if (!file) return;
  // 1:1 Aspect ratio for Logo box
  openCropper(file, 1, (croppedData) => {
    document.getElementById('logo-thumb').src = croppedData;
    document.getElementById('logo-preview').classList.add('show');
    document.getElementById('logo-upload-btn').style.display = 'none';

    document.getElementById('el-logo-img').src = croppedData;
    document.getElementById('el-logo-img').style.display = 'block';
    document.getElementById('el-logo-txt').style.display = 'none';
    document.getElementById('el-logo-sub').style.display = 'none';
    document.getElementById('el-badge').style.background = 'transparent';
  });
}

function removeLogo() {
  document.getElementById('logo-thumb').src = '';
  document.getElementById('logo-preview').classList.remove('show');
  document.getElementById('logo-upload-btn').style.display = 'block';
  document.getElementById('logo-inp').value = '';

  document.getElementById('el-logo-img').src = '';
  document.getElementById('el-logo-img').style.display = 'none';
  document.getElementById('el-logo-txt').style.display = 'block';
  document.getElementById('el-logo-sub').style.display = 'block';
  document.getElementById('el-badge').style.background = accentColor;
}

// ══════════════════════════════════════════
//  GUEST PHOTO
// ══════════════════════════════════════════
function loadGuest(e) {
  const file = e.target.files[0]; if (!file) return;
  // Frame size is 100x118, so ratio is 100/118
  openCropper(file, 100/118, (croppedData) => {
    guestImgSrc = croppedData;
    document.getElementById('guest-thumb').src = guestImgSrc;
    document.getElementById('guest-preview').classList.add('show');
    document.getElementById('guest-upload-btn').style.display = 'none';
    document.getElementById('el-gimg').src = guestImgSrc;
    
    const g = document.getElementById('el-guest');
    g.classList.add('show');
    if (currentMode === 'post') { g.style.opacity='1'; g.style.transform='translateX(0)'; }
    sync();
  });
}

function removeGuest() {
  guestImgSrc = null;
  document.getElementById('guest-thumb').src = '';
  document.getElementById('guest-preview').classList.remove('show');
  document.getElementById('guest-upload-btn').style.display = 'flex';
  document.getElementById('guest-inp').value = '';
  document.getElementById('el-gimg').src = '';
  
  const g = document.getElementById('el-guest');
  g.classList.remove('show','in');
  g.style.opacity = '0'; g.style.transform = 'translateX(40px)';
}

// ══════════════════════════════════════════
//  BACKGROUND VIDEO / IMAGE
// ══════════════════════════════════════════
function handleBgUpload(e) {
  const file = e.target.files[0]; if (!file) return;
  const MAX_VIDEO = 100 * 1024 * 1024; // 100 MB
  const MAX_IMAGE =  10 * 1024 * 1024; // 10 MB
  const isVid = file.type.startsWith('video/');
  
  if (isVid && file.size > MAX_VIDEO) { toast('⚠ Video too large! Max 100 MB'); e.target.value = ''; return; }
  if (!isVid && file.size > MAX_IMAGE) { toast('⚠ Image too large! Max 10 MB'); e.target.value = ''; return; }

  // UI switch
  document.getElementById('bg-upload-btn').style.display = 'none';
  document.getElementById('bg-preview').classList.add('show');

  if (isVid) {
    const vid = document.getElementById('bg-vid');
    const thumbVid = document.getElementById('bg-thumb-vid');
    
    if (vid._blobURL) { URL.revokeObjectURL(vid._blobURL); }
    vid._blobURL = URL.createObjectURL(file);
    
    // Update preview thumb
    thumbVid.src = vid._blobURL;
    thumbVid.style.display = 'block';
    document.getElementById('bg-thumb-img').style.display = 'none';
    thumbVid.play().catch(()=>{});

    // Update main card background
    vid.src   = vid._blobURL;
    vid.muted = true; 
    vid.loop  = true;
    vid.classList.add('v');
    vid.play().catch(err => toast('⚠ ' + err.message));
    
    document.getElementById('bg-img-el').classList.remove('v');
    document.getElementById('vid-controls').style.display = 'block';
    document.getElementById('vol-slider').value           = 0;
    document.getElementById('vol-val').textContent        = '0%';
    document.querySelector('.vol-icon').textContent       = '🔇';
    toast('🔇 Muted — tap 🔊 to unmute');
    if (currentMode === 'post') showAll();
    
  } else {
    // Handling Images
    const r = new FileReader();
    r.onload = ev => {
      const src = ev.target.result;
      
      // Update preview thumb
      document.getElementById('bg-thumb-img').src = src;
      document.getElementById('bg-thumb-img').style.display = 'block';
      document.getElementById('bg-thumb-vid').style.display = 'none';

      // Update main card background
      const img = document.getElementById('bg-img-el');
      img.src = src; img.classList.add('v');
      
      // Stop and clear video
      const vid = document.getElementById('bg-vid');
      vid.pause();
      if (vid._blobURL) { URL.revokeObjectURL(vid._blobURL); vid._blobURL = null; }
      vid.src = ''; vid.classList.remove('v');
      
      document.getElementById('vid-controls').style.display = 'none';
      if (currentMode === 'post') showAll();
    };
    r.readAsDataURL(file);
  }
}

function removeBg() {
  // UI switch back
  document.getElementById('bg-upload-btn').style.display = 'flex';
  document.getElementById('bg-preview').classList.remove('show');
  document.getElementById('bg-inp').value = '';

  // Clear thumbs
  document.getElementById('bg-thumb-img').src = '';
  document.getElementById('bg-thumb-img').style.display = 'none';
  document.getElementById('bg-thumb-vid').src = '';
  document.getElementById('bg-thumb-vid').style.display = 'none';
  document.getElementById('vid-controls').style.display = 'none';

  // Clear Main Card Media
  const vid = document.getElementById('bg-vid');
  vid.pause();
  if (vid._blobURL) { URL.revokeObjectURL(vid._blobURL); vid._blobURL = null; }
  vid.src = '';         
  vid.classList.remove('v');
  
  const img = document.getElementById('bg-img-el');
  img.src = '';
  img.classList.remove('v');
}

function setVol(v) {
  const vid = document.getElementById('bg-vid');
  vid.volume = v / 100;
  vid.muted  = (v == 0);
  if (v > 0 && vid.paused) vid.play().catch(() => {});
  document.getElementById('vol-val').textContent = v + '%';
  document.querySelector('.vol-icon').textContent = v == 0 ? '🔇' : v < 50 ? '🔉' : '🔊';
}

function toggleMute() {
  const vid    = document.getElementById('bg-vid');
  const slider = document.getElementById('vol-slider');
  vid.muted = !vid.muted;
  if (vid.muted) {
    slider.value = 0;
    document.getElementById('vol-val').textContent = '0%';
    document.querySelector('.vol-icon').textContent = '🔇';
  } else {
    const v = Math.max(vid.volume * 100, 20);
    vid.volume = v / 100;
    slider.value = Math.round(v);
    document.getElementById('vol-val').textContent = Math.round(v) + '%';
    document.querySelector('.vol-icon').textContent = v < 50 ? '🔉' : '🔊';
    if (vid.paused) vid.play().catch(() => {});
  }
}

function toggleVidPlay() {
  const vid = document.getElementById('bg-vid');
  vid.paused ? vid.play() : vid.pause();
}

function removeVid() {
   // Legacy binding for the text "✕ Remove" button under video volume slider
   removeBg();
}

function setBgCol(col, el) {
  document.querySelectorAll('.sw').forEach(s => s.classList.remove('active'));
  el.classList.add('active');
  document.getElementById('card').style.background = col;
}

// ══════════════════════════════════════════
//  CANVAS BACKGROUND ANIMATION
// ══════════════════════════════════════════
let cvs, ctx2d, cpts = [], animFrame;

function initCanvas() {
  if (!cvs) {
    cvs   = document.getElementById('cvs-bg');
    ctx2d = cvs.getContext('2d');
  }
  const card = document.getElementById('card');
  cvs.width  = card.offsetWidth  || DIMS[currentMode].w;
  cvs.height = card.offsetHeight || DIMS[currentMode].h;
  cpts = Array.from({ length:60 }, () => ({
    x: Math.random() * cvs.width,
    y: Math.random() * cvs.height,
    r: Math.random() * .8 + .2,
    s: Math.random() * .3 + .08,
    o: Math.random() * .2 + .04,
    d: (Math.random() - .5) * .18,
  }));
}

function drawCanvas() {
  if (!cvs || cvs.width===0 || cvs.height===0) { animFrame=requestAnimationFrame(drawCanvas); return; }
  ctx2d.clearRect(0,0,cvs.width,cvs.height);
  ctx2d.strokeStyle='rgba(255,255,255,.014)'; ctx2d.lineWidth=1;
  for (let x=0;x<cvs.width;x+=36){ ctx2d.beginPath();ctx2d.moveTo(x,0);ctx2d.lineTo(x,cvs.height);ctx2d.stroke(); }
  for (let y=0;y<cvs.height;y+=36){ ctx2d.beginPath();ctx2d.moveTo(0,y);ctx2d.lineTo(cvs.width,y);ctx2d.stroke(); }
  cpts.forEach(p => {
    p.y-=p.s; p.x+=p.d;
    if (p.y<0){p.y=cvs.height;p.x=Math.random()*cvs.width;}
    if (p.x<0||p.x>cvs.width) p.x=Math.random()*cvs.width;
    ctx2d.beginPath();ctx2d.arc(p.x,p.y,p.r,0,Math.PI*2);
    ctx2d.fillStyle=`rgba(255,255,255,${p.o})`;ctx2d.fill();
  });
  const t=Date.now()/6000, bx=((Math.sin(t)+1)/2)*cvs.width;
  const g=ctx2d.createLinearGradient(bx-60,0,bx+60,cvs.height);
  g.addColorStop(0,'transparent');g.addColorStop(.5,'rgba(60,80,200,.04)');g.addColorStop(1,'transparent');
  ctx2d.fillStyle=g;ctx2d.fillRect(0,0,cvs.width,cvs.height);
  animFrame=requestAnimationFrame(drawCanvas);
}

// ══════════════════════════════════════════
//  FULLSCREEN PREVIEW
// ══════════════════════════════════════════
function openPreview() {
  const modal = document.getElementById('fs-modal');
  const wrap  = document.getElementById('fs-card-wrap');
  modal.classList.add('open');

  const card  = document.getElementById('card');
  const clone = card.cloneNode(true);
  clone.id    = 'card-clone';

  const scale = Math.min(
    (window.innerWidth  - 80) / card.offsetWidth,
    (window.innerHeight - 80) / card.offsetHeight
  );
  clone.style.transform       = `scale(${scale})`;
  clone.style.transformOrigin = 'center center';
  clone.style.flexShrink      = '0';
  clone.style.boxShadow       = '0 0 80px rgba(0,0,0,.9)';

  const cloneCvs = clone.querySelector('#cvs-bg');
  if (cloneCvs && cvs && cvs.width > 0) {
    const img2   = document.createElement('img');
    img2.src     = cvs.toDataURL();
    img2.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;object-fit:cover';
    cloneCvs.replaceWith(img2);
  }

  const cloneVid = clone.querySelector('#bg-vid');
  if (cloneVid) {
    const origVid = document.getElementById('bg-vid');
    if (origVid.src) {
      cloneVid.src     = origVid.src;
      cloneVid.volume  = origVid.volume;
      cloneVid.muted   = origVid.muted;
      cloneVid.loop    = true;
      cloneVid.play();
    }
  }

  wrap.innerHTML = '';
  wrap.appendChild(clone);
}

function closePreview() {
  const modal   = document.getElementById('fs-modal');
  const cloneVid = document.querySelector('#card-clone #bg-vid');
  if (cloneVid) cloneVid.pause();
  modal.classList.remove('open');
  document.getElementById('fs-card-wrap').innerHTML = '';
}

document.addEventListener('keydown', e => { if (e.key==='Escape') closePreview(); });

// ══════════════════════════════════════════
//  DOWNLOAD & SHARE
// ══════════════════════════════════════════
function toast(msg, dur=3000) {
  const t = document.getElementById('toast');
  t.textContent = msg; t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), dur);
}

function captureCard(cb) {
  const card    = document.getElementById('card');
  const bgColor = card.style.background || '#05050f';
  let snapshot  = null;
  if (cvs && cvs.width>0 && cvs.height>0) {
    snapshot = ctx2d.getImageData(0, 0, cvs.width, cvs.height);
  }
  html2canvas(card, {
    scale: 3,
    useCORS: true,
    backgroundColor: bgColor,
    logging: false,
    ignoreElements: el => el.tagName === 'VIDEO',
    onclone: (doc) => {
      const cc = doc.getElementById('cvs-bg');
      if (!cc) return;
      const d = DIMS[currentMode];
      cc.width  = snapshot ? cvs.width  : d.w;
      cc.height = snapshot ? cvs.height : d.h;
      const c2 = cc.getContext('2d');
      if (snapshot) c2.putImageData(snapshot, 0, 0);
      else { c2.fillStyle = bgColor; c2.fillRect(0,0,d.w,d.h); }
    }
  }).then(canvas => {
    canvas.toBlob(blob => {
      if (!blob) { toast('Capture failed'); return; }
      cb(blob);
    }, 'image/png');
  }).catch(err => toast('Error: ' + err.message));
}

function downloadCard() {
  if (currentMode === 'reel') { recordReel(); return; }
  toast('Preparing…');
  captureCard(blob => {
    const url = URL.createObjectURL(blob);
    const a   = document.createElement('a');
    a.href    = url;
    a.download= `news-${currentMode}-${Date.now()}.png`;
    document.body.appendChild(a); a.click();
    setTimeout(() => { URL.revokeObjectURL(url); a.remove(); }, 1000);
    toast('✓ Saved!');
  });
}

// ── FIXED REEL RECORDER ──
async function recordReel() {
  if (!window.MediaRecorder) {
    toast('⚠ MediaRecorder not supported'); return;
  }

  const card    = document.getElementById('card');
  const vid     = document.getElementById('bg-vid');
  const bgImgEl = document.getElementById('bg-img-el');
  const d       = DIMS['reel'];
  const W       = d.w * 2;
  const H       = d.h * 2;

  const recCanvas = document.createElement('canvas');
  recCanvas.width  = W;
  recCanvas.height = H;
  const recCtx = recCanvas.getContext('2d');

  const mimeType =
    MediaRecorder.isTypeSupported('video/webm;codecs=vp9') ? 'video/webm;codecs=vp9' :
    MediaRecorder.isTypeSupported('video/webm')            ? 'video/webm' : 'video/mp4';
  const ext = mimeType.includes('mp4') ? 'mp4' : 'webm';

  const stream   = recCanvas.captureStream(30);
  const recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 6_000_000 });
  const chunks   = [];

  recorder.ondataavailable = e => { if (e.data.size > 0) chunks.push(e.data); };
  const btn = document.getElementById('btn-play');

  recorder.onstop = () => {
    const blob = new Blob(chunks, { type: mimeType });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = `news-reel-${Date.now()}.${ext}`;
    document.body.appendChild(a); a.click();
    setTimeout(() => { URL.revokeObjectURL(url); a.remove(); }, 2000);
    toast('✓ Reel saved!');
    btn.disabled = false; btn.textContent = '▶  PLAY ANIMATION';
  };

  let overlayImg = null;
  await html2canvas(card, {
    scale: 2, useCORS: true, logging: false, backgroundColor: null,
    ignoreElements: el =>
      el.id === 'bg-vid' || el.id === 'cvs-bg' || el.id === 'bg-img-el' || el.id === 'el-ticker' || el.id === 'el-dt'
  }).then(snap => { overlayImg = snap; }).catch(() => {});

  if (vid.src && vid.readyState >= 1) {
    vid.currentTime = 0;
    vid.muted = true;
    vid.play().catch(() => {});
  }

  btn.disabled    = true;
  btn.textContent = '⏺ Recording…';
  toast('🎬 Recording 6 s reel…');

  recorder.start();
  resetAnim();

  const DURATION = 6500;
  let animStarted= false;
  let rafId;
  let startTime = null;

  const rawTickerText = document.getElementById('i-tick').value.trim() || 'Scrolling ticker • Stay tuned';
  const tickerText = `${rawTickerText} • Stay tuned         ${rawTickerText} • Stay tuned`;
  let tickerX = W;

  const drawFrame = (timestamp) => {
    if (!startTime) startTime = timestamp;
    let elapsed = timestamp - startTime;

    if (elapsed >= DURATION) {
      recorder.stop();
      cancelAnimationFrame(rafId);
      return;
    }

    if (!animStarted && elapsed >= 80) {
      animStarted = true;
      playAnim();
    }

    recCtx.clearRect(0, 0, W, H);

    // 1. Solid background
    recCtx.fillStyle = card.style.background || '#05050f';
    recCtx.fillRect(0, 0, W, H);

    // 2. Background image
    if (bgImgEl.classList.contains('v') && bgImgEl.complete && bgImgEl.naturalWidth) {
      recCtx.drawImage(bgImgEl, 0, 0, W, H);
    }

    // 3. Background Video
    if (vid.src && vid.readyState >= 2) {
      try { recCtx.drawImage(vid, 0, 0, W, H); } catch(_) {}
    }

    // 4. Canvas particles
    if (cvs && cvs.width > 0) {
      recCtx.drawImage(cvs, 0, 0, W, H);
    }

    // 5. DOM overlay
    if (overlayImg) {
      recCtx.drawImage(overlayImg, 0, 0, W, H);
    }

    // 6. Draw dynamic moving parts natively
    // -> Native Clock
    if (document.getElementById('tog-dt').classList.contains('on') && elapsed > 300) {
        recCtx.fillStyle = '#ffffff';
        recCtx.font = 'bold 36px monospace';
        recCtx.textAlign = 'right';
        recCtx.shadowColor = 'rgba(0,0,0,0.9)';
        recCtx.shadowBlur = 12;
        recCtx.shadowOffsetY = 2;
        recCtx.fillText(document.getElementById('el-clock').textContent, W - 28, 150);
        
        recCtx.fillStyle = '#f0b400';
        recCtx.font = '500 18px sans-serif';
        recCtx.shadowBlur = 0;
        recCtx.fillText(document.getElementById('el-date').textContent, W - 28, 175);
    }

    // -> Native Ticker
    if (document.getElementById('tog-ticker').classList.contains('on') && elapsed > 1380) {
        const tickerY = H - 68;
        const tickerH = 60;
        
        // bg
        recCtx.fillStyle = 'rgba(0,0,0,0.92)';
        recCtx.fillRect(0, tickerY, W, tickerH);
        
        // Flag block
        recCtx.fillStyle = accentColor === '#252525' ? '#555' : '#f0b400';
        recCtx.fillRect(0, tickerY, 150, tickerH);
        recCtx.fillStyle = accentColor === '#252525' ? '#fff' : '#000';
        recCtx.font = 'bold 18px monospace';
        recCtx.textAlign = 'center';
        recCtx.textBaseline = 'middle';
        recCtx.fillText(document.getElementById('el-tflag').textContent, 75, tickerY + tickerH/2);
        
        // Scrolling Text
        recCtx.save();
        recCtx.rect(150, tickerY, W - 150, tickerH);
        recCtx.clip();
        recCtx.fillStyle = '#bbbbbb';
        recCtx.font = '22px sans-serif';
        recCtx.textAlign = 'left';
        
        tickerX -= 3; 
        if (tickerX < -W) tickerX = W;
        
        recCtx.fillText(tickerText, tickerX, tickerY + tickerH/2);
        recCtx.restore();
    }

    rafId = requestAnimationFrame(drawFrame);
  };

  setTimeout(() => { rafId = requestAnimationFrame(drawFrame); }, 80);
}

function shareCard() {
  if (currentMode === 'reel') { toast('ℹ Use Download for Reel video'); return; }
  captureCard(async blob => {
    const file = new File([blob], 'news-card.png', { type:'image/png' });
    if (navigator.canShare && navigator.canShare({ files:[file] })) {
      try { await navigator.share({ files:[file], title:'News Card' }); return; } catch {}
    }
    const a = document.createElement('a');
    a.href   = URL.createObjectURL(blob); a.download = 'news-card.png';
    document.body.appendChild(a); a.click(); a.remove();
    toast('✓ Saved!');
  });
}

// ══════════════════════════════════════════
//  INIT
// ══════════════════════════════════════════
window.addEventListener('load', () => {
  const card = document.getElementById('card');
  const d    = DIMS['post'];
  card.style.width  = d.w + 'px';
  card.style.height = d.h + 'px';
  positionElements();
  initCanvas();
  drawCanvas();
  setTimeout(scaleCard, 100);
  showAll();
  sync();
});