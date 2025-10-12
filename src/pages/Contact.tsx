import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { MapPin, Phone, Mail, Clock, MessageCircle, Calendar, Star, Sparkles, Users, Shield } from 'lucide-react'
import { useState } from 'react'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission here
    console.log('Form submitted:', formData)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <>
      {/* Enhanced Hero Section */}
      <section className="relative gradient-sri-lanka text-white py-24 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-yellow-400/20 to-orange-600/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-purple-400/10 to-pink-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="mb-6">
            <span className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm font-semibold rounded-full shadow-lg">
              <Sparkles className="w-4 h-4 mr-2" />
              🎯 Free Travel Consultation & Custom Itinerary!
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6 font-playfair bg-gradient-to-r from-white via-yellow-100 to-orange-100 bg-clip-text text-transparent">
            Plan Your Dream Trip
          </h1>
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-blue-100">
            Expert Travel Consultants Ready to Help
          </h2>
          <p className="text-xl md:text-2xl mb-10 max-w-4xl mx-auto opacity-90 text-blue-100">
            Ready to embark on your Sri Lankan adventure? Our expert travel consultants are here to create your perfect personalized itinerary with instant booking and best price guarantee.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <Calendar className="w-5 h-5 mr-2" />
              Book Free Consultation
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-blue-800 px-8 py-4 rounded-xl text-lg font-semibold backdrop-blur-sm"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              WhatsApp Us Now
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <Star className="w-8 h-8 mx-auto mb-2 text-yellow-300" />
              <div className="text-2xl font-bold mb-1">4.9★</div>
              <div className="text-blue-100 text-sm">Customer Rating</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <Users className="w-8 h-8 mx-auto mb-2 text-green-300" />
              <div className="text-2xl font-bold mb-1">75K+</div>
              <div className="text-blue-100 text-sm">Happy Travelers</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <Shield className="w-8 h-8 mx-auto mb-2 text-blue-300" />
              <div className="text-2xl font-bold mb-1">100%</div>
              <div className="text-blue-100 text-sm">Secure Bookings</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <Clock className="w-8 h-8 mx-auto mb-2 text-purple-300" />
              <div className="text-2xl font-bold mb-1">24/7</div>
              <div className="text-blue-100 text-sm">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl text-ceylon-blue font-playfair">Send us a Message</CardTitle>
                <p className="text-gray-600">Fill out the form below and we'll get back to you within 24 hours.</p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                        Subject *
                      </label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                        placeholder="How can we help?"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Message *
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      placeholder="Tell us about your travel plans, preferences, and any questions you have..."
                    />
                  </div>
                  
                  <Button type="submit" className="w-full bg-sunset-orange hover:bg-yellow-500 text-white btn-ripple">
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <div className="space-y-6">
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-teal-green/10 p-3 rounded-lg">
                      <MapPin className="h-6 w-6 text-teal-green" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-ceylon-blue mb-2">Visit Our Office</h3>
                      <p className="text-gray-600">
                        Jaffna+Colombo<br />
                        Sri Lanka
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-teal-green/10 p-3 rounded-lg">
                      <Phone className="h-6 w-6 text-teal-green" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-ceylon-blue mb-2">Call Us</h3>
                      <p className="text-gray-600">
                        Main: +94 7777 21 999<br />
                        WhatsApp: +94 7777 21 999<br />
                        Emergency: +94 7777 21 999
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-teal-green/10 p-3 rounded-lg">
                      <Mail className="h-6 w-6 text-teal-green" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-ceylon-blue mb-2">Email Us</h3>
                      <p className="text-gray-600">
                        General: info@rechargetravels.com<br />
                        Bookings: bookings@rechargetravels.com<br />
                        Support: support@rechargetravels.com
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-teal-green/10 p-3 rounded-lg">
                      <Clock className="h-6 w-6 text-teal-green" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-ceylon-blue mb-2">Business Hours</h3>
                      <p className="text-gray-600">
                        Monday - Friday: 8:00 AM - 6:00 PM<br />
                        Saturday: 9:00 AM - 4:00 PM<br />
                        Sunday: By appointment only
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Quick Contact CTA */}
      <section className="py-20 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-6">
            <span className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm font-semibold rounded-full shadow-lg">
              <Clock className="w-4 h-4 mr-2" />
              💬 Available Now - Instant Response Guaranteed!
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-ceylon-blue mb-6 font-playfair">Ready to Start Your Journey?</h2>
          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
            Our expert travel consultants are standing by to create your perfect Sri Lankan adventure. Get instant quotes, custom itineraries, and exclusive deals.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">WhatsApp Chat</h3>
              <p className="text-gray-600 text-sm mb-4">Instant messaging with travel experts</p>
              <span className="text-green-600 font-semibold text-sm">⚡ Usually responds in 2 mins</span>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Direct Call</h3>
              <p className="text-gray-600 text-sm mb-4">Speak with consultants immediately</p>
              <span className="text-blue-600 font-semibold text-sm">📞 Available 24/7</span>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Free Consultation</h3>
              <p className="text-gray-600 text-sm mb-4">Personalized travel planning session</p>
              <span className="text-purple-600 font-semibold text-sm">🎯 100% Free & No Obligation</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <MessageCircle className="h-5 w-5 mr-2" />
              Start WhatsApp Chat
            </Button>
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <Phone className="h-5 w-5 mr-2" />
              Call +94 7777 21 999
            </Button>
          </div>

          <div className="mt-10 text-center">
            <p className="text-gray-500 text-sm">
              💡 <strong>Pro Tip:</strong> Mention "Website Special" for an exclusive 10% discount on your first booking!
            </p>
          </div>
        </div>
      </section>
    </>
  )
}

export default Contact
