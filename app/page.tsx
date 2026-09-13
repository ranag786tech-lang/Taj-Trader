'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  ArrowRight,
  BadgeCheck,
  Calculator,
  Clock3,
  Droplets,
  Hammer,
  MapPin,
  Menu,
  MessageCircle,
  Palette,
  Paintbrush,
  Phone,
  ShieldCheck,
  Sparkles,
  Truck,
  X,
  Star,
} from 'lucide-react'

const whatsappMessage = encodeURIComponent('Assalam-o-Alaikum, I would like to get a quote from Taj Traders Fsd.')
const mapsUrl = 'https://www.google.com/maps/search/?api=1&query=Taj+Traders+Faisalabad'

const categories = [
  ['Interior paints', 'Walls that feel like home', Palette, 'coral'],
  ['Exterior paints', 'Built for Faisalabad weather', ShieldCheck, 'blue'],
  ['Primers & putty', 'A smoother start', Droplets, 'sand'],
  ['Enamels', 'A finish that lasts', Sparkles, 'orange'],
  ['Wood finishes', 'Bring out the grain', Hammer, 'brown'],
  ['Metal paints', 'Tough, clean protection', ShieldCheck, 'navy'],
  ['Waterproofing', 'Keep moisture out', Droplets, 'teal'],
  ['Brushes & rollers', 'The right tools for the job', Paintbrush, 'yellow'],
]

const products = [
  { brand: 'Nippon Paint', name: 'Vinilex 5000', type: 'Interior emulsion', size: '1L · 4L · 16L', tone: 'navy' },
  { brand: 'Brighto', name: 'Weather Shield', type: 'Exterior protection', size: '1L · 4L · 16L', tone: 'terracotta' },
  { brand: 'Master Paints', name: 'Wood Finish', type: 'Wood & metal finish', size: '500ml · 1L · 4L', tone: 'ochre' },
]

function Logo() {
  return <div className="logo-mark" aria-label="Taj Traders Fsd home"><span>TT</span><i /></div>
}

function Header() {
  const [open, setOpen] = useState(false)
  return <>
    <header className="site-header">
      <a href="#top" className="brand"><Logo /><span>Taj Traders <small>FSD</small></span></a>
      <nav className="desktop-nav" aria-label="Primary navigation">
        <a href="#products">Products</a><a href="#brands">Brands</a><a href="#services">Services</a><a href="#about">About</a><a href="#contact">Contact</a>
      </nav>
      <div className="header-actions"><a className="header-phone" href="tel:"><Phone size={16} /> Call store</a><a className="admin-link" href="/admin/login">Admin sign in</a><a className="button button-small" href="#quote">Get a quote <ArrowRight size={16} /></a><button className="menu-button" onClick={() => setOpen(!open)} aria-label={open ? 'Close menu' : 'Open menu'}>{open ? <X /> : <Menu />}</button></div>
    </header>
    {open && <div className="mobile-menu"><a href="#products" onClick={() => setOpen(false)}>Products</a><a href="#brands" onClick={() => setOpen(false)}>Brands</a><a href="#services" onClick={() => setOpen(false)}>Services</a><a href="#about" onClick={() => setOpen(false)}>About</a><a href="#contact" onClick={() => setOpen(false)}>Contact</a><a href="/admin/login" onClick={() => setOpen(false)}>Admin sign in</a></div>}
  </>
}

function TrustBar() {
  return <div className="trust-bar"><div><Star className="trust-star" size={20} fill="currentColor" /><strong>4.8</strong><span>Google rating<br /><small>12 reviews</small></span></div><div><Truck size={20} /><span><strong>Same-day delivery</strong><br /><small>Across Faisalabad</small></span></div><div><BadgeCheck size={20} /><span><strong>Local expertise</strong><br /><small>Paints that perform</small></span></div></div>
}

function Hero() {
  return <section className="hero" id="top"><div className="hero-copy"><p className="eyebrow"><span /> Faisalabad’s paint & finishing store</p><h1>Bring your walls <em>to life.</em></h1><p className="hero-sub">Quality paints, colors and finishing solutions for homes, businesses and builders across Faisalabad.</p><div className="hero-actions"><a href="#quote" className="button">Get a paint quote <ArrowRight size={18} /></a><a href={`https://wa.me/?text=${whatsappMessage}`} className="button button-ghost"><MessageCircle size={18} /> WhatsApp us</a></div><div className="hero-note"><BadgeCheck size={18} /> Trusted products. Honest guidance. Local service.</div></div><div className="hero-visual"><img src="/taj-hero.png" alt="Sunlit living room with a navy painted wall and colorful paint swatches" /><div className="hero-float"><span className="paint-dot" /><div><strong>Color starts here.</strong><small>Find your perfect shade</small></div><ArrowRight size={17} /></div></div></section>
}

function CategorySection() {
  return <section className="section cream-section" id="products"><div className="section-heading"><div><p className="eyebrow">Explore the range</p><h2>Everything for a <em>better finish.</em></h2></div><a href="#quote" className="text-link">Ask what’s right for you <ArrowRight size={17} /></a></div><div className="category-grid">{categories.map(([title, desc, Icon, tone]) => <a href="#quote" className={`category-card ${tone}`} key={title as string}><div className="category-icon"><Icon size={22} /></div><div><h3>{title as string}</h3><p>{desc as string}</p></div><ArrowRight size={17} className="category-arrow" /></a>)}</div></section>
}

function ProductsSection() {
  const [catalogProducts, setCatalogProducts] = useState(products)

  useEffect(() => {
    async function loadCatalog() {
      try {
        const [productsResponse, brandsResponse] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/brands'),
        ])
        if (!productsResponse.ok || !brandsResponse.ok) return
        const remoteProducts = await productsResponse.json()
        const brands = await brandsResponse.json()
        if (!Array.isArray(remoteProducts) || remoteProducts.length === 0) return

        setCatalogProducts(remoteProducts.map((product: { name: string; brandId: string; type?: string; sizes?: string[] }, index: number) => {
          const brand = brands.find((item: { id: string }) => item.id === product.brandId)
          return {
            brand: brand?.name || 'Taj Traders',
            name: product.name,
            type: product.type || 'Paint & finishing product',
            size: product.sizes?.join(' · ') || 'Ask for sizes',
            tone: ['navy', 'terracotta', 'ochre'][index % 3],
          }
        }))
      } catch {
        // Keep the curated fallback catalog when KV is unavailable.
      }
    }

    loadCatalog()
  }, [])

  return <section className="section" id="brands"><div className="section-heading"><div><p className="eyebrow">Popular picks</p><h2>Good products.<br /><em>Great advice.</em></h2></div><p className="section-intro">We stock trusted paints and finishing products from brands chosen for real-world performance.</p></div><div className="product-grid">{catalogProducts.map((product) => <article className="product-card" key={product.name}><div className={`product-image ${product.tone}`}><div className="can"><span>{product.brand.split(' ')[0]}</span><strong>{product.name.split(' ')[0]}</strong><small>INTERIOR / EXTERIOR</small></div><span className="product-badge">Ask price</span></div><div className="product-content"><p className="product-brand">{product.brand}</p><h3>{product.name}</h3><p className="muted">{product.type} · {product.size}</p><a href={`https://wa.me/?text=${encodeURIComponent(`Hi Taj Traders, I would like the price for ${product.name}.`)}`} className="product-link">Ask on WhatsApp <ArrowRight size={16} /></a></div></article>)}</div></section>
}

function WhySection() {
  return <section className="section navy-section" id="about"><div className="why-intro"><p className="eyebrow eyebrow-light">Why Taj Traders</p><h2>Paint decisions<br /><em>made simpler.</em></h2><p>From the first color idea to the final coat, we help you choose with confidence.</p><a href="#contact" className="button button-light">Visit our store <ArrowRight size={17} /></a></div><div className="why-grid"><div><span>01</span><Truck /><h3>Quick, local delivery</h3><p>Get what you need without waiting around.</p></div><div><span>02</span><Palette /><h3>Practical color guidance</h3><p>Advice that works in your space and light.</p></div><div><span>03</span><ShieldCheck /><h3>Products you can trust</h3><p>Quality brands, genuine products.</p></div><div><span>04</span><MessageCircle /><h3>Easy to reach</h3><p>Call, message or visit — we’re nearby.</p></div></div></section>
}

function CalculatorCard() {
  const [area, setArea] = useState('')
  const litres = useMemo(() => area ? Math.max(1, Math.ceil(Number(area) / 100)) : 0, [area])
  return <section className="calculator-wrap" id="services"><div className="calculator-copy"><p className="eyebrow">A little head start</p><h2>How much paint<br /><em>do I need?</em></h2><p>Enter your approximate wall area and we’ll give you a quick starting estimate. Our team can refine it for your surface and finish.</p></div><div className="calculator-card"><div className="calculator-icon"><Calculator size={22} /></div><label htmlFor="area">Approximate wall area</label><div className="input-row"><input id="area" type="number" min="1" placeholder="e.g. 850" value={area} onChange={(event) => setArea(event.target.value)} /><span>sq ft</span></div>{litres > 0 ? <div className="estimate"><strong>About {litres}L</strong><span>for one coat</span></div> : <p className="calc-hint">Most interior walls need 1L for roughly 100 sq ft per coat.</p>}<a href="#quote" className="text-link">Get an exact recommendation <ArrowRight size={16} /></a></div></section>
}

function ContactSection() {
  return <section className="section contact-section" id="contact"><div className="contact-card"><div><p className="eyebrow">Come say hello</p><h2>Let’s make your<br /><em>next project shine.</em></h2><p className="contact-copy">Visit Taj Traders in Faisalabad for product samples, color advice and everything you need for a beautiful finish.</p><div className="contact-details"><div><MapPin size={19} /><span><strong>Find us</strong><br />Main Jhang Road, Faisalabad, Punjab</span></div><div><Clock3 size={19} /><span><strong>Store hours</strong><br />Mon – Sat · 9:00 AM – 8:00 PM</span></div></div><div className="hero-actions"><a href={mapsUrl} target="_blank" rel="noreferrer" className="button">Get directions <ArrowRight size={18} /></a><a href={`https://wa.me/?text=${whatsappMessage}`} className="button button-ghost"><MessageCircle size={18} /> WhatsApp us</a></div></div><div className="location-art"><div className="map-pin"><MapPin size={25} /></div><span>TAJ TRADERS FSD</span><small>Your local paint people</small></div></div></section>
}

function Footer() {
  return <footer><div className="footer-main"><div className="footer-brand"><a href="#top" className="brand"><Logo /><span>Taj Traders <small>FSD</small></span></a><p>Paints, colors & finishing solutions in Faisalabad.</p><div className="socials"><a href="#" aria-label="Facebook"><span aria-hidden="true" style={{ fontSize: 12, fontWeight: 800 }}>f</span></a><a href="#" aria-label="Instagram"><span aria-hidden="true" style={{ fontSize: 11, fontWeight: 800 }}>ig</span></a><a href={`https://wa.me/?text=${whatsappMessage}`} aria-label="WhatsApp"><MessageCircle size={17} /></a></div></div><div><h4>Explore</h4><a href="#products">Products</a><a href="#brands">Brands</a><a href="#services">Services</a><a href="#about">About us</a></div><div><h4>Get in touch</h4><a href="tel:">Call the store</a><a href={`https://wa.me/?text=${whatsappMessage}`}>WhatsApp us</a><a href={mapsUrl}>Get directions</a><a href="#quote">Request a quote</a><a href="/admin/login">Admin sign in</a></div></div><div className="footer-bottom"><span>© 2026 Taj Traders Fsd. All rights reserved.</span><span>Made for Faisalabad, with care.</span></div></footer>
}

export default function Page() {
  return <><Header /><main><Hero /><div className="container"><TrustBar /></div><CategorySection /><ProductsSection /><WhySection /><div className="container"><CalculatorCard /></div><ContactSection /></main><Footer /><div className="mobile-contact"><a href="tel:"><Phone size={17} /><span>Call</span></a><a href={`https://wa.me/?text=${whatsappMessage}`}><MessageCircle size={17} /><span>WhatsApp</span></a><a href={mapsUrl}><MapPin size={17} /><span>Directions</span></a></div></>
}
