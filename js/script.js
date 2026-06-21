const lang = document.documentElement.lang;
const suffix = lang === "en" ? "-en" : "";

// Komponenten gleichzeitig laden
Promise.all([
    loadComponent("header", `components/header${suffix}.html`),
    loadComponent("footer", `components/footer${suffix}.html`)
]);

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
                initializeThemeToggle();
            }
        }

    } catch (error) {
        console.error(`Komponente ${path} konnte nicht geladen werden`, error);
    }
}

// Aktuelle Seite im Header markieren
function initializeCurrentPage() {
    const currentPage = window.location.pathname.split("/").pop() || "index.html";
    const navLinks = document.querySelectorAll('.navbar a:not([href^="mailto:"])');

    navLinks.forEach(link => {
        const href = link.getAttribute("href");

        if (href === currentPage) {
            link.setAttribute("aria-current", "page");
        } else {
            link.removeAttribute("aria-current");
        }
    });
}

// Sprachumschalter initialisieren
function initializeLanguageSwitcher() {
    const languageSelect = document.getElementById("language-select");
    if (!languageSelect) return;

    const currentLang = document.documentElement.lang;
    const currentPage = window.location.pathname.split("/").pop() || "index.html";

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

    const translatedPage = translations[currentPage];
    if (!translatedPage) return;

    languageSelect.innerHTML = currentLang === "de"
        ? `<option value="${currentPage}" selected>DE</option><option value="${translatedPage}">EN</option>`
        : `<option value="${translatedPage}">DE</option><option value="${currentPage}" selected>EN</option>`;

    languageSelect.addEventListener("change", () => {
        window.location.href = languageSelect.value;
    });
}

/* DARK MODE TOGGLE */
const rootElement = document.documentElement;

function setTheme(theme) {
    rootElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
}

// Sofortige Erkennung
const savedTheme = localStorage.getItem('theme');
const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

if (savedTheme) {
    setTheme(savedTheme);
} else {
    setTheme(systemPrefersDark ? 'dark' : 'light');
}

function initializeThemeToggle() {
    const toggleButton = document.getElementById('theme-toggle');
    if (!toggleButton) return;

    toggleButton.addEventListener('click', () => {
        const currentTheme = rootElement.getAttribute('data-theme');
        setTheme(currentTheme === 'dark' ? 'light' : 'dark');
    });
}

/* TIC TAC TOE LOGIK */
document.addEventListener("DOMContentLoaded", initializeTicTacToe);

function initializeTicTacToe() {
    const gameGrid = document.getElementById("game-grid");
    if (!gameGrid) return;

    const cells = document.querySelectorAll(".cell");
    const statusDisplay = document.getElementById("game-status");
    const resetButton = document.getElementById("reset-game");

    const isEn = document.documentElement.lang === "en";
    const texts = {
        turn: isEn ? "Player {player} is next" : "Spieler {player} ist am Zug",
        win: isEn ? "Player {player} has won!" : "Spieler {player} hat gewonnen!",
        draw: isEn ? "It's a draw!" : "Unentschieden!",
        cellEmpty: isEn ? "Cell {num}, empty" : "Feld {num}, leer",
        cellFilled: isEn ? "Cell {num}, Player {player}" : "Feld {num}, Spieler {player}"
    };

    let currentPlayer = "X";
    let gameState = ["", "", "", "", "", "", "", "", ""];
    let gameActive = true;

    const winningConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    gameGrid.addEventListener("click", (e) => {
        const clickedCell = e.target;

        // Nur auf Zellen reagieren, wenn das Spiel aktiv ist
        if (!clickedCell.classList.contains("cell") || !gameActive) return;

        const clickedCellIndex = parseInt(clickedCell.getAttribute("data-index"));
        if (gameState[clickedCellIndex] !== "") return;

        // Zustand aktualisieren
        gameState[clickedCellIndex] = currentPlayer;
        clickedCell.textContent = currentPlayer;
        clickedCell.classList.add(currentPlayer.toLowerCase());

        // Barrierefreiheit aktualisieren
        const cellNum = clickedCellIndex + 1;
        clickedCell.setAttribute(
            "aria-label",
            texts.cellFilled.replace("{num}", cellNum).replace("{player}", currentPlayer)
        );

        checkForResults();
    });


    // Überprüfen der Gewinnbedingungen
    function checkForResults() {
        let roundWon = false;

        for (let condition of winningConditions) {
            let a = gameState[condition[0]];
            let b = gameState[condition[1]];
            let c = gameState[condition[2]];

            if (a && a === b && b === c) {
                roundWon = true;
                break;
            }
        }
        // Sieg oder Unentschieden prüfen
        if (roundWon) {
            statusDisplay.textContent = texts.win.replace("{player}", currentPlayer);
            gameActive = false;
            return;
        }

        if (!gameState.includes("")) {
            statusDisplay.textContent = texts.draw;
            gameActive = false;
            return;
        }

        currentPlayer = currentPlayer === "X" ? "O" : "X";
        statusDisplay.textContent = texts.turn.replace("{player}", currentPlayer);
    }

    function resetGame() {
        currentPlayer = "X";
        gameState = ["", "", "", "", "", "", "", "", ""];
        gameActive = true;
        statusDisplay.textContent = texts.turn.replace("{player}", currentPlayer);

        cells.forEach(cell => {
            cell.textContent = "";
            cell.className = "cell";
            const cellNum = parseInt(cell.getAttribute("data-index")) + 1;
            cell.setAttribute("aria-label", texts.cellEmpty.replace("{num}", cellNum));
        });
    }

    if (resetButton) {
        resetButton.addEventListener("click", resetGame);
    }
}