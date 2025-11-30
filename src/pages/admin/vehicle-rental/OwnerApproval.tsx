import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  User, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Eye,
  FileText,
  Car,
  Calendar,
  MapPin,
  DollarSign,
  Filter,
  Search,
  ChevronDown,
  ChevronRight,
  AlertTriangle,
  Shield,
  Star,
  MoreVertical,
  ExternalLink,
  MessageSquare,
  Ban,
  Check,
  X,
  RefreshCw,
  Download,
  Image,
  Phone,
  Mail,
  Building,
  CreditCard,
  BadgeCheck,
  IdCard,
  Landmark,
  FileCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { collection, doc, getDocs, query, where, orderBy, updateDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { VehicleOwner, OwnerVerificationStatus } from '@/types/vehicleRental';
import { emailService } from '@/services/emailService';

interface OwnerDocument {
  id: string;
  type: 'national_id_front' | 'national_id_back' | 'driving_license' | 'passport' | 'bank_statement' | 'tax_certificate' | 'authorization_letter' | 'business_license';
  url: string;
  status: 'pending' | 'verified' | 'rejected';
  uploadedAt: Date;
  verifiedAt?: Date;
  expiryDate?: Date;
  rejectionReason?: string;
}

interface OwnerSubmission {
  id: string;
  userId: string;
  
  // Personal Info
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  whatsapp?: string;
  profilePhoto?: string;
  
  // Address
  address: {
    line1: string;
    line2?: string;
    city: string;
    district: string;
    postalCode: string;
  };
  
  // Identity
  nationalId?: string;
  passportNumber?: string;
  drivingLicenseNumber?: string;
  
  // Bank Details
  bankDetails: {
    bankName: string;
    accountNumber: string;
    accountHolderName: string;
    branchCode: string;
    verified: boolean;
  };
  
  // Business Info
  businessLicense?: string;
  taxId?: string;
  
  // Verification
  verificationStatus: OwnerVerificationStatus;
  verificationSteps: {
    step1_registration: boolean;
    step2_id_verification: boolean;
    step3_address_verification: boolean;
    step4_bank_verification: boolean;
    step5_profile_completion: boolean;
    step6_admin_verification: boolean;
  };
  verificationNotes?: string;
  
  // Documents
  documents: OwnerDocument[];
  
  // Stats
  totalVehicles: number;
  totalBookings: number;
  totalEarnings: number;
  rating: number;
  reviewCount: number;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

// Mock data for demo
const mockOwners: OwnerSubmission[] = [
  {
    id: 'owner1',
    userId: 'user1',
    firstName: 'Nuwan',
    lastName: 'Perera',
    email: 'nuwan.perera@email.com',
    phone: '+94 77 772 1999',
    whatsapp: '+94 77 772 1999',
    profilePhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    address: {
      line1: '45 Galle Road',
      line2: 'Kollupitiya',
      city: 'Colombo',
      district: 'Colombo',
      postalCode: '00300'
    },
    nationalId: '199012345678',
    drivingLicenseNumber: 'DL-2345678',
    bankDetails: {
      bankName: 'Commercial Bank of Ceylon',
      accountNumber: '****4567',
      accountHolderName: 'N. Perera',
      branchCode: 'CBC001',
      verified: false
    },
    taxId: 'TAX-123456',
    verificationStatus: 'pending_admin_review',
    verificationSteps: {
      step1_registration: true,
      step2_id_verification: true,
      step3_address_verification: true,
      step4_bank_verification: false,
      step5_profile_completion: true,
      step6_admin_verification: false
    },
    documents: [
      { id: 'd1', type: 'national_id_front', url: '/docs/id-front.jpg', status: 'verified', uploadedAt: new Date('2024-01-10') },
      { id: 'd2', type: 'national_id_back', url: '/docs/id-back.jpg', status: 'verified', uploadedAt: new Date('2024-01-10') },
      { id: 'd3', type: 'driving_license', url: '/docs/license.jpg', status: 'pending', uploadedAt: new Date('2024-01-12'), expiryDate: new Date('2027-06-15') },
      { id: 'd4', type: 'bank_statement', url: '/docs/bank.pdf', status: 'pending', uploadedAt: new Date('2024-01-15') },
    ],
    totalVehicles: 2,
    totalBookings: 0,
    totalEarnings: 0,
    rating: 0,
    reviewCount: 0,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 'owner2',
    userId: 'user2',
    firstName: 'Saman',
    lastName: 'Silva',
    email: 'saman.silva@email.com',
    phone: '+94 71 987 6543',
    whatsapp: '+94 71 987 6543',
    profilePhoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200',
    address: {
      line1: '123 Main Street',
      city: 'Kandy',
      district: 'Kandy',
      postalCode: '20000'
    },
    nationalId: '198512345678',
    drivingLicenseNumber: 'DL-9876543',
    passportNumber: 'N1234567',
    bankDetails: {
      bankName: 'Bank of Ceylon',
      accountNumber: '****8901',
      accountHolderName: 'S. Silva',
      branchCode: 'BOC002',
      verified: true
    },
    businessLicense: 'BL-2024-001',
    taxId: 'TAX-654321',
    verificationStatus: 'pending_verification',
    verificationSteps: {
      step1_registration: true,
      step2_id_verification: false,
      step3_address_verification: true,
      step4_bank_verification: true,
      step5_profile_completion: true,
      step6_admin_verification: false
    },
    documents: [
      { id: 'd5', type: 'national_id_front', url: '/docs/id-front2.jpg', status: 'pending', uploadedAt: new Date('2024-01-20') },
      { id: 'd6', type: 'passport', url: '/docs/passport.jpg', status: 'pending', uploadedAt: new Date('2024-01-20'), expiryDate: new Date('2030-03-20') },
      { id: 'd7', type: 'business_license', url: '/docs/business.pdf', status: 'pending', uploadedAt: new Date('2024-01-22') },
    ],
    totalVehicles: 5,
    totalBookings: 47,
    totalEarnings: 12500,
    rating: 4.8,
    reviewCount: 32,
    createdAt: new Date('2023-06-15'),
    updatedAt: new Date('2024-01-22')
  },
  {
    id: 'owner3',
    userId: 'user3',
    firstName: 'Kamala',
    lastName: 'Fernando',
    email: 'kamala.fernando@email.com',
    phone: '+94 76 555 1234',
    address: {
      line1: '78 Beach Road',
      city: 'Negombo',
      district: 'Gampaha',
      postalCode: '11500'
    },
    nationalId: '199234567890',
    drivingLicenseNumber: 'DL-1112233',
    bankDetails: {
      bankName: 'Peoples Bank',
      accountNumber: '****2345',
      accountHolderName: 'K. Fernando',
      branchCode: 'PB003',
      verified: false
    },
    verificationStatus: 'rejected',
    verificationSteps: {
      step1_registration: true,
      step2_id_verification: false,
      step3_address_verification: false,
      step4_bank_verification: false,
      step5_profile_completion: false,
      step6_admin_verification: false
    },
    verificationNotes: 'ID document is blurry and unreadable. Bank statement older than 3 months.',
    documents: [
      { id: 'd8', type: 'national_id_front', url: '/docs/id-front3.jpg', status: 'rejected', uploadedAt: new Date('2024-01-05'), rejectionReason: 'Image is blurry and text is unreadable' },
      { id: 'd9', type: 'bank_statement', url: '/docs/bank3.pdf', status: 'rejected', uploadedAt: new Date('2024-01-05'), rejectionReason: 'Statement is older than 3 months' },
    ],
    totalVehicles: 0,
    totalBookings: 0,
    totalEarnings: 0,
    rating: 0,
    reviewCount: 0,
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-08')
  },
  {
    id: 'owner4',
    userId: 'user4',
    firstName: 'Ravi',
    lastName: 'Jayawardena',
    email: 'ravi.j@email.com',
    phone: '+94 70 888 9999',
    whatsapp: '+94 70 888 9999',
    profilePhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
    address: {
      line1: '56 Hill Street',
      line2: 'Apt 12',
      city: 'Galle',
      district: 'Galle',
      postalCode: '80000'
    },
    nationalId: '198823456789',
    drivingLicenseNumber: 'DL-4445566',
    bankDetails: {
      bankName: 'Sampath Bank',
      accountNumber: '****6789',
      accountHolderName: 'R. Jayawardena',
      branchCode: 'SB004',
      verified: true
    },
    verificationStatus: 'verified',
    verificationSteps: {
      step1_registration: true,
      step2_id_verification: true,
      step3_address_verification: true,
      step4_bank_verification: true,
      step5_profile_completion: true,
      step6_admin_verification: true
    },
    documents: [
      { id: 'd10', type: 'national_id_front', url: '/docs/id-front4.jpg', status: 'verified', uploadedAt: new Date('2023-08-10'), verifiedAt: new Date('2023-08-12') },
      { id: 'd11', type: 'national_id_back', url: '/docs/id-back4.jpg', status: 'verified', uploadedAt: new Date('2023-08-10'), verifiedAt: new Date('2023-08-12') },
      { id: 'd12', type: 'driving_license', url: '/docs/license4.jpg', status: 'verified', uploadedAt: new Date('2023-08-10'), verifiedAt: new Date('2023-08-12'), expiryDate: new Date('2028-04-20') },
      { id: 'd13', type: 'bank_statement', url: '/docs/bank4.pdf', status: 'verified', uploadedAt: new Date('2023-08-10'), verifiedAt: new Date('2023-08-12') },
    ],
    totalVehicles: 3,
    totalBookings: 89,
    totalEarnings: 28750,
    rating: 4.9,
    reviewCount: 67,
    createdAt: new Date('2023-08-10'),
    updatedAt: new Date('2024-01-20')
  }
];

const OwnerApproval: React.FC = () => {
  const { toast } = useToast();
  const [owners, setOwners] = useState<OwnerSubmission[]>(mockOwners);
  const [loading, setLoading] = useState(false);
  const [selectedOwner, setSelectedOwner] = useState<OwnerSubmission | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'detail'>('list');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [rejectionNotes, setRejectionNotes] = useState('');
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<OwnerDocument | null>(null);
  const [documentRejectionReason, setDocumentRejectionReason] = useState('');
  const sendDecisionEmail = async (owner: OwnerSubmission, status: 'approved' | 'rejected', notes?: string) => {
    if (!owner.email) return;
    const subject =
      status === 'approved'
        ? 'Your Recharge vehicle owner application is approved'
        : 'Update on your Recharge vehicle owner application';
    const html =
      status === 'approved'
        ? `
            <p>Hi ${owner.firstName},</p>
            <p>Great news! Your vehicle owner application has been approved.</p>
            <ul>
              <li>Owner ID: ${owner.id}</li>
              <li>Status: Approved</li>
            </ul>
            <p>You can now log in and list vehicles: <a href="https://www.rechargetravels.com/vehicle-rental/owner-dashboard">Owner Dashboard</a></p>
            <p>Thanks for partnering with Recharge.</p>
          `
        : `
            <p>Hi ${owner.firstName},</p>
            <p>Your vehicle owner application needs attention.</p>
            <ul>
              <li>Owner ID: ${owner.id}</li>
              <li>Status: Rejected</li>
            </ul>
            ${notes ? `<p>Notes from admin: ${notes}</p>` : ''}
            <p>Please update your details and re-submit. If you believe this is an error, reply to this email.</p>
          `;

    try {
      await emailService.sendEmail({
        to: owner.email,
        subject,
        html,
        text: `${subject}\nOwner ID: ${owner.id}\nStatus: ${status}${notes ? `\nNotes: ${notes}` : ''}`
      });
    } catch (err) {
      console.error('Owner decision email failed', err);
    }
  };

  // Stats
  const stats = {
    total: owners.length,
    pending: owners.filter(o => o.verificationStatus === 'pending_admin_review' || o.verificationStatus === 'pending_verification').length,
    verified: owners.filter(o => o.verificationStatus === 'verified').length,
    rejected: owners.filter(o => o.verificationStatus === 'rejected').length,
    suspended: owners.filter(o => o.verificationStatus === 'suspended').length
  };

  // Filter and search
  const filteredOwners = owners.filter(owner => {
    const matchesStatus = filterStatus === 'all' || owner.verificationStatus === filterStatus ||
      (filterStatus === 'pending' && (owner.verificationStatus === 'pending_admin_review' || owner.verificationStatus === 'pending_verification'));
    const matchesSearch = searchQuery === '' || 
      `${owner.firstName} ${owner.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      owner.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      owner.phone.includes(searchQuery);
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: OwnerVerificationStatus) => {
    switch (status) {
      case 'verified':
        return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"><CheckCircle className="h-3 w-3" /> Verified</span>;
      case 'pending_admin_review':
        return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3" /> Pending Review</span>;
      case 'pending_verification':
        return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800"><FileText className="h-3 w-3" /> Documents Pending</span>;
      case 'incomplete':
        return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"><Clock className="h-3 w-3" /> Incomplete</span>;
      case 'rejected':
        return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800"><XCircle className="h-3 w-3" /> Rejected</span>;
      case 'suspended':
        return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"><Ban className="h-3 w-3" /> Suspended</span>;
      default:
        return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  const getDocumentStatusBadge = (status: 'pending' | 'verified' | 'rejected') => {
    switch (status) {
      case 'verified':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700"><Check className="h-3 w-3" /> Verified</span>;
      case 'pending':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-700"><Clock className="h-3 w-3" /> Pending</span>;
      case 'rejected':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-700"><X className="h-3 w-3" /> Rejected</span>;
    }
  };

  const getDocumentTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      national_id_front: 'National ID (Front)',
      national_id_back: 'National ID (Back)',
      driving_license: 'Driving License',
      passport: 'Passport',
      bank_statement: 'Bank Statement',
      tax_certificate: 'Tax Certificate',
      authorization_letter: 'Authorization Letter',
      business_license: 'Business License'
    };
    return labels[type] || type;
  };

  const handleApproveOwner = async (ownerId: string) => {
    setLoading(true);
    try {
      // In production, update Firestore
      // await updateDoc(doc(db, 'vehicle_owners', ownerId), {
      //   verificationStatus: 'verified',
      //   'verificationSteps.step6_admin_verification': true,
      //   verifiedAt: serverTimestamp(),
      //   verifiedBy: 'admin'
      // });
      
      setOwners(prev => prev.map(o => 
        o.id === ownerId 
          ? { 
              ...o, 
              verificationStatus: 'verified' as OwnerVerificationStatus,
              verificationSteps: { ...o.verificationSteps, step6_admin_verification: true }
            } 
          : o
      ));
      
      toast({
        title: "Owner Approved",
        description: "The vehicle owner has been verified and can now list vehicles.",
      });

      const approvedOwner = owners.find(o => o.id === ownerId);
      if (approvedOwner) {
        sendDecisionEmail(approvedOwner, 'approved');
      }
      
      setSelectedOwner(null);
      setViewMode('list');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve owner. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRejectOwner = async (ownerId: string) => {
    if (!rejectionNotes.trim()) {
      toast({
        title: "Rejection Notes Required",
        description: "Please provide a reason for rejection.",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    try {
      setOwners(prev => prev.map(o => 
        o.id === ownerId 
          ? { 
              ...o, 
              verificationStatus: 'rejected' as OwnerVerificationStatus,
              verificationNotes: rejectionNotes
            } 
          : o
      ));
      
      toast({
        title: "Owner Rejected",
        description: "The owner application has been rejected.",
      });

      const rejectedOwner = owners.find(o => o.id === ownerId);
      if (rejectedOwner) {
        sendDecisionEmail(rejectedOwner, 'rejected', rejectionNotes);
      }
      
      setShowRejectionModal(false);
      setRejectionNotes('');
      setSelectedOwner(null);
      setViewMode('list');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject owner. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyDocument = async (ownerId: string, documentId: string) => {
    setOwners(prev => prev.map(o => {
      if (o.id === ownerId) {
        return {
          ...o,
          documents: o.documents.map(d => 
            d.id === documentId 
              ? { ...d, status: 'verified' as const, verifiedAt: new Date() }
              : d
          )
        };
      }
      return o;
    }));
    
    if (selectedOwner?.id === ownerId) {
      setSelectedOwner(prev => prev ? {
        ...prev,
        documents: prev.documents.map(d => 
          d.id === documentId 
            ? { ...d, status: 'verified' as const, verifiedAt: new Date() }
            : d
        )
      } : null);
    }
    
    toast({
      title: "Document Verified",
      description: "The document has been marked as verified.",
    });
  };

  const handleRejectDocument = async (ownerId: string, documentId: string) => {
    if (!documentRejectionReason.trim()) {
      toast({
        title: "Reason Required",
        description: "Please provide a reason for rejecting the document.",
        variant: "destructive"
      });
      return;
    }
    
    setOwners(prev => prev.map(o => {
      if (o.id === ownerId) {
        return {
          ...o,
          documents: o.documents.map(d => 
            d.id === documentId 
              ? { ...d, status: 'rejected' as const, rejectionReason: documentRejectionReason }
              : d
          )
        };
      }
      return o;
    }));
    
    if (selectedOwner?.id === ownerId) {
      setSelectedOwner(prev => prev ? {
        ...prev,
        documents: prev.documents.map(d => 
          d.id === documentId 
            ? { ...d, status: 'rejected' as const, rejectionReason: documentRejectionReason }
            : d
        )
      } : null);
    }
    
    setSelectedDocument(null);
    setDocumentRejectionReason('');
    
    toast({
      title: "Document Rejected",
      description: "The document has been rejected. Owner will be notified to re-upload.",
    });
  };

  const handleSuspendOwner = async (ownerId: string) => {
    setOwners(prev => prev.map(o => 
      o.id === ownerId 
        ? { ...o, verificationStatus: 'suspended' as OwnerVerificationStatus }
        : o
    ));
    
    toast({
      title: "Owner Suspended",
      description: "The owner has been suspended. All their vehicles are now inactive.",
    });
    
    setSelectedOwner(null);
    setViewMode('list');
  };

  const handleReactivateOwner = async (ownerId: string) => {
    setOwners(prev => prev.map(o => 
      o.id === ownerId 
        ? { ...o, verificationStatus: 'verified' as OwnerVerificationStatus }
        : o
    ));
    
    toast({
      title: "Owner Reactivated",
      description: "The owner has been reactivated and can continue operations.",
    });
  };

  // Detail View Component
  const OwnerDetailView = ({ owner }: { owner: OwnerSubmission }) => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            onClick={() => { setSelectedOwner(null); setViewMode('list'); }}
            className="p-2"
          >
            <ChevronRight className="h-5 w-5 rotate-180" />
          </Button>
          {owner.profilePhoto ? (
            <img 
              src={owner.profilePhoto} 
              alt={`${owner.firstName} ${owner.lastName}`}
              className="h-16 w-16 rounded-full object-cover border-2 border-gray-200"
            />
          ) : (
            <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center">
              <User className="h-8 w-8 text-gray-500" />
            </div>
          )}
          <div>
            <h2 className="text-xl font-bold text-gray-900">{owner.firstName} {owner.lastName}</h2>
            <p className="text-sm text-gray-500">Owner ID: {owner.id}</p>
            <div className="mt-1">{getStatusBadge(owner.verificationStatus)}</div>
          </div>
        </div>
        
        <div className="flex gap-2">
          {owner.verificationStatus === 'pending_admin_review' || owner.verificationStatus === 'pending_verification' ? (
            <>
              <Button 
                onClick={() => handleApproveOwner(owner.id)}
                className="bg-green-600 hover:bg-green-700"
                disabled={loading}
              >
                <Check className="h-4 w-4 mr-2" /> Approve Owner
              </Button>
              <Button 
                variant="destructive"
                onClick={() => setShowRejectionModal(true)}
                disabled={loading}
              >
                <X className="h-4 w-4 mr-2" /> Reject
              </Button>
            </>
          ) : owner.verificationStatus === 'verified' ? (
            <Button 
              variant="outline"
              onClick={() => handleSuspendOwner(owner.id)}
              className="text-orange-600 border-orange-300 hover:bg-orange-50"
            >
              <Ban className="h-4 w-4 mr-2" /> Suspend Owner
            </Button>
          ) : owner.verificationStatus === 'suspended' ? (
            <Button 
              onClick={() => handleReactivateOwner(owner.id)}
              className="bg-green-600 hover:bg-green-700"
            >
              <RefreshCw className="h-4 w-4 mr-2" /> Reactivate
            </Button>
          ) : null}
        </div>
      </div>
      
      {/* Rejection Notes */}
      {owner.verificationNotes && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-red-800">Rejection/Suspension Notes</h4>
              <p className="text-sm text-red-700 mt-1">{owner.verificationNotes}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Verification Progress */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Shield className="h-5 w-5 text-blue-600" /> Verification Progress
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Object.entries(owner.verificationSteps).map(([step, completed]) => (
            <div key={step} className={`p-3 rounded-lg border ${completed ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
              <div className="flex items-center gap-2">
                {completed ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <Clock className="h-4 w-4 text-gray-400" />
                )}
                <span className={`text-sm ${completed ? 'text-green-800' : 'text-gray-600'}`}>
                  {step.replace('step', 'Step ').replace(/_/g, ' ').replace(/^\d+\s/, (m) => m.toUpperCase())}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Grid Layout */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Personal Info */}
        <div className="bg-white rounded-lg border p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <User className="h-5 w-5 text-blue-600" /> Personal Information
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-gray-400" />
              <span className="text-sm">{owner.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-gray-400" />
              <span className="text-sm">{owner.phone}</span>
            </div>
            {owner.whatsapp && (
              <div className="flex items-center gap-3">
                <MessageSquare className="h-4 w-4 text-gray-400" />
                <span className="text-sm">WhatsApp: {owner.whatsapp}</span>
              </div>
            )}
            <div className="flex items-start gap-3">
              <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
              <div className="text-sm">
                <p>{owner.address.line1}</p>
                {owner.address.line2 && <p>{owner.address.line2}</p>}
                <p>{owner.address.city}, {owner.address.district} {owner.address.postalCode}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Identity Documents */}
        <div className="bg-white rounded-lg border p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <IdCard className="h-5 w-5 text-blue-600" /> Identity Information
          </h3>
          <div className="space-y-3">
            {owner.nationalId && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">National ID:</span>
                <span className="text-sm font-medium">{owner.nationalId}</span>
              </div>
            )}
            {owner.drivingLicenseNumber && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Driving License:</span>
                <span className="text-sm font-medium">{owner.drivingLicenseNumber}</span>
              </div>
            )}
            {owner.passportNumber && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Passport:</span>
                <span className="text-sm font-medium">{owner.passportNumber}</span>
              </div>
            )}
            {owner.taxId && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Tax ID:</span>
                <span className="text-sm font-medium">{owner.taxId}</span>
              </div>
            )}
            {owner.businessLicense && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Business License:</span>
                <span className="text-sm font-medium">{owner.businessLicense}</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Bank Details */}
        <div className="bg-white rounded-lg border p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Landmark className="h-5 w-5 text-blue-600" /> Bank Details
            {owner.bankDetails.verified && (
              <BadgeCheck className="h-4 w-4 text-green-600" />
            )}
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Bank Name:</span>
              <span className="text-sm font-medium">{owner.bankDetails.bankName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Account Holder:</span>
              <span className="text-sm font-medium">{owner.bankDetails.accountHolderName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Account Number:</span>
              <span className="text-sm font-medium">{owner.bankDetails.accountNumber}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Branch Code:</span>
              <span className="text-sm font-medium">{owner.bankDetails.branchCode}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Status:</span>
              {owner.bankDetails.verified ? (
                <span className="inline-flex items-center gap-1 text-sm text-green-700">
                  <CheckCircle className="h-3 w-3" /> Verified
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-sm text-yellow-700">
                  <Clock className="h-3 w-3" /> Pending Verification
                </span>
              )}
            </div>
          </div>
        </div>
        
        {/* Stats */}
        <div className="bg-white rounded-lg border p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Star className="h-5 w-5 text-blue-600" /> Owner Stats
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">{owner.totalVehicles}</div>
              <div className="text-xs text-gray-500">Vehicles</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">{owner.totalBookings}</div>
              <div className="text-xs text-gray-500">Bookings</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">${owner.totalEarnings.toLocaleString()}</div>
              <div className="text-xs text-gray-500">Earnings</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600 flex items-center justify-center gap-1">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                {owner.rating > 0 ? owner.rating.toFixed(1) : 'N/A'}
              </div>
              <div className="text-xs text-gray-500">{owner.reviewCount} reviews</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Documents Section */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <FileText className="h-5 w-5 text-blue-600" /> Uploaded Documents
        </h3>
        
        {owner.documents.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No documents uploaded yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {owner.documents.map((doc) => (
              <div 
                key={doc.id} 
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-gray-100 rounded flex items-center justify-center">
                    {doc.type.includes('id') || doc.type.includes('license') || doc.type.includes('passport') ? (
                      <IdCard className="h-6 w-6 text-gray-500" />
                    ) : doc.type.includes('bank') ? (
                      <CreditCard className="h-6 w-6 text-gray-500" />
                    ) : (
                      <FileText className="h-6 w-6 text-gray-500" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{getDocumentTypeLabel(doc.type)}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                      <span>Uploaded: {doc.uploadedAt.toLocaleDateString()}</span>
                      {doc.expiryDate && (
                        <span className={doc.expiryDate < new Date() ? 'text-red-600' : ''}>
                          Expires: {doc.expiryDate.toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    {doc.rejectionReason && (
                      <p className="text-xs text-red-600 mt-1">Reason: {doc.rejectionReason}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  {getDocumentStatusBadge(doc.status)}
                  
                  <Button variant="ghost" size="sm" className="text-blue-600">
                    <Eye className="h-4 w-4 mr-1" /> View
                  </Button>
                  
                  {doc.status === 'pending' && (
                    <>
                      <Button 
                        size="sm" 
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => handleVerifyDocument(owner.id, doc.id)}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => setSelectedDocument(doc)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Timestamps */}
      <div className="text-sm text-gray-500 flex justify-between">
        <span>Registered: {owner.createdAt.toLocaleDateString()}</span>
        <span>Last Updated: {owner.updatedAt.toLocaleDateString()}</span>
      </div>
      
      {/* Document Rejection Modal */}
      {selectedDocument && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Reject Document</h3>
            <p className="text-sm text-gray-600 mb-4">
              Please provide a reason for rejecting "{getDocumentTypeLabel(selectedDocument.type)}".
              The owner will be notified and asked to re-upload.
            </p>
            <Textarea
              value={documentRejectionReason}
              onChange={(e) => setDocumentRejectionReason(e.target.value)}
              placeholder="Reason for rejection (e.g., image is blurry, document is expired)"
              className="mb-4"
              rows={3}
            />
            <div className="flex gap-3 justify-end">
              <Button 
                variant="outline" 
                onClick={() => { setSelectedDocument(null); setDocumentRejectionReason(''); }}
              >
                Cancel
              </Button>
              <Button 
                variant="destructive"
                onClick={() => handleRejectDocument(owner.id, selectedDocument.id)}
              >
                Reject Document
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      <Helmet>
        <title>Owner Approval | Admin - Recharge Travels</title>
      </Helmet>
      
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <User className="h-8 w-8 text-blue-600" />
              Owner Verification & Approval
            </h1>
            <p className="text-gray-600 mt-2">Review and verify vehicle owner applications</p>
          </div>
          
          {viewMode === 'list' ? (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                <div className="bg-white rounded-lg border p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                      <p className="text-xs text-gray-500">Total Owners</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg border p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
                      <Clock className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                      <p className="text-xs text-gray-500">Pending Review</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg border p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-green-600">{stats.verified}</p>
                      <p className="text-xs text-gray-500">Verified</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg border p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                      <XCircle className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
                      <p className="text-xs text-gray-500">Rejected</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg border p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                      <Ban className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-600">{stats.suspended}</p>
                      <p className="text-xs text-gray-500">Suspended</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Filters */}
              <div className="bg-white rounded-lg border p-4 mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search by name, email, or phone..."
                      className="pl-10"
                    />
                  </div>
                  <div className="flex gap-2">
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="px-3 py-2 border rounded-md text-sm"
                      aria-label="Filter by status"
                    >
                      <option value="all">All Status</option>
                      <option value="pending">Pending Review</option>
                      <option value="verified">Verified</option>
                      <option value="rejected">Rejected</option>
                      <option value="suspended">Suspended</option>
                    </select>
                    <Button variant="outline" className="flex items-center gap-2">
                      <RefreshCw className="h-4 w-4" /> Refresh
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Owners List */}
              <div className="bg-white rounded-lg border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Owner</th>
                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Contact</th>
                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Location</th>
                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Documents</th>
                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Stats</th>
                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredOwners.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                            <User className="h-12 w-12 mx-auto mb-2 opacity-50" />
                            <p>No owners found matching your criteria</p>
                          </td>
                        </tr>
                      ) : (
                        filteredOwners.map((owner) => (
                          <tr key={owner.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                {owner.profilePhoto ? (
                                  <img 
                                    src={owner.profilePhoto} 
                                    alt={`${owner.firstName} ${owner.lastName}`}
                                    className="h-10 w-10 rounded-full object-cover"
                                  />
                                ) : (
                                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                    <User className="h-5 w-5 text-gray-500" />
                                  </div>
                                )}
                                <div>
                                  <p className="font-medium text-gray-900">{owner.firstName} {owner.lastName}</p>
                                  <p className="text-xs text-gray-500">ID: {owner.id}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <p className="text-sm text-gray-900">{owner.email}</p>
                              <p className="text-xs text-gray-500">{owner.phone}</p>
                            </td>
                            <td className="px-6 py-4">
                              <p className="text-sm text-gray-900">{owner.address.city}</p>
                              <p className="text-xs text-gray-500">{owner.address.district}</p>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">{owner.documents.length}</span>
                                <span className="text-xs text-gray-500">
                                  ({owner.documents.filter(d => d.status === 'verified').length} verified)
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              {getStatusBadge(owner.verificationStatus)}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-4 text-sm">
                                <span className="flex items-center gap-1">
                                  <Car className="h-3 w-3 text-gray-400" />
                                  {owner.totalVehicles}
                                </span>
                                {owner.rating > 0 && (
                                  <span className="flex items-center gap-1">
                                    <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                                    {owner.rating.toFixed(1)}
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => { setSelectedOwner(owner); setViewMode('detail'); }}
                              >
                                <Eye className="h-4 w-4 mr-1" /> Review
                              </Button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : selectedOwner ? (
            <OwnerDetailView owner={selectedOwner} />
          ) : null}
        </div>
      </div>
      
      {/* Rejection Modal */}
      {showRejectionModal && selectedOwner && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              Reject Owner Application
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to reject <strong>{selectedOwner.firstName} {selectedOwner.lastName}</strong>'s application?
              Please provide detailed notes for the rejection.
            </p>
            <Textarea
              value={rejectionNotes}
              onChange={(e) => setRejectionNotes(e.target.value)}
              placeholder="Enter rejection reason (required)..."
              className="mb-4"
              rows={4}
            />
            <div className="flex gap-3 justify-end">
              <Button 
                variant="outline" 
                onClick={() => { setShowRejectionModal(false); setRejectionNotes(''); }}
              >
                Cancel
              </Button>
              <Button 
                variant="destructive"
                onClick={() => handleRejectOwner(selectedOwner.id)}
                disabled={loading || !rejectionNotes.trim()}
              >
                Reject Application
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OwnerApproval;
