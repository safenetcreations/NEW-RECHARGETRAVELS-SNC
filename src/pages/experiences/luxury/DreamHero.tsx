import React from 'react';
import { Crown, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const DreamHero = () => {
    const scrollToJourneys = () => {
        document.getElementById('journeys')?.scrollIntoView({ behavior: 'smooth' });
    };

    const scrollToInquiry = () => {
        document.getElementById('inquiry')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section className="relative min-h-[85vh] w-full bg-[#050505] overflow-hidden">
            {/* 1. Solid Background Color (Prevents white flash) */}
            <div className="absolute inset-0 bg-[#050505] z-0" />

            {/* 2. Background Image with eager loading */}
            <div className="absolute inset-0 z-0">
                <img
                    src="https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=1920&q=85&auto=format&fit=crop"
                    alt="Dream Journeys Background"
                    className="h-full w-full object-cover opacity-90"
                    loading="eager"
                    fetchPriority="high"
                    decoding="sync"
                />
                {/* Gradient Overlays for Text Readability */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-[#030303]" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/60" />
            </div>

            {/* 3. Content Container - Centered and Static */}
            <div className="relative z-10 flex min-h-[85vh] flex-col items-center justify-center px-4 py-20 text-center sm:px-6">

                {/* Glass Card Container */}
                <div className="w-full max-w-4xl rounded-3xl border border-white/10 bg-black/40 p-8 backdrop-blur-sm md:p-12 shadow-2xl">

                    {/* Crown Icon Decoration */}
                    <div className="mb-8 flex items-center justify-center gap-4 text-amber-300">
                        <div className="h-px w-12 bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-70" />
                        <Crown className="h-8 w-8 text-amber-300 drop-shadow-[0_0_10px_rgba(252,211,77,0.5)]" />
                        <div className="h-px w-12 bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-70" />
                    </div>

                    {/* Main Title - Optimized for no FOUT/FOIT issues */}
                    <h1 className="mb-6 text-4xl font-light tracking-tight text-white drop-shadow-2xl sm:text-5xl md:text-6xl lg:text-7xl">
                        Dream Journeys
                    </h1>

                    {/* Subtitle */}
                    <p className="mb-8 text-lg font-light tracking-wide text-amber-200 drop-shadow-lg sm:text-xl md:text-2xl">
                        Bespoke travel experiences crafted for the discerning explorer
                    </p>

                    {/* Description */}
                    <p className="mx-auto mb-10 max-w-3xl text-sm font-light leading-relaxed text-gray-200 drop-shadow-md sm:text-base md:text-lg">
                        Every Dream Journey is conceived, designed, and executed for you alone. We combine assets that have never been combined, arrange access that has never been granted, and create moments that exist nowhere else on earth.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                        <Button
                            size="lg"
                            onClick={scrollToJourneys}
                            className="h-auto min-w-[200px] rounded-none border-2 border-amber-400 bg-amber-500/20 px-8 py-4 text-sm font-medium uppercase tracking-[0.15em] text-amber-100 backdrop-blur-sm transition-all hover:bg-amber-500/30 hover:border-amber-300 hover:text-white hover:shadow-[0_0_20px_rgba(251,191,36,0.3)]"
                        >
                            Explore Journeys
                        </Button>

                        <Button
                            size="lg"
                            onClick={scrollToInquiry}
                            className="h-auto min-w-[200px] rounded-none border-2 border-white/30 bg-white/5 px-8 py-4 text-sm font-medium uppercase tracking-[0.15em] text-white backdrop-blur-sm transition-all hover:bg-white/10 hover:border-white/50 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                        >
                            Private Consultation
                        </Button>
                    </div>

                </div>

                {/* Scroll Indicator (Outside the glass card) */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 transform text-center">
                    <p className="mb-2 text-[10px] uppercase tracking-[0.3em] text-amber-300/80">Scroll to discover</p>
                    <div className="mx-auto h-12 w-px bg-gradient-to-b from-amber-400 via-amber-400/50 to-transparent opacity-70" />
                </div>

            </div>
        </section>
    );
};

export default DreamHero;
