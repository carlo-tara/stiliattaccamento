---
name: seozoom-stiliattaccamento
extends: a-seozoom
version: 1.1.1
extends-version: 1.1.3
description: >-
  SEO/GEO per Stili di Attaccamento — eredita a-seozoom; path export, hub money,
  quick win quando non in SERP, Pagefind ricerca on-site, limiti import SeoZoom
  e dominio .com unico.
---

# SEO/GEO Stili di Attaccamento — estensione progetto

Skill figlia (L2). Eredita `a-agentzero` → `a-seozoom` → **questo file**.

---

## Progetto

| Campo | Valore |
|-------|--------|
| Nome | Stili di Attaccamento |
| Dominio | `stiliattaccamento.com` (**unico**; mai `.it` — non registrato) |
| Working directory | `/var/www/stiliattaccamento` |
| Tipo sito | PWA statica HTML in `public/` (Cloudflare Pages) |
| `SEOZOOM_PROJECT` | `StilidiAttaccamento` |

---

## Credenziali e path

| Path / variabile | Valore |
|------------------|--------|
| Export SEO | `seo/YYMMDD/` (`seozoom/`, `google/`, `cloudflare/`) — **gitignored** |
| Manifest | `seo/export-manifest.json` |
| Sitemap arricchita | `sitemap-enriched.json` (root; lista URL per export per-URL) |
| Contenuti | `public/**/*.html` |
| SITE_URL canonico | `scripts/seo-config.js` → `https://stiliattaccamento.com` |
| Script AgentFactory | `/var/www/AgentFactory/a-seozoom/scripts/` |
| Sessione Playwright | `.seozoom/session.json` (gitignored) |

Dopo modifiche title/meta/HTML: `npm run seo` (inject-seo + sitemap) poi `npm run perf` se tocchi JS/CSS/templates.

---

## Hub money (owner URL)

| Pagina | Ruolo / intent |
|--------|----------------|
| `public/index.html` | Head brand «stili di attaccamento» |
| `public/stili-base.html` | Tipi di attaccamento / 4 stili |
| `public/fondamenti.html` | Teoria + MOI |
| `public/test.html` | Test stile di attaccamento |
| `public/come-supportare-partner.html` | Partner evitante / supporto |
| `public/dinamiche-coppia.html` | Cicli di coppia |
| `public/modello-gradienti.html` | Paura abbandono (`#abbandono`) |
| `public/risorse.html` | Indice guide |
| `public/libri/adult-attachment-interview.html` | AAI |

---

## Modalità operative

| Modalità | Quando | Cosa fare |
|----------|--------|-----------|
| **Import** | Refresh baseline | `seo_import_all.py --project-root /var/www/stiliattaccamento` (login può richiedere timeout >90s) |
| **Ottimizzazione** | Riscrittura on-page | Title/meta/FAQ hub; `npm run seo` |
| **Analisi** | Priorità keyword / ZO | CSV in `seo/YYMMDD/seozoom/`; ZO/KO da UI SeoZoom + `/var/www/AgentFactory/a-seozoom/references/metriche-seozoom.md` |
| **PageSpeed** | CWV | Workflow L1 a-seozoom |
| **Ricerca on-site** | Pagefind / indice search | Playbook [pagefind-seo-geo.md](pagefind-seo-geo.md) + L1 `ricerca-on-site-seo-geo.md` |

---

## Override: quick win se non in SERP

Se le keyword monitorate sono a pos ~101 / senza URL owner:

1. Allinea dominio (canonical = `seo-config.js` = sitemap = robots = llms)
2. Title/meta/H1 sulle hub money (non ContentGap generico a pos 101)
3. FAQPage JSON-LD **+** sezione FAQ HTML allineate (GEO)
4. Internal linking con anchor keyword verso owner URL
5. Cluster intent mappabili (es. abbandono → `modello-gradienti.html#abbandono`)

Non prioritizzare striking distance 4–20 finché non esistono posizioni reali.

---

## Limiti import noti (progetto)

- Login SeoZoom headless: spesso ~2–3 min; timeout 90s dello script standard può fallire
- API `keyword_all` può rispondere HTTP 204 → niente `keyword_all.csv` / export per-URL
- Modulo Pagine SeoZoom vuoto → `getmainpages` / potential = 0 → skip per-URL
- ZA/ZT/ZS/ZO: **solo UI** SeoZoom, non inventare dai CSV
- Cloudflare: verificare che path/zone siano del sito; batch con path alieni → ignorare per priorità SEO

---

## Regole locali

- Dominio: solo `stiliattaccamento.com`; grep anti-regressione su `.it`
- Ogni numero citato: fonte CSV in `seo/` o UI + data
- Title/meta/FAQ: tono content-voice + linguaggio inclusivo; keyword CSV ≠ copy letterale
- «Disorganizzato»: sinonimo di ricerca/FAQ, non brand (vedi content-voice)
- Copy: skill `content-voice`; UI: `uiux-designer`

---

## Comandi

```bash
# Import SeoZoom (+ altre fonti con flag)
python3 /var/www/AgentFactory/a-seozoom/scripts/seo_import_all.py \
  --project-root /var/www/stiliattaccamento --date $(date +%y%m%d)

# Dopo ottimizzazione on-page
npm run seo && npm run validate-seo
npm run perf   # se JS/CSS/templates — include inject-search + build:search

# Deploy (build + commit artefatti public/ + push)
npm run deploy
```

---

## Ricerca interna (Pagefind)

Canone L1: `a-seozoom/references/ricerca-on-site-seo-geo.md`. **Playbook L2:** [pagefind-seo-geo.md](pagefind-seo-geo.md).

| Cosa | Dettaglio |
|------|-----------|
| Motore | Pagefind 1.5.x, lingua `it`, indice in `public/pagefind/` |
| Build | Ultimo step di `npm run perf` → `build:search` |
| UI | Modal in header, shortcut `/` |
| SEO | `Disallow: /pagefind/` in robots; hub money = owner futuri per mappa intent |
| Strato 2–3 | Roadmap: mappa intent da `monitored.csv` (vedi playbook) |

Dopo ogni batch HTML o template header: `npm run perf` (o `npm run deploy`).

---

## Skill di progetto (deleghe)

| Skill | Path | Quando |
|-------|------|--------|
| content-voice | `.cursor/skills/content-voice/` | Title/meta/FAQ copy |
| uiux-designer | `.cursor/skills/uiux-designer/` | Layout, componente search UI |

---

## Versionamento

| Campo | Valore |
|-------|--------|
| `version` | 1.1.0 |
| `extends-version` | 1.0.8 (`a-seozoom`) |
| CHANGELOG | `.cursor/skills/seozoom-stiliattaccamento/CHANGELOG.md` |
