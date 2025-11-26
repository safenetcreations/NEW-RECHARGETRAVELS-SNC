import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { doc, getDoc, setDoc, collection, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { 
  Save, 
  Plus, 
  Trash2, 
  Edit, 
  Eye, 
  Upload,
  FileText,
  Image,
  Globe,
  Settings,
  Search,
  Filter,
  Calendar,
  User
} from 'lucide-react';
import RichTextEditor from './RichTextEditor';
import ImageUploader from './ImageUploader';

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

interface WebsitePage {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: 'main' | 'tours' | 'destinations' | 'experiences' | 'about' | 'contact';
  status: 'draft' | 'published';
  lastUpdated: string;
}

const defaultPageContent: PageContent = {
  id: '',
  slug: '',
  title: '',
  metaTitle: '',
  metaDescription: '',
  metaKeywords: '',
  heroTitle: '',
  heroSubtitle: '',
  heroImage: '',
  sections: [],
  status: 'draft',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  createdBy: '',
  language: 'en',
  seoData: {}
};

const websitePages: WebsitePage[] = [
  // Main Pages
  { id: 'home', slug: '/', title: 'Homepage', description: 'Main landing page', category: 'main', status: 'published', lastUpdated: '' },
  { id: 'about', slug: '/about', title: 'About Us', description: 'Company information', category: 'about', status: 'published', lastUpdated: '' },
  { id: 'about-sri-lanka', slug: '/about/sri-lanka', title: 'About Sri Lanka', description: 'Sri Lanka information', category: 'about', status: 'published', lastUpdated: '' },
  { id: 'contact', slug: '/contact', title: 'Contact Us', description: 'Contact information', category: 'contact', status: 'published', lastUpdated: '' },
  
  // Tours
  { id: 'tours', slug: '/tours', title: 'All Tours', description: 'Tour packages overview', category: 'tours', status: 'published', lastUpdated: '' },
  { id: 'cultural-tours', slug: '/tours/cultural', title: 'Cultural Tours', description: 'Cultural tour packages', category: 'tours', status: 'published', lastUpdated: '' },
  { id: 'wildtours', slug: '/tours/wildtours', title: 'Wildlife Tours', description: 'Wildlife tour packages', category: 'tours', status: 'published', lastUpdated: '' },
  { id: 'photography', slug: '/tours/photography', title: 'Photography Tours', description: 'Photography tour packages', category: 'tours', status: 'published', lastUpdated: '' },
  { id: 'ramayana-trail', slug: '/tours/ramayana-trail', title: 'Ramayana Trail', description: 'Ramayana trail tours', category: 'tours', status: 'published', lastUpdated: '' },
  { id: 'ecotourism', slug: '/tours/ecotourism', title: 'Ecotourism', description: 'Eco-friendly tours', category: 'tours', status: 'published', lastUpdated: '' },
  { id: 'beach-tours', slug: '/tours/beach-tours', title: 'Beach Tours', description: 'Beach destination tours', category: 'tours', status: 'published', lastUpdated: '' },
  { id: 'hill-country', slug: '/tours/hill-country', title: 'Hill Country Tours', description: 'Hill country tours', category: 'tours', status: 'published', lastUpdated: '' },
  { id: 'culinary', slug: '/tours/culinary', title: 'Culinary Tours', description: 'Food and cooking tours', category: 'tours', status: 'published', lastUpdated: '' },
  { id: 'honeymoon', slug: '/tours/honeymoon', title: 'Honeymoon Tours', description: 'Romantic honeymoon packages', category: 'tours', status: 'published', lastUpdated: '' },
  { id: 'wellness', slug: '/tours/wellness', title: 'Wellness Packages', description: 'Health and wellness tours', category: 'tours', status: 'published', lastUpdated: '' },
  { id: 'luxury', slug: '/tours/luxury', title: 'Luxury Tours', description: 'Premium luxury tours', category: 'tours', status: 'published', lastUpdated: '' },
  
  // Destinations
  { id: 'destinations', slug: '/destinations', title: 'All Destinations', description: 'Destination overview', category: 'destinations', status: 'published', lastUpdated: '' },
  { id: 'colombo', slug: '/destinations/colombo', title: 'Colombo', description: 'Capital city guide', category: 'destinations', status: 'published', lastUpdated: '' },
  { id: 'kandy', slug: '/destinations/kandy', title: 'Kandy', description: 'Cultural capital', category: 'destinations', status: 'published', lastUpdated: '' },
  { id: 'galle', slug: '/destinations/galle', title: 'Galle', description: 'Historic fort city', category: 'destinations', status: 'published', lastUpdated: '' },
  { id: 'sigiriya', slug: '/destinations/sigiriya', title: 'Sigiriya', description: 'Ancient rock fortress', category: 'destinations', status: 'published', lastUpdated: '' },
  { id: 'ella', slug: '/destinations/ella', title: 'Ella', description: 'Hill country paradise', category: 'destinations', status: 'published', lastUpdated: '' },
  { id: 'jaffna', slug: '/destinations/jaffna', title: 'Jaffna', description: 'Northern cultural hub', category: 'destinations', status: 'published', lastUpdated: '' },
  { id: 'nuwaraeliya', slug: '/destinations/nuwaraeliya', title: 'Nuwara Eliya', description: 'Little England', category: 'destinations', status: 'published', lastUpdated: '' },
  { id: 'trincomalee', slug: '/destinations/trincomalee', title: 'Trincomalee', description: 'Eastern beach paradise', category: 'destinations', status: 'published', lastUpdated: '' },
  { id: 'arugam-bay', slug: '/destinations/arugam-bay', title: 'Arugam Bay', description: 'Surfing destination', category: 'destinations', status: 'published', lastUpdated: '' },
  { id: 'mirissa', slug: '/destinations/mirissa', title: 'Mirissa', description: 'Whale watching paradise', category: 'destinations', status: 'published', lastUpdated: '' },
  { id: 'weligama', slug: '/destinations/weligama', title: 'Weligama', description: 'Fishing village charm', category: 'destinations', status: 'published', lastUpdated: '' },
  { id: 'bentota', slug: '/destinations/bentota', title: 'Bentota', description: 'River and beach resort', category: 'destinations', status: 'published', lastUpdated: '' },
  { id: 'dambulla', slug: '/destinations/dambulla', title: 'Dambulla', description: 'Cave temple complex', category: 'destinations', status: 'published', lastUpdated: '' },
  { id: 'hikkaduwa', slug: '/destinations/hikkaduwa', title: 'Hikkaduwa', description: 'Coral reef paradise', category: 'destinations', status: 'published', lastUpdated: '' },
  { id: 'mannar', slug: '/destinations/mannar', title: 'Mannar', description: 'Island bridge destination', category: 'destinations', status: 'published', lastUpdated: '' },
  { id: 'polonnaruwa', slug: '/destinations/polonnaruwa', title: 'Polonnaruwa', description: 'Ancient kingdom ruins', category: 'destinations', status: 'published', lastUpdated: '' },
  { id: 'anuradhapura', slug: '/destinations/anuradhapura', title: 'Anuradhapura', description: 'Sacred city', category: 'destinations', status: 'published', lastUpdated: '' },
  { id: 'kalpitiya', slug: '/destinations/kalpitiya', title: 'Kalpitiya', description: 'Kite surfing destination', category: 'destinations', status: 'published', lastUpdated: '' },
  { id: 'adams-peak', slug: '/destinations/adams-peak', title: 'Adam\'s Peak', description: 'Sacred mountain', category: 'destinations', status: 'published', lastUpdated: '' },
  { id: 'wadduwa', slug: '/destinations/wadduwa', title: 'Wadduwa', description: 'Beach resort town', category: 'destinations', status: 'published', lastUpdated: '' },
  { id: 'matara', slug: '/destinations/matara', title: 'Matara', description: 'Southern coastal city', category: 'destinations', status: 'published', lastUpdated: '' },
  { id: 'tangalle', slug: '/destinations/tangalle', title: 'Tangalle', description: 'Peaceful beach town', category: 'destinations', status: 'published', lastUpdated: '' },
  { id: 'negombo', slug: '/destinations/negombo', title: 'Negombo', description: 'Fishing town near airport', category: 'destinations', status: 'published', lastUpdated: '' },
  { id: 'badulla', slug: '/destinations/badulla', title: 'Badulla', description: 'Uva province capital', category: 'destinations', status: 'published', lastUpdated: '' },
  { id: 'ratnapura', slug: '/destinations/ratnapura', title: 'Ratnapura', description: 'Gem city', category: 'destinations', status: 'published', lastUpdated: '' },
  { id: 'puttalam', slug: '/destinations/puttalam', title: 'Puttalam', description: 'Northwestern coastal town', category: 'destinations', status: 'published', lastUpdated: '' },
  { id: 'hambantota', slug: '/destinations/hambantota', title: 'Hambantota', description: 'Southern port city', category: 'destinations', status: 'published', lastUpdated: '' },
  { id: 'vavuniya', slug: '/destinations/vavuniya', title: 'Vavuniya', description: 'Northern town', category: 'destinations', status: 'published', lastUpdated: '' },
  { id: 'kurunegala', slug: '/destinations/kurunegala', title: 'Kurunegala', description: 'Northwestern capital', category: 'destinations', status: 'published', lastUpdated: '' },
  { id: 'batticaloa', slug: '/destinations/batticaloa', title: 'Batticaloa', description: 'Eastern coastal city', category: 'destinations', status: 'published', lastUpdated: '' },
  
  // Experiences
  { id: 'train-journeys', slug: '/experiences/train-journeys', title: 'Train Journeys', description: 'Scenic train experiences', category: 'experiences', status: 'published', lastUpdated: '' },
  { id: 'tea-trails', slug: '/experiences/tea-trails', title: 'Tea Trails', description: 'Tea plantation experiences', category: 'experiences', status: 'published', lastUpdated: '' },
  { id: 'pilgrimage-tours', slug: '/experiences/pilgrimage-tours', title: 'Pilgrimage Tours', description: 'Religious pilgrimage experiences', category: 'experiences', status: 'published', lastUpdated: '' },
  { id: 'island-getaways', slug: '/experiences/island-getaways', title: 'Island Getaways', description: 'Island escape experiences', category: 'experiences', status: 'published', lastUpdated: '' },
  { id: 'whale-watching', slug: '/experiences/whale-watching', title: 'Whale Watching', description: 'Marine wildlife experiences', category: 'experiences', status: 'published', lastUpdated: '' },
  { id: 'sea-cucumber-farming', slug: '/experiences/sea-cucumber-farming', title: 'Sea Cucumber Farming', description: 'Aquaculture experiences', category: 'experiences', status: 'published', lastUpdated: '' },
  { id: 'hikkaduwa-water-sports', slug: '/experiences/hikkaduwa-water-sports', title: 'Hikkaduwa Water Sports', description: 'Water sports activities', category: 'experiences', status: 'published', lastUpdated: '' },
  { id: 'hot-air-balloon-sigiriya', slug: '/experiences/hot-air-balloon-sigiriya', title: 'Hot Air Balloon Sigiriya', description: 'Aerial experiences', category: 'experiences', status: 'published', lastUpdated: '' },
  { id: 'kalpitiya-kitesurfing', slug: '/experiences/kalpitiya-kitesurfing', title: 'Kalpitiya Kitesurfing', description: 'Kite surfing experiences', category: 'experiences', status: 'published', lastUpdated: '' },
  { id: 'jungle-camping', slug: '/experiences/jungle-camping', title: 'Jungle Camping', description: 'Wilderness camping experiences', category: 'experiences', status: 'published', lastUpdated: '' },
  { id: 'lagoon-safari', slug: '/experiences/lagoon-safari', title: 'Lagoon Safari', description: 'Water safari experiences', category: 'experiences', status: 'published', lastUpdated: '' },
  { id: 'cooking-class', slug: '/experiences/cooking-class-sri-lanka', title: 'Cooking Class', description: 'Culinary learning experiences', category: 'experiences', status: 'published', lastUpdated: '' },
  
  // Transport
  { id: 'airport-transfers', slug: '/transport/airport-transfers', title: 'Airport Transfers', description: 'Airport transportation services', category: 'main', status: 'published', lastUpdated: '' },
  { id: 'private-tours', slug: '/transport/private-tours', title: 'Private Tours', description: 'Private transportation services', category: 'main', status: 'published', lastUpdated: '' },
  { id: 'group-transport', slug: '/transport/group-transport', title: 'Group Transport', description: 'Group transportation services', category: 'main', status: 'published', lastUpdated: '' },
  
  // Other Pages
  { id: 'hotels', slug: '/hotels', title: 'Hotels', description: 'Accommodation listings', category: 'main', status: 'published', lastUpdated: '' },
  { id: 'blog', slug: '/blog', title: 'Blog', description: 'Travel blog and articles', category: 'main', status: 'published', lastUpdated: '' },
  { id: 'travel-guide', slug: '/travel-guide', title: 'Travel Guide', description: 'Comprehensive travel guide', category: 'main', status: 'published', lastUpdated: '' },
  { id: 'book-now', slug: '/book-now', title: 'Book Now', description: 'Booking page', category: 'main', status: 'published', lastUpdated: '' },
  { id: 'wallet', slug: '/wallet', title: 'Wallet', description: 'User wallet and transactions', category: 'main', status: 'published', lastUpdated: '' }
];

const PageManagementSystem: React.FC = () => {
  const [pages, setPages] = useState<WebsitePage[]>(websitePages);
  const [selectedPage, setSelectedPage] = useState<WebsitePage | null>(null);
  const [pageContent, setPageContent] = useState<PageContent>(defaultPageContent);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [editingSection, setEditingSection] = useState<PageSection | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadPagesData();
  }, []);

  const loadPagesData = async () => {
    setLoading(true);
    try {
      const pagesCollection = collection(db, 'pages');
      const pagesSnapshot = await getDocs(pagesCollection);
      const pagesData = pagesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as PageContent[];

      // Update website pages with last updated times
      const updatedPages = websitePages.map(page => {
        const pageData = pagesData.find(p => p.slug === page.slug);
        return {
          ...page,
          lastUpdated: pageData?.updatedAt || 'Never'
        };
      });
      setPages(updatedPages);
    } catch (error) {
      console.error('Error loading pages:', error);
      toast({
        title: "Error",
        description: "Failed to load pages data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadPageContent = async (page: WebsitePage) => {
    setLoading(true);
    try {
      const docRef = doc(db, 'pages', page.id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        setPageContent(docSnap.data() as PageContent);
      } else {
        // Create default content for new page
        const newContent: PageContent = {
          ...defaultPageContent,
          id: page.id,
          slug: page.slug,
          title: page.title,
          metaTitle: `${page.title} | Recharge Travels`,
          metaDescription: page.description,
          createdBy: 'admin',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        setPageContent(newContent);
      }
      setSelectedPage(page);
    } catch (error) {
      console.error('Error loading page content:', error);
      toast({
        title: "Error",
        description: "Failed to load page content",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const savePageContent = async () => {
    setSaving(true);
    try {
      const updatedContent = {
        ...pageContent,
        updatedAt: new Date().toISOString()
      };
      
      const docRef = doc(db, 'pages', pageContent.id);
      await setDoc(docRef, updatedContent);
      
      toast({
        title: "Success",
        description: "Page content saved successfully!"
      });
      
      // Update the pages list
      loadPagesData();
    } catch (error) {
      console.error('Error saving page content:', error);
      toast({
        title: "Error",
        description: "Failed to save page content",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const addSection = (type: PageSection['type']) => {
    const newSection: PageSection = {
      id: `section-${Date.now()}`,
      type,
      heading: '',
      content: '',
      image: '',
      imageAlt: '',
      order: pageContent.sections.length,
      settings: {}
    };
    
    setPageContent({
      ...pageContent,
      sections: [...pageContent.sections, newSection]
    });
  };

  const updateSection = (sectionId: string, updates: Partial<PageSection>) => {
    setPageContent({
      ...pageContent,
      sections: pageContent.sections.map(section =>
        section.id === sectionId ? { ...section, ...updates } : section
      )
    });
  };

  const removeSection = (sectionId: string) => {
    setPageContent({
      ...pageContent,
      sections: pageContent.sections.filter(section => section.id !== sectionId)
    });
  };

  const reorderSections = (fromIndex: number, toIndex: number) => {
    const newSections = [...pageContent.sections];
    const [movedSection] = newSections.splice(fromIndex, 1);
    newSections.splice(toIndex, 0, movedSection);
    
    // Update order numbers
    newSections.forEach((section, index) => {
      section.order = index;
    });
    
    setPageContent({
      ...pageContent,
      sections: newSections
    });
  };

  const filteredPages = pages.filter(page => {
    const matchesSearch = page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         page.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || page.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { value: 'all', label: 'All Pages' },
    { value: 'main', label: 'Main Pages' },
    { value: 'tours', label: 'Tours' },
    { value: 'destinations', label: 'Destinations' },
    { value: 'experiences', label: 'Experiences' },
    { value: 'about', label: 'About' },
    { value: 'contact', label: 'Contact' }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading pages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Website Page Management
          </CardTitle>
          <CardDescription>
            Manage and edit content for all website pages
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pages">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="pages">All Pages</TabsTrigger>
              <TabsTrigger value="editor">Page Editor</TabsTrigger>
            </TabsList>

            <TabsContent value="pages" className="space-y-4">
              {/* Search and Filter */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search pages..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="sm:w-48">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    {categories.map(category => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Pages Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredPages.map((page) => (
                  <Card key={page.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-lg">{page.title}</h3>
                        <Badge variant={page.status === 'published' ? 'default' : 'secondary'}>
                          {page.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{page.description}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{page.slug}</span>
                        <span>{page.lastUpdated}</span>
                      </div>
                      <div className="mt-3 flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => loadPageContent(page)}
                          className="flex items-center gap-1"
                        >
                          <Edit className="w-3 h-3" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(`https://recharge-travels-73e76.web.app${page.slug}`, '_blank')}
                          className="flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3" />
                          View
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="editor" className="space-y-4">
              {selectedPage ? (
                <div className="space-y-6">
                  {/* Page Info */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-gray-900">Page Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-gray-700 font-medium">Page Title</Label>
                          <Input
                            value={pageContent.title}
                            onChange={(e) => setPageContent({
                              ...pageContent,
                              title: e.target.value
                            })}
                            className="bg-white border-gray-300 text-gray-900"
                            placeholder="Enter page title..."
                          />
                        </div>
                        <div>
                          <Label className="text-gray-700 font-medium">Slug</Label>
                          <Input
                            value={pageContent.slug}
                            disabled
                            className="bg-gray-100 border-gray-300 text-gray-600"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label className="text-gray-700 font-medium">Meta Title</Label>
                        <Input
                          value={pageContent.metaTitle}
                          onChange={(e) => setPageContent({
                            ...pageContent,
                            metaTitle: e.target.value
                          })}
                          placeholder="SEO title for search engines (50-60 characters)"
                          className="bg-white border-gray-300 text-gray-900"
                        />
                      </div>
                      
                      <div>
                        <Label className="text-gray-700 font-medium">Meta Description</Label>
                        <Textarea
                          value={pageContent.metaDescription}
                          onChange={(e) => setPageContent({
                            ...pageContent,
                            metaDescription: e.target.value
                          })}
                          placeholder="SEO description for search engines (150-160 characters)"
                          rows={3}
                          className="bg-white border-gray-300 text-gray-900"
                        />
                      </div>
                      
                      <div>
                        <Label className="text-gray-700 font-medium">Meta Keywords</Label>
                        <Input
                          value={pageContent.metaKeywords}
                          onChange={(e) => setPageContent({
                            ...pageContent,
                            metaKeywords: e.target.value
                          })}
                          placeholder="Keywords separated by commas"
                          className="bg-white border-gray-300 text-gray-900"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Hero Section */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-gray-900">Hero Section</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-gray-700 font-medium">Hero Title</Label>
                          <Input
                            value={pageContent.heroTitle || ''}
                            onChange={(e) => setPageContent({
                              ...pageContent,
                              heroTitle: e.target.value
                            })}
                            className="bg-white border-gray-300 text-gray-900"
                            placeholder="Enter hero title..."
                          />
                        </div>
                        <div>
                          <Label className="text-gray-700 font-medium">Hero Subtitle</Label>
                          <Input
                            value={pageContent.heroSubtitle || ''}
                            onChange={(e) => setPageContent({
                              ...pageContent,
                              heroSubtitle: e.target.value
                            })}
                            className="bg-white border-gray-300 text-gray-900"
                            placeholder="Enter hero subtitle..."
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label className="text-gray-700 font-medium">Hero Background Image</Label>
                        <ImageUploader
                          currentImage={pageContent.heroImage || ''}
                          onImageUpload={(url) => setPageContent({
                            ...pageContent,
                            heroImage: url
                          })}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Content Sections */}
                  <Card>
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-gray-900">Content Sections</CardTitle>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => addSection('text')}
                            className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            <Plus className="w-3 h-3" />
                            Add Text Section
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => addSection('image')}
                            className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white"
                          >
                            <Image className="w-3 h-3" />
                            Add Image Section
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => addSection('hero')}
                            className="flex items-center gap-1 bg-purple-600 hover:bg-purple-700 text-white"
                          >
                            <Globe className="w-3 h-3" />
                            Add Hero Section
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {pageContent.sections.length === 0 ? (
                        <div className="text-center py-8 text-gray-600">
                          <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                          <p className="text-gray-700">No content sections yet. Add your first section to get started.</p>
                          <div className="mt-4 flex gap-2 justify-center">
                            <Button
                              onClick={() => addSection('text')}
                              className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                              <Plus className="w-4 h-4 mr-2" />
                              Add Text Section
                            </Button>
                            <Button
                              onClick={() => addSection('image')}
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              <Image className="w-4 h-4 mr-2" />
                              Add Image Section
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {pageContent.sections.map((section, index) => (
                            <Card key={section.id} className="border-2 border-dashed border-gray-300 bg-gray-50">
                              <CardContent className="p-6">
                                <div className="flex justify-between items-center mb-4">
                                  <div className="flex items-center gap-3">
                                    <Badge variant="outline" className="bg-white text-gray-700 border-gray-300">
                                      {section.type.toUpperCase()}
                                    </Badge>
                                    <span className="text-sm font-medium text-gray-700">Section {index + 1}</span>
                                  </div>
                                  <div className="flex gap-2">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => setEditingSection(section)}
                                      className="border-gray-300 text-gray-700 hover:bg-gray-100"
                                    >
                                      <Edit className="w-3 h-3 mr-1" />
                                      Edit
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="destructive"
                                      onClick={() => removeSection(section.id)}
                                      className="bg-red-600 hover:bg-red-700 text-white"
                                    >
                                      <Trash2 className="w-3 h-3 mr-1" />
                                      Delete
                                    </Button>
                                  </div>
                                </div>
                                
                                {section.type === 'text' && (
                                  <div className="space-y-4">
                                    <div>
                                      <Label className="text-gray-700 font-medium">Section Heading</Label>
                                      <Input
                                        value={section.heading || ''}
                                        onChange={(e) => updateSection(section.id, { heading: e.target.value })}
                                        className="mt-1 bg-white border-gray-300 text-gray-900"
                                        placeholder="Enter section heading..."
                                      />
                                    </div>
                                    <div>
                                      <Label className="text-gray-700 font-medium">Content</Label>
                                      <RichTextEditor
                                        value={section.content || ''}
                                        onChange={(content) => updateSection(section.id, { content })}
                                        className="mt-1"
                                      />
                                    </div>
                                  </div>
                                )}
                                
                                {section.type === 'image' && (
                                  <div className="space-y-4">
                                    <div>
                                      <Label className="text-gray-700 font-medium">Image Alt Text</Label>
                                      <Input
                                        value={section.imageAlt || ''}
                                        onChange={(e) => updateSection(section.id, { imageAlt: e.target.value })}
                                        className="mt-1 bg-white border-gray-300 text-gray-900"
                                        placeholder="Describe the image for accessibility..."
                                      />
                                    </div>
                                    <div>
                                      <Label className="text-gray-700 font-medium">Upload Image</Label>
                                      <ImageUploader
                                        currentImage={section.image || ''}
                                        onImageUpload={(url) => updateSection(section.id, { image: url })}
                                        className="mt-1"
                                      />
                                    </div>
                                    {section.heading && (
                                      <div>
                                        <Label className="text-gray-700 font-medium">Image Caption</Label>
                                        <Input
                                          value={section.heading || ''}
                                          onChange={(e) => updateSection(section.id, { heading: e.target.value })}
                                          className="mt-1 bg-white border-gray-300 text-gray-900"
                                          placeholder="Optional caption for the image..."
                                        />
                                      </div>
                                    )}
                                  </div>
                                )}

                                {section.type === 'hero' && (
                                  <div className="space-y-4">
                                    <div>
                                      <Label className="text-gray-700 font-medium">Hero Title</Label>
                                      <Input
                                        value={section.heading || ''}
                                        onChange={(e) => updateSection(section.id, { heading: e.target.value })}
                                        className="mt-1 bg-white border-gray-300 text-gray-900"
                                        placeholder="Enter hero title..."
                                      />
                                    </div>
                                    <div>
                                      <Label className="text-gray-700 font-medium">Hero Subtitle</Label>
                                      <Input
                                        value={section.content || ''}
                                        onChange={(e) => updateSection(section.id, { content: e.target.value })}
                                        className="mt-1 bg-white border-gray-300 text-gray-900"
                                        placeholder="Enter hero subtitle..."
                                      />
                                    </div>
                                    <div>
                                      <Label className="text-gray-700 font-medium">Hero Background Image</Label>
                                      <ImageUploader
                                        currentImage={section.image || ''}
                                        onImageUpload={(url) => updateSection(section.id, { image: url })}
                                        className="mt-1"
                                      />
                                    </div>
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Save Button */}
                  <div className="flex justify-end">
                    <Button onClick={savePageContent} disabled={saving} className="flex items-center gap-2">
                      <Save className="w-4 h-4" />
                      {saving ? 'Saving...' : 'Save Page'}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Select a page from the "All Pages" tab to start editing.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default PageManagementSystem; 