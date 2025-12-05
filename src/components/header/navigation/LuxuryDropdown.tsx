import * as React from 'react'
import {
  NavigationMenuItem as BaseNavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu"
import { Link, useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { luxuryNavigation } from './menuData'
import { Crown, Plane, Building2, Sparkles, ChevronRight, Star } from 'lucide-react'

interface LuxuryDropdownProps {
  animatingItem: string | null
  onMenuClick: (menuItem: string) => void
  isScrolled: boolean;
}

const categoryIcons = {
  ultimate: Crown,
  transport: Plane,
  stays: Building2
}

const categoryColors = {
  ultimate: "from-amber-400 via-yellow-500 to-amber-600",
  transport: "from-rose-400 via-pink-500 to-rose-600",
  stays: "from-violet-400 via-purple-500 to-violet-600"
}

const LuxuryDropdown = ({ animatingItem, onMenuClick, isScrolled }: LuxuryDropdownProps) => {
  const navigate = useNavigate()
  const isAnimating = animatingItem === 'luxury'

  const handleItemClick = (href: string) => {
    navigate(href)
  }

  const categories = [
    { key: 'ultimate', data: luxuryNavigation.ultimate },
    { key: 'transport', data: luxuryNavigation.transport },
    { key: 'stays', data: luxuryNavigation.stays }
  ]

  return (
    <BaseNavigationMenuItem>
      <NavigationMenuTrigger
        className={cn(
          "px-5 py-2.5 text-sm font-bold transition-all duration-300 rounded-lg",
          "bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-amber-500/10",
          "hover:from-amber-500/20 hover:via-amber-400/15 hover:to-amber-500/20",
          "hover:shadow-[0_0_20px_rgba(251,191,36,0.3)] hover:scale-105",
          "data-[state=open]:from-amber-500/25 data-[state=open]:via-amber-400/20 data-[state=open]:to-amber-500/25",
          "data-[state=open]:shadow-[0_0_30px_rgba(251,191,36,0.4)]",
          "border border-amber-400/20",
          isAnimating ? 'animate-pulse' : ''
        )}
      >
        <Crown className="w-3.5 h-3.5 mr-1.5 text-amber-400" />
        Luxury
      </NavigationMenuTrigger>
      <NavigationMenuContent>
        <div className={cn(
          "w-[780px] max-w-[95vw] rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl",
          isScrolled
            ? "bg-gradient-to-br from-amber-50 via-white to-rose-50 border-2 border-amber-300/50"
            : "bg-[#0a0a0a]/95 border-2 border-amber-500/20"
        )}>
          {/* Premium Header */}
          <div className="relative h-14 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwMDAwMDEwIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30" />
            <div className="flex items-center gap-3 relative z-10">
              <Crown className="w-5 h-5 text-white" />
              <span className="text-white font-light tracking-[0.3em] text-sm uppercase">Luxury Collection</span>
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 text-white/80 fill-white/80" />
                ))}
              </div>
            </div>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-3 divide-x divide-amber-200/20">
            {categories.map(({ key, data }) => {
              const IconComponent = categoryIcons[key as keyof typeof categoryIcons]
              const colorClass = categoryColors[key as keyof typeof categoryColors]

              return (
                <div key={key} className="p-4">
                  {/* Category Header */}
                  <div className="flex items-center gap-2 mb-3 pb-2 border-b border-amber-200/20">
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br",
                      colorClass
                    )}>
                      <IconComponent className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className={cn(
                        "text-sm font-bold",
                        isScrolled ? "text-gray-900" : "text-white"
                      )}>{data.title}</h3>
                      <p className={cn(
                        "text-[10px]",
                        isScrolled ? "text-gray-500" : "text-gray-500"
                      )}>{data.description}</p>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="space-y-1">
                    {data.items.map((item) => (
                      <NavigationMenuLink key={item.href} asChild>
                        <Link
                          to={item.href}
                          onClick={(e) => {
                            e.preventDefault()
                            handleItemClick(item.href)
                          }}
                          className={cn(
                            "group flex items-start gap-2 p-2 rounded-lg transition-all duration-200",
                            isScrolled
                              ? "hover:bg-gradient-to-r hover:from-amber-100/80 hover:to-amber-50/80"
                              : "hover:bg-white/5",
                            "hover:translate-x-1"
                          )}
                        >
                          <ChevronRight className={cn(
                            "w-3 h-3 mt-1 transition-all opacity-0 -ml-3 group-hover:opacity-100 group-hover:ml-0",
                            isScrolled ? "text-amber-600" : "text-amber-400"
                          )} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className={cn(
                                "text-sm font-medium truncate",
                                isScrolled ? "text-gray-900" : "text-white"
                              )}>
                                {item.title}
                              </span>
                              {'badge' in item && (item as any).badge && (
                                <span className={cn(
                                  "text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider",
                                  "bg-gradient-to-r from-amber-500 to-amber-600 text-white"
                                )}>
                                  {(item as any).badge}
                                </span>
                              )}
                            </div>
                            <p className={cn(
                              "text-[11px] line-clamp-1 mt-0.5",
                              isScrolled ? "text-gray-500" : "text-gray-500"
                            )}>
                              {item.description}
                            </p>
                          </div>
                        </Link>
                      </NavigationMenuLink>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Footer CTA */}
          <div className={cn(
            "px-4 py-3 flex items-center justify-between border-t",
            isScrolled ? "bg-amber-50/50 border-amber-200/30" : "bg-white/5 border-white/10"
          )}>
            <div className="flex items-center gap-2">
              <Sparkles className={cn("w-4 h-4", isScrolled ? "text-amber-600" : "text-amber-400")} />
              <span className={cn("text-xs", isScrolled ? "text-gray-600" : "text-gray-400")}>
                Bespoke experiences crafted for the extraordinary
              </span>
            </div>
            <Link
              to="/luxury"
              className={cn(
                "text-xs font-medium px-4 py-2 rounded-full transition-all",
                "bg-gradient-to-r from-amber-500 to-amber-600 text-white",
                "hover:shadow-lg hover:shadow-amber-500/30 hover:scale-105"
              )}
            >
              View All Luxury
            </Link>
          </div>
        </div>
      </NavigationMenuContent>
    </BaseNavigationMenuItem>
  )
}

export default LuxuryDropdown
