
import { dbService, authService, storageService } from '@/lib/firebase-services'

export interface SearchFilters {
  regions: string[]
  categories: string[]
  contentType: 'all' | 'destination' | 'article'
}

export interface SearchResult {
  content_id: string
  content_type: 'destination' | 'article'
  title: string
  summary: string | null
  body_md: string | null
  region_id: string | null
  slug: string | null
  published: boolean
  rank?: number
}

export interface SearchResponse {
  results: SearchResult[]
  totalCount: number
  hasMore: boolean
}

export async function searchContent(
  query: string = '',
  filters: SearchFilters = { regions: [], categories: [], contentType: 'all' },
  page: number = 1,
  limit: number = 20
): Promise<SearchResponse> {
  const offset = (page - 1) * limit

  try {
    console.log('Starting search with:', { query, filters, page, limit })

    // Try to use the edge function first
    const searchParams = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString()
    })

    if (query) {
      searchParams.set('q', query)
    }

    if (filters.contentType !== 'all') {
      searchParams.set('content_type', filters.contentType)
    }

    if (filters.regions.length > 0) {
      searchParams.set('region_ids', filters.regions.join(','))
    }

    if (filters.categories.length > 0) {
      searchParams.set('category_ids', filters.categories.join(','))
    }

    const response = await fetch(
      `https://nqnnsqbeyjeuyvwsywyc.supabase.co/functions/v1/cms-search?${searchParams.toString()}`,
      {
        headers: {
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5xbm5zcWJleWpldXl2d3N5d3ljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5MTIwOTksImV4cCI6MjA2NTQ4ODA5OX0.V0VVxenUTTZaRwgCmrV33EXEVGsq8-b_nW0As07flgk`,
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5xbm5zcWJleWpldXl2d3N5d3ljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5MTIwOTksImV4cCI6MjA2NTQ4ODA5OX0.V0VVxenUTTZaRwgCmrV33EXEVGsq8-b_nW0As07flgk'
        }
      }
    )

    if (!response.ok) {
      console.warn(`Search function failed: ${response.statusText}, falling back to direct database query`)
      throw new Error(`Search request failed: ${response.statusText}`)
    }

    const data = await response.json()
    console.log('Search function response:', data)
    return data

  } catch (error) {
    console.error('Search function error, using fallback:', error)

    // Fallback: Return empty results if API fails
    return {
      results: [],
      totalCount: 0,
      hasMore: false
    }

    /* Fallback to direct database queries - disabled for now
    let query_builder = dbService.list('search_view').select('*').eq('published', true)
    
    // Apply text search if query provided
    if (query) {
      query_builder = query_builder.textSearch('tsv', query)
    }
    
    if (filters.contentType !== 'all') {
      query_builder = query_builder.eq('content_type', filters.contentType)
    }

    if (filters.regions.length > 0) {
      query_builder = query_builder.in('region_id', filters.regions)
    }

    // Get the actual data with pagination
    const { data, error: dbError } = await query_builder
      .limit(limit)

    if (dbError) {
      console.error('Database fallback error:', dbError)
      throw dbError
    }

    console.log('Fallback database query results:', data)

    // Type cast the results to match our SearchResult interface
    const typedResults: SearchResult[] = (data || []).map(item => ({
      ...item,
      content_type: item.content_type as 'destination' | 'article'
    }))

    return {
      results: typedResults,
      totalCount: typedResults.length,
      hasMore: (data?.length || 0) === limit
    }
    */
  }
}
