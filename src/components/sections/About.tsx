import { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from '../../hooks/useInView';

const stats = [
  { value: '+10', label: 'Años de historia' },
  { value: '+50', label: 'Productos artesanales' },
  { value: '4.1★', label: 'En Google Reviews' },
];

export default function About() {
  const [mainImageError, setMainImageError] = useState(false);
  const { ref: titleRef, inView: titleInView } = useInView();
  const { ref: contentRef, inView: contentInView } = useInView({ threshold: 0.15 });

  return (
    <section id="nosotros" className="bg-[#FAF6F0] py-24 px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Text */}
          <div>
            <motion.p
              ref={titleRef as React.RefObject<HTMLParagraphElement>}
              initial={{ opacity: 0, x: -30 }}
              animate={titleInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7 }}
              className="text-[#7B1C1C] font-[Playfair_Display] text-sm tracking-[0.3em] uppercase mb-3"
            >
              Nuestra Historia
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, x: -30 }}
              animate={titleInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-[Playfair_Display] font-bold text-4xl md:text-5xl lg:text-6xl text-[#3D1F0D] leading-tight mb-6"
            >
              Artesanal de<br />
              <span className="text-[#7B1C1C] italic">corazón.</span>
            </motion.h2>

            <motion.div
              ref={contentRef as React.RefObject<HTMLDivElement>}
              initial={{ opacity: 0, y: 20 }}
              animate={contentInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="space-y-4 text-[#3D1F0D]/70 font-[Inter] text-base md:text-lg leading-relaxed"
            >
              <p>
                En La Nueva Recoleta hacemos las cosas como siempre se hicieron: con las manos,
                con tiempo, y con la mejor materia prima. Cada pieza de pan, cada medialunas,
                cada tarta lleva el sello de quien la hace con orgullo.
              </p>
              <p>
                Somos la panadería de barrio que no cedió a los atajos. El mismo calor de horno,
                la misma masa madre, la misma dedicación de siempre.
              </p>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={contentInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="flex flex-wrap gap-8 mt-10"
            >
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="font-[Playfair_Display] font-bold text-3xl md:text-4xl text-[#7B1C1C]">
                    {stat.value}
                  </div>
                  <div className="text-[#3D1F0D]/60 text-xs tracking-wide uppercase font-[Inter] mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Image grid */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={contentInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="grid grid-cols-2 gap-4"
          >
            {/* Large image */}
            <div className="col-span-2 aspect-[16/9] rounded-2xl overflow-hidden bg-[#3D1F0D]/10 relative group">
              <img
                src="/images/about-main.jpg"
                alt="Interior La Nueva Recoleta"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                onError={() => setMainImageError(true)}
              />
              {/* Placeholder only when image failed to load */}
              {mainImageError && (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#3D1F0D] to-[#7B1C1C]">
                  <span className="font-[Dancing_Script] text-[#FAF6F0]/30 text-6xl">
                    La Nueva Recoleta
                  </span>
                </div>
              )}
            </div>

            {/* Small images */}
            {['/images/about-2.jpg', '/images/about-3.jpg'].map((src, i) => (
              <div
                key={i}
                className="aspect-square rounded-2xl overflow-hidden bg-[#3D1F0D]/10 relative group"
              >
                <img
                  src={src}
                  alt={`Panadería ${i + 2}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-[#7B1C1C]/60 to-[#3D1F0D]/80" />
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
