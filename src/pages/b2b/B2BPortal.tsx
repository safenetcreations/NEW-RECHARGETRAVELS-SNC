import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  Building2, 
  Users, 
  Percent, 
  Globe, 
  Shield, 
  Clock, 
  Headphones,
  ArrowRight,
  CheckCircle2,
  Star
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const features = [
  {
    icon: Percent,
    title: '10% Exclusive Discount',
    description: 'Automatic 10% off on all tour bookings for registered agencies'
  },
  {
    icon: Clock,
    title: 'Real-Time Availability',
    description: 'Instant access to tour availability and booking confirmations'
  },
  {
    icon: Globe,
    title: 'Multi-Currency Support',
    description: 'Book and pay in USD with transparent pricing'
  },
  {
    icon: Shield,
    title: 'Secure Platform',
    description: 'Enterprise-grade security for all transactions and data'
  },
  {
    icon: Headphones,
    title: '24/7 Support',
    description: 'Dedicated support via WhatsApp and email for partners'
  },
  {
    icon: Users,
    title: 'Client Management',
    description: 'Manage bookings and client documents in one place'
  }
];

const benefits = [
  'Access to 50+ curated Sri Lanka tour packages',
  'Instant booking confirmations via WhatsApp & email',
  'Commission-based pricing structure',
  'Dedicated account manager for premium partners',
  'Priority support during peak seasons',
  'Custom itinerary requests supported'
];

const testimonials = [
  {
    name: 'Sarah Mitchell',
    company: 'Wanderlust Travels UK',
    quote: 'Recharge Travels B2B portal has transformed how we book Sri Lanka tours. The 10% discount and instant confirmations are game-changers.',
    rating: 5
  },
  {
    name: 'Hans Weber',
    company: 'Deutsche Reisen GmbH',
    quote: 'Professional, reliable, and excellent service. Our clients love the Sri Lanka experiences booked through Recharge.',
    rating: 5
  }
];

const B2BPortal = () => {
  const navigate = useNavigate();

  const handleRegisterClick = () => {
    navigate('/about/partners/b2b/register');
  };

  const handleLoginClick = () => {
    navigate('/about/partners/b2b/login');
  };

  return (
    <>
      <Helmet>
        <title>B2B Travel Agency Portal | Recharge Travels Sri Lanka</title>
        <meta name="description" content="Partner with Recharge Travels for exclusive B2B tour packages in Sri Lanka. 10% discount, real-time availability, and WhatsApp confirmations." />
      </Helmet>
      
      <Header />
      
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-slate-900 via-emerald-900 to-teal-900 text-white py-24 md:py-32">
          <div className="absolute inset-0 bg-[url('/images/sri-lanka-aerial.jpg')] bg-cover bg-center opacity-20 pointer-events-none" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/30 rounded-full px-4 py-2 mb-6">
                <Building2 className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-medium text-emerald-300">B2B Partner Portal</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Partner With Sri Lanka's
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
                  Premier DMC
                </span>
              </h1>
              
              <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                Join 200+ travel agencies worldwide. Book curated Sri Lanka tours with exclusive 10% discount, real-time availability, and instant WhatsApp confirmations.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-20">
                <button
                  type="button"
                  onClick={handleRegisterClick}
                  className="inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all hover:scale-105 shadow-lg shadow-emerald-500/30 cursor-pointer"
                >
                  Register Your Agency
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={handleLoginClick}
                  className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/30 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all cursor-pointer"
                >
                  Agency Login
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Why Partner With Us?
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Everything you need to offer exceptional Sri Lanka experiences to your clients
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="group p-6 bg-gradient-to-br from-slate-50 to-emerald-50/50 rounded-2xl border border-slate-200/50 hover:border-emerald-300 hover:shadow-xl transition-all duration-300"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{feature.title}</h3>
                  <p className="text-slate-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 bg-gradient-to-br from-slate-900 to-emerald-900 text-white">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Exclusive Partner Benefits
                </h2>
                <p className="text-lg text-white/80 mb-8">
                  As a registered B2B partner, you'll enjoy preferential rates and dedicated support to help grow your Sri Lanka tour business.
                </p>
                <ul className="space-y-4">
                  {benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span className="text-white/90">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
                <h3 className="text-2xl font-bold mb-6">Quick Start Guide</h3>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center font-bold flex-shrink-0">1</div>
                    <div>
                      <h4 className="font-semibold mb-1">Register Your Agency</h4>
                      <p className="text-sm text-white/70">Complete the simple registration form</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center font-bold flex-shrink-0">2</div>
                    <div>
                      <h4 className="font-semibold mb-1">Verify Your Email</h4>
                      <p className="text-sm text-white/70">Click the verification link sent to your email</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center font-bold flex-shrink-0">3</div>
                    <div>
                      <h4 className="font-semibold mb-1">Get Approved</h4>
                      <p className="text-sm text-white/70">Our team reviews and activates your account</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center font-bold flex-shrink-0">4</div>
                    <div>
                      <h4 className="font-semibold mb-1">Start Booking</h4>
                      <p className="text-sm text-white/70">Access exclusive tours with 10% discount</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 bg-slate-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Trusted by Agencies Worldwide
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200/50">
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-slate-700 mb-6 italic">"{testimonial.quote}"</p>
                  <div>
                    <p className="font-semibold text-slate-900">{testimonial.name}</p>
                    <p className="text-sm text-slate-500">{testimonial.company}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Partner With Us?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join our network of travel agencies and start offering exceptional Sri Lanka experiences today.
            </p>
            <button
              type="button"
              onClick={handleRegisterClick}
              className="inline-flex items-center gap-2 bg-white text-emerald-700 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-slate-100 transition-all hover:scale-105 shadow-lg cursor-pointer"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  );
};

export default B2BPortal;
