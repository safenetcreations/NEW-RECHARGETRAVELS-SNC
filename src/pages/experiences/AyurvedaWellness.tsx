import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getAllAyurvedaData, AyurvedaTreatment, WellnessRetreat, AyurvedaTestimonial, AyurvedaPageSettings } from '@/services/ayurvedaService';
import { 
  Leaf, Star, ChevronRight, Quote, Sparkles, 
  Heart, Flame, Droplets, Wind, Sun, Moon, Mountain,
  Calendar, MapPin, Check, Phone, Award, Play,
  Flower2, CircleDot, Zap, Brain, Diamond, Crown,
  X, Clock, Users, Shield, Sparkle, Info, Building2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Treatment type
interface Treatment {
  id: string;
  name: string;
  sinhala: string;
  duration: string;
  price: number;
  image: string;
  description: string;
  fullDescription: string;
  benefits: string[];
  bestFor: string[];
  whatToExpect: string[];
  preparation: string[];
  locations: { name: string; area: string; rating: number }[];
  contraindications: string[];
}

// Premium Treatments with full details
const premiumTreatments: Treatment[] = [
  { 
    id: 'shirodhara', 
    name: 'Shirodhara', 
    sinhala: 'ශිරෝධාරා', 
    duration: '60 min', 
    price: 85, 
    image: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=800&q=80', 
    description: 'Warm medicated oil flows on your forehead in a rhythmic stream, inducing deep relaxation and mental clarity.',
    fullDescription: 'Shirodhara is one of the most divine Ayurvedic therapies. A continuous stream of warm, herb-infused oil is poured onto the forehead (the "third eye" area) in a specific oscillating pattern. This ancient treatment profoundly calms the nervous system, balances the pineal gland, and induces a state of deep meditation. The word comes from Sanskrit: "Shiro" (head) and "Dhara" (flow).',
    benefits: ['Deep mental relaxation', 'Improved sleep quality', 'Reduced anxiety & stress', 'Enhanced mental clarity', 'Balanced hormones', 'Nourished scalp & hair', 'Relieved migraines'],
    bestFor: ['Insomnia & sleep disorders', 'Anxiety & depression', 'Chronic headaches', 'Mental fatigue', 'Hypertension', 'Premature greying', 'Memory issues'],
    whatToExpect: ['Gentle head & scalp massage (10 min)', 'Warm oil stream on forehead (30-40 min)', 'Post-treatment rest period (10 min)', 'Herbal tea & relaxation'],
    preparation: ['Avoid heavy meals 2 hours before', 'Wear comfortable loose clothing', 'Remove jewelry & contacts', 'Arrive 15 minutes early'],
    locations: [
      { name: 'Anantara Peace Haven', area: 'Tangalle', rating: 5.0 },
      { name: 'Santani Wellness Resort', area: 'Kandy', rating: 5.0 },
      { name: 'Siddhalepa Ayurveda', area: 'Wadduwa', rating: 4.9 }
    ],
    contraindications: ['Fever or cold', 'Recent head injury', 'Skin infections on forehead', 'Pregnancy (first trimester)']
  },
  { 
    id: 'abhyanga', 
    name: 'Abhyanga Massage', 
    sinhala: 'අභ්‍යංග', 
    duration: '75 min', 
    price: 95, 
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80', 
    description: 'Four-hand synchronized massage with warm herbal oils, promoting circulation and deep tissue healing.',
    fullDescription: 'Abhyanga is the cornerstone of Ayurvedic body therapies. Two therapists work in perfect synchronization, using warm medicated oils specifically selected for your dosha (body constitution). The rhythmic strokes follow the body\'s energy channels (marma points), promoting deep tissue healing, lymphatic drainage, and complete nervous system reset. This is not just a massage—it\'s a sacred healing ritual.',
    benefits: ['Improved blood circulation', 'Lymphatic detoxification', 'Joint flexibility', 'Skin nourishment', 'Muscle relaxation', 'Stress reduction', 'Better sleep'],
    bestFor: ['Chronic fatigue', 'Muscle stiffness', 'Poor circulation', 'Dry skin conditions', 'Vata imbalance', 'General wellness', 'Anti-aging'],
    whatToExpect: ['Dosha consultation (5 min)', 'Four-hand synchronized massage (60 min)', 'Steam therapy option (10 min)', 'Herbal shower & rest'],
    preparation: ['Light meal 2-3 hours before', 'Stay hydrated', 'Inform about allergies', 'No alcohol 24 hours prior'],
    locations: [
      { name: 'Jetwing Ayurveda Pavilions', area: 'Negombo', rating: 4.9 },
      { name: 'Barberyn Beach Resort', area: 'Weligama', rating: 4.8 },
      { name: 'Heritance Ayurveda', area: 'Beruwala', rating: 4.8 }
    ],
    contraindications: ['Fever', 'Acute inflammation', 'Skin infections', 'Immediately after meals']
  },
  { 
    id: 'pizhichil', 
    name: 'Pizhichil Royal', 
    sinhala: 'පිළිචිල්', 
    duration: '90 min', 
    price: 150, 
    image: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=800&q=80', 
    description: 'The "King of Treatments" - warm oil bath with synchronized massage, reserved for royalty.',
    fullDescription: 'Pizhichil, meaning "squeezing," was historically reserved for Sri Lankan royalty and is considered the king of all Ayurvedic treatments. Warm medicated oil (2-4 liters) is continuously squeezed over the entire body while two therapists perform synchronized massage strokes. This creates an oil bath effect that deeply penetrates tissues, nourishes the nervous system, and provides profound rejuvenation. It\'s the ultimate luxury wellness experience.',
    benefits: ['Deep tissue rejuvenation', 'Nervous system healing', 'Anti-aging effects', 'Pain relief', 'Improved mobility', 'Skin lustre', 'Mental peace'],
    bestFor: ['Arthritis & joint pain', 'Paralysis recovery', 'Neurological conditions', 'Chronic pain', 'Anti-aging', 'Muscular dystrophy', 'Stress disorders'],
    whatToExpect: ['Consultation & oil selection (10 min)', 'Warm oil bath massage (70 min)', 'Rest with herbal wrap (10 min)', 'Shower & rejuvenation tea'],
    preparation: ['Fast for 3 hours before', 'Drink warm water', 'Mental preparation for luxury', 'Plan rest time after'],
    locations: [
      { name: 'Anantara Peace Haven', area: 'Tangalle', rating: 5.0 },
      { name: 'Santani Wellness Resort', area: 'Kandy', rating: 5.0 },
      { name: 'Fortress Resort & Spa', area: 'Galle', rating: 4.9 }
    ],
    contraindications: ['Fever', 'Indigestion', 'Diabetes (uncontrolled)', 'Obesity', 'During menstruation']
  },
  { 
    id: 'udvartana', 
    name: 'Udvartana Detox', 
    sinhala: 'උද්වර්තන', 
    duration: '60 min', 
    price: 75, 
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=80', 
    description: 'Invigorating herbal powder massage for weight loss and skin rejuvenation.',
    fullDescription: 'Udvartana is a unique dry powder massage using a blend of Ayurvedic herbs like Triphala, Kollu, and Mustard. Unlike oil massages, this vigorous upward-stroking technique breaks down subcutaneous fat, stimulates metabolism, and exfoliates dead skin cells. The heat generated opens pores and channels, allowing herbal properties to penetrate deeply. It\'s the Ayurvedic answer to modern body sculpting.',
    benefits: ['Weight reduction', 'Cellulite breakdown', 'Skin exfoliation', 'Improved metabolism', 'Toxin removal', 'Skin toning', 'Reduced water retention'],
    bestFor: ['Weight management', 'Cellulite', 'Kapha imbalance', 'Sluggish metabolism', 'Skin dullness', 'Obesity', 'Lymphatic congestion'],
    whatToExpect: ['Body assessment (5 min)', 'Dry herbal powder massage (45 min)', 'Steam therapy (10 min)', 'Warm shower & hydration'],
    preparation: ['Light meal only', 'Exfoliate night before', 'Stay hydrated', 'Wear old undergarments'],
    locations: [
      { name: 'Siddhalepa Ayurveda', area: 'Wadduwa', rating: 4.9 },
      { name: 'Heritance Ayurveda', area: 'Beruwala', rating: 4.8 },
      { name: 'Barberyn Beach Resort', area: 'Weligama', rating: 4.8 }
    ],
    contraindications: ['Sensitive skin', 'Open wounds', 'Pregnancy', 'Severe weakness', 'High blood pressure']
  },
  { 
    id: 'nasya', 
    name: 'Nasya Therapy', 
    sinhala: 'නස්‍ය', 
    duration: '45 min', 
    price: 55, 
    image: 'https://images.unsplash.com/photo-1552693673-1bf958298935?w=800&q=80', 
    description: 'Nasal administration of herbal oils for mental clarity and sinus relief.',
    fullDescription: 'Nasya is one of the five Panchakarma therapies focusing on the head region. After a relaxing face, neck, and shoulder massage, medicated oils or herbal preparations are carefully administered through the nasal passages. The nose is considered the gateway to the brain in Ayurveda, making this treatment powerful for mental clarity, sinus health, and neurological balance.',
    benefits: ['Sinus cleansing', 'Mental clarity', 'Headache relief', 'Improved breathing', 'Better voice quality', 'Eye health', 'Hair growth'],
    bestFor: ['Chronic sinusitis', 'Migraines', 'Mental fog', 'Hairfall', 'Facial paralysis', 'Neck stiffness', 'Nasal congestion'],
    whatToExpect: ['Face & neck massage (15 min)', 'Steam inhalation (5 min)', 'Nasal oil administration (10 min)', 'Rest & gargling (15 min)'],
    preparation: ['Empty stomach preferred', 'No smoking before', 'Clear nasal passages', 'Relax and breathe deeply'],
    locations: [
      { name: 'Jetwing Ayurveda Pavilions', area: 'Negombo', rating: 4.9 },
      { name: 'Siddhalepa Ayurveda', area: 'Wadduwa', rating: 4.9 },
      { name: 'Santani Wellness Resort', area: 'Kandy', rating: 5.0 }
    ],
    contraindications: ['Acute cold/flu', 'After meals', 'Pregnancy', 'Menstruation', 'Alcohol consumption']
  },
  { 
    id: 'elakizhi', 
    name: 'Elakizhi Poultice', 
    sinhala: 'එළකිළි', 
    duration: '75 min', 
    price: 110, 
    image: 'https://images.unsplash.com/photo-1591343395082-e120087004b4?w=800&q=80', 
    description: 'Warm herbal poultices applied rhythmically for joint pain and inflammation.',
    fullDescription: 'Elakizhi (Patra Pinda Sweda) uses boluses filled with medicinal leaves like Eranda, Nirgundi, and Drumstick, fried in medicated oils with herbs and lemon. These warm poultices are rhythmically pressed and massaged over the body, particularly on joints and painful areas. The combination of heat, herbal medicine, and massage creates powerful anti-inflammatory and pain-relieving effects.',
    benefits: ['Joint pain relief', 'Inflammation reduction', 'Improved mobility', 'Muscle relaxation', 'Detoxification', 'Skin nourishment', 'Stress relief'],
    bestFor: ['Arthritis', 'Sports injuries', 'Frozen shoulder', 'Back pain', 'Sciatica', 'Muscle spasms', 'Chronic pain'],
    whatToExpect: ['Oil application (10 min)', 'Warm poultice massage (55 min)', 'Steam therapy optional (10 min)', 'Rest & herbal tea'],
    preparation: ['Light meal 2 hours before', 'Inform about pain areas', 'Wear comfortable clothing', 'Stay hydrated'],
    locations: [
      { name: 'Siddhalepa Ayurveda Hospital', area: 'Colombo', rating: 4.9 },
      { name: 'Barberyn Beach Resort', area: 'Weligama', rating: 4.8 },
      { name: 'Heritance Ayurveda', area: 'Beruwala', rating: 4.8 }
    ],
    contraindications: ['Fever', 'Open wounds', 'Severe inflammation', 'Skin infections', 'Fractures']
  },
];

// Luxury Retreats
const luxuryRetreats = [
  { id: 'panchakarma', name: 'Royal Panchakarma Retreat', duration: '14 Nights', price: 4500, image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&q=80', resort: 'Anantara Peace Haven', location: 'Tangalle', rating: 5.0, highlights: ['Complete 5-therapy detox', 'Private villa', 'Personal physician', 'Organic cuisine'], description: 'The ultimate purification journey at a world-class beachfront sanctuary.' },
  { id: 'rasayana', name: 'Rasayana Anti-Aging Program', duration: '21 Nights', price: 6800, image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200&q=80', resort: 'Santani Wellness', location: 'Kandy Hills', rating: 5.0, highlights: ['Longevity therapies', 'Mountain retreat', 'Infinity pool', 'Helipad access'], description: 'Reverse aging with ancient Rasayana protocols in the misty highlands.' },
  { id: 'stress-escape', name: 'Executive Stress Escape', duration: '7 Nights', price: 2200, image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&q=80', resort: 'Jetwing Ayurveda Pavilions', location: 'Negombo', rating: 4.9, highlights: ['Daily Shirodhara', 'Sleep restoration', 'Yoga pavilion', 'Beach access'], description: 'Reset your mind and body in private Ayurveda pavilions by the sea.' },
];

// Testimonials
const testimonials = [
  { name: 'Lady Sarah Windsor', title: 'London, UK', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80', quote: 'The Panchakarma experience at Anantara was nothing short of transformative. I returned home feeling 10 years younger.', rating: 5 },
  { name: 'Dr. James Chen', title: 'Singapore', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80', quote: 'As a physician, I was skeptical. After experiencing Shirodhara, I now recommend Sri Lankan Ayurveda to all my patients.', rating: 5 },
  { name: 'Isabella Rossi', title: 'Milan, Italy', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80', quote: 'The attention to detail, the authenticity, the results - this is wellness at its finest. Simply extraordinary.', rating: 5 },
];

// Treatment Detail Modal Component
const TreatmentModal = ({ treatment, onClose, onBook }: { treatment: Treatment; onClose: () => void; onBook: () => void }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a] rounded-2xl border border-amber-500/20"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-amber-500/20 rounded-full transition-colors"
        >
          <X className="w-6 h-6 text-white" />
        </button>

        {/* Hero Image */}
        <div className="relative h-72 md:h-96 overflow-hidden">
          <img src={treatment.image} alt={treatment.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-transparent to-transparent" />
          <div className="absolute bottom-6 left-6 right-6">
            <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 mb-3">{treatment.duration}</Badge>
            <h2 className="text-4xl md:text-5xl font-light text-white mb-2">{treatment.name}</h2>
            <p className="text-amber-400 text-lg">{treatment.sinhala}</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 md:p-10">
          {/* Description */}
          <div className="mb-10">
            <p className="text-white/80 text-lg leading-relaxed font-light">{treatment.fullDescription}</p>
          </div>

          {/* Grid Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            {/* Benefits */}
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center">
                  <Sparkle className="w-5 h-5 text-emerald-400" />
                </div>
                <h3 className="text-xl font-medium text-white">Benefits</h3>
              </div>
              <ul className="space-y-2">
                {treatment.benefits.map((benefit, i) => (
                  <li key={i} className="flex items-center gap-2 text-white/70">
                    <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>

            {/* Best For */}
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-amber-500/20 rounded-full flex items-center justify-center">
                  <Heart className="w-5 h-5 text-amber-400" />
                </div>
                <h3 className="text-xl font-medium text-white">Best For</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {treatment.bestFor.map((item, i) => (
                  <span key={i} className="px-3 py-1 bg-amber-500/10 text-amber-400 text-sm rounded-full border border-amber-500/20">
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* What to Expect */}
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <Clock className="w-5 h-5 text-blue-400" />
                </div>
                <h3 className="text-xl font-medium text-white">What to Expect</h3>
              </div>
              <ol className="space-y-2">
                {treatment.whatToExpect.map((step, i) => (
                  <li key={i} className="flex items-start gap-3 text-white/70">
                    <span className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400 text-sm flex-shrink-0">{i + 1}</span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>

            {/* Preparation */}
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
                  <Info className="w-5 h-5 text-purple-400" />
                </div>
                <h3 className="text-xl font-medium text-white">Preparation</h3>
              </div>
              <ul className="space-y-2">
                {treatment.preparation.map((prep, i) => (
                  <li key={i} className="flex items-center gap-2 text-white/70">
                    <div className="w-1.5 h-1.5 bg-purple-400 rounded-full flex-shrink-0" />
                    {prep}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Available Locations */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-amber-500/20 rounded-full flex items-center justify-center">
                <Building2 className="w-5 h-5 text-amber-400" />
              </div>
              <h3 className="text-xl font-medium text-white">Available Locations</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {treatment.locations.map((location, i) => (
                <div key={i} className="bg-gradient-to-br from-amber-500/10 to-transparent p-4 rounded-xl border border-amber-500/20 hover:border-amber-500/40 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-white font-medium">{location.name}</h4>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span className="text-amber-400 text-sm">{location.rating}</span>
                    </div>
                  </div>
                  <p className="text-white/50 text-sm flex items-center gap-1">
                    <MapPin className="w-3 h-3" />{location.area}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Contraindications */}
          <div className="mb-10 p-4 bg-red-500/10 rounded-xl border border-red-500/20">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-5 h-5 text-red-400" />
              <h4 className="text-red-400 font-medium">Not Recommended For</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {treatment.contraindications.map((item, i) => (
                <span key={i} className="px-3 py-1 bg-red-500/10 text-red-300 text-sm rounded-full">
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Price & Book */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 bg-gradient-to-r from-amber-500/10 to-transparent rounded-xl border border-amber-500/20">
            <div>
              <span className="text-white/50 text-sm">Starting from</span>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-light text-amber-400">${treatment.price}</span>
                <span className="text-white/50">per session</span>
              </div>
            </div>
            <div className="flex gap-4">
              <Button
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 bg-transparent"
                onClick={() => window.open('https://wa.me/94777721999', '_blank')}
              >
                <Phone className="w-4 h-4 mr-2" />
                Enquire
              </Button>
              <Button
                size="lg"
                className="bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-black font-medium px-8"
                onClick={onBook}
              >
                Book This Treatment
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const AyurvedaWellnessLuxury = () => {
  const navigate = useNavigate();
  const [activeRetreat, setActiveRetreat] = useState(0);
  const [selectedTreatment, setSelectedTreatment] = useState<Treatment | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Dynamic data states
  const [treatments, setTreatments] = useState<Treatment[]>(premiumTreatments);
  const [retreats, setRetreats] = useState(luxuryRetreats);
  const [testimonialsList, setTestimonialsList] = useState(testimonials);
  const [settings, setSettings] = useState<AyurvedaPageSettings | null>(null);

  // Fetch data from Firebase
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllAyurvedaData();
        if (data.treatments.length > 0) {
          setTreatments(data.treatments as Treatment[]);
        }
        if (data.retreats.length > 0) {
          setRetreats(data.retreats);
        }
        if (data.testimonials.length > 0) {
          setTestimonialsList(data.testimonials);
        }
        setSettings(data.settings);
      } catch (error) {
        console.error('Error fetching Ayurveda data:', error);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleBookTreatment = (treatment: Treatment) => {
    const params = new URLSearchParams({
      treatment: treatment.id,
      name: treatment.name,
      price: treatment.price.toString(),
      duration: treatment.duration
    });
    navigate(`/booking/ayurveda?${params.toString()}`);
  };

  // Use settings or defaults
  const heroTitle = settings?.heroTitle || 'Sri Lankan Ayurveda';
  const heroSubtitle = settings?.heroSubtitle || 'Where ancient wisdom meets modern luxury';
  const heroSinhalaText = settings?.heroSinhalaText || 'ආයුර්වේද සුවය';
  const heroImageUrl = settings?.heroImageUrl || 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=1920&q=80';
  const ctaTitle = settings?.ctaTitle || 'Begin Your Journey';
  const ctaSubtitle = settings?.ctaSubtitle || 'Let our wellness consultants craft a bespoke Ayurveda experience tailored to your unique constitution';
  const phoneNumber = settings?.phoneNumber || '+94 777 721 999';

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Header />

      {/* ===== CINEMATIC HERO ===== */}
      <section className="relative h-screen overflow-hidden">
        <div className="absolute inset-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
            poster="https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=1920&q=80"
          >
            <source src="https://player.vimeo.com/external/434045526.sd.mp4?s=c27eecc69a27dbc4ff2b87d38afc35f1a9e7c02d&profile_id=164&oauth2_token_id=57447761" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black" />
        </div>

        {/* Decorative Gold Lines */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-amber-500/30 to-transparent" />
          <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-amber-500/30 to-transparent" />
        </div>

        <div className="relative h-full flex flex-col items-center justify-center px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5 }}
            className="mb-8"
          >
            <div className="w-24 h-24 mx-auto mb-6 relative">
              <div className="absolute inset-0 border-2 border-amber-500/50 rounded-full animate-pulse" />
              <div className="absolute inset-2 border border-amber-400/30 rounded-full" />
              <Flower2 className="w-12 h-12 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-amber-400" />
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-amber-400 tracking-[0.4em] uppercase text-sm font-light mb-6"
          >
            5,000 Years of Healing Wisdom
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.5 }}
            className="text-5xl md:text-7xl lg:text-8xl font-light text-white mb-6 tracking-tight"
          >
            <span className="block font-extralight">{heroTitle.split(' ')[0] || 'Sri Lankan'}</span>
            <span className="block font-serif italic text-amber-300">{heroTitle.split(' ').slice(1).join(' ') || 'Ayurveda'}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="text-xl md:text-2xl text-white/70 font-light max-w-2xl mb-4"
          >
            {heroSubtitle}
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="text-amber-500/80 text-lg font-light tracking-wider mb-12"
          >
            {heroSinhalaText}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="flex flex-col sm:flex-row gap-6"
          >
            <Button
              size="lg"
              className="bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-black font-medium px-12 py-7 text-lg tracking-wide"
              onClick={() => document.getElementById('retreats')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <Crown className="mr-3 w-5 h-5" />
              Explore Retreats
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-amber-500/50 text-amber-400 hover:bg-amber-500/10 hover:border-amber-400 px-12 py-7 text-lg tracking-wide bg-transparent"
              onClick={() => document.getElementById('treatments')?.scrollIntoView({ behavior: 'smooth' })}
            >
              View Treatments
            </Button>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2"
          >
            <div className="flex flex-col items-center gap-2">
              <span className="text-amber-500/60 text-xs tracking-[0.3em] uppercase">Scroll</span>
              <div className="w-px h-16 bg-gradient-to-b from-amber-500/60 to-transparent" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== PHILOSOPHY SECTION ===== */}
      <section className="py-32 px-4 bg-gradient-to-b from-[#0a0a0a] via-[#0f0f0f] to-[#0a0a0a] relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-96 h-96 bg-amber-500 rounded-full blur-[150px]" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-amber-600 rounded-full blur-[150px]" />
        </div>

        <div className="container mx-auto max-w-6xl relative">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="text-center mb-20"
          >
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-amber-500/50" />
              <Diamond className="w-5 h-5 text-amber-500" />
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-amber-500/50" />
            </div>
            <h2 className="text-4xl md:text-5xl font-light text-white mb-6">
              The <span className="font-serif italic text-amber-400">Art</span> of Healing
            </h2>
            <p className="text-lg text-white/60 max-w-3xl mx-auto leading-relaxed font-light">
              Ayurveda, the "Science of Life," originated in Sri Lanka over 5,000 years ago. 
              Our island's unique biodiversity provides the finest medicinal herbs, 
              while our master practitioners carry forward an unbroken lineage of healing wisdom.
            </p>
          </motion.div>

          {/* Three Doshas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Vata', element: 'Air & Ether', icon: Wind, color: 'from-sky-400 to-blue-500', desc: 'Movement & creativity' },
              { name: 'Pitta', element: 'Fire & Water', icon: Flame, color: 'from-orange-400 to-red-500', desc: 'Transformation & metabolism' },
              { name: 'Kapha', element: 'Earth & Water', icon: Mountain, color: 'from-emerald-400 to-teal-500', desc: 'Structure & stability' }
            ].map((dosha, index) => (
              <motion.div
                key={dosha.name}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="group"
              >
                <div className="relative p-8 bg-gradient-to-b from-white/5 to-transparent border border-white/10 rounded-2xl hover:border-amber-500/30 transition-all duration-500">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${dosha.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-lg`}>
                    <dosha.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-light text-white mb-2">{dosha.name}</h3>
                  <p className="text-amber-500/80 text-sm tracking-wider uppercase mb-3">{dosha.element}</p>
                  <p className="text-white/50 font-light">{dosha.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SIGNATURE TREATMENTS ===== */}
      <section id="treatments" className="py-32 px-4 bg-[#080808]">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-amber-500 tracking-[0.3em] uppercase text-sm mb-4">Signature Therapies</p>
            <h2 className="text-4xl md:text-5xl font-light text-white">
              Ancient <span className="font-serif italic text-amber-400">Healing</span> Arts
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {treatments.map((treatment, index) => (
              <motion.div
                key={treatment.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group cursor-pointer"
                onClick={() => setSelectedTreatment(treatment)}
              >
                <div className="relative h-[400px] overflow-hidden rounded-xl">
                  <img
                    src={treatment.image}
                    alt={treatment.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                  
                  {/* Content */}
                  <div className="absolute inset-0 p-6 flex flex-col justify-end">
                    <div className="transform group-hover:-translate-y-4 transition-transform duration-500">
                      <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 mb-3">{treatment.duration}</Badge>
                      <h3 className="text-2xl font-light text-white mb-1">{treatment.name}</h3>
                      <p className="text-amber-400/80 text-sm mb-3">{treatment.sinhala}</p>
                      <p className="text-white/60 text-sm font-light line-clamp-2 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        {treatment.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-white/40 text-xs">From</span>
                          <p className="text-2xl font-light text-amber-400">${treatment.price}</p>
                        </div>
                        <Button
                          size="sm"
                          className="bg-amber-500 hover:bg-amber-400 text-black opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTreatment(treatment);
                          }}
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== LUXURY RETREATS ===== */}
      <section id="retreats" className="py-32 px-4 bg-gradient-to-b from-[#080808] to-[#0a0a0a]">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-amber-500 tracking-[0.3em] uppercase text-sm mb-4">Immersive Journeys</p>
            <h2 className="text-4xl md:text-5xl font-light text-white">
              Luxury <span className="font-serif italic text-amber-400">Wellness</span> Retreats
            </h2>
          </motion.div>

          {/* Featured Retreat */}
          <div className="mb-12">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative h-[600px] rounded-2xl overflow-hidden"
            >
              <img
                src={retreats[activeRetreat]?.image}
                alt={retreats[activeRetreat]?.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />
              
              <div className="absolute inset-0 flex items-center">
                <div className="p-12 md:p-16 max-w-2xl">
                  <div className="flex items-center gap-2 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                    <span className="text-white/60 text-sm ml-2">{retreats[activeRetreat].rating} rating</span>
                  </div>
                  
                  <h3 className="text-4xl md:text-5xl font-light text-white mb-4">
                    {retreats[activeRetreat].name}
                  </h3>
                  
                  <div className="flex items-center gap-4 text-white/60 mb-6">
                    <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{retreats[activeRetreat].resort}, {retreats[activeRetreat].location}</span>
                    <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{retreats[activeRetreat].duration}</span>
                  </div>
                  
                  <p className="text-white/70 font-light mb-8 text-lg">
                    {retreats[activeRetreat].description}
                  </p>
                  
                  <div className="flex flex-wrap gap-3 mb-8">
                    {retreats[activeRetreat].highlights.map((h, i) => (
                      <span key={i} className="px-4 py-2 bg-white/10 text-white/80 text-sm rounded-full flex items-center gap-2">
                        <Check className="w-3 h-3 text-amber-400" />{h}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center gap-8">
                    <div>
                      <span className="text-white/40 text-sm">Starting from</span>
                      <p className="text-4xl font-light text-amber-400">${retreats[activeRetreat].price.toLocaleString()}</p>
                    </div>
                    <Button
                      size="lg"
                      className="bg-amber-500 hover:bg-amber-400 text-black font-medium px-8"
                      onClick={() => navigate(`/booking/ayurveda?retreat=${retreats[activeRetreat].id}`)}
                    >
                      Reserve Now
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Retreat Thumbnails */}
          <div className="grid grid-cols-3 gap-4">
            {retreats.map((retreat, index) => (
              <motion.div
                key={retreat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setActiveRetreat(index)}
                className={`relative h-32 rounded-lg overflow-hidden cursor-pointer transition-all duration-500 ${
                  activeRetreat === index ? 'ring-2 ring-amber-500' : 'opacity-60 hover:opacity-100'
                }`}
              >
                <img src={retreat.image} alt={retreat.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-white text-sm font-medium text-center px-4">{retreat.name}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="py-32 px-4 bg-[#0a0a0a] relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber-500 rounded-full blur-[200px]" />
        </div>

        <div className="container mx-auto max-w-6xl relative">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-amber-500 tracking-[0.3em] uppercase text-sm mb-4">Guest Experiences</p>
            <h2 className="text-4xl md:text-5xl font-light text-white">
              Words of <span className="font-serif italic text-amber-400">Transformation</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonialsList.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="relative"
              >
                <div className="p-8 bg-gradient-to-b from-white/5 to-transparent border border-white/10 rounded-2xl">
                  <Quote className="w-10 h-10 text-amber-500/30 mb-6" />
                  <p className="text-white/80 font-light italic leading-relaxed mb-8">
                    "{testimonial.quote}"
                  </p>
                  <div className="flex items-center gap-4">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-14 h-14 rounded-full object-cover border-2 border-amber-500/30"
                    />
                    <div>
                      <p className="text-white font-medium">{testimonial.name}</p>
                      <p className="text-white/50 text-sm">{testimonial.title}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="relative py-40 px-4 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1920&q=80"
            alt="Ayurveda"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/70" />
        </div>

        <div className="relative container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Flower2 className="w-16 h-16 text-amber-500/50 mx-auto mb-8" />
            <h2 className="text-4xl md:text-6xl font-light text-white mb-6">
              {ctaTitle.includes(' ') ? (
                <>{ctaTitle.split(' ').slice(0, -1).join(' ')} <span className="font-serif italic text-amber-400">{ctaTitle.split(' ').slice(-1)}</span></>
              ) : ctaTitle}
            </h2>
            <p className="text-xl text-white/60 font-light mb-12 max-w-2xl mx-auto">
              {ctaSubtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-black font-medium px-12 py-7 text-lg"
                onClick={() => navigate('/booking/ayurveda')}
              >
                <Calendar className="mr-3 w-5 h-5" />
                Book Consultation
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 px-12 py-7 text-lg bg-transparent"
              >
                <Phone className="mr-3 w-5 h-5" />
                {phoneNumber}
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Treatment Detail Modal */}
      <AnimatePresence>
        {selectedTreatment && (
          <TreatmentModal
            treatment={selectedTreatment}
            onClose={() => setSelectedTreatment(null)}
            onBook={() => {
              handleBookTreatment(selectedTreatment);
              setSelectedTreatment(null);
            }}
          />
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default AyurvedaWellnessLuxury;
