/* =========================================================
   NAVBAR
========================================================= */

const navbar = document.querySelector(".navbar");

window.addEventListener("scroll", () => {

    if (window.scrollY > 30) {
        navbar.classList.add("scrolled");
    } else {
        navbar.classList.remove("scrolled");
    }

});


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

window.addEventListener("scroll", () => {

    let currentSection = "";

    sections.forEach(section => {

        const sectionTop = section.offsetTop - 150;
        const sectionHeight = section.offsetHeight;

        if (
            window.scrollY >= sectionTop &&
            window.scrollY < sectionTop + sectionHeight
        ) {

            currentSection = section.getAttribute("id");

        }

    });


    navLinks.forEach(link => {

        link.classList.remove("active");

        if (
            link.getAttribute("href") ===
            `#${currentSection}`
        ) {

            link.classList.add("active");

        }

    });

});


/* =========================================================
   SCROLL REVEAL
========================================================= */

const elementsToReveal = document.querySelectorAll(
    ".section-header, .about-text, .about-stats, .skill-card, .project-card, .service, .reviews, .contact-box"
);

elementsToReveal.forEach(element => {

    element.classList.add("reveal");

});


const revealObserver = new IntersectionObserver(
    entries => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                entry.target.classList.add("visible");

                revealObserver.unobserve(entry.target);

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


/* =========================================================
   CODE CURSOR
========================================================= */

const cursor = document.querySelector(".cursor");

if (cursor) {

    let cursorVisible = true;

    setInterval(() => {

        cursorVisible = !cursorVisible;

        cursor.style.opacity =
            cursorVisible ? "1" : "0";

    }, 500);

}


/* =========================================================
   PROJECT HOVER EFFECT
========================================================= */

const projectCards =
    document.querySelectorAll(".project-card");


projectCards.forEach(card => {

    card.addEventListener("mousemove", event => {

        const rect = card.getBoundingClientRect();

        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const rotateX =
            ((y / rect.height) - 0.5) * -3;

        const rotateY =
            ((x / rect.width) - 0.5) * 3;

        card.style.transform =
            `perspective(1000px)
             rotateX(${rotateX}deg)
             rotateY(${rotateY}deg)
             translateY(-5px)`;

    });


    card.addEventListener("mouseleave", () => {

        card.style.transform = "";

    });

});


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

}