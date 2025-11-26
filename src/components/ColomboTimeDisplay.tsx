import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Clock, MapPin, Calendar } from 'lucide-react'

const ColomboTimeDisplay = () => {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const getColomboTime = () => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
      timeZone: 'Asia/Colombo'
    }).format(currentTime)
  }

  const getColomboDate = () => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'Asia/Colombo'
    }).format(currentTime)
  }

  const getTimeZone = () => {
    return 'GMT+5:30'
  }

  const timeString = getColomboTime()
  const dateString = getColomboDate()

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="relative"
    >
      {/* Main Container with stronger background */}
      <div className="relative bg-gradient-to-br from-black/60 via-black/40 to-black/60 backdrop-blur-xl border border-white/30 rounded-3xl p-6 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] overflow-hidden">
        {/* Animated Background Glow */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20"
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{
            backgroundSize: '200% 200%',
          }}
        />

        {/* Content */}
        <div className="relative z-10">
          {/* Location Header */}
          <motion.div
            className="flex items-center justify-center gap-2 mb-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <MapPin className="w-5 h-5 text-emerald-400 drop-shadow-lg" />
            <span
              className="text-white font-semibold text-sm uppercase tracking-[0.2em] drop-shadow-lg"
              style={{ textShadow: '0 2px 8px rgba(0,0,0,0.9), 0 0 20px rgba(0,0,0,0.7)' }}
            >
              Colombo, Sri Lanka
            </span>
          </motion.div>

          {/* Time Display */}
          <motion.div
            className="text-center mb-3"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="flex items-center justify-center gap-3">
              <Clock className="w-8 h-8 text-blue-400 animate-pulse drop-shadow-lg" />
              <div
                className="font-mono text-5xl md:text-6xl font-bold text-white tracking-wider"
                style={{ textShadow: '0 4px 20px rgba(0,0,0,0.9), 0 2px 10px rgba(0,0,0,0.8), 0 0 30px rgba(0,0,0,0.7)' }}
              >
                {timeString}
              </div>
            </div>
            <motion.div
              className="text-white text-sm font-medium mt-2"
              style={{ textShadow: '0 2px 8px rgba(0,0,0,0.9)' }}
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {getTimeZone()}
            </motion.div>
          </motion.div>

          {/* Date Display */}
          <motion.div
            className="flex items-center justify-center gap-2 text-white text-base md:text-lg"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Calendar className="w-5 h-5 text-amber-400 drop-shadow-lg" />
            <span
              className="font-medium"
              style={{ textShadow: '0 2px 8px rgba(0,0,0,0.9), 0 0 15px rgba(0,0,0,0.7)' }}
            >
              {dateString}
            </span>
          </motion.div>

          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-purple-500/20 to-transparent rounded-full blur-3xl" />
        </div>

        {/* Animated Border Glow */}
        <motion.div
          className="absolute inset-0 rounded-3xl"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
          }}
          animate={{
            x: ['-100%', '200%'],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </div>

      {/* Floating Particles */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-white/30 rounded-full"
          style={{
            top: `${20 + i * 30}%`,
            left: `${10 + i * 40}%`,
          }}
          animate={{
            y: [-10, 10, -10],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 2 + i,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </motion.div>
  )
}

export default ColomboTimeDisplay

