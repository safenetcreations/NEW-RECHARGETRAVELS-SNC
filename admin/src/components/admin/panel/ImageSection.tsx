
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, Search, Trash2, Eye, Download, Sparkles } from 'lucide-react';
import ImageGenerationDialog from '@/components/admin/panel/ImageGenerationDialog';

const ImageSection: React.FC = () => {
  const [uploadedImages, setUploadedImages] = useState([
    { id: 1, name: 'hero-image.jpg', url: '/lovable-uploads/44e1f00c-0b57-41c5-821b-da4aad9d690b.png', size: '2.4 MB', uploaded: '2024-01-15' },
    { id: 2, name: 'wildlife-tour.jpg', url: '/lovable-uploads/639e61ff-8943-44e1-9d85-4c5a16c0f1e2.png', size: '1.8 MB', uploaded: '2024-01-14' },
  ]);
  const [selectedImages, setSelectedImages] = useState<number[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      // Handle image upload logic
      console.log('Uploading images:', files);
    }
  };

  const handleSelectImage = (imageId: number) => {
    setSelectedImages(prev => 
      prev.includes(imageId) 
        ? prev.filter(id => id !== imageId)
        : [...prev, imageId]
    );
  };

  const handleDeleteSelected = () => {
    setUploadedImages(prev => prev.filter(img => !selectedImages.includes(img.id)));
    setSelectedImages([]);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Image Gallery Management</h2>
        <div className="flex gap-2">
          <Button onClick={() => setIsGenerating(true)} className="bg-blue-600 hover:bg-blue-700">
            <Sparkles className="w-4 h-4 mr-2" />
            Generate Image
          </Button>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            id="image-upload"
          />
          <label htmlFor="image-upload">
            <Button className="bg-orange-600 hover:bg-orange-700" asChild>
              <span>
                <Upload className="w-4 h-4 mr-2" />
                Upload Images
              </span>
            </Button>
          </label>
          {selectedImages.length > 0 && (
            <Button variant="destructive" onClick={handleDeleteSelected}>
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Selected ({selectedImages.length})
            </Button>
          )}
        </div>
      </div>

      <ImageGenerationDialog
        isOpen={isGenerating}
        onClose={() => setIsGenerating(false)}
        onImageGenerated={(newImage) => {
          setUploadedImages(prev => [...prev, newImage]);
        }}
      />

      {/* Search and Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search images..."
                className="pl-10"
              />
            </div>
            <select className="px-4 py-2 border border-gray-300 rounded-lg">
              <option value="all">All Categories</option>
              <option value="hero">Hero Images</option>
              <option value="tours">Tour Images</option>
              <option value="hotels">Hotel Images</option>
              <option value="wildlife">Wildlife Images</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Image Grid */}
      <Card>
        <CardHeader>
          <CardTitle>Image Library ({uploadedImages.length} images)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {uploadedImages.map((image) => (
              <div key={image.id} className="relative group">
                <div 
                  className={`border-2 rounded-lg overflow-hidden cursor-pointer transition-all ${
                    selectedImages.includes(image.id) 
                      ? 'border-orange-500 ring-2 ring-orange-200' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleSelectImage(image.id)}
                >
                  <img
                    src={image.url}
                    alt={image.name}
                    className="w-full h-32 object-cover"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center transition-all">
                    <div className="opacity-0 group-hover:opacity-100 flex gap-2">
                      <Button size="sm" variant="secondary">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="secondary">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Selection indicator */}
                  {selectedImages.includes(image.id) && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}
                </div>
                
                <div className="mt-2 text-xs text-gray-600">
                  <p className="font-medium truncate">{image.name}</p>
                  <p>{image.size} • {image.uploaded}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ImageSection;
