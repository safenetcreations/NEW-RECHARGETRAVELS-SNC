
import { Shield, Award } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

const FooterCertifications = () => {
  return (
    <div className="col-span-1">
      <h3 className="text-lg font-chakra font-bold mb-6 text-jungle-green">Licensed & Certified</h3>
      <div className="space-y-4">
        <div className="flex items-start space-x-3">
          <Shield className="h-5 w-5 text-peacock-teal flex-shrink-0 mt-1" />
          <div>
            <p className="text-sm font-semibold">Tourism License</p>
            <p className="text-xs text-gray-400">#SL-2024-WT-789</p>
          </div>
        </div>
        <div className="flex items-start space-x-3">
          <Award className="h-5 w-5 text-wild-orange flex-shrink-0 mt-1" />
          <div>
            <p className="text-sm font-semibold">Certified by</p>
            <p className="text-xs text-gray-400">Sri Lanka Tourism Board</p>
          </div>
        </div>
        <div className="space-y-2">
          <Badge variant="outline" className="text-xs border-jungle-green text-jungle-green">
            Eco-Tourism Certified
          </Badge>
          <Badge variant="outline" className="text-xs border-peacock-teal text-peacock-teal">
            Wildlife Conservation Partner
          </Badge>
        </div>
      </div>
    </div>
  )
}

export default FooterCertifications
