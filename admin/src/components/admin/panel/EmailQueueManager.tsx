import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, limit, doc, updateDoc, deleteDoc, where, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import {
  Mail, Send, Clock, CheckCircle, XCircle, AlertCircle, RefreshCw,
  Search, Filter, Trash2, Eye, RotateCw, ChevronDown, Calendar,
  User, FileText, ArrowRight, BarChart3
} from 'lucide-react';

interface EmailQueueItem {
  id: string;
  to: string;
  subject?: string;
  template?: string;
  templateId?: string;
  status: 'pending' | 'sent' | 'failed';
  error?: string;
  createdAt: any;
  sentAt?: any;
  data?: any;
}

interface EmailStats {
  total: number;
  pending: number;
  sent: number;
  failed: number;
}

const EmailQueueManager: React.FC = () => {
  const [emails, setEmails] = useState<EmailQueueItem[]>([]);
  const [stats, setStats] = useState<EmailStats>({ total: 0, pending: 0, sent: 0, failed: 0 });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedEmail, setSelectedEmail] = useState<EmailQueueItem | null>(null);
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    fetchEmails();
  }, []);

  const fetchEmails = async () => {
    try {
      setLoading(true);
      const q = query(
        collection(db, 'emailQueue'),
        orderBy('createdAt', 'desc'),
        limit(100)
      );
      const snapshot = await getDocs(q);
      const emailsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as EmailQueueItem[];

      setEmails(emailsData);

      // Calculate stats
      const pending = emailsData.filter(e => e.status === 'pending').length;
      const sent = emailsData.filter(e => e.status === 'sent').length;
      const failed = emailsData.filter(e => e.status === 'failed').length;

      setStats({
        total: emailsData.length,
        pending,
        sent,
        failed
      });
    } catch (error) {
      console.error('Error fetching emails:', error);
    } finally {
      setLoading(false);
    }
  };

  const retryEmail = async (emailId: string) => {
    try {
      setProcessing(emailId);
      await updateDoc(doc(db, 'emailQueue', emailId), {
        status: 'pending',
        error: null,
        retryAt: Timestamp.now()
      });
      await fetchEmails();
    } catch (error) {
      console.error('Error retrying email:', error);
    } finally {
      setProcessing(null);
    }
  };

  const deleteEmail = async (emailId: string) => {
    if (!confirm('Are you sure you want to delete this email?')) return;
    try {
      setProcessing(emailId);
      await deleteDoc(doc(db, 'emailQueue', emailId));
      await fetchEmails();
    } catch (error) {
      console.error('Error deleting email:', error);
    } finally {
      setProcessing(null);
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp?.toDate) return 'N/A';
    return timestamp.toDate().toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'sent':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
            <CheckCircle className="w-3 h-3" /> Sent
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
            <Clock className="w-3 h-3" /> Pending
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
            <XCircle className="w-3 h-3" /> Failed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
            {status}
          </span>
        );
    }
  };

  const filteredEmails = emails.filter(email => {
    const matchesSearch = 
      email.to?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.template?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || email.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <Mail className="w-7 h-7 text-pink-600" />
            Email Queue Manager
          </h1>
          <p className="text-gray-500">Monitor and manage email delivery queue</p>
        </div>
        <button
          onClick={fetchEmails}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-pink-50 text-pink-700 rounded-lg hover:bg-pink-100 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <Mail className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-xs text-gray-500">Total Emails</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
              <p className="text-xs text-gray-500">Pending</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.sent}</p>
              <p className="text-xs text-gray-500">Sent</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.failed}</p>
              <p className="text-xs text-gray-500">Failed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by email, subject, or template..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="sent">Sent</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      {/* Email List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Recipient</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Template</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Created</th>
                <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <RefreshCw className="w-8 h-8 text-gray-300 animate-spin mx-auto mb-3" />
                    <p className="text-gray-500">Loading emails...</p>
                  </td>
                </tr>
              ) : filteredEmails.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <Mail className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No emails found</p>
                  </td>
                </tr>
              ) : (
                filteredEmails.map((email) => (
                  <tr key={email.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-pink-50 rounded-lg flex items-center justify-center">
                          <User className="w-4 h-4 text-pink-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{email.to}</p>
                          {email.subject && (
                            <p className="text-xs text-gray-500 truncate max-w-[200px]">{email.subject}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">
                        {email.template || email.templateId || 'Custom'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(email.status)}
                      {email.error && (
                        <p className="text-xs text-red-500 mt-1 truncate max-w-[150px]" title={email.error}>
                          {email.error}
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600">{formatDate(email.createdAt)}</p>
                      {email.sentAt && (
                        <p className="text-xs text-gray-400">Sent: {formatDate(email.sentAt)}</p>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedEmail(email)}
                          className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {email.status === 'failed' && (
                          <button
                            onClick={() => retryEmail(email.id)}
                            disabled={processing === email.id}
                            className="p-2 rounded-lg hover:bg-amber-100 text-amber-600 transition-colors"
                            title="Retry"
                          >
                            <RotateCw className={`w-4 h-4 ${processing === email.id ? 'animate-spin' : ''}`} />
                          </button>
                        )}
                        <button
                          onClick={() => deleteEmail(email.id)}
                          disabled={processing === email.id}
                          className="p-2 rounded-lg hover:bg-red-100 text-red-600 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Email Detail Modal */}
      {selectedEmail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Email Details</h3>
              <button
                onClick={() => setSelectedEmail(null)}
                className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"
              >
                ×
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[60vh] space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Recipient</p>
                  <p className="font-medium text-gray-900">{selectedEmail.to}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  {getStatusBadge(selectedEmail.status)}
                </div>
                <div>
                  <p className="text-sm text-gray-500">Template</p>
                  <p className="font-medium text-gray-900">{selectedEmail.template || selectedEmail.templateId || 'Custom'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Created</p>
                  <p className="font-medium text-gray-900">{formatDate(selectedEmail.createdAt)}</p>
                </div>
              </div>

              {selectedEmail.subject && (
                <div>
                  <p className="text-sm text-gray-500">Subject</p>
                  <p className="font-medium text-gray-900">{selectedEmail.subject}</p>
                </div>
              )}

              {selectedEmail.error && (
                <div className="bg-red-50 rounded-lg p-4">
                  <p className="text-sm font-medium text-red-700">Error</p>
                  <p className="text-sm text-red-600">{selectedEmail.error}</p>
                </div>
              )}

              {selectedEmail.data && (
                <div>
                  <p className="text-sm text-gray-500 mb-2">Template Data</p>
                  <pre className="bg-gray-50 rounded-lg p-4 text-xs overflow-x-auto">
                    {JSON.stringify(selectedEmail.data, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailQueueManager;
