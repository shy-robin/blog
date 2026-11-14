# Personal site visual system

Reference-directed redesign of the existing site following the user's request to borrow cali.so's style, with their confirmed light/dark switch. Replaces the previous large blue hero and wide layout.

## Layout and hierarchy

A narrow, centered personal page (680px outer column) with fine vertical boundary rules. Compact identity, readable first-person paragraphs, small editorial section headings and a lean writing index. Subpages share this frame. A fixed bottom dock carries four labeled destinations and a theme switch. Reserve bottom space and safe-area inset so it never hides content or keyboard focus.

No fabricated shelves, music collection, biography, portraits or project counts. Render only real published content; section labels describe content rather than arbitrary sequence numbers.

## Tokens

Light: background #faf9f6, foreground #292824, muted #6b685f, surface #f1efe9, line #dedbd3, accent #a84e2e.

Dark: background #13120f, foreground #ebe9e4, muted #aaa59a, surface #1d1b17, line #37342d, accent #e6a37b.

All interface surfaces use semantic CSS variables, including forms, tags, empty states, code surrounds, focus, selection and the dock. Code syntax palettes retain their explicit contrast treatment.

## Typography

Existing self-hosted Geist and Chinese system fallback match the quiet contemporary reference. Identity 22px; prose 15px with 1.95 line height; utility text 12–13px; compact writing titles 15px. Inner article bodies remain 16px. Monospace only for dates, counts and code.

## Interaction

44px minimum navigation and theme targets, visible keyboard outline, native links and preserved skip link. Light/dark follows system preference until explicitly chosen; persist explicit choice when storage is available. Apply theme before paint. With storage blocked, switching still works in memory. Respect reduced motion.
