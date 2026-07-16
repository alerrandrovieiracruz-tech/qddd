/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Store, 
  Plus, 
  Trash2, 
  Edit, 
  Package, 
  ShoppingBag, 
  DollarSign, 
  User, 
  Check, 
  CheckCircle, 
  AlertCircle, 
  AlertTriangle,
  ArrowUpRight, 
  Wallet, 
  CreditCard, 
  Sparkles,
  Info,
  ChevronRight,
  TrendingUp,
  Award,
  Layers,
  Ruler,
  Upload,
  X,
  Image as ImageIcon
} from 'lucide-react';
import { Product, Order } from '../types';

interface SellerPanelProps {
  products: Product[];
  orders: Order[];
  onAddProduct: (prod: Product) => void;
  onUpdateProduct: (prod: Product) => void;
  onDeleteProduct: (id: string) => void;
  userEmail: string;
}

interface SellerProfile {
  storeName: string;
  fullName: string;
  email: string;
  phone: string;
  bio: string;
  joinedAt: string;
}

export default function SellerPanel({
  products,
  orders,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  userEmail
}: SellerPanelProps) {
  // --- SELLER ONBOARDING & SESSION STATE ---
  const [sellerProfile, setSellerProfile] = useState<SellerProfile | null>(() => {
    const saved = localStorage.getItem('sarto_seller_profile');
    if (saved) return JSON.parse(saved);
    
    // Check if the user is already logged in as "admin" to auto-fill or create a premium mock seller
    if (userEmail) {
      return {
        storeName: "Sarto Sartoria",
        fullName: "Roberto Alencar (Sarto)",
        email: userEmail,
        phone: "(11) 99888-7766",
        bio: "Coleção autoral de alfaiataria clássica inspirada na sofisticação milanesa.",
        joinedAt: new Date().toLocaleDateString('pt-BR')
      };
    }
    return null;
  });

  // Onboarding Form States
  const [onboardStoreName, setOnboardStoreName] = useState('');
  const [onboardFullName, setOnboardFullName] = useState('');
  const [onboardPhone, setOnboardPhone] = useState('(11) ');
  const [onboardBio, setOnboardBio] = useState('Estilista independente focado em roupas premium.');
  const [onboardError, setOnboardError] = useState('');

  // Seller Dashboard Subtabs
  const [activeSubTab, setActiveSubTab] = useState<'dash' | 'products' | 'add-product' | 'orders' | 'finances'>('dash');

  // New Product Form States
  const [editingProd, setEditingProd] = useState<Product | null>(null);
  const [prodName, setProdName] = useState('');
  const [prodDesc, setProdDesc] = useState('');
  const [prodPrice, setProdPrice] = useState(389.90);
  const [prodOrigPrice, setProdOrigPrice] = useState<number | undefined>(undefined);
  const [prodCategory, setProdCategory] = useState<'Camisas' | 'Calças'>('Camisas');
  const [prodSubcategory, setProdSubcategory] = useState<Product['subcategory']>('Camisas Slim');
  const [prodColors, setProdColors] = useState<string[]>(['#FFFFFF', '#1E3A8A']);
  const [prodSizes, setProdSizes] = useState<string[]>(['P', 'M', 'G', 'GG']);
  const [prodStock, setProdStock] = useState(15);
  const [prodImages, setProdImages] = useState<string[]>([]);
  const [customImgUrl, setCustomImgUrl] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  // Finances States
  const [withdrawals, setWithdrawals] = useState<any[]>(() => {
    const saved = localStorage.getItem('sarto_seller_withdrawals');
    return saved ? JSON.parse(saved) : [
      { id: 'w_1', amount: 1500.00, date: '10/07/2026', status: 'Pago', method: 'PIX' }
    ];
  });
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawSuccess, setWithdrawSuccess] = useState('');
  const [withdrawError, setWithdrawError] = useState('');

  // Deletion and Action confirmations
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isConfirmClearImagesOpen, setIsConfirmClearImagesOpen] = useState(false);

  // Save Profile to LocalStorage when set
  const handleOnboardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onboardStoreName.trim() || !onboardFullName.trim()) {
      setOnboardError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    
    const profile: SellerProfile = {
      storeName: onboardStoreName.trim(),
      fullName: onboardFullName.trim(),
      email: userEmail || 'vendedor@sartoimperial.com',
      phone: onboardPhone.trim(),
      bio: onboardBio.trim(),
      joinedAt: new Date().toLocaleDateString('pt-BR')
    };

    setSellerProfile(profile);
    localStorage.setItem('sarto_seller_profile', JSON.stringify(profile));
    setOnboardError('');
    setActiveSubTab('dash');
  };

  // Preset Premium Fashion Images (To help seller register easily)
  const premiumImagePresets = {
    Camisas: [
      { url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&auto=format&fit=crop&q=80', label: 'Camisa Slim Branca' },
      { url: 'https://images.unsplash.com/photo-1620012253295-c05518e993be?w=600&auto=format&fit=crop&q=80', label: 'Camisa Alfaiataria Azul' },
      { url: 'https://images.unsplash.com/photo-1603252109303-2751441dd157?w=600&auto=format&fit=crop&q=80', label: 'Camisa Premium Cinza' },
      { url: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=600&auto=format&fit=crop&q=80', label: 'Camisa Algodão Preto' },
    ],
    Calças: [
      { url: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&auto=format&fit=crop&q=80', label: 'Calça Alfaiataria Carbono' },
      { url: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&auto=format&fit=crop&q=80', label: 'Calça Slim Khaki' },
      { url: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&auto=format&fit=crop&q=80', label: 'Calça Social Marinho' },
      { url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&auto=format&fit=crop&q=80', label: 'Calça Clássica Preta' }
    ]
  };

  // Set default image when changing category
  useEffect(() => {
    if (prodImages.length === 0 && premiumImagePresets[prodCategory]) {
      setProdImages([premiumImagePresets[prodCategory][0].url]);
    }
  }, [prodCategory]);

  // Filter products by this specific Seller
  const storeName = sellerProfile?.storeName || '';
  const sellerProducts = products.filter(p => p.sellerName === storeName);

  // Filter orders containing products from this Seller
  const sellerOrders = orders.filter(order => 
    order.items.some(item => {
      const prod = products.find(p => p.id === item.productId);
      return prod && prod.sellerName === storeName;
    })
  );

  // Calculations for this Seller
  const totalSalesOfSellerProducts = sellerOrders.reduce((acc, order) => {
    // Sum only the items that belong to this seller
    const sellerItemsTotal = order.items.reduce((sum, item) => {
      const prod = products.find(p => p.id === item.productId);
      if (prod && prod.sellerName === storeName) {
        return sum + (item.price * item.quantity);
      }
      return sum;
    }, 0);
    return order.status !== 'Cancelado' ? acc + sellerItemsTotal : acc;
  }, 0);

  // Financial Balance (e.g. 15% commission rate, the rest 85% goes to the seller!)
  const sellerRate = 0.85; 
  const grossEarnings = totalSalesOfSellerProducts * sellerRate;
  const totalWithdrawn = withdrawals.filter(w => w.status === 'Pago').reduce((sum, w) => sum + w.amount, 0);
  const pendingEarnings = sellerOrders
    .filter(o => o.status === 'Pendente' || o.status === 'Processando')
    .reduce((acc, order) => {
      const sellerItemsTotal = order.items.reduce((sum, item) => {
        const prod = products.find(p => p.id === item.productId);
        if (prod && prod.sellerName === storeName) {
          return sum + (item.price * item.quantity);
        }
        return sum;
      }, 0);
      return acc + (sellerItemsTotal * sellerRate);
    }, 0);

  const availableEarnings = Math.max(0, grossEarnings - totalWithdrawn - pendingEarnings);

  const handleAddCustomImage = (url: string) => {
    if (!url.trim()) return;
    setProdImages(prev => [...prev, url.trim()]);
    setCustomImgUrl('');
  };

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;
    Array.from(files).forEach(file => {
      if (!file.type.startsWith('image/')) {
        alert('Por favor, envie apenas arquivos de imagem.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          const resultStr = e.target.result as string;
          setProdImages(prev => [...prev, resultStr]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // Form submit handler to Create or Update Product
  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName.trim()) return;

    const finalImages = prodImages.length > 0 ? prodImages : [premiumImagePresets[prodCategory][0].url];

    if (editingProd) {
      onUpdateProduct({
        ...editingProd,
        name: prodName.trim(),
        description: prodDesc.trim(),
        price: prodPrice,
        originalPrice: prodOrigPrice,
        category: prodCategory,
        subcategory: prodSubcategory,
        colors: prodColors,
        sizes: prodSizes,
        stock: prodStock,
        images: finalImages,
        sellerName: storeName
      });
      setFormSuccess('Produto atualizado com sucesso!');
    } else {
      onAddProduct({
        id: `seller_${Date.now()}`,
        name: prodName.trim(),
        description: prodDesc.trim(),
        category: prodCategory,
        subcategory: prodSubcategory,
        price: prodPrice,
        originalPrice: prodOrigPrice,
        rating: 5.0,
        soldCount: 0,
        images: finalImages,
        colors: prodColors,
        sizes: prodSizes,
        stock: prodStock,
        reviews: [],
        faqs: [
          { id: `faq_${Date.now()}_1`, question: "Qual a garantia do tecido?", answer: "Garantia vitalícia contra defeitos de costura." },
          { id: `faq_${Date.now()}_2`, question: "Como selecionar o caimento correto?", answer: "Recomendamos conferir as medidas exatas em nosso atendimento do WhatsApp." }
        ],
        isNew: true,
        sellerName: storeName
      });
      setFormSuccess('Produto cadastrado e colocado à venda com sucesso!');
    }

    // Reset Form
    setTimeout(() => {
      setFormSuccess('');
      setEditingProd(null);
      setProdName('');
      setProdDesc('Peça premium com modelagem contemporânea e caimento perfeito.');
      setProdPrice(299.90);
      setProdOrigPrice(undefined);
      setProdStock(10);
      setProdImages([]);
      setCustomImgUrl('');
      setActiveSubTab('products');
    }, 1500);
  };

  const startEditProduct = (prod: Product) => {
    setEditingProd(prod);
    setProdName(prod.name);
    setProdDesc(prod.description);
    setProdPrice(prod.price);
    setProdOrigPrice(prod.originalPrice);
    setProdCategory(prod.category);
    setProdSubcategory(prod.subcategory);
    setProdColors(prod.colors);
    setProdSizes(prod.sizes);
    setProdStock(prod.stock);
    setProdImages(prod.images || [prod.images[0]]);
    setCustomImgUrl('');
    setActiveSubTab('add-product');
  };

  const handleWithdrawRequest = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(withdrawAmount);
    
    if (isNaN(amount) || amount <= 0) {
      setWithdrawError('Valor inválido para o saque.');
      return;
    }

    if (amount > availableEarnings) {
      setWithdrawError('Saldo disponível insuficiente para este valor.');
      return;
    }

    const newWithdrawal = {
      id: `w_${Date.now()}`,
      amount: amount,
      date: new Date().toLocaleDateString('pt-BR'),
      status: 'Processando',
      method: 'PIX'
    };

    const updated = [newWithdrawal, ...withdrawals];
    setWithdrawals(updated);
    localStorage.setItem('sarto_seller_withdrawals', JSON.stringify(updated));
    
    setWithdrawAmount('');
    setWithdrawError('');
    setWithdrawSuccess('Sua solicitação de saque via PIX foi enviada com sucesso e será processada em até 24h.');

    setTimeout(() => {
      setWithdrawSuccess('');
    }, 4000);
  };

  // Color picker helper
  const availableColors = [
    { hex: "#FFFFFF", name: "Branco" },
    { hex: "#000000", name: "Preto" },
    { hex: "#F5F5F5", name: "Off-White" },
    { hex: "#333333", name: "Carbono" },
    { hex: "#1E3A8A", name: "Marinho" },
    { hex: "#1B4332", name: "Verde" },
    { hex: "#C5A880", name: "Bege" },
    { hex: "#78350F", name: "Marrom" },
    { hex: "#4A0E17", name: "Vinho" }
  ];

  // Render Onboarding Screen if profile not set
  if (!sellerProfile) {
    return (
      <div id="seller-onboarding" className="max-w-3xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="bg-white border border-gray-100 p-8 sm:p-12 rounded-xs shadow-xl space-y-8 relative overflow-hidden">
          {/* Visual premium corner accent */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-amber-500/10 to-transparent pointer-events-none" />
          
          <div className="text-center space-y-3">
            <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto text-amber-600 mb-2">
              <Store className="w-8 h-8" />
            </div>
            <span className="text-[10px] font-mono tracking-[0.3em] text-amber-600 block uppercase font-bold">Programa de Parceiros Sarto</span>
            <h1 className="text-3xl font-sans font-extrabold tracking-tight text-gray-900">Abra sua Loja na Sarto Imperial</h1>
            <p className="text-sm text-gray-500 max-w-lg mx-auto">
              Venda suas criações de camisaria e calças premium diretamente para nosso público selecionado. Faturamento facilitado com taxas de conveniência mínimas.
            </p>
          </div>

          <form onSubmit={handleOnboardSubmit} className="space-y-6 text-xs font-sans border-t border-gray-50 pt-8">
            {onboardError && (
              <div className="bg-rose-50 border border-rose-100 text-rose-700 p-4 rounded-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
                <span>{onboardError}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="text-[10px] font-mono text-gray-500 uppercase tracking-wider block mb-1.5 font-bold">Nome da Loja / Estúdio *</label>
                <input
                  id="onboard-store-name"
                  type="text"
                  required
                  placeholder="Ex: Sarto Sartoria, Alfaiataria Alencar"
                  value={onboardStoreName}
                  onChange={(e) => setOnboardStoreName(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 p-3 text-sm focus:bg-white focus:border-black focus:outline-hidden rounded-xs"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono text-gray-500 uppercase tracking-wider block mb-1.5 font-bold">Nome Completo do Estilista *</label>
                <input
                  id="onboard-full-name"
                  type="text"
                  required
                  placeholder="Ex: Roberto de Alencar"
                  value={onboardFullName}
                  onChange={(e) => setOnboardFullName(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 p-3 text-sm focus:bg-white focus:border-black focus:outline-hidden rounded-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="text-[10px] font-mono text-gray-500 uppercase tracking-wider block mb-1.5 font-bold">E-mail de Contato Comercial</label>
                <input
                  id="onboard-email"
                  type="email"
                  disabled
                  value={userEmail || 'Conectado via conta principal'}
                  className="w-full bg-gray-100 border border-gray-200 p-3 text-sm text-gray-500 cursor-not-allowed rounded-xs"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono text-gray-500 uppercase tracking-wider block mb-1.5 font-bold">Telefone / WhatsApp Comercial</label>
                <input
                  id="onboard-phone"
                  type="text"
                  placeholder="(11) 99888-7766"
                  value={onboardPhone}
                  onChange={(e) => setOnboardPhone(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 p-3 text-sm focus:bg-white focus:border-black focus:outline-hidden rounded-xs"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-mono text-gray-500 uppercase tracking-wider block mb-1.5 font-bold">Biografia / Conceito da Marca</label>
              <textarea
                id="onboard-bio"
                rows={3}
                placeholder="Fale brevemente sobre o estilo, materiais nobres e visão de alfaiataria de sua marca..."
                value={onboardBio}
                onChange={(e) => setOnboardBio(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 p-3 text-sm focus:bg-white focus:border-black focus:outline-hidden rounded-xs"
              />
            </div>

            <div className="bg-amber-50 border border-amber-100 p-4 rounded-xs space-y-2 text-[11px] text-amber-800">
              <p className="font-bold flex items-center gap-1">
                <Sparkles className="w-4 h-4" /> Benefícios do Vendedor Parceiro:
              </p>
              <ul className="list-disc list-inside space-y-1 text-amber-700">
                <li>Taxa fixa de comissão reduzida de 15% sobre vendas concluídas.</li>
                <li>Hospedagem de produtos e processamento de pagamentos 100% integrados.</li>
                <li>Saques rápidos via Pix disponíveis 48 horas após a confirmação de envio do produto.</li>
              </ul>
            </div>

            <button
              id="onboard-submit-btn"
              type="submit"
              className="w-full bg-black hover:bg-gray-800 text-white font-mono text-xs py-4 px-6 uppercase tracking-widest font-semibold transition-all duration-300 shadow-lg cursor-pointer flex items-center justify-center gap-2"
            >
              Ativar Minha Loja de Vendedor <ChevronRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div id="seller-panel-container" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      
      {/* Seller Header Profile bar */}
      <div className="bg-black text-white p-6 sm:p-8 rounded-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl relative overflow-hidden">
        {/* Abstract design elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-amber-500/10 to-transparent pointer-events-none" />
        
        <div className="space-y-2 flex-1">
          <div className="flex items-center gap-2">
            <span className="bg-amber-500 text-black text-[9px] font-mono font-bold px-2 py-0.5 uppercase tracking-widest rounded-xs">Vendedor Ativo</span>
            <span className="text-gray-400 text-xs font-mono">ID: {sellerProfile.storeName.toLowerCase().replace(/\s+/g, '_')}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-sans font-bold tracking-tight">{sellerProfile.storeName}</h1>
          <p className="text-gray-400 text-xs max-w-xl font-light italic">"{sellerProfile.bio}"</p>
          <div className="flex flex-wrap gap-x-6 gap-y-1 text-[11px] font-mono text-gray-400 pt-1">
            <span>Responsável: <strong className="text-white">{sellerProfile.fullName}</strong></span>
            <span>Desde: <strong className="text-white">{sellerProfile.joinedAt}</strong></span>
            <span>Fone: <strong className="text-white">{sellerProfile.phone}</strong></span>
          </div>
        </div>

        {/* Action Triggers */}
        <div className="flex flex-wrap gap-2 shrink-0">
          <button
            onClick={() => {
              setEditingProd(null);
              setProdName('');
              setProdDesc('Peça premium com modelagem contemporânea e caimento perfeito de alta costura.');
              setProdPrice(289.90);
              setProdOrigPrice(undefined);
              setProdStock(10);
              setProdImages([]);
              setCustomImgUrl('');
              setActiveSubTab('add-product');
            }}
            className="bg-amber-500 hover:bg-amber-600 text-black font-mono text-xs px-4 py-3 uppercase tracking-wider flex items-center gap-1.5 font-bold transition-all"
          >
            <Plus className="w-4 h-4 stroke-[3px]" /> Anunciar Produto
          </button>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="flex border-b border-gray-100 overflow-x-auto gap-1 sm:gap-4 no-scrollbar">
        {[
          { id: 'dash', label: 'Painel Geral', icon: <TrendingUp className="w-4 h-4" /> },
          { id: 'products', label: 'Meus Produtos', icon: <Package className="w-4 h-4" /> },
          { id: 'add-product', label: editingProd ? 'Editar Anúncio' : 'Novo Anúncio', icon: <Plus className="w-4 h-4" /> },
          { id: 'orders', label: 'Pedidos / Vendas', icon: <ShoppingBag className="w-4 h-4" /> },
          { id: 'finances', label: 'Extrato / Saques', icon: <Wallet className="w-4 h-4" /> }
        ].map((sub) => (
          <button
            key={sub.id}
            onClick={() => {
              setActiveSubTab(sub.id as any);
              if (sub.id !== 'add-product') {
                setEditingProd(null);
              }
            }}
            className={`py-3.5 px-4 text-xs font-mono uppercase tracking-wider border-b-2 flex items-center gap-2 shrink-0 transition-all ${
              activeSubTab === sub.id
                ? 'border-black text-black font-semibold bg-gray-50'
                : 'border-transparent text-gray-500 hover:text-black hover:bg-gray-50/50'
            }`}
          >
            {sub.icon}
            {sub.label}
          </button>
        ))}
      </div>

      {/* SUBTAB 1: DASHBOARD METRICS */}
      {activeSubTab === 'dash' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Quick numbers cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="bg-white border border-gray-100 p-5 rounded-xs flex items-center justify-between shadow-xs">
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block font-bold">Faturamento Total</span>
                <p className="text-xl sm:text-2xl font-mono font-bold text-black">
                  R$ {totalSalesOfSellerProducts.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
                <span className="text-[10px] text-gray-400 font-mono">Bruto sem descontos</span>
              </div>
              <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
                <DollarSign className="w-5 h-5 text-amber-600" />
              </div>
            </div>

            <div className="bg-white border border-gray-100 p-5 rounded-xs flex items-center justify-between shadow-xs">
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block font-bold">Saldo Disponível</span>
                <p className="text-xl sm:text-2xl font-mono font-bold text-amber-600">
                  R$ {availableEarnings.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
                <span className="text-[10px] text-emerald-600 font-mono font-medium flex items-center gap-1">
                  Pronto para saque via Pix
                </span>
              </div>
              <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center shrink-0">
                <Wallet className="w-5 h-5 text-black" />
              </div>
            </div>

            <div className="bg-white border border-gray-100 p-5 rounded-xs flex items-center justify-between shadow-xs">
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block font-bold">Peças Anunciadas</span>
                <p className="text-xl sm:text-2xl font-mono font-bold text-black">{sellerProducts.length}</p>
                <span className="text-[10px] text-gray-400 font-mono">Em exposição na loja</span>
              </div>
              <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
                <Package className="w-5 h-5 text-gray-700" />
              </div>
            </div>

            <div className="bg-white border border-gray-100 p-5 rounded-xs flex items-center justify-between shadow-xs">
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block font-bold">Pedidos Efetuados</span>
                <p className="text-xl sm:text-2xl font-mono font-bold text-black">{sellerOrders.length}</p>
                <span className="text-[10px] text-gray-400 font-mono">Vendas com suas roupas</span>
              </div>
              <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
                <ShoppingBag className="w-5 h-5 text-gray-700" />
              </div>
            </div>

          </div>

          {/* Quick Tutorial & Action Area */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 bg-gray-50 border border-gray-100 p-6 rounded-xs space-y-4">
              <h3 className="text-sm font-mono uppercase tracking-widest text-black font-semibold flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-600" /> Diretrizes de Qualidade Sarto Imperial
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed font-sans">
                Para manter o selo de autenticidade da Sarto Imperial, todos os produtos de vendedores cadastrados devem seguir critérios rígidos de manufatura alfaiataria. Peças de tecidos nobres (como algodão egípcio, linho puro, e lã fria) têm prioridade nos algoritmos de destaque.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-[11px] font-sans">
                <div className="flex gap-2.5 items-start">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-gray-900 block">Fotos Profissionais</strong>
                    <p className="text-gray-500">Mantenha imagens em fundos neutros ou editoriais luxuosos.</p>
                  </div>
                </div>
                <div className="flex gap-2.5 items-start">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-gray-900 block">Envio Ágil</strong>
                    <p className="text-gray-500">Despache os pedidos em até 24 horas úteis para melhor pontuação.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-100 p-6 rounded-xs flex flex-col justify-between shadow-xs">
              <div className="space-y-2">
                <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block font-bold">Próxima Venda</span>
                <p className="text-sm font-sans font-semibold text-gray-800">Dica do Algoritmo</p>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Camisas Slim na cor Off-White e calças Alfaiataria Bege estão com busca em alta de 42% neste trimestre. Considere fabricar e anunciar esses modelos!
                </p>
              </div>

              <button
                onClick={() => {
                  setProdCategory('Camisas');
                  setProdSubcategory('Camisas Slim');
                  setProdColors(['#F5F5F5', '#C5A880']);
                  setProdName('Camisa Premium Linho Off-White');
                  setProdPrice(329.90);
                  setActiveSubTab('add-product');
                }}
                className="mt-4 text-amber-700 hover:text-black font-mono text-[10px] uppercase tracking-wider flex items-center gap-1"
              >
                Anunciar Sugestão <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: LISTING SELLER PRODUCTS */}
      {activeSubTab === 'products' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="flex items-center justify-between border-b border-gray-50 pb-3">
            <h3 className="text-sm font-mono uppercase tracking-widest text-black font-semibold">
              Meus Produtos Anunciados ({sellerProducts.length})
            </h3>
          </div>

          {sellerProducts.length > 0 ? (
            <div className="bg-white border border-gray-100 rounded-xs overflow-hidden shadow-xs text-xs font-sans">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100 font-mono text-[10px] text-gray-400 uppercase tracking-wider">
                      <th className="py-3 px-4">Imagem / Nome</th>
                      <th className="py-3 px-4">Categoria</th>
                      <th className="py-3 px-4">Preço</th>
                      <th className="py-3 px-4">Estoque</th>
                      <th className="py-3 px-4">Tamanhos</th>
                      <th className="py-3 px-4 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {sellerProducts.map((prod) => (
                      <tr key={prod.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="py-3 px-4 flex items-center gap-3">
                          <img 
                            src={prod.images[0]} 
                            alt={prod.name} 
                            referrerPolicy="no-referrer"
                            className="w-10 h-12 object-cover rounded-xs border border-gray-100 shrink-0" 
                          />
                          <div className="min-w-0">
                            <p className="font-semibold text-gray-900 truncate">{prod.name}</p>
                            <p className="text-[10px] font-mono text-gray-400">ID: {prod.id}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-600">
                          <span className="font-mono text-[10px] uppercase text-amber-700 bg-amber-50 px-2 py-0.5">
                            {prod.subcategory}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono font-medium text-gray-900">
                          R$ {prod.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          {prod.originalPrice && (
                            <span className="block text-[9px] text-gray-400 line-through">
                              R$ {prod.originalPrice.toFixed(2)}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 font-mono">
                          <span className={`font-semibold ${prod.stock < 5 ? 'text-red-600' : 'text-gray-900'}`}>
                            {prod.stock} un
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono text-[10px] text-gray-500">
                          {prod.sizes.join(', ')}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => startEditProduct(prod)}
                              className="p-1.5 text-gray-500 hover:text-black hover:bg-gray-100 transition-colors rounded-full"
                              title="Editar Produto"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                setProductToDelete(prod);
                              }}
                              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors rounded-full"
                              title="Remover Produto"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="text-center py-16 bg-gray-50 border border-gray-100 rounded-xs space-y-4">
              <Package className="w-12 h-12 text-gray-300 mx-auto" />
              <div className="space-y-1">
                <p className="text-sm font-sans font-semibold text-gray-900">Nenhum produto cadastrado ainda</p>
                <p className="text-xs text-gray-500">Cadastre seu primeiro produto para que ele apareça no catálogo da loja.</p>
              </div>
              <button
                onClick={() => setActiveSubTab('add-product')}
                className="bg-black hover:bg-gray-800 text-white text-xs font-mono py-2.5 px-5 uppercase tracking-wider transition-colors cursor-pointer"
              >
                Cadastrar Meu Primeiro Item
              </button>
            </div>
          )}
        </div>
      )}

      {/* SUBTAB 3: ADD / EDIT PRODUCT FORM */}
      {activeSubTab === 'add-product' && (
        <div className="max-w-4xl mx-auto bg-white border border-gray-100 rounded-xs p-6 sm:p-8 shadow-md space-y-6 animate-in fade-in duration-300">
          <div className="border-b border-gray-50 pb-3">
            <h3 className="text-base font-mono uppercase tracking-widest text-black font-semibold">
              {editingProd ? 'Editar Produto Anunciado' : 'Cadastrar Novo Produto para Venda'}
            </h3>
            <p className="text-xs text-gray-400 font-sans mt-0.5">Preencha os detalhes técnicos, preços e escolha as imagens da sua criação.</p>
          </div>

          {formSuccess && (
            <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 p-4 rounded-xs flex items-center gap-2 text-xs font-medium animate-bounce">
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{formSuccess}</span>
            </div>
          )}

          <form onSubmit={handleProductSubmit} className="space-y-6 text-xs font-sans">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="text-[10px] font-mono text-gray-500 uppercase tracking-wider block mb-1.5 font-bold">Título do Produto *</label>
                <input
                  id="prod-form-name"
                  type="text"
                  required
                  placeholder="Ex: Camisa Social de Linho Egípcio"
                  value={prodName}
                  onChange={(e) => setProdName(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 p-3 text-sm focus:bg-white focus:border-black focus:outline-hidden rounded-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-mono text-gray-500 uppercase tracking-wider block mb-1.5 font-bold">Categoria *</label>
                  <select
                    id="prod-form-category"
                    value={prodCategory}
                    onChange={(e) => setProdCategory(e.target.value as any)}
                    className="w-full bg-gray-50 border border-gray-200 p-3 text-sm focus:bg-white focus:border-black focus:outline-hidden rounded-xs"
                  >
                    <option value="Camisas">Camisas</option>
                    <option value="Calças">Calças</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-mono text-gray-500 uppercase tracking-wider block mb-1.5 font-bold">Subcategoria *</label>
                  <select
                    id="prod-form-subcategory"
                    value={prodSubcategory}
                    onChange={(e) => setProdSubcategory(e.target.value as any)}
                    className="w-full bg-gray-50 border border-gray-200 p-3 text-sm focus:bg-white focus:border-black focus:outline-hidden rounded-xs"
                  >
                    {prodCategory === 'Camisas' ? (
                      <>
                        <option value="Camisas Slim">Camisas Slim</option>
                        <option value="Camisas Sociais">Camisas Sociais</option>
                        <option value="Camisas Premium">Camisas Premium</option>
                        <option value="Camisas Manga Longa">Camisas Manga Longa</option>
                        <option value="Camisas Manga Curta">Camisas Manga Curta</option>
                      </>
                    ) : (
                      <>
                        <option value="Calças Alfaiataria">Calças Alfaiataria</option>
                        <option value="Calças Slim">Calças Slim</option>
                        <option value="Calças Sociais">Calças Sociais</option>
                        <option value="Calças Premium">Calças Premium</option>
                      </>
                    )}
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-mono text-gray-500 uppercase tracking-wider block mb-1.5 font-bold">Descrição da Peça (Caimento, Tecido, Detalhes) *</label>
              <textarea
                id="prod-form-desc"
                required
                rows={4}
                value={prodDesc}
                onChange={(e) => setProdDesc(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 p-3 text-sm focus:bg-white focus:border-black focus:outline-hidden rounded-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <label className="text-[10px] font-mono text-gray-500 uppercase tracking-wider block mb-1.5 font-bold">Preço de Venda (R$) *</label>
                <input
                  id="prod-form-price"
                  type="number"
                  step="0.01"
                  min="50"
                  required
                  value={prodPrice}
                  onChange={(e) => setProdPrice(parseFloat(e.target.value))}
                  className="w-full bg-gray-50 border border-gray-200 p-3 text-sm focus:bg-white focus:border-black focus:outline-hidden rounded-xs font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono text-gray-500 uppercase tracking-wider block mb-1.5">Preço Original / De: (Opcional)</label>
                <input
                  id="prod-form-orig-price"
                  type="number"
                  step="0.01"
                  placeholder="Ex: 489.90"
                  value={prodOrigPrice || ''}
                  onChange={(e) => setProdOrigPrice(e.target.value ? parseFloat(e.target.value) : undefined)}
                  className="w-full bg-gray-50 border border-gray-200 p-3 text-sm focus:bg-white focus:border-black focus:outline-hidden rounded-xs font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono text-gray-500 uppercase tracking-wider block mb-1.5 font-bold">Estoque Inicial (un) *</label>
                <input
                  id="prod-form-stock"
                  type="number"
                  min="1"
                  required
                  value={prodStock}
                  onChange={(e) => setProdStock(parseInt(e.target.value))}
                  className="w-full bg-gray-50 border border-gray-200 p-3 text-sm focus:bg-white focus:border-black focus:outline-hidden rounded-xs font-mono"
                />
              </div>
            </div>

            {/* Colors and Sizes checklists */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider block font-bold">Cores Disponíveis</span>
                <div className="flex flex-wrap gap-2 pt-1">
                  {availableColors.map((col) => {
                    const isSelected = prodColors.includes(col.hex);
                    return (
                      <button
                        key={col.hex}
                        type="button"
                        onClick={() => {
                          if (isSelected) {
                            setProdColors(prodColors.filter(c => c !== col.hex));
                          } else {
                            setProdColors([...prodColors, col.hex]);
                          }
                        }}
                        style={{ backgroundColor: col.hex }}
                        className={`w-8 h-8 rounded-full border border-gray-300 relative transition-transform ${
                          isSelected ? 'scale-110 ring-2 ring-black' : 'hover:scale-105'
                        }`}
                        title={col.name}
                      >
                        {isSelected && (
                          <Check className={`w-4 h-4 absolute inset-0 m-auto ${
                            col.hex === '#FFFFFF' || col.hex === '#F5F5F5' ? 'text-black' : 'text-white'
                          }`} />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider block font-bold">Tamanhos Disponíveis</span>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {(prodCategory === 'Camisas' 
                    ? ['PP', 'P', 'M', 'G', 'GG', 'XG']
                    : ['38', '40', '42', '44', '46', '48']
                  ).map((sz) => {
                    const isSelected = prodSizes.includes(sz);
                    return (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => {
                          if (isSelected) {
                            setProdSizes(prodSizes.filter(s => s !== sz));
                          } else {
                            setProdSizes([...prodSizes, sz]);
                          }
                        }}
                        className={`w-11 py-2 font-mono text-[10px] border transition-all text-center rounded-xs ${
                          isSelected
                            ? 'border-black bg-black text-white font-bold'
                            : 'border-gray-200 bg-white hover:border-black text-gray-700'
                        }`}
                      >
                        {sz}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* GALERIA DE IMAGENS DO PRODUTO (MÚLTIPLAS IMAGENS) */}
            <div className="space-y-6 border-t border-gray-100 pt-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <label className="text-[10px] font-mono text-gray-500 uppercase tracking-wider block font-bold">
                    Galeria de Imagens do Produto ({prodImages.length}) *
                  </label>
                  <p className="text-[10px] text-gray-400 font-sans">
                    Envie quantas imagens desejar de seus arquivos locais, utilize as nossas sugestões premium ou adicione por link. A primeira imagem será a principal.
                  </p>
                </div>
                {prodImages.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsConfirmClearImagesOpen(true);
                    }}
                    className="text-[9px] font-mono text-rose-600 hover:text-rose-800 uppercase tracking-wider underline self-start sm:self-center"
                  >
                    Limpar Todas as Imagens
                  </button>
                )}
              </div>

              {/* GRID OF CURRENT IMAGES WITH ORDER & ACTIONS */}
              {prodImages.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4 p-4 bg-gray-50/50 border border-gray-100 rounded-xs animate-in fade-in duration-300">
                  {prodImages.map((img, idx) => (
                    <div key={idx} className="group bg-white border border-gray-200 rounded-xs p-2 flex flex-col gap-2 relative shadow-xs transition-all hover:shadow-md">
                      <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-50 rounded-xs">
                        <img 
                          src={img} 
                          alt={`Foto do produto ${idx + 1}`} 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover" 
                        />
                        <span className="absolute top-1 left-1 bg-black/75 text-white font-mono text-[8px] px-1.5 py-0.5 rounded-full font-bold uppercase">
                          {idx === 0 ? 'Capa' : `#${idx + 1}`}
                        </span>
                        
                        {/* Remove single image button */}
                        <button
                          type="button"
                          onClick={() => {
                            setProdImages(prev => prev.filter((_, i) => i !== idx));
                          }}
                          className="absolute top-1 right-1 bg-rose-600 hover:bg-rose-700 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Remover imagem"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="flex flex-col gap-1 mt-1">
                        {idx > 0 && (
                          <button
                            type="button"
                            onClick={() => {
                              // Move to first position
                              setProdImages(prev => {
                                const copy = [...prev];
                                const item = copy.splice(idx, 1)[0];
                                return [item, ...copy];
                              });
                            }}
                            className="w-full py-1 px-1 bg-gray-100 hover:bg-black hover:text-white rounded-xs text-[8px] font-mono uppercase tracking-wider text-center text-gray-500 transition-all font-semibold"
                          >
                            Definir Capa
                          </button>
                        )}
                        <span className="text-[8px] text-gray-400 font-sans truncate text-center">
                          {img.startsWith('data:') ? 'Arquivo Local' : 'Link Web'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 border border-dashed border-gray-200 rounded-xs flex flex-col items-center justify-center space-y-2">
                  <ImageIcon className="w-8 h-8 text-gray-300" />
                  <p className="text-[11px] font-medium text-gray-500">Nenhuma imagem adicionada para este produto ainda</p>
                  <p className="text-[9px] text-gray-400">Por favor, utilize as opções abaixo para carregar as fotos da sua peça.</p>
                </div>
              )}

              {/* INPUTS AND UPLOAD DRAG/DROP ZONE CONTAINER */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* 1. LOCAL FILE UPLOADER (DRAG & DROP / CLICK) */}
                <div className="border border-dashed border-gray-200 rounded-xs p-5 bg-white flex flex-col items-center justify-center text-center space-y-3 hover:border-black transition-colors relative group">
                  <input
                    id="prod-files-upload"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e.target.files)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-600 group-hover:bg-amber-500 group-hover:text-black transition-all">
                    <Upload className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-800">Enviar Fotos do seu Computador / Celular</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">Clique ou arraste múltiplas imagens (PNG, JPG, WEBP)</p>
                  </div>
                </div>

                {/* 2. CUSTOM URL INPUT FIELDS */}
                <div className="border border-gray-100 rounded-xs p-5 bg-gray-50/50 flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    <p className="text-xs font-semibold text-gray-800">Adicionar Imagem por Link da Web</p>
                    <p className="text-[10px] text-gray-400">Cole o link completo (URL) da imagem hospedada na internet.</p>
                  </div>
                  <div className="flex gap-2">
                    <input
                      id="prod-form-custom-url"
                      type="url"
                      placeholder="https://exemplo.com/foto-do-produto.jpg"
                      value={customImgUrl}
                      onChange={(e) => setCustomImgUrl(e.target.value)}
                      className="flex-1 bg-white border border-gray-200 p-2.5 text-xs focus:border-black focus:outline-hidden rounded-xs"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddCustomImage(customImgUrl)}
                      className="px-4 py-2.5 bg-black hover:bg-gray-800 text-white font-mono text-[10px] uppercase tracking-wider rounded-xs font-bold shrink-0 transition-colors"
                    >
                      Adicionar
                    </button>
                  </div>
                </div>

              </div>

              {/* 3. PREMIUM DESIGN TEMPLATES / SUGGESTIONS */}
              <div className="space-y-3 bg-gray-50/30 p-4 border border-gray-100 rounded-xs">
                <span className="text-[10px] font-mono text-amber-800 uppercase tracking-wider block font-bold">Sugestões de Alta Costura (Presets Sarto)</span>
                <p className="text-[9px] text-gray-400 font-sans">Dica: Adicione um ou mais presets abaixo clicando neles se você não possuir fotos profissionais no momento.</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {premiumImagePresets[prodCategory]?.map((preset, index) => {
                    const isAdded = prodImages.includes(preset.url);
                    return (
                      <button
                        key={index}
                        type="button"
                        onClick={() => {
                          if (isAdded) {
                            setProdImages(prev => prev.filter(url => url !== preset.url));
                          } else {
                            setProdImages(prev => [...prev, preset.url]);
                          }
                        }}
                        className={`group border rounded-xs p-2 text-left transition-all flex flex-col gap-2 relative ${
                          isAdded ? 'border-amber-600 bg-amber-500/5 ring-1 ring-amber-500' : 'border-gray-200 hover:border-black bg-white'
                        }`}
                      >
                        <img 
                          src={preset.url} 
                          alt={preset.label} 
                          referrerPolicy="no-referrer"
                          className="w-full h-20 object-cover rounded-xs border border-gray-100 shrink-0" 
                        />
                        <div className="flex items-center justify-between gap-1 min-w-0">
                          <span className="text-[9px] font-sans text-gray-600 truncate font-medium group-hover:text-black">
                            {preset.label}
                          </span>
                          {isAdded ? (
                            <span className="bg-amber-500 text-black p-0.5 rounded-full shrink-0">
                              <Check className="w-2.5 h-2.5 stroke-[3px]" />
                            </span>
                          ) : (
                            <span className="text-[8px] font-mono text-gray-400 shrink-0">+ Add</span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-gray-50 pt-5">
              {editingProd && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingProd(null);
                    setActiveSubTab('products');
                  }}
                  className="bg-white border border-gray-200 text-gray-700 font-mono text-xs py-3 px-6 uppercase tracking-wider hover:border-black transition-colors"
                >
                  Cancelar Edição
                </button>
              )}
              <button
                id="prod-form-submit-btn"
                type="submit"
                className="bg-black hover:bg-gray-800 text-white font-mono text-xs py-3.5 px-8 uppercase tracking-widest font-semibold transition-colors shadow-lg cursor-pointer"
              >
                {editingProd ? 'Atualizar Peça' : 'Publicar Peça para Venda'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* SUBTAB 4: ORDERS INVOLVING SELLER PRODUCTS */}
      {activeSubTab === 'orders' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="border-b border-gray-50 pb-3">
            <h3 className="text-sm font-mono uppercase tracking-widest text-black font-semibold">
              Pedidos de Clientes ({sellerOrders.length})
            </h3>
            <p className="text-xs text-gray-400 font-sans mt-0.5">Acompanhe as vendas das suas roupas e confira os endereços de remessa.</p>
          </div>

          {sellerOrders.length > 0 ? (
            <div className="space-y-4">
              {sellerOrders.map((order) => {
                // Find only items belonging to this seller
                const sellerItems = order.items.filter(item => {
                  const prod = products.find(p => p.id === item.productId);
                  return prod && prod.sellerName === storeName;
                });

                const totalRevenueForOrder = sellerItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

                return (
                  <div key={order.id} className="bg-white border border-gray-100 rounded-xs p-5 sm:p-6 shadow-xs space-y-4 text-xs font-sans">
                    <div className="flex flex-col sm:flex-row justify-between gap-3 border-b border-gray-50 pb-3">
                      <div>
                        <p className="font-mono text-[10px] text-gray-400 uppercase tracking-widest">Código do Pedido</p>
                        <p className="font-mono font-bold text-gray-900">{order.id}</p>
                      </div>

                      <div className="flex flex-wrap gap-x-4 gap-y-2 text-right sm:items-end">
                        <div>
                          <p className="text-[9px] font-mono text-gray-400 uppercase">Data da Venda</p>
                          <p className="font-medium text-gray-800">{order.date}</p>
                        </div>
                        <div>
                          <p className="text-[9px] font-mono text-gray-400 uppercase">Status Geral</p>
                          <span className={`inline-block px-2.5 py-0.5 text-[9px] font-mono uppercase tracking-wider rounded-full ${
                            order.status === 'Entregue' ? 'bg-emerald-50 text-emerald-700 font-semibold' :
                            order.status === 'Enviado' ? 'bg-indigo-50 text-indigo-700' :
                            order.status === 'Cancelado' ? 'bg-rose-50 text-rose-700' :
                            'bg-amber-50 text-amber-700'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Order Items Table */}
                    <div className="space-y-2">
                      <p className="font-mono text-[10px] uppercase tracking-wider text-gray-400">Minhas Peças Adquiridas</p>
                      <div className="divide-y divide-gray-100 border border-gray-50 bg-gray-50/30 p-4 rounded-xs space-y-2.5">
                        {sellerItems.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between gap-4 pt-2 first:pt-0">
                            <div className="flex items-center gap-3">
                              <img src={item.image} alt={item.name} referrerPolicy="no-referrer" className="w-8 h-10 object-cover rounded-xs border border-gray-200" />
                              <div>
                                <p className="font-semibold text-gray-900">{item.name}</p>
                                <p className="font-mono text-[10px] text-gray-500">
                                  Tamanho: <strong className="text-black">{item.size}</strong> • Cor: <span className="inline-block w-2.5 h-2.5 rounded-full border border-gray-300 align-middle ml-1" style={{ backgroundColor: item.color }} />
                                </p>
                              </div>
                            </div>
                            <div className="text-right font-mono">
                              <p className="text-gray-900 font-medium">{item.quantity} un x R$ {item.price.toFixed(2)}</p>
                              <p className="text-[10px] text-gray-500">Total: R$ {(item.price * item.quantity).toFixed(2)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-gray-50">
                      {/* Shipping Address details */}
                      <div className="space-y-1">
                        <p className="font-mono text-[10px] uppercase text-gray-400 tracking-wider">Dados de Envio</p>
                        <p className="font-semibold text-gray-800">{order.customerName}</p>
                        <p className="text-gray-500 text-[11px] leading-relaxed">
                          {order.shippingAddress.street}, Nº {order.shippingAddress.number} {order.shippingAddress.complement && `(${order.shippingAddress.complement})`}
                          <br />
                          {order.shippingAddress.neighborhood} • {order.shippingAddress.city} - {order.shippingAddress.state}
                          <br />
                          CEP: {order.shippingAddress.zipCode}
                        </p>
                      </div>

                      {/* Financial payout details */}
                      <div className="bg-amber-500/5 border border-amber-500/10 p-4 rounded-xs flex flex-col justify-between text-right md:items-end">
                        <div>
                          <p className="font-mono text-[10px] uppercase text-amber-800 tracking-wider">Subtotal Bruto do Vendedor</p>
                          <p className="text-sm font-mono font-bold text-black">R$ {totalRevenueForOrder.toFixed(2)}</p>
                        </div>
                        <div className="mt-2 border-t border-amber-200/40 pt-2 w-full">
                          <p className="font-mono text-[10px] uppercase text-amber-800 tracking-wider">Seu Repasse Líquido (85%)</p>
                          <p className="text-base font-mono font-extrabold text-amber-700">R$ {(totalRevenueForOrder * 0.85).toFixed(2)}</p>
                        </div>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 bg-gray-50 border border-gray-100 rounded-xs space-y-3">
              <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto" />
              <p className="text-sm font-sans font-semibold text-gray-900">Ainda sem vendas concluídas</p>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">Assim que os clientes começarem a comprar suas roupas no catálogo, os dados de envio e faturamento aparecerão aqui.</p>
            </div>
          )}
        </div>
      )}

      {/* SUBTAB 5: FINANCES & PIX WITHDRAWALS */}
      {activeSubTab === 'finances' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-300">
          
          {/* Main Account details and withdraw form */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-gray-100 rounded-xs p-6 shadow-md space-y-6">
              <div className="border-b border-gray-50 pb-3">
                <h3 className="text-sm font-mono uppercase tracking-widest text-black font-semibold flex items-center gap-1.5">
                  <Wallet className="w-4 h-4 text-amber-600" /> Detalhes da Conta Comercial
                </h3>
                <p className="text-xs text-gray-400 font-sans mt-0.5">Solicite saques rápidos para sua chave Pix registrada.</p>
              </div>

              {withdrawSuccess && (
                <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 p-4 rounded-xs flex items-center gap-2 text-xs font-medium">
                  <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>{withdrawSuccess}</span>
                </div>
              )}

              {withdrawError && (
                <div className="bg-rose-50 border border-rose-100 text-rose-700 p-4 rounded-xs flex items-center gap-2 text-xs font-medium">
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                  <span>{withdrawError}</span>
                </div>
              )}

              {/* Financial Box values */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-xs space-y-1">
                  <span className="text-[9px] font-mono text-gray-400 uppercase tracking-wider block">Ganhos Brutos Totais</span>
                  <p className="text-xl font-mono font-bold text-gray-900">
                    R$ {grossEarnings.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                  <p className="text-[10px] text-gray-400">85% do faturamento de suas peças</p>
                </div>

                <div className="bg-amber-500/10 p-4 rounded-xs border border-amber-500/20 space-y-1">
                  <span className="text-[9px] font-mono text-amber-800 uppercase tracking-wider block font-bold">Saldo Disponível para Saque</span>
                  <p className="text-2xl font-mono font-extrabold text-amber-700">
                    R$ {availableEarnings.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                  <p className="text-[10px] text-amber-600">Disponível em tempo real via Pix</p>
                </div>
              </div>

              {/* Request form */}
              <form onSubmit={handleWithdrawRequest} className="space-y-4 border-t border-gray-50 pt-5 text-xs font-sans">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-mono text-gray-500 uppercase tracking-wider block mb-1 font-bold">Valor para Sacar (R$)</label>
                    <input
                      id="withdraw-form-amount"
                      type="number"
                      step="0.01"
                      min="10"
                      placeholder="Ex: 500.00"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 p-3 text-sm focus:bg-white focus:border-black focus:outline-hidden rounded-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-mono text-gray-500 uppercase tracking-wider block mb-1 font-bold">Chave Pix de Destino</label>
                    <input
                      id="withdraw-form-pix-key"
                      type="text"
                      disabled
                      value={sellerProfile.email}
                      className="w-full bg-gray-100 border border-gray-200 p-3 text-sm text-gray-500 cursor-not-allowed rounded-xs font-mono"
                    />
                    <span className="text-[9px] text-gray-400 font-sans block mt-1">Chave Pix padrão: E-mail da conta comercial.</span>
                  </div>
                </div>

                <button
                  id="withdraw-form-submit-btn"
                  type="submit"
                  disabled={availableEarnings <= 0}
                  className={`w-full font-mono text-xs py-3.5 px-6 uppercase tracking-widest font-semibold transition-all shadow-md flex items-center justify-center gap-2 ${
                    availableEarnings > 0
                      ? 'bg-black text-white hover:bg-gray-800 cursor-pointer'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Confirmar e Sacar via PIX <ArrowUpRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>

          {/* Sidebar list of transactions */}
          <div className="space-y-6">
            <div className="bg-gray-50 border border-gray-100 p-5 rounded-xs space-y-4">
              <h4 className="text-xs font-mono uppercase tracking-widest text-black font-semibold border-b border-gray-200 pb-2">
                Histórico de Transferências
              </h4>
              
              <div className="space-y-3 font-sans text-xs">
                {withdrawals.map((w, idx) => (
                  <div key={w.id || idx} className="bg-white p-3 border border-gray-200 rounded-xs flex items-center justify-between shadow-xs">
                    <div className="space-y-0.5">
                      <p className="font-semibold text-gray-900 font-mono text-xs">R$ {w.amount.toFixed(2)}</p>
                      <p className="text-[10px] text-gray-400">{w.date} • {w.method}</p>
                    </div>
                    <div>
                      <span className={`px-2 py-0.5 text-[9px] font-mono uppercase tracking-wider rounded-full ${
                        w.status === 'Pago' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                      }`}>
                        {w.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-950 text-white p-5 rounded-xs space-y-3 text-[11px] leading-relaxed font-mono">
              <p className="font-bold text-amber-500 uppercase tracking-wider text-xs flex items-center gap-1">
                <Info className="w-4 h-4" /> Importante
              </p>
              <p className="text-gray-300">
                Os prazos bancários para compensação de saques via Pix são imediatos. Em casos de análises de segurança aleatórias pela mesa de câmbio Sarto Imperial, o prazo pode se estender por até 2 horas.
              </p>
            </div>
          </div>

        </div>
      )}

      {/* MODAL DE CONFIRMAÇÃO DE EXCLUSÃO DE PRODUTO */}
      {productToDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white border border-gray-100 max-w-md w-full p-6 shadow-2xl space-y-6 animate-in zoom-in-95 duration-200 rounded-none">
            <div className="space-y-2">
              <div className="w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center text-rose-600">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-sans font-extrabold text-black tracking-tight mt-4">
                Remover Produto da Loja?
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed font-sans">
                Tem certeza de que deseja remover o produto <strong className="font-semibold text-black">"{productToDelete.name}"</strong>? Esta ação é irreversível e removerá o item do catálogo para todos os compradores.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-end gap-2 font-mono text-xs">
              <button
                type="button"
                onClick={() => setProductToDelete(null)}
                className="w-full sm:w-auto px-4 py-3 border border-gray-200 text-gray-700 uppercase tracking-widest hover:bg-gray-50 transition-colors font-medium rounded-none"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  onDeleteProduct(productToDelete.id);
                  setProductToDelete(null);
                }}
                className="w-full sm:w-auto px-5 py-3 bg-rose-600 hover:bg-rose-700 text-white uppercase tracking-widest transition-colors font-semibold rounded-none"
              >
                Sim, Remover
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE CONFIRMAÇÃO DE LIMPAR IMAGENS */}
      {isConfirmClearImagesOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white border border-gray-100 max-w-md w-full p-6 shadow-2xl space-y-6 animate-in zoom-in-95 duration-200 rounded-none">
            <div className="space-y-2">
              <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center text-amber-600">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-sans font-extrabold text-black tracking-tight mt-4">
                Limpar Todas as Imagens?
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed font-sans">
                Tem certeza de que deseja remover todas as imagens adicionadas à galeria? Você terá que adicionar uma nova imagem para salvar o produto.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-end gap-2 font-mono text-xs">
              <button
                type="button"
                onClick={() => setIsConfirmClearImagesOpen(false)}
                className="w-full sm:w-auto px-4 py-3 border border-gray-200 text-gray-700 uppercase tracking-widest hover:bg-gray-50 transition-colors font-medium rounded-none"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  setProdImages([]);
                  setIsConfirmClearImagesOpen(false);
                }}
                className="w-full sm:w-auto px-5 py-3 bg-black hover:bg-gray-800 text-white uppercase tracking-widest transition-colors font-semibold rounded-none"
              >
                Limpar Tudo
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
