# Daily SEO / Indexing Agent

Automates sitemap regeneration and submission to Google Search Console, plus optional IndexNow pings for rechargetravels.com.

## Files
- `scripts/seo_indexing_agent.py` – main runner
- `scripts/seo_indexing_agent_requirements.txt` – Python deps
- `public/robots.txt` – points Google/Bing to the sitemap at the custom domain

## One-time setup
1. **Python deps**
   ```bash
   python3 -m venv .venv
   source .venv/bin/activate
   pip install -r scripts/seo_indexing_agent_requirements.txt
   ```
2. **Google Search Console service account**
   - In Google Cloud, enable the Search Console API.
   - Create a service account, download the JSON key, and save it as `scripts/gsc-service-account.json` (or point `--gsc-key` to another path).
   - Add the service account email as an **owner** to the Search Console property `https://www.rechargetravels.com/`.
3. **IndexNow (optional)**
   - Generate a key (e.g., UUID).
   - Create `public/<KEY>.txt` containing the key so `https://www.rechargetravels.com/<KEY>.txt` is reachable.
   - Export the key as an env var before running: `export INDEXNOW_KEY=<KEY>`.

## Running the agent
Examples (from repo root):

- Generate sitemap only (no network calls):
  ```bash
  python3 scripts/seo_indexing_agent.py --output public/sitemap.xml
  ```

- Generate + submit to Google + crawl internal links:
  ```bash
  python3 scripts/seo_indexing_agent.py \
    --crawl --max-crawl 300 \
    --submit \
    --base-url https://www.rechargetravels.com \
    --site-url https://www.rechargetravels.com/ \
    --sitemap-url https://www.rechargetravels.com/sitemap.xml
  ```

- Generate + submit + IndexNow ping (INDEXNOW_KEY env var required):
  ```bash
  INDEXNOW_KEY=$INDEXNOW_KEY \
  python3 scripts/seo_indexing_agent.py --crawl --max-crawl 300 --submit --indexnow-key "$INDEXNOW_KEY"
  ```

Flags:
- `--base-url` – canonical site root (defaults to `https://www.rechargetravels.com`)
- `--site-url` – Search Console property URL (include trailing slash)
- `--sitemap-url` – public sitemap URL
- `--output` – where to write the sitemap (default `public/sitemap.xml`)
- `--crawl` / `--max-crawl` – enable discovery of internal links
- `--extra-urls-file` – newline list of URLs to force include
- `--indexnow-key` – send IndexNow ping when provided

## Scheduling (cron example)
Run daily at 6:30am Colombo time:
```bash
# /etc/cron.d/recharge-seo
30 1 * * * cd /path/to/FINAL-26-11-25NEW-RECHARGETRAVELS-SNC-main && \
/usr/bin/python3 scripts/seo_indexing_agent.py --crawl --max-crawl 300 --submit --indexnow-key "$INDEXNOW_KEY" >> logs/seo-agent.log 2>&1
```

## What the agent does
- Builds `public/sitemap.xml` using seed routes, existing sitemap entries (normalized to the custom domain), and optional crawl discoveries.
- Submits the sitemap via Search Console API (`webmasters v3`).
- Optionally notifies IndexNow-compatible engines with the same URL set.

## Notes
- `public/robots.txt` now advertises the custom-domain sitemap: `https://www.rechargetravels.com/sitemap.xml`.
- If you add new sections/routes, place them in `DEFAULT_SEED_PATHS` inside `seo_indexing_agent.py` or supply an `--extra-urls-file` so they are picked up before Google is pinged.
