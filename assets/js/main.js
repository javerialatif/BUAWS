/* ============================================================
   BUAWS — Main JavaScript
   ============================================================ */

// ── NAV SCROLL EFFECT ──
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
});

// ── MOBILE NAV TOGGLE ──
const navToggle = document.getElementById('navToggle');
const navMobile = document.getElementById('navMobile');
navToggle.addEventListener('click', () => {
  navMobile.classList.toggle('open');
});
navMobile.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => navMobile.classList.remove('open'));
});

// ── FILTER SYSTEM ──
const filterBtns = document.querySelectorAll('.filter-btn');
const cards = document.querySelectorAll('.animal-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;
    cards.forEach(card => {
      if (filter === 'all') {
        card.classList.remove('hidden');
      } else {
        const type = card.dataset.type;
        const status = card.dataset.status;
        const match = type === filter || status === filter;
        card.classList.toggle('hidden', !match);
      }
    });
  });
});

// ── IMAGE SLIDERS ──
function initSliders() {
  document.querySelectorAll('.media-slider').forEach(slider => {
    const imgs = slider.querySelectorAll('img');
    if (imgs.length <= 1) return;

    const card = slider.closest('.card-media');
    const dotsContainer = card.querySelector('.mc-dots');
    const prevBtn = card.querySelector('.mc-prev');
    const nextBtn = card.querySelector('.mc-next');

    let current = 0;

    // Create dots
    imgs.forEach((_, i) => {
      const dot = document.createElement('div');
      dot.className = 'mc-dot' + (i === 0 ? ' active' : '');
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll('.mc-dot');

    function goTo(idx) {
      imgs[current].classList.remove('active');
      dots[current].classList.remove('active');
      current = (idx + imgs.length) % imgs.length;
      imgs[current].classList.add('active');
      dots[current].classList.add('active');
    }

    // Initialize
    imgs[0].classList.add('active');

    prevBtn && prevBtn.addEventListener('click', () => goTo(current - 1));
    nextBtn && nextBtn.addEventListener('click', () => goTo(current + 1));

    // Auto-advance
    setInterval(() => goTo(current + 1), 3500);
  });
}

initSliders();

// ── VIDEO THUMBNAILS: play on hover ──
document.querySelectorAll('.video-thumb').forEach(thumb => {
  const video = thumb.querySelector('video');
  const overlay = thumb.querySelector('.play-overlay');
  if (!video) return;

  thumb.addEventListener('mouseenter', () => { video.play(); });
  thumb.addEventListener('mouseleave', () => { video.pause(); video.currentTime = 0; });

  if (overlay) {
    overlay.addEventListener('click', (e) => {
      e.stopPropagation();
      if (video.paused) {
        video.play();
        overlay.style.opacity = '0';
      } else {
        video.pause();
        overlay.style.opacity = '1';
      }
    });
  }
});

// ── GALLERY MODAL ──
const galleryModal = document.getElementById('galleryModal');
const modalMedia = document.getElementById('modalMedia');
const modalThumbs = document.getElementById('modalThumbs');
const modalClose = document.getElementById('modalClose');
const modalBackdrop = document.getElementById('modalBackdrop');

let currentGalleryIndex = 0;
let galleryItems = [];

function openGallery(images, videos) {
  galleryItems = [];

  images.forEach(src => galleryItems.push({ type: 'image', src }));
  videos.forEach(src => galleryItems.push({ type: 'video', src }));

  if (galleryItems.length === 0) return;

  currentGalleryIndex = 0;
  renderGallery();
  galleryModal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function renderGallery() {
  // Main media
  modalMedia.innerHTML = '';
  const item = galleryItems[currentGalleryIndex];
  if (item.type === 'image') {
    const img = document.createElement('img');
    img.src = item.src;
    img.alt = 'Animal photo';
    modalMedia.appendChild(img);
  } else {
    const video = document.createElement('video');
    video.src = item.src;
    video.controls = true;
    video.autoplay = true;
    video.style.cssText = 'width:100%;height:100%;object-fit:contain;';
    modalMedia.appendChild(video);
  }

  // Thumbnails
  modalThumbs.innerHTML = '';
  galleryItems.forEach((it, i) => {
    const thumb = document.createElement('div');
    thumb.className = 'thumb' + (i === currentGalleryIndex ? ' active' : '');
    thumb.addEventListener('click', () => {
      currentGalleryIndex = i;
      renderGallery();
    });

    if (it.type === 'image') {
      const img = document.createElement('img');
      img.src = it.src;
      img.alt = '';
      thumb.appendChild(img);
    } else {
      const video = document.createElement('video');
      video.src = it.src;
      video.muted = true;
      video.style.cssText = 'width:100%;height:100%;object-fit:cover;';
      thumb.appendChild(video);

      // Play icon overlay on thumb
      const icon = document.createElement('div');
      icon.style.cssText = 'position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:1.2rem;color:white;background:rgba(0,0,0,0.3);border-radius:6px;';
      icon.textContent = '▶';
      thumb.style.position = 'relative';
      thumb.appendChild(icon);
    }

    modalThumbs.appendChild(thumb);
  });
}

function closeGallery() {
  galleryModal.classList.remove('open');
  document.body.style.overflow = '';
  modalMedia.innerHTML = '';
  modalThumbs.innerHTML = '';
}

document.querySelectorAll('.gallery-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    let images = [], videos = [];
    try { images = JSON.parse(btn.dataset.images || '[]'); } catch(e) {}
    try { videos = JSON.parse(btn.dataset.videos || '[]'); } catch(e) {}
    openGallery(images, videos);
  });
});

modalClose.addEventListener('click', closeGallery);
modalBackdrop.addEventListener('click', closeGallery);

// Keyboard navigation
document.addEventListener('keydown', (e) => {
  if (!galleryModal.classList.contains('open')) return;
  if (e.key === 'Escape') closeGallery();
  if (e.key === 'ArrowRight') {
    currentGalleryIndex = (currentGalleryIndex + 1) % galleryItems.length;
    renderGallery();
  }
  if (e.key === 'ArrowLeft') {
    currentGalleryIndex = (currentGalleryIndex - 1 + galleryItems.length) % galleryItems.length;
    renderGallery();
  }
});

// ── ADOPT MODAL ──
const adoptModal = document.getElementById('adoptModal');
const adoptClose = document.getElementById('adoptClose');
const adoptBackdrop = document.getElementById('adoptBackdrop');
const adoptModalTitle = document.getElementById('adoptModalTitle');
const adoptFormLink = document.getElementById('adoptFormLink');
const animalSelect = document.getElementById('animal');

document.querySelectorAll('.adopt-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const name = btn.dataset.name || 'this animal';
    adoptModalTitle.textContent = `Adopt ${name}`;

    // Pre-select the animal in the form if possible
    if (animalSelect) {
      const opts = Array.from(animalSelect.options);
      const match = opts.find(o => o.text.toLowerCase().includes(name.toLowerCase().split(' ')[0]));
      if (match) animalSelect.value = match.value;
    }

    adoptModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
});

function closeAdoptModal() {
  adoptModal.classList.remove('open');
  document.body.style.overflow = '';
}

adoptClose.addEventListener('click', closeAdoptModal);
adoptBackdrop.addEventListener('click', closeAdoptModal);

adoptFormLink.addEventListener('click', () => {
  closeAdoptModal();
});

// ── CONTACT FORM ──
const contactForm = document.getElementById('contactForm');
const toast = document.getElementById('toast');

contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const btn = contactForm.querySelector('button[type="submit"]');
  btn.textContent = 'Sending...';
  btn.disabled = true;

  try {
    const data = new FormData(contactForm);
    const res = await fetch(contactForm.action, {
      method: 'POST',
      body: data,
      headers: { 'Accept': 'application/json' }
    });

    if (res.ok) {
      contactForm.reset();
      showToast();
    } else {
      const json = await res.json();
      const msg = json?.errors?.map(e => e.message).join(', ') || 'Submission failed.';
      alert('Error: ' + msg + '\n\nPlease try again or contact us directly.');
    }
  } catch (err) {
    alert('Network error. Please check your connection and try again.');
  }

  btn.textContent = 'Send Adoption Request';
  btn.disabled = false;
});

function showToast() {
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 4000);
}

// ── SCROLL ANIMATIONS ──
const fadeEls = document.querySelectorAll('.animal-card, .about-grid, .contact-inner, .filter-section .container');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

fadeEls.forEach((el, i) => {
  el.classList.add('fade-in-up');
  el.style.transitionDelay = `${(i % 3) * 0.07}s`;
  observer.observe(el);
});

// ── SMOOTH SCROLL for anchor links ──
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ── GALLERY SECTION FILTER ──
const gfiltBtns = document.querySelectorAll('.gfilt-btn');
const gItems = document.querySelectorAll('.gitem');

gfiltBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    gfiltBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.dataset.gfilter;
    gItems.forEach(item => {
      const type  = item.dataset.type;
      const media = item.dataset.media;
      let show = false;
      if (f === 'all')    show = true;
      if (f === 'photos') show = media === 'photo';
      if (f === 'videos') show = media === 'video';
      if (f === 'cat')    show = type  === 'cat';
      if (f === 'dog')    show = type  === 'dog';
      item.classList.toggle('g-hidden', !show);
    });
  });
});

// ── GALLERY ITEM: hover plays video ──
document.querySelectorAll('.gitem video').forEach(vid => {
  const item = vid.closest('.gitem');
  item.addEventListener('mouseenter', () => vid.play());
  item.addEventListener('mouseleave', () => { vid.pause(); vid.currentTime = 0; });
});

// ── GALLERY ITEM: view button opens existing gallery modal ──
document.querySelectorAll('.gitem-view').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const src  = btn.dataset.src;
    const kind = btn.dataset.kind;
    const imgs  = kind === 'photo' ? [src] : [];
    const vids  = kind === 'video' ? [src] : [];
    openGallery(imgs, vids);
  });
});
