/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  color: string;
  size: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category: 'Camisas' | 'Calças';
  subcategory: 
    | 'Camisas Sociais'
    | 'Camisas Slim'
    | 'Camisas Premium'
    | 'Camisas Manga Longa'
    | 'Camisas Manga Curta'
    | 'Calças Sociais'
    | 'Calças Slim'
    | 'Calças Alfaiataria'
    | 'Calças Premium';
  price: number;
  originalPrice?: number;
  rating: number;
  soldCount: number;
  images: string[];
  colors: string[];
  colorNames?: Record<string, string>; // hex code -> human-readable color name
  sizes: string[];
  stock: number;
  reviews: Review[];
  faqs: FAQ[];
  isNew?: boolean;
  isBestSeller?: boolean;
  sellerName?: string;
}

export interface CartItem {
  id: string; // combination of productId_color_size
  product: Product;
  quantity: number;
  selectedColor: string;
  selectedSize: string;
}

export interface Address {
  id: string;
  label: string; // e.g., "Casa", "Trabalho"
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface Order {
  id: string;
  date: string;
  customerName: string;
  customerEmail: string;
  items: {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    color: string;
    size: string;
    image: string;
  }[];
  subtotal: number;
  discountAmount: number;
  shippingCost: number;
  total: number;
  status: 'Pendente' | 'Processando' | 'Enviado' | 'Entregue' | 'Cancelado';
  paymentMethod: 'PIX' | 'Cartão' | 'Boleto' | 'Open Banking';
  shippingAddress: Address;
  couponCode?: string;
  trackingCode?: string;
  customerPhone?: string;
  customerCpf?: string;
}

export interface CustomerProfile {
  name: string;
  email: string;
  phone: string;
  addresses: Address[];
  favorites: string[]; // productIds
  recentViewed: string[]; // productIds
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  link: string;
  active: boolean;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  value: number;
  minPurchase: number;
  active: boolean;
}
