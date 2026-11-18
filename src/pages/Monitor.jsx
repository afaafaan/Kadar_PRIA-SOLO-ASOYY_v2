import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { Link2, LocateFixed, Search, TriangleAlert } from 'lucide-react'
import { cities, findCity } from '../data/cities.js'
import {
  ACTIVITIES, LEVELS, dominantPollutant, level, nearestCity, num, verdict,
} from '../lib/aqi.js'
import { useToast } from '../lib/toast.jsx'
import { Chips, Dot, LevelBadge, PageHeader } from '../components/ui.jsx'
import AirMap from './AirMap.jsx'
import s from './Monitor.module.css'

const FILTERS = [
  ['all', `Semua (${cities.length})`],
  ...LEVELS.map((l) => [l.key, l.label, cities.filter((c) => level(c.aqi) === l).length])
    .filter(([, , n]) => n > 0)
    .map(([key, label, n]) => [key, `${label} (${n})`]),
]

const matches = (c, filter, query) =>
  (filter === 'all' || level(c.aqi).key === filter) &&
  c.name.toLowerCase().includes(query.trim().toLowerCase())

export default function Monitor() {
  const toast = useToast()
  const [params] = useSearchParams()
  const [name, setName] = useState(() => findCity(params.get('kota')).name)
  const [filter, setFilter] = useState('all')
  const [query, setQuery] = useState('')
  const city = findCity(name)
  const visible = useMemo(() => cities.filter((c) => matches(c, filter, query)), [filter, query])

  function select(next) {
    setName(next)
    // Keep the URL shareable without a router navigation (no page transition, no scroll reset).
    history.replaceState(history.state, '', `?kota=${encodeURIComponent(next)}`)
  }

  function changeFilter(key) {
    setFilter(key)
    const first = cities.find((c) => matches(c, key, query))
    if (first && !matches(city, key, query)) select(first.name)
  }

  function locate() {
    if (!navigator.geolocation) return toast('Perangkat ini tidak mendukung lokasi. Pilih kota dari daftar.')
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const nearest = nearestCity(cities, coords.latitude, coords.longitude)
        setFilter('all')
        setQuery('')
        select(nearest.name)
        toast(`Kota terdekat dari lokasimu: ${nearest.name}`)
      },
      () => toast('Izin lokasi ditolak. Pilih kota dari daftar.'),
    )
  }

  function copyLink() {
    navigator.clipboard
      ?.writeText(location.href)
      .then(() => toast('Tautan kota disalin.'))
      .catch(() => toast('Tautan tidak bisa disalin. Salin dari bilah alamat.'))
  }

  return (
    <div className="container">
      <title>Pantau udara · KADAR</title>
      <PageHeader crumb="Air Monitor" title="Udara setiap kota," accent="dalam satu pandangan.">
        Pilih kota di peta atau daftar untuk melihat AQI, polutan, dan saran aktivitas.
      </PageHeader>

      <div className={s.toolbar}>
        <Chips label="Saring menurut kategori" options={FILTERS} value={filter} onChange={changeFilter} />
        <div className={s.tools}>
          <label className={s.search}>
            <Search size={18} aria-hidden="true" />
            <span className="sr-only">Cari kota</span>
            <input type="search" placeholder="Cari kota" value={query} onChange={(e) => setQuery(e.target.value)} />
          </label>
          <button type="button" className="btn" onClick={locate}>
            <LocateFixed size={18} aria-hidden="true" />
            Kota terdekat
          </button>
        </div>
      </div>

      <div className={s.layout}>
        <div className={s.mapPanel}>
          <AirMap cities={visible} selected={city} onSelect={select} />
        </div>

        <div className={s.listPanel}>
          <h2 className="sr-only">Daftar kota</h2>
          {visible.length ? (
            <ul className={s.list}>
              {visible.map((c) => (
                <li key={c.name}>
                  <button type="button" className={s.row} aria-pressed={c.name === name} onClick={() => select(c.name)}>
                    <Dot aqi={c.aqi} />
                    <span className={s.rowName}>
                      {c.name}
                      <small>{c.region}</small>
                    </span>
                    <span className={`${s.rowAqi} num`}>{c.aqi}</span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className={s.empty}>
              <p>Tidak ada kota yang cocok dengan “{query}”.</p>
              <button type="button" className="btn" onClick={() => { setQuery(''); setFilter('all') }}>
                Tampilkan semua kota
              </button>
            </div>
          )}
        </div>
      </div>

      <CityDetail key={city.name} city={city} onCopy={copyLink} />
    </div>
  )
}

function CityDetail({ city, onCopy }) {
  const lv = level(city.aqi)
  return (
    <section className={s.detail} aria-labelledby="kota-terpilih">
      {city.aqi > 100 && (
        <p className={s.alert}>
          <TriangleAlert size={20} aria-hidden="true" />
          Udara di {city.name} sedang {lv.label.toLowerCase()}. {lv.advice}
        </p>
      )}

      <div className={s.detailHead}>
        <div>
          <h2 id="kota-terpilih">{city.name}</h2>
          <p className={s.region}>{city.region}</p>
        </div>
        <div className={s.score}>
          <span className={`${s.scoreNum} num`}>{city.aqi}</span>
          <span className={s.scoreMeta}>
            <LevelBadge aqi={city.aqi} />
            <small>US AQI</small>
          </span>
        </div>
      </div>

      <div className={s.detailBody}>
        <div className={s.advice}>
          <h3>{lv.advice}</h3>
          <p>{lv.detail}</p>
        </div>

        <dl className={s.pollutants}>
          <div><dt>PM2.5</dt><dd className="num">{num.format(city.pm25)} <small>µg/m³</small></dd></div>
          <div><dt>PM10</dt><dd className="num">{num.format(city.pm10)} <small>µg/m³</small></dd></div>
          <div><dt>Polutan dominan</dt><dd>{dominantPollutant(city)}</dd></div>
          <div><dt>Suhu</dt><dd className="num">{city.temp} <small>°C</small></dd></div>
        </dl>
      </div>

      <h3 className={s.subhead}>Saran aktivitas</h3>
      <ul className={s.activities}>
        {ACTIVITIES.map((a) => {
          const v = verdict(city.aqi, a)
          return (
            <li key={a.id}>
              <span>{a.name}</span>
              <span className={s.verdict} data-v={v.key}>{v.label}</span>
            </li>
          )
        })}
      </ul>

      <div className={s.detailActions}>
        <Link className="btn btn-primary" to={`/prakiraan?kota=${city.name}`}>Lihat prakiraan {city.name}</Link>
        <button type="button" className="btn" onClick={onCopy}>
          <Link2 size={18} aria-hidden="true" />
          Salin tautan kota
        </button>
      </div>
    </section>
  )
}
