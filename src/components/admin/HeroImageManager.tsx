import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, Trash2, Save, Image as ImageIcon } from 'lucide-react';
import { storage, db } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { useToast } from '@/components/ui/use-toast';

interface HeroImage {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  description: string;
  order: number;
}

export default function HeroImageManager() {
  const [heroImages, setHeroImages] = useState<HeroImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchHeroImages();
  }, []);

  const fetchHeroImages = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'heroImages'));
      const images: HeroImage[] = [];
      querySnapshot.forEach((doc) => {
        images.push({ id: doc.id, ...doc.data() } as HeroImage);
      });
      images.sort((a, b) => a.order - b.order);
      setHeroImages(images);
    } catch (error) {
      console.error('Error fetching hero images:', error);
      toast({
        title: "Error",
        description: "Failed to load hero images",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "Image size must be less than 5MB",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      // Create a unique filename
      const timestamp = Date.now();
      const filename = `hero-images/${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const storageRef = ref(storage, filename);

      // Upload the file with metadata
      const metadata = {
        contentType: file.type,
        customMetadata: {
          uploadedAt: new Date().toISOString()
        }
      };
      
      console.log('Uploading file:', filename, 'Size:', file.size);
      const snapshot = await uploadBytes(storageRef, file, metadata);
      const downloadURL = await getDownloadURL(snapshot.ref);
      console.log('Upload successful, URL:', downloadURL);

      // Update the hero image at the specific index
      const updatedImages = [...heroImages];
      if (updatedImages[index]) {
        updatedImages[index].image = downloadURL;
        setHeroImages(updatedImages);
      }

      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });
    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to upload image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleUpdateHeroImage = async (index: number, field: keyof HeroImage, value: string) => {
    const updatedImages = [...heroImages];
    if (updatedImages[index]) {
      updatedImages[index] = { ...updatedImages[index], [field]: value };
      setHeroImages(updatedImages);
    }
  };

  const saveHeroImages = async () => {
    setSaving(true);
    try {
      // Validate that all images have URLs
      const invalidImages = heroImages.filter(img => !img.image || !img.title);
      if (invalidImages.length > 0) {
        toast({
          title: "Warning",
          description: "Please upload images and add titles for all slides before saving",
          variant: "destructive",
        });
        setSaving(false);
        return;
      }

      console.log('Saving hero images:', heroImages.length);
      
      // Clear existing hero images
      const querySnapshot = await getDocs(collection(db, 'heroImages'));
      console.log('Deleting', querySnapshot.size, 'existing images');
      const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);

      // Add new hero images
      const addPromises = heroImages.map((image, index) => {
        const imageData = {
          image: image.image,
          title: image.title,
          subtitle: image.subtitle || '',
          description: image.description || '',
          order: index,
          updatedAt: new Date().toISOString()
        };
        console.log('Adding image', index, imageData);
        return addDoc(collection(db, 'heroImages'), imageData);
      });
      
      await Promise.all(addPromises);

      toast({
        title: "Success",
        description: `${heroImages.length} hero images saved successfully`,
      });

      // Small delay before reload
      setTimeout(() => {
        window.location.href = '/';
      }, 1000);
    } catch (error: any) {
      console.error('Error saving hero images:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save hero images",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const addNewSlide = () => {
    setHeroImages([...heroImages, {
      id: `new-${Date.now()}`,
      image: '',
      title: '',
      subtitle: '',
      description: '',
      order: heroImages.length
    }]);
  };

  const removeSlide = (index: number) => {
    const updatedImages = heroImages.filter((_, i) => i !== index);
    setHeroImages(updatedImages);
  };

  if (loading) {
    return <div>Loading hero images...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Hero Background Images Manager</span>
          <div className="space-x-2">
            <Button onClick={addNewSlide} variant="outline" disabled={uploading || saving}>
              Add New Slide
            </Button>
            <Button 
              onClick={saveHeroImages} 
              className="bg-green-600 hover:bg-green-700"
              disabled={uploading || saving}
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Saving...' : 'Save All Changes'}
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {uploading && (
          <div className="mb-4 p-4 bg-blue-50 rounded-lg flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-3"></div>
            <span className="text-blue-700">Uploading image...</span>
          </div>
        )}
        
        <div className="space-y-6">
          {heroImages.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No hero images configured yet.</p>
              <Button onClick={addNewSlide}>Add First Slide</Button>
            </div>
          ) : (
            heroImages.map((image, index) => (
              <div key={image.id} className="border rounded-lg p-4 space-y-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold">Slide {index + 1}</h3>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeSlide(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor={`image-${index}`}>Image</Label>
                      <div className="flex items-center space-x-2">
                        <Input
                          id={`image-${index}`}
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, index)}
                          disabled={uploading}
                        />
                        {image.image && (
                          <a href={image.image} target="_blank" rel="noopener noreferrer">
                            <ImageIcon className="w-6 h-6 text-blue-600" />
                          </a>
                        )}
                      </div>
                      {image.image && (
                        <img
                          src={image.image}
                          alt={image.title}
                          className="mt-2 w-full h-32 object-cover rounded"
                        />
                      )}
                    </div>

                    <div>
                      <Label htmlFor={`title-${index}`}>Title</Label>
                      <Input
                        id={`title-${index}`}
                        value={image.title}
                        onChange={(e) => handleUpdateHeroImage(index, 'title', e.target.value)}
                        placeholder="e.g., Sigiriya Rock Fortress"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor={`subtitle-${index}`}>Subtitle</Label>
                      <Input
                        id={`subtitle-${index}`}
                        value={image.subtitle}
                        onChange={(e) => handleUpdateHeroImage(index, 'subtitle', e.target.value)}
                        placeholder="e.g., The Eighth Wonder of the World"
                      />
                    </div>

                    <div>
                      <Label htmlFor={`description-${index}`}>Description</Label>
                      <textarea
                        id={`description-${index}`}
                        value={image.description}
                        onChange={(e) => handleUpdateHeroImage(index, 'description', e.target.value)}
                        placeholder="e.g., Spectacular aerial drone view..."
                        className="w-full px-3 py-2 border rounded-md"
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold mb-2">Instructions:</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Upload high-quality images (minimum 1920x1080, ideally 4K)</li>
            <li>• Images will appear as rotating backgrounds on the homepage</li>
            <li>• Each slide displays for 5 seconds before transitioning</li>
            <li>• Recommended: 5-10 slides for optimal experience</li>
            <li>• Click "Save All Changes" to apply updates to the website</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}