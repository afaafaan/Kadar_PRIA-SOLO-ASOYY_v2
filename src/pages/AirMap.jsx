import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet'
import { cities as allCities } from '../data/cities.js'
import { level } from '../lib/aqi.js'
import { useScheme } from '../lib/scheme.js'
import s from './Monitor.module.css'

const BOUNDS = allCities.map((c) => [c.lat, c.lng])
// ponytail: Esri's keyless gray canvas tiles; swap for a keyed provider before real traffic.
const TILES = 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_{tone}_Gray_Base/MapServer/tile/{z}/{y}/{x}'
const ATTRIBUTION = 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ'

const markerIcon = (city, selected) =>
  L.divIcon({
    className: s.markerSlot,
    html: `<span class="${s.marker}" style="--c: var(--aqi-${level(city.aqi).key})"${selected ? ' data-selected' : ''}>${city.aqi}</span>`,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  })

function FollowSelection({ city }) {
  const map = useMap()
  const first = useRef(true)
  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    const zoom = Math.max(map.getZoom(), 6)
    if (reduce) map.setView([city.lat, city.lng], zoom)
    else map.flyTo([city.lat, city.lng], zoom, { duration: 0.8 })
  }, [city, map])
  return null
}

export default function AirMap({ cities, selected, onSelect }) {
  const dark = useScheme() === 'dark'
  return (
    <MapContainer
      className={s.map}
      bounds={BOUNDS}
      boundsOptions={{ padding: [32, 32] }}
      scrollWheelZoom={false}
      attributionControl
    >
      <TileLayer
        key={dark ? 'dark' : 'light'}
        url={TILES}
        tone={dark ? 'Dark' : 'Light'}
        maxNativeZoom={16}
        attribution={ATTRIBUTION}
      />
      {cities.map((c) => (
        <Marker
          key={c.name}
          position={[c.lat, c.lng]}
          icon={markerIcon(c, c.name === selected.name)}
          title={`${c.name}, AQI ${c.aqi}`}
          alt={`${c.name}, AQI ${c.aqi}`}
          zIndexOffset={c.name === selected.name ? 1000 : 0}
          eventHandlers={{ click: () => onSelect(c.name) }}
        />
      ))}
      <FollowSelection city={selected} />
    </MapContainer>
  )
}
