// Отправка URL сайта в Яндекс и Bing через IndexNow.
// Запуск ПОСЛЕ того, как Vercel задеплоил сайт:
//   npm run indexnow                          — отправить все URL из sitemap
//   npm run indexnow /move/viza/vidy-viz/ ... — отправить только указанные страницы
// Нужен Node 18+.
import fs from 'node:fs';

const HOST = 'priehali.com';
const keyFile = fs.readdirSync('./public').find((f) => /^[0-9a-f]{32}\.txt$/.test(f));
if (!keyFile) throw new Error('Не найден файл ключа IndexNow в public/');
const KEY = keyFile.replace('.txt', '');

const keyCheck = await fetch(`https://${HOST}/${KEY}.txt`);
if (!keyCheck.ok) throw new Error(`Ключ https://${HOST}/${KEY}.txt не открывается (${keyCheck.status}) — сначала задеплой сайт`);

let urls = process.argv.slice(2).map((p) => (p.startsWith('http') ? p : `https://${HOST}${p}`));
if (urls.length === 0) {
  const xml = await (await fetch(`https://${HOST}/sitemap-0.xml`)).text();
  urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}
console.log(`Отправляю ${urls.length} URL…`);

const body = JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList: urls });
for (const endpoint of ['https://yandex.com/indexnow', 'https://api.indexnow.org/indexnow']) {
  const res = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json; charset=utf-8' }, body });
  console.log(`${endpoint} → ${res.status} ${[200, 202].includes(res.status) ? 'OK' : await res.text()}`);
}
