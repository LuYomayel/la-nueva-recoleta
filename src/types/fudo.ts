// ─── Fudo API Types ──────────────────────────────────────────────────────────
// Base URL: https://api.fu.do/v1alpha1
// Auth URL: https://auth.fu.do/api  (POST with { apiKey, apiSecret })

/** Raw auth response from https://auth.fu.do/api */
export interface FudoAuthResponse {
  token: string;
  exp: number;
}

/** JSON:API relationship reference */
export interface FudoRelationshipData {
  type: string;
  id: string;
}

// ─── Product ─────────────────────────────────────────────────────────────────

export interface FudoProductAttributes {
  active: boolean;
  code: string | null;
  cost: number | null;
  description: string;
  enableOnlineMenu: boolean | null;
  enableQrMenu: boolean | null;
  favourite: boolean;
  imageUrl: string | null;
  name: string;
  position: number;
  preparationTime: number | null;
  /** Price in ARS pesos (e.g. 4000 = $40.00) */
  price: number;
  sellAlone: boolean;
  stock: number | null;
  stockControl: boolean;
}

export interface FudoProductRelationships {
  kitchen: { data: FudoRelationshipData };
  productCategory: { data: FudoRelationshipData };
  productModifiersGroups: { data: FudoRelationshipData[] };
  productProportions: { data: FudoRelationshipData[] };
}

export interface FudoProduct {
  type: 'Product';
  id: string;
  attributes: FudoProductAttributes;
  relationships: FudoProductRelationships;
}

export interface FudoProductsResponse {
  data: FudoProduct[];
}

// ─── Product Category ─────────────────────────────────────────────────────────

export interface FudoProductCategoryAttributes {
  enableOnlineMenu: boolean | null;
  name: string;
  preparationTime: number | null;
  position: number;
}

export interface FudoProductCategory {
  type: 'ProductCategory';
  id: string;
  attributes: FudoProductCategoryAttributes;
}

export interface FudoProductCategoriesResponse {
  data: FudoProductCategory[];
}

// ─── Normalised / UI types ───────────────────────────────────────────────────

/** Flat product used across UI components */
export interface NormalisedProduct {
  id: string;
  name: string;
  description: string;
  /** Price in ARS, human-readable (already divided by 100) */
  price: number;
  imageUrl: string | null;
  categoryId: string;
  active: boolean;
  position: number;
  /** Injected client-side based on bestseller list */
  isBestseller?: boolean;
  /** Rank in top-sold list (1 = most sold). Undefined if not in list. */
  bestsellRank?: number;
}

/** Flat category used across UI components */
export interface NormalisedCategory {
  id: string;
  name: string;
  position: number;
}
