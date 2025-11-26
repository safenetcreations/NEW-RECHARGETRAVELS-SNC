
import React from 'react'
import { motion } from 'framer-motion'
import { Facebook, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react'

interface SocialLink {
  icon: React.ReactNode
  href: string
  label: string
}

const FooterSocial: React.FC = () => {
  const socialLinks: SocialLink[] = [
    { icon: <Facebook size={20} />, href: "https://facebook.com/rechargetravels", label: "Facebook" },
    { icon: <Twitter size={20} />, href: "https://twitter.com/rechargetravels", label: "Twitter" },
    { icon: <Instagram size={20} />, href: "https://instagram.com/rechargetravels", label: "Instagram" },
    { icon: <Linkedin size={20} />, href: "https://linkedin.com/company/rechargetravels", label: "LinkedIn" },
    { icon: <Youtube size={20} />, href: "https://youtube.com/rechargetravels", label: "YouTube" }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="flex items-center gap-4"
    >
      <span className="text-slate-300 text-sm font-medium">Follow us:</span>
      <div className="flex gap-3">
        {socialLinks.map((social) => (
          <a
            key={social.label}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={social.label}
            className="w-10 h-10 bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900"
          >
            {social.icon}
          </a>
        ))}
      </div>
    </motion.div>
  )
}

export default FooterSocial
