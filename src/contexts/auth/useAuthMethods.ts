
import { User } from '@/lib/firebase-types'
import { dbService, authService, storageService } from '@/lib/firebase-services'

export const useAuthMethods = (user: User | null) => {
  const signUp = async (email: string, password: string) => {
    const { error } = await authService.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`
      }
    })
    return { error }
  }

  const signIn = async (email: string, password: string) => {
    const { error } = await authService.signInWithPassword({
      email,
      password
    })
    return { error }
  }

  const signOut = async () => {
    await authService.signOut()
  }

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email)
    return { error }
  }

  const updateProfile = async (updates: any) => {
    if (!user) return { error: new Error('No user logged in') }
    
    const { error } = await supabase.auth.updateUser(updates)
    return { error }
  }

  return {
    signUp,
    signIn,
    signOut,
    resetPassword,
    updateProfile
  }
}
