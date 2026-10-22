/* =========================================================
   NAVBAR
========================================================= */

const navbar = document.querySelector(".navbar");

let navScrolled = false;
let scrollTicking = false;

function updateNavbar() {

    scrollTicking = false;

    const scrolled = window.scrollY > 30;

    if (scrolled !== navScrolled) {
        navScrolled = scrolled;
        navbar.classList.toggle("scrolled", scrolled);
    }

}

window.addEventListener("scroll", () => {

    if (!scrollTicking) {
        scrollTicking = true;
        requestAnimationFrame(updateNavbar);
    }

}, { passive: true });

updateNavbar();


/* =========================================================
   MOBILE MENU
========================================================= */

const menuButton = document.getElementById("menuButton");
const navMenu = document.getElementById("navMenu");
const navLinks = document.querySelectorAll(".nav-menu a");


/* ================= ABRIR / CERRAR ================= */

if (menuButton && navMenu) {

    menuButton.addEventListener("click", () => {

        const isOpen = navMenu.classList.toggle("open");

        menuButton.classList.toggle("open", isOpen);

        menuButton.setAttribute(
            "aria-expanded",
            isOpen ? "true" : "false"
        );

        menuButton.setAttribute(
            "aria-label",
            isOpen ? "Cerrar menú" : "Abrir menú"
        );

    });

}


/* ================= CERRAR AL TOCAR LINK ================= */

navLinks.forEach(link => {

    link.addEventListener("click", () => {

        navMenu.classList.remove("open");

        menuButton.classList.remove("open");

        menuButton.setAttribute(
            "aria-expanded",
            "false"
        );

        menuButton.setAttribute(
            "aria-label",
            "Abrir menú"
        );

    });

});


/* =========================================================
   ACTIVE NAV LINK
========================================================= */

const sections = document.querySelectorAll("section[id]");

let activeId = "";

function setActiveLink(id) {

    if (id === activeId) return;

    activeId = id;

    navLinks.forEach(link => {
        link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
    });

}

let sectionObserver = null;

function observeSections() {

    if (!("IntersectionObserver" in window)) return;

    if (sectionObserver) sectionObserver.disconnect();

    /* franja de 1px a 150px del borde superior: la sección que la cruza es la activa */
    const bottom = Math.max(window.innerHeight - 151, 0);

    sectionObserver = new IntersectionObserver(entries => {

        entries.forEach(entry => {
            if (entry.isIntersecting) setActiveLink(entry.target.id);
        });

    }, { rootMargin: `-150px 0px -${bottom}px 0px` });

    sections.forEach(section => sectionObserver.observe(section));

}

observeSections();

let resizeTimer;

window.addEventListener("resize", () => {

    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(observeSections, 200);

}, { passive: true });


/* =========================================================
   SCROLL REVEAL
========================================================= */

const elementsToReveal = document.querySelectorAll(
    ".section-header, .about-text, .about-stats, .skill-card, .project-card, .service, .reviews, .contact-box"
);

elementsToReveal.forEach(element => {

    element.classList.add("reveal");

});


function finishReveal(element) {

    /* ya no hace falta: libera la capa y devuelve el control de transform/transition */
    element.classList.remove("reveal", "visible");

}

if ("IntersectionObserver" in window) {

    const revealObserver = new IntersectionObserver(
        entries => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    const element = entry.target;

                    element.classList.add("visible");

                    revealObserver.unobserve(element);

                    setTimeout(() => finishReveal(element), 900);

                }

            });

        },
        {
            threshold: 0.12
        }
    );

    elementsToReveal.forEach(element => {
        revealObserver.observe(element);
    });

} else {

    /* navegadores sin IntersectionObserver: todo visible */
    elementsToReveal.forEach(finishReveal);

}


/* =========================================================
   CODE CURSOR
========================================================= */

/* el parpadeo del cursor se hace con CSS (@keyframes cursorBlink) */


/* =========================================================
   PROJECT HOVER EFFECT
========================================================= */

const projectCards =
    document.querySelectorAll(".project-card");

const canTilt =
    window.matchMedia &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (canTilt) {

    projectCards.forEach(card => {

        let rect = null;
        let frame = 0;
        let pointerX = 0;
        let pointerY = 0;

        function paint() {

            frame = 0;

            if (!rect) return;

            const x = pointerX - rect.left;
            const y = pointerY - rect.top;

            const rotateX = ((y / rect.height) - 0.5) * -3;
            const rotateY = ((x / rect.width) - 0.5) * 3;

            card.style.transform =
                `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;

        }

        card.addEventListener("mouseenter", () => {

            rect = card.getBoundingClientRect();

            card.classList.add("is-tilting");

        });

        card.addEventListener("mousemove", event => {

            pointerX = event.clientX;
            pointerY = event.clientY;

            if (!frame) frame = requestAnimationFrame(paint);

        }, { passive: true });

        card.addEventListener("mouseleave", () => {

            rect = null;

            if (frame) {
                cancelAnimationFrame(frame);
                frame = 0;
            }

            card.classList.remove("is-tilting");

            card.style.transform = "";

        });

    });

}


/* =========================================================
   CONTACT BUTTON
========================================================= */

const contactButtons =
    document.querySelectorAll('a[href="#contacto"]');


contactButtons.forEach(button => {

    button.addEventListener("click", () => {

        navMenu.classList.remove("open");

        menuButton.classList.remove("open");

        menuButton.setAttribute(
            "aria-expanded",
            "false"
        );

        menuButton.setAttribute(
            "aria-label",
            "Abrir menú"
        );

    });

});

/* =========================================================
   REVIEWS SLIDER
========================================================= */

const reviews = document.querySelector(".reviews");

if (reviews) {

    const track = reviews.querySelector(".reviews-track");
    const slides = reviews.querySelectorAll(".review-slide");
    const dotsBox = reviews.querySelector(".reviews-dots");

    let current = 0;


    /* ================= PUNTOS (barras de progreso) ================= */

    const dots = Array.from(slides).map((slide, index) => {

        const dot = document.createElement("button");

        dot.type = "button";
        dot.className = "reviews-dot";
        dot.setAttribute("aria-label", `Ir a la calificación ${index + 1}`);

        dot.addEventListener("click", () => goTo(index));

        /* cuando termina la barra (5 s) pasa a la siguiente */
        dot.addEventListener("animationend", event => {

            if (event.animationName === "reviewsProgress") {
                goTo(current + 1);
            }

        });

        dotsBox.appendChild(dot);

        return dot;

    });


    /* ================= IR A UNA SLIDE ================= */

    function goTo(index) {

        current = (index + slides.length) % slides.length;

        track.style.transform = `translateX(-${current * 100}%)`;

        slides.forEach((slide, n) => {
            slide.setAttribute("aria-hidden", n === current ? "false" : "true");
        });

        dots.forEach((dot, n) => {
            dot.classList.remove("is-active");
            dot.setAttribute("aria-current", n === current ? "true" : "false");
        });

        /* reinicia la animación de la barra */
        void dots[current].offsetWidth;

        dots[current].classList.add("is-active");

    }


    /* ================= FLECHAS ================= */

    document
        .getElementById("reviewsPrev")
        .addEventListener("click", () => goTo(current - 1));

    document
        .getElementById("reviewsNext")
        .addEventListener("click", () => goTo(current + 1));


    /* ================= SWIPE EN CELULAR ================= */

    let touchStartX = 0;

    reviews.addEventListener("touchstart", event => {
        touchStartX = event.changedTouches[0].clientX;
    }, { passive: true });

    reviews.addEventListener("touchend", event => {

        const diff = event.changedTouches[0].clientX - touchStartX;

        if (Math.abs(diff) > 50) {
            goTo(diff < 0 ? current + 1 : current - 1);
        }

    }, { passive: true });


    goTo(0);


    /* ================= PAUSA FUERA DE PANTALLA ================= */

    if ("IntersectionObserver" in window) {

        new IntersectionObserver(entries => {

            reviews.classList.toggle("is-offscreen", !entries[0].isIntersecting);

        }, { threshold: 0.05 }).observe(reviews);

    }

}