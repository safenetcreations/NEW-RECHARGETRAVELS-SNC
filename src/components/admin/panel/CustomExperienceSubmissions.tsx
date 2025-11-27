import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  Eye,
  Edit2,
  Trash2,
  Mail,
  Phone,
  MessageSquare,
  Calendar,
  DollarSign,
  Users,
  MapPin,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  Download,
  RefreshCw,
  Star,
  Send,
  FileText,
  User,
  Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { customExperiencePageService, type CustomExperienceSubmission } from '@/services/customExperiencePageService';
import { toast } from 'sonner';
import { format } from 'date-fns';

const CustomExperienceSubmissions = () => {
  const [submissions, setSubmissions] = useState<CustomExperienceSubmission[]>([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState<CustomExperienceSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedSubmission, setSelectedSubmission] = useState<CustomExperienceSubmission | null>(null);
  const [editingSubmission, setEditingSubmission] = useState<CustomExperienceSubmission | null>(null);
  const [updating, setUpdating] = useState(false);

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    contacted: 0,
    quoted: 0,
    confirmed: 0,
    completed: 0
  });

  useEffect(() => {
    loadSubmissions();
  }, []);

  useEffect(() => {
    filterSubmissions();
    calculateStats();
  }, [submissions, searchTerm, statusFilter]);

  const loadSubmissions = async () => {
    try {
      setLoading(true);
      const data = await customExperiencePageService.getAllSubmissions();
      setSubmissions(data);
      toast.success('Submissions loaded successfully');
    } catch (error) {
      console.error('Error loading submissions:', error);
      toast.error('Failed to load submissions');
    } finally {
      setLoading(false);
    }
  };

  const filterSubmissions = () => {
    let filtered = submissions;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(sub =>
        sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.interests.some(interest => interest.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(sub => sub.status === statusFilter);
    }

    setFilteredSubmissions(filtered);
  };

  const calculateStats = () => {
    const newStats = {
      total: submissions.length,
      new: submissions.filter(s => s.status === 'new').length,
      contacted: submissions.filter(s => s.status === 'contacted').length,
      quoted: submissions.filter(s => s.status === 'quoted').length,
      confirmed: submissions.filter(s => s.status === 'confirmed').length,
      completed: submissions.filter(s => s.status === 'completed').length
    };
    setStats(newStats);
  };

  const updateSubmissionStatus = async (id: string, status: CustomExperienceSubmission['status']) => {
    try {
      setUpdating(true);
      await customExperiencePageService.updateSubmissionStatus(id, status);
      setSubmissions(prev => prev.map(sub =>
        sub.id === id ? { ...sub, status, updatedAt: new Date() } : sub
      ));
      toast.success(`Submission status updated to ${status}`);
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  const deleteSubmission = async (id: string) => {
    if (!confirm('Are you sure you want to delete this submission? This action cannot be undone.')) {
      return;
    }

    try {
      await customExperiencePageService.deleteSubmission(id);
      setSubmissions(prev => prev.filter(sub => sub.id !== id));
      toast.success('Submission deleted successfully');
    } catch (error) {
      console.error('Error deleting submission:', error);
      toast.error('Failed to delete submission');
    }
  };

  const getStatusColor = (status: CustomExperienceSubmission['status']) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'contacted': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'quoted': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'confirmed': return 'bg-green-100 text-green-800 border-green-200';
      case 'completed': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: CustomExperienceSubmission['status']) => {
    switch (status) {
      case 'new': return <AlertCircle className="w-4 h-4" />;
      case 'contacted': return <Clock className="w-4 h-4" />;
      case 'quoted': return <FileText className="w-4 h-4" />;
      case 'confirmed': return <CheckCircle className="w-4 h-4" />;
      case 'completed': return <Star className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const exportSubmissions = () => {
    const csvData = filteredSubmissions.map(sub => ({
      ID: sub.id,
      Name: sub.name,
      Email: sub.email,
      Phone: sub.phone,
      Country: sub.country,
      'Start Date': sub.startDate,
      'End Date': sub.endDate,
      'Flexible Dates': sub.flexibleDates ? 'Yes' : 'No',
      'Group Size': sub.groupSize,
      'Budget Amount': sub.budget.amount,
      'Budget Currency': sub.budget.currency,
      'Per Person': sub.budget.perPerson ? 'Yes' : 'No',
      Interests: sub.interests.join('; '),
      'Experience Types': sub.experienceTypes.join('; '),
      'Accommodation': sub.accommodationPreference,
      'Meal Preferences': sub.mealPreferences.join('; '),
      'Special Requests': sub.specialRequests,
      'Previous Visits': sub.previousVisits ? 'Yes' : 'No',
      'Mobility Requirements': sub.mobilityRequirements,
      'Medical Conditions': sub.medicalConditions,
      Status: sub.status,
      'Created At': format(sub.createdAt, 'yyyy-MM-dd HH:mm:ss'),
      'Updated At': format(sub.updatedAt, 'yyyy-MM-dd HH:mm:ss')
    }));

    const csvString = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).map(val => `"${val}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `custom-experience-submissions-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Submissions exported successfully');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading submissions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Custom Experience Submissions</h1>
          <p className="text-gray-600">Manage and track custom travel experience requests</p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={loadSubmissions}
            disabled={loading}
            className="border-2"
          >
            <RefreshCw className={`mr-2 w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            onClick={exportSubmissions}
            variant="outline"
            className="border-2"
          >
            <Download className="mr-2 w-4 h-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <Card className="border-2">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-sm text-gray-600">Total</div>
          </CardContent>
        </Card>
        <Card className="border-2 border-blue-200 bg-blue-50">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-700">{stats.new}</div>
            <div className="text-sm text-blue-600">New</div>
          </CardContent>
        </Card>
        <Card className="border-2 border-yellow-200 bg-yellow-50">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-700">{stats.contacted}</div>
            <div className="text-sm text-yellow-600">Contacted</div>
          </CardContent>
        </Card>
        <Card className="border-2 border-purple-200 bg-purple-50">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-700">{stats.quoted}</div>
            <div className="text-sm text-purple-600">Quoted</div>
          </CardContent>
        </Card>
        <Card className="border-2 border-green-200 bg-green-50">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-700">{stats.confirmed}</div>
            <div className="text-sm text-green-600">Confirmed</div>
          </CardContent>
        </Card>
        <Card className="border-2 border-emerald-200 bg-emerald-50">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-emerald-700">{stats.completed}</div>
            <div className="text-sm text-emerald-600">Completed</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6 border-2">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by name, email, country, or interests..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12 border-2"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[200px] h-12 border-2">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="quoted">Quoted</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Submissions Table */}
      <div className="space-y-4">
        {filteredSubmissions.map((submission) => (
          <motion.div
            key={submission.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="block"
          >
            <Card className="border-2 hover:border-blue-300 transition-colors">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Customer Info */}
                  <div className="flex-1">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                        {submission.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900">{submission.name}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                          <span className="flex items-center gap-1">
                            <Mail className="w-4 h-4" />
                            {submission.email}
                          </span>
                          <span className="flex items-center gap-1">
                            <Phone className="w-4 h-4" />
                            {submission.phone}
                          </span>
                          <span className="flex items-center gap-1">
                            <Globe className="w-4 h-4" />
                            {submission.country}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge className={`flex items-center gap-1 ${getStatusColor(submission.status)}`}>
                            {getStatusIcon(submission.status)}
                            {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            {format(submission.createdAt, 'MMM dd, yyyy')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Trip Details */}
                  <div className="flex-1">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Dates:</span>
                        <div className="text-gray-600">
                          {submission.startDate} to {submission.endDate}
                          {submission.flexibleDates && (
                            <span className="text-blue-600 ml-1">(Flexible)</span>
                          )}
                        </div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Group Size:</span>
                        <div className="text-gray-600">{submission.groupSize} travelers</div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Budget:</span>
                        <div className="text-gray-600">
                          {submission.budget.currency} {submission.budget.amount.toLocaleString()}
                          <span className="text-xs">({submission.budget.perPerson ? 'per person' : 'total'})</span>
                        </div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Interests:</span>
                        <div className="text-gray-600 text-xs">
                          {submission.interests.slice(0, 2).join(', ')}
                          {submission.interests.length > 2 && ` +${submission.interests.length - 2} more`}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedSubmission(submission)}
                          className="border-2"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2">
                            <User className="w-5 h-5" />
                            {submission.name}'s Custom Experience Request
                          </DialogTitle>
                          <DialogDescription>
                            Submitted on {format(submission.createdAt, 'MMMM dd, yyyy')}
                          </DialogDescription>
                        </DialogHeader>

                        {selectedSubmission && (
                          <div className="space-y-6">
                            {/* Status Update */}
                            <Card className="border-2">
                              <CardHeader>
                                <CardTitle className="text-lg">Update Status</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="flex gap-2 flex-wrap">
                                  {(['new', 'contacted', 'quoted', 'confirmed', 'completed'] as const).map((status) => (
                                    <Button
                                      key={status}
                                      variant={selectedSubmission.status === status ? 'default' : 'outline'}
                                      size="sm"
                                      onClick={() => updateSubmissionStatus(selectedSubmission.id!, status)}
                                      disabled={updating}
                                      className={`border-2 ${selectedSubmission.status === status ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
                                    >
                                      {status.charAt(0).toUpperCase() + status.slice(1)}
                                    </Button>
                                  ))}
                                </div>
                              </CardContent>
                            </Card>

                            {/* Contact Information */}
                            <Card className="border-2">
                              <CardHeader>
                                <CardTitle className="text-lg">Contact Information</CardTitle>
                              </CardHeader>
                              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <Label className="font-medium">Name</Label>
                                  <p className="text-gray-700">{selectedSubmission.name}</p>
                                </div>
                                <div>
                                  <Label className="font-medium">Email</Label>
                                  <p className="text-gray-700">{selectedSubmission.email}</p>
                                </div>
                                <div>
                                  <Label className="font-medium">Phone</Label>
                                  <p className="text-gray-700">{selectedSubmission.phone}</p>
                                </div>
                                <div>
                                  <Label className="font-medium">Country</Label>
                                  <p className="text-gray-700">{selectedSubmission.country}</p>
                                </div>
                              </CardContent>
                            </Card>

                            {/* Trip Details */}
                            <Card className="border-2">
                              <CardHeader>
                                <CardTitle className="text-lg">Trip Details</CardTitle>
                              </CardHeader>
                              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <Label className="font-medium">Travel Dates</Label>
                                  <p className="text-gray-700">
                                    {selectedSubmission.startDate} to {selectedSubmission.endDate}
                                    {selectedSubmission.flexibleDates && (
                                      <span className="text-blue-600 ml-2">(Flexible dates)</span>
                                    )}
                                  </p>
                                </div>
                                <div>
                                  <Label className="font-medium">Group Size</Label>
                                  <p className="text-gray-700">{selectedSubmission.groupSize} travelers</p>
                                </div>
                                <div>
                                  <Label className="font-medium">Budget</Label>
                                  <p className="text-gray-700">
                                    {selectedSubmission.budget.currency} {selectedSubmission.budget.amount.toLocaleString()}
                                    <span className="text-sm text-gray-600">
                                      ({selectedSubmission.budget.perPerson ? 'per person' : 'total budget'})
                                    </span>
                                  </p>
                                </div>
                                <div>
                                  <Label className="font-medium">Accommodation Preference</Label>
                                  <p className="text-gray-700 capitalize">{selectedSubmission.accommodationPreference}</p>
                                </div>
                              </CardContent>
                            </Card>

                            {/* Interests & Preferences */}
                            <Card className="border-2">
                              <CardHeader>
                                <CardTitle className="text-lg">Interests & Preferences</CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                <div>
                                  <Label className="font-medium">Interests</Label>
                                  <div className="flex flex-wrap gap-2 mt-2">
                                    {selectedSubmission.interests.map((interest) => (
                                      <Badge key={interest} variant="secondary">{interest}</Badge>
                                    ))}
                                  </div>
                                </div>

                                {selectedSubmission.experienceTypes.length > 0 && (
                                  <div>
                                    <Label className="font-medium">Experience Types</Label>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                      {selectedSubmission.experienceTypes.map((type) => (
                                        <Badge key={type} variant="outline">{type}</Badge>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {selectedSubmission.mealPreferences.length > 0 && (
                                  <div>
                                    <Label className="font-medium">Dietary Preferences</Label>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                      {selectedSubmission.mealPreferences.map((meal) => (
                                        <Badge key={meal} variant="outline">{meal}</Badge>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </CardContent>
                            </Card>

                            {/* Special Requirements */}
                            {(selectedSubmission.specialRequests || selectedSubmission.mobilityRequirements || selectedSubmission.medicalConditions) && (
                              <Card className="border-2">
                                <CardHeader>
                                  <CardTitle className="text-lg">Special Requirements</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                  {selectedSubmission.specialRequests && (
                                    <div>
                                      <Label className="font-medium">Special Requests</Label>
                                      <p className="text-gray-700 mt-1">{selectedSubmission.specialRequests}</p>
                                    </div>
                                  )}

                                  {selectedSubmission.mobilityRequirements && (
                                    <div>
                                      <Label className="font-medium">Mobility Requirements</Label>
                                      <p className="text-gray-700 mt-1">{selectedSubmission.mobilityRequirements}</p>
                                    </div>
                                  )}

                                  {selectedSubmission.medicalConditions && (
                                    <div>
                                      <Label className="font-medium">Medical Conditions</Label>
                                      <p className="text-gray-700 mt-1">{selectedSubmission.medicalConditions}</p>
                                    </div>
                                  )}

                                  <div className="flex items-center gap-2">
                                    <Checkbox checked={selectedSubmission.previousVisits} readOnly />
                                    <Label>Has visited Sri Lanka before</Label>
                                  </div>
                                </CardContent>
                              </Card>
                            )}

                            {/* Custom Answers */}
                            {selectedSubmission.customAnswers && Object.keys(selectedSubmission.customAnswers).length > 0 && (
                              <Card className="border-2">
                                <CardHeader>
                                  <CardTitle className="text-lg">Additional Information</CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <div className="space-y-3">
                                    {Object.entries(selectedSubmission.customAnswers).map(([key, value]) => (
                                      <div key={key}>
                                        <Label className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</Label>
                                        <p className="text-gray-700 mt-1">{String(value)}</p>
                                      </div>
                                    ))}
                                  </div>
                                </CardContent>
                              </Card>
                            )}

                            {/* Action Buttons */}
                            <div className="flex gap-3 pt-4">
                              <Button
                                onClick={() => window.open(`mailto:${selectedSubmission.email}`, '_blank')}
                                className="bg-blue-600 hover:bg-blue-700"
                              >
                                <Mail className="w-4 h-4 mr-2" />
                                Send Email
                              </Button>
                              <Button
                                onClick={() => window.open(`https://wa.me/${selectedSubmission.phone.replace(/\s+/g, '')}`, '_blank')}
                                variant="outline"
                                className="border-2"
                              >
                                <MessageSquare className="w-4 h-4 mr-2" />
                                WhatsApp
                              </Button>
                              <Button
                                onClick={() => window.open(`tel:${selectedSubmission.phone}`, '_blank')}
                                variant="outline"
                                className="border-2"
                              >
                                <Phone className="w-4 h-4 mr-2" />
                                Call
                              </Button>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingSubmission(submission)}
                      className="border-2"
                    >
                      <Edit2 className="w-4 h-4 mr-1" />
                      Edit
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteSubmission(submission.id!)}
                      className="border-2 border-red-200 hover:bg-red-50 hover:border-red-300"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredSubmissions.length === 0 && (
        <Card className="border-2 border-dashed">
          <CardContent className="p-12 text-center">
            <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No submissions found</h3>
            <p className="text-gray-500">
              {searchTerm || statusFilter !== 'all'
                ? 'Try adjusting your search or filter criteria.'
                : 'Custom experience submissions will appear here once customers submit requests.'}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Edit Submission Modal */}
      <Dialog open={!!editingSubmission} onOpenChange={(open) => !open && setEditingSubmission(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Submission</DialogTitle>
          </DialogHeader>
          {editingSubmission && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Name</Label>
                  <Input
                    value={editingSubmission.name}
                    onChange={(e) => setEditingSubmission({ ...editingSubmission, name: e.target.value })}
                    className="border-2"
                  />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input
                    value={editingSubmission.email}
                    onChange={(e) => setEditingSubmission({ ...editingSubmission, email: e.target.value })}
                    className="border-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Phone</Label>
                  <Input
                    value={editingSubmission.phone}
                    onChange={(e) => setEditingSubmission({ ...editingSubmission, phone: e.target.value })}
                    className="border-2"
                  />
                </div>
                <div>
                  <Label>Country</Label>
                  <Input
                    value={editingSubmission.country}
                    onChange={(e) => setEditingSubmission({ ...editingSubmission, country: e.target.value })}
                    className="border-2"
                  />
                </div>
              </div>

              <div>
                <Label>Status</Label>
                <Select
                  value={editingSubmission.status}
                  onValueChange={(value: any) => setEditingSubmission({ ...editingSubmission, status: value })}
                >
                  <SelectTrigger className="border-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="contacted">Contacted</SelectItem>
                    <SelectItem value="quoted">Quoted</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setEditingSubmission(null)}>
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    // Update the submission in the list
                    setSubmissions(prev => prev.map(sub =>
                      sub.id === editingSubmission.id ? editingSubmission : sub
                    ));
                    setEditingSubmission(null);
                    toast.success('Submission updated');
                  }}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CustomExperienceSubmissions;