// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import markdoc from '@astrojs/markdoc';
import keystatic from '@keystatic/astro';
import tailwindcss from '@tailwindcss/vite';

const isDev = process.argv.includes('dev');

// https://astro.build/config
export default defineConfig({
  trailingSlash: 'never',
  redirects: {
    '/sitemap.xml': '/sitemap-index.xml',
  },
  integrations: [
    react(),
    sitemap(),
    markdoc(),
    ...(isDev ? [keystatic()] : []),
  ],
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
  }]
});