
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { subscribeWildlifeNewsletter } from '@/services/wildlife/newsletterService';

const SafariNewsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      const { error } = await subscribeWildlifeNewsletter({
        email,
        source: 'safari_newsletter'
      });
      
      if (error) {
        throw error;
      }

      toast({
        title: "Successfully subscribed!",
        description: "Check your email for the exclusive Sri Lanka's Big 5 guide.",
      });
      setEmail('');
    } catch (error) {
      toast({
        title: "Subscription failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20 bg-gradient-to-r from-green-900 to-blue-900 text-white">
      <div className="container mx-auto px-6 text-center">
        <h3 className="font-lora text-3xl font-semibold mb-4">
          Your Ultimate Sri Lankan Safari Starts Here
        </h3>
        <p className="text-lg mb-8 max-w-3xl mx-auto">
          Sign up for our newsletter and receive our exclusive guide: "Sri Lanka's Big 5: An Insider's Guide to Unforgettable Wildlife Encounters."
        </p>
        
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="flex-1 text-black"
          />
          <Button 
            type="submit" 
            disabled={loading}
            className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-bold px-8"
          >
            {loading ? 'Subscribing...' : 'Subscribe'}
          </Button>
        </form>
        
        <p className="text-sm mt-8 opacity-80">
          &copy; 2025 Recharge Travel. All rights reserved. | Crafting Unforgettable Wildlife Adventures in Sri Lanka
        </p>
      </div>
    </section>
  );
};

export default SafariNewsletter;
