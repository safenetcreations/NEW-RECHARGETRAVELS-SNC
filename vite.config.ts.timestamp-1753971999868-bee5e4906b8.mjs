// vite.config.ts
import { defineConfig } from "file:///Users/nanthan/Desktop/ALL%20FOLDER%20ARRANGED%2001-08-25/warp%20projects/Recharge%20by%20Claude-21-07-25/rechargetravels-sri-lankashalli-create-in-github/node_modules/vite/dist/node/index.js";
import react from "file:///Users/nanthan/Desktop/ALL%20FOLDER%20ARRANGED%2001-08-25/warp%20projects/Recharge%20by%20Claude-21-07-25/rechargetravels-sri-lankashalli-create-in-github/node_modules/@vitejs/plugin-react-swc/index.js";
import path from "path";
import { componentTagger } from "file:///Users/nanthan/Desktop/ALL%20FOLDER%20ARRANGED%2001-08-25/warp%20projects/Recharge%20by%20Claude-21-07-25/rechargetravels-sri-lankashalli-create-in-github/node_modules/lovable-tagger/dist/index.js";
var __vite_injected_original_dirname = "/Users/nanthan/Desktop/ALL FOLDER ARRANGED 01-08-25/warp projects/Recharge by Claude-21-07-25/rechargetravels-sri-lankashalli-create-in-github";
var vite_config_default = defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080
  },
  plugins: [
    react(),
    mode === "development" && componentTagger()
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src")
    }
  },
  build: {
    // Optimize for production
    minify: "terser",
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          ui: ["@radix-ui/react-slot", "@radix-ui/react-toast"],
          maps: ["@react-google-maps/api"],
          utils: ["clsx", "tailwind-merge", "lucide-react"]
        }
      }
    },
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 600
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ["react", "react-dom", "react-router-dom"]
  }
}));
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvbmFudGhhbi9EZXNrdG9wL0FMTCBGT0xERVIgQVJSQU5HRUQgMDEtMDgtMjUvd2FycCBwcm9qZWN0cy9SZWNoYXJnZSBieSBDbGF1ZGUtMjEtMDctMjUvcmVjaGFyZ2V0cmF2ZWxzLXNyaS1sYW5rYXNoYWxsaS1jcmVhdGUtaW4tZ2l0aHViXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvbmFudGhhbi9EZXNrdG9wL0FMTCBGT0xERVIgQVJSQU5HRUQgMDEtMDgtMjUvd2FycCBwcm9qZWN0cy9SZWNoYXJnZSBieSBDbGF1ZGUtMjEtMDctMjUvcmVjaGFyZ2V0cmF2ZWxzLXNyaS1sYW5rYXNoYWxsaS1jcmVhdGUtaW4tZ2l0aHViL3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9uYW50aGFuL0Rlc2t0b3AvQUxMJTIwRk9MREVSJTIwQVJSQU5HRUQlMjAwMS0wOC0yNS93YXJwJTIwcHJvamVjdHMvUmVjaGFyZ2UlMjBieSUyMENsYXVkZS0yMS0wNy0yNS9yZWNoYXJnZXRyYXZlbHMtc3JpLWxhbmthc2hhbGxpLWNyZWF0ZS1pbi1naXRodWIvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdC1zd2NcIjtcbmltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgeyBjb21wb25lbnRUYWdnZXIgfSBmcm9tIFwibG92YWJsZS10YWdnZXJcIjtcblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoeyBtb2RlIH0pID0+ICh7XG4gIHNlcnZlcjoge1xuICAgIGhvc3Q6IFwiOjpcIixcbiAgICBwb3J0OiA4MDgwLFxuICB9LFxuICBwbHVnaW5zOiBbXG4gICAgcmVhY3QoKSxcbiAgICBtb2RlID09PSAnZGV2ZWxvcG1lbnQnICYmIGNvbXBvbmVudFRhZ2dlcigpLFxuICBdLmZpbHRlcihCb29sZWFuKSxcbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiB7XG4gICAgICBcIkBcIjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCIuL3NyY1wiKSxcbiAgICB9LFxuICB9LFxuICBidWlsZDoge1xuICAgIC8vIE9wdGltaXplIGZvciBwcm9kdWN0aW9uXG4gICAgbWluaWZ5OiAndGVyc2VyJyxcbiAgICBzb3VyY2VtYXA6IGZhbHNlLFxuICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgIG91dHB1dDoge1xuICAgICAgICBtYW51YWxDaHVua3M6IHtcbiAgICAgICAgICB2ZW5kb3I6IFsncmVhY3QnLCAncmVhY3QtZG9tJ10sXG4gICAgICAgICAgdWk6IFsnQHJhZGl4LXVpL3JlYWN0LXNsb3QnLCAnQHJhZGl4LXVpL3JlYWN0LXRvYXN0J10sXG4gICAgICAgICAgbWFwczogWydAcmVhY3QtZ29vZ2xlLW1hcHMvYXBpJ10sXG4gICAgICAgICAgdXRpbHM6IFsnY2xzeCcsICd0YWlsd2luZC1tZXJnZScsICdsdWNpZGUtcmVhY3QnXSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSxcbiAgICAvLyBJbmNyZWFzZSBjaHVuayBzaXplIHdhcm5pbmcgbGltaXRcbiAgICBjaHVua1NpemVXYXJuaW5nTGltaXQ6IDYwMCxcbiAgfSxcbiAgLy8gT3B0aW1pemUgZGVwZW5kZW5jaWVzXG4gIG9wdGltaXplRGVwczoge1xuICAgIGluY2x1ZGU6IFsncmVhY3QnLCAncmVhY3QtZG9tJywgJ3JlYWN0LXJvdXRlci1kb20nXSxcbiAgfSxcbn0pKTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBd21CLFNBQVMsb0JBQW9CO0FBQ3JvQixPQUFPLFdBQVc7QUFDbEIsT0FBTyxVQUFVO0FBQ2pCLFNBQVMsdUJBQXVCO0FBSGhDLElBQU0sbUNBQW1DO0FBTXpDLElBQU8sc0JBQVEsYUFBYSxDQUFDLEVBQUUsS0FBSyxPQUFPO0FBQUEsRUFDekMsUUFBUTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sTUFBTTtBQUFBLEVBQ1I7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLE1BQU07QUFBQSxJQUNOLFNBQVMsaUJBQWlCLGdCQUFnQjtBQUFBLEVBQzVDLEVBQUUsT0FBTyxPQUFPO0FBQUEsRUFDaEIsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsS0FBSyxLQUFLLFFBQVEsa0NBQVcsT0FBTztBQUFBLElBQ3RDO0FBQUEsRUFDRjtBQUFBLEVBQ0EsT0FBTztBQUFBO0FBQUEsSUFFTCxRQUFRO0FBQUEsSUFDUixXQUFXO0FBQUEsSUFDWCxlQUFlO0FBQUEsTUFDYixRQUFRO0FBQUEsUUFDTixjQUFjO0FBQUEsVUFDWixRQUFRLENBQUMsU0FBUyxXQUFXO0FBQUEsVUFDN0IsSUFBSSxDQUFDLHdCQUF3Qix1QkFBdUI7QUFBQSxVQUNwRCxNQUFNLENBQUMsd0JBQXdCO0FBQUEsVUFDL0IsT0FBTyxDQUFDLFFBQVEsa0JBQWtCLGNBQWM7QUFBQSxRQUNsRDtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUE7QUFBQSxJQUVBLHVCQUF1QjtBQUFBLEVBQ3pCO0FBQUE7QUFBQSxFQUVBLGNBQWM7QUFBQSxJQUNaLFNBQVMsQ0FBQyxTQUFTLGFBQWEsa0JBQWtCO0FBQUEsRUFDcEQ7QUFDRixFQUFFOyIsCiAgIm5hbWVzIjogW10KfQo=
