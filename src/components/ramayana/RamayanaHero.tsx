import React from 'react';
import { Play, Calendar, MapPin, Star } from 'lucide-react';

interface Translation {
  title: string;
  tagline: string;
  subtitle: string;
  description: string;
  beginJourney: string;
  watchVideo: string;
}

interface RamayanaHeroProps {
  onBookingClick: () => void;
}

const RamayanaHero: React.FC<RamayanaHeroProps> = ({ onBookingClick }) => {
  const translation: Translation = {
    title: 'Walk the Ramayana Trail in Sri Lanka',
    tagline: "Trace Sita's footsteps from Ashok Vatika to Hanuman's shrines",
    subtitle: "Follow the Sacred Path of the Ramayana",
    description: "Journey through the mystical sites where Princess Sita's story unfolded. Experience the divine energy of ancient temples, sacred waterfalls, and holy shrines that bridge mythology with reality in the blessed land of Lanka.",
    beginJourney: 'Begin Sacred Pilgrimage',
    watchVideo: 'Watch Sacred Journey'
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Video/Cinemagraph placeholder */}
      <div className="absolute inset-0">
        <div 
          className="w-full h-full bg-cover bg-center bg-fixed"
          style={{
            backgroundImage: `linear-gradient(rgba(139, 69, 19, 0.7), rgba(184, 134, 11, 0.8)), url('https://images.unsplash.com/photo-1466442929976-97f336a657be?w=1920')`
          }}
        />
        {/* Ancient manuscript texture overlay */}
        <div className="absolute inset-0 opacity-20" style={{backgroundImage: "url('data:image/svg+xml,<svg width=\"100\" height=\"100\" xmlns=\"http://www.w3.org/2000/svg\"><g fill=\"%23D4AF37\" fill-opacity=\"0.1\"><path d=\"M25 0h50v100H25z\"/></g></svg>')"}} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Hero Content */}
        <div className="max-w-5xl mx-auto text-center">
          <div className="mb-8 flex justify-center">
            <div className="w-32 h-2 bg-primary rounded-full shadow-lg"></div>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-white drop-shadow-2xl leading-tight">
            {translation.title}
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 text-primary font-semibold drop-shadow-lg">
            {translation.tagline}
          </p>
          
          <p className="text-lg mb-12 max-w-3xl mx-auto text-white/95 drop-shadow-lg leading-relaxed">
            {translation.description}
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button 
              onClick={onBookingClick}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-full font-semibold text-lg transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-3"
            >
              <Calendar size={24} />
              {translation.beginJourney}
            </button>
            
            <button className="bg-card/80 hover:bg-card text-card-foreground px-8 py-4 rounded-full font-semibold text-lg transition-all transform hover:scale-105 shadow-lg backdrop-blur-sm flex items-center justify-center gap-3">
              <Play size={24} />
              {translation.watchVideo}
            </button>
          </div>

          {/* Key Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            <div className="bg-card/80 backdrop-blur-lg p-6 rounded-xl border border-primary/20 shadow-lg">
              <div className="text-3xl font-bold text-primary mb-2">5+</div>
              <div className="text-card-foreground font-medium">Sacred Sites</div>
            </div>
            <div className="bg-card/80 backdrop-blur-lg p-6 rounded-xl border border-primary/20 shadow-lg">
              <div className="text-3xl font-bold text-primary mb-2">7-12</div>
              <div className="text-card-foreground font-medium">Days Journey</div>
            </div>
            <div className="bg-card/80 backdrop-blur-lg p-6 rounded-xl border border-primary/20 shadow-lg">
              <div className="flex items-center justify-center gap-1 mb-2">
                <Star className="text-primary fill-current" size={20} />
                <span className="text-3xl font-bold text-primary">4.9</span>
              </div>
              <div className="text-card-foreground font-medium">Pilgrim Rating</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RamayanaHero;
