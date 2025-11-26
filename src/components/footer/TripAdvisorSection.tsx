
import { Star, Award } from 'lucide-react'

const TripAdvisorSection = () => {
  return (
    <div className="border-b border-gray-700 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-8">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-chakra font-bold text-wild-orange">TripAdvisor Excellence</h3>
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
                <span className="text-sm text-gray-300 ml-2">4.9/5 from 200+ reviews</span>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-gray-300 text-sm italic">
              "Exceptional wildlife experiences with knowledgeable guides"
            </p>
            <p className="text-xs text-gray-400 mt-1">- Recent TripAdvisor Review</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TripAdvisorSection
