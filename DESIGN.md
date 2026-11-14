# Personal site visual system

Reference-directed redesign of the existing site following the user's request to borrow cali.so's style, with their confirmed light/dark switch. Replaces the previous large blue hero and wide layout.

## Layout and hierarchy

A narrow, centered personal page (680px outer column) with fine vertical boundary rules. Compact identity, readable first-person paragraphs, small editorial section headings and a lean writing index. Subpages share this frame. A fixed bottom dock carries four labeled destinations and a theme switch. Reserve bottom space and safe-area inset so it never hides content or keyboard focus.

No fabricated shelves, music collection, biography, portraits or project counts. Render only real published content; section labels describe content rather than arbitrary sequence numbers.

## Tokens

User-selected palette: One Light for light mode, One Dark for dark mode. Layout and typography continue to follow the cali.so reference.

One Light: background #fafafa, foreground #383a42, muted #626772, surface #eaeaeb, line #dbdbdc, focus #4078f2. Link/button accent #2f63cb is a darker blue for readable small text; selection #e5e5e6 with #383a42 text.

One Dark: background #282c34, foreground #abb2bf, muted #939baa, surface #21252b, line #3e4451, accent/focus #61afef. Selection #3e4451 with #d7dae0 text. Secondary text is brighter than syntax comments so article dates and navigation remain readable.

All interface surfaces use semantic CSS variables, including forms, tags, empty states, code surrounds, focus, selection and the dock. Code blocks use Shiki's bundled `one-light` / `one-dark-pro` themes with CSS-variable switching. No external font or theme dependency is added.

Palette sources: [One Light](https://github.com/atom/one-light-syntax/blob/master/styles/colors.less), [One Dark](https://github.com/atom/one-dark-syntax/blob/master/styles/colors.less), and the installed Shiki themes' VS Code UI color maps.

## Typography

Existing self-hosted Geist and Chinese system fallback match the quiet contemporary reference. Identity 22px; prose 15px with 1.95 line height; utility text 12–13px; compact writing titles 15px. Inner article bodies remain 16px. Monospace only for dates, counts and code.

## Interaction

44px minimum navigation and theme targets, visible keyboard outline, native links and preserved skip link. Light/dark follows system preference until explicitly chosen; persist explicit choice when storage is available. Apply theme before paint. With storage blocked, switching still works in memory. Respect reduced motion.
