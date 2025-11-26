
import { Link } from 'react-router-dom'
import { TreePine, Settings, BookOpen, Facebook, Instagram, Twitter, Phone, Mail, MapPin } from 'lucide-react'

const FooterLinks = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="grid grid-cols-1 md:grid-cols-6 gap-10">
        <div>
          <div className="flex items-center space-x-3 mb-6">
            <TreePine className="h-8 w-8 text-wild-orange wildlife-pulse" />
            <span className="text-2xl font-chakra font-bold">Recharge Travels</span>
          </div>
          <p className="text-gray-300 mb-6 font-inter leading-relaxed">
            Your trusted partner for unforgettable wildlife adventures in Sri Lanka. 
            From leopard safaris to whale watching, we make your journey extraordinary.
          </p>
          <div className="flex space-x-4">
            <Facebook className="h-6 w-6 text-gray-400 hover:text-wild-orange cursor-pointer wildlife-ripple" />
            <Instagram className="h-6 w-6 text-gray-400 hover:text-peacock-teal cursor-pointer wildlife-ripple" />
            <Twitter className="h-6 w-6 text-gray-400 hover:text-jungle-green cursor-pointer wildlife-ripple" />
          </div>
        </div>

        <div>
          <h3 className="text-xl font-chakra font-bold mb-6 text-wild-orange">Wildlife Services</h3>
          <ul className="space-y-3 text-gray-300 font-inter">
            <li><Link to="/transport" className="hover:text-wild-orange transition-colors wildlife-ripple">Safari Transfers</Link></li>
            <li><Link to="/tours" className="hover:text-peacock-teal transition-colors wildlife-ripple">Leopard Safaris</Link></li>
            <li><Link to="/tours" className="hover:text-jungle-green transition-colors wildlife-ripple">Whale Watching</Link></li>
            <li><Link to="/transport" className="hover:text-ocean-deep transition-colors wildlife-ripple">Bird Watching Tours</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-chakra font-bold mb-6 text-jungle-green">Wildlife Destinations</h3>
          <ul className="space-y-3 text-gray-300 font-inter">
            <li><Link to="/tours" className="hover:text-wild-orange transition-colors wildlife-ripple">Yala National Park</Link></li>
            <li><Link to="/tours" className="hover:text-peacock-teal transition-colors wildlife-ripple">Mirissa Whales</Link></li>
            <li><Link to="/tours" className="hover:text-jungle-green transition-colors wildlife-ripple">Udawalawe Elephants</Link></li>
            <li><Link to="/tours" className="hover:text-ocean-deep transition-colors wildlife-ripple">Sinharaja Rainforest</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-chakra font-bold mb-6 text-peacock-teal">Travel Resources</h3>
          <ul className="space-y-3 text-gray-300 font-inter">
            <li>
              <Link to="/articles" className="hover:text-wild-orange transition-colors wildlife-ripple flex items-center">
                <BookOpen className="h-4 w-4 mr-1" />
                Travel Articles & Guides
              </Link>
            </li>
            <li><Link to="/destinations" className="hover:text-peacock-teal transition-colors wildlife-ripple">Destinations</Link></li>
            <li><Link to="/activities" className="hover:text-jungle-green transition-colors wildlife-ripple">Activities</Link></li>
            <li><Link to="/tours" className="hover:text-ocean-deep transition-colors wildlife-ripple">Tour Packages</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-chakra font-bold mb-6 text-peacock-teal">Company Info</h3>
          <ul className="space-y-3 text-gray-300 font-inter">
            <li><Link to="/about" className="hover:text-wild-orange transition-colors wildlife-ripple">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-peacock-teal transition-colors wildlife-ripple">Contact Us</Link></li>
            <li>
              <Link to="/seo-tools" className="hover:text-jungle-green transition-colors wildlife-ripple flex items-center">
                <Settings className="h-4 w-4 mr-1" />
                SEO Tools
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-chakra font-bold mb-6 text-peacock-teal">Contact Wildlife Experts</h3>
          <div className="space-y-4 text-gray-300 font-inter">
            <div className="flex items-center space-x-3">
              <Phone className="h-5 w-5 text-wild-orange" />
              <span>+94 7777 21 999</span>
            </div>
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-peacock-teal" />
              <span>info@rechargetravels.com</span>
            </div>
            <div className="flex items-start space-x-3">
              <MapPin className="h-5 w-5 text-jungle-green mt-1" />
              <span>Jaffna + Colombo + Yala, Sri Lanka</span>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400">
        <p className="font-inter">&copy; 2024 Recharge Travels and Tours. All rights reserved. 🐆 🐘 🐋 🦚</p>
      </div>
    </div>
  )
}

export default FooterLinks
