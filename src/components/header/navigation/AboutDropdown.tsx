import NavigationDropdownItem from './NavigationDropdownItem'
import { aboutItems } from './menuData'

interface AboutDropdownProps {
  animatingItem: string | null
  onMenuClick: (menuItem: string) => void
  isScrolled: boolean
}

const AboutDropdown = ({ animatingItem, onMenuClick, isScrolled }: AboutDropdownProps) => {
  return (
    <NavigationDropdownItem
      title="About"
      items={aboutItems}
      animatingItem={animatingItem}
      itemKey="about"
      onMenuClick={onMenuClick}
      hoverColorClass="group-hover:text-[#0a4d3c]"
      gradientClass="hover:from-emerald-50 hover:to-emerald-100 hover:border-emerald-200"
      isScrolled={isScrolled}
    />
  )
}

export default AboutDropdown
