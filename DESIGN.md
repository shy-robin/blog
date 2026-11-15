# Personal site visual system

Reference-directed redesign of the existing site following the user's request to borrow cali.so's style, with their confirmed light/dark switch. Replaces the previous large blue hero and wide layout.

## Layout and hierarchy

A narrow, centered personal page (680px outer column) with fine vertical boundary rules. The article index is the default entry; `/` permanently redirects to `/posts`, preserving query parameters. Personal introduction, blog purpose, project links and RSS subscription live together on the about page. There is no separate home page. Subpages share this frame. A fixed bottom dock carries four labeled destinations and a theme switch. Reserve bottom space and safe-area inset so it never hides content or keyboard focus.

No fabricated shelves, music collection, biography, portraits or project counts. Render only real published content; section labels describe content rather than arbitrary sequence numbers.

## Tokens

User-selected palette: One Light for light mode, One Dark for dark mode. Layout and typography continue to follow the cali.so reference.

One Light: background #fafafa, foreground #383a42, muted #626772, surface #eaeaeb, line #dbdbdc, focus #4078f2. Link/button accent #2f63cb is a darker blue for readable small text; selection #e5e5e6 with #383a42 text.

One Dark: background #282c34, foreground #abb2bf, muted #939baa, surface #21252b, line #3e4451, accent/focus #61afef. Selection #3e4451 with #d7dae0 text. Secondary text is brighter than syntax comments so article dates and navigation remain readable.

All interface surfaces use semantic CSS variables, including forms, tags, empty states, code surrounds, focus, selection and the dock. Code blocks use Shiki's bundled `one-light` / `one-dark-pro` themes with CSS-variable switching. No external font or theme dependency is added.

Palette sources: [One Light](https://github.com/atom/one-light-syntax/blob/master/styles/colors.less), [One Dark](https://github.com/atom/one-dark-syntax/blob/master/styles/colors.less), and the installed Shiki themes' VS Code UI color maps.

## Typography

Existing self-hosted Geist and Chinese system fallback match the quiet contemporary reference. Utility text is 12–13px; the about page carries the personal introduction. Article list titles are 20px on desktop and 18px on mobile. Inner article bodies use 16px on desktop and 15px on mobile, with a 2.0 line height. Monospace only for dates, counts and code.

Reading refinements retain the narrow frame and existing content. List excerpts are limited to three lines; full text stays on the article page. Article tags use quiet text links with 44px touch targets. On phones, filter tags form one horizontally scrollable row so the writing remains near the top of the page. Quotes and the table of contents use a subtle semantic surface (#f3f3f4 / #2c313a); code blocks scroll internally and never widen the page.

## Interaction

Writing routes share their shell through the posts layout. A route loading boundary shows a static, accessible article placeholder while server content is pending; it does not animate or block navigation. The dock prefetches the writing index and its data in production so the primary destination can be ready before a tap. Network delays can still occur on cold or uncached requests.

The writing index fetches 12 articles per page from Sanity. Search and tag filters run before the server-side slice; counts and tag metadata are fetched separately from article records. Page links preserve search and tags, while changing either filter resets to page one. The first page omits `page=1`; out-of-range pages redirect to the last available page. Each unfiltered page has its own canonical URL. On mobile, previous/next links sit above the compact page-number row with 44px targets. Pagination links do not prefetch other pages automatically.

44px minimum navigation and theme targets, visible keyboard outline, native links and preserved skip link. Light/dark follows system preference until explicitly chosen; persist explicit choice when storage is available. Apply theme before paint. With storage blocked, switching still works in memory. Respect reduced motion.

The bottom navigation is a compact 54px-high capsule with 44×44px targets. Three regions are separated by two 1px vertical rules: the author's 28px avatar linking to `/about`, the two page links (writing, projects), and display settings (theme switch). Use the real Sanity profile avatar without a background or decorative ring; missing or failed images fall back to the author's initial without inventing a portrait. The about page marks the avatar destination, not a duplicate page icon.

Following the user's cali.so reference, icons use precise rounded 1.5px strokes and quiet duotone fills. Route names appear as tooltips for fine-pointer hover or keyboard focus and remain accessible names on every link. Touch taps do not show hover tooltips. A 4px accent dot below the icon (or avatar on the about page) marks only the actual route through aria-current; navigation targets have no selected background. Icons and avatar have restrained interaction feedback. Reduced-motion mode removes spatial transitions while preserving visible state and keyboard focus. Palette and page layout stay unchanged.
