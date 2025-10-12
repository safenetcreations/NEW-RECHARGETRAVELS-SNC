// Firebase-compatible types to replace Supabase types

export interface User {
  id: string;
  email: string | null;
  user_metadata: {
    name?: string | null;
    avatar_url?: string | null;
    [key: string]: any;
  };
  app_metadata: {
    [key: string]: any;
  };
  aud: string;
  created_at: string | undefined;
  updated_at: string | undefined;
}

export interface Session {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  user: User;
}

export type AuthChangeEvent = 
  | 'INITIAL_SESSION'
  | 'PASSWORD_RECOVERY'
  | 'SIGNED_IN'
  | 'SIGNED_OUT'
  | 'TOKEN_REFRESHED'
  | 'USER_UPDATED'
  | 'USER_DELETED';