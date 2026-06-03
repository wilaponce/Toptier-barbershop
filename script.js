function el(id) { return document.getElementById(id); }

function linkItem(item) {
  const a = document.createElement('a');
  a.href = item.href || '#';
  a.textContent = item.label || 'Link';
  return a;
}

function buttonItem(item) {
  const a = document.createElement('a');
  a.href = item.href || '#';
  a.textContent = item.label || 'Learn more';
  a.className = 'btn ' + (item.class || 'primary');
  if ((item.href || '').startsWith('http')) {
    a.target = '_blank';
    a.rel = 'noopener';
  }
  return a;
}

function setupCarousel(images, autoplayMs) {
  const slidesWrap = el('heroSlides');
  const dotsWrap = el('heroDots');
  const prevBtn = el('heroPrev');
  const nextBtn = el('heroNext');
  if (!slidesWrap || !dotsWrap || !images || !images.length) return;

  slidesWrap.innerHTML = '';
  dotsWrap.innerHTML = '';

  images.forEach((src, i) => {
    const slide = document.createElement('div');
    slide.className = 'hero-slide' + (i === 0 ? ' active' : '');
    slide.style.backgroundImage = `url('${src}')`;
    slide.dataset.index = String(i);
    slidesWrap.appendChild(slide);

    const dot = document.createElement('button');
    dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
    dot.type = 'button';
    dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
    dot.dataset.index = String(i);
    dotsWrap.appendChild(dot);
  });

  let index = 0;
  const slides = () => [...slidesWrap.querySelectorAll('.hero-slide')];
  const dots = () => [...dotsWrap.querySelectorAll('.carousel-dot')];

  function show(i) {
    index = (i + images.length) % images.length;
    slides().forEach((s, idx) => s.classList.toggle('active', idx === index));
    dots().forEach((d, idx) => d.classList.toggle('active', idx === index));
  }

  prevBtn?.addEventListener('click', () => show(index - 1));
  nextBtn?.addEventListener('click', () => show(index + 1));
  dotsWrap.addEventListener('click', (e) => {
    const dot = e.target.closest('.carousel-dot');
    if (!dot) return;
    show(Number(dot.dataset.index));
  });

  if ((autoplayMs || 0) > 0 && images.length > 1) {
    let timer = setInterval(() => show(index + 1), autoplayMs);
    const carousel = el('heroCarousel');
    const stop = () => clearInterval(timer);
    const start = () => { timer = setInterval(() => show(index + 1), autoplayMs); };
    carousel?.addEventListener('mouseenter', stop);
    carousel?.addEventListener('mouseleave', start);
    carousel?.addEventListener('touchstart', stop, { passive: true });
    carousel?.addEventListener('touchend', start, { passive: true });
  }
}

function createProfileGallery(profile, cardId) {
  const media = document.createElement('div');
  media.className = 'profile-media';

  const main = document.createElement('img');
  main.className = 'profile-main-image';
  const sources = [profile.image, ...(profile.gallery || [])].filter(Boolean);
  const uniqueSources = [...new Set(sources)];
  main.src = uniqueSources[0] || '';
  main.alt = profile.name || 'Profile';
  media.appendChild(main);

  if (uniqueSources.length > 1) {
    const thumbs = document.createElement('div');
    thumbs.className = 'profile-thumbs';
    uniqueSources.forEach((src, idx) => {
      const thumb = document.createElement('img');
      thumb.className = 'profile-thumb' + (idx === 0 ? ' active' : '');
      thumb.src = src;
      thumb.alt = `${profile.name || 'Profile'} gallery ${idx + 1}`;
      thumb.addEventListener('click', () => {
        main.src = src;
        thumbs.querySelectorAll('.profile-thumb').forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');
      });
      thumbs.appendChild(thumb);
    });
    media.appendChild(thumbs);
  }
  return media;
}

function render() {
  const c = window.SITE_CONFIG || {};

  if (el('brandMark')) el('brandMark').textContent = c.branding?.mark || 'TT';
  if (el('brandName')) el('brandName').textContent = c.branding?.businessName || '';
  if (el('brandLocation')) el('brandLocation').textContent = c.branding?.locationShort || '';

  const desktopNav = el('desktopNav');
  const mobileMenu = el('mobileMenu');
  if (desktopNav) {
    desktopNav.innerHTML = '';
    (c.navigation || []).forEach(item => desktopNav.appendChild(linkItem(item)));
  }
  if (mobileMenu) {
    mobileMenu.innerHTML = '';
    (c.navigation || []).forEach(item => mobileMenu.appendChild(linkItem(item)));
  }

  if (el('heroEyebrow')) el('heroEyebrow').textContent = c.hero?.eyebrow || '';
  if (el('heroTitle')) el('heroTitle').textContent = c.hero?.title || '';
  if (el('heroDescription')) el('heroDescription').textContent = c.hero?.description || '';
  setupCarousel(c.hero?.images || [], c.hero?.autoplayMs || 0);

  if (el('profilesEyebrow')) el('profilesEyebrow').textContent = c.profilesSection?.eyebrow || '';
  if (el('profilesTitle')) el('profilesTitle').textContent = c.profilesSection?.title || '';
  if (el('profilesDescription')) el('profilesDescription').textContent = c.profilesSection?.description || '';
  const profilesGrid = el('profilesGrid');
  if (profilesGrid) {
    profilesGrid.innerHTML = '';
    (c.profiles || []).forEach((p, i) => {
      const card = document.createElement('article');
      card.className = 'card profile-card';
      card.appendChild(createProfileGallery(p, i));
      const right = document.createElement('div');
      right.className = 'stack';
      right.innerHTML = `
        <div class="eyebrow small">${p.role || ''}</div>
        <h3>${p.name || ''}</h3>
        <p class="section-copy">${p.bio || ''}</p>
        <ul class="bullet-list">${(p.notes || []).map(n => `<li>${n}</li>`).join('')}</ul>
        <div class="contact-items">${(p.details || []).map(d => `<div class="mini-box">${d}</div>`).join('')}</div>
      `;
      if (p.button) {
        const row = document.createElement('div');
        row.className = 'button-row';
        row.appendChild(buttonItem({ label: p.button.label, href: p.button.href, class: 'primary' }));
        right.appendChild(row);
      }
      card.appendChild(right);
      profilesGrid.appendChild(card);
    });
  }

  if (el('galleryEyebrow')) el('galleryEyebrow').textContent = c.gallerySection?.eyebrow || '';
  if (el('galleryTitle')) el('galleryTitle').textContent = c.gallerySection?.title || '';
  if (el('galleryDescription')) el('galleryDescription').textContent = c.gallerySection?.description || '';
  const galleryGrid = el('galleryGrid');
  if (galleryGrid) {
    galleryGrid.innerHTML = '';
    (c.gallery || []).forEach(src => {
      const box = document.createElement('div');
      box.className = 'card gallery-card';
      box.innerHTML = `<img src="${src}" alt="Shop photo">`;
      galleryGrid.appendChild(box);
    });
  }

  if (el('aboutEyebrow')) el('aboutEyebrow').textContent = c.about?.eyebrow || '';
  if (el('aboutTitle')) el('aboutTitle').textContent = c.about?.title || '';
  if (el('aboutDescription')) el('aboutDescription').textContent = c.about?.description || '';
  const aboutList = el('aboutList');
  if (aboutList) aboutList.innerHTML = (c.about?.list || []).map(v => `<li>${v}</li>`).join('');

  if (el('servicesEyebrow')) el('servicesEyebrow').textContent = c.servicesSection?.eyebrow || '';
  if (el('servicesTitle')) el('servicesTitle').textContent = c.servicesSection?.title || '';
  if (el('servicesDescription')) el('servicesDescription').textContent = c.servicesSection?.description || '';
  const servicesGrid = el('servicesGrid');
  if (servicesGrid) {
    servicesGrid.innerHTML = '';
    (c.services || []).forEach(s => {
      const box = document.createElement('div');
      box.className = 'card';
      box.innerHTML = `<h3>${s.name || ''}</h3><p class="section-copy">${s.description || ''}</p><strong>${s.price || ''}</strong>`;
      servicesGrid.appendChild(box);
    });
  }

  if (el('hoursEyebrow')) el('hoursEyebrow').textContent = c.hoursSection?.eyebrow || '';
  if (el('hoursTitle')) el('hoursTitle').textContent = c.hoursSection?.title || '';
  if (el('hoursDescription')) el('hoursDescription').textContent = c.hoursSection?.description || '';
  const hoursList = el('hoursList');
  if (hoursList) hoursList.innerHTML = (c.hours || []).map(h => `<li><strong>${h[0]}</strong><span>${h[1]}</span></li>`).join('');

  if (el('contactTitle')) el('contactTitle').textContent = c.contact?.title || '';
  if (el('contactDescription')) el('contactDescription').textContent = c.contact?.description || '';
  const contactItems = el('contactItems');
  if (contactItems) contactItems.innerHTML = (c.contact?.items || []).map(v => `<div class="mini-box">${v}</div>`).join('');
  const contactButtons = el('contactButtons');
  if (contactButtons) {
    contactButtons.innerHTML = '';
    (c.contact?.buttons || []).forEach(b => contactButtons.appendChild(buttonItem(b)));
  }

  if (el('footerBusinessName')) el('footerBusinessName').textContent = c.footer?.businessName || '';
  if (el('footerAddress')) el('footerAddress').textContent = c.footer?.address || '';
  if (el('year')) el('year').textContent = new Date().getFullYear();

  const menuToggle = el('menuToggle');
  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      const open = mobileMenu.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(open));
    });
    mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    }));
  }
}

window.addEventListener('DOMContentLoaded', render);