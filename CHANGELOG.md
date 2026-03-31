# Changelog

## 2.3.1 (2026-03-31)

### Optimizations
- **Compact translations** — search keywords stored as compressed strings, parsed on demand with cache
- **Package size** — reduced from 293 kB to 247 kB (16% smaller)
- **FESM bundle** — reduced from 532 kB to 422 kB (21% smaller)

## 2.3.0 (2026-03-31)

### Features
- **22 languages** — locale-aware search with native keywords for ES, EN, PT, FR, DE, IT, JA, KO, ZH, RU, AR, HI, TR, PL, NL, SV, DA, UK, TH, VI, ID, MS
- **965 emojis** — Unicode 16.0 and 17.0 emojis integrated into correct categories
- **Search service refactor** — reactive locale signal, index auto-rebuilds on language change
- **Improved i18n** — complete category labels with compound names (e.g. "Animals & Nature") in all languages
- **Demo** — flag-based locale selector using Twemoji images

## 2.0.0 (2026-03-28)

### Features
- **Legacy support** — Angular 14-16 via `@nicematic/emoji-picker/legacy` (NgModule)
- **Runtime version check** — warns if using wrong entry point for your Angular version
- **Memory leak fixes** — all event listeners properly cleaned up on destroy
- **Improved demo** — playground, Angular 17+ and Angular 14-16 tabs
- **SEO meta tags** — Open Graph, Twitter Card, theme-color

### Breaking Changes
- Minimum Angular version now 14.0.0 (was 17.1.0)
- CSS variables renamed from `--nme-*` to `--nicematic-picker-*`

## 1.9.0 (2026-03-28)

### Features
- CSS grid auto-fill layout — zero wasted space at any width

## 1.5.0 (2026-03-27)

### Features
- 929 emojis across 9 categories
- Bilingual search (EN/ES) with 200+ Spanish translations
- Skin tone variants via long press (pointer + touch events)
- Smart recents — frequency-weighted recency algorithm
- Flag rendering with Twemoji fallback on Windows
- Auto dark/light theme via `prefers-color-scheme`
- i18n — 12 languages (ES, EN, PT, FR, DE, IT, JA, KO, ZH, RU, AR, HI)
- Responsive — dynamic columns via ResizeObserver
- Fade-in animation, click outside close, escape key
- Clear search button
- Tooltip on hover

## 1.0.0 (2026-03-27)

### Initial Release
- Emoji picker component for Angular 17+
- Virtual scroll (later replaced with native scroll)
- Basic search, categories, skin tones
- Tailwind CSS bundled inside library
