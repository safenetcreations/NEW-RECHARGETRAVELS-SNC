import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { collection, query, where, getDocs, doc, getDoc, orderBy, limit, QueryConstraint } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  body_md: string;
  excerpt?: string;
  featured_image?: string;
  author: string;
  reading_time?: number;
  published: boolean;
  published_at?: string;
  created_at: string;
  updated_at: string;
  is_blog_post: boolean;
  category?: {
    id: string;
    name: string;
    type: string;
    description?: string;
    seo_keywords?: string[];
  };
  podcast_episode?: {
    id: string;
    audio_url?: string;
    duration_seconds?: number;
    status: string;
  };
}

export interface BlogCategory {
  id: string;
  name: string;
  type: string;
  description?: string;
  seo_keywords?: string[];
  is_blog_category: boolean;
}

export interface ContentCalendar {
  id: string;
  category_id: string;
  topic: string;
  keywords: string[];
  target_date: string;
  status: string;
  priority: number;
  content_brief?: string;
  article_id?: string;
}

// Fetch published blog posts
export const useBlogPosts = (categoryId?: string) => {
  return useQuery({
    queryKey: ['blog-posts', categoryId],
    queryFn: async () => {
      const articlesCollection = collection(db, 'article');
      const constraints: QueryConstraint[] = [
        where('published', '==', true),
        where('is_blog_post', '==', true),
        orderBy('published_at', 'desc')
      ];

      if (categoryId) {
        constraints.push(where('category_id', '==', categoryId));
      }

      const q = query(articlesCollection, ...constraints);
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      return data as BlogPost[];
    },
  });
};

// Fetch single blog post by slug
export const useBlogPost = (slug: string) => {
  return useQuery({
    queryKey: ['blog-post', slug],
    queryFn: async () => {
      const articlesCollection = collection(db, 'article');
      const q = query(
        articlesCollection,
        where('slug', '==', slug),
        where('published', '==', true),
        where('is_blog_post', '==', true),
        limit(1)
      );
      const snapshot = await getDocs(q);
      if (snapshot.empty) {
        return null;
      }
      const data = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };

      return data as BlogPost;
    },
    enabled: !!slug,
  });
};

// Fetch blog categories
export const useBlogCategories = () => {
  return useQuery({
    queryKey: ['blog-categories'],
    queryFn: async () => {
      const categoriesCollection = collection(db, 'category');
      const q = query(
        categoriesCollection,
        where('is_blog_category', '==', true),
        orderBy('name')
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      return data as BlogCategory[];
    },
  });
};

// Fetch content calendar (admin only)
export const useContentCalendar = () => {
  return useQuery({
    queryKey: ['content-calendar'],
    queryFn: async () => {
      const contentCalendarCollection = collection(db, 'content_calendar');
      const q = query(contentCalendarCollection, orderBy('target_date'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      return data as ContentCalendar[];
    },
  });
};

// Generate content mutation
export const useGenerateContent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ topic, categoryId, keywords, autoPublish }: { 
      topic: string; 
      categoryId: string; 
      keywords: string[];
      autoPublish?: boolean;
    }) => {
      // This needs to be replaced with a Firebase Cloud Function call
      console.log('AI content generation to be implemented with Firebase Cloud Functions');
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
      queryClient.invalidateQueries({ queryKey: ['content-calendar'] });
    },
  });
};

// Featured blog posts
export const useFeaturedPosts = () => {
  return useQuery({
    queryKey: ['featured-blog-posts'],
    queryFn: async () => {
      const articlesCollection = collection(db, 'article');
      const q = query(
        articlesCollection,
        where('published', '==', true),
        where('is_blog_post', '==', true),
        orderBy('published_at', 'desc'),
        limit(6)
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      return data as BlogPost[];
    },
  });
};