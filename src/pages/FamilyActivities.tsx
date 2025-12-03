import React from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { Users, Train, Mountain, Compass, MapPin, ArrowRight } from 'lucide-react'

const familyActivities = [
  {
    title: 'Family Train Journeys',
    href: '/family-activities/family-train-journeys',
    description: 'Scenic rail rides with reserved seats, snacks, and door-to-door transfers.',
    icon: Train
  },
  {
    title: 'Sigiriya Family Adventure',
    href: '/family-activities/sigiriya-family-adventure',
    description: 'Lion Rock climb with sunrise slots, guides, and nearby village experiences.',
    icon: Mountain
  },
  {
    title: 'Polonnaruwa Family Cycling',
    href: '/family-activities/polonnaruwa-family-cycling',
    description: 'Gentle cycling through ancient ruins with helmets, snacks, and support van.',
    icon: Compass
  },
  {
    title: 'Udawalawe Elephant Safari',
    href: '/family-activities/udawalawe-elephant-safari',
    description: 'Family-friendly jeep safaris with naturalists and kid-safe schedules.',
    icon: Users
  },
  {
    title: 'Pinnawala Family Experience',
    href: '/family-activities/pinnawala-family-experience',
    description: 'Elephant encounters paired with river views and craft stops.',
    icon: MapPin
  },
  {
    title: 'Kosgoda Turtle Hatchery',
    href: '/family-activities/kosgoda-turtle-hatchery',
    description: 'Turtle conservation visit with hands-on learning for kids.',
    icon: Users
  },
  {
    title: 'Galle Fort Family Walk',
    href: '/family-activities/galle-fort-family-walk',
    description: 'History-rich strolls, ice cream stops, and sunset ramparts.',
    icon: MapPin
  },
  {
    title: 'Pearl Bay Water Park',
    href: '/family-activities/pearl-bay-water-park',
    description: 'Water park day with transfers and express entry options.',
    icon: Users
  },
  {
    title: 'Nuwara Eliya Family Outing',
    href: '/family-activities/nuwara-eliya-family-outing',
    description: 'Lake boating, strawberry picking, and tea estate visits for all ages.',
    icon: Mountain
  }
]

const FamilyActivities = () => {
  return (
    <>
      <Helmet>
        <title>Family Activities in Sri Lanka | Kid-Friendly Tours & Day Trips</title>
        <meta
          name="description"
          content="Plan family-friendly activities in Sri Lanka: train journeys, gentle safaris, turtle hatcheries, cycling tours, and cultural walks curated for all ages."
        />
        <link rel="canonical" href="https://www.rechargetravels.com/family-activities" />
      </Helmet>

      <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
        <section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 mb-6 backdrop-blur-xl">
              <Users className="h-4 w-4 text-emerald-300" />
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-100">Family Activities</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-4">
              Kid-Friendly Sri Lanka Adventures
            </h1>
            <p className="text-lg text-slate-200 max-w-3xl mx-auto">
              One hub to plan trains, safaris, cultural walks, and gentle adventures tailored for families.
            </p>
          </div>
        </section>

        <section className="pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {familyActivities.map((activity) => {
              const Icon = activity.icon
              return (
                <Link
                  key={activity.href}
                  to={activity.href}
                  className="group rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-emerald-400/60 hover:shadow-2xl hover:shadow-emerald-500/10"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-emerald-500/15 text-emerald-200">
                        <Icon className="h-6 w-6" />
                      </span>
                      <div>
                        <h2 className="text-2xl font-bold text-white">{activity.title}</h2>
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-emerald-200 transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                  <p className="text-slate-300 leading-relaxed">{activity.description}</p>
                </Link>
              )
            })}
          </div>
        </section>
      </main>
    </>
  )
}

export default FamilyActivities
