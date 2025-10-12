import * as React from "react"
import { cn } from "@/lib/utils"
import { Home, Info, Users, Trophy } from "lucide-react"
import {
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { Link } from "react-router-dom"
import { aboutItems } from "./menuData"

interface HomeDropdownProps {
  animatingItem: string | null
  onMenuClick: (menuItem: string) => void
}

const HomeDropdown = ({ animatingItem, onMenuClick }: HomeDropdownProps) => {
  const getIcon = (href: string) => {
    if (href.includes('sri-lanka')) return <Info className="w-4 h-4 text-blue-600" />
    if (href.includes('#why-choose-us')) return <Trophy className="w-4 h-4 text-yellow-600" />
    return <Users className="w-4 h-4 text-purple-600" />
  }

  const homeItems = [
    {
      title: "Homepage",
      href: "/",
      description: "Return to our beautiful homepage"
    },
    ...aboutItems
  ]

  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger
        className={cn(
          "px-4 py-2 text-sm font-semibold transition-all duration-300",
          animatingItem === "home" && "animate-pulse"
        )}
        onClick={() => onMenuClick("home")}
      >
        <Home className="w-4 h-4 mr-2" />
        Home
      </NavigationMenuTrigger>
      <NavigationMenuContent>
        <div className="w-[350px] max-w-[90vw]">
          <div className="p-6">
            <div className="space-y-3">
              {homeItems.map((item, index) => (
                <NavigationMenuLink key={item.href} asChild>
                  <Link
                    to={item.href}
                    className={cn(
                      "flex items-start space-x-3 rounded-md p-3 text-sm leading-none no-underline outline-none",
                      "transition-all duration-200 ease-in-out transform",
                      "hover:bg-accent hover:text-accent-foreground",
                      "hover:shadow-sm hover:scale-[1.02]",
                      "focus:bg-accent focus:text-accent-foreground",
                      index === 0 && "border-b mb-3 pb-4"
                    )}
                  >
                    {index === 0 ? <Home className="w-4 h-4 text-green-600" /> : getIcon(item.href)}
                    <div className="flex-1">
                      <div className="font-medium mb-1">{item.title}</div>
                      <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                    </div>
                  </Link>
                </NavigationMenuLink>
              ))}
            </div>
          </div>
        </div>
      </NavigationMenuContent>
    </NavigationMenuItem>
  )
}

export default HomeDropdown