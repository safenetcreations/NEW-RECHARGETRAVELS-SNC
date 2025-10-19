import React, { lazy, Suspense } from 'react'
import { Link } from 'react-router-dom'
import { TreePine, Phone, Mail, MapPin, Leaf, Bird, Palmtree, Mountain, Waves, Sun } from 'lucide-react'
import FooterSocial from '../footer/FooterSocial'
import FooterBottom from '../footer/FooterBottom'

const AIFAQChatbot = lazy(() => import('@/components/chat/AIFAQChatbot'))

const RechargeFooter: React.FC = () => {
  return (
    <>
      <footer className="relative overflow-hidden bg-gradient-to-br from-emerald-950 via-green-900 to-teal-950 text-white">
        {/* Jungle Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full" 
               style={{
                 backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2334d399' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
               }}
          />
        </div>

        {/* Animated Floating Leaves */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <Leaf className="absolute top-10 left-[10%] w-8 h-8 text-emerald-400/20 animate-float" style={{ animationDelay: '0s', animationDuration: '6s' }} />
          <Leaf className="absolute top-20 right-[15%] w-6 h-6 text-green-400/20 animate-float" style={{ animationDelay: '2s', animationDuration: '8s' }} />
          <Leaf className="absolute bottom-32 left-[20%] w-7 h-7 text-teal-400/20 animate-float" style={{ animationDelay: '4s', animationDuration: '7s' }} />
          <Leaf className="absolute top-40 right-[30%] w-5 h-5 text-emerald-400/20 animate-float" style={{ animationDelay: '1s', animationDuration: '9s' }} />
          <Bird className="absolute top-16 right-[5%] w-8 h-8 text-yellow-400/20 animate-fly" />
          <Bird className="absolute bottom-40 left-[8%] w-6 h-6 text-amber-400/20 animate-fly" style={{ animationDelay: '3s' }} />
        </div>

        {/* Jungle Canopy Top Border */}
        <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-green-950/50 to-transparent">
          <div className="absolute -top-8 left-0 right-0 flex justify-around">
            <Palmtree className="w-16 h-16 text-emerald-600/40 transform rotate-12" />
            <TreePine className="w-20 h-20 text-green-700/40 transform -rotate-6" />
            <Palmtree className="w-14 h-14 text-teal-600/40 transform rotate-6" />
            <TreePine className="w-18 h-18 text-emerald-700/40" />
            <Palmtree className="w-16 h-16 text-green-600/40 transform -rotate-12" />
          </div>
        </div>

        <div className="container mx-auto px-4 py-12 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {/* Brand Section - Enhanced Jungle Theme */}
            <div className="space-y-6">
              <div className="relative">
                <div className="absolute -inset-2 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-lg blur-xl"></div>
                <div className="relative flex items-center space-x-3 mb-6 bg-gradient-to-r from-emerald-900/50 to-teal-900/50 p-4 rounded-xl border border-emerald-500/30">
                  <div className="relative">
                    <div className="absolute inset-0 bg-emerald-400 blur-md rounded-full opacity-50"></div>
                    <TreePine className="h-10 w-10 text-emerald-400 relative z-10 drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
                  </div>
                  <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-emerald-200 to-teal-200 bg-clip-text text-transparent">
                    Recharge Travels
                  </Link>
                </div>
              </div>
              
              <p className="text-emerald-100/90 leading-relaxed text-sm backdrop-blur-sm">
                🌿 Your gateway to Sri Lanka's wild heart. Experience the untamed beauty of tropical rainforests, 
                majestic elephants, elusive leopards, and pristine beaches. Let nature recharge your soul.
              </p>
              
              {/* Social Media + Certifications in One Line */}
              <div className="flex items-center gap-4 flex-wrap">
                <FooterSocial />
                
                {/* Certifications */}
                <div className="flex gap-2 items-center">
                  <div className="flex items-center gap-1.5 text-xs bg-emerald-900/50 text-emerald-200 px-3 py-2 rounded-lg border border-emerald-600/50 backdrop-blur-sm hover:bg-emerald-800/50 transition-all duration-300">
                    <span className="text-base">🏛️</span>
                    <span className="font-semibold">Licensed</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs bg-teal-900/50 text-teal-200 px-3 py-2 rounded-lg border border-teal-600/50 backdrop-blur-sm hover:bg-teal-800/50 transition-all duration-300">
                    <span className="text-base">🌿</span>
                    <span className="font-semibold">Eco-Certified</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs bg-green-900/50 text-green-200 px-3 py-2 rounded-lg border border-green-600/50 backdrop-blur-sm hover:bg-green-800/50 transition-all duration-300">
                    <span className="text-base">🦋</span>
                    <span className="font-semibold">Conservation</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Links - Jungle Style */}
            <div>
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Mountain className="w-5 h-5 text-emerald-400" />
                <span className="bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent">
                  Adventures
                </span>
              </h3>
              <ul className="space-y-3">
                {[
                  { to: '/tours', label: '🗺️ Safari Tours', icon: '🦁' },
                  { to: '/destinations', label: '🏝️ Destinations', icon: '🌊' },
                  { to: '/experiences', label: '✨ Experiences', icon: '🎯' },
                  { to: '/transport/airport-transfers', label: '🚗 Transport', icon: '🚙' },
                  { to: '/about', label: '🌿 About Us', icon: '🌱' },
                  { to: '/blog', label: '📖 Travel Blog', icon: '✍️' }
                ].map((link) => (
                  <li key={link.to}>
                    <Link 
                      to={link.to} 
                      className="group flex items-center text-emerald-100/80 hover:text-emerald-300 transition-all duration-300"
                    >
                      <span className="mr-2 group-hover:scale-110 transition-transform">{link.icon}</span>
                      <span className="group-hover:translate-x-1 transition-transform">{link.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Top Destinations - Wildlife Focus */}
            <div>
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Palmtree className="w-5 h-5 text-teal-400" />
                <span className="bg-gradient-to-r from-teal-300 to-emerald-300 bg-clip-text text-transparent">
                  Wild Spots
                </span>
              </h3>
              <ul className="space-y-3">
                {[
                  { to: '/tours/wildtours/parks/yala', label: 'Yala National Park', icon: '🐆' },
                  { to: '/tours/wildtours/parks/wilpattu', label: 'Wilpattu Forest', icon: '🦌' },
                  { to: '/tours/wildtours/parks/sinharaja', label: 'Sinharaja Rainforest', icon: '🌳' },
                  { to: '/tours/wildtours/parks/udawalawe', label: 'Udawalawe Safari', icon: '🐘' },
                  { to: '/tours/wildtours/parks/horton-plains', label: 'Horton Plains', icon: '🏔️' }
                ].map((dest) => (
                  <li key={dest.to}>
                    <Link 
                      to={dest.to} 
                      className="group flex items-center text-emerald-100/80 hover:text-teal-300 transition-all duration-300"
                    >
                      <span className="mr-2 group-hover:scale-110 transition-transform">{dest.icon}</span>
                      <span className="group-hover:translate-x-1 transition-transform">{dest.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info - Jungle Style */}
            <div>
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Waves className="w-5 h-5 text-cyan-400" />
                <span className="bg-gradient-to-r from-cyan-300 to-emerald-300 bg-clip-text text-transparent">
                  Get in Touch
                </span>
              </h3>
              
              <div className="space-y-4">
                <a href="tel:+94777721999" 
                   className="group flex items-center space-x-3 p-3 rounded-lg bg-emerald-900/30 hover:bg-emerald-800/40 border border-emerald-700/30 hover:border-emerald-600/50 transition-all duration-300 backdrop-blur-sm">
                  <Phone className="h-5 w-5 text-emerald-400 group-hover:scale-110 transition-transform" />
                  <span className="text-emerald-100/90 group-hover:text-emerald-200">+94 7777 21 999</span>
                </a>
                
                <a href="mailto:info@rechargetravels.com" 
                   className="group flex items-center space-x-3 p-3 rounded-lg bg-teal-900/30 hover:bg-teal-800/40 border border-teal-700/30 hover:border-teal-600/50 transition-all duration-300 backdrop-blur-sm">
                  <Mail className="h-5 w-5 text-teal-400 group-hover:scale-110 transition-transform" />
                  <span className="text-teal-100/90 group-hover:text-teal-200 text-sm">info@rechargetravels.com</span>
                </a>
                
                <div className="flex items-start space-x-3 p-3 rounded-lg bg-cyan-900/30 border border-cyan-700/30 backdrop-blur-sm">
                  <MapPin className="h-5 w-5 text-cyan-400 mt-1 flex-shrink-0" />
                  <span className="text-cyan-100/90 text-sm">Colombo + Jaffna, Sri Lanka</span>
                </div>
              </div>
            </div>
          </div>

          {/* Newsletter Section */}
          <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-emerald-900/50 via-teal-900/50 to-green-900/50 border border-emerald-600/30 backdrop-blur-sm">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Sun className="w-10 h-10 text-amber-400 animate-pulse" />
                <div>
                  <h4 className="text-xl font-bold text-emerald-100 mb-0.5">Join Our Jungle Newsletter 🌴</h4>
                  <p className="text-emerald-200/80 text-xs">Get exclusive safari deals, wildlife tips & adventure stories!</p>
                </div>
              </div>
              <div className="flex gap-2 w-full md:w-auto">
                <input 
                  type="email" 
                  placeholder="your@email.com" 
                  className="px-3 py-2 text-sm rounded-lg bg-white/10 border border-emerald-500/30 text-white placeholder-emerald-300/50 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 backdrop-blur-sm flex-1 md:w-56"
                />
                <button className="px-4 py-2 text-sm bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/50 whitespace-nowrap">
                  Subscribe 🦜
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Section with Jungle Floor Effect */}
          <div className="relative mt-8 pt-6 border-t border-emerald-700/30">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent"></div>
            <FooterBottom isDarkMode={true} />
          </div>

          {/* Crafted By Section - Leopard Skin Theme with Light Animation */}
          <div className="relative mt-6 pt-4 border-t border-amber-700/20">
            <div className="text-center">
              <a 
                href="https://www.safenetcreations.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block group"
              >
                <p className="leopard-animated-text text-5xl font-black tracking-wider hover:scale-105 transition-transform duration-300 cursor-pointer">
                  Crafted by <span className="highlight-text">www.safenetcreations.com</span>
                </p>
              </a>
            </div>
          </div>
        </div>

        {/* Jungle Floor Bottom */}
        <div className="h-4 bg-gradient-to-r from-emerald-950 via-green-950 to-teal-950"></div>
      </footer>

      <Suspense fallback={null}>
        <AIFAQChatbot />
      </Suspense>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Righteous&display=swap');
        
        .leopard-animated-text {
          font-family: 'Righteous', cursive;
          background: linear-gradient(135deg, 
            #D2691E 0%, 
            #000000 8%, 
            #CD853F 15%, 
            #000000 20%, 
            #D2691E 28%, 
            #1a1a1a 32%,
            #CD853F 40%, 
            #000000 45%,
            #D2691E 52%, 
            #1a1a1a 58%,
            #CD853F 65%, 
            #000000 70%,
            #D2691E 78%, 
            #1a1a1a 83%,
            #CD853F 90%, 
            #000000 95%,
            #D2691E 100%
          );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-shadow: 
            2px 2px 6px rgba(0, 0, 0, 0.6),
            0 0 15px rgba(210, 105, 30, 0.4);
          filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.8));
          position: relative;
        }

        .highlight-text {
          position: relative;
          display: inline-block;
          background: linear-gradient(
            90deg,
            #D2691E 0%,
            #FFD700 20%,
            #FFF8DC 40%,
            #FFD700 60%,
            #D2691E 80%,
            #D2691E 100%
          );
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: lightSweep 3s linear infinite;
        }

        @keyframes lightSweep {
          0% {
            background-position: 200% center;
          }
          100% {
            background-position: -200% center;
          }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(10deg); }
        }
        @keyframes fly {
          0%, 100% { transform: translateX(0) translateY(0); }
          50% { transform: translateX(30px) translateY(-15px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-fly {
          animation: fly 10s ease-in-out infinite;
        }
      `}</style>
    </>
  )
}

export default RechargeFooter
