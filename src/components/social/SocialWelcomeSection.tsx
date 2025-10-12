
import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Link } from 'react-router-dom'
import { 
  UserPlus,
  LogIn,
  Share,
  Heart,
  Star
} from 'lucide-react'

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

export const SocialWelcomeSection = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-orange-400 text-white py-16 px-5 text-center shadow-lg">
        <h1 className="text-5xl font-bold mb-4">#RechargeLife Social Media Hub</h1>
        <p className="text-xl opacity-90 mb-8">Connect with us across all platforms and share your travel experiences</p>
        <div className="flex justify-center gap-4">
          <Button asChild className="bg-white text-blue-600 hover:bg-gray-100">
            <Link to="/signup">
              <UserPlus className="mr-2 h-5 w-5" />
              Sign Up Free
            </Link>
          </Button>
          <Button asChild variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
            <Link to="/login">
              <LogIn className="mr-2 h-5 w-5" />
              Login
            </Link>
          </Button>
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
