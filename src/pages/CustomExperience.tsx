import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Calendar,
  Users,
  DollarSign,
  MapPin,
  Heart,
  CheckCircle,
  ArrowRight,
  Phone,
  Mail,
  Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { luxuryExperienceService } from '@/services/luxuryExperienceService';
import type { ExperienceCategory } from '@/types/luxury-experience';
import { toast } from 'sonner';
import { format } from 'date-fns';

const CustomExperience = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  
  // Form data
  const [formData, setFormData] = useState({
    // Contact Info
    name: '',
    email: '',
    phone: '',
    country: '',
    
    // Trip Details
    startDate: '',
    endDate: '',
    flexibleDates: false,
    groupSize: 2,
    budget: '',
    budgetCurrency: 'USD',
    budgetPerPerson: true,
    
    // Preferences
    interests: [] as string[],
    experienceTypes: [] as ExperienceCategory[],
    accommodationPreference: 'luxury' as const,
    mealPreferences: [] as string[],
    specialRequests: '',
    
    // Additional Info
    previousVisits: false,
    mobilityRequirements: '',
    medicalConditions: ''
  });

  const categories = luxuryExperienceService.getCategories();
  
  const interests = [
    'Wildlife & Nature',
    'Culture & Heritage',
    'Adventure & Sports',
    'Wellness & Relaxation',
    'Photography',
    'Food & Culinary',
    'Beach & Marine Life',
    'Mountains & Hiking',
    'Local Communities',
    'Luxury & Comfort',
    'Off-the-beaten-path',
    'Family Activities'
  ];

  const mealOptions = [
    'Vegetarian',
    'Vegan',
    'Halal',
    'Kosher',
    'Gluten-free',
    'No restrictions'
  ];

  const handleInterestToggle = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleExperienceToggle = (type: ExperienceCategory) => {
    setFormData(prev => ({
      ...prev,
      experienceTypes: prev.experienceTypes.includes(type)
        ? prev.experienceTypes.filter(t => t !== type)
        : [...prev.experienceTypes, type]
    }));
  };

  const handleMealToggle = (meal: string) => {
    setFormData(prev => ({
      ...prev,
      mealPreferences: prev.mealPreferences.includes(meal)
        ? prev.mealPreferences.filter(m => m !== meal)
        : [...prev.mealPreferences, meal]
    }));
  };

  const validateStep = () => {
    switch (step) {
      case 1:
        if (!formData.name || !formData.email || !formData.phone || !formData.country) {
          toast.error('Please fill in all contact information');
          return false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          toast.error('Please enter a valid email address');
          return false;
        }
        break;
      case 2:
        if (!formData.startDate || !formData.endDate || !formData.budget) {
          toast.error('Please fill in all trip details');
          return false;
        }
        if (new Date(formData.startDate) >= new Date(formData.endDate)) {
          toast.error('End date must be after start date');
          return false;
        }
        break;
      case 3:
        if (formData.interests.length === 0) {
          toast.error('Please select at least one interest');
          return false;
        }
        break;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep(step + 1);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      
      const requestData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        country: formData.country,
        preferredDates: {
          start: formData.startDate,
          end: formData.endDate,
          flexible: formData.flexibleDates
        },
        groupSize: formData.groupSize,
        budget: {
          amount: parseFloat(formData.budget),
          currency: formData.budgetCurrency,
          perPerson: formData.budgetPerPerson
        },
        interests: formData.interests,
        experienceTypes: formData.experienceTypes,
        accommodationPreference: formData.accommodationPreference,
        mealPreferences: formData.mealPreferences,
        specialRequests: formData.specialRequests,
        previousVisits: formData.previousVisits,
        mobilityRequirements: formData.mobilityRequirements,
        medicalConditions: formData.medicalConditions
      };

      await luxuryExperienceService.submitCustomRequest(requestData);
      setSubmitted(true);
      toast.success('Your request has been submitted successfully!');
    } catch (error) {
      console.error('Error submitting request:', error);
      toast.error('Failed to submit request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md w-full text-center"
        >
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold mb-4">Thank You!</h1>
          <p className="text-lg text-gray-600 mb-8">
            Your custom experience request has been received. Our travel experts will 
            contact you within 24 hours to start planning your dream journey.
          </p>
          <Button onClick={() => navigate('/experiences')}>
            Browse More Experiences
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      {/* Hero Section */}
      <section className="relative py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="flex items-center justify-center gap-2 mb-6">
              <Sparkles className="w-8 h-8 text-amber-500" />
              <h1 className="text-4xl md:text-5xl font-bold">
                Create Your Dream Experience
              </h1>
              <Sparkles className="w-8 h-8 text-amber-500" />
            </div>
            <p className="text-xl text-gray-600 mb-8">
              Tell us your vision, and our expert travel designers will craft a 
              bespoke journey tailored to your desires, interests, and dreams.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Progress Bar */}
      <div className="container mx-auto px-4 mb-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            {[1, 2, 3, 4].map((num) => (
              <div
                key={num}
                className={`flex items-center ${num < 4 ? 'flex-1' : ''}`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold
                    ${step >= num ? 'bg-amber-500 text-white' : 'bg-gray-200 text-gray-500'}`}
                >
                  {num}
                </div>
                {num < 4 && (
                  <div
                    className={`flex-1 h-1 mx-2 ${
                      step > num ? 'bg-amber-500' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Contact Info</span>
            <span>Trip Details</span>
            <span>Preferences</span>
            <span>Review</span>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <section className="container mx-auto px-4 pb-20">
        <Card className="max-w-3xl mx-auto">
          <CardContent className="p-8">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-semibold mb-6">Your Contact Information</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="John Doe"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="john@example.com"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+1 234 567 8900"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="country">Country</Label>
                      <Input
                        id="country"
                        value={formData.country}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                        placeholder="United States"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-semibold mb-6">Trip Details</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="startDate">Preferred Start Date</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        min={format(new Date(), 'yyyy-MM-dd')}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="endDate">Preferred End Date</Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                        min={formData.startDate || format(new Date(), 'yyyy-MM-dd')}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="flexible"
                      checked={formData.flexibleDates}
                      onCheckedChange={(checked) => 
                        setFormData({ ...formData, flexibleDates: checked as boolean })
                      }
                    />
                    <Label htmlFor="flexible" className="font-normal">
                      My dates are flexible (+/- 3 days)
                    </Label>
                  </div>

                  <div>
                    <Label htmlFor="groupSize">Number of Travelers</Label>
                    <Input
                      id="groupSize"
                      type="number"
                      min="1"
                      value={formData.groupSize}
                      onChange={(e) => setFormData({ ...formData, groupSize: parseInt(e.target.value) })}
                    />
                  </div>

                  <div>
                    <Label>Budget Range</Label>
                    <div className="flex gap-2 items-end">
                      <div className="flex-1">
                        <Input
                          type="number"
                          value={formData.budget}
                          onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                          placeholder="5000"
                        />
                      </div>
                      <Select
                        value={formData.budgetCurrency}
                        onValueChange={(value) => setFormData({ ...formData, budgetCurrency: value })}
                      >
                        <SelectTrigger className="w-[100px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="EUR">EUR</SelectItem>
                          <SelectItem value="GBP">GBP</SelectItem>
                          <SelectItem value="LKR">LKR</SelectItem>
                        </SelectContent>
                      </Select>
                      <RadioGroup
                        value={formData.budgetPerPerson ? 'person' : 'total'}
                        onValueChange={(value) => 
                          setFormData({ ...formData, budgetPerPerson: value === 'person' })
                        }
                        className="flex gap-4"
                      >
                        <div className="flex items-center">
                          <RadioGroupItem value="person" id="person" />
                          <Label htmlFor="person" className="ml-2 font-normal">Per person</Label>
                        </div>
                        <div className="flex items-center">
                          <RadioGroupItem value="total" id="total" />
                          <Label htmlFor="total" className="ml-2 font-normal">Total</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-semibold mb-6">Your Preferences</h2>
                  
                  <div>
                    <Label className="text-base mb-3 block">What are you interested in?</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {interests.map((interest) => (
                        <label
                          key={interest}
                          className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-colors
                            ${formData.interests.includes(interest) 
                              ? 'bg-amber-50 border-amber-500' 
                              : 'bg-white border-gray-200 hover:border-gray-300'}`}
                        >
                          <Checkbox
                            checked={formData.interests.includes(interest)}
                            onCheckedChange={() => handleInterestToggle(interest)}
                          />
                          <span className="text-sm">{interest}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-base mb-3 block">Preferred experience types</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {categories.map((cat) => (
                        <label
                          key={cat.value}
                          className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-colors
                            ${formData.experienceTypes.includes(cat.value) 
                              ? 'bg-amber-50 border-amber-500' 
                              : 'bg-white border-gray-200 hover:border-gray-300'}`}
                        >
                          <Checkbox
                            checked={formData.experienceTypes.includes(cat.value)}
                            onCheckedChange={() => handleExperienceToggle(cat.value)}
                            className="mt-1"
                          />
                          <div>
                            <p className="font-medium">{cat.label}</p>
                            <p className="text-sm text-gray-600">{cat.description}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="accommodation">Accommodation Preference</Label>
                    <Select
                      value={formData.accommodationPreference}
                      onValueChange={(value: any) => 
                        setFormData({ ...formData, accommodationPreference: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="luxury">Luxury Hotels & Resorts</SelectItem>
                        <SelectItem value="boutique">Boutique Properties</SelectItem>
                        <SelectItem value="eco">Eco Lodges</SelectItem>
                        <SelectItem value="mixed">Mix of Styles</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-base mb-3 block">Dietary Requirements</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {mealOptions.map((meal) => (
                        <label
                          key={meal}
                          className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-colors
                            ${formData.mealPreferences.includes(meal) 
                              ? 'bg-amber-50 border-amber-500' 
                              : 'bg-white border-gray-200 hover:border-gray-300'}`}
                        >
                          <Checkbox
                            checked={formData.mealPreferences.includes(meal)}
                            onCheckedChange={() => handleMealToggle(meal)}
                          />
                          <span className="text-sm">{meal}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="special">Special Requests or Must-See Places</Label>
                    <Textarea
                      id="special"
                      value={formData.specialRequests}
                      onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                      placeholder="Tell us about any specific places you want to visit, activities you'd like to do, or special occasions you're celebrating..."
                      rows={4}
                    />
                  </div>
                </motion.div>
              )}

              {step === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-semibold mb-6">Additional Information</h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="previous"
                        checked={formData.previousVisits}
                        onCheckedChange={(checked) => 
                          setFormData({ ...formData, previousVisits: checked as boolean })
                        }
                      />
                      <Label htmlFor="previous" className="font-normal">
                        I have visited Sri Lanka before
                      </Label>
                    </div>

                    <div>
                      <Label htmlFor="mobility">
                        Any mobility requirements or accessibility needs?
                      </Label>
                      <Textarea
                        id="mobility"
                        value={formData.mobilityRequirements}
                        onChange={(e) => setFormData({ ...formData, mobilityRequirements: e.target.value })}
                        placeholder="Please let us know if you have any mobility restrictions or need special accessibility arrangements..."
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label htmlFor="medical">
                        Any medical conditions or allergies we should know about?
                      </Label>
                      <Textarea
                        id="medical"
                        value={formData.medicalConditions}
                        onChange={(e) => setFormData({ ...formData, medicalConditions: e.target.value })}
                        placeholder="Please share any medical conditions, allergies, or health considerations..."
                        rows={3}
                      />
                    </div>
                  </div>

                  {/* Summary */}
                  <Card className="bg-amber-50 border-amber-200">
                    <CardContent className="p-6">
                      <h3 className="font-semibold mb-4">Your Custom Experience Summary</h3>
                      <div className="space-y-2 text-sm">
                        <p><strong>Travelers:</strong> {formData.groupSize} people</p>
                        <p><strong>Dates:</strong> {formData.startDate} to {formData.endDate}</p>
                        <p><strong>Budget:</strong> {formData.budgetCurrency} {formData.budget} {formData.budgetPerPerson ? 'per person' : 'total'}</p>
                        <p><strong>Interests:</strong> {formData.interests.join(', ')}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-8 border-t">
              {step > 1 && (
                <Button
                  variant="outline"
                  onClick={() => setStep(step - 1)}
                >
                  Back
                </Button>
              )}
              
              <div className={step === 1 ? 'ml-auto' : ''}>
                {step < 4 ? (
                  <Button onClick={handleNext}>
                    Next
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                ) : (
                  <Button 
                    onClick={handleSubmit}
                    disabled={loading}
                    className="bg-amber-500 hover:bg-amber-600"
                  >
                    {loading ? 'Submitting...' : 'Submit Request'}
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Info */}
        <div className="max-w-3xl mx-auto mt-12 text-center">
          <p className="text-gray-600 mb-4">
            Prefer to speak with someone directly? Our travel experts are here to help.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <a href="tel:+94112345678" className="flex items-center gap-2 text-amber-600 hover:text-amber-700">
              <Phone className="w-5 h-5" />
              +94 11 234 5678
            </a>
            <a href="mailto:custom@rechargetravels.com" className="flex items-center gap-2 text-amber-600 hover:text-amber-700">
              <Mail className="w-5 h-5" />
              custom@rechargetravels.com
            </a>
            <div className="flex items-center gap-2 text-gray-600">
              <Globe className="w-5 h-5" />
              Available 24/7
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CustomExperience;
