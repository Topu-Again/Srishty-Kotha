// ==============================
// SrishtyKotha Portfolio
// ==============================

const navbar = document.querySelector(".navbar");
const galleryImages = document.querySelectorAll(".gallery img");
const lightbox = document.querySelector(".lightbox");
const lightboxImage = document.querySelector(".lightbox img");
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".nav-links a");



// ======================================
// Navbar Scroll Effect
// ======================================

window.addEventListener("scroll", () => {

    if (window.scrollY > 80) {

        navbar.style.background = "rgba(255,255,255,.85)";
        navbar.style.boxShadow = "0 15px 40px rgba(0,0,0,.12)";
        navbar.style.padding = "14px 35px";

    }

    else {

        navbar.style.background = "rgba(255,255,255,.65)";
        navbar.style.boxShadow = "0 8px 30px rgba(0,0,0,.06)";
        navbar.style.padding = "18px 35px";

    }

});



// ======================================
// Smooth Scrolling
// ======================================

navLinks.forEach(link => {

    link.addEventListener("click", e => {

        e.preventDefault();

        const target = document.querySelector(link.getAttribute("href"));

        target.scrollIntoView({

            behavior: "smooth"

        });

    });

});



// ======================================
// Active Navigation
// ======================================

window.addEventListener("scroll", () => {

    let current = "";

    sections.forEach(section => {

        const top = section.offsetTop - 160;
        const height = section.clientHeight;

        if (window.scrollY >= top) {

            current = section.getAttribute("id");

        }

    });

    navLinks.forEach(link => {

        link.classList.remove("active");

        if (link.getAttribute("href") === "#" + current) {

            link.classList.add("active");

        }

    });

});



// ======================================
// Scroll Reveal
// ======================================

const revealElements = document.querySelectorAll(

    ".section-title, .about-image, .about-text, .gallery img, .contact-links"

);

revealElements.forEach(el => {

    el.classList.add("fade-up");

});

const observer = new IntersectionObserver(

    entries => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                entry.target.classList.add("show");

            }

        });

    },

    {

        threshold: .15

    }

);

revealElements.forEach(el => observer.observe(el));



// ======================================
// Gallery Lightbox
// ======================================

galleryImages.forEach(image => {

    image.addEventListener("click", () => {

        lightbox.classList.add("show");

        lightboxImage.src = image.src;

        document.body.style.overflow = "hidden";

    });

});



// ======================================
// Close Lightbox
// ======================================

lightbox.addEventListener("click", e => {

    if (e.target !== lightboxImage) {

        lightbox.classList.remove("show");

        document.body.style.overflow = "auto";

    }

});

document.addEventListener("keydown", e => {

    if (e.key === "Escape") {

        lightbox.classList.remove("show");

        document.body.style.overflow = "auto";

    }

});



// ======================================
// Lazy Image Fade
// ======================================

galleryImages.forEach((image, index) => {
    image.style.opacity = 0;
    image.style.transitionDelay = `${index * 0.08}s`;

    const fadeIn = () => {
        image.style.transition = ".8s";
        image.style.opacity = 1;
    };

    if (image.complete) {
        fadeIn(); // already loaded (e.g. from cache) — fire manually
    } else {
        image.addEventListener("load", fadeIn);
    }
});



// ======================================
// Stagger Gallery Animation
// ======================================

galleryImages.forEach((image, index) => {

    image.style.transitionDelay = `${index * 0.08}s`;

});



// ======================================
// Hero Fade
// ======================================

window.addEventListener("load", () => {

    document.body.classList.add("loaded");

});



// ======================================
// Optional Parallax Hero
// ======================================

const hero = document.querySelector(".hero");

window.addEventListener("scroll", () => {

    const offset = window.scrollY * 0.25;

    hero.style.backgroundPosition = `center ${offset}px`;

});