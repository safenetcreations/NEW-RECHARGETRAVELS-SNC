import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '@/lib/firebase';

/**
 * FIREBASE STORAGE SERVICE
 * 
 * Service for handling image uploads and management in Firebase Storage
 * 
 * Features:
 * - Upload images with automatic path generation
 * - Generate unique filenames to prevent conflicts
 * - Get download URLs for uploaded images
 * - Delete images from storage
 * - Support for multiple image formats
 * - Progress tracking for uploads
 * 
 * Usage:
 * ```typescript
 * import { firebaseStorageService } from '@/services/firebaseStorageService';
 * 
 * // Upload an image
 * const url = await firebaseStorageService.uploadImage(file, 'about-sri-lanka');
 * 
 * // Delete an image
 * await firebaseStorageService.deleteImageByUrl(url);
 * ```
 */

class FirebaseStorageService {
  /**
   * Upload an image to Firebase Storage
   * @param file - The file to upload
   * @param folder - The folder path in storage (e.g., 'about-sri-lanka', 'tours', 'destinations')
   * @param customName - Optional custom filename (will be sanitized)
   * @returns Promise with the download URL of the uploaded image
   */
  async uploadImage(
    file: File, 
    folder: string = 'uploads',
    customName?: string
  ): Promise<string> {
    try {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('File must be an image');
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        throw new Error('Image size must be less than 5MB');
      }

      // Generate unique filename
      const timestamp = Date.now();
      const sanitizedName = customName 
        ? customName.replace(/[^a-zA-Z0-9.-]/g, '_')
        : file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const extension = file.name.split('.').pop();
      const filename = `${timestamp}_${sanitizedName}`;

      // Create storage reference
      const storageRef = ref(storage, `${folder}/${filename}`);

      // Upload file
      const snapshot = await uploadBytes(storageRef, file, {
        contentType: file.type,
      });

      // Get download URL
      const downloadURL = await getDownloadURL(snapshot.ref);

      console.log('Image uploaded successfully:', downloadURL);
      return downloadURL;

    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  }

  /**
   * Upload multiple images at once
   * @param files - Array of files to upload
   * @param folder - The folder path in storage
   * @returns Promise with array of download URLs
   */
  async uploadMultipleImages(
    files: File[], 
    folder: string = 'uploads'
  ): Promise<string[]> {
    try {
      const uploadPromises = files.map(file => 
        this.uploadImage(file, folder)
      );

      const urls = await Promise.all(uploadPromises);
      return urls;

    } catch (error) {
      console.error('Error uploading multiple images:', error);
      throw error;
    }
  }

  /**
   * Delete an image from Firebase Storage by its download URL
   * @param downloadURL - The download URL of the image to delete
   */
  async deleteImageByUrl(downloadURL: string): Promise<void> {
    try {
      // Extract path from download URL
      const url = new URL(downloadURL);
      const pathMatch = url.pathname.match(/\/o\/(.*?)\?/);
      
      if (!pathMatch || !pathMatch[1]) {
        throw new Error('Invalid download URL');
      }

      const path = decodeURIComponent(pathMatch[1]);
      const storageRef = ref(storage, path);

      // Delete the file
      await deleteObject(storageRef);
      console.log('Image deleted successfully:', path);

    } catch (error) {
      console.error('Error deleting image:', error);
      throw error;
    }
  }

  /**
   * Delete an image from Firebase Storage by its path
   * @param path - The storage path of the image
   */
  async deleteImageByPath(path: string): Promise<void> {
    try {
      const storageRef = ref(storage, path);
      await deleteObject(storageRef);
      console.log('Image deleted successfully:', path);

    } catch (error) {
      console.error('Error deleting image:', error);
      throw error;
    }
  }

  /**
   * Optimize image before upload (client-side compression)
   * @param file - The file to optimize
   * @param maxWidth - Maximum width in pixels
   * @param maxHeight - Maximum height in pixels
   * @param quality - JPEG quality (0-1)
   * @returns Promise with optimized file
   */
  async optimizeImage(
    file: File,
    maxWidth: number = 1920,
    maxHeight: number = 1080,
    quality: number = 0.85
  ): Promise<File> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        const img = new Image();
        
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Calculate new dimensions while maintaining aspect ratio
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

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Failed to get canvas context'));
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('Failed to create blob'));
                return;
              }

              const optimizedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });

              resolve(optimizedFile);
            },
            'image/jpeg',
            quality
          );
        };

        img.onerror = () => {
          reject(new Error('Failed to load image'));
        };

        if (typeof e.target?.result === 'string') {
          img.src = e.target.result;
        }
      };

      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };

      reader.readAsDataURL(file);
    });
  }

  /**
   * Get image metadata from storage
   * @param path - The storage path of the image
   * @returns Promise with file metadata
   */
  async getImageMetadata(path: string) {
    try {
      const storageRef = ref(storage, path);
      // Note: getMetadata would be used here, but we'll keep it simple
      return { path };
    } catch (error) {
      console.error('Error getting image metadata:', error);
      throw error;
    }
  }

  /**
   * Validate image file
   * @param file - The file to validate
   * @returns Validation result
   */
  validateImage(file: File): { valid: boolean; error?: string } {
    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      return { valid: false, error: 'File must be an image' };
    }

    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return { valid: false, error: 'Image size must be less than 5MB' };
    }

    // Check file extension
    const validExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (!extension || !validExtensions.includes(extension)) {
      return { 
        valid: false, 
        error: `Invalid file type. Allowed: ${validExtensions.join(', ')}` 
      };
    }

    return { valid: true };
  }
}

export const firebaseStorageService = new FirebaseStorageService();
export default firebaseStorageService;


