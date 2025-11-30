import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Leaf, Star, Clock, ChevronRight, Quote, Sparkles, 
  Heart, Shield, Flame, Droplets, Wind, Sun, Moon, Mountain,
  Calendar, MapPin, Check, Phone, MessageCircle, Award,
  Flower2, TreePine, CircleDot, Zap, Brain
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Dosha Types
const doshaTypes = [
  { name: 'Vata', element: 'Air & Space', icon: Wind, color: 'from-sky-500 to-blue-600', characteristics: ['Creative', 'Quick thinking', 'Flexible'], imbalance: 'Anxiety, dry skin, insomnia', treatment: 'Warm oils, grounding foods' },
  { name: 'Pitta', element: 'Fire & Water', icon: Flame, color: 'from-orange-500 to-red-600', characteristics: ['Focused', 'Ambitious', 'Strong digestion'], imbalance: 'Inflammation, anger, skin rashes', treatment: 'Cooling therapies, relaxation' },
  { name: 'Kapha', element: 'Earth & Water', icon: Mountain, color: 'from-emerald-500 to-teal-600', characteristics: ['Calm', 'Steady', 'Compassionate'], imbalance: 'Weight gain, lethargy, congestion', treatment: 'Stimulating massage, exercise' }
];

// Signature Treatments
const signatureTreatments = [
  { id: 'shirodhara', name: 'Shirodhara', sinhala: 'ශිරෝධාරා', duration: '60 min', price: 85, image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80', description: 'Warm medicated oil continuously poured on forehead. Calms mind, treats insomnia.', benefits: ['Deep relaxation', 'Mental clarity', 'Better sleep'], bestFor: ['Anxiety', 'Insomnia', 'Migraines'] },
  { id: 'abhyanga', name: 'Abhyanga', sinhala: 'අභ්‍යංග', duration: '75 min', price: 95, image: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=800&q=80', description: 'Four-hand synchronized full-body massage with warm herbal oils.', benefits: ['Improved circulation', 'Toxin removal', 'Skin nourishment'], bestFor: ['Muscle tension', 'Poor circulation', 'Fatigue'] },
  { id: 'pizhichil', name: 'Pizhichil', sinhala: 'පිළිචිල්', duration: '90 min', price: 150, image: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=800&q=80', description: 'Royal treatment - lukewarm oil squeezed over body with synchronized massage.', benefits: ['Deep tissue healing', 'Anti-aging', 'Pain relief'], bestFor: ['Arthritis', 'Paralysis', 'Anti-aging'] },
  { id: 'udvartana', name: 'Udvartana', sinhala: 'උද්වර්තන', duration: '60 min', price: 75, image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=80', description: 'Energizing herbal powder massage for weight management.', benefits: ['Weight loss', 'Skin toning', 'Cellulite reduction'], bestFor: ['Weight management', 'Water retention'] },
  { id: 'nasya', name: 'Nasya', sinhala: 'නස්‍ය', duration: '45 min', price: 55, image: 'https://images.unsplash.com/photo-1552693673-1bf958298935?w=800&q=80', description: 'Nasal administration of medicated oils for mental clarity.', benefits: ['Sinus clearing', 'Mental clarity', 'Headache relief'], bestFor: ['Sinusitis', 'Migraines', 'Mental fog'] },
  { id: 'elakizhi', name: 'Elakizhi', sinhala: 'එළකිළි', duration: '75 min', price: 110, image: 'https://images.unsplash.com/photo-1591343395082-e120087004b4?w=800&q=80', description: 'Massage using warm poultices with medicinal leaves and herbs.', benefits: ['Joint pain relief', 'Inflammation reduction'], bestFor: ['Arthritis', 'Sports injuries', 'Chronic pain'] },
  { id: 'navarakizhi', name: 'Navarakizhi', sinhala: 'නවරකිළි', duration: '90 min', price: 130, image: 'https://images.unsplash.com/photo-1519824145371-296894a0daa9?w=800&q=80', description: 'Luxurious treatment with Navara rice boluses cooked in milk.', benefits: ['Skin rejuvenation', 'Muscle strengthening'], bestFor: ['Muscular dystrophy', 'Anti-aging'] },
  { id: 'kativasti', name: 'Kati Vasti', sinhala: 'කටි වස්ති', duration: '45 min', price: 65, image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80', description: 'Warm oil retained on lower back for spinal issues.', benefits: ['Lower back pain relief', 'Spinal health'], bestFor: ['Lower back pain', 'Sciatica'] }
];

// Panchakarma
const panchakarmaTreatments = [
  { name: 'Vamana', description: 'Therapeutic vomiting to eliminate Kapha toxins', duration: '1-2 days', icon: Droplets },
  { name: 'Virechana', description: 'Purgation therapy to cleanse Pitta toxins', duration: '1-2 days', icon: Flame },
  { name: 'Vasti', description: 'Medicated enema to balance Vata', duration: '8-30 days', icon: Wind },
  { name: 'Nasya', description: 'Nasal administration to purify head region', duration: '7 days', icon: Brain },
  { name: 'Raktamokshana', description: 'Blood purification therapy', duration: '1 day', icon: Heart }
];

// Wellness Packages
const wellnessPackages = {
  detox: [
    { id: 'purification', name: 'Complete Purification Retreat', duration: '14 Nights', price: 3200, originalPrice: 3800, image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=800&q=80', location: 'Siddhalepa Ayurveda Resort, Wadduwa', rating: 4.9, reviews: 127, highlights: ['Full Panchakarma', 'Doctor supervision', 'Beachfront'], includes: ['Comprehensive Panchakarma therapy', 'Daily Ayurvedic consultations', 'Personalized herbal medicines', '3 Ayurvedic meals daily', 'Yoga & meditation', 'Luxury accommodation'], description: 'Complete detoxification following authentic Panchakarma protocols.' },
    { id: 'weekend-detox', name: 'Weekend Detox Escape', duration: '3 Nights', price: 650, originalPrice: 780, image: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=800&q=80', location: 'Barberyn Beach Resort, Weligama', rating: 4.8, reviews: 89, highlights: ['Quick reset', 'Ocean views', 'Organic meals'], includes: ['Dosha consultation', 'Daily Abhyanga massage', 'Shirodhara treatment', 'Herbal steam bath', 'Detox diet meals', 'Yoga sessions'], description: 'Perfect weekend escape for busy professionals.' }
  ],
  rejuvenation: [
    { id: 'rasayana', name: 'Rasayana Rejuvenation Program', duration: '21 Nights', price: 4500, originalPrice: 5200, image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=80', location: 'Jetwing Ayurveda Pavilions, Negombo', rating: 5.0, reviews: 156, highlights: ['Anti-aging focus', 'Royal treatments', 'Luxury pavilions'], includes: ['Complete Rasayana therapy', 'Anti-aging treatments', 'Navarakizhi sessions', 'Pizhichil royal treatment', 'Organic sattvic cuisine', 'Private yoga instruction'], description: 'Ultimate rejuvenation using Rasayana longevity therapies.' },
    { id: 'vitality', name: 'Vitality Boost Week', duration: '7 Nights', price: 1400, originalPrice: 1650, image: 'https://images.unsplash.com/photo-1519824145371-296894a0daa9?w=800&q=80', location: 'Santani Wellness Resort, Kandy', rating: 4.9, reviews: 203, highlights: ['Mountain retreat', 'Energy focus', 'Organic cuisine'], includes: ['Energy restoration treatments', 'Daily Abhyanga & Shirodhara', 'Herbal tonics', 'Mountain yoga', 'Farm-to-table meals', 'Nature meditation'], description: 'Restore depleted energy in the scenic hills of Kandy.' }
  ],
  stress: [
    { id: 'mental-wellness', name: 'Mental Wellness Sanctuary', duration: '14 Nights', price: 2800, originalPrice: 3300, image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80', location: 'Ulpotha Yoga Village, Kurunegala', rating: 4.9, reviews: 178, highlights: ['Digital detox', 'Village experience', 'Deep relaxation'], includes: ['Stress & anxiety protocols', 'Daily Shirodhara therapy', 'Mindfulness meditation', 'Pranayama breathing', 'Digital detox', 'Nature immersion'], description: 'Escape modern stress in an authentic village setting.' },
    { id: 'executive', name: 'Executive De-Stress Program', duration: '5 Nights', price: 1100, originalPrice: 1300, image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80', location: 'Anantara Peace Haven, Tangalle', rating: 4.8, reviews: 145, highlights: ['Luxury resort', 'Quick results', 'Privacy focused'], includes: ['Stress assessment', 'Daily therapeutic massage', 'Shirodhara sessions', 'Sleep restoration', 'Executive coaching', 'Luxury suite'], description: 'Maximum relaxation in minimum time at luxury resort.' }
  ],
  weight: [
    { id: 'transformation', name: 'Weight Transformation Journey', duration: '28 Nights', price: 5800, originalPrice: 6800, image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80', location: 'Amanwella Ayurveda Centre, Tangalle', rating: 4.9, reviews: 92, highlights: ['Proven results', 'Sustainable approach', 'Lifestyle change'], includes: ['Metabolic assessment', 'Udvartana powder massage', 'Specialized weight loss diet', 'Yoga for weight loss', 'Herbal fat-burning treatments', 'Post-program diet plan'], description: 'Comprehensive weight management. Average loss 8-12 kg.' },
    { id: 'slim-trim', name: 'Slim & Trim Kickstart', duration: '10 Nights', price: 1900, originalPrice: 2200, image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80', location: 'Heritance Ayurveda, Beruwala', rating: 4.7, reviews: 118, highlights: ['Quick start', 'Beach resort', 'Active program'], includes: ['Weight loss consultation', 'Daily Udvartana massage', 'Herbal steam therapy', 'Ayurvedic meals', 'Fitness sessions', 'Body wraps'], description: 'Jump-start your weight loss journey.' }
  ],
  women: [
    { id: 'feminine', name: 'Feminine Wellness Retreat', duration: '14 Nights', price: 3400, originalPrice: 3900, image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80', location: 'Ayurveda Retreat, Bentota', rating: 4.9, reviews: 167, highlights: ['Women only', 'Hormonal balance', 'Community'], includes: ['Women\'s health consultation', 'Hormonal balance treatments', 'Specialized herbal medicines', 'Women\'s yoga', 'Nutrition counseling', 'Sisterhood circles'], description: 'Specialized program for women\'s health issues.' }
  ],
  specialty: [
    { id: 'arthritis', name: 'Arthritis & Joint Care Program', duration: '21 Nights', price: 4200, originalPrice: 4800, image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=80', location: 'Siddhalepa Ayurveda Hospital, Colombo', rating: 4.9, reviews: 234, highlights: ['Medical focus', 'Hospital setting', 'Proven protocols'], includes: ['Orthopedic consultation', 'Elakizhi therapy', 'Janu Vasti', 'Kati Vasti', 'Physiotherapy', 'Anti-inflammatory diet'], description: 'Clinically proven program for arthritis and joint pain.' },
    { id: 'skin-beauty', name: 'Skin & Beauty Transformation', duration: '14 Nights', price: 2600, originalPrice: 3000, image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=80', location: 'Fortress Resort & Spa, Galle', rating: 4.8, reviews: 156, highlights: ['Glowing skin', 'Natural beauty', 'Luxury resort'], includes: ['Skin analysis', 'Mukhalepam facials', 'Full body treatments', 'Blood purification', 'Beauty diet', 'Skincare kit'], description: 'Achieve radiant skin through ancient beauty secrets.' }
  ]
};

// Premier Resorts
const premierResorts = [
  { name: 'Santani Wellness Resort', location: 'Kandy Hills', image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80', rating: 5.0, priceRange: '$$$', specialty: 'Mountain wellness & detox' },
  { name: 'Anantara Peace Haven', location: 'Tangalle', image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80', rating: 5.0, priceRange: '$$$', specialty: 'Luxury beachfront wellness' },
  { name: 'Jetwing Ayurveda Pavilions', location: 'Negombo', image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80', rating: 4.9, priceRange: '$$', specialty: 'Authentic Panchakarma' },
  { name: 'Siddhalepa Ayurveda Resort', location: 'Wadduwa', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80', rating: 4.9, priceRange: '$$', specialty: 'Traditional medicine heritage' },
  { name: 'Ulpotha Yoga Village', location: 'Kurunegala', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80', rating: 4.8, priceRange: '$', specialty: 'Eco-village experience' },
  { name: 'Barberyn Beach Resort', location: 'Weligama', image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&q=80', rating: 4.8, priceRange: '$$', specialty: 'Beach & Ayurveda fusion' }
];

// Testimonials
const testimonials = [
  { name: 'Sarah Mitchell', country: 'United Kingdom', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80', rating: 5, program: 'Complete Purification Retreat', comment: 'After 14 days of Panchakarma at Siddhalepa, I feel like a completely different person. I\'ve lost 6kg and my chronic fatigue has disappeared.' },
  { name: 'Dr. Michael Chen', country: 'Singapore', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80', rating: 5, program: 'Executive De-Stress Program', comment: 'As a surgeon, I was skeptical. But Shirodhara completely changed my sleep patterns. I now sleep 7 hours straight for the first time in years.' },
  { name: 'Emma Johansson', country: 'Sweden', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80', rating: 5, program: 'Rasayana Rejuvenation', comment: 'The 21-day Rasayana program was life-changing. My skin is glowing, my energy is incredible, and I\'ve never felt more at peace.' }
];

const stats = [
  { value: '5,000+', label: 'Years of Tradition' },
  { value: '50+', label: 'Certified Doctors' },
  { value: '2,500+', label: 'Guests Annually' },
  { value: '98%', label: 'Satisfaction Rate' }
];

const AyurvedaWellnessNew = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('detox');
  const [selectedTreatment, setSelectedTreatment] = useState<string | null>(null);

  const handleBookPackage = (pkg: any) => {
    const params = new URLSearchParams({ package: pkg.name, price: pkg.price.toString(), duration: pkg.duration, location: pkg.location, type: 'retreat' });
    navigate(`/booking/ayurveda?${params.toString()}`);
  };

  const handleBookTreatment = (treatment: any) => {
    const params = new URLSearchParams({ package: treatment.name, price: treatment.price.toString(), duration: treatment.duration, type: 'treatment' });
    navigate(`/booking/ayurveda?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-amber-50/30 to-white">
      <Header />

      {/* HERO */}
      <section className="relative min-h-[100vh] overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=1920&q=80" alt="Ayurveda" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/80 via-emerald-900/60 to-emerald-950/90" />
        </div>
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-40 right-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>
        <div className="relative min-h-[100vh] flex items-center justify-center px-4 pt-20">
          <div className="max-w-5xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="mb-6">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/20 backdrop-blur-sm rounded-full text-amber-300 text-sm font-medium border border-amber-500/30">
                <Flower2 className="w-4 h-4" />5,000 Years of Healing Wisdom
              </span>
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.2 }} className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight">
              <span className="block">Sri Lankan</span>
              <span className="block bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent">Ayurveda & Wellness</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.4 }} className="text-xl md:text-2xl text-emerald-100/90 mb-8 max-w-3xl mx-auto">
              Experience authentic healing at world-renowned wellness retreats. From royal Panchakarma therapies to rejuvenating spa treatments.
            </motion.p>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.5 }} className="text-lg text-amber-400/80 font-medium mb-10">
              ආයුර්වේද සුවය · ශ්‍රී ලංකාවේ සම්ප්‍රදායික වෛද්‍ය විද්‍යාව
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.6 }} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-emerald-950 font-bold px-8 py-6 text-lg rounded-full shadow-xl" onClick={() => document.getElementById('packages')?.scrollIntoView({ behavior: 'smooth' })}>
                <Leaf className="mr-2 w-5 h-5" />Explore Retreats
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-white/30 text-white hover:bg-white/10 px-8 py-6 text-lg rounded-full backdrop-blur-sm" onClick={() => document.getElementById('treatments')?.scrollIntoView({ behavior: 'smooth' })}>
                View Treatments<ChevronRight className="ml-2 w-5 h-5" />
              </Button>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.8 }} className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center p-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
                  <div className="text-3xl md:text-4xl font-bold text-amber-400 mb-1">{stat.value}</div>
                  <div className="text-sm text-emerald-200/80">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* DOSHA SECTION */}
      <section className="py-24 px-4 bg-white">
        <div className="container mx-auto max-w-7xl">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 rounded-full text-emerald-700 text-sm font-medium mb-4"><CircleDot className="w-4 h-4" />Understanding Your Constitution</span>
            <h2 className="text-4xl md:text-5xl font-bold text-emerald-900 mb-4">The Three Doshas</h2>
            <p className="text-lg text-emerald-700/80 max-w-3xl mx-auto">In Ayurveda, health is achieved by balancing the three fundamental energies (doshas) that govern all physical and mental processes.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {doshaTypes.map((dosha, index) => (
              <motion.div key={dosha.name} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.2 }} className="group">
                <Card className="h-full border-0 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden">
                  <div className={`h-2 bg-gradient-to-r ${dosha.color}`} />
                  <CardContent className="p-8">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${dosha.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                      <dosha.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-emerald-900 mb-2">{dosha.name}</h3>
                    <p className="text-emerald-600 font-medium mb-4">{dosha.element}</p>
                    <div className="space-y-4">
                      <div><p className="text-sm text-emerald-500 font-medium mb-2">Characteristics</p><div className="flex flex-wrap gap-2">{dosha.characteristics.map((c, i) => <Badge key={i} variant="outline" className="border-emerald-200 text-emerald-700">{c}</Badge>)}</div></div>
                      <div><p className="text-sm text-emerald-500 font-medium mb-1">When Imbalanced</p><p className="text-sm text-emerald-700/70">{dosha.imbalance}</p></div>
                      <div><p className="text-sm text-emerald-500 font-medium mb-1">Treatment</p><p className="text-sm text-emerald-700/70">{dosha.treatment}</p></div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Button variant="outline" className="border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white" onClick={() => navigate('/booking/ayurveda?type=consultation')}>
              <Brain className="mr-2 w-4 h-4" />Get Your Dosha Assessment
            </Button>
          </div>
        </div>
      </section>

      {/* TREATMENTS SECTION */}
      <section id="treatments" className="py-24 px-4 bg-gradient-to-b from-emerald-50 to-amber-50/50">
        <div className="container mx-auto max-w-7xl">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 rounded-full text-amber-700 text-sm font-medium mb-4"><Sparkles className="w-4 h-4" />Ancient Healing Arts</span>
            <h2 className="text-4xl md:text-5xl font-bold text-emerald-900 mb-4">Signature Ayurvedic Treatments</h2>
            <p className="text-lg text-emerald-700/80 max-w-3xl mx-auto">Experience time-honored therapies passed down through generations. Each treatment is personalized for your constitution.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {signatureTreatments.map((treatment, index) => (
              <motion.div key={treatment.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }}>
                <Card className={`h-full border-0 shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer group overflow-hidden ${selectedTreatment === treatment.id ? 'ring-2 ring-amber-500' : ''}`} onClick={() => setSelectedTreatment(selectedTreatment === treatment.id ? null : treatment.id)}>
                  <div className="relative h-48 overflow-hidden">
                    <img src={treatment.image} alt={treatment.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/80 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <Badge className="bg-amber-500 text-emerald-950 mb-2">{treatment.duration}</Badge>
                      <h3 className="text-lg font-bold text-white">{treatment.name}</h3>
                      <p className="text-amber-300 text-sm">{treatment.sinhala}</p>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <p className="text-emerald-700/80 text-sm mb-3 line-clamp-2">{treatment.description}</p>
                    {selectedTreatment === treatment.id && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-3 mb-4">
                        <div><p className="text-xs text-emerald-500 font-medium mb-1">Benefits</p><div className="flex flex-wrap gap-1">{treatment.benefits.map((b, i) => <span key={i} className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">{b}</span>)}</div></div>
                        <div><p className="text-xs text-emerald-500 font-medium mb-1">Best For</p><div className="flex flex-wrap gap-1">{treatment.bestFor.map((b, i) => <span key={i} className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">{b}</span>)}</div></div>
                      </motion.div>
                    )}
                    <div className="flex items-center justify-between pt-3 border-t border-emerald-100">
                      <div><span className="text-xs text-emerald-500">From</span><p className="text-xl font-bold text-amber-600">${treatment.price}</p></div>
                      <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700" onClick={(e) => { e.stopPropagation(); handleBookTreatment(treatment); }}>Book</Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PANCHAKARMA SECTION */}
      <section className="py-24 px-4 bg-emerald-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"><div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=1920&q=80')] bg-cover bg-center" /></div>
        <div className="container mx-auto max-w-7xl relative">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/20 rounded-full text-amber-400 text-sm font-medium mb-4"><Shield className="w-4 h-4" />The Royal Detox</span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Panchakarma: Five Sacred Purifications</h2>
            <p className="text-lg text-emerald-100/80 max-w-3xl mx-auto">The most profound detoxification and rejuvenation therapy in Ayurveda.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {panchakarmaTreatments.map((treatment, index) => (
              <motion.div key={treatment.name} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="bg-emerald-800/50 backdrop-blur-sm rounded-2xl p-6 border border-emerald-700/50 text-center">
                <div className="w-14 h-14 mx-auto mb-4 bg-amber-500/20 rounded-full flex items-center justify-center"><treatment.icon className="w-7 h-7 text-amber-400" /></div>
                <h3 className="text-lg font-bold text-white mb-2">{treatment.name}</h3>
                <p className="text-emerald-200/70 text-sm mb-3">{treatment.description}</p>
                <Badge className="bg-emerald-700 text-emerald-100">{treatment.duration}</Badge>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-emerald-950 font-bold" onClick={() => navigate('/booking/ayurveda?package=Panchakarma')}>
              Enquire About Panchakarma<ChevronRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* WELLNESS PACKAGES */}
      <section id="packages" className="py-24 px-4 bg-white">
        <div className="container mx-auto max-w-7xl">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 rounded-full text-emerald-700 text-sm font-medium mb-4"><Award className="w-4 h-4" />Curated Programs</span>
            <h2 className="text-4xl md:text-5xl font-bold text-emerald-900 mb-4">Wellness Retreat Packages</h2>
            <p className="text-lg text-emerald-700/80 max-w-3xl mx-auto">All-inclusive wellness journeys at Sri Lanka's finest Ayurveda resorts.</p>
          </motion.div>
          <Tabs defaultValue="detox" className="w-full" onValueChange={setActiveCategory}>
            <TabsList className="flex flex-wrap justify-center gap-2 mb-12 bg-transparent">
              {[{ value: 'detox', label: 'Detox & Cleanse', icon: Droplets }, { value: 'rejuvenation', label: 'Rejuvenation', icon: Sun }, { value: 'stress', label: 'Stress Relief', icon: Moon }, { value: 'weight', label: 'Weight Management', icon: Zap }, { value: 'women', label: "Women's Health", icon: Heart }, { value: 'specialty', label: 'Specialty Care', icon: Shield }].map((tab) => (
                <TabsTrigger key={tab.value} value={tab.value} className={`px-6 py-3 rounded-full font-medium transition-all ${activeCategory === tab.value ? 'bg-emerald-600 text-white shadow-lg' : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'}`}>
                  <tab.icon className="w-4 h-4 mr-2" />{tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
            {Object.entries(wellnessPackages).map(([category, packages]) => (
              <TabsContent key={category} value={category}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {packages.map((pkg, index) => (
                    <motion.div key={pkg.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }}>
                      <Card className="h-full border-0 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden group">
                        <div className="flex flex-col md:flex-row h-full">
                          <div className="md:w-2/5 relative h-64 md:h-auto overflow-hidden">
                            <img src={pkg.image} alt={pkg.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                            <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-emerald-900/60 to-transparent" />
                            {pkg.originalPrice > pkg.price && <Badge className="absolute top-4 left-4 bg-red-500 text-white">Save ${pkg.originalPrice - pkg.price}</Badge>}
                          </div>
                          <div className="md:w-3/5 p-6 flex flex-col">
                            <div className="flex items-start justify-between mb-3">
                              <div><h3 className="text-xl font-bold text-emerald-900 mb-1">{pkg.name}</h3><div className="flex items-center gap-2 text-sm text-emerald-600"><MapPin className="w-4 h-4" />{pkg.location}</div></div>
                              <div className="flex items-center gap-1"><Star className="w-4 h-4 fill-amber-400 text-amber-400" /><span className="font-bold text-emerald-900">{pkg.rating}</span><span className="text-emerald-600 text-sm">({pkg.reviews})</span></div>
                            </div>
                            <div className="flex items-center gap-4 mb-4">
                              <Badge variant="outline" className="border-emerald-200 text-emerald-700"><Calendar className="w-3 h-3 mr-1" />{pkg.duration}</Badge>
                              {pkg.highlights.map((h, i) => <Badge key={i} className="bg-amber-100 text-amber-700 border-0">{h}</Badge>)}
                            </div>
                            <p className="text-emerald-700/80 text-sm mb-4 line-clamp-2">{pkg.description}</p>
                            <div className="flex-1"><p className="text-xs text-emerald-500 font-medium mb-2">Package Includes:</p><div className="grid grid-cols-2 gap-1 mb-4">{pkg.includes.slice(0, 6).map((item, i) => <div key={i} className="flex items-center gap-1 text-xs text-emerald-700"><Check className="w-3 h-3 text-emerald-500 flex-shrink-0" /><span className="truncate">{item}</span></div>)}</div></div>
                            <div className="flex items-center justify-between pt-4 border-t border-emerald-100">
                              <div><span className="text-xs text-emerald-500">From</span><div className="flex items-baseline gap-2"><span className="text-2xl font-bold text-amber-600">${pkg.price}</span>{pkg.originalPrice > pkg.price && <span className="text-sm text-emerald-400 line-through">${pkg.originalPrice}</span>}</div><span className="text-xs text-emerald-500">per person</span></div>
                              <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={() => handleBookPackage(pkg)}>Book Now<ChevronRight className="ml-1 w-4 h-4" /></Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* RESORTS */}
      <section className="py-24 px-4 bg-gradient-to-b from-amber-50/50 to-white">
        <div className="container mx-auto max-w-7xl">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 rounded-full text-amber-700 text-sm font-medium mb-4"><TreePine className="w-4 h-4" />Premier Destinations</span>
            <h2 className="text-4xl md:text-5xl font-bold text-emerald-900 mb-4">World-Class Ayurveda Resorts</h2>
            <p className="text-lg text-emerald-700/80 max-w-3xl mx-auto">Our partner resorts combine authentic Ayurvedic healing with luxury accommodation.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {premierResorts.map((resort, index) => (
              <motion.div key={resort.name} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }}>
                <Card className="h-full border-0 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden group">
                  <div className="relative h-56 overflow-hidden">
                    <img src={resort.image} alt={resort.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/80 to-transparent" />
                    <div className="absolute top-4 right-4 flex items-center gap-1 px-2 py-1 bg-white/90 rounded-full"><Star className="w-4 h-4 fill-amber-500 text-amber-500" /><span className="font-bold text-emerald-900">{resort.rating}</span></div>
                    <div className="absolute bottom-4 left-4 right-4"><h3 className="text-xl font-bold text-white mb-1">{resort.name}</h3><p className="text-emerald-200 text-sm flex items-center gap-1"><MapPin className="w-3 h-3" />{resort.location}</p></div>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2"><Badge className="bg-emerald-100 text-emerald-700">{resort.specialty}</Badge><span className="text-amber-600 font-bold">{resort.priceRange}</span></div>
                    <Button variant="outline" className="w-full border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white mt-2">View Packages</Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 px-4 bg-emerald-900">
        <div className="container mx-auto max-w-6xl">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <span className="text-amber-400 font-medium tracking-wider uppercase text-sm">Guest Experiences</span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mt-4">What Our Guests Say</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div key={index} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="bg-emerald-800/50 backdrop-blur-sm rounded-2xl p-6 border border-emerald-700/50">
                <Quote className="w-10 h-10 text-amber-500/50 mb-4" />
                <p className="text-emerald-100 mb-6 italic">"{testimonial.comment}"</p>
                <div className="flex items-center gap-4">
                  <img src={testimonial.image} alt={testimonial.name} className="w-12 h-12 rounded-full object-cover" />
                  <div><p className="text-white font-semibold">{testimonial.name}</p><p className="text-emerald-300 text-sm">{testimonial.country}</p></div>
                  <div className="ml-auto flex">{[...Array(testimonial.rating)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-32 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center bg-fixed" style={{ backgroundImage: `url(https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1920&q=80)` }}>
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/90 to-amber-900/80" />
        </div>
        <div className="relative container mx-auto max-w-4xl text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Begin Your Wellness Journey</h2>
            <p className="text-xl text-emerald-100 mb-10 max-w-2xl mx-auto">Let our experts craft a personalized retreat experience just for you</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-emerald-900 font-semibold px-10 py-6 text-lg rounded-full shadow-lg" onClick={() => navigate('/booking/ayurveda')}>
                <Calendar className="mr-2 w-5 h-5" />Book Your Retreat
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-10 py-6 text-lg rounded-full">
                <Phone className="mr-2 w-5 h-5" />Call +94 777 721 999
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AyurvedaWellnessNew;
