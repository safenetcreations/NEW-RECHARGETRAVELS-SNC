import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Upload, X, Film, Loader2, Play } from 'lucide-react';
import { toast } from 'sonner';
import { storage } from '@/lib/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { FirebaseError } from 'firebase/app';

interface VideoUploadProps {
  value?: string;
  poster?: string;
  onChange: (url: string, poster?: string) => void;
  onRemove: () => void;
  disabled?: boolean;
  folder?: string;
  helperText?: string;
}

const VideoUpload: React.FC<VideoUploadProps> = ({
  value,
  poster,
  onChange,
  onRemove,
  disabled,
  folder = 'videos',
  helperText = 'MP4 / MOV up to 200MB. Ideal length 10-20s.'
}) => {
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const triggerFileDialog = () => {
    if (disabled || isUploading) return;
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      toast.error('Please upload a video file (MP4, MOV)');
      return;
    }

    if (!storage) {
      toast.error('Storage not initialized. Please refresh.');
      return;
    }

    try {
      setIsUploading(true);
      setProgress(0);

      const timestamp = Date.now();
      const filename = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
      const storageRef = ref(storage, `${folder}/${filename}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const pct = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(pct);
        },
        (error: FirebaseError | Error) => {
          console.error(error);
          toast.error('Video upload failed.');
          setIsUploading(false);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            onChange(downloadURL, poster);
            toast.success('Video uploaded.');
          } catch (err) {
            console.error(err);
            toast.error('Unable to fetch video URL.');
          } finally {
            setIsUploading(false);
          }
        }
      );
    } catch (error) {
      console.error(error);
      toast.error('Upload failed.');
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    if (fileInputRef.current) fileInputRef.current.value = '';
    onRemove();
  };

  return (
    <div className="space-y-3">
      {value ? (
        <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
          <video src={value} poster={poster} controls className="h-56 w-full object-cover" />
          <div className="absolute inset-x-0 bottom-0 flex justify-between bg-gradient-to-t from-black/70 to-transparent p-3 text-sm text-white">
            <span className="inline-flex items-center gap-2">
              <Film className="h-4 w-4" /> Uploaded video
            </span>
            <div className="flex gap-2">
              <Button size="sm" variant="secondary" onClick={triggerFileDialog} disabled={isUploading || disabled}>
                <Upload className="mr-1 h-4 w-4" /> {isUploading ? 'Updating…' : 'Change'}
              </Button>
              <Button size="sm" variant="destructive" onClick={handleRemove} disabled={isUploading || disabled}>
                <X className="mr-1 h-4 w-4" /> Remove
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div
          onClick={triggerFileDialog}
          className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-white p-6 text-center shadow-sm transition hover:bg-slate-50 ${
            disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
          } ${isUploading ? 'pointer-events-none opacity-60' : ''}`}
        >
          {isUploading ? (
            <div className="w-full max-w-xs space-y-3">
              <Loader2 className="mx-auto h-8 w-8 animate-spin text-emerald-500" />
              <Progress value={progress} />
              <p className="text-xs text-slate-500">Uploading video…</p>
            </div>
          ) : (
            <>
              <div className="rounded-full bg-emerald-100 p-3">
                <Play className="h-6 w-6 text-emerald-600" />
              </div>
              <p className="mt-3 text-sm font-semibold text-slate-700">Click to upload hero video</p>
              <p className="text-xs text-slate-500">{helperText}</p>
            </>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="video/mp4,video/mov,video/quicktime"
        className="hidden"
        onChange={handleFileSelect}
      />
    </div>
  );
};

export default VideoUpload;
