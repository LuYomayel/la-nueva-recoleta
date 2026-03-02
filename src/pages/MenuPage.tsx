import { useState, useMemo, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
  fetchProducts,
  fetchProductCategories,
  normaliseProducts,
  normaliseCategories,
  BESTSELLER_IDS,
  TENDENCIA_IDS,
  CATEGORY_ICONS,
} from '../services/fudoApi';
import { MAPS_DIRECTIONS_URL } from '../services/googlePlacesService';
import type { NormalisedProduct } from '../types/fudo';

// ─── Constants ────────────────────────────────────────────────────────────────

const ALL_CATEGORY_ID = 'all';
const TOP_CATEGORY_ID = 'top';
const TENDENCIA_CATEGORY_ID = 'tendencia';

// ─── Sub-components ───────────────────────────────────────────────────────────

function ProductCard({ product }: { product: NormalisedProduct }) {
  const rank = product.bestsellRank;
  const isTendencia = TENDENCIA_IDS.includes(product.id) && !product.isBestseller;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25 }}
      className="flex items-center gap-3 bg-[#FAF6F0]/5 hover:bg-[#FAF6F0]/8 border border-[#FAF6F0]/8 hover:border-[#C9973A]/30 rounded-2xl p-3 sm:p-4 transition-all duration-200 cursor-default group"
    >
      {/* Image / placeholder */}
      <div className="relative shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-gradient-to-br from-[#3D1F0D] to-[#7B1C1C]/60 flex items-center justify-center">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <span className="text-3xl sm:text-4xl select-none">
            {CATEGORY_ICONS[product.categoryId] ?? '🍽️'}
          </span>
        )}

        {/* Rank badge for top 3 */}
        {rank && rank <= 3 && (
          <div className="absolute top-1.5 left-1.5 w-5 h-5 rounded-full bg-[#C9973A] flex items-center justify-center text-[#1A1008] font-bold text-[10px]">
            {rank}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-1.5 mb-1">
          {product.isBestseller && (
            <span className="inline-flex items-center gap-1 bg-[#C9973A]/15 border border-[#C9973A]/40 text-[#C9973A] text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide shrink-0">
              🔥 Más vendido
            </span>
          )}
          {isTendencia && (
            <span className="inline-flex items-center gap-1 bg-[#7B1C1C]/20 border border-[#7B1C1C]/40 text-[#FAF6F0]/70 text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide shrink-0">
              📈 Tendencia
            </span>
          )}
        </div>

        <h3 className="font-[Playfair_Display] font-semibold text-[#FAF6F0] text-sm sm:text-base leading-tight truncate">
          {product.name}
        </h3>

        {product.description && (
          <p className="text-[#FAF6F0]/45 font-[Inter] text-xs mt-0.5 line-clamp-1">
            {product.description}
          </p>
        )}

        <p className="font-[Playfair_Display] font-bold text-[#C9973A] text-base sm:text-lg mt-2 leading-none">
          ${product.price.toLocaleString('es-AR', { maximumFractionDigits: 0 })}
        </p>
      </div>
    </motion.div>
  );
}

function SectionHeader({ emoji, title }: { emoji: string; title: string }) {
  return (
    <div className="flex items-center gap-2 mb-4 mt-2">
      <span className="text-xl">{emoji}</span>
      <h2 className="font-[Playfair_Display] font-bold text-xl sm:text-2xl text-[#FAF6F0]">
        {title}
      </h2>
      <div className="flex-1 h-px bg-[#FAF6F0]/10 ml-2" />
    </div>
  );
}

function CategoryPill({
  label,
  icon,
  active,
  onClick,
}: {
  id: string;
  label: string;
  icon?: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-[Inter] font-medium whitespace-nowrap transition-all duration-200 shrink-0 cursor-pointer
        ${active
          ? 'bg-[#7B1C1C] text-[#FAF6F0] shadow-lg shadow-[#7B1C1C]/30'
          : 'bg-[#FAF6F0]/8 text-[#FAF6F0]/60 hover:bg-[#FAF6F0]/14 hover:text-[#FAF6F0]'
        }
      `}
    >
      {icon && <span>{icon}</span>}
      {label}
    </button>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="flex items-center gap-3 bg-[#FAF6F0]/5 border border-[#FAF6F0]/8 rounded-2xl p-3 sm:p-4 animate-pulse">
      <div className="shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-[#FAF6F0]/10" />
      <div className="flex-1 space-y-2">
        <div className="h-3 bg-[#FAF6F0]/10 rounded w-1/4" />
        <div className="h-4 bg-[#FAF6F0]/15 rounded w-3/4" />
        <div className="h-3 bg-[#FAF6F0]/8 rounded w-1/2" />
        <div className="h-5 bg-[#C9973A]/20 rounded w-1/3 mt-2" />
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState<string>(ALL_CATEGORY_ID);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const categoryBarRef = useRef<HTMLDivElement>(null);

  // ─── Data fetching ──────────────────────────────────────────────────────────

  const { data: rawProducts, isLoading: loadingProducts, error: errorProducts } = useQuery({
    queryKey: ['fudo-products'],
    queryFn: fetchProducts,
    staleTime: 10 * 60 * 1000, // 10 min
  });

  const { data: rawCategories } = useQuery({
    queryKey: ['fudo-categories'],
    queryFn: fetchProductCategories,
    staleTime: 30 * 60 * 1000, // 30 min
  });

  // ─── Derived data ───────────────────────────────────────────────────────────

  const products = useMemo(
    () => (rawProducts ? normaliseProducts(rawProducts) : []),
    [rawProducts],
  );

  const categories = useMemo(
    () => (rawCategories ? normaliseCategories(rawCategories) : []),
    [rawCategories],
  );

  const bestsellers = useMemo(
    () =>
      BESTSELLER_IDS.map((id) => products.find((p) => p.id === id))
        .filter(Boolean) as NormalisedProduct[],
    [products],
  );

  const tendencia = useMemo(
    () =>
      TENDENCIA_IDS.map((id) => products.find((p) => p.id === id))
        .filter(Boolean) as NormalisedProduct[],
    [products],
  );

  const filteredProducts = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return products.filter((p) => {
      const matchesSearch = !q || p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
      const matchesCategory =
        activeCategory === ALL_CATEGORY_ID ||
        activeCategory === TOP_CATEGORY_ID ||
        activeCategory === TENDENCIA_CATEGORY_ID ||
        p.categoryId === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, activeCategory]);

  // Products to show depending on active filter
  const displayProducts = useMemo(() => {
    if (activeCategory === TOP_CATEGORY_ID) return bestsellers;
    if (activeCategory === TENDENCIA_CATEGORY_ID) return tendencia;
    return filteredProducts;
  }, [activeCategory, filteredProducts, bestsellers, tendencia]);

  // Group by section for "All" view
  const showSections = activeCategory === ALL_CATEGORY_ID && !searchQuery;

  // ─── Keyboard shortcut ──────────────────────────────────────────────────────

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#1A1008]">
      {/* ── Sticky header ─────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-[#1A1008]/95 backdrop-blur-md border-b border-[#FAF6F0]/8 shadow-xl shadow-black/30">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          {/* Back to home */}
          <Link
            to="/"
            className="shrink-0 w-9 h-9 rounded-full bg-[#FAF6F0]/8 hover:bg-[#FAF6F0]/15 flex items-center justify-center text-[#FAF6F0]/70 hover:text-[#FAF6F0] transition-all duration-200"
            aria-label="Volver al inicio"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </Link>

          {/* Brand logo */}
          <div className="shrink-0">
            <p className="text-[#C9973A] font-[Playfair_Display] font-bold text-xs tracking-widest uppercase leading-none">
              La Nueva
            </p>
            <p className="text-[#FAF6F0] font-[Dancing_Script] font-bold text-xl leading-tight -mt-0.5">
              Recoleta
            </p>
          </div>

          {/* Search bar */}
          <div className="relative flex-1">
            <svg
              className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-200 pointer-events-none ${isSearchFocused ? 'text-[#C9973A]' : 'text-[#FAF6F0]/40'}`}
              fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7 7 0 1111 4a7 7 0 015.65 12.65z" />
            </svg>
            <input
              ref={searchRef}
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setActiveCategory(ALL_CATEGORY_ID);
              }}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              placeholder="Buscar en el menú…"
              className={`
                w-full pl-9 pr-9 py-2.5 rounded-xl text-sm font-[Inter] text-[#FAF6F0] placeholder-[#FAF6F0]/35
                bg-[#FAF6F0]/8 border transition-all duration-200 outline-none
                ${isSearchFocused ? 'border-[#C9973A]/60 bg-[#FAF6F0]/12' : 'border-[#FAF6F0]/10'}
              `}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#FAF6F0]/40 hover:text-[#FAF6F0] cursor-pointer transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* ── Category pills ─────────────────────────────────────────── */}
        <div
          ref={categoryBarRef}
          className="flex gap-2 overflow-x-auto scrollbar-hide px-4 pb-3 pt-1"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <CategoryPill
            id={ALL_CATEGORY_ID}
            label="Todo"
            icon="🍽️"
            active={activeCategory === ALL_CATEGORY_ID}
            onClick={() => setActiveCategory(ALL_CATEGORY_ID)}
          />
          <CategoryPill
            id={TOP_CATEGORY_ID}
            label="Lo más vendido"
            icon="🔥"
            active={activeCategory === TOP_CATEGORY_ID}
            onClick={() => setActiveCategory(TOP_CATEGORY_ID)}
          />
          <CategoryPill
            id={TENDENCIA_CATEGORY_ID}
            label="Tendencia"
            icon="📈"
            active={activeCategory === TENDENCIA_CATEGORY_ID}
            onClick={() => setActiveCategory(TENDENCIA_CATEGORY_ID)}
          />
          {categories.map((cat) => (
            <CategoryPill
              key={cat.id}
              id={cat.id}
              label={cat.name}
              icon={CATEGORY_ICONS[cat.id]}
              active={activeCategory === cat.id}
              onClick={() => setActiveCategory(cat.id)}
            />
          ))}
        </div>
      </header>

      {/* ── Content ───────────────────────────────────────────────────── */}
      <main className="max-w-3xl mx-auto px-4 pb-20">

        {/* Loading state */}
        {loadingProducts && (
          <div className="pt-6 space-y-3">
            {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {/* Error state */}
        {errorProducts && !loadingProducts && (
          <div className="pt-16 text-center">
            <div className="text-4xl mb-4">😕</div>
            <h2 className="font-[Playfair_Display] font-bold text-xl text-[#FAF6F0] mb-2">
              No pudimos cargar el menú
            </h2>
            <p className="text-[#FAF6F0]/50 font-[Inter] text-sm mb-6">
              Revisá tu conexión e intentá de nuevo.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-[#7B1C1C] hover:bg-[#9B2D2D] text-[#FAF6F0] px-6 py-3 rounded-full font-[Inter] font-medium text-sm transition-colors duration-200 cursor-pointer"
            >
              Reintentar
            </button>
          </div>
        )}

        {/* Sections view (All + no search) */}
        {!loadingProducts && !errorProducts && showSections && (
          <div className="pt-5 space-y-8">
            {/* Lo más vendido */}
            {bestsellers.length > 0 && (
              <section>
                <SectionHeader emoji="🔥" title="Lo más vendido" />
                <div className="space-y-2.5">
                  {bestsellers.slice(0, 8).map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
                {bestsellers.length > 8 && (
                  <button
                    onClick={() => setActiveCategory(TOP_CATEGORY_ID)}
                    className="w-full mt-3 py-3 text-[#C9973A] hover:text-[#E5B85A] font-[Inter] font-medium text-sm text-center transition-colors duration-200 cursor-pointer"
                  >
                    Ver todos los más vendidos ({bestsellers.length}) →
                  </button>
                )}
              </section>
            )}

            {/* Tendencia */}
            {tendencia.length > 0 && (
              <section>
                <SectionHeader emoji="📈" title="Tendencia" />
                <div className="space-y-2.5">
                  {tendencia.slice(0, 5).map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              </section>
            )}

            {/* Per-category sections */}
            {categories.map((cat) => {
              const catProducts = products.filter((p) => p.categoryId === cat.id);
              if (catProducts.length === 0) return null;
              return (
                <section key={cat.id}>
                  <SectionHeader
                    emoji={CATEGORY_ICONS[cat.id] ?? '🍽️'}
                    title={cat.name}
                  />
                  <div className="space-y-2.5">
                    {catProducts.map((p) => (
                      <ProductCard key={p.id} product={p} />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        )}

        {/* Filtered / search view */}
        {!loadingProducts && !errorProducts && !showSections && (
          <div className="pt-5">
            {/* Result count when searching */}
            {searchQuery && (
              <p className="text-[#FAF6F0]/40 font-[Inter] text-xs mb-4">
                {displayProducts.length === 0
                  ? 'Sin resultados'
                  : `${displayProducts.length} resultado${displayProducts.length !== 1 ? 's' : ''} para "${searchQuery}"`
                }
              </p>
            )}

            {displayProducts.length === 0 ? (
              <div className="pt-16 text-center">
                <div className="text-5xl mb-4">🔍</div>
                <h3 className="font-[Playfair_Display] font-bold text-lg text-[#FAF6F0] mb-2">
                  Sin resultados
                </h3>
                <p className="text-[#FAF6F0]/50 font-[Inter] text-sm mb-6">
                  No encontramos productos para "{searchQuery}"
                </p>
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-[#C9973A] font-[Inter] font-medium text-sm cursor-pointer"
                >
                  Limpiar búsqueda
                </button>
              </div>
            ) : (
              <AnimatePresence mode="popLayout">
                <div className="space-y-2.5">
                  {displayProducts.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              </AnimatePresence>
            )}
          </div>
        )}
      </main>

      {/* ── Sticky bottom CTA ──────────────────────────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-[#1A1008] via-[#1A1008]/90 to-transparent pt-6 pb-5 px-4">
        <div className="max-w-3xl mx-auto">
          <a
            href={MAPS_DIRECTIONS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-[#7B1C1C] hover:bg-[#9B2D2D] text-[#FAF6F0] w-full py-3.5 rounded-2xl font-[Inter] font-semibold text-sm tracking-wide transition-all duration-300 shadow-xl shadow-[#7B1C1C]/40"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
            Cómo llegar
          </a>
        </div>
      </div>
    </div>
  );
}
