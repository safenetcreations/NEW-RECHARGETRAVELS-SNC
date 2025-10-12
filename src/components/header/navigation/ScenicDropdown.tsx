import NavigationDropdownItem from './NavigationDropdownItem'
import { scenicItems } from './menuData'

interface ScenicDropdownProps {
  animatingItem: string | null
  onMenuClick: (menuItem: string) => void
}

const ScenicDropdown = ({ animatingItem, onMenuClick }: ScenicDropdownProps) => {
  return (
    <NavigationDropdownItem
      title="Scenic Sri Lanka"
      items={scenicItems}
      animatingItem={animatingItem}
      itemKey="scenic"
      onMenuClick={onMenuClick}
      hoverColorClass="group-hover:text-[#2ecc71]"
      gradientClass="hover:from-green-50 hover:to-emerald-50"
    />
  )
}

export default ScenicDropdown