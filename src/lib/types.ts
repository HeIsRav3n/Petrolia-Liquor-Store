export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  subcategory: string;
  country: string;
  size: string;
  type: string;
  image_url: string;
  description: string;
  in_stock: boolean;
  featured: boolean;
  is_new: boolean;
  is_petrolia_pick: boolean;
  is_miscellaneous: boolean;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
}

export interface FilterState {
  category: string;
  subcategory: string;
  country: string;
  size: string;
  type: string;
  search: string;
  sort: string;
}
