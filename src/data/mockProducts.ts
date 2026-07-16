/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product, Banner, Coupon, Order, Address } from '../types';

// Helper for generating standard reviews
const generateReviewsForProduct = (productName: string, idPrefix: string) => [
  {
    id: `${idPrefix}_rev_1`,
    userName: "Guilherme Santos",
    rating: 5,
    comment: `Absolutamente impecável. O caimento da peça ${productName} é perfeito, a costura é finíssima e o tecido respira extremamente bem. Atendimento digno de alfaiataria italiana.`,
    date: "2026-06-15",
    color: "#FFFFFF",
    size: "M"
  },
  {
    id: `${idPrefix}_rev_2`,
    userName: "Mateus Alencar",
    rating: 5,
    comment: "Produto excepcional. O algodão egípcio realmente faz diferença ao toque. Chegou em uma embalagem perfumada super premium.",
    date: "2026-06-28",
    color: "#000000",
    size: "G"
  },
  {
    id: `${idPrefix}_rev_3`,
    userName: "Roberto Albuquerque",
    rating: 4,
    comment: "Muito confortável e elegante. Recomendo prestar atenção na tabela de medidas, comprei a Slim e ficou excelente, mas justa como deve ser.",
    date: "2026-07-02",
    color: "#1E3A8A",
    size: "GG"
  }
];

// Helper for generic FAQs
const defaultProductFAQs = [
  {
    id: "faq_1",
    question: "Como funciona a política de trocas e devoluções?",
    answer: "Oferecemos a primeira troca grátis em até 30 dias após o recebimento. A peça deve estar com a etiqueta original e sem sinais de uso."
  },
  {
    id: "faq_2",
    question: "Qual o prazo de envio e rastreamento?",
    answer: "Os pedidos aprovados são despachados em até 24 horas úteis. O código de rastreamento é enviado automaticamente para o seu e-mail e fica disponível na sua área do cliente."
  },
  {
    id: "faq_3",
    question: "Quais as instruções recomendadas de lavagem?",
    answer: "Para manter as fibras nobres e a durabilidade, recomendamos lavagem à mão ou ciclo delicado com sabão neutro. Não usar secadora e passar com ferro em temperatura média."
  }
];

// Color palette mapping
const colorNames: Record<string, string> = {
  "#FFFFFF": "Branco Puro",
  "#000000": "Preto Absoluto",
  "#F5F5F5": "Cinza Off-White",
  "#333333": "Cinza Carbono",
  "#1E3A8A": "Azul Marinho",
  "#1B4332": "Verde Floresta",
  "#C5A880": "Bege Areia",
  "#78350F": "Marrom Couro",
  "#4A0E17": "Vinho Bordeaux"
};

// 24 Shirts List
const rawShirts = [
  { id: "cam_01", name: "Camisa Oxford Sartorial Premium", price: 389.90, origPrice: 459.90, sub: "Camisas Sociais", colors: ["#FFFFFF", "#1E3A8A", "#F5F5F5"] },
  { id: "cam_02", name: "Camisa Slim Fit Linho Amalfi", price: 429.00, origPrice: 499.00, sub: "Camisas Slim", colors: ["#C5A880", "#FFFFFF", "#1E3A8A"] },
  { id: "cam_03", name: "Camisa Egyptian Cotton Royal", price: 549.90, sub: "Camisas Premium", colors: ["#FFFFFF", "#000000", "#F5F5F5"] },
  { id: "cam_04", name: "Camisa Milão Maquinetada", price: 359.00, origPrice: 399.00, sub: "Camisas Manga Longa", colors: ["#FFFFFF", "#1E3A8A"] },
  { id: "cam_05", name: "Camisa Casual Linho Capri", price: 379.90, sub: "Camisas Manga Curta", colors: ["#C5A880", "#1B4332", "#FFFFFF"] },
  { id: "cam_06", name: "Camisa Microtextura Diamond", price: 449.00, sub: "Camisas Premium", colors: ["#333333", "#FFFFFF", "#4A0E17"] },
  { id: "cam_07", name: "Camisa Classic Fit Popeline Francesa", price: 399.00, origPrice: 479.00, sub: "Camisas Sociais", colors: ["#FFFFFF", "#1E3A8A", "#333333"] },
  { id: "cam_08", name: "Camisa Stretch Dynamic Slim", price: 349.90, sub: "Camisas Slim", colors: ["#000000", "#FFFFFF", "#1E3A8A"] },
  { id: "cam_09", name: "Camisa Jacquard Noblesse", price: 499.00, sub: "Camisas Premium", colors: ["#4A0E17", "#000000", "#1E3A8A"] },
  { id: "cam_10", name: "Camisa Fio Egípcio 120 Fil-à-Fil", price: 589.90, sub: "Camisas Premium", colors: ["#FFFFFF", "#1E3A8A"] },
  { id: "cam_11", name: "Camisa Chambray Soft Indigo", price: 369.90, sub: "Camisas Manga Longa", colors: ["#1E3A8A", "#F5F5F5"] },
  { id: "cam_12", name: "Camisa Gola Padre Linho Puro", price: 419.00, origPrice: 489.00, sub: "Camisas Manga Longa", colors: ["#C5A880", "#FFFFFF", "#1B4332"] },
  { id: "cam_13", name: "Camisa Estampada Minimalist Foliage", price: 339.90, sub: "Camisas Manga Curta", colors: ["#333333", "#FFFFFF"] },
  { id: "cam_14", name: "Camisa Oxford Classic Comfort", price: 299.90, origPrice: 359.90, sub: "Camisas Sociais", colors: ["#FFFFFF", "#1E3A8A"] },
  { id: "cam_15", name: "Camisa Slim Micro-Print Dots", price: 349.00, sub: "Camisas Slim", colors: ["#1E3A8A", "#333333"] },
  { id: "cam_16", name: "Camisa Premium Satin Silk-Blend", price: 629.90, sub: "Camisas Premium", colors: ["#000000", "#FFFFFF", "#4A0E17"] },
  { id: "cam_17", name: "Camisa Maquinetada Herringbone", price: 389.00, sub: "Camisas Manga Longa", colors: ["#FFFFFF", "#333333"] },
  { id: "cam_18", name: "Camisa Safari de Algodão Nobre", price: 379.00, sub: "Camisas Manga Curta", colors: ["#1B4332", "#C5A880"] },
  { id: "cam_19", name: "Camisa Alfaiataria Gola Italiana", price: 459.90, origPrice: 529.90, sub: "Camisas Sociais", colors: ["#FFFFFF", "#000000"] },
  { id: "cam_20", name: "Camisa Slim Knit Ultra-Comfort", price: 369.00, sub: "Camisas Slim", colors: ["#333333", "#FFFFFF", "#1E3A8A"] },
  { id: "cam_21", name: "Camisa Flanela Escovada Heritage", price: 399.00, sub: "Camisas Manga Longa", colors: ["#4A0E17", "#333333"] },
  { id: "cam_22", name: "Camisa Piquet Pima Supima", price: 329.90, sub: "Camisas Manga Curta", colors: ["#000000", "#FFFFFF", "#C5A880"] },
  { id: "cam_23", name: "Camisa Tuxedo Plissada Premium", price: 699.00, sub: "Camisas Premium", colors: ["#FFFFFF", "#000000"] },
  { id: "cam_24", name: "Camisa Linen-Blend Riviera Short-Sleeve", price: 349.00, origPrice: 399.00, sub: "Camisas Manga Curta", colors: ["#C5A880", "#FFFFFF", "#1B4332"] }
];

// 24 Pants List
const rawPants = [
  { id: "cal_01", name: "Calça Alfaiataria Lã Fria Florença", price: 549.90, origPrice: 629.90, sub: "Calças Alfaiataria", colors: ["#000000", "#333333", "#1E3A8A"] },
  { id: "cal_02", name: "Calça Chino Slim Fit Dover", price: 369.00, sub: "Calças Slim", colors: ["#C5A880", "#333333", "#1B4332"] },
  { id: "cal_03", name: "Calça Social Premium Super 120", price: 689.90, sub: "Calças Premium", colors: ["#000000", "#333333", "#1E3A8A"] },
  { id: "cal_04", name: "Calça Alfaiataria Linho Toscana", price: 459.00, origPrice: 529.00, sub: "Calças Alfaiataria", colors: ["#C5A880", "#FFFFFF", "#1E3A8A"] },
  { id: "cal_05", name: "Calça Chino Confort Flex", price: 329.90, sub: "Calças Slim", colors: ["#333333", "#C5A880", "#000000"] },
  { id: "cal_06", name: "Calça Social Oxford Classic", price: 389.00, sub: "Calças Sociais", colors: ["#1E3A8A", "#000000", "#333333"] },
  { id: "cal_07", name: "Calça Premium Lã e Seda Veneza", price: 849.00, sub: "Calças Premium", colors: ["#000000", "#333333"] },
  { id: "cal_08", name: "Calça Slim Alfaiataria Parma", price: 419.90, origPrice: 489.90, sub: "Calças Slim", colors: ["#333333", "#1E3A8A", "#C5A880"] },
  { id: "cal_09", name: "Calça Chino Structured Premium", price: 399.00, sub: "Calças Premium", colors: ["#78350F", "#C5A880", "#000000"] },
  { id: "cal_10", name: "Calça Alfaiataria Xadrez Príncipe de Gales", price: 499.00, origPrice: 569.00, sub: "Calças Alfaiataria", colors: ["#333333", "#000000"] },
  { id: "cal_11", name: "Calça Jogger Sartorial Nobre", price: 359.90, sub: "Calças Slim", colors: ["#333333", "#1E3A8A"] },
  { id: "cal_12", name: "Calça Social Gabardina Italiana", price: 489.00, sub: "Calças Sociais", colors: ["#000000", "#1E3A8A"] },
  { id: "cal_13", name: "Calça Cargo Sartorial Premium", price: 429.00, sub: "Calças Premium", colors: ["#1B4332", "#333333", "#C5A880"] },
  { id: "cal_14", name: "Calça Alfaiataria Gelo Sartoriale", price: 479.90, sub: "Calças Alfaiataria", colors: ["#F5F5F5", "#C5A880"] },
  { id: "cal_15", name: "Calça Chino Soft Suede Touch", price: 389.90, origPrice: 439.90, sub: "Calças Slim", colors: ["#78350F", "#C5A880"] },
  { id: "cal_16", name: "Calça Social Maquinetada Slim", price: 419.00, sub: "Calças Sociais", colors: ["#000000", "#1E3A8A"] },
  { id: "cal_17", name: "Calça Veludo Cotelê Heritage", price: 469.00, sub: "Calças Premium", colors: ["#78350F", "#333333"] },
  { id: "cal_18", name: "Calça Alfaiataria Gola Larga Milão", price: 529.00, sub: "Calças Alfaiataria", colors: ["#000000", "#333333"] },
  { id: "cal_19", name: "Calça Chino Slim Urban Premium", price: 349.90, sub: "Calças Slim", colors: ["#000000", "#C5A880", "#FFFFFF"] },
  { id: "cal_20", name: "Calça Linho Puro Amalfi Breeze", price: 489.90, origPrice: 549.90, sub: "Calças Premium", colors: ["#FFFFFF", "#C5A880"] },
  { id: "cal_21", name: "Calça Social Premium High-Twist", price: 619.00, sub: "Calças Premium", colors: ["#000000", "#1E3A8A"] },
  { id: "cal_22", name: "Calça Alfaiataria Cropped Moderna", price: 439.00, sub: "Calças Alfaiataria", colors: ["#333333", "#000000"] },
  { id: "cal_23", name: "Calça Social de Sarja Acetinada", price: 399.00, origPrice: 459.00, sub: "Calças Sociais", colors: ["#FFFFFF", "#000000", "#1E3A8A"] },
  { id: "cal_24", name: "Calça Chino Microtextura Executiva", price: 359.90, sub: "Calças Slim", colors: ["#333333", "#C5A880"] }
];

// Beautiful images arrays from Unsplash
const shirtImages = [
  "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1603252109303-2751441dd157?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1563253782-2e217e47cf20?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1593032465175-481ac7f401a0?w=600&auto=format&fit=crop&q=80"
];

const pantsImages = [
  "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1621072156002-e2fcc103e86e?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1479064555552-3ef4979f8908?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1505022610485-0249ba5b3675?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=600&auto=format&fit=crop&q=80"
];

// Generate products
export const generateInitialProducts = (): Product[] => {
  return [];
};

// Initial Banners
export const INITIAL_BANNERS: Banner[] = [
  {
    id: "banner_01",
    title: "Elegância em Cada Detalhe",
    subtitle: "As melhores camisas e calças masculinas com qualidade premium de alfaiataria internacional.",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1920&q=80",
    link: "novidades",
    active: true
  },
  {
    id: "banner_02",
    title: "Coleção Sarto Imperial",
    subtitle: "Lançamento exclusivo de algodão egípcio e lã fria super 120 para o cavalheiro moderno.",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=1920&q=80",
    link: "Premium",
    active: true
  },
  {
    id: "banner_03",
    title: "Linho Amalfi Premium",
    subtitle: "A leveza e sofisticação do linho italiano nas cores da temporada de verão.",
    image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=1920&q=80",
    link: "Slim",
    active: true
  }
];

// Initial Coupons
export const INITIAL_COUPONS: Coupon[] = [
  {
    id: "cp_01",
    code: "ELEGANCIA10",
    discountType: "percentage",
    value: 10,
    minPurchase: 150,
    active: true
  },
  {
    id: "cp_02",
    code: "VALENTINE20",
    discountType: "percentage",
    value: 20,
    minPurchase: 500,
    active: true
  },
  {
    id: "cp_03",
    code: "ALFAIATE100",
    discountType: "fixed",
    value: 100,
    minPurchase: 800,
    active: true
  },
  {
    id: "cp_04",
    code: "BEMVINDO50",
    discountType: "fixed",
    value: 50,
    minPurchase: 300,
    active: true
  }
];

// Initial Address
export const DEFAULT_ADDRESS: Address = {
  id: "addr_01",
  label: "Residencial",
  street: "Avenida Paulista",
  number: "1000",
  complement: "Apto 152",
  neighborhood: "Bela Vista",
  city: "São Paulo",
  state: "SP",
  zipCode: "01310-100"
};

// Initial Orders for Dashboard Stats (Seeded)
export const INITIAL_ORDERS: Order[] = [
  {
    id: "ORD-9824",
    date: "2026-07-15",
    customerName: "André Luis Medeiros",
    customerEmail: "andre@email.com",
    items: [
      {
        productId: "cam_01",
        name: "Camisa Oxford Sartorial Premium",
        price: 389.90,
        quantity: 1,
        color: "#FFFFFF",
        size: "M",
        image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=150&q=80"
      },
      {
        productId: "cal_01",
        name: "Calça Alfaiataria Lã Fria Florença",
        price: 549.90,
        quantity: 1,
        color: "#000000",
        size: "42",
        image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=150&q=80"
      }
    ],
    subtotal: 939.80,
    discountAmount: 93.98,
    shippingCost: 0,
    total: 845.82,
    status: "Processando",
    paymentMethod: "Cartão",
    shippingAddress: DEFAULT_ADDRESS,
    couponCode: "ELEGANCIA10"
  },
  {
    id: "ORD-9823",
    date: "2026-07-14",
    customerName: "Carlos Henrique Souza",
    customerEmail: "carlos.hen@email.com",
    items: [
      {
        productId: "cam_03",
        name: "Camisa Egyptian Cotton Royal",
        price: 549.90,
        quantity: 2,
        color: "#FFFFFF",
        size: "G",
        image: "https://images.unsplash.com/photo-1603252109303-2751441dd157?w=150&q=80"
      }
    ],
    subtotal: 1099.80,
    discountAmount: 0,
    shippingCost: 0,
    total: 1099.80,
    status: "Pendente",
    paymentMethod: "PIX",
    shippingAddress: DEFAULT_ADDRESS
  },
  {
    id: "ORD-9822",
    date: "2026-07-12",
    customerName: "Julio Cesar Brandão",
    customerEmail: "juliocesar@email.com",
    items: [
      {
        productId: "cal_02",
        name: "Calça Chino Slim Fit Dover",
        price: 369.00,
        quantity: 1,
        color: "#C5A880",
        size: "40",
        image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=150&q=80"
      }
    ],
    subtotal: 369.00,
    discountAmount: 36.90,
    shippingCost: 19.90,
    total: 352.00,
    status: "Enviado",
    paymentMethod: "Boleto",
    shippingAddress: DEFAULT_ADDRESS,
    couponCode: "ELEGANCIA10",
    trackingCode: "BR982472911BR"
  },
  {
    id: "ORD-9821",
    date: "2026-07-10",
    customerName: "Ricardo Menezes",
    customerEmail: "ricardo.men@email.com",
    items: [
      {
        productId: "cam_05",
        name: "Camisa Casual Linho Capri",
        price: 379.90,
        quantity: 1,
        color: "#C5A880",
        size: "M",
        image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=150&q=80"
      },
      {
        productId: "cal_05",
        name: "Calça Chino Confort Flex",
        price: 329.90,
        quantity: 1,
        color: "#333333",
        size: "42",
        image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&q=80"
      }
    ],
    subtotal: 709.80,
    discountAmount: 50.00,
    shippingCost: 0,
    total: 659.80,
    status: "Entregue",
    paymentMethod: "Cartão",
    shippingAddress: DEFAULT_ADDRESS,
    couponCode: "BEMVINDO50"
  },
  {
    id: "ORD-9820",
    date: "2026-07-08",
    customerName: "Felipe Guedes",
    customerEmail: "guedes.f@email.com",
    items: [
      {
        productId: "cam_24",
        name: "Camisa Linen-Blend Riviera",
        price: 349.00,
        quantity: 1,
        color: "#FFFFFF",
        size: "P",
        image: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150&q=80"
      }
    ],
    subtotal: 349.00,
    discountAmount: 0,
    shippingCost: 15.00,
    total: 364.00,
    status: "Entregue",
    paymentMethod: "PIX",
    shippingAddress: DEFAULT_ADDRESS
  }
];
