import { useState, useCallback } from 'react';
import { 
  Upload, 
  File, 
  X, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  FileText,
  Image,
  Download
} from 'lucide-react';
import { useB2BAuth } from '@/contexts/B2BAuthContext';

interface UploadedDocument {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  downloadUrl: string;
  uploadedAt: Date;
}

interface DocumentUploadProps {
  bookingId: string;
  existingDocuments?: UploadedDocument[];
  onUploadComplete?: (doc: UploadedDocument) => void;
  maxFiles?: number;
  acceptedTypes?: string[];
}

const DocumentUpload = ({
  bookingId,
  existingDocuments = [],
  onUploadComplete,
  maxFiles = 5,
  acceptedTypes = ['.pdf', '.jpg', '.jpeg', '.png', '.doc', '.docx']
}: DocumentUploadProps) => {
  const { token } = useB2BAuth();
  const [documents, setDocuments] = useState<UploadedDocument[]>(existingDocuments);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const uploadFile = async (file: File) => {
    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('bookingId', bookingId);

      const response = await fetch('/api/b2b/documents/upload', {
        method: 'POST',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` })
        },
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        const newDoc: UploadedDocument = {
          id: data.documentId,
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
          downloadUrl: data.downloadUrl,
          uploadedAt: new Date()
        };

        setDocuments(prev => [...prev, newDoc]);
        onUploadComplete?.(newDoc);
      } else {
        setError(data.message || 'Upload failed');
      }
    } catch (err) {
      setError('Failed to upload file. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      if (documents.length >= maxFiles) {
        setError(`Maximum ${maxFiles} files allowed`);
        return;
      }
      uploadFile(e.dataTransfer.files[0]);
    }
  }, [documents.length, maxFiles]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      if (documents.length >= maxFiles) {
        setError(`Maximum ${maxFiles} files allowed`);
        return;
      }
      uploadFile(e.target.files[0]);
    }
  };

  const handleDelete = async (documentId: string) => {
    try {
      const response = await fetch(`/api/b2b/documents/${documentId}`, {
        method: 'DELETE',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` })
        }
      });

      if (response.ok) {
        setDocuments(prev => prev.filter(d => d.id !== documentId));
      }
    } catch (err) {
      console.error('Failed to delete document');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return Image;
    return FileText;
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all ${
          dragActive 
            ? 'border-emerald-500 bg-emerald-50' 
            : 'border-slate-300 hover:border-emerald-400 hover:bg-slate-50'
        } ${documents.length >= maxFiles ? 'opacity-50 pointer-events-none' : ''}`}
      >
        <input
          type="file"
          onChange={handleFileSelect}
          accept={acceptedTypes.join(',')}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={uploading || documents.length >= maxFiles}
        />

        {uploading ? (
          <div className="flex flex-col items-center">
            <Loader2 className="w-10 h-10 text-emerald-500 animate-spin mb-3" />
            <p className="text-slate-600">Uploading...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mb-3">
              <Upload className="w-7 h-7 text-emerald-600" />
            </div>
            <p className="text-slate-700 font-medium mb-1">
              Drag & drop files here or click to browse
            </p>
            <p className="text-sm text-slate-500">
              Supported: PDF, Images, Word documents (Max 10MB each)
            </p>
            <p className="text-xs text-slate-400 mt-2">
              {documents.length}/{maxFiles} files uploaded
            </p>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-700">{error}</p>
          <button onClick={() => setError(null)} className="ml-auto">
            <X className="w-4 h-4 text-red-500" />
          </button>
        </div>
      )}

      {/* Uploaded Documents List */}
      {documents.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-slate-700">Uploaded Documents</h4>
          {documents.map((doc) => {
            const FileIcon = getFileIcon(doc.fileType);
            return (
              <div
                key={doc.id}
                className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200"
              >
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-slate-200">
                  <FileIcon className="w-5 h-5 text-slate-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">{doc.fileName}</p>
                  <p className="text-xs text-slate-500">{formatFileSize(doc.fileSize)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                  <a
                    href={doc.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg"
                  >
                    <Download className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => handleDelete(doc.id)}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DocumentUpload;
