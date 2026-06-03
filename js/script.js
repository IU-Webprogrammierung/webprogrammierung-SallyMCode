const lang = document.documentElement.lang;
const suffix = lang === "en" ? "-en" : "";

loadComponent("header", `components/header${suffix}.html`);
loadComponent("footer", `components/footer${suffix}.html`);

async function loadComponent(selector, path) {
    try {
        const response = await fetch(path);

        if (!response.ok) {
            throw new Error(`Fehler ${response.status}`);
        }

        const html = await response.text();

        const element = document.querySelector(selector);

        if (element) {
            element.innerHTML = html;

            // Header initialisieren
            if (selector === "header") {
                initializeLanguageSwitcher();
                initializeCurrentPage();
            }
        }

    } catch (error) {
        console.error(
            `Komponente ${path} konnte nicht geladen werden`,
            error
        );
    }
}

function initializeCurrentPage() {

    const currentPage =
        window.location.pathname.split("/").pop() || "index.html";

    const navLinks = document.querySelectorAll(
        '.navbar a:not([href^="mailto:"])'
    );

    navLinks.forEach(link => {

        const href = link.getAttribute("href");

        if (href === currentPage) {
            link.setAttribute("aria-current", "page");
        } else {
            link.removeAttribute("aria-current");
        }

    });
}

function initializeLanguageSwitcher() {

    const languageSelect =
        document.getElementById("language-select");

    if (!languageSelect) {
        return;
    }

    const currentLang =
        document.documentElement.lang;

    const translations = {
        "index.html": "index-en.html",
        "blog.html": "blog-en.html",
        "lebenslauf.html": "cvitae.html",
        "fotografien.html": "photography.html",
        "reiseberichte.html": "travel-reports.html",
        "github.html": "github-en.html",
        "game.html": "game-en.html",

        "index-en.html": "index.html",
        "blog-en.html": "blog.html",
        "cvitae.html": "lebenslauf.html",
        "photography.html": "fotografien.html",
        "travel-reports.html": "reiseberichte.html",
        "github-en.html": "github.html",
        "game-en.html": "game.html"
    };

    const currentPage =
        window.location.pathname.split("/").pop() || "index.html";

    const translatedPage =
        translations[currentPage];

    if (!translatedPage) {
        return;
    }

    if (currentLang === "de") {

        languageSelect.innerHTML = `
            <option value="${currentPage}" selected>DE</option>
            <option value="${translatedPage}">EN</option>
        `;

    } else {

        languageSelect.innerHTML = `
            <option value="${translatedPage}">DE</option>
            <option value="${currentPage}" selected>EN</option>
        `;

    }

    languageSelect.addEventListener("change", () => {
        window.location.href = languageSelect.value;
    });
}