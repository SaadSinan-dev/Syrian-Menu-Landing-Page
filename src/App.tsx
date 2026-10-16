import { useEffect, useRef, useState } from 'react'
import {
  ArrowDown,
  Check,
  CheckCheck,
  Flower2,
  Globe2,
  Image,
  LayoutGrid,
  Mail,
  Menu,
  MessageCircle,
  MousePointer2,
  Palette,
  ScanLine,
  Smartphone,
  Sparkles,
  X,
} from 'lucide-react'
import { Instagram } from './components/InstagramIcon'
import { Brand } from './components/Brand'
import { MenuExperience } from './components/MenuExperience'
import { PhoneFrame } from './components/PhoneFrame'
import { QR } from './components/QR'
import { CloudCTA } from './components/CloudCTA'
import { PreferenceControls } from './components/PreferenceControls'
import { FlowArrow } from './components/FlowArrow'
import { contact, resolveWhatsApp } from './config/contact'
import { useCopy } from './i18n/useCopy'
import { formatMessage } from './i18n/messages'
import { usePreferences } from './preferences/context'
import { useReveals } from './motion/useReveals'
import { formatPrice } from './data/menu'
import './App.css'
import './preferences.css'
import './motion.css'

const copyrightYear = new Date().getFullYear()

function Header() {
  const t = useCopy()
  const [open, setOpen] = useState(false)
  const toggle = useRef<HTMLButtonElement>(null)
  const nav = useRef<HTMLElement>(null)
  useEffect(() => {
    if (!open) return
    nav.current?.querySelector<HTMLAnchorElement>('a')?.focus({ preventScroll: true })
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        toggle.current?.focus()
      }
    }
    const onOutside = (event: PointerEvent) => {
      if (
        !nav.current?.contains(event.target as Node) &&
        !toggle.current?.contains(event.target as Node)
      )
        setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onOutside)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onOutside)
    }
  }, [open])
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Brand />
        <nav
          id="main-navigation"
          ref={nav}
          className={open ? 'site-nav is-open' : 'site-nav'}
          aria-label={t.common.mainNav}
          onClick={() => setOpen(false)}
        >
          <a href="#how-it-works">{t.nav.how}</a>
          <a href="#features">{t.nav.features}</a>
          <a href="#contact">{t.nav.contact}</a>
        </nav>
        <div className="header-actions">
          <PreferenceControls />
          <CloudCTA />
          <button
            ref={toggle}
            data-testid="navigation-toggle"
            className="navigation-toggle"
            aria-controls="main-navigation"
            aria-expanded={open}
            aria-label={open ? t.common.closeNav : t.common.openNav}
            onClick={() => setOpen(!open)}
          >
            {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>
      </div>
    </header>
  )
}

function Hero() {
  const { hero: t, common } = useCopy()
  return (
    <section className="hero container" aria-labelledby="hero-title">
      <div className="hero-copy">
        <div className="eyebrow">
          <span />
          {t.eyebrow}
        </div>
        <h1 id="hero-title">
          <span className="hero-line">{t.line1}</span>
          <span className="hero-line">{t.line2}</span>
          <em className="hero-line">{t.emphasis}</em>
        </h1>
        <p className="hero-description">{t.description}</p>
        <div className="hero-actions">
          <a className="button" href="#demo">
            {common.try}
            <FlowArrow diagonal size={19} />
          </a>
          <a className="text-link" href="#how-it-works">
            {t.how}
            <FlowArrow size={17} />
          </a>
        </div>
        <div className="hero-assurance">
          <span>
            <Check size={15} aria-hidden="true" />
            {t.noApp}
          </span>
          <span>
            <Check size={15} aria-hidden="true" />
            {t.table}
          </span>
        </div>
      </div>
      <div className="hero-stage">
        <div className="hero-photo">
          <img
            src="/images/syrian-table.webp"
            alt={t.photoAlt}
            width="768"
            height="900"
            fetchPriority="high"
          />
          <span className="photo-caption">
            {t.caption1}
            <br />
            {t.caption2}
          </span>
        </div>
        <div className="hero-handwritten">{t.handwritten}</div>
        <PhoneFrame className="hero-phone">
          <MenuExperience preview />
        </PhoneFrame>
        <div className="hero-scan-note">
          <QR size={65} />
          <span>
            {t.scan}
            <br />
            <strong>{t.discover}</strong>
          </span>
          <FlowArrow diagonal size={19} />
        </div>
        <span className="hero-interactive-note">
          <MousePointer2 size={14} aria-hidden="true" />
          {t.interactive}
        </span>
      </div>
    </section>
  )
}

function HowItWorks() {
  const { how: t } = useCopy()
  const icons = [ScanLine, LayoutGrid, Sparkles]
  const { language } = usePreferences()
  return (
    <section id="how-it-works" className="how-section section-space">
      <div className="container">
        <div className="section-heading" data-reveal="rise">
          <div>
            <span className="eyebrow">{t.eyebrow}</span>
            <h2>
              {t.title}
              <br />
              <em>{t.emphasis}</em>
            </h2>
          </div>
          <p>
            {t.intro1}
            <br />
            {t.intro2}
          </p>
        </div>
        <div className="steps">
          {t.steps.map((step, index) => {
            const Icon = icons[index]
            return (
              <article
                className="step"
                key={index}
                data-reveal="rise"
                style={{ '--reveal-delay': index * 80 + 'ms' } as React.CSSProperties}
              >
                <div className="step-top">
                  <span className="step-icon">
                    <Icon size={26} strokeWidth={1.5} aria-hidden="true" />
                  </span>
                  <span className="step-number">
                    {new Intl.NumberFormat(language === 'ar' ? 'ar-u-nu-arab' : 'en', {
                      minimumIntegerDigits: 2,
                    }).format(index + 1)}
                  </span>
                </div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
                <span className="step-detail">{step.detail}</span>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function Features() {
  const { features: t } = useCopy()
  const { language } = usePreferences()
  const icons = [Palette, Image, LayoutGrid, Globe2]
  return (
    <section id="features" className="features-section section-space container">
      <div className="feature-visual" data-reveal="image">
        <img
          className="feature-food"
          src="/images/grill.webp"
          alt={t.photoAlt}
          width="650"
          height="760"
          loading="lazy"
        />
        <div className="feature-dish-label">
          <span>{t.detail}</span>
          <div>
            <strong>{t.dish}</strong>
            <bdi>{formatPrice(38, language)}</bdi>
          </div>
          <p>{t.dishNote}</p>
        </div>
        <div className="feature-language-label">
          <Globe2 size={18} aria-hidden="true" />
          <span>{t.english}</span>
          <span className="language-divider" />
          <span>{t.arabic}</span>
          <CheckCheck size={17} aria-hidden="true" />
        </div>
      </div>
      <div className="features-copy">
        <div data-reveal="fade">
          <span className="eyebrow">{t.eyebrow}</span>
          <h2>
            {t.title}
            <br />
            <em>{t.emphasis}</em>
          </h2>
          <p className="section-intro">{t.intro}</p>
        </div>
        <div className="feature-list">
          {t.items.map((feature, index) => {
            const Icon = icons[index]
            return (
              <article
                className="feature"
                key={index}
                data-reveal="slide"
                style={{ '--reveal-delay': index * 55 + 'ms' } as React.CSSProperties}
              >
                <Icon size={23} strokeWidth={1.5} aria-hidden="true" />
                <div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function ExperienceSection() {
  const { experience: t, common } = useCopy()
  return (
    <section id="experience" className="experience-section">
      <div className="container experience-inner">
        <div className="experience-copy" data-reveal="rise">
          <span className="eyebrow">{t.eyebrow}</span>
          <h2>
            {t.title}
            <br />
            <em>{t.emphasis}</em>
          </h2>
          <p>
            {t.intro1}
            <br />
            {t.intro2}
          </p>
          <a className="button button-cream" href="#demo">
            {common.try}
            <FlowArrow diagonal size={19} />
          </a>
          <span className="experience-footnote">{t.footnote}</span>
        </div>
        <div className="experience-table" data-reveal="tilt">
          <img
            src="/images/fattoush.webp"
            alt={t.photoAlt}
            width="500"
            height="500"
            loading="lazy"
          />
          <div className="table-card">
            <Flower2 className="table-card-flower" size={28} strokeWidth={1.3} aria-hidden="true" />
            <span className="table-card-name">{t.restaurant}</span>
            <span className="table-card-subtitle">{t.subtitle}</span>
            <QR size={98} />
            <span className="table-card-bottom">
              {t.card1}
              <br />
              {t.card2}
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}

function Contact() {
  const { contact: t } = useCopy()
  const { language } = usePreferences()
  const whatsapp = resolveWhatsApp({
    ...contact.whatsapp,
    message: language === 'ar' ? t.message : contact.whatsapp.message,
  })
  return (
    <section id="contact" className="contact-section section-space container">
      <div className="contact-heading" data-reveal="rise">
        <span className="eyebrow">{t.eyebrow}</span>
        <h2>
          {t.title}
          <br />
          <em>{t.emphasis}</em>
        </h2>
        <p>
          {t.intro1}
          <br />
          {t.intro2}
        </p>
      </div>
      <div className="contact-options" data-reveal="fade">
        <a className="contact-row" href={'mailto:' + contact.email}>
          <span className="contact-icon">
            <Mail size={23} strokeWidth={1.5} aria-hidden="true" />
          </span>
          <span>
            <small>{t.email}</small>
            <strong dir="ltr">{contact.email}</strong>
          </span>
          <FlowArrow diagonal size={21} />
        </a>
        <a
          className="contact-row"
          href={contact.instagram}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="contact-icon">
            <Instagram size={23} strokeWidth={1.5} aria-hidden="true" />
          </span>
          <span>
            <small>{t.instagram}</small>
            <strong dir="ltr">@syrian_menu</strong>
          </span>
          <FlowArrow diagonal size={21} />
        </a>
        {whatsapp && (
          <div className="whatsapp-contact">
            <div className="whatsapp-title">
              <MessageCircle size={23} strokeWidth={1.5} aria-hidden="true" />
              <span>{t.keep}</span>
              <span className="contact-status">{whatsapp.href ? t.hello : t.soon}</span>
            </div>
            {whatsapp.href ? (
              <a
                className="button whatsapp-button"
                href={whatsapp.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t.chat}
                <FlowArrow diagonal size={18} />
              </a>
            ) : (
              <>
                <p>
                  {t.whatsapp1}
                  <br />
                  {t.whatsapp2}
                </p>
                {whatsapp.number && (
                  <span className="temporary-number">
                    <bdi dir="ltr">{whatsapp.number}</bdi>
                    <small>{t.placeholder}</small>
                  </span>
                )}
                <span className="whatsapp-coming-soon">
                  <MessageCircle size={16} aria-hidden="true" />
                  {t.comingSoon}
                </span>
              </>
            )}
          </div>
        )}
      </div>
    </section>
  )
}

function Footer() {
  const { footer: t, nav, common } = useCopy()
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top">
          <div>
            <Brand />
            <p>{t.tagline}</p>
          </div>
          <nav aria-label={common.footerNav}>
            <a href="#how-it-works">{nav.how}</a>
            <a href="#features">{nav.featuresShort}</a>
            <a href="#demo">{nav.experience}</a>
            <a href="#contact">{nav.getInTouch}</a>
          </nav>
          <div className="footer-socials">
            <a
              href={contact.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t.instagram}
            >
              <Instagram size={20} aria-hidden="true" />
            </a>
            <a href={'mailto:' + contact.email} aria-label={t.email}>
              <Mail size={20} aria-hidden="true" />
            </a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>{formatMessage(t.rights, { year: copyrightYear })}</span>
          <span>{t.made}</span>
          <a href="#home">
            {t.top}
            <FlowArrow diagonal size={14} />
          </a>
        </div>
      </div>
    </footer>
  )
}

function DemoPage() {
  const { demo: t, common } = useCopy()
  const icons = [LayoutGrid, MousePointer2, Globe2]
  return (
    <div className="demo-page">
      <header className="demo-header container">
        <Brand inverse />
        <div className="demo-header-actions">
          <PreferenceControls />
          <a className="demo-back" href="#home">
            <FlowArrow back size={17} />
            <span>{common.backSite}</span>
          </a>
        </div>
      </header>
      <main id="main-content" tabIndex={-1} className="demo-layout container">
        <div className="demo-intro">
          <span className="eyebrow">
            <span />
            {t.eyebrow}
          </span>
          <h1>
            {t.title}
            <br />
            <em>{t.emphasis}</em>
          </h1>
          <p>
            {t.intro1}
            <br className="desktop-break" />
            {t.intro2}
          </p>
          <ol className="demo-hints">
            {t.hints.map((hint, index) => {
              const Icon = icons[index]
              return (
                <li key={index}>
                  <Icon size={20} aria-hidden="true" />
                  <span>
                    {hint.title}
                    <small>{hint.description}</small>
                  </span>
                </li>
              )
            })}
          </ol>
          <a className="demo-contact" href="#contact">
            {t.contact}
            <FlowArrow diagonal size={17} />
          </a>
          <p className="demo-disclaimer">
            {t.disclaimer1}
            <br />
            {t.disclaimer2}
          </p>
        </div>
        <div className="demo-phone-stage">
          <span className="demo-side-note">{common.brandTagline}</span>
          <PhoneFrame className="demo-phone">
            <MenuExperience />
          </PhoneFrame>
          <span className="demo-touch-note">
            <Smartphone size={15} aria-hidden="true" />
            {t.scroll}
          </span>
        </div>
      </main>
    </div>
  )
}

export default function App() {
  const [demo, setDemo] = useState(() => window.location.hash === '#demo')
  const t = useCopy()
  useReveals(demo)
  function skipToContent(event: React.MouseEvent<HTMLAnchorElement>) {
    event.preventDefault()
    const main = document.getElementById('main-content')
    main?.focus({ preventScroll: true })
    main?.scrollIntoView({ block: 'start' })
  }
  useEffect(() => {
    function onHashChange() {
      const isDemo = window.location.hash === '#demo'
      setDemo(isDemo)
      if (isDemo) window.scrollTo(0, 0)
      else
        requestAnimationFrame(() =>
          document.getElementById(window.location.hash.slice(1) || 'home')?.scrollIntoView(),
        )
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])
  useEffect(() => {
    document.title = demo ? t.common.demoTitle : t.common.title
  }, [demo, t.common.demoTitle, t.common.title])
  useEffect(() => {
    if (demo) document.getElementById('main-content')?.focus({ preventScroll: true })
  }, [demo])
  return (
    <>
      <a className="skip-link" href="#main-content" onClick={skipToContent}>
        {t.common.skip}
      </a>
      {demo ? (
        <DemoPage />
      ) : (
        <div id="home">
          <Header />
          <main id="main-content" tabIndex={-1}>
            <Hero />
            <div className="hero-baseline container">
              <span>{t.hero.baseline}</span>
              <a href="#how-it-works">
                {t.hero.difference}
                <ArrowDown size={15} aria-hidden="true" />
              </a>
            </div>
            <HowItWorks />
            <Features />
            <ExperienceSection />
            <Contact />
          </main>
          <Footer />
        </div>
      )}
    </>
  )
}
