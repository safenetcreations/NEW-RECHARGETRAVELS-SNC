# GSC Reactive Audit + Local SEO Workflows

## Cron-ready GSC compare script
- Script: `scripts/gsc-reactive-audit.js`
- Default property: `https://www.rechargetravels.com/` (override with `--site-url=` or `GSC_SITE_URL`)
- Auth: Search Console service account JSON at `scripts/gsc-service-account.json` (or pass `--key-file=`); add that service account as an **Owner** in GSC and enable the Search Console API.
- Run once: `npm install` (adds `googleapis` if missing).
- Ad-hoc: `npm run seo:gsc-audit` (outputs CSVs to `reports/gsc-audits` with page deltas and page+query deltas, highlights ≥20% movers in console).
- Cron example (daily 06:30 IST, adjust paths):
  ```
  0 1 * * * cd /path/to/FINAL-26-11-25NEW-RECHARGETRAVELS-SNC-main && \
  /usr/bin/node scripts/gsc-reactive-audit.js \
    --site-url=https://www.rechargetravels.com/ \
    --key-file=/path/to/gsc-service-account.json \
    --out-dir=reports/gsc-audits \
    --lookback-days=28 --lag-days=3 --min-delta-pct=20 \
    >> logs/gsc-reactive-audit.log 2>&1
  ```
- Pair with crawl logs: join the CSV `page` column to your GoAccess/NGINX crawl summaries to spot whether drops are crawl-related (crawl hits down) or intent-related (crawl steady, SERP metrics down).

## Refresh & reindex checklist
- Tighten intro/lede, add a hero image, and ensure H1 + title target the primary query.
- Cover query variants seen in GSC (platform/provider/tool, etc.), add light word-count lift, entities, and FAQs/How-to schema where relevant.
- Strengthen internal links (from navigation hubs and related posts) and add one outbound authoritative citation.
- Update stats/quotes/examples; refresh `dateModified` in schema and on-page date if materially changed.
- Publish, then request indexing in GSC; note refresh date in your tracker.

## Sitewide quality guardrail (weekly)
- Crawl to flag thin/zero-image/orphaned/duplicate URLs; export a CSV for `noindex`, merge, or redirect.
- Maintain a redirect map for merged content and a `noindex` queue for deadweight pages until fixed or removed.
- Keep a “weak pages” sheet fed by the GSC delta CSV (pages with ≥20% declines) to triage fixes vs. deprecations.

## GBP weekly workflow
- Categories: keep up to 10 relevant; Services: list 20–30 with clean descriptions; landing URLs use UTM params.
- Posts: publish at least one per week (offer/update/event) and upload new geo-tagged photos weekly.
- Reputation: same-day responses to reviews and Q&A; flag any patterns needing new FAQs or landing pages.
