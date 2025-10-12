import * as React from 'react'
import {
  NavigationMenuItem as BaseNavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu"
import { Link } from 'react-router-dom'
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
}

const NavigationDropdownItem = ({
  title,
  items,
  animatingItem,
  itemKey,
  onMenuClick,
  hoverColorClass = "group-hover:text-[#1abc9c]",
  gradientClass = "hover:from-emerald-50 hover:to-emerald-100 hover:border-emerald-200"
}: NavigationDropdownItemProps) => {
  const isAnimating = itemKey && animatingItem === itemKey
  const animationClass = isAnimating ? getAnimationClass(itemKey) : ''
  const [isOpen, setIsOpen] = React.useState(false)
  const timeoutRef = React.useRef<NodeJS.Timeout>()
  
  const handleMouseEnter = () => {
    clearTimeout(timeoutRef.current)
    setIsOpen(true)
    if (itemKey && onMenuClick) {
      onMenuClick(itemKey)
    }
  }
  
  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false)
    }, 150) // Small delay before closing
  }

  const handleContentMouseEnter = () => {
    clearTimeout(timeoutRef.current)
    setIsOpen(true)
  }

  const handleContentMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false)
    }, 150)
  }
  
  return (
    <BaseNavigationMenuItem 
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <NavigationMenuTrigger 
        className={cn(
          "px-4 py-2 text-sm font-semibold transition-all duration-300",
          animationClass
        )}
      >
        {title}
      </NavigationMenuTrigger>
      <NavigationMenuContent
        onMouseEnter={handleContentMouseEnter}
        onMouseLeave={handleContentMouseLeave}
        forceMount={isOpen ? true : undefined}
      >
        <div className="w-[400px] max-w-[90vw]">
          <div className="grid gap-3 p-6 max-h-[70vh] overflow-y-auto">
            {items.map((item) => (
              <NavigationMenuLink key={item.href} asChild>
                <Link
                  to={item.href}
                  className={cn(
                    "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors",
                    "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                    gradientClass
                  )}
                >
                  <div className="text-sm font-medium leading-none mb-1">{item.title}</div>
                  <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                    {item.description}
                  </p>
                </Link>
              </NavigationMenuLink>
            ))}
          </div>
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