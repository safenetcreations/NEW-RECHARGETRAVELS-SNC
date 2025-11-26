
import React from 'react'
import { Button } from '@/components/ui/button'
import { Settings } from 'lucide-react'

interface DashboardHeaderProps {
  onSettingsClick: () => void
  showSettings: boolean
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ onSettingsClick, showSettings }) => {
  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <Button onClick={onSettingsClick} variant="outline">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
        </div>
      </div>
    </header>
  )
}

export default DashboardHeader
