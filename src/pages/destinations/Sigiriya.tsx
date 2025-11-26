
import React from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Mountain, Crown, Palette, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Sigiriya = () => {
  return (
    <>
      <Helmet>
        <title>Sigiriya - Ancient Rock Fortress - Recharge Travels</title>
        <meta name="description" content="Climb Sigiriya, the ancient rock fortress and UNESCO World Heritage Site." />
      </Helmet>
      
      <Header />
      
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-stone-600 to-amber-600 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Sigiriya</h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Ancient rock fortress and UNESCO World Heritage Site
            </p>
            <Button size="lg" className="bg-white text-stone-600 hover:bg-gray-100">
              Climb Sigiriya Rock
            </Button>
          </div>
        </div>

        {/* Ancient Wonders */}
        <div className="container mx-auto px-4 py-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Rock Fortress",
                description: "5th-century palace complex built on a massive rock outcrop",
                icon: <Mountain className="w-8 h-8" />,
                detail: "200-meter high rock"
              },
              {
                title: "Royal Palace",
                description: "Ruins of King Kasyapa's palace at the summit",
                icon: <Crown className="w-8 h-8" />,
                detail: "Ancient royal residence"
              },
              {
                title: "Frescoes",
                description: "Ancient paintings of celestial maidens on the rock face",
                icon: <Palette className="w-8 h-8" />,
                detail: "1,500-year-old art"
              }
            ].map((wonder, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center mb-4">
                    {wonder.icon}
                    <CardTitle className="ml-3">{wonder.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{wonder.description}</p>
                  <div className="flex items-center text-sm text-stone-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    {wonder.detail}
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

export default Sigiriya;
