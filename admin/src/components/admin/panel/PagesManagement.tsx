import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Plus,
  Edit2,
  Trash2,
  Search,
} from 'lucide-react';
import { toast } from 'sonner';
import PageFormDialog from './PageFormDialog';
import { firebasePageService, Page } from '../../../services/firebasePageService';

interface PagesManagementProps {
  className?: string;
}

const PagesManagement: React.FC<PagesManagementProps> = ({ className }) => {
  const [pages, setPages] = useState<Page[]>([]);
  const [filteredPages, setFilteredPages] = useState<Page[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedPage, setSelectedPage] = useState<Page | null>(null);

  useEffect(() => {
    loadPages();
  }, []);

  useEffect(() => {
    let filtered = pages;

    if (searchTerm) {
      filtered = filtered.filter(
        page =>
          page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          page.slug.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredPages(filtered);
  }, [pages, searchTerm]);

  const loadPages = async () => {
    setIsLoading(true);
    try {
      const data = await firebasePageService.getAllPages();
      setPages(data);
      setFilteredPages(data);
      toast.success(`Loaded ${data.length} pages successfully`);
    } catch (error) {
      console.error('Error loading pages:', error);
      toast.error('Failed to load pages');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedPage(null);
    setIsFormOpen(true);
  };

  const handleEdit = (page: Page) => {
    setSelectedPage(page);
    setIsFormOpen(true);
  };

  const handleDelete = async (pageId: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }

    try {
      await firebasePageService.deletePage(pageId);
      toast.success('Page deleted successfully');
      loadPages();
    } catch (error) {
      console.error('Error deleting page:', error);
      toast.error('Failed to delete page');
    }
  };

  const handleFormSubmit = async (pageData: Partial<Page>) => {
    try {
      if (selectedPage) {
        await firebasePageService.updatePage(selectedPage.id, pageData);
        toast.success('Page updated successfully');
      } else {
        await firebasePageService.createPage(pageData as Omit<Page, 'id' | 'createdAt' | 'updatedAt'>);
        toast.success('Page created successfully');
      }
      setIsFormOpen(false);
      loadPages();
    } catch (error) {
      console.error('Error saving page:', error);
      toast.error('Failed to save page');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className={className}>
      <Card className="mb-6 border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
                Pages Management
              </CardTitle>
              <p className="text-gray-600">
                Manage all pages
              </p>
            </div>
            <Button
              onClick={handleCreate}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create New Page
            </Button>
          </div>
        </CardHeader>
      </Card>

      <Card className="mb-6 shadow-md">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search pages by title or slug..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredPages.map((page) => (
          <Card
            key={page.id}
            className="overflow-hidden hover:shadow-2xl transition-all duration-300 border-0 shadow-lg group"
          >
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                {page.title}
              </h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">/{page.slug}</p>

              <div className="flex gap-2">
                <Button
                  onClick={() => handleEdit(page)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  size="sm"
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button
                  onClick={() => handleDelete(page.id, page.title)}
                  variant="destructive"
                  size="sm"
                  className="flex-1"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPages.length === 0 && (
        <Card className="shadow-md">
          <CardContent className="py-12 text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Pages Found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm
                ? 'Try adjusting your filters'
                : 'Get started by creating your first page'}
            </p>
            {!searchTerm && (
              <Button onClick={handleCreate} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Page
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      <PageFormDialog
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        page={selectedPage}
      />
    </div>
  );
};

export default PagesManagement;
