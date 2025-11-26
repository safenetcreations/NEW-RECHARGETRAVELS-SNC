import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Search, Edit, Trash2, Eye, Send, Mail } from 'lucide-react';

const EmailTemplatesSection: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const mockTemplates = [
    {
      id: '1',
      name: 'booking_confirmation',
      subject: 'Booking Confirmation - {{booking_id}}',
      category: 'booking',
      variables: ['customer_name', 'booking_id', 'total_amount', 'booking_date'],
      is_active: true,
      updated_at: '2024-01-15',
      last_sent: '2024-01-15 14:30'
    },
    {
      id: '2',
      name: 'welcome_email',
      subject: 'Welcome to Recharge Travels!',
      category: 'user',
      variables: ['customer_name'],
      is_active: true,
      updated_at: '2024-01-10',
      last_sent: '2024-01-14 09:15'
    },
    {
      id: '3',
      name: 'booking_reminder',
      subject: 'Upcoming Trip Reminder - {{tour_name}}',
      category: 'booking',
      variables: ['customer_name', 'tour_name', 'start_date', 'meeting_point'],
      is_active: false,
      updated_at: '2024-01-08',
      last_sent: null
    },
    {
      id: '4',
      name: 'password_reset',
      subject: 'Reset Your Password - Recharge Travels',
      category: 'auth',
      variables: ['customer_name', 'reset_link', 'expiry_time'],
      is_active: true,
      updated_at: '2024-01-12',
      last_sent: '2024-01-13 16:45'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Templates', count: 4 },
    { id: 'booking', name: 'Booking', count: 2 },
    { id: 'user', name: 'User', count: 1 },
    { id: 'auth', name: 'Authentication', count: 1 }
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'booking': return 'bg-blue-100 text-blue-800';
      case 'user': return 'bg-green-100 text-green-800';
      case 'auth': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Email Templates</h2>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Create Template
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
            >
              {category.name}
              <Badge variant="secondary" className="text-xs ml-1">
                {category.count}
              </Badge>
            </Button>
          ))}
        </div>
      </div>

      <div className="grid gap-4">
        {mockTemplates.map((template) => (
          <Card key={template.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <Badge className={getCategoryColor(template.category)}>
                      {template.category}
                    </Badge>
                    {template.is_active ? (
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                    ) : (
                      <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground font-mono">
                    {template.subject}
                  </p>
                </div>
                <Mail className="w-5 h-5 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {/* Variables */}
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">Variables:</p>
                  <div className="flex flex-wrap gap-1">
                    {template.variables.map((variable) => (
                      <Badge key={variable} variant="outline" className="text-xs font-mono">
                        {`{{${variable}}}`}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Metadata and Actions */}
                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="text-sm text-muted-foreground">
                    <span>Updated {template.updated_at}</span>
                    {template.last_sent && (
                      <span className="ml-4">Last sent: {template.last_sent}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" title="Preview">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" title="Test Send">
                      <Send className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" title="Edit">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-destructive" title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Mail className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">1,247</p>
                <p className="text-sm text-muted-foreground">Emails sent this month</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Eye className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">87.3%</p>
                <p className="text-sm text-muted-foreground">Average open rate</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Send className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">92.1%</p>
                <p className="text-sm text-muted-foreground">Delivery rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmailTemplatesSection;