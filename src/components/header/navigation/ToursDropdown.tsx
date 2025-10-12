
import NavigationDropdownItem from './NavigationDropdownItem'
import { toursItems } from './menuData'

interface ToursDropdownProps {
  animatingItem: string | null
  onMenuClick: (menuItem: string) => void
}

const ToursDropdown = ({ animatingItem, onMenuClick }: ToursDropdownProps) => {
  return (
    <NavigationDropdownItem
      title="Tours"
      items={toursItems}
      animatingItem={animatingItem}
      itemKey="tours"
      onMenuClick={onMenuClick}
      hoverColorClass="group-hover:text-[#8b5cf6]"
      gradientClass="hover:from-purple-50 hover:to-purple-100 hover:border-purple-200"
    />
  )
}

export default ToursDropdown
