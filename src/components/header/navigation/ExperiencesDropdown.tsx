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
import { experiencesByCategory } from './menuData'
import { Compass, TreePine, Landmark, Sparkles, LucideIcon } from 'lucide-react'

interface ExperiencesDropdownProps {
  animatingItem: string | null
  onMenuClick: (menuItem: string) => void
  isScrolled: boolean;
}

const categoryIconComponents: Record<string, LucideIcon> = {
  adventure: Compass,
  wildlife: TreePine,
  heritage: Landmark,
  luxury: Sparkles
}

const categoryColors: Record<string, string> = {
  adventure: "from-orange-500 to-red-500",
  wildlife: "from-green-500 to-emerald-500",
  heritage: "from-purple-500 to-indigo-500",
  luxury: "from-amber-500 to-yellow-500"
}

const ExperiencesDropdown = ({ animatingItem, onMenuClick, isScrolled }: ExperiencesDropdownProps) => {
  const [activeCategory, setActiveCategory] = useState<string>('adventure')
  const navigate = useNavigate()
  const isAnimating = animatingItem === 'experiences'

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

  const categories = Object.entries(experiencesByCategory)

  return (
    <BaseNavigationMenuItem>
      <NavigationMenuTrigger 
        className={cn(
          "px-5 py-2.5 text-sm font-bold transition-all duration-300 rounded-lg",
          "hover:bg-gradient-to-r hover:from-rose-500/10 hover:via-orange-500/10 hover:to-amber-500/10",
          "hover:shadow-md hover:scale-105",
          "data-[state=open]:bg-gradient-to-r data-[state=open]:from-rose-500/20 data-[state=open]:via-orange-500/20 data-[state=open]:to-amber-500/20",
          "data-[state=open]:shadow-lg",
          isAnimating ? 'animate-pulse' : ''
        )}
      >
        Experiences
      </NavigationMenuTrigger>
      <NavigationMenuContent>
        <div className={cn(
          "w-[680px] max-w-[95vw] rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl",
          isScrolled
            ? "bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50 border-2 border-rose-300/50"
            : "bg-slate-900/90 border-2 border-white/20"
        )}>
          {/* Header */}
          <div className="h-2 bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500"></div>
          
          <div className="flex">
            {/* Category Tabs - Left Side */}
            <div className={cn(
              "w-[180px] p-3 border-r",
              isScrolled ? "border-rose-200/50 bg-white/50" : "border-white/10 bg-white/5"
            )}>
              <div className="space-y-1">
                {categories.map(([key, category]) => {
                  const IconComponent = categoryIconComponents[key]
                  return (
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
                          ? "text-gray-700 hover:bg-rose-100/50"
                          : "text-gray-300 hover:bg-white/10"
                    )}
                  >
                    {IconComponent && <IconComponent className="w-4 h-4" />}
                    <span className="truncate">{category.title}</span>
                  </button>
                )})}
              </div>
              
              {/* View All Link */}
              <div className="mt-4 pt-3 border-t border-rose-200/30">
                <Link
                  to="/experiences"
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                    isScrolled
                      ? "text-rose-700 hover:bg-rose-100"
                      : "text-rose-400 hover:bg-white/10"
                  )}
                >
                  <Compass className="w-4 h-4" />
                  View All Experiences
                </Link>
              </div>
            </div>

            {/* Experiences Grid - Right Side */}
            <div className="flex-1 p-4 max-h-[380px] overflow-y-auto">
              <h3 className={cn(
                "text-sm font-bold mb-3 flex items-center gap-2",
                isScrolled ? "text-gray-800" : "text-white"
              )}>
                <span className={cn(
                  "w-2 h-2 rounded-full bg-gradient-to-r",
                  categoryColors[activeCategory]
                )}></span>
                {experiencesByCategory[activeCategory as keyof typeof experiencesByCategory].title}
              </h3>
              
              <div className="grid grid-cols-2 gap-2">
                {experiencesByCategory[activeCategory as keyof typeof experiencesByCategory].experiences.map((item) => (
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
                          ? "bg-white/80 backdrop-blur-sm border border-rose-200/50 hover:bg-gradient-to-r hover:from-rose-100 hover:via-orange-100 hover:to-amber-100 hover:border-rose-400"
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
                            ? "text-gray-900 group-hover:text-rose-800"
                            : "text-white group-hover:text-rose-300"
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
          <div className="h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500"></div>
        </div>
      </NavigationMenuContent>
    </BaseNavigationMenuItem>
  )
}

export default ExperiencesDropdown