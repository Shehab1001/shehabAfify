(() => {
  const root = document.documentElement;
  const header = document.querySelector('.site-header');
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav-links');
  const navLinks = [...document.querySelectorAll('.nav-links a')];
  const themeButton = document.querySelector('.theme-toggle');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));

  const storedTheme = localStorage.getItem('portfolio-theme');
  if (storedTheme === 'light' || storedTheme === 'dark') {
    root.dataset.theme = storedTheme;
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
    root.dataset.theme = 'light';
  }

  const themeMeta = document.querySelector('meta[name="theme-color"]');

  const syncThemeUi = () => {
    const isLight = root.dataset.theme === 'light';
    themeButton?.setAttribute('aria-label', isLight ? 'Switch to dark mode' : 'Switch to light mode');
    if (themeMeta) themeMeta.setAttribute('content', isLight ? '#f1f0ec' : '#101112');
  };

  const commitTheme = next => {
    root.dataset.theme = next;
    localStorage.setItem('portfolio-theme', next);
    syncThemeUi();
  };

  themeButton?.addEventListener('click', event => {
    const next = root.dataset.theme === 'light' ? 'dark' : 'light';
    const rect = themeButton.getBoundingClientRect();
    const x = event.clientX || rect.left + rect.width / 2;
    const y = event.clientY || rect.top + rect.height / 2;
    const radius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    root.style.setProperty('--theme-x', `${x}px`);
    root.style.setProperty('--theme-y', `${y}px`);
    root.style.setProperty('--theme-radius', `${radius}px`);

    themeButton.classList.remove('theme-pulse');
    void themeButton.offsetWidth;
    themeButton.classList.add('theme-pulse');

    if (!reducedMotion && document.startViewTransition) {
      const transition = document.startViewTransition(() => commitTheme(next));
      transition.finished.finally(() => themeButton.classList.remove('theme-pulse'));
    } else {
      root.classList.add('theme-fallback');
      commitTheme(next);
      window.setTimeout(() => {
        root.classList.remove('theme-fallback');
        themeButton.classList.remove('theme-pulse');
      }, reducedMotion ? 0 : 460);
    }
  });

  syncThemeUi();

  const closeMenu = () => {
    nav?.classList.remove('open');
    menuButton?.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
  };

  menuButton?.addEventListener('click', () => {
    const expanded = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!expanded));
    nav?.classList.toggle('open', !expanded);
    document.body.classList.toggle('menu-open', !expanded);
  });

  navLinks.forEach(link => link.addEventListener('click', closeMenu));

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -5% 0px' });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  document.querySelectorAll('.project-card, .stack-card, .branch-item').forEach((el, index) => {
    el.style.transitionDelay = `${(index % 4) * 70}ms`;
  });

  const projectCarousel = document.getElementById('projectCarousel');
  const projectPrev = document.querySelector('.carousel-prev');
  const projectNext = document.querySelector('.carousel-next');
  const projectPosition = document.getElementById('projectPosition');
  let carouselCards = [];

  const stepSize = () => {
    const first = carouselCards[0];
    if (!first || !projectCarousel) return projectCarousel?.clientWidth || 0;
    const gap = parseFloat(getComputedStyle(projectCarousel).gap) || 0;
    return first.getBoundingClientRect().width + gap;
  };

  const updateCarouselDepth = () => {
    if (!projectCarousel || reducedMotion) return;
    const viewport = projectCarousel.getBoundingClientRect();
    const viewportCenter = viewport.left + viewport.width / 2;
    const maxDistance = Math.max(viewport.width * .58, 1);

    carouselCards.forEach(card => {
      const rect = card.getBoundingClientRect();
      const cardCenter = rect.left + rect.width / 2;
      const distance = Math.abs(cardCenter - viewportCenter);
      const focus = 1 - clamp(distance / maxDistance);
      card.style.setProperty('--carousel-focus', focus.toFixed(3));
    });
  };

  const updateProjectControls = () => {
    if (!projectCarousel || !projectPrev || !projectNext) return;
    const maxScroll = projectCarousel.scrollWidth - projectCarousel.clientWidth;
    projectPrev.disabled = projectCarousel.scrollLeft <= 4;
    projectNext.disabled = projectCarousel.scrollLeft >= maxScroll - 4;

    if (projectPosition) {
      const index = Math.round(projectCarousel.scrollLeft / Math.max(stepSize(), 1));
      projectPosition.textContent = String(Math.min(carouselCards.length, index + 1));
    }
    updateCarouselDepth();
  };

  if (projectCarousel && projectPrev && projectNext) {
    carouselCards = [...projectCarousel.querySelectorAll('.project-card')];

    let carouselDragging = false;
    let dragPointerId = null;
    let dragStartX = 0;
    let dragStartScrollLeft = 0;
    let dragMoved = false;
    let dragVelocity = 0;
    let lastDragX = 0;
    let lastDragTime = 0;

    const settleCarousel = () => {
      const step = Math.max(stepSize(), 1);
      const projected = projectCarousel.scrollLeft + dragVelocity * 120;
      const targetIndex = Math.round(projected / step);
      const maxIndex = Math.max(0, carouselCards.length - 1);
      const clampedIndex = Math.min(maxIndex, Math.max(0, targetIndex));

      projectCarousel.classList.remove('is-dragging');
      projectCarousel.classList.add('is-settling');
      projectCarousel.scrollTo({
        left: clampedIndex * step,
        behavior: reducedMotion ? 'auto' : 'smooth'
      });

      window.setTimeout(() => {
        projectCarousel.classList.remove('is-settling');
        updateProjectControls();
      }, reducedMotion ? 0 : 420);
    };

    projectCarousel.addEventListener('pointerdown', event => {
      if (event.pointerType === 'mouse' && event.button !== 0) return;
      if (event.target.closest('a, button')) return;

      carouselDragging = true;
      dragMoved = false;
      dragPointerId = event.pointerId;
      dragStartX = event.clientX;
      lastDragX = event.clientX;
      lastDragTime = performance.now();
      dragStartScrollLeft = projectCarousel.scrollLeft;
      dragVelocity = 0;

      projectCarousel.classList.add('is-dragging');
      projectCarousel.setPointerCapture?.(event.pointerId);
    });

    projectCarousel.addEventListener('pointermove', event => {
      if (!carouselDragging || event.pointerId !== dragPointerId) return;

      const deltaX = event.clientX - dragStartX;
      if (Math.abs(deltaX) > 5) dragMoved = true;

      const now = performance.now();
      const dt = Math.max(now - lastDragTime, 1);
      dragVelocity = (lastDragX - event.clientX) / dt;
      lastDragX = event.clientX;
      lastDragTime = now;

      projectCarousel.scrollLeft = dragStartScrollLeft - deltaX;
      updateCarouselDepth();
    });

    const endCarouselDrag = event => {
      if (!carouselDragging || event.pointerId !== dragPointerId) return;

      carouselDragging = false;
      projectCarousel.releasePointerCapture?.(event.pointerId);
      dragPointerId = null;

      if (dragMoved) {
        projectCarousel.dataset.justDragged = 'true';
        window.setTimeout(() => delete projectCarousel.dataset.justDragged, 120);
      }

      settleCarousel();
    };

    projectCarousel.addEventListener('pointerup', endCarouselDrag);
    projectCarousel.addEventListener('pointercancel', endCarouselDrag);
    projectCarousel.addEventListener('lostpointercapture', event => {
      if (carouselDragging && event.pointerId === dragPointerId) {
        carouselDragging = false;
        dragPointerId = null;
        settleCarousel();
      }
    });

    projectCarousel.addEventListener('click', event => {
      if (projectCarousel.dataset.justDragged === 'true') {
        event.preventDefault();
        event.stopPropagation();
      }
    }, true);

    projectPrev.addEventListener('click', () => {
      projectCarousel.scrollBy({ left: -stepSize(), behavior: reducedMotion ? 'auto' : 'smooth' });
    });
    projectNext.addEventListener('click', () => {
      projectCarousel.scrollBy({ left: stepSize(), behavior: reducedMotion ? 'auto' : 'smooth' });
    });

    projectCarousel.addEventListener('keydown', event => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        projectCarousel.scrollBy({ left: -stepSize(), behavior: reducedMotion ? 'auto' : 'smooth' });
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        projectCarousel.scrollBy({ left: stepSize(), behavior: reducedMotion ? 'auto' : 'smooth' });
      }
    });

    projectCarousel.addEventListener('scroll', updateProjectControls, { passive: true });
    updateProjectControls();
  }

  const sections = [...document.querySelectorAll('main section[id]')];
  const activeObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id);
      });
    });
  }, { rootMargin: '-35% 0px -55% 0px', threshold: 0 });
  sections.forEach(section => activeObserver.observe(section));

  const hero = document.querySelector('.hero');
  const heroVisual = document.querySelector('[data-scroll-parallax]');
  const featuredProject = document.querySelector('.featured-project');
  const featuredMedia = document.querySelector('[data-scroll-media]');
  const branchTimeline = document.querySelector('.branch-timeline');
  const ambientOne = document.querySelector('.ambient-one');
  const ambientTwo = document.querySelector('.ambient-two');
  let ticking = false;

  const updateMotion = () => {
    ticking = false;
    const scrollY = window.scrollY;
    const maxPageScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
    root.style.setProperty('--page-progress', (scrollY / maxPageScroll).toFixed(4));
    header?.classList.toggle('scrolled', scrollY > 24);

    if (!reducedMotion) {
      if (hero && heroVisual) {
        const heroRect = hero.getBoundingClientRect();
        const heroTravel = clamp(-heroRect.top / Math.max(hero.offsetHeight, 1), 0, 1);
        heroVisual.style.setProperty('--hero-parallax', `${(heroTravel * 54).toFixed(1)}px`);
        heroVisual.style.setProperty('--hero-scale', (1 - heroTravel * .035).toFixed(4));
      }

      if (featuredProject && featuredMedia) {
        const rect = featuredProject.getBoundingClientRect();
        const progress = clamp((window.innerHeight - rect.top) / (window.innerHeight + rect.height));
        const centred = (progress - .5) * 2;
        featuredMedia.style.setProperty('--media-y', `${(-centred * 28).toFixed(1)}px`);
        featuredMedia.style.setProperty('--media-rotate', `${(centred * 1.15).toFixed(2)}deg`);
        featuredMedia.style.setProperty('--media-scale', (0.975 + progress * .028).toFixed(4));
      }

      if (branchTimeline) {
        const rect = branchTimeline.getBoundingClientRect();
        const progress = clamp((window.innerHeight * .7 - rect.top) / Math.max(rect.height, 1));
        branchTimeline.style.setProperty('--timeline-progress', progress.toFixed(4));
      }

      if (ambientOne) ambientOne.style.setProperty('--ambient-y', `${(scrollY * .035).toFixed(1)}px`);
      if (ambientTwo) ambientTwo.style.setProperty('--ambient-y', `${(-scrollY * .022).toFixed(1)}px`);

      updateCarouselDepth();
    } else if (branchTimeline) {
      branchTimeline.style.setProperty('--timeline-progress', '1');
    }
  };

  const requestMotionFrame = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(updateMotion);
  };

  window.addEventListener('scroll', requestMotionFrame, { passive: true });
  window.addEventListener('resize', () => {
    updateProjectControls();
    requestMotionFrame();
  });

  const backToTop = document.getElementById('backToTop');
  backToTop?.addEventListener('click', event => {
    event.preventDefault();
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: reducedMotion ? 'auto' : 'smooth'
    });
    history.replaceState(null, '', window.location.pathname + window.location.search);
  });

  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeMenu();
  });

  requestAnimationFrame(() => {
    document.body.classList.add('motion-ready');
    updateMotion();
  });
})();