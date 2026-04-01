import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://estebanluiz.fr',
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()]
  },
  image: {
    domains: [],
  },
  build: {
    inlineStylesheets: 'auto'
  }
});
