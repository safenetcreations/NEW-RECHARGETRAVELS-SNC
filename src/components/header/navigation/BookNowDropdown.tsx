import * as React from 'react'
import {
  NavigationMenuItem as BaseNavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu"
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Hotel, Users, Car, Calendar } from 'lucide-react'

interface BookNowDropdownProps {
  animatingItem: string | null
  onMenuClick: (menuItem: string) => void
  isScrolled: boolean
}

const bookNowItems = [
  {
    title: "Hotels",
    href: "/hotels",
    description: "Luxury accommodations and boutique hotel bookings across Sri Lanka",
    icon: Hotel,
    color: "from-orange-500 to-amber-500"
  },
  {
    title: "Find Drivers",
    href: "/drivers",
    description: "Browse verified drivers and guides by rating, language, and experience",
    icon: Users,
    color: "from-cyan-500 to-blue-500"
  },
  {
    title: "Vehicle Rental",
    href: "/vehicle-rental",
    description: "Rent verified cars, SUVs, and vans with or without drivers",
    icon: Car,
    color: "from-indigo-500 to-purple-500"
  }
]

const BookNowDropdown = ({ animatingItem, onMenuClick, isScrolled }: BookNowDropdownProps) => {
  const isAnimating = animatingItem === 'booknow'

  return (
    <BaseNavigationMenuItem>
      <NavigationMenuTrigger
        className={cn(
          "px-5 py-2.5 text-sm font-bold transition-all duration-300 rounded-lg",
          "hover:bg-gradient-to-r hover:from-orange-500/10 hover:via-amber-500/10 hover:to-yellow-500/10",
          "hover:shadow-md hover:scale-105",
          "data-[state=open]:bg-gradient-to-r data-[state=open]:from-orange-500/20 data-[state=open]:via-amber-500/20 data-[state=open]:to-yellow-500/20",
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
          "w-[420px] max-w-[95vw] rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl",
          isScrolled
            ? "bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 border-2 border-orange-300/50"
            : "bg-slate-900/90 border-2 border-white/20"
        )}>
          <div className="h-2 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500"></div>

          <div className="p-4">
            <h3 className={cn(
              "text-sm font-bold mb-4 flex items-center gap-2",
              isScrolled ? "text-gray-800" : "text-white"
            )}>
              <span className="w-2 h-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-500"></span>
              Quick Booking
            </h3>

            <div className="space-y-3">
              {bookNowItems.map((item) => {
                const Icon = item.icon
                return (
                  <NavigationMenuLink key={item.href} asChild>
                    <Link
                      to={item.href}
                      className={cn(
                        "group flex items-start gap-4 select-none rounded-xl p-4 leading-none no-underline outline-none transition-all duration-300 cursor-pointer",
                        isScrolled
                          ? "bg-white/80 backdrop-blur-sm border border-orange-200/50 hover:bg-gradient-to-r hover:from-orange-100 hover:via-amber-100 hover:to-yellow-100 hover:border-orange-400"
                          : "bg-white/10 border border-white/20 hover:bg-white/20",
                        "hover:shadow-lg hover:scale-[1.02] hover:-translate-y-0.5",
                        "active:scale-[0.98]"
                      )}
                    >
                      <div className={cn(
                        "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-lg transition-transform group-hover:scale-110",
                        item.color
                      )}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <div className={cn(
                          "text-base font-bold leading-none transition-colors mb-1",
                          isScrolled
                            ? "text-gray-900 group-hover:text-orange-700"
                            : "text-white group-hover:text-orange-300"
                        )}>
                          {item.title}
                        </div>
                        <p className={cn(
                          "line-clamp-2 text-sm leading-snug transition-colors",
                          isScrolled
                            ? "text-gray-600 group-hover:text-gray-800"
                            : "text-gray-400 group-hover:text-white"
                        )}>
                          {item.description}
                        </p>
                      </div>
                    </Link>
                  </NavigationMenuLink>
                )
              })}
            </div>
          </div>

          <div className="h-1 bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500"></div>
        </div>
      </NavigationMenuContent>
    </BaseNavigationMenuItem>
  )
}

export default BookNowDropdown
