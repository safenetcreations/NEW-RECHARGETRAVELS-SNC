
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Users,
  MessageSquare
} from 'lucide-react'

interface Driver {
  id: string
  first_name: string
  last_name: string
  email: string
  overall_verification_status: string
}

interface AdminBulkOperationsProps {
  selectedDrivers: string[]
  drivers: Driver[]
  onBulkOperation: (operation: string, driverIds: string[], data?: { notes: string }) => void
}

const AdminBulkOperations = ({ 
  selectedDrivers, 
  drivers, 
  onBulkOperation 
}: AdminBulkOperationsProps) => {
  const [bulkNotes, setBulkNotes] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  const handleBulkAction = async (operation: string) => {
    if (selectedDrivers.length === 0) return
    
    setIsProcessing(true)
    try {
      await onBulkOperation(operation, selectedDrivers, { notes: bulkNotes })
      setBulkNotes('')
    } finally {
      setIsProcessing(false)
    }
  }

  const getStatusCounts = () => {
    const counts = {
      pending: 0,
      approved: 0,
      rejected: 0,
      under_review: 0
    }
    
    drivers.forEach(driver => {
      const status = driver.overall_verification_status as keyof typeof counts
      if (status in counts) {
        counts[status]++
      }
    })
    
    return counts
  }

  const statusCounts = getStatusCounts()

  if (selectedDrivers.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Bulk Operations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-600">
            <Users className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <p className="text-lg font-medium mb-2">No drivers selected</p>
            <p>Select drivers from the dashboard to perform bulk operations.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Selected Drivers ({selectedDrivers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{statusCounts.pending}</div>
                <div className="text-sm text-gray-600">Pending</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{statusCounts.under_review}</div>
                <div className="text-sm text-gray-600">Under Review</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{statusCounts.approved}</div>
                <div className="text-sm text-gray-600">Approved</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{statusCounts.rejected}</div>
                <div className="text-sm text-gray-600">Rejected</div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Selected Drivers:</h4>
              <div className="flex flex-wrap gap-2">
                {drivers.map(driver => (
                  <Badge key={driver.id} variant="outline" className="text-sm">
                    {driver.first_name} {driver.last_name}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MessageSquare className="h-5 w-5 mr-2" />
            Bulk Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium block mb-2">
              Admin Notes (will be sent to all selected drivers)
            </label>
            <Textarea
              value={bulkNotes}
              onChange={(e) => setBulkNotes(e.target.value)}
              placeholder="Add notes that will be included in WhatsApp notifications..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              onClick={() => handleBulkAction('approve')}
              disabled={isProcessing}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Approve All
            </Button>

            <Button
              onClick={() => handleBulkAction('under_review')}
              disabled={isProcessing}
              variant="outline"
              className="border-yellow-500 text-yellow-600 hover:bg-yellow-50"
            >
              <AlertCircle className="h-4 w-4 mr-2" />
              Mark Under Review
            </Button>

            <Button
              onClick={() => handleBulkAction('reject')}
              disabled={isProcessing}
              variant="destructive"
            >
              <XCircle className="h-4 w-4 mr-2" />
              Reject All
            </Button>
          </div>

          <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
            <p className="font-medium mb-1">📱 WhatsApp Notifications</p>
            <p>All selected drivers will receive WhatsApp notifications about their verification status update.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default AdminBulkOperations
