
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, FileText, Camera, Users, BarChart3, Mail, Settings } from 'lucide-react';
import { toast } from 'sonner';
import { useSecureAuth } from '@/hooks/useSecureAuth';
import { 
  validateTourData, 
  validateSiteData, 
  sanitizeTourData, 
  sanitizeSiteData,
  generateCSRFToken,
  validateCSRFToken,
  formRateLimiter
} from '@/utils/securityValidation';
import CulturalTourModal from './CulturalTourModal';
import CulturalSiteModal from './CulturalSiteModal';
import CulturalSettings from './CulturalSettings';
import './cultural-heritage.css';

const CulturalHeritage: React.FC = () => {
  const [activeSection, setActiveSection] = useState('tours');
  const [showTourModal, setShowTourModal] = useState(false);
  const [showSiteModal, setShowSiteModal] = useState(false);
  const [selectedTour, setSelectedTour] = useState(null);
  const [selectedSite, setSelectedSite] = useState(null);
  const [csrfToken, setCsrfToken] = useState('');

  const { isAdmin, logSecurityEvent, requirePermission } = useSecureAuth();

  // Initialize CSRF token
  useEffect(() => {
    setCsrfToken(generateCSRFToken());
  }, []);

  // Check admin permissions
  useEffect(() => {
    try {
      requirePermission('admin');
    } catch (error) {
      toast.error('Access denied: Admin privileges required');
      return;
    }
  }, [requirePermission]);

  // Tours Data
  const [tours, setTours] = useState([
    {
      id: 1,
      name: "The Cultural Triangle Classic",
      duration: "7 Days / 6 Nights",
      price: 750,
      highlights: [
        "Ascend the magnificent Sigiriya Rock Fortress",
        "Explore the sprawling ruins of Polonnaruwa",
        "Discover the Temple of the Tooth Relic in Kandy",
        "Scenic train journey through tea country"
      ]
    },
    {
      id: 2,
      name: "Sri Lanka's Living Heritage",
      duration: "10 Days / 9 Nights",
      price: 950,
      highlights: [
        "Authentic Hiriwadunna village tour",
        "Hands-on Batik making workshop",
        "Private cooking class with local families",
        "Remote Meemure village exploration"
      ]
    }
  ]);

  // Sites Data
  const [sites, setSites] = useState([
    {
      id: 1,
      name: "Sigiriya Rock Fortress",
      hours: "7:00 AM - 5:30 PM",
      price: "~$30 USD",
      duration: "3-4 hours",
      note: "Early morning visit recommended"
    },
    {
      id: 2,
      name: "Temple of the Tooth, Kandy",
      hours: "5:30 AM - 8:00 PM",
      price: "~$7 USD",
      duration: "1.5-2 hours",
      note: "Puja Times: 5:30 AM, 9:30 AM, 6:30 PM"
    }
  ]);

  const handleSaveTour = async (tourData: any, submittedCsrfToken: string) => {
    try {
      // Validate CSRF token
      if (!validateCSRFToken(submittedCsrfToken)) {
        toast.error('Security validation failed. Please refresh and try again.');
        return;
      }

      // Rate limiting check
      if (!formRateLimiter.canSubmit('tour_submission')) {
        toast.error('Too many submissions. Please wait a moment before trying again.');
        return;
      }

      // Validate input data
      const validation = validateTourData(tourData);
      if (!validation.isValid) {
        toast.error(`Validation failed: ${validation.errors.join(', ')}`);
        return;
      }

      // Sanitize data
      const sanitizedData = sanitizeTourData(tourData);

      if (selectedTour) {
        setTours(tours.map(tour => 
          tour.id === selectedTour.id ? { ...tour, ...sanitizedData } : tour
        ));
        await logSecurityEvent('tour_updated', 'tours', selectedTour.id.toString());
      } else {
        const newTour = { ...sanitizedData, id: Date.now() };
        setTours([...tours, newTour]);
        await logSecurityEvent('tour_created', 'tours', newTour.id.toString());
      }

      setShowTourModal(false);
      setSelectedTour(null);
      setCsrfToken(generateCSRFToken()); // Generate new token
      toast.success('Tour saved successfully');
    } catch (error) {
      console.error('Error saving tour:', error);
      toast.error('Failed to save tour');
    }
  };

  const handleSaveSite = async (siteData: any, submittedCsrfToken: string) => {
    try {
      // Validate CSRF token
      if (!validateCSRFToken(submittedCsrfToken)) {
        toast.error('Security validation failed. Please refresh and try again.');
        return;
      }

      // Rate limiting check
      if (!formRateLimiter.canSubmit('site_submission')) {
        toast.error('Too many submissions. Please wait a moment before trying again.');
        return;
      }

      // Validate input data
      const validation = validateSiteData(siteData);
      if (!validation.isValid) {
        toast.error(`Validation failed: ${validation.errors.join(', ')}`);
        return;
      }

      // Sanitize data
      const sanitizedData = sanitizeSiteData(siteData);

      if (selectedSite) {
        setSites(sites.map(site => 
          site.id === selectedSite.id ? { ...site, ...sanitizedData } : site
        ));
        await logSecurityEvent('site_updated', 'sites', selectedSite.id.toString());
      } else {
        const newSite = { ...sanitizedData, id: Date.now() };
        setSites([...sites, newSite]);
        await logSecurityEvent('site_created', 'sites', newSite.id.toString());
      }

      setShowSiteModal(false);
      setSelectedSite(null);
      setCsrfToken(generateCSRFToken()); // Generate new token
      toast.success('Site saved successfully');
    } catch (error) {
      console.error('Error saving site:', error);
      toast.error('Failed to save site');
    }
  };

  const handleEditTour = (tour: any) => {
    setSelectedTour(tour);
    setShowTourModal(true);
  };

  const handleEditSite = (site: any) => {
    setSelectedSite(site);
    setShowSiteModal(true);
  };

  const handleDeleteTour = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this tour?')) {
      setTours(tours.filter(tour => tour.id !== id));
      await logSecurityEvent('tour_deleted', 'tours', id.toString());
      toast.success('Tour deleted successfully');
    }
  };

  const handleDeleteSite = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this site?')) {
      setSites(sites.filter(site => site.id !== id));
      await logSecurityEvent('site_deleted', 'sites', id.toString());
      toast.success('Site deleted successfully');
    }
  };

  const handleAddNewTour = () => {
    setSelectedTour(null);
    setShowTourModal(true);
  };

  const handleAddNewSite = () => {
    setSelectedSite(null);
    setShowSiteModal(true);
  };

  // If not admin, show access denied
  if (!isAdmin()) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-bold text-red-600 mb-2">Access Denied</h2>
            <p>You don't have permission to access this admin panel.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const navigationItems = [
    { id: 'tours', label: 'Tour Packages', icon: FileText },
    { id: 'sites', label: 'Heritage Sites', icon: Camera },
    { id: 'bookings', label: 'Bookings', icon: BarChart3 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'emails', label: 'Email Templates', icon: Mail },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div className="cultural-admin">
      {/* Navigation */}
      <nav className="admin-nav">
        <div className="nav-container">
          {navigationItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`nav-item ${activeSection === item.id ? 'active' : ''}`}
            >
              <item.icon size={20} />
              {item.label}
            </button>
          ))}
        </div>
      </nav>

      <div className="admin-content">
        {/* Tours Section */}
        {activeSection === 'tours' && (
          <section className="admin-section active">
            <div className="section-header">
              <h2 className="section-title">Manage Tour Packages</h2>
              <Button onClick={handleAddNewTour} className="btn-primary">
                <Plus size={20} />
                Add New Tour
              </Button>
            </div>

            <div className="tours-grid">
              {tours.map(tour => (
                <Card key={tour.id} className="tour-card">
                  <CardContent className="p-6">
                    <div className="tour-header">
                      <h3 className="tour-name">{tour.name}</h3>
                      <p className="tour-meta">{tour.duration} - Starting from ${tour.price}</p>
                    </div>
                    
                    <div className="tour-highlights">
                      {tour.highlights.map((highlight, idx) => (
                        <div key={idx} className="highlight-item">
                          <span className="highlight-bullet">•</span>
                          {highlight}
                        </div>
                      ))}
                    </div>

                    <div className="tour-actions">
                      <Button 
                        onClick={() => handleEditTour(tour)}
                        variant="outline"
                        className="btn-edit"
                      >
                        Edit
                      </Button>
                      <Button 
                        onClick={() => handleDeleteTour(tour.id)}
                        variant="destructive"
                        className="btn-delete"
                      >
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Sites Section */}
        {activeSection === 'sites' && (
          <section className="admin-section active">
            <div className="section-header">
              <h2 className="section-title">Manage Heritage Sites</h2>
              <Button onClick={handleAddNewSite} className="btn-primary">
                <Plus size={20} />
                Add New Site
              </Button>
            </div>

            <div className="sites-grid">
              {sites.map(site => (
                <Card key={site.id} className="site-card">
                  <CardContent className="p-6">
                    <h3 className="site-name">{site.name}</h3>
                    <div className="site-details">
                      <p><span className="detail-label">Hours:</span> {site.hours}</p>
                      <p><span className="detail-label">Fee:</span> {site.price}</p>
                      <p><span className="detail-label">Duration:</span> {site.duration}</p>
                      {site.note && (
                        <p className="site-note">{site.note}</p>
                      )}
                    </div>
                    
                    <div className="site-actions">
                      <Button 
                        onClick={() => handleEditSite(site)}
                        variant="outline"
                        className="btn-edit"
                      >
                        Edit
                      </Button>
                      <Button 
                        onClick={() => handleDeleteSite(site.id)}
                        variant="destructive"
                        className="btn-delete"
                      >
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Placeholder sections for other navigation items */}
        {activeSection === 'bookings' && (
          <section className="admin-section active">
            <div className="section-header">
              <h2 className="section-title">Booking Management</h2>
            </div>
            <Card>
              <CardContent className="p-6">
                <p>Booking management functionality will be implemented here.</p>
              </CardContent>
            </Card>
          </section>
        )}

        {activeSection === 'users' && (
          <section className="admin-section active">
            <div className="section-header">
              <h2 className="section-title">User Management</h2>
            </div>
            <Card>
              <CardContent className="p-6">
                <p>User management functionality will be implemented here.</p>
              </CardContent>
            </Card>
          </section>
        )}

        {activeSection === 'emails' && (
          <section className="admin-section active">
            <div className="section-header">
              <h2 className="section-title">Email Templates</h2>
            </div>
            <Card>
              <CardContent className="p-6">
                <p>Email template management functionality will be implemented here.</p>
              </CardContent>
            </Card>
          </section>
        )}

        {activeSection === 'settings' && (
          <CulturalSettings onSave={() => console.log('Settings saved')} />
        )}
      </div>

      {/* Modals */}
      <CulturalTourModal
        isOpen={showTourModal}
        onClose={() => {
          setShowTourModal(false);
          setSelectedTour(null);
        }}
        onSave={handleSaveTour}
        tour={selectedTour}
        csrfToken={csrfToken}
      />

      <CulturalSiteModal
        isOpen={showSiteModal}
        onClose={() => {
          setShowSiteModal(false);
          setSelectedSite(null);
        }}
        onSave={handleSaveSite}
        site={selectedSite}
        csrfToken={csrfToken}
      />
    </div>
  );
};

export default CulturalHeritage;
