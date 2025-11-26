
import { TreePine } from 'lucide-react'
import { Link } from 'react-router-dom'

interface FooterAboutProps {
  isDarkMode: boolean
}

const FooterAbout = ({ isDarkMode }: FooterAboutProps) => {
  return (
    <div className="col-span-1">
      {/* Clean Sri Lanka Support Section */}
      <div className="mb-6">
        <p className={`text-sm font-semibold mb-3 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
          We Support:
        </p>
        <a 
          href="https://cleansrilanka.gov.lk/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="block hover:opacity-80 transition-opacity"
        >
          <img 
            src="/lovable-uploads/639e61ff-8943-44e1-9d85-4c5a16c0f1e2.png"
            alt="Clean Sri Lanka"
            className="h-16 w-auto"
          />
        </a>
      </div>

      <div className="flex items-center space-x-3 mb-6">
        <Link to="/">
          <img 
            src="https://i.imgur.com/kzqjJ57.png" 
            alt="Recharge Travels Logo" 
            className="h-12 w-auto hover:opacity-80 transition-opacity cursor-pointer"
          />
        </Link>
      </div>
      <div className="flex items-center space-x-2 mb-4">
        <TreePine className="h-6 w-6 text-wild-orange" />
        <span className="text-lg font-chakra font-bold">Recharge Travels</span>
      </div>
      
      {/* Header Menu Items */}
      <nav className="space-y-2">
        <div>
          <h4 className={`font-semibold mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>About</h4>
          <ul className="space-y-1">
            <li><Link to="/about/sri-lanka" className={`text-sm hover:text-wild-orange transition-colors ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Sri Lanka</Link></li>
            <li><Link to="/about/company" className={`text-sm hover:text-wild-orange transition-colors ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Recharge Travels</Link></li>
            <li><Link to="/about/social" className={`text-sm hover:text-wild-orange transition-colors ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>#RechargeLife</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className={`font-semibold mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Tours</h4>
          <ul className="space-y-1">
            <li><Link to="/tours/ramayana-trail" className={`text-sm hover:text-wild-orange transition-colors ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Ramayana Trail</Link></li>
            <li><Link to="/tours?category=cultural" className={`text-sm hover:text-wild-orange transition-colors ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Cultural Heritage Tours</Link></li>
            <li><Link to="/tours?category=spiritual" className={`text-sm hover:text-wild-orange transition-colors ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Spiritual Journeys</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className={`font-semibold mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Services</h4>
          <ul className="space-y-1">
            <li><Link to="/tours/wildtours" className={`text-sm hover:text-wild-orange transition-colors ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Wild Tours</Link></li>
            <li><Link to="/destinations" className={`text-sm hover:text-wild-orange transition-colors ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Destinations</Link></li>
            <li><Link to="/transport" className={`text-sm hover:text-wild-orange transition-colors ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Transport</Link></li>
          </ul>
        </div>
      </nav>
    </div>
  )
}

export default FooterAbout
