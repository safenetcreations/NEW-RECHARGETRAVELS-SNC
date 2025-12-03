import React from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Car, Users, Plane, Train, ArrowRight } from 'lucide-react'

const transportServices = [
  {
    title: 'Airport Transfers',
    href: '/transport/airport-transfers',
    description: 'Reliable arrivals and departures with flight tracking, meet & greet, and bottled water.',
    icon: Plane,
    chip: 'Most booked'
  },
  {
    title: 'Private Tours & Charters',
    href: '/transport/private-tours',
    description: 'Chauffeur-driven day trips and multi-day journeys with curated stops and flexible routing.',
    icon: Car,
    chip: 'Custom routes'
  },
  {
    title: 'Group Transport',
    href: '/transport/group-transport',
    description: 'Mini coaches and vans for weddings, incentive groups, and family gatherings across Sri Lanka.',
    icon: Users,
    chip: 'Up to 45 pax'
  },
  {
    title: 'Train Booking Concierge',
    href: '/transport/train-booking',
    description: 'Observation and first-class seats on Kandy–Ella and coastal routes with doorstep transfers.',
    icon: Train,
    chip: 'Scenic seats'
  }
]

const Transport = () => {
  return (
    <>
      <Helmet>
        <title>Transport in Sri Lanka | Transfers, Private Tours, Group Travel</title>
        <meta
          name="description"
          content="Book airport transfers, private chauffeurs, group transport, and scenic train tickets in Sri Lanka with one trusted concierge."
        />
        <link rel="canonical" href="https://www.rechargetravels.com/transport" />
      </Helmet>

      <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
        <section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/40 bg-orange-500/10 px-4 py-2 mb-6 backdrop-blur-xl">
              <Car className="h-4 w-4 text-orange-300" />
              <span className="text-xs font-bold uppercase tracking-widest text-orange-200">Transport Hub</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-4">
              Seamless Sri Lanka Transport
            </h1>
            <p className="text-lg text-slate-300 max-w-3xl mx-auto">
              One link to book airport transfers, chauffeured day trips, group transport, and scenic train seats—handled by the Recharge Travels concierge.
            </p>
          </div>
        </section>

        <section className="pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
            {transportServices.map((service) => {
              const Icon = service.icon
              return (
                <Link
                  key={service.href}
                  to={service.href}
                  className="group rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-orange-400/60 hover:shadow-2xl hover:shadow-orange-500/10"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-orange-500/15 text-orange-300">
                        <Icon className="h-6 w-6" />
                      </span>
                      <div>
                        <p className="text-sm text-orange-200 font-semibold">{service.chip}</p>
                        <h2 className="text-2xl font-bold text-white">{service.title}</h2>
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-orange-200 transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                  <p className="text-slate-300 leading-relaxed">{service.description}</p>
                </Link>
              )
            })}
          </div>

          <div className="max-w-6xl mx-auto mt-10 text-center">
            <p className="text-sm text-slate-400">
              Prefer a single itinerary? Our concierge can combine transfers, day tours, and trains into one plan.
            </p>
          </div>
        </section>
      </main>
    </>
  )
}

export default Transport
