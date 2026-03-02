# La Nueva Recoleta — Claude Context

## Project
Landing page + menu page for **La Nueva Recoleta**, a bakery & café in Buenos Aires, Argentina.

**Stack:** React 19 · TypeScript · Vite · Tailwind CSS v4 · Framer Motion · TanStack Query · React Router v7
**Language:** UI copy in Spanish (Argentina). Code and comments in English.

## Architecture

### Routing
React Router v7. Two routes:
- `/` → Landing page (`LandingPage` in `App.tsx`)
- `/menu` → Full menu page (`src/pages/MenuPage.tsx`)

### Styling System
- **Tailwind CSS v4** — configured via `@theme {}` in `src/index.css`.
- Brand tokens live in `src/index.css`. Never hardcode hex values in components — use the brand variables.
- Responsive: mobile-first. Default = mobile, `md:` = tablet, `lg:` = desktop.

### Components
```
src/
  pages/
    MenuPage.tsx     # Full PedidosYa-style menu (search, categories, bestsellers)
  components/
    layout/
      Navbar.tsx     # Sticky header, scrolls to sections, mobile hamburger
      Footer.tsx     # Brand, nav, social links
    sections/
      Hero.tsx       # Full-screen video hero with CTA → links to /menu
      About.tsx      # Brand story + stats + image grid
      Menu.tsx       # Category preview cards + CTA → links to /menu
      Reviews.tsx    # Google Reviews carousel + grid
      Location.tsx   # Google Maps embed + contact info
    ui/
      StarRating.tsx # Reusable star rating display
  services/
    fudoApi.ts       # Fudo API client (auth + products + categories + normalisation)
  types/
    index.ts         # Shared TypeScript interfaces
    fudo.ts          # Fudo API response types + NormalisedProduct/Category
  hooks/
    useInView.ts     # IntersectionObserver wrapper for scroll animations
  data/
    mockData.ts      # Mock reviews and nav links
```

## Fudo API Integration (DONE)
The full menu page (`MenuPage.tsx`) fetches live data from Fudo.

### Auth
```
POST https://auth.fu.do/api
Body: { apiKey: string, apiSecret: string }
Returns: { token: string, exp: number }   // exp = Unix timestamp, 24h TTL
```

### Product endpoints
```
GET https://api.fu.do/v1alpha1/products
GET https://api.fu.do/v1alpha1/product-categories
Authorization: Bearer <token>
```

### Response shape
```json
{
  "data": [
    {
      "type": "Product",
      "id": "43",
      "attributes": { "name": "Cortado Jarrito", "price": 3600, "active": true, ... },
      "relationships": { "productCategory": { "data": { "type": "ProductCategory", "id": "8" } } }
    }
  ]
}
```

### Price note
Prices from the API are in **whole ARS pesos** (e.g. `3600` = $3,600).
Never divide by 100.

### Env vars
```
VITE_FUDO_API_KEY=<api_key_value>
VITE_FUDO_API_KEY_SECRET=<api_secret_value>
```
Both are available in `.env` (not committed to git).

### Bestsellers / Tendencia
- `BESTSELLER_IDS` in `fudoApi.ts` — ordered array of product IDs by real sales rank.
- `TENDENCIA_IDS` — slice of BESTSELLER_IDS (positions 10-20).
- Both are hardcoded client-side based on real sales data. Update when new data is available.

### Display categories
Only these categories are shown in the menu (in this order):
| ID | Name |
|---|---|
| 8 | Cafés |
| 31 | Sandwiches de Miga |
| 35 | Comidas & Almuerzos |
| 21 | Promociones |
| 23 | Panadería |
| 5 | Bebidas (Sin alcohol) |

## Asset Placeholders
The following assets need to be added to `/public/`:
- `hero-video.mp4` — 5–10 second ambient video (muted, looped).
- `video-poster.jpg` — First frame of the video as fallback image.
- `favicon.png` — Brand favicon.
- `images/about-main.jpg` — Main about section image.
- `images/about-2.jpg` / `images/about-3.jpg` — Secondary about images.

## Design Principles
1. **Mobile-first**: "Cómo llegar" CTA must always be reachable on mobile.
2. **Subtle animations**: Use Framer Motion with gentle easing. No distracting movement.
3. **Performance**: Lazy-load all images. Provide `poster` fallback for video.
4. **Brand voice**: Warm, artisanal, professional. Copy in Rioplatense Spanish.

## Brand Colors (do not change without approval)
| Token | Hex | Usage |
|---|---|---|
| `brand-burgundy` | `#7B1C1C` | Primary CTAs, accents |
| `brand-burgundy-dark` | `#5A1010` | Hover states |
| `brand-cream` | `#FAF6F0` | Light backgrounds, text on dark |
| `brand-brown` | `#3D1F0D` | Dark text on light backgrounds |
| `brand-gold` | `#C9973A` | Highlights, labels |
| `brand-charcoal` | `#1A1008` | Main dark background |

## Dev Commands
```bash
npm run dev      # Start development server (port 5173)
npm run build    # Production build
npm run preview  # Preview production build
npm run lint     # ESLint check
```
