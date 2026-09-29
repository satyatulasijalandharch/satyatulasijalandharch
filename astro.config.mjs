// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  trailingSlash: 'never',
  integrations: [react(), sitemap()],
  site: "https://stjch.in",
  session: false,
  prefetch: {
    prefetchAll: true
  },
  vite: {
    plugins: [tailwindcss()]
  },
  fonts: [{
    provider: fontProviders.fontsource(),
    name: "Inter",
    cssVariable: "--font-sans"
  }],
  adapter: cloudflare()
});