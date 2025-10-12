import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { seedFirebaseData } from '@/scripts/seedFirebaseData'
import { toast } from 'sonner'
import { Database, CheckCircle, AlertCircle } from 'lucide-react'

const SeedData = () => {
  const [isSeeding, setIsSeeding] = useState(false)
  const [seedStatus, setSeedStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleSeedData = async () => {
    setIsSeeding(true)
    setSeedStatus('idle')
    
    try {
      const result = await seedFirebaseData()
      
      if (result.success) {
        setSeedStatus('success')
        toast.success('Firebase data seeded successfully!')
      } else {
        setSeedStatus('error')
        toast.error('Failed to seed data')
      }
    } catch (error) {
      console.error('Seed error:', error)
      setSeedStatus('error')
      toast.error('An error occurred while seeding data')
    } finally {
      setIsSeeding(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-6 w-6" />
              Seed Firebase Data
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-gray-600">
              <p className="mb-4">
                This utility will add sample data to your Firebase Firestore database including:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>3 Sample Tours (Cultural, Wildlife, Beach)</li>
                <li>3 Sample Hotels (Luxury and Resort properties)</li>
              </ul>
              <p className="mt-4 text-amber-600 font-medium">
                ⚠️ Warning: This will delete all existing tours and hotels before adding new data.
              </p>
            </div>

            <div className="flex flex-col items-center gap-4">
              <Button
                onClick={handleSeedData}
                disabled={isSeeding}
                size="lg"
                className="w-full max-w-xs"
              >
                {isSeeding ? 'Seeding Data...' : 'Seed Sample Data'}
              </Button>

              {seedStatus === 'success' && (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-5 w-5" />
                  <span>Data seeded successfully!</span>
                </div>
              )}

              {seedStatus === 'error' && (
                <div className="flex items-center gap-2 text-red-600">
                  <AlertCircle className="h-5 w-5" />
                  <span>Failed to seed data. Check console for errors.</span>
                </div>
              )}
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">Next Steps:</h3>
              <ol className="list-decimal list-inside space-y-1 text-blue-800">
                <li>After seeding, visit the homepage to see the tours</li>
                <li>Try booking a tour to test the booking system</li>
                <li>Check Firebase Console to verify the data</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default SeedData