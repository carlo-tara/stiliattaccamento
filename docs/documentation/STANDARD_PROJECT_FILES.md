# Standard Project Files Reference

This document lists the standard documentation and configuration files expected in this repository and where they belong.

---

## Project Root (Standard Documentation)

These files **must** remain in the repository root:

| File | Purpose |
|------|---------|
| `README.md` | Project overview (< 150 lines) |
| `CONTRIBUTING.md` | Contributor guidelines, PR process, image workflow |
| `STANDARDS.md` | Code standards (HTML, CSS, JS, PWA, SEO) |
| `SECURITY.md` | Security policy and vulnerability reporting |
| `.cursorrules` | AI assistant development rules |
| `CHANGELOG.md` | Version history (maintained by release workflow) |
| `package.json` | npm scripts, dev dependencies, project version |
| `.env.example` | Template for secrets (never commit `.env`) |

---

## Extended Documentation (`docs/documentation/`)

| File | Purpose |
|------|---------|
| `ARCHITECTURE.md` | Technical and conceptual architecture |
| `API.md` | External APIs and integrations (no first-party REST API) |
| `DEPLOYMENT.md` | Cloudflare Pages deployment guide |
| `PUBLIC_DIRECTORY.md` | Reference for files published from `public/` |
| `SITE_MAP.md` | Human-readable site map and journey structure |
| `STANDARD_PROJECT_FILES.md` | This reference |
| `TESTING.md` | Test suite reference and commands |
| `.swagger.yml` | OpenAPI spec (optional; not applicable for static wiki) |

---

## Other Documentation Locations

| Location | Contents |
|----------|----------|
| `.cursor/brands/` | Brand brief used by local content skills |
| `docs/` | Content specifications, reviews, SEO data, snapshots |
| `docs/archive/legacy-root/` | Superseded root `.txt` docs and old bootstrap notes |
| `docs/design/` | Visual design documentation |
| `docs/reviews/` | Code review reports |
| `docs/seo/` | Keyword and competitor research |
| `docs/templates/` | Authoring templates for page families |
| `jtbd/` | Personas, job stories, design system notes |
| `scripts/README.md` | Build/SEO/image script pipeline |
| `scripts/ENV_SETUP.md` | Qwen API environment setup |
| `scripts/archive/maintenance/` | One-off maintenance scripts kept for reference |

**Rule:** All `.md` files except the standard root files above must live under `docs/` or its subdirectories (or `jtbd/`, `.cursor/`, `scripts/` where appropriate). `public/` should contain only files meant to be published.

---

## Key Configuration Files

| File | Purpose |
|------|---------|
| `playwright.config.js` | E2E and accessibility test config (port 8090) |
| `scripts/seo-config.js` | Site URL, default meta, SEO rules |
| `scripts/prompts.json` | Qwen image generation prompts |
| `public/manifest.json` | PWA manifest |
| `public/sw.js` | Service Worker (increment `CACHE_NAME` on release) |
| `public/_headers` | Cloudflare edge cache headers |
| `public/robots.txt` | Crawler directives |
| `public/sitemap.xml` | Generated sitemap (run `npm run generate-sitemap`) |
| `public/llms.txt` | AI crawler hints (run `npm run enrich-schema-geo`) |

---

## Test Directories

| Path | Tool | Command |
|------|------|---------|
| `tests/unit/` | Vitest | `npm test` |
| `tests/e2e/` | Playwright | `npm run test:e2e` |
| `tests/accessibility/` | Playwright + axe-core | `npm run test:accessibility` |
| `tests/validation/` | Node validators | `npm run test:validation` |

---

## Version Alignment

When releasing, ensure these reflect the same version where applicable:

- `.env` → `VERSION` and `BUILD` (format `VERSION.BUILD`, e.g. `1.4.0.1`)
- `package.json` → `"version"`
- `CHANGELOG.md` → latest `[x.y.z]` entry
- Script cache-busting query strings in HTML (e.g. `?v=1.3.0` for JS, `?v=1.3.2` for CSS)
- `public/sw.js` → increment `CACHE_NAME` on asset changes

## Build artefacts (commit to repository)

These files are generated locally and must be committed before deploy:

| File | Generator |
|------|-----------|
| `public/css/site.min.css` | `npm run build:css` |
| `public/css/site-*.min.css` | `npm run build:css` (page bundles) |
| `public/js/site.min.js` | `npm run build:js` |
| HTML shell blocks | `npm run inject-shell` |
| Performance hints in HTML | `npm run inject-performance` |

`.gitignore` exceptions: `!public/css/site*.min.css`, `!public/js/site.min.js`

---

## Related Documentation

- [README.md](../../README.md)
- [CONTRIBUTING.md](../../CONTRIBUTING.md)
- [ARCHITECTURE.md](./ARCHITECTURE.md)
