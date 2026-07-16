/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Star, 
  ShoppingCart, 
  Eye, 
  ArrowRight,
  Sparkles,
  Percent,
  SlidersHorizontal,
  ChevronDown,
  RotateCcw,
  Check,
  Send,
  Phone,
  Mail,
  MapPin,
  Clock,
  Instagram,
  Facebook,
  Search,
  MessageSquare,
  BadgeAlert
} from 'lucide-react';

import { Product, CartItem, Order, Coupon, Banner, Address, CustomerProfile, Review } from './types';
import { 
  generateInitialProducts, 
  INITIAL_ORDERS, 
  INITIAL_COUPONS, 
  INITIAL_BANNERS, 
  DEFAULT_ADDRESS 
} from './data/mockProducts';

import Header from './components/Header';
import HeroBanner from './components/HeroBanner';
import ProductCard from './components/ProductCard';
import ProductDetailsModal from './components/ProductDetailsModal';
import SidebarCart from './components/SidebarCart';
import CheckoutView from './components/CheckoutView';
import AdminPanel from './components/AdminPanel';
import SellerPanel from './components/SellerPanel';
import PasswordGate from './components/PasswordGate';
import CustomerArea from './components/CustomerArea';
import Footer from './components/Footer';

export default function App() {
  const [isAdminAuthorized, setIsAdminAuthorized] = useState(false);
  const [isSellerAuthorized, setIsSellerAuthorized] = useState(false);
  // --- STATE PERSISTENCE IN LOCAL STORAGE ---
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('sarto_products');
    if (saved) {
      return JSON.parse(saved);
    }
    return generateInitialProducts();
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('sarto_orders');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Filter out any mock/simulated orders to keep only real purchases
      return parsed.filter((o: any) => !['ORD-9824', 'ORD-9823', 'ORD-9822', 'ORD-9821', 'ORD-9820'].includes(o.id));
    }
    return [];
  });

  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    const saved = localStorage.getItem('sarto_coupons');
    return saved ? JSON.parse(saved) : INITIAL_COUPONS;
  });

  const [banners, setBanners] = useState<Banner[]>(() => {
    const saved = localStorage.getItem('sarto_banners');
    return saved ? JSON.parse(saved) : INITIAL_BANNERS;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const savedIsLoggedIn = localStorage.getItem('sarto_is_logged_in');
    const isLoggedInUser = savedIsLoggedIn ? JSON.parse(savedIsLoggedIn) : false;
    const savedUserEmail = localStorage.getItem('sarto_user_email');
    
    if (isLoggedInUser && savedUserEmail) {
      const saved = localStorage.getItem(`sarto_cart_${savedUserEmail.toLowerCase()}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.filter((item: any) => item.product && !item.product.id.startsWith('cam_') && !item.product.id.startsWith('cal_'));
      }
    }
    const saved = localStorage.getItem('sarto_cart');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Filter out any cart items referencing the default products
      return parsed.filter((item: any) => item.product && !item.product.id.startsWith('cam_') && !item.product.id.startsWith('cal_'));
    }
    return [];
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    const savedIsLoggedIn = localStorage.getItem('sarto_is_logged_in');
    const isLoggedInUser = savedIsLoggedIn ? JSON.parse(savedIsLoggedIn) : false;
    const savedUserEmail = localStorage.getItem('sarto_user_email');

    if (isLoggedInUser && savedUserEmail) {
      const saved = localStorage.getItem(`sarto_favorites_${savedUserEmail.toLowerCase()}`);
      if (saved) return JSON.parse(saved);
    }
    const saved = localStorage.getItem('sarto_favorites');
    return saved ? JSON.parse(saved) : [];
  });

  // Default VIP profile details
  const [userProfile, setUserProfile] = useState<CustomerProfile>(() => {
    const savedIsLoggedIn = localStorage.getItem('sarto_is_logged_in');
    const isLoggedInUser = savedIsLoggedIn ? JSON.parse(savedIsLoggedIn) : false;
    const savedUserEmail = localStorage.getItem('sarto_user_email');

    if (isLoggedInUser && savedUserEmail) {
      const saved = localStorage.getItem(`sarto_profile_${savedUserEmail.toLowerCase()}`);
      if (saved) return JSON.parse(saved);
    }
    const saved = localStorage.getItem('sarto_profile');
    if (saved) return JSON.parse(saved);
    return {
      name: "Guilherme Sarto Alencar",
      email: "cliente@email.com",
      phone: "(11) 98765-4321",
      addresses: [DEFAULT_ADDRESS],
      favorites: [],
      recentViewed: []
    };
  });

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    const saved = localStorage.getItem('sarto_is_logged_in');
    return saved ? JSON.parse(saved) : false; // Start logged out so new users see the registration option!
  });

  const [registeredUsers, setRegisteredUsers] = useState<{name: string, email: string, pass: string}[]>(() => {
    const saved = localStorage.getItem('sarto_registered_users');
    return saved ? JSON.parse(saved) : [
      { name: "Guilherme Sarto Alencar", email: "cliente@email.com", pass: "123" }
    ];
  });

  useEffect(() => {
    localStorage.setItem('sarto_registered_users', JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  const [userEmail, setUserEmail] = useState<string>(() => {
    const saved = localStorage.getItem('sarto_user_email');
    return saved ? saved : 'cliente@email.com';
  });

  // --- SAVE STATE EFFECTS ---
  useEffect(() => {
    localStorage.setItem('sarto_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('sarto_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('sarto_coupons', JSON.stringify(coupons));
  }, [coupons]);

  useEffect(() => {
    localStorage.setItem('sarto_banners', JSON.stringify(banners));
  }, [banners]);

  useEffect(() => {
    if (isLoggedIn && userEmail) {
      localStorage.setItem(`sarto_cart_${userEmail.toLowerCase()}`, JSON.stringify(cart));
    } else {
      localStorage.setItem('sarto_cart', JSON.stringify(cart));
    }
  }, [cart, isLoggedIn, userEmail]);

  useEffect(() => {
    if (isLoggedIn && userEmail) {
      localStorage.setItem(`sarto_favorites_${userEmail.toLowerCase()}`, JSON.stringify(favorites));
    } else {
      localStorage.setItem('sarto_favorites', JSON.stringify(favorites));
    }
  }, [favorites, isLoggedIn, userEmail]);

  useEffect(() => {
    localStorage.setItem('sarto_profile', JSON.stringify(userProfile));
    if (isLoggedIn && userEmail) {
      localStorage.setItem(`sarto_profile_${userEmail.toLowerCase()}`, JSON.stringify(userProfile));
    }
  }, [userProfile, isLoggedIn, userEmail]);

  useEffect(() => {
    localStorage.setItem('sarto_is_logged_in', JSON.stringify(isLoggedIn));
  }, [isLoggedIn]);

  useEffect(() => {
    localStorage.setItem('sarto_user_email', userEmail);
  }, [userEmail]);

  // --- GENERAL INTERFACE STATE CONTROLS ---
  const [activeTab, setActiveTab] = useState<'home' | 'camisas' | 'calcas' | 'promocoes' | 'novidades' | 'contato' | 'admin' | 'customer' | 'seller'>('home');
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [checkoutMode, setCheckoutMode] = useState(false);
  const [redirectedForCheckout, setRedirectedForCheckout] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // --- COLLAPSIBLE FILTERS BAR STATES ---
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSizeFilter, setSelectedSizeFilter] = useState('');
  const [selectedColorFilter, setSelectedColorFilter] = useState('');
  const [maxPriceFilter, setMaxPriceFilter] = useState(1000);
  const [onlyPromoFilter, setOnlyPromoFilter] = useState(false);
  const [onlyInStockFilter, setOnlyInStockFilter] = useState(false);
  const [sortBy, setSortBy] = useState<'bestseller' | 'new' | 'price-asc' | 'price-desc' | 'rating'>('bestseller');

  // --- ACTIVE APPLIED PROMO CUPON STATE ---
  const [activeCoupon, setActiveCoupon] = useState<Coupon | null>(null);

  // --- CONTACT FORM STATE ---
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSubject, setContactSubject] = useState('Dúvida sobre Medidas');
  const [contactSuccess, setContactSuccess] = useState(false);

  // Scroll to top on navigation or product click
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab, activeProduct, checkoutMode]);

  // Reset checkout redirect state when leaving the customer tab
  useEffect(() => {
    if (activeTab !== 'customer') {
      setRedirectedForCheckout(false);
    }
  }, [activeTab]);

  // Sync favorites count to profile favorite ids list
  useEffect(() => {
    setUserProfile(prev => ({
      ...prev,
      favorites: favorites
    }));
  }, [favorites]);

  // --- ADD TO CART HANDLE ---
  const handleAddToCart = (product: Product, color: string, size: string, qty: number = 1) => {
    const itemUniqueId = `${product.id}_${color.replace('#', '')}_${size}`;
    
    setCart((prev) => {
      const existsIdx = prev.findIndex(item => item.id === itemUniqueId);
      if (existsIdx > -1) {
        const copy = [...prev];
        const newQty = Math.min(product.stock, copy[existsIdx].quantity + qty);
        copy[existsIdx] = {
          ...copy[existsIdx],
          quantity: newQty
        };
        return copy;
      } else {
        return [...prev, {
          id: itemUniqueId,
          product,
          quantity: qty,
          selectedColor: color,
          selectedSize: size
        }];
      }
    });

    setIsCartOpen(true); // Open slide cart instantly on add!
  };

  const handleUpdateCartQty = (itemId: string, qty: number) => {
    setCart((prev) => 
      prev.map(item => item.id === itemId ? { ...item, quantity: qty } : item)
    );
  };

  const handleRemoveFromCart = (itemId: string) => {
    setCart((prev) => prev.filter(item => item.id !== itemId));
  };

  const handleClearCart = () => {
    setCart([]);
    setActiveCoupon(null);
  };

  // --- FAVORITES TOGGLING ---
  const handleToggleFavorite = (productId: string) => {
    setFavorites((prev) => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId) 
        : [...prev, productId]
    );
  };

  // --- APPLY PROMO CODE ---
  const handleApplyCoupon = (code: string): boolean => {
    const matched = coupons.find(cp => cp.code === code && cp.active);
    const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

    if (matched && subtotal >= matched.minPurchase) {
      setActiveCoupon(matched);
      return true;
    }
    return false;
  };

  const handleRemoveCoupon = () => {
    setActiveCoupon(null);
  };

  // --- NEW COMPLETED ORDER WORKFLOW ---
  const handleNewOrderCreated = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
    
    // Decrement stocks and increment sold counts dynamically!
    setProducts((prevProducts) => 
      prevProducts.map((p) => {
        const orderItem = newOrder.items.find(it => it.productId === p.id);
        if (orderItem) {
          return {
            ...p,
            stock: Math.max(0, p.stock - orderItem.quantity),
            soldCount: p.soldCount + orderItem.quantity
          };
        }
        return p;
      })
    );
  };

  // --- AUTH SERVICES ---
  const handleLogin = (email: string, pass: string): boolean => {
    const matched = registeredUsers.find(u => u.email.toLowerCase() === email.toLowerCase() && u.pass === pass);
    if (matched) {
      const emailKey = matched.email.toLowerCase();
      setIsLoggedIn(true);
      setUserEmail(matched.email);
      
      const savedProfile = localStorage.getItem(`sarto_profile_${emailKey}`);
      if (savedProfile) {
        setUserProfile(JSON.parse(savedProfile));
      } else {
        const newProf = {
          name: matched.name,
          email: matched.email,
          phone: "(11) 99999-0000",
          addresses: [DEFAULT_ADDRESS],
          favorites: [],
          recentViewed: []
        };
        setUserProfile(newProf);
        localStorage.setItem(`sarto_profile_${emailKey}`, JSON.stringify(newProf));
      }

      // Load or persist cart
      const savedCart = localStorage.getItem(`sarto_cart_${emailKey}`);
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      } else {
        localStorage.setItem(`sarto_cart_${emailKey}`, JSON.stringify(cart));
      }

      // Load or persist favorites
      const savedFavs = localStorage.getItem(`sarto_favorites_${emailKey}`);
      if (savedFavs) {
        setFavorites(JSON.parse(savedFavs));
      } else {
        localStorage.setItem(`sarto_favorites_${emailKey}`, JSON.stringify(favorites));
      }

      return true;
    }
    return false;
  };

  const handleRegister = (name: string, email: string, pass: string): boolean => {
    const emailKey = email.toLowerCase();
    if (registeredUsers.some(u => u.email.toLowerCase() === emailKey)) {
      return false;
    }
    const newUser = { name, email, pass };
    setRegisteredUsers(prev => [...prev, newUser]);

    const newProfile = {
      name,
      email,
      phone: "(11) 99999-0000",
      addresses: [DEFAULT_ADDRESS],
      favorites: favorites, // Carry over current favorites
      recentViewed: []
    };
    setUserProfile(newProfile);
    localStorage.setItem(`sarto_profile_${emailKey}`, JSON.stringify(newProfile));
    
    // Persist current guest cart and favorites to the new registered account
    localStorage.setItem(`sarto_cart_${emailKey}`, JSON.stringify(cart));
    localStorage.setItem(`sarto_favorites_${emailKey}`, JSON.stringify(favorites));

    setUserEmail(email);
    setIsLoggedIn(true);
    return true;
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserEmail('');
    setCart([]);
    setFavorites([]);
    setUserProfile({
      name: "",
      email: "",
      phone: "",
      addresses: [],
      favorites: [],
      recentViewed: []
    });
    setActiveTab('home');
  };

  // --- PRODUCT MANAGEMENT (ADMIN ACTIONS) ---
  const handleAddProduct = (newProd: Product) => {
    setProducts((prev) => [newProd, ...prev]);
  };

  const handleUpdateProduct = (updated: Product) => {
    setProducts((prev) => prev.map(p => p.id === updated.id ? updated : p));
  };

  const handleDeleteProduct = (id: string) => {
    setProducts((prev) => prev.filter(p => p.id !== id));
  };

  const handleUpdateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders((prev) => prev.map(o => o.id === orderId ? { ...o, status } : o));
  };

  const handleAddCoupon = (newCp: Coupon) => {
    setCoupons((prev) => [newCp, ...prev]);
  };

  const handleDeleteCoupon = (id: string) => {
    setCoupons((prev) => prev.filter(cp => cp.id !== id));
  };

  const handleAddReview = (productId: string, reviewData: Omit<Review, 'id' | 'date'>) => {
    const newReview: Review = {
      ...reviewData,
      id: `rev_${Date.now()}`,
      date: new Date().toISOString().split('T')[0]
    };

    setProducts((prev) => 
      prev.map(p => {
        if (p.id === productId) {
          const updatedReviews = [newReview, ...p.reviews];
          // Recalculate average rating
          const avg = parseFloat((updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length).toFixed(1));
          return {
            ...p,
            reviews: updatedReviews,
            rating: avg
          };
        }
        return p;
      })
    );
  };

  const handleDeleteReview = (productId: string, reviewId: string) => {
    setProducts((prev) => 
      prev.map(p => {
        if (p.id === productId) {
          const updatedReviews = p.reviews.filter(r => r.id !== reviewId);
          const avg = updatedReviews.length > 0 
            ? parseFloat((updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length).toFixed(1)) 
            : 5.0;
          return {
            ...p,
            reviews: updatedReviews,
            rating: avg
          };
        }
        return p;
      })
    );
  };

  // --- CONTACT FORM SUBMISSION ---
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMessage) return;
    setContactSuccess(true);
    setContactName('');
    setContactEmail('');
    setContactMessage('');
    setTimeout(() => setContactSuccess(false), 5000);
  };

  // --- QUICK CATALYST CHEVRON FOR CAROUSEL ---
  const handleCtaClick = (destination: string) => {
    if (destination === 'novidades') {
      setActiveTab('novidades');
    } else if (destination === 'Premium' || destination === 'Slim') {
      setSelectedSizeFilter('');
      setSelectedColorFilter('');
      if (destination === 'Premium') {
        setSelectedColorFilter('');
        setSortBy('rating');
      } else {
        setSortBy('new');
      }
      setActiveTab('home');
    } else {
      setActiveTab('home');
    }
  };

  // --- RESET ALL FILTERS HELPER ---
  const handleResetFilters = () => {
    setSelectedSizeFilter('');
    setSelectedColorFilter('');
    setMaxPriceFilter(1000);
    setOnlyPromoFilter(false);
    setOnlyInStockFilter(false);
    setSortBy('bestseller');
    setSearchQuery('');
  };

  // --- DYNAMIC FILTERING & SORTING LOGIC ---
  const getFilteredProducts = () => {
    let list = [...products];

    // Filter by tab menu
    if (activeTab === 'camisas') {
      list = list.filter(p => p.category === 'Camisas');
    } else if (activeTab === 'calcas') {
      list = list.filter(p => p.category === 'Calças');
    } else if (activeTab === 'promocoes') {
      list = list.filter(p => p.originalPrice && p.originalPrice > p.price);
    } else if (activeTab === 'novidades') {
      list = list.filter(p => p.isNew);
    }

    // Filter by Search typing
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q) || 
                             p.subcategory.toLowerCase().includes(q) ||
                             p.description.toLowerCase().includes(q));
    }

    // Filter by Sizes
    if (selectedSizeFilter) {
      list = list.filter(p => p.sizes.includes(selectedSizeFilter));
    }

    // Filter by Colors
    if (selectedColorFilter) {
      list = list.filter(p => p.colors.includes(selectedColorFilter));
    }

    // Filter by Max Price
    list = list.filter(p => p.price <= maxPriceFilter);

    // Filter by Promotion Toggle
    if (onlyPromoFilter) {
      list = list.filter(p => p.originalPrice && p.originalPrice > p.price);
    }

    // Filter by In Stock Toggle
    if (onlyInStockFilter) {
      list = list.filter(p => p.stock > 0);
    }

    // SORTING PROCESS
    if (sortBy === 'bestseller') {
      list.sort((a, b) => b.soldCount - a.soldCount);
    } else if (sortBy === 'new') {
      list.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    } else if (sortBy === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    }

    return list;
  };

  const filteredCatalog = getFilteredProducts();

  // Related products picker (based on active detail product category)
  const relatedProductsList = activeProduct 
    ? products
        .filter(p => p.id !== activeProduct.id && p.category === activeProduct.category)
        .slice(0, 4)
    : [];

  return (
    <div id="application-scope" className="min-h-screen bg-white flex flex-col font-sans select-none antialiased text-gray-800">
      
      {/* Dynamic Navigation sticky Header */}
      <Header
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        favoritesCount={favorites.length}
        currentSearch={searchQuery}
        onSearchChange={setSearchQuery}
        activeTab={activeTab}
        setActiveTab={(tabId) => {
          setActiveTab(tabId);
          setActiveProduct(null);
          setCheckoutMode(false);
        }}
        onCartClick={() => setIsCartOpen(true)}
        onFavoritesClick={() => {
          setActiveTab('customer');
          setActiveProduct(null);
          setCheckoutMode(false);
          // In customer area, this will list favorites
        }}
        products={products}
        onProductClick={(prod) => {
          setActiveProduct(prod);
          setCheckoutMode(false);
        }}
        isLoggedIn={isLoggedIn}
        userEmail={userEmail}
        onLogout={handleLogout}
      />

      {/* Slide Out Shopping Cart Drawer */}
      <SidebarCart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQty={handleUpdateCartQty}
        onRemoveItem={handleRemoveFromCart}
        coupons={coupons}
        activeCoupon={activeCoupon}
        onApplyCoupon={handleApplyCoupon}
        onRemoveCoupon={handleRemoveCoupon}
        onCheckoutClick={() => {
          setIsCartOpen(false);
          if (!isLoggedIn) {
            setRedirectedForCheckout(true);
            setActiveTab('customer');
          } else {
            setCheckoutMode(true);
          }
          setActiveProduct(null);
        }}
      />

      {/* MAIN LAYOUT CANVAS */}
      <main className="flex-grow">
        
        {checkoutMode ? (
          /* CHECKOUT VIEW */
          <CheckoutView
            cartItems={cart}
            coupons={coupons}
            activeCoupon={activeCoupon}
            onClearCart={handleClearCart}
            onNewOrderCreated={handleNewOrderCreated}
            onClose={() => {
              setCheckoutMode(false);
              setActiveTab('customer');
            }}
            userProfileAddress={userProfile.addresses[0]}
            isLoggedIn={isLoggedIn}
            userEmail={userEmail}
            userProfile={userProfile}
          />
        ) : activeProduct ? (
          /* PRODUCT DETAILS WORKSPACE */
          <ProductDetailsModal
            product={activeProduct}
            onClose={() => setActiveProduct(null)}
            onAddToCart={(prod, col, sz, qty) => {
              handleAddToCart(prod, col, sz, qty);
            }}
            onToggleFavorite={handleToggleFavorite}
            isFavorite={favorites.includes(activeProduct.id)}
            relatedProducts={relatedProductsList}
            onRelatedProductClick={(prod) => setActiveProduct(prod)}
            onBuyNow={(prod, col, sz, qty) => {
              // Quick checkout
              handleClearCart();
              handleAddToCart(prod, col, sz, qty);
              setIsCartOpen(false);
              if (!isLoggedIn) {
                setRedirectedForCheckout(true);
                setActiveTab('customer');
              } else {
                setCheckoutMode(true);
              }
              setActiveProduct(null);
            }}
            onAddReview={handleAddReview}
          />
        ) : activeTab === 'admin' ? (
          /* ADMINISTRATIVE MANAGER PANELS */
          isAdminAuthorized ? (
            <AdminPanel
              products={products}
              orders={orders}
              coupons={coupons}
              banners={banners}
              onAddProduct={handleAddProduct}
              onUpdateProduct={handleUpdateProduct}
              onDeleteProduct={handleDeleteProduct}
              onUpdateOrderStatus={handleUpdateOrderStatus}
              onAddCoupon={handleAddCoupon}
              onDeleteCoupon={handleDeleteCoupon}
              onAddBanner={(newB) => setBanners(prev => [...prev, newB])}
              onDeleteBanner={(id) => setBanners(prev => prev.filter(b => b.id !== id))}
              onDeleteReview={handleDeleteReview}
            />
          ) : (
            <PasswordGate
              title="Acesso Administrativo"
              subtitle="O painel de controle administrativo é restrito. Digite a senha cadastrada para visualizar as informações dos compradores e pedidos."
              onSuccess={() => setIsAdminAuthorized(true)}
              onCancel={() => setActiveTab('home')}
            />
          )
        ) : activeTab === 'seller' ? (
          /* SELLER AND SALES MANAGER WORKSPACE */
          isSellerAuthorized ? (
            <SellerPanel
              products={products}
              orders={orders}
              onAddProduct={handleAddProduct}
              onUpdateProduct={handleUpdateProduct}
              onDeleteProduct={handleDeleteProduct}
              userEmail={userEmail}
            />
          ) : (
            <PasswordGate
              title="Acesso do Vendedor"
              subtitle="A área de vendas e gerência de estoque é restrita. Digite a senha cadastrada para gerenciar seus produtos e vendas."
              onSuccess={() => setIsSellerAuthorized(true)}
              onCancel={() => setActiveTab('home')}
            />
          )
        ) : activeTab === 'customer' ? (
          /* VIP CLIENT ACCOUNTS SPACE */
          <CustomerArea
            isLoggedIn={isLoggedIn}
            onLogin={handleLogin}
            onRegister={handleRegister}
            userEmail={userEmail}
            userProfile={userProfile}
            orders={orders}
            favorites={products.filter(p => favorites.includes(p.id))}
            onRemoveFavorite={handleToggleFavorite}
            onAddAddress={(addr) => setUserProfile(prev => ({ ...prev, addresses: [addr, ...prev.addresses] }))}
            onDeleteAddress={(id) => setUserProfile(prev => ({ ...prev, addresses: prev.addresses.filter(a => a.id !== id) }))}
            onUpdateProfile={(name, phone) => setUserProfile(prev => ({ ...prev, name, phone }))}
            onProductClick={(prod) => setActiveProduct(prod)}
            redirectedForCheckout={redirectedForCheckout}
          />
        ) : activeTab === 'contato' ? (
          /* CONTACT SUPPORT VIEW */
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 animate-in fade-in duration-300">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="text-[10px] font-mono tracking-[0.3em] text-amber-600 block uppercase font-bold">Atendimento Sarto Imperial</span>
              <h1 className="text-3xl font-sans font-extrabold tracking-tight text-gray-900">Como Podemos Ajudar?</h1>
              <p className="text-sm text-gray-500">Entre em contato direto com nossos assessores particulares de alfaiataria ou venha nos fazer uma visita em nosso Showroom exclusivo.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
              {/* Form Col (7 cols) */}
              <div className="lg:col-span-7 bg-white border border-gray-100 p-6 sm:p-8 rounded-xs shadow-xs space-y-6">
                <h3 className="text-sm font-mono uppercase tracking-widest text-black font-semibold border-b border-gray-50 pb-3">Mande uma Mensagem Privada</h3>
                
                {contactSuccess ? (
                  <div className="bg-emerald-50 text-emerald-800 p-5 border border-emerald-100 rounded-xs text-xs font-medium space-y-1">
                    <p className="font-bold">Sua mensagem foi enviada!</p>
                    <p className="text-emerald-600 font-light">Nossos assessores de estilo responderão sua solicitação em até 4 horas úteis diretamente no seu e-mail.</p>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-4 text-xs font-sans">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-mono text-gray-500 uppercase tracking-wider block mb-1">Seu Nome Completo</label>
                        <input
                          id="contact-form-name"
                          type="text"
                          required
                          placeholder="Ex: Roberto Alencar"
                          value={contactName}
                          onChange={(e) => setContactName(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-200 p-3 focus:bg-white focus:border-black focus:outline-hidden"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-mono text-gray-500 uppercase tracking-wider block mb-1">E-mail para Resposta</label>
                        <input
                          id="contact-form-email"
                          type="email"
                          required
                          placeholder="seu@email.com"
                          value={contactEmail}
                          onChange={(e) => setContactEmail(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-200 p-3 focus:bg-white focus:border-black focus:outline-hidden"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-mono text-gray-500 uppercase tracking-wider block mb-1">Assunto do Atendimento</label>
                      <select
                        id="contact-form-subject"
                        value={contactSubject}
                        onChange={(e) => setContactSubject(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 p-3 focus:bg-white focus:border-black focus:outline-hidden"
                      >
                        <option value="Dúvida sobre Medidas">Dúvida sobre Medidas e Caimentos</option>
                        <option value="Trocas ou Devoluções">Solicitar Trocas ou Devoluções</option>
                        <option value="Parcerias Comerciais">Parcerias e Vendas Corporativas</option>
                        <option value="Showroom">Agendar Horário no Showroom</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-mono text-gray-500 uppercase tracking-wider block mb-1">Como podemos te ajudar?</label>
                      <textarea
                        id="contact-form-message"
                        required
                        rows={4}
                        placeholder="Escreva sua solicitação com detalhes..."
                        value={contactMessage}
                        onChange={(e) => setContactMessage(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 p-3 focus:bg-white focus:border-black focus:outline-hidden"
                      />
                    </div>

                    <button
                      id="contact-form-submit-btn"
                      type="submit"
                      className="bg-black hover:bg-gray-800 text-white font-mono text-xs py-3.5 px-8 uppercase tracking-widest flex items-center gap-1.5 transition-colors font-semibold shadow-xs"
                    >
                      Mandar Mensagem <Send className="w-3.5 h-3.5" />
                    </button>
                  </form>
                )}
              </div>

              {/* Showroom Contacts Col (5 cols) */}
              <div className="lg:col-span-5 bg-gray-50 border border-gray-100 p-6 sm:p-8 rounded-xs space-y-6">
                <h3 className="text-sm font-mono uppercase tracking-widest text-black font-semibold border-b border-gray-200 pb-3">Canais de Contato Imediatos</h3>
                
                <div className="space-y-4 font-sans text-xs">
                  <div className="flex gap-3">
                    <Phone className="w-5 h-5 text-amber-600 shrink-0" />
                    <div>
                      <strong className="text-gray-900 font-mono block uppercase">WhatsApp Premium</strong>
                      <p className="text-gray-500 mt-0.5">(11) 99999-9999</p>
                      <p className="text-gray-400">Atendimento humanizado 24h por dia.</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Mail className="w-5 h-5 text-amber-600 shrink-0" />
                    <div>
                      <strong className="text-gray-900 font-mono block uppercase">E-mail Corporativo</strong>
                      <p className="text-gray-500 mt-0.5">suporte@sartoimperial.com</p>
                      <p className="text-gray-400">Respostas oficiais de pós-venda.</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <MapPin className="w-5 h-5 text-amber-600 shrink-0" />
                    <div>
                      <strong className="text-gray-900 font-mono block uppercase">Showroom Presencial</strong>
                      <p className="text-gray-500 mt-0.5">Avenida Paulista, 1000 - Bela Vista, São Paulo - SP</p>
                      <p className="text-gray-400">Necessário agendamento prévio com consultor.</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Clock className="w-5 h-5 text-amber-600 shrink-0" />
                    <div>
                      <strong className="text-gray-900 font-mono block uppercase">Horário de Atendimento</strong>
                      <p className="text-gray-500 mt-0.5">Segunda a Sexta: 08h às 20h • Sábados: 09h às 16h</p>
                    </div>
                  </div>
                </div>

                {/* Elegant placeholder mock Map visual box */}
                <div className="border border-gray-200 bg-white h-40 rounded-xs overflow-hidden flex flex-col justify-end relative shadow-xs">
                  <div className="absolute inset-0 bg-gray-100 flex items-center justify-center p-4 text-center">
                    <div className="space-y-1">
                      <MapPin className="w-8 h-8 text-amber-600 mx-auto animate-bounce" />
                      <p className="text-[10px] font-mono uppercase tracking-wider text-black font-semibold">Showroom Sarto Imperial</p>
                      <p className="text-[9px] text-gray-500 font-sans">Avenida Paulista, 1000 - São Paulo, SP</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* PRIMARY CATALOG / COLLECTION LISTING (HOME & CATEGORIES) */
          <div>
            {/* Automatic responsive carousel Hero block only on landing */}
            {activeTab === 'home' && <HeroBanner onCtaClick={handleCtaClick} />}

            {/* Catalog collection block wrapper */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
              
              {/* Category Header banner */}
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 border-b border-gray-100 pb-5">
                <div className="space-y-1">
                  <h2 className="text-xl sm:text-2xl font-sans font-bold text-gray-900 tracking-tight uppercase">
                    {activeTab === 'home' ? 'Coleção Sarto Completa' : 
                     activeTab === 'camisas' ? 'Camisas Premium Masculinas' : 
                     activeTab === 'calcas' ? 'Calças Sartoriais Elegantes' : 
                     activeTab === 'promocoes' ? 'Peças Selecionadas com Descontos' : 'Lançamentos da Temporada'}
                  </h2>
                  <p className="text-xs text-gray-500">
                    Mostrando <strong className="text-black font-semibold">{filteredCatalog.length}</strong> peças exclusivas.
                  </p>
                </div>

                {/* Filter and sorting actions bar */}
                <div className="flex items-center gap-2">
                  <button
                    id="toggle-filters-panel"
                    onClick={() => setShowFilters(!showFilters)}
                    className={`px-4 py-2 text-xs font-mono uppercase tracking-wider border rounded-xs flex items-center gap-2 transition-colors cursor-pointer ${
                      showFilters || selectedColorFilter || selectedSizeFilter
                        ? 'bg-black text-white border-black font-semibold'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-black'
                    }`}
                  >
                    <SlidersHorizontal className="w-4 h-4" /> Filtros
                    {(selectedColorFilter || selectedSizeFilter || onlyPromoFilter || onlyInStockFilter) && (
                      <span className="w-2 h-2 rounded-full bg-amber-500" />
                    )}
                  </button>

                  <select
                    id="catalog-sort-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="px-4 py-2 bg-white border border-gray-200 rounded-xs text-xs font-mono uppercase tracking-wider text-gray-700 focus:outline-hidden"
                  >
                    <option value="bestseller">Mais Vendidos</option>
                    <option value="new">Novidades</option>
                    <option value="price-asc">Menor Preço</option>
                    <option value="price-desc">Maior Preço</option>
                    <option value="rating">Melhor Avaliado</option>
                  </select>
                </div>
              </div>

              {/* Collapsible filters options toolbar panel */}
              {showFilters && (
                <div className="bg-gray-50 border border-gray-100 rounded-xs p-5 grid grid-cols-1 md:grid-cols-4 gap-6 text-xs animate-in slide-in-from-top duration-300">
                  {/* Column 1: Sizes selectors */}
                  <div className="space-y-2.5">
                    <span className="font-mono text-[10px] uppercase text-gray-400 tracking-wider block">Filtro por Tamanho</span>
                    <div className="flex flex-wrap gap-1.5">
                      {['PP', 'P', 'M', 'G', 'GG', 'XG', '38', '40', '42', '44', '46', '48'].map((sz) => (
                        <button
                          key={sz}
                          onClick={() => setSelectedSizeFilter(selectedSizeFilter === sz ? '' : sz)}
                          className={`w-10 py-1.5 font-mono text-[10px] border transition-all text-center rounded-xs ${
                            selectedSizeFilter === sz
                              ? 'border-black bg-black text-white font-bold'
                              : 'border-gray-200 bg-white hover:border-black text-gray-700'
                          }`}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Column 2: Color selectors */}
                  <div className="space-y-2.5">
                    <span className="font-mono text-[10px] uppercase text-gray-400 tracking-wider block">Filtro por Cores</span>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { hex: "#FFFFFF", name: "Branco" },
                        { hex: "#000000", name: "Preto" },
                        { hex: "#F5F5F5", name: "Off-White" },
                        { hex: "#333333", name: "Carbono" },
                        { hex: "#1E3A8A", name: "Marinho" },
                        { hex: "#1B4332", name: "Verde" },
                        { hex: "#C5A880", name: "Bege" },
                        { hex: "#78350F", name: "Marrom" },
                        { hex: "#4A0E17", name: "Vinho" }
                      ].map((col) => (
                        <button
                          key={col.hex}
                          onClick={() => setSelectedColorFilter(selectedColorFilter === col.hex ? '' : col.hex)}
                          style={{ backgroundColor: col.hex }}
                          className={`w-6 h-6 rounded-full border border-gray-300 relative transition-transform ${
                            selectedColorFilter === col.hex ? 'scale-125 ring-2 ring-amber-500' : 'hover:scale-110'
                          }`}
                          title={col.name}
                        >
                          {selectedColorFilter === col.hex && (
                            <Check className={`w-3.5 h-3.5 absolute inset-0 m-auto ${
                              col.hex === '#FFFFFF' || col.hex === '#F5F5F5' ? 'text-black' : 'text-white'
                            }`} />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Column 3: Price range input */}
                  <div className="space-y-2.5">
                    <span className="font-mono text-[10px] uppercase text-gray-400 tracking-wider block">Faixa de Preço Máxima</span>
                    <div className="space-y-1">
                      <input
                        id="price-range-slider"
                        type="range"
                        min="200"
                        max="1000"
                        step="50"
                        value={maxPriceFilter}
                        onChange={(e) => setMaxPriceFilter(parseInt(e.target.value))}
                        className="w-full accent-amber-500 cursor-pointer"
                      />
                      <div className="flex justify-between font-mono text-[10px] text-gray-500">
                        <span>R$ 200,00</span>
                        <span className="font-bold text-black">Até R$ {maxPriceFilter.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Column 4: Toggles checkboxes */}
                  <div className="space-y-2.5">
                    <span className="font-mono text-[10px] uppercase text-gray-400 tracking-wider block">Outras Opções</span>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          id="filter-only-promo"
                          type="checkbox"
                          checked={onlyPromoFilter}
                          onChange={(e) => setOnlyPromoFilter(e.target.checked)}
                          className="rounded-xs text-black focus:ring-black"
                        />
                        <span className="text-gray-700">Apenas Promoções</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          id="filter-only-instock"
                          type="checkbox"
                          checked={onlyInStockFilter}
                          onChange={(e) => setOnlyInStockFilter(e.target.checked)}
                          className="rounded-xs text-black focus:ring-black"
                        />
                        <span className="text-gray-700">Em Estoque</span>
                      </label>
                    </div>

                    <button
                      id="reset-filters-btn"
                      onClick={handleResetFilters}
                      className="text-amber-700 hover:text-black font-mono text-[10px] uppercase tracking-wider flex items-center gap-1 mt-3"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> Limpar Filtros
                    </button>
                  </div>
                </div>
              )}

              {/* Main Catalog grid showing results */}
              {filteredCatalog.length > 0 ? (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                  {filteredCatalog.map((prod) => (
                    <ProductCard
                      key={prod.id}
                      product={prod}
                      onProductClick={(p: Product) => setActiveProduct(p)}
                      onAddToCart={(p: Product, col: string, sz: string) => handleAddToCart(p, col, sz, 1)}
                      onToggleFavorite={handleToggleFavorite}
                      isFavorite={favorites.includes(prod.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-gray-50 border border-gray-100 rounded-xs space-y-4">
                  <BadgeAlert className="w-12 h-12 text-gray-300 mx-auto" />
                  <div className="space-y-1">
                    <p className="text-sm font-sans font-semibold text-gray-900">Nenhum produto corresponde aos filtros aplicados</p>
                    <p className="text-xs text-gray-500">Tente desativar alguns filtros ou limpar a pesquisa para ver todo o catálogo.</p>
                  </div>
                  <button
                    onClick={handleResetFilters}
                    className="bg-black hover:bg-gray-800 text-white text-xs font-mono py-2.5 px-6 uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Resetar Filtros
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

      </main>

      {/* Luxury Brand Footer */}
      <Footer 
        onNavClick={(tabId) => {
          setActiveTab(tabId);
          setActiveProduct(null);
          setCheckoutMode(false);
        }} 
      />

    </div>
  );
}
