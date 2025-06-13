import { defineConfig } from "vite";

export default defineConfig({
  base: "./",
  build: {
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
      },
    },
    rollupOptions: {
      input: {
        main: "./index.html",
        obrigado: "./obrigado.html",
        v2: "./v2.html",
      },
    },
  },
});
