// Рыба-статьи для каждой категории. Сгенерированы из topics.js по шаблонам —
// когда появятся реальные статьи, просто переписывай title/summary у нужной
// записи или добавляй новые объекты в массив (не обязательно ровно 3 на тему).

import topics from './topics.js';

const templates = [
  {
    slug: 'top-10',
    title: (t) => `Топ-10: ${t.title.toLowerCase()}`,
    summary: 'Подборка проверенных вариантов, обновляется',
  },
  {
    slug: 'lichny-opyt',
    title: (t) => `Личный опыт: ${t.title.toLowerCase()}`,
    summary: 'Что видел сам на месте — без пересказа чужих статей',
  },
  {
    slug: 'kak-vybrat',
    title: (t) => `Как выбрать: ${t.title.toLowerCase()}`,
    summary: 'На что смотреть в первую очередь, а на что забить',
  },
];

const articles = topics.flatMap((t) =>
  templates.map((tpl) => ({
    rubric: t.rubric,
    category: t.slug,
    slug: tpl.slug,
    title: tpl.title(t),
    summary: tpl.summary,
    icon: t.icon,
  }))
);

export default articles;
