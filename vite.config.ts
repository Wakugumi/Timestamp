import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import wasm from "@rollup/plugin-wasm";
import topLevelAwait from "vite-plugin-top-level-await";
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), wasm(), topLevelAwait()],
  build: {
    target: "esnext", // Required for WebAssembly support in modern browsers
    assetsInlineLimit: 0, // Ensure `.wasm` files are not inlined
  },
  mode: "development",
  resolve: {},
  server: {
    headers: {
      //      "Cross-Origin-Opener-Policy": "same-origin",
      //    "Cross-Origin-Embedder-Policy": "require-corp",
    },
  },
  optimizeDeps: {
    exclude: ["web-gphoto2"],
  },
});
