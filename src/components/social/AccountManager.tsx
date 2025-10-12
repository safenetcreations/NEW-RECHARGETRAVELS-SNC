
import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { SocialPlatform, UserSocialAccount } from '@/services/socialMediaService'
import { Plus, Trash2 } from 'lucide-react'

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

interface AccountManagerProps {
  platforms: SocialPlatform[]
  connectedAccounts: UserSocialAccount[]
  linkInput: string
  platformSelect: string
  onLinkInputChange: (value: string) => void
  onPlatformSelectChange: (value: string) => void
  onAddLink: () => void
  onRemoveAccount: (platformId: string) => void
}

export const AccountManager = ({
  platforms,
  connectedAccounts,
  linkInput,
  platformSelect,
  onLinkInputChange,
  onPlatformSelectChange,
  onAddLink,
  onRemoveAccount
}: AccountManagerProps) => {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="text-blue-600 flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Manage Social Media Accounts
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-4">
          <Input
            type="url"
            value={linkInput}
            onChange={(e) => onLinkInputChange(e.target.value)}
            className="flex-1 min-w-80"
            placeholder="Paste your social media profile URL here..."
          />
          
          <select
            value={platformSelect}
            onChange={(e) => onPlatformSelectChange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md bg-white"
          >
            <option value="">Select Platform</option>
            {platforms.map(platform => (
              <option key={platform.id} value={platform.id}>
                {platform.display_name}
              </option>
            ))}
          </select>
          
          <Button onClick={onAddLink} className="bg-blue-600 hover:bg-orange-400">
            Add Account
          </Button>
        </div>

        {/* Connected Accounts */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Connected Accounts</h3>
          {connectedAccounts.length === 0 ? (
            <p className="text-gray-500">No accounts connected yet</p>
          ) : (
            <div className="space-y-3">
              {connectedAccounts.map(account => {
                const platform = platforms.find(p => p.id === account.platform_id)
                return (
                  <div key={account.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${getPlatformColorClass(platform?.name || '')}`}>
                        {platformIcons[platform?.name as keyof typeof platformIcons] || '📱'}
                      </div>
                      <div>
                        <div className="font-semibold">{platform?.display_name}</div>
                        <div className="text-sm text-gray-600">
                          Connected on {new Date(account.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onRemoveAccount(account.platform_id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remove
                    </Button>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
