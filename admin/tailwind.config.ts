
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
        'poppins': ['Poppins', 'sans-serif'],
        'playfair': ['Playfair Display', 'serif'],
        'dm-sans': ['DM Sans', 'sans-serif'],
        'montserrat': ['Montserrat', 'sans-serif'],
        'cinzel': ['Cinzel', 'serif'],
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: 'hsl(var(--card))',
        'card-foreground': 'hsl(var(--card-foreground))',
        popover: 'hsl(var(--popover))',
        'popover-foreground': 'hsl(var(--popover-foreground))',
        primary: 'hsl(var(--primary))',
        'primary-foreground': 'hsl(var(--primary-foreground))',
        secondary: 'hsl(var(--secondary))',
        'secondary-foreground': 'hsl(var(--secondary-foreground))',
        muted: 'hsl(var(--muted))',
        'muted-foreground': 'hsl(var(--muted-foreground))',
        accent: 'hsl(var(--accent))',
        'accent-foreground': 'hsl(var(--accent-foreground))',
        destructive: 'hsl(var(--destructive))',
        'destructive-foreground': 'hsl(var(--destructive-foreground))',
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        radius: 'var(--radius)',
        'jungle-green': 'hsl(var(--jungle-green))',
        'peacock-teal': 'hsl(var(--peacock-teal))',
        'wild-orange': 'hsl(var(--wild-orange))',
        
        // Heritage color palette
        heritage: {
          sepia: '#704214',
          sandstone: '#f4a460',
          oxblood: '#800020',
          gold: '#cfb53b',
          stone: '#8b7355',
          monastery: '#5d4e37',
          lotus: '#daa520',
          ancient: '#8b4513',
        },
        
        // Luxury Culinary color palette
        luxury: {
          saffron: '#F4A460',
          mahogany: '#722F37',
          cream: '#F5F5DC',
          copper: '#B87333',
          bronze: '#CD7F32',
          gold: '#FFD700',
          darkwood: '#3C2415',
          spice: '#8B4513',
        },
        
        // Luxury color palette
        'navy': '#1e293b',
        'gold': '#d4af37',
        'ivory': '#f8fafc',
        'champagne': '#f7e7ce',
        'emerald': {
          50: '#ecfdf5',
          500: '#10b981',
          600: '#059669',
        },
        'slate': {
          50: '#f8fafc',
          600: '#475569',
          800: '#1e293b',
          900: '#0f172a',
        },
        
        // Tea Estate color palette
        'tea': {
          mist: '#a7c4a0',
          plantation: '#8db89a',
          cream: '#f5f5dc',
          teak: '#8b4513',
          mahogany: '#a0522d',
          ceylon: '#ffbf00',
          brass: '#b8860b',
        }
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        
        'fade-in': {
          '0%': {
            opacity: '0',
            transform: 'translateY(10px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          }
        },
        'scale-in': {
          '0%': {
            transform: 'scale(0.95)',
            opacity: '0'
          },
          '100%': {
            transform: 'scale(1)',
            opacity: '1'
          }
        },
        'float': {
          '0%, 100%': {
            transform: 'translateY(0px)'
          },
          '50%': {
            transform: 'translateY(-10px)'
          }
        },
        'dust-mote': {
          '0%': {
            transform: 'translate(0, 100vh) scale(0)',
            opacity: '0'
          },
          '10%': {
            opacity: '1'
          },
          '90%': {
            opacity: '1'
          },
          '100%': {
            transform: 'translate(0, -100vh) scale(1)',
            opacity: '0'
          }
        },
        'parallax-slow': {
          '0%': {
            transform: 'translateX(0)'
          },
          '100%': {
            transform: 'translateX(-50px)'
          }
        },
        'stone-glow': {
          '0%, 100%': {
            boxShadow: '0 0 20px rgba(207, 181, 59, 0.3)'
          },
          '50%': {
            boxShadow: '0 0 30px rgba(207, 181, 59, 0.6)'
          }
        },
        'mist-drift': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' }
        },
        'slow-pan': {
          '0%': { transform: 'scale(1) translateX(0)' },
          '100%': { transform: 'scale(1.05) translateX(-20px)' }
        },
        'tea-leaf-fall': {
          '0%': {
            transform: 'translateY(-100vh) rotate(0deg)',
            opacity: '0'
          },
          '10%': {
            opacity: '1'
          },
          '90%': {
            opacity: '1'
          },
          '100%': {
            transform: 'translateY(100vh) rotate(360deg)',
            opacity: '0'
          }
        },
        'spice-float': {
          '0%, 100%': {
            transform: 'translateY(0px) rotate(0deg)',
            opacity: '0.6'
          },
          '50%': {
            transform: 'translateY(-15px) rotate(180deg)',
            opacity: '0.8'
          }
        },
        'copper-glow': {
          '0%, 100%': {
            boxShadow: '0 0 15px rgba(184, 115, 51, 0.4), inset 0 0 15px rgba(184, 115, 51, 0.1)'
          },
          '50%': {
            boxShadow: '0 0 25px rgba(184, 115, 51, 0.6), inset 0 0 25px rgba(184, 115, 51, 0.2)'
          }
        },
        'luxury-pan': {
          '0%': { transform: 'scale(1.1) translateX(-10px)' },
          '100%': { transform: 'scale(1.15) translateX(10px)' }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        
        'fade-in': 'fade-in 0.6s ease-out',
        'scale-in': 'scale-in 0.4s ease-out',
        'float': 'float 3s ease-in-out infinite',
        'dust-mote': 'dust-mote 15s linear infinite',
        'parallax-slow': 'parallax-slow 30s linear infinite',
        'stone-glow': 'stone-glow 3s ease-in-out infinite',
        'mist-drift': 'mist-drift 20s linear infinite',
        'slow-pan': 'slow-pan 30s ease-in-out infinite alternate',
        'tea-leaf-fall': 'tea-leaf-fall 12s linear infinite',
        'spice-float': 'spice-float 4s ease-in-out infinite',
        'copper-glow': 'copper-glow 3s ease-in-out infinite',
        'luxury-pan': 'luxury-pan 45s ease-in-out infinite alternate',
      },
      boxShadow: {
        '3xl': '0 35px 60px -12px rgba(0, 0, 0, 0.25)',
        'stone': '0 8px 16px rgba(112, 66, 20, 0.3)',
        'heritage': '0 4px 12px rgba(139, 32, 52, 0.2)',
        'tea-estate': '0 8px 24px rgba(139, 69, 19, 0.2)',
        'brass': '0 4px 16px rgba(184, 134, 11, 0.3)',
        'copper': '0 8px 32px rgba(184, 115, 51, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        'luxury': '0 20px 40px rgba(60, 36, 21, 0.4), 0 4px 8px rgba(60, 36, 21, 0.2)',
        'embossed': 'inset 0 1px 3px rgba(0, 0, 0, 0.3), 0 1px 0 rgba(255, 255, 255, 0.1)',
      },
      backgroundImage: {
        'wood-grain': 'linear-gradient(45deg, #8b4513 25%, transparent 25%), linear-gradient(-45deg, #8b4513 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #a0522d 75%), linear-gradient(-45deg, transparent 75%, #a0522d 75%)',
        'tea-leaf-pattern': `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000' fill-opacity='0.1'%3E%3Cpath d='M30 30c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20zm15 0c0-8.284-6.716-15-15-15s-15 6.716-15 15 6.716 15 15 15 15-6.716 15-15z'/%3E%3C/g%3E%3C/svg%3E")`,
        'spice-pattern': `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23B87333' fill-opacity='0.1'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm5 0c0-2.8-2.2-5-5-5s-5 2.2-5 5 2.2 5 5 5 5-2.2 5-5z'/%3E%3C/g%3E%3C/svg%3E")`,
        'copper-texture': 'linear-gradient(145deg, #B87333 0%, #CD7F32 25%, #B87333 50%, #996633 75%, #B87333 100%)',
      }
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config

export default config
