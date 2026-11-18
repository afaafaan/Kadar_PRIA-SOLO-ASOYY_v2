# KADAR (Kabar Udara)

Air-quality information for Indonesian cities. React rebuild of the original prototype, same mock data.

```sh
npm install
npm run dev      # http://localhost:5173
npm test         # AQI logic checks (node:test)
npm run build    # static output in dist/
```

Single-page app: when deploying, rewrite every path to `index.html` (the static SPA defaults on Vercel and Netlify do this).

```
src/
  data/        cities, forecast, news (mock data)
  lib/aqi.js   AQI categories, advice, activity thresholds, forecast helpers (single source of truth)
  lib/         colour-scheme override, toast
  styles/      design tokens (type, space, colour incl. AQI scale) + base
  components/  Layout (nav, footer), Logo, Intro, shared UI
  pages/       one file per route; Monitor (with Leaflet) and the others load on demand
```

## Penyesuaian UI/UX (mengikuti desain KADAR v3.2)
Struktur file, rute, data, dan logika proyek ini tidak diubah. Yang disesuaikan hanya tampilan dan interaksi:
- Palet biru-putih-gelap dengan aksen oranye, font Manrope + DM Sans (dimuat dari Google Fonts di `index.html`).
- Navbar pill melayang bergaya liquid glass, tombol tema dan "Hubungi kami" di dalam navbar.
- Chip tanggal dan jam lokal yang selalu tampil di pojok kiri bawah.
- Landing dua tahap: GIF logo, lalu loading bar "Selamat Datang di Kadar" sebelum Home (`public/kadar-intro.gif`, `public/kadar-logo.png`).
- Home dengan hero ilustrasi udara, kartu fitur ber-hover, kartu berita dengan skeleton shimmer, dan gaya kartu pada halaman lain.
