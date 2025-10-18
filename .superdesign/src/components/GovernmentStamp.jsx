import React from 'react';

const GovernmentStamp = () => {
  return (
    <footer className="stamp-container py-16 bg-gradient-to-br from-[#003366] to-[#004080] relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="stamp-border border-2 border-white/10 rounded-xl p-8 bg-white/[0.02]">
          <div className="flex flex-col items-center text-center">
            {/* Emblem and Flag */}
            <div className="mb-8">
              <div className="emblem-container inline-block mb-4 p-8 rounded-full bg-gradient-to-r from-white/10 to-transparent">
                {/* Sri Lankan Emblem */}
                <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <svg className="w-16 h-16 text-white/80" viewBox="0 0 100 100" fill="currentColor">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2"/>
                    <path d="M50 20 L60 40 L80 40 L65 55 L70 75 L50 60 L30 75 L35 55 L20 40 L40 40 Z" fill="currentColor"/>
                  </svg>
                </div>
              </div>
              {/* Sri Lankan Flag Colors */}
              <div className="w-16 h-1 mx-auto rounded-full bg-gradient-to-r from-[#FFC72C] via-[#FF6B35] to-[#00A651]"></div>
            </div>

            {/* Ministry Name in Three Languages */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white mb-4 font-serif tracking-wide">
                Ministry of Fisheries
              </h2>
              <div className="flex flex-col md:flex-row items-center justify-center md:space-x-6 space-y-2 md:space-y-0 text-white/80">
                <h3 className="text-xl font-bold">ධීවර අමාත්‍යාංශය</h3>
                <span className="hidden md:block w-px h-10 bg-gradient-to-b from-transparent via-white/30 to-transparent"></span>
                <h3 className="text-xl font-bold">மீன்வள அமைச்சு</h3>
              </div>
            </div>

            {/* Government of Sri Lanka */}
            <div className="mb-8">
              <p className="text-lg text-white/90 mb-3 font-medium">Government of Sri Lanka</p>
              <div className="flex flex-col md:flex-row items-center justify-center md:space-x-4 space-y-1 md:space-y-0 text-white/70 text-sm">
                <span>ශ්‍රී ලංකා රජය</span>
                <span className="hidden md:inline text-white/30">|</span>
                <span>இலங்கை அரசாங்கம்</span>
              </div>
            </div>

            {/* Contact Information Grid */}
            <div className="mt-8 pt-8 border-t border-white/10 w-full">
              <div className="grid md:grid-cols-3 gap-8 text-white/70 text-sm">
                <div className="text-center md:text-left">
                  <p className="font-semibold text-white/80 mb-2">Head Office</p>
                  <p>New Secretariat Building</p>
                  <p>Maligawatta, Colombo 10</p>
                  <p>Sri Lanka</p>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-white/80 mb-2">Contact</p>
                  <p>Tel: +94 11 2446183</p>
                  <p>Fax: +94 11 2446184</p>
                  <p>Email: info@fisheries.gov.lk</p>
                </div>
                <div className="text-center md:text-right">
                  <p className="font-semibold text-white/80 mb-2">Emergency</p>
                  <p className="text-lg font-bold text-[#FFC72C]">Hotline: 1907</p>
                  <p>Available 24/7</p>
                  <p>All Languages</p>
                </div>
              </div>
            </div>

            {/* Copyright */}
            <div className="mt-8 pt-8 border-t border-white/10 text-center">
              <p className="text-white/60 text-sm">
                © {new Date().getFullYear()} Ministry of Fisheries, Sri Lanka. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Compact Version Component
export const GovernmentStampCompact = () => {
  return (
    <div className="bg-[#003366] py-6 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          {/* Left: Emblem and Ministry Name */}
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-white/80" viewBox="0 0 100 100" fill="currentColor">
                <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2"/>
                <path d="M50 20 L60 40 L80 40 L65 55 L70 75 L50 60 L30 75 L35 55 L20 40 L40 40 Z" fill="currentColor"/>
              </svg>
            </div>
            <div>
              <h3 className="text-white font-bold">Ministry of Fisheries</h3>
              <p className="text-white/60 text-sm">Government of Sri Lanka</p>
            </div>
          </div>

          {/* Center: Trilingual Text */}
          <div className="text-center">
            <div className="flex items-center space-x-3 text-white/70 text-sm">
              <span>ධීවර අමාත්‍යාංශය</span>
              <span className="text-white/30">•</span>
              <span>மீன்வள அமைச்சு</span>
            </div>
          </div>

          {/* Right: Flag */}
          <div className="w-14 h-1 rounded-full bg-gradient-to-r from-[#FFC72C] via-[#FF6B35] to-[#00A651]"></div>
        </div>
      </div>
    </div>
  );
};

export default GovernmentStamp;