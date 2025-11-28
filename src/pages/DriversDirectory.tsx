import React, { useEffect, useMemo, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { fetchDrivers } from '@/services/driverDirectoryService'
import { Driver } from '@/types/driver'
import { Link } from 'react-router-dom'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Star,
  Search,
  Car,
  Languages,
  Shield,
  Clock,
  MessageCircle,
  Award,
  Users,
  CheckCircle2,
  Sparkles,
  Filter,
  Wifi,
  AirVent,
  ChevronRight,
  BadgeCheck
} from 'lucide-react'
const defaultProfileImg = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face'

const TAG_FILTERS = [
  { id: 'sltda', label: 'SLTDA Approved', icon: Shield },
  { id: 'own_vehicle', label: 'Own Vehicle', icon: Car },
  { id: 'guide', label: 'Licensed Guide', icon: Award },
  { id: 'experienced_5_plus', label: '5+ Years Experience', icon: Clock }
] as const

const TIER_INFO = {
  chauffeur_guide: { label: 'Chauffeur Guide', color: 'bg-purple-100 text-purple-800 border-purple-200', icon: '🎓' },
  national_guide: { label: 'National Guide', color: 'bg-blue-100 text-blue-800 border-blue-200', icon: '🏛️' },
  tourist_driver: { label: 'Tourist Driver', color: 'bg-emerald-100 text-emerald-800 border-emerald-200', icon: '🚗' },
  freelance_driver: { label: 'Freelance Driver', color: 'bg-orange-100 text-orange-800 border-orange-200', icon: '🚙' }
}

const VEHICLE_ICONS = {
  sedan: '🚗',
  suv: '🚙',
  van: '🚐',
  mini_coach: '🚌',
  luxury: '✨'
}

const STATUS_COLORS = {
  verified: 'bg-green-100 text-green-800 border-green-200',
  pending_verification: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  incomplete: 'bg-gray-100 text-gray-800 border-gray-200',
  suspended: 'bg-red-100 text-red-800 border-red-200',
  inactive: 'bg-gray-100 text-gray-500 border-gray-200'
}

const DriversDirectory: React.FC = () => {
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [search, setSearch] = useState('')
  const [tier, setTier] = useState<string | undefined>()
  const [language, setLanguage] = useState<string | undefined>()
  const [minRating, setMinRating] = useState<number>(4.0)
  const [vehicleType, setVehicleType] = useState<string | undefined>()
  const [maxRate, setMaxRate] = useState<number | undefined>()
  const [date, setDate] = useState<string>('')
  const [tags, setTags] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      const data = await fetchDrivers({ tier, minRating, language })
      setDrivers(data)
      setLoading(false)
    }
    load()
  }, [tier, minRating, language])

  const stats = useMemo(() => {
    const verified = drivers.filter(d => d.current_status === 'verified').length
    const guides = drivers.filter(d => d.is_guide || d.is_chauffeur).length
    const avgRating = drivers.length > 0
      ? (drivers.reduce((acc, d) => acc + (d.average_rating || 5), 0) / drivers.length).toFixed(1)
      : '5.0'
    return { total: drivers.length, verified, guides, avgRating }
  }, [drivers])

  const filtered = useMemo(() => {
    return drivers.filter((d) => {
      if (search && !d.full_name?.toLowerCase().includes(search.toLowerCase())) return false
      if (language) {
        const langs = (d.specialty_languages || []).map((l) => l.toLowerCase())
        if (!langs.some((l) => l.includes(language.toLowerCase()))) return false
      }
      if (vehicleType && (d as any).vehicle_type && (d as any).vehicle_type !== vehicleType) return false
      if (maxRate && d.daily_rate && d.daily_rate > maxRate) return false
      if (date && d.current_status === 'inactive') return false
      if (tags.length > 0) {
        if (tags.includes('sltda') && !d.is_sltda_approved) return false
        if (tags.includes('own_vehicle') && d.vehicle_preference !== 'own_vehicle') return false
        if (tags.includes('guide') && !((d as any).is_guide || (d as any).is_chauffeur)) return false
        if (tags.includes('experienced_5_plus') && (!d.years_experience || d.years_experience < 5)) return false
      }
      return true
    })
  }, [drivers, search, language, vehicleType, maxRate, date, tags])

  return (
    <div className="bg-gradient-to-br from-orange-50 via-white to-cyan-50 min-h-screen">
      <Helmet>
        <title>Find Verified Drivers & Guides | Recharge Travels</title>
        <meta
          name="description"
          content="Browse verified SLTDA drivers, chauffeur guides, and freelance chauffeurs. Filter by experience, rating, languages, and vehicle type."
        />
        <meta property="og:title" content="Find Verified Drivers & Guides | Recharge Travels" />
        <meta property="og:description" content="Browse verified SLTDA drivers, chauffeur guides, and freelance chauffeurs. Filter by experience, rating, languages, and vehicle type." />
      </Helmet>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1600')] bg-cover bg-center mix-blend-overlay opacity-30" />

        <div className="relative max-w-6xl mx-auto px-4 py-16 md:py-24">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium">
              <Shield className="w-4 h-4" />
              SLTDA Verified & Police Cleared
            </div>

            <h1 className="text-4xl md:text-6xl font-bold">
              Meet Our Elite <span className="text-yellow-300">Drivers & Guides</span>
            </h1>

            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
              Hand-picked, professionally trained, and thoroughly verified.
              Your perfect travel companion awaits.
            </p>

            {/* Quick Stats */}
            <div className="flex flex-wrap justify-center gap-6 mt-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-4 text-center">
                <div className="text-3xl font-bold text-yellow-300">{stats.total}+</div>
                <div className="text-sm text-white/80">Active Drivers</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-4 text-center">
                <div className="text-3xl font-bold text-yellow-300">{stats.verified}</div>
                <div className="text-sm text-white/80">Verified</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-4 text-center">
                <div className="text-3xl font-bold text-yellow-300">{stats.guides}</div>
                <div className="text-sm text-white/80">Licensed Guides</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-4 text-center">
                <div className="flex items-center justify-center gap-1 text-3xl font-bold text-yellow-300">
                  <Star className="w-6 h-6 fill-yellow-300" />
                  {stats.avgRating}
                </div>
                <div className="text-sm text-white/80">Avg Rating</div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave SVG */}
        <svg className="absolute bottom-0 left-0 right-0 text-orange-50" viewBox="0 0 1440 100" preserveAspectRatio="none">
          <path fill="currentColor" d="M0,50 C360,100 1080,0 1440,50 L1440,100 L0,100 Z" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Search Bar */}
        <div className="bg-white shadow-xl rounded-3xl border border-orange-100 p-4 md:p-6 -mt-16 relative z-10">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search drivers by name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-12 h-14 text-lg rounded-xl border-gray-200"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="h-14 px-6 rounded-xl border-orange-200 text-orange-600 hover:bg-orange-50"
            >
              <Filter className="w-5 h-5 mr-2" />
              {showFilters ? 'Hide' : 'Show'} Filters
            </Button>
            <Button className="h-14 px-8 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600">
              <Search className="w-5 h-5 mr-2" />
              Search
            </Button>
          </div>

          {/* Collapsible Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-100 grid grid-cols-1 md:grid-cols-4 gap-4">
              <Select value={tier ?? 'all_tiers'} onValueChange={(v) => setTier(v === 'all_tiers' ? undefined : v)}>
                <SelectTrigger className="h-12 rounded-xl">
                  <Users className="w-4 h-4 mr-2 text-gray-400" />
                  <SelectValue placeholder="All tiers" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all_tiers">All tiers</SelectItem>
                  <SelectItem value="chauffeur_guide">🎓 Chauffeur Guide (SLTDA)</SelectItem>
                  <SelectItem value="national_guide">🏛️ National Guide</SelectItem>
                  <SelectItem value="tourist_driver">🚗 Tourist Driver (SLITHM)</SelectItem>
                  <SelectItem value="freelance_driver">🚙 Freelance Driver</SelectItem>
                </SelectContent>
              </Select>

              <Select value={language ?? 'any_language'} onValueChange={(v) => setLanguage(v === 'any_language' ? undefined : v)}>
                <SelectTrigger className="h-12 rounded-xl">
                  <Languages className="w-4 h-4 mr-2 text-gray-400" />
                  <SelectValue placeholder="Any language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any_language">Any language</SelectItem>
                  <SelectItem value="english">🇬🇧 English</SelectItem>
                  <SelectItem value="sinhala">🇱🇰 Sinhala</SelectItem>
                  <SelectItem value="tamil">Tamil</SelectItem>
                  <SelectItem value="german">🇩🇪 German</SelectItem>
                  <SelectItem value="french">🇫🇷 French</SelectItem>
                  <SelectItem value="chinese">🇨🇳 Chinese</SelectItem>
                  <SelectItem value="japanese">🇯🇵 Japanese</SelectItem>
                </SelectContent>
              </Select>

              <Select value={vehicleType ?? 'any_vehicle'} onValueChange={(v) => setVehicleType(v === 'any_vehicle' ? undefined : v)}>
                <SelectTrigger className="h-12 rounded-xl">
                  <Car className="w-4 h-4 mr-2 text-gray-400" />
                  <SelectValue placeholder="Any vehicle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any_vehicle">Any vehicle</SelectItem>
                  <SelectItem value="sedan">🚗 Sedan</SelectItem>
                  <SelectItem value="suv">🚙 SUV</SelectItem>
                  <SelectItem value="van">🚐 Van / Mini Van</SelectItem>
                  <SelectItem value="mini_coach">🚌 Mini Coach</SelectItem>
                  <SelectItem value="luxury">✨ Luxury</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-orange-500" />
                <span className="text-sm font-medium text-gray-700 whitespace-nowrap">Min Rating</span>
                <Select value={String(minRating)} onValueChange={(v) => setMinRating(Number(v))}>
                  <SelectTrigger className="flex-1 h-12 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Any</SelectItem>
                    <SelectItem value="4">⭐ 4.0+</SelectItem>
                    <SelectItem value="4.5">⭐ 4.5+</SelectItem>
                    <SelectItem value="4.8">⭐ 4.8+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Input
                type="number"
                min={0}
                placeholder="Max daily rate ($)"
                value={maxRate ?? ''}
                onChange={(e) => setMaxRate(e.target.value ? Number(e.target.value) : undefined)}
                className="h-12 rounded-xl"
              />

              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="h-12 rounded-xl"
              />

              {/* Tag Filters */}
              <div className="md:col-span-2 flex flex-wrap items-center gap-2">
                {TAG_FILTERS.map((tag) => {
                  const active = tags.includes(tag.id)
                  const Icon = tag.icon
                  return (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() =>
                        setTags((prev) =>
                          prev.includes(tag.id)
                            ? prev.filter((t) => t !== tag.id)
                            : [...prev, tag.id]
                        )
                      }
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-all ${
                        active
                          ? 'bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-200'
                          : 'bg-white border-gray-200 text-gray-600 hover:border-orange-300 hover:text-orange-600'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {tag.label}
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between">
          <p className="text-gray-600">
            {loading ? 'Loading...' : `Showing ${filtered.length} driver${filtered.length !== 1 ? 's' : ''}`}
          </p>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Sparkles className="w-4 h-4 text-orange-500" />
            Sorted by rating
          </div>
        </div>

        {/* Driver Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((d) => {
            const tierInfo = d.tier ? TIER_INFO[d.tier as keyof typeof TIER_INFO] : null
            const vehicleIcon = (d as any).vehicle_type ? VEHICLE_ICONS[(d as any).vehicle_type as keyof typeof VEHICLE_ICONS] : '🚗'

            return (
              <Link
                key={d.id}
                to={`/drivers/${d.id}`}
                className="group bg-white border border-gray-100 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden hover:-translate-y-1"
              >
                {/* Cover Image */}
                <div className="h-40 bg-gradient-to-br from-orange-100 to-amber-50 relative overflow-hidden">
                  <img
                    src={(d as any).cover_image || 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=800&h=300&fit=crop'}
                    alt={d.full_name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

                  {/* Status Badge */}
                  {d.current_status === 'verified' && (
                    <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg">
                      <CheckCircle2 className="w-3 h-3" />
                      Verified
                    </div>
                  )}

                  {/* Profile Photo */}
                  <div className="absolute -bottom-10 left-4">
                    <div className="w-20 h-20 rounded-2xl border-4 border-white shadow-xl overflow-hidden bg-white">
                      <img
                        src={(d as any).profile_photo || defaultProfileImg}
                        alt={d.full_name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 pt-12 space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
                        {d.full_name || 'Verified Driver'}
                      </h3>
                      {tierInfo && (
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${tierInfo.color}`}>
                          {tierInfo.icon} {tierInfo.label}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="flex items-center gap-1 bg-orange-50 px-2 py-1 rounded-lg">
                        <Star className="w-4 h-4 text-orange-500 fill-orange-500" />
                        <span className="font-bold text-orange-600">{d.average_rating?.toFixed(1) || '5.0'}</span>
                      </div>
                      <span className="text-xs text-gray-500 mt-1">({d.total_reviews || 0} reviews)</span>
                    </div>
                  </div>

                  {/* Badges Row */}
                  <div className="flex flex-wrap gap-2">
                    {d.is_sltda_approved && (
                      <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 gap-1">
                        <BadgeCheck className="w-3 h-3" />
                        SLTDA
                      </Badge>
                    )}
                    {d.years_experience && d.years_experience >= 5 && (
                      <Badge variant="secondary" className="gap-1">
                        <Clock className="w-3 h-3" />
                        {d.years_experience}+ yrs
                      </Badge>
                    )}
                    {(d as any).vehicle_type && (
                      <Badge variant="outline" className="gap-1">
                        {vehicleIcon} {(d as any).vehicle_type}
                      </Badge>
                    )}
                    {(d as any).vehicle_ac && (
                      <Badge variant="outline" className="gap-1 text-blue-600 border-blue-200">
                        <AirVent className="w-3 h-3" />
                        A/C
                      </Badge>
                    )}
                    {(d as any).vehicle_wifi && (
                      <Badge variant="outline" className="gap-1 text-purple-600 border-purple-200">
                        <Wifi className="w-3 h-3" />
                        WiFi
                      </Badge>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {d.biography || 'Professional and experienced driver ready to make your Sri Lanka journey memorable.'}
                  </p>

                  {/* Languages */}
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Languages className="w-4 h-4 text-gray-400" />
                    <span>{(d.specialty_languages || ['English']).join(', ')}</span>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="text-sm">
                      {d.daily_rate ? (
                        <span className="font-bold text-2xl text-gray-900">
                          ${d.daily_rate}
                          <span className="text-sm font-normal text-gray-500">/day</span>
                        </span>
                      ) : (
                        <span className="text-gray-500">Contact for rates</span>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-orange-600 hover:text-orange-700 hover:bg-orange-50 gap-1"
                    >
                      View Profile
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* Empty State */}
        {filtered.length === 0 && !loading && (
          <div className="text-center bg-white border-2 border-dashed border-orange-200 rounded-3xl p-12">
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-orange-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No drivers found</h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your filters or search criteria to find more drivers.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearch('')
                setTier(undefined)
                setLanguage(undefined)
                setMinRating(0)
                setVehicleType(undefined)
                setMaxRate(undefined)
                setTags([])
              }}
              className="border-orange-300 text-orange-600 hover:bg-orange-50"
            >
              Clear all filters
            </Button>
          </div>
        )}

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-3xl p-8 md:p-12 text-white text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1600')] bg-cover bg-center mix-blend-overlay opacity-20" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">
              Are You a Driver or Guide?
            </h2>
            <p className="text-lg text-white/90">
              Join our network of verified professionals and connect with travelers from around the world.
              Enjoy flexible schedules, fair commissions, and dedicated support.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                asChild
                size="lg"
                className="bg-white text-orange-600 hover:bg-orange-50 shadow-xl"
              >
                <Link to="/join-with-us">
                  <Users className="w-5 h-5 mr-2" />
                  Join Our Team
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white/10"
              >
                <Link to="/contact">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Contact Us
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-8">
          <div className="text-center p-4">
            <Shield className="w-10 h-10 text-orange-500 mx-auto mb-2" />
            <h4 className="font-semibold text-gray-900">Police Cleared</h4>
            <p className="text-sm text-gray-600">Background verified</p>
          </div>
          <div className="text-center p-4">
            <BadgeCheck className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
            <h4 className="font-semibold text-gray-900">SLTDA Licensed</h4>
            <p className="text-sm text-gray-600">Official certification</p>
          </div>
          <div className="text-center p-4">
            <Award className="w-10 h-10 text-purple-500 mx-auto mb-2" />
            <h4 className="font-semibold text-gray-900">Trained Guides</h4>
            <p className="text-sm text-gray-600">Professional service</p>
          </div>
          <div className="text-center p-4">
            <Star className="w-10 h-10 text-yellow-500 mx-auto mb-2" />
            <h4 className="font-semibold text-gray-900">Highly Rated</h4>
            <p className="text-sm text-gray-600">Customer approved</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DriversDirectory
