
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'
import { 
  CheckCircle, 
  XCircle, 
  Clock,
  Eye,
  Phone,
  MessageSquare
} from 'lucide-react'
import AdminDriverReview from './AdminDriverReview'

interface Driver {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  whatsapp_number: string
  overall_verification_status: string
  cv_verification_status: string
  license_verification_status: string
  tourism_id_verification_status: string
  police_report_verification_status: string
  character_cert_verification_status: string
  profile_photo_verification_status: string
  created_at: string
}

interface AdminDriversListProps {
  filteredDrivers: Driver[]
  selectedDrivers: string[]
  setSelectedDrivers: (drivers: string[]) => void
  updateVerificationStatus: (driverId: string, field: string, status: string, notes?: string) => void
}

const AdminDriversList = ({ 
  filteredDrivers, 
  selectedDrivers,
  setSelectedDrivers,
  updateVerificationStatus 
}: AdminDriversListProps) => {
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null)
  const [adminNotes, setAdminNotes] = useState('')

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      case 'under_review':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />
    }
  }

  const handleSelectDriver = (driverId: string, checked: boolean) => {
    if (checked) {
      setSelectedDrivers([...selectedDrivers, driverId])
    } else {
      setSelectedDrivers(selectedDrivers.filter(id => id !== driverId))
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedDrivers(filteredDrivers.map(d => d.id))
    } else {
      setSelectedDrivers([])
    }
  }

  const openWhatsApp = (phoneNumber: string) => {
    const formattedNumber = phoneNumber.startsWith('+') ? phoneNumber : `+94${phoneNumber.substring(1)}`
    window.open(`https://wa.me/${formattedNumber.replace(/[^\d]/g, '')}`, '_blank')
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Driver Verifications</span>
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={selectedDrivers.length === filteredDrivers.length && filteredDrivers.length > 0}
              onCheckedChange={handleSelectAll}
            />
            <span className="text-sm text-gray-600">
              Select All ({selectedDrivers.length} selected)
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredDrivers.map((driver) => (
            <div key={driver.id} className="border rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    checked={selectedDrivers.includes(driver.id)}
                    onCheckedChange={(checked) => handleSelectDriver(driver.id, !!checked)}
                  />
                  <div>
                    <h4 className="font-semibold text-lg">
                      {driver.first_name} {driver.last_name}
                    </h4>
                    <p className="text-gray-600">{driver.email}</p>
                    <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                      <span className="flex items-center">
                        <Phone className="h-3 w-3 mr-1" />
                        {driver.phone}
                      </span>
                      {driver.whatsapp_number && (
                        <button
                          onClick={() => openWhatsApp(driver.whatsapp_number)}
                          className="flex items-center text-green-600 hover:text-green-700"
                        >
                          <MessageSquare className="h-3 w-3 mr-1" />
                          WhatsApp
                        </button>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">
                      Registered: {new Date(driver.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(driver.overall_verification_status)}
                  <Badge className={getStatusColor(driver.overall_verification_status)}>
                    {driver.overall_verification_status}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 mb-4">
                {[
                  { key: 'cv_verification_status', label: 'CV' },
                  { key: 'license_verification_status', label: 'License' },
                  { key: 'tourism_id_verification_status', label: 'Tourism ID' },
                  { key: 'police_report_verification_status', label: 'Police Report' },
                  { key: 'character_cert_verification_status', label: 'Character Cert' },
                  { key: 'profile_photo_verification_status', label: 'Photo' }
                ].map((doc) => (
                  <div key={doc.key} className="text-center">
                    <p className="text-xs text-gray-600">{doc.label}</p>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${getStatusColor(driver[doc.key as keyof Driver] as string)}`}
                    >
                      {((driver[doc.key as keyof Driver] as string) || 'pending').charAt(0).toUpperCase()}
                    </Badge>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedDriver(driver)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Review
                    </Button>
                  </DialogTrigger>
                  <AdminDriverReview
                    selectedDriver={selectedDriver}
                    adminNotes={adminNotes}
                    setAdminNotes={setAdminNotes}
                    updateVerificationStatus={updateVerificationStatus}
                  />
                </Dialog>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => updateVerificationStatus(driver.id, 'overall_verification_status', 'under_review')}
                >
                  Mark Under Review
                </Button>

                {driver.whatsapp_number && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openWhatsApp(driver.whatsapp_number)}
                    className="text-green-600 border-green-200 hover:bg-green-50"
                  >
                    <MessageSquare className="h-4 w-4 mr-1" />
                    WhatsApp
                  </Button>
                )}
              </div>
            </div>
          ))}

          {filteredDrivers.length === 0 && (
            <div className="text-center py-8 text-gray-600">
              No drivers found matching your criteria.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default AdminDriversList
