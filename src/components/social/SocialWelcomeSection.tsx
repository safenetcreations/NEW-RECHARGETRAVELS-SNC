import React, { useState, useEffect } from 'react'
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
  Play,
  Users,
  MapPin,
  Heart,
  Share2,
  Bell,
  TrendingUp
} from 'lucide-react'

const socialPlatforms = [
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
    glowColor: 'shadow-red-500/50'
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
    glowColor: 'shadow-pink-500/50'
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
    glowColor: 'shadow-blue-500/50'
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
    glowColor: 'shadow-cyan-500/50'
  },
  {
    id: 'twitter',
    name: 'X / Twitter',
    handle: '@rechargetravels',
    url: 'https://twitter.com/rechargetravels',
    description: 'Real-time updates, travel tips & bite-sized inspiration',
    stats: '3.2K+ Followers',
    accent: 'from-slate-700 via-slate-600 to-slate-500',
    hoverAccent: 'group-hover:from-slate-600 group-hover:via-slate-500 group-hover:to-slate-400',
    icon: Twitter,
    mainColor: 'bg-slate-800',
    textColor: 'text-slate-400',
    borderColor: 'border-slate-500/30',
    glowColor: 'shadow-slate-500/50'
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    handle: 'Recharge Travels',
    url: 'https://www.linkedin.com/company/rechargetravels',
    description: 'Corporate travel solutions & tourism industry insights',
    stats: '1.5K+ Connections',
    accent: 'from-blue-700 via-blue-600 to-sky-600',
    hoverAccent: 'group-hover:from-blue-600 group-hover:via-blue-500 group-hover:to-sky-500',
    icon: Linkedin,
    mainColor: 'bg-blue-700',
    textColor: 'text-blue-400',
    borderColor: 'border-blue-500/30',
    glowColor: 'shadow-blue-500/50'
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
    glowColor: 'shadow-emerald-500/50'
  },
]

export const SocialWelcomeSection = () => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [featuredVideoId, setFeaturedVideoId] = useState('92Np5UkerSQ')
  const [channelId, setChannelId] = useState('UCWxBfcDkOVklKDRW0ljpV0w')

  useEffect(() => {
    // Fetch social media config from Firebase
    const fetchSocialConfig = async () => {
      try {
        const docRef = doc(db, 'settings', 'socialMedia')
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
          const data = docSnap.data()
          if (data.youtube?.featuredVideoId) {
            setFeaturedVideoId(data.youtube.featuredVideoId)
          }
          if (data.youtube?.channelId) {
            setChannelId(data.youtube.channelId)
          }
        }
      } catch (error) {
        console.error('Error fetching social config:', error)
        // Use defaults if Firebase fails
      }
    }

    fetchSocialConfig()
  }, [])

  // Generate the video embed URL
  // If featuredVideoId is set, show that video
  // Otherwise, show the latest 10 uploads playlist with autoplay and loop
  const getVideoEmbedUrl = () => {
    if (featuredVideoId && featuredVideoId !== '') {
      // Show specific featured video with autoplay, loop, and playlist of latest uploads
      const uploadsPlaylistId = channelId.replace('UC', 'UU') // Convert channel ID to uploads playlist ID
      return `https://www.youtube.com/embed/${featuredVideoId}?autoplay=1&mute=1&loop=1&playlist=${uploadsPlaylistId}&rel=0&modestbranding=1`
    } else {
      // Show latest 10 uploads playlist with autoplay and loop
      const uploadsPlaylistId = channelId.replace('UC', 'UU')
      return `https://www.youtube.com/embed/videoseries?list=${uploadsPlaylistId}&autoplay=1&mute=1&loop=1&rel=0&modestbranding=1`
    }
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

              {/* Video embed - Auto-playing Latest Videos */}
              <div className="relative aspect-[16/9] w-full bg-black">
                <iframe
                  src={getVideoEmbedUrl()}
                  title="Recharge Travels - Latest Videos"
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              </div>

              {/* Bottom bar - Channel info */}
              <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/95 to-transparent p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-white font-bold text-lg mb-1">Latest Adventures from Sri Lanka</h3>
                    <p className="text-slate-300 text-sm">Subscribe for weekly travel content & exclusive behind-the-scenes</p>
                  </div>
                  <div className="flex gap-3">
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
                </div>
              </div>
            </div>

            {/* Stats bar */}
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-red-400">2.5K+</div>
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

          {/* Social Platforms Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
            {socialPlatforms.map((platform) => {
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
