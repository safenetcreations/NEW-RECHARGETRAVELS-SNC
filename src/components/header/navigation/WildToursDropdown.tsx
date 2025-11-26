
import NavigationDropdownItem from './NavigationDropdownItem'
import { wildToursItems } from './menuData'

interface WildToursDropdownProps {
  animatingItem: string | null
  onMenuClick: (menuItem: string) => void
}

const WildToursDropdown = ({ animatingItem, onMenuClick }: WildToursDropdownProps) => {
  return (
    <NavigationDropdownItem
      title="Wild Tours"
      items={wildToursItems}
      animatingItem={animatingItem}
      itemKey="wild-tours"
      onMenuClick={onMenuClick}
      hoverColorClass="group-hover:text-[#16a34a]"
      gradientClass="hover:from-green-50 hover:to-green-100 hover:border-green-200"
    />
  )
}

export default WildToursDropdown
