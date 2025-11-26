import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, ArrowRight, Settings, Users, FileText, Camera } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const AdminAccess = () => {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [redirecting, setRedirecting] = useState(false);

  const handleAccessAdmin = () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to access the admin panel",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }

    if (!isAdmin) {
      toast({
        title: "Access Denied",
        description: "You don't have administrator privileges",
        variant: "destructive"
      });
      return;
    }

    setRedirecting(true);
    navigate('/admin-panel');
  };

  const adminFeatures = [
    {
      icon: FileText,
      title: "Content Management",
      description: "Manage hotels, tours, activities, and cultural experiences"
    },
    {
      icon: Camera,
      title: "Media Management", 
      description: "Upload and organize photos for all your content"
    },
    {
      icon: Users,
      title: "User Management",
      description: "View and manage user accounts and bookings"
    },
    {
      icon: Settings,
      title: "System Settings",
      description: "Configure system-wide settings and preferences"
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Administrator Access
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Manage your Sri Lankan travel website content, users, and system settings
            </p>
          </div>

          {/* Status Card */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Access Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Authentication Status:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    user ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {user ? 'Signed In' : 'Not Signed In'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Admin Privileges:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    isAdmin ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {isAdmin ? 'Administrator' : 'Standard User'}
                  </span>
                </div>

                {user && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Email:</span>
                    <span className="text-sm text-muted-foreground">{user.email}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Admin Features */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Administrative Features</CardTitle>
              <CardDescription>
                Comprehensive tools for managing your travel website
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {adminFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 border rounded-lg">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <feature.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm">{feature.title}</h3>
                      <p className="text-xs text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="text-center space-y-4">
            {!user ? (
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Please sign in to access the admin panel
                </p>
                <div className="flex gap-4 justify-center">
                  <Button asChild>
                    <Link to="/login">Sign In</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link to="/signup">Create Account</Link>
                  </Button>
                </div>
              </div>
            ) : !isAdmin ? (
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Your account doesn't have administrator privileges. Contact your system administrator to request access.
                </p>
                <Button variant="outline" asChild>
                  <Link to="/">Return Home</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-green-600 font-medium">
                  ✓ You have administrator access
                </p>
                <Button 
                  onClick={handleAccessAdmin}
                  disabled={redirecting}
                  className="px-8"
                >
                  {redirecting ? (
                    "Redirecting..."
                  ) : (
                    <>
                      Access Admin Panel
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>

          {/* Setup Notice */}
          {!user && (
            <Card className="mt-8 border-amber-200 bg-amber-50">
              <CardHeader>
                <CardTitle className="text-amber-800 text-sm">First Time Setup</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-amber-700 text-sm">
                  If this is your first time setting up the admin system, you may need to promote your account to administrator status. 
                  Contact your developer or check the setup documentation.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AdminAccess;