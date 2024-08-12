'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const buttonScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');


const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

const nav = document.querySelector('.nav');

// Modal

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach((btn) => {
  btn.addEventListener('click', openModal)
})

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();

  }
});


// Smooth Scrolling


buttonScrollTo.addEventListener('click', (e) => {
  section1.scrollIntoView({ behavior: 'smooth' })
});


// Page Navigation


document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();


  // Matching strategy
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    const targetSection = document.querySelector(id);
    targetSection.scrollIntoView({ behavior: 'smooth' });
  };

});



// Tabbed Component


tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');

  // Guard clause
  if (!clicked) return;

  // Remove active Classes for Tabs and Contents
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));


  // Activate Tab
  clicked.classList.add('operations__tab--active');


  // Activate content area
  document.querySelector(`.operations__content--${clicked.dataset.tab}`).classList.add('operations__content--active');


})

// Menu  fade animation


const handleHover = function (e) {

  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img')

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
}

nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));


// Sticky Navigation

const stickyNav = function (enteries) {
  const [entry] = enteries;

  if (!entry.isIntersecting) {
    nav.classList.add('sticky')
  } else {
    nav.classList.remove('sticky')

  }
}


const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;
const headerObserver = new IntersectionObserver(
  stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`
}

);
headerObserver.observe(header)



// Section effects -- Reveal section
const allSections = document.querySelectorAll('.section');

const revealSection = function (enteries, observer) {
  const [entry] = enteries;
  // console.log(entry);

  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');

  observer.unobserve(entry.target);
}

const sectionObserver = new IntersectionObserver
  (revealSection, {
    root: null,
    threshold: 0.15,
  });

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});


// Lazy Loading Images

const imgTargets = document.querySelectorAll('img[data-src]');

const loadImg = function (enteries, observer) {
  const [entry] = enteries;

  if (!entry.isIntersecting) return;
  // console.log(entry);


  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  })

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});


imgTargets.forEach(img => imgObserver.observe(img));


// Slider


const slides = document.querySelectorAll('.slide');
const buttonLeft = document.querySelector('.slider__btn--left');
const buttonRight = document.querySelector('.slider__btn--right');
const dotContainer = document.querySelector('.dots');

let currentSlide = 0;
const maxSlide = slides.length - 1;






const createDots = function () {

  slides.forEach(function (_, i) {
    dotContainer.insertAdjacentHTML('beforeend',
      ` <button class="dots__dot" data-slide=${i}></button>
      `
    )
  })
};


const activateDot = function (slide) {
  const dots = document.querySelectorAll('.dots__dot');
  dots.forEach(dot => dot.classList.remove('dots__dot--active'));

  document.querySelector(`.dots__dot[data-slide="${slide}"]`).classList.add('dots__dot--active');

};






const goToSlide = function (slide) {

  activateDot(slide);
  slides.forEach((s, i) => {
    console.log(i);
    s.style.transform = `translateX(${100 * (i - slide)}%)`;
  });
};

const nextSlide = function () {
  if (currentSlide === maxSlide) {
    currentSlide = 0;
  } else {
    currentSlide++;
  }
  goToSlide(currentSlide);

};

const prevSlide = function () {
  if (currentSlide === 0) {
    currentSlide = maxSlide;
  } else {
    currentSlide--;
  }
  goToSlide(currentSlide);
};
createDots();
goToSlide(0);



// Event handlers

buttonRight.addEventListener('click', nextSlide);
buttonLeft.addEventListener('click', prevSlide);


document.addEventListener('keydown', function (e) {
  if (e.key === 'ArrowLeft') {
    prevSlide();
  } else if (e.key === 'ArrowRight') {
    nextSlide();
  }
});


dotContainer.addEventListener('click', function (e) {


  if (!e.target.classList.contains('dots__dot')) return;
  const slide = e.target.dataset.slide;
  e.target.classList.add('dots__dot--active');
  goToSlide(slide);
});


