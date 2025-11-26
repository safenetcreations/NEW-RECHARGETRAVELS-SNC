import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';
import { Upload, Image as ImageIcon, X, ExternalLink } from 'lucide-react';

interface ImageUploaderProps {
  currentImage?: string;
  onImageUpload: (url: string) => void;
  onImageRemove?: () => void;
  className?: string;
  maxSize?: number; // in MB
  acceptedTypes?: string[];
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  currentImage,
  onImageUpload,
  onImageRemove,
  className = "",
  maxSize = 5, // 5MB default
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
}) => {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const compressImage = (file: File): Promise<File> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions (max 1920px width)
        const maxWidth = 1920;
        const maxHeight = 1080;
        let { width, height } = img;

        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }

        canvas.width = width;
        canvas.height = height;

        // Draw and compress
        ctx?.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              resolve(file);
            }
          },
          file.type,
          0.8 // 80% quality
        );
      };

      img.src = URL.createObjectURL(file);
    });
  };

  const uploadImage = async (file: File) => {
    try {
      setUploading(true);

      // Validate file size
      if (file.size > maxSize * 1024 * 1024) {
        toast({
          title: "File too large",
          description: `File size must be less than ${maxSize}MB`,
          variant: "destructive"
        });
        return;
      }

      // Validate file type
      if (!acceptedTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Please upload a valid image file (JPEG, PNG, WebP, or GIF)",
          variant: "destructive"
        });
        return;
      }

      // Compress image
      const compressedFile = await compressImage(file);

      // Generate unique filename
      const timestamp = Date.now();
      const fileName = `page-images/${timestamp}-${file.name}`;
      const storageRef = ref(storage, fileName);

      // Upload to Firebase Storage
      const snapshot = await uploadBytes(storageRef, compressedFile);
      const downloadURL = await getDownloadURL(snapshot.ref);

      // Update parent component
      onImageUpload(downloadURL);

      toast({
        title: "Success",
        description: "Image uploaded successfully!"
      });

    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Error",
        description: "Failed to upload image. Please try again.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadImage(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      uploadImage(file);
    }
  };

  const handleRemoveImage = () => {
    if (onImageRemove) {
      onImageRemove();
    } else {
      onImageUpload('');
    }
  };

  const openImageInNewTab = () => {
    if (currentImage) {
      window.open(currentImage, '_blank');
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Current Image Display */}
      {currentImage && (
        <div className="relative group">
          <div className="relative rounded-lg overflow-hidden border border-gray-200">
            <img
              src={currentImage}
              alt="Current image"
              className="w-full h-48 object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={openImageInNewTab}
                  className="bg-white text-gray-800 hover:bg-gray-100"
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={handleRemoveImage}
                  className="bg-red-600 hover:bg-red-700"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-500">
            Current image: {currentImage.split('/').pop()}
          </div>
        </div>
      )}

      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center space-y-4">
          <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full">
            {uploading ? (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            ) : (
              <Upload className="w-6 h-6 text-gray-400" />
            )}
          </div>
          
          <div>
            <p className="text-sm text-gray-600">
              {uploading ? 'Uploading...' : 'Drag and drop an image here, or click to select'}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Supports: JPEG, PNG, WebP, GIF (max {maxSize}MB)
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2"
          >
            <ImageIcon className="w-4 h-4" />
            {uploading ? 'Uploading...' : 'Choose Image'}
          </Button>

          <input
            ref={fileInputRef}
            type="file"
            accept={acceptedTypes.join(',')}
            onChange={handleFileSelect}
            className="hidden"
            disabled={uploading}
          />
        </div>
      </div>

      {/* URL Input (Alternative) */}
      <div className="space-y-2">
        <Label>Or enter image URL directly:</Label>
        <div className="flex gap-2">
          <Input
            placeholder="https://example.com/image.jpg"
            value={currentImage || ''}
            onChange={(e) => onImageUpload(e.target.value)}
            disabled={uploading}
          />
          {currentImage && (
            <Button
              size="sm"
              variant="outline"
              onClick={openImageInNewTab}
              disabled={uploading}
            >
              <ExternalLink className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageUploader; 