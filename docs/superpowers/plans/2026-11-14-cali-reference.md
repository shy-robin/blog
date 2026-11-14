# Reference-directed personal site redesign

**Goal:** Replace the previous small refinements with an obvious cali.so-inspired personal site, with the user's confirmed light/dark toggle.

**Approach:** Keep Next.js server-rendered content and existing routes. Use a compact introduction and writing index, a narrow ruled frame and a labeled bottom dock. Share semantic theme tokens across subpages; add only a small client theme switch and a pre-paint initializer.

## Tasks

- [x] Add behavior tests for theme initialization: persisted preference, OS fallback, invalid values and blocked storage.
- [x] Implement self-contained theme bootstrap and accessible persisted theme switch without external dependencies.
- [x] Replace shared shell/navigation, homepage composition and visual tokens; preserve all CMS content and site destinations.
- [x] Verify tests, types, lint and production build; inspect desktop/mobile in both themes, reload persistence, navigation, tags/search, focus, long content and footer clearance.
- [x] Record final screenshots and design checks; keep the requested local preview available.

## Boundaries

No copied reference-site assets or personal facts. No made-up article titles or project items. No design-number decoration. No backend migration or dependency installation. Use the live reference's narrow, quiet reading structure, adapting it to ShyRobin's writing and existing content.

## Verification result

- 21 tests pass under the existing Node 22 installation, including persisted/system/blocked-storage initialization and dual-theme code output.
- Final production build passes, including type validation and lint. Formatting and diff whitespace checks pass.
- Rendered desktop 1440px and mobile 390/320px checked in both themes. Bottom dock targets are 56×52px at390px and fit at320px. Theme persists on reload. Search no-results state works. Production dock navigation reached /about; direct route response was HTTP200.
- Independent code review found no blockers. Its storage-blocked, route-remount edge case was addressed by keeping the explicit-choice flag in the client module. Browser storage-blocked tests were interrupted by development hot reload; initializer fallback has unit coverage, while the full blocked-storage/media-change route sequence is not claimed as completed.
- Light text contrast was checked against background and surface; muted token was darkened to #6b685f to clear4.5:1 on the secondary surface.
- Production screenshots retained in /private/tmp/shyrobin-cali-{light,dark}-desktop.png and /private/tmp/shyrobin-cali-dark-mobile.png.
- Test browser and reference sessions closed. Automation URL-wait stalled despite reaching /about; its dedicated browser process was terminated. Local production preview remains on http://localhost:3107, owned by this task. No dependencies installed; CMS unchanged.
