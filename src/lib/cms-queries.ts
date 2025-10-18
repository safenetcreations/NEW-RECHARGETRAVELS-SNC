import { collection, query, where, getDocs, doc, getDoc, orderBy, limit, startAt, endAt } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { 
  Destination, 
  Article, 
  Region, 
  Category,
  ItineraryStop,
  MediaItem,
  SearchResult 
} from './firebase-cms';

// Helper function to safely cast category type
const safeCastCategory = (category: any): any => ({
  ...category,
  type: ['theme', 'style'].includes(category.type) ? category.type : 'theme'
});

// Helper function to safely cast article content type
const safeCastArticle = (article: any): any => ({
  ...article,
  content_type: ['guide', 'logistics', 'itinerary', 'festival', 'blog'].includes(article.content_type) 
    ? article.content_type 
    : null
});

// Fetch single destination by slug
export async function getDestination(slug: string, lang = 'en') {
  console.log('Fetching destination with slug:', slug)
  
  const destinationsCollection = collection(db, 'destination');
  const q = query(
    destinationsCollection,
    where('slug', '==', slug),
    where('language', '==', lang),
    where('published', '==', true),
    limit(1)
  );
  const snapshot = await getDocs(q);
  if (snapshot.empty) {
    return null;
  }
  const destination = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Destination;

  // Fetch region
  const regionDoc = doc(db, 'region', destination.region_id);
  const regionSnapshot = await getDoc(regionDoc);
  const region = regionSnapshot.exists() ? { id: regionSnapshot.id, ...regionSnapshot.data() } : null;

  // Fetch categories
  const contentCategoryCollection = collection(db, 'content_category');
  const cq = query(contentCategoryCollection, where('destination_id', '==', destination.id));
  const categorySnapshot = await getDocs(cq);
  const categories = categorySnapshot.docs.map(doc => doc.data());

  return { ...destination, region, categories };
}

// Fetch all destinations with pagination
export async function getDestinations(page = 1, limitVal = 12, regionName?: string, categoryName?: string) {
  console.log('Fetching destinations:', { page, limit: limitVal, region: regionName, category: categoryName })
  
  const destinationsCollection = collection(db, 'destination');
  const q = query(
    destinationsCollection,
    where('published', '==', true),
    orderBy('created_at', 'desc'),
    limit(limitVal)
  );

  // This is a simplified implementation. Filtering by region and category would require more complex queries.

  const snapshot = await getDocs(q);
  const destinations = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  const totalCount = destinations.length;
  return {
    destinations: destinations || [],
    totalCount: totalCount,
    totalPages: Math.ceil(totalCount / limitVal),
    currentPage: page
  }
}

// Fetch single article by slug
export async function getArticle(slug: string, lang = 'en') {
  console.log('Fetching article with slug:', slug)
  
  const articlesCollection = collection(db, 'article');
  const q = query(
    articlesCollection,
    where('slug', '==', slug),
    where('language', '==', lang),
    where('published', '==', true),
    limit(1)
  );
  const snapshot = await getDocs(q);
  if (snapshot.empty) {
    return null;
  }
  const article = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };

  // Fetch region, categories, and itinerary stops similarly to getDestination

  return safeCastArticle(article)
}

// Fetch all articles with pagination
export async function getArticles(page = 1, limitVal = 12, contentType?: string) {
  console.log('Fetching articles:', { page, limit: limitVal, contentType })
  
  const articlesCollection = collection(db, 'article');
  let q = query(
    articlesCollection,
    where('published', '==', true),
    orderBy('created_at', 'desc'),
    limit(limitVal)
  );

  if (contentType) {
    q = query(articlesCollection, where('content_type', '==', contentType));
  }

  const snapshot = await getDocs(q);
  const articles = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  const typedArticles = (articles || []).map(safeCastArticle)
  const totalCount = typedArticles.length;

  return {
    articles: typedArticles,
    totalCount: totalCount,
    totalPages: Math.ceil(totalCount / limitVal),
    currentPage: page
  }
}

// Fetch all regions
export async function getRegions(): Promise<Region[]> {
  console.log('Fetching regions')
  
  const regionsCollection = collection(db, 'region');
  const q = query(regionsCollection, orderBy('name'));
  const snapshot = await getDocs(q);
  const regions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
  return regions as Region[] || []
}

// Fetch all categories
export async function getCategories(): Promise<Category[]> {
  console.log('Fetching categories')
  
  const categoriesCollection = collection(db, 'category');
  const q = query(categoriesCollection, orderBy('name'));
  const snapshot = await getDocs(q);
  const categories = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
  const typedCategories = (categories || []).map(safeCastCategory)
  return typedCategories as Category[]
}

// Fetch featured destinations (latest 6)
export async function getFeaturedDestinations() {
  console.log('Fetching featured destinations')
  
  const destinationsCollection = collection(db, 'destination');
  const q = query(
    destinationsCollection,
    where('published', '==', true),
    orderBy('created_at', 'desc'),
    limit(6)
  );
  const snapshot = await getDocs(q);
  const destinations = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
  return destinations as Destination[] || []
}

// Fetch related destinations by region
export async function getRelatedDestinations(regionId: string, excludeId: string, limitVal = 4) {
  console.log('Fetching related destinations:', { regionId, excludeId, limit: limitVal })
  
  const destinationsCollection = collection(db, 'destination');
  const q = query(
    destinationsCollection,
    where('published', '==', true),
    where('region_id', '==', regionId),
    where('id', '!=', excludeId),
    limit(limitVal)
  );
  const snapshot = await getDocs(q);
  const destinations = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
  return destinations as Destination[] || []
}
