# Alto EV Routing Intelligence Platform — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build Alto, a Next.js 15 mobile-first EV routing intelligence platform with glassmorphism dark UI, Google Maps integration, and mocked AI features — new app at `ev_source_code/alto/`.

**Architecture:** Feature-sliced Next.js 15 App Router app. Mock services match existing Express backend API shapes (`NearestStationModel`, `BookingModel`). Zustand for auth/route/charge state, React Query wrapping all service calls, Framer Motion for animations.

**Tech Stack:** Next.js 15, TypeScript strict, Tailwind CSS 4, Shadcn/UI, Framer Motion 11, @vis.gl/react-google-maps, Zustand + persist, @tanstack/react-query, Recharts, Lucide React, react-hot-toast, Vitest

---

## File Map

```
alto/
├── app/
│   ├── layout.tsx                    # Root: fonts, Providers wrapper
│   ├── globals.css                   # Design tokens, keyframes, base styles
│   ├── page.tsx                      # Redirect → /login
│   ├── Providers.tsx                 # "use client" QueryClient + Toaster
│   ├── login/page.tsx
│   └── (app)/
│       ├── layout.tsx                # Auth guard + BottomTabBar + DesktopSidebar
│       ├── home/page.tsx
│       ├── route/page.tsx
│       ├── charge/page.tsx
│       ├── intelligence/page.tsx
│       └── profile/page.tsx
├── components/
│   ├── navigation/BottomTabBar.tsx
│   ├── navigation/DesktopSidebar.tsx
│   ├── dashboard/BatteryRing.tsx
│   ├── dashboard/RangeAnxietyGauge.tsx
│   ├── dashboard/LiveBadge.tsx
│   ├── dashboard/ChargerCard.tsx
│   ├── dashboard/SmartReserveModal.tsx
│   ├── ai/AIInsightCard.tsx
│   ├── ai/AIFloatingPanel.tsx
│   └── maps/LiveRouteMap.tsx
├── features/
│   ├── auth/LoginPage.tsx + LoginForm.tsx
│   ├── home/HomeScreen.tsx
│   ├── route/RouteScreen.tsx + RouteBottomSheet.tsx
│   ├── charge/ChargeScreen.tsx
│   ├── intelligence/IntelligenceScreen.tsx + EnergyChart.tsx
│   └── profile/ProfileScreen.tsx
├── services/
│   ├── authService.ts
│   ├── stationService.ts
│   ├── routeService.ts
│   └── insightService.ts
├── store/
│   ├── authSlice.ts
│   ├── routeSlice.ts
│   └── chargeSlice.ts
├── hooks/                            # (empty, populated as needed)
├── lib/
│   ├── utils.ts                      # cn(), sleep(), formatCurrency()
│   ├── googleMaps.ts                 # Silver style JSON + defaults
│   └── queryClient.ts
├── data/
│   ├── stations.json
│   ├── routes.json
│   ├── aiInsights.json
│   └── vehicles.json
├── types/
│   ├── station.ts
│   ├── route.ts
│   ├── auth.ts
│   ├── insight.ts
│   └── vehicle.ts
└── __tests__/
    ├── lib/utils.test.ts
    ├── services/authService.test.ts
    ├── services/stationService.test.ts
    └── store/authSlice.test.ts
```

---

### Task 1: Scaffold Project + Install Dependencies

**Files:**
- Create: `alto/` (entire Next.js project)
- Create: `alto/.env.local`
- Create: `alto/vitest.config.ts`
- Create: `alto/vitest.setup.ts`

- [ ] **Step 1: Scaffold Next.js 15 app**

Run from `ev_source_code/`:
```bash
npx create-next-app@latest alto --typescript --tailwind --eslint --app --no-src-dir --import-alias "@/*" --no-git --yes
```

- [ ] **Step 2: Install runtime dependencies**

```bash
cd alto && npm install framer-motion @vis.gl/react-google-maps zustand @tanstack/react-query recharts lucide-react react-hot-toast clsx tailwind-merge class-variance-authority
```

- [ ] **Step 3: Install dev dependencies**

```bash
npm install -D vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom jsdom
```

- [ ] **Step 4: Initialize Shadcn UI**

```bash
npx shadcn@latest init --defaults
npx shadcn@latest add button input sheet badge
```

- [ ] **Step 5: Add test scripts to package.json**

In `alto/package.json`, add to `"scripts"`:
```json
"test": "vitest",
"test:run": "vitest run"
```

- [ ] **Step 6: Create vitest.config.ts**

```typescript
// alto/vitest.config.ts
import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    alias: { '@': path.resolve(__dirname, '.') },
  },
});
```

- [ ] **Step 7: Create vitest.setup.ts**

```typescript
// alto/vitest.setup.ts
import '@testing-library/jest-dom';
```

- [ ] **Step 8: Create .env.local**

```bash
# alto/.env.local
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

- [ ] **Step 9: Commit**

```bash
cd .. && git add alto/ && git commit -m "feat(alto): scaffold Next.js 15 app with dependencies"
```

---

### Task 2: Global Styles + Design Tokens

**Files:**
- Modify: `alto/app/globals.css`
- Modify: `alto/app/layout.tsx`

- [ ] **Step 1: Replace globals.css**

```css
/* alto/app/globals.css */
@import "tailwindcss";

@theme {
  --color-accent-blue: #00D4FF;
  --color-accent-green: #39FF14;
  --color-bg-primary: #0a0a0a;
  --color-bg-secondary: #111111;
  --color-text-muted: #6B7280;
}

:root {
  --bg-glass: rgba(255, 255, 255, 0.05);
  --border-glass: rgba(255, 255, 255, 0.1);
}

* { box-sizing: border-box; }

body {
  background-color: #0a0a0a;
  color: #F0F0F0;
  -webkit-font-smoothing: antialiased;
}

.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }

@keyframes pulse-dot {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.3); }
}

@keyframes float-particle {
  0% { transform: translateY(0) translateX(0); opacity: 0; }
  50% { opacity: 0.5; }
  100% { transform: translateY(-100px) translateX(15px); opacity: 0; }
}

.availability-pulse { animation: pulse-dot 2s ease-in-out infinite; }
.particle {
  position: absolute;
  width: 2px;
  height: 2px;
  border-radius: 50%;
  background: #00D4FF;
  animation: float-particle 4s ease-in-out infinite;
}
```

- [ ] **Step 2: Update app/layout.tsx**

```typescript
// alto/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './Providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Alto — EV Routing Intelligence',
  description: 'AI-powered EV routing and charging platform',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

- [ ] **Step 3: Create Providers.tsx**

```typescript
// alto/app/Providers.tsx
'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { useState } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  const [client] = useState(() => new QueryClient({
    defaultOptions: { queries: { staleTime: 1000 * 60 * 5, retry: 1 } },
  }));
  return (
    <QueryClientProvider client={client}>
      {children}
      <Toaster
        position="top-center"
        toastOptions={{
          style: { background: '#111', color: '#F0F0F0', border: '1px solid rgba(255,255,255,0.1)' },
        }}
      />
    </QueryClientProvider>
  );
}
```

- [ ] **Step 4: Create root redirect**

```typescript
// alto/app/page.tsx
import { redirect } from 'next/navigation';
export default function Root() { redirect('/login'); }
```

- [ ] **Step 5: Commit**

```bash
git add alto/ && git commit -m "feat(alto): add global styles, design tokens, and providers"
```

---

### Task 3: TypeScript Types + Mock Data

**Files:**
- Create: `alto/types/station.ts`
- Create: `alto/types/route.ts`
- Create: `alto/types/auth.ts`
- Create: `alto/types/insight.ts`
- Create: `alto/types/vehicle.ts`
- Create: `alto/data/stations.json`
- Create: `alto/data/routes.json`
- Create: `alto/data/aiInsights.json`
- Create: `alto/data/vehicles.json`

- [ ] **Step 1: Create types/station.ts**

```typescript
// alto/types/station.ts
export interface Amenity { label: string; icon: string; }
export interface TimeSlot { startTime: string; endTime: string; isBooked: boolean; }
export interface Station {
  _id: string; name: string; address: string; images: string[];
  status: 'Available' | 'Unavailable' | 'Busy'; availableIn: string;
  distanceKm: number; durationMins: number; rating: number; reviewCount: number;
  pricePerHour: string; pricePerHourValue: number; taxPercent: number;
  latitude: number; longitude: number;
  amenities: Amenity[]; slots: TimeSlot[];
  chargingSpeedKw: number; waitTimeMinutes: number; reliability: number;
  isAIRecommended: boolean;
}
export interface Reservation {
  _id: string; stationId: string; stationName: string;
  slotStart: string; slotEnd: string; date: string;
  amountEstimation: number; tax: number; totalAmount: number;
  status: 'Upcoming' | 'Completed' | 'Cancelled';
}
```

- [ ] **Step 2: Create types/route.ts**

```typescript
// alto/types/route.ts
export interface LatLng { lat: number; lng: number; }
export interface ChargingStop {
  stationId: string; stationName: string;
  arrivalBatteryPct: number; chargeDurationMin: number;
  chargeToPercent: number; coordinates: LatLng;
}
export interface Route {
  id: string; origin: LatLng; destination: LatLng;
  waypoints: LatLng[]; stops: ChargingStop[];
  totalDistanceKm: number; estimatedTimeMin: number;
  batteryAtDestinationPct: number; aiInsight: string;
}
```

- [ ] **Step 3: Create types/auth.ts, insight.ts, vehicle.ts**

```typescript
// alto/types/auth.ts
export interface User { id: string; fullName: string; email: string; phone: string; }
export interface AuthSession { token: string; user: User; }

// alto/types/insight.ts
export interface AIInsight {
  id: string; icon: string; title: string; body: string;
  trend: 'up' | 'down' | 'neutral';
}

// alto/types/vehicle.ts
export interface Vehicle {
  id: string; name: string; plate: string; batteryCapacityKwh: number;
  maxRangeKm: number; currentBatteryPct: number; currentRangeKm: number;
}
```

- [ ] **Step 4: Create data/stations.json**

```json
[
  { "_id": "s001", "name": "Green Energy Hub", "address": "100 MG Road, Bangalore", "images": [], "status": "Available", "availableIn": "", "distanceKm": 1.2, "durationMins": 5, "rating": 4.8, "reviewCount": 124, "pricePerHour": "₹450/hr", "pricePerHourValue": 450, "taxPercent": 5, "latitude": 12.9757, "longitude": 77.6011, "amenities": [{"label":"Food","icon":"utensils"},{"label":"Wi-Fi","icon":"wifi"}], "slots": [{"startTime":"09:00 AM","endTime":"10:00 AM","isBooked":true},{"startTime":"10:00 AM","endTime":"11:00 AM","isBooked":false},{"startTime":"11:00 AM","endTime":"12:00 PM","isBooked":false}], "chargingSpeedKw": 150, "waitTimeMinutes": 0, "reliability": 96, "isAIRecommended": true },
  { "_id": "s002", "name": "Koramangala FastCharge", "address": "80 Feet Road, Koramangala", "images": [], "status": "Busy", "availableIn": "Available in 20 minutes", "distanceKm": 2.8, "durationMins": 9, "rating": 4.5, "reviewCount": 87, "pricePerHour": "₹380/hr", "pricePerHourValue": 380, "taxPercent": 5, "latitude": 12.9279, "longitude": 77.6271, "amenities": [{"label":"Restroom","icon":"bath"}], "slots": [{"startTime":"10:00 AM","endTime":"11:00 AM","isBooked":true},{"startTime":"11:00 AM","endTime":"12:00 PM","isBooked":false}], "chargingSpeedKw": 60, "waitTimeMinutes": 20, "reliability": 88, "isAIRecommended": false },
  { "_id": "s003", "name": "Whitefield Supercharger", "address": "ITPL Main Road, Whitefield", "images": [], "status": "Available", "availableIn": "", "distanceKm": 18.5, "durationMins": 35, "rating": 4.9, "reviewCount": 212, "pricePerHour": "₹520/hr", "pricePerHourValue": 520, "taxPercent": 5, "latitude": 12.9698, "longitude": 77.7500, "amenities": [{"label":"Food","icon":"utensils"},{"label":"Wi-Fi","icon":"wifi"},{"label":"Restroom","icon":"bath"}], "slots": [{"startTime":"10:00 AM","endTime":"11:00 AM","isBooked":false},{"startTime":"11:00 AM","endTime":"12:00 PM","isBooked":false}], "chargingSpeedKw": 250, "waitTimeMinutes": 0, "reliability": 98, "isAIRecommended": true },
  { "_id": "s004", "name": "Hebbal EV Point", "address": "Bellary Road, Hebbal", "images": [], "status": "Available", "availableIn": "", "distanceKm": 9.1, "durationMins": 18, "rating": 4.3, "reviewCount": 56, "pricePerHour": "₹320/hr", "pricePerHourValue": 320, "taxPercent": 5, "latitude": 13.0358, "longitude": 77.5970, "amenities": [], "slots": [{"startTime":"09:00 AM","endTime":"10:00 AM","isBooked":false}], "chargingSpeedKw": 50, "waitTimeMinutes": 5, "reliability": 82, "isAIRecommended": false },
  { "_id": "s005", "name": "Electronic City Hub", "address": "Phase 1, Electronic City", "images": [], "status": "Unavailable", "availableIn": "Available in 45 minutes", "distanceKm": 22.3, "durationMins": 40, "rating": 4.1, "reviewCount": 43, "pricePerHour": "₹290/hr", "pricePerHourValue": 290, "taxPercent": 5, "latitude": 12.8399, "longitude": 77.6737, "amenities": [{"label":"Food","icon":"utensils"}], "slots": [{"startTime":"02:00 PM","endTime":"03:00 PM","isBooked":false}], "chargingSpeedKw": 30, "waitTimeMinutes": 45, "reliability": 74, "isAIRecommended": false },
  { "_id": "s006", "name": "Indiranagar Fast Charge", "address": "100 Feet Road, Indiranagar", "images": [], "status": "Available", "availableIn": "", "distanceKm": 4.6, "durationMins": 12, "rating": 4.7, "reviewCount": 163, "pricePerHour": "₹420/hr", "pricePerHourValue": 420, "taxPercent": 5, "latitude": 12.9784, "longitude": 77.6408, "amenities": [{"label":"Wi-Fi","icon":"wifi"},{"label":"Restroom","icon":"bath"}], "slots": [{"startTime":"10:00 AM","endTime":"11:00 AM","isBooked":false},{"startTime":"11:00 AM","endTime":"12:00 PM","isBooked":false}], "chargingSpeedKw": 120, "waitTimeMinutes": 0, "reliability": 93, "isAIRecommended": false },
  { "_id": "s007", "name": "HSR Layout EV Station", "address": "27th Main, HSR Layout", "images": [], "status": "Busy", "availableIn": "Available in 15 minutes", "distanceKm": 7.2, "durationMins": 16, "rating": 4.4, "reviewCount": 78, "pricePerHour": "₹360/hr", "pricePerHourValue": 360, "taxPercent": 5, "latitude": 12.9116, "longitude": 77.6389, "amenities": [], "slots": [{"startTime":"11:00 AM","endTime":"12:00 PM","isBooked":false}], "chargingSpeedKw": 75, "waitTimeMinutes": 15, "reliability": 86, "isAIRecommended": false },
  { "_id": "s008", "name": "Marathahalli Charge Hub", "address": "Outer Ring Road, Marathahalli", "images": [], "status": "Available", "availableIn": "", "distanceKm": 11.4, "durationMins": 22, "rating": 4.6, "reviewCount": 95, "pricePerHour": "₹400/hr", "pricePerHourValue": 400, "taxPercent": 5, "latitude": 12.9591, "longitude": 77.6995, "amenities": [{"label":"Food","icon":"utensils"}], "slots": [{"startTime":"10:00 AM","endTime":"11:00 AM","isBooked":false}], "chargingSpeedKw": 100, "waitTimeMinutes": 0, "reliability": 91, "isAIRecommended": false }
]
```

- [ ] **Step 5: Create data/routes.json**

```json
[
  {
    "id": "route_001",
    "origin": { "lat": 12.9279, "lng": 77.6271 },
    "destination": { "lat": 12.9698, "lng": 77.7500 },
    "waypoints": [
      { "lat": 12.9279, "lng": 77.6271 }, { "lat": 12.9350, "lng": 77.6350 },
      { "lat": 12.9450, "lng": 77.6450 }, { "lat": 12.9550, "lng": 77.6600 },
      { "lat": 12.9640, "lng": 77.6750 }, { "lat": 12.9700, "lng": 77.6900 },
      { "lat": 12.9720, "lng": 77.7100 }, { "lat": 12.9710, "lng": 77.7300 },
      { "lat": 12.9698, "lng": 77.7500 }
    ],
    "stops": [{ "stationId": "s006", "stationName": "Indiranagar Fast Charge", "arrivalBatteryPct": 35, "chargeDurationMin": 20, "chargeToPercent": 80, "coordinates": { "lat": 12.9784, "lng": 77.6408 } }],
    "totalDistanceKm": 24.5,
    "estimatedTimeMin": 42,
    "batteryAtDestinationPct": 62,
    "aiInsight": "Skipping Station B due to 41% predicted congestion. Charging 14 min later saves ₹180 and reduces wait by 23 min."
  }
]
```

- [ ] **Step 6: Create data/aiInsights.json**

```json
[
  { "id": "i01", "icon": "Moon", "title": "Off-Peak Savings", "body": "Charging after 11 PM this week could save ₹1,240.", "trend": "down" },
  { "id": "i02", "icon": "CloudRain", "title": "Weather Impact", "body": "Range reduced 12% due to rain. Stop at Indiranagar recommended.", "trend": "down" },
  { "id": "i03", "icon": "Battery", "title": "Battery Health", "body": "Degradation risk elevated. Avoid consecutive fast charges.", "trend": "down" },
  { "id": "i04", "icon": "Zap", "title": "Eco Drive", "body": "You drive 18% more efficiently in eco mode during rain.", "trend": "up" },
  { "id": "i05", "icon": "TrendingUp", "title": "Trip Confidence", "body": "87% confidence you reach Whitefield without an emergency stop.", "trend": "up" },
  { "id": "i06", "icon": "Clock", "title": "Peak Hours", "body": "Station congestion peaks at 6 PM. Leave by 5:30 PM to skip queues.", "trend": "neutral" },
  { "id": "i07", "icon": "Leaf", "title": "Carbon Savings", "body": "You saved 48 kg CO₂ equivalent this month vs petrol.", "trend": "up" },
  { "id": "i08", "icon": "Route", "title": "Scenic Route", "body": "Low-traffic scenic route via Cubbon Park adds 4 min, reduces stress.", "trend": "neutral" },
  { "id": "i09", "icon": "ShieldCheck", "title": "Safety Score", "body": "Your driving safety score is 94/100 this week. Great job!", "trend": "up" },
  { "id": "i10", "icon": "Star", "title": "Smart Reserve", "body": "AI reserved Green Energy Hub at 10:00 AM to avoid ₹90 peak premium.", "trend": "up" }
]
```

- [ ] **Step 7: Create data/vehicles.json**

```json
[
  { "id": "v01", "name": "Tata Nexon EV", "plate": "KA-01-AB-1234", "batteryCapacityKwh": 40.5, "maxRangeKm": 312, "currentBatteryPct": 72, "currentRangeKm": 225 },
  { "id": "v02", "name": "MG ZS EV", "plate": "KA-03-CD-5678", "batteryCapacityKwh": 50.3, "maxRangeKm": 461, "currentBatteryPct": 45, "currentRangeKm": 207 },
  { "id": "v03", "name": "Hyundai Ioniq 5", "plate": "KA-05-EF-9012", "batteryCapacityKwh": 72.6, "maxRangeKm": 631, "currentBatteryPct": 88, "currentRangeKm": 555 }
]
```

- [ ] **Step 8: Commit**

```bash
git add alto/ && git commit -m "feat(alto): add TypeScript types and mock data"
```

---

### Task 4: Utilities + Services Layer

**Files:**
- Create: `alto/lib/utils.ts`
- Create: `alto/lib/googleMaps.ts`
- Create: `alto/services/authService.ts`
- Create: `alto/services/stationService.ts`
- Create: `alto/services/routeService.ts`
- Create: `alto/services/insightService.ts`
- Create: `alto/__tests__/lib/utils.test.ts`
- Create: `alto/__tests__/services/authService.test.ts`
- Create: `alto/__tests__/services/stationService.test.ts`

- [ ] **Step 1: Write failing tests**

```typescript
// alto/__tests__/lib/utils.test.ts
import { describe, it, expect } from 'vitest';
import { cn, sleep, formatCurrency } from '@/lib/utils';

describe('cn', () => {
  it('merges class names', () => { expect(cn('a', 'b')).toBe('a b'); });
  it('resolves Tailwind conflicts', () => { expect(cn('p-2', 'p-4')).toBe('p-4'); });
});
describe('sleep', () => {
  it('resolves after delay', async () => {
    const t = Date.now(); await sleep(50); expect(Date.now() - t).toBeGreaterThanOrEqual(40);
  });
});
describe('formatCurrency', () => {
  it('formats with ₹ symbol', () => { expect(formatCurrency(1240)).toBe('₹1,240'); });
});
```

```typescript
// alto/__tests__/services/authService.test.ts
import { describe, it, expect } from 'vitest';
import { login } from '@/services/authService';

describe('authService.login', () => {
  it('returns session for valid credentials', async () => {
    const s = await login('test@example.com', 'pass123');
    expect(s.token).toBe('mock-jwt-alto-2026');
    expect(s.user.email).toBe('test@example.com');
  });
  it('throws if email is empty', async () => {
    await expect(login('', 'pass')).rejects.toThrow('Email and password are required');
  });
  it('throws if password is empty', async () => {
    await expect(login('a@b.com', '')).rejects.toThrow('Email and password are required');
  });
});
```

```typescript
// alto/__tests__/services/stationService.test.ts
import { describe, it, expect } from 'vitest';
import { getNearbyStations } from '@/services/stationService';

describe('stationService', () => {
  it('returns array of stations', async () => {
    const s = await getNearbyStations(12.97, 77.59);
    expect(Array.isArray(s)).toBe(true);
    expect(s.length).toBeGreaterThan(0);
  });
  it('each station has required fields', async () => {
    const [s] = await getNearbyStations(12.97, 77.59);
    expect(s).toHaveProperty('_id');
    expect(s).toHaveProperty('latitude');
    expect(['Available','Unavailable','Busy']).toContain(s.status);
  });
});
```

- [ ] **Step 2: Run tests — expect FAIL**

```bash
cd alto && npm run test:run
```
Expected: FAIL — modules not found.

- [ ] **Step 3: Create lib/utils.ts**

```typescript
// alto/lib/utils.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }
export function sleep(ms: number): Promise<void> { return new Promise(r => setTimeout(r, ms)); }
export function formatCurrency(n: number): string { return `₹${n.toLocaleString('en-IN')}`; }
```

- [ ] **Step 4: Create lib/googleMaps.ts**

```typescript
// alto/lib/googleMaps.ts
export const SILVER_MAP_STYLE = [
  { elementType: 'geometry', stylers: [{ color: '#f5f5f5' }] },
  { elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#616161' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#f5f5f5' }] },
  { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#eeeeee' }] },
  { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#e5e5e5' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#ffffff' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#dadada' }] },
  { featureType: 'transit.line', elementType: 'geometry', stylers: [{ color: '#e5e5e5' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#c9c9c9' }] },
] as const;

export const DEFAULT_CENTER = { lat: 12.9716, lng: 77.5946 };
export const DEFAULT_ZOOM = 13;
```

- [ ] **Step 5: Create services/authService.ts**

```typescript
// alto/services/authService.ts
import type { AuthSession } from '@/types/auth';
import { sleep } from '@/lib/utils';

export async function login(email: string, password: string): Promise<AuthSession> {
  await sleep(600);
  if (!email || !password) throw new Error('Email and password are required');
  return { token: 'mock-jwt-alto-2026', user: { id: 'u001', fullName: 'Arjun Sharma', email, phone: '+91 98765 43210' } };
}
```

- [ ] **Step 6: Create services/stationService.ts**

```typescript
// alto/services/stationService.ts
import stationsData from '@/data/stations.json';
import type { Station, TimeSlot, Reservation } from '@/types/station';
import { sleep } from '@/lib/utils';

export async function getNearbyStations(_lat: number, _lng: number): Promise<Station[]> {
  await sleep(400);
  return stationsData as Station[];
}

export async function reserveStation(stationId: string, slot: TimeSlot): Promise<Reservation> {
  await sleep(800);
  const station = (stationsData as Station[]).find(s => s._id === stationId);
  if (!station) throw new Error('Station not found');
  const base = station.pricePerHourValue;
  const tax = Math.round(base * station.taxPercent / 100);
  return {
    _id: `res_${Date.now()}`, stationId, stationName: station.name,
    slotStart: slot.startTime, slotEnd: slot.endTime,
    date: new Date().toDateString(),
    amountEstimation: base, tax, totalAmount: base + tax, status: 'Upcoming',
  };
}
```

- [ ] **Step 7: Create services/routeService.ts + insightService.ts**

```typescript
// alto/services/routeService.ts
import routesData from '@/data/routes.json';
import type { Route, LatLng } from '@/types/route';
import { sleep } from '@/lib/utils';

export async function getOptimizedRoute(_o: LatLng, _d: LatLng, _pct: number): Promise<Route> {
  await sleep(700);
  return routesData[0] as Route;
}
```

```typescript
// alto/services/insightService.ts
import insightsData from '@/data/aiInsights.json';
import type { AIInsight } from '@/types/insight';
import { sleep } from '@/lib/utils';

export async function getAIInsights(_vehicleId: string): Promise<AIInsight[]> {
  await sleep(500);
  return insightsData as AIInsight[];
}
```

- [ ] **Step 8: Run tests — expect PASS**

```bash
npm run test:run
```
Expected: All 7 tests PASS.

- [ ] **Step 9: Commit**

```bash
cd .. && git add alto/ && git commit -m "feat(alto): add utilities, services layer, and passing tests"
```

---

### Task 5: Zustand Store

**Files:**
- Create: `alto/store/authSlice.ts`
- Create: `alto/store/routeSlice.ts`
- Create: `alto/store/chargeSlice.ts`
- Create: `alto/__tests__/store/authSlice.test.ts`

- [ ] **Step 1: Write failing store test**

```typescript
// alto/__tests__/store/authSlice.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { useAuthStore } from '@/store/authSlice';

const mockUser = { id: 'u1', fullName: 'Test', email: 't@t.com', phone: '123' };

describe('authSlice', () => {
  beforeEach(() => useAuthStore.setState({ isAuthenticated: false, user: null, token: null }));
  it('starts unauthenticated', () => { expect(useAuthStore.getState().isAuthenticated).toBe(false); });
  it('sets auth on login', () => {
    useAuthStore.getState().login(mockUser, 'tok');
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
    expect(useAuthStore.getState().token).toBe('tok');
  });
  it('clears state on logout', () => {
    useAuthStore.getState().login(mockUser, 'tok');
    useAuthStore.getState().logout();
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(useAuthStore.getState().user).toBeNull();
  });
});
```

- [ ] **Step 2: Run test — expect FAIL**

```bash
cd alto && npm run test:run -- __tests__/store/authSlice.test.ts
```

- [ ] **Step 3: Create store/authSlice.ts**

```typescript
// alto/store/authSlice.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/types/auth';

interface AuthState {
  isAuthenticated: boolean; user: User | null; token: string | null;
  login: (user: User, token: string) => void; logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false, user: null, token: null,
      login: (user, token) => set({ isAuthenticated: true, user, token }),
      logout: () => set({ isAuthenticated: false, user: null, token: null }),
    }),
    { name: 'alto-auth' }
  )
);
```

- [ ] **Step 4: Create store/routeSlice.ts**

```typescript
// alto/store/routeSlice.ts
import { create } from 'zustand';
import type { Route, LatLng } from '@/types/route';

interface RouteState {
  origin: LatLng | null; destination: LatLng | null; currentRoute: Route | null; batteryPct: number;
  setRoute: (r: Route) => void; setBatteryPct: (p: number) => void; clearRoute: () => void;
}
export const useRouteStore = create<RouteState>((set) => ({
  origin: null, destination: null, currentRoute: null, batteryPct: 72,
  setRoute: (r) => set({ currentRoute: r }),
  setBatteryPct: (p) => set({ batteryPct: p }),
  clearRoute: () => set({ origin: null, destination: null, currentRoute: null }),
}));
```

- [ ] **Step 5: Create store/chargeSlice.ts**

```typescript
// alto/store/chargeSlice.ts
import { create } from 'zustand';
import type { Station, Reservation } from '@/types/station';

interface ChargeState {
  nearbyStations: Station[]; selectedStation: Station | null; activeReservation: Reservation | null;
  setStations: (s: Station[]) => void; selectStation: (s: Station | null) => void; setReservation: (r: Reservation) => void;
}
export const useChargeStore = create<ChargeState>((set) => ({
  nearbyStations: [], selectedStation: null, activeReservation: null,
  setStations: (s) => set({ nearbyStations: s }),
  selectStation: (s) => set({ selectedStation: s }),
  setReservation: (r) => set({ activeReservation: r }),
}));
```

- [ ] **Step 6: Run all tests — expect PASS**

```bash
npm run test:run
```
Expected: All 10 tests PASS.

- [ ] **Step 7: Commit**

```bash
cd .. && git add alto/ && git commit -m "feat(alto): add Zustand store slices with passing tests"
```

---

### Task 6: Shared Dashboard Components

**Files:**
- Create: `alto/components/dashboard/BatteryRing.tsx`
- Create: `alto/components/dashboard/RangeAnxietyGauge.tsx`
- Create: `alto/components/dashboard/LiveBadge.tsx`

- [ ] **Step 1: Create BatteryRing.tsx**

```typescript
// alto/components/dashboard/BatteryRing.tsx
'use client';
import { motion } from 'framer-motion';

interface BatteryRingProps { percentage: number; size?: number; rangeKm?: number; }

function getColor(p: number) { return p > 60 ? '#39FF14' : p > 30 ? '#FFB800' : '#FF4444'; }

export function BatteryRing({ percentage, size = 200, rangeKm }: BatteryRingProps) {
  const r = (size - 24) / 2;
  const circ = 2 * Math.PI * r;
  const color = getColor(percentage);
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={12} />
        <motion.circle
          cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={12} strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: circ * (1 - percentage / 100) }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          style={{ filter: `drop-shadow(0 0 8px ${color})` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-bold text-white">{percentage}<span className="text-xl">%</span></span>
        {rangeKm !== undefined && <span className="text-sm text-gray-400 mt-1">{rangeKm} km range</span>}
      </div>
      <div className="absolute inset-0 rounded-full animate-ping opacity-5" style={{ background: color, animationDuration: '3s' }} />
    </div>
  );
}
```

- [ ] **Step 2: Create RangeAnxietyGauge.tsx**

```typescript
// alto/components/dashboard/RangeAnxietyGauge.tsx
'use client';
import { motion } from 'framer-motion';

interface Props { rangeKm: number; maxRangeKm: number; }

export function RangeAnxietyGauge({ rangeKm, maxRangeKm }: Props) {
  const pct = Math.min(rangeKm / maxRangeKm, 1);
  return (
    <div className="w-full">
      <div className="flex justify-between text-xs text-gray-400 mb-2">
        <span>Range Confidence</span><span>{rangeKm} km remaining</span>
      </div>
      <div className="relative h-3 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{ background: 'linear-gradient(90deg, #FF4444 0%, #FFB800 40%, #39FF14 100%)' }}
          initial={{ width: 0 }} animate={{ width: `${pct * 100}%` }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white -translate-x-1/2"
          style={{ boxShadow: '0 0 8px rgba(255,255,255,0.6)' }}
          initial={{ left: '0%' }} animate={{ left: `${pct * 100}%` }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
      </div>
      <div className="flex justify-between text-xs text-gray-500 mt-1"><span>Low</span><span>High</span></div>
    </div>
  );
}
```

- [ ] **Step 3: Create LiveBadge.tsx**

```typescript
// alto/components/dashboard/LiveBadge.tsx
interface Props { status: 'Available' | 'Unavailable' | 'Busy'; }
const CONFIG = {
  Available: { color: '#39FF14', label: 'Available' },
  Busy: { color: '#FFB800', label: 'Busy' },
  Unavailable: { color: '#FF4444', label: 'Unavailable' },
};
export function LiveBadge({ status }: Props) {
  const { color, label } = CONFIG[status];
  return (
    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
      style={{ background: `${color}18`, border: `1px solid ${color}40` }}>
      <div className="w-2 h-2 rounded-full availability-pulse" style={{ background: color }} />
      <span className="text-xs font-medium" style={{ color }}>{label}</span>
    </div>
  );
}
```

- [ ] **Step 4: Create AIInsightCard.tsx**

```typescript
// alto/components/ai/AIInsightCard.tsx
'use client';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { AIInsight } from '@/types/insight';

const GLASS = { background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.1)' };

export function AIInsightCard({ icon, title, body, trend = 'neutral', compact }: AIInsight & { compact?: boolean }) {
  const IconComp = ((Icons as Record<string, unknown>)[icon] as React.ComponentType<{ size?: number; style?: React.CSSProperties }>) ?? Icons.Zap;
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColor = trend === 'up' ? '#39FF14' : trend === 'down' ? '#FF4444' : '#6B7280';
  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: '0 0 24px rgba(0,212,255,0.2)' }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={`rounded-2xl p-4 ${compact ? 'min-w-[180px]' : 'w-full'}`}
      style={GLASS}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="p-2 rounded-xl" style={{ background: 'rgba(0,212,255,0.1)' }}>
          <IconComp size={16} style={{ color: '#00D4FF' }} />
        </div>
        <TrendIcon size={14} style={{ color: trendColor }} />
      </div>
      <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">{title}</p>
      <p className="text-sm text-white leading-snug">{body}</p>
    </motion.div>
  );
}
```

- [ ] **Step 5: Commit**

```bash
cd .. && git add alto/ && git commit -m "feat(alto): add BatteryRing, RangeAnxietyGauge, LiveBadge, AIInsightCard"
```

---

### Task 7: Navigation Components + App Layout

**Files:**
- Create: `alto/components/navigation/BottomTabBar.tsx`
- Create: `alto/components/navigation/DesktopSidebar.tsx`
- Create: `alto/app/(app)/layout.tsx`

- [ ] **Step 1: Create BottomTabBar.tsx**

```typescript
// alto/components/navigation/BottomTabBar.tsx
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { House, Route, BatteryCharging, Sparkles, User } from 'lucide-react';

const TABS = [
  { href: '/home', icon: House, label: 'Home' },
  { href: '/route', icon: Route, label: 'Route' },
  { href: '/charge', icon: BatteryCharging, label: 'Charge' },
  { href: '/intelligence', icon: Sparkles, label: 'AI' },
  { href: '/profile', icon: User, label: 'Profile' },
] as const;

export function BottomTabBar() {
  const path = usePathname();
  return (
    <nav className="fixed bottom-4 left-4 right-4 z-50 lg:hidden">
      <div className="flex items-center justify-around rounded-2xl px-2 py-3"
        style={{ background: 'rgba(17,17,17,0.9)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
        {TABS.map(({ href, icon: Icon, label }) => {
          const active = path.startsWith(href);
          return (
            <Link key={href} href={href} className="relative flex flex-col items-center px-3 py-1">
              {active && (
                <motion.div layoutId="tab-pill" className="absolute inset-0 rounded-xl"
                  style={{ background: 'rgba(0,212,255,0.15)' }}
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }} />
              )}
              <Icon size={22} className="relative z-10" style={{ color: active ? '#00D4FF' : '#6B7280', filter: active ? 'drop-shadow(0 0 6px #00D4FF)' : 'none' }} />
              <span className="text-xs mt-1 relative z-10" style={{ color: active ? '#00D4FF' : '#6B7280' }}>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
```

- [ ] **Step 2: Create DesktopSidebar.tsx**

```typescript
// alto/components/navigation/DesktopSidebar.tsx
'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { House, Route, BatteryCharging, Sparkles, User } from 'lucide-react';

const TABS = [
  { href: '/home', icon: House, label: 'Home' },
  { href: '/route', icon: Route, label: 'Route' },
  { href: '/charge', icon: BatteryCharging, label: 'Charge' },
  { href: '/intelligence', icon: Sparkles, label: 'AI' },
  { href: '/profile', icon: User, label: 'Profile' },
] as const;

export function DesktopSidebar() {
  const path = usePathname();
  const [expanded, setExpanded] = useState(false);
  return (
    <nav className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 z-50 py-8 px-3 transition-all duration-300"
      style={{ width: expanded ? 180 : 64, background: 'rgba(17,17,17,0.95)', backdropFilter: 'blur(20px)', borderRight: '1px solid rgba(255,255,255,0.08)' }}
      onMouseEnter={() => setExpanded(true)} onMouseLeave={() => setExpanded(false)}>
      <div className="flex items-center gap-3 mb-8 px-1">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg,#00D4FF,#0088AA)' }}>
          <BatteryCharging size={16} className="text-white" />
        </div>
        {expanded && <span className="font-bold text-white text-lg">Alto</span>}
      </div>
      <div className="flex flex-col gap-1">
        {TABS.map(({ href, icon: Icon, label }) => {
          const active = path.startsWith(href);
          return (
            <Link key={href} href={href} className="flex items-center gap-3 px-2 py-3 rounded-xl transition-all"
              style={{ background: active ? 'rgba(0,212,255,0.15)' : 'transparent', border: active ? '1px solid rgba(0,212,255,0.2)' : '1px solid transparent' }}>
              <Icon size={20} style={{ color: active ? '#00D4FF' : '#6B7280', filter: active ? 'drop-shadow(0 0 4px #00D4FF)' : 'none', flexShrink: 0 }} />
              {expanded && <span className="text-sm font-medium whitespace-nowrap" style={{ color: active ? '#00D4FF' : '#6B7280' }}>{label}</span>}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
```

- [ ] **Step 3: Create (app)/layout.tsx**

```typescript
// alto/app/(app)/layout.tsx
'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authSlice';
import { BottomTabBar } from '@/components/navigation/BottomTabBar';
import { DesktopSidebar } from '@/components/navigation/DesktopSidebar';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  const router = useRouter();
  useEffect(() => { if (!isAuthenticated) router.replace('/login'); }, [isAuthenticated, router]);
  if (!isAuthenticated) return null;
  return (
    <div className="flex min-h-screen" style={{ background: '#0a0a0a' }}>
      <DesktopSidebar />
      <main className="flex-1 lg:ml-16 pb-24 lg:pb-0">{children}</main>
      <BottomTabBar />
    </div>
  );
}
```

- [ ] **Step 4: Commit**

```bash
cd .. && git add alto/ && git commit -m "feat(alto): add navigation components and app layout with auth guard"
```

---

### Task 8: Login Screen

**Files:**
- Create: `alto/features/auth/LoginForm.tsx`
- Create: `alto/features/auth/LoginPage.tsx`
- Create: `alto/app/login/page.tsx`

- [ ] **Step 1: Create LoginForm.tsx**

```typescript
// alto/features/auth/LoginForm.tsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/services/authService';
import { useAuthStore } from '@/store/authSlice';
import toast from 'react-hot-toast';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login: setAuth } = useAuthStore();
  const router = useRouter();

  const INPUT = "w-full px-4 py-3 rounded-xl text-white placeholder-gray-500 focus:outline-none transition-colors";
  const INPUT_STYLE = { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' };
  const INPUT_FOCUS = { border: '1px solid #00D4FF' };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const session = await login(email, password);
      setAuth(session.user, session.token);
      router.push('/home');
    } catch { toast.error('Invalid credentials'); }
    finally { setLoading(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input type="email" value={email} onChange={e => setEmail(e.target.value)}
        placeholder="Email address" className={INPUT} style={INPUT_STYLE}
        onFocus={e => Object.assign(e.target.style, INPUT_FOCUS)}
        onBlur={e => Object.assign(e.target.style, INPUT_STYLE)} required />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)}
        placeholder="Password" className={INPUT} style={INPUT_STYLE}
        onFocus={e => Object.assign(e.target.style, INPUT_FOCUS)}
        onBlur={e => Object.assign(e.target.style, INPUT_STYLE)} required />
      <button type="submit" disabled={loading} className="w-full py-3 rounded-xl font-semibold text-white transition-opacity"
        style={{ background: 'linear-gradient(135deg,#00D4FF,#0088AA)', boxShadow: '0 0 24px rgba(0,212,255,0.3)', opacity: loading ? 0.7 : 1 }}>
        {loading ? 'Signing in...' : 'Sign In'}
      </button>
    </form>
  );
}
```

- [ ] **Step 2: Create LoginPage.tsx**

```typescript
// alto/features/auth/LoginPage.tsx
'use client';
import { motion } from 'framer-motion';
import { BatteryCharging } from 'lucide-react';
import { LoginForm } from './LoginForm';

export function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden" style={{ background: '#0a0a0a' }}>
      <div className="absolute w-96 h-96 rounded-full pointer-events-none opacity-20"
        style={{ background: 'radial-gradient(circle,#00D4FF 0%,transparent 70%)', top: '5%', left: '50%', transform: 'translateX(-50%)', filter: 'blur(60px)' }} />
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-sm relative">
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
            style={{ background: 'linear-gradient(135deg,#00D4FF,#0088AA)', boxShadow: '0 0 40px rgba(0,212,255,0.4)' }}>
            <BatteryCharging size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">Alto</h1>
          <p className="text-gray-400 text-sm mt-1">EV Routing Intelligence</p>
        </div>
        <div className="p-6 rounded-2xl" style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <h2 className="text-xl font-semibold text-white mb-6">Sign In</h2>
          <LoginForm />
        </div>
      </motion.div>
    </div>
  );
}
```

- [ ] **Step 3: Create app/login/page.tsx**

```typescript
// alto/app/login/page.tsx
import { LoginPage } from '@/features/auth/LoginPage';
export default function Login() { return <LoginPage />; }
```

- [ ] **Step 4: Verify login works**

```bash
cd alto && npm run dev
```
Open `http://localhost:3000/login`. Enter any email/password → should navigate to `/home` (shows null since HomeScreen not built yet — that's OK).

- [ ] **Step 5: Commit**

```bash
cd .. && git add alto/ && git commit -m "feat(alto): add login screen with mocked auth"
```

---

### Task 9: Home Screen

**Files:**
- Create: `alto/features/home/HomeScreen.tsx`
- Create: `alto/app/(app)/home/page.tsx`

- [ ] **Step 1: Create HomeScreen.tsx**

```typescript
// alto/features/home/HomeScreen.tsx
'use client';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { BatteryRing } from '@/components/dashboard/BatteryRing';
import { RangeAnxietyGauge } from '@/components/dashboard/RangeAnxietyGauge';
import { AIInsightCard } from '@/components/ai/AIInsightCard';
import { getAIInsights } from '@/services/insightService';
import { useAuthStore } from '@/store/authSlice';
import vehiclesData from '@/data/vehicles.json';
import type { Vehicle } from '@/types/vehicle';

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
}

function EnergyParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="particle" style={{
          left: `${10 + (i * 9) % 85}%`, top: `${15 + (i * 11) % 75}%`,
          animationDelay: `${i * 0.5}s`, animationDuration: `${3 + (i % 3)}s`,
        }} />
      ))}
    </div>
  );
}

export function HomeScreen() {
  const user = useAuthStore(s => s.user);
  const router = useRouter();
  const vehicle = (vehiclesData as Vehicle[])[0];
  const { data: insights = [] } = useQuery({
    queryKey: ['insights', vehicle.id],
    queryFn: () => getAIInsights(vehicle.id),
  });

  return (
    <div className="relative min-h-screen overflow-hidden p-6 pt-10">
      <EnergyParticles />
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 relative">
        <p className="text-gray-400 text-sm">{greeting()},</p>
        <h1 className="text-2xl font-bold text-white">{user?.fullName ?? 'Driver'}</h1>
        <p className="text-sm mt-0.5" style={{ color: '#00D4FF' }}>{vehicle.name}</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }} className="flex justify-center mb-8">
        <BatteryRing percentage={vehicle.currentBatteryPct} rangeKm={vehicle.currentRangeKm} size={220} />
      </motion.div>

      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="mb-8">
        <p className="text-xs text-gray-400 uppercase tracking-wider mb-3">Range Confidence</p>
        <RangeAnxietyGauge rangeKm={vehicle.currentRangeKm} maxRangeKm={vehicle.maxRangeKm} />
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="mb-8">
        <p className="text-xs text-gray-400 uppercase tracking-wider mb-3">AI Insights</p>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {insights.slice(0, 4).map((ins, i) => (
            <motion.div key={ins.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + i * 0.1 }}>
              <AIInsightCard {...ins} compact />
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.button initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }} whileTap={{ scale: 0.97 }}
        onClick={() => router.push('/route')}
        className="w-full py-4 rounded-2xl font-semibold text-white text-lg"
        style={{ background: 'linear-gradient(135deg,#00D4FF,#0088AA)', boxShadow: '0 0 30px rgba(0,212,255,0.3)' }}>
        Start Intelligent Route
      </motion.button>
    </div>
  );
}
```

- [ ] **Step 2: Create page.tsx**

```typescript
// alto/app/(app)/home/page.tsx
import { HomeScreen } from '@/features/home/HomeScreen';
export default function Home() { return <HomeScreen />; }
```

- [ ] **Step 3: Verify in browser**

```bash
npm run dev
```
Login → should see Home screen with animated BatteryRing at 72%, range gauge, 4 AI insight cards, and CTA button.

- [ ] **Step 4: Commit**

```bash
cd .. && git add alto/ && git commit -m "feat(alto): add Home screen with battery ring and AI insight cards"
```

---

### Task 10: ChargerCard + SmartReserveModal + Charge Screen

**Files:**
- Create: `alto/components/dashboard/ChargerCard.tsx`
- Create: `alto/components/dashboard/SmartReserveModal.tsx`
- Create: `alto/features/charge/ChargeScreen.tsx`
- Create: `alto/app/(app)/charge/page.tsx`

- [ ] **Step 1: Create ChargerCard.tsx**

```typescript
// alto/components/dashboard/ChargerCard.tsx
'use client';
import { motion } from 'framer-motion';
import { Zap, Clock, MapPin, Shield, Star } from 'lucide-react';
import { LiveBadge } from './LiveBadge';
import type { Station } from '@/types/station';

interface Props { station: Station; onReserve: () => void; onSmartReserve: () => void; }

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <div className="text-gray-400">{icon}</div>
      <span className="text-xs text-gray-500">{label}</span>
      <span className="text-xs font-semibold text-white">{value}</span>
    </div>
  );
}

export function ChargerCard({ station, onReserve, onSmartReserve }: Props) {
  return (
    <motion.div whileHover={{ y: -2 }} className="rounded-2xl p-4"
      style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.1)' }}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-white text-sm">{station.name}</h3>
            {station.isAIRecommended && (
              <span className="text-xs px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(0,212,255,0.15)', color: '#00D4FF', border: '1px solid rgba(0,212,255,0.3)' }}>
                AI Pick
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <MapPin size={11} /><span>{station.distanceKm} km</span>
          </div>
        </div>
        <LiveBadge status={station.status} />
      </div>
      <div className="grid grid-cols-4 gap-2 mb-4">
        <Stat icon={<Clock size={13} />} label="Wait" value={`${station.waitTimeMinutes}m`} />
        <Stat icon={<Zap size={13} />} label="Speed" value={`${station.chargingSpeedKw}kW`} />
        <Stat icon={<Shield size={13} />} label="Score" value={`${station.reliability}%`} />
        <Stat icon={<Star size={13} />} label="Cost" value={station.pricePerHour} />
      </div>
      <div className="flex gap-2">
        <button onClick={onReserve} className="flex-1 py-2.5 rounded-xl text-sm font-medium text-gray-300 transition-colors"
          style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}>
          Reserve
        </button>
        <button onClick={onSmartReserve} className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white"
          style={{ background: 'linear-gradient(135deg,#00D4FF,#0088AA)' }}>
          AI Smart Reserve
        </button>
      </div>
    </motion.div>
  );
}
```

- [ ] **Step 2: Create SmartReserveModal.tsx**

```typescript
// alto/components/dashboard/SmartReserveModal.tsx
'use client';
import { motion } from 'framer-motion';
import { X, Zap, Clock, CreditCard } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { reserveStation } from '@/services/stationService';
import { useChargeStore } from '@/store/chargeSlice';
import toast from 'react-hot-toast';
import type { Station } from '@/types/station';

function Row({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-white/5">
      <div className="flex items-center gap-2 text-gray-400">{icon}<span className="text-sm">{label}</span></div>
      <span className="text-sm font-medium text-white">{value}</span>
    </div>
  );
}

interface Props { station: Station; onClose: () => void; onConfirm: () => void; }

export function SmartReserveModal({ station, onClose, onConfirm }: Props) {
  const slot = station.slots.find(s => !s.isBooked) ?? station.slots[0];
  const setReservation = useChargeStore(s => s.setReservation);

  const { mutate, isPending } = useMutation({
    mutationFn: () => reserveStation(station._id, slot),
    onSuccess: (res) => { setReservation(res); toast.success(`Reserved at ${station.name}!`); onConfirm(); },
    onError: () => toast.error('Reservation failed. Try again.'),
  });

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose} className="fixed inset-0 bg-black/60 z-40" style={{ backdropFilter: 'blur(4px)' }} />
      <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl p-6 pb-10"
        style={{ background: '#111', border: '1px solid rgba(255,255,255,0.1)', borderBottom: 'none' }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="text-xs uppercase tracking-wider mb-1" style={{ color: '#00D4FF' }}>AI Smart Reserve</div>
            <h2 className="text-xl font-bold text-white">{station.name}</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
            <X size={18} className="text-gray-400" />
          </button>
        </div>
        <div className="space-y-1 mb-6">
          <Row icon={<Clock size={16} />} label="AI Recommended Slot" value={`${slot.startTime} – ${slot.endTime}`} />
          <Row icon={<Zap size={16} />} label="Charging Speed" value={`${station.chargingSpeedKw} kW`} />
          <Row icon={<CreditCard size={16} />} label="Estimated Cost" value={`${station.pricePerHour} + ${station.taxPercent}% tax`} />
        </div>
        <button onClick={() => mutate()} disabled={isPending} className="w-full py-4 rounded-2xl font-semibold text-white text-base"
          style={{ background: isPending ? 'rgba(0,212,255,0.3)' : 'linear-gradient(135deg,#00D4FF,#0088AA)', boxShadow: '0 0 24px rgba(0,212,255,0.2)' }}>
          {isPending ? 'Confirming...' : 'Confirm Reservation'}
        </button>
      </motion.div>
    </>
  );
}
```

- [ ] **Step 3: Create ChargeScreen.tsx**

```typescript
// alto/features/charge/ChargeScreen.tsx
'use client';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { ChargerCard } from '@/components/dashboard/ChargerCard';
import { SmartReserveModal } from '@/components/dashboard/SmartReserveModal';
import { getNearbyStations } from '@/services/stationService';
import type { Station } from '@/types/station';

const FILTERS = ['All', 'Fast (>100kW)', 'Available', 'Nearby'] as const;
type Filter = typeof FILTERS[number];

export function ChargeScreen() {
  const [filter, setFilter] = useState<Filter>('All');
  const [selected, setSelected] = useState<Station | null>(null);
  const { data: stations = [], isLoading } = useQuery({ queryKey: ['stations'], queryFn: () => getNearbyStations(12.97, 77.59) });

  const filtered = stations.filter(s => {
    if (filter === 'Fast (>100kW)') return s.chargingSpeedKw > 100;
    if (filter === 'Available') return s.status === 'Available';
    if (filter === 'Nearby') return s.distanceKm <= 5;
    return true;
  });

  return (
    <div className="min-h-screen p-6 pt-10">
      <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-2xl font-bold text-white mb-6">
        Charging Hub
      </motion.h1>
      <div className="flex gap-2 overflow-x-auto pb-3 mb-6 scrollbar-hide">
        {FILTERS.map(f => (
          <button key={f} onClick={() => setFilter(f)} className="px-4 py-2 rounded-full text-sm whitespace-nowrap"
            style={{ background: filter === f ? 'rgba(0,212,255,0.2)' : 'rgba(255,255,255,0.05)', border: `1px solid ${filter === f ? '#00D4FF' : 'rgba(255,255,255,0.1)'}`, color: filter === f ? '#00D4FF' : '#9CA3AF' }}>
            {f}
          </button>
        ))}
      </div>
      {isLoading ? (
        <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="h-40 rounded-2xl animate-pulse" style={{ background: 'rgba(255,255,255,0.05)' }} />)}</div>
      ) : (
        <motion.div variants={{ show: { transition: { staggerChildren: 0.08 } } }} initial="hidden" animate="show" className="space-y-4">
          {filtered.map(s => (
            <motion.div key={s._id} variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
              <ChargerCard station={s} onReserve={() => setSelected(s)} onSmartReserve={() => setSelected(s)} />
            </motion.div>
          ))}
        </motion.div>
      )}
      <AnimatePresence>
        {selected && <SmartReserveModal station={selected} onClose={() => setSelected(null)} onConfirm={() => setSelected(null)} />}
      </AnimatePresence>
    </div>
  );
}
```

- [ ] **Step 4: Create page.tsx**

```typescript
// alto/app/(app)/charge/page.tsx
import { ChargeScreen } from '@/features/charge/ChargeScreen';
export default function Charge() { return <ChargeScreen />; }
```

- [ ] **Step 5: Verify**

Open `/charge`. Should see filter bar + 8 station cards with live badges. "AI Smart Reserve" should open bottom sheet modal.

- [ ] **Step 6: Commit**

```bash
cd .. && git add alto/ && git commit -m "feat(alto): add Charging Hub screen with ChargerCard and SmartReserveModal"
```

---

### Task 11: Google Maps + Route Screen

**Files:**
- Create: `alto/components/maps/LiveRouteMap.tsx`
- Create: `alto/components/ai/AIFloatingPanel.tsx`
- Create: `alto/features/route/RouteBottomSheet.tsx`
- Create: `alto/features/route/RouteScreen.tsx`
- Create: `alto/app/(app)/route/page.tsx`

- [ ] **Step 1: Create LiveRouteMap.tsx**

```typescript
// alto/components/maps/LiveRouteMap.tsx
'use client';
import { useEffect, useRef } from 'react';
import { APIProvider, Map, useMap } from '@vis.gl/react-google-maps';
import { SILVER_MAP_STYLE, DEFAULT_CENTER, DEFAULT_ZOOM } from '@/lib/googleMaps';
import type { Route, LatLng } from '@/types/route';
import type { Station } from '@/types/station';

function RouteLine({ waypoints }: { waypoints: LatLng[] }) {
  const map = useMap();
  const lineRef = useRef<google.maps.Polyline | null>(null);
  useEffect(() => {
    if (!map || waypoints.length < 2) return;
    lineRef.current = new google.maps.Polyline({ path: waypoints, strokeColor: '#00D4FF', strokeWeight: 4, strokeOpacity: 0.9, map });
    return () => { lineRef.current?.setMap(null); };
  }, [map, waypoints]);
  return null;
}

function StationMarkers({ stations, onStationClick }: { stations: Station[]; onStationClick?: (s: Station) => void }) {
  const map = useMap();
  const refs = useRef<google.maps.Marker[]>([]);
  useEffect(() => {
    if (!map) return;
    refs.current.forEach(m => m.setMap(null)); refs.current = [];
    stations.forEach(s => {
      const color = s.status === 'Available' ? '#39FF14' : s.status === 'Busy' ? '#FFB800' : '#FF4444';
      const m = new google.maps.Marker({ map, position: { lat: s.latitude, lng: s.longitude },
        icon: { path: google.maps.SymbolPath.CIRCLE, scale: 8, fillColor: color, fillOpacity: 1, strokeColor: '#fff', strokeWeight: 2 } });
      m.addListener('click', () => onStationClick?.(s));
      refs.current.push(m);
    });
    return () => { refs.current.forEach(m => m.setMap(null)); };
  }, [map, stations, onStationClick]);
  return null;
}

function EVMarker({ waypoints }: { waypoints: LatLng[] }) {
  const map = useMap();
  const markerRef = useRef<google.maps.Marker | null>(null);
  const animRef = useRef<number | null>(null);
  useEffect(() => {
    if (!map || waypoints.length < 2) return;
    markerRef.current = new google.maps.Marker({ map, position: waypoints[0], zIndex: 10,
      icon: { path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW, scale: 5, fillColor: '#00D4FF', fillOpacity: 1, strokeColor: '#fff', strokeWeight: 1 } });
    const dur = 25000; let t0: number | null = null;
    const animate = (ts: number) => {
      if (!t0) t0 = ts;
      const p = Math.min((ts - t0) / dur, 1);
      const ri = p * (waypoints.length - 1); const fi = Math.floor(ri); const fr = ri - fi;
      if (fi < waypoints.length - 1) {
        const a = waypoints[fi], b = waypoints[fi + 1];
        markerRef.current?.setPosition({ lat: a.lat + (b.lat - a.lat) * fr, lng: a.lng + (b.lng - a.lng) * fr });
      }
      if (p < 1) animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); markerRef.current?.setMap(null); };
  }, [map, waypoints]);
  return null;
}

interface Props { route?: Route | null; stations?: Station[]; onStationClick?: (s: Station) => void; }

function MapContents({ route, stations = [], onStationClick }: Props) {
  return (
    <>
      {route && <RouteLine waypoints={route.waypoints} />}
      {route && <EVMarker waypoints={route.waypoints} />}
      <StationMarkers stations={stations} onStationClick={onStationClick} />
    </>
  );
}

export function LiveRouteMap({ route, stations, onStationClick }: Props) {
  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
      <Map style={{ width: '100%', height: '100%' }} defaultCenter={DEFAULT_CENTER} defaultZoom={DEFAULT_ZOOM}
        styles={SILVER_MAP_STYLE as google.maps.MapTypeStyle[]} disableDefaultUI gestureHandling="greedy">
        <MapContents route={route} stations={stations} onStationClick={onStationClick} />
      </Map>
    </APIProvider>
  );
}
```

- [ ] **Step 2: Create AIFloatingPanel.tsx**

```typescript
// alto/components/ai/AIFloatingPanel.tsx
'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, X } from 'lucide-react';

interface Props { insight: string; visible: boolean; bottomOffset?: string; }

export function AIFloatingPanel({ insight, visible, bottomOffset = '52vh' }: Props) {
  const [text, setText] = useState('');
  const [dismissed, setDismissed] = useState(false);
  useEffect(() => {
    if (!visible || dismissed) return;
    setText(''); let i = 0;
    const t = setInterval(() => { if (i < insight.length) { setText(insight.slice(0, ++i)); } else clearInterval(t); }, 28);
    return () => clearInterval(t);
  }, [insight, visible, dismissed]);
  if (dismissed || !visible) return null;
  return (
    <motion.div initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }}
      transition={{ type: 'spring', damping: 20, stiffness: 200 }}
      className="absolute left-4 right-4 z-30" style={{ bottom: bottomOffset }}>
      <div className="flex items-start gap-3 p-4 rounded-2xl"
        style={{ background: 'rgba(0,212,255,0.1)', backdropFilter: 'blur(16px)', border: '1px solid rgba(0,212,255,0.3)' }}>
        <Sparkles size={16} style={{ color: '#00D4FF', flexShrink: 0, marginTop: 2 }} />
        <p className="text-sm text-white flex-1 leading-relaxed">{text}</p>
        <button onClick={() => setDismissed(true)}><X size={14} className="text-gray-400" /></button>
      </div>
    </motion.div>
  );
}
```

- [ ] **Step 3: Create RouteBottomSheet.tsx**

```typescript
// alto/features/route/RouteBottomSheet.tsx
'use client';
import dynamic from 'next/dynamic';
import { MapPin, Clock, Zap } from 'lucide-react';
import type { Route } from '@/types/route';

const BatteryChart = dynamic(() => import('./BatteryChart').then(m => ({ default: m.BatteryChart })), { ssr: false });

function buildProjection(route: Route) {
  return Array.from({ length: 11 }, (_, i) => {
    const km = Math.round((route.totalDistanceKm / 10) * i);
    const base = 72 - (i / 10) * 38;
    const bump = route.stops.some(s => Math.abs(s.arrivalBatteryPct - (72 - (i/10)*38)) < 10) ? 30 : 0;
    return { km, battery: Math.max(5, Math.round(base + (bump && i > 3 ? bump : 0))) };
  });
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex-1 p-3 rounded-xl text-center" style={{ background: 'rgba(255,255,255,0.05)' }}>
      <div className="flex justify-center text-gray-400 mb-1">{icon}</div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-sm font-semibold text-white">{value}</p>
    </div>
  );
}

export function RouteBottomSheet({ route }: { route: Route }) {
  return (
    <div className="overflow-y-auto px-4 pb-4" style={{ height: 'calc(50vh - 48px)' }}>
      <div className="flex gap-3 mb-4">
        <Stat icon={<MapPin size={13} />} label="Distance" value={`${route.totalDistanceKm} km`} />
        <Stat icon={<Clock size={13} />} label="ETA" value={`${route.estimatedTimeMin} min`} />
        <Stat icon={<Zap size={13} />} label="Arrival" value={`${route.batteryAtDestinationPct}%`} />
      </div>
      <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Battery Projection</p>
      <BatteryChart data={buildProjection(route)} />
      {route.stops.map((stop, i) => (
        <div key={i} className="flex items-center gap-3 p-3 rounded-xl mt-3"
          style={{ background: 'rgba(57,255,20,0.05)', border: '1px solid rgba(57,255,20,0.15)' }}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(57,255,20,0.15)' }}>
            <Zap size={14} style={{ color: '#39FF14' }} />
          </div>
          <div>
            <p className="text-sm font-medium text-white">{stop.stationName}</p>
            <p className="text-xs text-gray-400">Charge {stop.arrivalBatteryPct}% → {stop.chargeToPercent}% · {stop.chargeDurationMin} min</p>
          </div>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 4: Create BatteryChart.tsx**

```typescript
// alto/features/route/BatteryChart.tsx
'use client';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';

export function BatteryChart({ data }: { data: { km: number; battery: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={110}>
      <LineChart data={data}>
        <XAxis dataKey="km" tick={{ fill: '#6B7280', fontSize: 10 }} unit="km" />
        <YAxis tick={{ fill: '#6B7280', fontSize: 10 }} unit="%" domain={[0, 100]} width={32} />
        <Tooltip contentStyle={{ background: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }}
          labelStyle={{ color: '#9CA3AF' }} itemStyle={{ color: '#00D4FF' }} />
        <Line type="monotone" dataKey="battery" stroke="#00D4FF" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}
```

- [ ] **Step 5: Create RouteScreen.tsx**

```typescript
// alto/features/route/RouteScreen.tsx
'use client';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Navigation } from 'lucide-react';
import { AIFloatingPanel } from '@/components/ai/AIFloatingPanel';
import { RouteBottomSheet } from './RouteBottomSheet';
import { getOptimizedRoute } from '@/services/routeService';
import { getNearbyStations } from '@/services/stationService';

const LiveRouteMap = dynamic(
  () => import('@/components/maps/LiveRouteMap').then(m => ({ default: m.LiveRouteMap })),
  { ssr: false, loading: () => <div className="w-full h-full animate-pulse" style={{ background: '#e5e5e5' }} /> }
);

export function RouteScreen() {
  const [sheetOpen, setSheetOpen] = useState(true);
  const { data: route } = useQuery({ queryKey: ['route'], queryFn: () => getOptimizedRoute({ lat: 12.9279, lng: 77.6271 }, { lat: 12.9698, lng: 77.7500 }, 72) });
  const { data: stations = [] } = useQuery({ queryKey: ['stations'], queryFn: () => getNearbyStations(12.97, 77.59) });

  return (
    <div className="relative h-screen overflow-hidden">
      <div className="absolute inset-0" style={{ bottom: sheetOpen ? '50vh' : '64px' }}>
        <LiveRouteMap route={route} stations={stations} />
      </div>

      <div className="absolute top-4 left-4 right-4 z-10">
        <div className="flex items-center gap-3 px-4 py-3 rounded-2xl"
          style={{ background: 'rgba(10,10,10,0.92)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <Search size={16} className="text-gray-400" />
          <span className="text-gray-300 text-sm flex-1">Whitefield, Bangalore</span>
          <Navigation size={16} style={{ color: '#00D4FF' }} />
        </div>
      </div>

      <AnimatePresence>
        {route?.aiInsight && <AIFloatingPanel insight={route.aiInsight} visible={true} bottomOffset={sheetOpen ? 'calc(50vh + 8px)' : '80px'} />}
      </AnimatePresence>

      <motion.div
        className="absolute bottom-0 left-0 right-0 z-20 rounded-t-3xl"
        style={{ background: '#0F0F0F', border: '1px solid rgba(255,255,255,0.1)', borderBottom: 'none', height: '50vh' }}
        animate={{ y: sheetOpen ? 0 : 'calc(50vh - 48px)' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}>
        <div className="flex justify-center pt-3 pb-2 cursor-pointer" onClick={() => setSheetOpen(o => !o)}>
          <div className="w-10 h-1 rounded-full bg-gray-600" />
        </div>
        {route && <RouteBottomSheet route={route} />}
      </motion.div>
    </div>
  );
}
```

- [ ] **Step 6: Create page.tsx**

```typescript
// alto/app/(app)/route/page.tsx
import { RouteScreen } from '@/features/route/RouteScreen';
export default function RoutePage() { return <RouteScreen />; }
```

- [ ] **Step 7: Add Google Maps API key to .env.local, verify**

```bash
npm run dev
```
Open `/route`. Map should render gray Silver style with a neon blue polyline, station markers, animated EV dot, and AI panel with typewriter text. Bottom sheet shows stats + battery chart + charging stop.

- [ ] **Step 8: Commit**

```bash
cd .. && git add alto/ && git commit -m "feat(alto): add Route Intelligence screen with Google Maps and AI panel"
```

---

### Task 12: Intelligence Stub + Profile Stub Screens

**Files:**
- Create: `alto/features/intelligence/IntelligenceScreen.tsx`
- Create: `alto/features/intelligence/EnergyChart.tsx`
- Create: `alto/features/profile/ProfileScreen.tsx`
- Create: `alto/app/(app)/intelligence/page.tsx`
- Create: `alto/app/(app)/profile/page.tsx`

- [ ] **Step 1: Create EnergyChart.tsx**

```typescript
// alto/features/intelligence/EnergyChart.tsx
'use client';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

const DATA = [{ w: 'W1', v: 320 }, { w: 'W2', v: 480 }, { w: 'W3', v: 290 }, { w: 'W4', v: 650 }, { w: 'W5', v: 410 }, { w: 'W6', v: 380 }];

export function EnergyChart() {
  return (
    <ResponsiveContainer width="100%" height={150}>
      <AreaChart data={DATA}>
        <defs>
          <linearGradient id="eg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#00D4FF" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#00D4FF" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="w" tick={{ fill: '#6B7280', fontSize: 11 }} />
        <YAxis tick={{ fill: '#6B7280', fontSize: 11 }} unit="₹" width={40} />
        <Tooltip contentStyle={{ background: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }}
          labelStyle={{ color: '#9CA3AF' }} itemStyle={{ color: '#00D4FF' }} />
        <Area type="monotone" dataKey="v" stroke="#00D4FF" strokeWidth={2} fill="url(#eg)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}
```

- [ ] **Step 2: Create IntelligenceScreen.tsx**

```typescript
// alto/features/intelligence/IntelligenceScreen.tsx
'use client';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { AIInsightCard } from '@/components/ai/AIInsightCard';
import insightsData from '@/data/aiInsights.json';
import type { AIInsight } from '@/types/insight';

const EnergyChart = dynamic(() => import('./EnergyChart').then(m => ({ default: m.EnergyChart })), { ssr: false });

export function IntelligenceScreen() {
  const insights = insightsData as AIInsight[];
  return (
    <div className="min-h-screen p-6 pt-10">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-bold text-white">AI Intelligence</h1>
        <p className="text-sm text-gray-400 mt-1">Powered by Alto AI</p>
      </motion.div>
      <motion.div variants={{ show: { transition: { staggerChildren: 0.08 } } }} initial="hidden" animate="show"
        className="grid grid-cols-2 gap-3 mb-6">
        {insights.slice(0, 4).map(ins => (
          <motion.div key={ins.id} variants={{ hidden: { opacity: 0, scale: 0.95 }, show: { opacity: 1, scale: 1 } }}>
            <AIInsightCard {...ins} />
          </motion.div>
        ))}
      </motion.div>
      <div className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
        <p className="text-xs text-gray-400 uppercase tracking-wider mb-3">Weekly Energy Spending (₹)</p>
        <EnergyChart />
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create ProfileScreen.tsx**

```typescript
// alto/features/profile/ProfileScreen.tsx
'use client';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Bookmark, Settings, Crown, LogOut, ChevronRight } from 'lucide-react';
import { useAuthStore } from '@/store/authSlice';
import vehiclesData from '@/data/vehicles.json';
import type { Vehicle } from '@/types/vehicle';

const ITEMS = [
  { icon: Bookmark, label: 'Saved Stations' },
  { icon: Settings, label: 'Preferences' },
  { icon: Crown, label: 'Membership' },
] as const;

export function ProfileScreen() {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const vehicle = (vehiclesData as Vehicle[])[0];
  const handleLogout = () => { logout(); router.replace('/login'); };

  return (
    <div className="min-h-screen p-6 pt-10">
      <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-2xl font-bold text-white mb-8">Profile</motion.h1>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="flex items-center gap-4 p-4 rounded-2xl mb-8"
        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white flex-shrink-0"
          style={{ background: 'linear-gradient(135deg,#00D4FF,#0088AA)' }}>
          {user?.fullName?.charAt(0) ?? 'A'}
        </div>
        <div>
          <p className="font-semibold text-white text-lg">{user?.fullName}</p>
          <p className="text-sm text-gray-400">{user?.email}</p>
          <p className="text-xs mt-0.5" style={{ color: '#00D4FF' }}>{vehicle.name} · {vehicle.plate}</p>
        </div>
      </motion.div>
      <div className="space-y-2 mb-6">
        {ITEMS.map(({ icon: Icon, label }) => (
          <motion.button key={label} whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-between p-4 rounded-2xl"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="flex items-center gap-3"><Icon size={17} className="text-gray-400" /><span className="text-sm text-white">{label}</span></div>
            <ChevronRight size={15} className="text-gray-600" />
          </motion.button>
        ))}
      </div>
      <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl"
        style={{ background: 'rgba(255,68,68,0.1)', border: '1px solid rgba(255,68,68,0.2)' }}>
        <LogOut size={16} style={{ color: '#FF4444' }} />
        <span className="text-sm font-medium" style={{ color: '#FF4444' }}>Sign Out</span>
      </button>
    </div>
  );
}
```

- [ ] **Step 4: Create page.tsx files**

```typescript
// alto/app/(app)/intelligence/page.tsx
import { IntelligenceScreen } from '@/features/intelligence/IntelligenceScreen';
export default function Intelligence() { return <IntelligenceScreen />; }

// alto/app/(app)/profile/page.tsx
import { ProfileScreen } from '@/features/profile/ProfileScreen';
export default function Profile() { return <ProfileScreen />; }
```

- [ ] **Step 5: Run all tests**

```bash
cd alto && npm run test:run
```
Expected: All 10 tests PASS.

- [ ] **Step 6: Verify all screens in browser**

Navigate through all 5 tabs. Verify:
- Home: BatteryRing animates, insights scroll horizontally, CTA navigates to Route
- Route: Gray map renders, AI panel typewriters, bottom sheet toggles with pull handle
- Charge: Filter buttons work, cards list, Smart Reserve modal opens/closes with spring animation
- Intelligence: 2×2 grid + energy area chart
- Profile: Avatar, list items, Sign Out navigates to /login

- [ ] **Step 7: Final commit**

```bash
cd .. && git add alto/ && git commit -m "feat(alto): complete Alto MVP — all 5 screens implemented"
```

---

## Self-Review Checklist

**Spec coverage:**
- [x] Login screen with mocked auth
- [x] Home: BatteryRing, RangeAnxietyGauge, AIInsightCard horizontal scroll, CTA
- [x] Route: Google Maps gray style, polyline, EV animation, AI panel, bottom sheet, battery chart
- [x] Charge: ChargerCard list, filters, SmartReserveModal with React Query mutation
- [x] Intelligence stub: 2×2 AI cards + area chart
- [x] Profile stub: Avatar, menu items, Sign Out
- [x] BottomTabBar + DesktopSidebar navigation
- [x] Framer Motion page transitions, hover effects, spring modals
- [x] Glassmorphism cards throughout
- [x] Mock services matching NearestStationModel and BookingModel shapes
- [x] Zustand auth persisted, route/charge reset on reload
- [x] React Query wrapping all services
- [x] CSS keyframe animations (pulse dot, floating particles) not Framer
- [x] Tests for utils, services, store (10 tests)
- [x] `dynamic(() => import(...), { ssr: false })` on maps and charts

**Out of scope confirmed:** real backend, push notifications, payments, QR scanning, i18n.
