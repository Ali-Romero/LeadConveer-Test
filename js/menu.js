let isModalOpen = false;
let savedScrollY = 0;

function initStartMenu() {
  const burger = document.querySelector('[data-burger]');
  const menu = document.querySelector('[data-menu]');
  const closeBtn = document.querySelector('[data-close-menu]');

  if (!burger || !menu || !closeBtn) return;

  let isActive = false;
  let isMenuOpen = false;

  function setup() {
    if (isActive || window.innerWidth >= 1024) return;

    Object.assign(menu.style, {
      display: 'none',
      opacity: 0,
      transform: 'translateX(100%)'
    });

    const openMenu = () => {
      savedScrollY = window.scrollY;
      isMenuOpen = true;
      document.body.classList.add('lock-scroll');
      menu.style.display = 'block';

      anime({
        targets: menu,
        translateX: ['100%', '0%'],
        opacity: [0, 1],
        duration: 500,
        easing: 'easeOutExpo'
      });
    };

    const closeMenu = () => {
      if (!isMenuOpen) return;

      isMenuOpen = false;
      document.body.classList.remove('lock-scroll');

      anime({
        targets: menu,
        translateX: ['0%', '100%'],
        opacity: [1, 0],
        duration: 300,
        easing: 'easeInBack',
        complete: () => {
          menu.style.display = 'none';
          window.scrollTo(0, savedScrollY);
        }
      });
    };

    burger.addEventListener('click', openMenu);
    closeBtn.addEventListener('click', closeMenu);

    menu.addEventListener('click', e => {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;
      closeMenu();
    });

    isActive = true;
  }

  function cleanup() {
    if (!isActive) return;

    isActive = false;
    isMenuOpen = false;
    document.body.classList.remove('lock-scroll');

    Object.assign(menu.style, {
      display: '',
      opacity: '',
      transform: ''
    });
  }

  function onResize() {
    if (window.innerWidth < 1024) setup();
    else cleanup();
  }

  onResize();
  window.addEventListener('resize', onResize);
}

function initGlobalSmoothScroll() {
  document.addEventListener('click', e => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;

    const id = link.getAttribute('href').slice(1);
    if (!id) return;

    const target = document.getElementById(id);
    if (!target) return;

    e.preventDefault();

    const header = document.querySelector('.header');
    const headerHeight = header ? header.offsetHeight : 0;

    anime({
      targets: document.scrollingElement || document.documentElement,
      scrollTop: target.offsetTop - headerHeight,
      duration: 800,
      easing: 'easeInOutQuad'
    });
  });
}

function initActiveMenuHighlight() {
  const sections = document.querySelectorAll('section[id]');
  const menuLinks = document.querySelectorAll('.menu-link');

  const highlightMenu = () => {
    if (isModalOpen) return;

    const scrollPos = window.scrollY;
    const header = document.querySelector('.header');
    const headerHeight = header ? header.offsetHeight : 0;

    let currentId = null;

    sections.forEach(section => {
      const top = section.offsetTop - headerHeight - 20;
      const bottom = top + section.offsetHeight;

      if (scrollPos >= top && scrollPos < bottom) {
        currentId = section.id;
      }
    });

    if (!currentId) return;

    menuLinks.forEach(link => {
      const href = link.getAttribute('href');
      link.classList.toggle('active', href && href.slice(1) === currentId);
    });
  };

  highlightMenu();
  window.addEventListener('scroll', highlightMenu);
  window.addEventListener('load', highlightMenu);
}

$(function () {
  $(document).on('opening', '.remodal', function () {
    isModalOpen = true;
  });

  $(document).on('closed', '.remodal', function () {
    setTimeout(() => {
      isModalOpen = false;
    }, 300);
  });

  initStartMenu();
  initGlobalSmoothScroll();
  initActiveMenuHighlight();
});
