
import { Shield } from 'lucide-react'

interface FooterBottomProps {
  isDarkMode: boolean
}

const FooterBottom = ({ isDarkMode }: FooterBottomProps) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
      <div className="flex flex-wrap items-center gap-4 text-sm">
        <div className="flex items-center space-x-2">
          <Shield className="h-4 w-4 text-peacock-teal" />
          <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
            Tourism License #SL-2024-WT-789
          </span>
        </div>
      </div>
      
      <div className={`text-sm text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
        <p>&copy; 2025 Recharge Travels and Tours. All rights reserved. 🐆 🐘 🐋 🦚</p>
      </div>
    </div>
  )
}

export default FooterBottom
