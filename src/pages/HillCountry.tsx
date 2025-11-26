import React from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Users, Star, Mountain, Coffee, Train, Sunrise } from 'lucide-react';
import { usePageContent } from '@/hooks/usePageContent';
import LoadingSpinner from '@/components/LoadingSpinner'; // Assuming you have a loading spinner component

const HillCountry = () => {
  const { content, loading, error } = usePageContent();

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><LoadingSpinner /></div>;
  }

  if (error) {
    return <div className="text-center py-20">Error: {error}</div>;
  }

  if (!content) {
    return <div className="text-center py-20">No content found for this page.</div>;
  }
  
  const { heroTitle, heroSubtitle, heroImage, sections, metaTitle, metaDescription } = content;

  const destinationsSection = sections.find(s => s.id === 'destinations');
  const teaSection = sections.find(s => s.id === 'tea-culture');
  const railwaySection = sections.find(s => s.id === 'mountain-railway');

  return (
    <>
      <Helmet>
        <title>{metaTitle || 'Hill Country Tours in Sri Lanka - Recharge Travels'}</title>
        <meta name="description" content={metaDescription || "Experience the cool climate and tea plantations of Sri Lanka's highlands."} />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Header />
        
        {/* Hero Section */}
        <section 
          className="relative h-screen flex items-center justify-center bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(rgba(34,139,34,0.3), rgba(107,142,35,0.4)), url('${heroImage || 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'}')`
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-tea-light/20 via-transparent to-tea-deep/40"></div>
          <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
            <h1 className="text-6xl md:text-7xl font-cinzel font-bold mb-6 animate-fade-in">
              {heroTitle || 'Misty Mountains'}
            </h1>
            <p className="text-xl md:text-2xl font-playfair mb-8 animate-fade-in opacity-90">
              {heroSubtitle || 'Journey through emerald tea estates and mist-covered peaks'}
            </p>
            <Button 
              size="lg" 
              className="bg-tea-deep hover:bg-tea-light text-white px-8 py-4 text-lg animate-scale-in"
            >
              Explore Hill Country
            </Button>
          </div>
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <Mountain className="w-8 h-8 text-white" />
          </div>
        </section>

        {/* Hill Country Destinations */}
        {destinationsSection && (
            <section className="py-20 bg-gradient-to-br from-background via-tea-light/5 to-background">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                <h2 className="text-5xl font-cinzel font-bold text-tea-deep mb-6">{destinationsSection.heading || 'Highland Treasures'}</h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-playfair">
                    {destinationsSection.content || 'Discover cool climate retreats, rolling tea plantations, and breathtaking mountain vistas'}
                </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {(destinationsSection.settings?.destinations || []).map((destination, index) => (
                    <Card 
                    key={index} 
                    className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white/90 backdrop-blur border-tea-light/20"
                    >
                    <div className="relative overflow-hidden">
                        <img 
                        src={destination.image} 
                        alt={destination.name}
                        className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-tea-deep/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="absolute bottom-4 left-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <div className="flex items-center space-x-2">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm font-medium">{destination.rating}</span>
                        </div>
                        </div>
                    </div>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-2xl font-cinzel text-tea-deep group-hover:text-tea-light transition-colors">
                        {destination.name}
                        </CardTitle>
                        <div className="flex items-center text-muted-foreground">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span className="text-sm">{destination.location}</span>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-muted-foreground leading-relaxed">
                        {destination.description}
                        </p>
                        <div className="flex flex-wrap gap-2">
                        {(destination.activities || []).map((activity, i) => (
                            <span 
                            key={i}
                            className="px-3 py-1 bg-tea-light/10 text-tea-deep text-xs rounded-full border border-tea-light/20"
                            >
                            {activity}
                            </span>
                        ))}
                        </div>
                        <div className="flex items-center justify-between pt-4">
                        <div className="text-2xl font-bold text-tea-deep">
                            ${destination.price}
                            <span className="text-sm font-normal text-muted-foreground">/person</span>
                        </div>
                        <Button className="bg-tea-deep hover:bg-tea-light">
                            Book Now
                        </Button>
                        </div>
                    </CardContent>
                    </Card>
                ))}
                </div>
            </div>
            </section>
        )}

        {/* Tea Culture Experience */}
        {teaSection && (
            <section className="py-20 bg-gradient-to-r from-tea-deep to-tea-light text-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                <h2 className="text-5xl font-cinzel font-bold mb-6">{teaSection.heading || 'Ceylon Tea Heritage'}</h2>
                <p className="text-xl max-w-3xl mx-auto font-playfair">
                    {teaSection.content || 'Experience the art of tea cultivation from leaf to cup in the world\'s finest tea gardens'}
                </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {(teaSection.settings?.experiences || []).map((experience, index) => {
                    const Icon = {
                        Coffee,
                        Mountain,
                        Sunrise,
                        Train
                    }[experience.icon] || Coffee;
                    return (
                        <div 
                            key={index}
                            className="text-center group hover:scale-105 transition-transform duration-300"
                        >
                            <div className="bg-white/10 backdrop-blur rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 group-hover:bg-white/20 transition-colors">
                                <Icon className="w-12 h-12" />
                            </div>
                            <h3 className="text-2xl font-cinzel font-bold mb-4">{experience.name}</h3>
                            <p className="text-tea-light/90 leading-relaxed">{experience.description}</p>
                        </div>
                    )
                })}
                </div>
            </div>
            </section>
        )}

        {/* Mountain Railway */}
        {railwaySection && (
            <section className="py-20">
            <div className="container mx-auto px-4">
                <div className="max-w-6xl mx-auto">
                <div className="bg-gradient-to-br from-tea-light/10 to-tea-deep/10 rounded-2xl p-12 border border-tea-light/20">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <Train className="w-16 h-16 mb-6 text-tea-deep" />
                        <h2 className="text-4xl font-cinzel font-bold text-tea-deep mb-6">{railwaySection.heading || 'Scenic Train Journey'}</h2>
                        <p className="text-xl text-muted-foreground mb-8 font-playfair leading-relaxed">
                            {railwaySection.content || 'Experience one of the world\'s most beautiful train rides through misty mountains, cascading waterfalls, and endless tea plantations. The journey from Kandy to Ella is considered among the most scenic railway routes globally.'}
                        </p>
                        <div className="space-y-4">
                        {(railwaySection.settings?.features || []).map((feature, i) => (
                            <div className="flex items-center" key={i}>
                                <div className="w-3 h-3 bg-tea-deep rounded-full mr-3"></div>
                                <span className="text-muted-foreground">{feature}</span>
                            </div>
                        ))}
                        </div>
                    </div>
                    <div className="relative">
                        <img 
                        src={railwaySection.image || 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?ixlib=rb-4.0.3'}
                        alt={railwaySection.imageAlt || 'Mountain Railway'}
                        className="rounded-xl shadow-2xl"
                        />
                    </div>
                    </div>
                </div>
                </div>
            </div>
            </section>
        )}
      </div>

      <Footer />
    </>
  );
};

export default HillCountry;