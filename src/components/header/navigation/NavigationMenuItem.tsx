
import { Link } from 'react-router-dom'
import {
  NavigationMenuItem as BaseNavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu"

interface NavigationMenuItemProps {
  to: string
  children: React.ReactNode
  animatingItem?: string | null
  itemKey?: string
  onMenuClick?: (menuItem: string) => void
  className?: string
}

const NavigationMenuItem = ({ 
  to, 
  children, 
  animatingItem, 
  itemKey, 
  onMenuClick,
  className = "px-4 py-2 text-foreground hover:text-primary transition-all duration-200 font-medium rounded-lg hover:bg-white/10 hover:backdrop-blur-md"
}: NavigationMenuItemProps) => {
  const isAnimating = itemKey && animatingItem === itemKey
  const animationClass = isAnimating ? getAnimationClass(itemKey) : ''
  
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (itemKey && onMenuClick) {
      onMenuClick(itemKey)
    }
  }
  
  return (
    <BaseNavigationMenuItem>
      <NavigationMenuLink asChild>
        <Link 
          to={to}
          className={`${className} ${animationClass} no-underline`}
          onClick={handleClick}
        >
          {children}
        </Link>
      </NavigationMenuLink>
    </BaseNavigationMenuItem>
  )
}

const getAnimationClass = (itemKey: string) => {
  const animations = {
    'home': 'animate-jump',
    'hotels': 'animate-swim'
  }
  return animations[itemKey as keyof typeof animations] || ''
}

export default NavigationMenuItem
