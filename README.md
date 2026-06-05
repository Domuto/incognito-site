# Incognito Site

Next.js 14 · App Router · TypeScript

## Setup

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Structure

```
public/
  logo.png          ← Your bag-head logo (23.png)
  intro.mov         ← Intro video (plays on load, then fades out)

src/app/
  layout.tsx        ← Root layout
  globals.css       ← All styles + fonts
  page.tsx          ← Home: video intro → logo + nav
  menu/page.tsx     ← /menu route (stub, ready to build out)
  about/page.tsx    ← /about route (stub, ready to build out)
```

## How it works

1. Site loads → video plays fullscreen (muted, autoplay)
2. Video ends → fade out, main site fades in
3. Logo + MENU / ABOUT buttons appear with staggered animation
4. Fallback: if video fails/autoplay blocked → skips straight to main site

## Deploy to Vercel

```bash
npx vercel
```

Or push to GitHub and import at vercel.com — zero config needed for Next.js 14.

## Notes

- `.mov` files are served as-is. If you need broader browser support, also export an `.mp4` version and add a second `<source>` tag in `page.tsx`.
- Fonts loaded from Google Fonts (Bebas Neue + Space Mono). Works offline after first load via cache.
