import * as React from 'react'
import {
  NavigationMenuItem as BaseNavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu"
import { Link, useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'

interface MenuItem {
  title: string
  href: string
  description: string
  section?: string
}

interface NavigationDropdownItemProps {
  title: string
  items: MenuItem[]
  animatingItem?: string | null
  itemKey?: string
  onMenuClick?: (menuItem: string) => void
  hoverColorClass?: string
  gradientClass?: string
  isScrolled?: boolean;
}

const NavigationDropdownItem = ({
  title,
  items,
  animatingItem,
  itemKey,
  onMenuClick,
  hoverColorClass = "group-hover:text-[#1abc9c]",
  gradientClass = "hover:from-emerald-50 hover:to-emerald-100 hover:border-emerald-200",
  isScrolled = true
}: NavigationDropdownItemProps) => {
  const isAnimating = itemKey && animatingItem === itemKey
  const animationClass = isAnimating ? getAnimationClass(itemKey) : ''
  const navigate = useNavigate()
  
  const handleItemClick = (href: string) => {
    // Check if the href contains a hash (e.g., /tours/wildtours#national-parks)
    if (href.includes('#')) {
      const [path, hash] = href.split('#')
      const currentPath = window.location.pathname
      
      // If we're already on the target page, just scroll to the section
      if (currentPath === path) {
        const element = document.getElementById(hash)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      } else {
        // Navigate to the page with the hash
        navigate(href)
      }
    } else {
      // Regular navigation without hash
      navigate(href)
    }
  }
  
  return (
    <BaseNavigationMenuItem>
      <NavigationMenuTrigger 
        className={cn(
          "px-5 py-2.5 text-sm font-bold transition-all duration-300 rounded-lg",
          "hover:bg-gradient-to-r hover:from-amber-500/10 hover:via-orange-500/10 hover:to-emerald-500/10",
          "hover:shadow-md hover:scale-105",
          "data-[state=open]:bg-gradient-to-r data-[state=open]:from-amber-500/20 data-[state=open]:via-orange-500/20 data-[state=open]:to-emerald-500/20",
          "data-[state=open]:shadow-lg",
          animationClass
        )}
      >
        {title}
      </NavigationMenuTrigger>
      <NavigationMenuContent>
        <div className={cn(
          "w-[420px] max-w-[90vw] rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl",
          isScrolled
            ? "bg-gradient-to-br from-amber-50 via-orange-50 to-emerald-50 border-2 border-amber-300/50"
            : "bg-slate-900/90 border-2 border-white/20"
        )}>
          {/* Wild Theme Header Accent */}
          <div className="h-2 bg-gradient-to-r from-amber-500 via-orange-500 to-emerald-500"></div>
          
          <div className="grid gap-2 p-5 max-h-[70vh] overflow-y-auto">
            {items.map((item) => (
              <NavigationMenuLink key={item.href} asChild>
                <Link
                  to={item.href}
                  onClick={(e) => {
                    e.preventDefault()
                    handleItemClick(item.href)
                  }}
                  className={cn(
                    "group block select-none space-y-1 rounded-xl p-4 leading-none no-underline outline-none transition-all duration-300 cursor-pointer",
                    isScrolled
                      ? "bg-white/80 backdrop-blur-sm border border-amber-200/50 hover:bg-gradient-to-r hover:from-amber-100 hover:via-orange-100 hover:to-emerald-100 hover:border-amber-400 focus:bg-gradient-to-r focus:from-amber-100 focus:via-orange-100 focus:to-emerald-100"
                      : "bg-white/10 border border-white/20 hover:bg-white/20",
                    "hover:shadow-lg hover:scale-[1.02] hover:-translate-y-0.5",
                    "active:scale-[0.98]"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 group-hover:scale-150 transition-transform"></div>
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
                    "line-clamp-2 text-xs leading-snug pl-3.5 transition-colors",
                    isScrolled
                      ? "text-gray-700 group-hover:text-gray-900"
                      : "text-gray-300 group-hover:text-white"
                  )}>
                    {item.description}
                  </p>
                </Link>
              </NavigationMenuLink>
            ))}
          </div>
          
          {/* Wild Theme Footer Accent */}
          <div className="h-1 bg-gradient-to-r from-emerald-500 via-orange-500 to-amber-500"></div>
        </div>
      </NavigationMenuContent>
    </BaseNavigationMenuItem>
  )
}

const getAnimationClass = (itemKey: string) => {
  const animations = {
    'about': 'animate-walk',
    'exotic': 'animate-sparkle',
    'tours': 'animate-pulse',
    'wild-tours': 'animate-bounce',
    'destinations': 'animate-walk',
    'transport': 'animate-splash',
    'experiences': 'animate-pulse',
    'scenic': 'animate-walk'
  }
  return animations[itemKey as keyof typeof animations] || ''
}

export default NavigationDropdownItem