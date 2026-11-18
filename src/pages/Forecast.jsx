import { useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { cities, findCity } from '../data/cities.js'
import { hourly } from '../data/forecast.js'
import { average, bestSlot, level, slotLabel, trend, windowLabel, worstSlot } from '../lib/aqi.js'
import { LevelBadge, PageHeader } from '../components/ui.jsx'
import ForecastChart from './ForecastChart.jsx'
import s from './Forecast.module.css'

export default function Forecast() {
  const [params] = useSearchParams()
  const [name, setName] = useState(() => findCity(params.get('kota')).name)
  const values = hourly[name]
  const avg = average(values)
  const best = bestSlot(values)
  const worst = worstSlot(values)

  function choose(next) {
    setName(next)
    history.replaceState(history.state, '', `?kota=${encodeURIComponent(next)}`)
  }

  return (
    <div className="container">
      <title>Prakiraan · KADAR</title>
      <PageHeader crumb="Air Forecast" title="Kenali pola udara," accent="rencanakan harimu.">
        Perkiraan AQI hari ini per dua jam. Pilih kota untuk melihat kapan udaranya paling bersih.
      </PageHeader>

      <section className={s.card} aria-labelledby="judul-prakiraan">
        <div className={s.head}>
          <h2 id="judul-prakiraan">{name}, hari ini</h2>
          <label className={s.select}>
            <span>Kota</span>
            <select value={name} onChange={(e) => choose(e.target.value)}>
              {cities.map((c) => <option key={c.name}>{c.name}</option>)}
            </select>
          </label>
        </div>

        <dl className={s.summary}>
          <div>
            <dt>Rata-rata AQI</dt>
            <dd><span className="num">{avg}</span> <LevelBadge aqi={avg} /></dd>
          </div>
          <div>
            <dt>Waktu terbaik</dt>
            <dd><span className="num">{windowLabel(best)}</span> <small>AQI {values[best]}</small></dd>
          </div>
          <div>
            <dt>Paling buruk</dt>
            <dd><span className="num">{windowLabel(worst)}</span> <small>AQI {values[worst]}</small></dd>
          </div>
          <div>
            <dt>Pola harian</dt>
            <dd className={s.trend}>{trend(values)}</dd>
          </div>
        </dl>

        <ForecastChart name={name} values={values} />

        <details className={s.table}>
          <summary>Lihat data sebagai tabel</summary>
          <table>
            <thead>
              <tr><th scope="col">Pukul</th><th scope="col">AQI</th><th scope="col">Kategori</th></tr>
            </thead>
            <tbody>
              {values.map((v, i) => (
                <tr key={i}>
                  <th scope="row" className="num">{slotLabel(i)}</th>
                  <td className="num">{v}</td>
                  <td>{level(v).label}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </details>
      </section>

      <section className={s.plan} aria-labelledby="rencana">
        <h2 id="rencana">Rencanakan harimu</h2>
        <ul>
          <li>Jadwalkan olahraga pukul {windowLabel(best)}, saat AQI paling rendah ({values[best]}).</li>
          <li>Hindari aktivitas berat sekitar pukul {windowLabel(worst)}, saat AQI mencapai {values[worst]}.</li>
          <li>Rata-rata hari ini {level(avg).label.toLowerCase()}. {level(avg).advice}</li>
        </ul>
        <Link to={`/pantau?kota=${name}`}>Lihat kondisi {name} sekarang</Link>
      </section>
    </div>
  )
}
