
import { useState, useEffect } from 'react'
import SEOHead from '../components/cms/SEOHead'
import Breadcrumbs from '../components/cms/Breadcrumbs'
import BulkSEOGenerator from '../components/cms/BulkSEOGenerator'
import PasswordProtection from '../components/PasswordProtection'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Search, Sparkles, BarChart3 } from 'lucide-react'

const SEOTools = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Check if user is already authenticated in this session
    const authenticated = sessionStorage.getItem('seo_authenticated')
    if (authenticated === 'true') {
      setIsAuthenticated(true)
    }
  }, [])

  const handleAuthenticated = () => {
    setIsAuthenticated(true)
  }

  if (!isAuthenticated) {
    return <PasswordProtection onAuthenticated={handleAuthenticated} />
  }

  return (
    <div className="min-h-screen bg-soft-beige">
      <SEOHead
        title="SEO Tools - Content Management"
        description="Manage and optimize SEO content for your Sri Lanka travel website"
        canonicalUrl={`${window.location.origin}/seo-tools`}
      />

      <div className="container mx-auto px-4 py-12">
        <Breadcrumbs 
          items={[
            { label: 'SEO Tools' }
          ]}
        />

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-granite-gray mb-4">
            SEO Content Tools
          </h1>
          <p className="text-lg text-granite-gray/70 max-w-2xl">
            Optimize your content for search engines with AI-powered SEO tools. 
            Generate meta titles, descriptions, and analyze your content's SEO performance.
          </p>
        </div>

        <Tabs defaultValue="bulk-generator" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="bulk-generator" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Bulk Generator
            </TabsTrigger>
            <TabsTrigger value="content-analysis" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Content Analysis
            </TabsTrigger>
            <TabsTrigger value="search-optimization" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Search Optimization
            </TabsTrigger>
          </TabsList>

          <TabsContent value="bulk-generator" className="space-y-6">
            <BulkSEOGenerator />
            
            <Card>
              <CardHeader>
                <CardTitle>How It Works</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center text-sm font-medium">1</div>
                  <div>
                    <h4 className="font-medium">Content Analysis</h4>
                    <p className="text-sm text-gray-600">AI analyzes your destination or article content</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center text-sm font-medium">2</div>
                  <div>
                    <h4 className="font-medium">SEO Generation</h4>
                    <p className="text-sm text-gray-600">Creates optimized meta titles and descriptions for Sri Lanka travel searches</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center text-sm font-medium">3</div>
                  <div>
                    <h4 className="font-medium">Auto-Save</h4>
                    <p className="text-sm text-gray-600">SEO content is automatically saved to your database</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content-analysis" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Content SEO Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  This feature will analyze your content for SEO best practices and provide recommendations.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-800 text-sm">
                    📊 Content analysis feature coming soon! This will include keyword density analysis, 
                    readability scores, and SEO recommendations.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="search-optimization" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Search Optimization</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Tools to optimize your content for specific search queries and keywords.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-800 text-sm">
                    🔍 Search optimization tools coming soon! This will include keyword research, 
                    competitor analysis, and search ranking optimization.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default SEOTools
