import { User as FirebaseUser } from 'firebase/auth';
import { User } from '@/services/firebaseService';
import { UserProfile } from '@/services/firebaseAuthService';

// Firebase-based types
export interface Session {
  user: User | null;
  access_token?: string;
  refresh_token?: string;
}

export interface AuthError {
  message: string;
  status?: number;
}

export interface AuthResponse<T> {
  data: T | null;
  error: AuthError | null;
}

// Re-export User type
export type { User };

export interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  isAdmin: boolean
  signUp: (email: string, password: string) => Promise<{ error: AuthError | null }>
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error: AuthError | null }>
}
