import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import { saveApiKey, getApiKey } from './src/api';
import bodyParser from 'body-parser';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'api-key-handler',
      configureServer(server) {
        server.middlewares.use(bodyParser.json());
        server.middlewares.use('/api/save-api-key', async (req, res) => {
          if (req.method === 'POST') {
            const { apiKey } = req.body;
            const result = await saveApiKey(apiKey);
            if (result.success) {
              res.statusCode = 200;
              res.end('API key saved successfully');
            } else {
              res.statusCode = 500;
              res.end('Error saving API key');
            }
          } else {
            res.statusCode = 405;
            res.end('Method Not Allowed');
          }
        });
        server.middlewares.use('/api/get-api-key', async (req, res) => {
          if (req.method === 'GET') {
            const result = await getApiKey();
            if (result.success) {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ apiKey: result.apiKey }));
            } else {
              res.statusCode = 500;
              res.end('Error getting API key');
            }
          } else {
            res.statusCode = 405;
            res.end('Method Not Allowed');
          }
        });
      },
    },
  ],
  root: '.',
  base: '/',
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
    cssMinify: true,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html')
      },
      output: {
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'firebase': ['firebase/app', 'firebase/auth', 'firebase/firestore', 'firebase/storage'],
          'ui': ['lucide-react', '@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-tabs']
        }
      }
    }
  },
  css: {
    postcss: './postcss.config.js',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/components': path.resolve(__dirname, './src/components'),
      '@/lib': path.resolve(__dirname, './src/lib'),
      '@/hooks': path.resolve(__dirname, './src/hooks'),
      '@/contexts': path.resolve(__dirname, './src/contexts'),
      '@/pages': path.resolve(__dirname, './src/pages'),
      '@/types': path.resolve(__dirname, './src/types'),
      '@/services': path.resolve(__dirname, './src/services'),
      '@/styles': path.resolve(__dirname, './src/styles')
    }
  },
  server: {
    port: 5174,
    host: true
  }
})