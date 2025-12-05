import React, { useState, useEffect } from 'react';
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
  Star,
  ChevronDown,
  PlayCircle,
  TrendingUp,
  Award,
  BadgeCheck
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useB2BLanguage } from '@/hooks/useB2BLanguage';
import { languageFlags, languageNames, B2BLanguage } from '@/i18n/b2b-translations';

const B2BPortal = () => {
  const navigate = useNavigate();
  const { language, setLanguage, t, loading, isAutoDetected, dir } = useB2BLanguage();
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [animateStats, setAnimateStats] = useState(false);

  useEffect(() => {
    setAnimateStats(true);
  }, []);

  const handleRegisterClick = () => {
    navigate('/about/partners/b2b/register');
  };

  const handleLoginClick = () => {
    navigate('/about/partners/b2b/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div dir={dir} className="font-sans antialiased selection:bg-emerald-500 selection:text-white">
      <Helmet>
        <title>{t.hero.title} {t.hero.titleHighlight} | Recharge Travels B2B</title>
        <meta name="description" content={t.hero.subtitle} />
      </Helmet>

      {/* Language Bar */}
      <div className="bg-slate-900 text-white py-2 px-4 border-b border-white/10 relative z-50">
        <div className="container mx-auto flex justify-between items-center text-sm">
          <div className="flex items-center gap-2 text-white/70">
            <Globe className="w-4 h-4" />
            <span className="hidden sm:inline">
              {isAutoDetected ? '📍 Location Detected: ' : '🌐 Language: '}
              {languageNames[language]}
            </span>
          </div>

          <div className="relative">
            <button
              onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
              className="flex items-center gap-2 hover:text-emerald-400 transition-colors"
            >
              <span className="text-xl">{languageFlags[language]}</span>
              <span>{languageNames[language]}</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${isLangMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {isLangMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                {Object.entries(languageNames).map(([code, name]) => (
                  <button
                    key={code}
                    onClick={() => {
                      setLanguage(code as B2BLanguage);
                      setIsLangMenuOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center gap-3 ${language === code ? 'text-emerald-600 font-medium bg-emerald-50' : 'text-slate-700'}`}
                  >
                    <span className="text-xl">{languageFlags[code as B2BLanguage]}</span>
                    {name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Header />

      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="relative min-h-[90vh] flex items-center bg-slate-900 overflow-hidden">
          {/* Animated Background Gradients */}
          <div className="absolute inset-0 bg-[url('/images/sri-lanka-aerial.jpg')] bg-cover bg-center opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 via-slate-900/80 to-slate-900" />
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/3" />

          <div className="container mx-auto px-4 relative z-10 pt-20">
            <div className="max-w-5xl mx-auto">
              {/* Badge */}
              <div className="flex justify-center mb-8">
                <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-full px-5 py-2 hover:bg-white/10 transition-colors cursor-default">
                  <Award className="w-5 h-5 text-amber-400" />
                  <span className="text-emerald-300 font-medium tracking-wide text-sm uppercase">{t.hero.badge}</span>
                </div>
              </div>

              {/* Main Title */}
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-center text-white mb-8 leading-tight tracking-tight">
                {t.hero.title}
                <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 animate-gradient-x">
                  {t.hero.titleHighlight}
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-slate-300 text-center mb-12 max-w-3xl mx-auto leading-relaxed font-light">
                {t.hero.subtitle}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-20">
                <button
                  type="button"
                  onClick={handleRegisterClick}
                  className="group relative inline-flex items-center justify-center gap-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-10 py-5 rounded-2xl font-bold text-lg transition-all hover:scale-105 shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/40 w-full sm:w-auto"
                >
                  {t.hero.cta}
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                  <div className="absolute inset-0 rounded-2xl ring-2 ring-white/20 group-hover:ring-white/40 transition-all" />
                </button>

                <button
                  type="button"
                  onClick={handleLoginClick}
                  className="inline-flex items-center justify-center gap-3 bg-white/5 backdrop-blur-sm border border-white/10 text-white px-10 py-5 rounded-2xl font-bold text-lg transition-all hover:bg-white/10 hover:border-white/20 w-full sm:w-auto"
                >
                  <Users className="w-6 h-6" />
                  {t.hero.login}
                </button>
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-white/10 pt-12">
                {[
                  { label: t.hero.stats.agencies, value: "500+", icon: Building2 },
                  { label: t.hero.stats.countries, value: "45+", icon: Globe },
                  { label: t.hero.stats.tours, value: "100+", icon: PlayCircle },
                  { label: t.hero.stats.support, value: "24/7", icon: Headphones },
                ].map((stat, i) => (
                  <div key={i} className="text-center group hover:-translate-y-1 transition-transform duration-300">
                    <div className="flex items-center justify-center gap-2 text-3xl md:text-4xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                      <stat.icon className="w-6 h-6 md:w-8 md:h-8 text-emerald-500 opacity-75 group-hover:opacity-100" />
                      {stat.value}
                    </div>
                    <div className="text-sm font-medium text-slate-400 uppercase tracking-wider">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid - Glass Cards */}
        <section className="py-32 bg-slate-50 relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-slate-900 to-transparent pointer-events-none" />

          <div className="container mx-auto px-4">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                {t.features.title}
              </h2>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                {t.features.subtitle}
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: Percent,
                  title: t.features.discount.title,
                  desc: t.features.discount.description,
                  color: "from-amber-400 to-orange-500",
                  bg: "bg-amber-50"
                },
                {
                  icon: Clock,
                  title: t.features.availability.title,
                  desc: t.features.availability.description,
                  color: "from-emerald-400 to-teal-500",
                  bg: "bg-emerald-50"
                },
                {
                  icon: Globe,
                  title: t.features.currency.title,
                  desc: t.features.currency.description,
                  color: "from-blue-400 to-indigo-500",
                  bg: "bg-blue-50"
                },
                {
                  icon: Shield,
                  title: t.features.security.title,
                  desc: t.features.security.description,
                  color: "from-purple-400 to-violet-500",
                  bg: "bg-purple-50"
                },
                {
                  icon: Headphones,
                  title: t.features.support.title,
                  desc: t.features.support.description,
                  color: "from-rose-400 to-pink-500",
                  bg: "bg-rose-50"
                },
                {
                  icon: Users,
                  title: t.features.management.title,
                  desc: t.features.management.description,
                  color: "from-cyan-400 to-sky-500",
                  bg: "bg-cyan-50"
                }
              ].map((feature, index) => (
                <div
                  key={index}
                  className="group relative bg-white rounded-[2rem] p-8 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-500 hover:-translate-y-2 border border-slate-100"
                >
                  <div className={`absolute inset-0 rounded-[2rem] bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />

                  <div className={`w-16 h-16 rounded-2xl ${feature.bg} flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500`}>
                    <feature.icon className={`w-8 h-8 text-transparent bg-clip-text bg-gradient-to-br ${feature.color}`} />
                    {/* Fallback for bg-clip-text on SVG for some browsers */}
                    <feature.icon className={`absolute w-8 h-8 opacity-20 text-slate-900`} />
                  </div>

                  <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-emerald-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed text-lg">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section - Modern Dark */}
        <section className="py-32 bg-slate-900 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/images/pattern-grid.png')] opacity-5" />
          <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-emerald-900/20 to-transparent" />

          <div className="container mx-auto px-4 relative z-10">
            <div className="grid lg:grid-cols-2 gap-20 items-center">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 leading-tight">
                  {t.benefits.title}
                </h2>
                <p className="text-xl text-slate-400 mb-12 border-l-4 border-emerald-500 pl-6">
                  {t.benefits.subtitle}
                </p>

                <div className="grid gap-6">
                  {t.benefits.items.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-4 group">
                      <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 group-hover:bg-emerald-500 group-hover:scale-110 transition-all duration-300">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 group-hover:text-white transition-colors" />
                      </div>
                      <span className="text-lg text-slate-300 group-hover:text-white transition-colors">
                        {benefit}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-12 pt-12 border-t border-white/10 flex flex-wrap gap-8">
                  <div className="flex items-center gap-4">
                    <BadgeCheck className="w-12 h-12 text-emerald-500" />
                    <div>
                      <p className="text-white font-bold text-lg">SLTDA Registered</p>
                      <p className="text-slate-400 text-sm">Official License</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Shield className="w-12 h-12 text-teal-500" />
                    <div>
                      <p className="text-white font-bold text-lg">Fully Insured</p>
                      <p className="text-slate-400 text-sm">Global Coverage</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Start Card */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-[2.5rem] rotate-3 opacity-20 blur-xl" />
                <div className="bg-white/5 backdrop-blur-xl rounded-[2.5rem] p-10 border border-white/10 relative">
                  <div className="flex items-center gap-4 mb-10">
                    <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                      <TrendingUp className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">{t.benefits.quickStart.title}</h3>
                      <p className="text-emerald-400">4 Simple Steps to Success</p>
                    </div>
                  </div>

                  <div className="space-y-8 relative">
                    {/* Connecting Line */}
                    <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-gradient-to-b from-emerald-500/50 to-transparent border-l border-dashed border-emerald-500/30" />

                    {t.benefits.quickStart.steps.map((step, index) => (
                      <div key={index} className="flex gap-6 relative">
                        <div className="w-12 h-12 rounded-full bg-slate-900 border-2 border-emerald-500 flex items-center justify-center font-bold text-emerald-400 text-lg shadow-[0_0_15px_rgba(16,185,129,0.3)] z-10 flex-shrink-0">
                          {index + 1}
                        </div>
                        <div className="pt-1">
                          <h4 className="text-lg font-bold text-white mb-1 group-hover:text-emerald-400 transition-colors">
                            {step.title}
                          </h4>
                          <p className="text-slate-400 leading-relaxed">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-12">
                    <button
                      onClick={handleRegisterClick}
                      className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-xl transition-all hover:scale-[1.02] shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2"
                    >
                      {t.registration.submit}
                      <ArrowRight className="w-5 h-5" />
                    </button>
                    <p className="text-center text-slate-500 text-sm mt-4 cursor-pointer hover:text-emerald-400 transition-colors" onClick={handleLoginClick}>
                      {t.registration.haveAccount} <span className="underline decoration-emerald-500/30 underline-offset-4">{t.registration.login}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Global CTA */}
        <section className="py-24 bg-gradient-to-br from-emerald-900 to-slate-900 relative">
          <div className="container mx-auto px-4 text-center relative z-10">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              {t.cta.title}
            </h2>
            <p className="text-xl md:text-2xl text-emerald-100 mb-12 max-w-3xl mx-auto font-light">
              {t.cta.subtitle}
            </p>
            <button
              type="button"
              onClick={handleRegisterClick}
              className="inline-flex items-center gap-3 bg-white text-emerald-900 px-12 py-6 rounded-full font-bold text-xl hover:bg-emerald-50 transition-all hover:scale-105 shadow-2xl shadow-emerald-900/50"
            >
              {t.cta.button}
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
};

export default B2BPortal;
