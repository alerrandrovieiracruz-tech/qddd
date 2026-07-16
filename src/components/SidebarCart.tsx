/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  Ticket, 
  Truck, 
  ArrowRight,
  ShieldCheck,
  Percent
} from 'lucide-react';
import { CartItem, Coupon } from '../types';

interface SidebarCartProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQty: (itemId: string, qty: number) => void;
  onRemoveItem: (itemId: string) => void;
  coupons: Coupon[];
  activeCoupon: Coupon | null;
  onApplyCoupon: (couponCode: string) => boolean; // returns true if success
  onRemoveCoupon: () => void;
  onCheckoutClick: () => void;
}

export default function SidebarCart({
  isOpen,
  onClose,
  cartItems,
  onUpdateQty,
  onRemoveItem,
  coupons,
  activeCoupon,
  onApplyCoupon,
  onRemoveCoupon,
  onCheckoutClick
}: SidebarCartProps) {
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  if (!isOpen) return null;

  // Calculos
  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  
  // Free shipping over R$ 400
  const freeShippingThreshold = 400;
  const shippingCost = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 19.90;
  const progressToFreeShipping = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const remainingForFreeShipping = freeShippingThreshold - subtotal;

  // Coupon Calculation
  let discountAmount = 0;
  if (activeCoupon && subtotal >= activeCoupon.minPurchase) {
    if (activeCoupon.discountType === 'percentage') {
      discountAmount = subtotal * (activeCoupon.value / 100);
    } else {
      discountAmount = activeCoupon.value;
    }
  }

  const grandTotal = Math.max(0, subtotal - discountAmount + shippingCost);

  const handleCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    
    setCouponError('');
    const success = onApplyCoupon(couponInput.trim().toUpperCase());
    if (success) {
      setCouponInput('');
    } else {
      setCouponError('Cupom inválido ou valor mínimo de compra não atingido.');
    }
  };

  return (
    <div id="cart-sidebar-drawer" className="fixed inset-0 z-50 overflow-hidden">
      {/* Semi-transparent backdrop with blur */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity" 
        onClick={onClose} 
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col h-full border-l border-gray-100 animate-in slide-in-from-right duration-300">
          
          {/* Header */}
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-sm font-mono uppercase tracking-[0.25em] text-black font-bold flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-amber-600" /> Seu Carrinho ({cartItems.length})
            </h2>
            <button 
              id="close-cart-btn"
              onClick={onClose}
              className="p-1 rounded-full text-gray-400 hover:text-black hover:bg-gray-50 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Progressive Free Shipping Bar */}
          {subtotal > 0 && (
            <div className="px-6 py-3 bg-gray-50 border-b border-gray-100 space-y-2">
              <div className="flex justify-between text-xs">
                {remainingForFreeShipping > 0 ? (
                  <p className="text-gray-600 font-sans">
                    Faltam <strong className="font-semibold text-black">R$ {remainingForFreeShipping.toFixed(2)}</strong> para <strong className="text-emerald-700 font-semibold">Frete Grátis</strong>
                  </p>
                ) : (
                  <p className="text-emerald-700 font-sans font-semibold flex items-center gap-1.5">
                    <Truck className="w-4 h-4" /> Parabéns! Você ganhou Frete Grátis.
                  </p>
                )}
                <span className="font-mono text-gray-500 text-[10px]">{Math.round(progressToFreeShipping)}%</span>
              </div>
              <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 rounded-full ${
                    remainingForFreeShipping > 0 ? 'bg-amber-500' : 'bg-emerald-600'
                  }`}
                  style={{ width: `${progressToFreeShipping}%` }}
                />
              </div>
            </div>
          )}

          {/* Cart items list scroll */}
          <div className="flex-1 overflow-y-auto py-4 px-6 space-y-4">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center text-gray-300">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-sans font-semibold text-gray-900">Seu carrinho está vazio</p>
                  <p className="text-xs text-gray-400 max-w-xs leading-relaxed">Descubra nossa alfaiataria premium e eleve seu estilo com o que há de mais moderno.</p>
                </div>
                <button
                  onClick={onClose}
                  className="bg-black text-white hover:bg-gray-800 text-xs font-mono py-3 px-6 uppercase tracking-widest transition-colors cursor-pointer"
                >
                  Continuar Navegando
                </button>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {cartItems.map((item) => {
                  const itemColorName = item.product.colorNames?.[item.selectedColor] || item.selectedColor;
                  return (
                    <div key={item.id} className="py-4 first:pt-0 flex gap-4">
                      {/* Photo */}
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        referrerPolicy="no-referrer"
                        className="w-16 h-20 object-cover object-top rounded-xs border border-gray-100 flex-shrink-0"
                      />

                      {/* Info & Quantity controls */}
                      <div className="flex-1 min-w-0 flex flex-col">
                        <div className="flex justify-between items-start gap-1">
                          <h4 className="text-xs font-sans font-medium text-gray-900 line-clamp-2 leading-snug">
                            {item.product.name}
                          </h4>
                          <span className="text-xs font-mono font-bold text-gray-900 ml-2">
                            R$ {(item.product.price * item.quantity).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </span>
                        </div>

                        {/* Badges */}
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          <span className="text-[9px] font-mono uppercase bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-xs flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.selectedColor }} />
                            {itemColorName}
                          </span>
                          <span className="text-[9px] font-mono uppercase bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-xs">
                            Tam: {item.selectedSize}
                          </span>
                        </div>

                        {/* Controls row */}
                        <div className="flex items-center justify-between mt-auto pt-2">
                          <div className="flex items-center border border-gray-200 rounded-xs h-8 bg-white">
                            <button
                              onClick={() => onUpdateQty(item.id, Math.max(1, item.quantity - 1))}
                              className="px-2.5 text-gray-400 hover:text-black h-full flex items-center"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-7 text-center text-xs font-mono font-medium">{item.quantity}</span>
                            <button
                              onClick={() => onUpdateQty(item.id, Math.min(item.product.stock, item.quantity + 1))}
                              className="px-2.5 text-gray-400 hover:text-black h-full flex items-center"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <button
                            onClick={() => onRemoveItem(item.id)}
                            className="p-1.5 text-gray-400 hover:text-red-600 rounded-xs transition-colors"
                            title="Remover Item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer controls & checkout details */}
          {cartItems.length > 0 && (
            <div className="border-t border-gray-100 p-6 bg-gray-50 space-y-4">
              {/* Coupon Form */}
              {activeCoupon ? (
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-xs p-3 flex items-center justify-between text-xs text-amber-900 animate-in fade-in duration-250">
                  <span className="flex items-center gap-1.5 font-mono">
                    <Percent className="w-4 h-4 text-amber-600" />
                    Cupom <strong>{activeCoupon.code}</strong> ativo ({activeCoupon.discountType === 'percentage' ? `-${activeCoupon.value}%` : `-R$ ${activeCoupon.value.toFixed(2)}`})
                  </span>
                  <button 
                    onClick={onRemoveCoupon}
                    className="text-xs font-mono font-bold text-gray-500 hover:text-red-600 underline"
                  >
                    Remover
                  </button>
                </div>
              ) : (
                <form onSubmit={handleCouponSubmit} className="space-y-1.5">
                  <div className="flex gap-2">
                    <input
                      id="coupon-sidebar-input"
                      type="text"
                      placeholder="Cupom (ELEGANCIA10, PREMIUM15)"
                      value={couponInput}
                      onChange={(e) => {
                        setCouponInput(e.target.value);
                        setCouponError('');
                      }}
                      className="flex-1 bg-white border border-gray-200 text-xs font-mono p-2.5 rounded-xs focus:border-black focus:outline-hidden"
                    />
                    <button
                      id="apply-coupon-sidebar-btn"
                      type="submit"
                      className="bg-black hover:bg-gray-800 text-white text-xs font-mono px-4 py-2 rounded-xs uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      Aplicar
                    </button>
                  </div>
                  {couponError && <p className="text-[10px] text-red-600 font-mono pl-1">{couponError}</p>}
                </form>
              )}

              {/* Order total math summary */}
              <div className="space-y-2 border-b border-gray-200 pb-3 text-xs font-sans">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-mono">R$ {subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-amber-700 font-medium">
                    <span>Desconto do Cupom</span>
                    <span className="font-mono">-R$ {discountAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>Envio estimado</span>
                  <span className="font-mono">{shippingCost === 0 ? 'Grátis' : `R$ ${shippingCost.toFixed(2)}`}</span>
                </div>
              </div>

              {/* Grand Total */}
              <div className="flex justify-between items-baseline py-1">
                <span className="text-sm font-sans font-bold text-gray-900">Total do Pedido</span>
                <span className="text-xl font-mono font-extrabold text-black">
                  R$ {grandTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>

              {/* Secure checkout info lock */}
              <div className="text-[10px] text-gray-400 font-sans flex items-center gap-1.5 justify-center py-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Compra protegida por criptografia militar SSL.
              </div>

              {/* Finalize Purchase Button */}
              <button
                id="finalize-purchase-sidebar-btn"
                onClick={onCheckoutClick}
                className="w-full bg-black hover:bg-gray-800 text-white py-4 text-xs font-mono uppercase tracking-[0.2em] font-semibold transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl cursor-pointer"
              >
                Finalizar Compra
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
