/**
 * Fleet Maintenance Manager Component
 * Admin UI for scheduling and tracking vehicle maintenance
 */
import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Filter,
  Wrench,
  Car,
  Calendar,
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle,
  DollarSign,
  FileText,
  MapPin,
  User,
  Settings,
  RefreshCw,
  Eye,
  Edit2,
  Trash2,
  Bell,
  TrendingUp,
  BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  updateDoc,
  deleteDoc
} from 'firebase/firestore';
import { db } from '@/config/firebase';

// ==========================================
// TYPES
// ==========================================

export type MaintenanceType =
  | 'scheduled'
  | 'preventive'
  | 'corrective'
  | 'emergency'
  | 'inspection';

export type MaintenanceStatus =
  | 'scheduled'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'overdue';

export type MaintenanceCategory =
  | 'oil_change'
  | 'tire_service'
  | 'brake_service'
  | 'engine_service'
  | 'transmission'
  | 'electrical'
  | 'ac_service'
  | 'body_work'
  | 'inspection'
  | 'cleaning'
  | 'other';

export interface MaintenanceRecord {
  id?: string;
  vehicleId: string;
  vehicleName: string;
  vehiclePlate: string;
  ownerId: string;
  ownerName: string;

  // Maintenance details
  type: MaintenanceType;
  category: MaintenanceCategory;
  title: string;
  description: string;
  status: MaintenanceStatus;

  // Scheduling
  scheduledDate: string;
  scheduledTime?: string;
  estimatedDuration: number; // hours
  actualStartDate?: string;
  actualEndDate?: string;

  // Location
  serviceCenter?: string;
  serviceCenterAddress?: string;
  serviceCenterPhone?: string;

  // Costs
  estimatedCost: number;
  actualCost?: number;
  currency: string;
  costBreakdown?: {
    parts: number;
    labor: number;
    other: number;
  };

  // Mileage
  currentMileage?: number;
  nextServiceMileage?: number;

  // Parts & Work
  partsUsed?: Array<{
    name: string;
    quantity: number;
    cost: number;
  }>;
  workPerformed?: string;

  // Documents
  invoiceUrl?: string;
  reportUrl?: string;
  photos?: string[];

  // Notes
  notes?: string;
  technicianNotes?: string;

  // Reminders
  reminderSent: boolean;
  reminderDate?: string;

  // Metadata
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  completedBy?: string;
  completedAt?: string;
}

export interface MaintenanceSchedule {
  id?: string;
  vehicleId: string;
  category: MaintenanceCategory;
  intervalMileage?: number;
  intervalDays?: number;
  lastServiceDate?: string;
  lastServiceMileage?: number;
  nextDueDate?: string;
  nextDueMileage?: number;
  isActive: boolean;
}

// ==========================================
// CONSTANTS
// ==========================================

const MAINTENANCE_COLLECTION = 'vehicle_maintenance';
const SCHEDULE_COLLECTION = 'vehicle_maintenance_schedules';

const TYPE_CONFIG: Record<MaintenanceType, { label: string; color: string; icon: React.ReactNode }> = {
  scheduled: { label: 'Scheduled', color: 'bg-blue-100 text-blue-800', icon: <Calendar className="w-3 h-3" /> },
  preventive: { label: 'Preventive', color: 'bg-green-100 text-green-800', icon: <Settings className="w-3 h-3" /> },
  corrective: { label: 'Corrective', color: 'bg-yellow-100 text-yellow-800', icon: <Wrench className="w-3 h-3" /> },
  emergency: { label: 'Emergency', color: 'bg-red-100 text-red-800', icon: <AlertTriangle className="w-3 h-3" /> },
  inspection: { label: 'Inspection', color: 'bg-purple-100 text-purple-800', icon: <Eye className="w-3 h-3" /> }
};

const STATUS_CONFIG: Record<MaintenanceStatus, { label: string; color: string; icon: React.ReactNode }> = {
  scheduled: { label: 'Scheduled', color: 'bg-blue-100 text-blue-800', icon: <Clock className="w-3 h-3" /> },
  in_progress: { label: 'In Progress', color: 'bg-yellow-100 text-yellow-800', icon: <Settings className="w-3 h-3 animate-spin" /> },
  completed: { label: 'Completed', color: 'bg-green-100 text-green-800', icon: <CheckCircle className="w-3 h-3" /> },
  cancelled: { label: 'Cancelled', color: 'bg-gray-100 text-gray-800', icon: <XCircle className="w-3 h-3" /> },
  overdue: { label: 'Overdue', color: 'bg-red-100 text-red-800', icon: <AlertTriangle className="w-3 h-3" /> }
};

const CATEGORY_LABELS: Record<MaintenanceCategory, string> = {
  oil_change: 'Oil Change',
  tire_service: 'Tire Service',
  brake_service: 'Brake Service',
  engine_service: 'Engine Service',
  transmission: 'Transmission',
  electrical: 'Electrical',
  ac_service: 'A/C Service',
  body_work: 'Body Work',
  inspection: 'Inspection',
  cleaning: 'Cleaning',
  other: 'Other'
};

const CATEGORY_INTERVALS: Record<MaintenanceCategory, { mileage?: number; days?: number }> = {
  oil_change: { mileage: 5000, days: 90 },
  tire_service: { mileage: 10000, days: 180 },
  brake_service: { mileage: 30000 },
  engine_service: { mileage: 50000 },
  transmission: { mileage: 60000 },
  electrical: { days: 365 },
  ac_service: { days: 365 },
  body_work: {},
  inspection: { days: 180 },
  cleaning: { days: 30 },
  other: {}
};

// ==========================================
// COMPONENT
// ==========================================

interface FormData {
  vehicleId: string;
  vehicleName: string;
  vehiclePlate: string;
  ownerId: string;
  ownerName: string;
  type: MaintenanceType;
  category: MaintenanceCategory;
  title: string;
  description: string;
  scheduledDate: string;
  scheduledTime: string;
  estimatedDuration: number;
  serviceCenter: string;
  serviceCenterAddress: string;
  estimatedCost: number;
  currentMileage: number;
  notes: string;
}

const initialFormData: FormData = {
  vehicleId: '',
  vehicleName: '',
  vehiclePlate: '',
  ownerId: '',
  ownerName: '',
  type: 'scheduled',
  category: 'oil_change',
  title: '',
  description: '',
  scheduledDate: '',
  scheduledTime: '09:00',
  estimatedDuration: 2,
  serviceCenter: '',
  serviceCenterAddress: '',
  estimatedCost: 0,
  currentMileage: 0,
  notes: ''
};

export const FleetMaintenanceManager: React.FC = () => {
  const { toast } = useToast();
  const [records, setRecords] = useState<MaintenanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [showCompleteDialog, setShowCompleteDialog] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<MaintenanceRecord | null>(null);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [activeTab, setActiveTab] = useState('list');

  // Completion form
  const [completeForm, setCompleteForm] = useState({
    actualCost: 0,
    workPerformed: '',
    technicianNotes: '',
    nextServiceMileage: 0
  });

  // Statistics
  const [stats, setStats] = useState({
    scheduled: 0,
    inProgress: 0,
    overdue: 0,
    completedThisMonth: 0,
    totalCostThisMonth: 0,
    upcomingThisWeek: 0
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const q = query(
        collection(db, MAINTENANCE_COLLECTION),
        orderBy('scheduledDate', 'desc')
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MaintenanceRecord));

      // Check for overdue items
      const now = new Date().toISOString();
      const updatedData = data.map(record => {
        if (record.status === 'scheduled' && record.scheduledDate < now) {
          return { ...record, status: 'overdue' as MaintenanceStatus };
        }
        return record;
      });

      setRecords(updatedData);
      calculateStats(updatedData);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load maintenance records',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const calculateStats = (data: MaintenanceRecord[]) => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const scheduled = data.filter(r => r.status === 'scheduled').length;
    const inProgress = data.filter(r => r.status === 'in_progress').length;
    const overdue = data.filter(r => r.status === 'overdue').length;

    const completedThisMonth = data.filter(r =>
      r.status === 'completed' &&
      r.completedAt &&
      new Date(r.completedAt) >= startOfMonth
    ).length;

    const totalCostThisMonth = data
      .filter(r =>
        r.status === 'completed' &&
        r.completedAt &&
        new Date(r.completedAt) >= startOfMonth
      )
      .reduce((sum, r) => sum + (r.actualCost || 0), 0);

    const upcomingThisWeek = data.filter(r =>
      r.status === 'scheduled' &&
      new Date(r.scheduledDate) <= endOfWeek
    ).length;

    setStats({
      scheduled,
      inProgress,
      overdue,
      completedThisMonth,
      totalCostThisMonth,
      upcomingThisWeek
    });
  };

  const handleCreateRecord = async () => {
    if (!formData.vehicleId || !formData.title || !formData.scheduledDate) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in vehicle, title, and scheduled date',
        variant: 'destructive'
      });
      return;
    }

    try {
      const recordRef = doc(collection(db, MAINTENANCE_COLLECTION));
      const now = new Date().toISOString();

      const record: MaintenanceRecord = {
        ...formData,
        id: recordRef.id,
        status: 'scheduled',
        currency: 'LKR',
        reminderSent: false,
        createdBy: 'admin',
        createdAt: now,
        updatedAt: now
      };

      await setDoc(recordRef, record);

      toast({
        title: 'Success',
        description: 'Maintenance scheduled successfully'
      });

      setShowCreateDialog(false);
      setFormData(initialFormData);
      loadData();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create maintenance record',
        variant: 'destructive'
      });
    }
  };

  const handleStartMaintenance = async (record: MaintenanceRecord) => {
    try {
      await updateDoc(doc(db, MAINTENANCE_COLLECTION, record.id!), {
        status: 'in_progress',
        actualStartDate: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      toast({
        title: 'Started',
        description: 'Maintenance started'
      });
      loadData();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update status',
        variant: 'destructive'
      });
    }
  };

  const handleCompleteMaintenance = async () => {
    if (!selectedRecord) return;

    try {
      const now = new Date().toISOString();
      await updateDoc(doc(db, MAINTENANCE_COLLECTION, selectedRecord.id!), {
        status: 'completed',
        actualEndDate: now,
        actualCost: completeForm.actualCost,
        workPerformed: completeForm.workPerformed,
        technicianNotes: completeForm.technicianNotes,
        nextServiceMileage: completeForm.nextServiceMileage || null,
        completedBy: 'admin',
        completedAt: now,
        updatedAt: now
      });

      toast({
        title: 'Completed',
        description: 'Maintenance marked as completed'
      });

      setShowCompleteDialog(false);
      setSelectedRecord(null);
      setCompleteForm({
        actualCost: 0,
        workPerformed: '',
        technicianNotes: '',
        nextServiceMileage: 0
      });
      loadData();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to complete maintenance',
        variant: 'destructive'
      });
    }
  };

  const handleCancelMaintenance = async (record: MaintenanceRecord) => {
    if (!confirm('Are you sure you want to cancel this maintenance?')) return;

    try {
      await updateDoc(doc(db, MAINTENANCE_COLLECTION, record.id!), {
        status: 'cancelled',
        updatedAt: new Date().toISOString()
      });
      toast({
        title: 'Cancelled',
        description: 'Maintenance cancelled'
      });
      loadData();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to cancel maintenance',
        variant: 'destructive'
      });
    }
  };

  const handleDeleteRecord = async (recordId: string) => {
    if (!confirm('Are you sure you want to delete this record?')) return;

    try {
      await deleteDoc(doc(db, MAINTENANCE_COLLECTION, recordId));
      toast({
        title: 'Deleted',
        description: 'Record deleted'
      });
      loadData();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete record',
        variant: 'destructive'
      });
    }
  };

  const filteredRecords = records.filter(record => {
    const matchesSearch =
      record.vehicleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.vehiclePlate.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || record.status === statusFilter;
    const matchesType = typeFilter === 'all' || record.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const upcomingMaintenance = records.filter(r =>
    r.status === 'scheduled' || r.status === 'overdue'
  ).slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Fleet Maintenance</h1>
          <p className="text-muted-foreground">Schedule and track vehicle maintenance</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Schedule Maintenance
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-6 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Scheduled</p>
                <p className="text-2xl font-bold text-blue-600">{stats.scheduled}</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">In Progress</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.inProgress}</p>
              </div>
              <Wrench className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Overdue</p>
                <p className="text-2xl font-bold text-red-600">{stats.overdue}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">This Week</p>
                <p className="text-2xl font-bold">{stats.upcomingThisWeek}</p>
              </div>
              <Clock className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed (Month)</p>
                <p className="text-2xl font-bold text-green-600">{stats.completedThisMonth}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Cost (Month)</p>
                <p className="text-xl font-bold">LKR {stats.totalCostThisMonth.toLocaleString()}</p>
              </div>
              <DollarSign className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="list">All Maintenance</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        {/* All Maintenance Tab */}
        <TabsContent value="list" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="pt-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Search by vehicle, plate, or title..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                      <SelectItem key={key} value={key}>{config.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {Object.entries(TYPE_CONFIG).map(([key, config]) => (
                      <SelectItem key={key} value={key}>{config.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="outline" onClick={loadData}>
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Records Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>Maintenance</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Scheduled</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Cost</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecords.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        {isLoading ? 'Loading...' : 'No maintenance records found'}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredRecords.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                              <Car className="w-5 h-5 text-gray-400" />
                            </div>
                            <div>
                              <p className="font-medium">{record.vehicleName}</p>
                              <p className="text-sm text-muted-foreground">{record.vehiclePlate}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{record.title}</p>
                            <p className="text-sm text-muted-foreground">{CATEGORY_LABELS[record.category]}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={TYPE_CONFIG[record.type].color}>
                            <span className="flex items-center gap-1">
                              {TYPE_CONFIG[record.type].icon}
                              {TYPE_CONFIG[record.type].label}
                            </span>
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <p>{new Date(record.scheduledDate).toLocaleDateString()}</p>
                            {record.scheduledTime && (
                              <p className="text-muted-foreground">{record.scheduledTime}</p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={STATUS_CONFIG[record.status].color}>
                            <span className="flex items-center gap-1">
                              {STATUS_CONFIG[record.status].icon}
                              {STATUS_CONFIG[record.status].label}
                            </span>
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {record.actualCost ? (
                            <span className="font-medium">LKR {record.actualCost.toLocaleString()}</span>
                          ) : (
                            <span className="text-muted-foreground">~LKR {record.estimatedCost.toLocaleString()}</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setSelectedRecord(record);
                                setShowDetailDialog(true);
                              }}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            {record.status === 'scheduled' && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleStartMaintenance(record)}
                                title="Start Maintenance"
                              >
                                <Wrench className="w-4 h-4 text-yellow-600" />
                              </Button>
                            )}
                            {record.status === 'in_progress' && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  setSelectedRecord(record);
                                  setCompleteForm({
                                    actualCost: record.estimatedCost,
                                    workPerformed: '',
                                    technicianNotes: '',
                                    nextServiceMileage: 0
                                  });
                                  setShowCompleteDialog(true);
                                }}
                                title="Complete Maintenance"
                              >
                                <CheckCircle className="w-4 h-4 text-green-600" />
                              </Button>
                            )}
                            {(record.status === 'scheduled' || record.status === 'overdue') && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleCancelMaintenance(record)}
                                title="Cancel"
                              >
                                <XCircle className="w-4 h-4 text-gray-500" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteRecord(record.id!)}
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Upcoming Tab */}
        <TabsContent value="upcoming" className="space-y-4">
          {stats.overdue > 0 && (
            <Alert variant="destructive">
              <AlertTriangle className="w-4 h-4" />
              <AlertDescription>
                <strong>{stats.overdue} overdue</strong> maintenance task(s) require immediate attention!
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-2 gap-4">
            {upcomingMaintenance.map((record) => (
              <Card key={record.id} className={record.status === 'overdue' ? 'border-red-300 bg-red-50' : ''}>
                <CardContent className="pt-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                        <Car className="w-6 h-6 text-gray-400" />
                      </div>
                      <div>
                        <p className="font-medium">{record.vehicleName}</p>
                        <p className="text-sm text-muted-foreground">{record.vehiclePlate}</p>
                      </div>
                    </div>
                    <Badge className={STATUS_CONFIG[record.status].color}>
                      {STATUS_CONFIG[record.status].label}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Wrench className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">{record.title}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      {new Date(record.scheduledDate).toLocaleDateString()}
                      {record.scheduledTime && ` at ${record.scheduledTime}`}
                    </div>
                    {record.serviceCenter && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        {record.serviceCenter}
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="w-4 h-4 text-muted-foreground" />
                      Estimated: LKR {record.estimatedCost.toLocaleString()}
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    {record.status === 'scheduled' && (
                      <Button size="sm" onClick={() => handleStartMaintenance(record)}>
                        <Wrench className="w-4 h-4 mr-1" />
                        Start
                      </Button>
                    )}
                    {record.status === 'overdue' && (
                      <Button size="sm" variant="destructive" onClick={() => handleStartMaintenance(record)}>
                        <AlertTriangle className="w-4 h-4 mr-1" />
                        Start Now
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedRecord(record);
                        setShowDetailDialog(true);
                      }}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            {upcomingMaintenance.length === 0 && (
              <Card className="col-span-2">
                <CardContent className="py-8 text-center text-muted-foreground">
                  No upcoming maintenance scheduled
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Maintenance Cost Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(CATEGORY_LABELS).map(([category, label]) => {
                  const categoryRecords = records.filter(r =>
                    r.category === category && r.status === 'completed'
                  );
                  const totalCost = categoryRecords.reduce((sum, r) => sum + (r.actualCost || 0), 0);
                  const maxCost = Math.max(
                    ...Object.values(CATEGORY_LABELS).map(cat =>
                      records.filter(r => r.category === cat && r.status === 'completed')
                        .reduce((sum, r) => sum + (r.actualCost || 0), 0)
                    ),
                    1
                  );

                  if (totalCost === 0) return null;

                  return (
                    <div key={category} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{label}</span>
                        <span className="font-medium">LKR {totalCost.toLocaleString()}</span>
                      </div>
                      <Progress value={(totalCost / maxCost) * 100} className="h-2" />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>Maintenance</TableHead>
                    <TableHead>Completed</TableHead>
                    <TableHead>Cost</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {records.filter(r => r.status === 'completed').slice(0, 10).map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{record.vehicleName}</p>
                          <p className="text-sm text-muted-foreground">{record.vehiclePlate}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{record.title}</p>
                          <p className="text-sm text-muted-foreground">{CATEGORY_LABELS[record.category]}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {record.completedAt && new Date(record.completedAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">LKR {(record.actualCost || 0).toLocaleString()}</span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Schedule Maintenance</DialogTitle>
            <DialogDescription>
              Create a new maintenance task for a vehicle
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Vehicle ID *</Label>
                <Input
                  value={formData.vehicleId}
                  onChange={(e) => setFormData(prev => ({ ...prev, vehicleId: e.target.value }))}
                  placeholder="vehicle_123"
                />
              </div>
              <div className="space-y-2">
                <Label>Plate Number</Label>
                <Input
                  value={formData.vehiclePlate}
                  onChange={(e) => setFormData(prev => ({ ...prev, vehiclePlate: e.target.value }))}
                  placeholder="CAB-1234"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Vehicle Name</Label>
              <Input
                value={formData.vehicleName}
                onChange={(e) => setFormData(prev => ({ ...prev, vehicleName: e.target.value }))}
                placeholder="Toyota Prius 2022"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(v) => setFormData(prev => ({ ...prev, type: v as MaintenanceType }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(TYPE_CONFIG).map(([key, config]) => (
                      <SelectItem key={key} value={key}>{config.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(v) => setFormData(prev => ({ ...prev, category: v as MaintenanceCategory }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                      <SelectItem key={key} value={key}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Title *</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="5,000km Oil Change Service"
              />
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Full synthetic oil change with filter replacement..."
                rows={2}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Date *</Label>
                <Input
                  type="date"
                  value={formData.scheduledDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, scheduledDate: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Time</Label>
                <Input
                  type="time"
                  value={formData.scheduledTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, scheduledTime: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Duration (hrs)</Label>
                <Input
                  type="number"
                  value={formData.estimatedDuration}
                  onChange={(e) => setFormData(prev => ({ ...prev, estimatedDuration: Number(e.target.value) }))}
                  min={0.5}
                  step={0.5}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Service Center</Label>
              <Input
                value={formData.serviceCenter}
                onChange={(e) => setFormData(prev => ({ ...prev, serviceCenter: e.target.value }))}
                placeholder="Toyota Lanka Service Center"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Estimated Cost (LKR)</Label>
                <Input
                  type="number"
                  value={formData.estimatedCost}
                  onChange={(e) => setFormData(prev => ({ ...prev, estimatedCost: Number(e.target.value) }))}
                  min={0}
                />
              </div>
              <div className="space-y-2">
                <Label>Current Mileage (km)</Label>
                <Input
                  type="number"
                  value={formData.currentMileage}
                  onChange={(e) => setFormData(prev => ({ ...prev, currentMileage: Number(e.target.value) }))}
                  min={0}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Any additional notes..."
                rows={2}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateRecord}>
              Schedule Maintenance
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Complete Dialog */}
      <Dialog open={showCompleteDialog} onOpenChange={setShowCompleteDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Complete Maintenance</DialogTitle>
            <DialogDescription>
              Record the completion details for this maintenance
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Actual Cost (LKR)</Label>
              <Input
                type="number"
                value={completeForm.actualCost}
                onChange={(e) => setCompleteForm(prev => ({ ...prev, actualCost: Number(e.target.value) }))}
                min={0}
              />
            </div>

            <div className="space-y-2">
              <Label>Work Performed</Label>
              <Textarea
                value={completeForm.workPerformed}
                onChange={(e) => setCompleteForm(prev => ({ ...prev, workPerformed: e.target.value }))}
                placeholder="List the work that was performed..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Technician Notes</Label>
              <Textarea
                value={completeForm.technicianNotes}
                onChange={(e) => setCompleteForm(prev => ({ ...prev, technicianNotes: e.target.value }))}
                placeholder="Any recommendations or observations..."
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label>Next Service at Mileage (km)</Label>
              <Input
                type="number"
                value={completeForm.nextServiceMileage || ''}
                onChange={(e) => setCompleteForm(prev => ({ ...prev, nextServiceMileage: Number(e.target.value) }))}
                placeholder="e.g., 55000"
                min={0}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCompleteDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCompleteMaintenance}>
              <CheckCircle className="w-4 h-4 mr-2" />
              Complete Maintenance
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Maintenance Details</DialogTitle>
          </DialogHeader>

          {selectedRecord && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                  <Car className="w-6 h-6 text-gray-500" />
                </div>
                <div>
                  <p className="font-medium">{selectedRecord.vehicleName}</p>
                  <p className="text-sm text-muted-foreground">{selectedRecord.vehiclePlate}</p>
                </div>
                <Badge className={`ml-auto ${STATUS_CONFIG[selectedRecord.status].color}`}>
                  {STATUS_CONFIG[selectedRecord.status].label}
                </Badge>
              </div>

              <div>
                <h4 className="font-medium mb-1">{selectedRecord.title}</h4>
                <div className="flex gap-2">
                  <Badge className={TYPE_CONFIG[selectedRecord.type].color}>
                    {TYPE_CONFIG[selectedRecord.type].label}
                  </Badge>
                  <Badge variant="outline">{CATEGORY_LABELS[selectedRecord.category]}</Badge>
                </div>
              </div>

              {selectedRecord.description && (
                <div>
                  <p className="text-sm text-muted-foreground">Description</p>
                  <p className="mt-1">{selectedRecord.description}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Scheduled</p>
                  <p className="font-medium">
                    {new Date(selectedRecord.scheduledDate).toLocaleDateString()}
                    {selectedRecord.scheduledTime && ` at ${selectedRecord.scheduledTime}`}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Duration</p>
                  <p className="font-medium">{selectedRecord.estimatedDuration} hours</p>
                </div>
              </div>

              {selectedRecord.serviceCenter && (
                <div>
                  <p className="text-sm text-muted-foreground">Service Center</p>
                  <p className="font-medium">{selectedRecord.serviceCenter}</p>
                  {selectedRecord.serviceCenterAddress && (
                    <p className="text-sm text-muted-foreground">{selectedRecord.serviceCenterAddress}</p>
                  )}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Estimated Cost</p>
                  <p className="font-medium">LKR {selectedRecord.estimatedCost.toLocaleString()}</p>
                </div>
                {selectedRecord.actualCost && (
                  <div>
                    <p className="text-sm text-muted-foreground">Actual Cost</p>
                    <p className="font-medium">LKR {selectedRecord.actualCost.toLocaleString()}</p>
                  </div>
                )}
              </div>

              {selectedRecord.workPerformed && (
                <div>
                  <p className="text-sm text-muted-foreground">Work Performed</p>
                  <p className="mt-1">{selectedRecord.workPerformed}</p>
                </div>
              )}

              {selectedRecord.technicianNotes && (
                <div>
                  <p className="text-sm text-muted-foreground">Technician Notes</p>
                  <p className="mt-1">{selectedRecord.technicianNotes}</p>
                </div>
              )}

              {selectedRecord.completedAt && (
                <div className="pt-2 border-t text-sm text-muted-foreground">
                  Completed on {new Date(selectedRecord.completedAt).toLocaleDateString()} by {selectedRecord.completedBy || 'System'}
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetailDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FleetMaintenanceManager;
