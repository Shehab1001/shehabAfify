(() => {
  const root = document.documentElement;
  const header = document.querySelector('.site-header');
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav-links');
  const navLinks = [...document.querySelectorAll('.nav-links a')];
  const themeButton = document.querySelector('.theme-toggle');

  const storedTheme = localStorage.getItem('portfolio-theme');
  if (storedTheme === 'light' || storedTheme === 'dark') {
    root.dataset.theme = storedTheme;
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
    root.dataset.theme = 'light';
  }

  themeButton?.addEventListener('click', () => {
    const next = root.dataset.theme === 'light' ? 'dark' : 'light';
    root.dataset.theme = next;
    localStorage.setItem('portfolio-theme', next);
  });

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

  const onScroll = () => {
    header?.classList.toggle('scrolled', window.scrollY > 24);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  document.querySelectorAll('.project-card, .stack-card, .branch-item').forEach((el, index) => {
    el.style.transitionDelay = `${(index % 4) * 90}ms`;
  });


  const projectCarousel = document.getElementById('projectCarousel');
  const projectPrev = document.querySelector('.carousel-prev');
  const projectNext = document.querySelector('.carousel-next');
  const projectPosition = document.getElementById('projectPosition');

  if (projectCarousel && projectPrev && projectNext) {
    const cards = [...projectCarousel.querySelectorAll('.project-card')];

    const stepSize = () => {
      const first = cards[0];
      if (!first) return projectCarousel.clientWidth;
      const gap = parseFloat(getComputedStyle(projectCarousel).gap) || 0;
      return first.getBoundingClientRect().width + gap;
    };

    const updateProjectControls = () => {
      const maxScroll = projectCarousel.scrollWidth - projectCarousel.clientWidth;
      projectPrev.disabled = projectCarousel.scrollLeft <= 4;
      projectNext.disabled = projectCarousel.scrollLeft >= maxScroll - 4;

      if (projectPosition) {
        const index = Math.round(projectCarousel.scrollLeft / Math.max(stepSize(), 1));
        projectPosition.textContent = String(Math.min(cards.length, index + 1));
      }
    };

    projectPrev.addEventListener('click', () => {
      projectCarousel.scrollBy({ left: -stepSize(), behavior: 'smooth' });
    });

    projectNext.addEventListener('click', () => {
      projectCarousel.scrollBy({ left: stepSize(), behavior: 'smooth' });
    });

    projectCarousel.addEventListener('keydown', event => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        projectCarousel.scrollBy({ left: -stepSize(), behavior: 'smooth' });
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        projectCarousel.scrollBy({ left: stepSize(), behavior: 'smooth' });
      }
    });

    projectCarousel.addEventListener('scroll', updateProjectControls, { passive: true });
    window.addEventListener('resize', updateProjectControls);
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

  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeMenu();
  });
})();