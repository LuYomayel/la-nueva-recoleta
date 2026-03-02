import { motion } from 'framer-motion';
import { useInView } from '../../hooks/useInView';
import { MAPS_DIRECTIONS_URL, getEmbedUrl } from '../../services/googlePlacesService';

const info = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
      </svg>
    ),
    label: 'Dirección',
    value: 'Charcas 2902, Recoleta\nBuenos Aires, Argentina',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    label: 'Horarios',
    value: 'Lun–Dom: 7:00 – 20:00',
  },
  /*
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    ),
    label: 'Teléfono',
    value: '+54 11 0000-0000',
  },
  */
];

export default function Location() {
  const { ref: headRef, inView: headInView } = useInView();
  const embedUrl = getEmbedUrl();

  return (
    <section id="ubicacion" className="bg-[#1A1008] py-24 px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto">

        {/* ── Header ──────────────────────────────────────────────── */}
        <div ref={headRef as React.RefObject<HTMLDivElement>} className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={headInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-[#C9973A] font-[Playfair_Display] text-sm tracking-[0.3em] uppercase mb-3"
          >
            Visitanos
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={headInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-[Playfair_Display] font-bold text-5xl md:text-6xl text-[#FAF6F0] leading-tight"
          >
            ¿Dónde{' '}
            <span className="text-[#C9973A] italic">encontrarnos?</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">

          {/* ── Map embed ─────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative rounded-3xl overflow-hidden aspect-[4/3] bg-[#FAF6F0]/5 border border-[#FAF6F0]/10"
          >
            <iframe
              title="La Nueva Recoleta — Charcas 2902, Recoleta, Buenos Aires"
              src={embedUrl}
              className="absolute inset-0 w-full h-full grayscale opacity-80 hover:opacity-100 transition-opacity duration-500"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
            {/* Floating CTA */}
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2">
              <a
                href={MAPS_DIRECTIONS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-[#7B1C1C] hover:bg-[#9B2D2D] text-[#FAF6F0] px-6 py-3 rounded-full font-[Inter] font-semibold text-sm shadow-xl transition-all duration-200 whitespace-nowrap hover:shadow-2xl hover:shadow-[#7B1C1C]/40"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
                Cómo llegar
              </a>
            </div>
          </motion.div>

          {/* ── Info cards ─────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="flex flex-col gap-4"
          >
            {info.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex items-start gap-4 bg-[#FAF6F0]/5 border border-[#FAF6F0]/8 rounded-2xl p-5"
              >
                <div className="w-10 h-10 rounded-full bg-[#7B1C1C]/30 text-[#C9973A] flex items-center justify-center shrink-0">
                  {item.icon}
                </div>
                <div>
                  <p className="text-[#FAF6F0]/40 font-[Inter] text-xs uppercase tracking-wider mb-1">
                    {item.label}
                  </p>
                  <p className="text-[#FAF6F0] font-[Inter] text-sm leading-relaxed whitespace-pre-line">
                    {item.value}
                  </p>
                </div>
              </motion.div>
            ))}

            {/* Main CTA */}
            <motion.a
              href={MAPS_DIRECTIONS_URL}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="flex items-center justify-center gap-3 bg-[#7B1C1C] hover:bg-[#9B2D2D] text-[#FAF6F0] py-4 rounded-2xl font-[Inter] font-semibold text-sm tracking-wide transition-all duration-300 hover:shadow-xl hover:shadow-[#7B1C1C]/30 mt-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
              Cómo llegar — Charcas 2902
            </motion.a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
