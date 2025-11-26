import NavigationDropdownItem from './NavigationDropdownItem'
import { experienceItems } from './menuData'

interface ExperiencesDropdownProps {
  animatingItem: string | null
  onMenuClick: (menuItem: string) => void
  isScrolled: boolean;
}

const ExperiencesDropdown = ({ animatingItem, onMenuClick, isScrolled }: ExperiencesDropdownProps) => {
  return (
    <NavigationDropdownItem
      title="Experiences"
      items={experienceItems}
      animatingItem={animatingItem}
      itemKey="experiences"
      onMenuClick={onMenuClick}
      isScrolled={isScrolled}
      hoverColorClass="group-hover:text-[#ff6b6b]"
      gradientClass="hover:from-rose-50 hover:to-orange-50"
    />
  )
}

export default ExperiencesDropdown