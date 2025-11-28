import React, { useEffect, useState } from 'react'
import { fetchDrivers } from '@/services/driverDirectoryService'
import { suggestDrivers, DriverCandidate, MatchSuggestion } from '@/services/aiVerificationService'
import { Badge } from '@/components/ui/badge'

type Props = {
  language?: string
  vehicleType?: string
  minRating?: number
}

const DriverMatcherSuggestions: React.FC<Props> = ({ language, vehicleType, minRating = 4 }) => {
  const [suggestions, setSuggestions] = useState<MatchSuggestion[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const run = async () => {
      setLoading(true)
      const drivers = await fetchDrivers({ minRating, language, tier: undefined })
      const candidates: DriverCandidate[] = drivers.map((d: any) => ({
        id: d.id,
        name: d.full_name,
        rating: d.average_rating,
        years: d.years_experience,
        vehicleType: d.vehicle_type,
        languages: d.specialty_languages,
        cancellationRate: d.cancellation_rate
      }))
      const ranked = await suggestDrivers({ language, vehicleType }, candidates)
      setSuggestions(ranked.slice(0, 5))
      setLoading(false)
    }
    run()
  }, [language, vehicleType, minRating])

  if (loading) return <p className="text-sm text-gray-600">Loading suggestions…</p>
  if (suggestions.length === 0) return <p className="text-sm text-gray-600">No matching drivers found.</p>

  return (
    <div className="space-y-2">
      {suggestions.map((s) => (
        <div key={s.driverId} className="border rounded-lg p-2 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-800">Driver {s.driverId}</p>
            <div className="flex gap-1 text-xs">
              <Badge variant="outline">Score {s.score}</Badge>
              {s.reasons.map((r, i) => <Badge key={i} variant="secondary">{r}</Badge>)}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default DriverMatcherSuggestions
