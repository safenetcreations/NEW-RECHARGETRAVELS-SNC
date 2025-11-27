import { ArrowRight, Waves, Camera, Mountain, Utensils, TreePine, Ship } from 'lucide-react';
import { Link } from 'react-router-dom';

const FeaturedExperiencesStrip = () => {
  const experiences = [
    {
      id: 1,
      title: 'Hikkaduwa Water Sports',
      description: 'Surfing, diving & beach fun',
      image: 'https://images.unsplash.com/photo-1530870110042-98b2cb110834?w=600&h=400&fit=crop',
      link: '/experiences/hikkaduwa-water-sports',
      icon: Waves,
      badge: 'Popular'
    },
    {
      id: 2,
      title: 'Wildlife Safari',
      description: 'Yala & Udawalawe adventures',
      image: 'https://images.unsplash.com/photo-1549366021-9f761d040a94?w=600&h=400&fit=crop',
      link: '/tours/wild',
      icon: TreePine,
      badge: 'Trending'
    },
    {
      id: 3,
      title: 'Tea Trails Expedition',
      description: 'Hill country tea plantations',
      image: 'https://images.unsplash.com/photo-1571296251827-6e6ce8929b48?w=600&h=400&fit=crop',
      link: '/experiences/tea-trails',
      icon: Mountain,
      badge: 'New'
    },
    {
      id: 4,
      title: 'Whale Watching',
      description: 'Mirissa blue whale tours',
      image: 'https://images.unsplash.com/photo-1568430462989-44163eb1752f?w=600&h=400&fit=crop',
      link: '/experiences/whale-watching',
      icon: Ship,
      badge: 'Seasonal'
    },
    {
      id: 5,
      title: 'Photography Tours',
      description: 'Capture stunning moments',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop',
      link: '/experiences/photography',
      icon: Camera,
      badge: 'Featured'
    },
    {
      id: 6,
      title: 'Culinary Experience',
      description: 'Authentic Sri Lankan cuisine',
      image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&h=400&fit=crop',
      link: '/tours/culinary',
      icon: Utensils,
      badge: 'Must Try'
    }
  ];

  return (
    <section className="py-12 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Featured <span className="text-orange-400">Experiences</span>
            </h2>
            <p className="text-slate-400 mt-2">Discover our most popular adventures</p>
          </div>
          <Link to="/experiences" className="hidden md:flex items-center gap-2 text-orange-400 hover:text-orange-300 transition-colors font-medium">
            View All
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Horizontal Scroll Container */}
        <div className="relative">
          <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {experiences.map((exp) => (
              <Link
                key={exp.id}
                to={exp.link}
                className="flex-shrink-0 w-[300px] group"
              >
                <div className="relative h-[200px] rounded-2xl overflow-hidden">
                  <img
                    src={exp.image}
                    alt={exp.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                  {/* Badge */}
                  <div className="absolute top-3 left-3 px-3 py-1 bg-orange-500 text-white text-xs font-bold rounded-full">
                    {exp.badge}
                  </div>

                  {/* Icon */}
                  <div className="absolute top-3 right-3 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <exp.icon className="w-5 h-5 text-white" />
                  </div>

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-lg font-bold text-white mb-1 group-hover:text-orange-300 transition-colors">
                      {exp.title}
                    </h3>
                    <p className="text-white/80 text-sm">{exp.description}</p>
                  </div>

                  {/* Hover Arrow */}
                  <div className="absolute bottom-4 right-4 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                    <ArrowRight className="w-4 h-4 text-white" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Mobile View All Link */}
        <div className="mt-6 text-center md:hidden">
          <Link to="/experiences" className="inline-flex items-center gap-2 text-orange-400 hover:text-orange-300 transition-colors font-medium">
            View All Experiences
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};

export default FeaturedExperiencesStrip;
