# CivicFix — Civic Issue Reporting & Management Platform (HTML / CSS / JavaScript)

## Project Overview
**CivicFix** is a web-based civic issue reporting and municipal management application built with **HTML5**, **CSS3** (tactile neumorphic design system with Light/Dark mode), and **Vanilla JavaScript**.

## Folder Structure (Easy to Present & Explain)
- `index.html` — Semantic HTML5 structure, modals (Confirmation, Lightbox, Config), and root container.
- `css/styles.css` — Custom CSS variables for the warm cream (`#F3EDE2`), deep teal (`#124E4B`), and bordo (`#6C151E`) palette, tactile raised/inset shadows, dark mode tokens, and focus accessibility rings.
- `js/app.js` — Modular JavaScript divided into clear sections:
  1. **Domain Constants & Semantic Badges**: Categories (`ROAD_DAMAGE`, `GARBAGE_ACCUMULATION`, `DRAINAGE_PROBLEMS`, `WATERLOGGING`, `BROKEN_STREETLIGHTS`, `WATER_SUPPLY`, `OTHER`), Statuses, and Priorities.
  2. **Persistent Storage (`localStorage`)**: Stores reports, images, status history (`report_updates`), and citizen notifications across page reloads.
  3. **Security & Validation**: Binary magic-byte signature verification for JPEG/PNG/WebP uploads, coordinate bounds validation (`-90..90` / `-180..180`), idempotency keys, and enforced workflow transitions (`SUBMITTED` -> `UNDER_REVIEW` -> `IN_PROGRESS` -> `RESOLVED`).
  4. **Interactive Map & Charts**: Leaflet map integration with GPS detection and Chart.js analytics.
  5. **Citizen & Admin Views**: 4-step report submission wizard, Public Explorer, Citizen Dashboard, Admin Complaint Management, and Analytics.

## How to Run Locally or Host on GitHub Pages
1. **Run Locally**: Open `index.html` directly in Chrome/Edge, or use VS Code **Live Server**.
2. **Host on GitHub Pages**:
   - Push this folder to a GitHub repository.
   - Go to **Settings -> Pages -> Deploy from branch (`main` / root)** — your live website URL will be ready in under a minute.
