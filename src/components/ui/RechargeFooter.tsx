import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  ArrowUp,
  Binoculars,
  Compass,
  Facebook,
  Instagram,
  Leaf,
  Mail,
  MapPin,
  MoonStar,
  Mountain,
  PawPrint,
  Phone,
  Send,
  Sparkles,
  Sun,
  TreePalm,
  Twitter,
  Waves,
  Youtube
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import AIFAQChatbot from '@/components/chat/AIFAQChatbot'

const safariHighlights = [
  {
    icon: PawPrint,
    title: 'Yala Dusk Patrol',
    description: 'Guide-led leopard tracking with thermal scopes and field tea service under the jungle canopy.'
  },
  {
    icon: Waves,
    title: 'Weligama Moon Tides',
    description: 'Starlit catamaran voyages with marine biologists and acoustic hydrophones for whale song.'
  },
  {
    icon: Mountain,
    title: 'Ella Ridge Awakening',
    description: 'Sunrise hikes, kettledrum breakfast rituals, and slow-brew Ceylon tea above the clouds.'
  }
]

const navigationColumns = [
  {
    title: 'Signature Safaris',
    links: [
      { label: 'Leopard Dawn Patrol', href: '/tours/luxury-safari' },
      { label: 'Wilpattu Waterhole Watch', href: '/tours/wildtours' },
      { label: 'Nocturnal Jungle Listening', href: '/experiences/jungle-camping' },
      { label: 'Cinnamon Trail Hideouts', href: '/hotels' }
    ]
  },
  {
    title: 'Island Realms',
    links: [
      { label: 'Knuckles Cloud Forest', href: '/tours/ecotourism' },
      { label: 'Sacred Cultural Triangle', href: '/tours/cultural-heritage' },
      { label: 'Mirissa Blue Ocean Route', href: '/experiences/whale-watching' },
      { label: 'Tea Country Panoramas', href: '/tours/hill-country' }
    ]
  },
  {
    title: 'Concierge Rituals',
    links: [
      { label: 'AI Journey Studio', href: '/book-now' },
      { label: 'Heli & Seaplane Pairings', href: '/transport/airport-transfers' },
      { label: 'Heritage Host Pair Program', href: '/about/social' },
      { label: 'Sustainability Ledger', href: '/about/sustainability' }
    ]
  }
]

const conservationStats = [
  {
    icon: Binoculars,
    value: '92',
    label: 'protected observation hides stewarded with park rangers.'
  },
  {
    icon: Leaf,
    value: '87%',
    label: 'renewable-powered lodges across Recharge signature stays.'
  },
  {
    icon: Compass,
    value: '24/7',
    label: 'concierge guidance via MCP co-planning desk and voice link.'
  }
]

const socialLinks = [
  { icon: Facebook, href: 'https://facebook.com/rechargetravels', hover: 'hover:text-blue-400' },
  { icon: Instagram, href: 'https://instagram.com/rechargetravels', hover: 'hover:text-pink-400' },
  { icon: Twitter, href: 'https://twitter.com/rechargetravels', hover: 'hover:text-blue-300' },
  { icon: Youtube, href: 'https://youtube.com/rechargetravels', hover: 'hover:text-red-400' }
]

const RechargeFooter: React.FC = () => {
  const currentYear = new Date().getFullYear()

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      <footer className="relative overflow-hidden bg-[#05121b] text-slate-100">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 opacity-80" style={{ background: 'radial-gradient(circle at 15% 20%, rgba(255, 173, 78, 0.18), transparent 55%)' }} />
          <div className="absolute inset-0 opacity-60" style={{ background: 'radial-gradient(circle at 80% 10%, rgba(34, 197, 246, 0.16), transparent 50%)' }} />
          <div className="absolute inset-0 bg-gradient-to-br from-[#03121a] via-[#051c29] to-[#041420]" />
        </div>

        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <motion.div
            className="grid gap-10 lg:grid-cols-[1.35fr_1fr]"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="space-y-8 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">
              <div className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-black/30 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-amber-100">
                <PawPrint className="h-4 w-4 text-amber-300" />
                Leopard Conservancy Circle
              </div>

              <div className="space-y-4">
                <h2 className="text-3xl font-bold leading-tight text-white md:text-4xl">
                  Journey through Sri Lankan wilderness where leopard trails, emerald tea peaks, and moonlit bays interlace.
                </h2>
                <p className="text-base text-slate-300 md:text-lg">
                  The 21sr dev MCP concierge fuses ranger telemetry, figma-perfect itineraries, and storyteller hosts to choreograph every ritual — from dawn safaris to coastal banquets.
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <Button
                  asChild
                  size="lg"
                  className="group bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 text-slate-900 hover:shadow-[0_18px_42px_rgba(251,191,36,0.35)]"
                >
                  <Link to="/book-now">
                    <Sparkles className="mr-2 h-5 w-5 transition-transform group-hover:rotate-12" />
                    Design My Jungle Escape
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-amber-200/50 bg-amber-50/10 text-amber-100 hover:bg-amber-50/20"
                  onClick={scrollToTop}
                >
                  <Binoculars className="mr-2 h-5 w-5 text-amber-200" />
                  Preview Experience Deck
                </Button>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {safariHighlights.map(({ icon: Icon, title, description }) => (
                  <div key={title} className="rounded-2xl border border-white/10 bg-black/25 p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-200/10">
                        <Icon className="h-5 w-5 text-amber-200" />
                      </div>
                      <p className="text-sm font-semibold text-white">{title}</p>
                    </div>
                    <p className="mt-3 text-sm text-slate-300">{description}</p>
                  </div>
                ))}
              </div>
            </div>

            <motion.div
              className="space-y-6 rounded-3xl border border-white/10 bg-[#071c29]/80 p-8 backdrop-blur"
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              <div>
                <h3 className="text-xl font-semibold text-white">Moonlit Dispatch</h3>
                <p className="mt-2 text-sm text-slate-300">
                  Tracker-lens stories, turtle hatchery alerts, and tea master rituals, twice a month.
                </p>
                <form className="mt-6 flex flex-col gap-3" onSubmit={(event) => event.preventDefault()}>
                  <Input
                    required
                    type="email"
                    placeholder="you@sunrisetrails.com"
                    className="border-white/20 bg-white/10 text-slate-100 placeholder:text-slate-400 focus:border-amber-300 focus:ring-amber-300"
                  />
                  <Button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-teal-400 via-emerald-400 to-lime-400 text-slate-900 hover:shadow-[0_16px_32px_rgba(34,197,94,0.28)]"
                  >
                    <Send className="h-4 w-4" />
                    Join the Dispatch
                  </Button>
                </form>
              </div>

              <div className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-300/20">
                    <Sun className="h-5 w-5 text-amber-200" />
                  </div>
                  <div>
                    <p className="text-sm text-amber-100">Twilight Concierge</p>
                    <p className="text-xs text-slate-300">Voice & MCP live co-planning</p>
                  </div>
                </div>
                <div className="space-y-3 text-sm text-slate-200">
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-amber-200" />
                    <a href="tel:+94777721999" className="hover:text-amber-200">
                      +94 7777 21 999
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-amber-200" />
                    <a href="mailto:concierge@rechargetravels.com" className="hover:text-amber-200">
                      concierge@rechargetravels.com
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-amber-200" />
                    <span>Colombo • Yala • Sigiriya field ateliers</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-400/15">
                    <MoonStar className="h-5 w-5 text-indigo-200" />
                  </div>
                  <p className="text-sm text-slate-200">
                    After-dark leopard listening with sound bathing & MCP journey updates.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            className="mt-16 grid gap-8 lg:grid-cols-[1.1fr_3fr]"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <div className="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-rose-500">
                  <TreePalm className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-white">Recharge Travels</p>
                  <p className="text-xs uppercase tracking-[0.28em] text-amber-100">
                    Sri Lankan Jungle Atelier
                  </p>
                </div>
              </div>
              <p className="text-sm text-slate-300">
                Tailored wildlife, wellness, and cultural odysseys anchored in conservation pillars, community partnerships, and figma-led journey visualisations crafted by the 21sr dev concierge pod.
              </p>
              <div className="flex flex-wrap gap-3">
                {socialLinks.map(({ icon: Icon, href, hover }) => (
                  <a
                    key={href}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className={`flex h-9 w-9 items-center justify-center rounded-full bg-black/35 text-slate-300 transition-transform duration-200 hover:-translate-y-0.5 ${hover}`}
                  >
                    <Icon size={16} />
                  </a>
                ))}
              </div>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {navigationColumns.map((column) => (
                <div key={column.title} className="space-y-4 rounded-3xl border border-white/5 bg-black/20 p-6">
                  <h4 className="text-lg font-semibold text-white">{column.title}</h4>
                  <ul className="space-y-3 text-sm text-slate-300">
                    {column.links.map((link) => (
                      <li key={link.label}>
                        <Link
                          to={link.href}
                          className="group inline-flex items-center gap-2 transition-colors duration-200 hover:text-amber-200"
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-400/60 transition-all duration-200 group-hover:bg-amber-200" />
                          <span className="underline-offset-4 group-hover:underline">{link.label}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="mt-16 grid gap-6 rounded-3xl border border-white/10 bg-white/5 p-6 sm:grid-cols-2 lg:grid-cols-3"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            {conservationStats.map(({ icon: Icon, value, label }) => (
              <div key={value} className="flex items-start gap-4 rounded-2xl bg-black/25 p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400/20">
                  <Icon className="h-6 w-6 text-emerald-200" />
                </div>
                <div>
                  <p className="text-3xl font-semibold text-white">{value}</p>
                  <p className="mt-2 text-sm text-slate-300">{label}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        <div className="border-t border-white/10 bg-black/20">
          <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-6 text-sm text-slate-300 sm:px-6 md:flex-row md:justify-between">
            <div className="flex flex-col items-center gap-2 text-center md:flex-row md:gap-4 md:text-left">
              <span>© {currentYear} Recharge Travels & Tours (Pvt) Ltd. All rites reserved.</span>
              <span className="hidden h-4 w-px bg-white/20 md:block" />
              <span>Licensed Sri Lanka Tourism • Leopard & Marine Stewardship Charter</span>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/legal/privacy" className="transition-colors hover:text-amber-200">
                Privacy
              </Link>
              <Link to="/legal/terms" className="transition-colors hover:text-amber-200">
                Terms
              </Link>
              <motion.button
                onClick={scrollToTop}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-white transition hover:border-amber-200/60 hover:text-amber-100"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.92 }}
              >
                <ArrowUp className="h-5 w-5" />
              </motion.button>
            </div>
          </div>
        </div>
      </footer>

      <AIFAQChatbot />
    </>
  )
}

export default RechargeFooter
