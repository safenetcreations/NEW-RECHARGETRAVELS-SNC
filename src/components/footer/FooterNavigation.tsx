
import React from 'react'
import { motion } from 'framer-motion'

interface FooterLink {
  label: string
  href: string
}

interface FooterSection {
  title: string
  links: FooterLink[]
}

const FooterNavigation: React.FC = () => {
  const footerSections: FooterSection[] = [
    {
      title: "Tours & Experiences",
      links: [
        { label: "Wildlife Tours", href: "/tours/wildtours" },
        { label: "Cultural Heritage", href: "/tours/cultural-heritage" },
        { label: "Ramayana Trail", href: "/tours/ramayana-trail" },
        { label: "Honeymoon Packages", href: "/tours/honeymoon" },
        { label: "Safari Builder", href: "/safari-package-builder" }
      ]
    },
    {
      title: "Travel Services",
      links: [
        { label: "Airport Transfers", href: "/transport" },
        { label: "Hotel Bookings", href: "/hotels" },
        { label: "Tour Management", href: "/tour-management" },
        { label: "Activities", href: "/activities" },
        { label: "Destinations", href: "/destinations" }
      ]
    },
    {
      title: "About",
      links: [
        { label: "About Sri Lanka", href: "/about/sri-lanka" },
        { label: "Our Company", href: "/about/company" },
        { label: "#RechargeLife", href: "/about/social" },
        { label: "Wildlife Experience", href: "/tours/wildlife-experience" },
        { label: "Cultural Tours", href: "/tours/cultural-heritage" }
      ]
    },
    {
      title: "Support",
      links: [
        { label: "Contact Us", href: "/contact" },
        { label: "Login", href: "/login" },
        { label: "Sign Up", href: "/signup" },
        { label: "Help Center", href: "/support/help" },
        { label: "FAQ", href: "/support/faq" }
      ]
    }
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
      {footerSections.map((section, index) => (
        <motion.div
          key={section.title}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 * index }}
          className="space-y-4"
        >
          <h3 className="text-lg font-semibold text-white">{section.title}</h3>
          <ul className="space-y-3">
            {section.links.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="text-slate-300 hover:text-blue-400 transition-colors duration-200 text-sm hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 rounded"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </motion.div>
      ))}
    </div>
  )
}

export default FooterNavigation
