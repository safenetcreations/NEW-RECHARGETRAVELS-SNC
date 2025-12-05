import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  ChevronUp,
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  Linkedin,
  ArrowRight,
  BookOpen,
  Download,
  Sparkles
} from 'lucide-react'
import { getFeaturedDestinations, FeaturedDestination, DEFAULT_FEATURED_DESTINATIONS } from '@/services/featuredDestinationsService'
import FooterDestinationMarquee from './FooterDestinationMarquee'

const RechargeFooter: React.FC = () => {
  const [email, setEmail] = useState('')
  const baseChoices: FeaturedDestination[] = [
    {
      id: 'ella',
      name: 'Ella',
      to: '/destinations/ella',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=450&fit=crop&q=80&auto=format',
      emoji: '🏔️'
    },
    {
      id: 'mirissa',
      name: 'Mirissa',
      to: '/destinations/mirissa',
      image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800&h=450&fit=crop&q=80&auto=format',
      emoji: '🐋'
    }
  ]

  const flipDaily = (arr: FeaturedDestination[]) => {
    const today = new Date().getDate()
    return today % 2 === 0 ? arr : [...arr].reverse()
  }

  const [destinations, setDestinations] = useState<FeaturedDestination[]>(flipDaily(baseChoices))

  useEffect(() => {
    const loadDestinations = async () => {
      try {
        const data = await getFeaturedDestinations()
        if (data && data.length > 0) {
          // If CMS provides options, filter to Ella and Mirissa only
          const filtered = data.filter(
            (d) => d.name.toLowerCase().includes('ella') || d.name.toLowerCase().includes('mirissa')
          )

          if (filtered.length > 0) {
            const merged = [...filtered]

            // Ensure both Ella and Mirissa show even if only one exists in CMS
            baseChoices.forEach((fallback) => {
              const hasChoice = merged.some((d) => d.name.toLowerCase().includes(fallback.name.toLowerCase()))
              if (!hasChoice) {
                merged.push(fallback)
              }
            })

            setDestinations(flipDaily(merged.slice(0, 2)))
            return
          }
        }
      } catch (err) {
        console.error('Failed to load featured destinations, falling back to defaults', err)
      }

      // Fallback: hard-coded Ella + Mirissa with daily flip
      setDestinations(flipDaily(baseChoices))
    }
    loadDestinations()
  }, [])

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert('🌴 Aloha! You\'re subscribed!')
    setEmail('')
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const exploreLinks = [
    { to: '/destinations', label: 'Popular Destinations' },
    { to: '/tours', label: 'Tour Packages' },
    { to: '/experiences', label: 'Unique Experiences' },
    { to: '/transport/airport-transfers', label: 'Airport Transfers' },
    { to: '/transport/private-tours', label: 'Chauffeur Services' },
    { to: '/experiences/train-journeys', label: 'Rail Bookings' },
    { to: '/vehicle-rental', label: 'Vehicle Rental' },
    { to: '/blog', label: 'Blog & Travel Tips' }
  ]

  const supportLinks = [
    { to: '/about', label: 'Our Story' },
    { to: '/team', label: 'Meet the Team' },
    { to: '/sustainability', label: 'Sustainability' },
    { to: '/careers', label: 'Careers' },
    { to: '/press', label: 'Press & Media' },
    { to: '/contact', label: 'Contact Us' },
    { to: '/faq', label: 'FAQ' },
    { to: '/travel-guide', label: 'Travel Guide' },
    { to: '/list-property', label: 'List Your Property' }
  ]

  const aboutMenuLinks = [
    { to: '/about', label: 'About Us' },
    { to: '/about/sri-lanka', label: 'About Sri Lanka' },
    { to: '/vehicle-rental', label: 'Vehicle Rental' },
    { to: '/blog', label: 'Travel Blog' },
    { to: '/travel-guide', label: 'Travel Guide' },
    { to: '/contact', label: 'Contact Us' },
    { to: '/connect-with-us', label: 'Connect With Us' },
    { to: '/faq', label: 'FAQs' },
    { to: '/drivers', label: 'Find Drivers' },
    { to: '/join-with-us', label: 'Join With Us (Drivers)' },
    { to: '/vendor/register', label: 'Vendor Registration' },
    { to: '/vehicle-rental/owner', label: 'Vehicle Owner Registration' },
    { to: '/list-property', label: 'List Your Property' },
    { to: '/about/partners/b2b', label: 'B2B Agency Portal' },
    // Legal & Policies
    { to: '/legal/privacy', label: 'Privacy Policy' },
    { to: '/legal/terms', label: 'Terms of Service' },
    { to: '/legal/cookies', label: 'Cookie Policy' }
  ]

  const socialLinks = [
    { icon: Instagram, href: 'https://instagram.com/rechargetravels', label: 'Instagram' },
    { icon: Facebook, href: 'https://www.facebook.com/Rechargetours', label: 'Facebook' },
    { icon: Twitter, href: 'https://twitter.com/rechargetravels', label: 'Twitter' },
    { icon: Youtube, href: 'https://www.youtube.com/@rechargetravelsltdColombo', label: 'YouTube' },
    { icon: Linkedin, href: 'https://linkedin.com/company/rechargetravels', label: 'LinkedIn' }
  ]

  return (
    <>
      <footer className="tropical-footer relative overflow-hidden">
        {/* Wave Decoration */}
        <div className="wave-decoration" />

        {/* Decorative Palms */}
        <div className="palm-decoration palm-left">🌴</div>
        <div className="palm-decoration palm-right">🌴</div>



        {/* Destination Marquee - Live Carousel */}
        <section className="mt-10 mb-6">
          <div className="text-center mb-6">
            <h3 className="text-white/90 font-outfit text-xl font-semibold tracking-wide">
              <span className="text-orange-500 mr-2">✦</span>
              Trending Destinations
              <span className="text-orange-500 ml-2">✦</span>
            </h3>
          </div>
          <FooterDestinationMarquee />
        </section>

        {/* Main Content - Glass Card Layout */}
        <div className="main-content relative z-10">
          <div className="glass-footer-card">
            <div className="footer-split-layout">

              {/* Left Side: Brand & Newsletter */}
              <div className="footer-brand-section">
                <h2 className="text-3xl font-bold text-white mb-4 font-outfit">RechargeTravels</h2>
                <p className="text-white/80 mb-8 max-w-sm">
                  Curated tropical experiences across Sri Lanka.
                </p>

                <div className="mb-8">
                  <h3 className="text-xl font-bold text-white mb-2">
                    Subscribe to Our Newsletter
                  </h3>
                  <form className="mt-4" onSubmit={handleNewsletterSubmit}>
                    <div className="flex flex-col gap-3">
                      <input
                        type="email"
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-white/50 focus:outline-none focus:border-yellow-400 transition-all"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                      <button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 rounded-lg transition-all shadow-lg shadow-yellow-500/20">
                        Download
                      </button>
                    </div>
                  </form>
                </div>

                <div className="mb-8">
                  <h3 className="text-xl font-bold text-white mb-4">Contact Us</h3>
                  <div className="space-y-2 text-white/80">
                    <p>Colombo, Jaffna, Sri Lanka</p>
                    <p className="mt-4">+94 77 772 1999</p>
                    <p>info@rechargetravels.com</p>
                  </div>
                </div>
              </div>

              {/* Right Side: Links Grid */}
              <div className="footer-links-grid">
                {/* Column 1: Explore */}
                <div className="footer-column">
                  <h3 className="text-white font-bold mb-6 text-lg">Explore</h3>
                  <ul className="space-y-3">
                    {exploreLinks.map((link) => (
                      <li key={link.to}>
                        <Link to={link.to} className="text-white/70 hover:text-white transition-colors block">{link.label}</Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Column 1: About */}
                <div className="footer-column">
                  <h3 className="text-yellow-400 font-bold mb-6 uppercase tracking-wider text-sm">About Us</h3>
                  <ul className="space-y-2">
                    {aboutMenuLinks.map((link) => (
                      <li key={link.to}>
                        <Link to={link.to} className="text-white/70 hover:text-white hover:pl-2 transition-all duration-300 block text-sm">{link.label}</Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Column 3: Free Guide & Social */}
                <div className="footer-column">
                  <h3 className="text-white font-bold mb-4 text-lg">Free Sri Lanka Travel Guide</h3>
                  <p className="text-white/70 mb-6 text-sm">
                    Get Sri Lanka travel Guide to learn more about our websites.
                  </p>
                  <Link to="/travel-guide">
                    <button className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-2 px-6 rounded-lg transition-all mb-8">
                      Get it Now
                    </button>
                  </Link>

                  <div className="social-icons flex gap-4">
                    {socialLinks.map((social) => (
                      <a
                        key={social.label}
                        href={social.href}
                        className="text-white hover:text-yellow-400 transition-colors"
                        aria-label={social.label}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <social.icon size={24} />
                      </a>
                    ))}
                  </div>

                  {/* Legal Links */}
                  <div className="mt-6 pt-4 border-t border-white/10">
                    <h4 className="text-white/50 text-xs uppercase tracking-wider mb-3">Legal & Policies</h4>
                    <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
                      <Link to="/legal/privacy" className="text-white/60 hover:text-white transition-colors">
                        Privacy Policy
                      </Link>
                      <Link to="/legal/terms" className="text-white/60 hover:text-white transition-colors">
                        Terms of Service
                      </Link>
                      <Link to="/legal/cookies" className="text-white/60 hover:text-white transition-colors">
                        Cookie Policy
                      </Link>
                      <Link to="/legal/accessibility" className="text-white/60 hover:text-white transition-colors">
                        Accessibility
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Copyright inside the glass card */}
            <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-white/60 text-sm">
              <p>&copy; 2025 Recharge Travels & Tours Pvt Ltd. All Rights Reserved.</p>
              <div className="flex items-center gap-4 mt-4 md:mt-0">
                <div className="flex gap-3 text-xs">
                  <Link to="/legal/privacy" className="hover:text-white transition-colors">Privacy</Link>
                  <span>•</span>
                  <Link to="/legal/terms" className="hover:text-white transition-colors">Terms</Link>
                  <span>•</span>
                  <Link to="/legal/cookies" className="hover:text-white transition-colors">Cookies</Link>
                </div>
                <span className="hidden md:inline">|</span>
                <span>Crafted with 💚 by SafeNet Creations</span>
              </div>
            </div>
          </div>
        </div>









      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Architects+Daughter&display=swap');

        .tropical-footer {
          background-image: url('/footer-jungle-bg.png') !important;
          background-size: cover !important;
          background-position: center bottom !important;
          background-repeat: no-repeat !important;
          font-family: 'Plus Jakarta Sans', sans-serif !important;
          position: relative;
          padding: 60px 20px !important; /* Add padding to contain the glass card */
        }

        /* Remove old pseudo-elements that might conflict */
        .tropical-footer::before {
          display: none !important;
        }

        /* Wave Decoration */
        .wave-decoration {
          position: absolute !important;
          top: 0 !important;
          left: 0 !important;
          width: 100% !important;
          height: 60px !important;
          background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 60'%3E%3Cpath fill='%230d5c4a' d='M0,30 C360,60 720,0 1080,30 C1260,45 1380,45 1440,30 L1440,0 L0,0 Z'/%3E%3C/svg%3E") !important;
          background-size: cover !important;
        }

        /* Palm Decorations */
        .palm-decoration {
          position: absolute !important;
          font-size: 150px !important;
          opacity: 0.03 !important;
          pointer-events: none !important;
        }

        .palm-left {
          left: -20px !important;
          top: 200px !important;
        }

        .palm-right {
          right: -20px !important;
          bottom: 100px !important;
          transform: scaleX(-1) !important;
        }

        /* Newsletter Section */
        .newsletter-section {
          background: linear-gradient(135deg, #ff6b35 0%, #f9a825 50%, #ff8c42 100%) !important;
          padding: 50px 60px !important;
          position: relative !important;
          margin-top: 40px !important;
        }

        .newsletter-section::before {
          content: '☀️' !important;
          position: absolute !important;
          font-size: 100px !important;
          opacity: 0.15 !important;
          right: 5% !important;
          top: 50% !important;
          transform: translateY(-50%) !important;
        }

        @media (max-width: 768px) {
          .newsletter-section {
            padding: 40px 24px !important;
          }
        }

        .newsletter-container {
          max-width: 1200px !important;
          margin: 0 auto !important;
          display: flex !important;
          flex-wrap: wrap !important;
          align-items: center !important;
          justify-content: space-between !important;
          gap: 30px !important;
          position: relative !important;
          z-index: 2 !important;
        }

        .newsletter-text h2 {
          font-family: 'Outfit', sans-serif !important;
          color: #ffffff !important;
          font-size: 1.75rem !important;
          font-weight: 700 !important;
          display: flex !important;
          align-items: center !important;
          gap: 12px !important;
          margin-bottom: 8px !important;
          text-shadow: 1px 2px 10px rgba(0,0,0,0.2) !important;
        }

        .newsletter-emoji {
          font-size: 28px !important;
        }

        .newsletter-text p {
          color: rgba(255, 255, 255, 0.9) !important;
          font-size: 1rem !important;
          margin: 0 !important;
        }

        .newsletter-form {
          display: flex !important;
          gap: 12px !important;
          flex-wrap: wrap !important;
        }

        .newsletter-input {
          padding: 14px 20px !important;
          background-color: rgba(255, 255, 255, 0.95) !important;
          border: 3px solid transparent !important;
          border-radius: 50px !important;
          color: #0d3b3b !important;
          font-family: 'Plus Jakarta Sans', sans-serif !important;
          font-size: 0.95rem !important;
          min-width: 280px !important;
          transition: all 0.3s ease !important;
          box-shadow: 0 4px 15px rgba(0,0,0,0.15) !important;
        }

        .newsletter-input::placeholder {
          color: #888888 !important;
        }

        .newsletter-input:focus {
          outline: none !important;
          border-color: #0d5c4a !important;
          box-shadow: 0 4px 20px rgba(0,0,0,0.2) !important;
        }

        .newsletter-btn {
          padding: 14px 32px !important;
          background-color: #0d5c4a !important;
          color: #ffffff !important;
          font-family: 'Outfit', sans-serif !important;
          font-size: 1rem !important;
          font-weight: 600 !important;
          border: none !important;
          border-radius: 50px !important;
          cursor: pointer !important;
          transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55) !important;
          box-shadow: 0 4px 15px rgba(13, 92, 74, 0.4) !important;
          display: flex !important;
          align-items: center !important;
          gap: 8px !important;
        }

        .newsletter-btn:hover {
          background-color: #0a4a3d !important;
          transform: translateY(-3px) scale(1.02) !important;
          box-shadow: 0 8px 25px rgba(13, 92, 74, 0.5) !important;
        }

        .glass-footer-card {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 24px;
          padding: 60px;
          max-width: 1400px;
          margin: 0 auto;
        }

        @media (max-width: 768px) {
          .glass-footer-card {
            padding: 30px;
          }
        }

        @media (max-width: 768px) {
          .main-content {
            padding: 50px 24px !important;
          }
        }

        .footer-split-layout {
          display: grid;
          grid-template-columns: 1.2fr 2fr;
          gap: 80px;
          align-items: start;
        }

        .footer-brand-section {
          max-width: 450px;
        }

        .footer-links-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 40px;
        }

        @media (max-width: 1024px) {
          .footer-split-layout {
            grid-template-columns: 1fr;
            gap: 60px;
          }
          
          .footer-brand-section {
            max-width: 100%;
          }
        }

        @media (max-width: 768px) {
          .footer-links-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 30px;
          }
        }

        @media (max-width: 480px) {
          .footer-links-grid {
            grid-template-columns: 1fr;
          }
        }

        .footer-column h3 {
          font-family: 'Outfit', sans-serif !important;
          color: #ffffff !important;
          font-size: 1.1rem !important;
          font-weight: 700 !important;
          margin-bottom: 24px !important;
          position: relative !important;
          display: inline-block !important;
        }

        .footer-column h3::after {
          content: '' !important;
          position: absolute !important;
          bottom: -8px !important;
          left: 0 !important;
          width: 40px !important;
          height: 3px !important;
          background: linear-gradient(90deg, #ff6b35, #f9a825) !important;
          border-radius: 2px !important;
        }

        /* Brand Column */
        .brand-logo {
          display: flex !important;
          align-items: center !important;
          gap: 12px !important;
          margin-bottom: 20px !important;
        }

        .brand-logo-icon-image {
          width: 56px !important;
          height: 56px !important;
          object-fit: contain !important;
          border-radius: 12px !important;
          box-shadow: 0 10px 25px rgba(0,0,0,0.15) !important;
          background: #ffffff !important;
          padding: 4px !important;
        }

        .brand-name {
          font-family: 'Outfit', sans-serif !important;
          font-size: 1.6rem !important;
          font-weight: 800 !important;
          color: #ffffff !important;
          margin: 0 !important;
        }

        .brand-name span {
          color: #ff6b35 !important;
        }

        .brand-description {
          color: #a8d5ba !important;
          font-size: 0.95rem !important;
          line-height: 1.7 !important;
          margin-bottom: 28px !important;
        }

        /* Social Icons */
        .social-icons {
          display: flex !important;
          gap: 12px !important;
          flex-wrap: wrap !important;
        }

        .social-icon {
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          width: 44px !important;
          height: 44px !important;
          background: rgba(255, 255, 255, 0.1) !important;
          border: 2px solid #2ecc71 !important;
          border-radius: 12px !important;
          color: #a8e6cf !important;
          transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55) !important;
          text-decoration: none !important;
        }

        .social-icon:hover {
          background: linear-gradient(135deg, #ff6b35, #f9a825) !important;
          border-color: #ff6b35 !important;
          color: #ffffff !important;
          transform: translateY(-4px) rotate(5deg) !important;
          box-shadow: 0 8px 20px rgba(255, 107, 53, 0.4) !important;
        }

        /* Footer Links */
        .footer-links {
          list-style: none !important;
          padding: 0 !important;
          margin: 0 !important;
        }

        .footer-links li {
          margin-bottom: 14px !important;
        }

        .footer-link {
          color: #a8d5ba !important;
          font-size: 0.95rem !important;
          text-decoration: none !important;
          display: inline-flex !important;
          align-items: center !important;
          gap: 10px !important;
          transition: all 0.3s ease !important;
          position: relative !important;
          padding-left: 0 !important;
        }

        .footer-link::before {
          content: '→' !important;
          color: #ff6b35 !important;
          opacity: 0 !important;
          transform: translateX(-10px) !important;
          transition: all 0.3s ease !important;
        }

        .footer-link:hover {
          color: #ffffff !important;
          padding-left: 20px !important;
        }

        .footer-link:hover::before {
          opacity: 1 !important;
          transform: translateX(0) !important;
        }

        /* Destination Cards */
        .destinations-grid {
          display: flex !important;
          flex-direction: column !important;
          gap: 16px !important;
        }

        .destination-card {
          position: relative !important;
          overflow: hidden !important;
          border-radius: 16px !important;
          cursor: pointer !important;
          height: 90px !important;
          transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55) !important;
          border: 2px solid transparent !important;
          display: block !important;
          text-decoration: none !important;
        }

        .destination-card img {
          width: 100% !important;
          height: 100% !important;
          object-fit: cover !important;
          transition: all 0.4s ease !important;
        }

        .destination-card::after {
          content: '' !important;
          position: absolute !important;
          inset: 0 !important;
          background: linear-gradient(90deg, rgba(13, 59, 59, 0.8) 0%, transparent 100%) !important;
          transition: all 0.4s ease !important;
        }

        .destination-card:hover {
          transform: translateX(8px) scale(1.02) !important;
          border-color: #ff6b35 !important;
          box-shadow: 0 8px 30px rgba(255, 107, 53, 0.3) !important;
        }

        .destination-card:hover img {
          transform: scale(1.15) !important;
        }

        .destination-card:hover::after {
          background: linear-gradient(90deg, rgba(255, 107, 53, 0.7) 0%, transparent 100%) !important;
        }

        .destination-card .card-content {
          position: absolute !important;
          top: 0 !important;
          left: 0 !important;
          bottom: 0 !important;
          padding: 16px 20px !important;
          z-index: 2 !important;
          display: flex !important;
          flex-direction: column !important;
          justify-content: center !important;
        }

        .destination-card .card-content span {
          color: #ffffff !important;
          font-family: 'Outfit', sans-serif !important;
          font-size: 1rem !important;
          font-weight: 700 !important;
        }

        .destination-card .explore-text {
          opacity: 0 !important;
          transform: translateY(10px) !important;
          transition: all 0.3s ease !important;
          color: #f9a825 !important;
          font-size: 0.8rem !important;
          font-weight: 500 !important;
          display: flex !important;
          align-items: center !important;
          gap: 6px !important;
          margin-top: 4px !important;
        }

        .destination-card:hover .explore-text {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }

        /* Travel Guide CTA Section */
        .travel-guide-cta {
          background: linear-gradient(135deg, rgba(255, 107, 53, 0.15) 0%, rgba(249, 168, 37, 0.15) 50%, rgba(46, 204, 113, 0.15) 100%) !important;
          padding: 40px 60px !important;
          position: relative !important;
          overflow: hidden !important;
          border-top: 1px solid rgba(255, 107, 53, 0.3) !important;
          border-bottom: 1px solid rgba(46, 204, 113, 0.3) !important;
        }

        .travel-guide-cta::before {
          content: '📚' !important;
          position: absolute !important;
          font-size: 120px !important;
          opacity: 0.05 !important;
          right: 5% !important;
          top: 50% !important;
          transform: translateY(-50%) rotate(-10deg) !important;
        }

        @media (max-width: 768px) {
          .travel-guide-cta {
            padding: 32px 24px !important;
          }
        }

        .travel-guide-container {
          max-width: 1200px !important;
          margin: 0 auto !important;
          display: flex !important;
          align-items: center !important;
          justify-content: space-between !important;
          gap: 30px !important;
          position: relative !important;
          z-index: 2 !important;
        }

        @media (max-width: 768px) {
          .travel-guide-container {
            flex-direction: column !important;
            text-align: center !important;
          }
        }

        .travel-guide-content {
          display: flex !important;
          align-items: center !important;
          gap: 20px !important;
        }

        @media (max-width: 768px) {
          .travel-guide-content {
            flex-direction: column !important;
          }
        }

        .travel-guide-icon {
          position: relative !important;
          width: 70px !important;
          height: 70px !important;
          background: linear-gradient(135deg, #ff6b35, #f9a825) !important;
          border-radius: 20px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          color: #ffffff !important;
          box-shadow: 0 8px 25px rgba(255, 107, 53, 0.4) !important;
          animation: float-gentle 3s ease-in-out infinite !important;
        }

        .sparkle-icon {
          position: absolute !important;
          top: -5px !important;
          right: -5px !important;
          color: #f9a825 !important;
          animation: sparkle 1.5s ease-in-out infinite !important;
        }

        @keyframes float-gentle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }

        @keyframes sparkle {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.2); }
        }

        .travel-guide-text h3 {
          font-family: 'Outfit', sans-serif !important;
          color: #ffffff !important;
          font-size: 1.4rem !important;
          font-weight: 700 !important;
          margin-bottom: 6px !important;
        }

        .travel-guide-text p {
          color: #a8d5ba !important;
          font-size: 0.95rem !important;
          margin: 0 !important;
          max-width: 400px !important;
        }

        .travel-guide-btn {
          display: flex !important;
          align-items: center !important;
          gap: 10px !important;
          padding: 16px 28px !important;
          background: linear-gradient(135deg, #ff6b35 0%, #f9a825 100%) !important;
          color: #ffffff !important;
          font-family: 'Outfit', sans-serif !important;
          font-size: 1rem !important;
          font-weight: 600 !important;
          border: none !important;
          border-radius: 50px !important;
          text-decoration: none !important;
          cursor: pointer !important;
          transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55) !important;
          box-shadow: 0 6px 20px rgba(255, 107, 53, 0.4) !important;
          white-space: nowrap !important;
        }

        .travel-guide-btn:hover {
          transform: translateY(-4px) scale(1.05) !important;
          box-shadow: 0 10px 30px rgba(255, 107, 53, 0.5) !important;
        }

        .travel-guide-btn .arrow-icon {
          transition: transform 0.3s ease !important;
        }

        .travel-guide-btn:hover .arrow-icon {
          transform: translateX(5px) !important;
        }

        /* Contact Strip */
        .contact-strip {
          background: rgba(0, 0, 0, 0.2) !important;
          padding: 36px 60px !important;
          border-top: 1px solid rgba(46, 204, 113, 0.2) !important;
          border-bottom: 1px solid rgba(46, 204, 113, 0.2) !important;
        }

        @media (max-width: 768px) {
          .contact-strip {
            padding: 32px 24px !important;
          }
        }

        .contact-container {
          max-width: 1200px !important;
          margin: 0 auto !important;
        }

        .contact-container h3 {
          font-family: 'Architects Daughter', cursive !important;
          color: #f9a825 !important;
          font-size: 1.2rem !important;
          font-weight: 400 !important;
          margin-bottom: 24px !important;
          text-align: center !important;
        }

        .contact-grid {
          display: flex !important;
          flex-wrap: wrap !important;
          justify-content: center !important;
          gap: 20px !important;
        }

        @media (max-width: 768px) {
          .contact-grid {
            flex-direction: column !important;
            align-items: center !important;
            gap: 16px !important;
          }
        }

        .contact-item {
          display: flex !important;
          align-items: center !important;
          gap: 12px !important;
          color: #a8d5ba !important;
          font-size: 0.95rem !important;
          text-decoration: none !important;
          transition: all 0.3s ease !important;
          padding: 10px 20px !important;
          background: rgba(255, 255, 255, 0.05) !important;
          border-radius: 50px !important;
          border: 1px solid rgba(46, 204, 113, 0.2) !important;
        }

        .contact-item:hover {
          color: #ffffff !important;
          background: rgba(255, 107, 53, 0.2) !important;
          border-color: #ff6b35 !important;
          transform: translateY(-2px) !important;
        }

        .contact-item svg {
          color: #ff6b35 !important;
        }

        /* Bottom Bar */
        .bottom-bar {
          background-color: #071f1f !important;
          padding: 24px 60px !important;
        }

        @media (max-width: 768px) {
          .bottom-bar {
            padding: 24px !important;
          }
        }

        .bottom-container {
          max-width: 1200px !important;
          margin: 0 auto !important;
          display: flex !important;
          flex-wrap: wrap !important;
          justify-content: space-between !important;
          align-items: center !important;
          gap: 16px !important;
        }

        @media (max-width: 768px) {
          .bottom-container {
            flex-direction: column !important;
            text-align: center !important;
          }
        }

        .copyright {
          color: #5a8a7a !important;
          font-size: 0.8rem !important;
          margin: 0 !important;
        }

        .copyright span {
          color: #ff6b35 !important;
        }

        .language-currency {
          display: flex !important;
          gap: 8px !important;
          font-size: 0.8rem !important;
          flex-wrap: wrap !important;
          justify-content: center !important;
          align-items: center !important;
        }

        .language-currency a {
          color: #5a8a7a !important;
          text-decoration: none !important;
          transition: color 0.3s ease !important;
          padding: 4px 8px !important;
          border-radius: 4px !important;
        }

        .language-currency a:hover {
          color: #ffffff !important;
          background: rgba(255, 107, 53, 0.2) !important;
        }

        .language-currency span {
          color: #3a5a4a !important;
        }

        .language-currency .dot {
          margin: 0 4px !important;
        }

        .back-to-top {
          display: flex !important;
          align-items: center !important;
          gap: 8px !important;
          color: #5a8a7a !important;
          font-size: 0.8rem !important;
          text-decoration: none !important;
          transition: all 0.3s ease !important;
          cursor: pointer !important;
          background: rgba(255, 107, 53, 0.1) !important;
          border: 1px solid rgba(255, 107, 53, 0.3) !important;
          padding: 8px 16px !important;
          border-radius: 50px !important;
          font-family: 'Plus Jakarta Sans', sans-serif !important;
        }

        .back-to-top:hover {
          color: #ffffff !important;
          background: #ff6b35 !important;
          border-color: #ff6b35 !important;
          transform: translateY(-2px) !important;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }

        .back-to-top:hover svg {
          animation: float 0.8s ease infinite !important;
        }

        /* Crafted By */
        .crafted-by {
          text-align: center !important;
          padding: 28px 16px !important;
          background-color: #071f1f !important;
        }

        .crafted-by a {
          color: #a8d5ba !important;
          font-size: 1.25rem !important;
          font-weight: 500 !important;
          text-decoration: none !important;
          transition: all 0.4s ease !important;
          text-shadow: 0 0 10px rgba(46, 204, 113, 0.5), 0 0 20px rgba(46, 204, 113, 0.3), 0 0 30px rgba(46, 204, 113, 0.2) !important;
          animation: glow-pulse 2s ease-in-out infinite !important;
        }

        @keyframes glow-pulse {
          0%, 100% {
            text-shadow: 0 0 10px rgba(46, 204, 113, 0.5), 0 0 20px rgba(46, 204, 113, 0.3), 0 0 30px rgba(46, 204, 113, 0.2);
          }
          50% {
            text-shadow: 0 0 15px rgba(46, 204, 113, 0.8), 0 0 30px rgba(46, 204, 113, 0.5), 0 0 45px rgba(46, 204, 113, 0.3);
          }
        }

        .crafted-by a:hover {
          color: #ffffff !important;
          text-shadow: 0 0 20px rgba(255, 107, 53, 0.8), 0 0 40px rgba(255, 107, 53, 0.5), 0 0 60px rgba(255, 107, 53, 0.3) !important;
        }

        .crafted-by span {
          font-weight: 700 !important;
          font-size: 1.4rem !important;
          color: #2ecc71 !important;
          text-decoration: underline !important;
          text-decoration-style: wavy !important;
          text-decoration-color: rgba(46, 204, 113, 0.7) !important;
          text-shadow: 0 0 15px rgba(46, 204, 113, 0.8), 0 0 30px rgba(46, 204, 113, 0.5) !important;
        }

        .crafted-by a:hover span {
          color: #ff6b35 !important;
          text-decoration-color: #ff6b35 !important;
          text-shadow: 0 0 20px rgba(255, 107, 53, 0.8), 0 0 40px rgba(255, 107, 53, 0.5) !important;
        }
      `}</style>
    </>
  )
}

export default RechargeFooter
