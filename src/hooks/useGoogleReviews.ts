import { useQuery } from '@tanstack/react-query';
import { fetchGoogleReviews } from '../services/googlePlacesService';
import { MOCK_REVIEWS } from '../data/mockData';
import type { Review } from '../types';

interface UseGoogleReviewsResult {
  reviews: Review[];
  isReal: boolean;   // true when using actual Google data
  isLoading: boolean;
  isError: boolean;
}

/**
 * Returns Google reviews for La Nueva Recoleta.
 *
 * - If VITE_GOOGLE_MAPS_API_KEY is set: fetches real reviews from Google Places.
 * - Falls back to mock reviews on any failure or missing API key.
 * - `isReal` flag lets the UI show/hide the "Powered by Google" badge.
 */
export function useGoogleReviews(): UseGoogleReviewsResult {
  const { data, isLoading, isError } = useQuery<Review[] | null>({
    queryKey: ['google-reviews'],
    queryFn: fetchGoogleReviews,
    staleTime: 30 * 60 * 1000, // cache for 30 min — reviews don't change often
    retry: 1,
  });

  const isReal = Array.isArray(data) && data.length > 0;
  const reviews: Review[] = isReal ? (data as Review[]).filter((r) => r.rating >= 4) : MOCK_REVIEWS;


  return { reviews, isReal, isLoading, isError };
}
