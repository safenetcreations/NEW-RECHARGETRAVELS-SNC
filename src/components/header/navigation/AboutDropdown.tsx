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
import { aboutItems } from './menuData'
import { Info, BookOpen, Users, Car } from 'lucide-react'

interface AboutDropdownProps {
  animatingItem: string | null
  onMenuClick: (menuItem: string) => void
  isScrolled: boolean
}

const aboutItemsByHref = aboutItems.reduce<Record<string, typeof aboutItems[number]>>((acc, item) => {
  acc[item.href] = item
  return acc
}, {})

const aboutCategories = {
  company: {
    title: "About Recharge & Sri Lanka",
    items: [
      aboutItemsByHref['/about'],
      aboutItemsByHref['/about/sri-lanka'],
    ].filter(Boolean)
  },
  planning: {
    title: "Plan & Book Your Trip",
    items: [
      aboutItemsByHref['/travel-guide'],
      aboutItemsByHref['/book-now'],
      aboutItemsByHref['/faq'],
    ].filter(Boolean)
  },
  community: {
    title: "Stories & Community",
    items: [
      aboutItemsByHref['/blog'],
      aboutItemsByHref['/connect-with-us'],
    ].filter(Boolean)
  },
  drivers: {
    title: "Partners",
    items: [
      aboutItemsByHref['/join-with-us'],
      aboutItemsByHref['/vehicle-rental/owner'],
      aboutItemsByHref['/vendor/register'],
    ].filter(Boolean)
  }
} as const

const categoryIcons: Record<keyof typeof aboutCategories, React.ReactNode> = {
  company: <Info className="w-4 h-4" />,
  planning: <BookOpen className="w-4 h-4" />,
  community: <Users className="w-4 h-4" />,
  drivers: <Car className="w-4 h-4" />,
}

const categoryColors: Record<keyof typeof aboutCategories, string> = {
  company: "from-emerald-500 to-teal-500",
  planning: "from-amber-500 to-orange-500",
  community: "from-purple-500 to-pink-500",
  drivers: "from-sky-500 to-cyan-500",
}

const AboutDropdown = ({ animatingItem, onMenuClick, isScrolled }: AboutDropdownProps) => {
  const [activeCategory, setActiveCategory] = useState<keyof typeof aboutCategories>('company')
  const navigate = useNavigate()
  const isAnimating = animatingItem === 'about'

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

  const categories = Object.entries(aboutCategories) as [keyof typeof aboutCategories, (typeof aboutCategories)[keyof typeof aboutCategories]][]

  return (
    <BaseNavigationMenuItem>
      <NavigationMenuTrigger
        className={cn(
          "px-5 py-2.5 text-sm font-bold transition-all duration-300 rounded-lg",
          "hover:bg-gradient-to-r hover:from-emerald-500/10 hover:via-teal-500/10 hover:to-amber-500/10",
          "hover:shadow-md hover:scale-105",
          "data-[state=open]:bg-gradient-to-r data-[state=open]:from-emerald-500/20 data-[state=open]:via-teal-500/20 data-[state=open]:to-amber-500/20",
          "data-[state=open]:shadow-lg",
          isAnimating ? 'animate-pulse' : ''
        )}
        onClick={() => onMenuClick('about')}
      >
        About
      </NavigationMenuTrigger>
      <NavigationMenuContent>
        <div className={cn(
          "w-[680px] max-w-[95vw] rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl",
          isScrolled
            ? "bg-gradient-to-br from-emerald-50 via-teal-50 to-amber-50 border-2 border-emerald-300/50"
            : "bg-slate-900/90 border-2 border-white/20"
        )}>
          <div className="h-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-amber-500"></div>

          <div className="flex">
            <div className={cn(
              "w-[200px] p-3 border-r",
              isScrolled ? "border-emerald-200/50 bg-white/50" : "border-white/10 bg-white/5"
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
                          ? "text-gray-700 hover:bg-emerald-100/50"
                          : "text-gray-300 hover:bg-white/10"
                    )}
                  >
                    {categoryIcons[key]}
                    <span className="truncate">{category.title}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 p-4 max-h-[380px] overflow-y-auto">
              <h3 className={cn(
                "text-sm font-bold mb-3 flex items-center gap-2",
                isScrolled ? "text-gray-800" : "text-white"
              )}>
                <span className={cn(
                  "w-2 h-2 rounded-full bg-gradient-to-r",
                  categoryColors[activeCategory]
                )}></span>
                {aboutCategories[activeCategory].title}
              </h3>

              <div className="grid grid-cols-2 gap-2">
                {aboutCategories[activeCategory].items.map((item) => (
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
                          ? "bg-white/80 backdrop-blur-sm border border-emerald-200/50 hover:bg-gradient-to-r hover:from-emerald-100 hover:via-teal-100 hover:to-amber-100 hover:border-emerald-400"
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
                            ? "text-gray-900 group-hover:text-emerald-800"
                            : "text-white group-hover:text-emerald-300"
                        )}>
                          {item.title}
                        </div>
                      </div>
                      <p className={cn(
                        "line-clamp-2 text-xs leading-snug pl-3.5 mt-1 transition-colors",
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

          <div className="h-1 bg-gradient-to-r from-amber-500 via-teal-500 to-emerald-500"></div>
        </div>
      </NavigationMenuContent>
    </BaseNavigationMenuItem>
  )
}

export default AboutDropdown
