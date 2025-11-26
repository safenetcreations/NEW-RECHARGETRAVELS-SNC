import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Car, ChevronDown, Star, Shield, Headphones, Map, Bus, Train, Crown, Building2, CalendarCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TransferBookingForm from '@/modules/transfers/components/TransferBookingForm';
import PrivateTourBookingForm from '@/components/booking/PrivateTourBookingForm';
import GroupTransportBookingForm from '@/components/booking/GroupTransportBookingForm';
import TrainBookingForm from '@/components/booking/TrainBookingForm';
import { getHeroSlides, HeroSlide, DEFAULT_SLIDES } from '@/services/heroService';

const LuxuryHeroSection = () => {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState<HeroSlide>(DEFAULT_SLIDES[0]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const updateSlideBasedOnHour = async () => {
      try {
        const slides = await getHeroSlides();
        if (slides && slides.length > 0) {
          const hour = new Date().getHours();
          const index = hour % slides.length;
          setCurrentSlide(slides[index]);
        }
      } catch (error) {
        console.error('Failed to update slide:', error);
      } finally {
        setLoading(false);
      }
    };

    updateSlideBasedOnHour();

    const interval = setInterval(() => {
      const date = new Date();
      if (date.getMinutes() === 0) {
        updateSlideBasedOnHour();
      }
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const scrollToContent = () => {
    const content = document.getElementById('featured-destinations');
    if (content) {
      content.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div style={{
      position: 'relative',
      height: '100vh',
      width: '100%',
      overflow: 'hidden',
      backgroundColor: '#000'
    }}>
      {/* Background Image */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.4)',
          zIndex: 1
        }} />
        <img
          src={currentSlide.image}
          alt={currentSlide.title}
          onError={(e) => {
            e.currentTarget.style.display = 'none'; // Hide broken image to avoid alt text in corner
            e.currentTarget.parentElement!.style.backgroundImage = `url('https://i.imgur.com/AEnBWJf.jpeg')`;
            e.currentTarget.parentElement!.style.backgroundSize = 'cover';
            e.currentTarget.parentElement!.style.backgroundPosition = 'center';
          }}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            opacity: loading ? 0 : 1,
            transition: 'opacity 1s ease-in-out'
          }}
        />
      </div>

      {/* Content Container */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        padding: '0 20px'
      }}>

        {/* Main Text Content */}
        <div style={{
          textAlign: 'center',
          marginBottom: '40px',
          maxWidth: '900px',
          width: '100%'
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)',
            padding: '8px 16px',
            borderRadius: '9999px',
            marginBottom: '24px',
            border: '1px solid rgba(255,255,255,0.2)'
          }}>
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span style={{ fontSize: '14px', fontWeight: 500 }}>#1 Premium Travel Service in Sri Lanka</span>
          </div>

          <h1 style={{
            fontSize: 'clamp(40px, 5vw, 80px)',
            fontWeight: 'bold',
            lineHeight: 1.1,
            marginBottom: '24px',
            textShadow: '0 2px 10px rgba(0,0,0,0.3)',
            fontFamily: 'Playfair Display, serif'
          }}>
            {currentSlide.title}
          </h1>

          <p style={{
            fontSize: 'clamp(18px, 2vw, 24px)',
            maxWidth: '700px',
            margin: '0 auto 32px',
            textShadow: '0 2px 5px rgba(0,0,0,0.3)',
            opacity: 0.9
          }}>
            {currentSlide.subtitle}
          </p>

          {/* Trust Indicators */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '30px',
            flexWrap: 'wrap',
            marginBottom: '40px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: '8px', borderRadius: '50%' }}>
                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: 'bold', fontSize: '14px' }}>4.9/5 Rating</div>
                <div style={{ fontSize: '12px', opacity: 0.8 }}>From 1000+ Reviews</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: '8px', borderRadius: '50%' }}>
                <Shield className="w-5 h-5 text-green-400" />
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: 'bold', fontSize: '14px' }}>Safe & Secure</div>
                <div style={{ fontSize: '12px', opacity: 0.8 }}>Verified Drivers</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: '8px', borderRadius: '50%' }}>
                <Headphones className="w-5 h-5 text-blue-400" />
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: 'bold', fontSize: '14px' }}>24/7 Support</div>
                <div style={{ fontSize: '12px', opacity: 0.8 }}>Always Here For You</div>
              </div>
            </div>
          </div>

          {/* Quick Access Buttons */}
          {!isBookingOpen && (
            <div className="flex flex-wrap justify-center gap-4 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
              <Link to="/tours/luxury">
                <Button variant="outline" className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20 hover:text-white transition-all duration-300 rounded-full px-6 py-6 text-lg group">
                  <Crown className="w-5 h-5 mr-2 text-yellow-400 group-hover:scale-110 transition-transform" />
                  Elite Concierge
                </Button>
              </Link>

              <Link to="/hotels">
                <Button variant="outline" className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20 hover:text-white transition-all duration-300 rounded-full px-6 py-6 text-lg group">
                  <Building2 className="w-5 h-5 mr-2 text-blue-400 group-hover:scale-110 transition-transform" />
                  Luxury Hotels
                </Button>
              </Link>

              <Link to="/book-now">
                <Button className="bg-gradient-to-r from-orange-500 to-rose-600 text-white hover:from-orange-600 hover:to-rose-700 transition-all duration-300 rounded-full px-8 py-6 text-lg shadow-lg hover:shadow-xl hover:scale-105 border-0 group">
                  <CalendarCheck className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                  Book Now
                </Button>
              </Link>
            </div>
          )}

          {/* Booking Widget Toggle */}
          <div style={{ position: 'relative', zIndex: 50 }}>
            {!isBookingOpen ? (
              <Button
                onClick={() => setIsBookingOpen(true)}
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-xl rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
              >
                <Car className="w-6 h-6 mr-2" />
                Book Your Journey
              </Button>
            ) : (
              <div className="w-full max-w-4xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                <div className="bg-blue-600 p-4 flex justify-between items-center">
                  <h3 className="text-white font-bold text-lg flex items-center gap-2">
                    <Car className="w-5 h-5" />
                    Book Your Journey
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsBookingOpen(false)}
                    className="text-white hover:bg-blue-700"
                  >
                    Close
                  </Button>
                </div>

                <div className="p-4 bg-gray-50">
                  <Tabs defaultValue="transfer" className="w-full">
                    <TabsList className="grid w-full grid-cols-4 mb-4">
                      <TabsTrigger value="transfer" className="flex items-center gap-2">
                        <Car className="w-4 h-4" /> Transfers
                      </TabsTrigger>
                      <TabsTrigger value="tours" className="flex items-center gap-2">
                        <Map className="w-4 h-4" /> Tours
                      </TabsTrigger>
                      <TabsTrigger value="group" className="flex items-center gap-2">
                        <Bus className="w-4 h-4" /> Group
                      </TabsTrigger>
                      <TabsTrigger value="train" className="flex items-center gap-2">
                        <Train className="w-4 h-4" /> Train
                      </TabsTrigger>
                    </TabsList>

                    <div className="max-h-[60vh] overflow-y-auto pr-2">
                      <TabsContent value="transfer">
                        <TransferBookingForm />
                      </TabsContent>
                      <TabsContent value="tours">
                        <PrivateTourBookingForm />
                      </TabsContent>
                      <TabsContent value="group">
                        <GroupTransportBookingForm />
                      </TabsContent>
                      <TabsContent value="train">
                        <TrainBookingForm />
                      </TabsContent>
                    </div>
                  </Tabs>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      {!isBookingOpen && (
        <div style={{
          position: 'absolute',
          bottom: '40px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
          animation: 'bounce 2s infinite'
        }}>
          <Button
            variant="ghost"
            size="icon"
            onClick={scrollToContent}
            className="text-white hover:bg-white/10 rounded-full"
          >
            <ChevronDown className="w-8 h-8" />
          </Button>
        </div>
      )}

      {/* Bottom Gradient */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height: '150px',
        background: 'linear-gradient(to top, #000, transparent)',
        zIndex: 5
      }} />

      <style>{`
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0) translateX(-50%); }
          40% { transform: translateY(-10px) translateX(-50%); }
          60% { transform: translateY(-5px) translateX(-50%); }
        }
      `}</style>
    </div>
  );
};

export default LuxuryHeroSection;
