import { useState, useRef } from 'react';
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
  Lightbulb
} from 'lucide-react';
import { 
  travelGuideCategories, 
  searchGuideContent, 
  GuideCategory, 
  GuideSection 
} from '@/data/travelGuideContent';
import { generatePDF } from '@/utils/pdfGenerator';
import { toast } from 'sonner';

const TravelGuide = () => {
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

  const renderSection = (section: GuideSection, categoryName?: string) => (
    <div key={section.id} className="mb-8 p-6 bg-white rounded-lg shadow-sm border border-gray-100 print:break-inside-avoid">
      <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
        <MapPin className="w-5 h-5 mr-2 text-blue-600" />
        {section.title}
      </h3>
      
      {categoryName && (
        <Badge variant="secondary" className="mb-3">{categoryName}</Badge>
      )}
      
      <p className="text-gray-700 mb-4 leading-relaxed">{section.content}</p>
      
      {section.highlights && section.highlights.length > 0 && (
        <div className="mb-4">
          <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
            <Lightbulb className="w-4 h-4 mr-1 text-yellow-500" />
            Highlights
          </h4>
          <ul className="space-y-1">
            {section.highlights.map((highlight, idx) => (
              <li key={idx} className="flex items-start">
                <ChevronRight className="w-4 h-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                <span className="text-gray-600">{highlight}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {section.tips && section.tips.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-2 flex items-center">
            <Info className="w-4 h-4 mr-1" />
            Travel Tips
          </h4>
          <ul className="space-y-1">
            {section.tips.map((tip, idx) => (
              <li key={idx} className="text-blue-800 text-sm">• {tip}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-6 pt-24">
      {/* Header */}
      <Card className="mb-8 border-0 shadow-lg bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <CardHeader>
          <CardTitle className="text-3xl font-bold flex items-center">
            <FileText className="w-8 h-8 mr-3" />
            Sri Lanka Travel Guide
          </CardTitle>
          <p className="text-blue-100 mt-2">
            Your comprehensive guide to exploring the Pearl of the Indian Ocean
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button 
              onClick={() => handleDownloadPDF(travelGuideCategories.map(c => c.id))}
              className="bg-white text-blue-700 hover:bg-blue-50"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Complete Guide
            </Button>
            <Button 
              onClick={() => selectedCategories.length > 0 ? handleDownloadPDF() : toast.error('Select categories first')}
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-700"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Selected ({selectedCategories.length})
            </Button>
            <Button 
              onClick={handlePrint}
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-700"
            >
              <Printer className="w-4 h-4 mr-2" />
              Print Selected
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="text"
            placeholder="Search destinations, activities, tips..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10 pr-4 py-2 w-full"
          />
        </div>
      </div>

      {/* Category Filter */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <Filter className="w-5 h-5 mr-2 text-gray-600" />
          <span className="font-semibold text-gray-800">Filter by Category:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {travelGuideCategories.map(category => (
            <Button
              key={category.id}
              variant={selectedCategories.includes(category.id) ? "default" : "outline"}
              size="sm"
              onClick={() => handleCategoryToggle(category.id)}
              className="flex items-center"
            >
              <span className="mr-2">{category.icon}</span>
              {category.name}
              {selectedCategories.includes(category.id) && (
                <Badge variant="secondary" className="ml-2 bg-white text-blue-700">
                  ✓
                </Badge>
              )}
            </Button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div ref={printRef} className="print:p-0">
        {viewMode === 'search' && searchResults.length > 0 ? (
          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Search Results ({searchResults.length})
            </h2>
            <div className="space-y-4">
              {searchResults.map(section => {
                const category = travelGuideCategories.find(cat => 
                  cat.sections.some(s => s.id === section.id)
                );
                return renderSection(section, category?.name);
              })}
            </div>
          </div>
        ) : viewMode === 'search' && searchQuery ? (
          <Card className="text-center py-12">
            <CardContent>
              <Coffee className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">No results found for "{searchQuery}"</p>
              <p className="text-gray-500 text-sm mt-2">Try different keywords or browse categories</p>
            </CardContent>
          </Card>
        ) : (
          <Tabs defaultValue={travelGuideCategories[0].id} className="w-full">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 w-full mb-8">
              {travelGuideCategories.map(category => (
                <TabsTrigger 
                  key={category.id} 
                  value={category.id}
                  className="text-xs md:text-sm"
                >
                  <span className="mr-1">{category.icon}</span>
                  <span className="hidden md:inline">{category.name}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {travelGuideCategories.map(category => (
              <TabsContent key={category.id} value={category.id}>
                <div className="space-y-6">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {category.icon} {category.name}
                    </h2>
                    <p className="text-gray-600">{category.description}</p>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => handleDownloadPDF([category.id])}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download {category.name} Guide
                    </Button>
                  </div>

                  <div className="space-y-6">
                    {category.sections.map(section => renderSection(section))}
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        )}
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
          
          /* Hide non-printable elements */
          button, input, .tabs-list {
            display: none !important;
          }
          
          /* Show all selected content */
          .tabs-content {
            display: block !important;
          }
          
          /* Ensure backgrounds print */
          * {
            print-color-adjust: exact !important;
            -webkit-print-color-adjust: exact !important;
          }
        }
      `}</style>
    </div>
  );
};

export default TravelGuide;