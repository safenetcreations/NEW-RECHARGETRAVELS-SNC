
import { useState, useEffect, useCallback } from 'react'
import { socialMediaService, SocialPost, SocialPlatform, UserSocialAccount } from '@/services/socialMediaService'
import { useAuth } from '@/hooks/useAuth'
import { toast } from 'sonner'

export const useSocialMedia = () => {
  const { user } = useAuth()
  const [posts, setPosts] = useState<SocialPost[]>([])
  const [platforms, setPlatforms] = useState<SocialPlatform[]>([])
  const [connectedAccounts, setConnectedAccounts] = useState<UserSocialAccount[]>([])
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        console.log('Loading social media data...')
        
        // Always load platforms (public data)
        const platformsData = await socialMediaService.getPlatforms()
        console.log('Platforms loaded:', platformsData)
        setPlatforms(platformsData || [])

        if (user) {
          console.log('Loading user-specific data for:', user.uid)
          // Load user-specific data if authenticated
          try {
            const [accountsData, postsData] = await Promise.all([
              socialMediaService.getUserSocialAccounts(user.uid),
              socialMediaService.getUserPosts(user.uid)
            ])
            console.log('User accounts loaded:', accountsData)
            console.log('User posts loaded:', postsData)
            setConnectedAccounts(accountsData || [])
            setPosts(postsData || [])
          } catch (userError) {
            console.error('Error loading user-specific data:', userError)
            // Fall back to public posts
            const publicPosts = await socialMediaService.getPublicPosts()
            setPosts(publicPosts || [])
            setConnectedAccounts([])
          }
        } else {
          console.log('Loading public posts for unauthenticated user')
          // Load public posts for unauthenticated users
          const publicPosts = await socialMediaService.getPublicPosts()
          console.log('Public posts loaded:', publicPosts)
          setPosts(publicPosts || [])
          setConnectedAccounts([])
        }
      } catch (error) {
        console.error('Error loading social media data:', error)
        toast.error('Failed to load social media data')
        
        // Set sample data as fallback to prevent blank page
        try {
          const samplePlatforms = await socialMediaService.getPlatforms()
          const samplePosts = await socialMediaService.getPublicPosts()
          setPlatforms(samplePlatforms || [])
          setPosts(samplePosts || [])
        } catch (fallbackError) {
          console.error('Error loading fallback data:', fallbackError)
          // Set empty arrays to prevent undefined errors
          setPlatforms([])
          setPosts([])
        }
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [user])

  // Set up real-time subscription (only for authenticated users)
  useEffect(() => {
    if (!user) return

    try {
      const subscription = socialMediaService.subscribeToPosts(user.uid, (newPost) => {
        setPosts(prev => [newPost, ...prev])
        toast.success('New post received!')
      })

      return () => {
        if (subscription && typeof (subscription as any).unsubscribe === 'function') {
          (subscription as any).unsubscribe()
        }
      }
    } catch (error) {
      console.error('Error setting up real-time subscription:', error)
    }
  }, [user])

  const connectAccount = useCallback(async (platformId: string, accessToken: string, refreshToken?: string) => {
    if (!user) {
      toast.error('Please log in to connect social accounts')
      return
    }

    try {
      await socialMediaService.connectSocialAccount(platformId, accessToken, refreshToken)
      
      // Refresh connected accounts
      const accounts = await socialMediaService.getUserSocialAccounts(user.uid)
      setConnectedAccounts(accounts || [])
      toast.success('Social account connected successfully!')
    } catch (error) {
      console.error('Error connecting social account:', error)
      toast.error('Failed to connect social account')
    }
  }, [user])

  const disconnectAccount = useCallback(async (platformId: string) => {
    if (!user) {
      toast.error('Please log in to manage social accounts')
      return
    }

    try {
      await socialMediaService.disconnectSocialAccount(platformId)
      
      // Refresh connected accounts
      const accounts = await socialMediaService.getUserSocialAccounts(user.uid)
      setConnectedAccounts(accounts || [])
      toast.success('Social account disconnected')
    } catch (error) {
      console.error('Error disconnecting social account:', error)
      toast.error('Failed to disconnect social account')
    }
  }, [user])

  const syncPosts = useCallback(async (platformId?: string) => {
    if (!user) {
      toast.error('Please log in to sync posts')
      return
    }

    try {
      setSyncing(true)
      
      if (platformId) {
        await socialMediaService.syncPlatformPosts(platformId)
      } else {
        // Sync all connected platforms
        for (const account of connectedAccounts) {
          await socialMediaService.syncPlatformPosts(account.platform_id)
        }
      }

      // Refresh posts
      const updatedPosts = await socialMediaService.getUserPosts(user.uid)
      setPosts(updatedPosts || [])
      toast.success('Posts synced successfully!')
    } catch (error) {
      console.error('Error syncing posts:', error)
      toast.error('Failed to sync posts')
    } finally {
      setSyncing(false)
    }
  }, [user, connectedAccounts])

  const filterPosts = useCallback(async (platformFilter?: string) => {
    try {
      setLoading(true)
      let filteredPosts: SocialPost[]
      
      if (user) {
        filteredPosts = await socialMediaService.getUserPosts(user.uid, platformFilter)
      } else {
        filteredPosts = await socialMediaService.getPublicPosts(platformFilter)
      }
      
      setPosts(filteredPosts || [])
    } catch (error) {
      console.error('Error filtering posts:', error)
      toast.error('Failed to filter posts')
    } finally {
      setLoading(false)
    }
  }, [user])

  return {
    posts,
    platforms,
    connectedAccounts,
    loading,
    syncing,
    connectAccount,
    disconnectAccount,
    syncPosts,
    filterPosts
  }
}
