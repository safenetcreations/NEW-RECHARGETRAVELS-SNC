
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { 
  Crown, Phone, Mail, MessageCircle, Globe, Clock, Shield, 
  Users, Star, CheckCircle, ArrowRight, Headphones, Calendar
} from 'lucide-react'

const LuxuryConcierge = () => {
  const conciergeServices = [
    {
      title: '24/7 Personal Concierge',
      description: 'Dedicated concierge available around the clock for any request',
      icon: Crown,
      color: 'from-gold to-amber-500',
      features: ['Personal Concierge', 'Instant Response', 'Global Coordination', 'VIP Protocols']
    },
    {
      title: 'Multilingual Support',
      description: 'Professional support in English, Mandarin, Arabic, French, and more',
      icon: Globe,
      color: 'from-blue-500 to-indigo-600',
      features: ['10+ Languages', 'Cultural Fluency', 'Regional Expertise', 'Local Connections']
    },
    {
      title: 'Security Coordination',
      description: 'Discreet security arrangements and privacy protection services',
      icon: Shield,
      color: 'from-slate-600 to-gray-800',
      features: ['Security Detail', 'Privacy Protection', 'Background Checks', 'Emergency Response']
    },
    {
      title: 'Experience Curation',
      description: 'Bespoke experience design based on personal interests and preferences',
      icon: Star,
      color: 'from-purple-500 to-pink-600',
      features: ['Personal Curator', 'Unlimited Customization', 'Exclusive Access', 'Perfect Timing']
    }
  ]

  const communicationChannels = [
    {
      method: 'WhatsApp Concierge',
      description: 'Instant messaging with your dedicated concierge team',
      icon: MessageCircle,
      availability: '24/7',
      responseTime: 'Immediate'
    },
    {
      method: 'Private Phone Line',
      description: 'Direct access to your personal concierge via dedicated line',
      icon: Phone,
      availability: '24/7',
      responseTime: 'Immediate'
    },
    {
      method: 'Email Coordination',
      description: 'Detailed planning and coordination via secure email',
      icon: Mail,
      availability: '24/7',
      responseTime: '< 30 minutes'
    },
    {
      method: 'Video Consultation',
      description: 'Face-to-face planning sessions with concierge specialists',
      icon: Users,
      availability: 'Scheduled',
      responseTime: 'Same Day'
    }
  ]

  const teamMembers = [
    {
      name: 'Sophia Chen',
      role: 'Senior Luxury Concierge',
      specialties: ['UHNW Services', 'Cultural Curation', 'Privacy Management'],
      languages: ['English', 'Mandarin', 'French'],
      experience: '12+ Years',
      image: 'https://images.unsplash.com/photo-1494790108755-2616c28ca2ae?w=300&h=300&fit=crop&crop=face'
    },
    {
      name: 'James Morrison',
      role: 'Head of Guest Relations',
      specialties: ['Transportation', 'Security', 'Emergency Response'],
      languages: ['English', 'Arabic', 'Spanish'],
      experience: '15+ Years',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face'
    },
    {
      name: 'Dr. Priya Rajapakse',
      role: 'Cultural & Wellness Specialist',
      specialties: ['Cultural Immersion', 'Wellness Retreats', 'Traditional Medicine'],
      languages: ['English', 'Sinhala', 'Tamil', 'Hindi'],
      experience: '18+ Years',
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=300&fit=crop&crop=face'
    }
  ]

  return (
    <section className="py-32 bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-20">
          <Badge className="bg-gradient-to-r from-gold to-amber-500 text-navy font-semibold px-6 py-2 mb-6">
            <Crown className="w-4 h-4 mr-2" />
            Luxury Concierge Services
          </Badge>
          <h2 className="text-6xl md:text-7xl font-bold text-navy mb-8 font-playfair">
            Your Personal Team
          </h2>
          <p className="text-2xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
            Experience the highest level of personalized service with our dedicated concierge team. 
            Every detail is anticipated, every request fulfilled with precision and discretion.
          </p>
        </div>

        {/* Concierge Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {conciergeServices.map((service, index) => {
            const IconComponent = service.icon
            
            return (
              <Card key={service.title} className="text-center hover:shadow-xl transition-all duration-300 bg-white border-0 shadow-lg">
                <CardHeader>
                  <div className={`w-16 h-16 bg-gradient-to-r ${service.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-lg font-semibold text-navy">{service.title}</CardTitle>
                  <CardDescription className="text-slate-600">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center justify-center space-x-2">
                        <CheckCircle className="w-3 h-3 text-green-600" />
                        <span className="text-sm text-slate-600">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Communication Channels */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h3 className="text-4xl font-bold text-navy mb-4 font-playfair">Stay Connected</h3>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Multiple communication channels ensure you're always connected to your concierge team, 
              no matter where you are in the world.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {communicationChannels.map((channel, index) => {
              const IconComponent = channel.icon
              
              return (
                <Card key={channel.method} className="hover:shadow-lg transition-all duration-300 bg-white">
                  <CardHeader className="text-center pb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-navy to-slate-800 rounded-full flex items-center justify-center mx-auto mb-3">
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-lg font-semibold text-navy">{channel.method}</CardTitle>
                    <CardDescription className="text-slate-600 text-sm">
                      {channel.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-center space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Availability:</span>
                      <span className="font-medium text-green-600">{channel.availability}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Response:</span>
                      <span className="font-medium text-gold">{channel.responseTime}</span>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Meet Your Team */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h3 className="text-4xl font-bold text-navy mb-4 font-playfair">Meet Your Concierge Team</h3>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Our experienced concierge professionals bring decades of luxury service expertise, 
              cultural knowledge, and unmatched attention to detail.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={member.name} className="overflow-hidden hover:shadow-xl transition-all duration-300 bg-white">
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <h4 className="text-xl font-bold">{member.name}</h4>
                    <p className="text-sm opacity-90">{member.role}</p>
                  </div>
                </div>
                
                <CardContent className="pt-6 space-y-4">
                  <div>
                    <h5 className="font-semibold text-navy mb-2">Specialties:</h5>
                    <div className="flex flex-wrap gap-1">
                      {member.specialties.map((specialty, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs border-gold/30">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h5 className="font-semibold text-navy mb-2">Languages:</h5>
                    <p className="text-sm text-slate-600">{member.languages.join(', ')}</p>
                  </div>
                  
                  <div>
                    <h5 className="font-semibold text-navy mb-2">Experience:</h5>
                    <p className="text-sm text-slate-600">{member.experience}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Contact Form */}
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gradient-to-r from-navy to-slate-800 text-white border-0 shadow-2xl">
            <CardHeader className="text-center">
              <CardTitle className="text-4xl font-bold mb-4 font-playfair">Begin Your Luxury Journey</CardTitle>
              <CardDescription className="text-ivory/80 text-lg">
                Share your vision with our concierge team and let us create an extraordinary Sri Lankan experience 
                that exceeds your highest expectations.
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-ivory/90">Full Name</label>
                  <Input 
                    className="bg-white/10 border-white/20 text-white placeholder-white/50" 
                    placeholder="Your full name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-ivory/90">Email Address</label>
                  <Input 
                    type="email"
                    className="bg-white/10 border-white/20 text-white placeholder-white/50" 
                    placeholder="your@email.com"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-ivory/90">Phone Number</label>
                  <Input 
                    className="bg-white/10 border-white/20 text-white placeholder-white/50" 
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-ivory/90">Preferred Contact Method</label>
                  <select className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white">
                    <option value="">Select preference</option>
                    <option value="phone">Phone</option>
                    <option value="email">Email</option>
                    <option value="whatsapp">WhatsApp</option>
                    <option value="video">Video Call</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-ivory/90">Travel Dates</label>
                  <Input 
                    type="date"
                    className="bg-white/10 border-white/20 text-white placeholder-white/50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-ivory/90">Group Size</label>
                  <select className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white">
                    <option value="">Select group size</option>
                    <option value="2">2 guests</option>
                    <option value="4">3-4 guests</option>
                    <option value="8">5-8 guests</option>
                    <option value="12">9-12 guests</option>
                    <option value="more">More than 12</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-ivory/90">Your Vision</label>
                <Textarea 
                  className="bg-white/10 border-white/20 text-white placeholder-white/50 min-h-[120px]" 
                  placeholder="Describe your ideal Sri Lankan luxury experience. What interests you most? Cultural immersion, adventure, wellness, culinary experiences, or a combination? Any specific requirements or preferences?"
                />
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button 
                  size="lg" 
                  className="flex-1 bg-gradient-to-r from-gold to-amber-500 text-navy font-bold hover:shadow-xl transition-all duration-300"
                >
                  <Crown className="w-5 h-5 mr-2" />
                  Begin Planning
                </Button>
                <Button 
                  size="lg"
                  variant="outline" 
                  className="flex-1 border-2 border-gold text-gold hover:bg-gold hover:text-navy font-semibold transition-all duration-300"
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  Schedule Consultation
                </Button>
              </div>
              
              <div className="text-center text-sm text-ivory/70 pt-4">
                <p>Your inquiry will be handled by our senior concierge team within 30 minutes.</p>
                <p>All communications are completely confidential and secure.</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Service Guarantees */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="space-y-4">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h4 className="text-xl font-semibold text-navy">Complete Privacy</h4>
            <p className="text-slate-600">Absolute discretion and confidentiality in all our services and communications.</p>
          </div>
          <div className="space-y-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto">
              <Clock className="w-8 h-8 text-white" />
            </div>
            <h4 className="text-xl font-semibold text-navy">Instant Response</h4>
            <p className="text-slate-600">24/7 availability with immediate response to all inquiries and requests.</p>
          </div>
          <div className="space-y-4">
            <div className="w-16 h-16 bg-gradient-to-r from-gold to-amber-500 rounded-full flex items-center justify-center mx-auto">
              <Star className="w-8 h-8 text-white" />
            </div>
            <h4 className="text-xl font-semibold text-navy">Perfection Guarantee</h4>
            <p className="text-slate-600">Every detail executed flawlessly or we make it right, no questions asked.</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default LuxuryConcierge
