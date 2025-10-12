import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface PageSection {
  id: string;
  type: 'text' | 'image' | 'hero' | 'stats' | 'gallery' | 'cta';
  heading?: string;
  content?: string;
  image?: string;
  imageAlt?: string;
  order: number;
  settings?: Record<string, any>;
}

interface PageContent {
  id: string;
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  heroTitle?: string;
  heroSubtitle?: string;
  heroImage?: string;
  sections: PageSection[];
  status: 'draft' | 'published';
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  language: 'en' | 'si' | 'ta';
  seoData?: {
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
    twitterCard?: string;
  };
}

export const usePageContent = () => {
  const location = useLocation();
  const [content, setContent] = useState<PageContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPageContent = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get the page ID from the current path
        const path = location.pathname;
        let pageId = '';

        // Map common routes to page IDs
        const routeToPageId: Record<string, string> = {
          '/': 'home',
          '/about': 'about',
          '/about/sri-lanka': 'about-sri-lanka',
          '/contact': 'contact',
          '/tours': 'tours',
          '/tours/cultural': 'cultural-tours',
          '/tours/wildtours': 'wildtours',
          '/tours/photography': 'photography',
          '/tours/ramayana-trail': 'ramayana-trail',
          '/tours/ecotourism': 'ecotourism',
          '/tours/beach-tours': 'beach-tours',
          '/tours/hill-country': 'hill-country',
          '/tours/culinary': 'culinary',
          '/tours/honeymoon': 'honeymoon',
          '/tours/wellness': 'wellness',
          '/tours/luxury': 'luxury',
          '/destinations': 'destinations',
          '/destinations/colombo': 'colombo',
          '/destinations/kandy': 'kandy',
          '/destinations/galle': 'galle',
          '/destinations/sigiriya': 'sigiriya',
          '/destinations/ella': 'ella',
          '/destinations/jaffna': 'jaffna',
          '/destinations/nuwaraeliya': 'nuwaraeliya',
          '/destinations/trincomalee': 'trincomalee',
          '/destinations/arugam-bay': 'arugam-bay',
          '/destinations/mirissa': 'mirissa',
          '/destinations/weligama': 'weligama',
          '/destinations/bentota': 'bentota',
          '/destinations/dambulla': 'dambulla',
          '/destinations/hikkaduwa': 'hikkaduwa',
          '/destinations/mannar': 'mannar',
          '/destinations/polonnaruwa': 'polonnaruwa',
          '/destinations/anuradhapura': 'anuradhapura',
          '/destinations/kalpitiya': 'kalpitiya',
          '/destinations/adams-peak': 'adams-peak',
          '/destinations/wadduwa': 'wadduwa',
          '/destinations/matara': 'matara',
          '/destinations/tangalle': 'tangalle',
          '/destinations/negombo': 'negombo',
          '/destinations/badulla': 'badulla',
          '/destinations/ratnapura': 'ratnapura',
          '/destinations/puttalam': 'puttalam',
          '/destinations/hambantota': 'hambantota',
          '/destinations/vavuniya': 'vavuniya',
          '/destinations/kurunegala': 'kurunegala',
          '/destinations/batticaloa': 'batticaloa',
          '/experiences/train-journeys': 'train-journeys',
          '/experiences/tea-trails': 'tea-trails',
          '/experiences/pilgrimage-tours': 'pilgrimage-tours',
          '/experiences/island-getaways': 'island-getaways',
          '/experiences/whale-watching': 'whale-watching',
          '/experiences/sea-cucumber-farming': 'sea-cucumber-farming',
          '/experiences/hikkaduwa-water-sports': 'hikkaduwa-water-sports',
          '/experiences/hot-air-balloon-sigiriya': 'hot-air-balloon-sigiriya',
          '/experiences/kalpitiya-kitesurfing': 'kalpitiya-kitesurfing',
          '/experiences/jungle-camping': 'jungle-camping',
          '/experiences/lagoon-safari': 'lagoon-safari',
          '/experiences/cooking-class-sri-lanka': 'cooking-class',
          '/transport/airport-transfers': 'airport-transfers',
          '/transport/private-tours': 'private-tours',
          '/transport/group-transport': 'group-transport',
          '/hotels': 'hotels',
          '/blog': 'blog',
          '/travel-guide': 'travel-guide',
          '/book-now': 'book-now',
          '/wallet': 'wallet'
        };

        pageId = routeToPageId[path] || '';

        if (!pageId) {
          // Try to extract page ID from dynamic routes
          if (path.startsWith('/destinations/')) {
            const destinationSlug = path.split('/destinations/')[1];
            pageId = destinationSlug;
          } else if (path.startsWith('/experiences/')) {
            const experienceSlug = path.split('/experiences/')[1];
            pageId = experienceSlug;
          } else if (path.startsWith('/tours/')) {
            const tourSlug = path.split('/tours/')[1];
            pageId = tourSlug;
          }
        }

        if (!pageId) {
          setError('Page not found');
          setLoading(false);
          return;
        }

        // Load content from Firestore
        const docRef = doc(db, 'pages', pageId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const pageData = docSnap.data() as PageContent;
          
          // Only show published content
          if (pageData.status === 'published') {
            setContent(pageData);
          } else {
            setError('Page is not published');
          }
        } else {
          setError('Page content not found');
        }
      } catch (err) {
        console.error('Error loading page content:', err);
        setError('Failed to load page content');
      } finally {
        setLoading(false);
      }
    };

    loadPageContent();
  }, [location.pathname]);

  return { content, loading, error };
}; 