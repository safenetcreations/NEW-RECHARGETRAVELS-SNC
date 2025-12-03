#!/usr/bin/env node
/**
 * Google Search Console reactive audit
 *
 * Compares the last N days vs the previous N days, outputs CSV deltas
 * by page and by page+query, and prints the biggest movers so you can
 * queue refreshes, reindex, or noindex actions.
 *
 * Usage (from repo root):
 *   node scripts/gsc-reactive-audit.js --site-url=https://www.rechargetravels.com/
 *
 * Env/flags:
 *   --site-url / GSC_SITE_URL        Search Console property (with trailing slash)
 *   --key-file / GSC_KEY_FILE        Service account JSON (default scripts/gsc-service-account.json)
 *   --lookback-days / GSC_LOOKBACK_DAYS   Days per window (default 28)
 *   --lag-days / GSC_LAG_DAYS        Offset to avoid partial data (default 3)
 *   --min-delta-pct / GSC_MIN_DELTA_PCT   % threshold for console highlights (default 20)
 *   --out-dir / GSC_OUTPUT_DIR       Where to drop CSVs (default reports/gsc-audits)
 *   --dimensions / GSC_DIMENSIONS    Dimensions to request (default "page,query" — must include page)
 *   --search-type / GSC_SEARCH_TYPE  web | news | image | video | discover (default web)
 *   --top / GSC_TOP                  How many movers to print in console (default 20)
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { google } from 'googleapis'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const SCOPES = ['https://www.googleapis.com/auth/webmasters.readonly']
const DEFAULT_SITE = 'https://www.rechargetravels.com/'
const DEFAULT_DIMENSIONS = ['page', 'query']
const ROW_LIMIT = 25000

function parseArgs(argv) {
  const parsed = {}
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i]
    if (!arg.startsWith('--')) continue
    const key = arg.slice(2)
    const next = argv[i + 1]
    if (!next || next.startsWith('--')) {
      parsed[key] = true
    } else {
      parsed[key] = next
      i += 1
    }
  }
  return parsed
}

function ensureTrailingSlash(url) {
  return url.endsWith('/') ? url : `${url}/`
}

function formatDate(date) {
  return date.toISOString().split('T')[0]
}

function round(value, digits = 2) {
  const multiplier = 10 ** digits
  return Math.round(value * multiplier) / multiplier
}

function pctDelta(curr, prev) {
  if (prev === 0) return curr === 0 ? 0 : 100
  return ((curr - prev) / prev) * 100
}

function buildDateRanges(lookbackDays, lagDays) {
  const endCurrent = new Date()
  endCurrent.setDate(endCurrent.getDate() - lagDays)
  const startCurrent = new Date(endCurrent)
  startCurrent.setDate(startCurrent.getDate() - (lookbackDays - 1))

  const endPrevious = new Date(startCurrent)
  endPrevious.setDate(endPrevious.getDate() - 1)
  const startPrevious = new Date(endPrevious)
  startPrevious.setDate(startPrevious.getDate() - (lookbackDays - 1))

  return {
    current: { start: formatDate(startCurrent), end: formatDate(endCurrent) },
    previous: { start: formatDate(startPrevious), end: formatDate(endPrevious) },
  }
}

async function fetchSearchAnalytics(webmasters, siteUrl, startDate, endDate, dimensions, searchType) {
  const rows = []
  let startRow = 0

  // GSC caps rowLimit at 25000; paginate until fewer rows are returned.
  while (true) {
    const res = await webmasters.searchanalytics.query({
      siteUrl,
      requestBody: {
        startDate,
        endDate,
        dimensions,
        rowLimit: ROW_LIMIT,
        startRow,
        searchType,
      },
    })
    const batch = res.data.rows ?? []
    rows.push(...batch)
    if (batch.length < ROW_LIMIT) break
    startRow += ROW_LIMIT
  }

  return rows
}

function blankMetrics() {
  return {
    clicks: 0,
    impressions: 0,
    positionNumerator: 0,
  }
}

function addRowMetrics(target, row) {
  const impressions = row.impressions ?? 0
  const clicks = row.clicks ?? 0
  const position = row.position ?? 0

  target.clicks += clicks
  target.impressions += impressions
  target.positionNumerator += position * impressions
}

function aggregateRows(rows, pageIndex, queryIndex) {
  const map = new Map()
  for (const row of rows) {
    const keys = row.keys ?? []
    const page = keys[pageIndex]
    if (!page) continue
    const query = queryIndex >= 0 ? keys[queryIndex] ?? '' : undefined
    const mapKey = queryIndex >= 0 ? `${page}||${query}` : page

    const existing = map.get(mapKey) ?? { page, query, metrics: blankMetrics() }
    addRowMetrics(existing.metrics, row)
    map.set(mapKey, existing)
  }
  return map
}

function finalizeMetrics(entry) {
  if (!entry) {
    return { clicks: 0, impressions: 0, ctr: 0, position: 0 }
  }
  const { clicks, impressions, positionNumerator } = entry.metrics
  const safeImpressions = impressions || 0
  const position = safeImpressions ? positionNumerator / safeImpressions : 0
  const ctr = safeImpressions ? clicks / safeImpressions : 0
  return { clicks, impressions: safeImpressions, ctr, position }
}

function buildDeltaRows(currentMap, previousMap, includeQuery) {
  const keys = new Set([...currentMap.keys(), ...previousMap.keys()])
  const rows = []

  for (const key of keys) {
    const current = currentMap.get(key)
    const previous = previousMap.get(key)
    const baseMeta = current ?? previous
    if (!baseMeta) continue

    const currentStats = finalizeMetrics(current)
    const previousStats = finalizeMetrics(previous)

    const clicksDelta = currentStats.clicks - previousStats.clicks
    const impressionsDelta = currentStats.impressions - previousStats.impressions

    const row = {
      page: baseMeta.page,
      ...(includeQuery ? { query: baseMeta.query ?? '' } : {}),
      clicks_prev: previousStats.clicks,
      clicks_curr: currentStats.clicks,
      clicks_delta: clicksDelta,
      clicks_delta_pct: round(pctDelta(currentStats.clicks, previousStats.clicks)),
      impressions_prev: previousStats.impressions,
      impressions_curr: currentStats.impressions,
      impressions_delta: impressionsDelta,
      impressions_delta_pct: round(pctDelta(currentStats.impressions, previousStats.impressions)),
      ctr_prev: round(previousStats.ctr * 100),
      ctr_curr: round(currentStats.ctr * 100),
      ctr_delta: round((currentStats.ctr - previousStats.ctr) * 100),
      position_prev: round(previousStats.position),
      position_curr: round(currentStats.position),
      position_delta: round(currentStats.position - previousStats.position),
    }

    rows.push(row)
  }

  return rows.sort((a, b) => Math.abs(b.clicks_delta_pct) - Math.abs(a.clicks_delta_pct))
}

function toCsv(rows, headers) {
  const escape = (value) => {
    if (value === null || value === undefined) return ''
    const str = String(value)
    if (str.includes('"') || str.includes(',') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`
    }
    return str
  }

  return [
    headers.join(','),
    ...rows.map((row) => headers.map((h) => escape(row[h])).join(',')),
  ].join('\n')
}

function printHighlights(rows, label, thresholdPct, top) {
  const losers = rows.filter((row) => row.clicks_delta_pct <= -thresholdPct).slice(0, top)
  const gainers = rows.filter((row) => row.clicks_delta_pct >= thresholdPct).slice(0, top)

  const render = (items) =>
    items
      .map((item) => {
        const lead = item.page
        const query = 'query' in item && item.query ? ` | ${item.query}` : ''
        return `- ${lead}${query} | clicks ${item.clicks_curr} (${item.clicks_delta_pct}%), impressions ${item.impressions_curr} (${item.impressions_delta_pct}%)`
      })
      .join('\n')

  console.log(`\n${label}:`)
  if (gainers.length) console.log(`  ▲ Gains (>${thresholdPct}%):\n${render(gainers)}`)
  if (losers.length) console.log(`  ▼ Losses (<-${thresholdPct}%):\n${render(losers)}`)
  if (!gainers.length && !losers.length) console.log('  (no movers above threshold)')
}

async function main() {
  const args = parseArgs(process.argv.slice(2))
  const config = {
    siteUrl: ensureTrailingSlash(args['site-url'] ?? process.env.GSC_SITE_URL ?? DEFAULT_SITE),
    keyFile: path.resolve(args['key-file'] ?? process.env.GSC_KEY_FILE ?? path.join(__dirname, 'gsc-service-account.json')),
    lookbackDays: Number(args['lookback-days'] ?? process.env.GSC_LOOKBACK_DAYS ?? 28),
    lagDays: Number(args['lag-days'] ?? process.env.GSC_LAG_DAYS ?? 3),
    minDeltaPct: Number(args['min-delta-pct'] ?? process.env.GSC_MIN_DELTA_PCT ?? 20),
    outputDir: path.resolve(args['out-dir'] ?? process.env.GSC_OUTPUT_DIR ?? 'reports/gsc-audits'),
    dimensions: (args.dimensions ?? process.env.GSC_DIMENSIONS ?? DEFAULT_DIMENSIONS.join(','))
      .split(',')
      .map((d) => d.trim())
      .filter(Boolean),
    searchType: args['search-type'] ?? process.env.GSC_SEARCH_TYPE ?? 'web',
    top: Number(args.top ?? process.env.GSC_TOP ?? 20),
  }

  if (!config.dimensions.includes('page')) {
    throw new Error('GSC dimensions must include "page"')
  }

  if (!fs.existsSync(config.keyFile)) {
    throw new Error(`Service account key not found at ${config.keyFile}`)
  }

  const pageIndex = config.dimensions.indexOf('page')
  const queryIndex = config.dimensions.indexOf('query')

  const { current, previous } = buildDateRanges(config.lookbackDays, config.lagDays)
  console.log(`[info] Auditing ${config.siteUrl} (${config.searchType})`)
  console.log(`[info] Current window: ${current.start} → ${current.end}`)
  console.log(`[info] Previous window: ${previous.start} → ${previous.end}`)

  const auth = new google.auth.GoogleAuth({ scopes: SCOPES, keyFile: config.keyFile })
  const webmasters = google.webmasters({ version: 'v3', auth })

  const [currentRows, previousRows] = await Promise.all([
    fetchSearchAnalytics(webmasters, config.siteUrl, current.start, current.end, config.dimensions, config.searchType),
    fetchSearchAnalytics(webmasters, config.siteUrl, previous.start, previous.end, config.dimensions, config.searchType),
  ])

  const pageCurrent = aggregateRows(currentRows, pageIndex, -1)
  const pagePrevious = aggregateRows(previousRows, pageIndex, -1)
  const pageDeltaRows = buildDeltaRows(pageCurrent, pagePrevious, false)

  let pageQueryDeltaRows = []
  if (queryIndex >= 0) {
    const pageQueryCurrent = aggregateRows(currentRows, pageIndex, queryIndex)
    const pageQueryPrevious = aggregateRows(previousRows, pageIndex, queryIndex)
    pageQueryDeltaRows = buildDeltaRows(pageQueryCurrent, pageQueryPrevious, true)
  }

  fs.mkdirSync(config.outputDir, { recursive: true })
  const stamp = current.end
  const pageOut = path.join(config.outputDir, `gsc-pages-${stamp}.csv`)
  const pqOut = path.join(config.outputDir, `gsc-page-query-${stamp}.csv`)

  const pageHeaders = [
    'page',
    'clicks_prev',
    'clicks_curr',
    'clicks_delta',
    'clicks_delta_pct',
    'impressions_prev',
    'impressions_curr',
    'impressions_delta',
    'impressions_delta_pct',
    'ctr_prev',
    'ctr_curr',
    'ctr_delta',
    'position_prev',
    'position_curr',
    'position_delta',
  ]
  const pageQueryHeaders = [
    'page',
    'query',
    ...pageHeaders.slice(1),
  ]

  fs.writeFileSync(pageOut, toCsv(pageDeltaRows, pageHeaders))
  if (pageQueryDeltaRows.length) {
    fs.writeFileSync(pqOut, toCsv(pageQueryDeltaRows, pageQueryHeaders))
  }

  console.log(`[info] CSV (pages): ${pageOut}`)
  if (pageQueryDeltaRows.length) console.log(`[info] CSV (page + query): ${pqOut}`)

  printHighlights(pageDeltaRows, 'Page movers', config.minDeltaPct, config.top)
  if (pageQueryDeltaRows.length) {
    printHighlights(pageQueryDeltaRows, 'Page + Query movers', config.minDeltaPct, config.top)
  }
}

main().catch((err) => {
  console.error('[error]', err.message)
  process.exit(1)
})
