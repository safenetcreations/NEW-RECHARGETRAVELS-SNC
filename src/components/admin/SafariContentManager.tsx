import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { 
  Save, 
  Plus, 
  Trash2, 
  Edit, 
  Link,
  Image as ImageIcon,
  DollarSign,
  Clock,
  List
} from 'lucide-react';
import { safariContentService, SafariPackage, SafariContent } from '@/services/safariContentService';

const SafariContentManager: React.FC = () => {
  const [packages, setPackages] = useState<SafariPackage[]>([]);
  const [mainContent, setMainContent] = useState<SafariContent | null>(null);
  const [editingPackage, setEditingPackage] = useState<Partial<SafariPackage> | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [packagesData, contentData] = await Promise.all([
        safariContentService.getPackages(),
        safariContentService.getMainContent()
      ]);
      setPackages(packagesData);
      setMainContent(contentData);
    } catch (error) {
      toast.error('Failed to load safari content');
    } finally {
      setLoading(false);
    }
  };


  const handleSavePackage = async () => {
    if (!editingPackage) return;

    try {
      await safariContentService.savePackage(editingPackage);
      toast.success('Safari package saved successfully');
      setEditingPackage(null);
      loadData();
    } catch (error) {
      toast.error('Failed to save safari package');
    }
  };

  const handleDeletePackage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this package?')) return;

    try {
      await safariContentService.deletePackage(id);
      toast.success('Package deleted successfully');
      loadData();
    } catch (error) {
      toast.error('Failed to delete package');
    }
  };


  const handleSaveMainContent = async () => {
    if (!mainContent) return;

    try {
      await safariContentService.updateMainContent(mainContent);
      toast.success('Main content updated successfully');
    } catch (error) {
      toast.error('Failed to update main content');
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <List className="w-5 h-5" />
            Safari Content Management
          </CardTitle>
          <CardDescription>
            Manage luxury safari packages and page content
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="packages">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="packages">Safari Packages</TabsTrigger>
              <TabsTrigger value="content">Page Content</TabsTrigger>
            </TabsList>

            <TabsContent value="packages" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Safari Packages</h3>
                <Button
                  onClick={() => setEditingPackage({
                    title: '',
                    description: '',
                    details: '',
                    features: [],
                    price: 0,
                    duration: '',
                    image: '',
                    category: 'experience',
                    isActive: true
                  })}
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Package
                </Button>
              </div>

              {/* Package List */}
              <div className="space-y-4">
                {packages.map((pkg) => (
                  <Card key={pkg.id} className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg">{pkg.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{pkg.description}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-sm font-medium">${pkg.price}</span>
                          <span className="text-sm text-gray-500">{pkg.duration}</span>
                          <Badge variant={pkg.isActive ? "success" : "secondary"}>
                            {pkg.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingPackage(pkg)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeletePackage(pkg.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Edit Package Modal */}
              {editingPackage && (
                <Card className="mt-6 p-6">
                  <h3 className="text-lg font-semibold mb-4">
                    {editingPackage.id ? 'Edit Package' : 'New Package'}
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Title</Label>
                      <Input
                        value={editingPackage.title || ''}
                        onChange={(e) => setEditingPackage({
                          ...editingPackage,
                          title: e.target.value
                        })}
                        placeholder="Package title"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Category</Label>
                      <Select
                        value={editingPackage.category || 'experience'}
                        onValueChange={(value: any) => setEditingPackage({
                          ...editingPackage,
                          category: value
                        })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="wildlife">Wildlife Encounter</SelectItem>
                          <SelectItem value="lodge">Luxury Lodge</SelectItem>
                          <SelectItem value="experience">Safari Experience</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Price (USD)</Label>
                      <Input
                        type="number"
                        value={editingPackage.price || ''}
                        onChange={(e) => setEditingPackage({
                          ...editingPackage,
                          price: parseFloat(e.target.value)
                        })}
                        placeholder="Package price"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Duration</Label>
                      <Input
                        value={editingPackage.duration || ''}
                        onChange={(e) => setEditingPackage({
                          ...editingPackage,
                          duration: e.target.value
                        })}
                        placeholder="e.g., 3 Days / 2 Nights"
                      />
                    </div>
                    
                    <div className="col-span-2 space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        value={editingPackage.description || ''}
                        onChange={(e) => setEditingPackage({
                          ...editingPackage,
                          description: e.target.value
                        })}
                        placeholder="Brief description"
                        rows={2}
                      />
                    </div>
                    
                    <div className="col-span-2 space-y-2">
                      <Label>Details</Label>
                      <Textarea
                        value={editingPackage.details || ''}
                        onChange={(e) => setEditingPackage({
                          ...editingPackage,
                          details: e.target.value
                        })}
                        placeholder="Detailed description"
                        rows={4}
                      />
                    </div>
                    
                    <div className="col-span-2 space-y-2">
                      <Label>Features (one per line)</Label>
                      <Textarea
                        value={editingPackage.features?.join('\n') || ''}
                        onChange={(e) => setEditingPackage({
                          ...editingPackage,
                          features: e.target.value.split('\n').filter(f => f.trim())
                        })}
                        placeholder="Feature 1\nFeature 2\nFeature 3"
                        rows={3}
                      />
                    </div>
                    
                    <div className="col-span-2 space-y-2">
                      <Label>Image URL</Label>
                      <Input
                        value={editingPackage.image || ''}
                        onChange={(e) => setEditingPackage({
                          ...editingPackage,
                          image: e.target.value
                        })}
                        placeholder="https://..."
                      />
                    </div>
                    
                    <div className="col-span-2 flex items-center gap-2">
                      <Switch
                        checked={editingPackage.isActive}
                        onCheckedChange={(checked) => setEditingPackage({
                          ...editingPackage,
                          isActive: checked
                        })}
                      />
                      <Label>Active</Label>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-4">
                    <Button onClick={handleSavePackage}>
                      <Save className="w-4 h-4 mr-2" />
                      Save Package
                    </Button>
                    <Button variant="outline" onClick={() => setEditingPackage(null)}>
                      Cancel
                    </Button>
                  </div>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="content" className="space-y-4">
              {mainContent && (
                <>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Hero Title</Label>
                      <Input
                        value={mainContent.heroTitle}
                        onChange={(e) => setMainContent({
                          ...mainContent,
                          heroTitle: e.target.value
                        })}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Hero Subtitle</Label>
                      <Input
                        value={mainContent.heroSubtitle}
                        onChange={(e) => setMainContent({
                          ...mainContent,
                          heroSubtitle: e.target.value
                        })}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Hero Image URL</Label>
                      <Input
                        value={mainContent.heroImage}
                        onChange={(e) => setMainContent({
                          ...mainContent,
                          heroImage: e.target.value
                        })}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>About Text</Label>
                      <Textarea
                        value={mainContent.aboutText}
                        onChange={(e) => setMainContent({
                          ...mainContent,
                          aboutText: e.target.value
                        })}
                        rows={4}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Why Choose Us (one per line)</Label>
                      <Textarea
                        value={mainContent.whyChooseUs.join('\n')}
                        onChange={(e) => setMainContent({
                          ...mainContent,
                          whyChooseUs: e.target.value.split('\n').filter(item => item.trim())
                        })}
                        rows={6}
                      />
                    </div>
                  </div>
                  
                  <Button onClick={handleSaveMainContent}>
                    <Save className="w-4 h-4 mr-2" />
                    Save Content
                  </Button>
                </>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

// Helper Badge component
const Badge: React.FC<{ variant: 'success' | 'secondary'; children: React.ReactNode }> = ({ variant, children }) => {
  const classes = variant === 'success' 
    ? 'bg-green-100 text-green-800' 
    : 'bg-gray-100 text-gray-800';
    
  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${classes}`}>
      {children}
    </span>
  );
};

export default SafariContentManager;