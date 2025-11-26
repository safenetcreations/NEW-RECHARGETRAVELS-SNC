import { Leaf, TreePine, Heart, Recycle, Users, Zap } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

interface SustainabilityMetricsProps {
  carbonOffset: number
  treesPlanted: number
  communityFund: number
  impactMetrics: Record<string, any>
}

const SustainabilityMetrics = ({ 
  carbonOffset, 
  treesPlanted, 
  communityFund, 
  impactMetrics 
}: SustainabilityMetricsProps) => {
  
  const metrics = [
    {
      icon: Leaf,
      label: 'Carbon Offset',
      value: `${carbonOffset}kg`,
      description: 'CO₂ emissions offset per booking',
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      icon: TreePine,
      label: 'Trees Planted',
      value: treesPlanted,
      description: 'Native trees planted per booking',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100'
    },
    {
      icon: Heart,
      label: 'Community Fund',
      value: `${communityFund}%`,
      description: 'Of booking fee goes to local communities',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    }
  ]

  // Parse additional impact metrics
  const additionalMetrics = Object.entries(impactMetrics || {}).map(([key, value]) => {
    const label = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    let icon = Users
    let color = 'text-cyan-600'
    let bgColor = 'bg-cyan-100'

    // Assign icons based on metric type
    if (key.includes('water') || key.includes('marine')) {
      icon = Recycle
      color = 'text-cyan-600'
      bgColor = 'bg-cyan-100'
    } else if (key.includes('energy') || key.includes('solar')) {
      icon = Zap
      color = 'text-yellow-600'
      bgColor = 'bg-yellow-100'
    } else if (key.includes('species') || key.includes('wildlife')) {
      icon = TreePine
      color = 'text-green-600'
      bgColor = 'bg-green-100'
    }

    return {
      icon,
      label,
      value: typeof value === 'number' ? value.toLocaleString() : value,
      color,
      bgColor
    }
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Leaf className="w-5 h-5 mr-2 text-green-600" />
          Environmental & Social Impact
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Primary Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {metrics.map((metric, index) => (
            <div key={index} className="text-center p-4 border rounded-lg">
              <div className={`w-12 h-12 ${metric.bgColor} rounded-full flex items-center justify-center mx-auto mb-3`}>
                <metric.icon className={`w-6 h-6 ${metric.color}`} />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</div>
              <div className="font-medium text-gray-700 mb-1">{metric.label}</div>
              <div className="text-xs text-gray-500">{metric.description}</div>
            </div>
          ))}
        </div>

        {/* Additional Impact Metrics */}
        {additionalMetrics.length > 0 && (
          <div>
            <h4 className="font-semibold mb-3 text-gray-800">Additional Impact Metrics</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {additionalMetrics.map((metric, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`w-8 h-8 ${metric.bgColor} rounded-full flex items-center justify-center flex-shrink-0`}>
                    <metric.icon className={`w-4 h-4 ${metric.color}`} />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{metric.label}</div>
                    <div className="text-lg font-bold text-gray-700">{metric.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sustainability Goals Progress */}
        <div className="mt-6 p-4 bg-green-50 rounded-lg">
          <h4 className="font-semibold text-green-800 mb-3">Sustainability Goals</h4>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-green-700">Carbon Neutrality</span>
                <span className="text-green-700 font-medium">85%</span>
              </div>
              <Progress value={85} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-green-700">Community Employment</span>
                <span className="text-green-700 font-medium">92%</span>
              </div>
              <Progress value={92} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-green-700">Local Sourcing</span>
                <span className="text-green-700 font-medium">78%</span>
              </div>
              <Progress value={78} className="h-2" />
            </div>
          </div>
        </div>

        {/* Certification Badges */}
        <div className="mt-4 flex flex-wrap gap-2">
          <div className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
            <Leaf className="w-3 h-3 mr-1" />
            Carbon Neutral
          </div>
          <div className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
            <Heart className="w-3 h-3 mr-1" />
            Community Certified
          </div>
          <div className="inline-flex items-center px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-medium rounded-full">
            <TreePine className="w-3 h-3 mr-1" />
            Wildlife Friendly
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default SustainabilityMetrics