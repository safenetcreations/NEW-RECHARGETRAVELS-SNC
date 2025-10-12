
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Download, X, Smartphone } from 'lucide-react'
import { usePWA } from '@/hooks/usePWA'

const PWAInstallPrompt = () => {
  const { isInstallable, installApp } = usePWA()
  const [showPrompt, setShowPrompt] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    // Show prompt after user has been on site for 30 seconds
    const timer = setTimeout(() => {
      if (isInstallable && !dismissed) {
        setShowPrompt(true)
      }
    }, 30000)

    return () => clearTimeout(timer)
  }, [isInstallable, dismissed])

  const handleInstall = async () => {
    await installApp()
    setShowPrompt(false)
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    setDismissed(true)
    // Remember dismissal for 24 hours
    localStorage.setItem('pwa-prompt-dismissed', Date.now().toString())
  }

  // Check if prompt was recently dismissed
  useEffect(() => {
    const dismissed = localStorage.getItem('pwa-prompt-dismissed')
    if (dismissed) {
      const dismissedTime = parseInt(dismissed)
      const now = Date.now()
      const twentyFourHours = 24 * 60 * 60 * 1000
      
      if (now - dismissedTime < twentyFourHours) {
        setDismissed(true)
      } else {
        localStorage.removeItem('pwa-prompt-dismissed')
      }
    }
  }, [])

  if (!showPrompt || !isInstallable) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-sm">
      <Card className="shadow-lg border-teal-200">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <Smartphone className="h-6 w-6 text-teal-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-gray-900">
                Install Recharge Travels
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Install our app for quick access and a better experience!
              </p>
              <div className="flex space-x-2 mt-3">
                <Button 
                  onClick={handleInstall}
                  size="sm"
                  className="bg-teal-600 hover:bg-teal-700"
                >
                  <Download className="h-4 w-4 mr-1" />
                  Install
                </Button>
                <Button 
                  onClick={handleDismiss}
                  variant="ghost" 
                  size="sm"
                >
                  Later
                </Button>
              </div>
            </div>
            <Button
              onClick={handleDismiss}
              variant="ghost"
              size="sm"
              className="flex-shrink-0 h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default PWAInstallPrompt
