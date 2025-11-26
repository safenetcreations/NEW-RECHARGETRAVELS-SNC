// vite.config.ts
import { defineConfig } from "file:///Users/nanthan/Desktop/Recharge%20by%20Claude-21-07-25/rechargetravels-sri-lankashalli-create-in-github/admin/node_modules/vite/dist/node/index.js";
import react from "file:///Users/nanthan/Desktop/Recharge%20by%20Claude-21-07-25/rechargetravels-sri-lankashalli-create-in-github/admin/node_modules/@vitejs/plugin-react-swc/index.js";
import path from "path";
var __vite_injected_original_dirname = "/Users/nanthan/Desktop/Recharge by Claude-21-07-25/rechargetravels-sri-lankashalli-create-in-github/admin";
var vite_config_default = defineConfig({
  plugins: [react()],
  root: ".",
  base: "/",
  build: {
    outDir: "dist",
    sourcemap: false,
    minify: "terser",
    rollupOptions: {
      input: {
        main: path.resolve(__vite_injected_original_dirname, "index.html")
      },
      output: {
        entryFileNames: "assets/[name]-[hash].js",
        chunkFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash].[ext]"
      }
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src"),
      "@/components": path.resolve(__vite_injected_original_dirname, "./src/components"),
      "@/lib": path.resolve(__vite_injected_original_dirname, "./src/lib"),
      "@/hooks": path.resolve(__vite_injected_original_dirname, "./src/hooks"),
      "@/contexts": path.resolve(__vite_injected_original_dirname, "./src/contexts"),
      "@/pages": path.resolve(__vite_injected_original_dirname, "./src/pages"),
      "@/types": path.resolve(__vite_injected_original_dirname, "./src/types"),
      "@/services": path.resolve(__vite_injected_original_dirname, "./src/services")
    }
  },
  server: {
    port: 5174,
    host: true
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvbmFudGhhbi9EZXNrdG9wL1JlY2hhcmdlIGJ5IENsYXVkZS0yMS0wNy0yNS9yZWNoYXJnZXRyYXZlbHMtc3JpLWxhbmthc2hhbGxpLWNyZWF0ZS1pbi1naXRodWIvYWRtaW5cIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9uYW50aGFuL0Rlc2t0b3AvUmVjaGFyZ2UgYnkgQ2xhdWRlLTIxLTA3LTI1L3JlY2hhcmdldHJhdmVscy1zcmktbGFua2FzaGFsbGktY3JlYXRlLWluLWdpdGh1Yi9hZG1pbi92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvbmFudGhhbi9EZXNrdG9wL1JlY2hhcmdlJTIwYnklMjBDbGF1ZGUtMjEtMDctMjUvcmVjaGFyZ2V0cmF2ZWxzLXNyaS1sYW5rYXNoYWxsaS1jcmVhdGUtaW4tZ2l0aHViL2FkbWluL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdC1zd2MnXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJ1xuXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2luczogW3JlYWN0KCldLFxuICByb290OiAnLicsXG4gIGJhc2U6ICcvJyxcbiAgYnVpbGQ6IHtcbiAgICBvdXREaXI6ICdkaXN0JyxcbiAgICBzb3VyY2VtYXA6IGZhbHNlLFxuICAgIG1pbmlmeTogJ3RlcnNlcicsXG4gICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgaW5wdXQ6IHtcbiAgICAgICAgbWFpbjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ2luZGV4Lmh0bWwnKVxuICAgICAgfSxcbiAgICAgIG91dHB1dDoge1xuICAgICAgICBlbnRyeUZpbGVOYW1lczogJ2Fzc2V0cy9bbmFtZV0tW2hhc2hdLmpzJyxcbiAgICAgICAgY2h1bmtGaWxlTmFtZXM6ICdhc3NldHMvW25hbWVdLVtoYXNoXS5qcycsXG4gICAgICAgIGFzc2V0RmlsZU5hbWVzOiAnYXNzZXRzL1tuYW1lXS1baGFzaF0uW2V4dF0nXG4gICAgICB9XG4gICAgfVxuICB9LFxuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IHtcbiAgICAgICdAJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4vc3JjJyksXG4gICAgICAnQC9jb21wb25lbnRzJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4vc3JjL2NvbXBvbmVudHMnKSxcbiAgICAgICdAL2xpYic6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuL3NyYy9saWInKSxcbiAgICAgICdAL2hvb2tzJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4vc3JjL2hvb2tzJyksXG4gICAgICAnQC9jb250ZXh0cyc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuL3NyYy9jb250ZXh0cycpLFxuICAgICAgJ0AvcGFnZXMnOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi9zcmMvcGFnZXMnKSxcbiAgICAgICdAL3R5cGVzJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4vc3JjL3R5cGVzJyksXG4gICAgICAnQC9zZXJ2aWNlcyc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuL3NyYy9zZXJ2aWNlcycpXG4gICAgfVxuICB9LFxuICBzZXJ2ZXI6IHtcbiAgICBwb3J0OiA1MTc0LFxuICAgIGhvc3Q6IHRydWVcbiAgfVxufSkiXSwKICAibWFwcGluZ3MiOiAiO0FBQWlmLFNBQVMsb0JBQW9CO0FBQzlnQixPQUFPLFdBQVc7QUFDbEIsT0FBTyxVQUFVO0FBRmpCLElBQU0sbUNBQW1DO0FBS3pDLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVMsQ0FBQyxNQUFNLENBQUM7QUFBQSxFQUNqQixNQUFNO0FBQUEsRUFDTixNQUFNO0FBQUEsRUFDTixPQUFPO0FBQUEsSUFDTCxRQUFRO0FBQUEsSUFDUixXQUFXO0FBQUEsSUFDWCxRQUFRO0FBQUEsSUFDUixlQUFlO0FBQUEsTUFDYixPQUFPO0FBQUEsUUFDTCxNQUFNLEtBQUssUUFBUSxrQ0FBVyxZQUFZO0FBQUEsTUFDNUM7QUFBQSxNQUNBLFFBQVE7QUFBQSxRQUNOLGdCQUFnQjtBQUFBLFFBQ2hCLGdCQUFnQjtBQUFBLFFBQ2hCLGdCQUFnQjtBQUFBLE1BQ2xCO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLEtBQUssS0FBSyxRQUFRLGtDQUFXLE9BQU87QUFBQSxNQUNwQyxnQkFBZ0IsS0FBSyxRQUFRLGtDQUFXLGtCQUFrQjtBQUFBLE1BQzFELFNBQVMsS0FBSyxRQUFRLGtDQUFXLFdBQVc7QUFBQSxNQUM1QyxXQUFXLEtBQUssUUFBUSxrQ0FBVyxhQUFhO0FBQUEsTUFDaEQsY0FBYyxLQUFLLFFBQVEsa0NBQVcsZ0JBQWdCO0FBQUEsTUFDdEQsV0FBVyxLQUFLLFFBQVEsa0NBQVcsYUFBYTtBQUFBLE1BQ2hELFdBQVcsS0FBSyxRQUFRLGtDQUFXLGFBQWE7QUFBQSxNQUNoRCxjQUFjLEtBQUssUUFBUSxrQ0FBVyxnQkFBZ0I7QUFBQSxJQUN4RDtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFFBQVE7QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLE1BQU07QUFBQSxFQUNSO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
