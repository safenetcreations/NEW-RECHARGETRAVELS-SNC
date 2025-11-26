export interface Destination {
  id: string;
  name: string;
  description: string;
  image: string;
  slug: string;
  language: string;
  published: boolean;
  created_at: string;
  region_id: string;
}

export interface Article {
  id: string;
  title: string;
  body_md: string;
  og_image_url: string;
  published_at: string;
  updated_at: string;
  slug: string;
  language: string;
  published: boolean;
  created_at: string;
  content_type: string;
  region: any;
  content_category: any;
  itinerary_stop: any;
  meta_title: string;
  meta_description: string;
}

export interface Region {
  id: string;
  name: string;
}

export interface Category {
  id: string;
  name: string;
  type: string;
}

export interface ItineraryStop {
  id: string;
  // Add other properties as needed
}

export interface MediaItem {
  id: string;
  // Add other properties as needed
}

export interface SearchResult {
  id: string;
  // Add other properties as needed
}
