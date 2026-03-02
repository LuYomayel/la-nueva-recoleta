import type {
  FudoAuthResponse,
  FudoProductsResponse,
  FudoProductCategoriesResponse,
  NormalisedProduct,
  NormalisedCategory,
} from '../types/fudo';

// ─── Config ───────────────────────────────────────────────────────────────────
/** In production (e.g. Netlify) we use same-origin proxy to avoid CORS from auth.fu.do / api.fu.do */
const useProxy = import.meta.env.PROD;
const AUTH_URL = useProxy ? '/.netlify/functions/fudo-auth' : 'https://auth.fu.do/api';
const API_URL  = useProxy ? '/.netlify/functions/fudo-api' : 'https://api.fu.do/v1alpha1';

const API_KEY        = import.meta.env.VITE_FUDO_API_KEY        as string;
const API_KEY_SECRET = import.meta.env.VITE_FUDO_API_KEY_SECRET as string;

/** Token cache — lives for 24 h per Fudo docs */
let cachedToken: string | null = null;
let tokenExpiry: number        = 0;

// ─── Authentication ───────────────────────────────────────────────────────────

async function getToken(): Promise<string> {
  if (cachedToken && Date.now() < tokenExpiry) return cachedToken;

  const res = await fetch(AUTH_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: useProxy ? '{}' : JSON.stringify({ apiKey: API_KEY, apiSecret: API_KEY_SECRET }),
  });

  if (!res.ok) {
    throw new Error(`Fudo auth error: ${res.status}`);
  }

  const data: FudoAuthResponse = await res.json();
  cachedToken = data.token;
  // exp is a Unix timestamp in seconds; subtract 5 min buffer
  tokenExpiry = (data.exp - 300) * 1000;

  return cachedToken;
}

// ─── Base fetcher ─────────────────────────────────────────────────────────────

async function apiFetch<T>(path: string): Promise<T> {
  const token = await getToken();
  const url = useProxy ? `${API_URL}?path=${encodeURIComponent(path)}` : `${API_URL}${path}`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    throw new Error(`Fudo API error ${res.status} on ${path}`);
  }

  return res.json() as Promise<T>;
}

// ─── Raw endpoints ────────────────────────────────────────────────────────────

export async function fetchProducts(): Promise<FudoProductsResponse> {
  return apiFetch<FudoProductsResponse>('/products');
}

export async function fetchProductCategories(): Promise<FudoProductCategoriesResponse> {
  return apiFetch<FudoProductCategoriesResponse>('/product-categories');
}

// ─── Normalised data ──────────────────────────────────────────────────────────

/**
 * Ordered list of product IDs by sales rank (index 0 = most sold).
 * Based on real sales data provided by La Nueva Recoleta.
 */
export const BESTSELLER_IDS: string[] = [
  '115', // Miga Jamon y Queso          6.0%
  '43',  // Cortado Jarrito             3.8%
  '42',  // Cortado chico               2.3%
  '142', // Promo 1                     1.6%
  '37',  // Espresso - Chico            1.4%
  '38',  // Café Americano Jarrito      1.4%
  '45',  // Café con leche              1.4%
  '143', // Promo 2                     0.8%
  '144', // Promo 3                     0.8%
  '126', // Miga Jamón y Huevo          1.0%
  '119', // Miga Primavera              0.9%
  '62',  // Empanadas Carne             0.9%
  '117', // Miga Jamón crudo y queso    0.8%
  '124', // Miga Vitel Toné             0.8%
  '133', // Miga Atún                   0.8%
  '132', // Miga Roquefort y apio       0.8%
  '127', // Miga Queso y huevo          0.7%
  '125', // Miga Salame y Queso         0.7%
  '120', // Miga Queso y Aceituna       0.7%
  '116', // Miga JyQ Pan Negro          0.7%
  '128', // Miga Tomate y queso         0.7%
  '129', // Miga Tomate y jamón         0.5% → 0.7%
  '135', // Miga Zanahoria y queso      0.5%
  '118', // Miga Palmitos               0.5%
  '242', // Tarta Pollo y brocoli       0.9%
  '256', // Tarta zapallito mostrador   ~0.7%
  '252', // Promo Almuerzo              0.5%
  '11',  // Coca-Cola Light/Zero        0.5%
  '6',   // Agua Mineral                0.5%
  '18',  // Agua Mineral con gas        0.4%
];

/** Top N products marked as "Tendencia" (2nd tier after bestsellers) */
export const TENDENCIA_IDS: string[] = BESTSELLER_IDS.slice(10, 20);

/** IDs of categories to display in the menu (ordered by relevance) */
export const DISPLAY_CATEGORY_IDS = ['8', '31', '35', '21', '23', '5'];

/** Human-readable category labels for display */
const CATEGORY_LABELS: Record<string, string> = {
  '8':  'Cafés',
  '31': 'Sand. de Miga',
  '35': 'Comidas & Almuerzos',
  '21': 'Promociones',
  '23': 'Panadería',
  '5':  'Bebidas',
};

/** Category emoji icons for display */
export const CATEGORY_ICONS: Record<string, string> = {
  '8':  '☕',
  '31': '🥪',
  '35': '🍽️',
  '21': '🎉',
  '23': '🍞',
  '5':  '🧃',
};

export function normaliseProducts(
  raw: FudoProductsResponse,
): NormalisedProduct[] {
  const bestsellSet = new Map(BESTSELLER_IDS.map((id, i) => [id, i + 1]));

  const products = raw.data
    .filter(
      (p) =>
        p.attributes.active &&
        p.attributes.price > 0 &&
        DISPLAY_CATEGORY_IDS.includes(p.relationships.productCategory?.data?.id),
    )
    .map((p) => {
      const rank = bestsellSet.get(p.id);
      // Fudo prices are in whole ARS pesos (e.g. 3100 = $3100)
      return {
        id: p.id,
        name: p.attributes.name,
        description: p.attributes.description,
        price: p.attributes.price,
        imageUrl: p.attributes.imageUrl,
        categoryId: p.relationships.productCategory.data.id,
        active: p.attributes.active,
        position: p.attributes.position,
        isBestseller: rank !== undefined,
        bestsellRank: rank,
      };
    })
    .sort((a, b) => {
      // Bestsellers first (by rank), then by position
      if (a.bestsellRank !== undefined && b.bestsellRank !== undefined) {
        return a.bestsellRank - b.bestsellRank;
      }
      if (a.bestsellRank !== undefined) return -1;
      if (b.bestsellRank !== undefined) return 1;
      return a.position - b.position;
    });
    return products;
}

export function normaliseCategories(
  raw: FudoProductCategoriesResponse,
): NormalisedCategory[] {
  return raw.data
    .filter((c) => DISPLAY_CATEGORY_IDS.includes(c.id))
    .map((c) => ({
      id: c.id,
      name: CATEGORY_LABELS[c.id] ?? c.attributes.name,
      position: c.attributes.position,
    }))
    .sort(
      (a, b) =>
        DISPLAY_CATEGORY_IDS.indexOf(a.id) - DISPLAY_CATEGORY_IDS.indexOf(b.id),
    );
}
