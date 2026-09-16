// Единый список тем по рубрикам. Слаги должны совпадать с теми,
// что зашиты в src/pages/index.astro в функции render().
// Добавишь новую карточку на главной — добавь и сюда, чтобы появилась страница.

const topics = [
  // ---------- TUR: Турист ----------
  { rubric: 'tourist', rubricLabel: 'Турист', slug: 'eda', title: 'Где поесть', icon: '🍜', summary: 'Кафе, стритфуд, рестораны' },
  { rubric: 'tourist', rubricLabel: 'Турист', slug: 'plyazhi', title: 'Пляжные клубы', icon: '🏖', summary: 'Где провести день у моря' },
  { rubric: 'tourist', rubricLabel: 'Турист', slug: 'tusovki', title: 'Тусовки', icon: '🎉', summary: 'Бары и вечеринки' },
  { rubric: 'tourist', rubricLabel: 'Турист', slug: 'ekskursii', title: 'Экскурсии', icon: '🗺', summary: 'Острова, водопады, туры' },
  { rubric: 'tourist', rubricLabel: 'Турист', slug: 'spa', title: 'Массажи и спа', icon: '💆', summary: 'Проверенные места' },
  { rubric: 'tourist', rubricLabel: 'Турист', slug: 'bayk', title: 'Аренда байка', icon: '🛵', summary: 'Где брать и как не влететь' },
  { rubric: 'tourist', rubricLabel: 'Турист', slug: 'gde-zhit', title: 'Где остановиться', icon: '🏨', summary: 'Районы и отели' },
  { rubric: 'tourist', rubricLabel: 'Турист', slug: 'ceny', title: 'Цены', icon: '💸', summary: 'Сколько брать с собой и как считать' },

  // ---------- MOV: Переезд ----------
  { rubric: 'move', rubricLabel: 'Переезд', slug: 'viza', title: 'Виза', icon: '🛂', summary: 'Как въехать и продлевать' },
  { rubric: 'move', rubricLabel: 'Переезд', slug: 'zhile', title: 'Жильё надолго', icon: '🏠', summary: 'Районы, цены, договоры' },
  { rubric: 'move', rubricLabel: 'Переезд', slug: 'banki', title: 'Банки и деньги', icon: '🏦', summary: 'Карты и как платить' },
  { rubric: 'move', rubricLabel: 'Переезд', slug: 'internet', title: 'Симка и интернет', icon: '📶', summary: 'Связь с первого дня' },
  { rubric: 'move', rubricLabel: 'Переезд', slug: 'transport', title: 'Транспорт', icon: '🛵', summary: 'Байк, права, аренда' },
  { rubric: 'move', rubricLabel: 'Переезд', slug: 'medicina', title: 'Медицина', icon: '🩺', summary: 'Клиники и страховка' },
  { rubric: 'move', rubricLabel: 'Переезд', slug: 'byudzhet', title: 'Сколько нужно денег', icon: '💸', summary: 'Стартовый бюджет и как считать' },
  { rubric: 'move', rubricLabel: 'Переезд', slug: 'komyuniti', title: 'Комьюнити', icon: '🤝', summary: 'Где найти своих' },
  { rubric: 'move', rubricLabel: 'Переезд', slug: 'shkoly', title: 'Школы и садики', icon: '🎒', summary: 'Куда устроить детей' },
  { rubric: 'move', rubricLabel: 'Переезд', slug: 'pitomec', title: 'Ввоз питомца', icon: '🐾', summary: 'Документы и жильё' },
  { rubric: 'move', rubricLabel: 'Переезд', slug: 'zhile-dvoih', title: 'Жильё для двоих', icon: '👫', summary: 'Совместный бюджет' },
  { rubric: 'move', rubricLabel: 'Переезд', slug: 'kolivingi', title: 'Коливинги', icon: '🧳', summary: 'Как не заскучать и найти своих' },

  // ---------- LIV: Живу тут ----------
  { rubric: 'live', rubricLabel: 'Живу тут', slug: 'komyuniti-tut', title: 'Комьюнити', icon: '🤝', summary: 'Встречи, чаты, движухи для своих' },
  { rubric: 'live', rubricLabel: 'Живу тут', slug: 'prodlenie-vizy', title: 'Продление визы', icon: '🛂', summary: 'Что менять и когда' },
  { rubric: 'live', rubricLabel: 'Живу тут', slug: 'mestnye-ceny', title: 'Жизнь как местному', icon: '💰', summary: 'Где дешевле, без туристической наценки' },
  { rubric: 'live', rubricLabel: 'Живу тут', slug: 'networking', title: 'Нетворкинг', icon: '🧑‍🤝‍🧑', summary: 'Где искать связи и знакомства' },
  { rubric: 'live', rubricLabel: 'Живу тут', slug: 'arenda-god', title: 'Аренда на год+', icon: '🏠', summary: 'Долгосрочные условия и договоры' },
  { rubric: 'live', rubricLabel: 'Живу тут', slug: 'svoy-vrach', title: 'Свой врач', icon: '🩺', summary: 'Проверенные клиники для долгой жизни' },
];

export default topics;
