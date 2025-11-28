import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { HeartHandshake, TrendingUp, Shield, Calendar, Smartphone, DollarSign, ArrowRight, CheckCircle } from 'lucide-react';

const benefits = [
  { icon: DollarSign, title: 'Earn Extra Income', description: 'Turn your idle vehicle into a money-making asset' },
  { icon: Calendar, title: 'Flexible Availability', description: 'Set your own schedule. Rent when you want' },
  { icon: Shield, title: 'Protected Rentals', description: 'Insurance coverage and verified customers' },
  { icon: Smartphone, title: 'Easy Management', description: 'Manage bookings, earnings & calendar from your phone' }
];

const OwnerLanding = () => {
  return (
    <>
      <Helmet>
        <title>Become a Vehicle Owner | Recharge Vehicle Rentals</title>
        <meta
          name="description"
          content="Become a vehicle owner partner with Recharge. Earn extra income, flexible availability, protected rentals, and easy management from your phone."
        />
        <link rel="canonical" href="https://www.rechargetravels.com/vehicle-rental/owner" />
      </Helmet>

      <Header />

      <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-24 pb-20">
          <div className="pointer-events-none absolute inset-0 bg-[url('https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1920&h=900&fit=crop')] bg-cover bg-center opacity-15" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-slate-900/50" />
          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/20 border border-amber-500/30 px-4 py-2 text-sm text-amber-300 mb-6">
                <HeartHandshake className="w-4 h-4" />
                <span>Become a Vehicle Owner</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-4">
                Turn Your Vehicle Into
                <span className="block text-amber-400">A Profitable Asset</span>
              </h1>
              <p className="text-lg text-gray-200 mb-8 max-w-xl">
                Join 200+ vehicle owners earning extra income on our platform. List your car, van, or SUV and start earning when it&apos;s not in use.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/vehicle-rental/owner/register"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-full hover:shadow-lg hover:shadow-amber-500/30 transition-all"
                >
                  Register as Owner
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/vehicle-rental/owner/login"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 border border-white/20 text-white font-semibold rounded-full hover:bg-white/20 transition-all"
                >
                  Owner Login
                </Link>
              </div>
              <div className="mt-8 flex items-center gap-3 text-sm text-gray-200">
                <CheckCircle className="w-5 h-5 text-amber-400" />
                No listing fee. Onboard in minutes.
              </div>
            </div>
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 text-white shadow-2xl">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-amber-400" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-300">Average monthly earnings</div>
                    <div className="text-2xl font-bold text-white">$280</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <Shield className="w-6 h-6 text-emerald-300" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-300">Protected rentals</div>
                    <div className="text-white font-semibold">Insurance & verification</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-14 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
              {benefits.map((benefit, idx) => (
                <div key={idx} className="p-5 rounded-2xl border border-slate-100 shadow-sm bg-white hover:shadow-md transition">
                  <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
                    <benefit.icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">{benefit.title}</h3>
                  <p className="text-sm text-slate-600">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default OwnerLanding;
