
import { useQuery } from '@tanstack/react-query'
import { dbService, authService, storageService } from '@/lib/firebase-services'

export interface Destination {
  dest_id: string
  name: string
  region_id: string
  dest_type: string
  summary: string
  body_md: string
  latitude?: number
  longitude?: number
  slug: string
  meta_title?: string
  meta_description?: string
  og_image_url?: string
  language: string
  published: boolean
  published_at?: string
  region?: {
    name: string
    description: string
  }
  categories?: {
    name: string
    type: string
  }[]
}

export const useDestinations = () => {
  return useQuery({
    queryKey: ['destinations'],
    queryFn: async () => {
      console.log('Fetching destinations from database...')
      
      const { data, error } = await supabase
        .from('destination')
        .select(`
          *,
          region:region_id(name, description),
          categories:content_category(
            category:category_id(name, type)
          )
        `)
        .eq('published', true)
        .order('name')

      if (error) {
        console.error('Error fetching destinations:', error)
        // Return sample destinations if database query fails
        return getSampleDestinations()
      }

      console.log('Destinations fetched:', data)
      
      // Transform the data to match our Destination interface
      const transformedData = (data || []).map((item: any) => ({
        dest_id: item.dest_id,
        name: item.name,
        region_id: item.region_id,
        dest_type: item.dest_type,
        summary: item.summary,
        body_md: item.body_md,
        latitude: item.latitude,
        longitude: item.longitude,
        slug: item.slug,
        meta_title: item.meta_title,
        meta_description: item.meta_description,
        og_image_url: item.og_image_url,
        language: item.language,
        published: item.published,
        published_at: item.published_at,
        region: item.region ? {
          name: item.region.name,
          description: item.region.description
        } : undefined,
        categories: Array.isArray(item.categories) 
          ? item.categories.map((cat: any) => ({
              name: cat.category?.name || '',
              type: cat.category?.type || ''
            })).filter((cat: any) => cat.name) 
          : []
      }))

      return transformedData as Destination[]
    }
  })
}

const getSampleDestinations = (): Destination[] => [
  {
    dest_id: 'sigiriya-rock-fortress',
    name: 'Sigiriya Rock Fortress',
    region_id: 'central-province',
    dest_type: 'Historical Site',
    summary: 'Ancient rock fortress and palace ruins with stunning frescoes and engineering marvels.',
    body_md: '# Sigiriya Rock Fortress\n\nSigiriya, known as the "Lion Rock," is one of Sri Lanka\'s most iconic landmarks...',
    latitude: 7.9569,
    longitude: 80.7598,
    slug: 'sigiriya-rock-fortress',
    meta_title: 'Sigiriya Rock Fortress - Ancient Wonder of Sri Lanka',
    meta_description: 'Explore the magnificent Sigiriya Rock Fortress, a UNESCO World Heritage Site featuring ancient palace ruins, stunning frescoes, and breathtaking views.',
    og_image_url: 'https://images.unsplash.com/photo-1582650625119-3a31f8fa2699?w=800',
    language: 'en',
    published: true,
    region: {
      name: 'Central Province',
      description: 'The cultural heartland with ancient cities and tea country'
    },
    categories: [
      { name: 'Cultural Heritage', type: 'theme' },
      { name: 'Adventure', type: 'theme' }
    ]
  },
  {
    dest_id: 'kandy-temple-tooth',
    name: 'Temple of the Sacred Tooth Relic, Kandy',
    region_id: 'central-province',
    dest_type: 'Religious Site',
    summary: 'Sacred Buddhist temple housing the tooth relic of Buddha, located in the cultural capital of Sri Lanka.',
    body_md: '# Temple of the Sacred Tooth Relic\n\nThe Temple of the Sacred Tooth Relic in Kandy is one of Buddhism\'s most sacred sites...',
    latitude: 7.2934,
    longitude: 80.6350,
    slug: 'kandy-temple-tooth',
    meta_title: 'Temple of the Sacred Tooth Relic, Kandy - Sacred Buddhist Site',
    meta_description: 'Visit the sacred Temple of the Tooth Relic in Kandy, home to Buddha\'s tooth relic and center of Buddhist pilgrimage in Sri Lanka.',
    og_image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800',
    language: 'en',
    published: true,
    region: {
      name: 'Central Province',
      description: 'The cultural heartland with ancient cities and tea country'
    },
    categories: [
      { name: 'Religious Sites', type: 'theme' },
      { name: 'Cultural Heritage', type: 'theme' }
    ]
  },
  {
    dest_id: 'yala-national-park',
    name: 'Yala National Park',
    region_id: 'southern-province',
    dest_type: 'Wildlife Park',
    summary: 'Sri Lanka\'s premier wildlife destination with the highest leopard density in the world.',
    body_md: '# Yala National Park\n\nYala National Park is Sri Lanka\'s most visited and second-largest national park...',
    latitude: 6.3725,
    longitude: 81.5185,
    slug: 'yala-national-park',
    meta_title: 'Yala National Park - Premier Wildlife Safari Destination',
    meta_description: 'Experience incredible wildlife at Yala National Park, home to the world\'s highest leopard density, elephants, and over 200 bird species.',
    og_image_url: 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=800',
    language: 'en',
    published: true,
    region: {
      name: 'Southern Province',
      description: 'Beautiful beaches, colonial heritage, and wildlife'
    },
    categories: [
      { name: 'Wildlife Safari', type: 'theme' },
      { name: 'Nature Parks', type: 'theme' }
    ]
  },
  {
    dest_id: 'galle-dutch-fort',
    name: 'Galle Dutch Fort',
    region_id: 'southern-province',
    dest_type: 'Colonial Heritage',
    summary: 'Best-preserved colonial fortification in Asia, showcasing Dutch colonial architecture and maritime history.',
    body_md: '# Galle Dutch Fort\n\nGalle Fort is a UNESCO World Heritage Site and the best example of a fortified city...',
    latitude: 6.0259,
    longitude: 80.2168,
    slug: 'galle-dutch-fort',
    meta_title: 'Galle Dutch Fort - UNESCO World Heritage Colonial Fortress',
    meta_description: 'Explore the magnificent Galle Dutch Fort, a UNESCO World Heritage Site showcasing the best-preserved European colonial architecture in Asia.',
    og_image_url: 'https://images.unsplash.com/photo-1566552881560-0be862a7c445?w=800',
    language: 'en',
    published: true,
    region: {
      name: 'Southern Province',
      description: 'Beautiful beaches, colonial heritage, and wildlife'
    },
    categories: [
      { name: 'Colonial Heritage', type: 'theme' },
      { name: 'Cultural Heritage', type: 'theme' }
    ]
  },
  {
    dest_id: 'ella-mountain-town',
    name: 'Ella Mountain Town',
    region_id: 'uva-province',
    dest_type: 'Hill Station',
    summary: 'Charming mountain town with hiking trails, waterfalls, and panoramic views of tea-covered hills.',
    body_md: '# Ella - Mountain Paradise\n\nElla is a small mountain town that has captured the hearts of travelers worldwide...',
    latitude: 6.8667,
    longitude: 81.0461,
    slug: 'ella-mountain-town',
    meta_title: 'Ella Mountain Town - Hiking Paradise',
    meta_description: 'Discover Ella, Sri Lanka\'s favorite mountain town with incredible hiking trails, scenic train rides, and breathtaking views.',
    og_image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    language: 'en',
    published: true,
    region: {
      name: 'Uva Province',
      description: 'Hill country and tea plantations'
    },
    categories: [
      { name: 'Hill Country', type: 'theme' },
      { name: 'Adventure', type: 'theme' }
    ]
  },
  {
    dest_id: 'mirissa-beach',
    name: 'Mirissa Beach',
    region_id: 'southern-province',
    dest_type: 'Beach Destination',
    summary: 'Stunning crescent-shaped beach famous for whale watching, surfing, and pristine golden sands.',
    body_md: '# Mirissa Beach\n\nMirissa is one of Sri Lanka\'s most beautiful beaches...',
    latitude: 5.9486,
    longitude: 80.4617,
    slug: 'mirissa-beach',
    meta_title: 'Mirissa Beach - Whale Watching Paradise',
    meta_description: 'Experience the magic of Mirissa Beach with world-class whale watching, perfect surfing conditions, and breathtaking sunsets.',
    og_image_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800',
    language: 'en',
    published: true,
    region: {
      name: 'Southern Province',
      description: 'Beautiful beaches, colonial heritage, and wildlife'
    },
    categories: [
      { name: 'Beaches', type: 'theme' },
      { name: 'Wildlife Safari', type: 'theme' }
    ]
  }
]
