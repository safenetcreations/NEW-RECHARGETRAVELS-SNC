
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  User, 
  CheckCircle,
  AlertCircle,
  XCircle,
  Clock
} from 'lucide-react'

interface DriverVerificationStatusProps {
  verificationStatus: string
}

const DriverVerificationStatus = ({ verificationStatus }: DriverVerificationStatusProps) => {
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

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center">
          <User className="h-5 w-5 mr-2" />
          Account Verification Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2">
          {getStatusIcon(verificationStatus)}
          <Badge variant="outline" className="capitalize">
            {verificationStatus.replace('_', ' ')}
          </Badge>
        </div>
        {verificationStatus === 'pending' && (
          <p className="text-sm text-gray-600 mt-2">
            Your documents are being reviewed. You'll be notified once verification is complete.
          </p>
        )}
      </CardContent>
    </Card>
  )
}

export default DriverVerificationStatus
