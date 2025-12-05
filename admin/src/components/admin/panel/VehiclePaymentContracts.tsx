import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where, orderBy, doc, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import {
    CreditCard,
    FileText,
    Download,
    RefreshCw,
    CheckCircle,
    XCircle,
    Clock,
    DollarSign,
    Receipt,
    FileCheck,
    Send,
    Eye,
    Search,
    Filter,
    Calendar,
    User,
    Car,
    AlertCircle,
    Banknote,
    ArrowRight
} from 'lucide-react';

// ============================================
// TYPES
// ============================================

interface PaymentRecord {
    id: string;
    bookingId: string;
    bookingReference: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    categoryName: string;
    variantName: string;
    pickupDate: string;
    returnDate: string;
    totalDays: number;
    amount: number;
    currency: string;
    paymentType: 'full' | 'deposit' | 'balance' | 'manual';
    paymentMethod?: string;
    status: 'pending' | 'processing' | 'paid' | 'failed' | 'refunded' | 'cancelled';
    stripeSessionId?: string;
    stripePaymentIntentId?: string;
    paidAt?: any;
    createdAt: any;
}

interface BookingForContract {
    id: string;
    bookingReference: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    passportNumber?: string;
    categoryName: string;
    variantName: string;
    pickupDate: string;
    returnDate: string;
    pickupLocation: string;
    totalDays: number;
    withDriver: boolean;
    driverName?: string;
    estimatedPrice: number;
    paymentStatus: string;
    status: string;
}

interface RefundRequest {
    id: string;
    paymentSessionId: string;
    bookingId: string;
    bookingReference?: string;
    customerName?: string;
    amount: number;
    reason: string;
    refundType: 'full' | 'partial';
    requestedBy: string;
    status: 'pending' | 'approved' | 'processed' | 'rejected';
    createdAt: any;
    processedAt?: any;
}

// ============================================
// COMPONENT
// ============================================

const VehiclePaymentContracts: React.FC = () => {
    const { toast } = useToast();
    const [activeTab, setActiveTab] = useState<'payments' | 'contracts' | 'refunds' | 'manual'>('payments');
    const [loading, setLoading] = useState(true);

    // Payments state
    const [payments, setPayments] = useState<PaymentRecord[]>([]);
    const [paymentFilter, setPaymentFilter] = useState<string>('all');
    const [searchTerm, setSearchTerm] = useState('');

    // Contracts state
    const [bookings, setBookings] = useState<BookingForContract[]>([]);
    const [selectedBooking, setSelectedBooking] = useState<BookingForContract | null>(null);
    const [showContractPreview, setShowContractPreview] = useState(false);

    // Refunds state
    const [refunds, setRefunds] = useState<RefundRequest[]>([]);
    const [processingRefund, setProcessingRefund] = useState<string | null>(null);

    // Manual payment state
    const [manualPayment, setManualPayment] = useState({
        bookingReference: '',
        amount: '',
        paymentMethod: 'bank_transfer' as 'cash' | 'bank_transfer' | 'card_manual' | 'other',
        reference: '',
        notes: ''
    });

    useEffect(() => {
        loadData();
    }, [activeTab]);

    const loadData = async () => {
        setLoading(true);
        try {
            switch (activeTab) {
                case 'payments':
                    await loadPayments();
                    break;
                case 'contracts':
                    await loadBookings();
                    break;
                case 'refunds':
                    await loadRefunds();
                    break;
                case 'manual':
                    await loadBookings();
                    break;
            }
        } catch (error) {
            console.error('Error loading data:', error);
            toast({ title: 'Error loading data', variant: 'destructive' });
        }
        setLoading(false);
    };

    const loadPayments = async () => {
        const q = query(
            collection(db, 'vehicleRentalPayments'),
            orderBy('createdAt', 'desc')
        );
        const snap = await getDocs(q);
        setPayments(snap.docs.map(d => ({ id: d.id, ...d.data() } as PaymentRecord)));
    };

    const loadBookings = async () => {
        const q = query(
            collection(db, 'vehicleRentalBookings'),
            where('status', 'in', ['confirmed', 'paid', 'deposit_paid']),
            orderBy('createdAt', 'desc')
        );
        const snap = await getDocs(q);
        setBookings(snap.docs.map(d => ({ id: d.id, ...d.data() } as BookingForContract)));
    };

    const loadRefunds = async () => {
        const q = query(
            collection(db, 'vehicleRentalRefunds'),
            orderBy('createdAt', 'desc')
        );
        const snap = await getDocs(q);
        setRefunds(snap.docs.map(d => ({ id: d.id, ...d.data() } as RefundRequest)));
    };

    // ============================================
    // PAYMENT FUNCTIONS
    // ============================================

    const getStatusBadge = (status: string) => {
        const styles: Record<string, string> = {
            pending: 'bg-yellow-100 text-yellow-800',
            processing: 'bg-blue-100 text-blue-800',
            paid: 'bg-green-100 text-green-800',
            failed: 'bg-red-100 text-red-800',
            refunded: 'bg-purple-100 text-purple-800',
            cancelled: 'bg-gray-100 text-gray-800',
            approved: 'bg-blue-100 text-blue-800',
            processed: 'bg-green-100 text-green-800',
            rejected: 'bg-red-100 text-red-800'
        };
        return styles[status] || 'bg-gray-100 text-gray-800';
    };

    const filteredPayments = payments.filter(p => {
        const matchesFilter = paymentFilter === 'all' || p.status === paymentFilter;
        const matchesSearch = !searchTerm ||
            p.bookingReference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const paymentStats = {
        total: payments.length,
        pending: payments.filter(p => p.status === 'pending').length,
        paid: payments.filter(p => p.status === 'paid').length,
        totalRevenue: payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0)
    };

    // ============================================
    // CONTRACT FUNCTIONS
    // ============================================

    const generateContract = (booking: BookingForContract) => {
        // This would call the contract service
        const contractData = {
            contractNumber: `VR-${new Date().toISOString().slice(2, 10).replace(/-/g, '')}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
            contractDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
            companyName: 'Recharge Travels (Pvt) Ltd',
            companyAddress: 'Colombo, Jaffna, Sri Lanka',
            companyPhone: '+94 77 123 4567',
            companyEmail: 'bookings@rechargetravels.com',
            customerName: booking.customerName,
            customerPassport: booking.passportNumber || 'To be provided',
            customerEmail: booking.customerEmail,
            customerPhone: booking.customerPhone,
            categoryName: booking.categoryName,
            variantName: booking.variantName,
            pickupDate: booking.pickupDate,
            pickupLocation: booking.pickupLocation,
            returnDate: booking.returnDate,
            totalDays: booking.totalDays,
            withDriver: booking.withDriver,
            driverName: booking.driverName,
            baseAmount: booking.estimatedPrice * 0.7,
            driverFee: booking.withDriver ? booking.estimatedPrice * 0.2 : 0,
            addOnsTotal: booking.estimatedPrice * 0.1,
            subtotal: booking.estimatedPrice,
            taxAmount: 0,
            totalAmount: booking.estimatedPrice,
            depositAmount: booking.estimatedPrice * 0.3,
            balanceAmount: booking.estimatedPrice * 0.7,
            paymentStatus: booking.paymentStatus as 'pending' | 'deposit_paid' | 'paid',
            insuranceIncluded: true,
            fuelPolicy: 'full_to_full' as const
        };

        // Dynamically import and generate
        import('@/services/vehicleRentalContractService').then(({ generateRentalContract }) => {
            generateRentalContract(contractData);
            toast({ title: 'Contract generated and downloading!' });
        }).catch(() => {
            // Fallback: Generate simple text contract
            const contract = `
VEHICLE RENTAL AGREEMENT
========================
Contract #: ${contractData.contractNumber}
Date: ${contractData.contractDate}

LESSOR: ${contractData.companyName}
${contractData.companyAddress}
Tel: ${contractData.companyPhone}

LESSEE: ${contractData.customerName}
Passport: ${contractData.customerPassport}
Tel: ${contractData.customerPhone}
Email: ${contractData.customerEmail}

VEHICLE: ${contractData.categoryName} - ${contractData.variantName}
Driver: ${contractData.withDriver ? `Yes - ${contractData.driverName || 'To be assigned'}` : 'Self-Drive'}

RENTAL PERIOD:
Pickup: ${contractData.pickupDate} at ${contractData.pickupLocation}
Return: ${contractData.returnDate}
Duration: ${contractData.totalDays} days

PAYMENT:
Total: $${contractData.totalAmount.toFixed(2)} USD
Deposit: $${contractData.depositAmount.toFixed(2)}
Balance: $${contractData.balanceAmount.toFixed(2)}
Status: ${contractData.paymentStatus.toUpperCase()}

TERMS & CONDITIONS:
1. Valid passport and driver's license required at pickup
2. Insurance coverage included (excess $250)
3. Fuel policy: Full-to-Full
4. 24/7 roadside assistance included
5. Free cancellation up to 48 hours before pickup

SIGNATURES:
Lessor: ___________________ Date: ___________
Lessee: ___________________ Date: ___________

${contractData.companyName} | ${contractData.companyPhone}
      `.trim();

            const blob = new Blob([contract], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `contract-${contractData.contractNumber}.txt`;
            a.click();
            URL.revokeObjectURL(url);
            toast({ title: 'Contract generated!' });
        });
    };

    const generateReceipt = (payment: PaymentRecord) => {
        import('@/services/vehicleRentalContractService').then(({ generatePaymentReceipt }) => {
            generatePaymentReceipt({
                receiptNumber: `REC-${Date.now().toString(36).toUpperCase()}`,
                contractNumber: payment.bookingReference,
                customerName: payment.customerName,
                customerEmail: payment.customerEmail,
                vehicleDescription: `${payment.categoryName} - ${payment.variantName}`,
                rentalDates: `${payment.pickupDate} to ${payment.returnDate}`,
                amountPaid: payment.amount,
                paymentMethod: payment.paymentMethod || 'Online Payment',
                paymentDate: payment.paidAt?.toDate?.()?.toLocaleDateString() || new Date().toLocaleDateString()
            });
            toast({ title: 'Receipt generated!' });
        }).catch(() => {
            toast({ title: 'Receipt generation failed', variant: 'destructive' });
        });
    };

    const generateVoucher = (booking: BookingForContract) => {
        import('@/services/vehicleRentalContractService').then(({ generateBookingVoucher }) => {
            generateBookingVoucher({
                bookingReference: booking.bookingReference,
                customerName: booking.customerName,
                vehicleCategory: booking.categoryName,
                vehicleVariant: booking.variantName,
                pickupDate: booking.pickupDate,
                pickupTime: '9:00 AM',
                pickupLocation: booking.pickupLocation,
                returnDate: booking.returnDate,
                driverName: booking.driverName,
                driverPhone: 'To be provided',
                emergencyPhone: '+94 77 123 4567',
                importantNotes: [
                    'Bring valid passport and this voucher',
                    'Driver will contact you 24hrs before pickup',
                    booking.withDriver ? '' : 'Bring your temporary driving license'
                ].filter(Boolean)
            });
            toast({ title: 'Voucher generated!' });
        }).catch(() => {
            toast({ title: 'Voucher generation failed', variant: 'destructive' });
        });
    };

    // ============================================
    // REFUND FUNCTIONS
    // ============================================

    const processRefund = async (refundId: string, approved: boolean) => {
        setProcessingRefund(refundId);
        try {
            await updateDoc(doc(db, 'vehicleRentalRefunds', refundId), {
                status: approved ? 'approved' : 'rejected',
                processedAt: Timestamp.now(),
                processedBy: 'admin' // In production, use actual admin user ID
            });

            if (approved) {
                // In production, this would trigger a Stripe refund via Cloud Function
                toast({ title: 'Refund approved and will be processed' });
            } else {
                toast({ title: 'Refund rejected' });
            }

            await loadRefunds();
        } catch (error) {
            toast({ title: 'Error processing refund', variant: 'destructive' });
        }
        setProcessingRefund(null);
    };

    // ============================================
    // MANUAL PAYMENT
    // ============================================

    const submitManualPayment = async () => {
        if (!manualPayment.bookingReference || !manualPayment.amount) {
            toast({ title: 'Please fill required fields', variant: 'destructive' });
            return;
        }

        try {
            // Find the booking
            const q = query(
                collection(db, 'vehicleRentalBookings'),
                where('bookingReference', '==', manualPayment.bookingReference)
            );
            const snap = await getDocs(q);

            if (snap.empty) {
                toast({ title: 'Booking not found', variant: 'destructive' });
                return;
            }

            const bookingDoc = snap.docs[0];
            const booking = bookingDoc.data();

            // Create payment record
            await import('firebase/firestore').then(async ({ addDoc }) => {
                await addDoc(collection(db, 'vehicleRentalPayments'), {
                    bookingId: bookingDoc.id,
                    bookingReference: manualPayment.bookingReference,
                    customerName: booking.customerName,
                    customerEmail: booking.customerEmail,
                    customerPhone: booking.customerPhone,
                    categoryName: booking.categoryName,
                    variantName: booking.variantName,
                    pickupDate: booking.pickupDate,
                    returnDate: booking.returnDate,
                    totalDays: booking.totalDays,
                    amount: parseFloat(manualPayment.amount),
                    currency: 'USD',
                    paymentType: 'manual',
                    paymentMethod: manualPayment.paymentMethod,
                    reference: manualPayment.reference,
                    notes: manualPayment.notes,
                    status: 'paid',
                    paidAt: Timestamp.now(),
                    confirmedBy: 'admin',
                    createdAt: Timestamp.now()
                });
            });

            // Update booking status
            await updateDoc(doc(db, 'vehicleRentalBookings', bookingDoc.id), {
                paymentStatus: 'paid',
                paymentMethod: manualPayment.paymentMethod,
                paymentReference: manualPayment.reference,
                status: 'paid',
                paidAt: Timestamp.now(),
                updatedAt: Timestamp.now()
            });

            toast({ title: 'Payment confirmed successfully!' });
            setManualPayment({
                bookingReference: '',
                amount: '',
                paymentMethod: 'bank_transfer',
                reference: '',
                notes: ''
            });

        } catch (error) {
            console.error('Error confirming payment:', error);
            toast({ title: 'Error confirming payment', variant: 'destructive' });
        }
    };

    // ============================================
    // RENDER
    // ============================================

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <RefreshCw className="w-8 h-8 animate-spin text-amber-600" />
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <CreditCard className="w-8 h-8 text-amber-500" />
                        Payments & Contracts
                    </h1>
                    <p className="text-gray-500">Manage payments, generate contracts and receipts</p>
                </div>
                <Button onClick={loadData} variant="outline">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh
                </Button>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b">
                {[
                    { id: 'payments', label: 'Payments', icon: DollarSign },
                    { id: 'contracts', label: 'Contracts & Vouchers', icon: FileText },
                    { id: 'refunds', label: 'Refunds', icon: Receipt },
                    { id: 'manual', label: 'Manual Payment', icon: Banknote }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${activeTab === tab.id
                                ? 'border-amber-500 text-amber-600 font-medium'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content */}
            {activeTab === 'payments' && (
                <div className="space-y-6">
                    {/* Stats */}
                    <div className="grid grid-cols-4 gap-4">
                        <div className="bg-white rounded-xl p-4 border shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">Total Payments</p>
                                    <p className="text-2xl font-bold">{paymentStats.total}</p>
                                </div>
                                <CreditCard className="w-8 h-8 text-gray-400" />
                            </div>
                        </div>
                        <div className="bg-white rounded-xl p-4 border shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">Pending</p>
                                    <p className="text-2xl font-bold text-yellow-600">{paymentStats.pending}</p>
                                </div>
                                <Clock className="w-8 h-8 text-yellow-400" />
                            </div>
                        </div>
                        <div className="bg-white rounded-xl p-4 border shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">Completed</p>
                                    <p className="text-2xl font-bold text-green-600">{paymentStats.paid}</p>
                                </div>
                                <CheckCircle className="w-8 h-8 text-green-400" />
                            </div>
                        </div>
                        <div className="bg-white rounded-xl p-4 border shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">Total Revenue</p>
                                    <p className="text-2xl font-bold text-amber-600">${paymentStats.totalRevenue.toFixed(2)}</p>
                                </div>
                                <DollarSign className="w-8 h-8 text-amber-400" />
                            </div>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="flex gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                                placeholder="Search by reference, name, or email..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <select
                            value={paymentFilter}
                            onChange={e => setPaymentFilter(e.target.value)}
                            className="border rounded-lg px-4 py-2"
                        >
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="paid">Paid</option>
                            <option value="failed">Failed</option>
                            <option value="refunded">Refunded</option>
                        </select>
                    </div>

                    {/* Payments Table */}
                    <div className="bg-white rounded-xl border overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Reference</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Customer</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Vehicle</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Amount</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Type</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Status</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Date</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {filteredPayments.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                                            No payments found
                                        </td>
                                    </tr>
                                ) : (
                                    filteredPayments.map(payment => (
                                        <tr key={payment.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-3 font-mono text-sm">{payment.bookingReference}</td>
                                            <td className="px-4 py-3">
                                                <div>
                                                    <p className="font-medium">{payment.customerName}</p>
                                                    <p className="text-sm text-gray-500">{payment.customerEmail}</p>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <p className="text-sm">{payment.categoryName}</p>
                                                <p className="text-xs text-gray-500">{payment.variantName}</p>
                                            </td>
                                            <td className="px-4 py-3 font-medium">${payment.amount?.toFixed(2)}</td>
                                            <td className="px-4 py-3">
                                                <span className="text-xs px-2 py-1 bg-gray-100 rounded capitalize">
                                                    {payment.paymentType}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`text-xs px-2 py-1 rounded capitalize ${getStatusBadge(payment.status)}`}>
                                                    {payment.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-500">
                                                {payment.createdAt?.toDate?.()?.toLocaleDateString() || '-'}
                                            </td>
                                            <td className="px-4 py-3">
                                                {payment.status === 'paid' && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => generateReceipt(payment)}
                                                    >
                                                        <Receipt className="w-4 h-4 mr-1" />
                                                        Receipt
                                                    </Button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'contracts' && (
                <div className="space-y-6">
                    <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                        <div className="flex items-center gap-2 mb-2">
                            <FileCheck className="w-5 h-5 text-amber-600" />
                            <h3 className="font-semibold text-amber-800">Document Generation</h3>
                        </div>
                        <p className="text-sm text-amber-700">
                            Generate professional rental contracts, vouchers, and receipts for confirmed bookings.
                        </p>
                    </div>

                    <div className="grid gap-4">
                        {bookings.length === 0 ? (
                            <div className="bg-white rounded-xl p-8 text-center border">
                                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-500">No confirmed bookings for contract generation</p>
                            </div>
                        ) : (
                            bookings.map(booking => (
                                <div key={booking.id} className="bg-white rounded-xl p-4 border shadow-sm">
                                    <div className="flex items-start justify-between">
                                        <div className="flex gap-4">
                                            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                                                <Car className="w-6 h-6 text-amber-600" />
                                            </div>
                                            <div>
                                                <p className="font-mono text-sm text-gray-500">{booking.bookingReference}</p>
                                                <h3 className="font-semibold">{booking.customerName}</h3>
                                                <p className="text-sm text-gray-600">
                                                    {booking.categoryName} - {booking.variantName}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {booking.pickupDate} → {booking.returnDate} ({booking.totalDays} days)
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => generateContract(booking)}
                                            >
                                                <FileText className="w-4 h-4 mr-1" />
                                                Contract
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => generateVoucher(booking)}
                                            >
                                                <Download className="w-4 h-4 mr-1" />
                                                Voucher
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            {activeTab === 'refunds' && (
                <div className="space-y-6">
                    <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                        <div className="flex items-center gap-2 mb-2">
                            <Receipt className="w-5 h-5 text-purple-600" />
                            <h3 className="font-semibold text-purple-800">Refund Requests</h3>
                        </div>
                        <p className="text-sm text-purple-700">
                            Review and process refund requests. Approved refunds will be processed via Stripe.
                        </p>
                    </div>

                    {refunds.length === 0 ? (
                        <div className="bg-white rounded-xl p-8 text-center border">
                            <CheckCircle className="w-12 h-12 text-green-300 mx-auto mb-3" />
                            <p className="text-gray-500">No pending refund requests</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {refunds.map(refund => (
                                <div key={refund.id} className="bg-white rounded-xl p-4 border shadow-sm">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className={`px-2 py-1 rounded text-xs ${getStatusBadge(refund.status)}`}>
                                                    {refund.status.toUpperCase()}
                                                </span>
                                                <span className="text-sm text-gray-500">
                                                    {refund.refundType === 'full' ? 'Full Refund' : 'Partial Refund'}
                                                </span>
                                            </div>
                                            <p className="font-semibold">${refund.amount.toFixed(2)} USD</p>
                                            <p className="text-sm text-gray-600 mt-1">Reason: {refund.reason}</p>
                                            <p className="text-xs text-gray-400 mt-1">
                                                Requested: {refund.createdAt?.toDate?.()?.toLocaleDateString() || '-'}
                                            </p>
                                        </div>
                                        {refund.status === 'pending' && (
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => processRefund(refund.id, false)}
                                                    disabled={processingRefund === refund.id}
                                                >
                                                    <XCircle className="w-4 h-4 mr-1 text-red-500" />
                                                    Reject
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    onClick={() => processRefund(refund.id, true)}
                                                    disabled={processingRefund === refund.id}
                                                    className="bg-green-600 hover:bg-green-700"
                                                >
                                                    <CheckCircle className="w-4 h-4 mr-1" />
                                                    Approve
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'manual' && (
                <div className="max-w-xl mx-auto">
                    <div className="bg-white rounded-xl p-6 border shadow-sm">
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <Banknote className="w-5 h-5 text-amber-500" />
                            Confirm Manual Payment
                        </h2>
                        <p className="text-sm text-gray-500 mb-6">
                            Use this form to record cash payments, bank transfers, or other manual payment methods.
                        </p>

                        <div className="space-y-4">
                            <div>
                                <Label>Booking Reference *</Label>
                                <Input
                                    value={manualPayment.bookingReference}
                                    onChange={e => setManualPayment({ ...manualPayment, bookingReference: e.target.value })}
                                    placeholder="e.g., VR-241205-ABC1"
                                />
                            </div>

                            <div>
                                <Label>Amount (USD) *</Label>
                                <Input
                                    type="number"
                                    step="0.01"
                                    value={manualPayment.amount}
                                    onChange={e => setManualPayment({ ...manualPayment, amount: e.target.value })}
                                    placeholder="0.00"
                                />
                            </div>

                            <div>
                                <Label>Payment Method</Label>
                                <select
                                    value={manualPayment.paymentMethod}
                                    onChange={e => setManualPayment({ ...manualPayment, paymentMethod: e.target.value as any })}
                                    className="w-full border rounded-lg p-2"
                                >
                                    <option value="bank_transfer">Bank Transfer</option>
                                    <option value="cash">Cash</option>
                                    <option value="card_manual">Card (Manual)</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            <div>
                                <Label>Transaction Reference</Label>
                                <Input
                                    value={manualPayment.reference}
                                    onChange={e => setManualPayment({ ...manualPayment, reference: e.target.value })}
                                    placeholder="Bank transfer reference, receipt number, etc."
                                />
                            </div>

                            <div>
                                <Label>Notes</Label>
                                <Textarea
                                    value={manualPayment.notes}
                                    onChange={e => setManualPayment({ ...manualPayment, notes: e.target.value })}
                                    placeholder="Additional notes about this payment..."
                                    rows={3}
                                />
                            </div>

                            <Button onClick={submitManualPayment} className="w-full">
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Confirm Payment
                            </Button>
                        </div>
                    </div>

                    <div className="mt-6 bg-amber-50 rounded-xl p-4 border border-amber-200">
                        <h3 className="font-semibold text-amber-800 mb-2">Recent Pending Bookings</h3>
                        <div className="space-y-2">
                            {bookings.filter(b => b.paymentStatus !== 'paid').slice(0, 5).map(booking => (
                                <div
                                    key={booking.id}
                                    className="flex items-center justify-between text-sm bg-white p-2 rounded-lg cursor-pointer hover:bg-amber-50"
                                    onClick={() => setManualPayment({
                                        ...manualPayment,
                                        bookingReference: booking.bookingReference,
                                        amount: booking.estimatedPrice.toString()
                                    })}
                                >
                                    <div>
                                        <span className="font-mono text-gray-600">{booking.bookingReference}</span>
                                        <span className="text-gray-500 ml-2">- {booking.customerName}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium">${booking.estimatedPrice}</span>
                                        <ArrowRight className="w-4 h-4 text-amber-500" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VehiclePaymentContracts;
