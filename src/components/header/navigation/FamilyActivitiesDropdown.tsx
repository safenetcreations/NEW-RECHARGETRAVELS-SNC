import * as React from "react"
import { ChevronDown } from "lucide-react"
import NavigationDropdownItem from "./NavigationDropdownItem"
import { familyActivityItems } from "./menuData"

interface FamilyActivitiesDropdownProps {
  animatingItem: string | null
  onMenuClick: (menuItem: string) => void
}

export function FamilyActivitiesDropdown({ animatingItem, onMenuClick }: FamilyActivitiesDropdownProps) {
  return (
    <NavigationDropdownItem
      title="Family Activities"
      items={familyActivityItems}
      animatingItem={animatingItem}
      itemKey="family"
      onMenuClick={onMenuClick}
      hoverColorClass="group-hover:text-blue-600"
      gradientClass="hover:from-blue-50 hover:to-blue-100 hover:border-blue-200"
    />
  )
}