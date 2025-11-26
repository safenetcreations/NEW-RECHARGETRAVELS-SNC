
import NavigationDropdownItem from './NavigationDropdownItem'
import { transportItems } from './menuData'

interface TransportDropdownProps {
  animatingItem: string | null
  onMenuClick: (menuItem: string) => void
  isScrolled: boolean;
}

const TransportDropdown = ({ animatingItem, onMenuClick, isScrolled }: TransportDropdownProps) => {
  return (
    <NavigationDropdownItem
      title="Transport"
      items={transportItems}
      animatingItem={animatingItem}
      itemKey="transport"
      onMenuClick={onMenuClick}
      isScrolled={isScrolled}
      hoverColorClass="group-hover:text-[#f39c12]"
      gradientClass="hover:from-orange-50 hover:to-orange-100"
    />
  )
}

export default TransportDropdown
