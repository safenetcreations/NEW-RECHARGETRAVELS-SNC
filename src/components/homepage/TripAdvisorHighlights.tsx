import { ArrowUpRight, MapPin, Star } from 'lucide-react'
import { Link } from 'react-router-dom'
import { RECHARGE_TRIPADVISOR_URL, tripAdvisorTours } from '@/data/tripAdvisorTours'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useTripAdvisorTours } from '@/hooks/useTripAdvisorTours'

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

// Featured tour titles to highlight on homepage
const FEATURED_TOUR_TITLES = [
  "Discover Sri Lanka's Unique Marine Farming Culture",
  "Sigiriya Rock and Dambulla Cave Temple all inclusive Private Day Trip",
  "Transport only - Mirissa to Colombo Airport (CMB)",
  "Colombo International Airport to Anywhere in Kalutara - Transport only",
  "Yala Safari Experience",
  "Private Airport Transfer - Colombo City to Colombo (CMB) Airport"
]

const TripAdvisorHighlights = () => {
  const { tours, isLoading } = useTripAdvisorTours()
  const allTours = tours.length ? tours : tripAdvisorTours

  // Get featured tours first, then fill with remaining if needed
  const featuredTours = FEATURED_TOUR_TITLES
    .map(title => allTours.find(t => t.title === title))
    .filter(Boolean)

  // If we don't have enough featured tours, add more from the list
  const remainingTours = allTours.filter(t => !FEATURED_TOUR_TITLES.includes(t.title))
  const highlights = [...featuredTours, ...remainingTours].slice(0, 6)

  if (isLoading && highlights.length === 0) {
    return (
      <section className="bg-gradient-to-b from-emerald-50 via-white to-white">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <div className="h-6 w-48 rounded bg-emerald-100" />
          <div className="mt-4 h-4 w-64 rounded bg-emerald-50" />
        </div>
      </section>
    )
  }

  return (
    <section className="bg-gradient-to-b from-emerald-50 via-white to-white">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <p className="text-sm font-semibold text-emerald-700">TripAdvisor curated</p>
            <h2 className="text-2xl font-bold text-gray-900">Instant-book Sri Lanka tours</h2>
            <p className="max-w-2xl text-sm text-gray-600">
              Two rows of our TripAdvisor best-sellers with live USD pricing. Tap through to book on TripAdvisor.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" asChild className="border-emerald-200 text-emerald-800 hover:bg-emerald-50">
              <Link to="/tours/tripadvisor">View all tours</Link>
            </Button>
            <Button
              className="bg-emerald-600 text-white hover:bg-emerald-700"
              onClick={() => window.open(RECHARGE_TRIPADVISOR_URL, '_blank')}
            >
              TripAdvisor profile
              <ArrowUpRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {highlights.map((tour) => (
            <div
              key={tour.id}
              className="flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-gray-100 transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative h-40 w-full overflow-hidden">
                <img
                  src={tour.image}
                  alt={tour.title}
                  className="h-full w-full object-cover transition duration-500 hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute left-3 top-3 flex items-center gap-2">
                  <Badge className="bg-white/90 text-emerald-800">{tour.duration}</Badge>
                  {tour.badge && <Badge className="bg-amber-100 text-amber-800">{tour.badge}</Badge>}
                </div>
                <div className="absolute right-3 top-3 rounded-full bg-emerald-600/90 px-3 py-1 text-xs font-semibold text-white">
                  USD
                </div>
              </div>

              <div className="flex flex-1 flex-col space-y-3 p-4">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-base font-semibold text-gray-900 line-clamp-2">{tour.title}</p>
                  <span className="text-sm font-bold text-emerald-700">${tour.priceUsd}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4 text-emerald-600" />
                  <span className="line-clamp-1">{tour.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center">{renderStars(tour.rating)}</div>
                  <span className="text-sm font-semibold text-gray-900">{tour.rating.toFixed(1)}</span>
                  <span className="text-xs font-semibold text-emerald-700">{tour.reviews} reviews</span>
                </div>
                <div className="mt-auto">
                  <a
                    href={tour.tripAdvisorUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white shadow hover:bg-emerald-700"
                  >
                    Book on TripAdvisor
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TripAdvisorHighlights
