
import { Sun, Moon } from 'lucide-react'

interface FooterThemeToggleProps {
  isDarkMode: boolean
  setIsDarkMode: (isDarkMode: boolean) => void
}

const FooterThemeToggle = ({ isDarkMode, setIsDarkMode }: FooterThemeToggleProps) => {
  return (
    <div className="flex justify-end mb-8">
      <button
        onClick={() => setIsDarkMode(!isDarkMode)}
        className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-colors ${
          isDarkMode 
            ? 'border-wild-orange text-wild-orange hover:bg-wild-orange hover:text-white' 
            : 'border-gray-300 text-gray-600 hover:bg-gray-100'
        }`}
      >
        {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        <span className="text-sm">{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
      </button>
    </div>
  )
}

export default FooterThemeToggle
