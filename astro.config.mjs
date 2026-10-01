import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';
import fs from 'node:fs';
import path from 'node:path';

// Читаем фронтматтер статей, чтобы:
// 1) не пускать в sitemap пустые темы (0 опубликованных статей) — поисковики считают их «тонкими» страницами;
// 2) проставить lastmod по checkedDate/date статьи.
const ARTICLES_DIR = './src/content/articles';
const lastmodByPath = {};
const filledTopics = new Set();
for (const file of fs.readdirSync(ARTICLES_DIR).filter((f) => f.endsWith('.md'))) {
  const fm = fs.readFileSync(path.join(ARTICLES_DIR, file), 'utf-8').split('---')[1] || '';
  const get = (k) => (fm.match(new RegExp(`^${k}:\\s*['"]?([^'"\\n]+)['"]?`, 'm')) || [])[1]?.trim();
  const rubric = get('rubric'), category = get('category'), slug = get('slug');
  if (!rubric || !category || !slug) continue;
  const d = get('checkedDate') || get('date');
  if (d && !isNaN(new Date(d))) lastmodByPath[`/${rubric}/${category}/${slug}/`] = d;
  if (get('hidden') !== 'true') filledTopics.add(`/${rubric}/${category}/`);
}
const EXCLUDE = ['/favorites/', '/admin/', '/tourist/svyaz/chto-takoe-esim'];
const TOPIC_RE = /^\/(tourist|move|live)\/[^/]+\/$/;

export default defineConfig({
  site: 'https://priehali.com',
  adapter: vercel(),
  integrations: [
    sitemap({
      filter: (page) => {
        const p = new URL(page).pathname;
        if (EXCLUDE.some((x) => p.startsWith(x))) return false;
        if (TOPIC_RE.test(p) && !filledTopics.has(p)) return false;
        return true;
      },
      serialize: (item) => {
        const d = lastmodByPath[new URL(item.url).pathname];
        if (d) item.lastmod = new Date(d).toISOString();
        return item;
      },
    }),
  ],
});
