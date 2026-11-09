import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { localAuthPlugin } from "./server/local-auth.ts";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), localAuthPlugin()],
  base: "/Repleca/",
  server: {
    fs: {
      deny: [
        ".env",
        ".env.*",
        "*.{crt,pem}",
        "**/.git/**",
        "**/.repleca/**",
        "**/server/**",
        "**/migrations/**",
      ],
    },
  },
});
