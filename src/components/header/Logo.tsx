
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

interface LogoProps {
  isAnimating: boolean
  onAnimationTrigger: () => void
  isScrolled?: boolean
}

const Logo = ({ isAnimating, onAnimationTrigger }: LogoProps) => {
  const [logoUrl, setLogoUrl] = useState('/logo-v2.png')

  useEffect(() => {
    const loadLogo = async () => {
      try {
        const siteDoc = await getDoc(doc(db, 'site-settings', 'images'))
        if (siteDoc.exists() && siteDoc.data().logo) {
          const storedLogo = siteDoc.data().logo as string
          // Enforce the new brand logo unless the stored value already points to it
          const isNewBrand = storedLogo.includes('/logo-v2.png') || storedLogo.includes('rechargetravels.com/logo-v2.png')
          setLogoUrl(isNewBrand ? storedLogo : '/logo-v2.png')
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
          alt="Recharge Travels logo - Redefine your journey, refresh your soul" 
          className={`h-12 w-auto object-contain group-hover:scale-105 transition-all duration-300 ${isAnimating ? 'animate-bounce' : ''}`}
          style={{ minHeight: '48px', minWidth: '48px' }}
          loading="eager"
          onError={(e) => {
            console.error('Logo failed to load:', logoUrl)
            e.currentTarget.src = '/logo-v2.png'
          }}
        />
        {isAnimating && (
          <div className="absolute inset-0 bg-white/20 rounded-full animate-ping"></div>
        )}
      </div>
    </Link>
  )
}

export default Logo
