import { motion } from 'framer-motion';
import { Mail, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { newsletterService } from '@/services/newsletterService';

const NewsletterSection = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) return;

    setStatus('loading');
    setMessage('');

    try {
      const result = await newsletterService.subscribe({
        email,
        source: 'homepage'
      });

      setStatus(result.success ? 'success' : 'error');
      setMessage(result.message);

      if (result.success) {
        setEmail('');
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
    <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-700">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center text-white"
        >
          <Mail className="w-12 h-12 mx-auto mb-4" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Get Exclusive Travel Deals
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Subscribe to our newsletter and receive special offers, travel tips, and insider guides to Sri Lanka
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={status === 'loading'}
              className="flex-1 px-6 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white disabled:opacity-70"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 disabled:opacity-70 min-w-[140px]"
            >
              {status === 'loading' ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
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

          {message && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`text-sm mt-4 flex items-center justify-center gap-2 ${
                status === 'success' ? 'text-green-200' : 'text-red-200'
              }`}
            >
              {status === 'error' && <AlertCircle className="w-4 h-4" />}
              {message}
            </motion.p>
          )}

          <p className="text-sm text-blue-100 mt-4">
            Join 10,000+ travelers. Unsubscribe anytime.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default NewsletterSection;