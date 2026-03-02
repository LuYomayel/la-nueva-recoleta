import { Link } from 'react-router-dom';
import { MAPS_DIRECTIONS_URL } from '../../services/googlePlacesService';

export default function Footer() {
  const year = new Date().getFullYear();

  const scrollTo = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#0F0804] border-t border-[#7B1C1C]/20 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">

          {/* Brand */}
          <div>
            <p className="text-[#C9973A] font-[Playfair_Display] font-bold text-lg tracking-widest uppercase mb-1">
              La Nueva
            </p>
            <p className="text-[#FAF6F0] font-[Dancing_Script] font-bold text-4xl -mt-1 mb-3">
              Recoleta
            </p>
            <p className="text-[#FAF6F0]/50 text-sm leading-relaxed">
              Panadería &amp; Café artesanal.<br />
              Charcas 2902, Recoleta<br />
              Buenos Aires, Argentina.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-[#C9973A] font-[Playfair_Display] font-semibold text-sm uppercase tracking-widest mb-4">
              Navegación
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Inicio', onClick: () => scrollTo('#inicio') },
                { label: 'Nosotros', onClick: () => scrollTo('#nosotros') },
                { label: 'Reviews', onClick: () => scrollTo('#reviews') },
                { label: 'Ubicación', onClick: () => scrollTo('#ubicacion') },
              ].map((item) => (
                <li key={item.label}>
                  <button
                    onClick={item.onClick}
                    className="text-[#FAF6F0]/50 hover:text-[#FAF6F0] text-sm transition-colors duration-200 cursor-pointer"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
              <li>
                <Link
                  to="/menu"
                  className="text-[#C9973A] hover:text-[#E5B85A] text-sm font-medium transition-colors duration-200 flex items-center gap-1.5"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Ver el Menú
                </Link>
              </li>
            </ul>
          </div>

          {/* Location */}
          <div>
            <h4 className="text-[#C9973A] font-[Playfair_Display] font-semibold text-sm uppercase tracking-widest mb-4">
              Visitanos
            </h4>
            <div className="space-y-3 mb-5">
              <div className="flex items-start gap-2.5 text-[#FAF6F0]/50 text-sm">
                <svg className="w-4 h-4 text-[#C9973A] shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
                <span>Charcas 2902, Recoleta<br />Buenos Aires</span>
              </div>
              <div className="flex items-start gap-2.5 text-[#FAF6F0]/50 text-sm">
                <svg className="w-4 h-4 text-[#C9973A] shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Lun–Sáb: 7:00 – 20:00<br />Dom: 8:00 – 14:00</span>
              </div>
            </div>
            <a
              href={MAPS_DIRECTIONS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#7B1C1C]/30 hover:bg-[#7B1C1C] border border-[#7B1C1C]/50 text-[#FAF6F0]/70 hover:text-[#FAF6F0] px-4 py-2.5 rounded-full text-xs font-[Inter] font-medium transition-all duration-200"
            >
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
              Cómo llegar
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[#7B1C1C]/20 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-[#FAF6F0]/30 text-xs">
            © {year} La Nueva Recoleta. Todos los derechos reservados.
          </p>
          <p className="text-[#FAF6F0]/20 text-xs">
            Charcas 2902 · Recoleta · Buenos Aires
          </p>
        </div>
      </div>
    </footer>
  );
}
