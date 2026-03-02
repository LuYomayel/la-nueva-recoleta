import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from '../../hooks/useInView';
import { useGoogleReviews } from '../../hooks/useGoogleReviews';
import StarRating from '../ui/StarRating';
import type { Review } from '../../types';

// ─── Sub-components ───────────────────────────────────────────────────────────

function GoogleLogo({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-label="Google">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

function AuthorAvatar({ review }: { review: Review }) {
  if (review.avatar) {
    return (
      <img
        src={review.avatar}
        alt={review.author}
        className="w-10 h-10 rounded-full object-cover"
        referrerPolicy="no-referrer"
      />
    );
  }
  return (
    <div className="w-10 h-10 rounded-full bg-[#7B1C1C] text-[#FAF6F0] flex items-center justify-center font-[Playfair_Display] font-bold text-lg shrink-0">
      {review.author.charAt(0)}
    </div>
  );
}

function SmallAuthorAvatar({ review }: { review: Review }) {
  if (review.avatar) {
    return (
      <img
        src={review.avatar}
        alt={review.author}
        className="w-8 h-8 rounded-full object-cover shrink-0"
        referrerPolicy="no-referrer"
      />
    );
  }
  return (
    <div className="w-8 h-8 rounded-full bg-[#7B1C1C] text-[#FAF6F0] flex items-center justify-center font-bold text-sm shrink-0">
      {review.author.charAt(0)}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function Reviews() {
  const [activeIndex, setActiveIndex] = useState(0);
  const { ref: headRef, inView: headInView } = useInView();
  const { reviews, isReal, isLoading } = useGoogleReviews();

  const safeIndex = activeIndex % reviews.length;
  const review = reviews[safeIndex];

  const next = () => setActiveIndex((i) => (i + 1) % reviews.length);
  const prev = () => setActiveIndex((i) => (i - 1 + reviews.length) % reviews.length);

  return (
    <section id="reviews" className="bg-[#FAF6F0] py-24 px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto">

        {/* ── Header ──────────────────────────────────────────────── */}
        <div ref={headRef as React.RefObject<HTMLDivElement>} className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={headInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-[#7B1C1C] font-[Playfair_Display] text-sm tracking-[0.3em] uppercase mb-3"
          >
            Lo que dicen
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={headInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-[Playfair_Display] font-bold text-5xl md:text-6xl text-[#3D1F0D] leading-tight"
          >
            Reviews de{' '}
            <span className="text-[#7B1C1C] italic">Google</span>
          </motion.h2>

          {/* Score badge + source tag */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={headInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6"
          >
            {/* Rating pill */}
            <div className="inline-flex items-center gap-3 bg-[#7B1C1C] text-[#FAF6F0] px-6 py-3 rounded-full">
              <GoogleLogo />
              <span className="font-[Playfair_Display] font-bold text-xl">4.1</span>
              <StarRating rating={4.1} />
              <span className="text-[#FAF6F0]/80 text-sm font-[Inter]">+999 reseñas</span>
            </div>

            {/* Source badge — shows only when using real data */}
            {isReal && (
              <div className="inline-flex items-center gap-1.5 bg-white border border-[#3D1F0D]/10 text-[#3D1F0D]/60 px-4 py-2 rounded-full text-xs font-[Inter]">
                <GoogleLogo className="w-3.5 h-3.5" />
                Reseñas reales de Google
              </div>
            )}
          </motion.div>
        </div>

        {/* ── Carousel ─────────────────────────────────────────────── */}
        {isLoading ? (
          <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl p-8 md:p-12 animate-pulse">
            <div className="h-4 bg-[#3D1F0D]/10 rounded w-1/4 mx-auto mb-6" />
            <div className="space-y-3 mb-8">
              <div className="h-5 bg-[#3D1F0D]/10 rounded w-full" />
              <div className="h-5 bg-[#3D1F0D]/10 rounded w-5/6 mx-auto" />
              <div className="h-5 bg-[#3D1F0D]/10 rounded w-4/6 mx-auto" />
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-[#3D1F0D]/10" />
              <div className="h-3 bg-[#3D1F0D]/10 rounded w-28" />
            </div>
          </div>
        ) : (
          <div className="relative max-w-3xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={safeIndex}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                className="bg-white rounded-3xl shadow-xl p-8 md:p-12 text-center"
              >
                {/* Quote mark */}
                <div className="text-[#7B1C1C]/20 font-[Playfair_Display] text-8xl leading-none mb-2 select-none">
                  "
                </div>
                <StarRating rating={review.rating} className="justify-center mb-4" />
                <blockquote className="text-[#3D1F0D] font-[Playfair_Display] italic text-xl md:text-2xl leading-relaxed mb-8">
                  {review.text}
                </blockquote>
                <div className="flex flex-col items-center gap-1.5">
                  <AuthorAvatar review={review} />
                  <p className="font-[Inter] font-semibold text-[#3D1F0D] text-sm">{review.author}</p>
                  <p className="text-[#3D1F0D]/40 text-xs font-[Inter]">{review.date}</p>
                  {isReal && (
                    <div className="flex items-center gap-1 mt-1 text-[#3D1F0D]/30 text-[10px] font-[Inter]">
                      <GoogleLogo className="w-3 h-3" />
                      Google Reviews
                    </div>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center justify-center gap-4 mt-8">
              <button
                onClick={prev}
                className="w-11 h-11 rounded-full border border-[#3D1F0D]/20 hover:border-[#7B1C1C] hover:bg-[#7B1C1C] hover:text-[#FAF6F0] text-[#3D1F0D] transition-all duration-200 flex items-center justify-center cursor-pointer"
                aria-label="Review anterior"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <div className="flex gap-2">
                {reviews.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveIndex(i)}
                    className={`transition-all duration-300 rounded-full cursor-pointer ${
                      i === safeIndex
                        ? 'w-8 h-2.5 bg-[#7B1C1C]'
                        : 'w-2.5 h-2.5 bg-[#3D1F0D]/20 hover:bg-[#7B1C1C]/50'
                    }`}
                    aria-label={`Review ${i + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={next}
                className="w-11 h-11 rounded-full border border-[#3D1F0D]/20 hover:border-[#7B1C1C] hover:bg-[#7B1C1C] hover:text-[#FAF6F0] text-[#3D1F0D] transition-all duration-200 flex items-center justify-center cursor-pointer"
                aria-label="Siguiente review"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* ── Grid ─────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-16">
          {reviews.map((r, i) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              whileHover={{ y: -4 }}
              className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 cursor-default"
            >
              <StarRating rating={r.rating} className="mb-3" />
              <p className="text-[#3D1F0D]/80 font-[Inter] text-sm leading-relaxed mb-4 line-clamp-3">
                {r.text}
              </p>
              <div className="flex items-center gap-2">
                <SmallAuthorAvatar review={r} />
                <div>
                  <p className="text-[#3D1F0D] font-[Inter] font-semibold text-xs">{r.author}</p>
                  <p className="text-[#3D1F0D]/40 font-[Inter] text-xs">{r.date}</p>
                </div>
                <GoogleLogo className="w-5 h-5 ml-auto shrink-0" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Powered by Google (only when real) */}
        {isReal && (
          <p className="text-center text-[#3D1F0D]/30 font-[Inter] text-xs mt-8 flex items-center justify-center gap-1.5">
            <GoogleLogo className="w-3.5 h-3.5" />
            Reseñas obtenidas de Google Maps · La Nueva Recoleta
          </p>
        )}
      </div>
    </section>
  );
}
