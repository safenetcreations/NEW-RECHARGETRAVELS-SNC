/**
 * Blog Service - Public blog operations
 * Handles fetching and displaying blog posts
 */

import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
  orderBy,
  limit,
  startAfter,
  QueryConstraint,
  DocumentSnapshot,
  updateDoc,
  increment
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featuredImage?: string;
  category: {
    id: string;
    name: string;
  };
  tags: string[];
  author: {
    name: string;
    avatar?: string;
    bio?: string;
  };
  status: 'draft' | 'published' | 'scheduled';
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  readingTime: number;
  viewCount: number;
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
    ogImage?: string;
    canonicalUrl?: string;
  };
  aiGenerated: boolean;
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  color?: string;
  postCount: number;
}

export interface PaginatedResult<T> {
  items: T[];
  lastDoc: DocumentSnapshot | null;
  hasMore: boolean;
}

// Collection names
const BLOGS_COLLECTION = 'blogs';
const CATEGORIES_COLLECTION = 'blog_categories';

/**
 * Fetch published blog posts with pagination
 */
export async function fetchBlogPosts(
  categoryId?: string,
  pageSize: number = 12,
  lastDoc?: DocumentSnapshot
): Promise<PaginatedResult<BlogPost>> {
  const constraints: QueryConstraint[] = [
    where('status', '==', 'published'),
    orderBy('publishedAt', 'desc'),
    limit(pageSize + 1) // Fetch one extra to check if there are more
  ];

  if (categoryId) {
    constraints.splice(1, 0, where('category.id', '==', categoryId));
  }

  if (lastDoc) {
    constraints.push(startAfter(lastDoc));
  }

  const q = query(collection(db, BLOGS_COLLECTION), ...constraints);
  const snapshot = await getDocs(q);

  const items = snapshot.docs.slice(0, pageSize).map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as BlogPost[];

  return {
    items,
    lastDoc: snapshot.docs[pageSize - 1] || null,
    hasMore: snapshot.docs.length > pageSize
  };
}

/**
 * Fetch a single blog post by slug
 */
export async function fetchBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const q = query(
    collection(db, BLOGS_COLLECTION),
    where('slug', '==', slug),
    where('status', '==', 'published'),
    limit(1)
  );

  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    return null;
  }

  return {
    id: snapshot.docs[0].id,
    ...snapshot.docs[0].data()
  } as BlogPost;
}

/**
 * Fetch a single blog post by ID
 */
export async function fetchBlogPostById(id: string): Promise<BlogPost | null> {
  const docRef = doc(db, BLOGS_COLLECTION, id);
  const snapshot = await getDoc(docRef);

  if (!snapshot.exists()) {
    return null;
  }

  return {
    id: snapshot.id,
    ...snapshot.data()
  } as BlogPost;
}

/**
 * Increment view count for a blog post
 */
export async function incrementViewCount(postId: string): Promise<void> {
  const docRef = doc(db, BLOGS_COLLECTION, postId);
  await updateDoc(docRef, {
    viewCount: increment(1)
  });
}

/**
 * Fetch all blog categories
 */
export async function fetchBlogCategories(): Promise<BlogCategory[]> {
  const q = query(
    collection(db, CATEGORIES_COLLECTION),
    orderBy('name', 'asc')
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as BlogCategory[];
}

/**
 * Fetch featured/latest blog posts
 */
export async function fetchFeaturedPosts(count: number = 6): Promise<BlogPost[]> {
  const q = query(
    collection(db, BLOGS_COLLECTION),
    where('status', '==', 'published'),
    orderBy('publishedAt', 'desc'),
    limit(count)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as BlogPost[];
}

/**
 * Fetch related posts by category
 */
export async function fetchRelatedPosts(
  currentPostId: string,
  categoryId: string,
  count: number = 3
): Promise<BlogPost[]> {
  const q = query(
    collection(db, BLOGS_COLLECTION),
    where('status', '==', 'published'),
    where('category.id', '==', categoryId),
    orderBy('publishedAt', 'desc'),
    limit(count + 1) // Fetch one extra in case current post is included
  );

  const snapshot = await getDocs(q);

  return snapshot.docs
    .filter(doc => doc.id !== currentPostId)
    .slice(0, count)
    .map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as BlogPost[];
}

/**
 * Search blog posts
 */
export async function searchBlogPosts(
  searchTerm: string,
  pageSize: number = 12
): Promise<BlogPost[]> {
  // Note: Firestore doesn't support full-text search natively
  // For production, consider using Algolia, Elasticsearch, or Firebase Extensions
  // This is a simple title-based search

  const q = query(
    collection(db, BLOGS_COLLECTION),
    where('status', '==', 'published'),
    orderBy('publishedAt', 'desc'),
    limit(100) // Fetch more and filter client-side
  );

  const snapshot = await getDocs(q);
  const searchLower = searchTerm.toLowerCase();

  const results = snapshot.docs
    .map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    .filter((post: any) =>
      post.title?.toLowerCase().includes(searchLower) ||
      post.excerpt?.toLowerCase().includes(searchLower) ||
      post.tags?.some((tag: string) => tag.toLowerCase().includes(searchLower))
    )
    .slice(0, pageSize) as BlogPost[];

  return results;
}

/**
 * Calculate reading time from content
 */
export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

/**
 * Generate slug from title
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}
