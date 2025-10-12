
import { useState, useEffect } from 'react'
import { TreePine } from 'lucide-react'
import { Link } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

interface FooterBrandProps {
  isDarkMode: boolean
}

const FooterBrand = ({ isDarkMode }: FooterBrandProps) => {
  const [logoUrl, setLogoUrl] = useState('https://i.imgur.com/kzqjJ57.png')

  useEffect(() => {
    const loadLogo = async () => {
      try {
        const siteDoc = await getDoc(doc(db, 'site-settings', 'images'))
        if (siteDoc.exists() && siteDoc.data().logo) {
          setLogoUrl(siteDoc.data().logo)
        }
      } catch (error) {
        console.error('Error loading logo:', error)
      }
    }
    loadLogo()
  }, [])
  return (
    <div className="space-y-6">
      {/* Clean Sri Lanka Support */}
      <div>
        <p className={`text-sm font-semibold mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          We Support:
        </p>
        <a 
          href="https://cleansrilanka.gov.lk/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-block hover:opacity-80 transition-opacity"
        >
          <img 
            src="/lovable-uploads/639e61ff-8943-44e1-9d85-4c5a16c0f1e2.png"
            alt="Clean Sri Lanka Initiative"
            className="h-12 w-auto"
          />
        </a>
      </div>

      {/* Brand Section */}
      <div>
        <div className="flex items-center space-x-3 mb-4">
          <Link to="/">
            <img 
              src={logoUrl} 
              alt="Recharge Travels Logo" 
              className="h-10 w-auto hover:opacity-80 transition-opacity cursor-pointer"
              onError={(e) => {
                e.currentTarget.src = 'https://i.imgur.com/kzqjJ57.png'
              }}
            />
          </Link>
          <div className="flex items-center space-x-2">
            <TreePine className="h-6 w-6 text-wild-orange" />
            <span className="text-xl font-chakra font-bold text-wild-orange">Recharge Travels</span>
          </div>
        </div>
        
        <p className={`text-sm leading-relaxed max-w-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Authentic Sri Lankan wildlife adventures since 2014. Your trusted partner for leopard safaris, 
          whale watching, and cultural heritage tours.
        </p>
      </div>

      {/* Certifications */}
      <div className="flex flex-wrap gap-2">
        <div className="flex items-center space-x-1 text-xs bg-jungle-green/20 text-jungle-green px-2 py-1 rounded">
          <span>🏛️</span>
          <span>Tourism Board Licensed</span>
        </div>
        <div className="flex items-center space-x-1 text-xs bg-peacock-teal/20 text-peacock-teal px-2 py-1 rounded">
          <span>🌿</span>
          <span>Eco-Certified</span>
        </div>
      </div>
    </div>
  )
}

export default FooterBrand
