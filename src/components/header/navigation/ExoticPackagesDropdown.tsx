import * as React from "react"
import { cn } from "@/lib/utils"
import { ChevronDown, Package, Heart, Sparkles, Crown, Users, Mountain } from "lucide-react"
import {
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { Link } from "react-router-dom"
import { exoticPackageItems, familyActivityItems, scenicSriLankaItems } from "./menuData"

interface ExoticPackagesDropdownProps {
  animatingItem: string | null
  onMenuClick: (menuItem: string) => void
}

const ExoticPackagesDropdown = ({ animatingItem, onMenuClick }: ExoticPackagesDropdownProps) => {
  const getIcon = (href: string) => {
    if (href.includes('luxury')) return <Crown className="w-4 h-4 text-purple-600" />
    if (href.includes('honeymoon')) return <Heart className="w-4 h-4 text-pink-600" />
    if (href.includes('wellness')) return <Sparkles className="w-4 h-4 text-green-600" />
    return <Package className="w-4 h-4 text-[#e91e63]" />
  }

  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger
        className={cn(
          "px-4 py-2 text-sm font-semibold transition-all duration-300",
          animatingItem === "exotic" && "animate-pulse"
        )}
        onClick={() => onMenuClick("exotic")}
      >
        Exotic Packages
      </NavigationMenuTrigger>
      <NavigationMenuContent>
        <div className="w-[500px] max-w-[90vw] bg-white rounded-xl shadow-2xl border border-gray-100">
          <div className="p-6">
            {/* Regular Exotic Packages */}
            <div className="space-y-3 mb-6">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Exotic Packages</h3>
                <p className="text-sm text-gray-600">Discover our premium travel experiences</p>
              </div>
              {exoticPackageItems.map((item) => (
                <NavigationMenuLink key={item.href} asChild>
                  <Link
                    to={item.href}
                    className={cn(
                      "flex items-start space-x-3 rounded-lg p-4 text-sm leading-none no-underline outline-none",
                      "transition-all duration-200 ease-in-out transform",
                      "hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-50 hover:text-orange-700",
                      "hover:shadow-md hover:scale-[1.02] hover:-translate-y-1",
                      "focus:bg-accent focus:text-accent-foreground",
                      "border border-transparent hover:border-orange-200"
                    )}
                  >
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-orange-100 to-red-100 rounded-lg flex items-center justify-center">
                      {getIcon(item.href)}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold mb-1 text-gray-900">{item.title}</div>
                      <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
                    </div>
                  </Link>
                </NavigationMenuLink>
              ))}
            </div>

            {/* Scenic Sri Lanka Section */}
            <div className="border-t border-gray-200 pt-6">
              <div className="mb-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg flex items-center justify-center">
                    <Mountain className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-green-700">Scenic Sri Lanka</h4>
                    <p className="text-xs text-gray-600">Breathtaking natural wonders and viewpoints</p>
                  </div>
                </div>
              </div>
              
              {/* Scenic Items */}
              <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
                {scenicSriLankaItems.map((item) => (
                  <NavigationMenuLink key={item.href} asChild>
                    <Link
                      to={item.href}
                      className={cn(
                        "flex items-start space-x-3 rounded-lg p-3 text-sm leading-none no-underline outline-none",
                        "transition-all duration-200 ease-in-out transform",
                        "hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 hover:text-green-700",
                        "hover:shadow-sm hover:scale-[1.01]",
                        "ml-4 border-l-2 border-transparent hover:border-green-400"
                      )}
                    >
                      <div className="flex-1">
                        <div className="font-medium text-sm mb-1 text-gray-900">{item.title}</div>
                        <p className="text-xs text-gray-600 line-clamp-1">{item.description}</p>
                      </div>
                    </Link>
                  </NavigationMenuLink>
                ))}
              </div>
            </div>

            {/* Family-Friendly Activities Section */}
            <div className="border-t border-gray-200 pt-6">
              <div className="mb-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center">
                    <Users className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-blue-700">Family-Friendly Activities</h4>
                    <p className="text-xs text-gray-600">Fun activities perfect for families with children</p>
                  </div>
                </div>
              </div>
              
              {/* Family Activities Items */}
              <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
                {familyActivityItems.map((item) => (
                  <NavigationMenuLink key={item.href} asChild>
                    <Link
                      to={item.href}
                      className={cn(
                        "flex items-start space-x-3 rounded-lg p-3 text-sm leading-none no-underline outline-none",
                        "transition-all duration-200 ease-in-out transform",
                        "hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-700",
                        "hover:shadow-sm hover:scale-[1.01]",
                        "ml-4 border-l-2 border-transparent hover:border-blue-400"
                      )}
                    >
                      <div className="flex-1">
                        <div className="font-medium text-sm mb-1 text-gray-900">{item.title}</div>
                        <p className="text-xs text-gray-600 line-clamp-1">{item.description}</p>
                      </div>
                    </Link>
                  </NavigationMenuLink>
                ))}
              </div>
            </div>
          </div>
        </div>
      </NavigationMenuContent>
    </NavigationMenuItem>
  )
}

export default ExoticPackagesDropdown