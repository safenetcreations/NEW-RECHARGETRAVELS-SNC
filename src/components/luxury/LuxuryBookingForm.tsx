import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Check,
  ArrowRight,
  Phone,
  Mail,
  User,
  Calendar,
  Clock,
  MapPin,
  Users,
  Sparkles,
  Shield,
  MessageCircle,
  Loader2,
  CheckCircle2,
  Copy,
  ExternalLink
} from 'lucide-react';
import { luxuryBookingService, LuxuryBookingType, LuxuryBookingData } from '@/services/luxuryBookingService';
import { toast } from 'sonner';

interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'date' | 'time' | 'select' | 'textarea' | 'number';
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  icon?: React.ReactNode;
  halfWidth?: boolean;
}

interface LuxuryBookingFormProps {
  type: LuxuryBookingType;
  title?: string;
  subtitle?: string;
  fields: FormField[];
  accentColor?: string;
  className?: string;
}

const LuxuryBookingForm: React.FC<LuxuryBookingFormProps> = ({
  type,
  title = 'Request Booking',
  subtitle = 'Our concierge will respond within 2 hours',
  fields,
  accentColor = 'amber',
  className = ''
}) => {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [bookingResult, setBookingResult] = useState<{
    bookingRef: string;
    whatsAppLink: string;
  } | null>(null);
  const [currentStep, setCurrentStep] = useState(0);

  // Split fields into steps for better UX
  const contactFields = fields.filter(f => ['name', 'email', 'phone'].includes(f.name));
  const detailFields = fields.filter(f => !['name', 'email', 'phone', 'requests', 'specialRequests'].includes(f.name));
  const requestFields = fields.filter(f => ['requests', 'specialRequests'].includes(f.name));

  const steps = [
    { title: 'Contact Info', fields: contactFields },
    { title: 'Details', fields: detailFields },
    { title: 'Special Requests', fields: requestFields }
  ].filter(step => step.fields.length > 0);

  const handleChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await luxuryBookingService.submitBooking(type, formData as LuxuryBookingData);
      
      if (result.success) {
        setBookingResult({
          bookingRef: result.bookingRef,
          whatsAppLink: result.whatsAppLink
        });
        setSubmitted(true);
        toast.success('Booking submitted successfully!', {
          description: `Reference: ${result.bookingRef}`,
          duration: 5000
        });
      } else {
        toast.error(result.error || 'Failed to submit booking');
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const colorClasses: Record<string, { bg: string; text: string; border: string; button: string }> = {
    amber: {
      bg: 'from-amber-500 to-amber-400',
      text: 'text-amber-400',
      border: 'border-amber-400/30',
      button: 'bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300'
    },
    emerald: {
      bg: 'from-emerald-500 to-emerald-400',
      text: 'text-emerald-400',
      border: 'border-emerald-400/30',
      button: 'bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300'
    },
    blue: {
      bg: 'from-blue-500 to-blue-400',
      text: 'text-blue-400',
      border: 'border-blue-400/30',
      button: 'bg-gradient-to-r from-blue-500 to-blue-400 hover:from-blue-400 hover:to-blue-300'
    },
    rose: {
      bg: 'from-rose-500 to-rose-400',
      text: 'text-rose-400',
      border: 'border-rose-400/30',
      button: 'bg-gradient-to-r from-rose-500 to-rose-400 hover:from-rose-400 hover:to-rose-300'
    },
    white: {
      bg: 'from-white to-gray-100',
      text: 'text-white',
      border: 'border-white/20',
      button: 'bg-white hover:bg-gray-100 text-black'
    }
  };

  const colors = colorClasses[accentColor] || colorClasses.amber;

  // Success State
  if (submitted && bookingResult) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`bg-white/[0.02] border border-white/10 p-8 md:p-12 text-center ${className}`}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2 }}
          className={`w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br ${colors.bg} flex items-center justify-center`}
        >
          <CheckCircle2 className="w-10 h-10 text-white" />
        </motion.div>

        <h3 className="text-2xl font-light text-white mb-2">Booking Submitted!</h3>
        <p className="text-gray-400 mb-8">Our luxury concierge will contact you within 2 hours</p>

        <div className="bg-white/5 rounded-lg p-6 mb-8">
          <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">Your Reference Number</div>
          <div className="flex items-center justify-center gap-3">
            <span className={`text-2xl font-mono font-bold ${colors.text}`}>{bookingResult.bookingRef}</span>
            <button 
              onClick={() => copyToClipboard(bookingResult.bookingRef)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <Copy className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-gray-400">For faster response, connect on WhatsApp:</p>
          <a
            href={bookingResult.whatsAppLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-[#25D366] hover:bg-[#128C7E] text-white px-8 py-4 rounded-lg transition-all"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
            <span className="font-medium">Chat on WhatsApp</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        <div className="mt-8 pt-8 border-t border-white/10">
          <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              <span>Confirmation sent to your email</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            setSubmitted(false);
            setBookingResult(null);
            setFormData({});
            setCurrentStep(0);
          }}
          className="mt-6 text-sm text-gray-500 hover:text-white transition-colors"
        >
          Submit another inquiry →
        </button>
      </motion.div>
    );
  }

  // Form State
  return (
    <div className={`bg-white/[0.02] border border-white/10 ${className}`}>
      {/* Header */}
      <div className="p-6 md:p-8 border-b border-white/10">
        <div className="flex items-center gap-3 mb-2">
          <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${colors.bg} flex items-center justify-center`}>
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-light text-white">{title}</h3>
            <p className="text-sm text-gray-500">{subtitle}</p>
          </div>
        </div>

        {/* Step indicators */}
        {steps.length > 1 && (
          <div className="flex items-center gap-2 mt-6">
            {steps.map((step, idx) => (
              <React.Fragment key={idx}>
                <button
                  onClick={() => setCurrentStep(idx)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs transition-all ${
                    idx === currentStep
                      ? `${colors.button} text-black`
                      : idx < currentStep
                      ? 'bg-white/10 text-white'
                      : 'bg-white/5 text-gray-500'
                  }`}
                >
                  {idx < currentStep ? (
                    <Check className="w-3 h-3" />
                  ) : (
                    <span className="w-4 h-4 flex items-center justify-center">{idx + 1}</span>
                  )}
                  <span className="hidden sm:inline">{step.title}</span>
                </button>
                {idx < steps.length - 1 && (
                  <div className={`flex-1 h-px ${idx < currentStep ? 'bg-white/30' : 'bg-white/10'}`} />
                )}
              </React.Fragment>
            ))}
          </div>
        )}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6 md:p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {steps[currentStep]?.fields.map((field) => (
                <div key={field.name} className={field.halfWidth === false || field.type === 'textarea' ? 'md:col-span-2' : ''}>
                  <label className="block text-xs font-light text-gray-400 uppercase tracking-wider mb-2">
                    {field.label} {field.required && <span className={colors.text}>*</span>}
                  </label>
                  
                  {field.type === 'select' ? (
                    <select
                      value={formData[field.name] || ''}
                      onChange={(e) => handleChange(field.name, e.target.value)}
                      required={field.required}
                      className="w-full bg-white/5 border border-white/10 text-white rounded-none h-14 px-4 focus:border-white/30 focus:outline-none transition-colors"
                    >
                      <option value="" className="bg-[#111]">{field.placeholder || `Select ${field.label.toLowerCase()}`}</option>
                      {field.options?.map(opt => (
                        <option key={opt.value} value={opt.value} className="bg-[#111]">{opt.label}</option>
                      ))}
                    </select>
                  ) : field.type === 'textarea' ? (
                    <Textarea
                      value={formData[field.name] || ''}
                      onChange={(e) => handleChange(field.name, e.target.value)}
                      placeholder={field.placeholder}
                      required={field.required}
                      rows={4}
                      className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 rounded-none focus:border-white/30"
                    />
                  ) : (
                    <div className="relative">
                      <Input
                        type={field.type}
                        value={formData[field.name] || ''}
                        onChange={(e) => handleChange(field.name, e.target.value)}
                        placeholder={field.placeholder}
                        required={field.required}
                        className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 rounded-none h-14 focus:border-white/30"
                      />
                      {field.icon && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                          {field.icon}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between gap-4">
              {currentStep > 0 ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentStep(prev => prev - 1)}
                  className="border-white/20 text-white hover:bg-white/5 rounded-none"
                >
                  Back
                </Button>
              ) : (
                <div />
              )}

              {currentStep < steps.length - 1 ? (
                <Button
                  type="button"
                  onClick={() => setCurrentStep(prev => prev + 1)}
                  className={`${colors.button} text-black rounded-none px-8`}
                >
                  Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={loading}
                  className={`${colors.button} text-black rounded-none px-8 py-6`}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Inquiry
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Trust badges */}
        <div className="mt-8 pt-6 border-t border-white/10">
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-gray-500">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-green-500" />
              <span>Secure & Encrypted</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>2-Hour Response</span>
            </div>
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              <span>24/7 Support</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default LuxuryBookingForm;
