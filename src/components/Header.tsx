/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Search, 
  ShoppingBag, 
  Heart, 
  User, 
  Menu, 
  X, 
  ChevronDown,
  Percent,
  Sparkles,
  PhoneCall,
  Sliders,
  LogOut,
  Store
} from 'lucide-react';
import { Product } from '../types';

interface HeaderProps {
  cartCount: number;
  favoritesCount: number;
  currentSearch: string;
  onSearchChange: (val: string) => void;
  activeTab: 'home' | 'camisas' | 'calcas' | 'promocoes' | 'novidades' | 'contato' | 'admin' | 'customer' | 'seller';
  setActiveTab: (tab: any) => void;
  onCartClick: () => void;
  onFavoritesClick: () => void;
  products: Product[];
  onProductClick: (product: Product) => void;
  isLoggedIn: boolean;
  userEmail: string;
  onLogout: () => void;
}

export default function Header({
  cartCount,
  favoritesCount,
  currentSearch,
  onSearchChange,
  activeTab,
  setActiveTab,
  onCartClick,
  onFavoritesClick,
  products,
  onProductClick,
  isLoggedIn,
  userEmail,
  onLogout
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);

  // Filter products for suggestions (max 5)
  const searchSuggestions = currentSearch.trim()
    ? products
        .filter(p => p.name.toLowerCase().includes(currentSearch.toLowerCase()) || 
                     p.subcategory.toLowerCase().includes(currentSearch.toLowerCase()))
        .slice(0, 5)
    : [];

  const handleSuggestionClick = (product: Product) => {
    onProductClick(product);
    setShowSearchSuggestions(false);
    onSearchChange('');
  };

  const navItems = [
    { id: 'home', label: 'Início', icon: null },
    { id: 'camisas', label: 'Camisas', icon: null },
    { id: 'calcas', label: 'Calças', icon: null },
    { id: 'promocoes', label: 'Promoções', icon: <Percent className="w-3.5 h-3.5 text-amber-500 inline mr-1" /> },
    { id: 'novidades', label: 'Novidades', icon: <Sparkles className="w-3.5 h-3.5 text-yellow-500 inline mr-1" /> },
    { id: 'contato', label: 'Contato', icon: <PhoneCall className="w-3.5 h-3.5 text-gray-400 inline mr-1" /> }
  ];

  return (
    <header id="app-header" className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-xs backdrop-blur-md bg-opacity-95">
      {/* Top micro promotion bar */}
      <div className="bg-black text-white text-[11px] font-mono py-1.5 px-4 text-center tracking-widest uppercase">
        Frete grátis em compras acima de R$ 400 • Parcelamento em até 10x sem juros
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Logo brand */}
          <div className="flex-shrink-0 flex items-center">
            <button 
              id="brand-logo"
              onClick={() => { setActiveTab('home'); onSearchChange(''); }}
              className="group text-left"
            >
              <span className="font-sans text-xl sm:text-2xl font-bold tracking-[0.25em] text-black block">
                SARTO
              </span>
              <span className="font-mono text-[9px] tracking-[0.45em] text-amber-600 block uppercase font-medium">
                IMPERIAL
              </span>
            </button>
          </div>

          {/* Large search bar (Instant suggestions) */}
          <div className="hidden md:flex flex-1 max-w-lg relative">
            <div className={`w-full flex items-center bg-gray-50 border rounded-xs px-3.5 py-2 transition-all duration-300 ${
              searchFocused ? 'border-black ring-1 ring-black bg-white' : 'border-gray-200'
            }`}>
              <Search className="w-4 h-4 text-gray-400 mr-2.5 flex-shrink-0" />
              <input
                id="search-input-desktop"
                type="text"
                placeholder="Buscar por camisas premium, calças sociais..."
                value={currentSearch}
                onChange={(e) => {
                  onSearchChange(e.target.value);
                  setShowSearchSuggestions(true);
                }}
                onFocus={() => {
                  setSearchFocused(true);
                  setShowSearchSuggestions(true);
                }}
                onBlur={() => {
                  // Delay so clicks can register
                  setTimeout(() => {
                    setSearchFocused(false);
                    setShowSearchSuggestions(false);
                  }, 200);
                }}
                className="w-full bg-transparent text-sm text-gray-800 placeholder-gray-400 focus:outline-hidden"
              />
              {currentSearch && (
                <button 
                  onClick={() => onSearchChange('')}
                  className="text-gray-400 hover:text-black"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Suggestions dropdown */}
            {showSearchSuggestions && currentSearch.trim() && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-100 shadow-xl rounded-b-xs mt-1 z-50 overflow-hidden">
                <div className="p-2.5 bg-gray-50 text-[11px] font-mono text-gray-500 uppercase tracking-wider border-b border-gray-100">
                  Sugestões encontradas ({searchSuggestions.length})
                </div>
                {searchSuggestions.length > 0 ? (
                  <div className="divide-y divide-gray-100 max-h-80 overflow-y-auto">
                    {searchSuggestions.map((prod) => (
                      <button
                        key={prod.id}
                        onClick={() => handleSuggestionClick(prod)}
                        className="w-full text-left p-3 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                      >
                        <img 
                          src={prod.images[0]} 
                          alt={prod.name} 
                          referrerPolicy="no-referrer"
                          className="w-10 h-12 object-cover rounded-xs border border-gray-100 flex-shrink-0" 
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-mono text-amber-600 uppercase tracking-wider">{prod.subcategory}</p>
                          <p className="text-sm font-medium text-gray-900 truncate">{prod.name}</p>
                          <p className="text-xs font-mono font-medium text-gray-700 mt-0.5">
                            R$ {prod.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center text-sm text-gray-500">
                    Nenhum produto encontrado para "{currentSearch}"
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Quick actions (Favorites, Cart, Client area, Admin) */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Quick admin panel access */}
            <button
              id="header-admin-btn"
              onClick={() => setActiveTab('admin')}
              className={`p-2.5 rounded-full transition-colors flex items-center gap-1 text-xs font-mono uppercase tracking-wider ${
                activeTab === 'admin' 
                  ? 'bg-amber-500/10 text-amber-600 font-semibold' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-black'
              }`}
              title="Painel Admin"
            >
              <Sliders className="w-4 h-4" />
              <span className="hidden lg:inline text-[10px]">Painel</span>
            </button>

            {/* Quick seller panel access */}
            <button
              id="header-seller-btn"
              onClick={() => setActiveTab('seller')}
              className={`p-2.5 rounded-full transition-colors flex items-center gap-1 text-xs font-mono uppercase tracking-wider ${
                activeTab === 'seller' 
                  ? 'bg-amber-500/10 text-amber-600 font-semibold border border-amber-500/30' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-black'
              }`}
              title="Área do Vendedor"
            >
              <Store className="w-4 h-4" />
              <span className="hidden lg:inline text-[10px]">Vendedor</span>
            </button>

            {/* Customer profile area / Cadastrar ou Entrar */}
            {isLoggedIn ? (
              <button
                id="header-user-btn"
                onClick={() => setActiveTab('customer')}
                className={`p-2 py-1.5 sm:px-3 sm:py-2 border border-black transition-all duration-300 flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider ${
                  activeTab === 'customer'
                    ? 'bg-black text-white'
                    : 'bg-white hover:bg-black hover:text-white text-black'
                }`}
                title="Minha Conta"
              >
                <User className="w-4 h-4 shrink-0 text-amber-500" />
                <span className="hidden sm:inline font-bold">Minha Conta</span>
              </button>
            ) : (
              <button
                id="header-auth-btn"
                onClick={() => setActiveTab('customer')}
                className="bg-amber-500 hover:bg-amber-600 text-black font-mono text-[10px] sm:text-[11px] font-bold px-3 py-1.5 sm:px-4 sm:py-2 uppercase tracking-widest flex items-center gap-1.5 transition-all shadow-xs shrink-0 border border-amber-600 rounded-xs"
              >
                <User className="w-4 h-4 shrink-0 text-black" />
                <span>Cadastrar ou Entrar</span>
              </button>
            )}

            {/* Favorites Icon */}
            <button
              id="header-favorites-btn"
              onClick={onFavoritesClick}
              className="p-2.5 rounded-full text-gray-600 hover:bg-gray-50 hover:text-black relative transition-colors"
              title="Favoritos"
            >
              <Heart className="w-5 h-5" />
              {favoritesCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] font-mono font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white">
                  {favoritesCount}
                </span>
              )}
            </button>

            {/* Shopping Cart Icon */}
            <button
              id="header-cart-btn"
              onClick={onCartClick}
              className="p-2.5 bg-black hover:bg-gray-800 text-white rounded-full relative transition-colors shadow-xs flex items-center justify-center"
              title="Ver Carrinho"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-black text-[9px] font-mono font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center border-2 border-black animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-full text-gray-600 hover:bg-gray-50 hover:text-black md:hidden transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Main navigation category menu (Desktop) */}
      <nav className="hidden md:block bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-8">
          <ul className="flex items-center justify-center gap-12 h-12">
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  id={`nav-item-${item.id}`}
                  onClick={() => {
                    setActiveTab(item.id as any);
                    onSearchChange('');
                  }}
                  className={`relative flex items-center text-xs font-mono uppercase tracking-[0.2em] h-12 transition-all duration-300 border-b-2 ${
                    activeTab === item.id
                      ? 'text-black border-black font-semibold'
                      : 'text-gray-500 border-transparent hover:text-black'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Mobile Search & Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg absolute top-full left-0 right-0 py-4 px-6 z-50 animate-in fade-in slide-in-from-top duration-300">
          {/* Mobile search bar */}
          <div className="relative mb-5">
            <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xs px-3.5 py-2.5">
              <Search className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
              <input
                id="search-input-mobile"
                type="text"
                placeholder="Buscar produtos masculinos..."
                value={currentSearch}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full bg-transparent text-sm focus:outline-hidden"
              />
            </div>
            {currentSearch && (
              <div className="absolute left-0 right-0 bg-white border border-gray-100 rounded-b-xs shadow-lg mt-1 z-50 max-h-60 overflow-y-auto">
                {searchSuggestions.map(prod => (
                  <button
                    key={prod.id}
                    onClick={() => {
                      onProductClick(prod);
                      setMobileMenuOpen(false);
                      onSearchChange('');
                    }}
                    className="w-full text-left p-2.5 hover:bg-gray-50 flex items-center gap-3 border-b border-gray-100"
                  >
                    <img src={prod.images[0]} alt={prod.name} referrerPolicy="no-referrer" className="w-8 h-10 object-cover rounded-xs" />
                    <div>
                      <p className="text-xs font-medium text-gray-900 truncate">{prod.name}</p>
                      <p className="text-[11px] font-mono text-gray-600">R$ {prod.price.toFixed(2)}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <ul className="space-y-4">
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => {
                    setActiveTab(item.id as any);
                    setMobileMenuOpen(false);
                    onSearchChange('');
                  }}
                  className={`w-full text-left py-2 text-sm font-mono uppercase tracking-widest block transition-colors ${
                    activeTab === item.id
                      ? 'text-black font-bold border-l-2 border-black pl-3'
                      : 'text-gray-500 hover:text-black pl-3'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              </li>
            ))}
            
            {!isLoggedIn ? (
              <li className="pt-4 border-t border-gray-100">
                <button
                  onClick={() => {
                    setActiveTab('customer');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-center py-3 bg-amber-500 text-black text-xs font-mono font-bold uppercase tracking-widest flex items-center justify-center gap-2 rounded-xs border border-amber-600"
                >
                  <User className="w-4 h-4 text-black" />
                  Cadastrar ou Entrar
                </button>
              </li>
            ) : (
              <li className="pt-4 border-t border-gray-100 flex flex-col gap-2">
                <button
                  onClick={() => {
                    setActiveTab('customer');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left py-2 text-sm font-mono uppercase tracking-widest text-black flex items-center gap-2 pl-3 font-semibold"
                >
                  <User className="w-4 h-4 text-amber-600" />
                  Minha Conta ({userEmail.split('@')[0]})
                </button>
                <button
                  onClick={() => {
                    onLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left py-2 text-sm font-mono uppercase tracking-widest text-red-600 flex items-center gap-2 pl-3"
                >
                  <LogOut className="w-4 h-4" />
                  Sair da Conta
                </button>
              </li>
            )}
          </ul>
        </div>
      )}
    </header>
  );
}
