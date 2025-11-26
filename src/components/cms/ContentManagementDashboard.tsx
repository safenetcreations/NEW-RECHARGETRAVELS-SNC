
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Hotel, 
  Camera, 
  FileText, 
  MapPin, 
  Users, 
  Settings,
  Image,
  Upload,
  Edit3,
  Globe,
  Star,
  Sparkles
} from 'lucide-react';
import { HotelContentManager } from './HotelContentManager';
import { TourContentManager } from './TourContentManager';
import { ActivityContentManager } from './ActivityContentManager';
import { CulturalContentManager } from './CulturalContentManager';
import { MediaLibrary } from './MediaLibrary';
import { SEOContentManager } from './SEOContentManager';
import { BlogContentManager } from './BlogContentManager';

export { ContentManagementDashboard };

const ContentManagementDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const contentStats = [
    { label: 'Hotels', count: 45, icon: Hotel, color: 'bg-blue-500' },
    { label: 'Tours', count: 32, icon: MapPin, color: 'bg-green-500' },
    { label: 'Activities', count: 28, icon: Star, color: 'bg-purple-500' },
    { label: 'Blog Posts', count: 24, icon: FileText, color: 'bg-orange-500' },
    { label: 'Cultural Sites', count: 15, icon: Globe, color: 'bg-teal-500' },
    { label: 'Images', count: 234, icon: Image, color: 'bg-pink-500' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Content Management System
          </h1>
          <p className="text-muted-foreground text-lg">
            Manage all content, photos, and text across your Sri Lankan travel website
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-8 lg:grid-cols-8">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="blog" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Blog AI
            </TabsTrigger>
            <TabsTrigger value="hotels" className="flex items-center gap-2">
              <Hotel className="h-4 w-4" />
              Hotels
            </TabsTrigger>
            <TabsTrigger value="tours" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Tours
            </TabsTrigger>
            <TabsTrigger value="activities" className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              Activities
            </TabsTrigger>
            <TabsTrigger value="cultural" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Cultural
            </TabsTrigger>
            <TabsTrigger value="media" className="flex items-center gap-2">
              <Camera className="h-4 w-4" />
              Media
            </TabsTrigger>
            <TabsTrigger value="seo" className="flex items-center gap-2">
              <Edit3 className="h-4 w-4" />
              SEO
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {contentStats.map((stat, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {stat.label}
                    </CardTitle>
                    <div className={`${stat.color} p-2 rounded-md`}>
                      <stat.icon className="h-4 w-4 text-white" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.count}</div>
                    <p className="text-xs text-muted-foreground">
                      Total {stat.label.toLowerCase()}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="h-5 w-5" />
                    Quick Actions
                  </CardTitle>
                  <CardDescription>
                    Common content management tasks
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => setActiveTab('blog')}
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate Blog Content
                  </Button>
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => setActiveTab('hotels')}
                  >
                    <Hotel className="h-4 w-4 mr-2" />
                    Add New Hotel
                  </Button>
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => setActiveTab('tours')}
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    Create Tour Package
                  </Button>
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => setActiveTab('media')}
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    Upload Images
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Recent Updates
                  </CardTitle>
                  <CardDescription>
                    Latest content changes and uploads
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">AI Blog Post Generated</p>
                      <p className="text-sm text-muted-foreground">Best beaches in Mirissa</p>
                    </div>
                    <Badge variant="secondary">1 hour ago</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Sigiriya Rock Fortress</p>
                      <p className="text-sm text-muted-foreground">Cultural site updated</p>
                    </div>
                    <Badge variant="secondary">2 hours ago</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Kandy Hotel Collection</p>
                      <p className="text-sm text-muted-foreground">5 new images added</p>
                    </div>
                    <Badge variant="secondary">5 hours ago</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="blog">
            <BlogContentManager />
          </TabsContent>

          <TabsContent value="hotels">
            <HotelContentManager />
          </TabsContent>

          <TabsContent value="tours">
            <TourContentManager />
          </TabsContent>

          <TabsContent value="activities">
            <ActivityContentManager />
          </TabsContent>

          <TabsContent value="cultural">
            <CulturalContentManager />
          </TabsContent>

          <TabsContent value="media">
            <MediaLibrary />
          </TabsContent>

          <TabsContent value="seo">
            <SEOContentManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ContentManagementDashboard;
