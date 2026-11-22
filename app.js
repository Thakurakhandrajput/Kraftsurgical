const textSlides = [...document.querySelector(".hero-copy").querySelectorAll(".hero-slide")];
const imageSlides = [...document.querySelector(".hero-visual").querySelectorAll(".hero-slide")];
const dots = [...document.querySelectorAll(".slider-dot")];
const progress = document.querySelector(".slide-progress");
const currentNumber = document.querySelector(".slide-current");
const pauseButton = document.querySelector(".slider-pause");
const hero = document.querySelector(".hero");
const siteHeader = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const mobileNav = document.querySelector(".mobile-nav");
const languageSelect = document.querySelector(".language-select");
const translations = window.KRAFT_TRANSLATIONS;
const quoteProduct = document.querySelector("#quote-product");
const quoteLink = document.querySelector(".quote-submit");
const productCards = [...document.querySelectorAll(".product-card")];
const productFilters = [...document.querySelectorAll(".product-filter")];
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const intervalDuration = 6000;
let currentSlide = 0;
let rotationTimer;
let slideTransitionTimer;
let revealObserver;
let paused = reducedMotion.matches;
let hoverPaused = false;
let focusPaused = false;
let touchStartX = 0;
let currentLanguage = "en";

function updateQuoteLink() {
  const dictionary = translations.dictionaries[currentLanguage];
  const product = quoteProduct.value;
  const message = product
    ? `${dictionary.quoteMessage} ${dictionary[product]}.`
    : dictionary.quoteDefaultMessage;
  quoteLink.href = `https://wa.me/9768722155?text=${encodeURIComponent(message)}`;
}

function renderSlide(index, restart = true) {
  const previousSlide = currentSlide;
  const nextSlide = (index + textSlides.length) % textSlides.length;
  const direction = index >= previousSlide ? 1 : -1;
  if (nextSlide === previousSlide) {
    if (restart) startRotation();
    return;
  }
  window.clearTimeout(slideTransitionTimer);
  currentSlide = nextSlide;
  hero.style.setProperty("--slide-direction", String(direction));
  [...textSlides, ...imageSlides].forEach((slide) => {
    const active = Number(slide.dataset.slide) === currentSlide;
    slide.classList.remove("is-entering", "is-exiting");
    if (Number(slide.dataset.slide) === previousSlide) slide.classList.add("is-exiting");
    if (active) slide.classList.add("is-entering");
    slide.classList.toggle("is-active", active);
    slide.setAttribute("aria-hidden", String(!active));
    slide.inert = !active;
  });
  dots.forEach((dot, dotIndex) => {
    const active = dotIndex === currentSlide;
    dot.classList.toggle("is-active", active);
    dot.setAttribute("aria-pressed", String(active));
  });
  currentNumber.textContent = String(currentSlide + 1).padStart(2, "0");
  slideTransitionTimer = window.setTimeout(() => {
    [...textSlides, ...imageSlides].forEach((slide) => slide.classList.remove("is-entering", "is-exiting"));
  }, 1000);
  if (restart) startRotation();
}

function stopRotation() {
  window.clearInterval(rotationTimer);
  rotationTimer = undefined;
  progress.classList.remove("is-running");
}

function startRotation() {
  stopRotation();
  if (paused || hoverPaused || focusPaused || document.hidden) return;
  void progress.offsetWidth;
  progress.classList.add("is-running");
  rotationTimer = window.setInterval(() => renderSlide(currentSlide + 1), intervalDuration);
}

function setPaused(value) {
  paused = value;
  pauseButton.setAttribute("aria-pressed", String(paused));
  const dictionary = translations.dictionaries[currentLanguage];
  pauseButton.setAttribute("aria-label", dictionary[paused ? "playAria" : "pauseAria"]);
  pauseButton.firstChild.textContent = paused ? "▶ " : "Ⅱ ";
  pauseButton.querySelector("span").textContent = dictionary[paused ? "play" : "pause"];
  if (paused) {
    stopRotation();
  } else {
    hoverPaused = false;
    focusPaused = false;
    startRotation();
  }
}

function applyLanguage(language) {
  if (!translations.languages.includes(language)) return;
  currentLanguage = language;
  const dictionary = translations.dictionaries[language];
  document.documentElement.lang = language;
  document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
  document.title = dictionary.pageTitle;
  document.querySelector('meta[name="description"]').content = dictionary.metaDescription;

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    element.textContent = dictionary[element.dataset.i18n];
  });
  document.querySelectorAll("[data-i18n-html]").forEach((element) => {
    element.innerHTML = dictionary[element.dataset.i18nHtml];
  });
  document.querySelectorAll("[data-i18n-alt]").forEach((element) => {
    element.alt = dictionary[element.dataset.i18nAlt];
  });
  document.querySelectorAll("[data-i18n-aria]").forEach((element) => {
    element.setAttribute("aria-label", dictionary[element.dataset.i18nAria]);
  });
  const slideTitles = [dictionary.camera4k, dictionary.slide5Alt, dictionary.cameraFhd, dictionary.lightSource, dictionary.insufflator];
  dots.forEach((dot, index) => {
    dot.setAttribute("aria-label", `${dictionary.slideLabel} ${index + 1}: ${slideTitles[index]}`);
  });
  pauseButton.setAttribute("aria-label", dictionary[paused ? "playAria" : "pauseAria"]);
  pauseButton.querySelector("span").textContent = dictionary[paused ? "play" : "pause"];
  menuToggle.setAttribute("aria-label", dictionary[mobileNav.classList.contains("is-open") ? "menuClose" : "menuOpen"]);
  updateQuoteLink();
}

languageSelect.addEventListener("change", () => applyLanguage(languageSelect.value));
quoteProduct.addEventListener("change", updateQuoteLink);
applyLanguage(languageSelect.value);

document.querySelector(".slider-next").addEventListener("click", () => renderSlide(currentSlide + 1));
document.querySelector(".slider-prev").addEventListener("click", () => renderSlide(currentSlide - 1));
dots.forEach((dot, index) => dot.addEventListener("click", () => renderSlide(index)));
pauseButton.addEventListener("click", () => setPaused(!paused));

hero.addEventListener("mouseenter", () => {
  hoverPaused = true;
  stopRotation();
});
hero.addEventListener("mouseleave", () => {
  hoverPaused = false;
  startRotation();
});
hero.addEventListener("focusin", () => {
  focusPaused = true;
  stopRotation();
});
hero.addEventListener("focusout", (event) => {
  if (!hero.contains(event.relatedTarget)) {
    focusPaused = false;
    startRotation();
  }
});
hero.addEventListener("touchstart", (event) => {
  touchStartX = event.changedTouches[0].clientX;
}, { passive: true });
hero.addEventListener("touchend", (event) => {
  const difference = event.changedTouches[0].clientX - touchStartX;
  if (Math.abs(difference) > 55) renderSlide(currentSlide + (difference < 0 ? 1 : -1));
}, { passive: true });
document.addEventListener("visibilitychange", () => {
  startRotation();
  if (document.visibilityState === "visible" && revealObserver) {
    document.documentElement.classList.add("motion-ready");
    revealTargets.forEach((element) => {
      const bounds = element.getBoundingClientRect();
      if (bounds.top < window.innerHeight && bounds.bottom > 0) element.classList.add("is-visible");
    });
  } else {
    document.documentElement.classList.remove("motion-ready");
  }
});

productFilters.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    productFilters.forEach((filterButton) => {
      const active = filterButton === button;
      filterButton.classList.toggle("is-active", active);
      filterButton.setAttribute("aria-pressed", String(active));
    });
    productCards.forEach((card, index) => {
      const visible = filter === "all" || card.dataset.category === filter;
      card.hidden = !visible;
      if (visible && !reducedMotion.matches) {
        card.animate(
          [{ opacity: 0, transform: "translateY(12px)" }, { opacity: 1, transform: "translateY(0)" }],
          { duration: 360, delay: (index % 4) * 45, easing: "cubic-bezier(.2,.7,.2,1)" },
        );
      }
    });
  });
});

const revealTargets = document.querySelectorAll(
  ".section-heading, .product-card, .quote-inner > *, .expertise-card, .credential-logos img, .feedback-inner > div, .feedback-inner > a, .partner-logos img, .blog-card, .about-inner > *, .contact-inner > *",
);
if ("IntersectionObserver" in window && !reducedMotion.matches) {
  revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -36px 0px" });
  revealTargets.forEach((element) => {
    element.classList.add("reveal");
    const siblingIndex = [...element.parentElement.children].indexOf(element);
    element.style.setProperty("--reveal-delay", `${(siblingIndex % 6) * 70}ms`);
    revealObserver.observe(element);
  });
  if (document.visibilityState === "visible") {
    document.documentElement.classList.add("motion-ready");
    revealTargets.forEach((element) => {
      const bounds = element.getBoundingClientRect();
      if (bounds.top < window.innerHeight && bounds.bottom > 0) element.classList.add("is-visible");
    });
  }
} else {
  revealTargets.forEach((element) => element.classList.add("is-visible"));
}

const navigationLinks = [...document.querySelectorAll(".desktop-nav .nav-link")];
const navigationSections = navigationLinks
  .map((link) => link.getAttribute("href"))
  .filter((href) => href?.startsWith("#"))
  .map((href) => document.getElementById(href.slice(1)))
  .filter(Boolean);
if ("IntersectionObserver" in window && navigationSections.length) {
  const navigationObserver = new IntersectionObserver((entries) => {
    const currentSection = entries
      .filter((entry) => entry.isIntersecting)
      .sort((first, second) => second.intersectionRatio - first.intersectionRatio)[0];
    if (!currentSection) return;
    navigationLinks.forEach((link) => {
      const active = link.hash === `#${currentSection.target.id}`;
      link.classList.toggle("nav-link--active", active);
      if (active) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  }, { rootMargin: "-25% 0px -65% 0px", threshold: [0, 0.1, 0.5] });
  navigationSections.forEach((section) => navigationObserver.observe(section));
}

let scrollUpdatePending = false;
window.addEventListener("scroll", () => {
  if (scrollUpdatePending) return;
  scrollUpdatePending = true;
  window.requestAnimationFrame(() => {
    siteHeader.classList.toggle("is-scrolled", window.scrollY > 24);
    scrollUpdatePending = false;
  });
}, { passive: true });

reducedMotion.addEventListener("change", (event) => {
  if (event.matches) {
    revealTargets.forEach((element) => element.classList.add("is-visible"));
  }
});

pauseButton.firstChild.textContent = paused ? "▶ " : "Ⅱ ";
pauseButton.querySelector("span").textContent = paused ? "PLAY" : "PAUSE";
pauseButton.setAttribute("aria-label", paused ? "Play slideshow" : "Pause slideshow");
pauseButton.setAttribute("aria-pressed", String(paused));
reducedMotion.addEventListener("change", (event) => setPaused(event.matches));
startRotation();

function closeNavigation() {
  mobileNav.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", translations.dictionaries[currentLanguage].menuOpen);
  document.querySelectorAll(".nav-menu.is-open").forEach((menu) => {
    menu.classList.remove("is-open");
    const toggle = menu.querySelector(".nav-dropdown-toggle");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", translations.dictionaries[currentLanguage].navShowCategories);
  });
}

menuToggle.addEventListener("click", () => {
  const isOpen = mobileNav.classList.toggle("is-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", translations.dictionaries[currentLanguage][isOpen ? "menuClose" : "menuOpen"]);
  if (!isOpen) closeNavigation();
});
document.querySelectorAll(".nav-dropdown-toggle").forEach((toggle) => {
  toggle.addEventListener("click", () => {
    const menu = toggle.closest(".nav-menu");
    const isOpen = menu.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.setAttribute("aria-label", translations.dictionaries[currentLanguage][isOpen ? "navHideCategories" : "navShowCategories"]);
  });
});
mobileNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeNavigation);
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeNavigation();
  if (event.altKey && event.key === "ArrowRight") renderSlide(currentSlide + 1);
  if (event.altKey && event.key === "ArrowLeft") renderSlide(currentSlide - 1);
});
