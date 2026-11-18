import { Link } from 'react-router'
import { HeartPulse, Microscope, ShieldCheck } from 'lucide-react'
import { LEVELS, rangeOf } from '../lib/aqi.js'
import { PageHeader } from '../components/ui.jsx'
import s from './Content.module.css'

const TOPICS = [
  [Microscope, 'Mengenal PM2.5 dan PM10', 'Partikel halus yang dapat masuk jauh ke saluran pernapasan.', 'https://www.who.int/news-room/fact-sheets/detail/ambient-(outdoor)-air-quality-and-health', 'WHO'],
  [HeartPulse, 'Siapa yang perlu lebih waspada?', 'Anak-anak, lansia, serta penderita gangguan napas atau jantung lebih rentan.', 'https://www.who.int/health-topics/air-pollution', 'WHO'],
  [ShieldCheck, 'Langkah sederhana saat udara buruk', 'Kurangi aktivitas berat di luar dan ikuti saran otoritas kesehatan.', 'https://www.airnow.gov/', 'AirNow'],
]

const FAQ = [
  ['Kapan sebaiknya saya memakai masker?', 'Saat AQI masuk kategori tidak sehat dan kamu harus berada di luar. Pilih masker yang menutup hidung dan mulut dengan rapat.'],
  ['Apakah udara pagi selalu bersih?', 'Tidak selalu. Di beberapa kota polusi justru menumpuk pada pagi hari. Cek halaman Prakiraan untuk waktu terbaik.'],
  ['Mengapa AQI berbeda di tiap aplikasi?', 'Sumber sensor dan standar perhitungannya bisa berbeda. KADAR memakai skala US AQI dan mencantumkan sumber data agar mudah dibandingkan.'],
]

export default function Education() {
  return (
    <div className="container">
      <title>Edukasi · KADAR</title>
      <PageHeader crumb="Education" title="Lebih paham udara," accent="lebih siap menjaga diri.">
        Kenali arti angka AQI, jenis polutan, dan kebiasaan sederhana untuk melindungi diri.
      </PageHeader>

      <section className={s.block} aria-labelledby="skala">
        <h2 id="skala">Arti angka AQI</h2>
        <p className={s.intro}>
          AQI (Air Quality Index) mengubah kadar polutan menjadi satu angka dari 0 sampai 500. Makin
          tinggi angkanya, makin besar risikonya bagi kesehatan.
        </p>
        <table className={s.scale}>
          <thead>
            <tr><th scope="col">AQI</th><th scope="col">Kategori</th><th scope="col">Yang perlu dilakukan</th></tr>
          </thead>
          <tbody>
            {LEVELS.map((l) => (
              <tr key={l.key} style={{ '--c': `var(--aqi-${l.key})` }}>
                <td className="num">{rangeOf(l)}</td>
                <th scope="row">{l.label}</th>
                <td>{l.advice}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <a href="https://www.airnow.gov/aqi/aqi-basics/" target="_blank" rel="noopener">
          Pelajari dasar AQI di AirNow<span className="sr-only"> (membuka tab baru)</span>
        </a>
      </section>

      <section className={s.block} aria-labelledby="topik">
        <h2 id="topik">Topik penting</h2>
        <ul className={s.topics}>
          {TOPICS.map(([Icon, title, text, url, source]) => (
            <li key={title}>
              <Icon size={24} strokeWidth={1.75} aria-hidden="true" />
              <h3>{title}</h3>
              <p>{text}</p>
              <a href={url} target="_blank" rel="noopener">
                Baca di {source}<span className="sr-only"> (membuka tab baru)</span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className={s.block} aria-labelledby="faq">
        <h2 id="faq">Pertanyaan yang sering muncul</h2>
        <div className={s.faq}>
          {FAQ.map(([q, a]) => (
            <details key={q} name="faq">
              <summary>{q}</summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className={s.callout}>
        <h2>Cuaca cerah belum tentu udaranya bersih.</h2>
        <Link className="btn btn-primary" to="/pantau">Cek udara di kotamu</Link>
      </section>
    </div>
  )
}
