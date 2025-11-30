import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { seedFirebaseData, seedDriversOnly } from '@/scripts/seedFirebaseData'
import { toast } from 'sonner'
import { Database, CheckCircle, AlertCircle, Users, Car, LogIn } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { Link } from 'react-router-dom'

const SeedData = () => {
  const { user } = useAuth()
  const [isSeeding, setIsSeeding] = useState(false)
  const [isSeedingDrivers, setIsSeedingDrivers] = useState(false)
  const [seedStatus, setSeedStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [driverSeedStatus, setDriverSeedStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleSeedData = async () => {
    if (!user) {
      toast.error('Please log in first to seed data')
      return
    }
    
    setIsSeeding(true)
    setSeedStatus('idle')
    
    try {
      const result = await seedFirebaseData()
      
      if (result.success) {
        setSeedStatus('success')
        toast.success('Firebase data seeded successfully!')
      } else {
        setSeedStatus('error')
        toast.error('Failed to seed data: ' + (result.error?.message || 'Unknown error'))
      }
    } catch (error: any) {
      console.error('Seed error:', error)
      setSeedStatus('error')
      toast.error('Error: ' + (error?.message || 'Unknown error'))
    } finally {
      setIsSeeding(false)
    }
  }

  const handleSeedDrivers = async () => {
    if (!user) {
      toast.error('Please log in first to seed drivers')
      return
    }
    
    setIsSeedingDrivers(true)
    setDriverSeedStatus('idle')
    
    try {
      const result = await seedDriversOnly()
      
      if (result.success) {
        setDriverSeedStatus('success')
        toast.success(`Successfully added ${result.driversAdded} sample drivers!`)
      } else {
        setDriverSeedStatus('error')
        toast.error('Failed to seed drivers: ' + ((result.error as any)?.message || 'Unknown error'))
      }
    } catch (error: any) {
      console.error('Seed drivers error:', error)
      setDriverSeedStatus('error')
      toast.error('Error: ' + (error?.message || 'Unknown error'))
    } finally {
      setIsSeedingDrivers(false)
    }
  }

  // Show login prompt if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LogIn className="h-6 w-6 text-orange-500" />
                Login Required
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center py-8">
                <AlertCircle className="h-16 w-16 text-amber-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Authentication Required</h3>
                <p className="text-gray-600 mb-6">
                  You need to be logged in to seed sample data to Firebase.
                </p>
                <div className="flex justify-center gap-4">
                  <Button asChild>
                    <Link to="/login">Log In</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link to="/signup">Sign Up</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-2xl space-y-6">
        {/* All Data Seed */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-6 w-6" />
              Seed All Firebase Data
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
                <li>6 Sample Drivers with reviews</li>
              </ul>
              <p className="mt-4 text-amber-600 font-medium">
                ⚠️ Warning: This will delete all existing tours, hotels, and drivers before adding new data.
              </p>
            </div>

            <div className="flex flex-col items-center gap-4">
              <Button
                onClick={handleSeedData}
                disabled={isSeeding || isSeedingDrivers}
                size="lg"
                className="w-full max-w-xs"
              >
                {isSeeding ? 'Seeding Data...' : 'Seed All Sample Data'}
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
          </CardContent>
        </Card>

        {/* Drivers Only Seed */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-6 w-6 text-orange-500" />
              Seed Drivers Only
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-gray-600">
              <p className="mb-4">
                Add sample driver profiles to test the Drivers Directory page:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                <li><strong>Chaminda Perera</strong> - Chauffeur Guide (English/German/French)</li>
                <li><strong>Suresh Kumar</strong> - National Guide (English/Tamil/Hindi)</li>
                <li><strong>Nimal Jayawardena</strong> - Tourist Driver (12 years exp)</li>
                <li><strong>Lakshmi Fernando</strong> - Female Chauffeur Guide (Japanese/Mandarin)</li>
                <li><strong>Roshan Silva</strong> - Freelance Driver (Airport transfers)</li>
                <li><strong>Arjuna Bandara</strong> - Safari Specialist (Yala/Udawalawe)</li>
              </ul>
            </div>

            <div className="flex flex-col items-center gap-4">
              <Button
                onClick={handleSeedDrivers}
                disabled={isSeeding || isSeedingDrivers}
                size="lg"
                variant="outline"
                className="w-full max-w-xs border-orange-500 text-orange-600 hover:bg-orange-50"
              >
                <Car className="mr-2 h-4 w-4" />
                {isSeedingDrivers ? 'Adding Drivers...' : 'Seed Drivers Only'}
              </Button>

              {driverSeedStatus === 'success' && (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-5 w-5" />
                  <span>Drivers added successfully!</span>
                </div>
              )}

              {driverSeedStatus === 'error' && (
                <div className="flex items-center gap-2 text-red-600">
                  <AlertCircle className="h-5 w-5" />
                  <span>Failed to add drivers. Check console for errors.</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">Next Steps:</h3>
          <ol className="list-decimal list-inside space-y-1 text-blue-800">
            <li>After seeding drivers, visit <a href="/drivers" className="underline">/drivers</a> to see the driver directory</li>
            <li>Click on any driver to see their profile page</li>
            <li>Test the "Join Our Team" button at <a href="/join-with-us" className="underline">/join-with-us</a></li>
            <li>Check Firebase Console to verify the data</li>
          </ol>
        </div>
      </div>
    </div>
  )
}

export default SeedData