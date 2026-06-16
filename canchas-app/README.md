# Canchas — Plataforma de reserva (Fútbol · Pádel · Tenis)

SaaS de dos lados: marketplace para el jugador + gestión para el club.
Stack: **Vite + React + TypeScript + TanStack Query + Zustand + Supabase**.
Conectado al proyecto Supabase **v9-9** (schema `canchas`).

## Correr en local
```bash
npm install
npm run dev
```
Las credenciales ya están en `.env.local` (URL + publishable key de v9-9).

## Build / deploy a Vercel
```bash
npm run build      # tsc + vite build → dist/
```
En Vercel: importás el repo, framework **Vite**, y cargás las env vars
`VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` (están en `.env.example`).

## IMPORTANTE — exponer el schema
En Supabase → **Settings → API → Exposed schemas**, agregá `canchas`.
Sin eso, supabase-js no ve las tablas (la app usa `db: { schema: "canchas" }`).

## Estructura
```
src/
  lib/         supabase client (schema canchas) + helpers de formato
  types/       tipos TS que matchean el schema
  store/       estado UI global (Zustand)
  hooks/       queries/mutations (TanStack Query) + auth
  components/   CourtPhoto, Carousel, Stars, MapModal, BookingBar, AuthBar, Toast
  features/
    search/      buscador + reserva (lee court_cards, ocupación por RPC)
    play/        partidos abiertos (Tinder) + crear partido
    tournaments/ torneos
    admin/       panel del dueño (clubs + reservas + split)
```

## Datos en la base (v9-9)
- Tablas en el schema `canchas` (clubs, courts, reservations, open_matches, tournaments, etc.)
- Vistas: `court_cards`, `open_match_cards`
- RPC: `day_availability(p_date)` — ocupación sin exponer datos personales
- Hay datos demo cargados (clubs, canchas, partidos, torneos) con tu usuario como dueño.

## Pendiente (próximo paso)
- Endpoint MercadoPago: OAuth de dueños + creación de pago con `application_fee` (split).
- Insertar `reservation_equipment` al confirmar.
- Mapa real (Google Maps / Mapbox) en `MapModal`.
