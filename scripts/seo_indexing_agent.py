#!/usr/bin/env python3
"""
Recharge Travels SEO agent.

- Regenerates sitemap.xml using seed routes, existing sitemap entries, and optional crawling
- Submits the sitemap to Google Search Console
- Optionally pings IndexNow-compatible search engines

Configure via environment variables or CLI flags. Default base URL: https://www.rechargetravels.com
"""
from __future__ import annotations

import argparse
import sys
from datetime import datetime
from pathlib import Path
from typing import Iterable, List, Set
from urllib.parse import urljoin, urlparse

import requests
from bs4 import BeautifulSoup
from google.oauth2 import service_account
from googleapiclient.discovery import build

DEFAULT_SEED_PATHS = [
    '/',
    '/about',
    '/contact',
    '/book-now',
    '/tours',
    '/tours/cultural',
    '/tours/wildlife-tours',
    '/tours/beach-tours',
    '/tours/luxury',
    '/tours/honeymoon',
    '/tours/wellness',
    '/tours/ecotourism',
    '/tours/photography',
    '/destinations',
    '/destinations/colombo',
    '/destinations/kandy',
    '/destinations/galle',
    '/destinations/sigiriya',
    '/destinations/ella',
    '/destinations/jaffna',
    '/destinations/anuradhapura',
    '/destinations/polonnaruwa',
    '/transport',
    '/transport/airport-transfers',
    '/transport/private-tours',
    '/transport/group-transport',
    '/experiences/train-journeys',
    '/experiences/tea-trails',
    '/experiences/safari-package-builder',
    '/blog',
    '/travel-guide',
]

USER_AGENT = 'RechargeTravelsSEOAgent/1.0 (+https://www.rechargetravels.com)'


def normalize_to_base(url: str, base_url: str) -> str:
    parsed_base = urlparse(base_url)
    if not parsed_base.scheme or not parsed_base.netloc:
        raise ValueError('base_url must include scheme and host')

    trimmed = url.strip()
    if not trimmed:
        return ''

    parsed = urlparse(trimmed)
    if parsed.scheme and parsed.scheme not in ('http', 'https'):
        return ''
    base_prefix = f"{parsed_base.scheme}://{parsed_base.netloc}"

    if not parsed.netloc:
        absolute = urljoin(base_prefix, parsed.path)
    else:
        absolute = f"{parsed_base.scheme}://{parsed_base.netloc}{parsed.path}"
        if parsed.query:
            absolute = f"{absolute}?{parsed.query}"

    return absolute.rstrip('/') or base_prefix


def load_existing_sitemap(path: Path, base_url: str) -> List[str]:
    import xml.etree.ElementTree as ET

    if not path.exists():
        return []

    urls: List[str] = []
    try:
        tree = ET.parse(path)
        root = tree.getroot()
        namespace = '{http://www.sitemaps.org/schemas/sitemap/0.9}'
        for url in root.findall(f'{namespace}url'):
            loc = url.find(f'{namespace}loc')
            if loc is not None and loc.text:
                normalized = normalize_to_base(loc.text, base_url)
                if normalized:
                    urls.append(normalized)
    except Exception as exc:  # pragma: no cover - defensive parse guard
        print(f'[warn] Unable to parse existing sitemap: {exc}', file=sys.stderr)

    return urls


def load_extra_urls(path: Path, base_url: str) -> List[str]:
    if not path.exists():
        raise FileNotFoundError(f'Extra URL file not found: {path}')

    urls: List[str] = []
    for line in path.read_text().splitlines():
        line = line.strip()
        if line:
            normalized = normalize_to_base(line, base_url)
            if normalized:
                urls.append(normalized)
    return urls


def build_seed_urls(base_url: str, seed_paths: Iterable[str]) -> List[str]:
    base = base_url.rstrip('/')
    return [normalize_to_base(path, base) for path in seed_paths]


def crawl_site(base_url: str, max_urls: int = 150) -> Set[str]:
    queue: List[str] = [base_url.rstrip('/')]
    seen: Set[str] = set()
    discovered: Set[str] = set()
    headers = {'User-Agent': USER_AGENT}

    while queue and len(discovered) < max_urls:
        current = queue.pop(0)
        if current in seen:
            continue
        seen.add(current)
        try:
            response = requests.get(current, timeout=10, headers=headers)
            response.raise_for_status()
        except Exception as exc:
            print(f'[warn] Crawl skipped {current}: {exc}', file=sys.stderr)
            continue

        discovered.add(current.rstrip('/'))
        soup = BeautifulSoup(response.text, 'html.parser')
        for link in soup.find_all('a', href=True):
            target = link['href'].split('#')[0]
            normalized = normalize_to_base(target, base_url)
            if normalized and normalized.startswith(base_url.rstrip('/')) and normalized not in seen:
                queue.append(normalized)

    return discovered


def priority_for(url: str, base_url: str) -> float:
    if url.rstrip('/') == base_url.rstrip('/'):
        return 1.0
    if any(part in url for part in ['/tours', '/destinations', '/blog', '/travel-guide']):
        return 0.9
    return 0.7


def write_sitemap(urls: Iterable[str], output_path: Path, base_url: str) -> None:
    today = datetime.utcnow().date().isoformat()
    url_entries: List[str] = []
    for url in sorted(set(urls)):
        url_entries.append(
            f"  <url>\n"
            f"    <loc>{url}</loc>\n"
            f"    <lastmod>{today}</lastmod>\n"
            f"    <changefreq>daily</changefreq>\n"
            f"    <priority>{priority_for(url, base_url)}</priority>\n"
            f"  </url>"
        )

    xml = (
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        + '\n'.join(url_entries) + '\n'
        '</urlset>\n'
    )

    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(xml, encoding='utf-8')


def submit_sitemap(creds_path: Path, site_url: str, sitemap_url: str) -> None:
    scopes = ['https://www.googleapis.com/auth/webmasters']
    creds = service_account.Credentials.from_service_account_file(str(creds_path), scopes=scopes)
    service = build('webmasters', 'v3', credentials=creds, cache_discovery=False)
    service.sitemaps().submit(siteUrl=site_url, feedpath=sitemap_url).execute()


def ping_indexnow(host: str, key: str, urls: List[str], endpoint: str) -> None:
    payload = {
        'host': host,
        'key': key,
        'keyLocation': f'https://{host}/{key}.txt',
        'urlList': urls,
    }
    headers = {'Content-Type': 'application/json', 'User-Agent': USER_AGENT}
    response = requests.post(endpoint, json=payload, timeout=10, headers=headers)
    response.raise_for_status()


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description='Daily SEO agent for sitemap + Search Console')
    parser.add_argument('--base-url', default='https://www.rechargetravels.com', help='Site base URL (no trailing slash)')
    parser.add_argument('--site-url', default=None, help='Search Console site URL (defaults to base URL)')
    parser.add_argument('--sitemap-url', default=None, help='Public sitemap URL (defaults to base-url/sitemap.xml)')
    parser.add_argument('--output', default='public/sitemap.xml', help='Where to write the generated sitemap')
    parser.add_argument('--extra-urls-file', type=Path, help='Optional newline-delimited URL list to force-include')
    parser.add_argument('--max-crawl', type=int, default=150, help='Max URLs to discover when crawling')
    parser.add_argument('--crawl', action='store_true', help='Enable internal crawl to discover additional URLs')
    parser.add_argument('--gsc-key', type=Path, default=Path('scripts/gsc-service-account.json'), help='Path to Search Console service account JSON')
    parser.add_argument('--submit', action='store_true', help='Submit sitemap to Google Search Console after generation')
    parser.add_argument('--indexnow-key', default=None, help='IndexNow key (if provided, a ping will be sent)')
    parser.add_argument('--indexnow-endpoint', default='https://api.indexnow.org/indexnow', help='IndexNow endpoint URL')
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    base_url = args.base_url.rstrip('/')
    site_url = args.site_url.rstrip('/') if args.site_url else f'{base_url}/'
    sitemap_url = args.sitemap_url.rstrip('/') if args.sitemap_url else f'{base_url}/sitemap.xml'
    output_path = Path(args.output)

    seeds = build_seed_urls(base_url, DEFAULT_SEED_PATHS)
    existing = load_existing_sitemap(output_path, base_url)
    extras: List[str] = []
    if args.extra_urls_file:
        extras = load_extra_urls(args.extra_urls_file, base_url)

    crawled: Set[str] = set()
    if args.crawl:
        crawled = crawl_site(base_url, max_urls=args.max_crawl)

    all_urls: Set[str] = set(seeds + existing + extras + list(crawled))
    write_sitemap(all_urls, output_path, base_url)

    print(f'[info] sitemap generated at {output_path} with {len(all_urls)} URLs')

    if args.submit:
        submit_sitemap(args.gsc_key, site_url, sitemap_url)
        print(f'[info] submitted sitemap to Search Console: {sitemap_url}')

    if args.indexnow_key:
        host = urlparse(base_url).netloc
        ping_indexnow(host, args.indexnow_key, list(all_urls), args.indexnow_endpoint)
        print(f'[info] sent IndexNow ping for {len(all_urls)} URLs')


if __name__ == '__main__':
    try:
        main()
    except Exception as exc:  # pragma: no cover - CLI safety
        print(f'[error] {exc}', file=sys.stderr)
        sys.exit(1)
