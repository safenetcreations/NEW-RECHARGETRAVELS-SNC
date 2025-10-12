
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

interface LogoProps {
  isAnimating: boolean
  onAnimationTrigger: () => void
  isScrolled?: boolean
}

const Logo = ({ isAnimating, onAnimationTrigger, isScrolled = false }: LogoProps) => {
  const [logoUrl, setLogoUrl] = useState('/logo.png')

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
    <Link 
      to="/" 
      className="flex items-center space-x-3 group"
      onClick={onAnimationTrigger}
    >
      <div className="relative">
        <img 
          src={logoUrl} 
          alt="Recharge Travels Logo" 
          className={`h-12 w-auto object-contain group-hover:scale-105 transition-all duration-300 ${isAnimating ? 'animate-bounce' : ''}`}
          style={{ minHeight: '48px', minWidth: '48px' }}
          loading="eager"
          onError={(e) => {
            console.error('Logo failed to load:', logoUrl)
            e.currentTarget.src = '/logo.png'
          }}
        />
        {isAnimating && (
          <div className="absolute inset-0 bg-white/20 rounded-full animate-ping"></div>
        )}
      </div>
      <div className="flex flex-col">
        <span className={`text-xl font-bold transition-all duration-300 ${isScrolled ? 'text-gray-900' : 'text-white'}`}>
          Recharge Travels
        </span>
        <span className={`text-xs font-medium transition-all duration-300 ${isScrolled ? 'text-gray-600' : 'text-white/80'}`}>
          Sri Lanka
        </span>
      </div>
    </Link>
  )
}

export default Logo
