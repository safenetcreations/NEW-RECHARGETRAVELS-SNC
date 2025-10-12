
import { dbService, authService, storageService } from '@/lib/firebase-services'

// Re-export types from supabase-cms
export type { 
  Destination, 
  Article, 
  Region, 
  Category,
  ItineraryStop,
  MediaItem,
  SearchResult 
} from './supabase-cms'

// Helper function to safely cast category type
const safeCastCategory = (category: any): any => ({
  ...category,
  type: ['theme', 'style'].includes(category.type) ? category.type : 'theme'
})

// Helper function to safely cast article content type
const safeCastArticle = (article: any): any => ({
  ...article,
  content_type: ['guide', 'logistics', 'itinerary', 'festival', 'blog'].includes(article.content_type) 
    ? article.content_type 
    : null
})

// Fetch single destination by slug
export async function getDestination(slug: string, lang = 'en') {
  console.log('Fetching destination with slug:', slug)
  
  const { data, error } = await supabase
    .from('destination')
    .select(`
      *,
      region (*),
      content_category!inner (
        category (*)
      )
    `)
    .eq('slug', slug)
    .eq('language', lang)
    .eq('published', true)
    .single()

  if (error) {
    console.error('Error fetching destination:', error)
    throw error
  }
  
  console.log('Destination data:', data)
  return data
}

// Fetch all destinations with pagination
export async function getDestinations(page = 1, limit = 12, region?: string, category?: string) {
  console.log('Fetching destinations:', { page, limit, region, category })
  
  let query = supabase
    .from('destination')
    .select(`
      *,
      region (*),
      content_category (
        category (*)
      )
    `)
    .eq('published', true)
    .order('created_at', { ascending: false })

  if (region) {
    query = query.eq('region.name', region)
  }

  const from = (page - 1) * limit
  const to = from + limit - 1

  const { data, error } = await query.limit(limit)

  if (error) {
    console.error('Error fetching destinations:', error)
    throw error
  }

  console.log('Destinations data:', { data })

  const totalCount = data?.length || 0;
  return {
    destinations: data || [],
    totalCount: totalCount,
    totalPages: Math.ceil(totalCount / limit),
    currentPage: page
  }
}

// Fetch single article by slug
export async function getArticle(slug: string, lang = 'en') {
  console.log('Fetching article with slug:', slug)
  
  const { data, error } = await supabase
    .from('article')
    .select(`
      *,
      region (*),
      content_category (
        category (*)
      ),
      itinerary_stop (
        *,
        destination (*)
      )
    `)
    .eq('slug', slug)
    .eq('language', lang)
    .eq('published', true)
    .single()

  if (error) {
    console.error('Error fetching article:', error)
    throw error
  }
  
  console.log('Article data:', data)
  return safeCastArticle(data)
}

// Fetch all articles with pagination
export async function getArticles(page = 1, limit = 12, contentType?: string) {
  console.log('Fetching articles:', { page, limit, contentType })
  
  let query = supabase
    .from('article')
    .select(`
      *,
      region (*),
      content_category (
        category (*)
      )
    `)
    .eq('published', true)
    .order('created_at', { ascending: false })

  if (contentType) {
    query = query.eq('content_type', contentType)
  }

  const from = (page - 1) * limit
  const to = from + limit - 1

  const { data, error } = await query.limit(limit)

  if (error) {
    console.error('Error fetching articles:', error)
    throw error
  }

  console.log('Articles data:', { data })

  // Type cast the articles to ensure proper typing
  const typedArticles = (data || []).map(safeCastArticle)
  const totalCount = typedArticles.length;

  return {
    articles: typedArticles,
    totalCount: totalCount,
    totalPages: Math.ceil(totalCount / limit),
    currentPage: page
  }
}

// Fetch all regions
export async function getRegions() {
  console.log('Fetching regions')
  
  const { data, error } = await supabase
    .from('region')
    .select('*')
    .order('name')

  if (error) {
    console.error('Error fetching regions:', error)
    throw error
  }
  
  console.log('Regions data:', data)
  return data || []
}

// Fetch all categories
export async function getCategories() {
  console.log('Fetching categories')
  
  const { data, error } = await supabase
    .from('category')
    .select('*')
    .order('name')

  if (error) {
    console.error('Error fetching categories:', error)
    throw error
  }
  
  console.log('Categories data:', data)
  // Type cast the categories to ensure proper typing
  const typedCategories = (data || []).map(safeCastCategory)
  return typedCategories
}

// Fetch featured destinations (latest 6)
export async function getFeaturedDestinations() {
  console.log('Fetching featured destinations')
  
  const { data, error } = await supabase
    .from('destination')
    .select(`
      *,
      region (*)
    `)
    .eq('published', true)
    .order('created_at', { ascending: false })
    .limit(6)

  if (error) {
    console.error('Error fetching featured destinations:', error)
    throw error
  }
  
  console.log('Featured destinations data:', data)
  return data || []
}

// Fetch related destinations by region
export async function getRelatedDestinations(regionId: string, excludeId: string, limit = 4) {
  console.log('Fetching related destinations:', { regionId, excludeId, limit })
  
  const { data, error } = await supabase
    .from('destination')
    .select(`
      *,
      region (*)
    `)
    .eq('published', true)
    .eq('region_id', regionId)
    .neq('dest_id', excludeId)
    .limit(limit)

  if (error) {
    console.error('Error fetching related destinations:', error)
    throw error
  }
  
  console.log('Related destinations data:', data)
  return data || []
}
