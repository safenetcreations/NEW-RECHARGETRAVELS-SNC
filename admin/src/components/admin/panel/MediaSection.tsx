import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Upload, Search, Grid, List, FolderOpen, Image, FileText, Film } from 'lucide-react';

const MediaSection: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedFolder, setSelectedFolder] = useState('all');

  const mockMedia = [
    {
      id: '1',
      filename: 'sigiriya-rock.jpg',
      original_name: 'Sigiriya Rock Fortress.jpg',
      file_type: 'image/jpeg',
      file_size: 1245760,
      folder: 'destinations',
      uploaded_at: '2024-01-15',
      alt_text: 'Ancient Sigiriya Rock Fortress in Sri Lanka',
      url: '/api/placeholder/300/200'
    },
    {
      id: '2',
      filename: 'tea-plantation.jpg',
      original_name: 'Ceylon Tea Plantation.jpg',
      file_type: 'image/jpeg',
      file_size: 987654,
      folder: 'experiences',
      uploaded_at: '2024-01-14',
      alt_text: 'Lush green tea plantation in the hills',
      url: '/api/placeholder/300/200'
    },
    {
      id: '3',
      filename: 'travel-guide.pdf',
      original_name: 'Sri Lanka Travel Guide 2024.pdf',
      file_type: 'application/pdf',
      file_size: 5432100,
      folder: 'documents',
      uploaded_at: '2024-01-13',
      alt_text: 'Complete travel guide for Sri Lanka',
      url: null
    }
  ];

  const folders = [
    { id: 'all', name: 'All Files', count: 156 },
    { id: 'destinations', name: 'Destinations', count: 45 },
    { id: 'experiences', name: 'Experiences', count: 32 },
    { id: 'hotels', name: 'Hotels', count: 28 },
    { id: 'documents', name: 'Documents', count: 12 },
    { id: 'uploads', name: 'General Uploads', count: 39 }
  ];

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return <Image className="w-4 h-4" />;
    if (fileType.startsWith('video/')) return <Film className="w-4 h-4" />;
    return <FileText className="w-4 h-4" />;
  };

  const getFileTypeColor = (fileType: string) => {
    if (fileType.startsWith('image/')) return 'bg-blue-100 text-blue-800';
    if (fileType.startsWith('video/')) return 'bg-purple-100 text-purple-800';
    if (fileType.includes('pdf')) return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Media Library</h2>
        <Button className="flex items-center gap-2">
          <Upload className="w-4 h-4" />
          Upload Files
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Folders Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <FolderOpen className="w-4 h-4" />
                Folders
              </h3>
              <div className="space-y-1">
                {folders.map((folder) => (
                  <button
                    key={folder.id}
                    onClick={() => setSelectedFolder(folder.id)}
                    className={`w-full text-left p-2 rounded-lg text-sm flex items-center justify-between transition-colors ${
                      selectedFolder === folder.id 
                        ? 'bg-primary text-primary-foreground' 
                        : 'hover:bg-muted'
                    }`}
                  >
                    <span>{folder.name}</span>
                    <Badge variant="secondary" className="text-xs">
                      {folder.count}
                    </Badge>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-4">
          {/* Controls */}
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search media..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Media Grid/List */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {mockMedia.map((file) => (
                <Card key={file.id} className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
                  <div className="aspect-square bg-muted flex items-center justify-center">
                    {file.url ? (
                      <img 
                        src={file.url} 
                        alt={file.alt_text}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        {getFileIcon(file.file_type)}
                        <span className="text-xs">{file.file_type.split('/')[1].toUpperCase()}</span>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-3">
                    <p className="text-sm font-medium truncate" title={file.original_name}>
                      {file.original_name}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <Badge className={`text-xs ${getFileTypeColor(file.file_type)}`}>
                        {file.file_type.split('/')[1].toUpperCase()}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatFileSize(file.file_size)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {mockMedia.map((file) => (
                <Card key={file.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-muted rounded flex items-center justify-center flex-shrink-0">
                        {file.url ? (
                          <img 
                            src={file.url} 
                            alt={file.alt_text}
                            className="w-full h-full object-cover rounded"
                          />
                        ) : (
                          getFileIcon(file.file_type)
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{file.original_name}</p>
                        <p className="text-sm text-muted-foreground">
                          {file.folder} • {formatFileSize(file.file_size)} • {file.uploaded_at}
                        </p>
                      </div>
                      
                      <Badge className={getFileTypeColor(file.file_type)}>
                        {file.file_type.split('/')[1].toUpperCase()}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MediaSection;