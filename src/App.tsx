import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { HelmetProvider } from 'react-helmet-async'
import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import EnhancedYaluLeopardAgent from '@/components/EnhancedYaluLeopardAgent'
import PageTransition from '@/components/PageTransition'
import { LoadingProvider } from '@/contexts/LoadingContext'
import { LanguageProvider } from '@/contexts/LanguageContext'
import ScrollToTop from '@/components/ScrollToTop'
import GoogleAnalytics from '@/components/analytics/GoogleAnalytics'
import Index from '@/pages/Index'
import CulturalTours from '@/pages/CulturalTours'
import WildTours from '@/pages/WildTours'
import NationalParksOverview from '@/pages/NationalParksOverview'
import ParkLandingPage from '@/components/wildTours/ParkLandingPage'
import LuxurySafari from '@/pages/LuxurySafari'
import Blog from '@/pages/Blog'
import BlogPost from '@/pages/BlogPost'
import AboutSriLanka from '@/pages/AboutSriLanka'
import About from '@/pages/About'
import NotFound from '@/pages/NotFound'
import Photography from '@/pages/Photography'
import RamayanaTrail from '@/pages/RamayanaTrail'
import RamayanaTrailTour from '@/pages/RamayanaTrailTour'
import AyurvedaWellnessTour from '@/pages/AyurvedaWellnessTour'
import Ecotourism from '@/pages/Ecotourism'
import BeachTours from '@/pages/BeachTours'
import HillCountry from '@/pages/HillCountry'
import CulinaryTours from '@/pages/CulinaryTours'
import Honeymoon from '@/pages/Honeymoon'
import HoneymoonsWeddings from '@/pages/romance/HoneymoonsWeddings'
import WellnessPackages from '@/pages/WellnessPackages'
import LuxuryTours from '@/pages/LuxuryTours'
import Colombo from '@/pages/destinations/Colombo'
import Kandy from '@/pages/destinations/Kandy'
import Galle from '@/pages/destinations/Galle'
import Sigiriya from '@/pages/destinations/Sigiriya'
import Ella from '@/pages/destinations/Ella'
import Jaffna from '@/pages/destinations/Jaffna'
import NuwaraEliya from '@/pages/destinations/NuwaraEliya'
import Trincomalee from '@/pages/destinations/Trincomalee'
import ArugamBay from '@/pages/destinations/ArugamBay'
import Mirissa from '@/pages/destinations/Mirissa'
import Weligama from '@/pages/destinations/Weligama'
import Bentota from '@/pages/destinations/Bentota'
import Dambulla from '@/pages/destinations/Dambulla'
import Hikkaduwa from '@/pages/destinations/Hikkaduwa'
import Mannar from '@/pages/destinations/Mannar'
import Polonnaruwa from '@/pages/destinations/Polonnaruwa'
import Anuradhapura from '@/pages/destinations/Anuradhapura'
import Kalpitiya from '@/pages/destinations/Kalpitiya'
import AdamsPeak from '@/pages/destinations/AdamsPeak'
import Wadduwa from '@/pages/destinations/Wadduwa'
import Matara from '@/pages/destinations/Matara'
import Tangalle from '@/pages/destinations/Tangalle'
import Negombo from '@/pages/destinations/Negombo'
import Badulla from '@/pages/destinations/Badulla'
import Ratnapura from '@/pages/destinations/Ratnapura'
import Puttalam from '@/pages/destinations/Puttalam'
import Hambantota from '@/pages/destinations/Hambantota'
import Vavuniya from '@/pages/destinations/Vavuniya'
import Kurunegala from '@/pages/destinations/Kurunegala'
import Batticaloa from '@/pages/destinations/Batticaloa'
import DestinationDetail from '@/pages/destinations/DestinationDetail'
import Destinations from '@/pages/Destinations'
import AirportTransfers from '@/pages/transport/AirportTransfers'
import PrivateTours from '@/pages/transport/PrivateTours'
import GroupTransport from '@/pages/transport/GroupTransport'
import RestaurantGuide from '@/pages/RestaurantGuide'
import WaterfallGuide from '@/pages/WaterfallGuide'
import DriverGuideServices from '@/pages/DriverGuideServices'
import DriverGuideProfile from '@/pages/DriverGuideProfile'
import WalletTransactions from '@/pages/WalletTransactions'
import AdminPanel from '@/pages/AdminPanel'
import AdminLogin from '@/pages/AdminLogin'
import HeroImageUpload from '@/pages/HeroImageUpload'
import SeedData from '@/pages/SeedData'
// import BookingIntegration from '@/pages/BookingIntegration'
import BookingConfirmation from '@/pages/BookingConfirmation'
// import BookNow from '@/pages/BookNow'
import TravelGuide from '@/pages/TravelGuide'
import Tours from '@/pages/Tours'
import Signup from '@/pages/Signup'
import TrainJourneys from '@/pages/experiences/TrainJourneys'
import TeaTrails from '@/pages/experiences/TeaTrails'
import PilgrimageTours from '@/pages/experiences/PilgrimageTours'
import IslandGetaways from '@/pages/experiences/IslandGetaways'
import WhaleWatching from '@/pages/experiences/WhaleWatching'
import SeaCucumberFarming from '@/pages/experiences/SeaCucumberFarming'
import HikkaduwaWaterSports from '@/pages/experiences/HikkaduwaWaterSports'
import HotAirBalloonSigiriya from '@/pages/experiences/HotAirBalloonSigiriya'
import KalpitiyaKiteSurfing from '@/pages/experiences/KalpitiyaKiteSurfing'
import JungleCamping from '@/pages/experiences/JungleCamping'
import LagoonSafari from '@/pages/experiences/LagoonSafari'
import CookingClass from '@/pages/experiences/CookingClass'
import ExperienceBooking from '@/pages/booking/ExperienceBooking'
import LuxuryExperiences from '@/pages/LuxuryExperiences'
import LuxuryExperienceDetail from '@/pages/LuxuryExperienceDetail'
import CustomExperience from '@/pages/CustomExperience'

// Family Activities
import FamilyTrainJourneys from '@/pages/family-activities/FamilyTrainJourneys'
import SigiriyaFamilyAdventure from '@/pages/family-activities/SigiriyaFamilyAdventure'
import PolonnaruwaFamilyCycling from '@/pages/family-activities/PolonnaruwaFamilyCycling'
import UdawalaweElephantSafari from '@/pages/family-activities/UdawalaweElephantSafari'
import PinnawalaFamilyExperience from '@/pages/family-activities/PinnawalaFamilyExperience'
import KosgodaTurtleHatchery from '@/pages/family-activities/KosgodaTurtleHatchery'
import GalleFortFamilyWalk from '@/pages/family-activities/GalleFortFamilyWalk'
import SriLankaMaskWorkshop from '@/pages/family-activities/SriLankaMaskWorkshop'
import PearlBayWaterPark from '@/pages/family-activities/PearlBayWaterPark'
import NuwaraEliyaFamilyOuting from '@/pages/family-activities/NuwaraEliyaFamilyOuting'

// Scenic Destinations
import BambarakandaFalls from '@/pages/scenic/BambarakandaFalls'
import ArugamBayBeach from '@/pages/scenic/ArugamBayBeach'
import HaputaleViewpoint from '@/pages/scenic/HaputaleViewpoint'
import DiyalumaFalls from '@/pages/scenic/DiyalumaFalls'
import EllaRock from '@/pages/scenic/EllaRock'
import GregoryLake from '@/pages/scenic/GregoryLake'
import PidurangalaRock from '@/pages/scenic/PidurangalaRock'
import Belihuloya from '@/pages/scenic/BelihuloyaRiver'
import RavanaFalls from '@/pages/scenic/RavanaFalls'
import NineArchBridge from '@/pages/scenic/NineArchBridge'
import Hotels from '@/pages/Hotels'
import ContentUpdater from '@/pages/ContentUpdater'
import BookNow from '@/pages/BookNow'
import DynamicPage from '@/pages/DynamicPage'

import './App.css'

const queryClient = new QueryClient()

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
            <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/tours" element={<Tours />} />
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
          <Route path="/romance/honeymoons-weddings" element={<HoneymoonsWeddings />} />
          <Route path="/tours/wellness" element={<WellnessPackages />} />
          <Route path="/tours/luxury" element={<LuxuryTours />} />
          <Route path="/tours/restaurants" element={<RestaurantGuide />} />
          <Route path="/tours/waterfalls" element={<WaterfallGuide />} />
          <Route path="/tours/driver-guide" element={<DriverGuideServices />} />
          <Route path="/tours/driver-guide/:slug" element={<DriverGuideProfile />} />
          <Route path="/destinations" element={<Destinations />} />
          <Route path="/destinations/colombo" element={<Colombo />} />
          <Route path="/destinations/kandy" element={<Kandy />} />
          <Route path="/destinations/galle" element={<Galle />} />
          <Route path="/destinations/sigiriya" element={<Sigiriya />} />
          <Route path="/destinations/ella" element={<Ella />} />
          <Route path="/destinations/jaffna" element={<Jaffna />} />
          <Route path="/destinations/nuwaraeliya" element={<NuwaraEliya />} />
          <Route path="/destinations/trincomalee" element={<Trincomalee />} />
          <Route path="/destinations/arugam-bay" element={<ArugamBay />} />
          <Route path="/destinations/mirissa" element={<Mirissa />} />
          <Route path="/destinations/weligama" element={<Weligama />} />
          <Route path="/destinations/bentota" element={<Bentota />} />
          <Route path="/destinations/dambulla" element={<Dambulla />} />
          <Route path="/destinations/hikkaduwa" element={<Hikkaduwa />} />
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
          <Route path="/destinations/:destinationId" element={<DestinationDetail />} />
          <Route path="/transport/airport-transfers" element={<AirportTransfers />} />
          <Route path="/transport/private-tours" element={<PrivateTours />} />
          <Route path="/transport/group-transport" element={<GroupTransport />} />
          <Route path="/experiences" element={<LuxuryExperiences />} />
          <Route path="/experiences/:slug" element={<LuxuryExperienceDetail />} />
          <Route path="/custom-experience" element={<CustomExperience />} />
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
          
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/about/sri-lanka" element={<AboutSriLanka />} />
          <Route path="/about" element={<About />} />
          <Route path="/book-now" element={<BookNow />} />
          <Route path="/wallet" element={<WalletTransactions />} />
          <Route path="/wallet/transactions" element={<WalletTransactions />} />
          <Route path="/login" element={<AdminLogin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/admin-panel" element={<AdminPanel />} />
          <Route path="/upload-hero-images" element={<HeroImageUpload />} />
          <Route path="/seed-data" element={<SeedData />} />
          {/* <Route path="/booking-integration" element={<BookingIntegration />} /> */}
          <Route path="/booking-confirmation" element={<BookingConfirmation />} />
          <Route path="/travel-guide" element={<TravelGuide />} />
          <Route path="/hotels" element={<Hotels />} />
          <Route path="/content-updater" element={<ContentUpdater />} />
          <Route path="/dynamic/:slug" element={<DynamicPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
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
