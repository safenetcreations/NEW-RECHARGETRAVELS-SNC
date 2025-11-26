import React, { useEffect, useState } from 'react';
import { AdminGuard } from '@/components/admin/AdminGuard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { format } from 'date-fns';
import { AlertCircle, Loader2, Map } from 'lucide-react';

interface CustomTripRequest {
  id: string;
  bookingType?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  summary?: string;
  estimatedPrice?: number;
  status?: string;
  createdAt?: any;
}

const CustomTripRequests: React.FC = () => {
  const [requests, setRequests] = useState<CustomTripRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = query(
      collection(db, 'booking_requests'),
      where('bookingType', '==', 'custom_trip'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data: CustomTripRequest[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as any),
        }));
        setRequests(data);
        setLoading(false);
      },
      (err) => {
        console.error('Error loading custom trip requests:', err);
        setError('Failed to load custom trip requests');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const formatCreatedAt = (createdAt: any) => {
    if (!createdAt) return '-';
    try {
      const date = createdAt.toDate ? createdAt.toDate() : new Date(createdAt);
      return format(date, 'MMM dd, yyyy HH:mm');
    } catch {
      return '-';
    }
  };

  const getStatusBadge = (status?: string) => {
    if (!status) return <Badge variant="secondary">pending</Badge>;
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'confirmed':
        return <Badge className="bg-green-100 text-green-800">Confirmed</Badge>;
      case 'completed':
        return <Badge className="bg-blue-100 text-blue-800">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <AdminGuard>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Custom Trip Requests</h1>
              <p className="text-sm text-gray-600">
                Firestore <code>booking_requests</code> with <code>bookingType = "custom_trip"</code>.
              </p>
            </div>
          </div>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Map className="h-4 w-4" />
                Custom Trip Requests
              </CardTitle>
              {requests.length > 0 && (
                <Badge variant="outline" className="text-xs">
                  {requests.length} request{requests.length !== 1 ? 's' : ''}
                </Badge>
              )}
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-10 text-gray-500 gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Loading custom trip requests...</span>
                </div>
              ) : error ? (
                <div className="flex items-center justify-center py-10 text-red-600 gap-2 text-sm">
                  <AlertCircle className="h-5 w-5" />
                  <span>{error}</span>
                </div>
              ) : requests.length === 0 ? (
                <div className="flex items-center justify-center py-10 text-gray-500 text-sm">
                  No custom trip requests found yet.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-40">Created</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Summary</TableHead>
                        <TableHead className="w-24">Price</TableHead>
                        <TableHead className="w-24">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {requests.map((req) => (
                        <TableRow key={req.id} className={req.status === 'pending' ? 'bg-yellow-50/40' : ''}>
                          <TableCell className="text-xs text-gray-500">
                            {formatCreatedAt(req.createdAt)}
                          </TableCell>
                          <TableCell className="text-sm">
                            <div className="font-medium text-gray-900">{req.customerName || '-'}</div>
                            <div className="text-xs text-gray-600">{req.customerEmail || '-'}</div>
                            {req.customerPhone && (
                              <div className="text-xs text-gray-400">{req.customerPhone}</div>
                            )}
                          </TableCell>
                          <TableCell className="text-sm">
                            <div className="font-medium text-gray-900">
                              {req.summary || 'Custom trip (no summary available)'}
                            </div>
                          </TableCell>
                          <TableCell className="text-sm font-semibold">
                            {typeof req.estimatedPrice === 'number' ? `$${req.estimatedPrice}` : '-'}
                          </TableCell>
                          <TableCell>{getStatusBadge(req.status)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminGuard>
  );
};

export default CustomTripRequests;
