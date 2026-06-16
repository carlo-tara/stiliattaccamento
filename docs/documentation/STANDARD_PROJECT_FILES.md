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
| `STANDARD_PROJECT_FILES.md` | This reference |
| `.swagger.yml` | OpenAPI spec (optional; not applicable for static wiki) |

---

## Other Documentation Locations

| Location | Contents |
|----------|----------|
| `docs/` | Content specifications, reviews, SEO data, snapshots |
| `docs/reviews/` | Code review reports |
| `docs/seo/` | Keyword and competitor research |
| `jtbd/` | Personas, job stories, design system notes |
| `scripts/README.md` | Build/SEO/image script pipeline |
| `scripts/ENV_SETUP.md` | Qwen API environment setup |
| `public/profili/TEMPLATE-PROFILO.md` | Profile page template guide |

**Rule:** All `.md` files except the standard root files above must live under `docs/` or its subdirectories (or `jtbd/`, `scripts/` where appropriate).

---

## Key Configuration Files

| File | Purpose |
|------|---------|
| `playwright.config.js` | E2E and accessibility test config (port 8090) |
| `scripts/seo-config.js` | Site URL, default meta, SEO rules |
| `scripts/prompts.json` | Qwen image generation prompts |
| `public/manifest.json` | PWA manifest |
| `public/sw.js` | Service Worker |
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

- `package.json` → `"version"`
- Script cache-busting query strings in HTML (e.g. `?v=1.3.0`)
- `CHANGELOG.md` → latest `[x.y.z]` entry

---

## Related Documentation

- [README.md](../../README.md)
- [CONTRIBUTING.md](../../CONTRIBUTING.md)
- [ARCHITECTURE.md](./ARCHITECTURE.md)
