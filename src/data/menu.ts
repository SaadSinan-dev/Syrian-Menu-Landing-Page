export type Language = 'ar' | 'en'
export type Localized = Record<Language, string>
export type Size = 'small' | 'regular' | 'large'
export interface Dish {
  id: string
  name: Localized
  category: string
  description: Localized
  ingredients: Localized[]
  image: string
  price: number
  sizes?: Record<Size, number>
  note?: Localized
}

export const categories = [
  { id: 'all', name: { ar: 'الكل', en: 'All dishes' } },
  { id: 'mains', name: { ar: 'وجبات', en: 'Mains' } },
  { id: 'starters', name: { ar: 'مقبلات', en: 'Starters' } },
  { id: 'drinks', name: { ar: 'مشروبات', en: 'Drinks' } },
  { id: 'desserts', name: { ar: 'حلويات', en: 'Desserts' } },
]

export const dishes: Dish[] = [
  {
    id: 'aleppo-kebab',
    category: 'mains',
    name: { ar: 'كباب حلبي', en: 'Aleppo kebab' },
    description: {
      ar: 'كباب حلبي مشوي على الفحم، محضّر بتتبيلة شامية متوازنة ويُقدّم مع البصل المشوي وخبز التنور.',
      en: 'Charcoal-grilled kebab with warm Aleppine spices, served with grilled onions and freshly baked flatbread.',
    },
    ingredients: [
      { ar: 'لحم بقري', en: 'Beef' },
      { ar: 'بصل', en: 'Onion' },
      { ar: 'بقدونس', en: 'Parsley' },
      { ar: 'فلفل أسود', en: 'Black pepper' },
      { ar: 'بهارات شامية', en: 'Levantine spices' },
      { ar: 'خبز تنور', en: 'Flatbread' },
    ],
    image: '/images/grill.webp',
    price: 38,
    sizes: { small: 28, regular: 38, large: 48 },
    note: {
      ar: 'يحتوي على الغلوتين (الخبز المرافق).',
      en: 'Contains gluten (accompanying flatbread).',
    },
  },
  {
    id: 'fattoush',
    category: 'starters',
    name: { ar: 'فتوش شامي', en: 'Levantine fattoush' },
    description: {
      ar: 'خضار موسمية طازجة، خبز مقرمش، سماق وزيت زيتون مع دبس الرمان.',
      en: 'Crisp seasonal vegetables, toasted flatbread, sumac and olive oil, finished with pomegranate molasses.',
    },
    ingredients: [
      { ar: 'خس وخيار', en: 'Lettuce and cucumber' },
      { ar: 'طماطم', en: 'Tomato' },
      { ar: 'خبز مقرمش', en: 'Toasted flatbread' },
      { ar: 'سماق', en: 'Sumac' },
    ],
    image: '/images/fattoush.webp',
    price: 18,
    note: { ar: 'نباتي. يحتوي على الغلوتين.', en: 'Vegan. Contains gluten.' },
  },
  {
    id: 'chicken',
    category: 'mains',
    name: { ar: 'شيش طاووق', en: 'Shish tawook' },
    description: {
      ar: 'قطع دجاج متبّلة باللبن والليمون والثوم، مشوية وتُقدّم مع صلصة الثوم.',
      en: 'Tender chicken marinated in yogurt, lemon and garlic, grilled and served with a silky garlic sauce.',
    },
    ingredients: [
      { ar: 'دجاج', en: 'Chicken' },
      { ar: 'لبن', en: 'Yogurt' },
      { ar: 'ليمون', en: 'Lemon' },
      { ar: 'ثوم', en: 'Garlic' },
    ],
    image: '/images/chicken.webp',
    price: 28,
    sizes: { small: 22, regular: 28, large: 36 },
    note: { ar: 'يحتوي على الحليب.', en: 'Contains milk.' },
  },
  {
    id: 'hummus',
    category: 'starters',
    name: { ar: 'حمص بالطحينة', en: 'Hummus & tahini' },
    description: {
      ar: 'حمص ناعم مع طحينة وليمون، يُقدّم مع زيت الزيتون وخبز طازج.',
      en: 'Creamy chickpeas blended with tahini and lemon, topped with olive oil and served with warm bread.',
    },
    ingredients: [
      { ar: 'حمص', en: 'Chickpeas' },
      { ar: 'طحينة', en: 'Tahini' },
      { ar: 'ليمون', en: 'Lemon' },
      { ar: 'زيت زيتون', en: 'Olive oil' },
    ],
    image: '/images/hummus.webp',
    price: 12,
    note: { ar: 'نباتي. يحتوي على السمسم والغلوتين.', en: 'Vegan. Contains sesame and gluten.' },
  },
  {
    id: 'coffee',
    category: 'drinks',
    name: { ar: 'قهوة عربية', en: 'Arabic coffee' },
    description: {
      ar: 'قهوة عربية عطرية مع لمسة من الهيل، تُقدّم على الطريقة الشامية.',
      en: 'Rich, aromatic coffee with a touch of cardamom, served the Levantine way.',
    },
    ingredients: [
      { ar: 'قهوة', en: 'Coffee' },
      { ar: 'هيل', en: 'Cardamom' },
    ],
    image: '/images/coffee.webp',
    price: 6,
  },
  {
    id: 'baklava',
    category: 'desserts',
    name: { ar: 'بقلاوة بالفستق', en: 'Pistachio baklava' },
    description: {
      ar: 'طبقات رقيقة ومقرمشة من العجين، محشوّة بالفستق الحلبي ومزيّنة بقطر خفيف.',
      en: 'Delicate, golden layers of pastry filled with pistachios and finished with a light fragrant syrup.',
    },
    ingredients: [
      { ar: 'فستق حلبي', en: 'Pistachios' },
      { ar: 'عجين فيلو', en: 'Filo pastry' },
      { ar: 'سمن', en: 'Ghee' },
      { ar: 'قطر', en: 'Syrup' },
    ],
    image: '/images/dessert.webp',
    price: 14,
    note: { ar: 'يحتوي على المكسرات والحليب والغلوتين.', en: 'Contains nuts, milk and gluten.' },
  },
]

const normalize = (text: string) =>
  text
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[\u064b-\u065f\u0670\u0640]/g, '')
    .replace(/[أإآ]/g, 'ا')
    .trim()

export function filterDishes(category: string, query: string): Dish[] {
  const needle = normalize(query)
  return dishes.filter(
    (dish) =>
      (category === 'all' || dish.category === category) &&
      normalize(
        `${dish.name.ar} ${dish.name.en} ${dish.description.ar} ${dish.description.en}`,
      ).includes(needle),
  )
}

export function dishPrice(dish: Dish, size: Size): number {
  return dish.sizes?.[size] ?? dish.price
}

export function formatPrice(price: number, language: Language) {
  // Keep the USD symbol consistent with the product references while shaping
  // the numerals for the selected menu language.
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    currencyDisplay: 'narrowSymbol',
    numberingSystem: language === 'ar' ? 'arab' : 'latn',
    maximumFractionDigits: 0,
  }).format(price)
}
