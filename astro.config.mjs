import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel/serverless';

export default defineConfig({
  site: 'https://priehali.com',
  output: 'hybrid', // всё остаётся статикой (быстро, дёшево), кроме страниц с prerender=false
  adapter: vercel(),
});
