import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import {
  Menu,
  MapPin,
  Phone,
  Mail,
  User,
  Users,
  LogOut,
  Crown,
  Home,
  X,
  Sparkles,
  Clock,
  Compass,
  Car,
  Star,
  MessageCircle,
  ChevronRight,
  ChevronDown,
  Info,
  Key,
  Calendar,
  Waves,
  Plane,
  Mountain,
  Palmtree,
  Camera,
  Heart,
  Utensils
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { useLanguage } from "@/contexts/LanguageContext"
import HeaderNavigationMenu from "./header/NavigationMenu"
import Logo from "./header/Logo"

type NavigationItem = {
  name: string
  href: string
  description: string
  icon: LucideIcon
  gradient: string
  iconBg: string
}

type SecondaryLink = {
  label: string
  href: string
  description: string
}

// Book Now items - displayed in their own section
const bookNowItems: NavigationItem[] = [
  {
    name: "Hotels",
    href: "/hotels",
    description: "Luxury accommodations and boutique hotel bookings.",
    icon: Home,
    gradient: "from-orange-500/20 via-orange-500/5 to-transparent",
    iconBg: "bg-orange-500/90"
  },
  {
    name: "Private Charters",
    href: "/experiences/private-charters",
    description: "Superyacht, jet, and helicopter concierge on 24/7 standby.",
    icon: Crown,
    gradient: "from-emerald-500/20 via-emerald-500/5 to-transparent",
    iconBg: "bg-emerald-500/90"
  },
  {
    name: "Book Now",
    href: "/book-now",
    description: "Instant booking form for tailored tours and transfers.",
    icon: Calendar,
    gradient: "from-teal-500/20 via-teal-500/5 to-transparent",
    iconBg: "bg-teal-500/90"
  },
  {
    name: "Whale Watching",
    href: "/experiences/whale-watching",
    description: "Mirissa & Trincomalee marine concierge led by biologists.",
    icon: Waves,
    gradient: "from-cyan-500/20 via-cyan-500/5 to-transparent",
    iconBg: "bg-cyan-500/90"
  },
  {
    name: "Find Drivers",
    href: "/drivers",
    description: "Browse verified drivers and guides by rating and language.",
    icon: Users,
    gradient: "from-cyan-500/20 via-cyan-500/5 to-transparent",
    iconBg: "bg-cyan-500/90"
  },
  {
    name: "Vehicle Rental",
    href: "/vehicle-rental",
    description: "Rent verified cars, SUVs, and vans across Sri Lanka.",
    icon: Key,
    gradient: "from-indigo-500/20 via-indigo-500/5 to-transparent",
    iconBg: "bg-indigo-500/90"
  }
]

const navigationItems: NavigationItem[] = [
  {
    name: "Flagship Home",
    href: "/",
    description: "Return to our cinematic Sri Lankan welcome showcase.",
    icon: Home,
    gradient: "from-sky-500/20 via-sky-500/5 to-transparent",
    iconBg: "bg-sky-500/90"
  },
  {
    name: "Exotic Packages",
    href: "/tours/luxury",
    description: "Ultra-luxury itineraries curated for UHNW travellers.",
    icon: Crown,
    gradient: "from-purple-500/20 via-purple-500/5 to-transparent",
    iconBg: "bg-purple-500/90"
  },
  {
    name: "Signature Tours",
    href: "/tours/cultural",
    description: "Culture, wildlife, and heritage hosted by master guides.",
    icon: Compass,
    gradient: "from-emerald-500/20 via-emerald-500/5 to-transparent",
    iconBg: "bg-emerald-500/90"
  },
  {
    name: "Destinations",
    href: "/destinations/colombo",
    description: "Coast, highlands, and hidden gems unlocked for you.",
    icon: MapPin,
    gradient: "from-amber-500/20 via-amber-500/5 to-transparent",
    iconBg: "bg-amber-500/90"
  },
  {
    name: "Elite Transport",
    href: "/transport/airport-transfers",
    description: "Helicopters, private jets, and door-to-door chauffeurs.",
    icon: Car,
    gradient: "from-blue-600/20 via-blue-600/5 to-transparent",
    iconBg: "bg-blue-600/90"
  },
  {
    name: "Experiences",
    href: "/experiences/train-journeys",
    description: "Wellness, gastronomy, and once-in-a-lifetime encounters.",
    icon: Sparkles,
    gradient: "from-rose-500/20 via-rose-500/5 to-transparent",
    iconBg: "bg-rose-500/90"
  },
  {
    name: "About Us",
    href: "/about",
    description: "Our story, mission, and why we are the best.",
    icon: Info,
    gradient: "from-teal-500/20 via-teal-500/5 to-transparent",
    iconBg: "bg-teal-500/90"
  }
]

const signatureJourneys: SecondaryLink[] = [
  {
    label: "Luxury Honeymoons & Weddings",
    href: "/romance/honeymoons-weddings",
    description: "Private island vows & presidential suites."
  },
  {
    label: "Private Wildlife Safaris",
    href: "/tours/wildtours",
    description: "Helicopter-accessed parks with master trackers."
  },
  {
    label: "Cultural Heritage Immersion",
    href: "/tours/cultural",
    description: "Royal ceremonies, temple blessings, curated artisans."
  },
  {
    label: "Tea Country Residences",
    href: "/tours/hill-country",
    description: "Heritage bungalows with butlers & sunset picnics."
  }
]

const travelServices: SecondaryLink[] = [
  {
    label: "Airport Luxury Transfers",
    href: "/transport/airport-transfers",
    description: "VIP fast-track, chauffeurs, and lounge access."
  },
  {
    label: "Private Chauffeur Guides",
    href: "/transport/private-tours",
    description: "Handpicked driver-guides & luxury vehicles."
  },
  {
    label: "Group Luxury Coaches",
    href: "/transport/group-transport",
    description: "Executive coaches with concierge hosts."
  },
  {
    label: "Luxury Boutique Hotels",
    href: "/hotels",
    description: "Heritage suites, overwater villas, private estates."
  }
]

const experienceHighlights: SecondaryLink[] = [
  {
    label: "Scenic Train Journeys",
    href: "/experiences/train-journeys",
    description: "Sky lounges, vintage carriages, panoramic dining."
  },
  {
    label: "Signature Wellness Retreats",
    href: "/experiences/wellness",
    description: "Ayurvedic masters, ocean sanctuaries, bespoke rituals."
  },
  {
    label: "Blue Whale Encounters",
    href: "/experiences/whale-watching",
    description: "Marine biologists, private yachts, sunrise champagne."
  }
]

const statHighlights = [
  { label: "UHNW journeys curated", value: "5,800+", icon: Crown },
  { label: "Concierge response", value: "<12 mins", icon: Clock },
  { label: "Guest happiness", value: "4.98 / 5", icon: Star }
] as const

const conciergeContacts = [
  {
    label: "Call Concierge",
    value: "+94 7777 21 999",
    href: "tel:+94777721999",
    icon: Phone
  },
  {
    label: "Email Studio",
    value: "info@rechargetravels.com",
    href: "mailto:info@rechargetravels.com",
    icon: Mail
  },
  {
    label: "WhatsApp 24/7",
    value: "+94 7777 21 999",
    href: "https://wa.me/94777721999",
    icon: MessageCircle
  }
] as const

const getColomboTime = (): string => {
  try {
    return new Intl.DateTimeFormat("en-LK", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
      timeZone: "Asia/Colombo"
    }).format(new Date())
  } catch {
    return "—"
  }
}

// Mobile navigation menu structure with expandable sections
const mobileNavSections = [
  {
    id: 'tours',
    title: 'Tours & Packages',
    icon: Compass,
    links: [
      { label: 'Luxury Tours', href: '/tours/luxury' },
      { label: 'Cultural Tours', href: '/tours/cultural' },
      { label: 'Wildlife Safaris', href: '/tours/wildtours' },
      { label: 'Hill Country', href: '/tours/hill-country' },
      { label: 'Beach Tours', href: '/tours/beach' },
    ]
  },
  {
    id: 'transport',
    title: 'Transport',
    icon: Car,
    links: [
      { label: 'Airport Transfers', href: '/transport/airport-transfers' },
      { label: 'Private Tours', href: '/transport/private-tours' },
      { label: 'Group Transport', href: '/transport/group-transport' },
      { label: 'Vehicle Rental', href: '/vehicle-rental' },
    ]
  },
  {
    id: 'experiences',
    title: 'Experiences',
    icon: Sparkles,
    links: [
      { label: 'Train Journeys', href: '/experiences/train-journeys' },
      { label: 'Whale Watching', href: '/experiences/whale-watching' },
      { label: 'Wellness & Ayurveda', href: '/experiences/wellness' },
      { label: 'Cooking Classes', href: '/experiences/cooking-class' },
      { label: 'Private Charters', href: '/experiences/private-charters' },
    ]
  },
  {
    id: 'destinations',
    title: 'Destinations',
    icon: MapPin,
    links: [
      { label: 'Colombo', href: '/destinations/colombo' },
      { label: 'Kandy', href: '/destinations/kandy' },
      { label: 'Galle', href: '/destinations/galle' },
      { label: 'Sigiriya', href: '/destinations/sigiriya' },
      { label: 'Ella', href: '/destinations/ella' },
      { label: 'All Destinations', href: '/destinations' },
    ]
  },
  {
    id: 'about',
    title: 'About Us',
    icon: Info,
    links: [
      { label: 'Our Story', href: '/about' },
      { label: 'Contact Us', href: '/contact' },
      { label: 'FAQ', href: '/faq' },
      { label: 'Travel Guide', href: '/travel-guide' },
    ]
  },
]

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [animatingItem, setAnimatingItem] = useState<string | null>(null)
  const [isLogoAnimating, setIsLogoAnimating] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [expandedSection, setExpandedSection] = useState<string | null>(null)
  const [localTime, setLocalTime] = useState<string>(getColomboTime)
  const location = useLocation()
  const { user, signOut } = useAuth()
  const { t } = useLanguage()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 12)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (typeof window === "undefined") return
    const intervalId = window.setInterval(() => {
      setLocalTime(getColomboTime())
    }, 60_000)
    return () => window.clearInterval(intervalId)
  }, [])

  // Lock body scroll when mobile menu is open (native app behavior)
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobileMenuOpen])

  const handleMenuClick = (menuItem: string) => {
    setAnimatingItem(menuItem)
    setTimeout(() => setAnimatingItem(null), 320)
  }

  const handleLogoAnimation = () => {
    setIsLogoAnimating(true)
    setTimeout(() => setIsLogoAnimating(false), 520)
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      setIsMobileMenuOpen(false)
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  const isActiveRoute = (href: string) => {
    if (href === "/") {
      return location.pathname === "/"
    }
    return location.pathname.startsWith(href)
  }

  const mobileTriggerClass = `md:hidden inline-flex h-11 w-11 items-center justify-center rounded-full border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${isScrolled
    ? "border-slate-200 bg-white text-slate-900 hover:bg-slate-100 focus:ring-slate-400"
    : "border-slate-600 bg-slate-800/80 text-white hover:bg-slate-700 focus:ring-slate-500 shadow-lg"
    }`

  return (
    <>
    <header
      className={`fixed inset-x-0 top-0 z-[120] transition-all duration-500 ${isScrolled
        ? "bg-white/95 backdrop-blur-2xl border-b border-white/70 shadow-[0_18px_46px_rgba(15,23,42,0.12)]"
        : "bg-transparent"
        }`}
    >
      <div className="relative">
        <div className="container mx-auto flex items-center gap-4 px-4 py-3 md:py-4">
          <div className="flex items-center gap-3 shrink-0">
            <Logo
              isAnimating={isLogoAnimating}
              onAnimationTrigger={handleLogoAnimation}
              isScrolled={isScrolled}
            />
          </div>

          <HeaderNavigationMenu
            animatingItem={animatingItem}
            onMenuClick={handleMenuClick}
            isScrolled={isScrolled}
            className="hidden lg:flex flex-1 justify-center ml-6"
          />

          <div className="ml-auto flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2">
              <a
                href="https://wa.me/94777721999"
                target="_blank"
                rel="noopener noreferrer"
                className={`hidden lg:flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold transition hover:scale-105 ${isScrolled ? "bg-emerald-600 text-white hover:bg-emerald-700" : "bg-emerald-500/90 text-white hover:bg-emerald-600"
                  }`}
              >
                <MessageCircle className="h-3.5 w-3.5" />
                +94 7777 21 999
              </a>

              <Link
                to="/book-now"
                className={`hidden lg:flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition hover:scale-105 ${isScrolled ? "bg-slate-900 text-white hover:bg-slate-800" : "bg-white/90 text-slate-900 hover:bg-white"}`}
              >
                Book Now
              </Link>

            </div>
            {isMobileMenuOpen ? (
              <button
                onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                className={mobileTriggerClass}
                aria-label="Toggle mobile menu"
                aria-expanded="true"
              >
                <X className="h-5 w-5" />
              </button>
            ) : (
              <button
                onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                className={mobileTriggerClass}
                aria-label="Toggle mobile menu"
                aria-expanded="false"
              >
                <Menu className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>

    {/* Mobile Side Drawer - Native App Style (outside header for proper z-index) */}
    <div
      className={`fixed inset-0 z-[200] md:hidden transition-opacity duration-300 ease-in-out ${
        isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
    >
        {/* Backdrop - Click to close */}
        <div
          className={`absolute inset-0 bg-slate-900/75 backdrop-blur-md transition-opacity duration-300 ${
            isMobileMenuOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />

        {/* Side Drawer - Slides from right */}
        <div
          className={`fixed inset-y-0 right-0 flex w-full max-w-[360px] flex-col overflow-hidden bg-white shadow-2xl transition-transform duration-300 ease-out ${
            isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
            {/* Simple Header with Close Button */}
            <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600">
                  <span className="text-lg font-bold text-white">R</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">Recharge Travels</p>
                  <p className="text-xs text-slate-500">Sri Lanka Tours</p>
                </div>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 transition hover:bg-slate-200"
                aria-label="Close menu"
              >
                <X className="h-5 w-5 text-slate-600" />
              </button>
            </div>

            {/* Accordion Navigation */}
            <div className="flex-1 overflow-y-auto">
              {/* Quick Actions */}
              <div className="border-b border-slate-100 px-4 py-3">
                <div className="flex gap-2">
                  <Link
                    to="/book-now"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex-1 rounded-lg bg-emerald-600 px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-emerald-700"
                  >
                    Book Now
                  </Link>
                  <a
                    href="https://wa.me/94777721999"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center rounded-lg bg-green-500 px-4 py-2.5 text-white transition hover:bg-green-600"
                  >
                    <MessageCircle className="h-5 w-5" />
                  </a>
                </div>
              </div>

              {/* Home Link */}
              <Link
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 border-b border-slate-100 px-4 py-3.5 transition hover:bg-slate-50"
              >
                <Home className="h-5 w-5 text-slate-600" />
                <span className="font-medium text-slate-800">Home</span>
              </Link>

              {/* Accordion Sections */}
              {mobileNavSections.map((section) => {
                const Icon = section.icon
                const isExpanded = expandedSection === section.id
                return (
                  <div key={section.id} className="border-b border-slate-100">
                    {/* Section Header - Click to expand */}
                    <button
                      onClick={() => setExpandedSection(isExpanded ? null : section.id)}
                      className="flex w-full items-center justify-between px-4 py-3.5 text-left transition hover:bg-slate-50"
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="h-5 w-5 text-slate-600" />
                        <span className="font-medium text-slate-800">{section.title}</span>
                      </div>
                      <ChevronDown
                        className={`h-5 w-5 text-slate-400 transition-transform duration-200 ${
                          isExpanded ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {/* Expandable Links */}
                    <div
                      className={`overflow-hidden transition-all duration-200 ease-in-out ${
                        isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                      }`}
                    >
                      <div className="bg-slate-50 py-2">
                        {section.links.map((link) => (
                          <Link
                            key={link.href}
                            to={link.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`block px-12 py-2.5 text-sm transition hover:bg-slate-100 ${
                              isActiveRoute(link.href)
                                ? 'font-semibold text-emerald-600'
                                : 'text-slate-600'
                            }`}
                          >
                            {link.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )
              })}

              {/* Direct Links */}
              <Link
                to="/hotels"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 border-b border-slate-100 px-4 py-3.5 transition hover:bg-slate-50"
              >
                <Crown className="h-5 w-5 text-slate-600" />
                <span className="font-medium text-slate-800">Hotels</span>
              </Link>

              <Link
                to="/drivers"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 border-b border-slate-100 px-4 py-3.5 transition hover:bg-slate-50"
              >
                <Users className="h-5 w-5 text-slate-600" />
                <span className="font-medium text-slate-800">Find Drivers</span>
              </Link>

              {/* Contact Section */}
              <div className="mt-4 px-4 pb-6">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Contact Us
                </p>
                <div className="space-y-2">
                  <a
                    href="tel:+94777721999"
                    className="flex items-center gap-3 rounded-lg bg-slate-100 px-4 py-3 transition hover:bg-slate-200"
                  >
                    <Phone className="h-4 w-4 text-slate-600" />
                    <span className="text-sm font-medium text-slate-700">+94 7777 21 999</span>
                  </a>
                  <a
                    href="mailto:info@rechargetravels.com"
                    className="flex items-center gap-3 rounded-lg bg-slate-100 px-4 py-3 transition hover:bg-slate-200"
                  >
                    <Mail className="h-4 w-4 text-slate-600" />
                    <span className="text-sm font-medium text-slate-700">info@rechargetravels.com</span>
                  </a>
                </div>
              </div>
            </div>
        </div>
      </div>
    </>
  )
}

export default Header
