import NavigationDropdownItem from './NavigationDropdownItem'
import { experienceItems } from './menuData'

interface ExperiencesDropdownProps {
  animatingItem: string | null
  onMenuClick: (menuItem: string) => void
}

const ExperiencesDropdown = ({ animatingItem, onMenuClick }: ExperiencesDropdownProps) => {
  return (
    <NavigationDropdownItem
      title="Experiences"
      items={experienceItems}
      animatingItem={animatingItem}
      itemKey="experiences"
      onMenuClick={onMenuClick}
      hoverColorClass="group-hover:text-[#ff6b6b]"
      gradientClass="hover:from-rose-50 hover:to-orange-50"
    />
  )
}

export default ExperiencesDropdown