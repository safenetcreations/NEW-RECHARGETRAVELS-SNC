import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Users, MapPin, Phone, Mail, MessageSquare, Send } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import SEOHead from '@/components/cms/SEOHead';

const BookNow = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    tourType: '',
    startDate: '',
    endDate: '',
    adults: '2',
    children: '0',
    message: ''
  });

  const tourTypes = [
    'Wildlife Safari',
    'Cultural Heritage Tour',
    'Beach Holiday',
    'Adventure Tour',
    'Honeymoon Package',
    'Hill Country Tour',
    'Photography Tour',
    'Custom Itinerary'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Here you would normally send the data to your backend
    console.log('Booking form submitted:', formData);
    
    toast({
      title: "Booking Request Sent!",
      description: "We'll contact you within 24 hours to confirm your booking.",
    });
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      tourType: '',
      startDate: '',
      endDate: '',
      adults: '2',
      children: '0',
      message: ''
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <>
      <SEOHead
        title="Book Your Sri Lanka Tour | Instant Booking - Recharge Travels"
        description="Book your Sri Lanka adventure today. Wildlife safaris, cultural tours, beach holidays. Instant confirmation, best price guarantee. Licensed tour operator."
        canonicalUrl="https://rechargetravels.com/book-now"
      />
      
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-[40vh] min-h-[350px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1621164448191-a834de719ee4?q=80&w=2070"
            alt="Book Your Sri Lanka Tour"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/30" />
        </div>
        
        <div className="relative z-10 text-center text-white px-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold mb-4"
          >
            Book Your Dream Tour
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl md:text-2xl"
          >
            Start your Sri Lankan adventure today
          </motion.p>
        </div>
      </section>

      {/* Booking Form Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Booking Form */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Tour Booking Request</CardTitle>
                    <CardDescription>
                      Fill out the form below and we'll get back to you within 24 hours
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Personal Information */}
                      <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Personal Information</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">Full Name *</Label>
                            <Input
                              id="name"
                              name="name"
                              value={formData.name}
                              onChange={handleChange}
                              required
                              placeholder="John Doe"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="email">Email *</Label>
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              value={formData.email}
                              onChange={handleChange}
                              required
                              placeholder="john@example.com"
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number *</Label>
                          <Input
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            placeholder="+1 234 567 8900"
                          />
                        </div>
                      </div>

                      {/* Tour Details */}
                      <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Tour Details</h3>
                        
                        <div className="space-y-2">
                          <Label htmlFor="tourType">Tour Type *</Label>
                          <Select
                            value={formData.tourType}
                            onValueChange={(value) => setFormData({ ...formData, tourType: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select a tour type" />
                            </SelectTrigger>
                            <SelectContent>
                              {tourTypes.map((type) => (
                                <SelectItem key={type} value={type}>
                                  {type}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="startDate">Start Date *</Label>
                            <Input
                              id="startDate"
                              name="startDate"
                              type="date"
                              value={formData.startDate}
                              onChange={handleChange}
                              required
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="endDate">End Date *</Label>
                            <Input
                              id="endDate"
                              name="endDate"
                              type="date"
                              value={formData.endDate}
                              onChange={handleChange}
                              required
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="adults">Number of Adults</Label>
                            <Select
                              value={formData.adults}
                              onValueChange={(value) => setFormData({ ...formData, adults: value })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                                  <SelectItem key={num} value={num.toString()}>
                                    {num} {num === 1 ? 'Adult' : 'Adults'}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="children">Number of Children</Label>
                            <Select
                              value={formData.children}
                              onValueChange={(value) => setFormData({ ...formData, children: value })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {[0, 1, 2, 3, 4, 5].map((num) => (
                                  <SelectItem key={num} value={num.toString()}>
                                    {num} {num === 1 ? 'Child' : 'Children'}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>

                      {/* Additional Information */}
                      <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Additional Information</h3>
                        
                        <div className="space-y-2">
                          <Label htmlFor="message">Special Requests or Questions</Label>
                          <Textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            rows={4}
                            placeholder="Tell us about any special requirements, interests, or questions you have..."
                          />
                        </div>
                      </div>

                      <Button type="submit" size="lg" className="w-full">
                        <Send className="w-4 h-4 mr-2" />
                        Send Booking Request
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>

              {/* Contact Information */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Need Help?</CardTitle>
                    <CardDescription>
                      Our travel experts are here to assist you
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Phone className="w-5 h-5 text-teal-600 mt-1" />
                      <div>
                        <p className="font-semibold">Call Us</p>
                        <p className="text-sm text-gray-600">+94 777 721 999</p>
                        <p className="text-xs text-gray-500">Available 8 AM - 8 PM</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Mail className="w-5 h-5 text-teal-600 mt-1" />
                      <div>
                        <p className="font-semibold">Email Us</p>
                        <p className="text-sm text-gray-600">info@rechargetravels.com</p>
                        <p className="text-xs text-gray-500">Response within 24 hours</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <MessageSquare className="w-5 h-5 text-teal-600 mt-1" />
                      <div>
                        <p className="font-semibold">WhatsApp</p>
                        <p className="text-sm text-gray-600">+94 777 721 999</p>
                        <p className="text-xs text-gray-500">Quick responses</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Why Book With Us?</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-teal-600 rounded-full" />
                      <p className="text-sm">Licensed tour operator since 2015</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-teal-600 rounded-full" />
                      <p className="text-sm">Best price guarantee</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-teal-600 rounded-full" />
                      <p className="text-sm">Expert local guides</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-teal-600 rounded-full" />
                      <p className="text-sm">24/7 customer support</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-teal-600 rounded-full" />
                      <p className="text-sm">Flexible cancellation</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-teal-50 border-teal-200">
                  <CardContent className="pt-6">
                    <p className="text-sm text-teal-800">
                      <strong>Quick Tip:</strong> Book at least 2 weeks in advance for better availability and rates. 
                      Peak season (December-March) fills up quickly!
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default BookNow;