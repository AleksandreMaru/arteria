# ARTAREA ED

Bilingual (Georgian-primary) website for ARTAREA ED — courses, summer school, tours, interviews, and spotlights.

Built with **Astro**, **TypeScript**, **Tailwind CSS**, and **React** (filter islands only).

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:4321/ka/](http://localhost:4321/ka/) (Georgian default).

## Build

```bash
npm run build
npm run preview
```

Output is written to `dist/`.

## Deploy on Cloudflare Pages

1. Connect this GitHub repository in Cloudflare Pages.
2. **Build command:** `npm run build`
3. **Build output directory:** `dist`
4. **Node version:** `20` (set in Pages environment variables or use `.node-version`)

The root `/` redirects to `/ka/`.

## Content editing

Content lives in `src/content/` as JSON files. UI strings are in `src/i18n/ka.json` and `src/i18n/en.json`.

### Add a course

Create `src/content/courses/your-slug.json`:

```json
{
  "slug": "your-slug",
  "featured": false,
  "discipline": "visual-art",
  "level": "beginner",
  "duration": "8-weeks",
  "schedule": "weekday-evening",
  "format": "in-person",
  "formUrl": "https://forms.google.com/...",
  "title": { "ka": "...", "en": "..." },
  "summary": { "ka": "...", "en": "..." },
  "body": { "ka": "...", "en": "..." },
  "instructor": "Name",
  "startsAt": "2026-09-01",
  "heroImage": "/images/your-image.jpg"
}
```

Allowed values for filters: see `src/lib/schemas.ts`.

### Add a tour

Create `src/content/tours/your-slug.json` with `region`, `dates`, `meetingPoint`, `duration`, `languages`, `guide`, and `formUrl`.

### Summer school

Edit the single file `src/content/summer-school.json`.

### Interviews & spotlight

Create JSON files in `src/content/interviews/` or `src/content/spotlights/`.

### Events

Create `src/content/events/your-slug.json`.

After editing content, run `npm run build` to verify, then deploy.

## Project structure

```
src/
├── components/     # UI, layout, cards, filters
├── content/        # JSON content
├── i18n/           # UI translations
├── lib/            # schemas, loaders, helpers
├── pages/[locale]/ # ka and en routes
└── styles/         # global CSS + design tokens
```

## Brand

- Accent: `#E6339E`
- Logo: `public/logo.svg`

Replace placeholder form URLs and social links before launch.
