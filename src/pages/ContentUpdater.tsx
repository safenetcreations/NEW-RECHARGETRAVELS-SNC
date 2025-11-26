import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Clock, Play, RefreshCw, Database } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';
import { ContentUpdateService } from '@/services/contentUpdateService';

const ContentUpdater = () => {
  const [updates, setUpdates] = useState<any[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [progress, setProgress] = useState(0);

  const phase1Pages = [
    { id: 'homepage', name: 'Homepage', type: 'page' },
    { id: 'colombo', name: 'Colombo', type: 'destination' },
    { id: 'kandy', name: 'Kandy', type: 'destination' },
    { id: 'galle', name: 'Galle', type: 'destination' },
    { id: 'sigiriya', name: 'Sigiriya', type: 'destination' },
    { id: 'ella', name: 'Ella', type: 'destination' },
    { id: 'wildlife', name: 'Wildlife Tours', type: 'tour' },
    { id: 'cultural', name: 'Cultural Tours', type: 'tour' }
  ];

  const updateSinglePage = async (pageId: string, type: string) => {
    try {
      let result;
      if (type === 'page' && pageId === 'homepage') {
        result = await ContentUpdateService.updateHomepage();
      } else if (type === 'destination') {
        result = await ContentUpdateService.updateDestination(pageId);
      } else if (type === 'tour') {
        result = await ContentUpdateService.updateTourCategory(pageId);
      }
      
      setUpdates(ContentUpdateService.getAllStatuses());
      
      if (result?.status === 'completed') {
        toast({
          title: "Success",
          description: `${pageId} updated successfully`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to update ${pageId}`,
        variant: "destructive"
      });
    }
  };

  const runPhase1Updates = async () => {
    setIsUpdating(true);
    setProgress(0);
    
    try {
      const results = await ContentUpdateService.batchUpdatePhase1();
      setUpdates(ContentUpdateService.getAllStatuses());
      setProgress(100);
      
      const successCount = results.filter(r => r.status === 'completed').length;
      
      toast({
        title: "Phase 1 Complete",
        description: `Successfully updated ${successCount} out of ${results.length} pages`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to complete Phase 1 updates",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'in-progress':
        return <Clock className="w-5 h-5 text-yellow-500 animate-spin" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      completed: 'default',
      error: 'destructive',
      'in-progress': 'secondary',
      pending: 'outline'
    };
    
    return (
      <Badge variant={variants[status] || 'outline'}>
        {status}
      </Badge>
    );
  };

  return (
    <>
      <Header />
      
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-6xl mx-auto"
          >
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold mb-4">Content Update Manager</h1>
              <p className="text-xl text-gray-600">
                Update website content with real Sri Lankan travel data
              </p>
            </div>

            {/* Phase 1 Card */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-6 h-6" />
                  Phase 1: High Priority Pages
                </CardTitle>
                <CardDescription>
                  Update homepage, top destinations, and main tour categories
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <p className="text-sm text-gray-600">
                        This will update {phase1Pages.length} pages with real content from our data source
                      </p>
                    </div>
                    <Button
                      onClick={runPhase1Updates}
                      disabled={isUpdating}
                      size="lg"
                      className="gap-2"
                    >
                      {isUpdating ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4" />
                          Run Phase 1 Updates
                        </>
                      )}
                    </Button>
                  </div>

                  {isUpdating && (
                    <div className="mb-6">
                      <Progress value={progress} className="h-2" />
                      <p className="text-sm text-gray-600 mt-2">
                        Updating pages... {Math.round(progress)}%
                      </p>
                    </div>
                  )}

                  {/* Individual Page Updates */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {phase1Pages.map((page) => {
                      const update = updates.find(u => 
                        u.page === page.id || 
                        u.page === `destination_${page.id}` || 
                        u.page === `tour_${page.id}`
                      );
                      
                      return (
                        <div
                          key={page.id}
                          className="flex items-center justify-between p-4 bg-white rounded-lg border"
                        >
                          <div className="flex items-center gap-3">
                            {update ? getStatusIcon(update.status) : getStatusIcon('pending')}
                            <div>
                              <h4 className="font-medium">{page.name}</h4>
                              <p className="text-sm text-gray-600">{page.type}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {update && getStatusBadge(update.status)}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateSinglePage(page.id, page.type)}
                              disabled={isUpdating}
                            >
                              Update
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Update Log */}
            {updates.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Update Log</CardTitle>
                  <CardDescription>
                    Recent content updates and their status
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {updates.map((update, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          {getStatusIcon(update.status)}
                          <div>
                            <p className="font-medium">{update.page}</p>
                            {update.message && (
                              <p className="text-sm text-gray-600">{update.message}</p>
                            )}
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">
                          {update.updatedAt && new Date(update.updatedAt).toLocaleTimeString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Instructions */}
            <div className="mt-8 p-6 bg-blue-50 rounded-lg">
              <h3 className="font-semibold mb-2">How to Use</h3>
              <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
                <li>Click "Run Phase 1 Updates" to update all high-priority pages</li>
                <li>Or update individual pages using the "Update" buttons</li>
                <li>Check the update log for status and any errors</li>
                <li>After Phase 1 is complete, proceed to Phase 2 (coming soon)</li>
              </ol>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ContentUpdater;