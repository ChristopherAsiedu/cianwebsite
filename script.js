const slides = document.querySelectorAll(".slide");
const dots = document.querySelectorAll(".slide-dots button");
let slideIndex = 0;
let slideTimer;

function showSlide(index) {
  slideIndex = (index + slides.length) % slides.length;
  slides.forEach((slide, i) => slide.classList.toggle("is-active", i === slideIndex));
  dots.forEach((dot, i) => dot.classList.toggle("is-active", i === slideIndex));
}

function startSlides() {
  clearInterval(slideTimer);
  slideTimer = setInterval(() => showSlide(slideIndex + 1), 5000);
}

dots.forEach((dot, i) => {
  dot.addEventListener("click", () => {
    showSlide(i);
    startSlides();
  });
});
startSlides();

const menuToggle = document.querySelector(".menu-toggle");
const primaryNav = document.querySelector("#primary-nav");
const contactForm = document.querySelector("#contact-form");
const contactModes = {
  ministry: {
    subject: "CIAN MidSouth: Ministry Request",
    button: "Send request",
    message: "How can we help?",
  },
  join: {
    subject: "CIAN MidSouth: Join CIAN",
    button: "Apply to join CIAN",
    message: "Tell us about your ministry and calling",
  },
  call: {
    subject: "CIAN MidSouth: Book a Call",
    button: "Request a call",
    message: "What would you like to talk about?",
  },
};
let activeContactMode = "ministry";

function updateConditionalFields() {
  const isMinistry = contactForm.elements.as.value === "A ministry / church";
  const joinFields = contactForm.querySelector(".join-fields");
  const callFields = contactForm.querySelector(".call-fields");
  joinFields.hidden = activeContactMode !== "join" && !isMinistry;
  callFields.hidden = activeContactMode !== "call";
  joinFields.querySelectorAll("input, select").forEach((field) => {
    field.disabled = joinFields.hidden;
  });
  callFields.querySelectorAll("input, select").forEach((field) => {
    field.disabled = callFields.hidden;
  });
}

function setContactMode(mode) {
  if (!Object.hasOwn(contactModes, mode)) return;
  activeContactMode = mode;
  const needField = contactForm.querySelector(".need-field");
  needField.hidden = mode === "call";
  contactForm.elements.need.disabled = needField.hidden;
  document.querySelectorAll(".contact-tab").forEach((tab) => {
    tab.setAttribute("aria-pressed", String(tab.dataset.mode === mode));
  });
  contactForm.querySelector(".message-label").firstChild.textContent = `${contactModes[mode].message}`;
  contactForm.querySelector('button[type="submit"]').firstChild.textContent = `${contactModes[mode].button} `;
  if (mode === "join") contactForm.elements.need.value = "Joining CIAN";
  if (mode === "ministry" && contactForm.elements.need.value === "Joining CIAN") {
    contactForm.elements.need.value = "Ministry training";
  }
  updateConditionalFields();
}

document.querySelectorAll("[data-mode]").forEach((element) => {
  element.addEventListener("click", () => setContactMode(element.dataset.mode));
});

contactForm.elements.as.addEventListener("change", updateConditionalFields);

menuToggle.addEventListener("click", () => {
  const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isExpanded));
  menuToggle.querySelector(".sr-only").textContent = isExpanded ? "Open navigation" : "Close navigation";
  primaryNav.classList.toggle("is-open", !isExpanded);
});

primaryNav.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.querySelector(".sr-only").textContent = "Open navigation";
    primaryNav.classList.remove("is-open");
  }
});

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) return;

  const fields = new FormData(form);
  const labels = {
    name: "Full name",
    email: "Email",
    phone: "Phone",
    location: "City / State",
    as: "I am reaching out as",
    need: "I need",
    ministry: "Ministry / Church name",
    role: "Your role",
    date: "Preferred date",
    time: "Preferred time",
    message: "How can we help?",
  };
  const body = [...fields.entries()]
    .filter(([, value]) => String(value).trim())
    .map(([key, value]) => `${labels[key]}: ${value}`)
    .join("\n");
  const subject = contactModes[activeContactMode].subject;
  const mailto = `mailto:Admin@theforgecenter.org?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  document.querySelector("#form-status").textContent = "Thank you. Your email is ready to send.";
  window.location.href = mailto;
});
