import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { collection, query, where, getDocs, doc, getDoc, orderBy, limit, QueryConstraint } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  body_md?: string;
  excerpt?: string;
  featured_image?: string;
  featuredImage?: string;
  author: string | {
    name: string;
    avatar?: string;
    bio?: string;
  };
  reading_time?: number;
  readingTime?: number;
  status: 'draft' | 'published' | 'scheduled';
  published_at?: string;
  publishedAt?: any;
  created_at?: string;
  createdAt?: any;
  updated_at?: string;
  updatedAt?: any;
  category?: {
    id: string;
    name: string;
    seo_keywords?: string[];
  };
  tags?: string[];
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
  podcast_episode?: {
    audio_url: string;
    duration_seconds?: number;
  };
  viewCount?: number;
  aiGenerated?: boolean;
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  color?: string;
  postCount?: number;
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

// Collection names - matching blogService.ts and BlogEditor.tsx
const BLOGS_COLLECTION = 'blogs';
const CATEGORIES_COLLECTION = 'blog_categories';

// Fetch published blog posts from 'blogs' collection
export const useBlogPosts = (categoryId?: string) => {
  return useQuery({
    queryKey: ['blog-posts', categoryId],
    queryFn: async () => {
      const blogsCollection = collection(db, BLOGS_COLLECTION);
      const constraints: QueryConstraint[] = [
        where('status', '==', 'published'),
        orderBy('publishedAt', 'desc')
      ];

      if (categoryId) {
        constraints.splice(1, 0, where('category.id', '==', categoryId));
      }

      const q = query(blogsCollection, ...constraints);
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
      const blogsCollection = collection(db, BLOGS_COLLECTION);
      const q = query(
        blogsCollection,
        where('slug', '==', slug),
        where('status', '==', 'published'),
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
      const categoriesCollection = collection(db, CATEGORIES_COLLECTION);
      const q = query(categoriesCollection, orderBy('name'));
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
      const blogsCollection = collection(db, BLOGS_COLLECTION);
      const q = query(
        blogsCollection,
        where('status', '==', 'published'),
        orderBy('publishedAt', 'desc'),
        limit(6)
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      return data as BlogPost[];
    },
  });
};
