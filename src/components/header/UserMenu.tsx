import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { LogOut, User as UserIcon, Settings, ChevronDown, Shield, Wallet } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { dbService, authService, storageService } from '@/lib/firebase-services'
import { toast } from 'sonner'

interface UserMenuProps {
  user: any
  isAdmin: boolean
  animatingItem: string | null
  onMenuClick: (menuItem: string) => void
}

const UserMenu = ({ user, isAdmin, animatingItem, onMenuClick }: UserMenuProps) => {
  const navigate = useNavigate()

  const handleLogout = async () => {
    await authService.signOut()
    toast.success('Logged out successfully')
    navigate('/')
  }

  if (user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-9 w-9">
              <AvatarImage src={user.user_metadata.avatar_url} alt={user.email} />
              <AvatarFallback>{user.email?.[0].toUpperCase()}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 bg-white border border-gray-200 shadow-lg z-50" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">My Account</p>
              <p className="text-xs leading-none text-muted-foreground">
                {user.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          {/* User Options */}
          <DropdownMenuItem asChild>
            <Link to="/wallet" className="cursor-pointer">
              <Wallet className="mr-2 h-4 w-4" />
              <span>My Wallet</span>
            </Link>
          </DropdownMenuItem>
          
          {/* Driver Options */}
          <DropdownMenuLabel className="text-xs text-gray-500 uppercase tracking-wide">
            Driver Portal
          </DropdownMenuLabel>
          <DropdownMenuItem asChild>
            <Link to="/driver-registration" className="cursor-pointer">
              <UserIcon className="mr-2 h-4 w-4" />
              <span>Become a Driver</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/driver-dashboard" className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              <span>Driver Dashboard</span>
            </Link>
          </DropdownMenuItem>
          
          {/* Admin Options */}
          {isAdmin && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="text-xs text-gray-500 uppercase tracking-wide">
                Admin Panel
              </DropdownMenuLabel>
              <DropdownMenuItem asChild>
                <Link to="/admin" className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Admin Dashboard</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/admin-panel" className="cursor-pointer">
                  <Shield className="mr-2 h-4 w-4" />
                  <span>Full Admin Panel</span>
                </Link>
              </DropdownMenuItem>
            </>
          )}
          
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <div className="hidden md:flex items-center space-x-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost"
            className={`px-4 py-2 text-foreground hover:text-primary transition-colors duration-300 font-semibold rounded-md hover:bg-muted/50 ${animatingItem === 'login' ? 'animate-drop' : ''}`}
            onClick={() => onMenuClick('login')}
          >
            Login
            <ChevronDown className="ml-1 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-white border border-gray-200 shadow-lg z-50" align="end">
          <DropdownMenuItem asChild>
            <Link to="/login" className="cursor-pointer">
              Log In
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link 
              to="/signup" 
              className={`cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground rounded px-2 py-1 ${animatingItem === 'signup' ? 'animate-drop' : ''}`}
              onClick={() => onMenuClick('signup')}
            >
              Sign Up
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default UserMenu
