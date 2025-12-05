import { useState, useEffect, ComponentType, lazy, Suspense, memo } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
const YaluFloatingButton = lazy(() => import('@/components/YaluFloatingButton'));
const WhatsAppFloatingButton = lazy(() => import('@/components/WhatsAppFloatingButton'));

import PageTransition from '@/components/PageTransition';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { LoadingProvider } from '@/contexts/LoadingContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { DeviceProvider } from '@/contexts/DeviceContext';
import ScrollToTop from '@/components/ScrollToTop';
import GoogleAnalytics from '@/components/analytics/GoogleAnalytics';
import { B2BAuthProvider } from '@/contexts/B2BAuthContext';
import { CurrencyProvider } from '@/contexts/CurrencyContext';
import { OptimizedSuspense, PageSkeleton } from '@/components/OptimizedSuspense';
import { prefetchCommonRoutes } from '@/utils/routePrefetch';

// Security Components
import ContentProtection from '@/components/security/ContentProtection';
const CookieConsentEnhanced = lazy(() => import('@/components/security/CookieConsentEnhanced'));

// Legal Pages
const PrivacyPolicy = lazy(() => import('@/pages/legal/PrivacyPolicy'));
const CookiePolicy = lazy(() => import('@/pages/legal/CookiePolicy'));
const TermsOfService = lazy(() => import('@/pages/legal/TermsOfService'));

// CRITICAL: Index page loads directly for instant homepage
import Index from '@/pages/Index';
const CulturalTours = lazy(() => import('@/pages/CulturalTours'));
const WildTours = lazy(() => import('@/pages/WildTours'));
const WildTourDetail = lazy(() => import('@/pages/WildTourDetail'));
const NationalParksTours = lazy(() => import('@/pages/tours/NationalParksTours'));
const ParkLandingPage = lazy(() => import('@/components/wildTours/ParkLandingPage'));
const LuxurySafari = lazy(() => import('@/pages/LuxurySafari'));
const Blog = lazy(() => import('@/pages/Blog'));
const BlogPost = lazy(() => import('@/pages/BlogPost'));
const AboutSriLanka = lazy(() => import('@/pages/AboutSriLanka'));
const AboutRechargeTravel = lazy(() => import('@/pages/AboutRechargeTravel'));
const AboutSocial = lazy(() => import('@/pages/AboutSocial'));
const Contact = lazy(() => import('@/pages/Contact'));
const NotFound = lazy(() => import('@/pages/NotFound'));
const FAQ = lazy(() => import('@/pages/FAQ'));
const TourismNews = lazy(() => import('@/pages/TourismNews'));
const Photography = lazy(() => import('@/pages/Photography'));
const RamayanaTrail = lazy(() => import('@/pages/RamayanaTrail'));
const RamayanaTrailTour = lazy(() => import('@/pages/RamayanaTrailTour'));
const AyurvedaWellnessTour = lazy(() => import('@/pages/AyurvedaWellnessTour'));
const Ecotourism = lazy(() => import('@/pages/Ecotourism'));
const BeachTours = lazy(() => import('@/pages/BeachTours'));
const HillCountry = lazy(() => import('@/pages/HillCountry'));
const CulinaryTours = lazy(() => import('@/pages/CulinaryTours'));
const Honeymoon = lazy(() => import('@/pages/Honeymoon'));
const HoneymoonsWeddings = lazy(() => import('@/pages/romance/HoneymoonsWeddings'));
const WellnessPackages = lazy(() => import('@/pages/WellnessPackages'));
const JoinUsDrivers = lazy(() => import('@/pages/JoinUsDrivers'));
const DriversDirectory = lazy(() => import('@/pages/DriversDirectory'));
const DriverPublicProfile = lazy(() => import('@/pages/DriverPublicProfile'));
const LuxuryTours = lazy(() => import('@/pages/LuxuryTours'));
const TransportLanding = lazy(() => import('@/pages/Transport'));
const FamilyActivities = lazy(() => import('@/pages/FamilyActivities'));
const ScenicLanding = lazy(() => import('@/pages/Scenic'));
const LuxuryLanding = lazy(() => import('@/pages/LuxuryLanding'));
const Colombo = lazy(() => import('@/pages/destinations/Colombo'));
const Kandy = lazy(() => import('@/pages/destinations/Kandy'));
const Galle = lazy(() => import('@/pages/destinations/Galle'));
const Sigiriya = lazy(() => import('@/pages/destinations/Sigiriya'));
const Ella = lazy(() => import('@/pages/destinations/Ella'));
const Jaffna = lazy(() => import('@/pages/destinations/Jaffna'));
const DelftIsland = lazy(() => import('@/pages/destinations/DelftIsland'));
const Mullaitivu = lazy(() => import('@/pages/destinations/Mullaitivu'));
const Hatton = lazy(() => import('@/pages/destinations/Hatton'));
const NuwaraEliya = lazy(() => import('@/pages/destinations/NuwaraEliya'));
const Trincomalee = lazy(() => import('@/pages/destinations/Trincomalee'));
const ArugamBay = lazy(() => import('@/pages/destinations/ArugamBay'));
const Mirissa = lazy(() => import('@/pages/destinations/Mirissa'));
const Weligama = lazy(() => import('@/pages/destinations/Weligama'));
const Bentota = lazy(() => import('@/pages/destinations/Bentota'));
const Dambulla = lazy(() => import('@/pages/destinations/Dambulla'));
const Hikkaduwa = lazy(() => import('@/pages/destinations/Hikkaduwa'));
const Mannar = lazy(() => import('@/pages/destinations/Mannar'));
const Polonnaruwa = lazy(() => import('@/pages/destinations/Polonnaruwa'));
const Anuradhapura = lazy(() => import('@/pages/destinations/Anuradhapura'));
const Kalpitiya = lazy(() => import('@/pages/destinations/Kalpitiya'));
const AdamsPeak = lazy(() => import('@/pages/destinations/AdamsPeak'));
const Wadduwa = lazy(() => import('@/pages/destinations/Wadduwa'));
const Matara = lazy(() => import('@/pages/destinations/Matara'));
const Tangalle = lazy(() => import('@/pages/destinations/Tangalle'));
const Negombo = lazy(() => import('@/pages/destinations/Negombo'));
const Badulla = lazy(() => import('@/pages/destinations/Badulla'));
const Ratnapura = lazy(() => import('@/pages/destinations/Ratnapura'));
const Puttalam = lazy(() => import('@/pages/destinations/Puttalam'));
const Hambantota = lazy(() => import('@/pages/destinations/Hambantota'));
const Vavuniya = lazy(() => import('@/pages/destinations/Vavuniya'));
const Kurunegala = lazy(() => import('@/pages/destinations/Kurunegala'));
const Batticaloa = lazy(() => import('@/pages/destinations/Batticaloa'));
const Kilinochchi = lazy(() => import('@/pages/destinations/Kilinochchi'));
const TourBookingPage = lazy(() => import('@/pages/TourBookingPage'));
const DestinationDetail = lazy(() => import('@/pages/destinations/DestinationDetail'));
const Destinations = lazy(() => import('@/pages/Destinations'));
const AirportTransfers = lazy(() => import('@/pages/transport/AirportTransfers'));
const PrivateTours = lazy(() => import('@/pages/transport/PrivateTours'));
const GroupTransport = lazy(() => import('@/pages/transport/GroupTransport'));
const TrainBooking = lazy(() => import('@/pages/TrainBooking'));
const RestaurantGuide = lazy(() => import('@/pages/RestaurantGuide'));
const WaterfallGuide = lazy(() => import('@/pages/WaterfallGuide'));
const DriverGuideServices = lazy(() => import('@/pages/DriverGuideServices'));
const DriverGuideProfile = lazy(() => import('@/pages/DriverGuideProfile'));
const WalletTransactions = lazy(() => import('@/pages/WalletTransactions'));
const AdminLogin = lazy(() => import('@/pages/AdminLogin'));
const CustomTripRequestsAdmin = lazy(() => import('@/pages/admin/CustomTripRequests'));
const DriverDashboard = lazy(() => import('@/pages/DriverDashboard'));

// Redirect component for admin panel
const AdminRedirect = () => {
  useEffect(() => {
    window.location.href = 'https://recharge-travels-admin.web.app';
  }, []);
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
        <p className="text-xl font-semibold text-gray-700">Redirecting to Admin Panel...</p>
      </div>
    </div>
  );
};

const HeroImageUpload = lazy(() => import('@/pages/HeroImageUpload'));
const SeedData = lazy(() => import('@/pages/SeedData'));
const BookingConfirmation = lazy(() => import('@/pages/BookingConfirmation'));
const TravelGuide = lazy(() => import('@/pages/TravelGuide'));
const Tours = lazy(() => import('@/pages/Tours'));
const TripAdvisorTours = lazy(() => import('@/pages/TripAdvisorTours'));
const Signup = lazy(() => import('@/pages/Signup'));
const TrainJourneys = lazy(() => import('@/pages/experiences/TrainJourneys'));
const TeaTrails = lazy(() => import('@/pages/experiences/TeaTrails'));
const PilgrimageTours = lazy(() => import('@/pages/experiences/PilgrimageTours'));
const IslandGetaways = lazy(() => import('@/pages/experiences/IslandGetaways'));
const Waterfalls = lazy(() => import('@/pages/experiences/Waterfalls'));
const WhaleBookingPage = lazy(() => import('@/pages/booking/WhaleBooking'));
const SeaCucumberFarming = lazy(() => import('@/pages/experiences/SeaCucumberFarming'));
const PrivateCharters = lazy(() => import('@/pages/experiences/PrivateCharters'));
const HikkaduwaWaterSports = lazy(() => import('@/pages/experiences/HikkaduwaWaterSports'));
const HotAirBalloonSigiriya = lazy(() => import('@/pages/experiences/HotAirBalloonSigiriya'));
const KalpitiyaKiteSurfing = lazy(() => import('@/pages/experiences/KalpitiyaKiteSurfing'));
const JungleCamping = lazy(() => import('@/pages/experiences/JungleCamping'));
const LagoonSafari = lazy(() => import('@/pages/experiences/LagoonSafari'));
const CookingClass = lazy(() => import('@/pages/experiences/CookingClass'));
const AyurvedaWellness = lazy(() => import('@/pages/experiences/AyurvedaWellness'));
const AyurvedaBooking = lazy(() => import('@/pages/booking/AyurvedaBooking'));
const RomanceBooking = lazy(() => import('@/pages/booking/RomanceBooking'));
const TeaTrailsBooking = lazy(() => import('@/pages/booking/TeaTrailsBooking'));
const PilgrimageBooking = lazy(() => import('@/pages/booking/PilgrimageBooking'));
const ExperienceBooking = lazy(() => import('@/pages/booking/ExperienceBooking'));
const ConciergeBooking = lazy(() => import('@/pages/booking/ConciergeBooking'));
const TrainBookingConfirmation = lazy(() => import('@/pages/booking/TrainBookingConfirmation'));
const LuxuryExperiences = lazy(() => import('@/pages/LuxuryExperiences'));
const LuxuryExperienceDetail = lazy(() => import('@/pages/LuxuryExperienceDetail'));
const CustomExperience = lazy(() => import('@/pages/CustomExperience'));

// Luxury Experience Pages
const HelicopterCharters = lazy(() => import('@/pages/experiences/luxury/HelicopterCharters'));
const PrivateYachts = lazy(() => import('@/pages/experiences/luxury/PrivateYachts'));
const PrivateJets = lazy(() => import('@/pages/experiences/luxury/PrivateJets'));
const ExclusiveVillas = lazy(() => import('@/pages/experiences/luxury/ExclusiveVillas'));
const LuxuryVehicles = lazy(() => import('@/pages/experiences/luxury/LuxuryVehicles'));
const LuxuryHotels = lazy(() => import('@/pages/experiences/luxury/LuxuryHotels'));
const LuxuryApartments = lazy(() => import('@/pages/experiences/luxury/LuxuryApartments'));
const LuxuryHouses = lazy(() => import('@/pages/experiences/luxury/LuxuryHouses'));
// DreamJourneys loaded directly to prevent animation flicker
import DreamJourneys from '@/pages/experiences/luxury/DreamJourneys';
const VIPConcierge = lazy(() => import('@/pages/experiences/luxury/VIPConcierge'));
const ExclusiveAccess = lazy(() => import('@/pages/experiences/luxury/ExclusiveAccess'));

// Family Activities
const FamilyTrainJourneys = lazy(() => import('@/pages/family-activities/FamilyTrainJourneys'));
const SigiriyaFamilyAdventure = lazy(() => import('@/pages/family-activities/SigiriyaFamilyAdventure'));
const PolonnaruwaFamilyCycling = lazy(() => import('@/pages/family-activities/PolonnaruwaFamilyCycling'));
const UdawalaweElephantSafari = lazy(() => import('@/pages/family-activities/UdawalaweElephantSafari'));
const PinnawalaFamilyExperience = lazy(() => import('@/pages/family-activities/PinnawalaFamilyExperience'));
const KosgodaTurtleHatchery = lazy(() => import('@/pages/family-activities/KosgodaTurtleHatchery'));
const GalleFortFamilyWalk = lazy(() => import('@/pages/family-activities/GalleFortFamilyWalk'));
const SriLankaMaskWorkshop = lazy(() => import('@/pages/family-activities/SriLankaMaskWorkshop'));
const PearlBayWaterPark = lazy(() => import('@/pages/family-activities/PearlBayWaterPark'));
const NuwaraEliyaFamilyOuting = lazy(() => import('@/pages/family-activities/NuwaraEliyaFamilyOuting'));

// Scenic Destinations
const BambarakandaFalls = lazy(() => import('@/pages/scenic/BambarakandaFalls'));
const ArugamBayBeach = lazy(() => import('@/pages/scenic/ArugamBayBeach'));
const HaputaleViewpoint = lazy(() => import('@/pages/scenic/HaputaleViewpoint'));
const DiyalumaFalls = lazy(() => import('@/pages/scenic/DiyalumaFalls'));
const EllaRock = lazy(() => import('@/pages/scenic/EllaRock'));
const GregoryLake = lazy(() => import('@/pages/scenic/GregoryLake'));
const PidurangalaRock = lazy(() => import('@/pages/scenic/PidurangalaRock'));
const Belihuloya = lazy(() => import('@/pages/scenic/BelihuloyaRiver'));
const RavanaFalls = lazy(() => import('@/pages/scenic/RavanaFalls'));
const NineArchBridge = lazy(() => import('@/pages/scenic/NineArchBridge'));
const Hotels = lazy(() => import('@/pages/Hotels'));
const ListProperty = lazy(() => import('@/pages/hotels/ListProperty'));
const HotelDetail = lazy(() => import('@/pages/HotelDetail'));
const ContentUpdater = lazy(() => import('@/pages/ContentUpdater'));
const BookNow = lazy(() => import('@/pages/BookNow'));
const AITripPlanner = lazy(() => import('@/pages/AITripPlanner'));
const DynamicPage = lazy(() => import('@/pages/DynamicPage'));
const SearchResults = lazy(() => import('@/pages/SearchResults'));

// Vehicle Rental Pages
const VehicleRental = lazy(() => import('@/pages/vehicle-rental/VehicleRental'));
const VehicleBrowse = lazy(() => import('@/pages/vehicle-rental/VehicleBrowse'));
const VehicleRentalDetail = lazy(() => import('@/pages/vehicle-rental/VehicleDetail'));
const VehicleBooking = lazy(() => import('@/pages/vehicle-rental/VehicleBooking'));
const VehicleBookingConfirmation = lazy(() => import('@/pages/vehicle-rental/VehicleBookingConfirmation'));
const VehicleAvailabilityCalendar = lazy(() => import('@/pages/vehicle-rental/VehicleAvailabilityCalendar'));
const OwnerDashboard = lazy(() => import('@/pages/vehicle-rental/OwnerDashboard'));
const OwnerRegister = lazy(() => import('@/pages/vehicle-rental/OwnerRegister'));
const OwnerLanding = lazy(() => import('@/pages/vehicle-rental/OwnerLanding'));
const OwnerDocuments = lazy(() => import('@/pages/vehicle-rental/OwnerDocuments'));
const MyBookings = lazy(() => import('@/pages/vehicle-rental/MyBookings'));
const ListVehicle = lazy(() => import('@/pages/vehicle-rental/ListVehicle'));

// Fleet Vehicles (Our Own Fleet at /vehicles)
const FleetVehicles = lazy(() => import('@/pages/Vehicles'));
const FleetVehiclesByCategory = lazy(() => import('@/pages/VehiclesByCategory'));
const FleetVehicleDetail = lazy(() => import('@/pages/VehicleDetail'));

// Phase 2: Payment & Payout System
const VehiclePayment = lazy(() => import('@/pages/vehicle-rental/VehiclePayment'));
const OwnerPayouts = lazy(() => import('@/pages/vehicle-rental/OwnerPayouts'));
const VehicleInvoice = lazy(() => import('@/pages/vehicle-rental/VehicleInvoice'));
const SecurityDepositManagement = lazy(() => import('@/pages/vehicle-rental/SecurityDepositManagement'));

// Phase 3: Communication & Notifications
const VehicleChat = lazy(() => import('@/pages/vehicle-rental/VehicleChat'));
const NotificationCenter = lazy(() => import('@/pages/vehicle-rental/NotificationCenter'));
const VehicleNotificationPreferences = lazy(() => import('@/pages/vehicle-rental/VehicleNotificationPreferences'));

// Phase 4: Reviews & Rating System
const VehicleReviewSubmit = lazy(() => import('@/pages/vehicle-rental/VehicleReviewSubmit'));
const OwnerReviewResponses = lazy(() => import('@/pages/vehicle-rental/OwnerReviewResponses'));
const AdminReviewManagement = lazy(() => import('@/pages/admin/AdminReviewManagement'));
const AyurvedaAdmin = lazy(() => import('@/pages/admin/AyurvedaAdmin'));
const WellnessAdmin = lazy(() => import('@/pages/admin/WellnessAdmin'));
const RomanceAdmin = lazy(() => import('@/pages/admin/RomanceAdmin'));
const CustomExperienceAdmin = lazy(() => import('@/pages/admin/CustomExperienceAdmin'));
const GlobalToursAdmin = lazy(() => import('@/pages/admin/GlobalToursAdmin'));
const BeachToursAdmin = lazy(() => import('./pages/admin/BeachToursAdmin'));
const TourDetail = lazy(() => import('./pages/TourDetail'));

// Global Tours Pages
const GlobalToursListing = lazy(() => import('@/pages/tours/GlobalToursListing'));
const GlobalTourPage = lazy(() => import('@/pages/tours/GlobalTourPage'));

// Phase 5: Analytics & Reporting Dashboard
const OwnerAnalytics = lazy(() => import('@/pages/vehicle-rental/OwnerAnalytics'));
const VehiclePerformance = lazy(() => import('@/pages/vehicle-rental/VehiclePerformance'));
const EarningsReports = lazy(() => import('@/pages/vehicle-rental/EarningsReports'));
const BookingAnalytics = lazy(() => import('@/pages/vehicle-rental/BookingAnalytics'));

// Vehicle Rental Admin Pages
const VehicleApproval = lazy(() => import('@/pages/admin/vehicle-rental/VehicleApproval'));
const OwnerApproval = lazy(() => import('@/pages/admin/vehicle-rental/OwnerApproval'));

// Vendor Platform
const VendorRegistration = lazy(() => import('@/pages/vendor/VendorRegistration'));
const VendorDashboard = lazy(() => import('@/pages/vendor/VendorDashboard'));

// B2B Portal Pages
const B2BPortal = lazy(() => import('@/pages/b2b/B2BPortal'));
const B2BLogin = lazy(() => import('@/pages/b2b/B2BLogin'));
const B2BRegister = lazy(() => import('@/pages/b2b/B2BRegister'));
const B2BDashboard = lazy(() => import('@/pages/b2b/B2BDashboard'));
const B2BTours = lazy(() => import('@/pages/b2b/B2BTours'));
const B2BBookingForm = lazy(() => import('@/pages/b2b/B2BBookingForm'));
const B2BMyBookings = lazy(() => import('@/pages/b2b/B2BMyBookings'));

// B2B Admin Pages
const B2BAdminDashboard = lazy(() => import('@/pages/b2b/admin/B2BAdminDashboard'));
const B2BAgencyManagement = lazy(() => import('@/pages/b2b/admin/B2BAgencyManagement'));
const B2BTourManagement = lazy(() => import('@/pages/b2b/admin/B2BTourManagement'));
const B2BBookingsAdmin = lazy(() => import('@/pages/b2b/admin/B2BBookingsAdmin'));
const B2BAnalytics = lazy(() => import('@/pages/b2b/admin/B2BAnalytics'));

import './App.css';

const withSiteChrome = (Component: ComponentType<any>) => (
  <>
    <Header />
    <Component />
    <Footer />
  </>
)

// Component to handle routing - DreamJourneys gets NO animation
const AppRoutes = () => {
  const location = useLocation();
  const isDreamJourneys = location.pathname === '/experiences/luxury/dream-journeys';

  // Dream Journeys renders directly without any animation wrapper
  if (isDreamJourneys) {
    return <DreamJourneys />;
  }

  // All other routes use PageTransition
  return (
    <PageTransition>
      <OptimizedSuspense variant="page">
        <AllRoutes />
      </OptimizedSuspense>
    </PageTransition>
  );
};

// All routes component
const AllRoutes = () => (
  <Routes>
    {/* Homepage loads instantly - no lazy loading */}
    <Route path="/" element={<Index />} />
    <Route path="/tours" element={withSiteChrome(Tours)} />
    <Route path="/tours/tripadvisor" element={withSiteChrome(TripAdvisorTours)} />
    <Route path="/tours/cultural" element={<CulturalTours />} />
    <Route path="/tours/wildtours" element={<WildTours />} />
    <Route path="/tours/wildtours/:id" element={<WildTourDetail />} />
    <Route path="/wildtours" element={<WildTours />} /> {/* Alias route */}
    <Route path="/tours/wildtours/parks" element={<NationalParksTours />} />
    <Route path="/wildtours/parks" element={<NationalParksTours />} /> {/* Alias route */}
    <Route path="/tours/wildtours/parks/:slug" element={<ParkLandingPage />} />
    <Route path="/wildtours/parks/:slug" element={<ParkLandingPage />} /> {/* Alias route */}
    <Route path="/tours/photography" element={<Photography />} />
    <Route path="/tours/ramayana-trail" element={<RamayanaTrail />} />
    <Route path="/tours/ecotourism" element={<Ecotourism />} />
    <Route path="/tours/beach-tours" element={<BeachTours />} />
    <Route path="/tours/beach-tours/:id" element={<TourDetail />} />
    <Route path="/admin/beach-tours" element={<BeachToursAdmin />} />
    <Route path="/tours/hill-country" element={<HillCountry />} />
    <Route path="/tours/culinary" element={<CulinaryTours />} />
    <Route path="/tours/luxury-safari" element={<LuxurySafari />} />
    <Route path="/tours/honeymoon" element={<Honeymoon />} />
    <Route path="/romance/honeymoons-weddings" element={withSiteChrome(HoneymoonsWeddings)} />
    <Route path="/tours/luxury" element={<LuxuryTours />} />
    <Route path="/tours/global" element={<GlobalToursListing />} />
    <Route path="/tours/global/:slug" element={<GlobalTourPage />} />
    <Route path="/tours/restaurants" element={withSiteChrome(RestaurantGuide)} />
    <Route path="/tours/waterfalls" element={withSiteChrome(WaterfallGuide)} />
    <Route path="/tours/driver-guide" element={withSiteChrome(DriverGuideServices)} />
    <Route path="/tours/driver-guide/:slug" element={withSiteChrome(DriverGuideProfile)} />
    <Route path="/destinations" element={<Destinations />} />
    <Route path="/destinations/colombo" element={<Colombo />} />
    <Route path="/destinations/kandy" element={<Kandy />} />
    <Route path="/destinations/galle" element={<Galle />} />
    <Route path="/destinations/sigiriya" element={<Sigiriya />} />
    <Route path="/destinations/ella" element={<Ella />} />
    <Route path="/destinations/jaffna" element={<Jaffna />} />
    <Route path="/destinations/delft-island" element={<DelftIsland />} />
    <Route path="/destinations/mullaitivu" element={<Mullaitivu />} />
    <Route path="/destinations/hatton" element={<Hatton />} />
    <Route path="/destinations/nuwaraeliya" element={withSiteChrome(NuwaraEliya)} />
    <Route path="/destinations/trincomalee" element={<Trincomalee />} />
    <Route path="/destinations/arugam-bay" element={<ArugamBay />} />
    <Route path="/destinations/mirissa" element={<Mirissa />} />
    <Route path="/destinations/weligama" element={withSiteChrome(Weligama)} />
    <Route path="/destinations/bentota" element={withSiteChrome(Bentota)} />
    <Route path="/destinations/dambulla" element={withSiteChrome(Dambulla)} />
    <Route path="/destinations/hikkaduwa" element={withSiteChrome(Hikkaduwa)} />
    <Route path="/destinations/mannar" element={<Mannar />} />
    <Route path="/destinations/polonnaruwa" element={<Polonnaruwa />} />
    <Route path="/destinations/anuradhapura" element={<Anuradhapura />} />
    <Route path="/destinations/kalpitiya" element={<Kalpitiya />} />
    <Route path="/destinations/adams-peak" element={<AdamsPeak />} />
    <Route path="/destinations/wadduwa" element={<Wadduwa />} />
    <Route path="/destinations/matara" element={<Matara />} />
    <Route path="/destinations/tangalle" element={<Tangalle />} />
    <Route path="/destinations/negombo" element={<Negombo />} />
    <Route path="/destinations/badulla" element={<Badulla />} />
    <Route path="/destinations/ratnapura" element={<Ratnapura />} />
    <Route path="/destinations/puttalam" element={<Puttalam />} />
    <Route path="/destinations/hambantota" element={<Hambantota />} />
    <Route path="/destinations/vavuniya" element={<Vavuniya />} />
    <Route path="/destinations/kurunegala" element={<Kurunegala />} />
    <Route path="/destinations/batticaloa" element={<Batticaloa />} />
    <Route path="/destinations/kilinochchi" element={<Kilinochchi />} />
    <Route path="/book-tour" element={<TourBookingPage />} />
    <Route path="/destinations/:destinationId" element={withSiteChrome(DestinationDetail)} />
    <Route path="/list-property" element={withSiteChrome(ListProperty)} />
    <Route path="/transport" element={withSiteChrome(TransportLanding)} />
    <Route path="/transport/airport-transfers" element={withSiteChrome(AirportTransfers)} />
    <Route path="/transport/private-tours" element={<PrivateTours />} />
    <Route path="/transport/group-transport" element={<GroupTransport />} />
    <Route path="/transport/train-booking" element={<TrainBooking />} />
    <Route path="/transport/train-booking/confirmation/:bookingId" element={<TrainBookingConfirmation />} />
    <Route path="/experiences" element={withSiteChrome(LuxuryExperiences)} />
    <Route path="/experiences/luxury" element={withSiteChrome(LuxuryLanding)} />
    <Route path="/experiences/:slug" element={withSiteChrome(LuxuryExperienceDetail)} />
    <Route path="/custom-experience" element={withSiteChrome(CustomExperience)} />
    <Route path="/experiences/train-journeys" element={<TrainJourneys />} />
    <Route path="/experiences/tea-trails" element={<TeaTrails />} />
    <Route path="/experiences/pilgrimage-tours" element={<PilgrimageTours />} />
    <Route path="/experiences/island-getaways" element={<IslandGetaways />} />
    <Route path="/experiences/waterfalls" element={<Waterfalls />} />
    <Route path="/experiences/whale-watching" element={<WhaleBookingPage />} />
    <Route path="/experiences/private-charters" element={<PrivateCharters />} />
    <Route path="/experiences/luxury/helicopter-charters" element={<HelicopterCharters />} />
    <Route path="/experiences/luxury/private-yachts" element={<PrivateYachts />} />
    <Route path="/experiences/luxury/private-jets" element={<PrivateJets />} />
    <Route path="/experiences/luxury/exclusive-villas" element={<ExclusiveVillas />} />
    <Route path="/experiences/luxury/luxury-vehicles" element={<LuxuryVehicles />} />
    <Route path="/experiences/luxury/luxury-hotels" element={<LuxuryHotels />} />
    <Route path="/experiences/luxury/luxury-apartments" element={<LuxuryApartments />} />
    <Route path="/experiences/luxury/luxury-houses" element={<LuxuryHouses />} />
    {/* DreamJourneys moved outside PageTransition - see above */}
    <Route path="/experiences/luxury/vip-concierge" element={<VIPConcierge />} />
    <Route path="/experiences/luxury/exclusive-access" element={<ExclusiveAccess />} />
    <Route path="/experiences/sea-cucumber-farming" element={<SeaCucumberFarming />} />
    <Route path="/experiences/hikkaduwa-water-sports" element={<HikkaduwaWaterSports />} />
    <Route path="/experiences/hot-air-balloon-sigiriya" element={<HotAirBalloonSigiriya />} />
    <Route path="/experiences/kalpitiya-kitesurfing" element={<KalpitiyaKiteSurfing />} />
    <Route path="/experiences/jungle-camping" element={<JungleCamping />} />
    <Route path="/experiences/lagoon-safari" element={<LagoonSafari />} />
    <Route path="/experiences/cooking-class-sri-lanka" element={<CookingClass />} />
    <Route path="/experiences/ayurveda" element={<AyurvedaWellness />} />
    <Route path="/booking/ayurveda" element={<AyurvedaBooking />} />
    <Route path="/booking/tea-trails" element={<TeaTrailsBooking />} />
    <Route path="/booking/pilgrimage" element={<PilgrimageBooking />} />
    <Route path="/booking/concierge" element={withSiteChrome(ConciergeBooking)} />
    <Route path="/experiences/wellness" element={<WellnessPackages />} />
    <Route path="/booking/wellness" element={<AyurvedaBooking />} />
    <Route path="/booking/romance" element={<RomanceBooking />} />
    <Route path="/booking/whale-watching" element={<Navigate to="/experiences/whale-watching" replace />} />
    <Route path="/booking/:experienceSlug" element={<ExperienceBooking />} />

    {/* Additional Tours */}

    <Route path="/tours/ayurveda-wellness" element={<AyurvedaWellnessTour />} />

    {/* Family Activities */}
    <Route path="/family-activities/family-train-journeys" element={<FamilyTrainJourneys />} />
    <Route path="/family-activities/sigiriya-family-adventure" element={<SigiriyaFamilyAdventure />} />
    <Route path="/family-activities/polonnaruwa-family-cycling" element={<PolonnaruwaFamilyCycling />} />
    <Route path="/family-activities/udawalawe-elephant-safari" element={<UdawalaweElephantSafari />} />
    <Route path="/family-activities/pinnawala-family-experience" element={<PinnawalaFamilyExperience />} />
    <Route path="/family-activities/kosgoda-turtle-hatchery" element={<KosgodaTurtleHatchery />} />
    <Route path="/family-activities/galle-fort-family-walk" element={<GalleFortFamilyWalk />} />
    <Route path="/family-activities/sri-lanka-mask-workshop" element={<SriLankaMaskWorkshop />} />
    <Route path="/family-activities/pearl-bay-water-park" element={<PearlBayWaterPark />} />
    <Route path="/family-activities/nuwara-eliya-family-outing" element={<NuwaraEliyaFamilyOuting />} />
    <Route path="/family-activities" element={withSiteChrome(FamilyActivities)} />

    {/* Scenic Destinations */}
    <Route path="/scenic/bambarakanda-falls" element={<BambarakandaFalls />} />
    <Route path="/scenic/arugam-bay-beach" element={<ArugamBayBeach />} />
    <Route path="/scenic/haputale-scenic-views" element={<HaputaleViewpoint />} />
    <Route path="/scenic/diyaluma-falls" element={<DiyalumaFalls />} />
    <Route path="/scenic/ella-rock" element={<EllaRock />} />
    <Route path="/scenic/gregory-lake" element={<GregoryLake />} />
    <Route path="/scenic/pidurangala-rock" element={<PidurangalaRock />} />
    <Route path="/scenic/belihuloya" element={<Belihuloya />} />
    <Route path="/scenic/ravana-falls" element={<RavanaFalls />} />
    <Route path="/scenic/nine-arch-bridge" element={<NineArchBridge />} />
    <Route path="/scenic" element={withSiteChrome(ScenicLanding)} />

    {/* Vehicle Rental */}
    <Route path="/vehicle-rental" element={<VehicleRental />} />
    <Route path="/vehicle-rental/browse" element={<VehicleBrowse />} />
    <Route path="/vehicle-rental/vehicle/:id" element={<VehicleRentalDetail />} />
    <Route path="/vehicle-rental/booking/:id" element={<VehicleBooking />} />
    <Route path="/vehicle-rental/booking-confirmation/:bookingId" element={<VehicleBookingConfirmation />} />
    <Route path="/vehicle-rental/availability/:vehicleId" element={<VehicleAvailabilityCalendar />} />
    <Route path="/vehicle-rental/owner-dashboard" element={<OwnerDashboard />} />
    <Route path="/vehicle-rental/owner" element={<OwnerLanding />} />
    <Route path="/vehicle-rental/owner/register" element={<OwnerRegister />} />
    <Route path="/vehicle-rental/owner/documents" element={<OwnerDocuments />} />
    <Route path="/vehicle-rental/my-bookings" element={<MyBookings />} />
    <Route path="/vehicle-rental/list-vehicle" element={<ListVehicle />} />

    {/* Our Fleet - Legacy Vehicles Section */}
    <Route path="/vehicles" element={withSiteChrome(FleetVehicles)} />
    <Route path="/vehicles/category/:category" element={withSiteChrome(FleetVehiclesByCategory)} />
    <Route path="/vehicles/:id" element={withSiteChrome(FleetVehicleDetail)} />

    {/* Phase 2: Payment & Payout System */}
    <Route path="/vehicle-rental/payment/:bookingId" element={<VehiclePayment />} />
    <Route path="/vehicle-rental/owner/payouts" element={<OwnerPayouts />} />
    <Route path="/vehicle-rental/invoice/:bookingId" element={<VehicleInvoice />} />
    <Route path="/vehicle-rental/owner/deposits" element={<SecurityDepositManagement />} />

    {/* Phase 3: Communication & Notifications */}
    <Route path="/vehicle-rental/messages" element={<VehicleChat />} />
    <Route path="/vehicle-rental/messages/:conversationId" element={<VehicleChat />} />
    <Route path="/vehicle-rental/notifications" element={<NotificationCenter />} />
    <Route path="/vehicle-rental/notification-preferences" element={<VehicleNotificationPreferences />} />

    {/* Phase 4: Reviews & Rating System */}
    <Route path="/vehicle-rental/review/:bookingId" element={<VehicleReviewSubmit />} />
    <Route path="/vehicle-rental/owner/reviews" element={<OwnerReviewResponses />} />

    {/* Phase 5: Analytics & Reporting Dashboard */}
    <Route path="/vehicle-rental/owner-analytics" element={<OwnerAnalytics />} />
    <Route path="/vehicle-rental/vehicle-performance/:vehicleId" element={<VehiclePerformance />} />
    <Route path="/vehicle-rental/earnings-reports" element={<EarningsReports />} />
    <Route path="/vehicle-rental/booking-analytics" element={<BookingAnalytics />} />

    {/* Vendor Platform */}
    <Route path="/vendor/register" element={withSiteChrome(VendorRegistration)} />
    <Route path="/vendor/dashboard" element={<VendorDashboard />} />

    {/* B2B Portal */}
    <Route path="/about/partners/b2b" element={<B2BPortal />} />
    <Route path="/about/partners/b2b/login" element={<B2BLogin />} />
    <Route path="/about/partners/b2b/register" element={<B2BRegister />} />
    <Route path="/about/partners/b2b/dashboard" element={<B2BDashboard />} />
    <Route path="/about/partners/b2b/tours" element={<B2BTours />} />
    <Route path="/about/partners/b2b/book/:tourId" element={<B2BBookingForm />} />
    <Route path="/about/partners/b2b/bookings" element={<B2BMyBookings />} />

    {/* B2B Admin */}
    <Route path="/admin/b2b" element={<B2BAdminDashboard />} />
    <Route path="/admin/b2b/agencies" element={<B2BAgencyManagement />} />
    <Route path="/admin/b2b/tours" element={<B2BTourManagement />} />
    <Route path="/admin/b2b/tours/new" element={<B2BTourManagement />} />
    <Route path="/admin/b2b/bookings" element={<B2BBookingsAdmin />} />
    <Route path="/admin/b2b/analytics" element={<B2BAnalytics />} />

    <Route path="/blog" element={withSiteChrome(Blog)} />
    <Route path="/blog/:slug" element={withSiteChrome(BlogPost)} />
    <Route path="/about/sri-lanka" element={withSiteChrome(AboutSriLanka)} />
    <Route path="/about" element={withSiteChrome(AboutRechargeTravel)} />
    <Route path="/contact" element={withSiteChrome(Contact)} />
    <Route path="/faq" element={withSiteChrome(FAQ)} />
    <Route path="/news" element={withSiteChrome(TourismNews)} />
    <Route path="/connect-with-us" element={withSiteChrome(AboutSocial)} />

    {/* Legal Pages */}
    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
    <Route path="/cookie-policy" element={<CookiePolicy />} />
    <Route path="/terms-of-service" element={<TermsOfService />} />

    <Route path="/drivers" element={withSiteChrome(DriversDirectory)} />
    <Route path="/drivers/:id" element={withSiteChrome(DriverPublicProfile)} />
    <Route path="/join-with-us" element={withSiteChrome(JoinUsDrivers)} />
    <Route path="/driver/dashboard" element={withSiteChrome(DriverDashboard)} />
    <Route path="/search" element={<SearchResults />} />
    <Route path="/book-now" element={<BookNow />} />
    <Route path="/ai-trip-planner" element={<AITripPlanner />} />
    <Route path="/wallet" element={withSiteChrome(WalletTransactions)} />
    <Route path="/wallet/transactions" element={withSiteChrome(WalletTransactions)} />
    <Route path="/login" element={withSiteChrome(AdminLogin)} />
    <Route path="/signup" element={withSiteChrome(Signup)} />
    <Route path="/driver/dashboard" element={withSiteChrome(DriverDashboard)} />
    <Route path="/admin/custom-trips" element={<CustomTripRequestsAdmin />} />
    <Route path="/admin/vehicle-rental/vehicles" element={<VehicleApproval />} />
    <Route path="/admin/vehicle-rental/owners" element={<OwnerApproval />} />
    <Route path="/admin/vehicle-rental/reviews" element={<AdminReviewManagement />} />
    <Route path="/admin/ayurveda" element={<AyurvedaAdmin />} />
    <Route path="/admin/wellness" element={<WellnessAdmin />} />
    <Route path="/admin/romance" element={<RomanceAdmin />} />
    <Route path="/admin/custom-experience" element={<CustomExperienceAdmin />} />
    <Route path="/admin/global-tours" element={<GlobalToursAdmin />} />
    {/* Admin panel is now at: https://recharge-travels-admin.web.app */}
    <Route path="/admin" element={<AdminRedirect />} />
    <Route path="/admin-panel" element={<AdminRedirect />} />
    <Route path="/upload-hero-images" element={withSiteChrome(HeroImageUpload)} />
    <Route path="/seed-data" element={withSiteChrome(SeedData)} />
    {/* <Route path="/booking-integration" element={<BookingIntegration />} /> */}
    <Route path="/booking-confirmation" element={withSiteChrome(BookingConfirmation)} />
    <Route path="/travel-guide" element={withSiteChrome(TravelGuide)} />
    <Route path="/hotels/:id" element={<HotelDetail />} />
    <Route path="/hotels" element={<Hotels />} />
    <Route path="/content-updater" element={<ContentUpdater />} />
    <Route path="/dynamic/:slug" element={<DynamicPage />} />
    <Route path="*" element={withSiteChrome(NotFound)} />
  </Routes>
);

function App() {
  return (
    <HelmetProvider>
      <DeviceProvider>
        <LoadingProvider>
          <LanguageProvider>
            <B2BAuthProvider>
              <CurrencyProvider>
                <ScrollToTop />
                <GoogleAnalytics />

                {/* Content Protection - prevents copying, right-click, etc. */}
                <ContentProtection />

                <AppRoutes />

                {/* YALU Voice AI Agent - Leopard Travel Companion */}
                <Suspense fallback={null}>
                  <YaluFloatingButton />
                </Suspense>

                {/* WhatsApp Floating Button */}
                <Suspense fallback={null}>
                  <WhatsAppFloatingButton
                    phoneNumber="+94773401305"
                    message="Hi! I'm interested in booking a tour/transfer with Recharge Travels. Can you help me?"
                  />
                </Suspense>

                <Toaster />
                <Sonner />

                {/* GDPR/CCPA Cookie Consent Banner */}
                <Suspense fallback={null}>
                  <CookieConsentEnhanced />
                </Suspense>
              </CurrencyProvider>
            </B2BAuthProvider>
          </LanguageProvider>
        </LoadingProvider>
      </DeviceProvider>
    </HelmetProvider>
  )
}

export default App
