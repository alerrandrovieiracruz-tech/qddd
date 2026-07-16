/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Heart, Star, ShoppingCart, Eye, ArrowRight } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  key?: string | number;
  product: Product;
  onProductClick: (product: Product) => void;
  onAddToCart: (product: Product, color: string, size: string) => void;
  onToggleFavorite: (productId: string) => void;
  isFavorite: boolean;
}

export default function ProductCard({
  product,
  onProductClick,
  onAddToCart,
  onToggleFavorite,
  isFavorite
}: ProductCardProps) {
  // Calculate discount percentage
  const discountPercent = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
    : 0;

  return (
    <div 
      id={`product-card-${product.id}`}
      className="group relative flex flex-col bg-white border border-gray-100 hover:border-gray-300 rounded-xs overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1.5"
    >
      {/* Product Image Section */}
      <div className="relative aspect-[3/4] bg-gray-50 overflow-hidden cursor-pointer" onClick={() => onProductClick(product)}>
        {/* Promotional Badge */}
        {discountPercent > 0 && (
          <span className="absolute top-3 left-3 z-20 bg-amber-600 text-white text-[10px] font-mono tracking-wider uppercase font-bold px-2 py-1 rounded-xs">
            -{discountPercent}% OFF
          </span>
        )}

        {/* New Item Badge */}
        {product.isNew && (
          <span className="absolute top-3 right-3 z-20 bg-black text-white text-[10px] font-mono tracking-wider uppercase px-2 py-1 rounded-xs">
            Novo
          </span>
        )}

        {/* Best Seller Badge */}
        {product.isBestSeller && !product.isNew && (
          <span className="absolute top-3 right-3 z-20 bg-gray-800 text-amber-400 text-[10px] font-mono tracking-wider uppercase px-2 py-1 rounded-xs border border-amber-500/20">
            Destaque
          </span>
        )}

        {/* Product Image - Transitions between index 0 and 1 on hover */}
        <img
          src={product.images[0]}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
        />
        {product.images[1] && (
          <img
            src={product.images[1]}
            alt={`${product.name} alternate`}
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover object-top opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out"
          />
        )}

        {/* Favorite overlay button */}
        <button
          id={`favorite-btn-${product.id}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(product.id);
          }}
          className={`absolute top-1/2 -translate-y-1/2 right-3 z-30 p-2.5 rounded-full bg-white/95 hover:bg-black hover:text-white transition-all duration-300 shadow-md ${
            isFavorite ? 'text-red-500 hover:text-red-400' : 'text-gray-400'
          }`}
          title={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
        </button>

        {/* Quick actions hover panel */}
        <div className="absolute inset-x-0 bottom-0 z-30 p-4 bg-gradient-to-t from-black/80 via-black/30 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex items-center justify-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onProductClick(product);
            }}
            className="p-2.5 bg-white text-black hover:bg-amber-500 hover:text-black rounded-xs transition-colors shadow-sm"
            title="Ver Detalhes"
          >
            <Eye className="w-4 h-4" />
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              // Add first color and size as default for quick cart action
              onAddToCart(product, product.colors[0], product.sizes[2] || 'M');
            }}
            className="flex-1 bg-white text-black hover:bg-black hover:text-white py-2.5 text-xs font-mono uppercase tracking-widest rounded-xs transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            Adicionar
          </button>
        </div>
      </div>

      {/* Product Information Section */}
      <div className="p-4 flex-1 flex flex-col">
        {/* Subcategory */}
        <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-amber-600 mb-1 block">
          {product.subcategory}
        </span>

        {/* Name */}
        <h3 
          className="text-sm font-sans font-medium text-gray-900 group-hover:text-amber-700 transition-colors line-clamp-1 cursor-pointer mb-2"
          onClick={() => onProductClick(product)}
        >
          {product.name}
        </h3>

        {/* Ratings & Sold items count */}
        <div className="flex items-center gap-1.5 mb-3 text-xs">
          <div className="flex items-center text-amber-500">
            <Star className="w-3 h-3 fill-current" />
            <span className="ml-1 font-mono font-medium text-gray-800">{product.rating}</span>
          </div>
          <span className="text-gray-300 font-light">•</span>
          <span className="text-gray-500 font-sans text-[11px]">{product.soldCount} vendidos</span>
        </div>

        {/* Price Section */}
        <div className="mt-auto pt-3 border-t border-gray-50 flex items-baseline justify-between flex-wrap gap-1.5">
          <div className="flex items-baseline gap-2">
            <span className="text-base font-mono font-semibold text-black">
              R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
            {product.originalPrice && (
              <span className="text-xs font-mono text-gray-400 line-through">
                R$ {product.originalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            )}
          </div>

          <span className="text-[10px] text-gray-400 font-sans">
            10x de R$ {(product.price / 10).toFixed(2)}
          </span>
        </div>
        
        {/* Out of Stock warning */}
        {product.stock <= 0 && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-xs flex items-center justify-center z-40">
            <span className="bg-black text-white text-xs font-mono uppercase tracking-widest px-4 py-2">
              Esgotado
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
