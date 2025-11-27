import { Leaf, TreePine, Globe, Heart, Users, ArrowRight, Sparkles, Clock, Star, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const EcotourismPromo = () => {
  const impactStats = [
    { icon: <TreePine className="w-8 h-8" />, number: '10,000+', label: 'Trees Planted' },
    { icon: <Users className="w-8 h-8" />, number: '500+', label: 'Families Supported' },
    { icon: <Globe className="w-8 h-8" />, number: '25+', label: 'Conservation Projects' },
  ];

  const ecoExperiences = [
    {
      id: 'community-village',
      title: 'Community Village Immersion',
      description: 'Live with local families and support village development',
      duration: '5 Days / 4 Nights',
      maxGuests: 8,
      price: 320,
      impact: 'Supports 15 local families',
      features: [
        'Homestay with village families',
        'Traditional cooking classes',
        'Organic farming participation',
        'Local craft workshops'
      ],
      image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800',
      gradient: 'from-green-600 to-emerald-600'
    },
    {
      id: 'conservation-project',
      title: 'Wildlife Conservation Project',
      description: 'Participate in elephant and leopard conservation efforts',
      duration: '7 Days / 6 Nights',
      maxGuests: 6,
      price: 480,
      impact: 'Protects 500 acres of habitat',
      features: [
        'Elephant research participation',
        'Wildlife monitoring activities',
        'Habitat restoration work',
        'Conservation education programs'
      ],
      image: 'https://images.unsplash.com/photo-1549366021-9f761d040a94?w=800',
      gradient: 'from-emerald-600 to-teal-600'
    },
    {
      id: 'rainforest-restoration',
      title: 'Rainforest Restoration Camp',
      description: "Help restore Sri Lanka's ancient rainforest ecosystems",
      duration: '6 Days / 5 Nights',
      maxGuests: 10,
      price: 380,
      impact: 'Plants 200 native trees',
      features: [
        'Tree planting activities',
        'Endemic species monitoring',
        'Stream restoration work',
        'Guided nature walks'
      ],
      image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800',
      gradient: 'from-green-700 to-lime-600'
    }
  ];

  return (
    <section className="relative py-24 overflow-hidden bg-gradient-to-br from-emerald-900 via-green-800 to-teal-900">
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-400/20 backdrop-blur-sm rounded-full mb-6">
            <Sparkles className="w-5 h-5 text-green-300" />
            <span className="text-green-200 font-medium text-sm">Travel That Makes a Difference</span>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            <span className="text-green-300">Eco</span>tourism
            <span className="block text-2xl md:text-3xl font-normal mt-2 text-white/80">
              Sustainable Adventures
            </span>
          </h2>

          <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
            Experience Sri Lanka's natural wonders while actively contributing to conservation
            and supporting local communities.
          </p>
        </div>

        {/* Impact Stats */}
        <div className="flex flex-wrap justify-center gap-8 mb-16">
          {impactStats.map((stat, index) => (
            <div
              key={index}
              className="flex items-center gap-4 px-6 py-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20"
            >
              <div className="text-green-300">{stat.icon}</div>
              <div>
                <div className="text-2xl font-bold text-white">{stat.number}</div>
                <div className="text-sm text-white/70">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Experience Booking Tiles */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {ecoExperiences.map((experience) => (
            <div
              key={experience.id}
              className="group relative overflow-hidden rounded-3xl bg-white shadow-2xl hover:shadow-green-500/20 transition-all duration-500 transform hover:-translate-y-2"
            >
              {/* Image Section */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={experience.image}
                  alt={experience.title}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${experience.gradient} opacity-60`} />

                {/* Eco Badge */}
                <div className="absolute top-4 left-4 flex items-center gap-1 px-3 py-1.5 bg-green-500 text-white text-xs font-bold rounded-full">
                  <Leaf className="w-3 h-3" />
                  Eco-Friendly
                </div>

                {/* Title Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h3 className="text-2xl font-bold text-white mb-1">{experience.title}</h3>
                  <p className="text-white/90 text-sm">{experience.description}</p>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-6 space-y-5">
                {/* Duration & Guests */}
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-green-600" />
                    <span className="font-medium">{experience.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-green-600" />
                    <span>Up to {experience.maxGuests} guests</span>
                  </div>
                </div>

                {/* Impact Badge */}
                <div className="bg-green-50 p-3 rounded-xl border-l-4 border-green-500">
                  <p className="text-green-800 font-semibold text-sm flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    Impact: {experience.impact}
                  </p>
                </div>

                {/* Features List */}
                <ul className="space-y-2">
                  {experience.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Price & CTA */}
                <div className="pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-3xl font-bold text-gray-900">${experience.price}</span>
                      <span className="text-sm text-gray-500 ml-1">/person</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>

                  <Link to="/tours/ecotourism">
                    <button className={`w-full py-3.5 bg-gradient-to-r ${experience.gradient} text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg flex items-center justify-center gap-2`}>
                      <Heart className="w-5 h-5" />
                      Join Conservation Effort
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <Link to="/tours/ecotourism">
            <button className="group inline-flex items-center gap-3 px-10 py-5 bg-white text-green-700 font-bold text-lg rounded-full transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl">
              <Leaf className="w-6 h-6" />
              View All Eco Experiences
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>

          <p className="mt-6 text-white/70 text-sm">
            100% of proceeds support local conservation projects
          </p>
        </div>
      </div>
    </section>
  );
};

export default EcotourismPromo;
