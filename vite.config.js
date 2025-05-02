import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import rollupNodePolyFill from "rollup-plugin-polyfill-node";

export default defineConfig({
  plugins: [react()],
  define: {
    global: "globalThis", // ✅ Polyfill `global` for SockJS compatibility
  },
  optimizeDeps: {
    include: ["react-bootstrap", "sockjs-client"], // ✅ Ensure SockJS is pre-bundled
  },
  build: {
    rollupOptions: {
      plugins: [rollupNodePolyFill()], // ✅ Add Node polyfills for browser env
    },
  },
});
