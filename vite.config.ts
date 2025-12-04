import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
// import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    // Disabled - causing JSX transform issues
    // mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Optimize for production
    minify: 'esbuild', // esbuild is much faster than terser and good enough
    sourcemap: mode !== 'production',
    // Remove console.logs in production for cleaner output
    esbuild: mode === 'production' ? {
      drop: ['console', 'debugger'],
    } : {},
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1500,
    // Enable CSS code splitting
    cssCodeSplit: true,
    // Optimize asset handling
    assetsInlineLimit: 4096, // Inline assets smaller than 4KB
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-ui': ['@radix-ui/react-dialog', '@radix-ui/react-slot', '@radix-ui/react-label', 'class-variance-authority', 'clsx', 'tailwind-merge'],
          'vendor-utils': ['date-fns', 'zod', 'react-hook-form'],
          'vendor-maps': ['@react-google-maps/api', 'leaflet', 'react-leaflet'],
          'vendor-charts': ['recharts'],
          'vendor-animation': ['framer-motion'],
          'vendor-icons': ['lucide-react'],
          'firebase': ['firebase/app', 'firebase/auth', 'firebase/firestore', 'firebase/storage', 'firebase/analytics'],
        },
      },
    },
  },
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'lucide-react',
      'clsx',
      'tailwind-merge',
      'date-fns',
      'framer-motion',
      'recharts',
      'leaflet',
      'react-leaflet',
    ],
    exclude: ['lovable-tagger', '@google/generative-ai'],
  },
}));
