// Единый список тем по рубрикам. Слаги должны совпадать с теми,
// что зашиты в src/pages/index.astro в функции render().
// Добавишь новую карточку на главной — добавь и сюда, чтобы появилась страница.

const topics = [
  // ---------- TUR: Турист ----------
  { rubric: 'tourist', rubricLabel: 'Турист', slug: 'eda', title: 'Где поесть', icon: '🍜', summary: 'Кафе, стритфуд, рестораны' },
  { rubric: 'tourist', rubricLabel: 'Турист', slug: 'kofe', title: 'Кофе с видом', icon: '☕', summary: 'Атмосферные кофейни, куда идут не ради еды' },
  { rubric: 'tourist', rubricLabel: 'Турист', slug: 'plyazhi', title: 'Пляжные клубы', icon: '🏖', summary: 'Где провести день у моря' },
  { rubric: 'tourist', rubricLabel: 'Турист', slug: 'tusovki', title: 'Тусовки', icon: '🎉', summary: 'Бары и вечеринки' },
  { rubric: 'tourist', rubricLabel: 'Турист', slug: 'ekskursii', title: 'Экскурсии', icon: '🗺', summary: 'Острова, водопады, туры' },
  { rubric: 'tourist', rubricLabel: 'Турист', slug: 'spa', title: 'Массажи и спа', icon: '💆', summary: 'Проверенные места' },
  { rubric: 'tourist', rubricLabel: 'Турист', slug: 'bayk', title: 'Аренда байка', icon: '🛵', summary: 'Где брать и как не влететь' },
  { rubric: 'tourist', rubricLabel: 'Турист', slug: 'gde-zhit', title: 'Где остановиться', icon: '🏨', summary: 'Районы и отели' },
  { rubric: 'tourist', rubricLabel: 'Турист', slug: 'ceny', title: 'Цены', icon: '💸', summary: 'Сколько брать с собой и как считать' },
  { rubric: 'tourist', rubricLabel: 'Турист', slug: 'svyaz', title: 'Связь', icon: '📶', summary: 'eSIM, симка и интернет для туриста' },
  { rubric: 'tourist', rubricLabel: 'Турист', slug: 'shopping', title: 'Подарки и шоппинг', icon: '🎁', summary: 'Что привезти домой и где купить' },

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
  { rubric: 'live', rubricLabel: 'Живу тут', slug: 'barbershopy', title: 'Барбершопы', icon: '💈', summary: 'Проверенные мастера для мужской стрижки' },
  { rubric: 'live', rubricLabel: 'Живу тут', slug: 'zhenskaya-byuti', title: 'Женская бьюти', icon: '💅', summary: 'Маникюр, ресницы, волосы, косметология' },
  { rubric: 'live', rubricLabel: 'Живу тут', slug: 'sport-i-dosug', title: 'Спорт и досуг', icon: '🏋️', summary: 'Залы, йога, сёрф, паделл — для своих' },
  { rubric: 'live', rubricLabel: 'Живу тут', slug: 'mastera', title: 'Мастера на все руки', icon: '🔧', summary: 'Электрик, сантехник, мелкий ремонт' },
  { rubric: 'live', rubricLabel: 'Живу тут', slug: 'bayk-servis', title: 'Байк-сервис', icon: '🛠', summary: 'Где чинят байк, а не разводят на ровном месте' },
  { rubric: 'live', rubricLabel: 'Живу тут', slug: 'klining', title: 'Клининг', icon: '🧹', summary: 'Уборка квартир на разовой и постоянной основе' },
  { rubric: 'live', rubricLabel: 'Живу тут', slug: 'stomatologi', title: 'Стоматологи', icon: '🦷', summary: 'Проверенные клиники и врачи' },
  { rubric: 'live', rubricLabel: 'Живу тут', slug: 'yuristy-buhgaltery', title: 'Юристы и бухгалтеры', icon: '⚖️', summary: 'Визы, регистрация бизнеса, налоги' },
  { rubric: 'live', rubricLabel: 'Живу тут', slug: 'psihologi', title: 'Психологи', icon: '🧠', summary: 'Поддержка и адаптация на русском и английском' },
  { rubric: 'live', rubricLabel: 'Живу тут', slug: 'nyani-i-sady', title: 'Няни и детские сады', icon: '🧸', summary: 'Куда пристроить ребёнка и кому доверить' },
  { rubric: 'live', rubricLabel: 'Живу тут', slug: 'repetitory-i-yazyki', title: 'Репетиторы и языки', icon: '📚', summary: 'Английский, вьетнамский, школьные предметы' },
  { rubric: 'live', rubricLabel: 'Живу тут', slug: 'fotografy-i-videografy', title: 'Фотографы и видеографы', icon: '📷', summary: 'Съёмка для себя, семьи или бизнеса' },
];

export default topics;
