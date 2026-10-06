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