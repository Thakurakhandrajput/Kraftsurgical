const menuToggle = document.querySelector(".menu-toggle");
const mobileNav = document.querySelector(".mobile-nav");

if (menuToggle && mobileNav) {
  const closeNavigation = () => {
    mobileNav.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
    mobileNav.querySelectorAll(".nav-menu.is-open").forEach((menu) => {
      menu.classList.remove("is-open");
      const toggle = menu.querySelector(".nav-dropdown-toggle");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Show product categories");
    });
  };
  menuToggle.addEventListener("click", () => {
    const isOpen = mobileNav.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
    if (!isOpen) closeNavigation();
  });
  mobileNav.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeNavigation));
  document.querySelectorAll(".nav-dropdown-toggle").forEach((toggle) => {
    toggle.addEventListener("click", () => {
      const menu = toggle.closest(".nav-menu");
      const isOpen = menu.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
      toggle.setAttribute("aria-label", isOpen ? "Hide product categories" : "Show product categories");
    });
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeNavigation();
  });
}

const productSearch = document.querySelector("#product-search");
let activeCatalogFilter = "all";

function applyCatalogFilters() {
  const query = productSearch ? productSearch.value.trim().toLowerCase() : "";
  let visibleCount = 0;
  document.querySelectorAll(".product-filter").forEach((item) => {
    const active = item.dataset.filter === activeCatalogFilter;
    item.classList.toggle("is-active", active);
    item.setAttribute("aria-pressed", String(active));
  });
  document.querySelectorAll(".product-card").forEach((card) => {
    const matchesCategory = activeCatalogFilter === "all" || card.dataset.category === activeCatalogFilter;
    const matchesSearch = !query || card.dataset.name.includes(query);
    card.hidden = !(matchesCategory && matchesSearch);
    if (!card.hidden) visibleCount += 1;
  });
  const count = document.querySelector("#catalog-count");
  if (count) count.textContent = `${visibleCount} ${visibleCount === 1 ? "product" : "products"}`;
}

document.querySelectorAll(".product-filter").forEach((button) => {
  button.addEventListener("click", () => {
    activeCatalogFilter = button.dataset.filter;
    document.querySelectorAll(".product-filter").forEach((item) => {
      const active = item === button;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-pressed", String(active));
    });
    applyCatalogFilters();
  });
});
productSearch?.addEventListener("input", applyCatalogFilters);

const products = {
  "4k-camera": {
    name: "4K Camera System",
    category: "LAPAROSCOPY",
    image: "https://kraftsurgicals.com/wp-content/uploads/2026/08/4K-Camera-e1786524774537.webp",
    description: "Advanced 4K imaging for exceptionally clear, natural and dependable visualization in the operating room.",
    overview: "Designed for modern minimally invasive surgery, the Kraft 4K Camera System delivers high-resolution imaging and practical workflows for surgical teams.",
    features: ["Ultra-high-definition 4K output", "Natural colour and detail reproduction", "Compatible surgical display workflow", "Service and application support"],
  },
  "fhd-camera": {
    name: "FHD Camera System",
    category: "LAPAROSCOPY",
    image: "https://kraftsurgicals.com/wp-content/uploads/2026/08/Untitled-design-35.jpg",
    description: "Clear full-HD visualization with dependable performance for routine and advanced laparoscopic procedures.",
    overview: "A reliable imaging solution for surgical teams seeking consistent full-HD visualization, ease of use and stable performance.",
    features: ["Full-HD surgical visualization", "Clear and natural image output", "Integrated operating-room workflow", "Reliable professional support"],
  },
  "led-light": {
    name: "LED Cold Light Source",
    category: "ENDOSCOPY",
    image: "https://kraftsurgicals.com/wp-content/uploads/2026/08/Untitled-design-36.jpg",
    description: "Powerful and consistent LED illumination for laparoscopy, endoscopy and minimally invasive procedures.",
    overview: "The Kraft LED Cold Light Source provides uniform illumination with efficient operation and compatibility across standard light-cable systems.",
    features: ["Bright and uniform illumination", "Efficient LED technology", "Stable output for clinical workflows", "Standard light cable compatibility"],
  },
  "co2-insufflator": {
    name: "CO₂ Insufflator",
    category: "LAPAROSCOPY",
    image: "https://kraftsurgicals.com/wp-content/uploads/2026/08/Untitled-design-34-1.jpg",
    description: "Controlled insufflation designed to support stable pressure and efficient laparoscopic workflows.",
    overview: "A dependable CO₂ insufflator for consistent pressure control, straightforward operation and professional surgical support.",
    features: ["Stable pressure control", "Clear operating parameters", "Designed for surgical workflows", "Professional installation support"],
  },
  "pressure-monitoring": {
    name: "Pressure Monitoring & Contrast Delivery Set",
    category: "CARDIOLOGY",
    image: "https://kraftsurgicals.com/wp-content/uploads/2026/11/Pressure-Monitoring-Contrast-Delivery-Set.jpg",
    description: "A complete set designed for pressure monitoring and contrast delivery in interventional cardiology workflows.",
    overview: "Built for dependable clinical use, this set supports standardized monitoring and contrast delivery procedures with practical connections and consistent quality.",
    features: ["Pressure monitoring connectivity", "Contrast delivery workflow", "Clear, organized configuration", "Professional clinical support"],
  },
  "coronary-angiography": {
    name: "Coronary Angiography Set",
    category: "CARDIOLOGY",
    image: "https://kraftsurgicals.com/wp-content/uploads/2026/11/Coronary-Angiography-Set.jpg",
    description: "An organized angiography set configured to support efficient coronary diagnostic procedures.",
    overview: "The coronary angiography set is designed to simplify setup and support consistent, controlled use in interventional cardiology environments.",
    features: ["Procedure-focused configuration", "Clear connection layout", "Reliable disposables", "Consistent clinical workflow"],
  },
  "coronary-stenting": {
    name: "Coronary Stenting Set",
    category: "CARDIOLOGY",
    image: "https://kraftsurgicals.com/wp-content/uploads/2026/11/Coronary-Stenting-Set.jpg",
    description: "A practical procedural set supporting organized and controlled coronary stenting workflows.",
    overview: "Designed around interventional cardiology requirements, this set helps teams maintain a clear, efficient and dependable procedural setup.",
    features: ["Stenting procedure support", "Organized component layout", "Clinical-use compatibility", "Professional product guidance"],
  },
  "ptca-set": {
    name: "PTCA Surgical Set",
    category: "CARDIOLOGY",
    image: "https://kraftsurgicals.com/wp-content/uploads/2026/11/PTCA-Surgical-Set.jpg",
    description: "A purpose-oriented PTCA set designed to support consistent interventional workflow requirements.",
    overview: "The PTCA Surgical Set provides a clear procedural arrangement for interventional teams seeking organized, dependable support.",
    features: ["PTCA workflow support", "Clearly organized components", "Reliable clinical configuration", "Available application support"],
  },
  "blood-tubing-set": {
    name: "Blood Tubing Set",
    category: "CARDIOLOGY",
    image: "https://kraftsurgicals.com/wp-content/themes/kraft-surgicals/assets/images/placeholder-product-image.jpg",
    description: "A cardiology tubing set designed to support dependable connections and organized clinical workflows.",
    overview: "The Blood Tubing Set is intended for professional healthcare environments, with product configuration and compatibility details available from our team.",
    features: ["Cardiology workflow use", "Professional-grade components", "Product compatibility guidance", "Contact our team for specifications"],
  },
  "transradial-set": {
    name: "Transradial Surgical Set",
    category: "CARDIOLOGY",
    image: "https://kraftsurgicals.com/wp-content/uploads/2026/11/Transradial-Surgical-Set.jpg",
    description: "A procedure-oriented surgical set to support organized transradial access workflows.",
    overview: "Designed for interventional cardiology teams, the set supports a clear and consistent procedural setup. Contact us for detailed configuration information.",
    features: ["Transradial procedure support", "Organized component configuration", "Designed for clinical workflows", "Ask our team for specifications"],
  },
  "femoral-access-set": {
    name: "Femoral Access Surgical Set",
    category: "CARDIOLOGY",
    image: "https://kraftsurgicals.com/wp-content/uploads/2026/11/Femoral-Access-Surgical-Set.jpg",
    description: "A dedicated surgical set designed to support organized femoral access procedures.",
    overview: "A practical set for interventional cardiology teams, with configuration details available on request from our product specialists.",
    features: ["Femoral access workflow support", "Organized procedural setup", "Professional clinical configuration", "Request detailed product information"],
  },
  "transseptal-puncture-set": {
    name: "Transseptal Puncture Set",
    category: "CARDIOLOGY",
    image: "https://kraftsurgicals.com/wp-content/uploads/2026/11/Transseptal-Puncture-Set.jpg",
    description: "A procedure-specific set designed to support organized transseptal puncture workflows.",
    overview: "The set supports interventional teams with a clearly arranged procedural configuration. Contact Kraft Surgicals for exact component and compatibility details.",
    features: ["Transseptal procedure support", "Procedure-focused configuration", "Professional product support", "Specifications available on enquiry"],
  },
};

const productViewName = document.querySelector("#product-name");
if (productViewName) {
  const key = new URLSearchParams(window.location.search).get("product");
  const product = products[key] || products["4k-camera"];
  document.title = `${product.name} — Kraft Surgicals`;
  document.querySelector("#breadcrumb-name").textContent = product.name;
  document.querySelector("#product-category").textContent = product.category;
  document.querySelector("#gallery-category").textContent = product.category;
  document.querySelector("#product-name").textContent = product.name;
  document.querySelector("#product-description").textContent = product.description;
  document.querySelector("#product-overview").textContent = product.overview;
  const image = document.querySelector("#product-image");
  image.src = product.image;
  image.alt = product.name;
  document.querySelector("#product-features").innerHTML = product.features.map((feature) => `<li>${feature}</li>`).join("");
  const whatsapp = document.querySelector("#product-whatsapp");
  whatsapp.href = `https://wa.me/9768722155?text=${encodeURIComponent(`Hello Kraft Surgicals, I'd like to enquire about ${product.name}.`)}`;
}

if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches && "IntersectionObserver" in window) {
  const revealTargets = document.querySelectorAll(".inner-hero-copy, .products-hero-visual, .contact-hero-card, .section-heading, .product-card, .contact-details, .contact-form-wrap, .product-gallery, .product-summary, .product-info-grid");
  revealTargets.forEach((element) => element.classList.add("reveal"));
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12 });
  revealTargets.forEach((element) => revealObserver.observe(element));
  document.documentElement.classList.add("motion-ready");
}

const contactForm = document.querySelector("#contact-form");
if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const form = new FormData(contactForm);
    const message = [
      "Hello Kraft Surgicals,",
      `Name: ${form.get("name")}`,
      `Email: ${form.get("email")}`,
      `Phone: ${form.get("phone") || "-"}`,
      `Subject: ${form.get("subject") || "-"}`,
      `Interested in: ${form.get("interest") || "-"}`,
      `Message: ${form.get("message")}`,
    ].join("\n");
    window.open(`https://wa.me/9768722155?text=${encodeURIComponent(message)}`, "_blank", "noopener");
    document.querySelector("#form-status").textContent = "Opening WhatsApp…";
  });
}
