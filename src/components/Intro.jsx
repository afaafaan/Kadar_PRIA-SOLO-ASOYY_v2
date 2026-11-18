import { useCallback, useEffect, useRef, useState } from 'react'
import s from './Intro.module.css'

const SEEN = 'kadar-intro'

// Decided once, before React renders, so Home can hold its own entrance until the intro is over.
export function shouldPlayIntro() {
  if (location.pathname !== '/') return false
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return false
  try {
    if (sessionStorage.getItem(SEEN)) return false
    sessionStorage.setItem(SEEN, '1')
    return true
  } catch {
    return false
  }
}

// Landing dua tahap: Halaman 1 = GIF reveal logo (±4 dtk), Halaman 2 = loading bar lalu masuk ke Home.
// Tombol "Lewati" atau tombol keyboard apa pun melewati semuanya.
export default function Intro({ onDone }) {
  const [stage, setStage] = useState(1)
  const [pct, setPct] = useState(0)
  const [leaving, setLeaving] = useState(false)
  const finished = useRef(false)

  const finish = useCallback(() => {
    if (finished.current) return
    finished.current = true
    setLeaving(true)
    setTimeout(onDone, 600)
  }, [onDone])

  useEffect(() => {
    addEventListener('keydown', finish, { once: true })
    return () => removeEventListener('keydown', finish)
  }, [finish])

  // Halaman 1 -> 2
  useEffect(() => {
    const t = setTimeout(() => setStage(2), 4000)
    return () => clearTimeout(t)
  }, [])

  // Halaman 2: bar terisi penuh (±2,6 dtk), lalu otomatis ke Home
  useEffect(() => {
    if (stage !== 2) return
    const start = performance.now() + 500
    let raf
    const tick = (t) => {
      const k = Math.min(1, Math.max(0, (t - start) / 2600))
      setPct(Math.round((1 - (1 - k) ** 2) * 100))
      if (k < 1) raf = requestAnimationFrame(tick)
      else setTimeout(finish, 350)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [stage, finish])

  return (
    <div className={`${s.intro} ${leaving ? s.leaving : ''}`} role="status" aria-label="Memuat KADAR">
      <div className={`${s.stage} ${stage === 1 ? s.on : ''}`}>
        <img src="/kadar-intro.gif" alt="Animasi logo KADAR" />
      </div>
      <div className={`${s.stage} ${stage === 2 ? s.on : ''}`}>
        <p className={s.title}>Selamat Datang di Kadar</p>
        <p className={s.sub}>Kabar Udara · pantau, pahami, lindungi</p>
        <div className={s.bar} role="progressbar" aria-label="Memuat" aria-valuemin="0" aria-valuemax="100" aria-valuenow={pct}>
          <i style={{ width: `${pct}%` }} />
        </div>
        <small className={s.pct}>{pct}%</small>
      </div>
      <button type="button" className={s.skip} onClick={finish}>Lewati ↗</button>
    </div>
  )
}
