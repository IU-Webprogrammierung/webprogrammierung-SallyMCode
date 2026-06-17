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
                initializeThemeToggle();
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


/* DARK MODE TOGGLE  */

const rootElement = document.documentElement;

// 1. Theme auf dem HTML-Tag und im Speicher setzen
function setTheme(theme) {
    rootElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
}

// 2. Sofortige Erkennung beim Laden der JS-Datei
const savedTheme = localStorage.getItem('theme');
const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

if (savedTheme) {
    setTheme(savedTheme);
} else if (systemPrefersDark) {
    setTheme('dark');
} else {
    setTheme('light');
}

// 3. Diese Funktion wird erst aufgerufen, wenn der Button im DOM existiert
function initializeThemeToggle() {
    const toggleButton = document.getElementById('theme-toggle');
    
    if (!toggleButton) {
        return; // Sicherheitscheck, falls der Button fehlt
    }

    toggleButton.addEventListener('click', () => {
        const currentTheme = rootElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
    });
}

/*  TIC TAC TOE LOGIK */

document.addEventListener("DOMContentLoaded", () => {
    initializeTicTacToe();
});

function initializeTicTacToe() {
    const gameGrid = document.getElementById("game-grid");
    
    // Wichtig: Nur ausführen, wenn auf der Spielseite
    if (!gameGrid) return;

    const cells = document.querySelectorAll(".cell");
    const statusDisplay = document.getElementById("game-status");
    const resetButton = document.getElementById("reset-game");

    // Übersetzungen basierend auf der HTML-Sprache definieren
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

    // Alle Gewinnkombinationen (Indizes im Spielfeld)
    const winningConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Horizontal
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Vertikal
        [0, 4, 8], [2, 4, 6]             // Diagonal
    ];

    function handleCellClick(e) {
        const clickedCell = e.target;
        const clickedCellIndex = parseInt(clickedCell.getAttribute("data-index"));

        // Ignorieren, wenn das Feld belegt oder das Spiel vorbei ist
        if (gameState[clickedCellIndex] !== "" || !gameActive) {
            return;
        }

        // Zustand aktualisieren
        gameState[clickedCellIndex] = currentPlayer;
        clickedCell.textContent = currentPlayer;
        clickedCell.classList.add(currentPlayer.toLowerCase()); // Für CSS-Styling (z.B. andere Farben für X und O)

        // Barrierefreiheit: ARIA-Label der Zelle für Screenreader aktualisieren
        const cellNum = clickedCellIndex + 1;
        clickedCell.setAttribute(
            "aria-label", 
            texts.cellFilled.replace("{num}", cellNum).replace("{player}", currentPlayer)
        );

        checkForResults();
    }

    function checkForResults() {
        let roundWon = false;

        for (let i = 0; i < winningConditions.length; i++) {
            const winCondition = winningConditions[i];
            let a = gameState[winCondition[0]];
            let b = gameState[winCondition[1]];
            let c = gameState[winCondition[2]];

            if (a === "" || b === "" || c === "") {
                continue;
            }
            if (a === b && b === c) {
                roundWon = true;
                break;
            }
        }

        if (roundWon) {
            statusDisplay.textContent = texts.win.replace("{player}", currentPlayer);
            gameActive = false;
            return;
        }

        // Unentschieden prüfen (keine leeren Felder mehr)
        let roundDraw = !gameState.includes("");
        if (roundDraw) {
            statusDisplay.textContent = texts.draw;
            gameActive = false;
            return;
        }

        // Spieler wechseln
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
            cell.className = "cell"; // Setzt zusätzliche Klassen (x / o) zurück
            
            const cellNum = parseInt(cell.getAttribute("data-index")) + 1;
            cell.setAttribute("aria-label", texts.cellEmpty.replace("{num}", cellNum));
        });
    }

    // Event Listener registrieren
    cells.forEach(cell => cell.addEventListener("click", handleCellClick));
    resetButton.addEventListener("click", resetGame);
}