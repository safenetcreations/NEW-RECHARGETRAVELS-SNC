import { motion } from 'framer-motion';
import { Mail, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { newsletterService } from '@/services/newsletterService';

const validateEmail = (email = '') => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const NewsletterSection = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !validateEmail(email)) {
      setStatus('error');
      setMessage('Please enter a valid email address.');
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      const result = await newsletterService.subscribe({
        email,
        source: 'homepage'
      });

      setStatus(result.success ? 'success' : 'error');
      setMessage(result.message || (result.success ? 'Subscribed!' : 'Subscription failed.'));

      if (result.success) {
          setEmail('');
          // visual confirmation
          setShowConfetti(true);
          setShowToast(true);
          setTimeout(() => setShowConfetti(false), 2000);
          setTimeout(() => setShowToast(false), 3500);

          // keep success for 4s then clear
          setTimeout(() => {
            setStatus('idle');
            setMessage('');
          }, 4000);
      }
    } catch (error) {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
    }
  };

  return (
    <section aria-label="Subscribe for exclusive deals" className="relative overflow-hidden py-16">
      {/* Decorative gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-blue-600 to-teal-600 opacity-95 transform-gpu -skew-y-2" aria-hidden />

      <div className="relative container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="max-w-3xl mx-auto text-center text-white relative z-10"
        >
          <motion.div whileHover={{ scale: 1.06 }} className="inline-flex items-center justify-center w-14 h-14 mb-4 rounded-full bg-white/10 backdrop-blur">
            <Mail className="w-7 h-7 text-white" />
          </motion.div>

          <h2 className="text-3xl md:text-4xl font-extrabold mb-3 drop-shadow">Get Exclusive Travel Deals</h2>

          <p className="text-lg text-blue-50 mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter and receive special offers, travel tips, and insider guides to Sri Lanka — curated for curious travellers.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 items-center justify-center max-w-xl mx-auto">
            <label htmlFor="newsletter-email" className="sr-only">Email address</label>
            <div className="relative flex-1 w-full">
              <input
                id="newsletter-email"
                aria-label="Email address"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={status === 'loading'}
                className="w-full rounded-xl px-5 py-4 text-gray-900 placeholder-gray-600 shadow-md focus:outline-none focus:ring-4 focus:ring-white/30"
              />
              {/* floating hint */}
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-white/80 hidden sm:inline">Join 10,000+</span>
            </div>

            <button
              type="submit"
              disabled={status === 'loading'}
              className="inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-white text-blue-700 font-semibold shadow-lg hover:scale-[1.02] transition-transform disabled:opacity-70"
            >
              {status === 'loading' ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin text-blue-700" />
                  Subscribing...
                </>
              ) : status === 'success' ? (
                <>
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  Subscribed!
                </>
              ) : (
                'Subscribe'
              )}
            </button>
          </form>

          {/* status / message region */}
          <div aria-live="polite" className="mt-4 min-h-[1.5rem]">
            {message && (
              <motion.p
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className={`inline-flex items-center gap-2 text-sm px-3 py-1 rounded-full ${
                  status === 'success' ? 'bg-white/10 text-green-100' : 'bg-white/10 text-red-100'
                }`}
              >
                {status === 'error' && <AlertCircle className="w-4 h-4" />}
                {message}
              </motion.p>
            )}
          </div>

          {/* Toast */}
          {showToast && (
            <div className="fixed top-6 right-6 z-50">
              <div className="bg-white/95 text-blue-700 px-4 py-2 rounded-lg shadow-lg flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div className="text-sm font-medium">Thanks! You're subscribed.</div>
              </div>
            </div>
          )}

          <p className="text-xs text-blue-50/80 mt-4">Join 10,000+ travelers. Unsubscribe anytime.</p>
        </motion.div>
      </div>

      {/* subtle animated blobs */}
      <svg className="absolute -left-32 -bottom-20 opacity-40" width="420" height="420" viewBox="0 0 420 420" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <defs>
          <linearGradient id="g1" x1="0" x2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        <circle cx="200" cy="200" r="160" fill="url(#g1)"></circle>
      </svg>

        {/* Confetti pieces */}
        {showConfetti && (
          <div className="absolute inset-0 pointer-events-none z-50">
            {[...Array(24)].map((_, i) => (
              <div
                key={i}
                className="absolute confetti-piece"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  backgroundColor: ['#D4AF37', '#CD7F32', '#B8860B', '#FF6B6B', '#4ECDC4'][Math.floor(Math.random() * 5)],
                  animationDelay: `${Math.random() * 1.5}s`
                }}
              />
            ))}
          </div>
        )}
    </section>
  );
};

export default NewsletterSection;