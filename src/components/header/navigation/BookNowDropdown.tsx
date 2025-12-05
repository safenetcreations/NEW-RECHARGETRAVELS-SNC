import * as React from 'react'
import {
  NavigationMenuItem as BaseNavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu"
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Hotel, Users, Car, Calendar, Crown } from 'lucide-react'

interface BookNowDropdownProps {
  animatingItem: string | null
  onMenuClick: (menuItem: string) => void
  isScrolled: boolean
}

const bookNowItems = [
  {
    title: "Luxury Hotels",
    href: "/hotels",
    description: "Premium accommodations across Sri Lanka",
    icon: Hotel,
    color: "from-amber-500 to-orange-500"
  },
  {
    title: "Private Charters",
    href: "/experiences/private-charters",
    description: "Superyachts, jets, and helicopters on standby",
    icon: Crown,
    color: "from-emerald-500 to-teal-500"
  },
  {
    title: "Find Drivers",
    href: "/drivers",
    description: "Verified professional drivers and guides",
    icon: Users,
    color: "from-cyan-500 to-blue-500"
  },
  {
    title: "Vehicle Rental",
    href: "/vehicle-rental",
    description: "Premium cars, SUVs, and luxury vans",
    icon: Car,
    color: "from-violet-500 to-purple-500"
  },
  {
    title: "Concierge Booking",
    href: "/booking/concierge",
    description: "Global booking form with secure payment",
    icon: Crown,
    color: "from-emerald-600 to-teal-500"
  }
]

const BookNowDropdown = ({ animatingItem, onMenuClick, isScrolled }: BookNowDropdownProps) => {
  const isAnimating = animatingItem === 'booknow'

  return (
    <BaseNavigationMenuItem>
      <NavigationMenuTrigger
        className={cn(
          "px-5 py-2.5 text-sm font-bold transition-all duration-300 rounded-lg",
          "hover:bg-gradient-to-r hover:from-amber-500/10 hover:via-orange-500/10 hover:to-rose-500/10",
          "hover:shadow-md hover:scale-105",
          "data-[state=open]:bg-gradient-to-r data-[state=open]:from-amber-500/20 data-[state=open]:via-orange-500/20 data-[state=open]:to-rose-500/20",
          "data-[state=open]:shadow-lg",
          isAnimating ? 'animate-pulse' : ''
        )}
        onClick={() => onMenuClick('booknow')}
      >
        <Calendar className="w-4 h-4 mr-1.5" />
        Book Now
      </NavigationMenuTrigger>
      <NavigationMenuContent>
        <div className={cn(
          "w-[320px] max-w-[95vw] rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl",
          isScrolled
            ? "bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 border-2 border-amber-300/50"
            : "bg-slate-900/95 border-2 border-white/20"
        )}>
          {/* Header Gradient Bar */}
          <div className="h-2 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500"></div>

          {/* Main Content */}
          <div className="p-3">
            <h3 className={cn(
              "text-sm font-bold mb-3 flex items-center gap-2",
              isScrolled ? "text-gray-800" : "text-white"
            )}>
              <span className="w-2 h-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500"></span>
              Quick Booking
            </h3>

            {/* Booking Items */}
            <div className="space-y-2">
              {bookNowItems.map((item) => {
                const Icon = item.icon
                return (
                  <NavigationMenuLink key={item.href} asChild>
                    <Link
                      to={item.href}
                      className={cn(
                        "group block select-none rounded-xl p-3 leading-none no-underline outline-none transition-all duration-300 cursor-pointer",
                        isScrolled
                          ? "bg-white/80 backdrop-blur-sm border border-amber-200/50 hover:bg-gradient-to-r hover:from-amber-100 hover:via-orange-100 hover:to-rose-100 hover:border-amber-400"
                          : "bg-white/10 border border-white/20 hover:bg-white/20",
                        "hover:shadow-lg hover:scale-[1.02] hover:-translate-y-0.5",
                        "active:scale-[0.98]"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-md transition-transform group-hover:scale-110",
                          item.color
                        )}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <div className={cn(
                            "text-sm font-bold leading-none transition-colors",
                            isScrolled
                              ? "text-gray-900 group-hover:text-amber-700"
                              : "text-white group-hover:text-amber-300"
                          )}>
                            {item.title}
                          </div>
                          <p className={cn(
                            "text-xs leading-snug mt-1 transition-colors",
                            isScrolled
                              ? "text-gray-600 group-hover:text-gray-700"
                              : "text-gray-400 group-hover:text-gray-300"
                          )}>
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </Link>
                  </NavigationMenuLink>
                )
              })}
            </div>

            {/* View All Booking */}
            <div className="mt-3 pt-3 border-t border-amber-200/30">
              <Link
                to="/book-now"
                className={cn(
                  "flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all w-full",
                  isScrolled
                    ? "bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white hover:shadow-lg"
                    : "bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white hover:shadow-lg"
                )}
              >
                <Calendar className="w-4 h-4" />
                View All Booking Options
              </Link>
            </div>
          </div>

          {/* Footer Gradient Bar */}
          <div className="h-1 bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500"></div>
        </div>
      </NavigationMenuContent>
    </BaseNavigationMenuItem>
  )
}

export default BookNowDropdown
