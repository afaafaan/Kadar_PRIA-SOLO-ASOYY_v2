import { useState } from 'react'
import { Link } from 'react-router'
import { BookOpen, ChartLine, MapPinned, Newspaper } from 'lucide-react'
import { cities, findCity } from '../data/cities.js'
import { hourly } from '../data/forecast.js'
import { bestSlot, currentSlot, level, num, slotLabel, windowLabel } from '../lib/aqi.js'
import { aqiColor, Dot } from '../components/ui.jsx'
import s from './Home.module.css'

// Kartu fitur: [rute, ikon, judul, deskripsi]
const FEATURES = [
  ['/pantau', MapPinned, 'Air Monitor', 'Peta AQI delapan kota, lengkap dengan saran aktivitas.'],
  ['/prakiraan', ChartLine, 'Air Forecast', 'Pola AQI hari ini per dua jam dan waktu terbaik untuk keluar rumah.'],
  ['/berita', Newspaper, 'News', 'Kabar kualitas udara dari WHO, UNEP, dan lembaga lainnya.'],
  ['/edukasi', BookOpen, 'Education', 'Arti angka AQI, jenis polutan, dan siapa yang paling rentan.'],
]

export default function Home() {
  const [name, setName] = useState('Jakarta')
  const city = findCity(name)
  const lv = level(city.aqi)
  const values = hourly[name]
  const best = bestSlot(values)
  const now = currentSlot()
  const scaleMax = Math.max(100, ...values)

  return (
    <>
      <title>KADAR · Kabar Udara</title>

      {/* Hero: pengantar + ilustrasi udara dengan kartu AQI kota terpilih */}
      <section className={s.heroSection} aria-labelledby="judul">
        <div className={`container ${s.heroGrid}`}>
          <div className={s.copy}>
            <div className={s.eyebrow}><i /> KENALI UDARA DI SEKITARMU</div>
            <h1 id="judul" tabIndex={-1}>
              Udara yang baik,<br />
              <em>awal hidup</em> yang lebih baik.
            </h1>
            <p className={s.heroLead}>
              Sebelum melangkah keluar, cari tahu kualitas udara di kotamu. KADAR membantumu memahami kondisi udara
              dan mengambil keputusan dengan lebih bijak.
            </p>
            <div className={s.heroButtons}>
              <Link className={s.btnPrimary} to="/pantau">Pantau kualitas udara <span aria-hidden="true">↗</span></Link>
              <Link className={s.textLink} to="/edukasi">Kenali kualitas udara <span aria-hidden="true">→</span></Link>
            </div>
          </div>

          <div className={s.visual} aria-hidden="true">
            <div className={s.orbit} />
            <div className={`${s.orbit} ${s.orbitTwo}`} />
            <div className={s.sun} />
            <div className={`${s.cloud} ${s.cloudA}`} />
            <div className={`${s.cloud} ${s.cloudB}`} />
            <div className={`${s.wind} ${s.windOne}`} />
            <div className={`${s.wind} ${s.windTwo}`} />
            <div className={`${s.wind} ${s.windThree}`} />
            <div className={`${s.floating} ${s.floatTop}`}><span className={s.liveDot} /> AIR QUALITY SNAPSHOT <b>DEMO</b></div>
            <div className={`${s.floating} ${s.floatBottom}`}>
              <div className={s.miniLabel}>KUALITAS UDARA HARI INI</div>
              <div className={s.miniScore}>
                <strong className="num">{city.aqi}</strong>
                <span style={{ color: aqiColor(city.aqi) }}>{lv.label.toUpperCase()}</span>
              </div>
              <div className={s.miniBar}><i style={{ width: `${Math.min(100, city.aqi / 2)}%`, background: aqiColor(city.aqi) }} /></div>
              <small>Contoh data · {name}</small>
            </div>
          </div>
        </div>
      </section>

      {/* Pantau sekilas: pilih kota, lihat kondisi dan prakiraan hari ini */}
      <section className={`container ${s.now}`} aria-labelledby="sekarang">
        <div className={s.quickIntro}>
          <span className={s.eyebrow}>PANTAU SEKILAS</span>
          <strong>Pilih kota untuk melihat kondisi dan waktu terbaik keluar rumah</strong>
        </div>

        <div className={s.picker} role="group" aria-label="Pilih kota">
          {cities.map((c) => (
            <button key={c.name} type="button" aria-pressed={c.name === name} onClick={() => setName(c.name)}>
              <span className={s.pickName}><Dot aqi={c.aqi} />{c.name}</span>
              <span className="num">{c.aqi}</span>
            </button>
          ))}
        </div>

        <div className={s.summary}>
          <div className={s.statement} aria-live="polite">
            <h2 id="sekarang">Udara di {name} sekarang {lv.label.toLowerCase()}.</h2>
            <p className={s.lede}>{lv.advice}</p>
          </div>

          <dl className={s.facts}>
            <div><dt>AQI</dt><dd className="num">{city.aqi}</dd></div>
            <div><dt>PM2.5</dt><dd className="num">{num.format(city.pm25)} <small>µg/m³</small></dd></div>
            <div><dt>PM10</dt><dd className="num">{num.format(city.pm10)} <small>µg/m³</small></dd></div>
            <div><dt>Suhu</dt><dd className="num">{city.temp} <small>°C</small></dd></div>
          </dl>

          <figure className={s.forecast}>
            <ol key={name} className={s.bars} aria-label={`Prakiraan AQI ${name} hari ini, per dua jam`}>
              {values.map((v, i) => (
                <li
                  key={i}
                  aria-current={i === now ? 'time' : undefined}
                  style={{ '--i': i, '--h': v / scaleMax, '--c': aqiColor(v) }}
                >
                  <span className={s.time}>{slotLabel(i)}</span>
                  <span className={s.track}>
                    <span className={`${s.value} num`}>{v}</span>
                    <span className={s.bar} aria-hidden="true" />
                    <span className="sr-only">{level(v).label}{i === now && ', sekarang'}</span>
                  </span>
                </li>
              ))}
            </ol>
            <figcaption className={s.caption}>
              <span>
                Waktu terbaik keluar rumah hari ini: <strong className="num">{windowLabel(best)}</strong>
              </span>
              <span className={s.actions}>
                <Link className="btn btn-primary" to={`/pantau?kota=${name}`}>Buka peta kota</Link>
                <Link className="btn" to={`/prakiraan?kota=${name}`}>Lihat prakiraan lengkap</Link>
              </span>
            </figcaption>
          </figure>
        </div>
      </section>

      {/* Kartu menuju tiap fitur */}
      <section className={`container ${s.section}`} aria-labelledby="fitur">
        <div className={s.sectionHead}>
          <div>
            <p className={s.crumb}>Home / Fitur</p>
            <h2 id="fitur">Pilih jalurmu,<br /><em>mulai dari sini.</em></h2>
          </div>
          <p>Setiap fitur punya halamannya sendiri. Klik kartu untuk membukanya.</p>
        </div>
        <ul className={s.features}>
          {FEATURES.map(([to, Icon, title, text]) => (
            <li key={to}>
              <Link to={to} className={s.feature}>
                <span className={s.featureIcon}><Icon size={22} strokeWidth={1.75} aria-hidden="true" /></span>
                <span className={s.featureTitle}>{title}</span>
                <span className={s.featureText}>{text}</span>
                <b className={s.featureGo}>Buka halaman <i aria-hidden="true">→</i></b>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className={`container ${s.section} ${s.about}`} aria-labelledby="tentang">
        <div>
          <div className={s.eyebrow}><i /> TENTANG KADAR</div>
          <h2 id="tentang">Cek udara dulu,<br /><em>baru beraktivitas.</em></h2>
        </div>
        <div className={s.aboutCopy}>
          <p>
            Udara yang buruk tidak selalu terlihat, tetapi dampaknya nyata bagi pernapasan. KADAR
            membantumu melihat kondisi udara sebelum berolahraga, berangkat kerja, atau mengantar anak
            ke sekolah.
          </p>
          <Link className={s.btnPrimary} to="/tentang">Tentang KADAR <span aria-hidden="true">↗</span></Link>
        </div>
      </section>
    </>
  )
}
