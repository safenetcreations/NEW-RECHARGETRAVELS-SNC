
import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Phone, 
  Mail, 
  MapPin, 
  Facebook, 
  Instagram, 
  Youtube,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  TreePine
} from 'lucide-react'

type ExpandedSections = {
  about: boolean
  contact: boolean
  social: boolean
}

interface FooterMobileProps {
  isDarkMode: boolean
  expandedSections: ExpandedSections
  toggleSection: (section: keyof ExpandedSections) => void
  email: string
  setEmail: (email: string) => void
  isNewsletterSubmitted: boolean
  handleNewsletterSubmit: (e: React.FormEvent) => void
}

const FooterMobile = ({ 
  isDarkMode, 
  expandedSections, 
  toggleSection, 
  email, 
  setEmail, 
  isNewsletterSubmitted, 
  handleNewsletterSubmit 
}: FooterMobileProps) => {
  return (
    <div className="md:hidden space-y-4 mb-8">
      {/* About Section - Mobile */}
      <Card className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <CardContent className="p-4">
          <button 
            onClick={() => toggleSection('about')}
            className="flex items-center justify-between w-full text-left"
          >
            <div className="flex items-center space-x-3">
              <img 
                src="/logo-v2.png" 
                alt="Recharge Travels logo - Redefine your journey, refresh your soul" 
                className="h-8 w-auto"
              />
              <span className="font-chakra font-bold text-wild-orange">About Recharge Travels</span>
            </div>
            {expandedSections.about ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          {expandedSections.about && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Your trusted partner for authentic Sri Lankan wildlife adventures. Experience unforgettable leopard safaris, whale watching, and cultural journeys in paradise.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Contact Section - Mobile */}
      <Card className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <CardContent className="p-4">
          <button 
            onClick={() => toggleSection('contact')}
            className="flex items-center justify-between w-full text-left"
          >
            <span className="font-chakra font-bold text-peacock-teal">Contact & Location</span>
            {expandedSections.contact ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          {expandedSections.contact && (
            <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-peacock-teal flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold">Call Us</p>
                  <p className="text-sm">+94 7777 21 999</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-jungle-green flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold">Email Us</p>
                  <p className="text-sm">info@rechargetravels.com</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-wild-orange flex-shrink-0 mt-1" />
                <div>
                  <p className="text-sm font-semibold">Our Locations</p>
                  <p className="text-sm">Jaffna • Colombo • Yala, Sri Lanka</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Social & Newsletter - Mobile */}
      <Card className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <CardContent className="p-4 space-y-6">
          <div>
            <h4 className="font-chakra font-bold text-jungle-green mb-4">Follow & Subscribe</h4>
            <div className="grid grid-cols-2 gap-2 mb-4">
              <a href="#" className="flex items-center space-x-2 p-3 rounded-lg hover:bg-wild-orange/20 transition-colors">
                <Facebook className="h-4 w-4 text-blue-500" />
                <span className="text-xs">Facebook</span>
              </a>
              <a href="#" className="flex items-center space-x-2 p-3 rounded-lg hover:bg-wild-orange/20 transition-colors">
                <Instagram className="h-4 w-4 text-pink-500" />
                <span className="text-xs">Instagram</span>
              </a>
              <a href="#" className="flex items-center space-x-2 p-3 rounded-lg hover:bg-wild-orange/20 transition-colors">
                <Youtube className="h-4 w-4 text-red-500" />
                <span className="text-xs">YouTube</span>
              </a>
              <a href="#" className="flex items-center space-x-2 p-3 rounded-lg hover:bg-wild-orange/20 transition-colors">
                <MessageCircle className="h-4 w-4 text-green-500" />
                <span className="text-xs">WhatsApp</span>
              </a>
            </div>
          </div>
          
          {!isNewsletterSubmitted ? (
            <div className="space-y-4">
              <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Get exclusive wildlife updates & deals
              </p>
              <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className={`w-full px-4 py-3 text-sm rounded-lg border ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  } focus:ring-2 focus:ring-wild-orange focus:border-transparent`}
                  required
                />
                <Button 
                  type="submit"
                  className="w-full bg-wild-orange hover:bg-wild-orange/90 text-white font-semibold py-3"
                >
                  Subscribe for Updates
                </Button>
              </form>
            </div>
          ) : (
            <div className="text-center py-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <TreePine className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-sm text-green-400 font-semibold">Welcome to the pack! 🐆</p>
              <p className="text-xs text-gray-400 mt-1">You'll hear from us soon with exciting updates.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default FooterMobile
