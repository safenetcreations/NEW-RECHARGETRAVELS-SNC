import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Globe } from 'lucide-react';

export const CulturalContentManager = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Cultural Sites Management</h2>
          <p className="text-muted-foreground">Manage cultural heritage sites and experiences</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add New Cultural Site
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Cultural Heritage Sites
          </CardTitle>
          <CardDescription>Cultural content management coming soon</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Cultural heritage content management will be available here.</p>
        </CardContent>
      </Card>
    </div>
  );
};