import type { Review } from '../types';

export const MOCK_REVIEWS: Review[] = [
  {
    id: '1',
    author: 'María González',
    rating: 5,
    text: 'El mejor medialunas de Buenos Aires, sin duda. El café es exquisito y la atención es impecable. Un lugar que te hace sentir como en casa.',
    date: 'Enero 2025',
    source: 'google',
  },
  {
    id: '2',
    author: 'Carlos Rodríguez',
    rating: 5,
    text: 'Fui por primera vez hace un mes y ya no puedo dejar de volver. Los facturas recién salidas del horno son una experiencia. 100% recomendado.',
    date: 'Febrero 2025',
    source: 'google',
  },
  {
    id: '3',
    author: 'Laura Pérez',
    rating: 5,
    text: 'La calidad de los productos es increíble. Todo casero, todo fresco. El lugar tiene una onda muy cálida y acogedora. Mi panadería favorita del barrio.',
    date: 'Diciembre 2024',
    source: 'google',
  },
  {
    id: '4',
    author: 'Martín Alvarez',
    rating: 5,
    text: 'El pan de campo es una locura. Llegué por casualidad y salí con dos bolsas llenas. Los precios son más que razonables para la calidad que ofrecen.',
    date: 'Enero 2025',
    source: 'google',
  },
  {
    id: '5',
    author: 'Sofía Méndez',
    rating: 5,
    text: 'Ambiente acogedor, productos de primer nivel y el personal super atento. Las tartas son una obra de arte. Definitivamente el mejor lugar del barrio.',
    date: 'Febrero 2025',
    source: 'google',
  },
];

export const NAV_LINKS = [
  { label: 'Inicio', href: '#inicio' },
  { label: 'Nosotros', href: '#nosotros' },
  { label: 'Menú', href: '#menu' },
  { label: 'Reviews', href: '#reviews' },
  { label: 'Ubicación', href: '#ubicacion' },
];
