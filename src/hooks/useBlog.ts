import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dbService, authService, storageService } from '@/lib/firebase-services';

export interface BlogPost {
  article_id: string;
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
    category_id: string;
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
  category_id: string;
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
      let query = supabase
        .from('article')
        .select(`
          *,
          category:category_id (
            category_id,
            name,
            type,
            description,
            seo_keywords
          ),
          podcast_episode:podcast_episodes (
            id,
            audio_url,
            duration_seconds,
            status
          )
        `)
        .eq('published', true)
        .eq('is_blog_post', true)
        .order('published_at', { ascending: false });

      if (categoryId) {
        query = query.eq('category_id', categoryId);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return data as BlogPost[];
    },
  });
};

// Fetch single blog post by slug
export const useBlogPost = (slug: string) => {
  return useQuery({
    queryKey: ['blog-post', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('article')
        .select(`
          *,
          category:category_id (
            category_id,
            name,
            type,
            description,
            seo_keywords
          ),
          podcast_episode:podcast_episodes (
            id,
            audio_url,
            duration_seconds,
            status
          )
        `)
        .eq('slug', slug)
        .eq('published', true)
        .eq('is_blog_post', true)
        .single();
      
      if (error) throw error;
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
      const { data, error } = await supabase
        .from('category')
        .select('*')
        .eq('is_blog_category', true)
        .order('name');
      
      if (error) throw error;
      return data as BlogCategory[];
    },
  });
};

// Fetch content calendar (admin only)
export const useContentCalendar = () => {
  return useQuery({
    queryKey: ['content-calendar'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('content_calendar')
        .select(`
          *,
          category:category_id (
            category_id,
            name,
            type
          )
        `)
        .order('target_date');
      
      if (error) throw error;
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
      const { data, error } = await supabase.functions.invoke('generate-blog-content', {
        body: { topic, categoryId, keywords, autoPublish }
      });
      
      if (error) throw error;
      return data;
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
      const { data, error } = await supabase
        .from('article')
        .select(`
          *,
          category:category_id (
            category_id,
            name,
            type,
            description
          )
        `)
        .eq('published', true)
        .eq('is_blog_post', true)
        .order('published_at', { ascending: false })
        .limit(6);
      
      if (error) throw error;
      return data as BlogPost[];
    },
  });
};