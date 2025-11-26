import { cn } from "@/lib/utils"
import {
  NavigationMenu,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import ToursDropdown from './navigation/ToursDropdown'
import DestinationsDropdown from './navigation/DestinationsDropdown'
import TransportDropdown from './navigation/TransportDropdown'
import ExperiencesDropdown from './navigation/ExperiencesDropdown'
import AboutDropdown from './navigation/AboutDropdown'

interface NavigationMenuProps {
  animatingItem: string | null
  onMenuClick: (menuItem: string) => void
  isScrolled: boolean
  className?: string
}

const HeaderNavigationMenu = ({
  animatingItem,
  onMenuClick,
  isScrolled,
  className
}: NavigationMenuProps) => {
  return (
    <div className={cn("flex w-full justify-center", className)}>
      <NavigationMenu className="w-full max-w-fit justify-center" delayDuration={0} skipDelayDuration={0}>
        <NavigationMenuList
          className={cn(
            "gap-0.5 px-2 py-1.5 rounded-full border backdrop-blur-[18px] transition-all duration-500 ease-out",
            "[&>li>button]:rounded-full [&>li>button]:px-4 [&>li>button]:py-1.5",
            "[&>li>button]:text-[0.7rem] [&>li>button]:tracking-[0.14em]",
            "[&>li>button]:uppercase [&>li>button]:font-semibold",
            "[&>li>button]:transition-all [&>li>button:hover]:scale-[1.02]",
            "[&>li>button]:focus:outline-none [&>li>button]:focus:ring-0 [&>li>button]:focus:ring-offset-0",
            "[&>li>button[data-state=open]]:shadow-inner",
            isScrolled
              ? "bg-white/95 text-slate-900 border-white/70 shadow-[0_20px_40px_-12px_rgba(15,23,42,0.18)] [&>li>button]:text-slate-800 [&>li>button:hover]:bg-slate-900/5 [&>li>button[data-state=open]]:bg-slate-900/8 [&>li>button[data-state=open]]:text-slate-900"
              : "bg-white/10 text-white border-white/20 shadow-[0_24px_60px_-18px_rgba(13,26,45,0.65)] [&>li>button]:text-white/90 [&>li>button:hover]:bg-white/12 [&>li>button[data-state=open]]:bg-white/16 [&>li>button[data-state=open]]:text-white"
          )}
        >
          <ToursDropdown
            animatingItem={animatingItem}
            onMenuClick={onMenuClick}
            isScrolled={isScrolled}
          />

          <DestinationsDropdown
            animatingItem={animatingItem}
            onMenuClick={onMenuClick}
            isScrolled={isScrolled}
          />

          <ExperiencesDropdown
            animatingItem={animatingItem}
            onMenuClick={onMenuClick}
            isScrolled={isScrolled}
          />

          <TransportDropdown
            animatingItem={animatingItem}
            onMenuClick={onMenuClick}
            isScrolled={isScrolled}
          />

          <AboutDropdown
            animatingItem={animatingItem}
            onMenuClick={onMenuClick}
            isScrolled={isScrolled}
          />

        </NavigationMenuList>
      </NavigationMenu>
    </div>
  )
}

export default HeaderNavigationMenu
