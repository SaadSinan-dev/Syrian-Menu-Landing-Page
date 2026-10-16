import { useEffect, useId, useRef, useState } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Flower2,
  Search,
  UtensilsCrossed,
  X,
} from 'lucide-react'
import {
  categories,
  dishes,
  dishPrice,
  filterDishes,
  formatPrice,
  type Dish,
  type Size,
} from '../data/menu'
import './menu.css'
import { usePreferences } from '../preferences/context'
import { useCopy } from '../i18n/useCopy'
import { formatMessage } from '../i18n/messages'

export function MenuExperience({ preview = false }: { preview?: boolean }) {
  const { language, setLanguage } = usePreferences()
  const [category, setCategory] = useState('all')
  const [query, setQuery] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const [selected, setSelected] = useState<Dish | null>(null)
  const [size, setSize] = useState<Size>('regular')
  const [featuredIndex, setFeaturedIndex] = useState(0)
  const root = useRef<HTMLDivElement>(null)
  const scroll = useRef<HTMLDivElement>(null)
  const detailTitle = useRef<HTMLHeadingElement>(null)
  const searchInput = useRef<HTMLInputElement>(null)
  const lastTrigger = useRef<string | null>(null)
  const savedScroll = useRef(0)
  const searchToggle = useRef<HTMLButtonElement>(null)
  const inputId = useId()
  const { menu: text, common } = useCopy()
  const BackArrow = language === 'ar' ? ArrowRight : ArrowLeft
  const PreviousArrow = language === 'ar' ? ChevronRight : ChevronLeft
  const NextArrow = language === 'ar' ? ChevronLeft : ChevronRight
  const items = filterDishes(category, query)
  const featuredDishes = [dishes[0], dishes[1], dishes[2]]
  const featured = featuredDishes[featuredIndex]

  useEffect(() => {
    if (scroll.current) scroll.current.scrollTop = selected ? 0 : savedScroll.current
    if (selected) detailTitle.current?.focus({ preventScroll: true })
    else if (lastTrigger.current)
      root.current
        ?.querySelector<HTMLButtonElement>(`[data-focus-key="${lastTrigger.current}"]`)
        ?.focus({ preventScroll: true })
  }, [selected])

  useEffect(() => {
    if (searchOpen && !selected) searchInput.current?.focus({ preventScroll: true })
  }, [searchOpen, selected])

  function openDish(dish: Dish, trigger: HTMLElement) {
    savedScroll.current = scroll.current?.scrollTop ?? 0
    lastTrigger.current = trigger.dataset.focusKey ?? null
    setSize('regular')
    setSelected(dish)
  }

  function closeSearch() {
    setQuery('')
    setSearchOpen(false)
    searchToggle.current?.focus()
  }

  return (
    <div
      ref={root}
      className="menu-experience"
      data-testid={preview ? 'preview-menu' : 'demo-menu'}
      lang={language}
      dir={language === 'ar' ? 'rtl' : 'ltr'}
      onKeyDown={(event) => {
        if (event.key !== 'Escape') return
        if (selected) setSelected(null)
        else if (searchOpen) closeSearch()
      }}
    >
      <header className="menu-masthead">
        <div className="menu-platform">
          <img src="/brand/symbol.png" alt="" width="31" height="35" />
          <span dir="ltr">SYRIAN MENU</span>
        </div>
        <div className="menu-tools">
          <button
            ref={searchToggle}
            className="menu-round"
            aria-label={text.search}
            aria-expanded={searchOpen}
            onClick={() => {
              setSelected(null)
              if (searchOpen) closeSearch()
              else setSearchOpen(true)
            }}
          >
            <Search size={17} aria-hidden="true" />
          </button>
          <button
            className="menu-round menu-language"
            aria-label={common.switchLanguage}
            onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
          >
            {common.languageName}
          </button>
        </div>
      </header>
      <div className="menu-scroll" ref={scroll}>
        {selected ? (
          <article className="dish-detail">
            <button className="menu-back" onClick={() => setSelected(null)}>
              <BackArrow size={17} aria-hidden="true" />
              {text.back}
            </button>
            <img
              className="dish-detail-image"
              src={selected.image}
              alt={selected.name[language]}
              width="600"
              height="450"
            />
            <div className="dish-detail-heading">
              <span className="menu-eyebrow">
                {text.restaurant} ·{' '}
                {categories.find((item) => item.id === selected.category)?.name[language]}
              </span>
              <h2 ref={detailTitle} tabIndex={-1}>
                {selected.name[language]}
              </h2>
              <bdi data-testid="dish-price" className="detail-price">
                {formatPrice(dishPrice(selected, size), language)}
              </bdi>
            </div>
            {selected.sizes && (
              <fieldset className="dish-sizes">
                <legend>{text.size}</legend>
                <div>
                  {(['small', 'regular', 'large'] as Size[]).map((option) => (
                    <label key={option} className={size === option ? 'selected' : ''}>
                      <input
                        type="radio"
                        name={`${inputId}-size`}
                        value={option}
                        checked={size === option}
                        onChange={() => setSize(option)}
                      />
                      <span>
                        {size === option && <Check size={13} aria-hidden="true" />}
                        {text[option]}
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>
            )}
            <section className="dish-detail-section">
              <h3>{text.description}</h3>
              <p>{selected.description[language]}</p>
            </section>
            <section className="dish-detail-section">
              <h3>{text.ingredients}</h3>
              <ul className="ingredient-list">
                {selected.ingredients.map((ingredient) => (
                  <li key={ingredient.en}>{ingredient[language]}</li>
                ))}
              </ul>
            </section>
            {selected.note && (
              <p className="dish-note">
                <strong>{text.note}</strong>
                {selected.note[language]}
              </p>
            )}
          </article>
        ) : (
          <>
            <div className="restaurant-intro">
              <div>
                <h2>{text.restaurant}</h2>
                <p>{text.tagline}</p>
              </div>
              <Flower2
                className="restaurant-flower"
                size={30}
                strokeWidth={1.3}
                aria-hidden="true"
              />
            </div>
            {searchOpen && (
              <div className="menu-search">
                <label htmlFor={inputId}>{text.searchLabel}</label>
                <div>
                  <Search size={17} aria-hidden="true" />
                  <input
                    ref={searchInput}
                    id={inputId}
                    type="search"
                    placeholder={text.placeholder}
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                  />
                  <button aria-label={text.close} onClick={closeSearch}>
                    <X size={16} aria-hidden="true" />
                  </button>
                </div>
              </div>
            )}
            <section className="menu-spotlight" aria-label={text.featured}>
              <button
                className="spotlight-main"
                key={featured.id}
                data-focus-key={`featured-${featured.id}`}
                onClick={(event) => openDish(featured, event.currentTarget)}
                aria-label={`${text.featured}: ${featured.name[language]} — ${text.details}`}
              >
                <img
                  src={featured.image}
                  srcSet={`${featured.image.replace('.webp', '-small.webp')} 480w, ${featured.image} 960w`}
                  sizes={preview ? '270px' : '360px'}
                  alt=""
                  width="600"
                  height="420"
                  fetchPriority={preview ? 'high' : 'auto'}
                />
                <span className="spotlight-overlay">
                  <span className="spotlight-kicker">{text.featured}</span>
                  <h3>{featured.name[language]}</h3>
                  <span className="spotlight-bottom">
                    <span>{text.details}</span>
                    <bdi>{formatPrice(featured.price, language)}</bdi>
                  </span>
                </span>
              </button>
              <div className="spotlight-controls">
                <button
                  onClick={() => setFeaturedIndex((featuredIndex + 2) % 3)}
                  aria-label={text.previous}
                >
                  <PreviousArrow size={15} aria-hidden="true" />
                </button>
                <div>
                  {featuredDishes.map((dish, index) => (
                    <button
                      key={dish.id}
                      aria-label={formatMessage(text.show, { dish: dish.name[language] })}
                      aria-pressed={index === featuredIndex}
                      onClick={() => setFeaturedIndex(index)}
                    >
                      <span />
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setFeaturedIndex((featuredIndex + 1) % 3)}
                  aria-label={text.next}
                >
                  <NextArrow size={15} aria-hidden="true" />
                </button>
              </div>
            </section>
            <nav className="menu-categories" aria-label={text.categories}>
              {categories.map((item) => (
                <button
                  key={item.id}
                  aria-pressed={category === item.id}
                  onClick={() => setCategory(item.id)}
                >
                  {item.name[language]}
                </button>
              ))}
            </nav>
            <div className="menu-results-heading">
              <h3>
                {category === 'all'
                  ? text.all
                  : categories.find((item) => item.id === category)?.name[language]}
              </h3>
              <span role="status" aria-live="polite">
                {new Intl.NumberFormat(language === 'ar' ? 'ar-u-nu-arab' : 'en').format(
                  items.length,
                )}{' '}
                {text.items}
              </span>
            </div>
            {items.length ? (
              <ul className="dish-grid" key={category}>
                {items.map((dish, index) => (
                  <li
                    key={dish.id}
                    className="dish-card"
                    style={{ animationDelay: Math.min(index, 5) * 32 + 'ms' }}
                  >
                    <button
                      data-focus-key={`dish-${dish.id}`}
                      onClick={(event) => openDish(dish, event.currentTarget)}
                      aria-label={`${dish.name[language]} — ${text.details}`}
                    >
                      <img
                        src={dish.image.replace('.webp', '-small.webp')}
                        alt={dish.name[language]}
                        width="340"
                        height="230"
                        loading="lazy"
                      />
                      <span className="dish-card-copy">
                        <h3>{dish.name[language]}</h3>
                        <p>{dish.description[language]}</p>
                        <bdi>{formatPrice(dish.price, language)}</bdi>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="menu-empty">
                <UtensilsCrossed size={28} aria-hidden="true" />
                <h3>{text.noResults}</h3>
                <p>{text.noResultsHelp}</p>
                <button
                  onClick={() => {
                    setQuery('')
                    setCategory('all')
                  }}
                >
                  {text.reset}
                </button>
              </div>
            )}
            <div className="menu-sample-note">
              {text.demo} · {text.sampleNote}
            </div>
          </>
        )}
        <footer className="menu-footer">
          <span>{text.powered}</span>
          <strong dir="ltr">SYRIAN MENU</strong>
        </footer>
      </div>
    </div>
  )
}
