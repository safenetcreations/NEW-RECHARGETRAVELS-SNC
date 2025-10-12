import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Shield, UserCheck } from 'lucide-react';
import { getDocs, collection, query, where, addDoc, updateDoc, doc } from 'firebase/firestore';
import { db } from '@/services/firebaseService';

const FirstAdminSetup: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasAdmin, setHasAdmin] = useState<boolean | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    checkForExistingAdmin();
  }, []);

  const checkForExistingAdmin = async () => {
    try {
      const q = query(collection(db, 'admin_setup'), where('has_admin', '==', true));
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        // No admin exists, allow setup
        setHasAdmin(false);
      } else {
        setHasAdmin(true);
      }
    } catch (error) {
      console.error('Error checking for admin:', error);
      setHasAdmin(false);
    }
  };

  const promoteToAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    try {
      // Check if user exists
      const userQuery = query(collection(db, 'users'), where('email', '==', email.trim()));
      const userSnapshot = await getDocs(userQuery);
      
      if (userSnapshot.empty) {
        toast({
          title: "User not found",
          description: `No user found with email ${email}. Make sure they have signed up first.`,
          variant: "destructive",
        });
        return;
      }

      // Create admin setup record
      await addDoc(collection(db, 'admin_setup'), {
        has_admin: true,
        admin_email: email.trim(),
        created_at: new Date().toISOString()
      });

      // Update user role to admin
      const userDoc = userSnapshot.docs[0];
      await updateDoc(doc(db, 'users', userDoc.id), {
        role: 'admin',
        updated_at: new Date().toISOString()
      });

      toast({
        title: "Success!",
        description: `User ${email} has been promoted to admin.`,
      });
      setEmail('');
      setHasAdmin(true);
    } catch (error) {
      console.error('Error promoting user:', error);
      toast({
        title: "Error",
        description: "Failed to promote user to admin. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (hasAdmin === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Checking admin status...</p>
        </div>
      </div>
    );
  }

  if (hasAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <UserCheck className="w-6 h-6 text-green-600" />
            </div>
            <CardTitle className="text-green-800">Admin Already Exists</CardTitle>
            <CardDescription>
              An admin user has already been set up for this system.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button 
              onClick={() => window.location.href = '/login'}
              className="w-full"
            >
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
            <Shield className="w-6 h-6 text-orange-600" />
          </div>
          <CardTitle className="text-gray-900">Setup First Admin</CardTitle>
          <CardDescription>
            Create the first admin user for Recharge Travels. The user must already have a registered account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={promoteToAdmin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">User Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter registered user email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                Note: The user must have already signed up with this email address.
              </p>
            </div>
            <Button 
              type="submit" 
              className="w-full bg-orange-600 hover:bg-orange-700"
              disabled={loading}
            >
              {loading ? 'Promoting...' : 'Promote to Admin'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default FirstAdminSetup;