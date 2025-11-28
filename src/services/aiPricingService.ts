/**
 * AI Pricing / Availability / Profile / Reputation scaffolding.
 * Replace placeholder logic with real ML/LLM endpoints.
 */

import { Driver } from '@/types/driver'

export interface PricingRecommendation {
  hourly: number
  daily: number
  guideFee?: number
  rationale: string[]
}

export function recommendPricing(driver: Driver, opts?: { region?: string; season?: 'peak' | 'shoulder' | 'off'; demandIndex?: number }): PricingRecommendation {
  const baseDaily = driver.daily_rate || 15000
  const baseHourly = driver.hourly_rate || 2000
  const demandBoost = opts?.demandIndex ? opts.demandIndex * 0.1 : 0
  const tierBoost = driver.is_sltda_approved ? 0.15 : 0.05
  const seasonBoost = opts?.season === 'peak' ? 0.2 : opts?.season === 'shoulder' ? 0.05 : 0
  const perfBoost = driver.average_rating && driver.average_rating > 4.8 ? 0.05 : 0

  const factor = 1 + demandBoost + tierBoost + seasonBoost + perfBoost
  const recDaily = Math.round(baseDaily * factor / 100) * 100 // round to 100 LKR
  const recHourly = Math.round(baseHourly * factor / 50) * 50

  return {
    hourly: recHourly,
    daily: recDaily,
    guideFee: driver.is_sltda_approved ? 2500 : 0,
    rationale: [
      driver.is_sltda_approved ? 'SLTDA approved premium' : 'Standard tier',
      opts?.season === 'peak' ? 'Peak season uplift' : 'Season neutral',
      driver.average_rating && driver.average_rating > 4.8 ? 'Top rating bonus' : 'Rating baseline'
    ]
  }
}

export interface AvailabilitySuggestion {
  message: string
  suggestedDates: string[]
}

export function forecastAvailability(opts?: { startDate?: string; days?: number; region?: string }): AvailabilitySuggestion {
  const start = opts?.startDate ? new Date(opts.startDate) : new Date()
  const days = opts?.days || 7
  const suggested: string[] = []
  for (let i = 0; i < days; i++) {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    // Heuristic: suggest weekends
    if (d.getDay() === 5 || d.getDay() === 6) {
      suggested.push(d.toISOString().split('T')[0])
    }
  }
  return {
    message: `Open key dates in the next ${days} days to catch weekend demand${opts?.region ? ` for ${opts.region}` : ''}.`,
    suggestedDates: suggested
  }
}

export function summarizeReviews(reviews: { rating?: number; comment?: string }[]): string {
  if (!reviews || reviews.length === 0) return 'No reviews yet.'
  const positives = reviews.filter((r) => (r.rating || 0) >= 5 && r.comment).slice(0, 2).map((r) => r.comment)
  const negatives = reviews.filter((r) => (r.rating || 0) <= 3 && r.comment).slice(0, 1).map((r) => r.comment)
  const summaryParts = []
  if (positives.length) summaryParts.push(`Guests praise: ${positives.join(' | ')}`)
  if (negatives.length) summaryParts.push(`Improve: ${negatives.join(' | ')}`)
  return summaryParts.join(' · ')
}
