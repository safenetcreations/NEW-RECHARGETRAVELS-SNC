
import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useSocialMedia } from '@/hooks/useSocialMedia'
import { useAuth } from '@/hooks/useAuth'
import { SocialFeedHeader } from '@/components/social/SocialFeedHeader'
import { PlatformTabs } from '@/components/social/PlatformTabs'
import { PublicPostsGrid } from '@/components/social/PublicPostsGrid'
import { AdminAccountManager } from '@/components/social/AdminAccountManager'
import { SocialWelcomeSection } from '@/components/social/SocialWelcomeSection'
import { LiveSocialFeed } from '@/components/social/LiveSocialFeed'
import { TourismNewsSection } from '@/components/social/TourismNewsSection'

const AboutSocial = () => {
  const { user } = useAuth()
  const {
    posts,
    platforms,
    connectedAccounts,
    loading,
    syncing,
    connectAccount,
    disconnectAccount,
    syncPosts,
    filterPosts
  } = useSocialMedia()

  const [currentFilter, setCurrentFilter] = useState('all')
  const [updateTime, setUpdateTime] = useState('')

  // Check if user is admin
  const isAdmin = user?.email === 'admin@rechargetravels.com'

  useEffect(() => {
    setUpdateTime(new Date().toLocaleString())
  }, [posts])

  const handleFilterPlatform = async (platform: string) => {
    try {
      setCurrentFilter(platform)
      await filterPosts(platform === 'all' ? undefined : platform)
    } catch (error) {
      console.error('Error filtering posts:', error)
    }
  }

  const handleSyncPosts = async () => {
    try {
      await syncPosts()
    } catch (error) {
      console.error('Error syncing posts:', error)
    }
  }

  // Add error boundary to prevent blank page
  if (!platforms && !loading) {
    console.error('No platforms loaded and not loading')
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Loading Social Media Feed...</h2>
          <p className="text-gray-600">Please wait while we load the content.</p>
        </div>
      </div>
    )
  }

  console.log('AboutSocial render - user:', user, 'platforms:', platforms, 'posts:', posts)

  // Always show the premium hero section with YouTube broadcast
  return (
    <>
      <Helmet>
        <title>Connect With Us - Live on All Platforms | Recharge Travels</title>
        <meta name="description" content="Watch our live YouTube channel and follow Recharge Travels across Instagram, Facebook, TikTok, Twitter, LinkedIn and TripAdvisor. Join 50,000+ travelers in the #RechargeLife community." />
      </Helmet>

      <SocialWelcomeSection />
      <LiveSocialFeed />
      <TourismNewsSection />
    </>
  )
}

export default AboutSocial
