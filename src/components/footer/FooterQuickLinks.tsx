
import { Link } from 'react-router-dom'

interface FooterQuickLinksProps {
  isDarkMode: boolean
}

const FooterQuickLinks = ({ isDarkMode }: FooterQuickLinksProps) => {
  const linkClass = `text-sm hover:text-wild-orange transition-colors ${
    isDarkMode ? 'text-gray-300 hover:text-wild-orange' : 'text-gray-600 hover:text-wild-orange'
  }`

  return (
    <div>
      <h4 className={`font-semibold mb-4 text-wild-orange`}>Quick Links</h4>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <h5 className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>About</h5>
          <ul className="space-y-1">
            <li><Link to="/about/sri-lanka" className={linkClass}>Sri Lanka</Link></li>
            <li><Link to="/about/company" className={linkClass}>Our Company</Link></li>
            <li><Link to="/about/social" className={linkClass}>#RechargeLife</Link></li>
          </ul>
        </div>
        
        <div>
          <h5 className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Tours</h5>
          <ul className="space-y-1">
            <li><Link to="/tours/ramayana-trail" className={linkClass}>Ramayana Trail</Link></li>
            <li><Link to="/tours?category=cultural" className={linkClass}>Cultural Tours</Link></li>
            <li><Link to="/tours/wildtours" className={linkClass}>Wildlife Safaris</Link></li>
          </ul>
        </div>
        
        <div>
          <h5 className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Services</h5>
          <ul className="space-y-1">
            <li><Link to="/destinations" className={linkClass}>Destinations</Link></li>
            <li><Link to="/transport" className={linkClass}>Transport</Link></li>
            <li><Link to="/activities" className={linkClass}>Activities</Link></li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default FooterQuickLinks
