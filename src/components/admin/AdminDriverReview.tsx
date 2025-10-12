
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface Driver {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  overall_verification_status: string
  cv_verification_status: string
  license_verification_status: string
  tourism_id_verification_status: string
  police_report_verification_status: string
  character_cert_verification_status: string
  profile_photo_verification_status: string
  created_at: string
}

interface AdminDriverReviewProps {
  selectedDriver: Driver | null
  adminNotes: string
  setAdminNotes: (notes: string) => void
  updateVerificationStatus: (driverId: string, field: string, status: string, notes?: string) => void
}

const AdminDriverReview = ({ 
  selectedDriver, 
  adminNotes, 
  setAdminNotes, 
  updateVerificationStatus 
}: AdminDriverReviewProps) => {
  if (!selectedDriver) return null

  return (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>
          Review Driver: {selectedDriver.first_name} {selectedDriver.last_name}
        </DialogTitle>
      </DialogHeader>
      
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Email</label>
            <p>{selectedDriver.email}</p>
          </div>
          <div>
            <label className="text-sm font-medium">Phone</label>
            <p>{selectedDriver.phone}</p>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium block mb-2">Document Status</label>
          <div className="space-y-2">
            {[
              { key: 'cv_verification_status', label: 'CV/Resume' },
              { key: 'license_verification_status', label: 'Driving License' },
              { key: 'tourism_id_verification_status', label: 'Tourism Board ID' },
              { key: 'police_report_verification_status', label: 'Police Report' },
              { key: 'character_cert_verification_status', label: 'Character Certificate' },
              { key: 'profile_photo_verification_status', label: 'Profile Photo' }
            ].map((doc) => (
              <div key={doc.key} className="flex items-center justify-between p-2 border rounded">
                <span>{doc.label}</span>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant={selectedDriver[doc.key as keyof Driver] === 'approved' ? 'default' : 'outline'}
                    onClick={() => updateVerificationStatus(selectedDriver.id, doc.key, 'approved')}
                  >
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant={selectedDriver[doc.key as keyof Driver] === 'rejected' ? 'destructive' : 'outline'}
                    onClick={() => updateVerificationStatus(selectedDriver.id, doc.key, 'rejected')}
                  >
                    Reject
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium block mb-2">Admin Notes</label>
          <Textarea
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
            placeholder="Add notes about this verification..."
            rows={3}
          />
        </div>

        <div className="flex gap-2">
          <Button
            onClick={() => updateVerificationStatus(
              selectedDriver.id, 
              'overall_verification_status', 
              'approved',
              adminNotes
            )}
            className="bg-green-600 hover:bg-green-700"
          >
            Approve Driver
          </Button>
          <Button
            variant="destructive"
            onClick={() => updateVerificationStatus(
              selectedDriver.id, 
              'overall_verification_status', 
              'rejected',
              adminNotes
            )}
          >
            Reject Driver
          </Button>
        </div>
      </div>
    </DialogContent>
  )
}

export default AdminDriverReview
