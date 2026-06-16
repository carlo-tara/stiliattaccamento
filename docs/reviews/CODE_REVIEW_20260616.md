# Code Review Report — Full Working Tree (v1.3.0 candidate)

**Date:** 2026-06-16  
**Reviewer:** AI Code Review  
**Project:** Stili di Attaccamento Wiki — PWA Static Website  
**Scope:** All uncommitted changes on `main` (71 files, +3690 / −742 lines)  
**Base commit:** `c6f5901` (v1.2.0)

---

## Executive Summary

This review covers a large working tree spanning homepage UX/UI, SEO/GEO infrastructure, tone-of-voice rewrites, test infrastructure repair, and a **critical production bug fix** in `mappa-personale.js`.

**Overall assessment:** ⚠️ **GOOD — BLOCK MERGE UNTIL STORIE-REALI META FIXED**

The codebase is materially improved: unit tests pass (50/50), SEO/GEO tooling is in place, homepage is stronger, and the radar chart syntax error is fixed. However, **`inject-seo.js` propagated oversized `<title>` / `<meta description>` content into Open Graph tags** on `storie-reali/*.html`, producing invalid multi-line meta attributes. This must be fixed before deploy.

---

## Change Summary by Area

| Area | Files | Assessment |
|------|-------|--------------|
| Homepage UX/UI | `index.html`, `main.css` | ✅ Strong improvement |
| SEO | 57 HTML + scripts | ⚠️ Good infra; storie-reali regression |
| GEO | `llms.txt`, `robots.txt`, FAQ, schema enrich | ✅ Solid |
| TOV | `index.html`, `archetipi.html`, validator | ✅ More human voice |
| JS fixes | `mappa-personale.js`, `template-loader.js`, `theme.js` | ✅ Critical fixes |
| Tests | 4 unit test files + `test-utils.js` | ✅ 50/50 passing |
| Config | `package.json`, `.gitignore` | ✅ Appropriate |

---

## 1. Functionality Review

### ✅ Works as expected

- **Homepage:** Hero CTAs restored, test banner repositioned, profile rows with level labels, FAQ section.
- **Template loader:** `querySelector('header'|'footer')`, `html.trim()`, null guards, `parentNode` check.
- **Mappa personale:** Syntax error fixed (`try` without `catch`); `showChartJSError()` implemented; chart init wrapped in `catch`.
- **Theme:** `setTheme()` now sets `data-theme` on `<body>` consistently with init block.
- **Breadcrumb schema:** `BreadcrumbList` JSON-LD injected dynamically.
- **SEO scripts:** `npm run seo` and `npm run geo` generate sitemap and enrich schema.

### ❌ Critical — storie-reali Open Graph

`public/storie-reali/*.html` pages have **entire story content** inside:
- `<meta name="description" content="...">` (pre-existing)
- `<title>` (pre-existing)
- **New:** `<meta property="og:title">` and `og:description` copied verbatim by `inject-seo.js`

Example (`marco.html` line 171): `og:title` spans hundreds of lines — **invalid HTML**, breaks social previews, may harm SEO.

**Root cause:** `inject-seo.js` reads `title` and `meta[name=description]` without length sanitisation; storie-reali pages were never designed with short meta fields.

**Required fix:** Truncate meta to ~160 chars in `inject-seo.js` AND shorten storie-reali `<title>` / `<meta description>` to one-line summaries.

### ⚠️ Other edge cases

| Item | Severity | Detail |
|------|----------|--------|
| `disegnaGraficoRadar()` length | Low | ~110 lines; Chart.js config verbosity |
| Duplicate CTA targets | Low | Strategie + esercizi → `esercizi.html` (intentional post-TOV) |
| Link checker | Medium | 34 broken links in template partials (pre-existing) |

**Status:** ⚠️ **BLOCKED** on storie-reali meta

---

## 2. Code Quality Review

### ✅ Strengths

- BEM CSS: `banner-horizontal__*`, `profile-row__*`, `faq-item`
- Modular scripts: `seo-config.js`, `generate-sitemap.js`, `inject-seo.js`, `enrich-schema-geo.js`
- `loadPublicScript()` in test-utils — clean VM-based test loading
- Comments explain *why* (Live Preview workaround in template-loader)
- Debug `console.log` removed from template-loader

### ⚠️ Issues

| Issue | Severity | Location |
|-------|----------|----------|
| `inject-seo.js` no meta truncation | **High** | `buildSeoBlock()` |
| `inject-seo.js` no HTML attribute escaping for newlines | **High** | `buildSeoBlock()` |
| `disegnaGraficoRadar()` > 50 lines | Low | `mappa-personale.js` |
| Storie-reali duplicate content in head | Medium | Pre-existing, amplified by SEO inject |

**Status:** ⚠️ **GOOD** after storie-reali fix

---

## 3. Security Review

### ✅ Pass

- No secrets in diff; `.gitignore` extended for podcast artefacts
- `utils.js` sanitization unchanged; `createSafeElement` whitelist intact
- `robots.txt` explicitly allows AI crawlers (intentional for GEO)
- Template `innerHTML` from same-origin static files only

### ⚠️ Note

- Oversized `og:description` could leak full story in social crawler logs — fix by truncation

**Status:** ✅ **PASS** (minor after meta fix)

---

## 4. Testing Review

### ✅ Unit tests — all passing

```
Test Files  4 passed (4)
Tests       50 passed (50)
```

| File | Tests | Notes |
|------|-------|-------|
| `utils.test.js` | 32 | `loadPublicScript()` via `vm.createContext` |
| `mobile-menu.test.js` | 5 | No broken regex strip |
| `theme.test.js` | 7 | Body theme attribute |
| `mappa-personale.test.js` | 6 | Secure profile fixture corrected |

### ✅ Validation

| Script | Result |
|--------|--------|
| HTML validator | ✅ 60/60 |
| CSS validator | ✅ 6/6 |
| Style validator (TOV) | ✅ 60/60 |
| Schema.org | ✅ 57/57 valid |
| Link checker | ❌ 34 broken (templates) |

### ⚠️ Gaps

- No unit tests for `template-loader.js` parsing logic
- No unit tests for `inject-seo.js` / `generate-sitemap.js`
- E2E not re-run in this review
- RGR not followed for new features (tests added reactively)

**Status:** ✅ **GOOD** (coverage gaps remain)

---

## 5. Documentation Review

| Item | Status |
|------|--------|
| `CHANGELOG.md` | ❌ Not updated for v1.3.0 |
| `scripts/` README | ⚠️ No docs for new `seo`/`geo` commands |
| Inline comments | ✅ Adequate |
| `llms.txt` | ✅ Curated index for LLMs |
| British English in docs | N/A — Italian user-facing content |

**Status:** ⚠️ **UPDATE CHANGELOG BEFORE RELEASE**

---

## 6. Analytics Integration Review

- No analytics layer; cookie policy states no third-party tracking
- No changes in this diff

**Status:** ✅ **N/A**

---

## 7. Accessibility & Mobile

- FAQ uses semantic `<dl>` with `aria-labelledby`
- Profile images retain descriptive `alt` text
- Hero CTAs restored for first-viewport keyboard access
- Mobile breakpoints for banner, profile grid, FAQ

**Status:** ✅ **GOOD**

---

## Checklist

| Area | Result | Notes |
|------|--------|-------|
| Functionality | ❌ | Storie-reali OG meta broken; mappa fix is critical win |
| Code quality | ⚠️ | inject-seo needs sanitisation |
| Security | ✅ | No regressions |
| Testing | ✅ | 50/50 unit tests; validation mostly green |
| Documentation | ⚠️ | CHANGELOG pending |
| Analytics | ✅ | N/A |

---

## Recommendations

### Must fix before merge

1. **Truncate and escape meta in `inject-seo.js`** — max ~160 chars, strip newlines, escape `"` in attributes
2. **Rewrite storie-reali `<title>` and `<meta description>`** — one-line summaries only; re-run `npm run seo`
3. **Verify `marco.html` (and siblings) in browser devtools** — no multi-line meta attributes

### Should fix

4. Update `CHANGELOG.md` for v1.3.0
5. Document `npm run seo` / `npm run geo` in `CONTRIBUTING.md` or `scripts/README.md`
6. Add unit test for `template-loader.js` header/footer parsing
7. Fix link checker false positives for `templates/*.html`

### Nice to have

8. Refactor `disegnaGraficoRadar()` into smaller functions
9. Add E2E test for homepage FAQ and test banner
10. Add `inject-seo` test asserting meta length ≤ 160

---

## Notable Fixes Since Last Review

| Fix | Impact |
|-----|--------|
| `mappa-personale.js` try/catch + `showChartJSError` | **Production-breaking syntax error resolved** |
| Unit test suite (`loadPublicScript`) | CI-ready: 0 → 50 passing |
| `template-loader.js` parentNode guard | Prevents crash on detached placeholder |
| `theme.js` body `data-theme` | Consistent theming |

---

## Conclusion

The working tree represents a substantial v1.3.0 release candidate with real quality improvements across UX, SEO, GEO, TOV, and test infrastructure. The **single blocking issue** is corrupted Open Graph metadata on storie-reali pages caused by `inject-seo.js` copying oversized title/description fields.

**Recommended action:** Fix storie-reali meta + inject-seo sanitisation → update CHANGELOG → commit as v1.3.0.
