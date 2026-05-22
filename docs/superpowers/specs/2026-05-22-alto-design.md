# Alto — AI-Powered EV Routing Intelligence Platform
**Date:** 2026-05-22
**Status:** Approved

---

## Overview

Alto is a new Next.js 15 app added as `ev_source_code/alto/` alongside the existing mobile app, admin panel, and landing page. It is a cinematic, AI-themed EV routing intelligence frontend targeting mobile-first usage. The backend is mocked now with service contracts shaped to match the existing Express backend (`admin/UV Charging/`) so the swap is mechanical when ready.

---

## Tech Stack

| Concern | Choice |
|---|---|
| Framework | Next.js 15 App Router, TypeScript strict |
| Styling | Tailwind CSS 4 + CSS variables (design tokens) |
| UI primitives | Shadcn/UI (dark-themed) |
| Animation | Framer Motion 11 |
| Map | `@vis.gl/react-google-maps` — gray Silver map style |
| State | Zustand (one slice per feature) |
| Server data | React Query (wraps mock services today, real API tomorrow) |
| Charts | Recharts |
| Icons | Lucide React |

The app runs independently on port `3002`. Zero coupling to admin or landing page.

---

## Design Tokens

Defined as CSS variables in `globals.css`:

```css
--bg-primary: #0a0a0a
--bg-secondary: #111111
--bg-glass: rgba(255, 255, 255, 0.05)
--accent-blue: #00D4FF
--accent-green: #39FF14
--text-primary: #F0F0F0
--text-muted: #6B7280
--border-glass: rgba(255, 255, 255, 0.1)
```

Glassmorphism via `backdrop-filter: blur(12px)` + `--bg-glass` background + `--border-glass` border on cards and panels.

---

## Architecture

### Folder Structure

```
alto/
├── app/
│   ├── login/               # Login route (outside app group)
│   ├── (app)/               # Route group — shared layout with nav
│   │   ├── layout.tsx       # Auth guard + BottomTabBar + DesktopSidebar
│   │   ├── home/
│   │   ├── route/
│   │   ├── charge/
│   │   ├── intelligence/
│   │   └── profile/
│   ├── layout.tsx           # Root layout (fonts, providers)
│   └── globals.css
├── components/
│   ├── ui/                  # Shadcn primitives
│   ├── maps/                # LiveRouteMap
│   ├── ai/                  # AIInsightCard, AIFloatingPanel
│   └── dashboard/           # BatteryRing, RangeAnxietyGauge, ChargerCard, etc.
├── features/
│   ├── auth/                # Login form, auth hooks
│   ├── home/                # Home screen components + hooks
│   ├── route/               # Route screen components + hooks
│   ├── charge/              # Charging hub components + hooks
│   ├── intelligence/        # Intelligence stub components
│   └── profile/             # Profile stub components
├── services/                # API contracts + mock implementations
│   ├── authService.ts
│   ├── stationService.ts
│   ├── routeService.ts
│   └── insightService.ts
├── store/                   # Zustand slices
│   ├── authSlice.ts
│   ├── routeSlice.ts
│   └── chargeSlice.ts
├── hooks/                   # Shared custom hooks
├── lib/                     # Google Maps config, utils, constants
├── data/                    # Static mock JSON
│   ├── stations.json        # 10 stations matching NearestStationModel shape
│   ├── routes.json          # 2 mock routes with polyline waypoints
│   ├── aiInsights.json      # 10 AI insight strings
│   └── vehicles.json        # 3 EV profiles with battery specs
├── types/                   # Shared TypeScript interfaces
│   ├── station.ts
│   ├── route.ts
│   ├── booking.ts
│   └── auth.ts
└── actions/                 # Next.js Server Actions (future use)
```

---

## Navigation & Routing

### Route Map

```
/              → redirect to /login
/login         → Login screen (mocked session)
/(app)/home    → Home dashboard
/(app)/route   → Route Intelligence + Google Map
/(app)/charge  → Charging Hub
/(app)/intelligence → AI Intelligence (stub)
/(app)/profile → Profile (stub)
```

### Bottom Tab Bar (mobile)
- Floating glassmorphism dock, sticky `bottom-0`, `z-50`
- Tabs: House / Route / BatteryCharging / Sparkles / User
- Active state: neon blue `--accent-blue` pill indicator + icon glow
- Tab switch: Framer Motion `AnimatePresence` with directional slide based on tab index

### Desktop Sidebar
- Left rail, `64px` collapsed, expands to `180px` on hover
- Same 5 icons, vertical layout
- Visible at `lg:` breakpoint; bottom tab bar hidden at `lg:`

### Auth Guard
- Zustand `authSlice` holds `isAuthenticated: boolean`
- `(app)/layout.tsx` redirects to `/login` if not authenticated
- Login sets mock JWT string in Zustand + `sessionStorage` for persistence across refreshes
- Profile "Sign Out" clears both → redirect to `/login`

---

## Screens

### Login Screen
- Dark graphite background, ambient gradient orb (CSS, no canvas)
- Centered card: Alto logo, email + password inputs (Shadcn), "Sign In" button
- Button triggers `authService.login()` mock → sets auth state → `router.push('/home')`
- No registration, no forgot password

### Home Screen *(fully polished)*

**Layout (top to bottom):**
1. Header: AI greeting + vehicle name
2. `BatteryRing` — animated SVG circular progress, range estimate below
3. `RangeAnxietyGauge` — horizontal gradient bar with animated needle
4. Horizontal scroll row of 3 `AIInsightCard`s (weather impact, peak pricing, trip confidence)
5. "Start Intelligent Route" CTA → navigates to `/route`

**Background:** CSS-only floating energy particles (`@keyframes` translate + opacity).

### Route Intelligence Screen *(fully polished)*

**Layout:**
- Full-bleed `LiveRouteMap` (gray Silver style), ~60vh on mobile
- Floating search bar at top of map
- Animated polyline on map for mock route
- Pulsing station markers on map
- Draggable bottom sheet containing:
  - Route timeline with charging stop cards
  - Battery projection `Recharts` line chart (% over distance)
  - Elevation energy graph (area chart)
- `AIFloatingPanel` slides up with mock insight string (typewriter effect)
- EV dot animates along route polyline using `requestAnimationFrame`

### Charging Hub Screen *(fully polished)*

**Layout:**
- Top filter bar (speed, availability, distance — visual only, filters mock list)
- Scrollable list of `ChargerCard` components (8–10 stations from mock data)

**`ChargerCard` contains:**
- Station name + distance
- Pulsing availability badge (CSS `@keyframes`)
- Wait time, charging speed (kW), reliability score (%), cost estimate (₹/kWh)
- AI recommendation badge (shown on top 2 cards)
- "Reserve" + "AI Smart Reserve" buttons
- "AI Smart Reserve" opens `SmartReserveModal`

**`SmartReserveModal`:**
- Bottom sheet, spring animation
- Shows station name, AI-recommended time slot, cost estimate
- "Confirm Reservation" → mock success toast (react-hot-toast)

### Intelligence Screen *(stub)*
- 2×2 grid of glowing `AIInsightCard`s with static text
- One `Recharts` area chart (energy spending, static data)
- Animated shimmer on cards to imply live data
- No interactivity beyond scroll

### Profile Screen *(stub)*
- Avatar circle + vehicle name + email
- 4 list items: Saved Stations, Preferences, Membership, Sign Out
- Sign Out: clears Zustand auth + sessionStorage → `/login`

---

## Shared Components

### `BatteryRing`
SVG circle with `strokeDashoffset` animated by Framer Motion on mount. Color interpolates green→yellow→red based on battery %. Subtle glow pulse keyframe loop. Props: `percentage: number`, `size?: number`.

### `RangeAnxietyGauge`
Horizontal bar, gradient fill (green→red), animated needle position. Props: `rangeKm: number`, `maxRangeKm: number`.

### `AIInsightCard`
Glassmorphism card (`backdrop-filter`, `--bg-glass`, `--border-glass`). Framer Motion `whileHover: { y: -4 }` + neon blue box-shadow glow. Props: `icon`, `title`, `body`, `trend?: "up" | "down" | "neutral"`.

### `ChargerCard`
Station card with all charger data fields. Pulsing availability dot (CSS). Props: `station: Station`, `onReserve`, `onSmartReserve`.

### `LiveRouteMap`
Wraps `@vis.gl/react-google-maps`. Gray Silver map style applied via `mapId` or inline styles JSON. Accepts `route: Route`, `stations: Station[]`. Renders polyline + station markers + animated EV dot. Loaded with `dynamic(() => import(...), { ssr: false })`.

### `AIFloatingPanel`
Slides up from `y: 100` on trigger. Shows AI insight string with typewriter reveal (`useState` + `useEffect` interval). Props: `insight: string`, `visible: boolean`.

### `SmartReserveModal`
Framer Motion bottom sheet. Spring physics entry. Props: `station: Station`, `onConfirm`, `onClose`.

### `BottomTabBar` / `DesktopSidebar`
Navigation components. Active state driven by `usePathname()`. Tab order array determines slide direction for `AnimatePresence`.

---

## Services Layer

### Contract Pattern
Each service exports typed async functions. Mock implementations import from `/data/*.json` with an artificial delay (`await sleep(300)`) to simulate network latency. Swapping to real backend = replace function body with `fetch('/api/v1/...')`.

```ts
// services/stationService.ts
export async function getNearbyStations(lat: number, lng: number): Promise<Station[]>
export async function reserveStation(stationId: string, slot: TimeSlot): Promise<Reservation>

// services/routeService.ts
export async function getOptimizedRoute(origin: LatLng, dest: LatLng, batteryPct: number): Promise<Route>

// services/authService.ts
export async function login(email: string, password: string): Promise<AuthSession>

// services/insightService.ts
export async function getAIInsights(vehicleId: string): Promise<AIInsight[]>
```

### Mock Data Shapes (mirror existing backend models)
- `Station` → matches `NearestStationModel` (coordinates, slots, pricing, connectorType, reliability)
- `Booking` → matches `BookingModel` (stationId, userId, date, timeSlot, status, amount)
- `AuthSession` → matches existing JWT response `{ token: string, user: { id, name, email } }`
- `Route` → `{ waypoints: LatLng[], stops: ChargingStop[], totalDistanceKm: number, estimatedTimeMin: number }`

---

## Zustand Store Slices

```ts
// authSlice: isAuthenticated, user, token, login(), logout()
// routeSlice: origin, destination, currentRoute, batteryPct, setRoute()
// chargeSlice: nearbyStations, selectedStation, activeReservation, setStations()
```

All slices use `persist` middleware (localStorage) for `authSlice` only. Route and charge state resets on app reload.

---

## Animation Strategy

| Element | Technique |
|---|---|
| Page transitions | Framer Motion `AnimatePresence`, directional slide |
| Login → Home | Fade + scale-up |
| `BatteryRing` fill | Framer `animate` on `strokeDashoffset` |
| `AIInsightCard` hover | `whileHover: { y: -4, boxShadow: neon glow }` |
| Card list entry | `staggerChildren: 0.1` on container |
| `AIFloatingPanel` | Spring from `y: 100` |
| `SmartReserveModal` | Bottom sheet spring |
| AI typewriter | `useState` + `useEffect` interval (character reveal) |
| EV route dot | `requestAnimationFrame` along polyline coords |
| Availability pulse | CSS `@keyframes` pulse (not Framer — avoids per-card JS) |
| Background particles | CSS `@keyframes` translate + opacity (Home screen only) |

**Performance guardrails:**
- `LiveRouteMap` and Recharts charts: `dynamic(() => import(...), { ssr: false })`
- `Suspense` boundaries with skeleton loaders on all data-driven sections
- No canvas used — all animations via CSS or Framer Motion

---

## Out of Scope (this spec)

- Real backend integration (API calls, real auth)
- Push notifications
- SSLCommerz / Stripe payment flows
- Google Sign-In
- QR code scanning
- Offline support
- i18n / multi-language
