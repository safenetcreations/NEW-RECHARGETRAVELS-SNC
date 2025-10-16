import { useState, useEffect, ComponentType, lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import EnhancedYaluLeopardAgent from '@/components/EnhancedYaluLeopardAgent';
import PageTransition from '@/components/PageTransition';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { LoadingProvider } from '@/contexts/LoadingContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import ScrollToTop from '@/components/ScrollToTop';
import GoogleAnalytics from '@/components/analytics/GoogleAnalytics';

const Index = lazy(() => import('@/pages/Index'));
const CulturalTours = lazy(() => import('@/pages/CulturalTours'));
const WildTours = lazy(() => import('@/pages/WildTours'));
const NationalParksOverview = lazy(() => import('@/pages/NationalParksOverview'));
const ParkLandingPage = lazy(() => import('@/components/wildTours/ParkLandingPage'));
const LuxurySafari = lazy(() => import('@/pages/LuxurySafari'));
const Blog = lazy(() => import('@/pages/Blog'));
const BlogPost = lazy(() => import('@/pages/BlogPost'));
const AboutSriLanka = lazy(() => import('@/pages/AboutSriLanka'));
const AboutRechargeTravel = lazy(() => import('@/pages/AboutRechargeTravel'));
const NotFound = lazy(() => import('@/pages/NotFound'));
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
const LuxuryTours = lazy(() => import('@/pages/LuxuryTours'));
const Colombo = lazy(() => import('@/pages/destinations/Colombo'));
const Kandy = lazy(() => import('@/pages/destinations/Kandy'));
const Galle = lazy(() => import('@/pages/destinations/Galle'));
const Sigiriya = lazy(() => import('@/pages/destinations/Sigiriya'));
const Ella = lazy(() => import('@/pages/destinations/Ella'));
const Jaffna = lazy(() => import('@/pages/destinations/Jaffna'));
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
const DestinationDetail = lazy(() => import('@/pages/destinations/DestinationDetail'));
const Destinations = lazy(() => import('@/pages/Destinations'));
const AirportTransfers = lazy(() => import('@/pages/transport/AirportTransfers'));
const PrivateTours = lazy(() => import('@/pages/transport/PrivateTours'));
const GroupTransport = lazy(() => import('@/pages/transport/GroupTransport'));
const RestaurantGuide = lazy(() => import('@/pages/RestaurantGuide'));
const WaterfallGuide = lazy(() => import('@/pages/WaterfallGuide'));
const DriverGuideServices = lazy(() => import('@/pages/DriverGuideServices'));
const DriverGuideProfile = lazy(() => import('@/pages/DriverGuideProfile'));
const WalletTransactions = lazy(() => import('@/pages/WalletTransactions'));
const AdminLogin = lazy(() => import('@/pages/AdminLogin'));

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
const Signup = lazy(() => import('@/pages/Signup'));
const TrainJourneys = lazy(() => import('@/pages/experiences/TrainJourneys'));
const TeaTrails = lazy(() => import('@/pages/experiences/TeaTrails'));
const PilgrimageTours = lazy(() => import('@/pages/experiences/PilgrimageTours'));
const IslandGetaways = lazy(() => import('@/pages/experiences/IslandGetaways'));
const WhaleWatching = lazy(() => import('@/pages/experiences/WhaleWatching'));
const SeaCucumberFarming = lazy(() => import('@/pages/experiences/SeaCucumberFarming'));
const HikkaduwaWaterSports = lazy(() => import('@/pages/experiences/HikkaduwaWaterSports'));
const HotAirBalloonSigiriya = lazy(() => import('@/pages/experiences/HotAirBalloonSigiriya'));
const KalpitiyaKiteSurfing = lazy(() => import('@/pages/experiences/KalpitiyaKiteSurfing'));
const JungleCamping = lazy(() => import('@/pages/experiences/JungleCamping'));
const LagoonSafari = lazy(() => import('@/pages/experiences/LagoonSafari'));
const CookingClass = lazy(() => import('@/pages/experiences/CookingClass'));
const ExperienceBooking = lazy(() => import('@/pages/booking/ExperienceBooking'));
const LuxuryExperiences = lazy(() => import('@/pages/LuxuryExperiences'));
const LuxuryExperienceDetail = lazy(() => import('@/pages/LuxuryExperienceDetail'));
const CustomExperience = lazy(() => import('@/pages/CustomExperience'));

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
const ContentUpdater = lazy(() => import('@/pages/ContentUpdater'));
const BookNow = lazy(() => import('@/pages/BookNow'));
const DynamicPage = lazy(() => import('@/pages/DynamicPage'));
const SearchResults = lazy(() => import('@/pages/SearchResults'));

import './App.css';

const queryClient = new QueryClient()

const withSiteChrome = (Component: ComponentType<any>) => (
  <>
    <Header />
    <Component />
    <Footer />
  </>
)

function App() {
  const [yaluOpen, setYaluOpen] = useState(false)
  
  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
                <LoadingProvider>
          <LanguageProvider>
            <ScrollToTop />
            <GoogleAnalytics />
            <PageTransition>
            <Suspense fallback={<div>Loading...</div>}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/tours" element={withSiteChrome(Tours)} />
                <Route path="/tours/cultural" element={<CulturalTours />} />
                <Route path="/tours/wildtours" element={<WildTours />} />
                <Route path="/tours/wildtours/parks" element={<NationalParksOverview />} />
                <Route path="/tours/wildtours/parks/:slug" element={<ParkLandingPage />} />
                <Route path="/tours/photography" element={<Photography />} />
                <Route path="/tours/ramayana-trail" element={<RamayanaTrail />} />
                <Route path="/tours/ecotourism" element={<Ecotourism />} />
                <Route path="/tours/beach-tours" element={<BeachTours />} />
                <Route path="/tours/hill-country" element={<HillCountry />} />
                <Route path="/tours/culinary" element={<CulinaryTours />} />
                <Route path="/tours/luxury-safari" element={<LuxurySafari />} />
                <Route path="/tours/honeymoon" element={<Honeymoon />} />
                <Route path="/romance/honeymoons-weddings" element={withSiteChrome(HoneymoonsWeddings)} />
                <Route path="/tours/wellness" element={<WellnessPackages />} />
                <Route path="/tours/luxury" element={<LuxuryTours />} />
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
                <Route path="/destinations/:destinationId" element={withSiteChrome(DestinationDetail)} />
                <Route path="/transport/airport-transfers" element={<AirportTransfers />} />
                <Route path="/transport/private-tours" element={<PrivateTours />} />
                <Route path="/transport/group-transport" element={<GroupTransport />} />
                <Route path="/experiences" element={withSiteChrome(LuxuryExperiences)} />
                <Route path="/experiences/:slug" element={withSiteChrome(LuxuryExperienceDetail)} />
                <Route path="/custom-experience" element={withSiteChrome(CustomExperience)} />
                <Route path="/experiences/train-journeys" element={<TrainJourneys />} />
                <Route path="/experiences/tea-trails" element={<TeaTrails />} />
                <Route path="/experiences/pilgrimage-tours" element={<PilgrimageTours />} />
                <Route path="/experiences/island-getaways" element={<IslandGetaways />} />
                <Route path="/experiences/whale-watching" element={<WhaleWatching />} />
                <Route path="/experiences/sea-cucumber-farming" element={<SeaCucumberFarming />} />
                <Route path="/experiences/hikkaduwa-water-sports" element={<HikkaduwaWaterSports />} />
                <Route path="/experiences/hot-air-balloon-sigiriya" element={<HotAirBalloonSigiriya />} />
                <Route path="/experiences/kalpitiya-kitesurfing" element={<KalpitiyaKiteSurfing />} />
                <Route path="/experiences/jungle-camping" element={<JungleCamping />} />
                <Route path="/experiences/lagoon-safari" element={<LagoonSafari />} />
                <Route path="/experiences/cooking-class-sri-lanka" element={<CookingClass />} />
                <Route path="/booking/:experienceSlug" element={<ExperienceBooking />} />
                
                {/* Additional Tours */}
                <Route path="/tours/ramayana-trail" element={<RamayanaTrailTour />} />
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
                
                <Route path="/blog" element={withSiteChrome(Blog)} />
                <Route path="/blog/:slug" element={withSiteChrome(BlogPost)} />
                <Route path="/about/sri-lanka" element={withSiteChrome(AboutSriLanka)} />
                <Route path="/about" element={withSiteChrome(AboutRechargeTravel)} />
                <Route path="/search" element={<SearchResults />} />
                <Route path="/book-now" element={<BookNow />} />
                <Route path="/wallet" element={withSiteChrome(WalletTransactions)} />
                <Route path="/wallet/transactions" element={withSiteChrome(WalletTransactions)} />
                <Route path="/login" element={withSiteChrome(AdminLogin)} />
                <Route path="/signup" element={withSiteChrome(Signup)} />
                {/* Admin panel is now at: https://recharge-travels-admin.web.app */}
                <Route path="/admin" element={<AdminRedirect />} />
                <Route path="/admin-panel" element={<AdminRedirect />} />
                <Route path="/upload-hero-images" element={withSiteChrome(HeroImageUpload)} />
                <Route path="/seed-data" element={withSiteChrome(SeedData)} />
                {/* <Route path="/booking-integration" element={<BookingIntegration />} /> */}
                <Route path="/booking-confirmation" element={withSiteChrome(BookingConfirmation)} />
                <Route path="/travel-guide" element={withSiteChrome(TravelGuide)} />
                <Route path="/hotels" element={<Hotels />} />
                <Route path="/content-updater" element={<ContentUpdater />} />
                <Route path="/dynamic/:slug" element={<DynamicPage />} />
                <Route path="*" element={withSiteChrome(NotFound)} />
              </Routes>
            </Suspense>
            </PageTransition>
        </LanguageProvider>
        </LoadingProvider>
        
        {/* Yalu Floating Button */}
        <button
          onClick={() => setYaluOpen(true)}
          className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform z-40 group"
          aria-label="Open Yalu Travel Assistant"
        >
          <span className="text-3xl group-hover:animate-bounce">🐆</span>
        </button>
        
        {/* Enhanced Yalu Leopard Agent */}
        <EnhancedYaluLeopardAgent 
          isOpen={yaluOpen} 
          onClose={() => setYaluOpen(false)} 
        />
        
        <Toaster />
        <Sonner />
      </HelmetProvider>
    </QueryClientProvider>
  )
}

export default App
