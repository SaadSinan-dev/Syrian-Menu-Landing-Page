import type { CSSProperties, ReactNode } from 'react'
import type { menuViewCopy } from './copy'
export type Language = 'ar' | 'en'
export type Localized = Record<Language, string>
export type Size = 'small' | 'regular' | 'large'
export interface Dish {
  id: string
  name: Localized
  category: string
  description: Localized
  ingredients?: Localized[]
  image: string | null
  thumbnail?: string
  srcSet?: string
  price: number | string
  sizes?: Record<Size, number>
  note?: Localized
  available?: boolean
  dietary?: string[]
  allergens?: string
}
export interface MenuViewProps {
  style?: CSSProperties
  preview?: boolean
  language: Language
  setLanguage: (language: Language) => void
  mode?: 'light' | 'dark'
  restaurantName: string
  tagline?: string
  logoUrl?: string | null
  coverUrl?: string | null
  symbolUrl?: string
  currency?: string
  categories: { id: string; name: Localized }[]
  dishes: Dish[]
  featuredIds?: string[]
  text: typeof menuViewCopy.en
  tools?: ReactNode
  contact?: ReactNode
  sampleNote?: string
  selectedId?: string | null
  onSelect?: (id: string) => void
  onBack?: () => void
  showDescription?: boolean
  showBadges?: boolean
  showFeatured?: boolean
  allowLanguageSwitch?: boolean
  title?: string
  primaryHeading?: 'h1' | 'h2'
  getDishHref?: (id: string) => string
  backHref?: string
  headerLeading?: ReactNode
  navigationTitle?: string
  showSearchToggle?: boolean
  languageInFooter?: boolean
}
export function localized(value: Localized | undefined, language: Language) {
  return value?.[language] || value?.en || value?.ar || ''
}
export const normalizeSearch = (text: string) =>
  text
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[\u064b-\u065f\u0670\u0640]/g, '')
    .replace(/[أإآ]/g, 'ا')
    .trim()
export function filterDishes(dishes: Dish[], category: string, query: string) {
  const needle = normalizeSearch(query)
  return dishes.filter(
    (dish) =>
      (category === 'all' || dish.category === category) &&
      normalizeSearch(
        `${dish.name.ar} ${dish.name.en} ${dish.description.ar} ${dish.description.en}`,
      ).includes(needle),
  )
}
export function dishPrice(dish: Dish, size: Size) {
  return dish.sizes?.[size] ?? dish.price
}
export function formatPrice(price: string | number, language: Language, currency = 'USD') {
  const amount = Number(price)
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    currencyDisplay: 'narrowSymbol',
    numberingSystem: language === 'ar' ? 'arab' : 'latn',
    minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amount)
}
