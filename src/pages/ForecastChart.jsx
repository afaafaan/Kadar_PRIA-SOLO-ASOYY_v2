import { useLayoutEffect, useRef, useState } from 'react'
import { level, slotLabel, windowLabel } from '../lib/aqi.js'
import { aqiColor } from '../components/ui.jsx'
import s from './Forecast.module.css'

const H = 280
const PAD = { top: 20, right: 16, bottom: 32, left: 40 }

// Hand-built line chart: 12 points don't need a charting library.
// Drawn at the container's real pixel width so text never scales down on phones.
export default function ForecastChart({ name, values }) {
  const box = useRef(null)
  const [width, setWidth] = useState(0)
  const [active, setActive] = useState(null)

  useLayoutEffect(() => {
    const ro = new ResizeObserver(([e]) => setWidth(e.contentRect.width))
    ro.observe(box.current)
    return () => ro.disconnect()
  }, [])

  const max = Math.max(100, Math.ceil(Math.max(...values) / 50) * 50)
  const plotW = Math.max(0, width - PAD.left - PAD.right)
  const plotH = H - PAD.top - PAD.bottom
  const x = (i) => PAD.left + (i * plotW) / (values.length - 1)
  const y = (v) => PAD.top + plotH - (v / max) * plotH
  const line = values.map((v, i) => `${i ? 'L' : 'M'}${x(i)},${y(v)}`).join('')
  const area = `${line}L${x(values.length - 1)},${y(0)}L${x(0)},${y(0)}Z`
  const ticks = Array.from({ length: max / 50 + 1 }, (_, i) => i * 50)
  const narrow = width < 520

  function onPointerMove(e) {
    const left = e.currentTarget.getBoundingClientRect().left
    const i = Math.round(((e.clientX - left - PAD.left) / plotW) * (values.length - 1))
    setActive(Math.min(values.length - 1, Math.max(0, i)))
  }

  return (
    <div ref={box} className={s.chart}>
      {width > 0 && (
        <svg
          width={width}
          height={H}
          role="img"
          aria-label={`Grafik AQI ${name} per dua jam. Data lengkap ada di tabel di bawah grafik.`}
          onPointerMove={onPointerMove}
          onPointerLeave={() => setActive(null)}
        >
          {ticks.map((t) => (
            <g key={t} className={s.tick}>
              <line x1={PAD.left} x2={width - PAD.right} y1={y(t)} y2={y(t)} />
              <text x={PAD.left - 8} y={y(t)} dy="0.35em" textAnchor="end">{t}</text>
            </g>
          ))}
          {values.map((_, i) =>
            narrow && i % 3 ? null : (
              <text key={i} className={s.xLabel} x={x(i)} y={H - 8} textAnchor="middle">{slotLabel(i)}</text>
            ),
          )}

          <g key={name}>
            <path className={s.area} d={area} />
            <path className={s.line} d={line} pathLength="1" />
            {active !== null && (
              <line className={s.guide} x1={x(active)} x2={x(active)} y1={PAD.top} y2={y(0)} />
            )}
            {values.map((v, i) => (
              <circle
                key={i}
                className={s.point}
                cx={x(i)}
                cy={y(v)}
                r={active === i ? 7 : 5}
                style={{ '--c': aqiColor(v), '--i': i }}
              />
            ))}
          </g>
        </svg>
      )}

      {active !== null && (
        <div
          className={s.tooltip}
          style={{ left: x(active), top: y(values[active]) }}
          data-flip={x(active) > width - 120 ? '' : undefined}
          aria-hidden="true"
        >
          <strong>{windowLabel(active)}</strong>
          <span>AQI {values[active]}, {level(values[active]).label.toLowerCase()}</span>
        </div>
      )}
    </div>
  )
}
