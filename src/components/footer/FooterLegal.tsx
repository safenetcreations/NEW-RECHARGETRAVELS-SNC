
import React from 'react'
import { motion } from 'framer-motion'

interface FooterLink {
  label: string
  href: string
}

const FooterLegal: React.FC = () => {
  const legalLinks: FooterLink[] = [
    { label: "Privacy Policy", href: "/legal/privacy" },
    { label: "Terms of Service", href: "/legal/terms" },
    { label: "Cookie Policy", href: "/legal/cookies" },
    { label: "Accessibility", href: "/legal/accessibility" }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="flex flex-col md:flex-row items-center gap-4 text-sm text-slate-300"
    >
      <div className="flex flex-wrap justify-center gap-4">
        {legalLinks.map((link, index) => (
          <React.Fragment key={link.label}>
            <a
              href={link.href}
              className="hover:text-blue-400 transition-colors hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 rounded"
            >
              {link.label}
            </a>
            {index < legalLinks.length - 1 && (
              <span className="text-slate-600">•</span>
            )}
          </React.Fragment>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <span className="text-slate-600">•</span>
        <span>© 2024 Recharge Travels and Tours. All rights reserved. 🐆 🐘 🐋 🦚</span>
      </div>
    </motion.div>
  )
}

export default FooterLegal
