import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { 
  HeartHandshake, TrendingUp, Shield, Calendar, Smartphone, DollarSign, ArrowRight, CheckCircle,
  Car, Truck, Bus, Star, Users, Clock, FileCheck, CreditCard, ChevronDown, ChevronUp,
  MapPin, Phone, Mail, BadgeCheck, Zap, BarChart3, Wallet, MessageSquare
} from 'lucide-react';

const benefits = [
  { icon: DollarSign, title: 'Earn Extra Income', description: 'Turn your idle vehicle into a money-making asset. Owners earn $200-500/month on average.' },
  { icon: Calendar, title: 'Flexible Availability', description: 'Set your own schedule. Block dates when you need your vehicle. Full control.' },
  { icon: Shield, title: 'Protected Rentals', description: 'Comprehensive insurance coverage for every booking. Verified customers only.' },
  { icon: Smartphone, title: 'Easy Management', description: 'Manage bookings, earnings & calendar from any device. Real-time notifications.' }
];

const howItWorks = [
  { step: 1, title: 'Register & Verify', description: 'Create your owner account and submit required documents for verification.', icon: FileCheck },
  { step: 2, title: 'List Your Vehicle', description: 'Add your vehicle details, photos, pricing, and availability calendar.', icon: Car },
  { step: 3, title: 'Accept Bookings', description: 'Review booking requests and accept the ones that work for you.', icon: Calendar },
  { step: 4, title: 'Get Paid', description: 'Receive payments directly to your bank account after each completed rental.', icon: Wallet }
];

const vehicleTypes = [
  { type: 'Cars', icon: Car, examples: 'Sedan, Hatchback, SUV', popular: true },
  { type: 'Vans', icon: Truck, examples: 'KDH, Hiace, Caravan', popular: true },
  { type: 'Luxury', icon: Star, examples: 'BMW, Mercedes, Audi', popular: false },
  { type: 'Mini Bus', icon: Bus, examples: 'Rosa, Coaster (up to 30 seats)', popular: false }
];

const testimonials = [
  {
    name: 'Kamal Perera',
    location: 'Colombo',
    vehicle: 'Toyota Prado',
    earnings: '$450/month',
    quote: 'Best decision I made. My Prado earns money when I\'m at office. The platform handles everything!',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
  },
  {
    name: 'Nimal Fernando',
    location: 'Kandy',
    vehicle: 'Toyota KDH Van',
    earnings: '$380/month',
    quote: 'Tourist bookings are great. Reliable payments every week. Highly recommend for van owners.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face'
  },
  {
    name: 'Suresh Kumar',
    location: 'Negombo',
    vehicle: 'Suzuki Alto',
    earnings: '$180/month',
    quote: 'Even my small car makes good money. Perfect for tourists on budget. Easy to manage!',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
  }
];

const faqs = [
  {
    question: 'How much can I earn?',
    answer: 'Earnings depend on your vehicle type, location, and availability. On average, owners earn $200-500/month. Premium vehicles and vans can earn $500-800/month during peak tourist seasons.'
  },
  {
    question: 'What documents do I need?',
    answer: 'You need: National ID, Driving License, Vehicle Registration, Vehicle Insurance (valid), and Revenue License. Business owners need business registration documents.'
  },
  {
    question: 'Is my vehicle insured during rentals?',
    answer: 'Yes! Every booking includes comprehensive insurance coverage. We also verify all renters and require a security deposit for protection.'
  },
  {
    question: 'How and when do I get paid?',
    answer: 'Payments are processed within 24 hours after rental completion. Money is transferred directly to your bank account. You can track all earnings in your dashboard.'
  },
  {
    question: 'Can I set my own prices?',
    answer: 'Yes! You have full control over your daily rates. We provide suggested pricing based on market data, but you decide the final price.'
  },
  {
    question: 'What if a renter damages my vehicle?',
    answer: 'All damages are covered by our insurance. We also hold a security deposit from renters. Report any issues through the app and we handle the claims process.'
  }
];

const requirements = [
  'Vehicle must be less than 10 years old',
  'Valid vehicle registration and insurance',
  'Vehicle must pass our quality inspection',
  'Valid driving license (min 2 years)',
  'Clean police record',
  'Bank account for payments'
];

const OwnerLanding = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [dailyRate, setDailyRate] = useState(50);
  const [daysPerMonth, setDaysPerMonth] = useState(15);

  const estimatedEarnings = dailyRate * daysPerMonth * 0.85; // 15% commission

  return (
    <>
      <Helmet>
        <title>Become a Vehicle Owner | Recharge Vehicle Rentals</title>
        <meta
          name="description"
          content="Become a vehicle owner partner with Recharge. Earn $200-500/month, flexible availability, protected rentals, and easy management from your phone."
        />
        <link rel="canonical" href="https://www.rechargetravels.com/vehicle-rental/owner" />
      </Helmet>

      <Header />

      <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-24 pb-20">
          <div className="pointer-events-none absolute inset-0 bg-[url('https://images.unsplash.com/photo-1586016413664-864c0dd76f53?w=1920&h=900&fit=crop')] bg-cover bg-center opacity-25" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-slate-900/50" />
          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/20 border border-amber-500/30 px-4 py-2 text-sm text-amber-300 mb-6">
                <HeartHandshake className="w-4 h-4" />
                <span>Join 200+ Vehicle Owners</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-4">
                Turn Your Vehicle Into
                <span className="block text-amber-400">A Profitable Asset</span>
              </h1>
              <p className="text-lg text-gray-200 mb-8 max-w-xl">
                Earn $200-500/month by renting your vehicle to verified tourists and locals. We handle bookings, payments, and insurance.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/vehicle-rental/owner/register"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-full hover:shadow-lg hover:shadow-amber-500/30 transition-all group"
                >
                  Start Earning Today
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/vehicle-rental/owner-dashboard"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 border border-white/20 text-white font-semibold rounded-full hover:bg-white/20 transition-all"
                >
                  Owner Dashboard
                </Link>
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-gray-300">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  No listing fee
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  Onboard in 24 hours
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  Weekly payouts
                </div>
              </div>
            </div>
            
            {/* Stats Card */}
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 text-white shadow-2xl">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-4 bg-white/5 rounded-xl">
                    <div className="text-3xl font-bold text-amber-400">200+</div>
                    <div className="text-sm text-gray-300">Active Owners</div>
                  </div>
                  <div className="text-center p-4 bg-white/5 rounded-xl">
                    <div className="text-3xl font-bold text-emerald-400">$350</div>
                    <div className="text-sm text-gray-300">Avg. Earnings/mo</div>
                  </div>
                  <div className="text-center p-4 bg-white/5 rounded-xl">
                    <div className="text-3xl font-bold text-blue-400">98%</div>
                    <div className="text-sm text-gray-300">Owner Satisfaction</div>
                  </div>
                  <div className="text-center p-4 bg-white/5 rounded-xl">
                    <div className="text-3xl font-bold text-purple-400">24hr</div>
                    <div className="text-sm text-gray-300">Fast Payouts</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-emerald-500/20 rounded-xl">
                  <Shield className="w-6 h-6 text-emerald-300" />
                  <div className="text-sm">
                    <div className="font-semibold text-white">100% Protected Rentals</div>
                    <div className="text-emerald-200">Full insurance coverage included</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-3">Why Owners Love Us</h2>
              <p className="text-slate-600 max-w-2xl mx-auto">Join the fastest growing vehicle rental community in Sri Lanka</p>
            </div>
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
              {benefits.map((benefit, idx) => (
                <div key={idx} className="p-6 rounded-2xl border border-slate-100 shadow-sm bg-white hover:shadow-lg hover:border-amber-200 transition-all group">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 text-amber-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <benefit.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2">{benefit.title}</h3>
                  <p className="text-sm text-slate-600">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 bg-gradient-to-br from-slate-50 to-slate-100">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-3">How It Works</h2>
              <p className="text-slate-600">Get started in 4 simple steps</p>
            </div>
            <div className="grid md:grid-cols-4 gap-6">
              {howItWorks.map((step, idx) => (
                <div key={idx} className="relative">
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-all h-full">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 text-white flex items-center justify-center font-bold mb-4">
                      {step.step}
                    </div>
                    <step.icon className="w-8 h-8 text-amber-600 mb-3" />
                    <h3 className="font-bold text-slate-900 mb-2">{step.title}</h3>
                    <p className="text-sm text-slate-600">{step.description}</p>
                  </div>
                  {idx < 3 && (
                    <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                      <ArrowRight className="w-6 h-6 text-amber-400" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Vehicle Types */}
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-3">Vehicles We Accept</h2>
              <p className="text-slate-600">List any vehicle that meets our quality standards</p>
            </div>
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
              {vehicleTypes.map((vehicle, idx) => (
                <div key={idx} className="relative p-6 rounded-2xl border border-slate-100 bg-white hover:shadow-lg transition-all text-center group">
                  {vehicle.popular && (
                    <span className="absolute -top-2 -right-2 bg-emerald-500 text-white text-xs px-2 py-1 rounded-full">Popular</span>
                  )}
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <vehicle.icon className="w-8 h-8 text-slate-600" />
                  </div>
                  <h3 className="font-bold text-slate-900 mb-1">{vehicle.type}</h3>
                  <p className="text-sm text-slate-500">{vehicle.examples}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Earnings Calculator */}
        <section className="py-16 bg-gradient-to-br from-amber-50 to-orange-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-slate-900 mb-3">Estimate Your Earnings</h2>
              <p className="text-slate-600">See how much you could earn with your vehicle</p>
            </div>
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-amber-100">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Daily Rate ($)</label>
                    <input
                      type="range"
                      min="20"
                      max="150"
                      value={dailyRate}
                      onChange={(e) => setDailyRate(Number(e.target.value))}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
                    />
                    <div className="flex justify-between text-sm text-slate-500 mt-1">
                      <span>$20</span>
                      <span className="font-bold text-amber-600">${dailyRate}/day</span>
                      <span>$150</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Days Rented Per Month</label>
                    <input
                      type="range"
                      min="5"
                      max="25"
                      value={daysPerMonth}
                      onChange={(e) => setDaysPerMonth(Number(e.target.value))}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
                    />
                    <div className="flex justify-between text-sm text-slate-500 mt-1">
                      <span>5 days</span>
                      <span className="font-bold text-amber-600">{daysPerMonth} days</span>
                      <span>25 days</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col justify-center items-center p-6 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl text-white">
                  <div className="text-sm opacity-90 mb-2">Estimated Monthly Earnings</div>
                  <div className="text-5xl font-bold mb-2">${estimatedEarnings.toFixed(0)}</div>
                  <div className="text-sm opacity-90">After 15% platform fee</div>
                  <Link
                    to="/vehicle-rental/owner/register"
                    className="mt-4 inline-flex items-center gap-2 px-6 py-2 bg-white text-amber-600 font-semibold rounded-full hover:shadow-lg transition-all"
                  >
                    Start Earning <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-3">What Owners Say</h2>
              <p className="text-slate-600">Real stories from our vehicle owner community</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((testimonial, idx) => (
                <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-lg transition-all">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-slate-600 mb-6 italic">"{testimonial.quote}"</p>
                  <div className="flex items-center gap-3">
                    <img src={testimonial.image} alt={testimonial.name} className="w-12 h-12 rounded-full object-cover" />
                    <div>
                      <div className="font-semibold text-slate-900">{testimonial.name}</div>
                      <div className="text-sm text-slate-500">{testimonial.vehicle} • {testimonial.location}</div>
                    </div>
                    <div className="ml-auto text-right">
                      <div className="text-emerald-600 font-bold">{testimonial.earnings}</div>
                      <div className="text-xs text-slate-500">avg. earnings</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Requirements */}
        <section className="py-16 bg-slate-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-slate-900 mb-3">Requirements</h2>
              <p className="text-slate-600">What you need to get started</p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
              <div className="grid sm:grid-cols-2 gap-4">
                {requirements.map((req, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
                    <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                    <span className="text-slate-700">{req}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-3">Frequently Asked Questions</h2>
              <p className="text-slate-600">Everything you need to know</p>
            </div>
            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <div key={idx} className="border border-slate-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full flex items-center justify-between p-5 text-left bg-white hover:bg-slate-50 transition-colors"
                  >
                    <span className="font-semibold text-slate-900">{faq.question}</span>
                    {openFaq === idx ? (
                      <ChevronUp className="w-5 h-5 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400" />
                    )}
                  </button>
                  {openFaq === idx && (
                    <div className="p-5 pt-0 bg-white">
                      <p className="text-slate-600">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to Start Earning?
            </h2>
            <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
              Join 200+ vehicle owners who are already earning extra income. Registration takes just 5 minutes.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/vehicle-rental/owner/register"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-full hover:shadow-lg hover:shadow-amber-500/30 transition-all group"
              >
                Register Now - It's Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="tel:+94773401305"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 border border-white/20 text-white font-semibold rounded-full hover:bg-white/20 transition-all"
              >
                <Phone className="w-5 h-5" />
                Call Us
              </a>
            </div>
            <p className="mt-6 text-sm text-gray-400">
              Have questions? Call us at <a href="tel:+94773401305" className="text-amber-400 hover:underline">+94 77 340 1305</a>
            </p>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default OwnerLanding;
