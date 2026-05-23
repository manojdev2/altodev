# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A full-stack EV charging station platform with four components that share a single MongoDB Atlas database:

| Component | Path | Stack |
|---|---|---|
| Mobile App | `mobile/` | Flutter 3.9.2+ / Dart |
| Admin Panel Frontend | `admin/` | Next.js 16 / React 19 / TypeScript / Tailwind 4 |
| Admin Backend | `admin/UV Charging/` | Express.js 5 / Node.js / MongoDB (ES Modules) |
| Landing Page | `landingPage/` | Next.js 16 / TypeScript / Tailwind 4 |

## Commands

### Mobile App (`mobile/`)
```bash
flutter pub get          # Install dependencies
flutter run              # Run on connected device/emulator
flutter build apk --release
flutter build ios --release
flutter test             # Run tests
```

### Admin Panel (`admin/`)
```bash
npm install              # Installs both frontend and backend deps (via postinstall hook)
npm run dev              # Starts both frontend (:3000) and backend (:3001) concurrently
npm run dev:frontend     # Next.js only
npm run dev:backend      # Express only (equivalent to: cd "UV Charging" && npm run dev)
npm run build && npm start
npm run lint
```

### Admin with Docker (production-like)
```bash
docker compose up --build -d   # Nginx (80) → Next.js (3000) + Express (5001)
```

### Landing Page (`landingPage/`)
```bash
npm install
npm run dev    # http://localhost:3000
npm run build && npm start
```

## Architecture

### Data Flow
```
Mobile App (Flutter + Dio)  →  Express Backend (Render)  →  MongoDB Atlas
Admin Frontend (Next.js)    →  [proxied via next.config.ts] → Express Backend → MongoDB Atlas
```

The Next.js admin frontend rewrites all `/api/v1/*` requests to the Express backend via `next.config.ts`. In dev, this hits `http://localhost:3001`; in Docker/production, Nginx handles routing.

### Mobile App Architecture
- **State management**: GetX (controllers, observables, dependency injection via `Get.put`/`Get.find`)
- **HTTP**: `NetworkClient` (Dio wrapper) + `NetworkService` for API calls; base URL is `https://uv-charging-backend-1.onrender.com`
- **Auth**: JWT stored in `FlutterSecureStorage`; session managed via `Session` singleton
- **8 feature modules**: auth, map, booking, charging, payments, profile, vehicles, notifications
- Each module has its own controller, view, and service layer under `lib/features/`

### Admin Backend Architecture
- ES Modules (`"type": "module"` in package.json) — use `import`/`export`, not `require`
- **16 MongoDB models** in `src/models/` (Mongoose)
- Routes split: `src/routes/userRoutes.js`, `adminRoutes.js`, `paymentRoutes.js`
- Swagger docs auto-generated from JSDoc; available at `/api-docs`
- Express 5 breaks some Express 4 middleware patterns — `express-mongo-sanitize` is replaced with a custom middleware

### QR Code System
Admin generates UUID-based QR tokens per station. Mobile app scans QR → validates token with backend → starts charging session. QR can be regenerated (invalidates old token). Public QR page is a standalone Next.js route at `/station-qr/:id`.

### Image Uploads
All images (stations, vehicle brands/models) are uploaded to ImgBB — not stored on the server. Frontend calls ImgBB API directly using `NEXT_PUBLIC_IMGBB_API_KEY`, then saves the returned URL to MongoDB via the backend.

### Payments
Two gateways integrated in both mobile and backend:
- **Stripe**: Card payments (WebView or native SDK)
- **SSLCommerz**: Regional gateway (South Asia); mobile uses an in-app WebView for the payment flow

## Environment Variables

### Admin Frontend (`admin/.env.local`)
```
NEXT_PUBLIC_IMGBB_API_KEY=...
BACKEND_ORIGIN=http://localhost:3001
NEXT_PUBLIC_API_BASE_URL=/api/v1
```

### Admin Backend (`admin/UV Charging/.env`)
```
PORT=3001
MONGODB_URI=mongodb+srv://...
JWT_SECRET=...
JWT_SECRET_EXPIRES_IN=24h
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
STRIPE_SECRET_KEY=...
STRIPE_PUBLISHABLE_KEY=...
STRIPE_WEBHOOK_SECRET=...
SSLCOMMERZ_STORE_ID=...
SSLCOMMERZ_PASSWORD=...
SSLCOMMERZ_IS_LIVE=false
SMTP_HOST/PORT/USER/PASS=...   # Email OTP delivery
BACKEND_URL=http://localhost:3001
```

### Mobile App (`mobile/`)
API base URL and keys are configured in `lib/core/constants/` or equivalent constants files. Check `lib/core/network/` for the Dio base URL.

## Key Patterns

### Mobile: Adding a New Feature
Follow the existing module structure: create a folder under `lib/features/<feature>/` with `controller/`, `view/`, and `service/` subdirectories. Register the controller with GetX dependency injection.

### Admin: API Route Pattern
Backend routes follow `POST /api/v1/admin/<resource>` for create, `GET` for list, `PUT /:id` for update, `DELETE /:id` for delete. All admin routes require JWT auth middleware.

### MongoDB Geospatial
`NearestStationModel` uses GeoJSON Point with a `2dsphere` index. Station queries use `$near` or `$geoWithin` for finding stations within a radius.

### Slot Generation
Station slots are auto-generated based on `startHour`, `endHour`, and `slotInterval` fields on the station document. The backend generates time slots on the fly — slots are not stored as individual documents.
