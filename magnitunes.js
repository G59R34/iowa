/* Magnitunes Minimal JS – intentionally lightweight and a bit janky */
(function(){
  const featured = [
    { id:'mix-corn', title:'Corn Disintegration', desc:'Ambient loss of fictional agriculture.', tag:'Concept', emoji:'🌽' },
    { id:'mix-altima', title:'Altima Rage Drive', desc:'Illicit highway synth energy.', tag:'Aggro', emoji:'🚗' },
    { id:'mix-focus', title:'Study Level Focus', desc:'Deep procedural pseudo-concentration bed.', tag:'Focus', emoji:'🧠' },
    { id:'mix-flight', title:'A320 Ghost Cabin', desc:'Cabin pressure & haunted avionics.', tag:'Atmos', emoji:'✈️' },
    { id:'mix-sink', title:'Sink Hype Warmup', desc:'Reverb faucet core textures.', tag:'Hype', emoji:'🚰' },
    { id:'mix-porc', title:'Porcupine Hymns', desc:'Spiky bardwave corescape.', tag:'Lore', emoji:'🦔' }
  ];

  const demoPlaylist = [
    { id:1, title:'Destroy The Corn (Intro Mix)', artist:'Cultwave', dur:162 },
    { id:2, title:'Altima Night Drive', artist:'Neon Sedan', dur:238 },
    // Real audio integration for Liz track
    { id:3, title:'Liz Theme', artist:'Liz', dur:0, src:'res/aud/liz/liz.mp3' },
    { id:4, title:'Flight Path Over Iowa (Empty)', artist:'A320 Ghost Crew', dur:303 },
    { id:5, title:'Sink Hype Anthem', artist:'Porcupine Prime', dur:197 }
  ];

  // State
  let queue = [];
  let index = -1;
  let playing = false;
  let progress = 0; // seconds
  let timer = null;
  let shuffle = false;
  let repeat = false;
  let audio = null; // html5 audio element when track has real src
  let usingAudio = false;

  // Elements
  const grid = document.getElementById('mt-featured-grid');
  const library = document.getElementById('mt-playlist-library');
  const trackTitle = document.getElementById('mt-track-title');
  const trackArtist = document.getElementById('mt-track-artist');
  const cover = document.getElementById('mt-cover');
  const playBtn = document.getElementById('mt-play');
  const prevBtn = document.getElementById('mt-prev');
  const nextBtn = document.getElementById('mt-next');
  const currentTimeEl = document.getElementById('mt-current-time');
  const durationEl = document.getElementById('mt-duration');
  const progressBar = document.getElementById('mt-progress-bar');
  const miniPlay = document.getElementById('mt-mini-play');
  const miniTrack = document.getElementById('mt-mini-track');
  const shuffleBtn = document.getElementById('mt-shuffle');
  const repeatBtn = document.getElementById('mt-repeat');
  const clearBtn = document.getElementById('mt-clear');
  const openPlaylistBtn = document.getElementById('mt-open-playlist');
  const downloadCta = document.getElementById('mt-download-cta');

  // Nav handling
  document.querySelectorAll('.mt-nav-btn, .mt-download-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.mt-nav-btn').forEach(b=>b.classList.remove('is-active'));
      if(btn.classList.contains('mt-nav-btn')) btn.classList.add('is-active');
      const view = btn.dataset.view;
      document.querySelectorAll('.mt-section').forEach(s=> s.classList.add('is-hidden'));
      const section = document.getElementById('mt-section-' + view);
      if(section) section.classList.remove('is-hidden');
      if(view === 'download') downloadCta.classList.add('is-pulse');
      else downloadCta.classList.remove('is-pulse');
      if(view === 'gallery') maybeLoadGallery();
    });
  });

  // Build featured cards
  featured.forEach(f => {
    const card = document.createElement('div');
    card.className = 'mt-card';
    card.innerHTML = `<div class="mt-card-title">${f.emoji} ${f.title}</div><div class="mt-card-desc">${f.desc}</div><div class="mt-card-tag">${f.tag}</div>`;
    card.addEventListener('click', () => {
      loadDemo();
      playIndex(0);
    });
    grid.appendChild(card);
  });

  // Build library (pretend playlists)
  ['Demo Playlist','Corn Collapse','Altima Fuel','Focus Core'].forEach((name,i)=>{
    const row = document.createElement('div');
    row.className = 'mt-playlist-row';
    row.innerHTML = `<div class='mt-pl-icon'>${['🎵','🌽','🚗','🧠'][i]}</div><div class='mt-pl-meta'><div class='mt-pl-title'>${name}</div><div class='mt-pl-sub'>${i===0? '5 tracks • mock' : 'Empty • soon'}</div></div>`;
    row.addEventListener('click', () => {
      if(i===0){ loadDemo(); playIndex(0); }
    });
    library.appendChild(row);
  });

  function pad(n){ return (n<10?'0':'')+n; }
  function fmt(sec){ const m=Math.floor(sec/60); const s=Math.floor(sec%60); return m+':' + pad(s); }

  function loadDemo(){
    queue = demoPlaylist.slice();
    index = -1;
    progress = 0;
    persist();
  }

  function renderTrack(){
    if(index < 0 || !queue[index]) { trackTitle.textContent='No Track'; trackArtist.textContent='—'; miniTrack.textContent='No track loaded'; miniPlay.disabled = true; return; }
    const t = queue[index];
    trackTitle.textContent = t.title;
    trackArtist.textContent = t.artist;
    miniTrack.textContent = t.title;
    miniPlay.disabled = false;
    cover.textContent = t.title.charAt(0);
    // If real audio duration known use that, else mock
    const effectiveDur = (usingAudio && audio && !isNaN(audio.duration) && audio.duration>0) ? audio.duration : t.dur;
    if(!t.dur && usingAudio && audio && !isNaN(audio.duration) && audio.duration>0) {
      t.dur = Math.floor(audio.duration);
    }
    durationEl.textContent = fmt(effectiveDur || 0);
    currentTimeEl.textContent = fmt(progress);
    const pct = effectiveDur ? (progress / effectiveDur * 100) : 0;
    progressBar.style.width = pct + '%';
    playBtn.textContent = playing ? '❚❚' : '▶';
    miniPlay.textContent = playing ? '❚❚' : '▶';
  }

  function playIndex(i){
    if(!queue.length) return;
    if(i < 0) i = 0;
    if(i >= queue.length) i = 0;
    index = i;
    progress = 0;
    playing = true;
    startPlayback();
    renderTrack();
    persist();
  }

  function next(){
    if(!queue.length) return;
    if(shuffle){
      index = Math.floor(Math.random()*queue.length);
    } else {
      index++;
      if(index >= queue.length){
        if(repeat) index = 0; else { stop(); return; }
      }
    }
    progress = 0;
    playing = true;
    startPlayback();
    renderTrack();
    persist();
  }

  function prev(){
    if(!queue.length) return;
    progress < 5 ? index = (index-1+queue.length)%queue.length : progress = 0;
    playing = true; startPlayback(); renderTrack(); persist();
  }

  function stop(){ playing = false; if(audio){ audio.pause(); } clearInterval(timer); timer=null; renderTrack(); persist(); }
  function toggle(){ if(!queue.length){ loadDemo(); playIndex(0); return; } playing = !playing; if(playing) startPlayback(); else { if(usingAudio && audio){ audio.pause(); } clearInterval(timer);} renderTrack(); persist(); }

  function startPlayback(){
    clearInterval(timer);
    const t = queue[index];
    usingAudio = !!t.src;
    if(usingAudio){
      if(!audio){
        audio = new Audio();
        audio.preload = 'auto';
        audio.addEventListener('timeupdate', ()=> {
          if(!playing) return;
          progress = audio.currentTime;
          renderTrack();
        });
        audio.addEventListener('ended', ()=> { next(); });
        audio.addEventListener('loadedmetadata', ()=> { if(t.dur===0){ t.dur = Math.floor(audio.duration); renderTrack(); } });
      }
      if(audio.src !== t.src){
        audio.src = t.src;
      }
      audio.currentTime = 0;
      progress = 0;
      audio.play().catch(err=>{ console.warn('Audio play failed, fallback to timer', err); usingAudio=false; startTimerFallback(); });
    } else {
      // fallback timer based mock playback
      startTimerFallback();
    }
  }

  function startTimerFallback(){
    usingAudio = false;
    clearInterval(timer);
    timer = setInterval(()=>{
      if(!playing) return;
      const t = queue[index];
      progress += 1;
      const effectiveDur = t.dur || 0;
      if(effectiveDur && progress >= effectiveDur){ next(); return; }
      renderTrack();
    },1000);
  }

  playBtn.addEventListener('click', toggle);
  miniPlay.addEventListener('click', toggle);
  nextBtn.addEventListener('click', next);
  prevBtn.addEventListener('click', prev);
  clearBtn.addEventListener('click', ()=>{ queue=[]; index=-1; stop(); });
  shuffleBtn.addEventListener('click', ()=>{ shuffle=!shuffle; shuffleBtn.classList.toggle('mt-playlist-active', shuffle); });
  repeatBtn.addEventListener('click', ()=>{ repeat=!repeat; repeatBtn.classList.toggle('mt-playlist-active', repeat); });
  openPlaylistBtn.addEventListener('click', ()=>{ loadDemo(); playIndex(0); document.querySelector('[data-view="playlists"]').click(); });

  document.querySelector('.mt-progress').addEventListener('click', e => {
    if(index<0) return; const rect=e.currentTarget.getBoundingClientRect(); const pct=(e.clientX-rect.left)/rect.width; const t=queue[index];
    if(usingAudio && audio && audio.duration){
      audio.currentTime = audio.duration * pct;
      progress = audio.currentTime;
    } else {
      const dur = t.dur || 0;
      progress = Math.min(dur, Math.max(0, dur*pct));
    }
    renderTrack();
    persist();
  });

  // Persistence
  function persist(){
    try { localStorage.setItem('mt-state', JSON.stringify({ queue,index,progress,playing,shuffle,repeat })); } catch(e){}
  }
  function restore(){
    try { const raw=localStorage.getItem('mt-state'); if(!raw) return; const s=JSON.parse(raw); queue=s.queue||[]; index=s.index; progress=s.progress||0; playing=false; shuffle=!!s.shuffle; repeat=!!s.repeat; } catch(e){}
  }
  restore();
  renderTrack();

  // Easter egg: highlight download after idle
  let idleTimer = null; function poke(){ clearTimeout(idleTimer); idleTimer = setTimeout(()=>{ downloadCta.classList.add('is-pulse'); }, 12000); }
  ['mousemove','keydown','click','touchstart'].forEach(ev=> window.addEventListener(ev,poke)); poke();

  // ---------- Image Gallery (curated royalty-free stock set) ----------
  let galleryLoaded = false;
  const galleryEl = document.getElementById('mt-gallery');
  // Static curated list of 24 square-ish crops sourced from Unsplash (free to use under Unsplash License).
  // Each URL includes resizing params to keep payload small. If any image 404s Unsplash may redirect – fallback handler will mark failure.
  // NOTE: These are purely illustrative; replace with your own assets as desired.
  const galleryImages = [
    { id:1,  url:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvYSBpR3Im5kHRJ7u-eN8RhpuxUFT2PmJ9aQ&s', alt:'Mountain range sunrise mist' },
    { id:2,  url:'https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=600&h=600&q=80', alt:'Neon city street at night' },
    { id:3,  url:'https://images.unsplash.com/photo-1526894198609-10e03e37d33d?auto=format&fit=crop&w=600&h=600&q=80', alt:'Abstract architectural shadows' },
    { id:4,  url:'https://images.unsplash.com/photo-1517816527889-7cf1218b86fc?auto=format&fit=crop&w=600&h=600&q=80', alt:'Aerial forest canopy pattern' },
    { id:5,  url:'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=600&h=600&q=80', alt:'Desert dunes soft light' },
    { id:6,  url:'https://images.unsplash.com/photo-1499084732479-de2c02d45fcc?auto=format&fit=crop&w=600&h=600&q=80', alt:'Person with headphones listening to music' },
    { id:7,  url:'https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?auto=format&fit=crop&w=600&h=600&q=80', alt:'Vinyl record spinning close-up' },
    { id:8,  url:'https://images.unsplash.com/photo-1557089943-1b31a7cbd894?auto=format&fit=crop&w=600&h=600&q=80', alt:'Colorful stage concert lights' },
    { id:9,  url:'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=600&h=600&q=80', alt:'Synthesizer knobs and sliders' },
    { id:10, url:'https://images.unsplash.com/photo-1485579149621-3123dd979885?auto=format&fit=crop&w=600&h=600&q=80', alt:'Minimal workstation with laptop' },
    { id:11, url:'https://images.unsplash.com/photo-1494475673543-6a6a27143b22?auto=format&fit=crop&w=600&h=600&q=80', alt:'Cosmic nebula style abstract colors' },
    { id:12, url:'https://images.unsplash.com/photo-1482192596544-9eb780fc7f66?auto=format&fit=crop&w=600&h=600&q=80', alt:'Person coding in dark room' },
    { id:13, url:'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=600&h=600&q=80', alt:'Ocean wave motion freeze' },
    { id:14, url:'https://images.unsplash.com/photo-1439405326854-014607f694d7?auto=format&fit=crop&w=600&h=600&q=80', alt:'Starry night sky over trees' },
    { id:15, url:'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=600&h=600&q=80', alt:'Drone view winding mountain road' },
    { id:16, url:'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=600&h=600&q=80', alt:'Colorful abstract paint swirls' },
    { id:17, url:'https://images.unsplash.com/photo-1462331321792-cc44368b8894?auto=format&fit=crop&w=600&h=600&q=80', alt:'Headphones resting on desk' },
    { id:18, url:'https://images.unsplash.com/photo-1499415479124-43c32433a620?auto=format&fit=crop&w=600&h=600&q=80', alt:'DJ mixer board glowing' },
    { id:19, url:'https://images.unsplash.com/photo-1508824623134-ffa48bb1f57f?auto=format&fit=crop&w=600&h=600&q=80', alt:'Urban skyline hazy sunset' },
    { id:20, url:'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&h=600&q=80', alt:'Laser lights in foggy room' },
    { id:21, url:'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=600&h=600&q=80', alt:'Vibrant abstract ribbon pattern' },
    { id:22, url:'https://images.unsplash.com/photo-1504386106331-3e4e71712b38?auto=format&fit=crop&w=600&h=600&q=80', alt:'Geometric architecture lines' },
    { id:23, url:'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=600&h=600&q=80', alt:'Forest path with fog' },
    { id:24, url:'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=600&h=600&q=80', alt:'Galaxy core deep space' }
  ];

  function maybeLoadGallery(){
    if(galleryLoaded || !galleryEl) return;
    galleryEl.innerHTML = '';
    galleryImages.forEach(imgData => {
      const wrap = document.createElement('div');
      wrap.className = 'mt-gallery-item';
      const img = document.createElement('img');
      img.loading = 'lazy';
      img.decoding = 'async';
      img.alt = imgData.alt;
      img.src = imgData.url;
      img.addEventListener('error', ()=> {
        wrap.classList.add('mt-gallery-fail');
        wrap.textContent = 'Failed to load';
      });
      wrap.appendChild(img);
      galleryEl.appendChild(wrap);
    });
    galleryLoaded = true;
  }

  // Preload gallery quietly after a delay to feel snappy when user clicks
  setTimeout(()=>{ if(!galleryLoaded) maybeLoadGallery(); }, 8000);

  // Extra safety: attempt earlier eager load if something prevented nav click
  setTimeout(()=>{ if(!galleryLoaded) maybeLoadGallery(); }, 3000);

  // Load when gallery section actually becomes visible on scroll (if user scrolls instead of nav click)
  const gallerySection = document.getElementById('mt-section-gallery');
  if('IntersectionObserver' in window && gallerySection){
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if(en.isIntersecting){
          maybeLoadGallery();
          io.disconnect();
        }
      });
    }, { threshold: 0.1 });
    io.observe(gallerySection);
  }

})();
