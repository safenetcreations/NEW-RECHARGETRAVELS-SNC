
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface DriverProfileTabProps {
  driverData: any
}

const DriverProfileTab = ({ driverData }: DriverProfileTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-600">Name</label>
            <p className="font-medium">{driverData.first_name} {driverData.last_name}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Email</label>
            <p className="font-medium">{driverData.email}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Phone</label>
            <p className="font-medium">{driverData.phone}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Experience</label>
            <p className="font-medium">{driverData.experience_years} years</p>
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-600">Languages</label>
          <div className="flex gap-2 mt-1">
            {driverData.languages?.map((lang: string) => (
              <Badge key={lang} variant="outline">{lang}</Badge>
            ))}
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-600">Bio</label>
          <p className="text-gray-800 mt-1">{driverData.bio}</p>
        </div>
      </CardContent>
    </Card>
  )
}

export default DriverProfileTab
