# Deployment Guide

## Overview

This project deploys to **Cloudflare Pages** as a static site. There is no build step in production — the `public/` directory is served directly. SEO meta tags, sitemap, and script injection are applied locally via npm scripts before commit.

**Canonical domain:** `https://stiliattaccamento.com` only (source: `scripts/seo-config.js`). Do not reference `stiliattaccamento.it` in HTML, `robots.txt`, `llms.txt`, or JSON-LD — the `.it` domain is not registered.

---

## Prerequisites

- GitHub repository configured
- Cloudflare account with Pages enabled
- Node.js >= 16 (for local pre-deploy scripts and tests)
- Access to repository and Cloudflare dashboard

---

## Pre-Deploy Checklist

Before merging to `main`, run locally:

```bash
npm install
npm run seo          # Meta tags, sitemap.xml, SEO validation
npm run perf         # build:css + build:js + inject-shell + inject-performance
npm run inject-a11y  # Skip link, main content id
npm run test:all     # Unit, E2E, validation suite
```

Commit generated/updated files in `public/` (e.g. `sitemap.xml`, `site.min.css`, `site.min.js`, HTML with injected shell and meta).

**When editing title, meta, or hub pages** (`index.html`, `stili-base.html`, `fondamenti.html`, `test.html`, and other money pages):

- Run `npm run seo` and `npm run validate-seo`
- If adding `FAQPage` JSON-LD, include a visible FAQ section (`dl.faq-list`) with matching copy (GEO)
- See `.cursor/skills/seozoom-stiliattaccamento/SKILL.md` for hub list and quick-win workflow

**When editing page copy** (HTML in `public/`):

- Follow [`docs/design/tone-of-voice.md`](../design/tone-of-voice.md)
- Run `node tests/validation/style-validator.js` (included in `npm run test:validation`)

**When editing navigation templates** (`public/templates/header.html` or `topbar.html`):

```bash
npm run inject-shell
npm run inject-performance   # or full npm run perf
```

**When editing homepage hero images**:

```bash
npm run optimize-images
npm run inject-performance
```

See `scripts/README.md` for the full pipeline order when editing wiki pages.

---

## Cloudflare Pages Configuration

### 1. Project Setup

1. Log in to Cloudflare Dashboard
2. Navigate to **Pages** → **Create a project**
3. Connect your GitHub repository
4. Configure build settings:
   - **Framework preset**: None (Static Site)
   - **Build command**: *(leave empty)*
   - **Build output directory**: `public`
   - **Root directory**: *(leave empty)*

### 2. Environment Variables

Image generation runs locally, not on Cloudflare. Environment variables are only needed if you add CI image generation:

| Variable | Purpose |
|----------|---------|
| `QWEN_API_KEY` | Qwen Text2Image API key |
| `QWEN_URL_IMAGE` | DashScope endpoint URL |
| `QWEN_MODEL_IMAGE` | Model name (e.g. `qwen-image-plus`) |

**Important:** Never commit `.env` files. Use Cloudflare Pages environment variables only when required.

### 3. Custom Domain (Optional)

1. Go to **Custom domains** in project settings
2. Add your domain
3. Follow DNS configuration instructions
4. Cloudflare provisions an SSL certificate automatically

---

## Deployment Process

### Automatic Deployment

Deployment triggers on push to `main`:

1. Push changes to `main` on GitHub
2. Cloudflare Pages detects the push
3. Files from `public/` are deployed (no build step)
4. Site is live at the production URL
5. Preview deployments are created for pull requests

### Manual Deployment

1. Open Cloudflare Pages dashboard
2. Select your project
3. Click **Retry deployment** for a specific commit

### Preview Deployments

- Created automatically for each pull request
- Preview URL appears in PR comments
- Use for testing before merge

---

## Output Directory

All publishable files live in `public/`:

```
public/
├── index.html
├── _headers           # Cloudflare cache headers (CSS/JS/fonts/images)
├── css/
│   ├── site.min.css           # Core bundle (all pages)
│   ├── site-profiles.min.css  # profili/* only
│   ├── site-mappa.min.css     # mappa-personale.html only
│   └── site-wiki.min.css      # approfondimenti/*, stili-base.html
├── js/
│   └── site.min.js            # Minified global script bundle
├── fonts/             # Self-hosted Lato + Playfair (woff2)
├── images/
├── icons/
├── templates/         # Source for header/topbar (inlined at build via inject-shell)
├── manifest.json
├── sw.js
├── robots.txt
├── sitemap.xml      # Generated: npm run generate-sitemap
└── llms.txt         # Generated: npm run enrich-schema-geo
```

---

## Post-Deployment Verification

- [ ] Site loads over HTTPS
- [ ] All pages accessible (spot-check profili, approfondimenti, libri)
- [ ] CSS and JS load (check cache-busting `?v=` query strings)
- [ ] Images display (WebP)
- [ ] PWA manifest valid (`/manifest.json`)
- [ ] Service Worker registers (`/sw.js`)
- [ ] `robots.txt` and `sitemap.xml` reachable
- [ ] Cookie banner appears; GTM loads only after accept
- [ ] Mobile menu and navigation highlight work
- [ ] Custom domain resolves (if configured)
- [ ] **PageSpeed Insights** (mobile): Performance ≥ 90, CLS ≤ 0.1 (target: 99 / 0 as of v1.4.0; re-check after v2.0.0 asset changes)
- [ ] Cloudflare **Rocket Loader** disabled (Speed → Optimisation)

### Monitoring

- Cloudflare Pages dashboard → deployment status and logs
- Run `npm run test:e2e` against preview URL if needed (update `baseURL` in `playwright.config.js`)

---

## Rollback

1. Open Cloudflare Pages → **Deployments**
2. Find the last known-good deployment
3. Click **Retry deployment** or promote that deployment

---

## Production Considerations

### Performance

- Global CDN provided by Cloudflare
- Static assets cached at the edge via [`public/_headers`](../public/_headers) (long cache for CSS/JS/fonts/images)
- HTTPS enabled by default
- Compression enabled automatically
- Service Worker caches CSS/JS/images client-side (`stili-attaccamento-v8`)

#### Build pipeline (`npm run perf`)

| Step | Script | Output |
|------|--------|--------|
| 1 | `build-css.js` | `site.min.css` (core ~34 KiB) + page bundles (`site-profiles`, `site-mappa`, `site-wiki`) |
| 2 | `build-js.js` | `site.min.js` (~22 KiB minified global scripts) |
| 3 | `inject-shell.js` | Header + topbar inlined in all 59 HTML pages (zero CLS from async fetch) |
| 4 | `inject-performance.js` | Preloads, per-page CSS, deferred scripts, SW registration |

Additional tools:

- **`npm run optimize-images`** — responsive WebP variants (`index-hero-480.webp`, `index-hero-700.webp`)
- **Font self-hosting**: Lato and Playfair Display in `public/fonts/` (no Google Fonts request chain)
- **Cloudflare Rocket Loader**: must be **OFF** (Speed → Optimisation). Rocket Loader injects render-blocking `rocket-loader.min.js` and breaks vanilla deferred scripts

#### PageSpeed targets (v1.4.0 production verified; v2.0.0: 12 tarocchi webp regenerated at 600×800)

| Device | Performance | CLS | LCP |
|--------|-------------|-----|-----|
| Mobile | 99 | 0 | 2.0 s |
| Desktop | 100 | 0.017 | 0.4 s |

Before each release that touches CSS, JS, or templates:

```bash
npm run perf
# or step-by-step:
npm run build:css && npm run build:js && npm run inject-shell && npm run inject-performance
```

### Security Headers

Configure via Cloudflare Pages `_headers` file or dashboard:

- `Content-Security-Policy`
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Referrer-Policy: strict-origin-when-cross-origin`

See [SECURITY.md](../../SECURITY.md) for full policy.

### Cache Strategy

| Asset type | Strategy |
|------------|----------|
| HTML | Short cache; SW network-first |
| CSS/JS | Long cache (`max-age=31536000` via `_headers`); bump `?v=` on release |
| Images | Long cache |
| Service Worker | Always revalidate on navigation |

### Service Worker Updates

When changing `public/sw.js`, increment `CACHE_NAME` (e.g. `stili-attaccamento-v8`) so clients fetch fresh assets.

---

## Troubleshooting

### Missing Files After Deploy

- Confirm files are under `public/` and committed
- Check `.gitignore` does not exclude required assets
- Regenerate `sitemap.xml` if new pages were added

### SEO Meta Missing

```bash
npm run inject-seo
npm run validate-seo
```

Check that canonical URLs use `https://stiliattaccamento.com` (not `.it`). Re-run `npm run seo` after bulk URL changes.

### FAQPage / GEO Mismatch

`FAQPage` schema must mirror visible FAQ HTML. If validation or rich-result preview fails, compare JSON-LD with `dl.faq-list` on the same page. Pattern reference: `public/index.html`.

### SEO Data Exports (Local Only)

- `seo/` and `.seozoom/` are gitignored (SeoZoom/Cloudflare exports and Playwright session)
- `sitemap-enriched.json` at repository root may be committed when needed for per-URL SeoZoom export; do not mix raw `seo/YYMMDD/` batches with site copy PRs

### Hamburger Menu Not Working

Ensure `mobile-menu.js` is present — run `npm run perf` to inject global scripts.

### Build Failures

Unlikely with static deploy. If Cloudflare reports errors, check logs for invalid project configuration.

---

## Continuous Integration (Optional)

Example GitHub Actions pre-merge checks:

```yaml
name: Pre-deploy Checks
on:
  pull_request:
    branches: [main]
jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run test:validation
      - run: npm test
```

---

## Related Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) — System design
- [API.md](./API.md) — External integrations
- [../../scripts/README.md](../../scripts/README.md) — Build scripts
- [../../.cursor/skills/seozoom-stiliattaccamento/SKILL.md](../../.cursor/skills/seozoom-stiliattaccamento/SKILL.md) — SEO/GEO workflow
- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
