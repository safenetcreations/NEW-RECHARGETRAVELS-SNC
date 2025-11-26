
import { Phone, Mail, MapPin, Clock } from 'lucide-react'

interface FooterContactProps {
  isDarkMode: boolean
}

const FooterContact = ({ isDarkMode }: FooterContactProps) => {
  return (
    <div>
      <h4 className="font-semibold mb-4 text-peacock-teal">Contact Us</h4>
      <div className="space-y-3">
        <div className="flex items-center space-x-3">
          <Phone className="h-4 w-4 text-wild-orange flex-shrink-0" />
          <div>
            <p className="text-sm font-medium">+94 7777 21 999</p>
            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>24/7 Support</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Mail className="h-4 w-4 text-jungle-green flex-shrink-0" />
          <div>
            <p className="text-sm font-medium">info@rechargetravels.com</p>
            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Quick Response</p>
          </div>
        </div>
        
        <div className="flex items-start space-x-3">
          <MapPin className="h-4 w-4 text-peacock-teal flex-shrink-0 mt-1" />
          <div>
            <p className="text-sm font-medium">Jaffna • Colombo • Yala</p>
            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Sri Lanka</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Clock className="h-4 w-4 text-wild-orange flex-shrink-0" />
          <div>
            <p className="text-sm font-medium">Always Available</p>
            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Emergency Support</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FooterContact
