import React, { useState, useEffect } from 'react'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Facebook, Linkedin, Twitter, Instagram, Save, Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'

interface SocialFeedConfig {
  facebook?: {
    postUrl: string
    pageUrl: string
  }
  linkedin?: {
    postUrl: string
    companyUrl: string
  }
  twitter?: {
    postUrl: string
    profileUrl: string
  }
  instagram?: {
    postUrl: string
    profileUrl: string
  }
}

export const LiveSocialFeedAdmin = () => {
  const [config, setConfig] = useState<SocialFeedConfig>({
    facebook: { postUrl: '', pageUrl: 'https://www.facebook.com/Rechargetours' },
    linkedin: { postUrl: '', companyUrl: 'https://www.linkedin.com/company/rechargetravels' },
    twitter: { postUrl: '', profileUrl: 'https://x.com/rechargetours' },
    instagram: { postUrl: '', profileUrl: 'https://www.instagram.com/rechargetravels' }
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const docRef = doc(db, 'settings', 'socialMedia')
        const docSnap = await getDoc(docRef)
        
        if (docSnap.exists()) {
          const data = docSnap.data()
          if (data.liveFeed) {
            setConfig(prev => ({
              facebook: { ...prev.facebook, ...data.liveFeed.facebook },
              linkedin: { ...prev.linkedin, ...data.liveFeed.linkedin },
              twitter: { ...prev.twitter, ...data.liveFeed.twitter },
              instagram: { ...prev.instagram, ...data.liveFeed.instagram }
            }))
          }
        }
      } catch (error) {
        console.error('Error fetching config:', error)
        toast.error('Failed to load configuration')
      } finally {
        setLoading(false)
      }
    }

    fetchConfig()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      const docRef = doc(db, 'settings', 'socialMedia')
      const docSnap = await getDoc(docRef)
      
      const existingData = docSnap.exists() ? docSnap.data() : {}
      
      await setDoc(docRef, {
        ...existingData,
        liveFeed: config,
        updatedAt: new Date().toISOString()
      }, { merge: true })
      
      toast.success('Social feed configuration saved!')
    } catch (error) {
      console.error('Error saving config:', error)
      toast.error('Failed to save configuration')
    } finally {
      setSaving(false)
    }
  }

  const updateConfig = (platform: keyof SocialFeedConfig, field: string, value: string) => {
    setConfig(prev => ({
      ...prev,
      [platform]: {
        ...prev[platform],
        [field]: value
      }
    }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Live Social Feed Settings</h2>
          <p className="text-gray-600">Configure which posts appear on the Connect With Us page</p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Facebook */}
        <Card>
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <Facebook className="w-5 h-5" />
              Facebook
            </CardTitle>
            <CardDescription className="text-blue-100">
              Embed a Facebook post or page plugin
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div>
              <Label htmlFor="fb-post">Facebook Post Embed URL</Label>
              <Input
                id="fb-post"
                placeholder="https://www.facebook.com/plugins/post.php?href=..."
                value={config.facebook?.postUrl || ''}
                onChange={(e) => updateConfig('facebook', 'postUrl', e.target.value)}
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">
                Get embed URL from Facebook → Share → Embed → Copy iframe src
              </p>
            </div>
            <div>
              <Label htmlFor="fb-page">Facebook Page URL</Label>
              <Input
                id="fb-page"
                placeholder="https://www.facebook.com/YourPage"
                value={config.facebook?.pageUrl || ''}
                onChange={(e) => updateConfig('facebook', 'pageUrl', e.target.value)}
                className="mt-1"
              />
            </div>
          </CardContent>
        </Card>

        {/* LinkedIn */}
        <Card>
          <CardHeader className="bg-gradient-to-r from-blue-700 to-sky-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <Linkedin className="w-5 h-5" />
              LinkedIn
            </CardTitle>
            <CardDescription className="text-blue-100">
              Embed a LinkedIn post
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div>
              <Label htmlFor="li-post">LinkedIn Post Embed URL</Label>
              <Input
                id="li-post"
                placeholder="https://www.linkedin.com/embed/feed/update/..."
                value={config.linkedin?.postUrl || ''}
                onChange={(e) => updateConfig('linkedin', 'postUrl', e.target.value)}
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">
                Copy from LinkedIn post → ••• → Embed this post
              </p>
            </div>
            <div>
              <Label htmlFor="li-company">LinkedIn Company URL</Label>
              <Input
                id="li-company"
                placeholder="https://www.linkedin.com/company/yourcompany"
                value={config.linkedin?.companyUrl || ''}
                onChange={(e) => updateConfig('linkedin', 'companyUrl', e.target.value)}
                className="mt-1"
              />
            </div>
          </CardContent>
        </Card>

        {/* Twitter/X */}
        <Card>
          <CardHeader className="bg-gradient-to-r from-slate-700 to-slate-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <Twitter className="w-5 h-5" />
              X / Twitter
            </CardTitle>
            <CardDescription className="text-slate-200">
              Embed a tweet or show timeline
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div>
              <Label htmlFor="tw-post">Tweet URL</Label>
              <Input
                id="tw-post"
                placeholder="https://twitter.com/user/status/123456789"
                value={config.twitter?.postUrl || ''}
                onChange={(e) => updateConfig('twitter', 'postUrl', e.target.value)}
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">
                Paste the full URL of any tweet. Leave empty to show timeline.
              </p>
            </div>
            <div>
              <Label htmlFor="tw-profile">Twitter Profile URL</Label>
              <Input
                id="tw-profile"
                placeholder="https://twitter.com/yourhandle"
                value={config.twitter?.profileUrl || ''}
                onChange={(e) => updateConfig('twitter', 'profileUrl', e.target.value)}
                className="mt-1"
              />
            </div>
          </CardContent>
        </Card>

        {/* Instagram */}
        <Card>
          <CardHeader className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <Instagram className="w-5 h-5" />
              Instagram
            </CardTitle>
            <CardDescription className="text-pink-100">
              Embed an Instagram post
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div>
              <Label htmlFor="ig-post">Instagram Post URL</Label>
              <Input
                id="ig-post"
                placeholder="https://www.instagram.com/p/ABC123/"
                value={config.instagram?.postUrl || ''}
                onChange={(e) => updateConfig('instagram', 'postUrl', e.target.value)}
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">
                Paste the full URL of any Instagram post or reel
              </p>
            </div>
            <div>
              <Label htmlFor="ig-profile">Instagram Profile URL</Label>
              <Input
                id="ig-profile"
                placeholder="https://www.instagram.com/yourhandle"
                value={config.instagram?.profileUrl || ''}
                onChange={(e) => updateConfig('instagram', 'profileUrl', e.target.value)}
                className="mt-1"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Instructions */}
      <Card className="bg-amber-50 border-amber-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-800">
            <AlertCircle className="w-5 h-5" />
            How to Get Embed URLs
          </CardTitle>
        </CardHeader>
        <CardContent className="text-amber-900 space-y-3">
          <div>
            <strong>Facebook:</strong> Go to post → Click Share → Embed → Copy the URL from the iframe src attribute
          </div>
          <div>
            <strong>LinkedIn:</strong> Go to post → Click ••• → Embed this post → Copy the iframe src URL
          </div>
          <div>
            <strong>Twitter/X:</strong> Simply paste the full tweet URL (e.g., https://twitter.com/user/status/123)
          </div>
          <div>
            <strong>Instagram:</strong> Paste the full post URL (e.g., https://www.instagram.com/p/ABC123/)
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default LiveSocialFeedAdmin
