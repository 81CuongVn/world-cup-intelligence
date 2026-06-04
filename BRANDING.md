# PitchIntel Branding

Product brand: **PitchIntel** · *Football Tactical Intelligence*

Design tokens live in `app/lib/brand/brandTheme.ts` and are wired into `tailwind.config.ts`.

## Colors

| Token | Hex | Usage |
|-------|-----|--------|
| Background | `#071014` | Page base |
| Background soft | `#0B1118` | Secondary surfaces |
| Panel | `#111827` | Cards |
| Panel elevated | `#172033` | Raised panels |
| Border | `#253244` | Dividers |
| Cyan | `#00E5FF` | Win prob, primary CTA, live |
| Magenta | `#FF2D8E` | Attack, away emphasis |
| Green | `#22D46B` | Defensive / structure |
| Yellow | `#FFD400` | Key moments, highlights |
| Danger | `#FF4D5A` | Risk accents |

## Typography

- **Headings:** Sora ExtraBold (fallback Oswald / Bebas Neue) — `font-heading` / `font-display`
- **Body:** Inter — `font-sans`
- **Data:** IBM Plex Mono / JetBrains Mono — `font-mono-data`

## Logo & icons

Reference assets (also in `public/`):

- `public/brand/logo-guide.png` — full identity board
- `public/favicon-source.png` — icon master
- `public/favicon-16x16.png`, `favicon-32x32.png`, `apple-touch-icon.png`
- `public/android-chrome-192x192.png`, `android-chrome-512x512.png`
- `public/site.webmanifest`

Navbar uses the icon + **PitchIntel** wordmark via `BrandLogo`.

## SEO / social

- Title: `PitchIntel — Football Tactical Intelligence`
- OG/Twitter image: `/og-cover.png` (`public/og-cover.png`)
- Configured in root `index.html`

## Manual follow-up (optional)

Export optimized multi-size favicons from `public/favicon-source.png` (16/32/180/192/512) with an image tool if pixel-perfect scaling is required.
