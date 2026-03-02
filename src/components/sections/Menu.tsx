import { Link } from 'react-router-dom';
import { motion, type Variants } from 'framer-motion';
import { useInView } from '../../hooks/useInView';

// Placeholder categories — will be replaced by Fudo API data
const PLACEHOLDER_CATEGORIES = [
  { id: 'panaderia', name: 'Panadería', icon: '🍞' },
  { id: 'facturas', name: 'Facturas', icon: '🥐' },
  { id: 'cafe', name: 'Café & Bebidas', icon: '☕' },
  { id: 'tortas', name: 'Tortas & Tartas', icon: '🎂' },
];

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

export default function Menu() {
  const { ref: headRef, inView: headInView } = useInView();

  return (
    <section id="menu" className="bg-[#1A1008] py-24 px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div ref={headRef as React.RefObject<HTMLDivElement>} className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={headInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-[#C9973A] font-[Playfair_Display] text-sm tracking-[0.3em] uppercase mb-3"
          >
            Lo que hacemos
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={headInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-[Playfair_Display] font-bold text-5xl md:text-6xl lg:text-7xl text-[#FAF6F0] leading-tight mb-4"
          >
            Nuestro{' '}
            <span className="text-[#C9973A] italic">Menú</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={headInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-[#FAF6F0]/50 font-[Playfair_Display] italic text-lg max-w-xl mx-auto"
          >
            Selección artesanal elaborada diariamente con los mejores ingredientes.
          </motion.p>
        </div>

        {/* Category cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-14"
        >
          {PLACEHOLDER_CATEGORIES.map((cat) => (
            <motion.div
              key={cat.id}
              variants={cardVariants}
              whileHover={{ y: -6, transition: { duration: 0.25 } }}
              className="group bg-[#FAF6F0]/5 border border-[#FAF6F0]/10 hover:border-[#C9973A]/40 rounded-2xl p-6 md:p-8 text-center cursor-pointer transition-colors duration-300"
            >
              <div className="text-4xl md:text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {cat.icon}
              </div>
              <h3 className="font-[Playfair_Display] font-semibold text-[#FAF6F0] text-base md:text-lg group-hover:text-[#C9973A] transition-colors duration-300">
                {cat.name}
              </h3>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA to full menu */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="border border-[#C9973A]/20 rounded-3xl p-10 md:p-16 text-center bg-[#FAF6F0]/3"
        >
          <div className="text-5xl mb-4">📋</div>
          <h3 className="font-[Playfair_Display] font-bold text-2xl md:text-3xl text-[#FAF6F0] mb-3">
            Menú completo
          </h3>
          <p className="text-[#FAF6F0]/50 font-[Inter] text-base max-w-md mx-auto mb-8">
            Explorá todos nuestros productos con precios actualizados en tiempo real.
            Cafés, sandwiches, panadería, promos y mucho más.
          </p>
          <Link
            to="/menu"
            className="inline-flex items-center gap-2 bg-[#7B1C1C] hover:bg-[#9B2D2D] text-[#FAF6F0] px-8 py-4 rounded-full font-[Inter] font-semibold text-sm tracking-wide transition-all duration-300 hover:shadow-xl hover:shadow-[#7B1C1C]/40 hover:-translate-y-0.5"
          >
            Ver el menú completo
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
