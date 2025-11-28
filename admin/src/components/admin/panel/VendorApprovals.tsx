import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, doc, updateDoc, orderBy } from 'firebase/firestore';
import { Check, X, Eye, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface Vendor {
    id: string;
    firstName: string;
    lastName: string;
    businessName: string;
    businessType: string;
    email: string;
    phone: string;
    status: string;
    createdAt: any;
    idDocumentUrl?: string;
    businessRegistrationUrl?: string;
    photoUrls?: string[];
}

const VendorApprovals = () => {
    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchVendors();
    }, []);

    const fetchVendors = async () => {
        try {
            const q = query(
                collection(db, 'vendors'),
                where('status', '==', 'pending'),
                orderBy('createdAt', 'desc')
            );
            const querySnapshot = await getDocs(q);
            const vendorsData: Vendor[] = [];
            querySnapshot.forEach((doc) => {
                vendorsData.push({ id: doc.id, ...doc.data() } as Vendor);
            });
            setVendors(vendorsData);
        } catch (error) {
            console.error("Error fetching vendors:", error);
            // toast.error("Failed to fetch pending vendors");
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (vendorId: string, newStatus: 'approved' | 'rejected') => {
        try {
            await updateDoc(doc(db, 'vendors', vendorId), {
                status: newStatus,
                isVerified: newStatus === 'approved',
                verificationDate: new Date(),
                updatedAt: new Date()
            });

            toast.success(`Vendor ${newStatus === 'approved' ? 'approved' : 'rejected'} successfully`);
            fetchVendors(); // Refresh list
        } catch (error) {
            console.error("Error updating vendor status:", error);
            toast.error("Failed to update vendor status");
        }
    };

    if (loading) {
        return <div className="p-8 text-center">Loading...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold tracking-tight">Vendor Approvals</h2>
                <Badge variant="secondary" className="text-lg px-4 py-1">
                    {vendors.length} Pending
                </Badge>
            </div>

            {vendors.length === 0 ? (
                <Card>
                    <CardContent className="p-8 text-center text-gray-500">
                        No pending vendor applications found.
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-6">
                    {vendors.map((vendor) => (
                        <Card key={vendor.id} className="overflow-hidden">
                            <CardHeader className="bg-gray-50 border-b pb-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="text-xl">{vendor.businessName}</CardTitle>
                                        <p className="text-sm text-gray-500 mt-1">
                                            {vendor.businessType} • Applied on {vendor.createdAt?.toDate ? vendor.createdAt.toDate().toLocaleDateString() : 'Unknown Date'}
                                        </p>
                                    </div>
                                    <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending Review</Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <h4 className="font-semibold text-sm uppercase text-gray-500">Contact Info</h4>
                                        <div className="grid grid-cols-2 gap-2 text-sm">
                                            <span className="text-gray-500">Name:</span>
                                            <span className="font-medium">{vendor.firstName} {vendor.lastName}</span>
                                            <span className="text-gray-500">Email:</span>
                                            <span className="font-medium">{vendor.email}</span>
                                            <span className="text-gray-500">Phone:</span>
                                            <span className="font-medium">{vendor.phone}</span>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h4 className="font-semibold text-sm uppercase text-gray-500">Documents</h4>
                                        <div className="flex gap-2 flex-wrap">
                                            {vendor.idDocumentUrl && (
                                                <Button variant="outline" size="sm" onClick={() => window.open(vendor.idDocumentUrl, '_blank')}>
                                                    <FileText className="w-4 h-4 mr-2" /> ID Document
                                                </Button>
                                            )}
                                            {vendor.businessRegistrationUrl && (
                                                <Button variant="outline" size="sm" onClick={() => window.open(vendor.businessRegistrationUrl, '_blank')}>
                                                    <FileText className="w-4 h-4 mr-2" /> Business Reg
                                                </Button>
                                            )}
                                            {!vendor.idDocumentUrl && !vendor.businessRegistrationUrl && (
                                                <span className="text-sm text-gray-400">No documents uploaded</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 flex justify-end gap-3 pt-4 border-t">
                                    <Button variant="destructive" onClick={() => handleStatusUpdate(vendor.id, 'rejected')}>
                                        <X className="w-4 h-4 mr-2" /> Reject
                                    </Button>
                                    <Button className="bg-green-600 hover:bg-green-700" onClick={() => handleStatusUpdate(vendor.id, 'approved')}>
                                        <Check className="w-4 h-4 mr-2" /> Approve
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default VendorApprovals;
