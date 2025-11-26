import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react';

const PagesSection: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const mockPages = [
    {
      id: '1',
      title: 'About Us',
      slug: 'about',
      status: 'published',
      updated_at: '2024-01-15',
      created_by: 'Admin'
    },
    {
      id: '2',
      title: 'Sri Lanka Guide',
      slug: 'sri-lanka-guide',
      status: 'draft',
      updated_at: '2024-01-14',
      created_by: 'Editor'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Pages</h2>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Create Page
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search pages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid gap-4">
        {mockPages.map((page) => (
          <Card key={page.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{page.title}</CardTitle>
                <Badge className={getStatusColor(page.status)}>
                  {page.status}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">/{page.slug}</p>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Updated {page.updated_at} by {page.created_by}
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-destructive">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PagesSection;