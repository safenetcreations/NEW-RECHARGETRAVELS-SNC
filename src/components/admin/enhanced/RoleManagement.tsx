import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useRoles, AppRole } from '@/hooks/useRoles';
import { Shield, UserPlus, Edit, Eye } from 'lucide-react';

const RoleManagement: React.FC = () => {
  const { userRole, canManageUsers, promoteUser } = useRoles();
  const { toast } = useToast();
  const [selectedEmail, setSelectedEmail] = useState('');
  const [selectedRole, setSelectedRole] = useState<AppRole | ''>('');
  const [isPromoting, setIsPromoting] = useState(false);

  const roles: { value: AppRole; label: string; description: string }[] = [
    { value: 'super_admin', label: 'Super Admin', description: 'Full system access' },
    { value: 'admin', label: 'Admin', description: 'Administrative access' },
    { value: 'editor', label: 'Editor', description: 'Content management' },
    { value: 'media_manager', label: 'Media Manager', description: 'Media library access' },
    { value: 'customer', label: 'Customer', description: 'Basic user access' }
  ];

  const handlePromoteUser = async () => {
    if (!selectedEmail || !selectedRole) {
      toast({
        title: "Missing Information",
        description: "Please provide both email and role.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsPromoting(true);
      await promoteUser(selectedEmail, selectedRole);
      
      toast({
        title: "User Promoted",
        description: `Successfully assigned ${selectedRole} role to ${selectedEmail}`,
      });
      
      setSelectedEmail('');
      setSelectedRole('');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to promote user. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsPromoting(false);
    }
  };

  if (!canManageUsers) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Access Denied
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            You don't have permission to manage user roles.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Role Management</h2>
          <p className="text-muted-foreground">
            Manage user roles and permissions across the system
          </p>
        </div>
        <Badge variant="outline" className="flex items-center gap-2">
          <Shield className="h-3 w-3" />
          Your Role: {userRole}
        </Badge>
      </div>

      {/* Promote User Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Promote User
          </CardTitle>
          <CardDescription>
            Assign roles to existing users by their email address
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="user-email">User Email</Label>
              <Input
                id="user-email"
                placeholder="user@example.com"
                value={selectedEmail}
                onChange={(e) => setSelectedEmail(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="role-select">Role</Label>
              <Select value={selectedRole} onValueChange={(value: AppRole) => setSelectedRole(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      <div className="flex flex-col">
                        <span className="font-medium">{role.label}</span>
                        <span className="text-xs text-muted-foreground">{role.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button 
                onClick={handlePromoteUser}
                disabled={isPromoting || !selectedEmail || !selectedRole}
                className="w-full"
              >
                {isPromoting ? 'Promoting...' : 'Promote User'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Role Definitions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Role Definitions
          </CardTitle>
          <CardDescription>
            Understanding permissions for each role level
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Role</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Permissions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roles.map((role) => (
                <TableRow key={role.value}>
                  <TableCell>
                    <Badge variant="outline">{role.label}</Badge>
                  </TableCell>
                  <TableCell>{role.description}</TableCell>
                  <TableCell>
                    <div className="text-sm text-muted-foreground">
                      {role.value === 'super_admin' && 'All permissions + user management'}
                      {role.value === 'admin' && 'Content, bookings, settings management'}
                      {role.value === 'editor' && 'Content creation and editing'}
                      {role.value === 'media_manager' && 'Media upload and organization'}
                      {role.value === 'customer' && 'Basic user access only'}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Security Notice */}
      <Card className="border-yellow-200 bg-yellow-50">
        <CardHeader>
          <CardTitle className="text-yellow-800">Security Notice</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-yellow-700 text-sm">
            Role changes take effect immediately. Only promote users you trust to higher privilege roles. 
            All role changes are logged in the audit system for security tracking.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default RoleManagement;