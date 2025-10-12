import { dbService, authService, storageService } from '@/lib/firebase-services';

// Export types
export interface Destination {
  id: string;
  dest_id: string;
  name: string;
  description?: string;
  region?: { name: string };
  region_id?: string;
  dest_type?: string;
  summary?: string;
  is_featured?: boolean;
  slug?: string;
  og_image_url?: string;
  created_at?: string;
  latitude?: number;
  longitude?: number;
  body_md?: string;
}

export interface Region {
  id: string;
  region_id: string;
  name: string;
}

export interface Category {
  id: string;
  category_id: string;
  name: string;
  type?: string;
}

export interface Article {
  id: string;
  article_id: string;
  title: string;
  content_type?: string;
  summary?: string;
  created_at?: string;
}

export const cmsQueries = {
  // Get destinations with pagination
  getDestinations: async (from = 0, to = 9, region?: string): Promise<{ data: Destination[], error: Error | null, count: number }> => {
    try {
      const filters = region ? [{ field: 'region.name', operator: '==', value: region }] : [];
      const data = await dbService.list('destination', filters);

      return { 
        data: (data as Destination[]).slice(from, to), 
        error: null, 
        count: data.length 
      };
    } catch (error) {
      return { data: [], error: error as Error, count: 0 };
    }
  },

    // Get articles with pagination
    getArticles: async (from = 0, to = 9, contentType?: string): Promise<{ data: Article[], error: Error | null, count: number }> => {
      try {
        const filters = contentType ? [{ field: 'content_type', operator: '==', value: contentType }] : [];
        const data = await dbService.list('article', filters);
  
        return { 
          data: (data as Article[]).slice(from, to), 
          error: null, 
          count: data.length 
        };
      } catch (error) {
        return { data: [], error: error as Error, count: 0 };
      }
    },
  // Get regions
  getRegions: async (): Promise<{ data: Region[], error: Error | null }> => {
    try {
      const data = await dbService.list('region');
      return { data: data as Region[], error: null };
    } catch (error) {
      return { data: [], error: error as Error };
    }
  },

  // Get categories
  getCategories: async (): Promise<{ data: Category[], error: Error | null }> => {
    try {
      const data = await dbService.list('category');
      return { data: data as Category[], error: null };
    } catch (error) {
      return { data: [], error: error as Error };
    }
  },

  // Get featured content
  getFeaturedContent: async (): Promise<{ data: Destination[], error: Error | null }> => {
    try {
      const data = await dbService.list('destination', [{ field: 'is_featured', operator: '==', value: true }], undefined, 6);
      return { data: data as Destination[], error: null };
    } catch (error) {
      return { data: [], error: error as Error };
    }
  },

  // Get content by ID
  getContentById: async <T>(table: string, id: string): Promise<{ data: T | null, error: Error | null }> => {
    try {
      const data = await dbService.get(table, id);
      return { data: data as T | null, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }
};

// Export individual functions
export const getFeaturedDestinations = cmsQueries.getFeaturedContent;
export const getRegions = cmsQueries.getRegions;
export const getCategories = cmsQueries.getCategories;