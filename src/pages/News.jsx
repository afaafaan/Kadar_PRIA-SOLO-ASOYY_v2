import { useEffect, useRef, useState } from 'react'
import { ExternalLink } from 'lucide-react'
import { news } from '../data/news.js'
import { Chips, PageHeader } from '../components/ui.jsx'
import s from './Content.module.css'

const CATEGORIES = ['Semua', ...new Set(news.map((n) => n.category))].map((c) => [c, c])

// Ilustrasi kartu per kategori (gaya v3.2): [warna, baris teks]
const ART = {
  Kesehatan: ['blue', ['UDARA BERSIH', 'HAK KITA']],
  Aksi: ['green', ['LANGKAH KECIL', 'DAMPAK BESAR']],
  Polutan: ['orange', ['KENALI POLUTAN', 'DI SEKITARMU']],
}

export default function News() {
  const [category, setCategory] = useState('Semua')
  const [loading, setLoading] = useState(true)
  const first = useRef(true)
  const items = news.filter((n) => category === 'Semua' || n.category === category)

  // Skeleton shimmer singkat saat halaman dibuka dan saat filter diganti.
  useEffect(() => {
    setLoading(true)
    const t = setTimeout(() => setLoading(false), first.current ? 800 : 450)
    first.current = false
    return () => clearTimeout(t)
  }, [category])

  return (
    <div className="container">
      <title>Berita · KADAR</title>
      <PageHeader crumb="News" title="Kabar terbaru untuk" accent="bumi yang lebih sehat.">
        Isu kualitas udara dan lingkungan, dengan tautan langsung ke lembaga sumbernya.
      </PageHeader>

      <Chips label="Saring menurut topik" options={CATEGORIES} value={category} onChange={setCategory} />

      <ul className={s.news} aria-busy={loading}>
        {loading
          ? Array.from({ length: 3 }, (_, i) => (
              <li key={i} aria-hidden="true"><div className={s.skCard}><div className={s.sk} /><div className={s.sk} /><div className={s.sk} /></div></li>
            ))
          : items.map((n, i) => {
              const [tone, lines] = ART[n.category] ?? ART.Kesehatan
              return (
                <li key={n.title} className={i === 0 && category === 'Semua' ? s.lead : undefined}>
                  <article className={s.article}>
                    <div className={s.artWrap} aria-hidden="true">
                      <div className={s.art} data-tone={tone}><b>{lines[0]}<br />{lines[1]}</b></div>
                    </div>
                    <div className={s.body}>
                      <p className={s.meta}>
                        <span className={s.category}>{n.category}</span>
                        <span>{n.minutes} menit baca</span>
                      </p>
                      <h2>
                        <a href={n.url} target="_blank" rel="noopener" className={s.articleLink}>
                          {n.title}
                          <span className="sr-only"> (membuka tab baru)</span>
                        </a>
                      </h2>
                      <p className={s.summary}>{n.summary}</p>
                      <p className={s.source}>
                        <ExternalLink size={16} aria-hidden="true" />
                        Sumber: {n.source}
                      </p>
                    </div>
                  </article>
                </li>
              )
            })}
      </ul>
    </div>
  )
}
