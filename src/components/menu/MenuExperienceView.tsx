import { useEffect, useLayoutEffect, useId, useRef, useState } from 'react'
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
  filterDishes,
  dishPrice,
  formatPrice,
  localized,
  type Dish,
  type Size,
  type MenuViewProps,
} from './model'
import { MenuPhoto } from './MenuPhoto'
import './menu.css'
import './identity.css'

export function MenuExperienceView({
  preview = false,
  mode = 'light',
  language,
  setLanguage,
  dishes,
  categories,
  restaurantName,
  tagline,
  symbolUrl = '/brand/symbol.png',
  logoUrl,
  coverUrl,
  text,
  currency = 'USD',
  featuredIds,
  tools,
  contact,
  sampleNote,
  selectedId,
  onSelect,
  onBack,
  showDescription = true,
  showBadges = true,
  showFeatured = true,
  allowLanguageSwitch = true,
  title,
  style,
  primaryHeading: Heading = 'h2',
  getDishHref,
  backHref,
  headerLeading,
  navigationTitle,
  showSearchToggle = true,
  languageInFooter = false,
}: MenuViewProps) {
  const DishControl = getDishHref ? 'a' : 'button'
  const BackControl = backHref ? 'a' : 'button'
  const [localSelectedId, setLocalSelectedId] = useState<string | null>(null)
  const activeId = selectedId === undefined ? localSelectedId : selectedId
  const selected = dishes.find((dish) => dish.id === activeId) ?? null
  function setSelected(dish: Dish | null) {
    if (dish && onSelect) onSelect(dish.id)
    else if (!dish && onBack && activeId) onBack()
    else setLocalSelectedId(dish?.id ?? null)
  }
  const [requestedCategory, setCategory] = useState('all')
  const category = categories.some((item) => item.id === requestedCategory)
    ? requestedCategory
    : 'all'
  const [query, setQuery] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
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
  const BackArrow = language === 'ar' ? ArrowRight : ArrowLeft
  const PreviousArrow = language === 'ar' ? ChevronRight : ChevronLeft
  const NextArrow = language === 'ar' ? ChevronLeft : ChevronRight
  const items = filterDishes(dishes, category, query)
  const featuredDishes = featuredIds
    ? featuredIds
        .map((id) => dishes.find((dish) => dish.id === id))
        .filter((dish): dish is Dish => Boolean(dish))
    : dishes.filter((dish) => dish.available !== false).slice(0, 3)
  const featured = featuredDishes[featuredIndex % (featuredDishes.length || 1)]

  useLayoutEffect(() => {
    if (scroll.current) scroll.current.scrollTop = activeId ? 0 : savedScroll.current
    if (activeId) detailTitle.current?.focus({ preventScroll: true })
    else if (lastTrigger.current)
      Array.from(root.current?.querySelectorAll<HTMLButtonElement>('[data-focus-key]') ?? [])
        .find((button) => button.dataset.focusKey === lastTrigger.current)
        ?.focus({ preventScroll: true })
  }, [activeId])

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
      data-mode={mode}
      style={style}
      data-testid={preview ? 'preview-menu' : 'demo-menu'}
      aria-label={title}
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
          {headerLeading}
          <img src={symbolUrl} alt="" width="31" height="35" />
          <span dir="ltr">SYRIAN MENU</span>
          {navigationTitle && (
            <span className="menu-navigation-title" dir="auto">
              {navigationTitle}
            </span>
          )}
        </div>
        <div className="menu-tools">
          {tools}
          {showSearchToggle && (
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
          )}
          {allowLanguageSwitch && !languageInFooter && (
            <button
              className="menu-round menu-language"
              aria-label={text.switchLanguage}
              onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
            >
              {text.languageName}
            </button>
          )}
        </div>
      </header>
      <div className="menu-scroll" ref={scroll}>
        {activeId && !selected ? (
          <article className="menu-empty">
            <Heading ref={detailTitle} tabIndex={-1}>
              {text.missing}
            </Heading>
            <p>{text.missingHelp}</p>
            <button onClick={() => setSelected(null)}>{text.back}</button>
          </article>
        ) : selected ? (
          <article className="dish-detail">
            <BackControl
              className="menu-back"
              href={backHref}
              onClick={(event) => {
                if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
                event.preventDefault()
                setSelected(null)
              }}
            >
              <BackArrow size={17} aria-hidden="true" />
              {text.back}
            </BackControl>
            <MenuPhoto
              fallbackLabel={`${text.noPhoto} ${localized(selected.name, language)}`}
              className="dish-detail-image"
              src={selected.image}
              alt={localized(selected.name, language)}
              width="600"
              height="450"
            />
            <div className="dish-detail-heading">
              <span className="menu-eyebrow">
                {restaurantName} ·{' '}
                {localized(
                  categories.find((item) => item.id === selected.category)?.name,
                  language,
                )}
              </span>
              <Heading ref={detailTitle} tabIndex={-1}>
                {localized(selected.name, language)}
              </Heading>
              <bdi data-testid="dish-price" className="detail-price">
                {formatPrice(dishPrice(selected, size), language, currency)}
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
            {selected.available === false && (
              <p className="dish-note" role="status">
                {text.soldOut}
              </p>
            )}
            {showDescription && localized(selected.description, language) && (
              <section className="dish-detail-section">
                <h3>{text.description}</h3>
                <p dir="auto">{localized(selected.description, language)}</p>
              </section>
            )}
            {Boolean(selected.ingredients?.length) && (
              <section className="dish-detail-section">
                <h3>{text.ingredients}</h3>
                <ul className="ingredient-list">
                  {selected.ingredients!.map((ingredient) => (
                    <li key={ingredient.en}>{ingredient[language]}</li>
                  ))}
                </ul>
              </section>
            )}
            {Boolean(selected.dietary?.length) && (
              <section className="dish-detail-section">
                <h3>{text.note}</h3>
                <ul className="ingredient-list">
                  {selected.dietary!.map((label) => (
                    <li key={label}>{label}</li>
                  ))}
                </ul>
              </section>
            )}
            {selected.allergens && (
              <p className="dish-note" dir="auto">
                <strong>{text.allergens}</strong>
                {selected.allergens}
              </p>
            )}
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
                <Heading>{restaurantName}</Heading>
                {tagline && <p dir="auto">{tagline}</p>}
              </div>
              {logoUrl ? (
                <MenuPhoto
                  className="restaurant-logo"
                  src={logoUrl}
                  alt={restaurantName}
                  fallbackLabel={restaurantName}
                  width="40"
                  height="40"
                />
              ) : (
                <Flower2
                  className="restaurant-flower"
                  size={30}
                  strokeWidth={1.3}
                  aria-hidden="true"
                />
              )}
            </div>
            {coverUrl && (
              <MenuPhoto
                className="restaurant-cover"
                src={coverUrl}
                alt={restaurantName}
                fallbackLabel={restaurantName}
                width="600"
                height="300"
              />
            )}
            {(searchOpen || !showSearchToggle) && (
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
            {showFeatured && featured && (
              <section className="menu-spotlight" aria-label={text.featured}>
                <button
                  className="spotlight-main"
                  key={featured.id}
                  data-focus-key={`featured-${featured.id}`}
                  onClick={(event) => openDish(featured, event.currentTarget)}
                  aria-label={`${text.featured}: ${localized(featured.name, language)} — ${text.details}`}
                >
                  <MenuPhoto
                    fallbackLabel={`${text.noPhoto} ${localized(featured.name, language)}`}
                    src={featured.image}
                    srcSet={featured.srcSet}
                    sizes={preview ? '270px' : '360px'}
                    alt=""
                    width="600"
                    height="420"
                    fetchPriority={preview ? 'high' : 'auto'}
                  />
                  <span className="spotlight-overlay">
                    <span className="spotlight-kicker">{text.featured}</span>
                    <h3>{localized(featured.name, language)}</h3>
                    <span className="spotlight-bottom">
                      <span>{text.details}</span>
                      <bdi>{formatPrice(featured.price, language, currency)}</bdi>
                    </span>
                  </span>
                </button>
                <div className="spotlight-controls">
                  <button
                    onClick={() =>
                      setFeaturedIndex(
                        (featuredIndex + featuredDishes.length - 1) % featuredDishes.length,
                      )
                    }
                    aria-label={text.previous}
                  >
                    <PreviousArrow size={15} aria-hidden="true" />
                  </button>
                  <div>
                    {featuredDishes.map((dish, index) => (
                      <button
                        key={dish.id}
                        aria-label={text.show.replace('{dish}', localized(dish.name, language))}
                        aria-pressed={index === featuredIndex}
                        onClick={() => setFeaturedIndex(index)}
                      >
                        <span />
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => setFeaturedIndex((featuredIndex + 1) % featuredDishes.length)}
                    aria-label={text.next}
                  >
                    <NextArrow size={15} aria-hidden="true" />
                  </button>
                </div>
              </section>
            )}
            <nav className="menu-categories" aria-label={text.categories}>
              {[
                { id: 'all', name: { ar: text.allCategory, en: text.allCategory } },
                ...categories,
              ].map((item) => (
                <button
                  key={item.id}
                  aria-pressed={category === item.id}
                  onClick={() => setCategory(item.id)}
                >
                  {localized(item.name, language)}
                </button>
              ))}
            </nav>
            <div className="menu-results-heading">
              <h3>
                {category === 'all'
                  ? text.all
                  : localized(categories.find((item) => item.id === category)?.name, language)}
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
                    <DishControl
                      href={getDishHref?.(dish.id)}
                      data-focus-key={`dish-${dish.id}`}
                      onClick={(event) => {
                        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
                        event.preventDefault()
                        openDish(dish, event.currentTarget)
                      }}
                      aria-label={`${localized(dish.name, language)} — ${text.details}`}
                    >
                      <MenuPhoto
                        fallbackLabel={`${text.noPhoto} ${localized(dish.name, language)}`}
                        src={dish.thumbnail || dish.image}
                        alt={localized(dish.name, language)}
                        width="340"
                        height="230"
                        loading="lazy"
                      />
                      <span className="dish-card-copy">
                        <h3>{localized(dish.name, language)}</h3>
                        {showDescription && (
                          <p dir="auto">{localized(dish.description, language)}</p>
                        )}
                        {dish.available === false && (
                          <span className="dish-availability">{text.soldOut}</span>
                        )}
                        {showBadges && Boolean(dish.dietary?.length) && (
                          <span className="dish-dietary">{dish.dietary!.join(' · ')}</span>
                        )}
                        <bdi>{formatPrice(dish.price, language, currency)}</bdi>
                      </span>
                    </DishControl>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="menu-empty">
                <UtensilsCrossed size={28} aria-hidden="true" />
                <h3>{dishes.length ? text.noResults : text.empty}</h3>
                <p>{dishes.length ? text.noResultsHelp : text.emptyHelp}</p>
                <button
                  onClick={() => {
                    setQuery('')
                    setCategory('all')
                    searchInput.current?.focus({ preventScroll: true })
                  }}
                >
                  {text.reset}
                </button>
              </div>
            )}
            {sampleNote && <div className="menu-sample-note">{sampleNote}</div>}
            {contact}
          </>
        )}
        <footer className="menu-footer">
          <span>{text.powered}</span>
          <strong dir="ltr">SYRIAN MENU</strong>
          {allowLanguageSwitch && languageInFooter && (
            <button
              className="menu-round menu-language"
              aria-label={text.switchLanguage}
              onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
            >
              {text.languageName}
            </button>
          )}
        </footer>
      </div>
    </div>
  )
}
