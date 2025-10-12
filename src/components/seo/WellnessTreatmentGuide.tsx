
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Flower2, 
  Droplets, 
  Wind, 
  Flame, 
  Leaf, 
  Heart, 
  Brain, 
  Shield,
  Timer,
  Users,
  Star,
  CheckCircle
} from 'lucide-react';

const WellnessTreatmentGuide = () => {
  const treatmentCategories = [
    {
      title: "Panchakarma - The Complete Detox",
      icon: Shield,
      duration: "14-28 days",
      description: "The ultimate five-step detoxification process dating back 2,500 years",
      treatments: [
        {
          name: "Vamana (Therapeutic Vomiting)",
          purpose: "Eliminates Kapha-related toxins from chest and stomach",
          benefits: "Respiratory health, digestive improvement, weight management",
          duration: "1-3 days"
        },
        {
          name: "Virechana (Purgation Therapy)",
          purpose: "Cleanses Pitta disorders from liver and intestines",
          benefits: "Liver detox, skin purification, metabolic balance",
          duration: "3-7 days"
        },
        {
          name: "Basti (Medicated Enemas)",
          purpose: "Balances Vata dosha through colon therapy",
          benefits: "Nervous system health, joint mobility, mental clarity",
          duration: "15-30 sessions"
        },
        {
          name: "Nasya (Nasal Therapy)",
          purpose: "Cleanses head region through medicated oils",
          benefits: "Sinus health, mental clarity, headache relief",
          duration: "7-14 days"
        },
        {
          name: "Raktamokshana (Blood Purification)",
          purpose: "Removes blood-borne toxins and impurities",
          benefits: "Skin health, circulation improvement, toxin elimination",
          duration: "As needed"
        }
      ]
    },
    {
      title: "Abhyanga - Therapeutic Massages",
      icon: Droplets,
      duration: "45-90 minutes",
      description: "Ancient oil massage techniques using specially prepared herbal oils",
      treatments: [
        {
          name: "Shirodhara",
          purpose: "Continuous oil stream on forehead for mental calm",
          benefits: "Stress relief, better sleep, mental clarity, hair health",
          duration: "45-60 minutes"
        },
        {
          name: "Shirobasti",
          purpose: "Oil pooling treatment for head and neck",
          benefits: "Neurological health, migraine relief, facial paralysis treatment",
          duration: "30-45 minutes"
        },
        {
          name: "Karna Purana",
          purpose: "Medicated oil treatment for ears",
          benefits: "Hearing improvement, tinnitus relief, ear health",
          duration: "15-30 minutes"
        },
        {
          name: "Netra Tarpana",
          purpose: "Specialized eye treatment with medicated ghee",
          benefits: "Vision improvement, eye strain relief, dry eye treatment",
          duration: "20-30 minutes"
        },
        {
          name: "Udvartana",
          purpose: "Herbal powder massage for weight management",
          benefits: "Weight loss, cellulite reduction, skin toning, circulation",
          duration: "60-75 minutes"
        }
      ]
    },
    {
      title: "Rasayana - Rejuvenation Therapies",
      icon: Flower2,
      duration: "7-42 days",
      description: "Anti-aging and vitality enhancement treatments for longevity",
      treatments: [
        {
          name: "Kayakalpa Chikitsa",
          purpose: "Complete body rejuvenation and anti-aging",
          benefits: "Cellular renewal, longevity, vitality enhancement, immunity boost",
          duration: "28-42 days"
        },
        {
          name: "Ojas Building Therapy",
          purpose: "Enhances vital energy and life force",
          benefits: "Immunity strengthening, energy boost, disease resistance",
          duration: "14-21 days"
        },
        {
          name: "Medhya Rasayana",
          purpose: "Brain tonic and memory enhancement",
          benefits: "Memory improvement, cognitive function, mental clarity",
          duration: "21-28 days"
        },
        {
          name: "Vrishya Chikitsa",
          purpose: "Reproductive health and vitality enhancement",
          benefits: "Fertility improvement, hormonal balance, sexual health",
          duration: "28-42 days"
        }
      ]
    },
    {
      title: "Specialized Healing Therapies",
      icon: Heart,
      duration: "Varies",
      description: "Targeted treatments for specific health conditions and wellness goals",
      treatments: [
        {
          name: "Hridaya Basti",
          purpose: "Heart region oil pooling for cardiac health",
          benefits: "Heart health, chest pain relief, emotional balance",
          duration: "30-45 minutes"
        },
        {
          name: "Janu Basti",
          purpose: "Knee oil pooling for joint health",
          benefits: "Arthritis relief, joint mobility, pain reduction",
          duration: "30-40 minutes"
        },
        {
          name: "Kati Basti",
          purpose: "Lower back oil treatment for spinal health",
          benefits: "Back pain relief, disc health, muscle relaxation",
          duration: "30-45 minutes"
        },
        {
          name: "Akshi Tarpana",
          purpose: "Comprehensive eye care and vision therapy",
          benefits: "Vision clarity, eye muscle strength, digital eye strain relief",
          duration: "45-60 minutes"
        }
      ]
    }
  ];

  const getDifficultyColor = (duration: string) => {
    if (duration.includes('1-3') || duration.includes('15-30 minutes')) return 'bg-green-100 text-green-800';
    if (duration.includes('7-14') || duration.includes('45-60')) return 'bg-yellow-100 text-yellow-800';
    if (duration.includes('28-42') || duration.includes('15-30 sessions')) return 'bg-red-100 text-red-800';
    return 'bg-blue-100 text-blue-800';
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif text-emerald-900 mb-6">
            Complete Traditional Treatment Guide
          </h2>
          <p className="text-xl text-emerald-700 max-w-4xl mx-auto leading-relaxed">
            Discover authentic Sri Lankan wellness treatments, each rooted in ancient medical texts 
            and perfected over 2,500 years of healing practice. From intensive detoxification to 
            gentle rejuvenation, find the perfect treatment for your wellness journey.
          </p>
        </div>

        <div className="space-y-16">
          {treatmentCategories.map((category, categoryIndex) => (
            <div key={categoryIndex} className="max-w-7xl mx-auto">
              <div className="text-center mb-12">
                <div className="flex items-center justify-center gap-4 mb-4">
                  <category.icon className="w-10 h-10 text-emerald-600" />
                  <h3 className="text-3xl font-bold text-emerald-900">{category.title}</h3>
                </div>
                <p className="text-lg text-emerald-700 mb-4">{category.description}</p>
                <div className="flex items-center justify-center gap-4">
                  <Badge className="bg-emerald-100 text-emerald-800 px-4 py-2">
                    <Timer className="w-4 h-4 mr-2" />
                    Duration: {category.duration}
                  </Badge>
                  <Badge className="bg-amber-100 text-amber-800 px-4 py-2">
                    <Star className="w-4 h-4 mr-2" />
                    Traditional Authentic
                  </Badge>
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {category.treatments.map((treatment, treatmentIndex) => (
                  <Card key={treatmentIndex} className="hover:shadow-xl transition-all duration-300 border-emerald-100">
                    <CardHeader className="pb-4">
                      <div className="flex justify-between items-start mb-3">
                        <CardTitle className="text-xl text-emerald-900 font-semibold leading-tight">
                          {treatment.name}
                        </CardTitle>
                        <Badge className={getDifficultyColor(treatment.duration)}>
                          {treatment.duration}
                        </Badge>
                      </div>
                      <p className="text-emerald-700 text-sm leading-relaxed">
                        {treatment.purpose}
                      </p>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-emerald-800 mb-2 flex items-center">
                          <CheckCircle className="w-4 h-4 mr-2 text-emerald-600" />
                          Key Benefits:
                        </h4>
                        <p className="text-emerald-700 text-sm leading-relaxed">
                          {treatment.benefits}
                        </p>
                      </div>
                      
                      <div className="pt-3 border-t border-emerald-100">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-emerald-600 font-medium">
                            Traditional Method
                          </span>
                          <div className="flex items-center text-sm text-emerald-600">
                            <Users className="w-4 h-4 mr-1" />
                            Certified Practitioners
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Treatment Selection Guide */}
        <div className="mt-20 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl p-12">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-emerald-900 mb-4">
              How to Choose Your Ideal Treatment
            </h3>
            <p className="text-lg text-emerald-700 max-w-3xl mx-auto">
              Our certified Ayurvedic physicians will assess your individual constitution and health needs 
              to recommend the most beneficial treatments for your unique wellness journey.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center border-emerald-200">
              <CardContent className="pt-8">
                <Brain className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
                <h4 className="text-xl font-bold text-emerald-900 mb-3">Consultation & Assessment</h4>
                <p className="text-emerald-700 text-sm leading-relaxed">
                  Comprehensive evaluation including pulse diagnosis, body constitution analysis, 
                  and detailed health history review by qualified physicians.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-emerald-200">
              <CardContent className="pt-8">
                <Leaf className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
                <h4 className="text-xl font-bold text-emerald-900 mb-3">Personalized Protocol</h4>
                <p className="text-emerald-700 text-sm leading-relaxed">
                  Custom treatment plan designed for your specific dosha type, health goals, 
                  and time availability, ensuring optimal therapeutic benefits.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-emerald-200">
              <CardContent className="pt-8">
                <Heart className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
                <h4 className="text-xl font-bold text-emerald-900 mb-3">Authentic Experience</h4>
                <p className="text-emerald-700 text-sm leading-relaxed">
                  Traditional treatments using authentic methods, genuine herbal preparations, 
                  and time-tested techniques for genuine healing results.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WellnessTreatmentGuide;
