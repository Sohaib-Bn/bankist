// BUTTONS
const openModalBtns = document.querySelectorAll('.btn--open-modal');
const closeModalBtn = document.querySelector('.btn--close-modal');
const scroolToBtn = document.querySelector('.btn--scrool-to');
const tabs = document.querySelectorAll('.operations__tab');
const nextSlide = document.querySelector('.slider__btn--next');
const prevSlide = document.querySelector('.slider__btn--prev');
// LINKS
const headerLink = document.querySelectorAll('.header__link');
// ELEMENTS
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const header = document.querySelector('.header');
const headerNav = document.querySelector('.header__nav');
const headerList = document.querySelector('.header__list');
const featuresAll = document.querySelectorAll('.feature');
const sidesRight = document.querySelectorAll('.side--right');
const sidesLeft = document.querySelectorAll('.side--left');
const tabsContainer = document.querySelector('.operations__tab-container');
const operationsContent = document.querySelectorAll('.operations__content');
const cookieMessage = document.createElement('div');
const featuresImg = document.querySelectorAll('.features__img');
const slides = document.querySelectorAll('.slide');
const slider = document.querySelector('.slider');
const dotsContainer = document.querySelector('.dots');
// SECTIONS
const sectionFeatures = document.getElementById('section-features');
const sectionsAll = document.querySelectorAll('.section');
// IMAGES

////////////////////////
// MODAL WINDOW

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

openModalBtns.forEach(btn => {
  btn.addEventListener('click', openModal);
});

closeModalBtn.addEventListener('click', function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
});

////////////////////////
// COOKIE MESSAGE

cookieMessage.classList.add('cookie-message');

cookieMessage.innerHTML =
  'We use cookies to improve functionality and analytics. <button class="btn--primary btn--close-cookies">Got it!</button>';

header.append(cookieMessage);

document
  .querySelector('.btn--close-cookies')
  .addEventListener('click', function () {
    cookieMessage.remove();
  });

scroolToBtn.addEventListener('click', function (e) {
  sectionFeatures.scrollIntoView({ behavior: 'smooth' });
});

////////////////////////
// NAVBAR EFFECT

const handelMouse = function (e) {
  if (e.target.classList.contains('header__link')) {
    const currlink = e.target;
    const siblingLinks = currlink
      .closest('.header__nav')
      .querySelectorAll('.header__link');
    const logo = currlink
      .closest('.header__nav')
      .querySelector('.header__logo');
    siblingLinks.forEach(link => {
      if (link !== currlink) {
        link.style.opacity = this;
        logo.style.opacity = this;
      }
    });
  }
};
headerNav.addEventListener('mouseover', handelMouse.bind(0.5));

headerNav.addEventListener('mouseout', handelMouse.bind(1));
////////////////////////
// NAVBAR STICKY

const navHeight = headerNav.getBoundingClientRect().height;

const navSticky = function (entries) {
  entries.forEach(entrie => {
    if (!entrie.isIntersecting) headerNav.classList.add('sticky');
    else headerNav.classList.remove('sticky');
  });
};

const headerObserver = new IntersectionObserver(navSticky, {
  root: null,
  threshold: [0],
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

////////////////////////
// NAVBAR SCROLLING

headerList.addEventListener('click', function (e) {
  e.preventDefault();
  if (e.target.classList.contains('header__link')) {
    const sectionID = e.target.getAttribute('href');
    if (sectionID !== '#')
      document.querySelector(sectionID).scrollIntoView({ behavior: 'smooth' });
  }
});

////////////////////////
// OPERATIONS TAB

tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');
  if (!clicked) return false;
  // CLEAR
  tabs.forEach(t => {
    t.classList.remove('tab--active');
  });
  operationsContent.forEach(c => {
    c.classList.remove('operations__content--active');
  });

  // ACTIVATE TAB
  clicked.classList.add('tab--active');
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

////////////////////////
// SCROLL ANNIMATION

const observeSection = function (entries) {
  const [entrie] = entries;
  const sectionObserved = entrie.target;
  if (!entrie.isIntersecting) return;
  sectionObserved.classList.remove('scroll-annimation');
  sectionObserver.unobserve(entrie.target);
};

const sectionObserver = new IntersectionObserver(observeSection, {
  root: null,
  threshold: 0.15,
});

sectionsAll.forEach(section => {
  sectionObserver.observe(section);
  section.classList.add('scroll-annimation');
});

////////////////////////
// LOADING IMG EFFECT

const observeImg = function (entries) {
  const [entrie] = entries;
  const imgTarget = entrie.target;
  if (!entrie.isIntersecting) return;
  imgTarget.src = entrie.target.dataset.src;
  imgTarget.addEventListener('load', function () {
    this.classList.remove('img-lazy');
  });
  imgObserver.unobserve(imgTarget);
};

const imgObserver = new IntersectionObserver(observeImg, {
  root: null,
  threshold: [0],
  rootMargin: '-100px',
});

featuresImg.forEach(img => {
  imgObserver.observe(img);
  img.classList.add('img-lazy');
});

////////////////////////
// SIDES ANNIMATION

// SIDES RIGHT

const observeRightSides = function (entries) {
  const [entrie] = entries;
  if (!entrie.isIntersecting) return;
  entrie.target.classList.remove('right-side-annimation');
  rightSidesObserver.unobserve(entrie.target);
};

const rightSidesObserver = new IntersectionObserver(observeRightSides, {
  root: null,
  threshold: 0,
  rootMargin: '100px',
});

sidesRight.forEach(side => {
  rightSidesObserver.observe(side);
  side.classList.add('right-side-annimation');
});

// SIDES LEFT

const observeLeftSides = function (entries) {
  const [entrie] = entries;
  if (!entrie.isIntersecting) return;
  entrie.target.classList.remove('left-side-annimation');
  leftSidesObserver.unobserve(entrie.target);
};

const leftSidesObserver = new IntersectionObserver(observeLeftSides, {
  root: null,
  threshold: 0,
  rootMargin: '100px',
});

sidesLeft.forEach(side => {
  leftSidesObserver.observe(side);
  side.classList.add('left-side-annimation');
});

////////////////////////
// SLIDER FUNCTIONALITY

const sliderFuntionlity = function () {
  let curSlide = 0;
  let maxSlide = slides.length;

  // FUNCTIONS

  const slidesFun = function (curSlide) {
    slides.forEach((slide, i) => {
      slide.style.transform = `translateX(${100 * (i - curSlide)}%)`;
    });
  };

  const createDots = function () {
    slides.forEach((_, i) => {
      dotsContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide=${i}></button>`
      );
    });
  };

  const activateDot = function (curSlide) {
    document.querySelectorAll('.dots__dot').forEach(dot => {
      dot.classList.remove('dot--active');
    });
    document
      .querySelector(`.dots__dot[data-slide="${curSlide}"]`)
      .classList.add('dot--active');
  };

  const toNextSlide = function () {
    if (curSlide === maxSlide - 1) curSlide = 0;
    else curSlide++;
    slidesFun(curSlide);
    activateDot(curSlide);
  };
  const toPrevSlide = function () {
    if (curSlide === 0) curSlide = maxSlide - 1;
    else curSlide--;
    slidesFun(curSlide);
    activateDot(curSlide);
  };

  // INITIALIZE SLIDES

  const initSlides = function () {
    slidesFun(0);
    createDots();
    activateDot(0);
  };
  initSlides();

  // SLIDES EVENTS HANDLER

  nextSlide.addEventListener('click', toNextSlide);

  prevSlide.addEventListener('click', toPrevSlide);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') toNextSlide();
    else if (e.key === 'ArrowLeft') toPrevSlide();
  });

  document.querySelectorAll('.dots__dot').forEach(dot => {
    dot.addEventListener('click', function () {
      const slideData = dot.dataset.slide;
      slidesFun(slideData);
      activateDot(slideData);
    });
  });
};

sliderFuntionlity();

/////////////////////////////
// MODAL FORM

const modalBtn = document.querySelector('.modal__btn');
const inputs = document.querySelectorAll('.modal__input');
const loginForm = document.querySelector('.login');
const fName = document.getElementById('fName');
const lName = document.getElementById('lName');
const email = document.getElementById('email');

const formValidation = function (input, i) {
  if (input.value === '') {
    input.classList.add('err--input');
    document.querySelector(`.err--msg--${i}`).textContent = 'Field is required';
    document
      .querySelector(`.err--msg--${i}`)
      .classList.remove('err--msg-annimation');
  } else {
    input.classList.remove('err--input');
    setInterval(() => {
      document.querySelector(`.err--msg--${i}`).textContent = '';
    }, 3000);
    document
      .querySelector(`.err--msg--${i}`)
      .classList.add('err--msg-annimation');
  }
};

//////////////////////////////////////
// GET USER DATA

class Account {
  constructor(firstName, lastName, email) {
    (this.firstName = firstName),
      (this.lastName = lastName),
      (this.email = email);
  }
}

class Form {
  accounts = [];

  constructor() {
    modalBtn.addEventListener('click', this._newAccount.bind(this));
    inputs.forEach((input, i) => {
      input.addEventListener('change', function () {
        formValidation(input, i);
      });
    });
  }

  _newAccount(e) {
    // e.preventDefault();
    // VALIDATE INPUTS
    inputs.forEach((input, i) => {
      formValidation(input, i);
    });
    // GET INPUTS DATA
    const isInputEmpty = (...inputs) => inputs.every(i => i.length !== 0);
    const firstName = fName.value;
    const lastName = lName.value;
    const emailAdress = email.value;
    if (isInputEmpty(firstName, lastName, emailAdress)) {
      modalBtn.href = './bank.html';
      this.accounts.push(new Account(firstName, lastName, emailAdress));
      console.log(this.accounts);
      // SET LOCAL STORAGE
      this._setLocalStorage();
      // CLEAR INPUTS
      fName.value = lName.value = email.value = '';
    }
  }

  _setLocalStorage() {
    localStorage.setItem('accounts', JSON.stringify(this.accounts));
  }
}

const form = new Form();
