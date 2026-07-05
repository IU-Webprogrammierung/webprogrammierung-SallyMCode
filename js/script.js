let currentLang = localStorage.getItem("selectedLanguage") || "de";

// Komponenten laden
Promise.all([
    loadComponent("header", "components/header.html"),
    loadComponent("footer", "components/footer.html")
]);

async function loadComponent(selector, path) {
    try {
        const response = await fetch(path);
        if (!response.ok) throw new Error(`Fehler ${response.status}`);

        const html = await response.text();
        const element = document.querySelector(selector);

        if (element) {
            element.innerHTML = html;

            if (selector === "header") {
                initializeLanguageSwitcher();
                initializeCurrentPage();
                initializeThemeToggle();
                applyTranslations(currentLang);
            }
        }
    } catch (error) {
        console.error(`Komponente ${path} konnte nicht geladen werden`, error);
    }
}

// Die zentrale Übersetzungsfunktion
async function applyTranslations(langCode) {
    try {
        const response = await fetch(`lang/${langCode}.json`);
        if (!response.ok) return;

        const translations = await response.json();

        // DOM-Elemente übersetzen
        document.querySelectorAll("[data-i18n]").forEach(el => {
            const key = el.getAttribute("data-i18n");
            if (translations[key]) el.textContent = translations[key];
        });

        document.querySelectorAll("[data-i18n-alt]").forEach(el => {
            const key = el.getAttribute("data-i18n-alt");
            if (translations[key]) el.setAttribute("alt", translations[key]);
        });

        document.querySelectorAll("[data-i18n-title]").forEach(el => {
            const key = el.getAttribute("data-i18n-title");
            if (translations[key]) el.setAttribute("title", translations[key]);
        });

        document.querySelectorAll("[data-i18n-aria]").forEach(el => {
            const key = el.getAttribute("data-i18n-aria");
            if (translations[key]) el.setAttribute("aria-label", translations[key]);
        });

        if (translations["page_title"]) document.title = translations["page_title"];
        
        // Das lang-Attribut im HTML-Tag für Screenreader anpassen
        document.documentElement.lang = langCode;
        localStorage.setItem("selectedLanguage", langCode);
        currentLang = langCode;

    } catch (error) {
        console.error("Fehler beim Laden der Sprachdatei:", error);
    }
}

// Sprachumschalter neu aufbauen
function initializeLanguageSwitcher() {
    const languageSelect = document.getElementById("language-select");
    if (!languageSelect) return;

    // dropdown auf den gespeicherten Wert setzen
    languageSelect.value = currentLang;

    // Beim Umschalten wird die Übersetzungsfunktion aufgerufen
    languageSelect.addEventListener("change", (e) => {
        applyTranslations(e.target.value);
        
        // Tic-Tac-Toe Zustand anpassen, falls das Spiel auf der Seite aktiv ist
        if (typeof initializeTicTacToe === "function" && document.getElementById("game-grid")) {
            initializeTicTacToe(); 
        }
    });
}

// Aktuelle Seite im Header markieren
function initializeCurrentPage() {
    const currentPage = window.location.pathname.split("/").pop() || "index.html";
    const navLinks = document.querySelectorAll('.navbar a:not([href^="mailto:"])');

    navLinks.forEach(link => {
        if (link.getAttribute("href") === currentPage) {
            link.setAttribute("aria-current", "page");
        } else {
            link.removeAttribute("aria-current");
        }
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
initializeTicTacToe();

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

        if (!clickedCell.classList.contains("cell") || !gameActive) return;

        const clickedCellIndex = parseInt(clickedCell.getAttribute("data-index"));
        if (gameState[clickedCellIndex] !== "") return;

        gameState[clickedCellIndex] = currentPlayer;
        clickedCell.textContent = currentPlayer;
        clickedCell.classList.add(currentPlayer.toLowerCase());

        const cellNum = clickedCellIndex + 1;
        clickedCell.setAttribute(
            "aria-label",
            texts.cellFilled.replace("{num}", cellNum).replace("{player}", currentPlayer)
        );

        checkForResults();
    });

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