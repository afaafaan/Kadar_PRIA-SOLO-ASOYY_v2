import { Link } from 'react-router'
import { level } from '../lib/aqi.js'
import s from './ui.module.css'

export const aqiColor = (aqi) => `var(--aqi-${level(aqi).key})`

export function PageHeader({ title, accent, crumb, children }) {
  return (
    <header className={s.pageHeader}>
      <p className={s.crumb}><Link to="/">Home</Link> / {crumb ?? title}</p>
      <h1 tabIndex={-1}>
        {title}
        {accent && <><br /><em>{accent}</em></>}
      </h1>
      {children && <p className={s.lede}>{children}</p>}
    </header>
  )
}

// Category label with a colour swatch; the text carries the meaning, colour only reinforces it.
export function LevelBadge({ aqi, className = '' }) {
  return (
    <span className={`${s.badge} ${className}`} style={{ '--c': aqiColor(aqi) }}>
      {level(aqi).label}
    </span>
  )
}

export function Dot({ aqi }) {
  return <span className={s.dot} style={{ '--c': aqiColor(aqi) }} aria-hidden="true" />
}

// Single-choice filter as toggle buttons.
export function Chips({ label, options, value, onChange }) {
  return (
    <div className={s.chips} role="group" aria-label={label}>
      {options.map(([key, text]) => (
        <button
          key={key}
          type="button"
          className={s.chip}
          aria-pressed={value === key}
          onClick={() => onChange(key)}
        >
          {text}
        </button>
      ))}
    </div>
  )
}
