import { useEffect, useRef, useState } from 'react'
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
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
import { contact, resolveWhatsApp } from './config/contact'
import './App.css'

const navigation = [
  { href: '#how-it-works', label: 'How it works' },
  { href: '#features', label: 'Made for your restaurant' },
  { href: '#contact', label: 'Contact' },
]
const copyrightYear = new Date().getFullYear()

function Header() {
  const [open, setOpen] = useState(false)
  const toggle = useRef<HTMLButtonElement>(null)
  const nav = useRef<HTMLElement>(null)
  useEffect(() => {
    if (!open) return
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
        <button
          ref={toggle}
          data-testid="navigation-toggle"
          className="navigation-toggle"
          aria-controls="main-navigation"
          aria-expanded={open}
          aria-label={open ? 'Close navigation' : 'Open navigation'}
          onClick={() => setOpen(!open)}
        >
          {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
        <nav
          id="main-navigation"
          ref={nav}
          className={open ? 'site-nav is-open' : 'site-nav'}
          aria-label="Main navigation"
          onClick={() => setOpen(false)}
        >
          {navigation.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
          <a className="button button-small" href="#demo">
            Try the Experience <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        </nav>
      </div>
    </header>
  )
}

function Hero() {
  return (
    <section className="hero container" aria-labelledby="hero-title">
      <div className="hero-copy">
        <div className="eyebrow">
          <span /> DIGITAL MENUS. REAL HOSPITALITY.
        </div>
        <h1 id="hero-title">
          A fresh way to
          <br />
          share your
          <br />
          <em>good taste.</em>
        </h1>
        <p className="hero-description">
          Your food tells a story. Give it a menu that does, too. A beautiful digital experience,
          from the first scan to the last bite.
        </p>
        <div className="hero-actions">
          <a className="button" href="#demo">
            Try the Experience <ArrowUpRight size={19} aria-hidden="true" />
          </a>
          <a className="text-link" href="#how-it-works">
            See how it works <ArrowRight size={17} aria-hidden="true" />
          </a>
        </div>
        <div className="hero-assurance">
          <span>
            <Check size={15} aria-hidden="true" />
            No app to download
          </span>
          <span>
            <Check size={15} aria-hidden="true" />
            Made for every table
          </span>
        </div>
      </div>
      <div className="hero-stage">
        <div className="hero-photo">
          <img
            src="/images/syrian-table.webp"
            alt="A Syrian table filled with charcoal grills, fresh fattoush, hummus and warm flatbread"
            width="768"
            height="900"
            fetchPriority="high"
          />
          <span className="photo-caption">
            ROOTED IN HOSPITALITY.
            <br />
            DESIGNED FOR TODAY.
          </span>
        </div>
        <div className="hero-handwritten" lang="ar" dir="rtl">
          صحتين وهنا
        </div>
        <PhoneFrame className="hero-phone">
          <MenuExperience preview />
        </PhoneFrame>
        <div className="hero-scan-note">
          <QR size={65} />
          <span>
            A little scan.
            <br />
            <strong>A delicious discovery.</strong>
          </span>
          <ArrowUpRight size={19} aria-hidden="true" />
        </div>
        <span className="hero-interactive-note">
          <MousePointer2 size={14} aria-hidden="true" /> A real menu. Go on, explore.
        </span>
      </div>
    </section>
  )
}

function HowItWorks() {
  const steps = [
    {
      icon: ScanLine,
      title: 'Scan. You’re at the table.',
      description:
        'Guests scan your QR code with their phone camera. Your menu opens right in their browser.',
      detail: 'NO DOWNLOADS. NO DETOURS.',
    },
    {
      icon: LayoutGrid,
      title: 'Explore every craving.',
      description:
        'Browse your categories, discover beautiful dishes, and find something that feels just right.',
      detail: 'A LITTLE LESS SCROLL. MORE DISCOVERY.',
    },
    {
      icon: Sparkles,
      title: 'Let good food do the talking.',
      description:
        'Clear descriptions, appetizing photos, and easy-to-find prices make choosing a pleasure.',
      detail: 'YOUR HOSPITALITY, ON SCREEN.',
    },
  ]
  return (
    <section id="how-it-works" className="how-section section-space">
      <div className="container">
        <div className="section-heading">
          <div>
            <span className="eyebrow">01 / THE SIMPLE PLEASURE</span>
            <h2>
              A little scan.
              <br />
              <em>A warm welcome.</em>
            </h2>
          </div>
          <p>
            Good hospitality should feel effortless.
            <br />
            Your menu is a lovely place to start.
          </p>
        </div>
        <div className="steps">
          {steps.map((step, index) => (
            <article className="step" key={step.title}>
              <div className="step-top">
                <span className="step-icon">
                  <step.icon size={26} strokeWidth={1.5} aria-hidden="true" />
                </span>
                <span className="step-number">0{index + 1}</span>
              </div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
              <span className="step-detail">{step.detail}</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function Features() {
  const features = [
    {
      icon: Palette,
      title: 'Your restaurant. Your character.',
      description:
        'Bring your logo, colors, and personality to the table. A menu that feels like you.',
    },
    {
      icon: Image,
      title: 'Every dish, beautifully presented.',
      description:
        'Let guests see what makes your food special, with rich photography and thoughtful descriptions.',
    },
    {
      icon: LayoutGrid,
      title: 'A place for every craving.',
      description:
        'Clear categories and visible prices help guests explore your menu at their own pace.',
    },
    {
      icon: Globe2,
      title: 'A warm welcome, in either language.',
      description:
        'Let guests browse naturally in Arabic or English, on a menu made for their phone.',
    },
  ]
  return (
    <section id="features" className="features-section section-space container">
      <div className="feature-visual">
        <img
          className="feature-food"
          src="/images/grill.webp"
          alt="Charcoal-grilled kebab with roasted tomatoes and fresh parsley"
          width="650"
          height="760"
          loading="lazy"
        />
        <div className="feature-dish-label">
          <span>THE DETAILS MAKE THE DIFFERENCE</span>
          <div>
            <strong lang="ar">كباب حلبي</strong>
            <bdi>$38</bdi>
          </div>
          <p>A little tradition. A lot of flavor.</p>
        </div>
        <div className="feature-language-label">
          <Globe2 size={18} aria-hidden="true" />
          <span>English</span>
          <span className="language-divider" />
          <span lang="ar">العربية</span>
          <CheckCheck size={17} aria-hidden="true" />
        </div>
      </div>
      <div className="features-copy">
        <span className="eyebrow">02 / THOUGHTFULLY MADE</span>
        <h2>
          More than a menu.
          <br />
          <em>A taste of you.</em>
        </h2>
        <p className="section-intro">
          The care you put into your restaurant belongs in every detail of your menu.
        </p>
        <div className="feature-list">
          {features.map((feature) => (
            <article className="feature" key={feature.title}>
              <feature.icon size={23} strokeWidth={1.5} aria-hidden="true" />
              <div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function ExperienceSection() {
  return (
    <section id="experience" className="experience-section">
      <div className="container experience-inner">
        <div className="experience-copy">
          <span className="eyebrow">03 / PULL UP A CHAIR</span>
          <h2>
            Some things are better
            <br />
            <em>experienced.</em>
          </h2>
          <p>
            Step inside Dar Al Yasmin, our little demo restaurant.
            <br />
            Browse the dishes. Find a favorite. Make yourself at home.
          </p>
          <a className="button button-cream" href="#demo">
            Try the Experience <ArrowUpRight size={19} aria-hidden="true" />
          </a>
          <span className="experience-footnote">Interactive demo · No sign-up needed</span>
        </div>
        <div className="experience-table">
          <img
            src="/images/fattoush.webp"
            alt="A bowl of fresh fattoush with crisp vegetables and toasted flatbread"
            width="500"
            height="500"
            loading="lazy"
          />
          <div className="table-card">
            <Flower2 className="table-card-flower" size={28} strokeWidth={1.3} aria-hidden="true" />
            <span className="table-card-name" lang="ar">
              دار الياسمين
            </span>
            <span className="table-card-subtitle">A TASTE OF DAMASCUS</span>
            <QR size={98} />
            <span className="table-card-bottom">
              YOUR NEXT FAVORITE DISH
              <br />
              IS A SCAN AWAY.
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}

function Contact() {
  const whatsapp = resolveWhatsApp(contact.whatsapp)
  return (
    <section id="contact" className="contact-section section-space container">
      <div className="contact-heading">
        <span className="eyebrow">04 / LET’S TALK</span>
        <h2>
          Your next chapter
          <br />
          <em>starts at the table.</em>
        </h2>
        <p>
          Have a restaurant, a question, or a lovely idea?
          <br />
          We’d love to hear from you.
        </p>
      </div>
      <div className="contact-options">
        <a className="contact-row" href={`mailto:${contact.email}`}>
          <span className="contact-icon">
            <Mail size={23} strokeWidth={1.5} aria-hidden="true" />
          </span>
          <span>
            <small>DROP US A LINE</small>
            <strong>{contact.email}</strong>
          </span>
          <ArrowUpRight size={21} aria-hidden="true" />
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
            <small>A LITTLE INSPIRATION</small>
            <strong>@syrian_menu</strong>
          </span>
          <ArrowUpRight size={21} aria-hidden="true" />
        </a>
        {whatsapp && (
          <div className="whatsapp-contact">
            <div className="whatsapp-title">
              <MessageCircle size={23} strokeWidth={1.5} aria-hidden="true" />
              <span>Let’s keep in touch.</span>
              <span className="contact-status">{whatsapp.href ? 'SAY HELLO' : 'COMING SOON'}</span>
            </div>
            {whatsapp.href ? (
              <a
                className="button whatsapp-button"
                href={whatsapp.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {whatsapp.label}
                <ArrowUpRight size={18} aria-hidden="true" />
              </a>
            ) : (
              <>
                <p>
                  Our official WhatsApp number is on its way.
                  <br />
                  For now, say hello by email or Instagram.
                </p>
                {whatsapp.number && (
                  <span className="temporary-number">
                    <bdi>{whatsapp.number}</bdi>
                    <small>Temporary placeholder</small>
                  </span>
                )}
                <span className="whatsapp-coming-soon">
                  <MessageCircle size={16} aria-hidden="true" />
                  {whatsapp.label}
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
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top">
          <div>
            <Brand />
            <p>Rooted in hospitality. Made for your table.</p>
          </div>
          <nav aria-label="Footer navigation">
            <a href="#how-it-works">How it works</a>
            <a href="#features">Features</a>
            <a href="#demo">The experience</a>
            <a href="#contact">Get in touch</a>
          </nav>
          <div className="footer-socials">
            <a
              href={contact.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="SYRIAN MENU on Instagram"
            >
              <Instagram size={20} aria-hidden="true" />
            </a>
            <a href={`mailto:${contact.email}`} aria-label="Email SYRIAN MENU">
              <Mail size={20} aria-hidden="true" />
            </a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {copyrightYear} SYRIAN MENU. All rights reserved.</span>
          <span>Made with care. Served with soul.</span>
          <a href="#home">
            Back to top <ArrowUpRight size={14} aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  )
}

function DemoPage() {
  return (
    <div className="demo-page">
      <header className="demo-header container">
        <Brand inverse />
        <a className="demo-back" href="#home">
          <ArrowLeft size={17} aria-hidden="true" />
          Back to website
        </a>
      </header>
      <main id="main-content" tabIndex={-1} className="demo-layout container">
        <div className="demo-intro">
          <span className="eyebrow">
            <span /> THE SYRIAN MENU EXPERIENCE
          </span>
          <h1>
            A seat at
            <br />
            <em>our table.</em>
          </h1>
          <p>
            Meet Dar Al Yasmin. A fictional restaurant,
            <br className="desktop-break" /> with a menu that feels right at home.
          </p>
          <ol className="demo-hints">
            <li>
              <LayoutGrid size={20} aria-hidden="true" />
              <span>
                Follow your cravings.<small>Tap a category to explore.</small>
              </span>
            </li>
            <li>
              <MousePointer2 size={20} aria-hidden="true" />
              <span>
                Get a little closer.<small>Open a dish for the delicious details.</small>
              </span>
            </li>
            <li>
              <Globe2 size={20} aria-hidden="true" />
              <span>
                Make yourself comfortable.<small>Switch between Arabic and English.</small>
              </span>
            </li>
          </ol>
          <a className="demo-contact" href="#contact">
            Imagine this for your restaurant <ArrowUpRight size={17} aria-hidden="true" />
          </a>
          <p className="demo-disclaimer">
            Sample dishes and illustrative prices.
            <br />
            This demo is for browsing; ordering is not available.
          </p>
        </div>
        <div className="demo-phone-stage">
          <span className="demo-side-note">A LITTLE SCAN. A WHOLE EXPERIENCE.</span>
          <PhoneFrame className="demo-phone">
            <MenuExperience />
          </PhoneFrame>
          <span className="demo-touch-note">
            <Smartphone size={15} aria-hidden="true" />
            Scroll inside the phone to explore
          </span>
        </div>
      </main>
    </div>
  )
}

export default function App() {
  const [demo, setDemo] = useState(() => window.location.hash === '#demo')
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
    document.title = demo
      ? 'Try the Experience · SYRIAN MENU'
      : 'SYRIAN MENU — A fresh way to share your good taste'
    if (demo) document.getElementById('main-content')?.focus({ preventScroll: true })
  }, [demo])
  return (
    <>
      <a className="skip-link" href="#main-content" onClick={skipToContent}>
        Skip to content
      </a>
      {demo ? (
        <DemoPage />
      ) : (
        <div id="home">
          <Header />
          <main id="main-content" tabIndex={-1}>
            <Hero />
            <div className="hero-baseline container">
              <span>YOUR HOSPITALITY, BEAUTIFULLY CONNECTED.</span>
              <a href="#how-it-works">
                Discover the difference <ArrowDown size={15} aria-hidden="true" />
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
