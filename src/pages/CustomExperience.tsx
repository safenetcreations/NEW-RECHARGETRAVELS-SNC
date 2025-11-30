import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Sparkles, Calendar, Users, MapPin, Heart, CheckCircle, ArrowRight, ArrowLeft, Phone, Star, Compass, Camera, Mountain, Car, Clock, Shield, Award, MessageCircle, Send, Loader2, Plane, Hotel, Utensils, Map, Binoculars, Palmtree } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { customExperiencePageService } from '@/services/customExperiencePageService';

const SAMPLE_ITINERARIES = [
  { title: '7-Day Cultural Discovery', destinations: 'Colombo → Sigiriya → Kandy → Nuwara Eliya → Galle', highlights: ['Sigiriya Rock Fortress', 'Temple of Tooth', 'Tea Plantations', 'Dutch Fort'], price: '$1,200', image: 'https://images.unsplash.com/photo-1588598198321-9735fd52271e?w=600' },
  { title: '10-Day Wildlife & Beach', destinations: 'Colombo → Yala → Mirissa → Bentota → Colombo', highlights: ['Leopard Safari', 'Whale Watching', 'Beach Relaxation', 'Water Sports'], price: '$1,800', image: 'https://images.unsplash.com/photo-1549366021-9f761d450615?w=600' },
  { title: '14-Day Complete Sri Lanka', destinations: 'Colombo → Anuradhapura → Sigiriya → Kandy → Ella → Yala → Galle', highlights: ['Ancient Cities', 'Hill Country', 'Wildlife', 'Beaches'], price: '$2,500', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600' }
];

const EXPERIENCES = [
  { icon: '🦁', title: 'Wildlife Safari', desc: 'Leopards, elephants & exotic birds in national parks' },
  { icon: '🏛️', title: 'Ancient Temples', desc: 'UNESCO World Heritage sites & sacred places' },
  { icon: '🏖️', title: 'Beach Paradise', desc: 'Pristine beaches, surfing & water sports' },
  { icon: '🍵', title: 'Tea Trails', desc: 'Scenic plantations & tea factory tours' },
  { icon: '🐋', title: 'Whale Watching', desc: 'Blue whales & dolphins in Mirissa' },
  { icon: '🧘', title: 'Ayurveda & Yoga', desc: 'Traditional wellness retreats' }
];

const WHATS_INCLUDED = [
  { icon: Hotel, title: 'Handpicked Hotels', desc: 'From boutique to luxury resorts' },
  { icon: Car, title: 'Private Transport', desc: 'AC vehicle with English-speaking driver' },
  { icon: Utensils, title: 'Authentic Cuisine', desc: 'Local restaurants & cooking classes' },
  { icon: Map, title: 'Expert Guides', desc: 'Knowledgeable local guides at each site' },
  { icon: Plane, title: 'Airport Transfers', desc: 'Seamless pickup & drop-off' },
  { icon: Phone, title: '24/7 Support', desc: 'We\'re always just a call away' }
];

const INTERESTS = [
  { id: 'wildlife', label: 'Wildlife Safari', icon: '🦁' },
  { id: 'culture', label: 'Culture & Heritage', icon: '🏛️' },
  { id: 'beach', label: 'Beach & Coastal', icon: '🏖️' },
  { id: 'adventure', label: 'Adventure', icon: '🧗' },
  { id: 'wellness', label: 'Wellness & Spa', icon: '🧘' },
  { id: 'food', label: 'Food & Culinary', icon: '🍜' },
  { id: 'photography', label: 'Photography', icon: '📷' },
  { id: 'nature', label: 'Mountains', icon: '🏔️' },
  { id: 'family', label: 'Family', icon: '👨‍👩‍��‍👦' },
  { id: 'romantic', label: 'Honeymoon', icon: '💕' },
  { id: 'offbeat', label: 'Off-beat', icon: '🗺️' },
  { id: 'luxury', label: 'Luxury', icon: '👑' }
];

const BUDGETS = ['$1,000 - $2,000', '$2,000 - $3,500', '$3,500 - $5,000', '$5,000 - $7,500', '$7,500+'];

const CustomExperience = () => {
  const [showForm, setShowForm] = useState(false);
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [bookingRef, setBookingRef] = useState('');
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '', country: '',
    startDate: '', duration: '7', groupSize: 2, groupType: 'couple',
    budget: '', accommodation: 'luxury', interests: [] as string[],
    mustSee: '', specialRequests: ''
  });

  const updateForm = (field: string, value: any) => setForm(prev => ({ ...prev, [field]: value }));
  const toggleInterest = (id: string) => setForm(prev => ({
    ...prev, interests: prev.interests.includes(id) ? prev.interests.filter(i => i !== id) : [...prev.interests, id]
  }));

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await customExperiencePageService.submitRequest({
        name: `${form.firstName} ${form.lastName}`, email: form.email, phone: form.phone, country: form.country,
        startDate: form.startDate, endDate: '', flexibleDates: true, groupSize: form.groupSize,
        budget: { amount: parseInt(form.budget.replace(/[^0-9]/g, '')) || 0, currency: 'USD', perPerson: false },
        interests: form.interests, experienceTypes: form.interests, accommodationPreference: form.accommodation,
        mealPreferences: [], specialRequests: `Duration: ${form.duration} days | Group: ${form.groupType} | Must See: ${form.mustSee}\n${form.specialRequests}`,
        previousVisits: false, mobilityRequirements: '', medicalConditions: ''
      });
      setBookingRef(`CUS-${Date.now().toString(36).toUpperCase()}`);
      setSubmitted(true);
    } catch (e) { console.error(e); }
    setSubmitting(false);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
        <Header />
        <div className="min-h-[70vh] flex items-center justify-center px-4 py-20">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-xl text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6"><CheckCircle className="w-10 h-10 text-white" /></div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">Request Received!</h1>
            <p className="text-lg text-amber-600 font-mono mb-2">{bookingRef}</p>
            <p className="text-gray-600 mb-8">Our travel designers will contact you within 24 hours.</p>
            <div className="flex gap-4 justify-center">
              <Button variant="outline" onClick={() => window.location.href = '/'}>Home</Button>
              <Button className="bg-amber-500 hover:bg-amber-600" onClick={() => window.open('https://wa.me/94777721999', '_blank')}><MessageCircle className="w-4 h-4 mr-2" />WhatsApp</Button>
            </div>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      <Helmet><title>Custom Sri Lanka Tours | Design Your Perfect Trip</title></Helmet>
      <Header />

      {/* HERO */}
      <section className="relative py-20 px-4 bg-gradient-to-r from-amber-100 via-orange-50 to-amber-100">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="bg-amber-500 text-white mb-4"><Sparkles className="w-4 h-4 mr-1" />100% Personalized</Badge>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Design Your Perfect <span className="text-amber-600">Sri Lanka</span> Adventure</h1>
              <p className="text-lg text-gray-600 mb-6">Tell us your dream, and our expert travel designers will craft a unique itinerary just for you. From ancient temples to pristine beaches, wildlife safaris to tea plantations.</p>
              <div className="flex flex-wrap gap-3 mb-8">
                {['Fully Customizable', 'Expert Local Guides', 'Best Price Guarantee'].map((item, i) => (
                  <span key={i} className="flex items-center gap-1 text-sm text-gray-700"><CheckCircle className="w-4 h-4 text-green-500" />{item}</span>
                ))}
              </div>
              <div className="flex gap-4">
                <Button size="lg" className="bg-amber-500 hover:bg-amber-600" onClick={() => { setShowForm(true); document.getElementById('form')?.scrollIntoView({ behavior: 'smooth' }); }}>
                  <Compass className="w-5 h-5 mr-2" />Start Planning
                </Button>
                <Button size="lg" variant="outline" onClick={() => window.open('https://wa.me/94777721999', '_blank')}>
                  <MessageCircle className="w-5 h-5 mr-2" />Chat Now
                </Button>
              </div>
            </div>
            <div className="relative">
              <img src="https://images.unsplash.com/photo-1588598198321-9735fd52271e?w=800" alt="Sri Lanka" className="rounded-2xl shadow-2xl" />
              <div className="absolute -bottom-4 -left-4 bg-white rounded-xl p-4 shadow-lg">
                <div className="flex items-center gap-2"><Star className="w-5 h-5 text-amber-500 fill-amber-500" /><span className="font-bold">4.9</span><span className="text-gray-500 text-sm">(500+ trips)</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SAMPLE ITINERARIES */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Popular <span className="text-amber-500">Itineraries</span></h2>
            <p className="text-gray-600">Starting points for your custom adventure - we'll tailor any of these to your preferences</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {SAMPLE_ITINERARIES.map((item, i) => (
              <Card key={i} className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all">
                <img src={item.image} alt={item.title} className="w-full h-48 object-cover" />
                <CardContent className="p-5">
                  <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-500 mb-3">{item.destinations}</p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {item.highlights.map((h, j) => <Badge key={j} variant="outline" className="text-xs">{h}</Badge>)}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-amber-600 font-bold text-lg">From {item.price}</span>
                    <Button size="sm" variant="outline" onClick={() => { setShowForm(true); document.getElementById('form')?.scrollIntoView({ behavior: 'smooth' }); }}>Customize</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* EXPERIENCES */}
      <section className="py-16 px-4 bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Experiences You Can <span className="text-amber-500">Include</span></h2>
            <p className="text-gray-600">Mix and match to create your perfect trip</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {EXPERIENCES.map((exp, i) => (
              <div key={i} className="bg-white rounded-xl p-4 text-center shadow hover:shadow-lg transition-all cursor-pointer" onClick={() => { setShowForm(true); document.getElementById('form')?.scrollIntoView({ behavior: 'smooth' }); }}>
                <span className="text-4xl mb-2 block">{exp.icon}</span>
                <h3 className="font-semibold text-sm mb-1">{exp.title}</h3>
                <p className="text-xs text-gray-500">{exp.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHATS INCLUDED */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">What's <span className="text-amber-500">Included</span></h2>
            <p className="text-gray-600">Everything you need for a worry-free adventure</p>
          </div>
          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-6">
            {WHATS_INCLUDED.map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <item.icon className="w-7 h-7 text-amber-600" />
                </div>
                <h3 className="font-semibold text-sm mb-1">{item.title}</h3>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BOOKING FORM */}
      <section id="form" className="py-16 px-4 bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Plan Your <span className="text-amber-500">Custom Trip</span></h2>
            <p className="text-gray-600">Fill in your details and we'll design the perfect itinerary</p>
          </div>

          <Card className="border-0 shadow-xl bg-white">
            <CardContent className="p-6 md:p-8 bg-white">
              {/* Step Indicator */}
              <div className="flex justify-center gap-2 mb-8">
                {[1, 2, 3].map(s => (
                  <div key={s} className={`h-2 rounded-full transition-all ${step >= s ? 'bg-amber-500 w-12' : 'bg-gray-200 w-8'}`} />
                ))}
              </div>

              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <h3 className="text-xl font-bold mb-4 text-gray-800">Your Details</h3>
                    <div className="grid md:grid-cols-2 gap-4 mb-6">
                      <div><label className="text-sm font-medium block mb-1 text-gray-700">First Name *</label><Input value={form.firstName} onChange={e => updateForm('firstName', e.target.value)} className="h-11 bg-white" /></div>
                      <div><label className="text-sm font-medium block mb-1 text-gray-700">Last Name *</label><Input value={form.lastName} onChange={e => updateForm('lastName', e.target.value)} className="h-11 bg-white" /></div>
                      <div><label className="text-sm font-medium block mb-1 text-gray-700">Email *</label><Input type="email" value={form.email} onChange={e => updateForm('email', e.target.value)} className="h-11 bg-white" /></div>
                      <div><label className="text-sm font-medium block mb-1 text-gray-700">Phone *</label><Input value={form.phone} onChange={e => updateForm('phone', e.target.value)} className="h-11 bg-white" /></div>
                      <div className="md:col-span-2"><label className="text-sm font-medium block mb-1 text-gray-700">Country *</label><Input value={form.country} onChange={e => updateForm('country', e.target.value)} className="h-11 bg-white" /></div>
                    </div>
                    <div className="flex justify-end"><Button className="bg-amber-500 hover:bg-amber-600 text-white" onClick={() => setStep(2)} disabled={!form.firstName || !form.email}>Next <ArrowRight className="w-4 h-4 ml-2" /></Button></div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <h3 className="text-xl font-bold mb-4 text-gray-800">Trip Details</h3>
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div><label className="text-sm font-medium block mb-1 text-gray-700">Start Date</label><Input type="date" value={form.startDate} onChange={e => updateForm('startDate', e.target.value)} className="h-11 bg-white" /></div>
                      <div><label className="text-sm font-medium block mb-1 text-gray-700">Duration</label>
                        <select value={form.duration} onChange={e => updateForm('duration', e.target.value)} className="w-full h-11 border rounded-md px-3 bg-white text-gray-800">
                          {[5,7,10,14,21].map(d => <option key={d} value={d}>{d} days</option>)}
                        </select>
                      </div>
                      <div><label className="text-sm font-medium block mb-1 text-gray-700">Travelers</label>
                        <div className="flex items-center gap-3 h-11">
                          <button className="w-9 h-9 border rounded bg-white text-gray-800 hover:bg-gray-50" onClick={() => updateForm('groupSize', Math.max(1, form.groupSize - 1))}>-</button>
                          <span className="font-semibold text-gray-800">{form.groupSize}</span>
                          <button className="w-9 h-9 border rounded bg-white text-gray-800 hover:bg-gray-50" onClick={() => updateForm('groupSize', form.groupSize + 1)}>+</button>
                        </div>
                      </div>
                      <div><label className="text-sm font-medium block mb-1 text-gray-700">Group Type</label>
                        <select value={form.groupType} onChange={e => updateForm('groupType', e.target.value)} className="w-full h-11 border rounded-md px-3 bg-white text-gray-800">
                          <option value="solo">Solo</option><option value="couple">Couple</option><option value="family">Family</option><option value="friends">Friends</option>
                        </select>
                      </div>
                    </div>
                    <div className="mb-4"><label className="text-sm font-medium block mb-2 text-gray-700">Budget Range</label>
                      <div className="flex flex-wrap gap-2">{BUDGETS.map(b => <button key={b} onClick={() => updateForm('budget', b)} className={`px-4 py-2 rounded-full text-sm border-2 bg-white text-gray-800 ${form.budget === b ? 'border-amber-500 bg-amber-50' : 'border-gray-200 hover:border-amber-300'}`}>{b}</button>)}</div>
                    </div>
                    <div className="flex justify-between"><Button variant="outline" className="bg-white" onClick={() => setStep(1)}><ArrowLeft className="w-4 h-4 mr-2" />Back</Button><Button className="bg-amber-500 hover:bg-amber-600 text-white" onClick={() => setStep(3)}>Next <ArrowRight className="w-4 h-4 ml-2" /></Button></div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <h3 className="text-xl font-bold mb-4 text-gray-800">Interests & Requests</h3>
                    <div className="mb-4"><label className="text-sm font-medium block mb-2 text-gray-700">What interests you? (select all)</label>
                      <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                        {INTERESTS.map(i => <button key={i.id} onClick={() => toggleInterest(i.id)} className={`p-2 rounded-lg text-sm border-2 bg-white text-gray-800 ${form.interests.includes(i.id) ? 'border-amber-500 bg-amber-50' : 'border-gray-200 hover:border-amber-300'}`}><span className="text-lg">{i.icon}</span><div className="text-xs mt-1">{i.label}</div></button>)}
                      </div>
                    </div>
                    <div className="mb-4"><label className="text-sm font-medium block mb-1 text-gray-700">Must-see places?</label><Input value={form.mustSee} onChange={e => updateForm('mustSee', e.target.value)} placeholder="Sigiriya, Yala, Galle..." className="h-11 bg-white" /></div>
                    <div className="mb-6"><label className="text-sm font-medium block mb-1 text-gray-700">Special Requests</label><Textarea value={form.specialRequests} onChange={e => updateForm('specialRequests', e.target.value)} placeholder="Celebrations, dietary needs, accessibility..." rows={3} className="bg-white" /></div>
                    <div className="flex justify-between">
                      <Button variant="outline" className="bg-white" onClick={() => setStep(2)}><ArrowLeft className="w-4 h-4 mr-2" />Back</Button>
                      <Button className="bg-amber-500 hover:bg-amber-600 text-white" onClick={handleSubmit} disabled={submitting}>
                        {submitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Sending...</> : <><Send className="w-4 h-4 mr-2" />Submit Request</>}
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CONTACT CTA */}
      <section className="py-12 px-4 bg-amber-500">
        <div className="container mx-auto max-w-4xl text-center text-white">
          <h2 className="text-2xl font-bold mb-2">Prefer to Talk?</h2>
          <p className="mb-6 text-amber-100">Our experts are available 24/7</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" className="bg-white text-amber-600 hover:bg-amber-50" onClick={() => window.open('https://wa.me/94777721999', '_blank')}><MessageCircle className="w-5 h-5 mr-2" />WhatsApp</Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 bg-transparent"><Phone className="w-5 h-5 mr-2" />+94 777 721 999</Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CustomExperience;
