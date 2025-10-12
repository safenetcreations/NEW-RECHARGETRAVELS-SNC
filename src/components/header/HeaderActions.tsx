
import { Button } from '@/components/ui/button'
import LanguageCurrencySwitcher from '../LanguageCurrencySwitcher'
import UserMenu from './UserMenu'
import { WalletBalance } from '../wallet/WalletBalance'

interface HeaderActionsProps {
  user: any
  isAdmin: boolean
  animatingItem: string | null
  onMenuClick: (menuItem: string) => void
  onBookNowClick: () => void
}

const HeaderActions = ({ user, isAdmin, animatingItem, onMenuClick, onBookNowClick }: HeaderActionsProps) => {
  return (
    <div className="flex items-center space-x-4">
      {/* Language and Currency Switcher */}
      <LanguageCurrencySwitcher />
      
      {user ? (
        <>
          <WalletBalance variant="header" />
          
          <UserMenu 
            user={user} 
            isAdmin={isAdmin} 
            animatingItem={animatingItem} 
            onMenuClick={onMenuClick} 
          />
          
          <Button 
            size="sm" 
            className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold transition-colors duration-300"
            onClick={onBookNowClick}
          >
            Book Now
          </Button>
        </>
      ) : (
        <>
          <Button 
            variant="ghost" 
            size="sm"
            className="text-foreground hover:text-primary font-semibold"
            onClick={() => window.location.href = '/login'}
          >
            Login
          </Button>
          
          <Button 
            size="sm" 
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold transition-colors duration-300"
            onClick={() => window.location.href = '/signup'}
          >
            Sign Up
          </Button>
        </>
      )}
    </div>
  )
}

export default HeaderActions
