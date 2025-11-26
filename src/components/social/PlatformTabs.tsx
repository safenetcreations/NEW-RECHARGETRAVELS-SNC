
import React from 'react'
import { Button } from '@/components/ui/button'
import { SocialPlatform } from '@/services/socialMediaService'

const platformIcons = {
  facebook: 'f',
  instagram: '📷',
  twitter: '𝕏',
  youtube: '▶',
  tripadvisor: '🦉',
  google: 'G',
  tiktok: '♪',
  linkedin: 'in',
  pinterest: 'P'
}

const getPlatformColorClass = (platform: string) => {
  const colors: Record<string, string> = {
    facebook: 'bg-blue-600',
    instagram: 'bg-purple-600',
    twitter: 'bg-blue-400',
    youtube: 'bg-red-600',
    tripadvisor: 'bg-green-600',
    google: 'bg-blue-500',
    tiktok: 'bg-black',
    linkedin: 'bg-blue-700',
    pinterest: 'bg-red-500'
  }
  return colors[platform] || 'bg-gray-500'
}

interface PlatformTabsProps {
  platforms: SocialPlatform[]
  currentFilter: string
  onFilterPlatform: (platform: string) => void
}

export const PlatformTabs = ({ platforms, currentFilter, onFilterPlatform }: PlatformTabsProps) => {
  return (
    <div className="bg-white shadow-md p-5 flex justify-center flex-wrap gap-3">
      <Button
        variant={currentFilter === 'all' ? 'default' : 'outline'}
        onClick={() => onFilterPlatform('all')}
        className="rounded-full"
      >
        🌐 All Platforms
      </Button>
      {platforms.map(platform => (
        <Button
          key={platform.id}
          variant={currentFilter === platform.name ? 'default' : 'outline'}
          onClick={() => onFilterPlatform(platform.name)}
          className={`rounded-full ${currentFilter === platform.name ? getPlatformColorClass(platform.name) : ''}`}
        >
          {platformIcons[platform.name as keyof typeof platformIcons] || '📱'} {platform.display_name}
        </Button>
      ))}
    </div>
  )
}
