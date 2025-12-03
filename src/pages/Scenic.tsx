import React from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { Mountain, Waves, Trees, Camera, ArrowRight } from 'lucide-react'

const scenicSpots = [
  { title: 'Bambarakanda Falls', href: '/scenic/bambarakanda-falls', description: "Sri Lanka's tallest waterfall with misty trails.", icon: Mountain },
  { title: 'Arugam Bay Beach', href: '/scenic/arugam-bay-beach', description: 'Surf breaks, lagoons, and laid-back vibes on the east coast.', icon: Waves },
  { title: 'Haputale Viewpoint', href: '/scenic/haputale-scenic-views', description: 'Tea-carpeted ridges with sunrise panoramas.', icon: Mountain },
  { title: 'Diyaluma Falls', href: '/scenic/diyaluma-falls', description: 'Natural infinity pools and epic cascades.', icon: Trees },
  { title: 'Ella Rock', href: '/scenic/ella-rock', description: 'Sunrise hike with sweeping valleys.', icon: Mountain },
  { title: 'Gregory Lake', href: '/scenic/gregory-lake', description: 'Lakeside walks and boating in Nuwara Eliya.', icon: Waves },
  { title: 'Pidurangala Rock', href: '/scenic/pidurangala-rock', description: 'Best Sigiriya views at golden hour.', icon: Camera },
  { title: 'Belihuloya', href: '/scenic/belihuloya', description: 'Streams, forests, and cool-air retreats.', icon: Trees },
  { title: 'Ravana Falls', href: '/scenic/ravana-falls', description: 'Legendary cascade near Ella.', icon: Mountain },
  { title: 'Nine Arch Bridge', href: '/scenic/nine-arch-bridge', description: 'Iconic bridge with passing trains and jungle backdrops.', icon: Camera }
]

const Scenic = () => {
  return (
    <>
      <Helmet>
        <title>Scenic Sri Lanka | Waterfalls, Viewpoints, and Iconic Landscapes</title>
        <meta
          name="description"
          content="Plan scenic Sri Lanka adventures: waterfalls, viewpoints, and iconic bridges with quick links to guides and nearby tours."
        />
        <link rel="canonical" href="https://www.rechargetravels.com/scenic" />
      </Helmet>

      <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
        <section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/40 bg-blue-500/10 px-4 py-2 mb-6 backdrop-blur-xl">
              <Camera className="h-4 w-4 text-blue-200" />
              <span className="text-xs font-bold uppercase tracking-widest text-blue-100">Scenic Sri Lanka</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-4">
              Iconic Views & Natural Wonders
            </h1>
            <p className="text-lg text-slate-200 max-w-3xl mx-auto">
              One hub to reach Sri Lanka’s most photogenic waterfalls, viewpoints, and bridges.
            </p>
          </div>
        </section>

        <section className="pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {scenicSpots.map((spot) => {
              const Icon = spot.icon
              return (
                <Link
                  key={spot.href}
                  to={spot.href}
                  className="group rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-blue-400/60 hover:shadow-2xl hover:shadow-blue-500/10"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-blue-500/15 text-blue-200">
                        <Icon className="h-6 w-6" />
                      </span>
                      <div>
                        <h2 className="text-2xl font-bold text-white">{spot.title}</h2>
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-blue-200 transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                  <p className="text-slate-300 leading-relaxed">{spot.description}</p>
                </Link>
              )
            })}
          </div>
        </section>
      </main>
    </>
  )
}

export default Scenic
