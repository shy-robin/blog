# LXGW WenKai Screen web fonts

- Typeface: [LXGW WenKai Screen](https://github.com/lxgw/LxgwWenKai-Screen), by lxgw; licensed under SIL OFL 1.1 (`OFL.txt`).
- Web subsets: [`lxgw-wenkai-screen-webfont` 1.7.0](https://github.com/chawyehsu/lxgw-wenkai-webfont), by Chawye Hsu; wrapper license in `WEBFONT-LICENSE.txt`.
- Package: https://registry.npmjs.org/lxgw-wenkai-screen-webfont/-/lxgw-wenkai-screen-webfont-1.7.0.tgz

Only the 97 WOFF2 subsets for `LXGW WenKai Screen` are included. The upstream glyph data, unicode ranges, weight, and display strategy are unchanged. The stylesheet changes relative paths to this directory. Next.js emits hashed font assets served by the blog origin; `unicode-range` lets browsers request only the subsets needed for displayed characters. No runtime request to npm, GitHub, or a third-party font CDN is required.

The monospace code font remains Geist Mono. These fonts are web assets, not a downloadable desktop-font distribution.
