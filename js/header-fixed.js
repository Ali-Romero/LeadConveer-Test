function initFixedHeader() {
  const header = document.querySelector('[data-header]');
  const placeholder = document.querySelector('[data-header-trigger]');
  if (!header || !placeholder) return;

  const headerHeight = header.offsetHeight;
  const trigger = placeholder.offsetTop;

  window.addEventListener('scroll', () => {
    const isFixed = window.scrollY >= trigger;

    header.classList.toggle('fixed', isFixed);
    placeholder.classList.toggle('active', isFixed);
  });
}

$(function () {
  initFixedHeader();
});
