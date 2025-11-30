import { useState, useEffect } from 'react';
import { Loader2, Compass, Mail, Phone, MapPin, Calendar, Users, DollarSign, CheckCircle, XCircle, Clock, MessageCircle, Eye, Trash2, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { customExperiencePageService, CustomExperienceSubmission } from '@/services/customExperiencePageService';

const CustomExperienceAdmin = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [submissions, setSubmissions] = useState<CustomExperienceSubmission[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<CustomExperienceSubmission | null>(null);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await customExperiencePageService.getAllSubmissions();
      setSubmissions(data);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const updateStatus = async (id: string, status: CustomExperienceSubmission['status']) => {
    try {
      await customExperiencePageService.updateSubmissionStatus(id, status);
      setSubmissions(prev => prev.map(s => s.id === id ? { ...s, status } : s));
      toast({ title: `Status updated to ${status}` });
    } catch (e) { toast({ title: 'Error updating status', variant: 'destructive' }); }
  };

  const deleteSubmission = async (id: string) => {
    if (!confirm('Delete this submission?')) return;
    try {
      await customExperiencePageService.deleteSubmission(id);
      setSubmissions(prev => prev.filter(s => s.id !== id));
      setSelectedSubmission(null);
      toast({ title: 'Submission deleted' });
    } catch (e) { toast({ title: 'Error deleting', variant: 'destructive' }); }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'contacted': return 'bg-yellow-100 text-yellow-800';
      case 'quoted': return 'bg-purple-100 text-purple-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredSubmissions = filter === 'all' ? submissions : submissions.filter(s => s.status === filter);

  const stats = {
    total: submissions.length,
    new: submissions.filter(s => s.status === 'new').length,
    contacted: submissions.filter(s => s.status === 'contacted').length,
    quoted: submissions.filter(s => s.status === 'quoted').length,
    confirmed: submissions.filter(s => s.status === 'confirmed').length
  };

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><Loader2 className="w-12 h-12 animate-spin text-amber-600" /></div>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-2"><Compass className="w-8 h-8" /><h1 className="text-3xl font-bold">Custom Experience Admin</h1></div>
          <p className="text-amber-100">Manage custom trip requests and bookings</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {[
            { label: 'Total', value: stats.total, color: 'bg-gray-500' },
            { label: 'New', value: stats.new, color: 'bg-blue-500' },
            { label: 'Contacted', value: stats.contacted, color: 'bg-yellow-500' },
            { label: 'Quoted', value: stats.quoted, color: 'bg-purple-500' },
            { label: 'Confirmed', value: stats.confirmed, color: 'bg-green-500' }
          ].map((stat, i) => (
            <Card key={i} className="border-0 shadow">
              <CardContent className="p-4 text-center">
                <div className={`w-10 h-10 ${stat.color} rounded-full flex items-center justify-center mx-auto mb-2 text-white font-bold`}>{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filter */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {['all', 'new', 'contacted', 'quoted', 'confirmed', 'completed'].map(f => (
            <Button key={f} variant={filter === f ? 'default' : 'outline'} size="sm" onClick={() => setFilter(f)} className={filter === f ? 'bg-amber-500' : ''}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Button>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Submissions List */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Requests ({filteredSubmissions.length})</h2>
            {filteredSubmissions.length === 0 ? (
              <Card><CardContent className="p-8 text-center text-gray-500">No submissions found</CardContent></Card>
            ) : (
              filteredSubmissions.map(sub => (
                <Card key={sub.id} className={`cursor-pointer hover:shadow-lg transition-all ${selectedSubmission?.id === sub.id ? 'ring-2 ring-amber-500' : ''}`} onClick={() => setSelectedSubmission(sub)}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-lg">{sub.name}</h3>
                        <p className="text-gray-500 text-sm">{sub.country}</p>
                      </div>
                      <Badge className={getStatusColor(sub.status)}>{sub.status}</Badge>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{sub.startDate || 'Flexible'}</span>
                      <span className="flex items-center gap-1"><Users className="w-4 h-4" />{sub.groupSize} pax</span>
                      <span className="flex items-center gap-1"><DollarSign className="w-4 h-4" />${sub.budget?.amount?.toLocaleString() || 'TBD'}</span>
                    </div>
                    {sub.interests && sub.interests.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {sub.interests.slice(0, 4).map((int, i) => <Badge key={i} variant="outline" className="text-xs">{int}</Badge>)}
                        {sub.interests.length > 4 && <Badge variant="outline" className="text-xs">+{sub.interests.length - 4}</Badge>}
                      </div>
                    )}
                    <div className="text-xs text-gray-400 mt-2">
                      {sub.createdAt ? new Date(sub.createdAt).toLocaleDateString() : 'Unknown date'}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Detail Panel */}
          <div className="lg:sticky lg:top-6">
            {selectedSubmission ? (
              <Card className="border-0 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-t-lg">
                  <CardTitle className="flex items-center justify-between">
                    <span>{selectedSubmission.name}</span>
                    <Badge className={`${getStatusColor(selectedSubmission.status)} text-sm`}>{selectedSubmission.status}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  {/* Contact Info */}
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2"><Mail className="w-4 h-4 text-amber-500" />Contact</h4>
                    <div className="space-y-2 text-sm">
                      <a href={`mailto:${selectedSubmission.email}`} className="flex items-center gap-2 text-amber-600 hover:underline"><Mail className="w-4 h-4" />{selectedSubmission.email}</a>
                      <a href={`tel:${selectedSubmission.phone}`} className="flex items-center gap-2 text-amber-600 hover:underline"><Phone className="w-4 h-4" />{selectedSubmission.phone}</a>
                      <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-gray-400" />{selectedSubmission.country}</div>
                    </div>
                  </div>

                  {/* Trip Details */}
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2"><Calendar className="w-4 h-4 text-amber-500" />Trip Details</h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="bg-gray-50 p-3 rounded-lg"><span className="text-gray-500 block">Start Date</span><strong>{selectedSubmission.startDate || 'Flexible'}</strong></div>
                      <div className="bg-gray-50 p-3 rounded-lg"><span className="text-gray-500 block">Group Size</span><strong>{selectedSubmission.groupSize} people</strong></div>
                      <div className="bg-gray-50 p-3 rounded-lg"><span className="text-gray-500 block">Budget</span><strong>${selectedSubmission.budget?.amount?.toLocaleString() || 'TBD'}</strong></div>
                      <div className="bg-gray-50 p-3 rounded-lg"><span className="text-gray-500 block">Accommodation</span><strong className="capitalize">{selectedSubmission.accommodationPreference}</strong></div>
                    </div>
                  </div>

                  {/* Interests */}
                  {selectedSubmission.interests && selectedSubmission.interests.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-3">Interests</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedSubmission.interests.map((int, i) => <Badge key={i} className="bg-amber-100 text-amber-800">{int}</Badge>)}
                      </div>
                    </div>
                  )}

                  {/* Special Requests */}
                  {selectedSubmission.specialRequests && (
                    <div>
                      <h4 className="font-semibold mb-2">Special Requests</h4>
                      <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg whitespace-pre-wrap">{selectedSubmission.specialRequests}</p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="pt-4 border-t space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {selectedSubmission.status === 'new' && (
                        <Button size="sm" className="bg-yellow-500 hover:bg-yellow-600" onClick={() => updateStatus(selectedSubmission.id!, 'contacted')}>
                          <Phone className="w-4 h-4 mr-1" />Mark Contacted
                        </Button>
                      )}
                      {selectedSubmission.status === 'contacted' && (
                        <Button size="sm" className="bg-purple-500 hover:bg-purple-600" onClick={() => updateStatus(selectedSubmission.id!, 'quoted')}>
                          <DollarSign className="w-4 h-4 mr-1" />Mark Quoted
                        </Button>
                      )}
                      {selectedSubmission.status === 'quoted' && (
                        <Button size="sm" className="bg-green-500 hover:bg-green-600" onClick={() => updateStatus(selectedSubmission.id!, 'confirmed')}>
                          <CheckCircle className="w-4 h-4 mr-1" />Mark Confirmed
                        </Button>
                      )}
                      {selectedSubmission.status === 'confirmed' && (
                        <Button size="sm" className="bg-gray-500 hover:bg-gray-600" onClick={() => updateStatus(selectedSubmission.id!, 'completed')}>
                          <CheckCircle className="w-4 h-4 mr-1" />Mark Completed
                        </Button>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => window.open(`https://wa.me/${selectedSubmission.phone?.replace(/[^0-9]/g, '')}`, '_blank')}>
                        <MessageCircle className="w-4 h-4 mr-1" />WhatsApp
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => window.open(`mailto:${selectedSubmission.email}`, '_blank')}>
                        <Mail className="w-4 h-4 mr-1" />Email
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-600 border-red-300" onClick={() => deleteSubmission(selectedSubmission.id!)}>
                        <Trash2 className="w-4 h-4 mr-1" />Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-0 shadow-lg">
                <CardContent className="p-12 text-center text-gray-500">
                  <Eye className="w-12 h-12 mx-auto mb-4 opacity-30" />
                  <p>Select a request to view details</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomExperienceAdmin;
