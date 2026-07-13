# API Documentation

## Overview

Stili di Attaccamento Wiki is a **static site** with no first-party backend API. This document describes external services and build-time integrations used by the project.

---

## External APIs

### Qwen Text2Image (DashScope)

Used by `scripts/generate-images.js` to generate wiki illustrations.

| Item | Value |
|------|-------|
| Provider | Alibaba Cloud DashScope |
| Model | `qwen-image-plus` (configurable via `QWEN_MODEL_IMAGE`) |
| Auth | Bearer token (`QWEN_API_KEY`) |
| Endpoint | `QWEN_URL_IMAGE` (see `.env.example`) |

**Flow:**

1. Script reads prompts from `scripts/prompts.json`
2. Submits async image generation task to DashScope
3. Polls task status until complete
4. Saves raw PNG to `docs/image-generated/`
5. Converts to WebP 800×600 via ImageMagick into `public/images/`

**Rate limiting:** 1 second pause between requests (script-enforced).

**Credentials:** Never commit `.env`. Use local `.env` for development; Cloudflare Pages environment variables only if image generation runs in CI (not typical for this project).

See `scripts/ENV_SETUP.md` and `scripts/README.md` for setup.

---

## CDN Libraries (Browser)

Loaded at runtime from CDN on specific pages only:

| Library | Purpose | Pages |
|---------|---------|-------|
| SurveyJS | Interactive attachment-style quiz | `test.html` |
| Chart.js | Radar chart for personal map | `mappa-personale.html` |

No npm bundle — keeps production JavaScript minimal.

---

## Analytics (GA4 + GTM)

| Item | Value |
|------|-------|
| GA4 Measurement ID | `G-6CQ4VFK8SJ` |
| GTM Container | `GTM-NGNWRJBN` |
| Loader | `public/js/gtm.js` |
| Event layer | `public/js/modules/analytics.js` (`trackEvent`) |
| Consent | Loaded only after `localStorage.cookie_consent === 'accepted'` |

GA4 and GTM are **not** loaded on first visit. The cookie banner (`cookie-banner.js`) must receive explicit acceptance before analytics scripts run. Custom events (`test_completed`, `test_results_viewed`) are sent via `gtag` when GA4 is loaded.

---

## Local Storage (Client)

No server API — user state is stored in the browser:

| Key | Module | Purpose |
|-----|--------|---------|
| `cookie_consent` | `cookie-banner.js`, `gtm.js` | Analytics consent |
| `testResults` | `test-surveyjs.js` | Quiz scores and profile |
| `mappaPersonale` | `mappa-personale.js` | Five-dimension map scores |

No personally identifiable information is collected or transmitted by default.

---

## Service Worker

`public/sw.js` implements cache strategies only (no network API):

- **Cache-first:** CSS, JS, images, fonts, templates
- **Network-first:** HTML pages

Cache name: `stili-attaccamento-v5` (bump on breaking asset changes).

---

## Build Scripts (Node.js)

Not HTTP APIs — local CLI tools in `scripts/`:

| Script | Output |
|--------|--------|
| `inject-seo.js` | Canonical, Open Graph, Twitter Card meta tags |
| `generate-sitemap.js` | `public/sitemap.xml` |
| `validate-seo.js` | Exit code 1 if required meta missing |
| `enrich-schema-geo.js` | GEO schema, `public/llms.txt` |
| `inject-performance.js` | Preload hints, global script injection |
| `inject-a11y.js` | Skip link, `#main-content` id |

Configuration: `scripts/seo-config.js`, `scripts/lib/seo-utils.js`.

---

## Related Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) — System design
- [DEPLOYMENT.md](./DEPLOYMENT.md) — Cloudflare Pages deploy
- [../../scripts/README.md](../../scripts/README.md) — Script pipeline reference
