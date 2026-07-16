/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Star, 
  Minus, 
  Plus, 
  Truck, 
  Ruler, 
  ChevronDown, 
  ChevronUp, 
  Heart, 
  Check, 
  MessageSquare,
  Sparkles,
  HelpCircle,
  ShoppingBag
} from 'lucide-react';
import { Product, Review, FAQ } from '../types';

interface ProductDetailsModalProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product, color: string, size: string, qty: number) => void;
  onToggleFavorite: (productId: string) => void;
  isFavorite: boolean;
  relatedProducts: Product[];
  onRelatedProductClick: (product: Product) => void;
  onBuyNow: (product: Product, color: string, size: string, qty: number) => void;
  onAddReview: (productId: string, review: Omit<Review, 'id' | 'date'>) => void;
}

export default function ProductDetailsModal({
  product,
  onClose,
  onAddToCart,
  onToggleFavorite,
  isFavorite,
  relatedProducts,
  onRelatedProductClick,
  onBuyNow,
  onAddReview
}: ProductDetailsModalProps) {
  const [activeImage, setActiveImage] = useState(product.images[0]);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState(product.sizes[2] || product.sizes[0]);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'medidas' | 'faq'>('desc');
  const [cep, setCep] = useState('');
  const [cepResult, setCepResult] = useState<null | { price: number; days: number; text: string }>(null);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // Review Form State
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  // Zoom Ref and State
  const imgContainerRef = useRef<HTMLDivElement>(null);
  const [zoomStyle, setZoomStyle] = useState<React.CSSProperties>({ display: 'none' });

  // Reset states when product changes
  useEffect(() => {
    setActiveImage(product.images[0]);
    setSelectedColor(product.colors[0]);
    setSelectedSize(product.sizes[2] || product.sizes[0]);
    setQuantity(1);
    setCep('');
    setCepResult(null);
    setExpandedFaq(null);
    setReviewName('');
    setReviewRating(5);
    setReviewComment('');
    setReviewSuccess(false);
  }, [product]);

  // Zoom Mouse Handling
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imgContainerRef.current) return;
    const { left, top, width, height } = imgContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({
      display: 'block',
      backgroundImage: `url(${activeImage})`,
      backgroundPosition: `${x}% ${y}%`,
      backgroundSize: '200%'
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({ display: 'none' });
  };

  const simulateCep = (e: React.FormEvent) => {
    e.preventDefault();
    if (cep.length < 8) return;
    
    // Simple custom simulation based on input
    const regionDigit = parseInt(cep[0]) || 0;
    if (regionDigit % 2 === 0) {
      setCepResult({
        price: 0,
        days: 3,
        text: 'Entrega Expressa Grátis (Sedex)'
      });
    } else {
      setCepResult({
        price: 18.90,
        days: 6,
        text: 'Entrega Padrão (Sartor Carrier)'
      });
    }
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName || !reviewComment) return;
    
    onAddReview(product.id, {
      userName: reviewName,
      rating: reviewRating,
      comment: reviewComment,
      color: selectedColor,
      size: selectedSize
    });

    setReviewSuccess(true);
    setReviewName('');
    setReviewComment('');
    setTimeout(() => setReviewSuccess(false), 4000);
  };

  return (
    <div id="product-details-view" className="bg-white py-6">
      {/* Back breadcrumb banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <button 
          id="back-to-catalog"
          onClick={onClose}
          className="text-xs font-mono uppercase tracking-widest text-gray-500 hover:text-black flex items-center gap-2 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" /> Voltar ao Catálogo
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* LEFT: Multi-photo gallery and zoomable viewer (Lg: 7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="grid grid-cols-12 gap-3">
              {/* Thumbnails vertical rail */}
              <div className="col-span-2 space-y-3">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`w-full aspect-[3/4] bg-gray-50 border rounded-xs overflow-hidden transition-all duration-300 ${
                      activeImage === img ? 'border-black ring-1 ring-black' : 'border-gray-200 hover:border-black'
                    }`}
                  >
                    <img src={img} alt={`Thumb ${idx}`} referrerPolicy="no-referrer" className="w-full h-full object-cover object-top" />
                  </button>
                ))}
              </div>

              {/* Large zoomed view image */}
              <div className="col-span-10">
                <div 
                  ref={imgContainerRef}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                  className="relative aspect-[3/4] bg-gray-50 border border-gray-100 rounded-xs overflow-hidden cursor-zoom-in"
                >
                  <img
                    src={activeImage}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-top transition-transform duration-300"
                  />
                  {/* Glass zoom indicator */}
                  <div 
                    style={zoomStyle} 
                    className="absolute inset-0 pointer-events-none border border-amber-500/10" 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Sophisticated purchase configurations (Lg: 5 cols) */}
          <div className="lg:col-span-5 space-y-6 sm:space-y-8">
            <div className="space-y-3">
              {/* Category pill & Favorites status */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-[0.2em] text-amber-600 font-medium">
                  {product.subcategory}
                </span>
                
                <button
                  id="toggle-fav-detail"
                  onClick={() => onToggleFavorite(product.id)}
                  className={`flex items-center gap-1 text-xs font-mono uppercase tracking-widest transition-colors ${
                    isFavorite ? 'text-red-600 font-medium' : 'text-gray-400 hover:text-black'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                  {isFavorite ? 'Favoritado' : 'Favoritar'}
                </button>
              </div>

              {/* Title name */}
              <h1 className="text-2xl sm:text-3xl font-sans font-bold tracking-tight text-gray-900 leading-tight">
                {product.name}
              </h1>

              {/* Ratings and reviews indicators */}
              <div className="flex items-center gap-2">
                <div className="flex items-center text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating) ? 'fill-current' : 'text-gray-200'
                      }`} 
                    />
                  ))}
                  <span className="ml-1.5 font-mono text-sm font-semibold text-gray-900">{product.rating}</span>
                </div>
                <span className="text-gray-300">|</span>
                <span className="text-xs text-gray-500 font-mono font-medium uppercase tracking-wider">{product.reviews.length} Avaliações</span>
                <span className="text-gray-300">|</span>
                <span className="text-xs text-gray-500">{product.soldCount} comprados</span>
              </div>
            </div>

            {/* Pricing Section */}
            <div className="p-4 bg-gray-50 border border-gray-100 rounded-xs space-y-2">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-mono font-bold text-black">
                  R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
                {product.originalPrice && (
                  <span className="text-sm font-mono text-gray-400 line-through">
                    R$ {product.originalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-600">
                Ou em até <strong className="font-semibold text-black">10x de R$ {(product.price / 10).toFixed(2)}</strong> sem juros no cartão.
              </p>
              <div className="text-[10px] text-amber-700 font-mono flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 animate-spin" /> Ganhe 5% de desconto pagando via PIX à vista.
              </div>
            </div>

            {/* Interactive Color Circles selector */}
            <div className="space-y-3">
              <span className="text-xs font-mono uppercase tracking-wider text-gray-500 block">
                Selecione a Cor: <strong className="text-black font-semibold">{product.colorNames?.[selectedColor] || selectedColor}</strong>
              </span>
              <div className="flex items-center gap-3">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    style={{ backgroundColor: color }}
                    className={`w-9 h-9 rounded-full border-2 transition-all relative flex items-center justify-center ${
                      selectedColor === color ? 'border-amber-500 scale-110 shadow-md' : 'border-gray-200 hover:border-gray-400'
                    }`}
                    title={product.colorNames?.[color] || color}
                  >
                    {selectedColor === color && (
                      <Check className={`w-4 h-4 ${color === '#FFFFFF' || color === '#F5F5F5' ? 'text-black' : 'text-white'}`} />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Sizes boxes selector */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-gray-500">
                  Tamanho: <strong className="text-black font-semibold">{selectedSize}</strong>
                </span>
                <button 
                  onClick={() => setActiveTab('medidas')} 
                  className="text-xs font-mono text-amber-600 hover:text-black underline flex items-center gap-1"
                >
                  Tabela de Medidas
                </button>
              </div>
              <div className="grid grid-cols-6 gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-2.5 text-xs font-mono uppercase border transition-all text-center rounded-xs ${
                      selectedSize === size
                        ? 'border-black bg-black text-white font-bold'
                        : 'border-gray-200 hover:border-black text-gray-700'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity and Actions CTA */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-4">
                {/* Quantity box */}
                <div className="flex items-center border border-gray-200 rounded-xs bg-white h-12">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 text-gray-500 hover:text-black h-full flex items-center"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-12 text-center text-sm font-mono font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="px-4 text-gray-500 hover:text-black h-full flex items-center"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Add to Cart */}
                <button
                  id="add-to-cart-detail"
                  onClick={() => onAddToCart(product, selectedColor, selectedSize, quantity)}
                  className="flex-1 bg-white hover:bg-black text-black hover:text-white border border-black h-12 text-xs font-mono uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Adicionar ao Carrinho
                </button>
              </div>

              {/* Buy now CTA */}
              <button
                id="buy-now-detail"
                onClick={() => onBuyNow(product, selectedColor, selectedSize, quantity)}
                className="w-full bg-amber-500 hover:bg-amber-600 text-black font-semibold h-12 text-xs font-mono uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2"
              >
                Comprar Agora (Checkout Rápido)
              </button>
            </div>

            {/* Shipping Simulator */}
            <div className="border border-gray-100 rounded-xs p-4 bg-gray-50 space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-gray-700">
                <Truck className="w-4 h-4 text-amber-600" />
                Simular Envio e Frete
              </div>
              <form onSubmit={simulateCep} className="flex gap-2">
                <input
                  id="cep-simulator-input"
                  type="text"
                  placeholder="Digite seu CEP (Ex: 01310-100)"
                  value={cep}
                  onChange={(e) => setCep(e.target.value.replace(/\D/g, '').slice(0, 8))}
                  className="flex-1 bg-white border border-gray-200 text-xs font-mono p-2.5 focus:border-black focus:outline-hidden"
                />
                <button
                  id="cep-simulator-btn"
                  type="submit"
                  className="bg-black text-white text-xs font-mono px-4 py-2.5 uppercase tracking-wider hover:bg-gray-800 transition-colors"
                >
                  Simular
                </button>
              </form>
              {cepResult && (
                <div className="text-xs bg-white p-2.5 border border-gray-100 rounded-xs space-y-1">
                  <p className="font-semibold text-gray-900">{cepResult.text}</p>
                  <p className="text-gray-500 font-mono">
                    Valor: {cepResult.price === 0 ? 'Grátis' : `R$ ${cepResult.price.toFixed(2)}`} • Prazo estimado: {cepResult.days} dias úteis
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tab information panel (Description, Measurement Chart, Product FAQs) */}
        <div className="mt-16 border-t border-gray-100 pt-8">
          <div className="flex border-b border-gray-100 gap-8">
            <button
              onClick={() => setActiveTab('desc')}
              className={`pb-4 text-xs font-mono uppercase tracking-widest border-b-2 transition-all ${
                activeTab === 'desc' ? 'border-black text-black font-bold' : 'border-transparent text-gray-400 hover:text-black'
              }`}
            >
              Descrição Detalhada
            </button>
            
            <button
              onClick={() => setActiveTab('medidas')}
              className={`pb-4 text-xs font-mono uppercase tracking-widest border-b-2 transition-all ${
                activeTab === 'medidas' ? 'border-black text-black font-bold' : 'border-transparent text-gray-400 hover:text-black'
              }`}
            >
              Tabela de Medidas
            </button>

            <button
              onClick={() => setActiveTab('faq')}
              className={`pb-4 text-xs font-mono uppercase tracking-widest border-b-2 transition-all ${
                activeTab === 'faq' ? 'border-black text-black font-bold' : 'border-transparent text-gray-400 hover:text-black'
              }`}
            >
              Dúvidas do Produto ({product.faqs.length})
            </button>
          </div>

          <div className="py-6 min-h-40">
            {activeTab === 'desc' && (
              <div className="prose max-w-4xl text-sm text-gray-600 leading-relaxed space-y-4 font-sans">
                <p>{product.description}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-50 text-xs">
                  <div>
                    <strong className="text-gray-900 block font-mono uppercase tracking-wider mb-1">Especificações Técnicas</strong>
                    <ul className="list-disc pl-4 space-y-1">
                      <li>Modelagem: Confortável e estruturada com corte sartorial</li>
                      <li>Composição: Tecido nobre selecionado</li>
                      <li>Costuras: Invisíveis reforçadas com fio de alta tenacidade</li>
                      <li>Origem: Fabricado sob padrões artesanais rígidos</li>
                    </ul>
                  </div>
                  <div>
                    <strong className="text-gray-900 block font-mono uppercase tracking-wider mb-1">Garantia e Autenticidade</strong>
                    <p>Cada peça da Sarto Imperial é acompanhada de certificado de autenticidade têxtil. Garantia de 90 dias contra defeitos latentes de manufatura.</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'medidas' && (
              <div className="max-w-xl space-y-4">
                <p className="text-xs text-gray-500">As dimensões são aproximadas em centímetros e servem para garantir um ajuste confortável e elegante.</p>
                <div className="border border-gray-200 overflow-hidden rounded-xs">
                  {product.category === 'Camisas' ? (
                    <table className="w-full text-left border-collapse text-xs font-mono">
                      <thead>
                        <tr className="bg-gray-100 text-gray-700">
                          <th className="p-3 border-b border-gray-200">Tamanho</th>
                          <th className="p-3 border-b border-gray-200">Colarinho</th>
                          <th className="p-3 border-b border-gray-200">Tórax</th>
                          <th className="p-3 border-b border-gray-200">Manga</th>
                          <th className="p-3 border-b border-gray-200">Comprimento</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 text-gray-600">
                        <tr><td className="p-3 font-semibold text-black">PP</td><td className="p-3">37 cm</td><td className="p-3">94 cm</td><td className="p-3">61 cm</td><td className="p-3">72 cm</td></tr>
                        <tr><td className="p-3 font-semibold text-black">P</td><td className="p-3">39 cm</td><td className="p-3">100 cm</td><td className="p-3">63 cm</td><td className="p-3">74 cm</td></tr>
                        <tr><td className="p-3 font-semibold text-black">M</td><td className="p-3">41 cm</td><td className="p-3">106 cm</td><td className="p-3">65 cm</td><td className="p-3">76 cm</td></tr>
                        <tr><td className="p-3 font-semibold text-black">G</td><td className="p-3">43 cm</td><td className="p-3">112 cm</td><td className="p-3">67 cm</td><td className="p-3">78 cm</td></tr>
                        <tr><td className="p-3 font-semibold text-black">GG</td><td className="p-3">45 cm</td><td className="p-3">118 cm</td><td className="p-3">69 cm</td><td className="p-3">80 cm</td></tr>
                        <tr><td className="p-3 font-semibold text-black">XG</td><td className="p-3">47 cm</td><td className="p-3">124 cm</td><td className="p-3">71 cm</td><td className="p-3">82 cm</td></tr>
                      </tbody>
                    </table>
                  ) : (
                    <table className="w-full text-left border-collapse text-xs font-mono">
                      <thead>
                        <tr className="bg-gray-100 text-gray-700">
                          <th className="p-3 border-b border-gray-200">Tamanho</th>
                          <th className="p-3 border-b border-gray-200">Cintura</th>
                          <th className="p-3 border-b border-gray-200">Quadril</th>
                          <th className="p-3 border-b border-gray-200">Gancho</th>
                          <th className="p-3 border-b border-gray-200">Comprimento</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 text-gray-600">
                        <tr><td className="p-3 font-semibold text-black">38</td><td className="p-3">78 cm</td><td className="p-3">96 cm</td><td className="p-3">25 cm</td><td className="p-3">102 cm</td></tr>
                        <tr><td className="p-3 font-semibold text-black">40</td><td className="p-3">82 cm</td><td className="p-3">100 cm</td><td className="p-3">26 cm</td><td className="p-3">103 cm</td></tr>
                        <tr><td className="p-3 font-semibold text-black">42</td><td className="p-3">86 cm</td><td className="p-3">104 cm</td><td className="p-3">27 cm</td><td className="p-3">104 cm</td></tr>
                        <tr><td className="p-3 font-semibold text-black">44</td><td className="p-3">90 cm</td><td className="p-3">108 cm</td><td className="p-3">28 cm</td><td className="p-3">105 cm</td></tr>
                        <tr><td className="p-3 font-semibold text-black">46</td><td className="p-3">94 cm</td><td className="p-3">112 cm</td><td className="p-3">29 cm</td><td className="p-3">106 cm</td></tr>
                        <tr><td className="p-3 font-semibold text-black">48</td><td className="p-3">98 cm</td><td className="p-3">116 cm</td><td className="p-3">30 cm</td><td className="p-3">107 cm</td></tr>
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'faq' && (
              <div className="max-w-3xl divide-y divide-gray-100">
                {product.faqs.map((faq, idx) => (
                  <div key={idx} className="py-4">
                    <button
                      onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                      className="w-full flex justify-between items-center text-left py-2 font-sans font-medium text-sm text-gray-900 focus:outline-hidden"
                    >
                      <span className="flex items-center gap-2">
                        <HelpCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                        {faq.question}
                      </span>
                      {expandedFaq === idx ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                    </button>
                    {expandedFaq === idx && (
                      <p className="mt-2 pl-6 text-sm text-gray-600 leading-relaxed font-sans animate-in fade-in slide-in-from-top-1 duration-250">
                        {faq.answer}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Customer Reviews List & Form to Add New Review */}
        <div className="mt-12 border-t border-gray-100 pt-12 space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            
            {/* Reviews list */}
            <div className="lg:col-span-7 space-y-6">
              <h3 className="text-lg font-sans font-semibold text-gray-900 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-amber-600" /> Avaliações verificadas de compradores ({product.reviews.length})
              </h3>
              
              <div className="divide-y divide-gray-100 space-y-6">
                {product.reviews.map((rev) => (
                  <div key={rev.id} className="pt-6 first:pt-0 space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-sans font-semibold text-gray-900">{rev.userName}</p>
                      <p className="text-xs font-mono text-gray-400">{new Date(rev.date).toLocaleDateString('pt-BR')}</p>
                    </div>
                    
                    <div className="flex items-center gap-1.5 text-xs text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-current' : 'text-gray-200'}`} />
                      ))}
                      <span className="text-gray-400 font-mono text-[10px] ml-2">Tamanho comprado: {rev.size}</span>
                    </div>

                    <p className="text-sm text-gray-600 font-sans leading-relaxed">{rev.comment}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Write a review form */}
            <div className="lg:col-span-5 bg-gray-50 border border-gray-100 rounded-xs p-6 h-fit space-y-4">
              <h4 className="text-sm font-mono uppercase tracking-wider text-black font-semibold">Deixe sua Avaliação</h4>
              <p className="text-xs text-gray-500">Sua opinião é de extrema relevância para mantermos a excelência das peças.</p>
              
              {reviewSuccess ? (
                <div className="bg-emerald-50 text-emerald-800 p-4 rounded-xs text-xs font-medium space-y-1 border border-emerald-100">
                  <p>Obrigado! Sua avaliação foi cadastrada com sucesso.</p>
                  <p className="text-emerald-600 font-light">Ela já se encontra visível na listagem de avaliações.</p>
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div>
                    <label className="text-xs font-mono text-gray-600 uppercase tracking-wider block mb-1">Seu Nome Completo</label>
                    <input
                      id="review-name-input"
                      type="text"
                      required
                      placeholder="Ex: Carlos Albuquerque"
                      value={reviewName}
                      onChange={(e) => setReviewName(e.target.value)}
                      className="w-full bg-white border border-gray-200 text-xs p-2.5 focus:border-black focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono text-gray-600 uppercase tracking-wider block mb-1.5">Sua Nota (1 a 5 Estrelas)</label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewRating(star)}
                          className="text-amber-500 focus:outline-hidden hover:scale-110 transition-transform"
                        >
                          <Star className={`w-6 h-6 ${star <= reviewRating ? 'fill-current' : 'text-gray-200'}`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-mono text-gray-600 uppercase tracking-wider block mb-1">Seu Comentário</label>
                    <textarea
                      id="review-comment-textarea"
                      required
                      rows={3}
                      placeholder="Descreva detalhes como qualidade do tecido, caimento, costuras, etc..."
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      className="w-full bg-white border border-gray-200 text-xs p-2.5 focus:border-black focus:outline-hidden"
                    />
                  </div>

                  <button
                    id="submit-review-btn"
                    type="submit"
                    className="w-full bg-black hover:bg-gray-800 text-white text-xs font-mono py-3 uppercase tracking-widest transition-colors"
                  >
                    Enviar Avaliação
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>

        {/* Related products showcase section */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 border-t border-gray-100 pt-16">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-8 gap-2">
              <h3 className="text-lg font-sans font-bold text-gray-900 tracking-tight uppercase">Peças Relacionadas Recomendadas</h3>
              <span className="text-xs font-mono text-amber-600 uppercase tracking-wider font-semibold">Combinações impecáveis para o seu estilo</span>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((relProd) => (
                <div 
                  key={relProd.id}
                  onClick={() => onRelatedProductClick(relProd)}
                  className="group relative cursor-pointer border border-gray-50 hover:border-gray-200 rounded-xs overflow-hidden transition-all duration-300 p-2 bg-white flex flex-col"
                >
                  <div className="aspect-[3/4] bg-gray-50 overflow-hidden rounded-xs mb-3">
                    <img 
                      src={relProd.images[0]} 
                      alt={relProd.name} 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-103" 
                    />
                  </div>
                  <span className="text-[9px] font-mono uppercase text-gray-400 mb-0.5">{relProd.subcategory}</span>
                  <h4 className="text-xs font-medium text-gray-900 truncate group-hover:text-amber-700 transition-colors">{relProd.name}</h4>
                  <p className="text-xs font-mono font-bold mt-1 text-black">R$ {relProd.price.toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
