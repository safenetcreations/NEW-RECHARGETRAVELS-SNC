export type SocialPlatform = 'facebook' | 'instagram' | 'twitter' | 'tiktok';

export interface UserSocialAccount {
  id: string;
  platform: SocialPlatform;
  username: string;
  connected: boolean;
  lastSync?: Date;
}

export const socialMediaService = {
  connectAccount: async (platform: string, credentials: any) => {
    return { success: true };
  },
  
  disconnectAccount: async (platform: string) => {
    return { success: true };
  },
  
  getAccounts: async (): Promise<UserSocialAccount[]> => {
    return [];
  }
};