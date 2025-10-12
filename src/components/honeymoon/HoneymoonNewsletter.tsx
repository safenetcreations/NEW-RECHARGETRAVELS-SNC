
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Heart, Mail, Gift } from 'lucide-react'

const HoneymoonNewsletter = () => {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle subscription logic here
    setSubscribed(true)
    setEmail('')
  }

  return (
    <section className="py-20 bg-gradient-to-br from-rose-900 via-rose-800 to-amber-800 text-white">
      <div className="max-w-4xl mx-auto px-6 md:px-10 text-center">
        <div className="mb-8">
          <Heart className="w-12 h-12 mx-auto mb-6 text-rose-300 animate-pulse" />
          <h2 className="font-serif text-3xl md:text-4xl tracking-tight mb-4">
            Stay Connected to Paradise
          </h2>
          <p className="text-xl text-rose-100 leading-relaxed max-w-2xl mx-auto">
            Be the first to discover exclusive honeymoon packages, romantic experiences, 
            and special offers for couples planning their dream Sri Lankan getaway.
          </p>
        </div>

        {!subscribed ? (
          <form onSubmit={handleSubscribe} className="max-w-md mx-auto">
            <div className="flex gap-4 mb-6">
              <div className="flex-1 relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-12 py-4 rounded-full bg-white/10 border-white/20 text-white placeholder:text-rose-200 focus:bg-white/20"
                  required
                />
              </div>
              <Button 
                type="submit"
                className="px-8 py-4 rounded-full bg-gradient-to-r from-amber-400 to-rose-400 hover:from-amber-500 hover:to-rose-500 text-white font-semibold shadow-lg"
              >
                Subscribe
              </Button>
            </div>
            
            <div className="flex items-center justify-center space-x-4 text-sm text-rose-200">
              <div className="flex items-center">
                <Gift className="w-4 h-4 mr-2" />
                <span>Exclusive offers</span>
              </div>
              <div className="w-1 h-1 bg-rose-300 rounded-full"></div>
              <span>No spam, ever</span>
              <div className="w-1 h-1 bg-rose-300 rounded-full"></div>
              <span>Unsubscribe anytime</span>
            </div>
          </form>
        ) : (
          <div className="max-w-md mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <Heart className="w-16 h-16 mx-auto mb-4 text-rose-300" />
              <h3 className="text-2xl font-bold mb-4">Welcome to Paradise!</h3>
              <p className="text-rose-100 leading-relaxed">
                Thank you for subscribing! You'll be the first to know about our most 
                romantic packages and exclusive honeymoon experiences in Sri Lanka.
              </p>
              <div className="mt-6 pt-6 border-t border-white/20 text-sm text-rose-200">
                Check your inbox for a special welcome offer! 💌
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default HoneymoonNewsletter
