# ⚡ EV Charging — Admin Panel

A full-featured **Next.js 16** admin dashboard for the EV Charging EV platform. Manage charging stations, bookings, vehicle brands & models, users, reviews, and notifications — all from one place.

---

## 📋 Table of Contents

- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Authentication](#-authentication)
- [Pages & Features](#-pages--features)
  - [Login](#login)
  - [Dashboard](#dashboard)
  - [Charging Stations](#charging-stations)
  - [Vehicle Brands](#vehicle-brands)
  - [Vehicle Models](#vehicle-models)
  - [Bookings](#bookings)
  - [Users](#users)
  - [Reviews](#reviews)
  - [Notifications](#notifications)
  - [Public QR Page](#public-qr-page)
- [Lib / Utilities](#-lib--utilities)
  - [api.ts](#apits)
  - [imageUpload.ts](#imageuploadts)
  - [useAdminAuth.ts](#useadminauthts)
- [API Reference](#-api-reference)
- [QR Code System](#-qr-code-system)
- [Image Upload System](#-image-upload-system)
- [Deployment](#-deployment)

---

## 🛠 Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| **Next.js** | 16.1.6 | React framework, App Router |
| **React** | 19.2.3 | UI library |
| **TypeScript** | ^5 | Type safety |
| **TailwindCSS** | ^4 | Utility-first styling |
| **Axios** | ^1.13.6 | HTTP client for API calls |
| **lucide-react** | ^0.575.0 | Icon library |
| **react-hot-toast** | ^2.6.0 | Toast notifications |

**Backend**: Node.js / Express at `https://uv-charging-backend-1.onrender.com`  
**Database**: MongoDB Atlas (`uvCharge` database)  
**Image Hosting**: ImgBB API

---

## 📁 Project Structure

```
uv-charging-admin/
├── app/
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout (Toaster)
│   ├── page.tsx                  # Root redirect → /dashboard
│   ├── login/
│   │   └── page.tsx              # Login page (public)
│   ├── station-qr/
│   │   └── [id]/
│   │       └── page.tsx          # Public QR display page (no auth)
│   └── (admin)/                  # Protected admin route group
│       ├── layout.tsx            # Admin layout (Sidebar + auth guard)
│       ├── dashboard/page.tsx    # Stats overview
│       ├── stations/page.tsx     # Charging stations CRUD + QR
│       ├── brands/page.tsx       # Vehicle brands CRUD
│       ├── models/page.tsx       # Vehicle models CRUD
│       ├── bookings/page.tsx     # Bookings list (read-only)
│       ├── users/page.tsx        # User list + delete
│       ├── reviews/page.tsx      # Reviews list (read-only)
│       └── notifications/page.tsx# Paginated notifications
├── components/
│   └── Sidebar.tsx               # Navigation sidebar
├── lib/
│   ├── api.ts                    # Axios instance with auth interceptors
│   ├── imageUpload.ts            # ImgBB upload service
│   └── useAdminAuth.ts           # Auth guard hook
├── public/                       # Static assets
├── next.config.ts                # Next.js config (API rewrites)
├── tsconfig.json
├── tailwind.config (postcss)
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Backend server running at `https://uv-charging-backend-1.onrender.com`
- MongoDB Atlas connection configured on the backend

### Installation

```bash
# Clone the repository
git clone https://github.com/ripannaasmind/uv-charging-Admin.git
cd uv-charging-Admin

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Run Frontend & Backend on the Same URL

#### Local development

- **First install (one-time):**
       ```bash
       npm install
       ```
       This now also runs `npm run backend:install`, so the Express API inside `UV Charging/` gets its dependencies automatically. If that folder is missing you'll simply see "Backend install skipped".

- **Default (recommended):**
       ```bash
       npm run dev
       ```
              The dev script now runs both services via `concurrently`, so `/api/v1/*` calls succeed automatically (`backend` → `http://localhost:3001`, `frontend` → `http://localhost:3000`).

- **Manual control (optional):**
       1. **Backend:**
                             ```bash
                             cd "UV Charging"
                             npm install        # first time only
                            npm run dev        # Express on http://localhost:3001 (default PORT)
                             ```
       2. **Frontend (new terminal):**
                             ```bash
                             npm run dev:frontend   # Next.js on http://localhost:3000
                             ```

- **Frontend only (CI / storybook-style work):**
       ```bash
       npm run dev:frontend
       ```
       Use this when you just need Tailwind/React hot reload without a backend. API calls will fail unless you mock them.

With `BACKEND_ORIGIN=http://localhost:3001` and `NEXT_PUBLIC_API_BASE_URL=/api/v1`, every request from the admin UI to `/api/v1/*` is proxied through Next.js to the Express API, so both apps appear under the same origin. The same rule forwards `/uploads/*` to the backend for uploaded asset access. In production you can also set `BACKEND_URL` (e.g. `admin.evcharging.naas-emart.com`) and the frontend will automatically normalize it to `https://admin.evcharging.naas-emart.com` if the protocol is missing.

#### Production / single-base deployment with Docker

The repo now ships with `docker-compose.yml`, `Dockerfile.frontend`, `Dockerfile.backend`, and an `nginx.conf` reverse proxy. This stack builds both apps and serves them behind one public URL (port 80).

1. Ensure `UV Charging/.env` contains production secrets (`MONGO_URL`, JWT keys, etc.).
2. Build and start the stack:
       ```bash
       docker compose up --build -d
       ```
3. Visit `http://localhost/` — all UI routes stay on this host, while `/api/v1/*` and `/uploads/*` are transparently proxied to the Express service via NGINX.

> Deploy the same bundle to any VM/host with Docker installed; optional TLS can be added by mounting certs and extending `nginx.conf` or swapping in a managed load balancer.

#### Render (managed hosting)

1. Sign in to [Render](https://render.com) and enable the **Blueprints** feature.
2. Push this repo (with the new `render.yaml`) to GitHub and connect it as a Blueprint.
3. During the first deploy Render will provision two services:
       - `uv-charging-backend` (Node web service, root directory `UV Charging/`).
       - `uv-charging-frontend` (Node web service running the Next.js build).
4. In the dashboard, edit the backend service → **Environment** → add your secrets (Mongo URI, JWT, SMTP, Stripe, SSLCommerz, etc.). These keys are marked `sync: false` inside `render.yaml`, so the dashboard becomes the source of truth. If you set a custom frontend domain (e.g. `https://admin.evcharging.naas-emart.com`), append it to `CORS_ALLOWED_ORIGINS` (comma-separated) so browser calls to the backend succeed.
5. Add your `NEXT_PUBLIC_IMGBB_API_KEY` to the frontend service.
6. Trigger a deploy. The blueprint automatically wires `BACKEND_ORIGIN`/`BACKEND_URL` to the live backend URL, so every `/api/v1/*` call from `https://admin.evcharging.naas-emart.com` is proxied through Next.js to the backend without extra configuration.
7. Attach your custom domain (e.g. `admin.evcharging.naas-emart.com`) to the **frontend** service in Render → that domain will now serve the bundled admin UI and proxy API calls to the backend.

> Tip: If you need to tweak instance size or autoscaling, edit `render.yaml` (plan, region, env vars) and push again—the blueprint will reconcile the services.

### Build for Production

```bash
npm run build
npm start
```

---

## 🔑 Environment Variables

Create a `.env.local` file in the project root:

```env
# ImgBB API Key for image uploads
NEXT_PUBLIC_IMGBB_API_KEY=your_imgbb_api_key_here

# Origin for the Express backend (used by Next.js rewrites/proxy)
# `BACKEND_URL` is an optional alias; if it lacks http(s) the frontend assumes https://
BACKEND_ORIGIN=http://localhost:3001
# BACKEND_URL=admin.evcharging.naas-emart.com

# Optional: comma-separated origins that are allowed to call the backend directly
# (useful when exposing the Express API to mobile/web clients or custom domains)
# You can mix exact URLs and wildcard subdomains (e.g. https://*.naas-emart.com).
CORS_ALLOWED_ORIGINS=http://localhost:3000,https://admin.evcharging.naas-emart.com,https://*.naas-emart.com

# Client-side base path (defaults to /api/v1 so the frontend hits the same origin)
NEXT_PUBLIC_API_BASE_URL=/api/v1
```

> If not set, a fallback key is used from `lib/imageUpload.ts`.

---

## 🔐 Authentication

The admin panel uses **JWT Bearer token** authentication.

| Item | Detail |
|---|---|
| **Login endpoint** | `POST /api/v1/admin/login` |
| **Token storage** | `localStorage` key: `admin_token` |
| **User storage** | `localStorage` key: `admin_user` |
| **Default credentials** | `admin@uvcharging.com` / `Admin@1234` |

**How it works:**

1. User submits email + password on `/login`
2. Backend returns a JWT token on success
3. Token is saved to `localStorage`
4. All subsequent API requests automatically attach `Authorization: Bearer <token>`
5. On 401 response, token is cleared and user is redirected to `/login`
6. The `useAdminAuth` hook checks for a token on every protected page mount

---

## 📄 Pages & Features

### Login

**Route:** `/login`  
**File:** `app/login/page.tsx`  
**Auth required:** No (public)

- Email + password form
- Calls `POST /api/v1/admin/login`
- Saves JWT token and user object to `localStorage`
- Redirects to `/dashboard` on success
- Shows toast error on failure

---

### Dashboard

**Route:** `/dashboard`  
**File:** `app/(admin)/dashboard/page.tsx`

Displays summary stats cards fetched from `GET /api/v1/admin/dashboard`:

| Card | Field |
|---|---|
| Users | `totalUsers` |
| Bookings | `totalBookings` |
| Stations | `totalStations` |
| Sessions | `totalSessions` |
| Reviews | `totalReviews` |
| Brands | `totalBrands` |
| Revenue | `totalRevenue` (USD) |

---

### Charging Stations

**Route:** `/stations`  
**File:** `app/(admin)/stations/page.tsx`

The most feature-rich page in the admin panel.

#### Features

**Station List Table** — columns:
- Name, Address, Status badge, Price/hr, Slot count, QR thumbnail, Actions

**Add / Edit Station Modal** — fields:

| Field | Type | Notes |
|---|---|---|
| Station Name | text | Required |
| Address | text | Required; "Get Location" button auto-geocodes via Google Maps API |
| Status | select | `Available` / `Unavailable` |
| Available In | text | e.g. `10 Min` |
| Price Per Hour (display) | text | e.g. `$10/hr` |
| Price Per Hour Value | number | Numeric value used in calculations |
| Tax (%) | number | Applied to bookings |
| Latitude / Longitude | readonly | Auto-filled by geocoder |
| Slot Configuration | 3 numbers | Start Hour, End Hour, Interval (mins) — auto-generates time slots |
| Images | file upload | Multi-image upload via ImgBB |
| About | textarea | Description |
| Amenities | checkboxes | 12 options: Restaurant, Wi-Fi, Parking, Restroom, Coffee, Shopping, ATM, Lounge, EV Parts, Security, Lighting, Wheelchair |

**QR Code Column:**
- Shows a QR thumbnail + **View** button if QR exists
- Shows a **Generate QR** button if no QR exists yet

**Actions Column (per row):**

| Icon | Action |
|---|---|
| 📅 Calendar | Open **Slot Detail Modal** (date-based slot viewer) |
| 🔗 Link | Copy public QR page URL to clipboard |
| ◻ QrCode | Open **QR Modal** |
| ✏ Pencil | Open **Edit Modal** |
| 🗑 Trash | Delete station |

#### Slot Detail Modal

Opens when clicking the Calendar icon. Fetches `GET /api/v1/admin/stations/:id?date=...`:

- **Stats bar**: Price/hr, tax%, free slot count, booked slot count
- **Date selector**: 7 clickable date pills (`availableDates` from backend). Each pill shows booking count for that date in red. Switching dates re-fetches slots with a loading spinner.
- **Slot grid**: Each slot card shows `startTime → endTime` + a **Free** (green) or **Booked** (red) badge based on actual bookings in MongoDB.

#### QR Code Modal

- Large QR image with corner bracket scan frame
- Token ID display
- **Download** button — saves QR as PNG
- **Regenerate** button — calls `POST /api/v1/admin/stations/:id/qr` (invalidates old QR)
- **Open Public QR Page** link — opens `/station-qr/:id` in new tab

---

### Vehicle Brands

**Route:** `/brands`  
**File:** `app/(admin)/brands/page.tsx`

CRUD for EV vehicle brands.

| Field | Type |
|---|---|
| Name | text input |
| Image | File upload → ImgBB (JPEG/PNG/GIF/WebP, max 5MB) |

- Image preview with remove (✕) button
- Save disabled while uploading

**API calls:**
- `GET /api/v1/admin/brands`
- `POST /api/v1/admin/brands`
- `PUT /api/v1/admin/brands/:id`
- `DELETE /api/v1/admin/brands/:id`

---

### Vehicle Models

**Route:** `/models`  
**File:** `app/(admin)/models/page.tsx`

CRUD for EV vehicle models, associated with a brand.

| Field | Type |
|---|---|
| Brand | dropdown (populated from brands list) |
| Model Name | text input |
| Image | File upload → ImgBB (JPEG/PNG/GIF/WebP, max 5MB) |

- Filter models by brand using a dropdown
- Image preview with remove button

**API calls:**
- `GET /api/v1/admin/models?brandId=<id>` (optional filter)
- `GET /api/v1/admin/brands` (for dropdown)
- `POST /api/v1/admin/models`
- `PUT /api/v1/admin/models/:id`
- `DELETE /api/v1/admin/models/:id`

---

### Bookings

**Route:** `/bookings`  
**File:** `app/(admin)/bookings/page.tsx`

Read-only list of all bookings.

**Table columns:**
- Station, Vehicle, Date, Time, Amount, Paid (Yes/No), Status, Created At

**Status badge colors:**

| Status | Color |
|---|---|
| `Upcoming` | Yellow |
| `Completed` | Green |
| `Cancelled` | Red |

**API call:** `GET /api/v1/admin/bookings`

---

### Users

**Route:** `/users`  
**File:** `app/(admin)/users/page.tsx`

List of all registered users with delete capability.

**Table columns:**
- Full Name, Email, Phone, Auth Provider (badge), Verified (Yes/No), Joined date, Delete action

**API calls:**
- `GET /api/v1/admin/users`
- `DELETE /api/v1/admin/users/:id`

---

### Reviews

**Route:** `/reviews`  
**File:** `app/(admin)/reviews/page.tsx`

Read-only list of all station reviews.

**Table columns:**
- User (name + email), Station, Star Rating (1–5), Review text, Date

**API call:** `GET /api/v1/admin/reviews`

---

### Notifications

**Route:** `/notifications`  
**File:** `app/(admin)/notifications/page.tsx`

Paginated notification list with read/unread management.

**Features:**
- Unread count badge in header
- **Mark All as Read** button
- Click any notification row to mark it as read (grays it out)
- Pagination: 20 per page with Previous / Next controls

**API calls:**
- `GET /api/v1/notifications?page=1&limit=20`
- `PUT /api/v1/notifications/:id/read`
- `PUT /api/v1/notifications/all/read`

---

### Public QR Page

**Route:** `/station-qr/[id]`  
**File:** `app/station-qr/[id]/page.tsx`  
**Auth required:** No (public — for mobile users)

A standalone dark-themed page displayed when a customer scans a station QR code.

**Displays:**
- Station name, address, status, price
- Large QR code with corner bracket scan frame
- 4-step usage instructions:
  1. Open EV Charging app
  2. Go to "Scan QR" in the app
  3. Scan this QR code
  4. Confirm booking and start charging

**API call:** `GET /api/v1/public/stations/:id/qr` (no auth token required)

---

## 📦 Lib / Utilities

### `api.ts`

**File:** `lib/api.ts`

Pre-configured Axios instance:

```typescript
import api from "@/lib/api";

// Automatically attaches Bearer token from localStorage
// Automatically redirects to /login on 401
const res = await api.get("/admin/stations");
```

| Config | Value |
|---|---|
| `baseURL` | `https://uv-charging-backend-1.onrender.com/api/v1` |
| Auto-auth | Reads `admin_token` from `localStorage` |
| 401 handler | Clears token → redirects to `/login` |

---

### `imageUpload.ts`

**File:** `lib/imageUpload.ts`

ImgBB image hosting service with three exported functions:

#### `uploadImage(file: File | string): Promise<string>`

Uploads a single image. Returns the hosted image URL.

```typescript
import { uploadImage } from "@/lib/imageUpload";
const url = await uploadImage(file); // "https://i.ibb.co/..."
```

#### `uploadMultipleImages(files: File[]): Promise<string[]>`

Uploads multiple images in parallel. Returns array of URLs.

```typescript
import { uploadMultipleImages } from "@/lib/imageUpload";
const urls = await uploadMultipleImages([file1, file2]);
```

#### `validateImageFile(file, maxSizeMB?): { isValid, error? }`

Validates file type and size before uploading.

```typescript
import { validateImageFile } from "@/lib/imageUpload";
const result = validateImageFile(file, 5); // max 5MB
if (!result.isValid) toast.error(result.error);
```

**Allowed types:** JPEG, PNG, GIF, WebP  
**Default max size:** 5 MB

---

### `useAdminAuth.ts`

**File:** `lib/useAdminAuth.ts`

A React hook that protects pages from unauthenticated access.

```typescript
import { useAdminAuth } from "@/lib/useAdminAuth";

export default function SomePage() {
  useAdminAuth(); // redirects to /login if no token found
}
```

> The `(admin)/layout.tsx` already calls this hook globally for all admin pages.

---

## 🌐 API Reference

All endpoints are prefixed with `/api/v1`.

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/admin/login` | Admin login → returns JWT |

### Dashboard

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/admin/dashboard` | Total counts + revenue stats |

### Stations

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/admin/stations` | List all stations |
| `POST` | `/admin/stations` | Create a new station |
| `GET` | `/admin/stations/:id` | Get station detail |
| `GET` | `/admin/stations/:id?date=08 Mar, Sun` | Station detail with real slot booking status |
| `PUT` | `/admin/stations/:id` | Update station |
| `DELETE` | `/admin/stations/:id` | Delete station |
| `POST` | `/admin/stations/:id/qr` | Generate or regenerate QR code |
| `GET` | `/public/stations/:id/qr` | Public QR data — **no auth required** |

**Station detail response (with `?date=`):**
```json
{
  "slots": [
    { "startTime": "08:00", "endTime": "08:30", "isBooked": true },
    { "startTime": "08:30", "endTime": "09:00", "isBooked": false }
  ],
  "availableDates": ["08 Mar, Sun", "09 Mar, Mon", "10 Mar, Tue", "..."],
  "selectedDate": "08 Mar, Sun",
  "bookingCountsByDate": { "08 Mar, Sun": 2, "09 Mar, Mon": 0 },
  "pricePerHourValue": 10,
  "taxPercent": 5
}
```

### Brands

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/admin/brands` | List all brands |
| `POST` | `/admin/brands` | Create brand |
| `PUT` | `/admin/brands/:id` | Update brand |
| `DELETE` | `/admin/brands/:id` | Delete brand and its models |

### Models

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/admin/models` | List all models |
| `GET` | `/admin/models?brandId=:id` | Filter models by brand |
| `POST` | `/admin/models` | Create model |
| `PUT` | `/admin/models/:id` | Update model |
| `DELETE` | `/admin/models/:id` | Delete model |

### Users

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/admin/users` | List all users |
| `DELETE` | `/admin/users/:id` | Delete a user |

### Bookings

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/admin/bookings` | All bookings with user + station populated |

### Reviews

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/admin/reviews` | All reviews with user + station populated |

### Notifications

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/notifications?page=1&limit=20` | Paginated notifications |
| `PUT` | `/notifications/:id/read` | Mark one notification as read |
| `PUT` | `/notifications/all/read` | Mark all notifications as read |

---

## 📱 QR Code System

The QR system enables mobile users to scan a physical QR code at a charging station to start a session.

### Flow

```
Admin generates QR
       ↓
Backend creates qrToken (UUID) + qrCode (base64 PNG) → saved in MongoDB
       ↓
QR printed / displayed at the station
       ↓
Mobile user scans QR → opens /station-qr/:id (public page, no auth)
       ↓
User opens EV Charging app → app validates token
via POST /ChargingSession/validate-qr
       ↓
Charging session begins
```

### Admin Actions

| Action | How | Effect |
|---|---|---|
| Generate QR | `POST /admin/stations/:id/qr` | Creates `qrToken` + `qrCode` stored in MongoDB |
| Regenerate QR | Same endpoint | New token generated; **old QR permanently invalidated** |
| Download QR | Client-side | Downloads `qrCode` base64 PNG as a file |
| Copy QR URL | Client-side | Copies `https://yourdomain.com/station-qr/:id` to clipboard |
| View QR | Modal | Shows full-size QR with corner brackets |

### Database Fields (per Station)

```js
qrCode:  String   // base64 PNG data URL
qrToken: String   // UUID token embedded in the QR
```

---

## 🖼 Image Upload System

All image uploads go through **ImgBB** (free image hosting service).

### Supported Pages

| Page | Field | Mode |
|---|---|---|
| Stations | Images | Multiple files at once |
| Brands | Image | Single file |
| Models | Image | Single file |

### Upload Flow

```
User picks file
       ↓
validateImageFile() — checks type and size
       ↓
uploadImage() / uploadMultipleImages() — sends to ImgBB API
       ↓
Returns hosted HTTPS URL
       ↓
URL saved in form state → submitted with CRUD payload to backend
```

### Constraints

| Constraint | Value |
|---|---|
| Max file size | 5 MB |
| Allowed types | JPEG, PNG, GIF, WebP |
| Upload service | ImgBB (`https://api.imgbb.com/1/upload`) |
| Returns | Permanent HTTPS URL (`display_url`) |

---

## 🚢 Deployment

### Frontend

1. Set `NEXT_PUBLIC_IMGBB_API_KEY` in your hosting environment variables
2. Update `baseURL` in `lib/api.ts` to your production backend URL
3. Update the fetch URL in `app/station-qr/[id]/page.tsx` to your production backend

```bash
npm run build
npm start
```

### Backend

```bash
# In C:\EV Charging
npm run dev    # or: nodemon src/index.js
```

Ensure MongoDB Atlas URI and JWT secret are set in backend `.env`.

---

## 🔧 Configuration Reference

| Item | Value |
|---|---|
| Frontend port | `3000` |
| Backend port | `3001` |
| API base URL | `https://uv-charging-backend-1.onrender.com/api/v1` |
| MongoDB database | `uvCharge` |
| Google Maps API | Address geocoding in station form |
| ImgBB API | All image uploads |

---

## 📝 Changelog

| Date | Change |
|---|---|
| Mar 8, 2026 | Added date-based slot viewer modal in stations page |
| Mar 8, 2026 | Added `StationDetail` interface with `availableDates`, `selectedDate`, `bookingCountsByDate` |
| Mar 8, 2026 | File upload (ImgBB) for Vehicle Brands and Models |
| Mar 8, 2026 | Public QR page at `/station-qr/[id]` |
| Mar 8, 2026 | QR code system — generate, regenerate, download, view modal |
| Mar 8, 2026 | Fixed bookings page empty state (silent `.catch` bug) |
| Mar 8, 2026 | Fixed Axios 400 on bookings API (UserModel name mismatch in backend) |
| Mar 8, 2026 | Initial admin panel setup |

---

## 👤 Author

**Repository:** [github.com/ripannaasmind/uv-charging-Admin](https://github.com/ripannaasmind/uv-charging-Admin)
