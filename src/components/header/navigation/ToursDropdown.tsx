
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
import { toursByCategory } from './menuData'
import { Compass, Landmark, TreePine, Camera, Sparkles } from 'lucide-react'

interface ToursDropdownProps {
  animatingItem: string | null
  onMenuClick: (menuItem: string) => void
  isScrolled: boolean;
}

const categoryIcons: Record<string, React.ReactNode> = {
  adventure: <Compass className="w-4 h-4" />,
  cultural: <Landmark className="w-4 h-4" />,
  nature: <TreePine className="w-4 h-4" />,
  specialty: <Camera className="w-4 h-4" />,
  luxury: <Sparkles className="w-4 h-4" />
}

const categoryColors: Record<string, string> = {
  adventure: "from-orange-500 to-red-500",
  cultural: "from-purple-500 to-indigo-500",
  nature: "from-green-500 to-emerald-500",
  specialty: "from-blue-500 to-cyan-500",
  luxury: "from-amber-500 to-yellow-500"
}

const ToursDropdown = ({ animatingItem, onMenuClick, isScrolled }: ToursDropdownProps) => {
  const [activeCategory, setActiveCategory] = useState<string>('adventure')
  const navigate = useNavigate()
  const isAnimating = animatingItem === 'tours'

  const handleItemClick = (href: string) => {
    if (href.includes('#')) {
      const [path, hash] = href.split('#')
      const currentPath = window.location.pathname
      
      if (currentPath === path) {
        const element = document.getElementById(hash)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      } else {
        navigate(href)
      }
    } else {
      navigate(href)
    }
  }

  const categories = Object.entries(toursByCategory)

  return (
    <BaseNavigationMenuItem>
      <NavigationMenuTrigger 
        className={cn(
          "px-5 py-2.5 text-sm font-bold transition-all duration-300 rounded-lg",
          "hover:bg-gradient-to-r hover:from-purple-500/10 hover:via-pink-500/10 hover:to-orange-500/10",
          "hover:shadow-md hover:scale-105",
          "data-[state=open]:bg-gradient-to-r data-[state=open]:from-purple-500/20 data-[state=open]:via-pink-500/20 data-[state=open]:to-orange-500/20",
          "data-[state=open]:shadow-lg",
          isAnimating ? 'animate-pulse' : ''
        )}
      >
        Tours
      </NavigationMenuTrigger>
      <NavigationMenuContent>
        <div className={cn(
          "w-[680px] max-w-[95vw] rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl",
          isScrolled
            ? "bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 border-2 border-purple-300/50"
            : "bg-slate-900/90 border-2 border-white/20"
        )}>
          {/* Header */}
          <div className="h-2 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500"></div>
          
          <div className="flex">
            {/* Category Tabs - Left Side */}
            <div className={cn(
              "w-[180px] p-3 border-r",
              isScrolled ? "border-purple-200/50 bg-white/50" : "border-white/10 bg-white/5"
            )}>
              <div className="space-y-1">
                {categories.map(([key, category]) => (
                  <button
                    key={key}
                    onClick={() => setActiveCategory(key)}
                    className={cn(
                      "w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-left text-sm font-medium transition-all duration-200",
                      activeCategory === key
                        ? cn(
                            "bg-gradient-to-r text-white shadow-md",
                            categoryColors[key]
                          )
                        : isScrolled
                          ? "text-gray-700 hover:bg-purple-100/50"
                          : "text-gray-300 hover:bg-white/10"
                    )}
                  >
                    {categoryIcons[key]}
                    <span className="truncate">{category.title.replace(' & ', ' / ')}</span>
                  </button>
                ))}
              </div>
              
              {/* View All Link */}
              <div className="mt-4 pt-3 border-t border-purple-200/30">
                <Link
                  to="/tours"
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                    isScrolled
                      ? "text-purple-700 hover:bg-purple-100"
                      : "text-purple-400 hover:bg-white/10"
                  )}
                >
                  <Compass className="w-4 h-4" />
                  View All Tours
                </Link>
              </div>
            </div>

            {/* Tours Grid - Right Side */}
            <div className="flex-1 p-4 max-h-[380px] overflow-y-auto">
              <h3 className={cn(
                "text-sm font-bold mb-3 flex items-center gap-2",
                isScrolled ? "text-gray-800" : "text-white"
              )}>
                <span className={cn(
                  "w-2 h-2 rounded-full bg-gradient-to-r",
                  categoryColors[activeCategory]
                )}></span>
                {toursByCategory[activeCategory as keyof typeof toursByCategory].title}
              </h3>
              
              <div className="grid grid-cols-2 gap-2">
                {toursByCategory[activeCategory as keyof typeof toursByCategory].tours.map((item) => (
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
                          ? "bg-white/80 backdrop-blur-sm border border-purple-200/50 hover:bg-gradient-to-r hover:from-purple-100 hover:via-pink-100 hover:to-orange-100 hover:border-purple-400"
                          : "bg-white/10 border border-white/20 hover:bg-white/20",
                        "hover:shadow-lg hover:scale-[1.02] hover:-translate-y-0.5",
                        "active:scale-[0.98]"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          "w-1.5 h-1.5 rounded-full bg-gradient-to-r group-hover:scale-150 transition-transform",
                          categoryColors[activeCategory]
                        )}></div>
                        <div className={cn(
                          "text-sm font-bold leading-none transition-colors",
                          isScrolled
                            ? "text-gray-900 group-hover:text-purple-800"
                            : "text-white group-hover:text-purple-300"
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
          <div className="h-1 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500"></div>
        </div>
      </NavigationMenuContent>
    </BaseNavigationMenuItem>
  )
}

export default ToursDropdown
