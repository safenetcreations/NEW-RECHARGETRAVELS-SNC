import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { fetchAvailabilityPreview, fetchDriverById, fetchDriverReviews } from '@/services/driverDirectoryService'
import { Driver } from '@/types/driver'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Star, ShieldCheck, MapPin, Clock, Sparkles, Video } from 'lucide-react'

const DriverPublicProfile: React.FC = () => {
  const { id } = useParams()
  const [driver, setDriver] = useState<Driver | null>(null)
  const [reviews, setReviews] = useState<any[]>([])
  const [availability, setAvailability] = useState<any[]>([])

  useEffect(() => {
    if (!id) return
    const load = async () => {
      const d = await fetchDriverById(id)
      setDriver(d)
      const r = await fetchDriverReviews(id)
      setReviews(r)
      const a = await fetchAvailabilityPreview(id)
      setAvailability(a)
    }
    load()
  }, [id])

  if (!driver) {
    return <div className="min-h-screen flex items-center justify-center">Loading driver...</div>
  }

  const title = `${driver.full_name || 'Verified Driver'} | Recharge Travels`
  const desc = driver.biography || 'SLTDA-ready, manually verified driver for tours and transfers.'

  const verificationBadge = driver.verified_level === 3
    ? 'SLTDA Approved'
    : driver.verified_level === 2
      ? 'Police/Medical Verified'
      : 'Basic Verified'

  return (
    <div className="bg-gradient-to-br from-amber-50 via-white to-cyan-50 min-h-screen">
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={desc} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={desc} />
        <meta property="og:type" content="profile" />
      </Helmet>

      <div className="max-w-5xl mx-auto px-4 py-10 space-y-6">
        <div className="bg-white rounded-2xl shadow-lg border border-orange-100 overflow-hidden">
          <div className="h-64 bg-gray-100 relative">
            {driver.live_video_url ? (
              <video
                className="w-full h-full object-cover"
                src={driver.live_video_url}
                autoPlay
                muted
                loop
              />
            ) : (
              <img src={(driver as any).cover_image || '/logo-v2.png'} alt={driver.full_name} className="w-full h-full object-cover" />
            )}
            <div className="absolute bottom-4 left-4 bg-white/90 px-4 py-2 rounded-xl shadow flex items-center gap-3">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{driver.full_name || 'Verified Driver'}</h1>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Star size={16} className="text-orange-500" fill="currentColor" />
                  <span>{driver.average_rating?.toFixed(1) || '5.0'} · {driver.total_reviews || 0} reviews</span>
                </div>
              </div>
              {driver.is_sltda_approved && (
                <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 flex items-center gap-1">
                  <ShieldCheck size={14} /> SLTDA Approved
                </Badge>
              )}
              <Badge variant="secondary" className="flex items-center gap-1">
                <Sparkles size={14} /> {verificationBadge}
              </Badge>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div className="flex flex-wrap gap-2 text-xs">
              {driver.tier && <Badge variant="outline">{driver.tier.replace(/_/g, ' ')}</Badge>}
              {driver.years_experience && <Badge variant="secondary">{driver.years_experience}+ years</Badge>}
              {driver.vehicle_preference && <Badge variant="outline">{driver.vehicle_preference.replace('_', ' ')}</Badge>}
              {driver.completion_rate && <Badge variant="outline">Completion {Math.round(driver.completion_rate)}%</Badge>}
            </div>

            <p className="text-gray-700 leading-relaxed">{driver.biography || 'Trusted, verified driver for island-wide tours.'}</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-700">
              <div className="flex items-start gap-2">
                <MapPin className="text-orange-500" size={18} />
                <div>
                  <p className="font-semibold">Languages</p>
                  <p>{(driver.specialty_languages || []).join(', ') || 'English'}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="text-orange-500" size={18} />
                <div>
                  <p className="font-semibold">Experience</p>
                  <p>{driver.years_experience ? `${driver.years_experience}+ years` : 'Seasoned professional'}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <ShieldCheck className="text-orange-500" size={18} />
                <div>
                  <p className="font-semibold">Verification</p>
                  <p>{driver.is_sltda_approved ? 'Tourism Board / SLTDA verified' : 'Recharge verified documents'}</p>
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Availability (next 7 days)</h3>
              <div className="flex flex-wrap gap-2 text-sm">
                {availability.length === 0 && <p className="text-gray-600">Availability will be confirmed during booking.</p>}
                {availability.map((slot: any) => (
                  <Badge key={`${slot.date}-${slot.time_slot}`} variant="outline" className={slot.availability_status === 'available' ? 'border-emerald-200 text-emerald-700' : ''}>
                    {slot.date} · {slot.time_slot} · {slot.availability_status}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="border-t pt-4 space-y-3">
              <h3 className="text-lg font-semibold text-gray-900">Recent Reviews</h3>
              {reviews.length === 0 && <p className="text-sm text-gray-600">Reviews will appear after trips are completed.</p>}
              {reviews.map((r, idx) => (
                <div key={idx} className="border border-gray-100 rounded-xl p-3 bg-gray-50">
                  <div className="flex items-center justify-between text-sm text-gray-700">
                    <div className="flex items-center gap-1 text-orange-500">
                      <Star size={14} fill="currentColor" /> <span>{r.rating || '5.0'}</span>
                    </div>
                    <span className="text-xs text-gray-500">{r.review_date || ''}</span>
                  </div>
                  <p className="text-sm text-gray-700 mt-1">{r.comment || 'Great service and safe driving.'}</p>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-3">
              <h3 className="text-lg font-semibold text-gray-900">Social & Media</h3>
              <div className="flex flex-wrap gap-2 text-sm text-gray-700">
                {driver.social_insta && <Badge variant="outline">@{driver.social_insta.replace('@', '')}</Badge>}
                {driver.social_facebook && <Badge variant="outline">Facebook linked</Badge>}
                {!driver.social_insta && !driver.social_facebook && (
                  <div className="text-sm text-gray-600">Driver has not linked social profiles yet. Coming soon.</div>
                )}
              </div>
              {driver.live_video_url && (
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Video size={16} className="text-orange-500" /> Live intro video available
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <Button asChild>
                <Link to="/book-now">Book this driver</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/join-with-us">Apply as a driver</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DriverPublicProfile
