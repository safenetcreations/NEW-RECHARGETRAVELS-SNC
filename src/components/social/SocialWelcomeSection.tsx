import React, { useState, useEffect, useRef, useCallback } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Button } from '@/components/ui/button'
import {
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
  Globe,
  Music2,
  Users,
  Heart,
  Share2,
  Bell,
  TrendingUp,
  Volume2,
  VolumeX,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Maximize2
} from 'lucide-react'

// Pinterest icon component (not in lucide)
const PinterestIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
  </svg>
)

// Default social platforms configuration - will be overridden by Firebase
const getDefaultPlatforms = () => [
  {
    id: 'youtube',
    name: 'YouTube',
    handle: '@rechargetravelsltdColombo',
    url: 'https://www.youtube.com/@rechargetravelsltdColombo',
    description: '4K travel films, live tours & behind-the-scenes adventures',
    stats: '2.5K+ Subscribers',
    accent: 'from-red-600 via-red-500 to-rose-500',
    hoverAccent: 'group-hover:from-red-500 group-hover:via-red-400 group-hover:to-rose-400',
    icon: Youtube,
    mainColor: 'bg-red-600',
    textColor: 'text-red-400',
    borderColor: 'border-red-500/30',
    glowColor: 'shadow-red-500/50',
    enabled: true
  },
  {
    id: 'instagram',
    name: 'Instagram',
    handle: '@rechargetravels',
    url: 'https://www.instagram.com/rechargetravels',
    description: 'Daily reels, stories & stunning photo dumps from paradise',
    stats: '15K+ Followers',
    accent: 'from-fuchsia-600 via-pink-500 to-amber-500',
    hoverAccent: 'group-hover:from-fuchsia-500 group-hover:via-pink-400 group-hover:to-amber-400',
    icon: Instagram,
    mainColor: 'bg-gradient-to-r from-purple-600 to-pink-600',
    textColor: 'text-pink-400',
    borderColor: 'border-pink-500/30',
    glowColor: 'shadow-pink-500/50',
    enabled: true
  },
  {
    id: 'facebook',
    name: 'Facebook',
    handle: 'Recharge Tours',
    url: 'https://www.facebook.com/Rechargetours',
    description: 'Guest reviews, travel stories & exclusive event updates',
    stats: '8K+ Likes',
    accent: 'from-blue-600 via-blue-500 to-sky-500',
    hoverAccent: 'group-hover:from-blue-500 group-hover:via-blue-400 group-hover:to-sky-400',
    icon: Facebook,
    mainColor: 'bg-blue-600',
    textColor: 'text-blue-400',
    borderColor: 'border-blue-500/30',
    glowColor: 'shadow-blue-500/50',
    enabled: true
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    handle: '@rechargetravels',
    url: 'https://www.tiktok.com/@rechargetravels',
    description: 'Viral short videos, trending travel content & fun moments',
    stats: '25K+ Followers',
    accent: 'from-slate-800 via-pink-600 to-cyan-500',
    hoverAccent: 'group-hover:from-slate-700 group-hover:via-pink-500 group-hover:to-cyan-400',
    icon: Music2,
    mainColor: 'bg-black',
    textColor: 'text-cyan-400',
    borderColor: 'border-cyan-500/30',
    glowColor: 'shadow-cyan-500/50',
    enabled: true
  },
  {
    id: 'twitter',
    name: 'X / Twitter',
    handle: '@rechargetours',
    url: 'https://x.com/rechargetours',
    description: 'Real-time updates, travel tips & bite-sized inspiration',
    stats: '3.2K+ Followers',
    accent: 'from-slate-700 via-slate-600 to-slate-500',
    hoverAccent: 'group-hover:from-slate-600 group-hover:via-slate-500 group-hover:to-slate-400',
    icon: Twitter,
    mainColor: 'bg-slate-800',
    textColor: 'text-slate-400',
    borderColor: 'border-slate-500/30',
    glowColor: 'shadow-slate-500/50',
    enabled: true
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    handle: 'Recharge Travels',
    url: 'https://www.linkedin.com/company/rechargetravels',
    description: 'Corporate travel solutions & tourism industry insights',
    stats: '2K+ Followers',
    accent: 'from-blue-700 via-blue-600 to-sky-600',
    hoverAccent: 'group-hover:from-blue-600 group-hover:via-blue-500 group-hover:to-sky-500',
    icon: Linkedin,
    mainColor: 'bg-blue-700',
    textColor: 'text-blue-400',
    borderColor: 'border-blue-500/30',
    glowColor: 'shadow-blue-500/50',
    enabled: true
  },
  {
    id: 'pinterest',
    name: 'Pinterest',
    handle: '@rechargetravels',
    url: 'https://www.pinterest.com/rechargetravels',
    description: 'Travel inspiration boards & stunning destination pins',
    stats: '5K+ Followers',
    accent: 'from-red-600 via-red-500 to-rose-500',
    hoverAccent: 'group-hover:from-red-500 group-hover:via-red-400 group-hover:to-rose-400',
    icon: PinterestIcon,
    mainColor: 'bg-red-600',
    textColor: 'text-red-400',
    borderColor: 'border-red-500/30',
    glowColor: 'shadow-red-500/50',
    enabled: true
  },
  {
    id: 'tripadvisor',
    name: 'Tripadvisor',
    handle: 'Recharge Travels',
    url: 'https://www.tripadvisor.com/Attraction_Review-g293962-d26646716-Reviews-Recharge_Travels-Colombo_Western_Province.html',
    description: 'Verified 5-star reviews from real travelers worldwide',
    stats: '500+ Reviews',
    accent: 'from-emerald-600 via-green-500 to-lime-500',
    hoverAccent: 'group-hover:from-emerald-500 group-hover:via-green-400 group-hover:to-lime-400',
    icon: Globe,
    mainColor: 'bg-emerald-600',
    textColor: 'text-emerald-400',
    borderColor: 'border-emerald-500/30',
    glowColor: 'shadow-emerald-500/50',
    enabled: true
  },
]

// Function to merge Firebase config with default platforms
const getSocialPlatforms = (config: SocialMediaConfig | null) => {
  const defaults = getDefaultPlatforms()
  
  if (!config) return defaults
  
  return defaults.map(platform => {
    switch (platform.id) {
      case 'youtube':
        return {
          ...platform,
          handle: config.youtube?.channelName ? `@${config.youtube.channelName}` : platform.handle,
          stats: config.youtube?.subscribersCount || platform.stats,
          enabled: config.youtube?.enabled ?? true
        }
      case 'instagram':
        return {
          ...platform,
          handle: config.instagram?.username ? `@${config.instagram.username}` : platform.handle,
          url: config.instagram?.profileUrl || platform.url,
          stats: config.instagram?.followersCount ? `${config.instagram.followersCount} Followers` : platform.stats,
          enabled: config.instagram?.enabled ?? true
        }
      case 'facebook':
        return {
          ...platform,
          handle: config.facebook?.pageName || platform.handle,
          url: config.facebook?.pageUrl || platform.url,
          stats: config.facebook?.followersCount ? `${config.facebook.followersCount} Likes` : platform.stats,
          enabled: config.facebook?.enabled ?? true
        }
      case 'tiktok':
        return {
          ...platform,
          handle: config.tiktok?.username ? `@${config.tiktok.username}` : platform.handle,
          url: config.tiktok?.profileUrl || platform.url,
          stats: config.tiktok?.followersCount ? `${config.tiktok.followersCount} Followers` : platform.stats,
          enabled: config.tiktok?.enabled ?? true
        }
      case 'linkedin':
        return {
          ...platform,
          handle: config.linkedin?.companyName || platform.handle,
          url: config.linkedin?.companyUrl || platform.url,
          stats: config.linkedin?.followersCount ? `${config.linkedin.followersCount} Followers` : platform.stats,
          enabled: config.linkedin?.enabled ?? true
        }
      case 'pinterest':
        return {
          ...platform,
          handle: config.pinterest?.username ? `@${config.pinterest.username}` : platform.handle,
          url: config.pinterest?.profileUrl || platform.url,
          stats: config.pinterest?.followersCount ? `${config.pinterest.followersCount} Followers` : platform.stats,
          enabled: config.pinterest?.enabled ?? true
        }
      default:
        return platform
    }
  }).filter(p => p.enabled)
}

interface TVVideo {
  id: string
  url: string
  title: string
}

interface SocialMediaConfig {
  youtube: {
    enabled: boolean
    channelId: string
    channelName: string
    livestreamTitle: string
    livestreamDescription: string
    livestreamUrl: string
    subscribersCount: string
    featuredVideoId: string
    tvPlaylist: TVVideo[]
  }
  instagram: {
    enabled: boolean
    username: string
    profileUrl: string
    followersCount: string
    postsCount: string
  }
  facebook: {
    enabled: boolean
    pageUrl: string
    pageName: string
    followersCount: string
  }
  tiktok: {
    enabled: boolean
    username: string
    profileUrl: string
    followersCount: string
  }
  linkedin: {
    enabled: boolean
    companyUrl: string
    companyName: string
    followersCount: string
    latestPostUrl: string
  }
  pinterest: {
    enabled: boolean
    username: string
    profileUrl: string
    followersCount: string
    boardsCount: string
  }
  whatsapp: {
    enabled: boolean
    phoneNumber: string
    businessName: string
    welcomeMessage: string
  }
  telegram: {
    enabled: boolean
    channelUrl: string
    channelName: string
    membersCount: string
  }
}

export const SocialWelcomeSection = () => {
  // State for social media config from Firebase
  const [socialConfig, setSocialConfig] = useState<SocialMediaConfig | null>(null)
  
  // State for TV playlist videos from Firebase
  const [tvPlaylist, setTvPlaylist] = useState<TVVideo[]>([
    { id: '1', url: 'https://www.youtube.com/watch?v=92Np5UkerSQ', title: 'Default Video' }
  ])
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const [isMuted, setIsMuted] = useState(true) // Start muted for autoplay
  const [isPlaying, setIsPlaying] = useState(true)
  const [showUnmutePrompt, setShowUnmutePrompt] = useState(true)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const progressBarRef = useRef<HTMLDivElement>(null)

  // Helper function to extract video ID from YouTube URL
  const extractVideoId = (url: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
      /^([a-zA-Z0-9_-]{11})$/,
    ]
    for (const pattern of patterns) {
      const match = url.match(pattern)
      if (match) return match[1]
    }
    return null
  }

  // Fetch social media config from Firebase
  useEffect(() => {
    const fetchSocialConfig = async () => {
      try {
        const docRef = doc(db, 'settings', 'socialMedia')
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
          const data = docSnap.data() as SocialMediaConfig
          setSocialConfig(data)
          
          // Set TV playlist if available
          if (data.youtube?.tvPlaylist && data.youtube.tvPlaylist.length > 0) {
            // Filter out videos with empty URLs
            const validVideos = data.youtube.tvPlaylist.filter((v: TVVideo) => v.url && extractVideoId(v.url))
            if (validVideos.length > 0) {
              setTvPlaylist(validVideos)
            }
          }
        }
      } catch (error) {
        console.error('Error fetching social media config:', error)
        // Keep defaults if fetch fails
      }
    }

    fetchSocialConfig()
  }, [])

  // Handle video end - move to next video
  const handleVideoEnd = useCallback(() => {
    setCurrentVideoIndex((prevIndex) => {
      const nextIndex = (prevIndex + 1) % tvPlaylist.length
      return nextIndex
    })
  }, [tvPlaylist.length])

  // Set up message listener for YouTube iframe API
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Check if message is from YouTube
      if (event.origin !== 'https://www.youtube.com') return

      try {
        const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data
        // YouTube player state: 0 = ended
        if (data.event === 'onStateChange' && data.info === 0) {
          handleVideoEnd()
        }
        // Handle video info updates (duration, current time)
        if (data.event === 'infoDelivery') {
          if (data.info?.currentTime !== undefined && !isDragging) {
            setCurrentTime(data.info.currentTime)
          }
          if (data.info?.duration !== undefined) {
            setDuration(data.info.duration)
          }
        }
      } catch (e) {
        // Not a JSON message, ignore
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [handleVideoEnd, isDragging])

  // Poll for video progress every 500ms
  useEffect(() => {
    const interval = setInterval(() => {
      if (iframeRef.current?.contentWindow && isPlaying && !isDragging) {
        // Request current time from YouTube player
        const message = JSON.stringify({
          event: 'listening',
          id: 1,
          channel: 'widget'
        })
        iframeRef.current.contentWindow.postMessage(message, 'https://www.youtube.com')
      }
    }, 500)

    return () => clearInterval(interval)
  }, [isPlaying, isDragging])

  // Send command to YouTube iframe via postMessage
  const sendYouTubeCommand = (command: string, args?: any) => {
    if (iframeRef.current?.contentWindow) {
      const message = JSON.stringify({
        event: 'command',
        func: command,
        args: args || []
      })
      iframeRef.current.contentWindow.postMessage(message, 'https://www.youtube.com')
    }
  }

  // Control functions
  const toggleMute = () => {
    if (isMuted) {
      sendYouTubeCommand('unMute')
      setIsMuted(false)
      setShowUnmutePrompt(false)
    } else {
      sendYouTubeCommand('mute')
      setIsMuted(true)
    }
  }

  const togglePlayPause = () => {
    if (isPlaying) {
      sendYouTubeCommand('pauseVideo')
      setIsPlaying(false)
    } else {
      sendYouTubeCommand('playVideo')
      setIsPlaying(true)
    }
  }

  const skipToPrevious = () => {
    if (tvPlaylist.length > 1) {
      const newIndex = currentVideoIndex === 0 ? tvPlaylist.length - 1 : currentVideoIndex - 1
      setCurrentVideoIndex(newIndex)
    } else {
      // Rewind to start of current video
      sendYouTubeCommand('seekTo', [0, true])
    }
  }

  const skipToNext = () => {
    if (tvPlaylist.length > 1) {
      const newIndex = (currentVideoIndex + 1) % tvPlaylist.length
      setCurrentVideoIndex(newIndex)
    }
  }

  const goFullscreen = () => {
    if (iframeRef.current) {
      if (iframeRef.current.requestFullscreen) {
        iframeRef.current.requestFullscreen()
      }
    }
  }

  // Seek to specific time
  const seekTo = (time: number) => {
    sendYouTubeCommand('seekTo', [time, true])
    setCurrentTime(time)
  }

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Handle progress bar click/drag
  const handleProgressBarInteraction = (clientX: number) => {
    if (!progressBarRef.current || duration <= 0) return

    const rect = progressBarRef.current.getBoundingClientRect()
    const percent = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
    const newTime = percent * duration

    setCurrentTime(newTime)
    if (!isDragging) {
      seekTo(newTime)
    }
  }

  const handleProgressBarMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    handleProgressBarInteraction(e.clientX)
  }

  const handleProgressBarTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true)
    handleProgressBarInteraction(e.touches[0].clientX)
  }

  // Handle drag/touch move and end
  useEffect(() => {
    if (!isDragging) return

    const handleMouseMove = (e: MouseEvent) => {
      handleProgressBarInteraction(e.clientX)
    }

    const handleTouchMove = (e: TouchEvent) => {
      handleProgressBarInteraction(e.touches[0].clientX)
    }

    const handleEnd = () => {
      setIsDragging(false)
      seekTo(currentTime)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleEnd)
    window.addEventListener('touchmove', handleTouchMove)
    window.addEventListener('touchend', handleEnd)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleEnd)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleEnd)
    }
  }, [isDragging, currentTime, duration])

  // Progress percentage
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0

  // Get current video embed URL with HD quality settings
  const getVideoEmbedUrl = () => {
    const currentVideo = tvPlaylist[currentVideoIndex]
    if (!currentVideo) return ''

    const videoId = extractVideoId(currentVideo.url)
    if (!videoId) return ''

    // Build playlist string for looping through all videos
    const allVideoIds = tvPlaylist
      .map(v => extractVideoId(v.url))
      .filter(Boolean)
      .join(',')

    // Parameters for HD quality and looping:
    // - autoplay=1: Start playing automatically
    // - mute: Based on current state (starts muted for autoplay)
    // - loop=1: Loop the playlist
    // - playlist={allVideoIds}: All videos to loop through
    // - rel=0: Don't show videos from other channels
    // - modestbranding=1: Minimal YouTube branding
    // - controls=0: Hide default controls (we have custom ones)
    // - vq=hd1080: Request HD 1080p quality
    // - hd=1: Request HD playback
    // - enablejsapi=1: Enable JavaScript API for controls
    // - origin: Required for enablejsapi
    const muteParam = isMuted ? 1 : 0
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=${muteParam}&loop=1&playlist=${allVideoIds}&rel=0&modestbranding=1&controls=0&vq=hd1080&hd=1&enablejsapi=1&origin=${window.location.origin}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(239,68,68,0.15),transparent_50%),radial-gradient(circle_at_80%_80%,rgba(59,130,246,0.15),transparent_50%),radial-gradient(circle_at_40%_20%,rgba(168,85,247,0.12),transparent_40%)]" />
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(148, 163, 184, 0.4) 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      </div>

      {/* Hero Section - YouTube Broadcast */}
      <div className="relative pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-red-500/40 bg-red-500/10 px-4 py-2 mb-6 backdrop-blur-xl">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
              <span className="text-xs font-bold uppercase tracking-widest text-red-200">Live Broadcast</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight mb-6 leading-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400">
                Watch Our
              </span>
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 animate-pulse">
                Live Channel
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto mb-8 leading-relaxed">
              Experience Sri Lanka through our lens. Join <span className="text-red-400 font-semibold">50,000+</span> travelers following our journey across all platforms.
            </p>
          </div>

          {/* Massive YouTube Embed - Cinema Style */}
          <div className="relative max-w-6xl mx-auto mb-16">
            {/* Glow effect */}
            <div className="absolute -inset-4 bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 rounded-3xl blur-3xl opacity-30 animate-pulse" />

            {/* Main video container */}
            <div className="relative rounded-2xl overflow-hidden border-4 border-slate-800 bg-black shadow-2xl shadow-red-900/50">
              {/* Top bar - TV controls */}
              <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/90 to-transparent p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <span className="text-white text-sm font-semibold flex items-center gap-2">
                    <Youtube className="h-5 w-5 text-red-500" />
                    Recharge Travels TV
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-red-600 px-3 py-1 rounded-full">
                  <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  <span className="text-white text-xs font-bold uppercase">Live Now</span>
                </div>
              </div>

              {/* Video embed - Auto-playing HD Videos in Loop */}
              <div className="relative aspect-[16/9] w-full bg-black group">
                <iframe
                  ref={iframeRef}
                  key={`${currentVideoIndex}-${isMuted}`} // Force re-render when video or mute changes
                  src={getVideoEmbedUrl()}
                  title={`Recharge Travels TV - ${tvPlaylist[currentVideoIndex]?.title || 'Video'}`}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                />

                {/* Big Unmute Prompt - Shows on first load */}
                {showUnmutePrompt && isMuted && (
                  <div
                    className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm cursor-pointer z-30 transition-opacity"
                    onClick={toggleMute}
                  >
                    <div className="flex flex-col items-center gap-4 animate-pulse">
                      <div className="w-24 h-24 sm:w-32 sm:h-32 bg-red-600 rounded-full flex items-center justify-center shadow-2xl shadow-red-600/50 hover:scale-110 transition-transform">
                        <VolumeX className="w-12 h-12 sm:w-16 sm:h-16 text-white" />
                      </div>
                      <span className="text-white text-xl sm:text-2xl font-bold drop-shadow-lg">
                        Click to Enable Sound
                      </span>
                    </div>
                  </div>
                )}

                {/* Custom Control Bar - Always visible at bottom */}
                <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black via-black/80 to-transparent p-4 sm:p-6">
                  {/* Progress Bar with Time */}
                  <div className="mb-4">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-white text-xs sm:text-sm font-mono min-w-[45px]">
                        {formatTime(currentTime)}
                      </span>

                      {/* Draggable Progress Bar */}
                      <div
                        ref={progressBarRef}
                        className="flex-1 h-3 sm:h-4 bg-white/20 rounded-full cursor-pointer relative group"
                        onMouseDown={handleProgressBarMouseDown}
                        onTouchStart={handleProgressBarTouchStart}
                      >
                        {/* Progress fill */}
                        <div
                          className="absolute inset-y-0 left-0 bg-gradient-to-r from-red-600 to-red-500 rounded-full transition-all duration-100"
                          style={{ width: `${progressPercent}%` }}
                        />

                        {/* Drag handle */}
                        <div
                          className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 sm:w-6 sm:h-6 bg-white rounded-full shadow-lg border-2 border-red-500 transition-transform ${
                            isDragging ? 'scale-125' : 'group-hover:scale-110'
                          }`}
                          style={{ left: `calc(${progressPercent}% - 10px)` }}
                        />

                        {/* Hover time indicator */}
                        {isDragging && (
                          <div
                            className="absolute -top-8 bg-red-600 text-white text-xs px-2 py-1 rounded transform -translate-x-1/2"
                            style={{ left: `${progressPercent}%` }}
                          >
                            {formatTime(currentTime)}
                          </div>
                        )}
                      </div>

                      <span className="text-white text-xs sm:text-sm font-mono min-w-[45px] text-right">
                        {formatTime(duration)}
                      </span>
                    </div>
                  </div>

                  {/* Control Buttons */}
                  <div className="flex items-center justify-center gap-3 sm:gap-6 mb-4">
                    {/* Rewind / Previous */}
                    <button
                      onClick={skipToPrevious}
                      className="w-12 h-12 sm:w-16 sm:h-16 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-all hover:scale-110 border border-white/20"
                      title={tvPlaylist.length > 1 ? "Previous Video" : "Rewind"}
                    >
                      <SkipBack className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                    </button>

                    {/* Play/Pause - Biggest button */}
                    <button
                      onClick={togglePlayPause}
                      className="w-16 h-16 sm:w-20 sm:h-20 bg-red-600 hover:bg-red-500 rounded-full flex items-center justify-center transition-all hover:scale-110 shadow-lg shadow-red-600/50"
                      title={isPlaying ? "Pause" : "Play"}
                    >
                      {isPlaying ? (
                        <Pause className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                      ) : (
                        <Play className="w-8 h-8 sm:w-10 sm:h-10 text-white ml-1" />
                      )}
                    </button>

                    {/* Forward / Next */}
                    <button
                      onClick={skipToNext}
                      className="w-12 h-12 sm:w-16 sm:h-16 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-all hover:scale-110 border border-white/20"
                      title={tvPlaylist.length > 1 ? "Next Video" : "Forward"}
                    >
                      <SkipForward className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                    </button>
                  </div>

                  {/* Secondary controls row */}
                  <div className="flex items-center justify-between">
                    {/* Left side - Mute button */}
                    <button
                      onClick={toggleMute}
                      className={`flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 rounded-full font-bold transition-all hover:scale-105 ${
                        isMuted
                          ? 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/50'
                          : 'bg-green-600 hover:bg-green-500 text-white shadow-lg shadow-green-600/50'
                      }`}
                      title={isMuted ? "Unmute" : "Mute"}
                    >
                      {isMuted ? (
                        <>
                          <VolumeX className="w-5 h-5 sm:w-6 sm:h-6" />
                          <span className="text-sm sm:text-base">UNMUTE</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-5 h-5 sm:w-6 sm:h-6" />
                          <span className="text-sm sm:text-base">SOUND ON</span>
                        </>
                      )}
                    </button>

                    {/* Center - Video counter */}
                    {tvPlaylist.length > 1 && (
                      <div className="bg-black/70 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm font-medium">
                        Video {currentVideoIndex + 1} of {tvPlaylist.length}
                      </div>
                    )}

                    {/* Right side - Fullscreen */}
                    <button
                      onClick={goFullscreen}
                      className="flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full font-bold transition-all hover:scale-105 border border-white/20 text-white"
                      title="Fullscreen"
                    >
                      <Maximize2 className="w-5 h-5 sm:w-6 sm:h-6" />
                      <span className="hidden sm:inline text-sm sm:text-base">FULLSCREEN</span>
                    </button>
                  </div>
                </div>
              </div>

            </div>

            {/* Subscribe bar - Below video */}
            <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/80 backdrop-blur-xl border border-slate-700 rounded-xl p-4">
              <div>
                <h3 className="text-white font-bold text-lg mb-1">Latest Adventures from Sri Lanka</h3>
                <p className="text-slate-300 text-sm">Subscribe for weekly travel content & exclusive behind-the-scenes</p>
              </div>
              <Button
                asChild
                size="lg"
                className="bg-red-600 hover:bg-red-500 text-white font-bold rounded-full shadow-lg shadow-red-600/50 transition-all hover:scale-105"
              >
                <a href="https://www.youtube.com/@rechargetravelsltdColombo?sub_confirmation=1" target="_blank" rel="noopener noreferrer">
                  <Youtube className="mr-2 h-5 w-5" />
                  Subscribe Now
                </a>
              </Button>
            </div>

            {/* Stats bar - Dynamic from Firebase */}
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-red-400">{socialConfig?.youtube?.subscribersCount || '2.5K+'}</div>
                <div className="text-xs text-slate-400 uppercase tracking-wider mt-1">Subscribers</div>
              </div>
              <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-blue-400">150+</div>
                <div className="text-xs text-slate-400 uppercase tracking-wider mt-1">Videos</div>
              </div>
              <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-purple-400">500K+</div>
                <div className="text-xs text-slate-400 uppercase tracking-wider mt-1">Total Views</div>
              </div>
              <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-green-400">Weekly</div>
                <div className="text-xs text-slate-400 uppercase tracking-wider mt-1">New Content</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Social Media Grid - Big & Bold */}
      <div className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 mb-6 backdrop-blur-xl">
              <Globe className="h-4 w-4 text-emerald-400" />
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-200">All Platforms</span>
            </div>

            <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                Follow Us Everywhere
              </span>
            </h2>

            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              Choose your favorite platform and join the #RechargeLife community
            </p>
          </div>

          {/* Social Platforms Grid - Dynamic from Firebase */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
            {getSocialPlatforms(socialConfig).map((platform) => {
              const Icon = platform.icon
              return (
                <a
                  key={platform.id}
                  href={platform.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative overflow-hidden rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-700/70 p-6 transition-all duration-500 hover:scale-105 hover:border-slate-500 hover:shadow-2xl"
                >
                  {/* Animated gradient background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${platform.accent} opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />

                  {/* Glow effect on hover */}
                  <div className={`absolute -inset-1 bg-gradient-to-r ${platform.accent} rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500`} />

                  <div className="relative z-10">
                    {/* Icon & Live Badge */}
                    <div className="flex items-start justify-between mb-4">
                      <div className={`${platform.mainColor} p-4 rounded-2xl shadow-lg ${platform.glowColor} group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                      <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-[10px] text-slate-300 font-semibold uppercase tracking-wider">Live</span>
                      </div>
                    </div>

                    {/* Platform Info */}
                    <h3 className="text-xl font-bold text-white mb-1">{platform.name}</h3>
                    <p className={`text-sm ${platform.textColor} font-medium mb-3`}>{platform.handle}</p>
                    <p className="text-sm text-slate-400 leading-relaxed mb-4 min-h-[60px]">{platform.description}</p>

                    {/* Stats */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-slate-500" />
                        <span className="text-xs font-semibold text-slate-300">{platform.stats}</span>
                      </div>
                      <div className="text-xs text-slate-500 group-hover:text-white transition-colors flex items-center gap-1">
                        Follow
                        <Share2 className="h-3 w-3" />
                      </div>
                    </div>
                  </div>
                </a>
              )
            })}
          </div>

          {/* Call to Action Banner */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 p-1">
            <div className="bg-slate-950 rounded-3xl p-8 sm:p-12">
              <div className="text-center max-w-3xl mx-auto">
                <h3 className="text-3xl sm:text-4xl font-black text-white mb-4">
                  Join the #RechargeLife Movement
                </h3>
                <p className="text-lg text-slate-300 mb-8">
                  Get exclusive travel tips, early access to new tours, and special offers delivered straight to your feed.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    asChild
                    size="lg"
                    className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-400 hover:to-pink-400 text-white font-bold rounded-full shadow-lg transition-all hover:scale-105"
                  >
                    <a href="https://www.instagram.com/rechargetravels" target="_blank" rel="noopener noreferrer">
                      <Instagram className="mr-2 h-5 w-5" />
                      Follow on Instagram
                    </a>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="border-2 border-white text-white hover:bg-white hover:text-slate-950 font-bold rounded-full transition-all hover:scale-105"
                  >
                    <a href="https://www.youtube.com/@rechargetravelsltdColombo?sub_confirmation=1" target="_blank" rel="noopener noreferrer">
                      <Youtube className="mr-2 h-5 w-5" />
                      Subscribe on YouTube
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-600 mb-4 shadow-lg shadow-blue-600/50">
                <Bell className="h-8 w-8 text-white" />
              </div>
              <h4 className="text-xl font-bold text-white mb-2">Real-Time Updates</h4>
              <p className="text-slate-400">Get instant notifications about new tours, special offers, and travel tips</p>
            </div>

            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-600 to-rose-600 mb-4 shadow-lg shadow-pink-600/50">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <h4 className="text-xl font-bold text-white mb-2">Community Love</h4>
              <p className="text-slate-400">Join 50,000+ travelers sharing their Sri Lankan adventures</p>
            </div>

            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-violet-600 mb-4 shadow-lg shadow-purple-600/50">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <h4 className="text-xl font-bold text-white mb-2">Exclusive Content</h4>
              <p className="text-slate-400">Access behind-the-scenes footage and travel insider secrets</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
