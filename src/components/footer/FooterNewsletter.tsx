
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Check, AlertCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { newsletterService } from '@/services/newsletterService'

interface NewsletterState {
  email: string
  status: 'idle' | 'loading' | 'success' | 'error'
  message: string
}

const FooterNewsletter: React.FC = () => {
  const [newsletterState, setNewsletterState] = useState<NewsletterState>({
    email: '',
    status: 'idle',
    message: ''
  })

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newsletterState.email) {
      setNewsletterState(prev => ({
        ...prev,
        status: 'error',
        message: 'Please enter a valid email address'
      }))
      return
    }

    setNewsletterState(prev => ({ ...prev, status: 'loading', message: '' }))

    try {
      const result = await newsletterService.subscribe({
        email: newsletterState.email,
        source: 'footer'
      })

      setNewsletterState({
        email: result.success ? '' : newsletterState.email,
        status: result.success ? 'success' : 'error',
        message: result.message
      })

      if (result.success) {
        setTimeout(() => {
          setNewsletterState(prev => ({ ...prev, status: 'idle', message: '' }))
        }, 4000)
      }
    } catch (error) {
      setNewsletterState({
        email: newsletterState.email,
        status: 'error',
        message: 'Something went wrong. Please try again.'
      })
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="space-y-4"
    >
      <h3 className="text-lg font-semibold text-white">Stay Updated</h3>
      <p className="text-slate-300 text-sm">
        Get the latest wildlife updates and exclusive Sri Lankan travel deals.
      </p>
      
      <form onSubmit={handleNewsletterSubmit} className="space-y-3">
        <div className="flex gap-2">
          <Input
            type="email"
            placeholder="Enter your email"
            value={newsletterState.email}
            onChange={(e) => setNewsletterState(prev => ({ 
              ...prev, 
              email: e.target.value,
              status: 'idle',
              message: ''
            }))}
            className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-400 focus:border-blue-500"
            disabled={newsletterState.status === 'loading'}
          />
          <Button
            type="submit"
            size="icon"
            disabled={newsletterState.status === 'loading'}
            className="bg-blue-600 hover:bg-blue-700 text-white shrink-0"
          >
            {newsletterState.status === 'loading' ? (
              <Loader2 size={18} className="animate-spin" />
            ) : newsletterState.status === 'success' ? (
              <Check size={18} />
            ) : (
              <Send size={18} />
            )}
          </Button>
        </div>
        
        <AnimatePresence>
          {newsletterState.message && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className={`flex items-center gap-2 text-sm ${
                newsletterState.status === 'success' 
                  ? 'text-green-400' 
                  : 'text-red-400'
              }`}
            >
              {newsletterState.status === 'success' ? (
                <Check size={16} />
              ) : (
                <AlertCircle size={16} />
              )}
              {newsletterState.message}
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </motion.div>
  )
}

export default FooterNewsletter
