# Personal site visual system

Reference-directed redesign of the existing site following the user's request to borrow cali.so's style, with their confirmed light/dark switch. Replaces the previous large blue hero and wide layout.

## Layout and hierarchy

A narrow, centered personal page with fine vertical boundary rules: reading pages use a 680px outer column, while the article list, projects and about pages use an 880px column. The article index is the default entry; `/` permanently redirects to `/posts`, preserving query parameters. Personal introduction, blog purpose, project links and RSS subscription live together on the about page. There is no separate home page. Subpages share this frame. A fixed bottom dock carries four labeled destinations and a theme switch. Reserve bottom space and safe-area inset so it never hides content or keyboard focus.

No fabricated shelves, music collection, biography, portraits or project counts. Render only real published content; section labels describe content rather than arbitrary sequence numbers.

Article search uses a full-width capsule input with 350ms debounced automatic search, respecting Chinese input composition. Enter searches immediately. Tag filters use filled capsules with a surface tint, the selected one in the accent colour; changing a query preserves the selected tag and resets pagination. The result summary and clear-filter link share one vertically centered row, with long summary text wrapping within its column.

Tag filters initially show All and the five most frequent tags, keeping a selected lower-frequency tag visible. A lightweight expand/collapse control reveals the remaining tags on demand, keeping the desktop article list near the first viewport. Phones retain horizontal tag scrolling.

The about page uses a two-column spread, chosen from several reference directions: a left identity column (transparent avatar at 96px desktop, 80px mobile, name, short introduction, basic information and contacts) sits beside a reading column of the bio, interests, experience and blog note, with 56px between them. The spread is 880px wide on desktop, like the list pages, and stacks into one column on phones with the identity first. Public details are ordered label/value rows configured in the Sanity profile. Dedicated gender, birth date, hometown, school and occupation fields supply the standard rows; age is calculated by the current Shanghai date and the full birth date is not displayed. City rows are omitted, while the existing display name remains the default identity row. No age, school, family or other biographical details are inferred from the reference. Missing or failed avatar images show a transparent initial. Phones stack headings above content. Links retain at least 44px touch targets.

A reference-inspired two-column directory footer follows the page content with supplied contact links and existing site destinations. Links use fine tree branches and 44px targets. Copyright, clock, timezone and location are omitted. Missing contact data is omitted; no social accounts are invented. The dock sits 12px above the bottom safe area. Content reserves 96px plus the bottom safe area so the final footer links can scroll clear of the dock.

The contact column reads all personal contacts from the Sanity profile. GitHub and email link directly; QQ attempts an app deep link appropriate to mobile or desktop, with a web contact URL as the initial fallback. WeChat opens a native dialog with the uploaded friend QR image, keyboard dismissal and an explicit close button. No account-copy controls remain. If no QR image is supplied, the WeChat entry is omitted. QR images are Sanity assets served through the blog image optimizer, never committed to the repository.

## Tokens

User-selected palette: One Light for light mode, One Dark for dark mode. Layout and typography continue to follow the cali.so reference.

One Light: background #fafafa, foreground #383a42, muted #626772, surface #eaeaeb, line #dbdbdc, focus #4078f2. Link/button accent #2f63cb is a darker blue for readable small text; selection #e5e5e6 with #383a42 text.

One Dark: background #282c34, foreground #abb2bf, muted #939baa, surface #21252b, line #3e4451, accent/focus #61afef. Selection #3e4451 with #d7dae0 text. Secondary text is brighter than syntax comments so article dates and navigation remain readable.

All interface surfaces use semantic CSS variables, including forms, tags, empty states, code surrounds, focus, selection and the dock. Code blocks use Shiki's bundled `one-light` / `one-dark-pro` themes with CSS-variable switching. Fonts and theme resources are served locally without a third-party runtime dependency.

Palette sources: [One Light](https://github.com/atom/one-light-syntax/blob/master/styles/colors.less), [One Dark](https://github.com/atom/one-dark-syntax/blob/master/styles/colors.less), and the installed Shiki themes' VS Code UI color maps.

## Typography

The interface and article prose use self-hosted LXGW WenKai Screen, with Geist and Chinese system fonts as fallbacks. Page titles, article titles, section headings, empty states and status pages use the serif display face (`--font-display`, Songti SC first); list item titles, labels and body text stay sans. The 97 WOFF2 unicode-range subsets come from lxgw-wenkai-screen-webfont 1.7.0, retain their OFL and wrapper license files, and are emitted as hashed same-origin assets by Next.js. Browsers request only the subsets needed for visible characters with font-display swap. Geist Sans fallback is not preloaded; code and numeric utility text retain Geist Mono. Utility text is 12–13px; the about page carries the personal introduction. Article list titles are 20px on desktop and 18px on mobile. Inner article bodies use 16px on desktop and 15px on mobile, with a 2.0 line height. Monospace only for dates, counts and code.

Reading refinements retain the narrow frame and existing content. List excerpts are limited to three lines; full text stays on the article page. Article tags use the same filled capsules as the filters, with 44px touch targets. On phones, filter tags form one horizontally scrollable row so the writing remains near the top of the page. Quotes and the table of contents use a subtle semantic surface (#f3f3f4 / #2c313a); code blocks scroll internally and never widen the page.

## Interaction

Switching dock destinations plays a short 70ms wooden tap after a user navigation gesture. Its normalized peak amplitude is 0.65, with headroom below clipping; the final perceived volume depends on the device and media-volume setting. A filtered strike and quickly damped resonances replace the electronic pitch sweep; the locally generated buffer is reused between taps. There is no audio download or autoplay. Re-selecting the current destination, hovering, opening a modified link, and theme changes stay silent. Unsupported or blocked audio never interrupts navigation.

Audio context resumption and source start both run synchronously inside the navigation gesture, rather than starting playback in a resume-promise callback. Suspended contexts queue the short source until resumption so stricter mobile gesture handling can recognize the tap.

Writing routes share their shell through the posts layout. A route loading boundary shows a static, accessible article placeholder while server content is pending; it does not animate or block navigation. The dock prefetches the writing index and its data in production so the primary destination can be ready before a tap. Network delays can still occur on cold or uncached requests.

The writing index fetches 12 articles per page from Sanity. Search and tag filters run before the server-side slice; counts and tag metadata are fetched separately from article records. Page links preserve search and tags, while changing either filter resets to page one. The first page omits `page=1`; out-of-range pages redirect to the last available page. Each unfiltered page has its own canonical URL. On mobile, previous/next links sit above the compact page-number row with 44px targets. Pagination links do not prefetch other pages automatically.

44px minimum navigation and theme targets, visible keyboard outline, native links and preserved skip link. Light/dark follows system preference until explicitly chosen; persist explicit choice when storage is available. Apply theme before paint. With storage blocked, switching still works in memory. Respect reduced motion.

The bottom navigation is a compact 54px-high capsule with 44×44px targets. Three regions are separated by two 1px vertical rules: the author's 28px avatar linking to `/about`, the two page links (writing, projects), and display settings (theme switch). Use the real Sanity profile avatar without a background or decorative ring; missing or failed images fall back to the author's initial without inventing a portrait. The about page marks the avatar destination, not a duplicate page icon.

Following the user's cali.so reference, icons use precise rounded 1.5px strokes and quiet duotone fills. Route names appear as tooltips for fine-pointer hover or keyboard focus and remain accessible names on every link. Touch taps do not show hover tooltips. A 4px accent dot below the icon (or avatar on the about page) marks only the actual route through aria-current; navigation targets have no selected background. Icons and avatar have restrained interaction feedback. Reduced-motion mode removes spatial transitions while preserving visible state and keyboard focus. Palette and page layout stay unchanged.

The about-page contact section is labeled 联系方式 and lists 邮箱, 扣扣 and 微信 as separate definition rows. Every value is read from Sanity; missing values are omitted. The email remains a mailto link, and the QQ/WeChat account text has no copy controls. Footer contact actions remain separate.
