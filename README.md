# Webprogrammierung – Portfolio

**Projekt:** Web-Programmierung (IU Internationale Hochschule)

Dieses Projekt ist ein persönliches Portfolio, das im Rahmen des Studienfachs Webprogrammierung entwickelt wurde. Es dient dazu, einen kompakten Eindruck von mir als Person, meinen Projekten und meinen Fähigkeiten zu vermitteln.

Das Portfolio umfasst insgesamt sieben responsive Seiten:
- **Home** (Willkommensseite)
- **Lebenslauf**
- **Blog**
- **Auf Reisen**
- **Fotografien**
- **GitHub-Projekte**
- **Browsergame** (Tic Tac Toe)

## Tech-Stack

- **HTML5:** Semantische Struktur, native `<picture>`-Elemente für Art-Direction & Performance sowie ARIA-Barrierefreiheit (ARIA-Rollen).
- **CSS3:** Fortgeschrittenes CSS mit Custom Properties (Variablen), CSS-Grid & Flexbox sowie modernen Selektoren (wie `:has()` und `:focus-visible`).
- **JavaScript (Vanilla JS):** Asynchrone Komponenten-Architektur (`Fetch API`, `Promises`), clientseitige Spiellogik, zustandsbasiertes State-Management über die Web Storage API und dynamische Steuerung der Barrierefreiheit (a11y).

## Features & Technische Highlights

### JavaScript-Architektur & Performance
- **Asynchrones Komponenten-Laden:** Nutzung von `Promise.all()` und der `Fetch API`, um wiederkehrende Layout-Elemente (`header.html`, `footer.html`) modular nachzuladen. Das verhindert Redundanz im HTML-Code und erleichtert die Wartung.
- **Speicherung von Nutzerpräferenzen:** Vollständige Persistenz durch die Web Storage API (`localStorage`). Gewählte Sprachen und Oberflächen-Designs (Dark Mode) bleiben auch nach dem Schließen des Browsers für den nächsten Besuch erhalten.
- **Intelligente System-Erkennung:** Nutzung von `window.matchMedia`, um das bevorzugte Farbschema des Betriebssystems (`prefers-color-scheme`) direkt beim ersten Seitenaufruf automatisch zu spiegeln.
- **Ressourcenschonende Event-Delegation:** Die Klick-Erkennung des Tic-Tac-Toe-Spiels läuft performant über einen einzigen Event-Listener auf dem übergeordneten Grid-Element, statt Event-Listener auf alle 9 Felder einzeln zu verteilen.

### Internationalisierung (i18n) & Screenreader-Sync
- **Dynamische Sprachauswahl:** Vollständige, nahtlose Sprachumschaltung zwischen Deutsch und Englisch zur Laufzeit.
- **Dynamisches DOM-Attribut-Mapping:** Die zentrale Übersetzungsfunktion steuert über `data-i18n`-Attribute nicht nur den sichtbaren Text, sondern übersetzt im selben Zug `alt`-Attribute für Bilder, `title`-Attribute für Tooltips und `aria-label`-Attribute für Screenreader.
- **Echtzeit-Sprachübergabe an Assistenztechnologien:** Beim Sprachwechsel modifiziert das Skript das HTML-Sprachattribut (`document.documentElement.lang`) zur Laufzeit. Screenreader passen ihre Sprachausgabe dadurch ohne Seiten-Reload sofort fehlerfrei an die korrekte Aussprache an.

### Barrierefreiheit & UX (Accessibility)
- **Fokus auf Barrierefreiheit:** Optimiert für Screenreader durch semantische ARIA-Rollen und vollständige Tastaturbedienbarkeit.
- **Tastatur-Fokus-Indikator:** Ästhetischer, nativer Fokus-Ring mittels `:focus-visible`, der sich nur bei echter Tastaturnavigation aktiviert und störende Outlines bei Mausklicks verhindert.
- **Skip-Link & Visuell versteckte Elemente:** Barrierefreie Navigation für Screenreader-Nutzer durch einen versteckten Sprunglink ("Zum Inhalt springen"), der erst bei Fokus eingeblendet wird.
- **Rücksicht auf `prefers-reduced-motion`:** Einbindung von Smooth-Scrolling (weiches Scrollen) und beweglichem Back-To-Top-Button, ohne es den NutzerInnen aufzuzwingen. Vollständige Deaktivierung aller CSS-Animationen, Transformationen und des weichen Scrollverhaltens (`scroll-behavior: auto`), falls dies in den Systemeinstellungen des Betriebssystems festgelegt wurde.

### Barrierefreies Game-Design (Tic Tac Toe)
- **Live-Zustandsansage für Screenreader:** Leere Spielfelder sind initial barrierefrei benannt (z. B. *"Feld 3, leer"*). Sobald ein Zug erfolgt, baut JavaScript das Attribut dynamisch um (z. B. *"Feld 3, Spieler X"*), wodurch der Spielverlauf für sehbehinderte Menschen lückenlos auditiv nachvollziehbar wird.
- **Sprachadaptives Gameplay:** Die Spiellogik liest den aktuellen globalen Sprachcode aus und passt sämtliche Statusmeldungen (Spielzüge, Sieg- und Unentschieden-Meldungen) dynamisch an das aktive Sprachpaket an.

### Dynamisches Theme-System (Dark Mode)
- **Zentralisierte CSS-Variablen:** Auswählbares, kontrastreiches Farbschema für angenehme Lesbarkeit. Der Wechsel aller Systemfarben erfolgt nahtlos über ein `[data-theme="dark"]`-Attribut auf dem Root-Element.
- **Visueller Blendschutz:** Das CSS dunkelt Fotos im Dunkelmodus automatisch ab und passt den Kontrast über Bildfilter (`brightness()` / `contrast()`) an, um Blendeffekte zu minimieren.
- **Ressourcensparende Vektorgrafiken:** Farbinvertierung nativer SVG-Icons im Dark Mode via `filter: invert(1)` ohne zusätzliche HTTP-Requests oder Bilddateien.

### Flexibles & Responsives Layout
- **Optimierte Darstellung:** Responsives Design, das sich fließend vom Smartphone bis zum Desktop anpasst.
- **Eltern-Gestaltung mit `:has()`:** Moderne Strukturierung ohne JavaScript-Hilfen – das CSS erkennt über den `:has()`-Selektor, welche Unterseite aktiv ist, und passt die Grid-Aufteilung des Layouts dynamisch an.
- **Stufenlose Skalierung:** Nutzung von `clamp()` und CSS-Grid-Systemen für das Tic-Tac-Toe-Spielfeld, um auf allen Displays gleichermaßen perfekt und formstabil zu skalieren.
- **Glassmorphism & Fehlerseite:** Eine individuell gestaltete 404-Fehlermeldung, die mithilfe von `backdrop-filter: blur()` eine semitransparente Glaskachel über dem Hintergrund erzeugt.
- **Strategische Breakpoints:** Zielgerichtete Medienabfragen (`@media`) bei **480px** (Mobile Optimierung der Navigation), **768px** (Wechsel von Ein- auf Mehrspaltigkeit auf Home und Fotografien) und **1024px** (Desktop-Ausrichtung mit maximaler Inhaltsbreite), um auf allen Endgeräten ein konsistentes Layout zu garantieren.

### Medien & Assets
- **Optimiertes Laden von Bildern:** Bereitstellung von Bildformaten in **AVIF**, **WebP** und **JPG** über das HTML5-`<picture>`-Tag für bestmögliche Kompression und Performance.
- **Intelligente Lade-Priorisierung:** Ressourcenschonende Aufteilung der Bilddaten durch gezielten Einsatz von `fetchpriority="high"` (für sofort sichtbare Above-the-Fold-Inhalte) und nativem `loading="lazy"` (für untergeordnete Elemente im Scrollbereich).
- **Favicon:** Integration eines passenden, lizenzfreien Favicons für die Browser-Tabs.

## Git-Workflow
Um eine saubere und nachvollziehbare Versionshistorie zu garantieren, wurde ein strukturierter Git-Workflow angewendet:
- **Feature-Branch-Modell:** Entwicklung neuer Features (z. B. `feature/darkmode`, `feature/i18n`) isoliert auf eigenen Branches, um den `main`-Branch stabil zu halten.
- **Aussagekräftige Commits:** Einhaltung von klaren Commit-Nachrichten zur Dokumentation der Entwicklungsschritte.

## Refactoring
- **CSS-Größenangaben:** Im CSS wurden die Größenangaben in rem und em-Angaben abgewandelt. 
- **HTML-Korrekturen:** HTML-Anker wurden korrigiert und IDs angepasst. 
- **Vermeidung von Redundanz:** Redundanter Code wurde möglichst reduziert bzw. entfernt. 

## Zentrale Erkenntnisse & Errungenschaften
Im Zuge der Entwicklung wurden wertvolle methodische und technische Erkenntnisse gewonnen:
- **Modulorganisation ohne Frameworks:** Die größte Errungenschaft war der Verzicht auf aufgeblähte JS-Bibliotheken. Das asynchrone Laden von HTML-Komponenten über native Web-APIs hat gezeigt, wie performant und modular moderne Vanilla-JS-Architekturen sein können.
- **Barrierefreiheit als Fundament:** Barrierefreiheit (a11y) ist kein "Add-on", sondern muss von Anfang an mitgedacht werden. Das Zusammenspiel aus reduzierter Bewegung (`prefers-reduced-motion`), durchdachter Tastaturfokus-Führung (`:focus-visible`) und der dynamischen ARIA-Sprachsynchronisation hat das Bewusstsein für inklusives Webdesign massiv geschärft.
- **Saubere State-Trennung:** Die persistente Speicherung von Nutzerpräferenzen im LocalStorage in Kombination mit CSS-Custom-Properties hat verdeutlicht, wie elegant die Trennung von Logik (JS) und Design (CSS) gelöst werden kann.

## Projekt starten
Da das Projekt ohne schweres Backend auskommt, kann es einfach repliziert werden:
1. Repository klonen: `git clone https://github.com/SallyMCode/webprogrammierung-SallyMCode.git`
2. Die `index.html` direkt in einem beliebigen Browser öffnen.

## Verwendete Hilfen & Quellen
- **Icons:** [Play Button by Freepik]; Favicon von www.svgrepo.com/collection/nature-flat-icons/ und Formatanpassungen mit realfavicongenerator.net
- **Bild:** https://pixabay.com/de/illustrations/nicht-gefunden-webseite-error-seite-1770320/ von xiaxinghai auf pixabay.com
- **Dokumentation & Lerninhalte:** [W3Schools](https://www.w3schools.com/)