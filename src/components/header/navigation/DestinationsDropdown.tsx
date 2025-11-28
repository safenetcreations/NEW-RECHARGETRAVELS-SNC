
import * as React from 'react'
import { useState } from 'react'
import {
  NavigationMenuItem as BaseNavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu"
import { Link, useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { destinationsByRegion } from './menuData'
import { MapPin, Mountain, Compass, Sun, Waves } from 'lucide-react'

interface DestinationsDropdownProps {
  animatingItem: string | null
  onMenuClick: (menuItem: string) => void
  isScrolled: boolean;
}

const regionIcons: Record<string, React.ReactNode> = {
  northern: <Compass className="w-4 h-4" />,
  central: <Mountain className="w-4 h-4" />,
  southern: <Waves className="w-4 h-4" />,
  eastern: <Sun className="w-4 h-4" />,
  western: <MapPin className="w-4 h-4" />
}

const regionColors: Record<string, string> = {
  northern: "from-purple-500 to-indigo-500",
  central: "from-emerald-500 to-teal-500",
  southern: "from-blue-500 to-cyan-500",
  eastern: "from-orange-500 to-amber-500",
  western: "from-rose-500 to-pink-500"
}

const DestinationsDropdown = ({ animatingItem, onMenuClick, isScrolled }: DestinationsDropdownProps) => {
  const [activeRegion, setActiveRegion] = useState<string>('northern')
  const navigate = useNavigate()
  const isAnimating = animatingItem === 'destinations'

  const handleItemClick = (href: string) => {
    navigate(href)
  }

  const regions = Object.entries(destinationsByRegion)

  return (
    <BaseNavigationMenuItem>
      <NavigationMenuTrigger 
        className={cn(
          "px-5 py-2.5 text-sm font-bold transition-all duration-300 rounded-lg",
          "hover:bg-gradient-to-r hover:from-amber-500/10 hover:via-orange-500/10 hover:to-emerald-500/10",
          "hover:shadow-md hover:scale-105",
          "data-[state=open]:bg-gradient-to-r data-[state=open]:from-amber-500/20 data-[state=open]:via-orange-500/20 data-[state=open]:to-emerald-500/20",
          "data-[state=open]:shadow-lg",
          isAnimating ? 'animate-walk' : ''
        )}
      >
        Destinations
      </NavigationMenuTrigger>
      <NavigationMenuContent>
        <div className={cn(
          "w-[700px] max-w-[95vw] rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl",
          isScrolled
            ? "bg-gradient-to-br from-amber-50 via-orange-50 to-emerald-50 border-2 border-amber-300/50"
            : "bg-slate-900/90 border-2 border-white/20"
        )}>
          {/* Header */}
          <div className="h-2 bg-gradient-to-r from-amber-500 via-orange-500 to-emerald-500"></div>
          
          <div className="flex">
            {/* Region Tabs - Left Side */}
            <div className={cn(
              "w-[180px] p-3 border-r",
              isScrolled ? "border-amber-200/50 bg-white/50" : "border-white/10 bg-white/5"
            )}>
              <div className="space-y-1">
                {regions.map(([key, region]) => (
                  <button
                    key={key}
                    onClick={() => setActiveRegion(key)}
                    className={cn(
                      "w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-left text-sm font-medium transition-all duration-200",
                      activeRegion === key
                        ? cn(
                            "bg-gradient-to-r text-white shadow-md",
                            regionColors[key]
                          )
                        : isScrolled
                          ? "text-gray-700 hover:bg-amber-100/50"
                          : "text-gray-300 hover:bg-white/10"
                    )}
                  >
                    {regionIcons[key]}
                    <span className="truncate">{region.title.replace(' Sri Lanka', '')}</span>
                  </button>
                ))}
              </div>
              
              {/* View All Link */}
              <div className="mt-4 pt-3 border-t border-amber-200/30">
                <Link
                  to="/destinations"
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                    isScrolled
                      ? "text-amber-700 hover:bg-amber-100"
                      : "text-amber-400 hover:bg-white/10"
                  )}
                >
                  <MapPin className="w-4 h-4" />
                  View All Destinations
                </Link>
              </div>
            </div>

            {/* Destinations Grid - Right Side */}
            <div className="flex-1 p-4 max-h-[400px] overflow-y-auto">
              <h3 className={cn(
                "text-sm font-bold mb-3 flex items-center gap-2",
                isScrolled ? "text-gray-800" : "text-white"
              )}>
                <span className={cn(
                  "w-2 h-2 rounded-full bg-gradient-to-r",
                  regionColors[activeRegion]
                )}></span>
                {destinationsByRegion[activeRegion as keyof typeof destinationsByRegion].title}
              </h3>
              
              <div className="grid grid-cols-2 gap-2">
                {destinationsByRegion[activeRegion as keyof typeof destinationsByRegion].destinations.map((item) => (
                  <NavigationMenuLink key={item.href} asChild>
                    <Link
                      to={item.href}
                      onClick={(e) => {
                        e.preventDefault()
                        handleItemClick(item.href)
                      }}
                      className={cn(
                        "group block select-none rounded-xl p-3 leading-none no-underline outline-none transition-all duration-300 cursor-pointer",
                        isScrolled
                          ? "bg-white/80 backdrop-blur-sm border border-amber-200/50 hover:bg-gradient-to-r hover:from-amber-100 hover:via-orange-100 hover:to-emerald-100 hover:border-amber-400"
                          : "bg-white/10 border border-white/20 hover:bg-white/20",
                        "hover:shadow-lg hover:scale-[1.02] hover:-translate-y-0.5",
                        "active:scale-[0.98]"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          "w-1.5 h-1.5 rounded-full bg-gradient-to-r group-hover:scale-150 transition-transform",
                          regionColors[activeRegion]
                        )}></div>
                        <div className={cn(
                          "text-sm font-bold leading-none transition-colors",
                          isScrolled
                            ? "text-gray-900 group-hover:text-amber-800"
                            : "text-white group-hover:text-amber-300"
                        )}>
                          {item.title}
                        </div>
                      </div>
                      <p className={cn(
                        "line-clamp-1 text-xs leading-snug pl-3.5 mt-1 transition-colors",
                        isScrolled
                          ? "text-gray-600 group-hover:text-gray-800"
                          : "text-gray-400 group-hover:text-white"
                      )}>
                        {item.description}
                      </p>
                    </Link>
                  </NavigationMenuLink>
                ))}
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <div className="h-1 bg-gradient-to-r from-emerald-500 via-orange-500 to-amber-500"></div>
        </div>
      </NavigationMenuContent>
    </BaseNavigationMenuItem>
  )
}

export default DestinationsDropdown
