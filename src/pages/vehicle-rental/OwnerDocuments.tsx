import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { 
  FileText, 
  Upload, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle,
  Eye,
  Trash2,
  Download,
  Camera,
  CreditCard,
  Car,
  Shield,
  Calendar,
  RefreshCw,
  ChevronRight,
  Info,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { collection, doc, getDoc, getDocs, query, where, addDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage, auth } from '@/lib/firebase';
import { useAuth } from '@/hooks/useAuth';

interface OwnerDocument {
  id: string;
  documentType: string;
  fileName: string;
  fileUrl: string;
  status: 'pending' | 'verified' | 'rejected' | 'expired';
  expiryDate?: Date;
  uploadedAt: Date;
  verifiedAt?: Date;
  verificationNotes?: string;
  rejectionReason?: string;
}

const DOCUMENT_TYPES = [
  {
    id: 'national_id_front',
    name: 'National ID (Front)',
    description: 'Front side of your National Identity Card',
    required: true,
    icon: CreditCard,
    category: 'identity'
  },
  {
    id: 'national_id_back',
    name: 'National ID (Back)',
    description: 'Back side of your National Identity Card',
    required: true,
    icon: CreditCard,
    category: 'identity'
  },
  {
    id: 'driving_license_front',
    name: 'Driving License (Front)',
    description: 'Front side of your valid driving license',
    required: false,
    icon: Car,
    category: 'license'
  },
  {
    id: 'driving_license_back',
    name: 'Driving License (Back)',
    description: 'Back side of your valid driving license',
    required: false,
    icon: Car,
    category: 'license'
  },
  {
    id: 'business_registration',
    name: 'Business Registration',
    description: 'Business registration certificate (if applicable)',
    required: false,
    icon: FileText,
    category: 'business'
  },
  {
    id: 'tax_certificate',
    name: 'Tax Identification',
    description: 'Tax identification number or certificate',
    required: false,
    icon: FileText,
    category: 'business'
  },
  {
    id: 'address_proof',
    name: 'Address Proof',
    description: 'Utility bill or bank statement (within 3 months)',
    required: true,
    icon: FileText,
    category: 'identity'
  },
  {
    id: 'profile_photo',
    name: 'Profile Photo',
    description: 'Clear photo of yourself for verification',
    required: true,
    icon: Camera,
    category: 'identity'
  }
];

const OwnerDocuments: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [documents, setDocuments] = useState<OwnerDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<string | null>(null);
  const [selectedPreview, setSelectedPreview] = useState<OwnerDocument | null>(null);
  const [ownerData, setOwnerData] = useState<any>(null);

  useEffect(() => {
    if (user) {
      fetchOwnerData();
      fetchDocuments();
    }
  }, [user]);

  const fetchOwnerData = async () => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) return;

      const ownerRef = doc(db, 'vehicle_owners', userId);
      const ownerSnap = await getDoc(ownerRef);
      
      if (ownerSnap.exists()) {
        setOwnerData({ id: ownerSnap.id, ...ownerSnap.data() });
      } else {
        // Redirect to registration if not registered
        navigate('/vehicle-rental/owner/register');
      }
    } catch (error) {
      console.error('Error fetching owner data:', error);
    }
  };

  const fetchDocuments = async () => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) return;

      const q = query(
        collection(db, 'owner_documents'),
        where('ownerId', '==', userId)
      );
      const querySnapshot = await getDocs(q);
      
      const docs = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        uploadedAt: doc.data().uploadedAt?.toDate(),
        expiryDate: doc.data().expiryDate?.toDate(),
        verifiedAt: doc.data().verifiedAt?.toDate()
      })) as OwnerDocument[];
      
      setDocuments(docs);
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (docType: string, file: File) => {
    const userId = auth.currentUser?.uid;
    if (!userId) {
      toast({ title: 'Error', description: 'Please log in to upload documents', variant: 'destructive' });
      return;
    }

    setUploading(docType);

    try {
      // Upload to Firebase Storage
      const fileName = `${Date.now()}_${file.name}`;
      const storagePath = `owner_documents/${userId}/${docType}/${fileName}`;
      const storageRef = ref(storage, storagePath);
      
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      // Check if document of this type already exists
      const existingDoc = documents.find(d => d.documentType === docType);
      
      if (existingDoc) {
        // Update existing document
        await updateDoc(doc(db, 'owner_documents', existingDoc.id), {
          fileName: file.name,
          fileUrl: downloadURL,
          status: 'pending',
          uploadedAt: serverTimestamp(),
          verifiedAt: null,
          verificationNotes: null,
          rejectionReason: null
        });
      } else {
        // Create new document record
        await addDoc(collection(db, 'owner_documents'), {
          ownerId: userId,
          documentType: docType,
          fileName: file.name,
          fileUrl: downloadURL,
          status: 'pending',
          uploadedAt: serverTimestamp()
        });
      }

      toast({ title: 'Success', description: 'Document uploaded successfully' });
      fetchDocuments();
    } catch (error) {
      console.error('Upload error:', error);
      toast({ title: 'Error', description: 'Failed to upload document', variant: 'destructive' });
    } finally {
      setUploading(null);
    }
  };

  const handleDeleteDocument = async (document: OwnerDocument) => {
    if (!confirm('Are you sure you want to delete this document?')) return;

    try {
      // Delete from Firestore
      await deleteDoc(doc(db, 'owner_documents', document.id));
      
      // Try to delete from Storage (may fail if URL format changed)
      try {
        const storageRef = ref(storage, document.fileUrl);
        await deleteObject(storageRef);
      } catch (storageError) {
        console.log('Storage deletion skipped:', storageError);
      }

      toast({ title: 'Deleted', description: 'Document removed successfully' });
      fetchDocuments();
    } catch (error) {
      console.error('Delete error:', error);
      toast({ title: 'Error', description: 'Failed to delete document', variant: 'destructive' });
    }
  };

  const getDocumentStatus = (docType: string): OwnerDocument | null => {
    return documents.find(d => d.documentType === docType) || null;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
            <CheckCircle className="w-3 h-3" /> Verified
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700">
            <XCircle className="w-3 h-3" /> Rejected
          </span>
        );
      case 'expired':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-700">
            <AlertTriangle className="w-3 h-3" /> Expired
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-700">
            <Clock className="w-3 h-3" /> Pending Review
          </span>
        );
    }
  };

  const getVerificationProgress = () => {
    const requiredDocs = DOCUMENT_TYPES.filter(d => d.required);
    const verifiedRequired = requiredDocs.filter(d => {
      const doc = getDocumentStatus(d.id);
      return doc && doc.status === 'verified';
    }).length;
    
    return {
      total: requiredDocs.length,
      verified: verifiedRequired,
      percentage: Math.round((verifiedRequired / requiredDocs.length) * 100)
    };
  };

  const progress = getVerificationProgress();

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Document Verification | Vehicle Owner Portal</title>
        <meta name="description" content="Upload and manage your verification documents for the vehicle rental platform." />
      </Helmet>

      <Header />

      <main className="min-h-screen bg-gradient-to-b from-purple-50 to-white pt-20">
        {/* Header Section */}
        <section className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white py-8">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center gap-2 text-purple-200 text-sm mb-2">
              <Link to="/vehicle-rental/owner-dashboard" className="hover:text-white">Dashboard</Link>
              <ChevronRight className="w-4 h-4" />
              <span>Documents</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold">Document Verification</h1>
            <p className="text-purple-100 mt-2">Upload required documents to verify your owner account</p>
          </div>
        </section>

        {/* Progress Bar */}
        <section className="bg-white border-b py-4">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Verification Progress</span>
              <span className="text-sm text-gray-500">{progress.verified} of {progress.total} required documents verified</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className={`h-3 rounded-full transition-all duration-500 ${
                  progress.percentage === 100 ? 'bg-green-500' : 'bg-purple-600'
                }`}
                style={{ width: `${progress.percentage}%` }}
              />
            </div>
            {progress.percentage === 100 && (
              <p className="text-green-600 text-sm mt-2 flex items-center gap-1">
                <CheckCircle className="w-4 h-4" /> All required documents verified! You can now list vehicles.
              </p>
            )}
          </div>
        </section>

        {/* Documents Grid */}
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4">
            {/* Identity Documents */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-purple-600" />
                Identity Documents
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {DOCUMENT_TYPES.filter(d => d.category === 'identity').map(docType => {
                  const existingDoc = getDocumentStatus(docType.id);
                  const isUploading = uploading === docType.id;
                  
                  return (
                    <div 
                      key={docType.id}
                      className={`bg-white rounded-xl border-2 p-4 transition-all ${
                        existingDoc?.status === 'verified' 
                          ? 'border-green-200 bg-green-50/50' 
                          : existingDoc?.status === 'rejected'
                          ? 'border-red-200 bg-red-50/50'
                          : 'border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            existingDoc?.status === 'verified' ? 'bg-green-100' : 'bg-purple-100'
                          }`}>
                            <docType.icon className={`w-5 h-5 ${
                              existingDoc?.status === 'verified' ? 'text-green-600' : 'text-purple-600'
                            }`} />
                          </div>
                          {docType.required && (
                            <span className="text-xs text-red-500 font-medium">Required</span>
                          )}
                        </div>
                        {existingDoc && getStatusBadge(existingDoc.status)}
                      </div>

                      <h3 className="font-medium text-gray-900 mb-1">{docType.name}</h3>
                      <p className="text-xs text-gray-500 mb-4">{docType.description}</p>

                      {existingDoc ? (
                        <div className="space-y-2">
                          {/* Preview */}
                          <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden relative group">
                            <img 
                              src={existingDoc.fileUrl} 
                              alt={docType.name}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                              <button 
                                onClick={() => setSelectedPreview(existingDoc)}
                                className="p-2 bg-white rounded-lg hover:bg-gray-100"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <a 
                                href={existingDoc.fileUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="p-2 bg-white rounded-lg hover:bg-gray-100"
                              >
                                <Download className="w-4 h-4" />
                              </a>
                              {existingDoc.status !== 'verified' && (
                                <button 
                                  onClick={() => handleDeleteDocument(existingDoc)}
                                  className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Rejection reason */}
                          {existingDoc.status === 'rejected' && existingDoc.rejectionReason && (
                            <div className="p-2 bg-red-50 border border-red-200 rounded-lg">
                              <p className="text-xs text-red-700">
                                <strong>Reason:</strong> {existingDoc.rejectionReason}
                              </p>
                            </div>
                          )}

                          {/* Re-upload button for rejected */}
                          {existingDoc.status === 'rejected' && (
                            <label className="block">
                              <input
                                type="file"
                                accept="image/*,.pdf"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) handleFileUpload(docType.id, file);
                                }}
                                className="hidden"
                              />
                              <span className="flex items-center justify-center gap-2 w-full py-2 px-3 text-sm bg-purple-600 text-white rounded-lg cursor-pointer hover:bg-purple-700">
                                <RefreshCw className="w-4 h-4" /> Re-upload
                              </span>
                            </label>
                          )}

                          <p className="text-xs text-gray-400">
                            Uploaded: {existingDoc.uploadedAt.toLocaleDateString()}
                          </p>
                        </div>
                      ) : (
                        <label className="block cursor-pointer">
                          <input
                            type="file"
                            accept="image/*,.pdf"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleFileUpload(docType.id, file);
                            }}
                            className="hidden"
                            disabled={isUploading}
                          />
                          <div className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
                            isUploading ? 'border-purple-400 bg-purple-50' : 'border-gray-300 hover:border-purple-400 hover:bg-purple-50'
                          }`}>
                            {isUploading ? (
                              <div className="flex flex-col items-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mb-2"></div>
                                <span className="text-sm text-purple-600">Uploading...</span>
                              </div>
                            ) : (
                              <>
                                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                <span className="text-sm text-gray-500">Click to upload</span>
                                <span className="text-xs text-gray-400 block mt-1">JPG, PNG or PDF</span>
                              </>
                            )}
                          </div>
                        </label>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* License Documents */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Car className="w-5 h-5 text-purple-600" />
                License Documents
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {DOCUMENT_TYPES.filter(d => d.category === 'license').map(docType => {
                  const existingDoc = getDocumentStatus(docType.id);
                  const isUploading = uploading === docType.id;
                  
                  return (
                    <div 
                      key={docType.id}
                      className={`bg-white rounded-xl border-2 p-4 transition-all ${
                        existingDoc?.status === 'verified' 
                          ? 'border-green-200 bg-green-50/50' 
                          : existingDoc?.status === 'rejected'
                          ? 'border-red-200 bg-red-50/50'
                          : 'border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                          <docType.icon className="w-5 h-5 text-blue-600" />
                        </div>
                        {existingDoc && getStatusBadge(existingDoc.status)}
                      </div>

                      <h3 className="font-medium text-gray-900 mb-1">{docType.name}</h3>
                      <p className="text-xs text-gray-500 mb-4">{docType.description}</p>

                      {existingDoc ? (
                        <div className="space-y-2">
                          <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden relative group">
                            <img 
                              src={existingDoc.fileUrl} 
                              alt={docType.name}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                              <button 
                                onClick={() => setSelectedPreview(existingDoc)}
                                className="p-2 bg-white rounded-lg hover:bg-gray-100"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              {existingDoc.status !== 'verified' && (
                                <button 
                                  onClick={() => handleDeleteDocument(existingDoc)}
                                  className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </div>
                          <p className="text-xs text-gray-400">
                            Uploaded: {existingDoc.uploadedAt.toLocaleDateString()}
                          </p>
                        </div>
                      ) : (
                        <label className="block cursor-pointer">
                          <input
                            type="file"
                            accept="image/*,.pdf"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleFileUpload(docType.id, file);
                            }}
                            className="hidden"
                            disabled={isUploading}
                          />
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-purple-400 hover:bg-purple-50 transition-colors">
                            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                            <span className="text-sm text-gray-500">Click to upload</span>
                          </div>
                        </label>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Business Documents */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-600" />
                Business Documents (Optional)
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {DOCUMENT_TYPES.filter(d => d.category === 'business').map(docType => {
                  const existingDoc = getDocumentStatus(docType.id);
                  const isUploading = uploading === docType.id;
                  
                  return (
                    <div 
                      key={docType.id}
                      className={`bg-white rounded-xl border-2 p-4 transition-all ${
                        existingDoc?.status === 'verified' 
                          ? 'border-green-200 bg-green-50/50' 
                          : 'border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                          <docType.icon className="w-5 h-5 text-gray-600" />
                        </div>
                        {existingDoc && getStatusBadge(existingDoc.status)}
                      </div>

                      <h3 className="font-medium text-gray-900 mb-1">{docType.name}</h3>
                      <p className="text-xs text-gray-500 mb-4">{docType.description}</p>

                      {existingDoc ? (
                        <div className="space-y-2">
                          <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden relative group">
                            <img 
                              src={existingDoc.fileUrl} 
                              alt={docType.name}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                              <button 
                                onClick={() => setSelectedPreview(existingDoc)}
                                className="p-2 bg-white rounded-lg hover:bg-gray-100"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              {existingDoc.status !== 'verified' && (
                                <button 
                                  onClick={() => handleDeleteDocument(existingDoc)}
                                  className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <label className="block cursor-pointer">
                          <input
                            type="file"
                            accept="image/*,.pdf"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleFileUpload(docType.id, file);
                            }}
                            className="hidden"
                            disabled={isUploading}
                          />
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-purple-400 hover:bg-purple-50 transition-colors">
                            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                            <span className="text-sm text-gray-500">Click to upload</span>
                          </div>
                        </label>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Help Section */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <div className="flex gap-4">
                <Info className="w-6 h-6 text-blue-600 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-blue-900 mb-2">Document Verification Tips</h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Ensure all documents are clear, readable, and not expired</li>
                    <li>• Upload high-quality images or scanned PDFs</li>
                    <li>• Documents are reviewed within 24-48 hours</li>
                    <li>• You'll receive an email notification once verified</li>
                    <li>• All documents must be verified before you can list vehicles</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Preview Modal */}
      {selectedPreview && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full">
            <button 
              onClick={() => setSelectedPreview(null)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300"
            >
              <X className="w-8 h-8" />
            </button>
            <img 
              src={selectedPreview.fileUrl} 
              alt={selectedPreview.documentType}
              className="w-full max-h-[80vh] object-contain rounded-lg"
            />
            <div className="mt-4 text-center text-white">
              <p className="font-medium">{selectedPreview.fileName}</p>
              <p className="text-sm text-gray-300">
                Uploaded: {selectedPreview.uploadedAt.toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default OwnerDocuments;
