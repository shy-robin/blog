# Homepage refinement implementation plan

**Goal:** Execute the four homepage critique recommendations and amplify the existing personal writing identity, then repeat the independent critique.

**Architecture:** Preserve Next.js server rendering, live CMS content, the existing light blue palette and shared blog shell. Refine the homepage composition and improve shared link hit areas; keep other pages' content and hierarchy intact.

**Scope approved in conversation:** All four recommendations, stronger personal identity, execute together. No invented article content or CMS writes.

## Tasks

- [x] Refine `src/app/page.tsx` and homepage CSS into a compact editorial composition: existing headline, blue emphasis, author introduction beside it on desktop and below on mobile. Remove generic eyebrow and redundant archive CTA; link directly to latest writing.
- [x] Improve shared navigation, article arrow and tag hit areas to at least 44px. Ensure header fits 320px via responsive wrapping and preserve standard links, focus and reduced-motion behavior.
- [x] Use an authored SVG for internal arrow links. Allow homepage article headings to be h3 without changing archive h2 headings. Preserve titles, dates, tags and all article destinations.
- [x] Clarify error recovery without blaming the visitor's network; provide an independent about-page destination.
- [x] Run existing tests, TypeScript, lint, formatting and production build. Inspect rendered homepage at 320/390/768/1440px, keyboard flow, article/tag navigation and shared archive/about pages. No extra implementation-mirroring tests for CSS refinements.
- [x] Run independent critique A/B using the same heuristic set as the baseline, persist the result and trend, and stop temporary services. Treat test content as an unresolved editorial task.

## Review focus

Small viewports and 200% text enlargement must retain navigation and avoid horizontal overflow. Very long titles/tags must wrap without overlapping the arrow. Empty CMS results must keep a useful state. Shared post lists must retain correct heading levels on archives. No additional browser JavaScript or external font requests.
