import { useId } from 'react'
import { PageHeader } from '../components/ui.jsx'
import { useToast } from '../lib/toast.jsx'
import s from './Content.module.css'

const VALUES = [
  ['Cek', 'Lihat angka AQI kotamu sebelum keluar rumah.'],
  ['Pahami', 'Ketahui arti angka itu bagi dirimu dan keluargamu.'],
  ['Lindungi', 'Pilih aktivitas dan waktu yang paling aman.'],
]

export default function About() {
  const toast = useToast()

  function submit(e) {
    e.preventDefault()
    e.currentTarget.reset()
    toast('Pesan terkirim. Ini versi demo, jadi pesan tidak benar-benar dikirim.')
  }

  return (
    <div className="container">
      <title>Tentang · KADAR</title>
      <PageHeader crumb="About" title="Karena udara" accent="adalah cerita kita.">
        KADAR (Kabar Udara) membantu masyarakat mengenali kualitas udara di kotanya, memahami artinya,
        dan memilih tindakan yang tepat.
      </PageHeader>

      <section className={s.block} aria-labelledby="misi">
        <h2 id="misi">Karena udara adalah cerita kita bersama</h2>
        <p className={s.intro}>
          Lewat pemantauan, prakiraan, berita, dan edukasi, KADAR mengajak setiap orang mengambil
          langkah kecil demi lingkungan yang lebih sehat.
        </p>
        <dl className={s.values}>
          {VALUES.map(([term, text]) => (
            <div key={term}><dt>{term}</dt><dd>{text}</dd></div>
          ))}
        </dl>
      </section>

      <section className={`${s.block} ${s.contact}`} id="kontak" aria-labelledby="judul-kontak">
        <div>
          <h2 id="judul-kontak">Kirim masukan</h2>
          <p className={s.intro}>
            Punya saran, pertanyaan, atau menemukan kendala? Tulis lewat formulir ini atau email ke{' '}
            <a href="mailto:halo@kadarudara.demo">halo@kadarudara.demo</a>.
          </p>
        </div>

        <form className={s.form} onSubmit={submit}>
          <Field label="Nama" name="nama" autoComplete="name" error="Isi namamu." />
          <Field
            label="Email"
            name="email"
            type="email"
            autoComplete="email"
            hint="Contoh: nama@email.com"
            error="Masukkan email dengan format nama@email.com."
          />
          <Field label="Pesan" name="pesan" multiline error="Tulis pesanmu sebelum mengirim." />
          <button className="btn btn-primary">Kirim pesan</button>
        </form>
      </section>
    </div>
  )
}

// Errors appear only after interaction (:user-invalid); aria-invalid and the error link follow it.
function Field({ label, name, hint, error, multiline, ...props }) {
  const id = useId()
  const hintId = hint ? `${id}-hint` : null
  const errorId = `${id}-error`

  function sync(e) {
    const el = e.currentTarget
    const invalid = el.matches(':user-invalid')
    el.setAttribute('aria-invalid', String(invalid))
    el.setAttribute('aria-describedby', [hintId, invalid && errorId].filter(Boolean).join(' '))
  }

  const Control = multiline ? 'textarea' : 'input'
  return (
    <div className={s.field}>
      <label htmlFor={id}>{label}</label>
      {hint && <span id={hintId} className={s.hint}>{hint}</span>}
      <Control
        id={id}
        name={name}
        required
        rows={multiline ? 5 : undefined}
        aria-invalid="false"
        aria-describedby={hintId ?? undefined}
        onBlur={sync}
        onInput={sync}
        onInvalid={sync}
        {...props}
      />
      <span id={errorId} className={s.error}>{error}</span>
    </div>
  )
}
