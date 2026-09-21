import { useEffect, useRef, useState } from 'react'
import { Activity, ArrowRight, ArrowUpRight, Box, Check, ChevronDown, ClipboardList, Clock3, FileText, Headphones, MapPin, Menu, PackageCheck, Quote, Search, ShieldCheck, Truck, X, Zap } from 'lucide-react'
import * as THREE from 'three'
import './App.css'

const routes = ['home', 'services', 'rate-calculator', 'track', 'contact', 'login']
const nav = [['services', 'Services'], ['rate-calculator', 'Rate Calculator'], ['track', 'Track Shipment'], ['contact', 'Contact']]
const services = [
  { icon: Truck, title: 'Local courier', desc: 'Documents and parcels collected, coordinated and delivered across your city.', image: 'https://images.unsplash.com/photo-1616432043562-3671ea2e5242?auto=format&fit=crop&w=1200&q=85', alt: 'Courier vehicle on a delivery route', tag: 'CITY DELIVERY' },
  { icon: PackageCheck, title: 'Intercity shipping', desc: 'Practical parcel movement across India with clear handoffs and updates.', image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=85', alt: 'Parcels inside a warehouse', tag: 'INDIA NETWORK' },
  { icon: FileText, title: 'Document desk', desc: 'Scanning, applications and paperwork support from one approachable desk.', image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&q=85', alt: 'Documents on a work desk', tag: 'ONLINE SERVICES' },
  { icon: Box, title: 'Business dispatch', desc: 'Scheduled pickups and dependable dispatch support for growing teams.', image: 'https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?auto=format&fit=crop&w=1200&q=85', alt: 'Logistics team handling packages', tag: 'FOR BUSINESS' },
]
const reviews = [
  {
    quote: 'Sodhi made courier planning feel simple. Pickup details, document support and final handoff were all handled through one clear conversation.',
    tag: 'LOCAL COURIER',
    name: 'Aarav Retail',
    initials: 'AR',
    role: 'Retail dispatch desk',
  },
  {
    quote: 'For regular parcels, the team keeps the process practical. We know what is needed before sending and avoid last-minute confusion.',
    tag: 'BUSINESS DISPATCH',
    name: 'Urban Cart',
    initials: 'UC',
    role: 'Online seller',
  },
  {
    quote: 'Instead of checking different people for documents and shipment updates, we now start with one responsive service desk.',
    tag: 'DOCUMENT SUPPORT',
    name: 'Northline Goods',
    initials: 'NG',
    role: 'Operations team',
  },
]
const businessAddress = [
  'Near Verka Plant',
  'Sodhi Online Services',
  'Barnala Raikot Road',
  'Mahal Kalan, Barnala',
  'Punjab 148104',
]

function App() {
  const [route, setRoute] = useState(readRoute)
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  useEffect(() => {
    const update = () => { setRoute(readRoute()); setMenuOpen(false); window.scrollTo(0, 0) }
    window.addEventListener('hashchange', update)
    return () => window.removeEventListener('hashchange', update)
  }, [])
  useEffect(() => {
    const updateScroll = () => {
      const max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1)
      const progress = Math.min(window.scrollY / max, 1)
      setScrollProgress(progress)
      document.documentElement.style.setProperty('--scroll-y', `${window.scrollY}px`)
    }
    updateScroll()
    window.addEventListener('scroll', updateScroll, { passive: true })
    window.addEventListener('resize', updateScroll)
    return () => {
      window.removeEventListener('scroll', updateScroll)
      window.removeEventListener('resize', updateScroll)
    }
  }, [])
  useEffect(() => {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target) }
    }), { threshold: 0.1, rootMargin: '0px 0px -8% 0px' })
    document.querySelectorAll('.reveal').forEach((el, index) => {
      el.style.setProperty('--reveal-delay', `${Math.min(index % 6, 5) * 70}ms`)
      observer.observe(el)
    })
    return () => observer.disconnect()
  }, [route])
  const go = next => {
    setMenuOpen(false)
    if (next === route) { window.scrollTo({ top: 0, behavior: 'smooth' }); return }
    window.location.hash = next === 'home' ? '' : next
  }
  return <div className="site-shell">
    <div className="scroll-progress" style={{ transform: `scaleX(${scrollProgress})` }} aria-hidden="true" />
    <a className="skip-link" href="#main">Skip to content</a>
    <header className="topbar"><div className="topbar-inner container">
      <a href="#" className="brand" aria-label="Sodhi Online Services home" onClick={e => { e.preventDefault(); go('home') }}><img src="/sodhi-logo.svg" alt="Sodhi Online Services, courier aggregator" /></a>
      <button className="menu-button" type="button" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Close menu' : 'Open menu'}>{menuOpen ? <X size={25} /> : <Menu size={25} />}</button>
      <nav className={menuOpen ? 'nav open' : 'nav'} aria-label="Primary navigation">
        {nav.map(([id, label]) => <a key={id} href={`#${id}`} className={route === id ? 'active' : ''} onClick={e => { e.preventDefault(); go(id) }}>{label}</a>)}
        <a className="login-link" href="#login" onClick={e => { e.preventDefault(); go('login') }}>Log In <ArrowRight size={15} /></a>
        <a className="nav-quote" href="#rate-calculator" onClick={e => { e.preventDefault(); go('rate-calculator') }}>Get a Quote <ArrowUpRight size={16} /></a>
      </nav>
    </div></header>
    <main id="main">
      {route === 'home' && <Home go={go} />}
      {route === 'services' && <Services go={go} />}
      {route === 'rate-calculator' && <RateCalculator go={go} />}
      {route === 'track' && <TrackPage />}
      {route === 'contact' && <Contact />}
      {route === 'login' && <Login />}
    </main>
    <Footer go={go} />
  </div>
}

function Home({ go }) {
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [error, setError] = useState('')
  const [faq, setFaq] = useState(0)
  const faqs = [
    ['How do I get a final shipping price?', 'Use the indicative calculator to plan your shipment. Final pricing is confirmed after route, parcel size, service speed and pickup details are reviewed.'],
    ['Can I arrange recurring pickups?', 'Yes. Share your usual pickup frequency, approximate volume and service area through the contact page.'],
    ['What can the document desk help with?', 'The desk can assist with scanning, online applications and related paperwork alongside courier requests.'],
    ['Is tracking live on this website?', 'The tracking screen currently shows a clearly marked demonstration journey. A live carrier connection is needed for actual shipment lookup.'],
  ]
  return <>
    <section className="hero"><div className="hero-inner container">
      <div className="hero-copy-block"><p className="eyebrow"><span>✦</span> COURIER & ONLINE SERVICES</p>
        <h1>Ship smarter.<br /><em>Stay connected.</em></h1>
        <p className="hero-description">Courier pickups, intercity parcels and document support, brought together in one clear, responsive experience.</p>
        <div className="hero-actions"><button className="button button-primary" onClick={() => go('services')}>Explore services <ArrowUpRight size={18} /></button><button className="button button-light" onClick={() => go('contact')}>Contact us <ArrowRight size={18} /></button></div>
        <div className="hero-trust"><span className="trust-check"><Check size={16} /></span><span><strong>One point of contact</strong><small>From first enquiry to final handoff</small></span></div>
      </div>
      <HeroObjectScene />
    </div><div className="hero-feature-wrap container"><div className="hero-feature-strip">
      {[[Truck, 'Same-day courier', 'Local pickup support', 'services'], [FileText, 'Document desk', 'Forms, scans and more', 'services'], [Box, 'Intercity parcels', 'Move across India', 'services'], [ClipboardList, 'Clear request flow', 'Know the next step', 'track']].map(([Icon, title, text, target]) => <button key={title} onClick={() => go(target)}><span className="feature-icon"><Icon size={21} /></span><span className="feature-text"><strong>{title}</strong><small>{text}</small></span><ArrowRight className="feature-arrow" size={15} /></button>)}
    </div></div></section>

    <section className="section section-solutions container"><SectionHeading kicker="ONE DESK. MORE POSSIBILITIES." title="Choose what your day needs." text="From a single document to regular business dispatch, start with a service that fits." /><div className="solution-grid">
      {services.map((service, i) => <article className="solution-card reveal" key={service.title}><div className="solution-card-head"><span className="round-icon"><service.icon size={23} /></span><h3>{service.title}</h3></div><div className="solution-image"><img src={service.image} alt={service.alt} /><span>{service.tag}</span></div><div className="solution-card-bottom"><p>{service.desc}</p><button onClick={() => go(i === 2 ? 'contact' : 'services')}>Explore service <ArrowRight size={18} /></button></div></article>)}
    </div></section>

    <section className="estimate-band"><div className="container estimate-layout"><div className="reveal"><p className="section-kicker">QUICK ESTIMATE</p><h2>Start with the route.<br />Know what to ask.</h2><p>Enter two PIN codes and continue to an indicative calculator. Final rates depend on shipment details.</p></div><form className="quick-form reveal" onSubmit={e => { e.preventDefault(); if (!/^\d{6}$/.test(from) || !/^\d{6}$/.test(to)) { setError('Enter two valid 6-digit PIN codes.'); return }; sessionStorage.setItem('sodhi-route', JSON.stringify({ from, to })); go('rate-calculator') }}><div className="quick-fields"><label>Pickup PIN<input inputMode="numeric" maxLength="6" placeholder="110001" value={from} onChange={e => setFrom(e.target.value.replace(/\D/g, ''))} /></label><ArrowRight size={21} /><label>Delivery PIN<input inputMode="numeric" maxLength="6" placeholder="400001" value={to} onChange={e => setTo(e.target.value.replace(/\D/g, ''))} /></label></div><div className="quick-bottom"><small role="status">{error || 'Route, weight and speed shape the estimate.'}</small><button className="button button-primary" type="submit">Continue <ArrowRight size={17} /></button></div></form></div></section>

    <ControlTowerSection go={go} />

    <BusinessNetworkSection go={go} />

    <section className="section journey container"><SectionHeading kicker="THE SODHI JOURNEY" title="From request to received." text="A simple sequence, with a person to reach at every important step." /><div className="journey-line">{[['01', 'Enquire', 'Share the route and service'], ['02', 'Confirm', 'Review the right option'], ['03', 'Handover', 'Pickup or desk processing'], ['04', 'Complete', 'Receive the final update']].map(([num, title, text]) => <div className="journey-step reveal" key={num}><span>{num}</span><strong>{title}</strong><small>{text}</small></div>)}</div></section>

    <section className="operations"><div className="container operations-grid"><div className="operations-copy reveal"><p className="section-kicker">BEHIND EVERY REQUEST</p><h2>Practical support, from first detail to final handoff.</h2><p>One coordinated desk helps keep courier movement and document tasks organised, without chasing multiple channels.</p><button className="button button-primary" onClick={() => go('services')}>Explore services <ArrowRight size={18} /></button><div className="operations-points"><span><Headphones size={20} /> Direct support</span><span><ShieldCheck size={20} /> Clear handoffs</span></div></div><div className="operations-photo reveal"><img src="https://images.unsplash.com/photo-1586528116493-a029325540fa?auto=format&fit=crop&w=1600&q=85" alt="Modern logistics facility with parcels ready to move" /><div><strong>One connected service desk</strong><span>Courier • Documents • Business</span></div></div></div></section>

    <section className="section audience container"><SectionHeading kicker="WHO WE WORK WITH" title="Made for everyday movement." /><div className="audience-list">{['Individuals', 'Local shops', 'Online sellers', 'Growing offices', 'Service centres', 'Business teams'].map((item, i) => <span className="reveal" key={item}><small>{String(i + 1).padStart(2, '0')}</small>{item}</span>)}</div></section>

    <ReviewSection />

    <section className="faq-section"><div className="container faq-grid"><div className="reveal"><p className="section-kicker">COMMON QUESTIONS</p><h2>A few things worth knowing.</h2><p>For a specific shipment or document request, the contact page is the best place to start.</p><button className="text-link" onClick={() => go('contact')}>Contact the desk <ArrowRight size={18} /></button></div><div className="faq-list">{faqs.map(([question, answer], i) => <article className="faq-item reveal" key={question}><button aria-expanded={faq === i} onClick={() => setFaq(faq === i ? -1 : i)}>{question}<ChevronDown size={21} /></button>{faq === i && <p>{answer}</p>}</article>)}</div></div></section>
    <BottomCta go={go} />
  </>
}

function HeroObjectScene() {
  const mountRef = useRef(null)
  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return undefined

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 80)
    camera.position.set(5.2, 4.5, 8.8)
    camera.lookAt(0, 0.2, 0)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.7))
    renderer.setClearColor(0x000000, 0)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    mount.appendChild(renderer.domElement)

    scene.add(new THREE.AmbientLight(0xdde8f4, 1.45))
    const key = new THREE.DirectionalLight(0xffffff, 3.2)
    key.position.set(4, 8, 5)
    key.castShadow = true
    key.shadow.mapSize.set(1024, 1024)
    scene.add(key)
    const rim = new THREE.PointLight(0xf46b25, 38, 10)
    rim.position.set(-3.5, 2.5, 2.8)
    scene.add(rim)
    const cool = new THREE.PointLight(0x2e78c8, 28, 12)
    cool.position.set(3.2, 2.4, -2.5)
    scene.add(cool)

    const group = new THREE.Group()
    group.rotation.x = -0.08
    scene.add(group)

    const metal = new THREE.MeshStandardMaterial({ color: 0xd9e4ef, roughness: 0.38, metalness: 0.38 })
    const navy = new THREE.MeshStandardMaterial({ color: 0x102b45, roughness: 0.42, metalness: 0.32 })
    const orange = new THREE.MeshStandardMaterial({ color: 0xf46b25, emissive: 0x421402, roughness: 0.28, metalness: 0.18 })
    const glass = new THREE.MeshPhysicalMaterial({ color: 0xbdd7f2, transparent: true, opacity: 0.24, roughness: 0.16, metalness: 0.05, transmission: 0.18 })

    const floor = new THREE.Mesh(new THREE.BoxGeometry(6.8, 0.08, 4.15), metal)
    floor.position.y = -0.48
    floor.receiveShadow = true
    group.add(floor)

    const floorLines = new THREE.Group()
    for (let i = -3; i <= 3; i += 1) {
      const line = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.012, 4.2), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.32 }))
      line.position.set(i, -0.42, 0)
      floorLines.add(line)
    }
    group.add(floorLines)

    const laneMaterial = new THREE.MeshStandardMaterial({ color: 0x254866, roughness: 0.33, metalness: 0.42 })
    const beltMaterial = new THREE.MeshStandardMaterial({ color: 0x0c2137, roughness: 0.62, metalness: 0.24 })
    const lanes = [-1.25, 0, 1.25].map((z, index) => {
      const lane = new THREE.Group()
      const base = new THREE.Mesh(new THREE.BoxGeometry(5.8, 0.1, 0.38), laneMaterial)
      const belt = new THREE.Mesh(new THREE.BoxGeometry(5.55, 0.035, 0.22), beltMaterial)
      base.castShadow = true
      base.receiveShadow = true
      belt.position.y = 0.08
      lane.add(base, belt)
      lane.position.set(0, -0.22 + index * 0.05, z)
      lane.rotation.y = index === 1 ? 0 : (index - 1) * 0.1
      group.add(lane)
      return lane
    })

    const hub = new THREE.Group()
    const tower = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.62, 1.35, 8), navy)
    tower.position.y = 0.32
    tower.castShadow = true
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.08, 48), orange)
    cap.position.y = 1.03
    hub.add(tower, cap)
    group.add(hub)

    const orbit = new THREE.Mesh(new THREE.TorusGeometry(1.35, 0.012, 8, 96), new THREE.MeshBasicMaterial({ color: 0xf46b25, transparent: true, opacity: 0.78 }))
    orbit.rotation.x = Math.PI / 2
    orbit.position.y = 0.02
    group.add(orbit)

    const route = new THREE.Group()
    ;[
      [0, -0.05, 0, 0, 0, 0],
      [1.9, 0.02, 0.95, 0, -0.36, 0],
      [-1.9, 0.02, -0.9, 0, 0.34, 0],
    ].forEach(([x, y, z, rx, ry, rz]) => {
      const slab = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.025, 0.13), glass)
      slab.position.set(x, y, z)
      slab.rotation.set(rx, ry, rz)
      route.add(slab)
    })
    group.add(route)

    const moverMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.34, metalness: 0.18 })
    const moverAccent = new THREE.MeshStandardMaterial({ color: 0xf46b25, roughness: 0.26, metalness: 0.16 })
    const movers = Array.from({ length: 6 }, (_, index) => {
      const item = new THREE.Group()
      const body = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.24, 0.28), moverMat)
      const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.03, 0.05), moverAccent)
      stripe.position.y = 0.135
      body.castShadow = true
      item.add(body, stripe)
      item.userData.phase = index / 6
      item.userData.lane = index % 3
      group.add(item)
      return item
    })

    const nodeGeo = new THREE.SphereGeometry(0.09, 24, 16)
    const nodeMat = new THREE.MeshStandardMaterial({ color: 0xf46b25, emissive: 0x6b2105, roughness: 0.2 })
    const nodes = [[-2.8, 0.02, -1.55], [2.75, 0.02, -1.1], [-2.65, 0.02, 1.35], [2.45, 0.02, 1.55]].map(position => {
      const node = new THREE.Mesh(nodeGeo, nodeMat)
      node.position.set(...position)
      group.add(node)
      return node
    })

    const resize = () => {
      const { width, height } = mount.getBoundingClientRect()
      renderer.setSize(width, height, false)
      camera.aspect = width / Math.max(height, 1)
      camera.updateProjectionMatrix()
    }
    resize()
    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(mount)

    const clock = new THREE.Clock()
    let frameId = 0
    const animate = () => {
      const elapsed = clock.getElapsedTime()
      group.rotation.y = Math.sin(elapsed * 0.22) * 0.16 - 0.14
      orbit.rotation.z = elapsed * 0.35
      hub.rotation.y = elapsed * 0.32
      lanes.forEach((lane, index) => {
        lane.position.x = Math.sin(elapsed * 0.9 + index) * 0.03
      })
      movers.forEach(item => {
        const t = (elapsed * 0.16 + item.userData.phase) % 1
        const x = -2.75 + t * 5.5
        const laneZ = [-1.25, 0, 1.25][item.userData.lane]
        item.position.set(x, 0.02 + Math.sin(elapsed * 2 + item.userData.phase * 6) * 0.018, laneZ)
        item.rotation.y = Math.sin(elapsed + item.userData.phase * 3) * 0.08
      })
      nodes.forEach((node, index) => node.scale.setScalar(1 + Math.sin(elapsed * 2.4 + index) * 0.12))
      renderer.render(scene, camera)
      frameId = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      cancelAnimationFrame(frameId)
      resizeObserver.disconnect()
      renderer.dispose()
      scene.traverse(object => {
        if (object.geometry) object.geometry.dispose()
        if (object.material) {
          const materials = Array.isArray(object.material) ? object.material : [object.material]
          materials.forEach(material => material.dispose())
        }
      })
      renderer.domElement.remove()
    }
  }, [])

  return <div className="hero-visual hero-object-scene" aria-label="Professional 3D logistics object animation">
    <div className="object-stage" ref={mountRef} />
    <div className="object-label object-label-top"><span /> Live movement</div>
    <div className="object-label object-label-bottom"><strong>3D logistics flow</strong><small>Subtle cargo movement through the desk</small></div>
    <div className="object-stat"><span>Live</span><small>dispatch view</small></div>
  </div>
}

function ControlTowerSection({ go }) {
  return <section className="control-tower"><div className="container control-grid">
    <div className="control-copy reveal">
      <p className="section-kicker">LIVE MOVEMENT VIEW</p>
      <h2>See every request move before the next call.</h2>
      <p>Animated route signals show the kind of connected dispatch experience customers expect from a modern courier desk.</p>
      <ul>
        <li><Zap size={22} /> Spot urgent handoffs early</li>
        <li><ShieldCheck size={22} /> Keep service decisions clear</li>
        <li><Activity size={22} /> Track movement from one view</li>
      </ul>
      <button className="button button-white" onClick={() => go('track')}>Open tracking view <ArrowRight size={20} /></button>
    </div>
    <div className="network-card reveal" aria-label="Animated courier network overview">
      <div className="network-head"><span>Network overview</span><strong>LIVE</strong></div>
      <div className="network-map">
        <div className="route-arc arc-one"><span /></div>
        <div className="route-arc arc-two"><span /></div>
        <div className="route-arc arc-three"><span /></div>
        <div className="network-orbit">
          <span className="continent c-one" />
          <span className="continent c-two" />
          <span className="continent c-three" />
          <span className="continent c-four" />
        </div>
        <span className="signal-dot dot-one" />
        <span className="signal-dot dot-two" />
        <span className="signal-dot dot-three" />
        <span className="signal-dot dot-four" />
      </div>
      <div className="network-stats">
        <div><span>On-time handoff</span><strong>94.8%</strong><small>+4.2%</small></div>
        <div><span>Active requests</span><strong>1,840</strong><small>Live desk</small></div>
        <div><span>Pending exceptions</span><strong>0.7%</strong><small>-18%</small></div>
      </div>
    </div>
  </div></section>
}

function BusinessNetworkSection({ go }) {
  const serviceOptions = [[PackageCheck, 'Express parcel'], [Truck, 'Surface cargo'], [ShieldCheck, 'Safe handling'], [MapPin, 'Pan India delivery']]
  const supportOptions = [[ClipboardList, 'Dispatch planning'], [Search, 'Status visibility'], [FileText, 'Clear estimates'], [Headphones, 'Direct assistance']]
  return <section className="business-network"><div className="container business-network-grid">
    <div className="business-network-copy reveal">
      <p className="section-kicker">SODHI BUSINESS NETWORK</p>
      <h2>Built for every shipping decision.</h2>
      <p>Clear options, useful information and direct support at every step of your delivery journey.</p>
    </div>
    <NetworkChoiceCard title="Shipment services" text="Choose the right movement for every parcel." items={serviceOptions} />
    <NetworkChoiceCard title="Business support" text="Keep recurring dispatch work organised." items={supportOptions} />
    {[
      ['Doorstep', 'Pickup support', 'contact'],
      ['Pan India', 'Delivery coverage', 'services'],
      ['One team', 'Direct coordination', 'track'],
    ].map(([title, text, target]) => <button className="network-stat-card reveal" type="button" key={title} onClick={() => go(target)}>
      <strong>{title}</strong>
      <span>{text}</span>
      <ArrowRight size={19} />
    </button>)}
  </div></section>
}

function NetworkChoiceCard({ title, text, items }) {
  return <article className="network-choice-card reveal">
    <h3>{title}</h3>
    <p>{text}</p>
    <div className="network-choice-grid">
      {items.map(([Icon, label]) => <span key={label}><Icon size={18} />{label}</span>)}
    </div>
  </article>
}

function ReviewSection() {
  return <section className="review-section"><div className="container">
    <div className="section-heading review-heading reveal">
      <p className="section-kicker">CLIENT REVIEWS</p>
      <h2>Trusted for clear delivery decisions.</h2>
    </div>
    <div className="review-grid">
      <article className="featured-review reveal">
        <Quote size={42} />
        <p>Sodhi Online Services replaced scattered courier decisions with one dependable workflow. We can plan pickups, confirm document needs and keep people informed without repeated follow-ups.</p>
        <div className="impact-panel">
          <span>IMPACT</span>
          <div><strong>38%</strong><small>less coordination time</small></div>
          <div><strong>94%</strong><small>clearer handoff confidence</small></div>
        </div>
        <div className="review-author dark">
          <span>SE</span>
          <div><strong>Sodhi Enterprise Desk</strong><small>Courier and document support</small></div>
        </div>
      </article>
      <div className="review-cards">
        {reviews.map(item => <article className="review-card reveal" key={item.name}>
          <div className="review-stars" aria-label="Five star review">★★★★★</div>
          <p>“{item.quote}”</p>
          <span className="review-tag">{item.tag}</span>
          <div className="review-author">
            <span>{item.initials}</span>
            <div><strong>{item.name}</strong><small>{item.role}</small></div>
          </div>
        </article>)}
      </div>
    </div>
  </div></section>
}

function Services({ go }) { return <><PageIntro kicker="WHAT WE DO" title="Move every handoff with one clear desk." text="Courier movement, online assistance and recurring business support, all organised around a reachable local desk." /><section className="section container"><div className="service-detail-list">{services.map((item, i) => <article className="service-detail reveal" key={item.title}><div className="service-detail-image"><img src={item.image} alt={item.alt} /></div><div className="service-detail-copy"><span className="section-kicker">0{i + 1} / {item.tag}</span><h2>{item.title}</h2><p>{item.desc}</p><ul><li><Check size={17} /> Clear service selection</li><li><Check size={17} /> Coordinated request handoff</li><li><Check size={17} /> Direct follow-up</li></ul><button className="text-link" onClick={() => go('contact')}>Enquire about this service <ArrowRight size={18} /></button></div></article>)}</div></section><BottomCta go={go} /></> }

function RateCalculator({ go }) {
  const saved = (() => { try { return JSON.parse(sessionStorage.getItem('sodhi-route') || '{}') } catch { return {} } })()
  const [from, setFrom] = useState(saved.from || '')
  const [to, setTo] = useState(saved.to || '')
  const [weight, setWeight] = useState('1')
  const [speed, setSpeed] = useState('standard')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const calculate = e => { e.preventDefault(); if (!/^\d{6}$/.test(from) || !/^\d{6}$/.test(to) || !Number.isFinite(Number(weight)) || Number(weight) <= 0) { setError('Add valid 6-digit PIN codes and parcel weight.'); setResult(null); return } const kg = Number(weight); const intercity = from.slice(0, 2) !== to.slice(0, 2); const amount = Math.round(((intercity ? 130 : 75) + Math.max(0, kg - 1) * (intercity ? 35 : 20)) * (speed === 'express' ? 1.7 : 1)); setResult({ low: amount, high: Math.round(amount * 1.32), intercity }); setError('') }
  return <><PageIntro kicker="INSTANT RATE ENGINE" title="Know your shipping cost before you commit." text="Compare service options and estimate charges using shipment weight, dimensions and destination without hidden surprises." /><section className="section container calculator-layout"><form className="calculator-form" onSubmit={calculate}><div className="form-heading"><h2>Shipment details</h2><p>Tell us the basics to see an indicative range.</p></div><div className="form-row"><label>Pickup PIN<input inputMode="numeric" maxLength="6" placeholder="110001" value={from} onChange={e => setFrom(e.target.value.replace(/\D/g, ''))} /></label><label>Delivery PIN<input inputMode="numeric" maxLength="6" placeholder="400001" value={to} onChange={e => setTo(e.target.value.replace(/\D/g, ''))} /></label></div><div className="form-row"><label>Weight (kg)<input type="number" min="0.1" step="0.1" value={weight} onChange={e => setWeight(e.target.value)} /></label><label>Service speed<select value={speed} onChange={e => setSpeed(e.target.value)}><option value="standard">Standard</option><option value="express">Express</option></select></label></div>{error && <p className="form-error" role="alert">{error}</p>}<button className="button button-primary" type="submit">Calculate estimate <ArrowRight size={18} /></button></form><aside className="estimate-result"><span className="section-kicker">INDICATIVE RANGE</span>{result ? <><h2>₹{result.low} – ₹{result.high}</h2><p>{result.intercity ? 'Intercity' : 'Local'} route · {weight} kg · {speed === 'express' ? 'Express' : 'Standard'}</p><div className="result-note"><ShieldCheck size={22} /><span>Final cost depends on dimensions, service availability, address and handling needs.</span></div><button className="button button-dark" onClick={() => go('contact')}>Enquire about this route <ArrowRight size={18} /></button></> : <><h2>Your estimate appears here.</h2><p>Enter shipment details and calculate to preview a planning range.</p><div className="result-placeholder"><MapPin size={28} /><span>Pickup <ArrowRight size={20} /> Delivery</span></div></>}</aside></section></>
}

function TrackPage() {
  const [reference, setReference] = useState('')
  const [searched, setSearched] = useState(false)
  return <><PageIntro kicker="SHIPMENT TRACKING" title="Track every stage without chasing updates." text="Track requests will appear here once a live carrier connection is enabled. Preview the sample journey below." /><section className="section container tracking-layout"><form className="tracking-form" onSubmit={e => { e.preventDefault(); setSearched(true) }}><label>Shipment or request ID<div className="search-field"><Search size={21} /><input required placeholder="Enter your reference" value={reference} onChange={e => { setReference(e.target.value); setSearched(false) }} /></div></label><button className="button button-primary" type="submit">Track shipment <ArrowRight size={18} /></button>{searched && <p className="form-notice" role="status">Live lookup is not connected yet. Please contact the desk for a real shipment update.</p>}</form><div className="tracking-demo"><div className="tracking-demo-top"><span className="section-kicker">SAMPLE JOURNEY</span><span className="demo-pill">DEMO</span></div><h2>Moving through the network</h2><p>Sample reference: SOS-DEMO-2026</p><div className="tracking-steps">{[['Booked', 'Request created'], ['Collected', 'Handover completed'], ['In transit', 'Moving to destination'], ['Delivered', 'Awaiting confirmation']].map(([title, text], i) => <div className={i < 3 ? 'done' : ''} key={title}><span>{i < 2 ? <Check size={16} /> : i + 1}</span><div><strong>{title}</strong><small>{text}</small></div></div>)}</div></div></section></>
}

function Contact() {
  const [copied, setCopied] = useState(false)
  const [form, setForm] = useState({ name: '', contact: '', service: 'Courier pickup', details: '' })
  const update = (key, value) => { setForm({ ...form, [key]: value }); setCopied(false) }
  const prepare = async e => { e.preventDefault(); const message = `Sodhi Online Services enquiry\nName: ${form.name}\nContact: ${form.contact}\nService: ${form.service}\nDetails: ${form.details}\nDesk address: ${businessAddress.join(', ')}`; try { await navigator.clipboard.writeText(message); setCopied(true) } catch { setCopied(false) } }
  return <><PageIntro kicker="CONTACT THE DESK" title="Tell us the move. We'll shape the next step." text="Share a few details and prepare an enquiry you can send through your preferred channel. No request is submitted from this demo site." /><section className="section container contact-layout"><form className="contact-form" onSubmit={prepare}><div className="form-heading"><h2>Prepare your enquiry</h2><p>Your details stay on this page until you copy them.</p></div><div className="form-row"><label>Your name<input required value={form.name} onChange={e => update('name', e.target.value)} placeholder="Your name" /></label><label>Phone or email<input required value={form.contact} onChange={e => update('contact', e.target.value)} placeholder="How to reach you" /></label></div><label>Service<select value={form.service} onChange={e => update('service', e.target.value)}><option>Courier pickup</option><option>Intercity shipping</option><option>Document desk</option><option>Business dispatch</option></select></label><label>Request details<textarea required rows="5" value={form.details} onChange={e => update('details', e.target.value)} placeholder="Pickup area, destination, parcel or document details" /></label><button className="button button-primary" type="submit">Copy enquiry <ClipboardList size={18} /></button>{copied && <p className="form-success" role="status">Enquiry copied. Paste it into your preferred messaging or email app.</p>}</form><aside className="contact-aside"><span className="section-kicker">HOW WE HELP</span><h2>One conversation, clear next steps.</h2><p>Tell the desk the service, route and timing you have in mind.</p><div><Clock3 size={22} /><span><strong>Plan the request</strong><small>Share the job and preferred timing.</small></span></div><div><Headphones size={22} /><span><strong>Confirm details</strong><small>Review availability and final quote directly.</small></span></div><div><PackageCheck size={22} /><span><strong>Move forward</strong><small>Arrange pickup or document support.</small></span></div><div className="address-card"><MapPin size={22} /><span><strong>Visit Sodhi Online Services</strong>{businessAddress.map(line => <small key={line}>{line}</small>)}</span></div></aside></section></>
}

function Login() { return <><PageIntro kicker="CUSTOMER ACCESS" title="Customer access for clearer dispatch." text="The account portal is not connected yet. Until it launches, use the service and contact pages to plan a request." /><section className="section container login-panel"><div className="login-visual"><img src={services[1].image} alt="Parcels being prepared at a logistics facility" /></div><div><span className="round-icon"><ShieldCheck size={28} /></span><h2>Customer sign-in</h2><p>Secure accounts and live shipment history will appear here when the customer portal is ready.</p><a className="button button-primary" href="#contact">Contact the desk <ArrowRight size={18} /></a></div></section></> }
function SectionHeading({ kicker, title, text }) { return <div className="section-heading reveal"><p className="section-kicker">{kicker}</p><h2>{title}</h2>{text && <p>{text}</p>}</div> }
function PageMotionScene({ variant }) {
  const mountRef = useRef(null)
  const content = {
    rate: { kicker: 'RATE ENGINE', value: '₹128.40', caption: 'Delhi -> Bengaluru', top: '2.4 kg', right: 'Zone C', bottom: 'Express' },
    track: { kicker: 'LIVE TRACKING', value: '03 STOPS', caption: 'Collected -> In transit', top: 'SOS-2026', right: 'Live', bottom: 'On route' },
    contact: { kicker: 'SERVICE DESK', value: '1 DESK', caption: 'Pickup, documents, support', top: 'Direct', right: 'Ready', bottom: 'Same day' },
    login: { kicker: 'CUSTOMER ACCESS', value: 'SECURE', caption: 'Dispatch workspace preview', top: 'Private', right: 'Portal', bottom: 'History' },
    services: { kicker: 'SERVICE FLOW', value: '4 MODES', caption: 'Courier, parcels, desk, dispatch', top: 'Courier', right: 'Docs', bottom: 'Business' },
  }[variant] || { kicker: 'SERVICE FLOW', value: '4 MODES', caption: 'Courier, parcels, desk, dispatch', top: 'Courier', right: 'Docs', bottom: 'Business' }
  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return undefined

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(33, 1, 0.1, 80)
    camera.position.set(4.9, 3.4, 7.9)
    camera.lookAt(0, 0.05, 0)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6))
    renderer.setClearColor(0x000000, 0)
    renderer.shadowMap.enabled = true
    mount.appendChild(renderer.domElement)

    scene.add(new THREE.AmbientLight(0xe5eef8, 1.55))
    const key = new THREE.DirectionalLight(0xffffff, 2.8)
    key.position.set(4, 7, 5)
    key.castShadow = true
    scene.add(key)
    const accent = new THREE.PointLight(0xf46b25, 30, 9)
    accent.position.set(-3, 2.2, 2.5)
    scene.add(accent)
    const cool = new THREE.PointLight(0x2d70d7, 22, 10)
    cool.position.set(3, 2, -2.5)
    scene.add(cool)

    const group = new THREE.Group()
    scene.add(group)
    const navy = new THREE.MeshStandardMaterial({ color: 0x0d2b53, roughness: 0.34, metalness: 0.28 })
    const orange = new THREE.MeshStandardMaterial({ color: 0xf46b25, emissive: 0x3b1203, roughness: 0.28, metalness: 0.16 })
    const blue = new THREE.MeshStandardMaterial({ color: 0x2d6fd2, roughness: 0.3, metalness: 0.22 })
    const glass = new THREE.MeshPhysicalMaterial({ color: 0xbfd8f2, transparent: true, opacity: 0.24, roughness: 0.12, metalness: 0.05, transmission: 0.12 })
    const white = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.38, metalness: 0.12 })

    const plate = new THREE.Mesh(new THREE.BoxGeometry(2.95, 2.05, 0.28), navy)
    plate.position.set(0, 0.05, 0)
    plate.rotation.x = -0.08
    plate.rotation.y = -0.18
    plate.castShadow = true
    group.add(plate)

    const glow = new THREE.Mesh(new THREE.TorusGeometry(2.08, 0.012, 12, 120), glass)
    glow.rotation.x = Math.PI / 2
    glow.position.y = -0.08
    group.add(glow)

    const halo = new THREE.Mesh(new THREE.TorusGeometry(1.36, 0.018, 12, 96), blue)
    halo.rotation.x = Math.PI / 2
    halo.position.y = -0.11
    group.add(halo)

    const floaters = []
    const addFloater = (phase = 0, material = white, scale = 1) => {
      const item = new THREE.Group()
      const body = new THREE.Mesh(new THREE.BoxGeometry(0.34 * scale, 0.26 * scale, 0.34 * scale), material)
      const strip = new THREE.Mesh(new THREE.BoxGeometry(0.36 * scale, 0.035 * scale, 0.07 * scale), orange)
      strip.position.y = 0.15 * scale
      body.castShadow = true
      item.add(body, strip)
      item.userData = { phase, radius: 2.05 + phase * 0.18 }
      group.add(item)
      floaters.push(item)
      return item
    }

    ;[0, 0.24, 0.5, 0.72].forEach((phase, index) => addFloater(phase, index === 1 ? orange : white, index === 2 ? 0.8 : 1))

    if (variant === 'rate') {
      const needle = new THREE.Mesh(new THREE.BoxGeometry(1.16, 0.035, 0.05), orange)
      needle.position.set(0.16, 0.24, 0.22)
      needle.userData.kind = 'needle'
      group.add(needle)
      const scale = new THREE.Mesh(new THREE.TorusGeometry(0.46, 0.025, 10, 64, Math.PI * 1.15), glass)
      scale.position.set(0, 0.34, 0.2)
      scale.rotation.x = Math.PI / 2
      group.add(scale)
    } else if (variant === 'track') {
      ;[-0.72, 0, 0.72].forEach((x, i) => {
        const tower = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.16, 0.58, 8), i === 1 ? orange : blue)
        tower.position.set(x, 0.18, 0.28)
        tower.castShadow = true
        group.add(tower)
      })
    } else if (variant === 'contact') {
      ;[-0.48, 0.48].forEach((x, i) => {
        const card = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.38, 0.045), i === 1 ? orange : white)
        card.position.set(x, 0.42, 0.26)
        card.rotation.x = -0.16
        group.add(card)
      })
    } else if (variant === 'login') {
      const lock = new THREE.Mesh(new THREE.TorusGeometry(0.36, 0.035, 8, 48), orange)
      lock.position.set(0, 0.56, 0.28)
      lock.rotation.x = Math.PI / 2
      group.add(lock)
    } else {
      const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.42, 0.56, 8), orange)
      hub.position.set(0, 0.42, 0.22)
      group.add(hub)
    }

    const resize = () => {
      const { width, height } = mount.getBoundingClientRect()
      renderer.setSize(width, height, false)
      camera.aspect = width / Math.max(height, 1)
      camera.updateProjectionMatrix()
    }
    resize()
    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(mount)

    const clock = new THREE.Clock()
    let frameId = 0
    const animate = () => {
      const elapsed = clock.getElapsedTime()
      group.rotation.y = Math.sin(elapsed * 0.26) * 0.15 - 0.1
      group.rotation.x = Math.sin(elapsed * 0.18) * 0.035
      glow.rotation.z = elapsed * 0.26
      halo.rotation.z = -elapsed * 0.38
      group.children.forEach(child => {
        if (child.userData.kind === 'needle') child.rotation.y = Math.sin(elapsed * 1.2) * 0.55
      })
      floaters.forEach(item => {
        const t = elapsed * 0.52 + item.userData.phase * Math.PI * 2
        const radius = item.userData.radius
        item.position.set(Math.cos(t) * radius, 0.02 + Math.sin(t * 1.4) * 0.12, Math.sin(t) * 0.92)
        item.rotation.y = elapsed * 0.7 + item.userData.phase * 2
        item.rotation.z = Math.sin(elapsed + item.userData.phase * 4) * 0.12
      })
      renderer.render(scene, camera)
      frameId = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      cancelAnimationFrame(frameId)
      resizeObserver.disconnect()
      renderer.dispose()
      scene.traverse(object => {
        if (object.geometry) object.geometry.dispose()
        if (object.material) {
          const materials = Array.isArray(object.material) ? object.material : [object.material]
          materials.forEach(material => material.dispose())
        }
      })
      renderer.domElement.remove()
    }
  }, [variant])

  return <div className={`page-motion-scene page-motion-${variant}`} aria-hidden="true">
    <div ref={mountRef} />
    <div className="motion-card-copy">
      <span>{content.kicker}</span>
      <strong>{content.value}</strong>
      <small>{content.caption}</small>
    </div>
    <span className="motion-chip chip-top">{content.top}</span>
    <span className="motion-chip chip-right">{content.right}</span>
    <span className="motion-chip chip-bottom">{content.bottom}</span>
  </div>
}
function getIntroVariant(kicker) {
  const key = kicker.toLowerCase()
  if (key.includes('rate')) return 'rate'
  if (key.includes('tracking')) return 'track'
  if (key.includes('contact')) return 'contact'
  if (key.includes('customer')) return 'login'
  return 'services'
}
function PageIntro({ kicker, title, text }) {
  const titleParts = splitIntroTitle(title)
  return <section className="page-intro"><div className="container page-intro-grid"><div className="page-intro-copy"><p className="section-kicker">{kicker}</p><h1>{titleParts ? <>{titleParts[0]}<br /><em>{titleParts[1]}</em></> : title}</h1><p>{text}</p></div><PageMotionScene variant={getIntroVariant(kicker)} /></div></section>
}
function splitIntroTitle(title) {
  const parts = {
    'Know your shipping cost before you commit.': ['Know your shipping cost', 'before you commit.'],
    'Move every handoff with one clear desk.': ['Move every handoff', 'with one clear desk.'],
    'Track every stage without chasing updates.': ['Track every stage', 'without chasing updates.'],
    "Tell us the move. We'll shape the next step.": ['Tell us the move.', "We'll shape the next step."],
    'Customer access for clearer dispatch.': ['Customer access', 'for clearer dispatch.'],
  }
  return parts[title]
}
function BottomCta({ go }) { return <section className="bottom-cta"><div className="container"><div><p className="section-kicker">LET'S GET IT MOVING</p><h2>Ready for a simpler way to send?</h2><p>Start with your route, or tell us what you need handled.</p></div><div><button className="button button-white" onClick={() => go('rate-calculator')}>Get an estimate <ArrowUpRight size={18} /></button><button className="button button-outline-white" onClick={() => go('contact')}>Contact us <ArrowRight size={18} /></button></div></div></section> }
function Footer({ go }) { return <footer className="footer"><div className="container footer-main"><div><img src="/sodhi-logo.svg" alt="Sodhi Online Services" /><p>Courier aggregation, document assistance and practical support through one clear service desk.</p></div><div><strong>Explore</strong><button onClick={() => go('services')}>Services</button><button onClick={() => go('rate-calculator')}>Rate Calculator</button><button onClick={() => go('track')}>Track Shipment</button></div><div><strong>Get started</strong><button onClick={() => go('contact')}>Contact</button><button onClick={() => go('login')}>Customer Access</button></div><div className="footer-address"><strong>Location</strong><span>Near Verka Plant</span><span>Barnala Raikot Road</span><span>Mahal Kalan, Barnala</span><span>Punjab 148104</span></div></div><div className="container footer-bottom"><span>© {new Date().getFullYear()} Sodhi Online Services</span><span>Built for clearer delivery decisions.</span></div></footer> }
function readRoute() { const value = window.location.hash.replace(/^#/, ''); return routes.includes(value) ? value : 'home' }
export default App
