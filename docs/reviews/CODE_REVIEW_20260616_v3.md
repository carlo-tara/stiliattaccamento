# Code Review Report — Full Working Tree (v1.3.0 final)

**Date:** 2026-06-16  
**Reviewer:** AI Code Review (`/review`)  
**Project:** Stili di Attaccamento Wiki — static PWA  
**Scope:** All uncommitted changes on `main` vs `c6f5901` (v1.2.0)  
**Diff:** ~82 files, +8,944 / −6,121 lines (incl. HTML mass updates)

---

## Executive Summary

This review covers the **complete v1.3.0 working tree** after SEO/GEO, performance, accessibility, UI/UX (matryoshka cards, nav highlight, script injection), and test expansion.

**Overall assessment:** ✅ **APPROVE — ready to commit and deploy**

All automated gates pass. Critical UX bug (missing `mobile-menu.js` on 39 pages) is fixed. Remaining items are polish and maintainability, not blockers.

---

## Checklist

| Area | Status | Notes |
|------|--------|-------|
| Functionality | ✅ | Template loader, breadcrumbs, mappa radar, cookie banner, hamburger on all pages |
| Code quality | ⚠️ | `mappa-personale.js` has 3 functions >50 lines; one-off `fix-*.js` scripts undocumented |
| Security | ✅ | No secrets in tree; API key only via `.env`; `escapeHtml` on breadcrumbs |
| Testing | ✅ | Unit 72/72; validation all pass; a11y 5/5; links 372/372 |
| Documentation | ⚠️ | `CHANGELOG.md` v1.3.0 entry predates latest UI work; no `scripts/README` for new pipelines |
| Analytics | N/A | No tracking layer (appropriate for static consent-first wiki) |

---

## Test Results (2026-06-16, post UI/UX pass)

| Suite | Result |
|-------|--------|
| `npm test` (Vitest) | ✅ **72/72** |
| `npm run test:validation` | ✅ All pass (HTML, CSS, schema, style, SEO) |
| `npm run validate-seo` | ✅ 57/57 pages |
| `npm run test:links` | ✅ 372 links, 0 broken |
| `npm run test:accessibility` (chromium) | ✅ **5/5** (incl. `stili-base.html`) |

---

## 1. Functionality

### ✅ Working

| Feature | Detail |
|---------|--------|
| **SEO pipeline** | `inject-seo` → `generate-sitemap` → `validate-seo`; word-boundary meta truncation; `hreflang` it + x-default; `article:modified_time` from mtime |
| **GEO** | `enrich-schema-geo.js`, `llms.txt`, `robots.txt`, FAQPage on homepage |
| **Performance** | Non-blocking fonts, deduped perf hints, SW v2, `pwa.js` on all pages |
| **Script injection** | `inject-performance.js` ensures `mobile-menu.js`, `nav-highlight.js`, `cookie-banner.js` on **57/57** pages |
| **Navigation** | `nav-highlight.js` — `aria-current`, submenu auto-open, active styling |
| **Approfondimenti UX** | Matryoshka nesting fixed → `.style-section` articles; intro `.wiki-lead`; `.content-nav` |
| **Template loader** | Placeholder skeleton, error UI, `aria-busy`, header/footer parsing |
| **Cookie banner** | Close/Escape save consent; focus trap; safe-area padding |
| **Breadcrumbs** | Hidden on homepage; sentence-case titles; semantic `<ol>` |
| **Mappa personale** | Chart loading spinner, `.chart-error`, slider touch targets 28px |

### ⚠️ Edge cases (non-blocking)

| Item | Severity | Detail |
|------|----------|--------|
| `nav-highlight` parent match | Low | `linkPath === current.split('/').pop()` could theoretically highlight wrong link if two pages share filename in different folders (unlikely with current IA) |
| Submenu open on load | Low | Current page in submenu leaves drawer expanded — acceptable for orientation |
| `template-loader` fetch fail | Low | Shows generic error; no retry |
| SW cache bump | Low | Manual `CACHE_NAME` in `sw.js`; no build-time hash |
| Homepage profile grid | Info | 2 columns on mobile — still long scroll for 12 profiles |

---

## 2. Code Quality

### ✅ Strengths

- **Shared modules:** `scripts/lib/fs-utils.js`, `seo-utils.js`, `wiki-html-utils.js`
- **Idempotent inject scripts:** SEO, performance, a11y — safe to re-run
- **BEM-ish CSS** with design tokens; `@media (hover: hover)` for touch
- **Test helper** `loadPublicScript()` — reliable unit tests for vanilla JS
- **HTML escaping** in `breadcrumb-generator.js`

### ⚠️ Issues

| Item | Severity | Location |
|------|----------|----------|
| Functions >50 lines | Medium | `mappa-personale.js`: `disegnaGraficoRadar` (~152), `identificaProfilo` (~150), `calcolaDaTest` (~81), `aggiornaMappa` (~73) |
| Orphaned `main.js` | Low | Not loaded on any page; legacy test form — remove or document |
| One-off scripts | Low | `fix-approfondimenti.js`, `fix-storie-reali.js`, `fix-libri-titles.js` — no README, not in `package.json` |
| Inline `style=` residue | Medium | ~45 HTML files still have inline styles (`esercizi.html` ~100, `stili-base.html` ~46) — partial cleanup via `clean-wiki-inline-styles.js` |
| `BREADCRUMB_MAP` size | Low | 200+ lines manual map — consider generation from frontmatter later |
| Italian comments | Info | Project is Italian-facing; British English rule applies to dev docs only |

### Functions ≤50 lines

Most frontend modules comply. Build/inject scripts are appropriately procedural.

---

## 3. Security

| Check | Status |
|-------|--------|
| Secrets in repo | ✅ `.env` gitignored; only `.env.example` with placeholder |
| `QWEN_API_KEY` | ✅ Used only in `scripts/generate-images.js` (not in `public/`) |
| XSS — breadcrumbs | ✅ `escapeHtml()` on dynamic titles |
| XSS — mappa | ✅ `createSafeElement` for dynamic DOM |
| Cookie consent | ✅ `localStorage` only; technical cookies; consent on close/Escape |
| External CDN | ⚠️ Chart.js + SurveyJS from jsDelivr — SRI not applied (acceptable for static wiki) |
| CSP | Info | Not configured (Cloudflare Pages headers — future hardening) |

---

## 4. Testing

### Coverage map

| Module | Tests |
|--------|-------|
| `inject-seo.js` | ✅ 10 tests |
| `seo-utils.js` | ✅ 3 tests |
| `fix-approfondimenti-nesting.js` | ✅ 3 tests |
| `clean-approfondimenti-ui.js` | ✅ 3 tests |
| `nav-highlight.js` | ✅ 3 tests |
| `mobile-menu.js` | ✅ 5 tests |
| `mappa-personale.js` | ✅ 6 tests |
| `theme.js`, `utils.js` | ✅ 39 tests |
| `template-loader.js` | ❌ None |
| `breadcrumb-generator.js` | ❌ None |
| `cookie-banner.js` | ❌ None |
| Inject scripts (Node) | ❌ Only via integration (`npm run seo`) |

### RGR workflow

Tests were added alongside features (SEO utils, nesting fix, UI cleanup). Acceptable for static site; E2E coverage is limited to 5 axe pages.

---

## 5. Documentation

| Item | Status |
|------|--------|
| `CHANGELOG.md` v1.3.0 | ⚠️ Exists but **missing** post-review items: matryoshka fix, `nav-highlight`, `clean-wiki-inline-styles`, script injection |
| `CODE_REVIEW_20260616_v2.md` | Superseded by this report |
| `scripts/README.md` | ⚠️ Documents image gen only — not SEO/perf/a11y pipelines |
| JSDoc on new modules | ✅ `seo-utils`, `nav-highlight`, inject scripts |
| `.cursorrules` | ✅ Accurate |

---

## 6. Analytics

**N/A** — No Google Analytics, Plausible, or similar. Appropriate for a privacy-focused educational wiki with explicit cookie banner for technical storage only. No abstraction layer required.

---

## 7. UI/UX Summary (session delta since v2 review)

| Change | Impact |
|--------|--------|
| Matryoshka cards → `.style-section` | High — approfondimenti readability |
| Missing `mobile-menu.js` on 39 pages | **Critical fix** |
| `nav-highlight.js` | Medium — wayfinding |
| Inline style cleanup (46 pages) | Medium — consistency |
| Footer 2024–2026, legal nav | Low |
| Blog card CSS → `main.css` | Low |
| Touch targets, cookie safe-area, hover gating | Medium — mobile |

**Not done (backlog):** desktop horizontal nav at 960px; dedicated PWA icons 192/512; collapse homepage profile rows.

---

## 8. PWA / Manifest

```json
"icons": [{ "src": "/images/index-hero.webp", "sizes": "800x600" }]
```

⚠️ Non-standard icon size — install prompt may look poor on Android/iOS. Use generated square icons before marketing PWA install.

---

## 9. Recommendations

### Before commit (optional, quick)

1. Extend `CHANGELOG.md` v1.3.0 with UI/UX + script injection items
2. Add `clean-wiki-inline-styles` and `fix-approfondimenti-nesting` to `package.json` scripts

### Next sprint

1. Refactor `mappa-personale.js` — extract chart config (already partial in `config-chartjs.js`) and profile identification
2. Run `clean-wiki-inline-styles.js` iteratively or extend patterns for `esercizi.html`, `stili-base.html`
3. Generate proper `icons/icon-192.png` and `icon-512.png` for manifest
4. Unit tests for `template-loader.js` path helpers
5. Document inject pipeline in `scripts/README.md`
6. Remove or archive `public/js/main.js` if fully superseded by `test-surveyjs.js`
7. Consider `aria-current` on breadcrumb only (nav highlight duplicates — acceptable)

### Do not block deploy

- Desktop nav restoration
- Full inline-style elimination
- Analytics layer

---

## 10. Files of Interest (new since v1.2.0)

| Path | Role |
|------|------|
| `scripts/inject-seo.js` | Canonical, OG, Twitter, hreflang |
| `scripts/inject-performance.js` | Fonts, SW, manifest, **site scripts** |
| `scripts/inject-a11y.js` | Skip link, `#main-content` |
| `scripts/fix-approfondimenti-nesting.js` | Matryoshka HTML fix |
| `scripts/clean-approfondimenti-ui.js` | Approfondimenti typography/nav |
| `scripts/clean-wiki-inline-styles.js` | Global inline style strip |
| `public/js/nav-highlight.js` | Active nav state |
| `public/js/pwa.js` | SW registration |
| `public/sw.js` | Cache v2 |
| `public/manifest.json` | PWA metadata |
| `public/sitemap.xml`, `robots.txt`, `llms.txt` | SEO/GEO |

---

## Verdict

✅ **APPROVE for commit and Cloudflare Pages deploy**

The v1.3.0 tree is materially better than v1.2.0 across SEO, accessibility, performance, and mobile UX. All automated tests pass. Address CHANGELOG completeness and PWA icons when convenient.

---

*Previous reviews: [CODE_REVIEW_20260616_v2.md](./CODE_REVIEW_20260616_v2.md), [CODE_REVIEW_20260616.md](./CODE_REVIEW_20260616.md)*
