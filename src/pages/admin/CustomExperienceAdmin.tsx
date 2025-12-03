import { useEffect, useState } from 'react';
import {
  Loader2,
  Compass,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Users,
  DollarSign,
  CheckCircle,
  Clock,
  MessageCircle,
  Eye,
  Trash2,
  Filter,
  UserCheck,
  Send,
  NotebookPen
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { customExperiencePageService, CustomExperienceSubmission } from '@/services/customExperiencePageService';
import { emailService } from '@/services/emailService';

const CustomExperienceAdmin = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [submissions, setSubmissions] = useState<CustomExperienceSubmission[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<CustomExperienceSubmission | null>(null);
  const [filter, setFilter] = useState('all');
  const [agentName, setAgentName] = useState(() => {
    if (typeof window === 'undefined') return 'Recharge Concierge';
    return window.localStorage?.getItem('custom_experience_agent') || 'Recharge Concierge';
  });
  const [conciergeNotes, setConciergeNotes] = useState('');
  const [assignedConcierge, setAssignedConcierge] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage?.setItem('custom_experience_agent', agentName);
    }
  }, [agentName]);

  useEffect(() => {
    if (selectedSubmission) {
      setConciergeNotes(selectedSubmission.internalNotes || '');
      setAssignedConcierge(selectedSubmission.assignedConcierge || '');
    }
  }, [selectedSubmission]);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await customExperiencePageService.getAllSubmissions();
      setSubmissions(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (submissionId: string, status: CustomExperienceSubmission['status']) => {
    try {
      const note = window.prompt('Add note for this update (optional)') || undefined;
      await customExperiencePageService.updateSubmissionStatus(submissionId, status, { note, agent: agentName });
      setSubmissions((prev) =>
        prev.map((submission) =>
          submission.id === submissionId
            ? {
                ...submission,
                status,
                statusHistory: [
                  ...(submission.statusHistory || []),
                  { status, note, agent: agentName, timestamp: new Date() }
                ]
              }
            : submission
        )
      );
      if (selectedSubmission?.id === submissionId) {
        setSelectedSubmission((prev) =>
          prev
            ? {
                ...prev,
                status,
                statusHistory: [
                  ...(prev.statusHistory || []),
                  { status, note, agent: agentName, timestamp: new Date() }
                ]
              }
            : prev
        );
      }
      toast({ title: `Status updated to ${status}` });
    } catch (err) {
      console.error(err);
      toast({ title: 'Error updating status', variant: 'destructive' });
    }
  };

  const deleteSubmission = async (submissionId: string) => {
    if (!window.confirm('Delete this submission?')) return;
    try {
      await customExperiencePageService.deleteSubmission(submissionId);
      setSubmissions((prev) => prev.filter((submission) => submission.id !== submissionId));
      setSelectedSubmission(null);
      toast({ title: 'Submission deleted' });
    } catch (err) {
      console.error(err);
      toast({ title: 'Failed to delete submission', variant: 'destructive' });
    }
  };

  const saveConciergeDetails = async () => {
    if (!selectedSubmission?.id) return;
    setSavingNotes(true);
    try {
      await customExperiencePageService.updateSubmissionDetails(selectedSubmission.id, {
        assignedConcierge,
        internalNotes: conciergeNotes
      });
      setSubmissions((prev) =>
        prev.map((submission) =>
          submission.id === selectedSubmission.id
            ? { ...submission, assignedConcierge, internalNotes: conciergeNotes }
            : submission
        )
      );
      setSelectedSubmission((prev) => (prev ? { ...prev, assignedConcierge, internalNotes: conciergeNotes } : prev));
      toast({ title: 'Concierge notes saved' });
    } catch (err) {
      console.error(err);
      toast({ title: 'Failed to save notes', variant: 'destructive' });
    } finally {
      setSavingNotes(false);
    }
  };

  const sendConciergeEmail = async () => {
    if (!selectedSubmission) return;
    try {
      await emailService.sendEmail({
        to: selectedSubmission.email,
        subject: `Itinerary update for ${selectedSubmission.name}`,
        html: `
          <p>Hi ${selectedSubmission.name?.split(' ')[0] || 'traveler'},</p>
          <p>${assignedConcierge || agentName} from Recharge Travels here.</p>
          <p>We’re shaping your Sri Lanka experience with the following focus:</p>
          <ul>
            <li>Travel window: ${selectedSubmission.startDate || 'Flexible'}</li>
            <li>Guests: ${selectedSubmission.groupSize}</li>
            <li>Interests: ${(selectedSubmission.interests || []).join(', ') || 'Not specified yet'}</li>
          </ul>
          <p>${conciergeNotes || 'We’ll follow up with curated proposals shortly—message us anytime for live tweaks.'}</p>
          <p>— ${assignedConcierge || agentName}</p>
        `,
        text: `Hi ${selectedSubmission.name}, ${assignedConcierge || agentName} here with an itinerary update.`
      });
      toast({ title: 'SendGrid email sent' });
    } catch (err) {
      console.error(err);
      toast({ title: 'Failed to send email', variant: 'destructive' });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800';
      case 'contacted':
        return 'bg-yellow-100 text-yellow-800';
      case 'quoted':
        return 'bg-purple-100 text-purple-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredSubmissions = filter === 'all' ? submissions : submissions.filter((submission) => submission.status === filter);

  const stats = {
    total: submissions.length,
    new: submissions.filter((s) => s.status === 'new').length,
    contacted: submissions.filter((s) => s.status === 'contacted').length,
    quoted: submissions.filter((s) => s.status === 'quoted').length,
    confirmed: submissions.filter((s) => s.status === 'confirmed').length
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-amber-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <Compass className="w-8 h-8" />
            <h1 className="text-3xl font-bold">Custom Experience Admin</h1>
          </div>
          <p className="text-amber-100">Manage custom trip requests and concierge follow-ups</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        <Card className="border border-amber-100 bg-white">
          <CardContent className="p-4 flex items-center gap-4 flex-wrap">
            <UserCheck className="w-6 h-6 text-amber-500" />
            <div>
              <p className="text-xs uppercase text-gray-400">Concierge name</p>
              <Input value={agentName} onChange={(e) => setAgentName(e.target.value)} className="w-64" />
            </div>
            <p className="text-sm text-gray-500">
              Actions and notes will be attributed to <span className="font-semibold">{agentName}</span>.
            </p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { label: 'Total', value: stats.total, color: 'bg-gray-500' },
            { label: 'New', value: stats.new, color: 'bg-blue-500' },
            { label: 'Contacted', value: stats.contacted, color: 'bg-yellow-500' },
            { label: 'Quoted', value: stats.quoted, color: 'bg-purple-500' },
            { label: 'Confirmed', value: stats.confirmed, color: 'bg-green-500' }
          ].map((stat) => (
            <Card key={stat.label} className="border-0 shadow-sm">
              <CardContent className="p-4 text-center">
                <div className={`${stat.color} text-white w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 font-semibold`}>{stat.value}</div>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex gap-2 flex-wrap">
          {['all', 'new', 'contacted', 'quoted', 'confirmed', 'completed'].map((item) => (
            <Button key={item} variant={filter === item ? 'default' : 'outline'} size="sm" onClick={() => setFilter(item)} className={filter === item ? 'bg-amber-500' : ''}>
              <Filter className="w-3 h-3 mr-2" /> {item}
            </Button>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Requests ({filteredSubmissions.length})</h2>
            {filteredSubmissions.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center text-gray-500">No submissions</CardContent>
              </Card>
            ) : (
              filteredSubmissions.map((submission) => (
                <Card
                  key={submission.id}
                  className={`cursor-pointer transition hover:shadow-lg ${selectedSubmission?.id === submission.id ? 'ring-2 ring-amber-500' : ''}`}
                  onClick={() => setSelectedSubmission(submission)}
                >
                  <CardContent className="p-4 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold">{submission.name}</h3>
                        <p className="text-sm text-gray-500">{submission.country}</p>
                      </div>
                      <Badge className={getStatusBadge(submission.status)}>{submission.status}</Badge>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {submission.startDate || 'Flexible'}</span>
                      <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {submission.groupSize} guests</span>
                      <span className="flex items-center gap-1"><DollarSign className="w-4 h-4" /> {submission.budget?.amount?.toLocaleString() || 'TBD'}</span>
                    </div>
                    {submission.interests?.length ? (
                      <div className="flex flex-wrap gap-2">
                        {submission.interests.slice(0, 4).map((interest) => (
                          <Badge key={interest} variant="outline" className="text-xs">{interest}</Badge>
                        ))}
                        {submission.interests.length > 4 && <Badge variant="outline" className="text-xs">+{submission.interests.length - 4}</Badge>}
                      </div>
                    ) : null}
                    <p className="text-xs text-gray-400">{submission.createdAt ? new Date(submission.createdAt).toLocaleDateString() : ''}</p>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          <div className="lg:sticky lg:top-8">
            {selectedSubmission ? (
              <Card className="border-0 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-t-lg">
                  <CardTitle className="flex items-center justify-between">
                    {selectedSubmission.name}
                    <Badge className={`${getStatusBadge(selectedSubmission.status)} text-sm`}>{selectedSubmission.status}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2"><Mail className="w-4 h-4 text-amber-500" />Contact</h4>
                    <div className="space-y-2 text-sm">
                      <a href={`mailto:${selectedSubmission.email}`} className="flex items-center gap-2 text-amber-600 hover:underline"><Mail className="w-4 h-4" /> {selectedSubmission.email}</a>
                      <a href={`tel:${selectedSubmission.phone}`} className="flex items-center gap-2 text-amber-600 hover:underline"><Phone className="w-4 h-4" /> {selectedSubmission.phone}</a>
                      <div className="flex items-center gap-2 text-gray-500"><MapPin className="w-4 h-4" /> {selectedSubmission.country}</div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2"><Calendar className="w-4 h-4 text-amber-500" />Trip Details</h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <span className="text-gray-500 block text-xs">Start</span>
                        <strong>{selectedSubmission.startDate || 'Flexible'}</strong>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <span className="text-gray-500 block text-xs">Group</span>
                        <strong>{selectedSubmission.groupSize} guests</strong>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <span className="text-gray-500 block text-xs">Budget</span>
                        <strong>${selectedSubmission.budget?.amount?.toLocaleString() || 'TBD'}</strong>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <span className="text-gray-500 block text-xs">Accommodation</span>
                        <strong>{selectedSubmission.accommodationPreference}</strong>
                      </div>
                    </div>
                  </div>

                  {selectedSubmission.interests?.length ? (
                    <div>
                      <h4 className="font-semibold mb-3">Interests</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedSubmission.interests.map((interest) => (
                          <Badge key={interest} className="bg-amber-100 text-amber-800">{interest}</Badge>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  {selectedSubmission.specialRequests && (
                    <div>
                      <h4 className="font-semibold mb-2">Special Requests</h4>
                      <p className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700 whitespace-pre-wrap">{selectedSubmission.specialRequests}</p>
                    </div>
                  )}

                  <div className="space-y-3">
                    <h4 className="font-semibold flex items-center gap-2"><NotebookPen className="w-4 h-4 text-amber-500" />Concierge notes</h4>
                    <Input placeholder="Assigned concierge" value={assignedConcierge} onChange={(e) => setAssignedConcierge(e.target.value)} />
                    <Textarea placeholder="Internal notes" value={conciergeNotes} onChange={(e) => setConciergeNotes(e.target.value)} rows={4} />
                    <Button onClick={saveConciergeDetails} disabled={savingNotes}>
                      {savingNotes ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save notes'}
                    </Button>
                  </div>

                  {selectedSubmission.statusHistory?.length ? (
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2"><Clock className="w-4 h-4 text-amber-500" />Status timeline</h4>
                      <div className="space-y-2 max-h-52 overflow-y-auto">
                        {selectedSubmission.statusHistory.map((entry, idx) => (
                          <div key={`${entry.status}-${idx}`} className="p-3 rounded-lg border border-gray-100 bg-gray-50 text-sm">
                            <div className="flex items-center justify-between">
                              <Badge className={getStatusBadge(entry.status)}>{entry.status}</Badge>
                              <span className="text-xs text-gray-500">{entry.timestamp ? new Date(entry.timestamp).toLocaleString() : ''}</span>
                            </div>
                            {entry.note && <p className="text-gray-600 mt-1">{entry.note}</p>}
                            {entry.agent && <p className="text-xs text-gray-400 mt-1">By {entry.agent}</p>}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  <div className="border-t pt-4 space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {selectedSubmission.status === 'new' && (
                        <Button size="sm" className="bg-yellow-500" onClick={() => updateStatus(selectedSubmission.id!, 'contacted')}>
                          <Phone className="w-4 h-4 mr-1" /> Mark contacted
                        </Button>
                      )}
                      {selectedSubmission.status === 'contacted' && (
                        <Button size="sm" className="bg-purple-500" onClick={() => updateStatus(selectedSubmission.id!, 'quoted')}>
                          <DollarSign className="w-4 h-4 mr-1" /> Mark quoted
                        </Button>
                      )}
                      {selectedSubmission.status === 'quoted' && (
                        <Button size="sm" className="bg-green-500" onClick={() => updateStatus(selectedSubmission.id!, 'confirmed')}>
                          <CheckCircle className="w-4 h-4 mr-1" /> Mark confirmed
                        </Button>
                      )}
                      {selectedSubmission.status === 'confirmed' && (
                        <Button size="sm" className="bg-gray-500" onClick={() => updateStatus(selectedSubmission.id!, 'completed')}>
                          <CheckCircle className="w-4 h-4 mr-1" /> Mark completed
                        </Button>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button size="sm" className="bg-amber-500" onClick={sendConciergeEmail}>
                        <Send className="w-4 h-4 mr-1" /> Send concierge email
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => window.open(`https://wa.me/${selectedSubmission.phone?.replace(/[^0-9]/g, '')}`, '_blank')}>
                        <MessageCircle className="w-4 h-4 mr-1" /> WhatsApp
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => window.open(`mailto:${selectedSubmission.email}`, '_blank')}>
                        <Mail className="w-4 h-4 mr-1" /> Email
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-600 border-red-300" onClick={() => deleteSubmission(selectedSubmission.id!)}>
                        <Trash2 className="w-4 h-4 mr-1" /> Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-0 shadow-xl">
                <CardContent className="p-12 text-center text-gray-500">
                  <Eye className="w-12 h-12 mx-auto mb-4 opacity-40" />
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
