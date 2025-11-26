
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  CheckCircle,
  AlertCircle,
  XCircle,
  Clock
} from 'lucide-react'

interface DriverDocumentsTabProps {
  driverData: any
}

const DriverDocumentsTab = ({ driverData }: DriverDocumentsTabProps) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />
      case 'under_review':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const documents = [
    { key: 'cv_verification_status', label: 'CV/Resume' },
    { key: 'license_verification_status', label: 'Driving License' },
    { key: 'tourism_id_verification_status', label: 'Tourism Board ID' },
    { key: 'police_report_verification_status', label: 'Police Report' },
    { key: 'character_cert_verification_status', label: 'Character Certificate' },
    { key: 'profile_photo_verification_status', label: 'Profile Photo' }
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Document Verification Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {documents.map((doc) => (
            <div key={doc.key} className="flex items-center justify-between p-3 border rounded">
              <span className="font-medium">{doc.label}</span>
              <div className="flex items-center space-x-2">
                {getStatusIcon(driverData[doc.key] || 'pending')}
                <Badge variant="outline" className="capitalize">
                  {(driverData[doc.key] || 'pending').replace('_', ' ')}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default DriverDocumentsTab
