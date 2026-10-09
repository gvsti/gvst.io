/* Scroll reveal */
const initPortfolio = () => {
  const revealElements = document.querySelectorAll('.reveal');

  if (revealElements.length) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });

    revealElements.forEach((element) => revealObserver.observe(element));
  }

  /* Project viewer */
  const modal = document.getElementById('projectModal');
  const closeModalButton = document.getElementById('closeModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalGallery = document.getElementById('modalGallery');
  const galleryCount = document.getElementById('galleryCount');
  const modalType = document.getElementById('modalType');
  const modalYear = document.getElementById('modalYear');
  const modalDescription = document.getElementById('modalDescription');
  const modalCounter = document.getElementById('modalCounter');

  const projects = [...document.querySelectorAll('.project')];

  if (!projects.length) {
    console.info('No project cards found on the page.');
  }

  function normalizeImageUrl(source) {
    if (!source) return '';

    const trimmed = source.trim();
    if (!trimmed) return '';

    if (trimmed.includes('github.com/') && trimmed.includes('/blob/')) {
      return trimmed
        .replace('https://github.com/', 'https://raw.githubusercontent.com/')
        .replace('/blob/', '/');
    }

    return trimmed;
  }

  function openProject(project, index) {
    if (!modal || !modalTitle || !modalGallery || !galleryCount || !modalType || !modalYear || !modalDescription || !modalCounter) {
      return;
    }

    modalTitle.textContent = project.dataset.title || 'Project';
    modalType.textContent = project.dataset.type || 'Project Type';
    modalYear.textContent = project.dataset.year || 'Year';
    modalDescription.textContent = project.dataset.description || '';
    modalCounter.textContent = `${String(index + 1).padStart(2, '0')} / ${String(projects.length).padStart(2, '0')}`;

    const images = (project.dataset.images || '')
      .split('|')
      .map(normalizeImageUrl)
      .filter(Boolean);

    modalGallery.innerHTML = '';

    if (!images.length) {
      galleryCount.textContent = '0 views / renderings';
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('modal-open');
      return;
    }

    images.forEach((src, imageIndex) => {
      const img = document.createElement('img');
      img.src = src;
      img.alt = `${project.dataset.title || 'Project'} — View ${imageIndex + 1}`;
      img.loading = imageIndex === 0 ? 'eager' : 'lazy';
      img.decoding = 'async';
      modalGallery.appendChild(img);
    });

    galleryCount.textContent = `${images.length} ${images.length === 1 ? 'view' : 'views'} / renderings`;

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
  }

  projects.forEach((project, index) => {
    project.addEventListener('click', () => openProject(project, index));
  });

  function closeProject() {
    if (!modal) return;

    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
  }

  if (closeModalButton) {
    closeModalButton.addEventListener('click', closeProject);
  }

  if (modal) {
    modal.addEventListener('click', (event) => {
      if (event.target === modal) closeProject();
    });
  }

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal && modal.classList.contains('open')) {
      closeProject();
    }
  });

  /* Smooth anchor handling */
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    const targetId = link.getAttribute('href');
    if (!targetId || targetId === '#') return;

    const target = document.querySelector(targetId);
    if (!target) return;

    link.addEventListener('click', (event) => {
      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPortfolio);
} else {
  initPortfolio();
}
