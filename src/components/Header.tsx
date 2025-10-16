import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import {
  Menu,
  MapPin,
  Phone,
  Mail,
  User,
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
  ChevronRight
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { useLanguage } from "@/contexts/LanguageContext"
import HeaderNavigationMenu from "./header/NavigationMenu"
import Logo from "./header/Logo"
import LanguageSwitcher from "./LanguageSwitcher"

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
    href: "/tours/wellness",
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
    value: "+94 11 234 5678",
    href: "tel:+94112345678",
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
    value: "+94 77 000 0000",
    href: "https://wa.me/94770000000",
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

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [animatingItem, setAnimatingItem] = useState<string | null>(null)
  const [isLogoAnimating, setIsLogoAnimating] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
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

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[120] transition-all duration-500 ${
        isScrolled
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
            <div className="hidden lg:flex flex-col">
              <span
                className={`text-[0.65rem] font-bold uppercase tracking-[0.22em] ${
                  isScrolled ? "text-slate-700" : "text-white/90"
                }`}
              >
                Recharge Travels
              </span>
              <div
                className={`flex items-center gap-2 text-[0.6rem] ${
                  isScrolled ? "text-slate-500" : "text-white/70"
                }`}
              >
                <Star className="h-2.5 w-2.5 text-amber-400" />
                Sri Lanka's Premier Travel Agency
              </div>
            </div>
          </div>

          <HeaderNavigationMenu
            animatingItem={animatingItem}
            onMenuClick={handleMenuClick}
            isScrolled={isScrolled}
            className="hidden lg:flex flex-1 justify-center ml-6"
          />

          <div className="ml-auto flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2">
              <div
                className={`hidden lg:flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.28em] transition ${
                  isScrolled ? "bg-slate-100 text-slate-700" : "bg-white/10 text-white"
                }`}
              >
                <Clock className="h-3.5 w-3.5" />
                Colombo • {localTime}
              </div>
              <div
                className={`hidden lg:flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                  isScrolled ? "bg-slate-900 text-white" : "bg-white/10 text-white"
                }`}
              >
                <Phone className="h-3.5 w-3.5" />
                +94 11 234 5678
              </div>
              <div
                className={`hidden xl:flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium transition ${
                  isScrolled ? "bg-slate-100 text-slate-600" : "bg-white/10 text-white"
                }`}
              >
                <Mail className="h-3.5 w-3.5" />
                info@rechargetravels.com
              </div>
              <div
                className={`hidden md:flex items-center gap-2 rounded-full px-2 py-1 transition ${
                  isScrolled ? "bg-slate-100 text-slate-700" : "bg-white/10 text-white"
                }`}
              >
                <LanguageSwitcher />
              </div>
              <Link
                to="/tours/luxury"
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold uppercase tracking-[0.14em] transition-all ${
                  isScrolled
                    ? "bg-slate-900 text-white hover:bg-slate-800 shadow-[0_10px_28px_rgba(15,23,42,0.18)]"
                    : "border border-white/30 bg-white/15 text-white hover:bg-white/25"
                }`}
              >
                <Crown className="h-4 w-4" />
                Elite Concierge
              </Link>
              <Link
                to="/hotels"
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                  isScrolled
                    ? "border border-slate-200 bg-white text-slate-800 hover:bg-slate-50"
                    : "border border-white/25 bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                {t("nav.hotels")}
              </Link>
              <Link
                to="/book-now"
                className="flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 via-amber-500 to-rose-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:from-orange-600 hover:via-amber-600 hover:to-rose-600 hover:shadow-2xl"
              >
                {t("common.book_now")}
              </Link>
              {user ? (
                <>
                  <Link
                    to="/bookings"
                    className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                      isScrolled
                        ? "border border-slate-200 bg-slate-50 text-slate-800 hover:bg-slate-100"
                        : "border border-white/30 bg-white/12 text-white hover:bg-white/20"
                    }`}
                  >
                    <User className="h-4 w-4" />
                    Manage Trips
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                      isScrolled
                        ? "border border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
                        : "border border-white/30 bg-white/10 text-white hover:bg-white/20"
                    }`}
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className={`hidden lg:flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                      isScrolled
                        ? "border border-slate-200 bg-white text-slate-800 hover:bg-slate-50"
                        : "border border-white/30 bg-white/10 text-white hover:bg-white/20"
                    }`}
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className={`hidden lg:flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold uppercase tracking-[0.12em] transition-all ${
                      isScrolled
                        ? "bg-slate-900 text-white hover:bg-slate-800 shadow-[0_10px_28px_rgba(15,23,42,0.18)]"
                        : "bg-white/20 text-white hover:bg-white/30 border border-white/30"
                    }`}
                  >
                    Join VIP Club
                  </Link>
                </>
              )}
            </div>
            <button
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              className={`md:hidden inline-flex h-11 w-11 items-center justify-center rounded-full border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                isScrolled
                  ? "border-slate-200 bg-white text-slate-900 hover:bg-slate-100 focus:ring-slate-400"
                  : "border-white/30 bg-white/10 text-white hover:bg-white/20 focus:ring-white/70"
              }`}
              aria-label="Toggle mobile menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[200] bg-slate-900/75 backdrop-blur-md md:hidden">
          <div className="fixed inset-y-0 right-0 flex w-full max-w-[360px] flex-col overflow-hidden bg-white shadow-2xl">
            <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-teal-700 p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.4em] text-white/50">
                    Recharge Travels
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold">Ultra Luxury Concierge</h2>
                  <div className="mt-3 flex items-center gap-2 text-sm text-white/70">
                    <Clock className="h-4 w-4" />
                    <span>Colombo • {localTime} GMT+5:30</span>
                  </div>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="rounded-full bg-white/10 p-2 transition hover:bg-white/20"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5 text-white" />
                </button>
              </div>
              <div className="mt-6 grid grid-cols-3 gap-3 text-center">
                {statHighlights.map(({ label, value, icon: Icon }) => (
                  <div key={label} className="rounded-2xl bg-white/10 px-2 py-3 backdrop-blur-md">
                    <Icon className="mx-auto h-5 w-5 text-white/80" />
                    <p className="mt-1 text-sm font-semibold">{value}</p>
                    <p className="text-[0.6rem] uppercase tracking-[0.3em] text-white/60">
                      {label.split(" ")[0]}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex-1 space-y-8 overflow-y-auto px-6 py-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                  Explore
                </p>
                <div className="mt-4 space-y-4">
                  {navigationItems.map((item) => {
                    const Icon = item.icon
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`relative block overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-[0_18px_36px_rgba(15,23,42,0.08)] transition-transform hover:-translate-y-1 ${
                          isActiveRoute(item.href) ? "ring-2 ring-slate-900/20" : ""
                        }`}
                      >
                        <div
                          className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${item.gradient}`}
                        />
                        <div className="relative flex items-start gap-4 p-4">
                          <div
                            className={`flex h-12 w-12 items-center justify-center rounded-2xl ${item.iconBg} text-white shadow-lg`}
                          >
                            <Icon className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-base font-semibold text-slate-900">{item.name}</p>
                            <p className="mt-1 text-sm text-slate-600">{item.description}</p>
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                  Signature Journeys
                </p>
                <div className="mt-3 space-y-3">
                  {signatureJourneys.map((journey) => (
                    <Link
                      key={journey.label}
                      to={journey.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-start justify-between rounded-xl border border-slate-200 px-4 py-3 text-left transition hover:bg-slate-50"
                    >
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{journey.label}</p>
                        <p className="text-xs text-slate-500">{journey.description}</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-slate-400" />
                    </Link>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                  Travel Services
                </p>
                <div className="mt-3 space-y-3">
                  {travelServices.map((service) => (
                    <Link
                      key={service.label}
                      to={service.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-start justify-between rounded-xl border border-slate-200 px-4 py-3 text-left transition hover:bg-slate-50"
                    >
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{service.label}</p>
                        <p className="text-xs text-slate-500">{service.description}</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-slate-400" />
                    </Link>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                  Immersive Moments
                </p>
                <div className="mt-3 space-y-3">
                  {experienceHighlights.map((experience) => (
                    <Link
                      key={experience.label}
                      to={experience.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-start justify-between rounded-xl border border-slate-200 px-4 py-3 text-left transition hover:bg-slate-50"
                    >
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{experience.label}</p>
                        <p className="text-xs text-slate-500">{experience.description}</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-slate-400" />
                    </Link>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                  Concierge Desk
                </p>
                <div className="mt-3 space-y-3">
                  {conciergeContacts.map((contact) => {
                    const Icon = contact.icon
                    const isWhatsApp = contact.label.includes("WhatsApp")
                    const sharedProps =
                      contact.href.startsWith("http") ? { target: "_blank", rel: "noreferrer" as const } : {}
                    return (
                      <a
                        key={contact.label}
                        href={contact.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 transition ${
                          isWhatsApp ? "bg-emerald-50 hover:bg-emerald-100" : "hover:bg-slate-50"
                        }`}
                        {...sharedProps}
                      >
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                            isWhatsApp ? "bg-emerald-500 text-white" : "bg-slate-900 text-white"
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-800">{contact.label}</p>
                          <p className="text-xs text-slate-500">{contact.value}</p>
                        </div>
                      </a>
                    )
                  })}
                </div>
              </div>

              <div className="pb-8">
                {user ? (
                  <div className="space-y-3">
                    <Link
                      to="/bookings"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                    >
                      <User className="h-4 w-4" />
                      Manage Bookings
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="flex w-full items-center justify-center gap-2 rounded-full border border-slate-900 px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-900 hover:text-white"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <Link
                      to="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-center rounded-full border border-slate-900 px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-900 hover:text-white"
                    >
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-rose-500 px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:from-orange-600 hover:to-rose-600"
                    >
                      Join VIP Club
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export default Header
