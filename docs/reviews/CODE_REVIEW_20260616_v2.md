# Code Review Report — Full Working Tree (v1.3.0 candidate)

**Date:** 2026-06-16  
**Reviewer:** AI Code Review  
**Project:** Stili di Attaccamento Wiki — static PWA  
**Scope:** All uncommitted changes on `main` (79 tracked + 15 untracked artefacts)  
**Diff:** +5,164 / −3,456 lines vs `c6f5901` (v1.2.0)

---

## Executive Summary

This review covers the cumulative working tree after UX/UI, SEO/GEO, tone-of-voice, performance, accessibility, and test-infrastructure work completed in this session.

**Overall assessment:** ✅ **APPROVE WITH MINOR FOLLOW-UPS**

The tree is deployable: critical bugs are fixed, SEO validates on 57/57 pages, unit tests pass (50/50), and infrastructure scripts are repeatable. Remaining issues are non-blocking (heading hierarchy on one page, link checker false positives on templates, missing `manifest.json`, artefact gitignore).

The **storie-reali Open Graph blocker** from the earlier review is **resolved** (short meta + `sanitizeMetaText` in `inject-seo.js`).

---

## Checklist

| Area | Status | Notes |
|------|--------|-------|
| Functionality | ✅ | Template loader, mappa radar, theme, breadcrumbs, SEO inject |
| Code quality | ⚠️ | Some functions >50 lines; `main.js` orphaned on all pages |
| Security | ✅ | No secrets in tree; localStorage only for test/cookie consent |
| Testing | ⚠️ | Unit 50/50; a11y 4/5; link checker fails (templates) |
| Documentation | ⚠️ | `CHANGELOG.md` not updated; one-off fix scripts undocumented |
| Analytics | N/A | No analytics layer (static wiki; appropriate) |

---

## Test Results (2026-06-16)

| Suite | Result |
|-------|--------|
| `npm test` (Vitest) | ✅ 50/50 |
| `npm run validate-seo` | ✅ 57/57 |
| `npm run test:validation` | ⚠️ HTML/CSS/schema/style ✅; link checker ❌ (34) |
| `npm run test:accessibility` (chromium) | ⚠️ 4/5 — `stili-base.html` `heading-order` |

---

## 1. Functionality

### ✅ Working

| Feature | Detail |
|---------|--------|
| Homepage | Hero CTAs, test banner, profile rows, FAQ + `FAQPage` JSON-LD |
| `template-loader.js` | Header/footer parsing hardened; schedules load when script is in `<head>` |
| `mappa-personale.js` | `try/catch` on radar chart; slider `aria-valuenow` sync |
| `theme.js` | Light mode forced on `<html>` and `<body>` |
| `mobile-menu.js` | Focus trap, overlay as button, `aria-expanded` / `aria-controls` |
| `cookie-banner.js` | `aria-modal`, idle init, Escape to close |
| SEO pipeline | `inject-seo` → `generate-sitemap` → `validate-seo` |
| Performance | Non-blocking fonts, SW cache, `main.js` removed from all pages |
| A11y | Skip link + `#main-content` on 57 pages via `inject-a11y.js` |

### ⚠️ Edge cases

| Item | Severity | Detail |
|------|----------|--------|
| `stili-base.html` headings | Medium | `h3` before first `h2` (axe `heading-order`) |
| Service worker | Low | `CACHE_NAME` manual bump; no `manifest.json` link |
| `cookie-banner` policy link | Low | `href="cookie-policy.html"` breaks in subdirectories |
| `main.js` | Low | Still in repo but not loaded; legacy `#test-form` only |
| Playwright port | Info | Config uses 8090 (correct for this project) |

---

## 2. Code Quality

### ✅ Strengths

- Shared config: `seo-config.js`
- Idempotent inject scripts: `inject-seo`, `inject-performance`, `inject-a11y`
- BEM CSS; mobile-first
- `loadPublicScript()` for unit tests (VM context)
- Italian content; human TOV improvements on homepage

### ⚠️ Improvements

| File | Issue |
|------|-------|
| `mappa-personale.js` | `disegnaGraficoRadar()` ~155 lines; `identificaProfilo()` ~150 lines |
| `inject-seo.js` | 264 lines; could split `stripAllSeoTags` / `buildSeoBlock` to separate module |
| `breadcrumb-generator.js` | `BREADCRUMB_MAP` + `generateBreadcrumb` large; titles injected via `innerHTML` without escape |
| Duplicated `getAllHTMLFiles()` | Same helper in 5+ scripts — candidate for `scripts/lib/fs-utils.js` |
| One-off scripts | `fix-storie-reali.js`, `fix-approfondimenti.js`, `fix-libri-titles.js` — document or remove after use |

---

## 3. Security

### ✅ Good

- `.env` gitignored; no API keys in diff
- `validateTestResults` / `utils.js` sanitisation on test output paths
- `inject-seo.js` uses `escapeAttr` for meta attributes
- SW limited to same-origin GET
- Cookie banner: technical cookies only; consent in `localStorage`

### ⚠️ Recommendations

| Risk | Mitigation |
|------|------------|
| Breadcrumb `innerHTML` with `h1` text | Use `textContent` or `escapeHTML` from `utils.js` |
| `template-loader` `innerHTML` for templates | Trusted static files only — acceptable |
| SW precache list | Bump `CACHE_NAME` on each production deploy |

---

## 4. Testing

### ✅ Added / fixed

- Unit tests: 32 failing → **50 passing** (`test-utils.js` `loadPublicScript`)
- `validate-seo.js` in CI validation chain
- `axe-core.test.js` wired via `playwright.config.js` `testMatch`
- `style-validator.js` extended AI-pattern rules

### ❌ Gaps

| Gap | Priority |
|-----|----------|
| No unit tests for `inject-seo.js`, `template-loader.js` | Medium |
| Link checker counts template partials as pages | Medium — exclude `templates/` |
| `stili-base.html` heading-order | Medium — change intro `h3` → `h2` or add wrapper `h2` |
| E2E suite empty (`tests/e2e/`) | Low |
| `test-results/`, `playwright-report/` not in `.gitignore` | Low |

---

## 5. Documentation

- ✅ Script headers in `scripts/*.js`
- ✅ `llms.txt` for AI crawlers
- ❌ `CHANGELOG.md` not updated for v1.3.0
- ❌ `package.json` still `1.2.0`
- ❌ No `manifest.json` despite PWA rules in `.cursorrules`

---

## 6. Analytics

Not applicable — static wiki with no user analytics. Cookie banner covers technical storage only. No PII collection identified.

---

## 7. SEO / GEO (post-improvements)

| Asset | Status |
|-------|--------|
| `robots.txt` | ✅ AI crawlers allowed; sitemap + llms.txt referenced |
| `sitemap.xml` | ✅ 57 URLs; differentiated `changefreq` |
| Canonical / OG / Twitter | ✅ All 57 pages; `hreflang`, image dimensions, alt |
| `inject-seo` insert point | ✅ Fixed (was breaking 9 `approfondimenti/` pages) |
| Storie reali meta | ✅ One-line title/description |
| Schema GEO | ✅ `enrich-schema-geo.js` on Article/Quiz/WebPage |
| Homepage FAQ | ✅ `FAQPage` JSON-LD aligned with visible FAQ |

---

## 8. Performance (post-improvements)

| Change | Impact |
|--------|--------|
| Removed `@import` fonts from CSS | Faster first paint |
| Inlined `light.css` into `themes.css` | −1 blocking request |
| Removed dead `main.js` (~9 KB/page) | Less parse time |
| `sw.js` cache-first static assets | Faster repeat visits |
| `requestIdleCallback` cookie banner | Less main-thread contention |

---

## 9. Accessibility (post-improvements)

| Change | Impact |
|--------|--------|
| Skip link + `main-content` | Keyboard / SR navigation |
| Focus-visible global | WCAG 2.4.7 |
| Mobile menu focus trap | WCAG 2.4.3 |
| Breadcrumb `<ol>` | Semantic structure |
| Mappa sliders labelled | WCAG 1.3.1 / 4.1.2 |

**Open:** `stili-base.html` — `h3` «Due linguaggi…» appears before `h2` «I sistemi motivazionali…».

---

## 10. Recommendations (priority order)

### Before merge (quick)

1. Fix `stili-base.html` heading order (`h3` → `h2` or reorder sections).
2. Add to `.gitignore`: `test-results/`, `playwright-report/`.
3. Update `CHANGELOG.md` and `package.json` version → `1.3.0`.

### Soon after merge

4. Add `public/manifest.json` + `<link rel="manifest">` in inject pipeline.
5. Exclude `public/templates/` from link checker.
6. Escape breadcrumb titles in `breadcrumb-generator.js`.
7. Fix cookie-banner policy URL (base-path aware or root-absolute `/cookie-policy.html`).
8. Unit tests for `inject-seo.js` (sanitise, strip duplicates, insert point).

### Backlog

9. Extract shared `getAllHTMLFiles` to `scripts/lib/`.
10. Split `mappa-personale.js` chart/profile logic.
11. Remove or archive one-off `fix-*.js` scripts after documenting in `scripts/README.md`.
12. Bump `CACHE_NAME` in `sw.js` when deploying.

---

## 11. Files to Commit (suggested groups)

**Core + infra**

- `scripts/`: `seo-config.js`, `inject-seo.js`, `generate-sitemap.js`, `validate-seo.js`, `enrich-schema-geo.js`, `inject-performance.js`, `inject-a11y.js`, fix scripts
- `public/robots.txt`, `public/sitemap.xml`, `public/llms.txt`, `public/sw.js`, `public/js/pwa.js`
- `package.json`, `playwright.config.js`, `.gitignore`

**Frontend**

- `public/index.html`, `public/css/main.css`, `public/css/themes.css`
- `public/templates/header.html`
- `public/js/*.js` (modified)
- All injected HTML pages (SEO/a11y/perf blocks)

**Tests + docs**

- `tests/**`, `docs/reviews/CODE_REVIEW_20260616_v2.md`

**Do not commit**

- `test-results/`, `playwright-report/`

---

## Conclusion

The working tree represents a substantial v1.3.0 upgrade: production bug fixes, repeatable SEO/GEO tooling, measurable performance and accessibility gains, and a restored test suite. The previous **merge blocker** (invalid OG on storie-reali) is fixed.

**Verdict:** ✅ **Approve for merge** after fixing `stili-base` heading order and updating version/changelog (≈15 minutes). Remaining items are quality-of-life and can ship in follow-up PRs.

---

*Generated by `/review` — 2026-06-16*
