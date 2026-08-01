(function(){
  "use strict";

  /* ──────────────────────────────────
     MUSIC
     ────────────────────────────────── */
  const audio = document.getElementById('bg-music');
  const musicBtn = document.getElementById('music-btn');
  const musicIcon = document.getElementById('music-icon');
  let musicPlaying = false;

  function setMusicUi(isPlaying){
    musicPlaying = isPlaying;
    musicIcon.textContent = isPlaying ? '⏸️' : '▶️';
    musicBtn.classList.toggle('playing', isPlaying);
  }

  function playMusic(){
    if(!audio) return;
    audio.volume = 0.35;
    audio.load();
    audio.play().then(()=>{
      setMusicUi(true);
    }).catch(()=>{
      setMusicUi(false);
    });
  }

  function toggleMusic(){
    if(musicPlaying){
      audio.pause();
      setMusicUi(false);
    } else {
      playMusic();
    }
  }

  musicBtn.addEventListener('click', toggleMusic);

  // try autoplay on page load
  playMusic();

  // keep trying after the first user interaction if autoplay was blocked
  document.addEventListener('click', function startOnInteraction(){
    if(!musicPlaying){ playMusic(); }
    document.removeEventListener('click', startOnInteraction);
  }, {once: true});

  /* ──────────────────────────────────
     BACKGROUND PARTICLES
     ────────────────────────────────── */
  const particleEmojis = ['💖','💕','💗','🌸','✨','💘','🌷','💫','🤍','💝'];
  const particlesContainer = document.getElementById('bgParticles');

  function createBgParticle(){
    const el = document.createElement('span');
    el.className = 'bg-particle';
    el.textContent = particleEmojis[Math.floor(Math.random()*particleEmojis.length)];
    el.style.left = Math.random()*100 + '%';
    el.style.fontSize = (14 + Math.random()*16) + 'px';
    const dur = 12 + Math.random()*18;
    el.style.animationDuration = dur + 's';
    el.style.animationDelay = Math.random()*8 + 's';
    particlesContainer.appendChild(el);
    setTimeout(()=> el.remove(), (dur+10)*1000);
  }

  // initial batch
  for(let i=0;i<18;i++) createBgParticle();
  setInterval(createBgParticle, 2200);

  /* ──────────────────────────────────
     ANNIVERSARY TIMER
     ────────────────────────────────── */
  const START = new Date('2022-08-30T00:00:00+03:30');

  const tDuration = document.getElementById('t-duration');

  function formatDurationParts(start, now){
    const totalSeconds = Math.max(0, Math.floor((now - start) / 1000));

    const years = Math.floor(totalSeconds / 31536000);
    const remainingAfterYears = totalSeconds % 31536000;

    const months = Math.floor(remainingAfterYears / 2592000);
    const remainingAfterMonths = remainingAfterYears % 2592000;

    const weeks = Math.floor(remainingAfterMonths / 604800);
    const remainingAfterWeeks = remainingAfterMonths % 604800;

    const days = Math.floor(remainingAfterWeeks / 86400);
    const remainingAfterDays = remainingAfterWeeks % 86400;

    const hours = Math.floor(remainingAfterDays / 3600);
    const remainingAfterHours = remainingAfterDays % 3600;

    const mins = Math.floor(remainingAfterHours / 60);
    const secs = remainingAfterHours % 60;

    return { years, months, weeks, days, hours, mins, secs };
  }

  function updateTimer(){
    const now = new Date();
    const parts = formatDurationParts(START, now);

    const toPersianDigits = value => String(value).replace(/[0-9]/g, d => ['۰','۱','۲','۳','۴','۵','۶','۷','۸','۹'][Number(d)]);

    const text = [
      `${toPersianDigits(parts.years)} سال`,
      `${toPersianDigits(parts.months)} ماه`,
      `${toPersianDigits(parts.weeks)} هفته`,
      `${toPersianDigits(parts.days)} روز`,
      `${toPersianDigits(parts.hours)} ساعت`,
      `${toPersianDigits(parts.mins)} دقیقه`,
      `${toPersianDigits(parts.secs)} ثانیه`
    ].join('، ');

    tDuration.textContent = text;
    tDuration.classList.remove('timer-pulse');
    void tDuration.offsetWidth;
    tDuration.classList.add('timer-pulse');
  }

  updateTimer();
  setInterval(updateTimer, 1000);

  /* ──────────────────────────────────
     HEART RAIN
     ────────────────────────────────── */
  const heartEmojis = ['💖','💕','💗','💘','❤️','🩷','🤍','💝','💓','💞'];

  window.spawnHearts = function(){
    const count = 50 + Math.floor(Math.random()*30);
    for(let i=0;i<count;i++){
      setTimeout(()=>{
        const el = document.createElement('span');
        el.className = 'floating-heart';
        el.textContent = heartEmojis[Math.floor(Math.random()*heartEmojis.length)];
        el.style.left = Math.random()*100 + 'vw';
        el.style.bottom = '-40px';
        el.style.fontSize = (18 + Math.random()*28) + 'px';
        const dur = 2.5 + Math.random()*3;
        el.style.setProperty('--dur', dur+'s');
        el.style.setProperty('--rot', (-30+Math.random()*60)+'deg');
        el.style.setProperty('--end-scale', (0.8+Math.random()*0.8).toFixed(2));
        document.body.appendChild(el);
        setTimeout(()=> el.remove(), dur*1000);
      }, i * 60);
    }
  };

  /* ──────────────────────────────────
     QUIZ — SHRINK NO / GROW YES
     ────────────────────────────────── */
  let noCount = 0;
  const yesBtn = document.getElementById('quizYes');
  const noBtn  = document.getElementById('quizNo');

  window.shrinkNo = function(){
    noCount++;
    // shrink & move the NO button
    const noScale = Math.max(0.15, 1 - noCount*0.12);
    const noOpacity = Math.max(0.2, 1 - noCount*0.1);
    noBtn.style.transform = `scale(${noScale}) translate(${(Math.random()-0.5)*80}px, ${(Math.random()-0.5)*40}px)`;
    noBtn.style.opacity = noOpacity;

    // grow the YES button
    const yesScale = 1 + noCount*0.15;
    yesBtn.style.transform = `scale(${yesScale})`;
    yesBtn.style.fontSize = (1.15 + noCount*0.12) + 'rem';
    yesBtn.style.padding = `${18+noCount*4}px ${52+noCount*8}px`;

    if(noCount >= 5){
      noBtn.style.pointerEvents = 'none';
      noBtn.style.display = 'none';
    }
  };

  /* ──────────────────────────────────
     FORGIVENESS — SUCCESS
     ────────────────────────────────── */
  window.forgiveYes = function(){
    // confetti burst
    spawnConfetti();
    spawnHearts();

    // show overlay
    setTimeout(()=>{
      document.getElementById('success-overlay').classList.add('show');
    }, 400);
  };

  function spawnConfetti(){
    const colors = ['#FFB3C6','#FF8FAB','#FFC2D1','#FF6B8A','#FFD6E7','#FF69B4','#FF1493','#FFFFFF'];
    for(let i=0;i<120;i++){
      setTimeout(()=>{
        const el = document.createElement('div');
        el.className = 'confetti-piece';
        el.style.left = Math.random()*100 + 'vw';
        el.style.top = '-20px';
        el.style.backgroundColor = colors[Math.floor(Math.random()*colors.length)];
        el.style.width = (6+Math.random()*10) + 'px';
        el.style.height = (6+Math.random()*10) + 'px';
        el.style.borderRadius = Math.random()>0.5 ? '50%' : '2px';
        const fallDur = 2.5 + Math.random()*3;
        el.style.setProperty('--fall-dur', fallDur+'s');
        el.style.setProperty('--spin', (360+Math.random()*720)+'deg');
        el.style.animationDelay = (Math.random()*0.8)+'s';
        document.body.appendChild(el);
        setTimeout(()=> el.remove(), (fallDur+2)*1000);
      }, i*25);
    }
  }

  /* ──────────────────────────────────
     TILT CARDS — DESKTOP + MOBILE
     ────────────────────────────────── */
  const isMobile = /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const tiltCards = document.querySelectorAll('.tilt-card');

  // ── Desktop: mousemove tilt + glare ──
  tiltCards.forEach(card => {
    const glare = card.querySelector('.tilt-glare');

    card.addEventListener('mousemove', e => {
      if(isMobile) return;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const percX = (x - cx) / cx;   // -1 to 1
      const percY = (y - cy) / cy;   // -1 to 1

      // tilt angles (max ~12deg)
      const rotateY = percX * 12;
      const rotateX = -percY * 12;

      card.classList.add('no-transition', 'tilting');
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.04)`;

      // move glare
      if(glare){
        const gx = (x / rect.width) * 100;
        const gy = (y / rect.height) * 100;
        glare.style.setProperty('--glare-x', gx + '%');
        glare.style.setProperty('--glare-y', gy + '%');
      }
    });

    card.addEventListener('mouseleave', () => {
      if(isMobile) return;
      card.classList.remove('no-transition', 'tilting');
      card.style.transform = '';
      if(glare) glare.style.opacity = '';
    });
  });

  // ── Mobile: gyroscope tilt ──
  function initGyro(){
    if(typeof DeviceOrientationEvent === 'undefined') return;

    // iOS 13+ requires permission
    if(typeof DeviceOrientationEvent.requestPermission === 'function'){
      // We'll request on first tap (iOS requires user gesture)
      document.addEventListener('click', function reqPerm(){
        DeviceOrientationEvent.requestPermission().then(state => {
          if(state === 'granted') bindGyro();
        }).catch(()=>{});
        document.removeEventListener('click', reqPerm);
      }, {once: true});
    } else {
      bindGyro();
    }
  }

  function bindGyro(){
    let ticking = false;
    window.addEventListener('deviceorientation', e => {
      if(ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const beta  = e.beta  || 0;   // front-back tilt (-180..180)
        const gamma = e.gamma || 0;   // left-right tilt (-90..90)

        // clamp to usable range
        const clampX = Math.max(-30, Math.min(30, gamma));
        const clampY = Math.max(-30, Math.min(30, beta - 45)); // offset for holding phone naturally

        const rotateY = (clampX / 30) * 12;  // max 12deg
        const rotateX = -(clampY / 30) * 12;

        tiltCards.forEach(card => {
          card.classList.add('tilting');
          card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
        });

        ticking = false;
      });
    }, {passive: true});
  }

  if(isMobile) initGyro();

  // ── Mobile fallback: tap to pop ──
  tiltCards.forEach(card => {
    card.addEventListener('click', () => {
      if(!isMobile) return;
      card.classList.remove('tap-animate');
      void card.offsetWidth; // reflow
      card.classList.add('tap-animate');
      setTimeout(() => card.classList.remove('tap-animate'), 550);
    });
  });

  /* ──────────────────────────────────
     SCROLL REVEAL
     ────────────────────────────────── */
  const reveals = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add('visible');
      }
    });
  },{threshold:0.15, rootMargin:'0px 0px -40px 0px'});
  reveals.forEach(el=> revealObserver.observe(el));

})();
