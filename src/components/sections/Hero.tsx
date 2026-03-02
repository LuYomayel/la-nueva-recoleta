import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MAPS_DIRECTIONS_URL } from '../../services/googlePlacesService';

export default function Hero() {
  return (
    <section
      id="inicio"
      className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden"
    >
      {/* Hero image background */}
      <div className="absolute inset-0 z-0">
        <img
          src="/Hero.png"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Dark overlay for contrast */}
        <div className="absolute inset-0 bg-[#0F0404]/45" />
        {/* Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,#0A0202_100%)]" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto pt-16 md:pt-20">

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-[#C9973A] font-[Playfair_Display] text-sm md:text-base tracking-[0.3em] uppercase mb-4"
        >
          Panadería · Café
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4 }}
          className="font-[Dancing_Script] font-bold text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-[#FAF6F0] leading-none mb-6"
        >
          La Nueva<br />
          <span className="text-[#C9973A]">Recoleta</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-[#FAF6F0]/75 font-[Playfair_Display] italic text-lg md:text-xl lg:text-2xl mb-10 max-w-xl mx-auto"
        >
          Donde cada bocado cuenta una historia.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
        <Link
          to="/menu"
          className="bg-[#7B1C1C] hover:bg-[#9B2D2D] text-[#FAF6F0] px-10 py-4 rounded-full font-[Inter] font-semibold text-sm tracking-wider uppercase transition-all duration-300 hover:shadow-xl hover:shadow-[#7B1C1C]/50 hover:-translate-y-0.5"
        >
          Ver el Menú
        </Link>
        <a
          href={MAPS_DIRECTIONS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="border border-[#FAF6F0]/40 hover:border-[#C9973A] text-[#FAF6F0] hover:text-[#C9973A] px-10 py-4 rounded-full font-[Inter] font-medium text-sm tracking-wider uppercase transition-all duration-300 flex items-center gap-2 hover:-translate-y-0.5 backdrop-blur-sm bg-black/10"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
          Cómo llegar
        </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[#FAF6F0]/40 text-xs tracking-[0.2em] uppercase font-[Inter]">
          Scrollear
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-0.5 h-8 bg-gradient-to-b from-[#C9973A] to-transparent"
        />
      </motion.div>
    </section>
  );
}
