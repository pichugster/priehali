import * as yaml from 'js-yaml';
import fs from 'fs';
import path from 'path';
import articles from '../src/data/articles.js';

const outDir = path.resolve('src/content/articles');
fs.mkdirSync(outDir, { recursive: true });

let count = 0;
const seenSlugs = new Set();

for (const article of articles) {
  const { body, slug, ...frontmatter } = article;

  // на сайте slug уникален внутри category, но не глобально —
  // для имени файла делаем составной ключ category-slug, чтобы не было коллизий
  const fileKey = `${frontmatter.category}__${slug}`;
  if (seenSlugs.has(fileKey)) {
    console.warn('ДУБЛИКАТ, пропущен:', fileKey);
    continue;
  }
  seenSlugs.add(fileKey);

  // slug остаётся полем, а не именем файла — имя файла составное для уникальности
  const fm = { slug, ...frontmatter };

  const frontmatterYaml = yaml.dump(fm, { lineWidth: -1, noRefs: true });
  const fileContent = `---\n${frontmatterYaml}---\n\n${body || ''}\n`;

  const filePath = path.join(outDir, `${fileKey}.md`);
  fs.writeFileSync(filePath, fileContent, 'utf-8');
  count++;
}

console.log('Мигрировано статей:', count);
