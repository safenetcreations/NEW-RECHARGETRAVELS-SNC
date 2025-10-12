
import React from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Castle, Waves, Camera, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Galle = () => {
  return (
    <>
      <Helmet>
        <title>Galle - Historic Fort City - Recharge Travels</title>
        <meta name="description" content="Explore Galle, the historic fort city with Dutch colonial architecture by the sea." />
      </Helmet>
      
      <Header />
      
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-teal-600 to-blue-600 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Galle</h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Historic fort city with Dutch colonial architecture by the sea
            </p>
            <Button size="lg" className="bg-white text-teal-600 hover:bg-gray-100">
              Explore Galle Fort
            </Button>
          </div>
        </div>

        {/* Historic Attractions */}
        <div className="container mx-auto px-4 py-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Galle Fort",
                description: "17th-century Dutch fort with colonial buildings and ramparts",
                icon: <Castle className="w-8 h-8" />,
                heritage: "UNESCO World Heritage Site"
              },
              {
                title: "Coastal Views",
                description: "Stunning ocean views from the fort walls and lighthouse",
                icon: <Waves className="w-8 h-8" />,
                heritage: "Historic lighthouse"
              },
              {
                title: "Colonial Architecture",
                description: "Well-preserved Dutch and British colonial buildings",
                icon: <Camera className="w-8 h-8" />,
                heritage: "Living museum"
              }
            ].map((attraction, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center mb-4">
                    {attraction.icon}
                    <CardTitle className="ml-3">{attraction.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{attraction.description}</p>
                  <div className="flex items-center text-sm text-teal-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    {attraction.heritage}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Galle;
