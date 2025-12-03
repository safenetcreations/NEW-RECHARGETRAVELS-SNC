import React from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { Crown, Plane, Ship, Building2, ArrowRight, Sparkles } from 'lucide-react'

const luxuryLinks = [
  { title: 'Luxury Tours', href: '/tours/luxury', description: 'Signature multi-day itineraries with premium stays and private guides.' },
  { title: 'Helicopter Charters', href: '/experiences/luxury/helicopter-charters', description: 'Point-to-point flights to tea country, national parks, and coast.' },
  { title: 'Private Yachts', href: '/experiences/luxury/private-yachts', description: 'Crewed yachts for day or multi-day charters around Sri Lanka.' },
  { title: 'Private Jets', href: '/experiences/luxury/private-jets', description: 'Jet charters with VIP ground handling and concierge.' },
  { title: 'Exclusive Villas', href: '/experiences/luxury/exclusive-villas', description: 'Beachfront and hillside villas with full staff and chefs.' },
  { title: 'Luxury Hotels', href: '/experiences/luxury/luxury-hotels', description: 'Curated 5-star hotels and boutique icons across the island.' },
  { title: 'VIP Concierge', href: '/experiences/luxury/vip-concierge', description: '24/7 private concierge for events, chefs, security, and celebrations.' },
  { title: 'Dream Journeys', href: '/experiences/luxury/dream-journeys', description: 'Flagship journeys combining helicopters, yachts, and exclusive access.' }
]

const LuxuryLanding = () => {
  return (
    <>
      <Helmet>
        <title>Luxury Sri Lanka | Helicopters, Yachts, Villas, and VIP Concierge</title>
        <meta
          name="description"
          content="Browse Sri Lanka luxury travel: helicopters, yachts, private jets, villas, and signature luxury tours with concierge support."
        />
        <link rel="canonical" href="https://www.rechargetravels.com/experiences/luxury" />
      </Helmet>

      <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
        <section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-amber-500/10 px-4 py-2 mb-6 backdrop-blur-xl">
              <Crown className="h-4 w-4 text-amber-300" />
              <span className="text-xs font-bold uppercase tracking-widest text-amber-100">Luxury Collection</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-4">
              Luxury Sri Lanka, Curated
            </h1>
            <p className="text-lg text-slate-200 max-w-3xl mx-auto">
              One hub to book helicopters, yachts, private jets, villas, and concierge-led luxury tours.
            </p>
          </div>
        </section>

        <section className="pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {luxuryLinks.map(link => (
              <Link
                key={link.href}
                to={link.href}
                className="group rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-amber-400/60 hover:shadow-2xl hover:shadow-amber-500/10"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-amber-500/15 text-amber-200">
                      <Sparkles className="h-6 w-6" />
                    </span>
                    <div>
                      <h2 className="text-2xl font-bold text-white">{link.title}</h2>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-amber-200 transition-transform duration-300 group-hover:translate-x-1" />
                </div>
                <p className="text-slate-300 leading-relaxed">{link.description}</p>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </>
  )
}

export default LuxuryLanding
