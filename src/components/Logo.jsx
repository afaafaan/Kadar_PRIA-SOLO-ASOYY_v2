// Logo KADAR: memakai berkas logo resmi (sudah berisi tagline "Kabar Udara").
import s from './Logo.module.css'

export default function Logo({ className = '' }) {
  return <img src="/kadar-logo.png" alt="KADAR, Kabar Udara" width="1293" height="300" className={`${s.logo} ${className}`} />
}
