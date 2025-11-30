import { Plane, Shield, Clock, Users, Star } from 'lucide-react';
import AirportTransferBookingEngine from '@/components/booking/AirportTransferBookingEngine';

const AirportTransferSection = () => {
  return (
    <section
      style={{
        background: 'linear-gradient(135deg, #0c4a6e 0%, #0369a1 50%, #0ea5e9 100%)',
        padding: '60px 0 80px',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Decorative Elements */}
      <div style={{ position: 'absolute', top: '20px', right: '5%', opacity: 0.06 }}>
        <Plane style={{ width: '200px', height: '200px', color: 'white', transform: 'rotate(45deg)' }} />
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 16px', position: 'relative', zIndex: 10 }}>
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              borderRadius: '9999px',
              backgroundColor: 'rgba(255,255,255,0.15)',
              marginBottom: '16px',
              backdropFilter: 'blur(8px)'
            }}
          >
            <Plane style={{ width: '20px', height: '20px', color: '#fcd34d' }} />
            <span style={{ color: '#fcd34d', fontWeight: 600, fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Premium Transfer Service
            </span>
          </div>
          <h2 style={{ fontSize: '38px', fontWeight: 700, color: 'white', marginBottom: '12px', lineHeight: 1.2 }}>
            Sri Lankan Airport Transfers
          </h2>
          <p style={{ fontSize: '18px', color: '#bae6fd', maxWidth: '700px', margin: '0 auto', lineHeight: 1.6 }}>
            Book your airport transfer now. Fixed prices, flight tracking, and professional drivers.
          </p>
        </div>

        {/* Features Strip */}
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '24px', marginBottom: '40px' }}>
          {[
            { icon: Shield, label: 'Fixed Prices' },
            { icon: Plane, label: 'Flight Tracking' },
            { icon: Clock, label: '24/7 Service' },
            { icon: Users, label: 'Meet & Greet' },
            { icon: Star, label: '4.9/5 Rating' }
          ].map((feature, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                backgroundColor: 'rgba(255,255,255,0.1)',
                borderRadius: '9999px',
                backdropFilter: 'blur(8px)'
              }}
            >
              <feature.icon style={{ width: '18px', height: '18px', color: '#fcd34d' }} />
              <span style={{ color: 'white', fontSize: '14px', fontWeight: 500 }}>{feature.label}</span>
            </div>
          ))}
        </div>

        {/* Embedded Booking Engine */}
        <div
          style={{
            backgroundColor: '#f8fafc',
            borderRadius: '24px',
            padding: '24px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }}
        >
          <AirportTransferBookingEngine embedded={true} />
        </div>
      </div>
    </section>
  );
};

export default AirportTransferSection;
