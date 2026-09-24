import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';
import decapCmsOauth from 'astro-decap-cms-oauth';

export default defineConfig({
  site: 'https://priehali.com',
  adapter: vercel(),
  integrations: [sitemap(), decapCmsOauth()],
});
