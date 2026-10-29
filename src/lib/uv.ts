import { useSyncExternalStore } from 'react'

/** Live UV index from Open-Meteo (free, no key). Shared by the header badge and the UV card. */

export interface Place {
  id: string
  label: string
  lat: number
  lon: number
}

export const CITIES: Place[] = [
  { id: 'almaty', label: 'Almaty', lat: 43.24, lon: 76.89 },
  { id: 'kuala-lumpur', label: 'Kuala Lumpur', lat: 3.14, lon: 101.69 },
  { id: 'dubai', label: 'Dubai', lat: 25.2, lon: 55.27 },
  { id: 'london', label: 'London', lat: 51.51, lon: -0.13 },
]

type State =
  | { status: 'idle' | 'loading'; place: Place; uv?: number }
  | { status: 'ready'; place: Place; uv: number }
  | { status: 'error'; place: Place; message: string; uv?: number }

const KEY = 'haluna-uv-place'
const listeners = new Set<() => void>()

function savedPlace(): Place {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) {
      const p = JSON.parse(raw)
      if (typeof p?.lat === 'number' && typeof p?.lon === 'number' && typeof p?.label === 'string') return p
    }
  } catch {
    /* ignore */
  }
  return CITIES[0]
}

/** What the prerendered HTML shows; the client swaps in the saved place right after hydration. */
const SERVER_STATE: State = { status: 'idle', place: CITIES[0] }
let state: State = typeof window === 'undefined' ? SERVER_STATE : { status: 'idle', place: savedPlace() }
let requestId = 0

function set(next: State) {
  state = next
  listeners.forEach((l) => l())
}

export async function loadUV(place: Place = state.place) {
  const id = ++requestId
  set({ status: 'loading', place, uv: state.place.id === place.id ? state.uv : undefined })
  try {
    localStorage.setItem(KEY, JSON.stringify(place))
  } catch {
    /* ignore */
  }
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${place.lat}&longitude=${place.lon}&daily=uv_index_max&timezone=auto&forecast_days=1`
    const res = await fetch(url)
    if (!res.ok) throw new Error(`Open-Meteo responded ${res.status}`)
    const json = await res.json()
    const uv = Number(json?.daily?.uv_index_max?.[0])
    if (!Number.isFinite(uv)) throw new Error('No UV value in the forecast')
    if (id === requestId) set({ status: 'ready', place, uv: Math.round(uv * 10) / 10 })
  } catch (e) {
    if (id === requestId) set({ status: 'error', place, message: e instanceof Error ? e.message : 'Could not load UV' })
  }
}

export function locateMe(): Promise<void> {
  return new Promise((resolve) => {
    if (!('geolocation' in navigator)) {
      set({ status: 'error', place: state.place, message: 'Location is not available in this browser.' })
      return resolve()
    }
    set({ status: 'loading', place: state.place })
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords
        loadUV({ id: 'here', label: 'Your location', lat: +latitude.toFixed(2), lon: +longitude.toFixed(2) }).then(resolve)
      },
      () => {
        set({ status: 'error', place: state.place, message: 'Location permission was declined. Pick a city instead.' })
        resolve()
      },
      { timeout: 8000, maximumAge: 30 * 60 * 1000 },
    )
  })
}

let started = false
function subscribe(l: () => void) {
  listeners.add(l)
  if (!started) {
    started = true
    // Fetch after the page has settled so the API call never competes with first paint.
    const go = () => loadUV()
    if ('requestIdleCallback' in window) window.requestIdleCallback(go, { timeout: 2500 })
    else setTimeout(go, 1200)
  }
  return () => listeners.delete(l)
}

export function useUV() {
  return useSyncExternalStore(subscribe, () => state, () => SERVER_STATE)
}

export interface UVLevel {
  label: string
  /** Scale colour (decorative). */
  color: string
  advice: string
  productSlug: string
}

export function uvLevel(uv: number): UVLevel {
  const n = Math.round(uv)
  if (n <= 2)
    return { label: 'Low', color: '#C9D6D2', advice: 'An everyday tint with SPF 30 is plenty today.', productSlug: 'glow-tint-spf-30' }
  if (n <= 5)
    return { label: 'Moderate', color: '#D8C3A8', advice: 'Wear SPF 50 and reapply before heading back out.', productSlug: 'daily-mineral-sunscreen-spf-50' }
  if (n <= 7)
    return { label: 'High', color: '#E59A9B', advice: 'Reapply SPF 50 every 2 hours.', productSlug: 'daily-mineral-sunscreen-spf-50' }
  if (n <= 10)
    return { label: 'Very high', color: '#9A4F55', advice: 'Reapply SPF 50 every 2 hours and find shade at midday.', productSlug: 'sun-stick-spf-50' }
  return { label: 'Extreme', color: '#4A2B3A', advice: 'Stay in the shade 11–3. Reapply SPF 50 every 2 hours.', productSlug: 'sun-stick-spf-50' }
}
