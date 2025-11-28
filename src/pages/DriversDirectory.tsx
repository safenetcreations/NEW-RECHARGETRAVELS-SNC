import React, { useEffect, useMemo, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { fetchDrivers } from '@/services/driverDirectoryService'
import { Driver } from '@/types/driver'
import { Link } from 'react-router-dom'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Star } from 'lucide-react'

const defaultCardImg = '/logo-v2.png'

const DriversDirectory: React.FC = () => {
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [search, setSearch] = useState('')
  const [tier, setTier] = useState<string | undefined>()
  const [language, setLanguage] = useState<string | undefined>()
  const [minRating, setMinRating] = useState<number>(4.0)
  const [vehicleType, setVehicleType] = useState<string | undefined>()
  const [maxRate, setMaxRate] = useState<number | undefined>()
  const [date, setDate] = useState<string>('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      const data = await fetchDrivers({ tier, minRating, language })
      setDrivers(data)
      setLoading(false)
    }
    load()
  }, [tier, minRating, language])

  const filtered = useMemo(() => {
    return drivers.filter((d) => {
      if (search && !d.full_name?.toLowerCase().includes(search.toLowerCase())) return false
      if (language) {
        const langs = (d.specialty_languages || []).map((l) => l.toLowerCase())
        if (!langs.some((l) => l.includes(language.toLowerCase()))) return false
      }
      if (vehicleType && (d as any).vehicle_type && (d as any).vehicle_type !== vehicleType) return false
      if (maxRate && d.daily_rate && d.daily_rate > maxRate) return false
      // Soft filter: hide inactive when a date is picked
      if (date && d.current_status === 'inactive') return false
      return true
    })
  }, [drivers, search, language, vehicleType, maxRate, date])

  return (
    <div className="bg-gradient-to-br from-orange-50 via-white to-cyan-50 min-h-screen">
      <Helmet>
        <title>Find Verified Drivers & Guides | Recharge Travels</title>
        <meta
          name="description"
          content="Browse verified SLTDA drivers, chauffeur guides, and freelance chauffeurs. Filter by experience, rating, languages, and vehicle type."
        />
      </Helmet>

      <div className="max-w-6xl mx-auto px-4 py-12 space-y-8">
        <div className="text-center space-y-3">
          <p className="text-sm font-semibold text-orange-600 uppercase tracking-wide">Driver Directory</p>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">Meet Our Verified Drivers & Guides</h1>
          <p className="text-lg text-gray-600">SLTDA-ready, police-cleared, and manually approved by Recharge Travels.</p>
        </div>

        <div className="bg-white shadow-lg rounded-2xl border border-orange-100 p-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input
            placeholder="Search by name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="md:col-span-2"
          />
          <Select
            value={tier ?? 'all_tiers'}
            onValueChange={(v) => setTier(v === 'all_tiers' ? undefined : v)}
          >
            <SelectTrigger><SelectValue placeholder="All tiers" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all_tiers">All tiers</SelectItem>
              <SelectItem value="chauffeur_guide">Chauffeur Guide (SLTDA)</SelectItem>
              <SelectItem value="national_guide">National Guide</SelectItem>
              <SelectItem value="tourist_driver">Tourist Driver (SLITHM)</SelectItem>
              <SelectItem value="freelance_driver">Freelance Driver</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={language ?? 'any_language'}
            onValueChange={(v) => setLanguage(v === 'any_language' ? undefined : v)}
          >
            <SelectTrigger><SelectValue placeholder="Any language" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="any_language">Any language</SelectItem>
              <SelectItem value="english">English</SelectItem>
              <SelectItem value="sinhala">Sinhala</SelectItem>
              <SelectItem value="tamil">Tamil</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Min rating</span>
            <Select value={String(minRating)} onValueChange={(v) => setMinRating(Number(v))}>
              <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Any</SelectItem>
                <SelectItem value="4">4.0+</SelectItem>
                <SelectItem value="4.5">4.5+</SelectItem>
                <SelectItem value="4.8">4.8+</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Select
            value={vehicleType ?? 'any_vehicle'}
            onValueChange={(v) => setVehicleType(v === 'any_vehicle' ? undefined : v)}
          >
            <SelectTrigger><SelectValue placeholder="Any vehicle" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="any_vehicle">Any vehicle</SelectItem>
              <SelectItem value="sedan">Sedan</SelectItem>
              <SelectItem value="suv">SUV</SelectItem>
              <SelectItem value="van">Van</SelectItem>
              <SelectItem value="mini_coach">Mini Coach</SelectItem>
              <SelectItem value="luxury">Luxury</SelectItem>
            </SelectContent>
          </Select>
          <Input
            type="number"
            min={0}
            placeholder="Max daily rate (LKR)"
            value={maxRate ?? ''}
            onChange={(e) => setMaxRate(e.target.value ? Number(e.target.value) : undefined)}
          />
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            placeholder="Date"
          />
        </div>

        {loading && <p className="text-center text-gray-600">Loading drivers…</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((d) => (
            <Link
              key={d.id}
              to={`/drivers/${d.id}`}
              className="bg-white border border-gray-100 rounded-2xl shadow hover:shadow-xl transition-all overflow-hidden"
            >
              <div className="h-48 bg-gray-100">
                <img
                  src={(d as any).cover_image || defaultCardImg}
                  alt={d.full_name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900">{d.full_name || 'Verified Driver'}</h3>
                  <div className="flex items-center gap-1 text-orange-500">
                    <Star size={16} fill="currentColor" />
                    <span className="text-sm font-semibold">{d.average_rating?.toFixed(1) || '5.0'}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 text-xs">
                  {d.tier && <Badge variant="outline">{d.tier.replace(/_/g, ' ')}</Badge>}
                  {d.is_sltda_approved && <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">SLTDA Approved</Badge>}
                  {d.years_experience && <Badge variant="secondary">{d.years_experience}+ yrs</Badge>}
                  {d.daily_rate && <Badge variant="outline">LKR {d.daily_rate}/day</Badge>}
                  {(d as any).vehicle_type && <Badge variant="outline">{(d as any).vehicle_type}</Badge>}
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">{d.biography || 'Trusted, verified driver for tours and transfers.'}</p>
                <div className="text-xs text-gray-500">
                  Languages: {(d.specialty_languages || []).join(', ') || 'English'}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && !loading && (
          <div className="text-center text-gray-600 bg-white border border-dashed border-gray-200 rounded-xl p-8">
            No drivers match these filters yet. Try relaxing rating/language or check back soon.
          </div>
        )}

        <div className="text-center">
          <Button asChild>
            <Link to="/join-with-us">Onboard as a driver/guide</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default DriversDirectory
