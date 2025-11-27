import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Link } from 'react-router-dom'
import {
  UserPlus,
  LogIn,
  Share,
  Heart,
  Star,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
  Globe,
  Music2
} from 'lucide-react'

const platformIcons = {
  facebook: 'f',
  instagram: '\ud83d\udcf7',
  twitter: '\ud835\dd16',
  youtube: '\u25b6',
  tripadvisor: '\ud83e\udd89',
  google: 'G',
  tiktok: '\u266a',
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

const socialTiles = [
  {
    id: 'youtube',
    name: 'YouTube',
    handle: '@rechargetravelsltdColombo',
    url: 'https://www.youtube.com/@rechargetravelsltdColombo',
    description: 'Live tours, travel films and behind-the-scenes from Sri Lanka.',
    accent: 'from-red-500/60 via-rose-500/40 to-red-400/40',
    icon: Youtube,
  },
  {
    id: 'instagram',
    name: 'Instagram',
    handle: '@rechargetravels',
    url: 'https://instagram.com/rechargetravels',
    description: 'Daily reels, stories and photo dumps from the island.',
    accent: 'from-fuchsia-500/60 via-pink-500/40 to-amber-400/40',
    icon: Instagram,
  },
  {
    id: 'facebook',
    name: 'Facebook',
    handle: 'Recharge Tours',
    url: 'https://www.facebook.com/Rechargetours',
    description: 'Reviews, announcements and guest stories to help you plan.',
    accent: 'from-sky-500/60 via-blue-500/40 to-sky-400/40',
    icon: Facebook,
  },
  {
    id: 'twitter',
    name: 'Twitter / X',
    handle: '@rechargetravels',
    url: 'https://twitter.com/rechargetravels',
    description: 'Quick updates, travel alerts and bite-sized trip ideas.',
    accent: 'from-sky-400/60 via-slate-500/40 to-sky-300/40',
    icon: Twitter,
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    handle: 'Recharge Travels',
    url: 'https://linkedin.com/company/rechargetravels',
    description: 'Partnerships, corporate travel and tourism industry news.',
    accent: 'from-sky-400/60 via-emerald-500/40 to-sky-300/40',
    icon: Linkedin,
  },
  {
    id: 'tripadvisor',
    name: 'Tripadvisor',
    handle: 'Recharge Travels',
    url: 'https://www.tripadvisor.com/rechargetravels',
    description: 'Verified guest reviews and real traveler photos.',
    accent: 'from-emerald-500/60 via-lime-500/40 to-emerald-400/40',
    icon: Globe,
  },
]

export const SocialWelcomeSection = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      {/* Retro TV Hero */}
      <div className="relative overflow-hidden border-b border-slate-800 pt-20 md:pt-24 lg:pt-28">
        <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-700/30 via-slate-900 to-emerald-600/20" />
        <div className="absolute inset-0 opacity-[0.15] mix-blend-soft-light bg-[radial-gradient(circle_at_0_0,#22c55e,transparent_60%),radial-gradient(circle_at_100%_0,#38bdf8,transparent_55%),radial-gradient(circle_at_0_100%,#f97316,transparent_55%),radial-gradient(circle_at_100%_100%,#a855f7,transparent_60%)]" />
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(148, 163, 184, 0.35) 1px, transparent 0)', backgroundSize: '3px 3px' }} />

        <div className="relative max-w-6xl mx-auto px-4 py-20 lg:py-28 flex flex-col lg:flex-row items-center gap-12">
          {/* Copy */}
          <div className="w-full lg:w-1/2 space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-black/40 px-4 py-1 text-xs font-semibold tracking-[0.2em] uppercase text-emerald-200 shadow-[0_0_0_1px_rgba(15,23,42,0.6)]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live from Sri Lanka
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
              Connect with <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-300 via-sky-300 to-amber-300">Recharge Travels</span>
            </h1>
            <p className="text-sm sm:text-base text-slate-200/80 max-w-xl">
              One retro TV wall for all our stories. Watch the latest from our YouTube channel and follow Recharge across every major social platform.
            </p>

            {/* Primary CTAs */}
            <div className="flex flex-wrap gap-3 mt-4">
              <Button asChild size="lg" className="rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold shadow-lg shadow-emerald-500/30">
                <a href="https://www.youtube.com/@rechargetravelsltdColombo" target="_blank" rel="noopener noreferrer">
                  <Youtube className="mr-2 h-5 w-5" />
                  Watch on YouTube
                </a>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full border-slate-600 bg-slate-900/60 text-slate-100 hover:bg-slate-800">
                <Link to="/signup">
                  <UserPlus className="mr-2 h-5 w-5" />
                  Join #RechargeLife
                </Link>
              </Button>
            </div>

          </div>

          {/* Retro TV frame */}
          <div className="w-full lg:w-1/2 flex justify-center">
            <div className="relative w-full max-w-lg lg:max-w-xl aspect-video rounded-[2.25rem] border-4 border-slate-900 bg-slate-900/80 shadow-[0_40px_160px_rgba(0,0,0,0.9)] overflow-hidden">
              {/* Bezel */}
              <div className="absolute inset-0 rounded-[1.9rem] bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900" />
              {/* Screen glow */}
              <div className="absolute inset-3 rounded-[1.5rem] bg-slate-900 shadow-[0_0_80px_rgba(56,189,248,0.65)]" />
              {/* Scanline overlay */}
              <div className="absolute inset-3 rounded-[1.5rem] mix-blend-soft-light opacity-40" style={{ backgroundImage: 'repeating-linear-gradient(to bottom, rgba(148, 163, 184, 0.5), rgba(148, 163, 184, 0.5) 1px, transparent 1px, transparent 3px)' }} />
              {/* TV legs */}
              <div className="absolute -bottom-6 left-8 w-8 h-10 bg-slate-900/90 rounded-b-3xl shadow-[0_12px_30px_rgba(15,23,42,0.9)]" />
              <div className="absolute -bottom-6 right-8 w-8 h-10 bg-slate-900/90 rounded-b-3xl shadow-[0_12px_30px_rgba(15,23,42,0.9)]" />

              {/* Controls */}
              <div className="absolute right-4 top-5 flex flex-col items-center gap-3 text-[10px] text-slate-400">
                <div className="w-8 h-8 rounded-full border border-slate-500 bg-slate-900 flex items-center justify-center shadow-inner">
                  <Music2 className="h-3.5 w-3.5 text-emerald-300" />
                </div>
                <div className="w-8 h-1 rounded-full bg-slate-700" />
                <div className="w-8 h-1 rounded-full bg-slate-700" />
                <span className="tracking-[0.18em] uppercase">Live</span>
              </div>

              {/* Screen content */}
              <div className="absolute inset-4 rounded-[1.3rem] overflow-hidden border border-slate-800/60 bg-black">
                <iframe
                  src="https://www.youtube.com/embed?listType=user_uploads&list=rechargetravels"
                  title="Recharge Travels YouTube"
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              {/* Badge */}
              <div className="absolute left-6 top-5 flex items-center gap-2 text-[11px] font-semibold tracking-[0.15em] uppercase text-slate-200">
                <span className="inline-flex h-5 items-center rounded-full bg-black/70 px-3 border border-emerald-400/60">
                  <Globe className="h-3 w-3 mr-1 text-emerald-300" />
                  Social TV
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Social tiles grid directly under hero */}
      <div className="max-w-6xl mx-auto px-5 py-12">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-50">
              All recharge channels in one place
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-300 max-w-2xl">
              Pick your favourite platform to follow Reloaded Sri Lanka stories, live updates and new tour launches.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 self-start sm:self-auto rounded-full border border-emerald-400/40 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Social wall is live
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {socialTiles.map((tile) => {
            const Icon = tile.icon
            return (
              <a
                key={tile.id}
                href={tile.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative overflow-hidden rounded-2xl border border-slate-700/70 bg-slate-900/80 p-5 shadow-[0_18px_60px_rgba(15,23,42,0.7)] transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_26px_90px_rgba(15,23,42,0.9)]"
              >
                <div className={`absolute inset-0 opacity-40 bg-gradient-to-br ${tile.accent}`} />
                <div className="relative flex flex-col gap-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="inline-flex items-center gap-1.5 rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Live channel
                      </div>
                      <h3 className="mt-3 text-lg font-bold text-slate-50 flex items-center gap-2">
                        <span>{tile.name}</span>
                      </h3>
                      {tile.handle && (
                        <p className="text-xs text-slate-300/90 mt-0.5">{tile.handle}</p>
                      )}
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900/80 border border-slate-600/70 shadow-inner">
                      <Icon className="h-5 w-5 text-emerald-200" />
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm leading-relaxed text-slate-200/90">
                    {tile.description}
                  </p>

                  <div className="mt-2 flex items-center justify-between text-[11px] text-slate-300">
                    <span className="inline-flex items-center gap-1 rounded-full bg-black/40 px-2 py-1">
                      <span className="h-1 w-1 rounded-full bg-emerald-400" />
                      Click to open channel
                    </span>
                    <span className="group-hover:text-emerald-200 transition-colors">View profile →</span>
                  </div>
                </div>
              </a>
            )
          })}
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto py-16 px-5">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Why Join Our Social Community?</h2>
          <p className="text-lg text-gray-600">Connect your social media accounts and showcase your travel experiences</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Share className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle>Share Your Adventures</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Connect your social media accounts and automatically sync your travel posts and experiences.</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Heart className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle>Engage with Community</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Like, comment, and share experiences with fellow travelers in the #RechargeLife community.</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                <Star className="h-8 w-8 text-orange-600" />
              </div>
              <CardTitle>Get Discovered</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Showcase your travel content and get featured in our community highlights and travel guides.</p>
            </CardContent>
          </Card>
        </div>

        {/* Supported Platforms */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Supported Platforms</h3>
          <div className="flex flex-wrap justify-center gap-4">
            {Object.entries(platformIcons).map(([platform, icon]) => (
              <div key={platform} className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl ${getPlatformColorClass(platform)}`}>
                {icon}
              </div>
            ))}
          </div>
          <p className="text-gray-600 mt-4">Connect with Facebook, Instagram, Twitter/X, YouTube, TikTok, LinkedIn, Pinterest, and more!</p>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-orange-400 to-blue-600 text-white py-16 text-center">
        <h3 className="text-3xl font-bold mb-4">Ready to Join #RechargeLife?</h3>
        <p className="text-xl mb-8">Start sharing your travel experiences today</p>
        <div className="flex justify-center gap-4">
          <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
            <Link to="/signup">
              Get Started Free
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
            <Link to="/login">
              I Have an Account
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
