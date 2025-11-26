import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Camera } from 'lucide-react';

export const MediaLibrary = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Media Library</h2>
          <p className="text-muted-foreground">Manage all photos and media files</p>
        </div>
        <Button className="flex items-center gap-2">
          <Upload className="h-4 w-4" />
          Upload Media
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Media Management
          </CardTitle>
          <CardDescription>Media library coming soon</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Comprehensive media management will be available here.</p>
        </CardContent>
      </Card>
    </div>
  );
};