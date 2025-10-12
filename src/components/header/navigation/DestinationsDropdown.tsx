
import NavigationDropdownItem from './NavigationDropdownItem'
import { destinationItems } from './menuData'

interface DestinationsDropdownProps {
  animatingItem: string | null
  onMenuClick: (menuItem: string) => void
}

const DestinationsDropdown = ({ animatingItem, onMenuClick }: DestinationsDropdownProps) => {
  return (
    <NavigationDropdownItem
      title="Destinations"
      items={destinationItems}
      animatingItem={animatingItem}
      itemKey="destinations"
      onMenuClick={onMenuClick}
      hoverColorClass="group-hover:text-[#1abc9c]"
      gradientClass="hover:from-teal-50 hover:to-teal-100"
    />
  )
}

export default DestinationsDropdown
