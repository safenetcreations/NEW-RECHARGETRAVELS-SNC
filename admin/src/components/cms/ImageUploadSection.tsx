import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Upload, X, Eye, Star } from 'lucide-react';
import { getDocs, collection, query, where, orderBy, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '@/services/firebaseService';

interface ImageUploadSectionProps {
  entityType: 'hotel' | 'tour' | 'activity' | 'cultural';
  entityId: string;
  entityName: string;
}

export interface ImageData {
  id: string;
  image_url: string;
  caption?: string;
  is_primary: boolean;
  sort_order: number;
}

export const ImageUploadSection: React.FC<ImageUploadSectionProps> = ({
  entityType,
  entityId,
  entityName
}) => {
  const [images, setImages] = useState<ImageData[]>([]);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const { toast } = useToast();

  const fetchImages = useCallback(async () => {
    try {
      if (entityType === 'hotel') {
        const q = query(
          collection(db, 'hotel_images'),
          where('hotel_id', '==', entityId),
          orderBy('sort_order')
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() })) as ImageData[];
        setImages(data);
      }
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  }, [entityType, entityId]);

  useEffect(() => {
    if (entityType === 'hotel') {
      fetchImages();
    }
  }, [fetchImages, entityType]);

  // Only support hotels for now
  if (entityType !== 'hotel') {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>Image management for {entityType} coming soon</p>
      </div>
    );
  }

  const handleFileUpload = async (files: FileList) => {
    if (!files.length) return;

    setUploading(true);
    const uploadPromises = Array.from(files).map(uploadSingleFile);

    try {
      await Promise.all(uploadPromises);
      fetchImages();
      toast({
        title: "Success",
        description: `${files.length} image(s) uploaded successfully`
      });
    } catch (error) {
      console.error('Error uploading files:', error);
      toast({
        title: "Error",
        description: "Failed to upload some images",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const uploadSingleFile = async (file: File) => {
    // Upload to Firebase Storage
    const fileExt = file.name.split('.').pop();
    const fileName = `hotel_${entityId}_${Date.now()}.${fileExt}`;
    const filePath = `hotels/${fileName}`;
    const storageRef = ref(storage, filePath);

    const uploadResult = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(uploadResult.ref);

    // Save to database - only support hotels for now
    await addDoc(collection(db, 'hotel_images'), {
      hotel_id: entityId,
      image_url: downloadURL,
      is_primary: images.length === 0,
      sort_order: images.length
    });
  };

  const deleteImage = async (imageId: string) => {
    try {
      // Only support hotels for now
      await deleteDoc(doc(db, 'hotel_images', imageId));

      fetchImages();
      toast({
        title: "Success",
        description: "Image deleted successfully"
      });
    } catch (error) {
      console.error('Error deleting image:', error);
      toast({
        title: "Error",
        description: "Failed to delete image",
        variant: "destructive"
      });
    }
  };

  const setPrimaryImage = async (imageId: string) => {
    try {
      // Only support hotels for now
      // First, remove primary status from all images
      const imagesQuery = query(
        collection(db, 'hotel_images'),
        where('hotel_id', '==', entityId)
      );
      const imagesSnapshot = await getDocs(imagesQuery);
      
      const updatePromises = imagesSnapshot.docs.map(docSnap =>
        updateDoc(doc(db, 'hotel_images', docSnap.id), { is_primary: false })
      );
      await Promise.all(updatePromises);

      // Then set the selected image as primary
      await updateDoc(doc(db, 'hotel_images', imageId), { is_primary: true });

      fetchImages();
      toast({
        title: "Success",
        description: "Primary image updated"
      });
    } catch (error) {
      console.error('Error setting primary image:', error);
      toast({
        title: "Error",
        description: "Failed to set primary image",
        variant: "destructive"
      });
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Photos for {entityName}
        </CardTitle>
        <CardDescription>
          Upload and manage photos for this {entityType}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Upload Area */}
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragOver ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <Upload className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
          <p className="text-sm text-muted-foreground mb-4">
            Drag and drop images here, or click to select files
          </p>
          <Input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
            className="hidden"
            id="file-upload"
          />
          <Label htmlFor="file-upload">
            <Button variant="outline" disabled={uploading} className="cursor-pointer">
              {uploading ? 'Uploading...' : 'Select Images'}
            </Button>
          </Label>
        </div>

        {/* Image Grid */}
        {images.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image) => (
              <div key={image.id} className="relative group">
                <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                  <img
                    src={image.image_url}
                    alt={image.caption || 'Image'}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Image Controls Overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setPrimaryImage(image.id)}
                    className="h-8 w-8 p-0"
                    title="Set as primary image"
                  >
                    <Star className={`h-3 w-3 ${image.is_primary ? 'fill-current text-yellow-500' : ''}`} />
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => window.open(image.image_url, '_blank')}
                    className="h-8 w-8 p-0"
                    title="View full size"
                  >
                    <Eye className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteImage(image.id)}
                    className="h-8 w-8 p-0"
                    title="Delete image"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>

                {/* Primary Image Badge */}
                {image.is_primary && (
                  <div className="absolute top-2 left-2 bg-yellow-500 text-black text-xs px-2 py-1 rounded-full">
                    Primary
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {images.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Upload className="h-8 w-8 mx-auto mb-2" />
            <p>No images uploaded yet</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};