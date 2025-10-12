import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface AboutSriLankaContent {
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  mainDescription: string;
  secondaryDescription: string;
  stats: {
    area: { value: string; label: string; desc: string };
    population: { value: string; label: string; desc: string };
    species: { value: string; label: string; desc: string };
    unesco: { value: string; label: string; desc: string };
  };
  highlights: string[];
  culturalInfo: string;
  naturalInfo: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
}

const defaultContent: AboutSriLankaContent = {
  heroTitle: "The Pearl of the Indian Ocean",
  heroSubtitle: "Discover Sri Lanka's Rich Heritage and Natural Beauty",
  heroImage: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1920",
  mainDescription: "Sri Lanka, a teardrop-shaped island in the Indian Ocean, offers an incredible diversity of experiences within its compact borders. From misty mountains and lush rainforests to golden beaches and ancient ruins, this tropical paradise has captivated travelers for centuries.",
  secondaryDescription: "With a history spanning over 2,500 years, Sri Lanka boasts eight UNESCO World Heritage Sites, a rich cultural tapestry influenced by Buddhism, Hinduism, and colonial heritage, and some of the world's finest tea, spices, and gemstones.",
  stats: {
    area: { value: "65,610", label: "Square Kilometers", desc: "Compact island paradise" },
    population: { value: "22M", label: "Population", desc: "Warm & welcoming people" },
    species: { value: "3,000+", label: "Endemic Species", desc: "Biodiversity hotspot" },
    unesco: { value: "8", label: "UNESCO Sites", desc: "World heritage treasures" }
  },
  highlights: [
    "Ancient Buddhist temples and stupas",
    "Pristine beaches and coral reefs",
    "Misty tea plantations",
    "Wildlife safaris in national parks",
    "Spice gardens and plantations",
    "Colonial architecture",
    "Traditional Ayurvedic treatments",
    "Adventure sports and activities"
  ],
  culturalInfo: "Sri Lanka's cultural heritage is a fascinating blend of indigenous traditions and foreign influences. The island has been a crossroads of trade routes for centuries, resulting in a unique cultural mosaic that includes Buddhist temples, Hindu kovils, Islamic mosques, and Christian churches.",
  naturalInfo: "From the central highlands with their cool climate and tea estates to the coastal plains with palm-fringed beaches, Sri Lanka's diverse geography supports an incredible variety of ecosystems. The island is home to numerous national parks and wildlife sanctuaries.",
  seoTitle: "About Sri Lanka - The Pearl of the Indian Ocean | Recharge Travels",
  seoDescription: "Discover Sri Lanka's rich history, diverse culture, and stunning natural beauty. Learn about the island's UNESCO World Heritage Sites, wildlife, and unique experiences.",
  seoKeywords: "Sri Lanka, travel, tourism, culture, history, UNESCO, wildlife, beaches, temples, tea plantations"
};

export const useAboutSriLankaContent = () => {
  const [content, setContent] = useState<AboutSriLankaContent>(defaultContent);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadContent = async () => {
      try {
        setLoading(true);
        // Try the new pages collection first
        const docRef = doc(db, 'pages', 'about-sri-lanka');
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const pageData = docSnap.data();
          // Convert the new format to the expected format
          if (pageData.sections && pageData.sections.length > 0) {
            // Use the new dynamic content system
            setContent({
              heroTitle: pageData.heroTitle || defaultContent.heroTitle,
              heroSubtitle: pageData.heroSubtitle || defaultContent.heroSubtitle,
              heroImage: pageData.heroImage || defaultContent.heroImage,
              mainDescription: pageData.sections.find((s: any) => s.type === 'text')?.content || defaultContent.mainDescription,
              secondaryDescription: pageData.sections.find((s: any, i: number) => s.type === 'text' && i > 0)?.content || defaultContent.secondaryDescription,
              stats: defaultContent.stats, // Keep default stats for now
              highlights: defaultContent.highlights, // Keep default highlights for now
              culturalInfo: defaultContent.culturalInfo,
              naturalInfo: defaultContent.naturalInfo,
              seoTitle: pageData.metaTitle || defaultContent.seoTitle,
              seoDescription: pageData.metaDescription || defaultContent.seoDescription,
              seoKeywords: pageData.metaKeywords || defaultContent.seoKeywords
            });
          } else {
            // Fallback to default content
            setContent(defaultContent);
          }
        } else {
          // Try the old page-content collection as fallback
          const oldDocRef = doc(db, 'page-content', 'about-sri-lanka');
          const oldDocSnap = await getDoc(oldDocRef);
          
          if (oldDocSnap.exists()) {
            setContent(oldDocSnap.data() as AboutSriLankaContent);
          } else {
            // Use default content if nothing exists
            setContent(defaultContent);
          }
        }
      } catch (err) {
        console.error('Error loading About Sri Lanka content:', err);
        setError('Failed to load content');
        // Fallback to default content on error
        setContent(defaultContent);
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, []);

  return { content, loading, error };
}; 