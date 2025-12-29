let swiperInstances = {};

function initSwiper(selector, paginationSelector, paginationType, breakpoints, additionalOptions = {}, effect = 'coverflow') {
  if (!document.querySelector(selector)) {
    console.error(`Element with selector "${selector}" not found.`);
    return;
  }

  if (!document.querySelector(paginationSelector)) {
    console.error(`Pagination element with selector "${paginationSelector}" not found.`);
    return;
  }

  if (!swiperInstances[selector]) {
    const effectOptions = {
      coverflow: {
        rotate: 40,
        stretch: 10,
        depth: 360,
        scale: 0.7,
        modifier: 1,
        slideShadows: false,
      },
      slide: {},
      fade: { crossFade: true },
      flip: { slideShadows: true, limitRotation: true },
    };

    const baseConfig = {
      speed: 450,
      effect: effect,
      rewind: true,
      clickable: true,
      updateOnWindowResize: true,
      pagination: {
        el: paginationSelector,
        type: paginationType,
        clickable: paginationType === 'bullets',
      },
      breakpoints: breakpoints,
      allowTouchMove: true,
      ...effectOptions[effect],
      ...additionalOptions,
    };

    swiperInstances[selector] = new Swiper(selector, baseConfig);
  }
}

const commonBreakpoints1 = {
  200: {
    slideToClickedSlide: true,
    coverflowEffect: {
      rotate: 40,
      stretch: 10,
      depth: 360,
      scale: 0.7,
      modifier: 1,
      slideShadows: false,
    },
    allowTouchMove: true,
  },
  768: {
    slideToClickedSlide: false,
    coverflowEffect: {
      rotate: 0,
      stretch: 0,
      depth: 0,
      modifier: 0,
      slideShadows: false,
    },
    allowTouchMove: false,
  },
};

function updateAllSwipers() {
  Object.keys(swiperInstances).forEach(selector => {
    const instance = swiperInstances[selector];
    if (instance && instance.el && instance.el.querySelectorAll) {
      instance.update();
    } else {
      console.warn(`Swiper instance for selector "${selector}" is not valid.`);
    }
  });
}

window.addEventListener('resize', () => {
  updateAllSwipers();
});

$(function () {
  initSwiper('.swiper-main', '.main-pagination', 'bullets', commonBreakpoints1)
});
