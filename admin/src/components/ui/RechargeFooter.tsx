
import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import YaluChatbot from '@/components/YaluChatbot'
import { 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Instagram, 
  Twitter, 
  Youtube,
  TreePine,
  ArrowUp,
  Send,
  Star
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const RechargeFooter: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const footerLinks = [
    {
      title: "Explore",
      links: [
        { name: "Wildlife Tours", href: "/tours/wildtours" },
        { name: "Cultural Heritage", href: "/tours/cultural-heritage" },
        { name: "Hotels & Resorts", href: "/hotels" },
        { name: "Destinations", href: "/destinations" }
      ]
    },
    {
      title: "Services", 
      links: [
        { name: "Airport Transfers", href: "/transport" },
        { name: "Safari Packages", href: "/safari-package-builder" },
        { name: "Honeymoon Tours", href: "/honeymoon" },
        { name: "Activities", href: "/activities" }
      ]
    },
    {
      title: "About",
      links: [
        { name: "About Sri Lanka", href: "/about/sri-lanka" },
        { name: "Our Company", href: "/about" },
        { name: "#RechargeLife", href: "/about/social" },
        { name: "Contact Us", href: "/contact" }
      ]
    }
  ]

  const socialLinks = [
    { icon: Facebook, href: "https://facebook.com/rechargetravels", color: "hover:text-blue-400" },
    { icon: Instagram, href: "https://instagram.com/rechargetravels", color: "hover:text-pink-400" },
    { icon: Twitter, href: "https://twitter.com/rechargetravels", color: "hover:text-blue-300" },
    { icon: Youtube, href: "https://youtube.com/rechargetravels", color: "hover:text-red-400" }
  ]

  return (
    <>
      <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-green-500/20 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        <div className="relative z-10">
          {/* Main Footer Content */}
          <div className="container mx-auto px-4 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-6 gap-8">
              
              {/* Brand Section */}
              <motion.div 
                className="lg:col-span-2"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                    <TreePine className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Recharge Travels
                  </h2>
                </div>
                
                <p className="text-slate-300 text-sm leading-relaxed mb-6">
                  Discover Sri Lanka's wonders with authentic wildlife adventures and cultural heritage tours.
                </p>

                {/* Contact Info */}
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-3 text-slate-300 hover:text-blue-400 transition-colors">
                    <Phone size={16} />
                    <a href="tel:+94777721999">+94 7777 21 999</a>
                  </div>
                  <div className="flex items-center gap-3 text-slate-300 hover:text-blue-400 transition-colors">
                    <Mail size={16} />
                    <a href="mailto:info@rechargetravels.com">info@rechargetravels.com</a>
                  </div>
                  <div className="flex items-center gap-3 text-slate-300">
                    <MapPin size={16} />
                    <span>Jaffna • Colombo • Yala</span>
                  </div>
                </div>
              </motion.div>

              {/* Navigation Links */}
              <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
                {footerLinks.map((section, index) => (
                  <motion.div
                    key={section.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.1 * index }}
                  >
                    <h3 className="text-lg font-semibold text-white mb-4">{section.title}</h3>
                    <ul className="space-y-2">
                      {section.links.map((link) => (
                        <li key={link.name}>
                          <Link
                            to={link.href}
                            className="text-slate-300 hover:text-blue-400 transition-colors duration-200 text-sm block hover:translate-x-1 transform transition-transform"
                          >
                            {link.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>

              {/* Newsletter */}
              <motion.div 
                className="lg:col-span-1"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <h3 className="text-lg font-semibold text-white mb-4">Stay Updated</h3>
                <p className="text-slate-300 text-sm mb-4">
                  Get travel deals & wildlife updates
                </p>
                
                <div className="flex gap-2 mb-4">
                  <Input
                    type="email"
                    placeholder="Your email"
                    className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-400 text-sm"
                  />
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-blue-600 px-3"
                  >
                    <Send size={14} />
                  </Button>
                </div>

                {/* Social Links */}
                <div className="flex gap-3">
                  {socialLinks.map((social, index) => (
                    <motion.a
                      key={index}
                      href={social.href}
                      className={`w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center text-slate-400 ${social.color} transition-all duration-200 hover:scale-110`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <social.icon size={16} />
                    </motion.a>
                  ))}
                </div>
              </motion.div>

            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-slate-700">
            <div className="container mx-auto px-4 py-6">
              <motion.div
                className="flex flex-col md:flex-row justify-between items-center gap-4"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <div className="flex items-center gap-4 text-sm text-slate-400">
                  <span>© 2024 Recharge Travels. All rights reserved.</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span>Licensed & Certified 🐆🐘🐋🦚</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 text-sm">
                  <Link to="/legal/privacy" className="text-slate-400 hover:text-blue-400 transition-colors">Privacy</Link>
                  <Link to="/legal/terms" className="text-slate-400 hover:text-blue-400 transition-colors">Terms</Link>
                  <motion.button
                    onClick={scrollToTop}
                    className="w-8 h-8 bg-slate-800 hover:bg-blue-600 rounded-full flex items-center justify-center transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ArrowUp size={16} />
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </footer>
      
      {/* AI Chatbot - Available in footer section */}
      <YaluChatbot />
    </>
  )
}

export default RechargeFooter
