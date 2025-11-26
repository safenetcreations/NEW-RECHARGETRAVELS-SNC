
import React from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin } from 'lucide-react'

const FooterCompanyInfo: React.FC = () => {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Recharge Travels
        </h2>
        <p className="text-slate-300 mt-4 leading-relaxed">
          Discover Sri Lanka's natural wonders with authentic wildlife adventures, 
          cultural heritage tours, and unforgettable experiences that recharge your spirit.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="space-y-3"
      >
        <div className="flex items-center gap-3 text-slate-300 hover:text-blue-400 transition-colors">
          <Mail size={18} />
          <a href="mailto:info@rechargetravels.com" className="hover:underline">
            info@rechargetravels.com
          </a>
        </div>
        <div className="flex items-center gap-3 text-slate-300 hover:text-blue-400 transition-colors">
          <Phone size={18} />
          <a href="tel:+94777721999" className="hover:underline">
            +94 7777 21 999
          </a>
        </div>
        <div className="flex items-center gap-3 text-slate-300">
          <MapPin size={18} />
          <span>Jaffna • Colombo • Yala, Sri Lanka</span>
        </div>
      </motion.div>
    </div>
  )
}

export default FooterCompanyInfo
