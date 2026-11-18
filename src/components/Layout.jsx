import { useCallback, useEffect, useRef, useState, ViewTransition } from 'react'
import { Link, NavLink, Outlet, ScrollRestoration, useLocation } from 'react-router'
import { Menu, Moon, Sun } from 'lucide-react'
import Logo from './Logo.jsx'
import Intro from './Intro.jsx'
import { toggleScheme, useScheme } from '../lib/scheme.js'
import s from './Layout.module.css'

export const NAV = [
  ['/', 'Home'],
  ['/pantau', 'Air Monitor'],
  ['/prakiraan', 'Air Forecast'],
  ['/berita', 'News'],
  ['/edukasi', 'Education'],
  ['/tentang', 'About'],
]

export default function Layout() {
  const { pathname } = useLocation()
  const menu = useRef(null)
  const firstRender = useRef(true)
  const [intro, setIntro] = useState(() => 'intro' in document.documentElement.dataset)
  const endIntro = useCallback(() => {
    delete document.documentElement.dataset.intro
    setIntro(false)
  }, [])

  // After a client-side navigation: close the mobile menu and move focus to the new page heading.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    if (menu.current?.matches(':popover-open')) menu.current.hidePopover()
    document.querySelector('main h1')?.focus({ preventScroll: true })
  }, [pathname])

  return (
    <>
      <a className={s.skip} href="#konten">Langsung ke konten</a>

      {/* Navbar: pill melayang bergaya liquid glass */}
      <header className={s.header}>
        <div className={s.pill}>
          <Link to="/" className={s.brand} aria-label="KADAR, ke beranda">
            <Logo />
          </Link>
          <nav aria-label="Utama" className={s.nav}>
            <button type="button" className={s.menuButton} popoverTarget="menu-utama" aria-controls="menu-utama">
              <Menu size={18} aria-hidden="true" />
              Menu
            </button>
            <ul id="menu-utama" ref={menu} popover="auto" className={s.menu}>
              {NAV.map(([to, label]) => (
                <li key={to}>
                  <NavLink to={to} end={to === '/'} className={s.link}>{label}</NavLink>
                </li>
              ))}
            </ul>
          </nav>
          <div className={s.actions}>
            <ThemeButton />
            <Link to="/tentang#kontak" className={s.contact}>
              Hubungi kami <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>
      </header>

      <ViewTransition>
        <main id="konten" className={s.main}>
          <Outlet />
        </main>
      </ViewTransition>

      <Footer />
      <Clock />
      <ScrollRestoration />
      {intro && <Intro onDone={endIntro} />}
    </>
  )
}

function ThemeButton() {
  const dark = useScheme() === 'dark'
  return (
    <button
      type="button"
      className={s.theme}
      onClick={toggleScheme}
      aria-label={dark ? 'Pakai tampilan terang' : 'Pakai tampilan gelap'}
    >
      {dark ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
    </button>
  )
}

// Tanggal dan jam lokal perangkat, melayang di pojok kiri bawah di semua halaman.
function Clock() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  const date = new Intl.DateTimeFormat('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(now)
  const time = new Intl.DateTimeFormat('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).format(now)
  const zone = new Intl.DateTimeFormat('id-ID', { timeZoneName: 'short' }).formatToParts(now).find((p) => p.type === 'timeZoneName')?.value
  return (
    <div className={s.clock}>
      <span className={s.liveDot} aria-hidden="true" />
      <div>
        <strong className="num">{time}</strong>
        <small>{date} · {zone}</small>
      </div>
    </div>
  )
}

function Footer() {
  return (
    <footer className={s.footer}>
      <div className={`container ${s.footerGrid}`}>
        <div className={s.footerBrand}>
          <Logo className={s.footerLogo} />
          <p>Informasi kualitas udara untuk keputusan sehari-hari.</p>
        </div>

        <nav aria-label="Halaman">
          <ul className={s.footerList}>
            {NAV.slice(1).map(([to, label]) => <li key={to}><Link to={to}>{label}</Link></li>)}
          </ul>
        </nav>

        <ul className={s.footerList}>
          <li><a href="mailto:halo@kadarudara.demo">halo@kadarudara.demo</a></li>
          <li><a href="https://instagram.com/" target="_blank" rel="noopener">Instagram @kadar.udara</a></li>
          <li><a href="https://tiktok.com/" target="_blank" rel="noopener">TikTok @kabarudara</a></li>
        </ul>
      </div>

      <div className={`container ${s.legal}`}>
        <p>
          Semua angka AQI, polutan, suhu, dan prakiraan di situs ini adalah data simulasi untuk
          prototipe, bukan hasil pengukuran dan bukan dasar diagnosis medis.
        </p>
        <p>© 2026 KADAR (Kabar Udara)</p>
      </div>
    </footer>
  )
}
