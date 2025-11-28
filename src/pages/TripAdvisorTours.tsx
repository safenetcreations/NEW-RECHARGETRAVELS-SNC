import { useMemo, useState } from 'react'
import { MapPin, Star, Clock, ArrowUpRight, Sparkles, Filter, Compass } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  RECHARGE_TRIPADVISOR_URL,
  tripAdvisorTours,
  type TripAdvisorRegion,
  type TripAdvisorTour
} from '@/data/tripAdvisorTours'
import { SEOMetaTags } from '@/components/seo/SEOMetaTags'
import { SEOSchema } from '@/components/seo/SEOSchema'

type PriceRangeId = 'all' | '0-100' | '100-300' | '300-500' | '500+'
type SortOption = 'rating' | 'price-asc' | 'price-desc' | 'reviews'

const priceRanges: Record<PriceRangeId, { min: number; max: number }> = {
  all: { min: 0, max: Number.POSITIVE_INFINITY },
  '0-100': { min: 0, max: 100 },
  '100-300': { min: 100, max: 300 },
  '300-500': { min: 300, max: 500 },
  '500+': { min: 500, max: Number.POSITIVE_INFINITY }
}

const sortTourList = (tours: TripAdvisorTour[], sortBy: SortOption) => {
  if (sortBy === 'rating') return [...tours].sort((a, b) => b.rating - a.rating || b.reviews - a.reviews)
  if (sortBy === 'price-asc') return [...tours].sort((a, b) => a.priceUsd - b.priceUsd)
  if (sortBy === 'price-desc') return [...tours].sort((a, b) => b.priceUsd - a.priceUsd)
  return [...tours].sort((a, b) => b.reviews - a.reviews || b.rating - a.rating)
}

const renderStars = (rating: number) => {
  const stars = []
  const fullStars = Math.floor(rating)
  const hasHalf = rating - fullStars >= 0.5
  for (let i = 0; i < 5; i += 1) {
    const filled = i < fullStars || (i === fullStars && hasHalf)
    stars.push(
      <Star
        key={i}
        className={`h-4 w-4 ${filled ? 'text-emerald-500 fill-emerald-500' : 'text-emerald-200'}`}
      />
    )
  }
  return stars
}

const TripAdvisorTours = () => {
  const [search, setSearch] = useState('')
  const [region, setRegion] = useState<TripAdvisorRegion | ''>('')
  const [priceRange, setPriceRange] = useState<PriceRangeId>('all')
  const [sortBy, setSortBy] = useState<SortOption>('rating')

  const operatorTours = useMemo(
    () => tripAdvisorTours.filter((tour) => tour.operatorProfileUrl === RECHARGE_TRIPADVISOR_URL),
    []
  )
  const baseTours = operatorTours.length ? operatorTours : tripAdvisorTours
  const prices = baseTours.map((tour) => tour.priceUsd)
  const lowPrice = prices.length ? Math.min(...prices) : 0
  const highPrice = prices.length ? Math.max(...prices) : 0

  const filteredTours = useMemo(() => {
    const range = priceRanges[priceRange]
    const filtered = baseTours.filter((tour) => {
      const matchesSearch =
        tour.title.toLowerCase().includes(search.toLowerCase()) ||
        tour.description.toLowerCase().includes(search.toLowerCase()) ||
        tour.location.toLowerCase().includes(search.toLowerCase())
      const matchesRegion = !region || tour.region === region
      const matchesPrice = tour.priceUsd >= range.min && tour.priceUsd <= range.max
      return matchesSearch && matchesRegion && matchesPrice
    })

    return sortTourList(filtered, sortBy)
  }, [priceRange, region, search, sortBy])

  return (
    <>
      <SEOMetaTags
        title="TripAdvisor Tours | Recharge Travels"
        description="Browse every Recharge Travels tour on TripAdvisor with live prices in USD, verified reviews, and direct booking links."
        keywords="TripAdvisor tours Sri Lanka, Recharge Travels TripAdvisor, book on TripAdvisor, Sri Lanka tour reviews"
        image="https://www.rechargetravels.com/logo.png"
        url="https://www.rechargetravels.com/tours/tripadvisor"
      />

      <SEOSchema
        type="Product"
        data={{
          name: 'Recharge Travels TripAdvisor Tours',
          description: 'Curated Sri Lanka tours with live TripAdvisor ratings, USD pricing, and direct booking links.',
          image: 'https://www.rechargetravels.com/logo.png',
          offers: {
            '@type': 'AggregateOffer',
            priceCurrency: 'USD',
            lowPrice,
            highPrice,
            offerCount: baseTours.length
          }
        }}
      />

      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-900 via-emerald-800 to-sky-800 text-white">
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_20%_20%,#34d399,transparent_35%),radial-gradient(circle_at_80%_0%,#22d3ee,transparent_25%)]" />
        <div className="relative mx-auto flex max-w-6xl flex-col gap-8 px-4 py-16 lg:flex-row lg:items-center lg:py-20">
          <div className="flex-1 space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur">
              <Sparkles className="h-4 w-4 text-amber-300" />
              TripAdvisor verified | USD pricing
            </div>
            <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl md:text-5xl">
              All Recharge Travels tours on TripAdvisor
            </h1>
            <p className="max-w-2xl text-lg text-emerald-100">
              Explore our 40+ Sri Lanka itineraries exactly as they appear on TripAdvisor. See real ratings, reviews,
              and book securely on TripAdvisor with one click.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={() => window.open(RECHARGE_TRIPADVISOR_URL, '_blank')}
                className="bg-white text-emerald-900 hover:bg-emerald-50"
              >
                View Recharge on TripAdvisor
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="border-white/60 text-white hover:bg-white/10 hover:text-white"
                onClick={() => window.scrollTo({ top: document.body.scrollHeight / 3, behavior: 'smooth' })}
              >
                Browse tours
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div className="rounded-xl bg-white/10 px-4 py-3 backdrop-blur">
                <p className="text-sm text-emerald-100">Tours listed</p>
                <p className="text-2xl font-semibold">{tripAdvisorTours.length}+</p>
              </div>
              <div className="rounded-xl bg-white/10 px-4 py-3 backdrop-blur">
                <p className="text-sm text-emerald-100">Average rating</p>
                <p className="text-2xl font-semibold">4.7★</p>
              </div>
              <div className="rounded-xl bg-white/10 px-4 py-3 backdrop-blur">
                <p className="text-sm text-emerald-100">Instant booking</p>
                <p className="text-2xl font-semibold">TripAdvisor</p>
              </div>
              <div className="rounded-xl bg-white/10 px-4 py-3 backdrop-blur">
                <p className="text-sm text-emerald-100">Currency</p>
                <p className="text-2xl font-semibold">USD</p>
              </div>
            </div>
          </div>
          <div className="flex-1">
            <div className="rounded-2xl bg-white/10 p-4 shadow-2xl backdrop-blur md:p-6">
              <div className="flex items-center gap-3 rounded-xl bg-white/10 px-4 py-3">
                <Compass className="h-5 w-5 text-amber-300" />
                <div>
                  <p className="text-sm text-emerald-100">Direct to TripAdvisor</p>
                  <p className="text-lg font-semibold text-white">Book with verified protection</p>
                </div>
              </div>
              <div className="mt-4 space-y-3 text-emerald-100">
                <p>• Pricing shown per person in USD</p>
                <p>• Links open the exact TripAdvisor product page</p>
                <p>• Filters for region, price, and ratings</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b bg-white">
        <div className="mx-auto max-w-6xl px-4 py-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-800">
                <Filter className="h-4 w-4" />
                Filter tours
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={sortBy === 'rating' ? 'default' : 'outline'}
                  className={sortBy === 'rating' ? 'bg-emerald-600 hover:bg-emerald-700' : ''}
                  onClick={() => setSortBy('rating')}
                >
                  Top rated
                </Button>
                <Button
                  size="sm"
                  variant={sortBy === 'reviews' ? 'default' : 'outline'}
                  className={sortBy === 'reviews' ? 'bg-emerald-600 hover:bg-emerald-700' : ''}
                  onClick={() => setSortBy('reviews')}
                >
                  Most reviewed
                </Button>
                <Button
                  size="sm"
                  variant={sortBy === 'price-asc' ? 'default' : 'outline'}
                  className={sortBy === 'price-asc' ? 'bg-emerald-600 hover:bg-emerald-700' : ''}
                  onClick={() => setSortBy('price-asc')}
                >
                  Price ↑
                </Button>
                <Button
                  size="sm"
                  variant={sortBy === 'price-desc' ? 'default' : 'outline'}
                  className={sortBy === 'price-desc' ? 'bg-emerald-600 hover:bg-emerald-700' : ''}
                  onClick={() => setSortBy('price-desc')}
                >
                  Price ↓
                </Button>
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search tours, cities, experiences"
                className="w-full sm:w-64"
              />
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value as TripAdvisorRegion | '')}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 shadow-sm sm:w-40"
              >
                <option value="">All regions</option>
                <option value="north">North</option>
                <option value="south">South</option>
                <option value="east">East</option>
                <option value="west">West</option>
                <option value="central">Central</option>
              </select>
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value as PriceRangeId)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 shadow-sm sm:w-44"
              >
                <option value="all">All prices</option>
                <option value="0-100">$0 - $100</option>
                <option value="100-300">$100 - $300</option>
                <option value="300-500">$300 - $500</option>
                <option value="500+">$500+</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-50">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">Live TripAdvisor listings</h2>
              <p className="text-sm text-gray-600">
                {filteredTours.length} of {baseTours.length}+ Recharge tours • Click any card to book on TripAdvisor
              </p>
            </div>
            <Badge className="bg-emerald-100 text-emerald-700">USD</Badge>
          </div>

          {filteredTours.length === 0 ? (
            <div className="mt-12 rounded-2xl border border-dashed border-gray-200 bg-white p-10 text-center">
              <p className="text-lg font-semibold text-gray-800">No tours match those filters.</p>
              <p className="text-gray-600">Try clearing the price band or choosing a different region.</p>
              <Button className="mt-4" onClick={() => {
                setSearch('')
                setRegion('')
                setPriceRange('all')
                setSortBy('rating')
              }}>
                Reset filters
              </Button>
            </div>
          ) : (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredTours.map((tour) => (
                <div
                  key={tour.id}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-lg transition hover:-translate-y-1 hover:shadow-2xl"
                >
                  <div className="relative h-52 w-full overflow-hidden">
                    <img src={tour.image} alt={tour.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/5 to-transparent" />
                    <div className="absolute left-3 top-3 flex items-center gap-2">
                      <Badge className="bg-emerald-600 text-white">{tour.duration}</Badge>
                      {tour.badge && <Badge className="bg-amber-100 text-amber-800">{tour.badge}</Badge>}
                    </div>
                    <div className="absolute right-3 top-3 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-emerald-800">
                      {tour.region.toUpperCase()}
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col space-y-4 px-4 py-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-emerald-700">{tour.title}</h3>
                        <p className="mt-1 text-sm text-gray-600 line-clamp-2">{tour.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        {renderStars(tour.rating)}
                        <span className="text-sm font-semibold text-gray-800">{tour.rating.toFixed(1)}</span>
                      </div>
                      <span className="text-xs font-semibold text-emerald-700">{tour.reviews} reviews</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <MapPin className="h-4 w-4 text-emerald-600" />
                      <span>{tour.location}</span>
                    </div>
                    <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                      <div>
                        <p className="text-xs uppercase tracking-wide text-gray-500">From</p>
                        <p className="text-xl font-bold text-emerald-700">${tour.priceUsd}</p>
                      </div>
                      <a
                        href={tour.tripAdvisorUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white shadow hover:bg-emerald-700"
              >
                Book on TripAdvisor
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}

export default TripAdvisorTours
