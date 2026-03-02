import { setOptions, importLibrary } from '@googlemaps/js-api-loader';
import type { Review } from '../types';

// ─── Config ───────────────────────────────────────────────────────────────────

const MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined;

/** The exact business query used to find the place in Google Places */
const PLACE_TEXT_QUERY = 'La Nueva Recoleta Charcas 2902 Buenos Aires';

/** Direct navigation URL — used for all "Cómo llegar" buttons */
export const MAPS_DIRECTIONS_URL =
  'https://www.google.com/maps/dir/?api=1&destination=Charcas+2902,+Recoleta,+Buenos+Aires,+Argentina';

/** Embed URL for the iframe — works without API key */
export const MAPS_EMBED_URL =
  'https://maps.google.com/maps?q=Charcas+2902,+Recoleta,+Buenos+Aires,+Argentina&output=embed&z=16';

/** Embed URL using Maps Embed API (requires API key, higher quality) */
export const mapsEmbedUrlWithKey = (key: string) =>
  `https://www.google.com/maps/embed/v1/place?key=${key}&q=Charcas+2902,+Recoleta,+Buenos+Aires,+Argentina&zoom=16&language=es`;

/** Returns the best available embed URL given the current API key state */
export function getEmbedUrl(): string {
  if (MAPS_API_KEY) return mapsEmbedUrlWithKey(MAPS_API_KEY);
  return MAPS_EMBED_URL;
}

// ─── SDK initialisation (run once) ───────────────────────────────────────────

let sdkInitialised = false;

function ensureSdkOptions(): void {
  if (sdkInitialised) return;
  setOptions({
    key: MAPS_API_KEY ?? '',
    v: 'weekly',
    libraries: ['places'],
    language: 'es',
    region: 'AR',
  });
  sdkInitialised = true;
}

// ─── Main export ─────────────────────────────────────────────────────────────

/**
 * Fetches real Google reviews for "La Nueva Recoleta" using the
 * Google Maps JavaScript API (Places library).
 *
 * Returns null when:
 *   - VITE_GOOGLE_MAPS_API_KEY is not set
 *   - The place is not found
 *   - The API call fails (network error, quota, etc.)
 *
 * In all null cases the caller should fall back to mock data.
 */
export async function fetchGoogleReviews(): Promise<Review[] | null> {
  if (!MAPS_API_KEY) {
    // No API key — caller will use mock data
    return null;
  }

  try {
    ensureSdkOptions();

    // Load the Places library via the functional API
    const { Place } = await importLibrary('places');

    // Search for the business
    const { places } = await Place.searchByText({
      textQuery: PLACE_TEXT_QUERY,
      fields: ['id', 'displayName', 'reviews', 'rating', 'userRatingCount'],
      language: 'es',
    });

    if (!places || places.length === 0) {
      console.warn('[GooglePlaces] Place not found for query:', PLACE_TEXT_QUERY);
      return null;
    }

    const place = places[0];
    const reviews = place.reviews;

    if (!reviews || reviews.length === 0) {
      console.warn('[GooglePlaces] No reviews found for place:', place.displayName);
      return null;
    }

    return (reviews as google.maps.places.Review[])
      .filter((r) => typeof r.text === 'string' && r.text.length > 10)
      .map((r: google.maps.places.Review, i: number) => ({
        id: `google-${i}-${r.publishTime?.getTime() ?? i}`,
        author: r.authorAttribution?.displayName ?? 'Usuario de Google',
        avatar: r.authorAttribution?.photoURI ?? undefined,
        rating: r.rating ?? 5,
        text: typeof r.text === 'string' ? r.text : '',
        date: r.relativePublishTimeDescription ?? '',
        source: 'google' as const,
      }));
  } catch (err) {
    console.error('[GooglePlaces] Error fetching reviews:', err);
    return null;
  }
}
