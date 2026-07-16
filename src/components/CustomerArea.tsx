/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  User, 
  ShoppingBag, 
  Heart, 
  MapPin, 
  Key, 
  Check, 
  ChevronRight, 
  Truck, 
  ShieldCheck,
  AlertCircle,
  Plus,
  Trash2
} from 'lucide-react';
import { Order, Address, Product, CustomerProfile } from '../types';

interface CustomerAreaProps {
  isLoggedIn: boolean;
  onLogin: (email: string, pass: string) => boolean;
  onRegister: (name: string, email: string, pass: string) => boolean;
  userEmail: string;
  userProfile: CustomerProfile;
  orders: Order[];
  favorites: Product[];
  onRemoveFavorite: (productId: string) => void;
  onAddAddress: (addr: Address) => void;
  onDeleteAddress: (id: string) => void;
  onUpdateProfile: (name: string, phone: string) => void;
  onProductClick: (product: Product) => void;
  redirectedForCheckout?: boolean;
}

export default function CustomerArea({
  isLoggedIn,
  onLogin,
  onRegister,
  userEmail,
  userProfile,
  orders,
  favorites,
  onRemoveFavorite,
  onAddAddress,
  onDeleteAddress,
  onUpdateProfile,
  onProductClick,
  redirectedForCheckout = false
}: CustomerAreaProps) {
  const [tab, setTab] = useState<'profile' | 'orders' | 'favorites' | 'addresses'>('orders');
  
  // Auth view switcher
  const [authMode, setAuthMode] = useState<'login' | 'register'>('register');

  React.useEffect(() => {
    if (redirectedForCheckout) {
      setAuthMode('register');
    }
  }, [redirectedForCheckout]);

  const [authEmail, setAuthEmail] = useState('');
  const [authPass, setAuthPass] = useState('');
  const [authName, setAuthName] = useState('');
  const [authError, setAuthError] = useState('');

  // Profile forms states
  const [profName, setProfName] = useState(userProfile.name);
  const [profPhone, setProfPhone] = useState(userProfile.phone);
  const [profPassNew, setProfPassNew] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');

  // Address form states
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addrLabel, setAddrLabel] = useState('');
  const [addrStreet, setAddrStreet] = useState('');
  const [addrNum, setAddrNum] = useState('');
  const [addrComp, setAddrComp] = useState('');
  const [addrNeigh, setAddrNeigh] = useState('');
  const [addrCity, setAddrCity] = useState('');
  const [addrState, setAddrState] = useState('');
  const [addrZip, setAddrZip] = useState('');

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    if (authMode === 'login') {
      const success = onLogin(authEmail, authPass);
      if (!success) {
        setAuthError('E-mail ou senha incorretos. Você pode se cadastrar caso ainda não tenha uma conta.');
      }
    } else {
      if (!authName || !authEmail || !authPass) return;
      const success = onRegister(authName, authEmail, authPass);
      if (!success) {
        setAuthError('Este e-mail já está cadastrado. Por favor, utilize outro e-mail para efetuar seu cadastro.');
      }
    }
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(profName, profPhone);
    setProfileSuccess('Dados atualizados com sucesso!');
    if (profPassNew) {
      setProfPassNew('');
      setProfileSuccess('Dados e senha atualizados com sucesso!');
    }
    setTimeout(() => setProfileSuccess(''), 4000);
  };

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addrStreet || !addrNum || !addrCity || !addrZip) return;

    onAddAddress({
      id: `addr_${Date.now()}`,
      label: addrLabel || 'Principal',
      street: addrStreet,
      number: addrNum,
      complement: addrComp,
      neighborhood: addrNeigh,
      city: addrCity,
      state: addrState,
      zipCode: addrZip
    });

    setAddrLabel('');
    setAddrStreet('');
    setAddrNum('');
    setAddrComp('');
    setAddrNeigh('');
    setAddrCity('');
    setAddrState('');
    setAddrZip('');
    setShowAddressForm(false);
  };

  // Filter orders of this customer
  const customerOrders = orders.filter(o => o.customerEmail.toLowerCase() === userEmail.toLowerCase());

  // Helper for tracking code URL or visual track progress
  const getProgressPercentage = (status: Order['status']) => {
    switch (status) {
      case 'Pendente': return 25;
      case 'Processando': return 50;
      case 'Enviado': return 75;
      case 'Entregue': return 100;
      case 'Cancelado': return 0;
    }
  };

  if (!isLoggedIn) {
    return (
      <div id="auth-view-container" className="max-w-md mx-auto my-12 px-6 py-10 bg-white border border-gray-100 rounded-xs shadow-lg space-y-6 animate-in zoom-in-95 duration-400">
        <div className="text-center space-y-2">
          <span className="text-[10px] font-mono tracking-[0.3em] text-amber-600 block uppercase font-bold">Acesso Restrito</span>
          <h2 className="text-xl font-sans font-extrabold text-black tracking-tight">Sua Conta Sarto Imperial</h2>
          <p className="text-xs text-gray-500">Faça login ou cadastre-se para acompanhar compras, rastrear pacotes e conferir seus itens favoritos.</p>
        </div>

        {redirectedForCheckout && (
          <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-xs text-xs text-amber-950 font-sans space-y-1">
            <p className="font-bold">✨ Complete seu cadastro para finalizar a compra!</p>
            <p className="font-light text-gray-700">Por favor, crie sua conta manualmente com seu e-mail e senha abaixo para prosseguir com o seu pedido e garantir seus produtos.</p>
          </div>
        )}

        <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xs text-center text-xs text-amber-950 font-mono space-y-2">
          <p className="font-bold uppercase tracking-wider text-[10px]">Acesso de Teste Rápido:</p>
          <p>E-mail: <strong className="font-bold">cliente@email.com</strong> | Senha: <strong className="font-bold">123</strong></p>
          <div className="h-px bg-amber-500/25 my-1" />
          <p className="text-[10px] text-amber-900 font-sans">Ou clique em <span className="font-bold underline">Cadastre-se grátis</span> abaixo para criar uma conta manual com seu próprio e-mail e senha!</p>
        </div>

        {authError && (
          <div className="bg-red-50 text-red-800 p-3.5 border border-red-100 rounded-xs text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
            <span>{authError}</span>
          </div>
        )}

        <form onSubmit={handleAuthSubmit} className="space-y-4 text-xs">
          {authMode === 'register' && (
            <div>
              <label className="text-[10px] font-mono uppercase tracking-wider text-gray-500 block mb-1">Nome Completo</label>
              <input
                id="reg-name"
                type="text"
                required
                placeholder="Ex: Carlos Albuquerque"
                value={authName}
                onChange={(e) => setAuthName(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 p-3 focus:bg-white focus:border-black focus:outline-hidden"
              />
            </div>
          )}

          <div>
            <label className="text-[10px] font-mono uppercase tracking-wider text-gray-500 block mb-1">Seu E-mail</label>
            <input
              id="auth-email"
              type="email"
              required
              placeholder="seu@email.com"
              value={authEmail}
              onChange={(e) => setAuthEmail(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 p-3 focus:bg-white focus:border-black focus:outline-hidden"
            />
          </div>

          <div>
            <label className="text-[10px] font-mono uppercase tracking-wider text-gray-500 block mb-1">Senha de Segurança</label>
            <input
              id="auth-pass"
              type="password"
              required
              placeholder="Digite sua senha"
              value={authPass}
              onChange={(e) => setAuthPass(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 p-3 focus:bg-white focus:border-black focus:outline-hidden"
            />
          </div>

          <button
            id="auth-submit-btn"
            type="submit"
            className="w-full bg-black hover:bg-gray-800 text-white font-mono py-3.5 uppercase tracking-widest transition-colors font-semibold"
          >
            {authMode === 'login' ? 'Entrar na Minha Conta' : 'Efetuar Cadastro Premium'}
          </button>
        </form>

        <div className="text-center pt-2">
          {authMode === 'login' ? (
            <button 
              onClick={() => { setAuthMode('register'); setAuthError(''); }}
              className="text-xs text-amber-700 hover:text-black font-semibold underline"
            >
              Não possui conta? Cadastre-se grátis
            </button>
          ) : (
            <button 
              onClick={() => { setAuthMode('login'); setAuthError(''); }}
              className="text-xs text-amber-700 hover:text-black font-semibold underline"
            >
              Já possui uma conta? Faça login aqui
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div id="customer-area-dashboard" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      
      {/* Top Welcome Title Grid */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-black text-amber-500 font-mono font-bold flex items-center justify-center text-lg shadow-sm">
            {userProfile.name[0] || 'U'}
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-sans font-bold text-gray-900 tracking-tight">
              Olá, {userProfile.name}
            </h1>
            <p className="text-xs text-gray-500 font-sans mt-0.5">E-mail: {userEmail} • Status de cliente VIP</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT: Quick Tabs sidebar (Lg: 3 cols) */}
        <div className="lg:col-span-3 space-y-2">
          {[
            { id: 'orders', label: 'Meus Pedidos', icon: <ShoppingBag className="w-4 h-4" /> },
            { id: 'favorites', label: 'Meus Favoritos', icon: <Heart className="w-4 h-4" /> },
            { id: 'addresses', label: 'Meus Endereços', icon: <MapPin className="w-4 h-4" /> },
            { id: 'profile', label: 'Dados de Cadastro', icon: <User className="w-4 h-4" /> }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setTab(item.id as any)}
              className={`w-full text-left py-3 px-4 text-xs font-mono uppercase tracking-wider flex items-center gap-3 rounded-xs border transition-all ${
                tab === item.id
                  ? 'border-black bg-black text-white font-semibold shadow-xs'
                  : 'border-transparent text-gray-600 hover:text-black hover:bg-gray-50'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>

        {/* RIGHT: Active Tab panels content (Lg: 9 cols) */}
        <div className="lg:col-span-9 bg-white border border-gray-100 p-6 sm:p-8 rounded-xs shadow-xs min-h-[400px]">
          
          {/* TAB 1: USER ORDERS PROGRESSIVE STEPS TRACKING */}
          {tab === 'orders' && (
            <div className="space-y-6">
              <h2 className="text-sm font-mono uppercase tracking-widest text-black font-semibold border-b border-gray-50 pb-3">
                Histórico e Rastreamento de Pedidos
              </h2>

              {customerOrders.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto" />
                  <p className="text-sm font-semibold text-gray-900">Você ainda não realizou compras</p>
                  <p className="text-xs text-gray-400 max-w-xs mx-auto">Suas compras aparecerão aqui detalhadamente com rastreamento.</p>
                </div>
              ) : (
                <div className="space-y-8">
                  {customerOrders.map((ord) => {
                    const pct = getProgressPercentage(ord.status);
                    return (
                      <div key={ord.id} className="border border-gray-100 rounded-xs p-5 space-y-5 shadow-xs">
                        {/* Upper row */}
                        <div className="flex justify-between items-start flex-wrap gap-2 border-b border-gray-100 pb-3 text-xs">
                          <div>
                            <p className="font-mono text-[11px] text-gray-400">Código de Compra</p>
                            <p className="font-mono font-bold text-black">{ord.id}</p>
                          </div>
                          <div>
                            <p className="font-mono text-[11px] text-gray-400">Data do Pedido</p>
                            <p className="font-semibold text-gray-700">{ord.date}</p>
                          </div>
                          <div>
                            <p className="font-mono text-[11px] text-gray-400">Método Envio</p>
                            <p className="font-semibold text-gray-700">{ord.shippingCost === 0 ? 'Sartor Express Grátis' : 'Sedex Premium'}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-mono text-[11px] text-gray-400">Valor Pago</p>
                            <p className="font-mono font-bold text-black text-sm">R$ {ord.total.toFixed(2)}</p>
                          </div>
                        </div>

                        {/* Items listed in order */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {ord.items.map((it, iIdx) => (
                            <div key={iIdx} className="flex gap-3 items-center text-xs">
                              <img src={it.image} alt={it.name} referrerPolicy="no-referrer" className="w-8 h-10 object-cover rounded-xs border" />
                              <div className="min-w-0">
                                <p className="font-medium text-gray-900 truncate">{it.name}</p>
                                <p className="text-gray-400 font-mono text-[10px]">
                                  Qtd: {it.quantity} • Tam: {it.size} • Cor: <span className="inline-block w-2 h-2 rounded-full border" style={{ backgroundColor: it.color }} />
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Interactive Steps stepper tracking progress */}
                        {ord.status === 'Cancelado' ? (
                          <div className="bg-red-50 text-red-800 p-3 border border-red-100 rounded-xs text-xs font-mono">
                            O pedido foi cancelado e reembolsado conforme regras institucionais.
                          </div>
                        ) : (
                          <div className="space-y-4 pt-4 border-t border-gray-100">
                            <div className="flex justify-between text-xs font-mono text-gray-500">
                              <span>Status de Envio: <strong className="text-black font-semibold uppercase">{ord.status}</strong></span>
                              {ord.trackingCode && <span>Código Rastreio: <strong className="text-amber-700 font-mono">{ord.trackingCode}</strong></span>}
                            </div>
                            
                            {/* Visual Progress bar steps */}
                            <div className="relative">
                              {/* progress background line */}
                              <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-gray-200 rounded-full" />
                              <div 
                                className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-amber-500 rounded-full transition-all duration-700"
                                style={{ width: `${pct}%` }}
                              />

                              {/* circles */}
                              <div className="flex justify-between relative">
                                {[
                                  { label: "Recebido", active: pct >= 25 },
                                  { label: "Processando", active: pct >= 50 },
                                  { label: "Enviado", active: pct >= 75 },
                                  { label: "Entregue", active: pct >= 100 }
                                ].map((stepItem, sIdx) => (
                                  <div key={sIdx} className="flex flex-col items-center">
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] border ${
                                      stepItem.active 
                                        ? 'bg-amber-500 border-amber-600 text-black font-bold scale-115' 
                                        : 'bg-white border-gray-300 text-gray-400'
                                    }`}>
                                      {stepItem.active ? '✓' : sIdx + 1}
                                    </div>
                                    <span className={`text-[9px] font-mono uppercase mt-1 bg-white px-1 ${
                                      stepItem.active ? 'text-black font-bold' : 'text-gray-400'
                                    }`}>
                                      {stepItem.label}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: FAVORITE PRODUCTS CARDS LIST */}
          {tab === 'favorites' && (
            <div className="space-y-6">
              <h2 className="text-sm font-mono uppercase tracking-widest text-black font-semibold border-b border-gray-50 pb-3">
                Suas Peças Favoritas
              </h2>

              {favorites.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <Heart className="w-12 h-12 text-gray-300 mx-auto" />
                  <p className="text-sm font-semibold text-gray-900">Nenhum favorito salvo</p>
                  <p className="text-xs text-gray-400 max-w-xs mx-auto">Navegue pelas vitrines de camisas e calças e adicione as que mais gostar clicando no ícone do coração.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {favorites.map((fav) => (
                    <div key={fav.id} className="border border-gray-100 rounded-xs p-3 hover:border-gray-300 relative flex flex-col group bg-white">
                      <div className="aspect-[3/4] bg-gray-50 overflow-hidden rounded-xs cursor-pointer mb-3" onClick={() => onProductClick(fav)}>
                        <img src={fav.images[0]} alt={fav.name} referrerPolicy="no-referrer" className="w-full h-full object-cover object-top" />
                      </div>
                      
                      <span className="text-[9px] font-mono text-amber-600 uppercase mb-0.5">{fav.subcategory}</span>
                      <h4 
                        onClick={() => onProductClick(fav)} 
                        className="text-xs font-medium text-gray-900 truncate hover:text-amber-700 transition-colors cursor-pointer"
                      >
                        {fav.name}
                      </h4>
                      <p className="text-xs font-mono font-bold mt-1 text-black">R$ {fav.price.toFixed(2)}</p>

                      <button
                        id={`delete-favorite-${fav.id}`}
                        onClick={() => onRemoveFavorite(fav.id)}
                        className="absolute top-4 right-4 p-1.5 bg-white/90 rounded-full border border-gray-200 text-red-500 hover:bg-black hover:text-white transition-all shadow-xs"
                        title="Remover"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: ADDRESS BOOK MANAGEMENT */}
          {tab === 'addresses' && (
            <div className="space-y-6">
              <div className="flex justify-between items-baseline border-b border-gray-50 pb-3">
                <h2 className="text-sm font-mono uppercase tracking-widest text-black font-semibold">
                  Cadernos de Endereços
                </h2>
                <button
                  onClick={() => setShowAddressForm(!showAddressForm)}
                  className="text-xs font-mono text-amber-600 hover:text-black font-semibold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> {showAddressForm ? 'Fechar Form' : 'Adicionar Endereço'}
                </button>
              </div>

              {showAddressForm && (
                <form onSubmit={handleAddressSubmit} className="bg-gray-50 p-5 border border-gray-200 rounded-xs grid grid-cols-1 sm:grid-cols-12 gap-3 text-xs animate-in slide-in-from-top duration-300">
                  <div className="sm:col-span-4">
                    <label className="text-[10px] font-mono text-gray-500 uppercase block mb-0.5">Identificador</label>
                    <input
                      id="addr-label-input"
                      type="text"
                      placeholder="Ex: Trabalho, Casa"
                      required
                      value={addrLabel}
                      onChange={(e) => setAddrLabel(e.target.value)}
                      className="w-full bg-white border border-gray-200 p-2 focus:border-black focus:outline-hidden"
                    />
                  </div>
                  
                  <div className="sm:col-span-8">
                    <label className="text-[10px] font-mono text-gray-500 uppercase block mb-0.5">CEP</label>
                    <input
                      id="addr-zip-input"
                      type="text"
                      placeholder="01310-100"
                      required
                      value={addrZip}
                      onChange={(e) => setAddrZip(e.target.value)}
                      className="w-full bg-white border border-gray-200 p-2 focus:border-black focus:outline-hidden font-mono"
                    />
                  </div>

                  <div className="sm:col-span-9">
                    <label className="text-[10px] font-mono text-gray-500 uppercase block mb-0.5">Rua / Logradouro</label>
                    <input
                      id="addr-street-input"
                      type="text"
                      required
                      value={addrStreet}
                      onChange={(e) => setAddrStreet(e.target.value)}
                      className="w-full bg-white border border-gray-200 p-2 focus:border-black focus:outline-hidden"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label className="text-[10px] font-mono text-gray-500 uppercase block mb-0.5">Número</label>
                    <input
                      id="addr-number-input"
                      type="text"
                      required
                      value={addrNum}
                      onChange={(e) => setAddrNum(e.target.value)}
                      className="w-full bg-white border border-gray-200 p-2 focus:border-black focus:outline-hidden"
                    />
                  </div>

                  <div className="sm:col-span-12">
                    <label className="text-[10px] font-mono text-gray-500 uppercase block mb-0.5">Complemento / Apto</label>
                    <input
                      id="addr-comp-input"
                      type="text"
                      value={addrComp}
                      onChange={(e) => setAddrComp(e.target.value)}
                      className="w-full bg-white border border-gray-200 p-2 focus:border-black focus:outline-hidden"
                    />
                  </div>

                  <div className="sm:col-span-5">
                    <label className="text-[10px] font-mono text-gray-500 uppercase block mb-0.5">Bairro</label>
                    <input
                      id="addr-neigh-input"
                      type="text"
                      required
                      value={addrNeigh}
                      onChange={(e) => setAddrNeigh(e.target.value)}
                      className="w-full bg-white border border-gray-200 p-2 focus:border-black focus:outline-hidden"
                    />
                  </div>

                  <div className="sm:col-span-5">
                    <label className="text-[10px] font-mono text-gray-500 uppercase block mb-0.5">Cidade</label>
                    <input
                      id="addr-city-input"
                      type="text"
                      required
                      value={addrCity}
                      onChange={(e) => setAddrCity(e.target.value)}
                      className="w-full bg-white border border-gray-200 p-2 focus:border-black focus:outline-hidden"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-[10px] font-mono text-gray-500 uppercase block mb-0.5">UF</label>
                    <input
                      id="addr-state-input"
                      type="text"
                      required
                      placeholder="SP"
                      value={addrState}
                      onChange={(e) => setAddrState(e.target.value.toUpperCase().slice(0, 2))}
                      className="w-full bg-white border border-gray-200 p-2 focus:border-black focus:outline-hidden text-center uppercase"
                    />
                  </div>

                  <div className="sm:col-span-12 pt-2 flex justify-end">
                    <button
                      id="add-address-form-submit-btn"
                      type="submit"
                      className="bg-black hover:bg-gray-800 text-white font-mono px-6 py-2 uppercase tracking-wider font-semibold rounded-xs"
                    >
                      Salvar Endereço
                    </button>
                  </div>
                </form>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {userProfile.addresses.map((addr) => (
                  <div key={addr.id} className="border border-gray-100 p-4 rounded-xs relative bg-gray-50/50 hover:bg-gray-50 text-xs">
                    <span className="font-mono text-[9px] uppercase tracking-wider bg-black text-white px-2 py-0.5 rounded-xs font-semibold block w-fit mb-2">
                      {addr.label}
                    </span>
                    <p className="font-medium text-gray-900">{addr.street}, nº {addr.number}</p>
                    {addr.complement && <p className="text-gray-500">Comp: {addr.complement}</p>}
                    <p className="text-gray-500">{addr.neighborhood}, {addr.city} - {addr.state}</p>
                    <p className="text-gray-400 font-mono mt-1">CEP: {addr.zipCode}</p>

                    <button
                      id={`delete-addr-${addr.id}`}
                      onClick={() => onDeleteAddress(addr.id)}
                      className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                      title="Excluir Endereço"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: PROFILE DETAIL UPDATE */}
          {tab === 'profile' && (
            <div className="space-y-6">
              <h2 className="text-sm font-mono uppercase tracking-widest text-black font-semibold border-b border-gray-50 pb-3">
                Editar Meus Dados de Cadastro
              </h2>

              {profileSuccess && (
                <div className="bg-emerald-50 text-emerald-800 p-4 border border-emerald-100 rounded-xs text-xs font-medium">
                  {profileSuccess}
                </div>
              )}

              <form onSubmit={handleProfileSubmit} className="space-y-4 max-w-lg text-xs">
                <div>
                  <label className="text-[10px] font-mono uppercase tracking-wider text-gray-500 block mb-1">Nome Completo</label>
                  <input
                    id="profile-name-input"
                    type="text"
                    required
                    value={profName}
                    onChange={(e) => setProfName(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 p-3 focus:bg-white focus:border-black focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase tracking-wider text-gray-500 block mb-1">Telefone Celular</label>
                  <input
                    id="profile-phone-input"
                    type="text"
                    required
                    value={profPhone}
                    onChange={(e) => setProfPhone(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 p-3 focus:bg-white focus:border-black focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase tracking-wider text-gray-500 block mb-1">E-mail Cadastrado (Não alterável)</label>
                  <input
                    type="email"
                    disabled
                    value={userEmail}
                    className="w-full bg-gray-100 border border-gray-200 p-3 text-gray-400 cursor-not-allowed font-mono"
                  />
                </div>

                <div className="pt-4 border-t border-gray-100 space-y-4">
                  <h3 className="text-xs font-mono uppercase tracking-wider text-gray-500 font-semibold">Alterar Senha de Segurança</h3>
                  
                  <div>
                    <label className="text-[10px] font-mono uppercase tracking-wider text-gray-500 block mb-1">Nova Senha</label>
                    <input
                      id="profile-pass-input"
                      type="password"
                      placeholder="Preencha apenas se desejar alterar"
                      value={profPassNew}
                      onChange={(e) => setProfPassNew(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 p-3 focus:bg-white focus:border-black focus:outline-hidden font-mono"
                    />
                  </div>
                </div>

                <button
                  id="profile-submit-btn"
                  type="submit"
                  className="bg-black hover:bg-gray-800 text-white font-mono text-xs py-3.5 px-8 uppercase tracking-widest transition-colors font-semibold shadow-xs"
                >
                  Salvar Alterações VIP
                </button>
              </form>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
