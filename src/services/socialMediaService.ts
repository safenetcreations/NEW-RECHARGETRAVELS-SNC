
import { getDocs, getDoc, collection, query, where, orderBy, addDoc, updateDoc, doc, onSnapshot } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '@/lib/firebase';

export interface SocialPlatform {
  id: string
  name: string
  display_name: string
  api_base_url: string
  rate_limit_per_hour: number
  is_active: boolean
}

export interface SocialPost {
  id: string
  platform_id: string
  external_post_id: string
  post_type: 'text' | 'image' | 'video' | 'link' | 'story'
  content: string
  author_name: string
  author_username: string
  hashtags: string[]
  mentions: string[]
  engagement_metrics: Record<string, any>
  media_urls: string[]
  thumbnail_url?: string
  post_url?: string
  posted_at: string
  created_at: string
  updated_at: string
}

export interface UserSocialAccount {
  id: string
  user_id: string
  platform_id: string
  platform_user_id?: string
  username?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

class SocialMediaService {
  async getPlatforms(): Promise<SocialPlatform[]> {
    try {
      const q = query(
        collection(db, 'social_platforms'),
        where('is_active', '==', true),
        orderBy('display_name')
      );
      const snapshot = await getDocs(q);
      const platforms = snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() })) as SocialPlatform[];
      
      return platforms.length > 0 ? platforms : this.getSamplePlatforms();
    } catch (error) {
      console.error('Error fetching platforms:', error);
      // Return sample platforms if database fails
      return this.getSamplePlatforms();
    }
  }

  async getUserSocialAccounts(userId: string): Promise<UserSocialAccount[]> {
    try {
      const q = query(
        collection(db, 'user_social_accounts'),
        where('user_id', '==', userId),
        where('is_active', '==', true)
      );
      const snapshot = await getDocs(q);
      const accounts = snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() })) as any[];
      
      // Fetch platform details for each account
      const accountsWithPlatforms = await Promise.all(
        accounts.map(async (account) => {
          if (account.platform_id) {
            const platformDoc = await getDoc(doc(db, 'social_platforms', account.platform_id));
            if (platformDoc.exists()) {
              account.platform = { id: platformDoc.id, ...platformDoc.data() };
            }
          }
          return account;
        })
      );
      
      return accountsWithPlatforms;
    } catch (error) {
      console.error('Error fetching user social accounts:', error);
      return [];
    }
  }

  async connectSocialAccount(platformId: string, accessToken: string, refreshToken?: string): Promise<void> {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) throw new Error('User not authenticated');

      // Check if account already exists
      const existingQuery = query(
        collection(db, 'user_social_accounts'),
        where('user_id', '==', user.uid),
        where('platform_id', '==', platformId)
      );
      const existingSnapshot = await getDocs(existingQuery);
      
      if (!existingSnapshot.empty) {
        // Update existing account
        const existingDoc = existingSnapshot.docs[0];
        await updateDoc(doc(db, 'user_social_accounts', existingDoc.id), {
          access_token: accessToken, // In production, this should be encrypted
          refresh_token: refreshToken,
          token_expires_at: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
          is_active: true,
          updated_at: new Date().toISOString()
        });
      } else {
        // Create new account
        await addDoc(collection(db, 'user_social_accounts'), {
          user_id: user.uid,
          platform_id: platformId,
          access_token: accessToken, // In production, this should be encrypted
          refresh_token: refreshToken,
          token_expires_at: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Error connecting social account:', error);
      throw error;
    }
  }

  async disconnectSocialAccount(platformId: string): Promise<void> {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) throw new Error('User not authenticated');

      const q = query(
        collection(db, 'user_social_accounts'),
        where('user_id', '==', user.uid),
        where('platform_id', '==', platformId)
      );
      const snapshot = await getDocs(q);
      
      if (!snapshot.empty) {
        const accountDoc = snapshot.docs[0];
        await updateDoc(doc(db, 'user_social_accounts', accountDoc.id), {
          is_active: false,
          updated_at: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Error disconnecting social account:', error);
      throw error;
    }
  }

  async getUserPosts(userId: string, platformFilter?: string, limitCount = 20): Promise<SocialPost[]> {
    try {
      let q = query(
        collection(db, 'social_posts'),
        where('user_id', '==', userId),
        orderBy('posted_at', 'desc')
      );

      if (platformFilter) {
        q = query(
          collection(db, 'social_posts'),
          where('user_id', '==', userId),
          where('platform_id', '==', platformFilter),
          orderBy('posted_at', 'desc')
        );
      }

      const snapshot = await getDocs(q);
      const posts = snapshot.docs
        .slice(0, limitCount)
        .map(docSnap => ({ id: docSnap.id, ...docSnap.data() })) as SocialPost[];
      
      return posts;
    } catch (error) {
      console.error('Error fetching user posts:', error);
      return [];
    }
  }

  async getPublicPosts(platformFilter?: string, limitCount = 20): Promise<SocialPost[]> {
    try {
      let q = query(
        collection(db, 'social_posts'),
        where('is_public', '==', true),
        orderBy('posted_at', 'desc')
      );

      if (platformFilter) {
        q = query(
          collection(db, 'social_posts'),
          where('is_public', '==', true),
          where('platform_id', '==', platformFilter),
          orderBy('posted_at', 'desc')
        );
      }

      const snapshot = await getDocs(q);
      const posts = snapshot.docs
        .slice(0, limitCount)
        .map(docSnap => ({ id: docSnap.id, ...docSnap.data() })) as SocialPost[];
      
      return posts;
    } catch (error) {
      console.error('Error fetching public posts:', error);
      return this.getSamplePosts();
    }
  }

  async syncPlatformPosts(platformId: string): Promise<void> {
    try {
      // This would typically call a Firebase Function to sync posts from external APIs
      console.log('Syncing posts for platform:', platformId);
      
      // TODO: Implement Firebase Function call
      // const { data, error } = await httpsCallable(functions, 'syncPlatformPosts')({ platformId });
      
      // For now, we'll just log the action
      console.log('Platform posts sync initiated for:', platformId);
    } catch (error) {
      console.error('Error syncing platform posts:', error);
      throw error;
    }
  }

  subscribeToPosts(userId: string, callback: (post: SocialPost) => void) {
    const q = query(
      collection(db, 'social_posts'),
      where('user_id', '==', userId),
      orderBy('posted_at', 'desc')
    );

    return onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          const post = { id: change.doc.id, ...change.doc.data() } as SocialPost;
          callback(post);
        }
      });
    });
  }

  private getSamplePlatforms(): SocialPlatform[] {
    return [
      {
        id: 'instagram',
        name: 'instagram',
        display_name: 'Instagram',
        api_base_url: 'https://graph.instagram.com',
        rate_limit_per_hour: 200,
        is_active: true
      },
      {
        id: 'facebook',
        name: 'facebook',
        display_name: 'Facebook',
        api_base_url: 'https://graph.facebook.com',
        rate_limit_per_hour: 200,
        is_active: true
      },
      {
        id: 'twitter',
        name: 'twitter',
        display_name: 'Twitter',
        api_base_url: 'https://api.twitter.com',
        rate_limit_per_hour: 300,
        is_active: true
      }
    ];
  }

  private getSamplePosts(): SocialPost[] {
    return [
      {
        id: '1',
        platform_id: 'instagram',
        external_post_id: 'sample_1',
        post_type: 'image',
        content: 'Amazing sunset at Yala National Park! 🦁 #SriLanka #Wildlife #Yala',
        author_name: 'Recharge Travels',
        author_username: 'rechargetravels',
        hashtags: ['SriLanka', 'Wildlife', 'Yala'],
        mentions: [],
        engagement_metrics: { likes: 150, comments: 12, shares: 5 },
        media_urls: ['/images/sample-sunset.jpg'],
        thumbnail_url: '/images/sample-sunset-thumb.jpg',
        post_url: 'https://instagram.com/p/sample1',
        posted_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
  }
}

export const socialMediaService = new SocialMediaService();
export default socialMediaService;
