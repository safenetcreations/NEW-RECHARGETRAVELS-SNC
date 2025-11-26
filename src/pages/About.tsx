
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Heart, Globe, Award, Users, MessageCircle } from 'lucide-react';

const About: React.FC = () => {
  useEffect(() => {
    // Create waterfall animation
    const createWaterfall = () => {
      const waterfall = document.getElementById('waterfall');
      if (!waterfall) return;
      
      const createDrop = () => {
        const drop = document.createElement('div');
        drop.className = 'waterfall-drop';
        drop.style.left = Math.random() * 100 + '%';
        drop.style.animationDuration = (Math.random() * 3 + 2) + 's';
        drop.style.opacity = (Math.random() * 0.6 + 0.3).toString();
        waterfall.appendChild(drop);
        
        setTimeout(() => {
          if (waterfall.contains(drop)) {
            drop.remove();
          }
        }, 5000);
      };
      
      // Create drops continuously
      const interval = setInterval(createDrop, 200);
      return () => clearInterval(interval);
    };

    // Create mist particles
    const createMist = () => {
      const mistContainer = document.getElementById('mist');
      if (!mistContainer) return;
      
      const createMistParticle = () => {
        const particle = document.createElement('div');
        particle.className = 'mist-particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDuration = (Math.random() * 4 + 3) + 's';
        particle.style.animationDelay = (Math.random() * 2) + 's';
        mistContainer.appendChild(particle);
        
        setTimeout(() => {
          if (mistContainer.contains(particle)) {
            particle.remove();
          }
        }, 7000);
      };
      
      const interval = setInterval(createMistParticle, 300);
      return () => clearInterval(interval);
    };

    // Create ocean waves
    const createWaves = () => {
      const waveContainer = document.getElementById('waves');
      if (!waveContainer) return;
      
      for (let i = 0; i < 3; i++) {
        const wave = document.createElement('div');
        wave.className = `ocean-wave wave-${i + 1}`;
        wave.style.animationDelay = `${i * 0.5}s`;
        waveContainer.appendChild(wave);
      }
    };

    // Create tea plantation mist
    const createTeaMist = () => {
      const teaMistContainer = document.getElementById('tea-mist');
      if (!teaMistContainer) return;
      
      for (let i = 0; i < 5; i++) {
        const cloud = document.createElement('div');
        cloud.className = 'tea-cloud';
        cloud.style.left = Math.random() * 100 + '%';
        cloud.style.animationDelay = `${i * 2}s`;
        cloud.style.animationDuration = `${8 + Math.random() * 4}s`;
        teaMistContainer.appendChild(cloud);
      }
    };

    // Initialize all animations
    const cleanupWaterfall = createWaterfall();
    const cleanupMist = createMist();
    createWaves();
    createTeaMist();

    // Smooth scroll for anchor links
    const handleAnchorClick = (e: Event) => {
      const target = e.target as HTMLAnchorElement;
      if (target.getAttribute('href')?.startsWith('#')) {
        e.preventDefault();
        const element = document.querySelector(target.getAttribute('href')!);
        element?.scrollIntoView({ behavior: 'smooth' });
      }
    };

    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', handleAnchorClick);
    });

    return () => {
      cleanupWaterfall?.();
      cleanupMist?.();
      document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.removeEventListener('click', handleAnchorClick);
      });
    };
  }, []);

  return (
    <>
      <Helmet>
        <title>Recharge Travels - SLTDA Certified Sri Lanka Tours | Waterfall & Beach Adventures</title>
        <meta name="description" content="Experience Sri Lanka's majestic waterfalls, pristine beaches, and tea estates with SLTDA-certified driver-guides. Instant WhatsApp booking, 24/7 support, modern vehicle fleet." />
        <meta name="keywords" content="Sri Lanka tours, SLTDA certified drivers, waterfall tours, beach tours, tea plantation visits, driver guide Sri Lanka, tourism Sri Lanka" />
        <meta property="og:title" content="Recharge Travels - SLTDA Certified Sri Lanka Tours" />
        <meta property="og:description" content="Your journey begins with a simple message. Experience authentic Sri Lankan hospitality with certified guides." />
        <meta property="og:type" content="website" />
      </Helmet>

      <Header />
      
      <div className="min-h-screen bg-background">
        {/* Majestic Waterfall Hero Section */}
        <section className="waterfall-hero relative min-h-screen flex items-center justify-center text-center text-white overflow-hidden">
          {/* Mountain Silhouettes */}
          <div className="mountain-silhouettes">
            <div className="mountain mountain-1"></div>
            <div className="mountain mountain-2"></div>
            <div className="mountain mountain-3"></div>
          </div>
          
          {/* Waterfall Animation */}
          <div id="waterfall" className="waterfall-container"></div>
          
          {/* Mist Effects */}
          <div id="mist" className="mist-container"></div>
          
          {/* Tropical Vegetation */}
          <div className="tropical-vegetation">
            <div className="palm-tree palm-left"></div>
            <div className="palm-tree palm-right"></div>
            <div className="jungle-foliage"></div>
          </div>
          
          {/* Hero Content */}
          <div className="hero-content relative z-10 max-w-4xl mx-auto px-4">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
              Sri Lanka's Natural Paradise
            </h1>
            <h2 className="text-2xl md:text-3xl mb-4" style={{ color: 'var(--beach)' }}>
              SLTDA Certified Tours
            </h2>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Experience the island's majestic waterfalls, pristine beaches, and lush tea estates with professional certified driver-guides
            </p>
            <p className="text-lg mb-8 opacity-80">
              Your journey begins with a simple message • You're not just a tourist, you're an honored guest
            </p>
            <a 
              href="https://wa.me/94777721999?text=Hello%20Recharge%20Travels,%20I'm%20interested%20in%20Sri%20Lanka%20tours" 
              className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-lg"
            >
              📱 WhatsApp +94 77 77 21 999
            </a>
          </div>
        </section>

        {/* Pristine Beach Paradise Section */}
        <section id="why-choose-us" className="beach-paradise relative py-20 overflow-hidden">
          {/* Sunset Sky Gradient */}
          <div className="sunset-gradient"></div>
          
          {/* Ocean Waves */}
          <div id="waves" className="waves-container"></div>
          
          {/* Palm Trees */}
          <div className="beach-palms">
            <div className="beach-palm beach-palm-1"></div>
            <div className="beach-palm beach-palm-2"></div>
            <div className="beach-palm beach-palm-3"></div>
          </div>
          
          {/* Beach Content */}
          <div className="relative z-10 container mx-auto px-4 text-center text-white">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              🏖️ Pristine Beaches & Coastal Adventures
            </h2>
            <p className="text-xl mb-12">Golden sand beaches, crystal waters, and unforgettable sunsets</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <div className="service-card bg-white/10 backdrop-blur-md rounded-xl p-8 transition-all duration-300 hover:transform hover:-translate-y-2">
                <div className="text-4xl mb-4">🐘</div>
                <h3 className="text-2xl font-bold mb-4" style={{ color: 'var(--beach)' }}>Wildlife & Nature</h3>
                <p className="text-white/90">Elephant watching at Minneriya, leopard safaris at Yala, and whale watching in Mirissa with expert local guides</p>
              </div>
              
              <div className="service-card bg-white/10 backdrop-blur-md rounded-xl p-8 transition-all duration-300 hover:transform hover:-translate-y-2">
                <div className="text-4xl mb-4">🏄</div>
                <h3 className="text-2xl font-bold mb-4" style={{ color: 'var(--beach)' }}>Water Sports & Activities</h3>
                <p className="text-white/90">Surfing in Arugam Bay, snorkeling in Hikkaduwa, and deep-sea fishing with professional equipment and safety gear</p>
              </div>
              
              <div className="service-card bg-white/10 backdrop-blur-md rounded-xl p-8 transition-all duration-300 hover:transform hover:-translate-y-2">
                <div className="text-4xl mb-4">🍽️</div>
                <h3 className="text-2xl font-bold mb-4" style={{ color: 'var(--beach)' }}>Authentic Experiences</h3>
                <p className="text-white/90">Cook with local families, visit traditional markets, and learn authentic recipes passed down through generations</p>
              </div>
            </div>
          </div>
        </section>

        {/* Misty Tea Plantation Hills Section */}
        <section className="tea-plantation relative py-20 overflow-hidden">
          {/* Rolling Hills */}
          <div className="tea-hills">
            <div className="hill hill-1"></div>
            <div className="hill hill-2"></div>
            <div className="hill hill-3"></div>
          </div>
          
          {/* Tea Plantation Rows */}
          <div className="tea-terraces">
            <div className="terrace terrace-1"></div>
            <div className="terrace terrace-2"></div>
            <div className="terrace terrace-3"></div>
          </div>
          
          {/* Tea Picker Silhouette */}
          <div className="tea-picker"></div>
          
          {/* Misty Clouds */}
          <div id="tea-mist" className="tea-mist-container"></div>
          
          {/* Tea Content */}
          <div className="relative z-10 container mx-auto px-4 text-center text-white">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              🍃 Misty Tea Estates & Hill Country
            </h2>
            <p className="text-xl mb-12">Journey through emerald tea terraces and cool mountain air</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <div className="service-card bg-white/10 backdrop-blur-md rounded-xl p-8 transition-all duration-300 hover:transform hover:-translate-y-2">
                <div className="text-4xl mb-4">🚗</div>
                <h3 className="text-2xl font-bold mb-4" style={{ color: 'var(--tea)' }}>Modern Vehicle Fleet</h3>
                <p className="text-white/90">Premium sedans (2-4 passengers), family vans (7-15), and luxury coaches (16-30+) - all with GPS tracking and safety equipment</p>
              </div>
              
              <div className="service-card bg-white/10 backdrop-blur-md rounded-xl p-8 transition-all duration-300 hover:transform hover:-translate-y-2">
                <div className="text-4xl mb-4">👨‍🦽</div>
                <h3 className="text-2xl font-bold mb-4" style={{ color: 'var(--tea)' }}>SLTDA Certified Drivers</h3>
                <p className="text-white/90">All drivers licensed by Sri Lanka Tourism Development Authority with 5+ years experience and SLITHM training certification</p>
              </div>
              
              <div className="service-card bg-white/10 backdrop-blur-md rounded-xl p-8 transition-all duration-300 hover:transform hover:-translate-y-2">
                <div className="text-4xl mb-4">💬</div>
                <h3 className="text-2xl font-bold mb-4" style={{ color: 'var(--tea)' }}>24/7 Support</h3>
                <p className="text-white/90">Instant WhatsApp response, multilingual support (English/Tamil/Sinhalese), and real-time trip coordination</p>
              </div>
            </div>
            
            {/* FAQ Section */}
            <h3 className="text-3xl font-bold mb-8">Frequently Asked Questions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left mb-12">
              <div className="faq-item bg-white/10 backdrop-blur-md rounded-xl p-6">
                <h4 className="text-xl font-bold mb-3" style={{ color: 'var(--beach)' }}>What makes Recharge Travels different?</h4>
                <p className="text-white/90">We provide SLTDA-certified driver-guides with modern tourism-grade vehicles, offering both professional driving and expert local guiding in one service.</p>
              </div>
              
              <div className="faq-item bg-white/10 backdrop-blur-md rounded-xl p-6">
                <h4 className="text-xl font-bold mb-3" style={{ color: 'var(--beach)' }}>Are your drivers certified?</h4>
                <p className="text-white/90">Yes, all our drivers are SLTDA licensed and trained through Sri Lanka Institute of Tourism & Hotel Management with 5+ years experience.</p>
              </div>
              
              <div className="faq-item bg-white/10 backdrop-blur-md rounded-xl p-6">
                <h4 className="text-xl font-bold mb-3" style={{ color: 'var(--beach)' }}>What vehicle types do you offer?</h4>
                <p className="text-white/90">Premium sedans (2-4 passengers), family vans (7-15 passengers), and group coaches (16-30+ passengers) - all modern and fully equipped.</p>
              </div>
              
              <div className="faq-item bg-white/10 backdrop-blur-md rounded-xl p-6">
                <h4 className="text-xl font-bold mb-3" style={{ color: 'var(--beach)' }}>Do you provide 24/7 support?</h4>
                <p className="text-white/90">Yes, we offer instant WhatsApp response and 24/7 customer support throughout your Sri Lankan journey with GPS tracking for safety.</p>
              </div>
            </div>
            
            {/* Testimonial */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-8">
              <h4 className="text-xl font-bold mb-4" style={{ color: 'var(--beach)' }}>⭐ TripAdvisor Review</h4>
              <p className="italic mb-4 text-white/90">"Exceptional service from start to finish. Our driver was knowledgeable, punctual, and went above and beyond to show us hidden gems. The vehicle was spotless and comfortable. Highly recommend for authentic Sri Lankan experiences!"</p>
              <p className="font-bold">- Sarah M., Public Relations Manager, Australia</p>
            </div>
          </div>
        </section>
      </div>

      {/* Fixed WhatsApp Button */}
      <a 
        href="https://wa.me/94777721999?text=Hello%20Recharge%20Travels,%20I'm%20interested%20in%20Sri%20Lanka%20tours" 
        className="whatsapp-floating fixed bottom-8 right-8 z-50 bg-green-500 text-white px-6 py-4 rounded-full font-bold flex items-center gap-2 shadow-lg transition-all duration-300 hover:transform hover:-translate-y-1"
      >
        <MessageCircle className="h-5 w-5" />
        💬 Chat Now
      </a>

      <Footer />
    </>
  );
};

export default About;
