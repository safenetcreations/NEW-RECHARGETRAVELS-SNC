
import NavigationDropdownItem from './NavigationDropdownItem'
import { transportItems } from './menuData'

interface TransportDropdownProps {
  animatingItem: string | null
  onMenuClick: (menuItem: string) => void
}

const TransportDropdown = ({ animatingItem, onMenuClick }: TransportDropdownProps) => {
  return (
    <NavigationDropdownItem
      title="Transport"
      items={transportItems}
      animatingItem={animatingItem}
      itemKey="transport"
      onMenuClick={onMenuClick}
      hoverColorClass="group-hover:text-[#f39c12]"
      gradientClass="hover:from-orange-50 hover:to-orange-100"
    />
  )
}

export default TransportDropdown
