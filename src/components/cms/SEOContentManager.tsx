import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit3, Search } from 'lucide-react';

export const SEOContentManager = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">SEO Management</h2>
          <p className="text-muted-foreground">Manage SEO content and metadata</p>
        </div>
        <Button className="flex items-center gap-2">
          <Edit3 className="h-4 w-4" />
          Optimize SEO
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            SEO Optimization
          </CardTitle>
          <CardDescription>SEO management tools coming soon</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">SEO content management and optimization tools will be available here.</p>
        </CardContent>
      </Card>
    </div>
  );
};