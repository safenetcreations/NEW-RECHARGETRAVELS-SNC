import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Upload, Image as ImageIcon } from 'lucide-react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/services/firebaseService';
import { cmsService } from '@/services/cmsService';

export const HomepageContentManager = () => {
    const [backgroundImage, setBackgroundImage] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const settings = await cmsService.homepageSettings.getActive();
                if (settings?.featuredDestinationsBackgroundImage) {
                    setBackgroundImage(settings.featuredDestinationsBackgroundImage);
                }
            } catch (error) {
                console.error('Error fetching homepage settings:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setUploading(true);
            const fileExt = file.name.split('.').pop();
            const fileName = `homepage_featured_bg_${Date.now()}.${fileExt}`;
            const storageRef = ref(storage, `homepage/${fileName}`);

            const uploadResult = await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(uploadResult.ref);

            setBackgroundImage(downloadURL);

            // Auto-save after upload
            await cmsService.homepageSettings.update({
                featuredDestinationsBackgroundImage: downloadURL
            });

            toast({
                title: "Success",
                description: "Background image updated successfully"
            });
        } catch (error) {
            console.error('Error uploading image:', error);
            toast({
                title: "Error",
                description: "Failed to upload image",
                variant: "destructive"
            });
        } finally {
            setUploading(false);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <ImageIcon className="h-5 w-5" />
                        Featured Destinations Background
                    </CardTitle>
                    <CardDescription>
                        Update the background image for the Featured Destinations section on the homepage.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-4">
                        <div className="aspect-video w-full max-w-2xl rounded-lg overflow-hidden bg-muted border relative group">
                            {backgroundImage ? (
                                <img
                                    src={backgroundImage}
                                    alt="Featured Destinations Background"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full text-muted-foreground">
                                    No image selected
                                </div>
                            )}

                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Label htmlFor="bg-upload" className="cursor-pointer">
                                    <Button variant="secondary" className="pointer-events-none">
                                        <Upload className="h-4 w-4 mr-2" />
                                        Change Image
                                    </Button>
                                </Label>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <Input
                                id="bg-upload"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageUpload}
                                disabled={uploading}
                            />
                            <Label htmlFor="bg-upload">
                                <Button variant="outline" disabled={uploading} className="cursor-pointer">
                                    <Upload className="h-4 w-4 mr-2" />
                                    {uploading ? 'Uploading...' : 'Upload New Image'}
                                </Button>
                            </Label>
                            {backgroundImage && (
                                <p className="text-sm text-muted-foreground">
                                    Current image URL: {backgroundImage.substring(0, 50)}...
                                </p>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
