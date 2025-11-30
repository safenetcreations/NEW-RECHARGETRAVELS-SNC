import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { storage } from '@/lib/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { toast } from 'sonner';
import { FirebaseError } from 'firebase/app';

interface ImageUploadProps {
    value?: string;
    onChange: (url: string) => void;
    onRemove: () => void;
    disabled?: boolean;
    folder?: string;
    className?: string;
    helperText?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
    value,
    onChange,
    onRemove,
    disabled,
    folder = 'uploads',
    className,
    helperText = 'Recommended size: 1920x1080px (16:9). Max size: 10MB. Formats: JPG, PNG, WEBP.',
}) => {
    const [progress, setProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const triggerFileDialog = () => {
        if (disabled || isUploading) return;
        fileInputRef.current?.click();
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast.error('Please upload an image file (JPG, PNG, WEBP)');
            return;
        }

        // Log file size for debugging
        const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
        console.log(`📁 File: ${file.name}, Size: ${sizeInMB}MB`);
        toast.info(`Uploading ${sizeInMB}MB image...`);

        try {
            // Check if storage is available
            if (!storage) {
                toast.error('Storage not initialized. Please refresh the page.');
                console.error('Firebase Storage is not initialized');
                return;
            }

            setIsUploading(true);
            setProgress(0);

            // Create a unique filename
            const timestamp = Date.now();
            const filename = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
            console.log(`📤 Starting upload to: ${folder}/${filename}`);

            const storageRef = ref(storage, `${folder}/${filename}`);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setProgress(progress);
                    console.log(`📊 Upload progress: ${progress.toFixed(1)}%`);
                },
                (error: FirebaseError | Error) => {
                    console.error('❌ Upload error:', error);
                    const errorCode = (error as FirebaseError).code;
                    let errorMessage = error.message;

                    // Provide more helpful error messages
                    if (errorCode === 'storage/unauthorized') {
                        errorMessage = 'Permission denied. Please check storage rules.';
                    } else if (errorCode === 'storage/canceled') {
                        errorMessage = 'Upload was cancelled.';
                    } else if (errorCode === 'storage/unknown') {
                        errorMessage = 'An unknown error occurred. Please try again.';
                    } else if (errorCode === 'storage/retry-limit-exceeded') {
                        errorMessage = 'Upload timeout. Please check your connection.';
                    }

                    toast.error(`Upload failed: ${errorMessage}`);
                    setIsUploading(false);
                },
                async () => {
                    try {
                        console.log('✅ Upload completed, getting download URL...');
                        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                        console.log('🔗 Download URL:', downloadURL);
                        onChange(downloadURL);
                        toast.success('Image uploaded successfully');
                        setIsUploading(false);
                    } catch (error) {
                        console.error('❌ Error getting download URL:', error);
                        toast.error('Failed to get image URL');
                        setIsUploading(false);
                    }
                }
            );
        } catch (error) {
            console.error('❌ Error starting upload:', error);
            toast.error('Failed to start upload. Please try again.');
            setIsUploading(false);
        }
    };

    const handleRemove = () => {
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        onRemove();
    };

    return (
        <div className={`space-y-4 ${className}`}>
            {value ? (
                <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                    <img
                        src={value}
                        alt="Uploaded image"
                        className="h-full w-full object-cover"
                    />
                    <div className="absolute top-2 right-2">
                        <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            onClick={handleRemove}
                            disabled={disabled}
                            className="h-8 w-8 rounded-full shadow-md"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                        <div className="pointer-events-auto flex items-center justify-end gap-2">
                            <Button
                                type="button"
                                variant="secondary"
                                size="sm"
                                onClick={triggerFileDialog}
                                disabled={disabled || isUploading}
                                className="bg-white/90 text-gray-900 hover:bg-white shadow"
                            >
                                <Upload className="mr-2 h-4 w-4" />
                                {isUploading ? 'Updating...' : 'Change image'}
                            </Button>
                        </div>
                    </div>
                </div>
            ) : (
                <div
                    onClick={triggerFileDialog}
                    className={`
            relative flex flex-col items-center justify-center aspect-video w-full 
            rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 
            transition-colors hover:bg-gray-100 cursor-pointer
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            ${isUploading ? 'pointer-events-none' : ''}
          `}
                >
                    {isUploading ? (
                        <div className="flex flex-col items-center gap-2 p-4 w-full max-w-xs">
                            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                            <p className="text-sm font-medium text-gray-600">Uploading...</p>
                            <Progress value={progress} className="w-full h-2" />
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-2 p-4 text-center">
                            <div className="p-3 bg-blue-100 rounded-full">
                                <Upload className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-700">
                                    Click to upload image
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    {helperText}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            )}

            <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileSelect}
                className="hidden"
                disabled={disabled || isUploading}
            />
        </div>
    );
};

export default ImageUpload;
