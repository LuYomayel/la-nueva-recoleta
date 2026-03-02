export interface NavLink {
  label: string;
  href: string;
}

export interface Review {
  id: string;
  author: string;
  avatar?: string;
  rating: number;
  text: string;
  date: string;
  source: 'google';
}

export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  category: string;
  tags?: string[];
}

export interface MenuCategory {
  id: string;
  name: string;
  items: MenuItem[];
}
