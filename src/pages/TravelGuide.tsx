import { useState, useRef, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ComprehensiveSEO from '@/components/seo/ComprehensiveSEO';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  Download,
  Printer,
  FileText,
  Filter,
  ChevronRight,
  MapPin,
  Info,
  Coffee,
  Lightbulb,
  Globe,
  Calendar,
  Camera,
  Utensils,
  Heart,
  Mountain,
  Palmtree,
  Compass
} from 'lucide-react';
import {
  travelGuideCategories,
  searchGuideContent,
  GuideCategory,
  GuideSection,
  getTotalSections,
  getCategoryNames
} from '@/data/travelGuideContent';
import { generatePDF } from '@/utils/pdfGenerator';
import { toast } from 'sonner';

// Generate comprehensive FAQ Schema for SEO
const generateFAQSchema = () => {
  const faqs = [
    {
      question: "What is the best time to visit Sri Lanka?",
      answer: "The best time to visit Sri Lanka depends on the region. The west and south coasts are best from December to March, while the east coast is ideal from April to September. The hill country is pleasant year-round but can be rainy from April to June and October to November."
    },
    {
      question: "Do I need a visa to visit Sri Lanka?",
      answer: "Most visitors need an Electronic Travel Authorization (ETA) before arrival. Citizens of many countries can apply online at www.eta.gov.lk. The tourist visa is typically valid for 30 days and can be extended."
    },
    {
      question: "What are the must-visit destinations in Sri Lanka?",
      answer: "Top destinations include Sigiriya (Lion Rock), Kandy (Temple of the Tooth), Galle Fort, Ella (Nine Arch Bridge), Yala National Park for wildlife, Mirissa for whale watching, and the tea plantations of Nuwara Eliya."
    },
    {
      question: "Is Sri Lanka safe for tourists?",
      answer: "Sri Lanka is generally safe for tourists. The country has a well-established tourism infrastructure. Standard travel precautions apply - be aware of your surroundings, keep valuables secure, and respect local customs and religious sites."
    },
    {
      question: "What currency is used in Sri Lanka?",
      answer: "The Sri Lankan Rupee (LKR) is the official currency. Major credit cards are accepted in hotels and larger establishments. ATMs are widely available in cities and tourist areas."
    },
    {
      question: "What is Sri Lanka famous for?",
      answer: "Sri Lanka is famous for its ancient Buddhist temples, UNESCO World Heritage sites like Sigiriya and the ancient cities, pristine beaches, wildlife safaris with leopards and elephants, world-renowned Ceylon tea, Ayurvedic wellness traditions, and its rich cultural heritage."
    },
    {
      question: "How many days do I need to explore Sri Lanka?",
      answer: "A minimum of 10-14 days is recommended to see the highlights including the Cultural Triangle (Sigiriya, Dambulla, Kandy), hill country, beaches, and at least one wildlife safari. For a more comprehensive experience, 3 weeks allows for deeper exploration."
    },
    {
      question: "What food should I try in Sri Lanka?",
      answer: "Must-try dishes include Rice and Curry (the national dish), Kottu Roti (chopped flatbread with vegetables), Hoppers (bowl-shaped pancakes), String Hoppers, Fish Ambul Thiyal (sour fish curry), Lamprais (Dutch-Burgher rice dish), and fresh tropical fruits."
    }
  ];

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
};

// Generate Tourist Destination Schema
const generateTouristDestinationSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "TouristDestination",
    "name": "Sri Lanka",
    "description": "Sri Lanka, the Pearl of the Indian Ocean, offers ancient temples, pristine beaches, wildlife safaris, tea plantations, and rich cultural heritage. A tropical paradise for all types of travelers.",
    "url": "https://www.rechargetravels.com/travel-guide",
    "touristType": ["Cultural Tourism", "Wildlife Tourism", "Beach Tourism", "Adventure Tourism", "Wellness Tourism", "Religious Tourism"],
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "7.8731",
      "longitude": "80.7718"
    },
    "containsPlace": [
      {
        "@type": "TouristAttraction",
        "name": "Sigiriya Lion Rock",
        "description": "Ancient rock fortress with frescoes and gardens"
      },
      {
        "@type": "TouristAttraction",
        "name": "Temple of the Sacred Tooth Relic",
        "description": "Sacred Buddhist temple in Kandy housing Buddha's tooth relic"
      },
      {
        "@type": "TouristAttraction",
        "name": "Yala National Park",
        "description": "Premier wildlife sanctuary with highest leopard density in the world"
      },
      {
        "@type": "TouristAttraction",
        "name": "Galle Fort",
        "description": "UNESCO World Heritage Dutch colonial fortress"
      },
      {
        "@type": "TouristAttraction",
        "name": "Nine Arch Bridge Ella",
        "description": "Iconic colonial-era railway bridge in the hill country"
      }
    ]
  };
};

// Generate Article Schema for the guide
const generateArticleSchema = () => {
  const totalSections = getTotalSections();
  const categoryNames = getCategoryNames();

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Complete Sri Lanka Travel Guide 2025 - Everything You Need to Know",
    "description": "Comprehensive Sri Lanka travel guide covering destinations, wildlife safaris, beaches, culture, Ayurveda, food, and practical travel tips. Plan your perfect Sri Lanka trip.",
    "image": "https://images.unsplash.com/photo-1586523969943-2d62a1a7d4d3?w=1200&q=80",
    "author": {
      "@type": "Organization",
      "name": "Recharge Travels & Tours Ltd",
      "url": "https://www.rechargetravels.com"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Recharge Travels & Tours Ltd",
      "logo": {
        "@type": "ImageObject",
        "url": `${typeof window !== 'undefined' ? window.location.origin : 'https://recharge-travels-73e76.web.app'}/logo-v2.png`
      }
    },
    "datePublished": "2024-01-01",
    "dateModified": new Date().toISOString().split('T')[0],
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://www.rechargetravels.com/travel-guide"
    },
    "articleSection": categoryNames,
    "wordCount": totalSections * 500,
    "about": {
      "@type": "Place",
      "name": "Sri Lanka"
    }
  };
};

// Generate Breadcrumb Schema
const generateBreadcrumbSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://www.rechargetravels.com/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Travel Guide",
        "item": "https://www.rechargetravels.com/travel-guide"
      }
    ]
  };
};

// SEO Keywords for Travel Guide
const travelGuideKeywords = [
  // Primary Keywords
  'Sri Lanka travel guide',
  'Sri Lanka tourism',
  'visit Sri Lanka',
  'Sri Lanka vacation',
  'Sri Lanka holiday',
  // Destination Keywords
  'Sigiriya travel guide',
  'Kandy travel guide',
  'Galle travel guide',
  'Ella Sri Lanka',
  'Colombo travel guide',
  'Jaffna tourism',
  'Trincomalee beaches',
  'Arugam Bay surfing',
  // Activity Keywords
  'Sri Lanka safari',
  'whale watching Sri Lanka',
  'Sri Lanka beaches',
  'Sri Lanka temples',
  'tea plantation tours',
  'Ramayana trail Sri Lanka',
  'Ayurveda Sri Lanka',
  // Practical Keywords
  'Sri Lanka visa',
  'best time visit Sri Lanka',
  'Sri Lanka currency',
  'Sri Lanka food',
  'Sri Lanka culture',
  // Long-tail Keywords
  'things to do in Sri Lanka',
  'places to visit in Sri Lanka',
  'Sri Lanka itinerary',
  'Sri Lanka travel tips',
  'Sri Lanka tourism 2025',
  'complete guide Sri Lanka',
  'Sri Lanka for first time visitors'
];

const TravelGuidePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'browse' | 'search'>('browse');
  const printRef = useRef<HTMLDivElement>(null);

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setViewMode(query ? 'search' : 'browse');
  };

  const searchResults = searchQuery ? searchGuideContent(searchQuery) : [];

  const handleDownloadPDF = async (categories?: string[]) => {
    try {
      const categoriesToDownload = categories || selectedCategories;

      if (categoriesToDownload.length === 0 && !categories) {
        toast.error('Please select at least one category to download');
        return;
      }

      toast.loading('Generating PDF...');

      const selectedContent = categories
        ? travelGuideCategories.filter(cat => categories.includes(cat.id))
        : travelGuideCategories.filter(cat => selectedCategories.includes(cat.id));

      await generatePDF(selectedContent);

      toast.success('PDF downloaded successfully!');
    } catch (error) {
      console.error('PDF generation error:', error);
      toast.error('Failed to generate PDF. Please try again.');
    }
  };

  const handlePrint = () => {
    if (selectedCategories.length === 0) {
      toast.error('Please select at least one category to print');
      return;
    }
    window.print();
  };

  // Memoized total stats
  const guideStats = useMemo(() => ({
    totalCategories: travelGuideCategories.length,
    totalSections: getTotalSections(),
    categoryNames: getCategoryNames()
  }), []);

  const renderSection = (section: GuideSection, categoryName?: string) => (
    <article
      key={section.id}
      className="mb-8 p-6 bg-white rounded-lg shadow-sm border border-gray-100 print:break-inside-avoid"
      itemScope
      itemType="https://schema.org/Article"
    >
      <header>
        <h3
          className="text-xl font-bold text-gray-900 mb-3 flex items-center"
          itemProp="headline"
        >
          <MapPin className="w-5 h-5 mr-2 text-blue-600" aria-hidden="true" />
          {section.title}
        </h3>

        {categoryName && (
          <Badge variant="secondary" className="mb-3" itemProp="articleSection">{categoryName}</Badge>
        )}
      </header>

      <div itemProp="articleBody">
        <p className="text-gray-700 mb-4 leading-relaxed">{section.content}</p>

        {section.highlights && section.highlights.length > 0 && (
          <section className="mb-4" aria-labelledby={`highlights-${section.id}`}>
            <h4 id={`highlights-${section.id}`} className="font-semibold text-gray-800 mb-2 flex items-center">
              <Lightbulb className="w-4 h-4 mr-1 text-yellow-500" aria-hidden="true" />
              Key Highlights
            </h4>
            <ul className="space-y-1" role="list">
              {section.highlights.map((highlight, idx) => (
                <li key={idx} className="flex items-start">
                  <ChevronRight className="w-4 h-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0" aria-hidden="true" />
                  <span className="text-gray-600">{highlight}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {section.tips && section.tips.length > 0 && (
          <aside className="bg-blue-50 border border-blue-200 rounded-lg p-4" aria-labelledby={`tips-${section.id}`}>
            <h4 id={`tips-${section.id}`} className="font-semibold text-blue-900 mb-2 flex items-center">
              <Info className="w-4 h-4 mr-1" aria-hidden="true" />
              Practical Travel Tips
            </h4>
            <ul className="space-y-1" role="list">
              {section.tips.map((tip, idx) => (
                <li key={idx} className="text-blue-800 text-sm">• {tip}</li>
              ))}
            </ul>
          </aside>
        )}
      </div>
    </article>
  );

  return (
    <>
      {/* Comprehensive SEO */}
      <ComprehensiveSEO
        title="Complete Sri Lanka Travel Guide 2025 | Destinations, Tips & Itineraries - Recharge Travels"
        description="Comprehensive Sri Lanka travel guide with 60+ destinations, wildlife safaris, beaches, temples, Ramayana trail, Ayurveda, food guide & practical tips. Plan your perfect Sri Lanka trip with expert advice."
        keywords={travelGuideKeywords}
        canonicalUrl="/travel-guide"
        ogImage="https://images.unsplash.com/photo-1586523969943-2d62a1a7d4d3?w=1200&q=80"
        ogType="article"
        alternateLanguages={[
          { lang: 'en', url: '/travel-guide' },
          { lang: 'ta', url: '/ta/travel-guide' },
          { lang: 'si', url: '/si/travel-guide' }
        ]}
      />

      {/* Additional Structured Data */}
      <Helmet>
        {/* FAQ Schema */}
        <script type="application/ld+json">
          {JSON.stringify(generateFAQSchema())}
        </script>

        {/* Tourist Destination Schema */}
        <script type="application/ld+json">
          {JSON.stringify(generateTouristDestinationSchema())}
        </script>

        {/* Article Schema */}
        <script type="application/ld+json">
          {JSON.stringify(generateArticleSchema())}
        </script>

        {/* Breadcrumb Schema */}
        <script type="application/ld+json">
          {JSON.stringify(generateBreadcrumbSchema())}
        </script>

        {/* AI Crawler Hints */}
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="googlebot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="bingbot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />

        {/* Content Classification */}
        <meta name="classification" content="Travel Guide" />
        <meta name="subject" content="Sri Lanka Tourism and Travel Information" />
        <meta name="topic" content="Sri Lanka Travel Guide" />
        <meta name="summary" content="Complete guide to traveling in Sri Lanka - destinations, activities, culture, food, and practical tips" />
        <meta name="abstract" content="Comprehensive travel resource for planning a trip to Sri Lanka" />
        <meta name="coverage" content="Sri Lanka" />
        <meta name="distribution" content="global" />
        <meta name="rating" content="General" />

        {/* Revisit Hints for Crawlers */}
        <meta name="revisit-after" content="7 days" />
        <meta name="expires" content="never" />
      </Helmet>

      <Header />

      <main className="min-h-screen bg-gray-50" role="main" aria-label="Sri Lanka Travel Guide">
        {/* Hero Section with SEO-optimized content */}
        <section
          className="relative bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 text-white py-20 pt-32"
          aria-labelledby="guide-title"
        >
          <div className="absolute inset-0 bg-black/30" />
          <div
            className="absolute inset-0 bg-cover bg-center opacity-20"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1586523969943-2d62a1a7d4d3?w=1920&q=80')" }}
            role="img"
            aria-label="Sigiriya Rock Fortress Sri Lanka"
          />

          <div className="relative container mx-auto px-4 text-center">
            {/* Breadcrumb Navigation */}
            <nav aria-label="Breadcrumb" className="mb-6">
              <ol className="flex items-center justify-center space-x-2 text-sm text-blue-200" itemScope itemType="https://schema.org/BreadcrumbList">
                <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                  <a href="/" itemProp="item" className="hover:text-white">
                    <span itemProp="name">Home</span>
                  </a>
                  <meta itemProp="position" content="1" />
                </li>
                <li><ChevronRight className="w-4 h-4" /></li>
                <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                  <span itemProp="name" className="text-white font-medium">Travel Guide</span>
                  <meta itemProp="position" content="2" />
                </li>
              </ol>
            </nav>

            <h1
              id="guide-title"
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
            >
              <span className="block">Complete</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">
                Sri Lanka Travel Guide
              </span>
              <span className="block text-2xl md:text-3xl mt-2 font-normal text-blue-200">2025 Edition</span>
            </h1>

            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto mb-8">
              Your comprehensive guide to exploring the Pearl of the Indian Ocean.
              Discover {guideStats.totalSections}+ destinations, activities, and insider tips.
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-3xl font-bold text-amber-400">{guideStats.totalCategories}</div>
                <div className="text-blue-200 text-sm">Categories</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-3xl font-bold text-amber-400">{guideStats.totalSections}+</div>
                <div className="text-blue-200 text-sm">Destinations & Topics</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-3xl font-bold text-amber-400">8</div>
                <div className="text-blue-200 text-sm">UNESCO Sites</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-3xl font-bold text-amber-400">1,340km</div>
                <div className="text-blue-200 text-sm">Coastline</div>
              </div>
            </div>

            {/* Download Buttons */}
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                onClick={() => handleDownloadPDF(travelGuideCategories.map(c => c.id))}
                size="lg"
                className="bg-amber-500 hover:bg-amber-600 text-black font-bold"
              >
                <Download className="w-5 h-5 mr-2" />
                Download Complete Guide (PDF)
              </Button>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-12">
          {/* Introduction Section - SEO Optimized */}
          <section className="prose prose-lg max-w-4xl mx-auto mb-12" aria-labelledby="intro-heading">
            <h2 id="intro-heading" className="text-3xl font-bold text-gray-900 mb-4 flex items-center">
              <Globe className="w-8 h-8 mr-3 text-blue-600" />
              Welcome to Sri Lanka - The Pearl of the Indian Ocean
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Sri Lanka, formerly known as Ceylon, is a tropical island nation in South Asia, located southeast of India.
              This comprehensive travel guide covers everything you need to plan an unforgettable journey through one of
              Asia's most diverse and culturally rich destinations. From ancient Buddhist temples and UNESCO World Heritage
              sites to pristine beaches, wildlife safaris, and world-famous Ceylon tea plantations, Sri Lanka offers
              experiences for every type of traveler.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Whether you're seeking spiritual enlightenment at sacred temples, adventure in national parks teeming with
              leopards and elephants, relaxation on golden beaches, or wellness through traditional Ayurvedic treatments,
              this guide provides insider tips, practical information, and detailed destination guides to help you make
              the most of your Sri Lanka vacation.
            </p>
          </section>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <label htmlFor="guide-search" className="sr-only">Search the travel guide</label>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" aria-hidden="true" />
              <Input
                id="guide-search"
                type="search"
                placeholder="Search destinations, activities, tips... (e.g., Sigiriya, beaches, safari)"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-12 pr-4 py-4 w-full text-lg rounded-xl border-2 border-gray-200 focus:border-blue-500"
                aria-label="Search travel guide content"
              />
            </div>
          </div>

          {/* Category Filter */}
          <section className="mb-8" aria-labelledby="filter-heading">
            <div className="flex items-center mb-4">
              <Filter className="w-5 h-5 mr-2 text-gray-600" aria-hidden="true" />
              <h2 id="filter-heading" className="font-semibold text-gray-800">Browse by Category:</h2>
            </div>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Category filters">
              {travelGuideCategories.map(category => (
                <Button
                  key={category.id}
                  variant={selectedCategories.includes(category.id) ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleCategoryToggle(category.id)}
                  className="flex items-center"
                  aria-pressed={selectedCategories.includes(category.id)}
                >
                  <span className="mr-2" aria-hidden="true">{category.icon}</span>
                  {category.name}
                  {selectedCategories.includes(category.id) && (
                    <Badge variant="secondary" className="ml-2 bg-white text-blue-700">
                      ✓
                    </Badge>
                  )}
                </Button>
              ))}
            </div>

            {selectedCategories.length > 0 && (
              <div className="mt-4 flex gap-2">
                <Button
                  onClick={() => handleDownloadPDF()}
                  variant="outline"
                  size="sm"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Selected ({selectedCategories.length})
                </Button>
                <Button
                  onClick={handlePrint}
                  variant="outline"
                  size="sm"
                >
                  <Printer className="w-4 h-4 mr-2" />
                  Print Selected
                </Button>
              </div>
            )}
          </section>

          {/* Content Area */}
          <div ref={printRef} className="print:p-0">
            {viewMode === 'search' && searchResults.length > 0 ? (
              <section aria-labelledby="search-results-heading">
                <h2 id="search-results-heading" className="text-2xl font-bold mb-6 text-gray-900">
                  Search Results for "{searchQuery}" ({searchResults.length} found)
                </h2>
                <div className="space-y-4">
                  {searchResults.map(section => {
                    const category = travelGuideCategories.find(cat =>
                      cat.sections.some(s => s.id === section.id)
                    );
                    return renderSection(section, category?.name);
                  })}
                </div>
              </section>
            ) : viewMode === 'search' && searchQuery ? (
              <Card className="text-center py-12">
                <CardContent>
                  <Coffee className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">No results found for "{searchQuery}"</p>
                  <p className="text-gray-500 text-sm mt-2">Try different keywords or browse categories above</p>
                </CardContent>
              </Card>
            ) : (
              <Tabs defaultValue={travelGuideCategories[0].id} className="w-full">
                <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 w-full mb-8 h-auto" role="tablist">
                  {travelGuideCategories.map(category => (
                    <TabsTrigger
                      key={category.id}
                      value={category.id}
                      className="text-xs md:text-sm py-3"
                      role="tab"
                      aria-controls={`tabpanel-${category.id}`}
                    >
                      <span className="mr-1" aria-hidden="true">{category.icon}</span>
                      <span className="hidden md:inline">{category.name}</span>
                    </TabsTrigger>
                  ))}
                </TabsList>

                {travelGuideCategories.map(category => (
                  <TabsContent
                    key={category.id}
                    value={category.id}
                    role="tabpanel"
                    id={`tabpanel-${category.id}`}
                    aria-labelledby={category.id}
                  >
                    <section className="space-y-6" aria-labelledby={`category-heading-${category.id}`}>
                      <header className="mb-8">
                        <h2
                          id={`category-heading-${category.id}`}
                          className="text-3xl font-bold text-gray-900 mb-3"
                        >
                          <span aria-hidden="true">{category.icon}</span> {category.name}
                        </h2>
                        <p className="text-lg text-gray-600">{category.description}</p>
                        <Button
                          size="sm"
                          variant="outline"
                          className="mt-4"
                          onClick={() => handleDownloadPDF([category.id])}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download {category.name} Guide
                        </Button>
                      </header>

                      <div className="space-y-6">
                        {category.sections.map(section => renderSection(section))}
                      </div>
                    </section>
                  </TabsContent>
                ))}
              </Tabs>
            )}
          </div>

          {/* FAQ Section for SEO */}
          <section className="mt-16 max-w-4xl mx-auto" aria-labelledby="faq-heading">
            <h2 id="faq-heading" className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Frequently Asked Questions About Sri Lanka Travel
            </h2>
            <div className="space-y-4" itemScope itemType="https://schema.org/FAQPage">
              {[
                {
                  q: "What is the best time to visit Sri Lanka?",
                  a: "The best time depends on your destination. West and south coasts: December-March. East coast: April-September. Hill country is pleasant year-round. For wildlife at Yala, visit February-July when animals gather at water holes."
                },
                {
                  q: "Do I need a visa to visit Sri Lanka?",
                  a: "Most visitors need an Electronic Travel Authorization (ETA). Apply online at www.eta.gov.lk before arrival. Tourist visas are typically valid for 30 days and can be extended at the Department of Immigration in Colombo."
                },
                {
                  q: "Is Sri Lanka safe for tourists?",
                  a: "Yes, Sri Lanka is generally very safe for tourists with a well-established tourism industry. Exercise normal precautions, respect local customs at religious sites, and be aware of your surroundings in crowded areas."
                },
                {
                  q: "What are the top attractions in Sri Lanka?",
                  a: "Must-visit places include Sigiriya Rock Fortress, Temple of the Tooth in Kandy, Galle Fort, Nine Arch Bridge in Ella, Yala National Park, tea plantations of Nuwara Eliya, and whale watching in Mirissa."
                },
                {
                  q: "How much money do I need for a trip to Sri Lanka?",
                  a: "Budget travelers can manage on $30-50/day, mid-range $80-150/day, and luxury $200+/day. This includes accommodation, food, transportation, and activities. Major credit cards are accepted in tourist areas."
                }
              ].map((faq, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-lg shadow-sm border border-gray-100 p-6"
                  itemScope
                  itemProp="mainEntity"
                  itemType="https://schema.org/Question"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-2" itemProp="name">
                    {faq.q}
                  </h3>
                  <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                    <p className="text-gray-700" itemProp="text">{faq.a}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* CTA Section */}
          <section className="mt-16 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 md:p-12 text-white text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Explore Sri Lanka?</h2>
            <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
              Let our expert team help you plan the perfect Sri Lanka itinerary.
              From airport transfers to custom tours, we handle everything.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50">
                <Compass className="w-5 h-5 mr-2" />
                Plan Your Trip
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-700">
                <Calendar className="w-5 h-5 mr-2" />
                View Tour Packages
              </Button>
            </div>
          </section>
        </div>

        {/* Print Styles */}
        <style>{`
          @media print {
            .print\\:break-inside-avoid {
              break-inside: avoid;
            }

            .print\\:p-0 {
              padding: 0;
            }

            body {
              print-color-adjust: exact;
              -webkit-print-color-adjust: exact;
            }

            @page {
              margin: 1cm;
              size: A4;
            }

            header, footer, nav, button, input, .tabs-list {
              display: none !important;
            }

            .tabs-content {
              display: block !important;
            }

            * {
              print-color-adjust: exact !important;
              -webkit-print-color-adjust: exact !important;
            }
          }
        `}</style>
      </main>

      <Footer />
    </>
  );
};

export default TravelGuidePage;
