/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Check, 
  CreditCard, 
  QrCode, 
  Barcode, 
  Lock, 
  ChevronRight, 
  ChevronLeft, 
  ShoppingBag, 
  Truck, 
  Sparkles, 
  Copy,
  AlertCircle,
  Building2,
  ShieldCheck,
  Loader2
} from 'lucide-react';
import { CartItem, Coupon, Address, Order, CustomerProfile } from '../types';

interface CheckoutViewProps {
  cartItems: CartItem[];
  coupons: Coupon[];
  activeCoupon: Coupon | null;
  onClearCart: () => void;
  onNewOrderCreated: (order: Order) => void;
  onClose: () => void;
  userProfileAddress?: Address;
  isLoggedIn?: boolean;
  userEmail?: string;
  userProfile?: CustomerProfile;
}

export default function CheckoutView({
  cartItems,
  coupons,
  activeCoupon,
  onClearCart,
  onNewOrderCreated,
  onClose,
  userProfileAddress,
  isLoggedIn = false,
  userEmail = '',
  userProfile
}: CheckoutViewProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1); // 1: Personal, 2: Address, 3: Payment, 4: Confirmed

  // Form states
  const [personalName, setPersonalName] = useState(isLoggedIn && userProfile ? userProfile.name : '');
  const [personalEmail, setPersonalEmail] = useState(isLoggedIn ? userEmail : '');
  const [personalPhone, setPersonalPhone] = useState(isLoggedIn && userProfile ? userProfile.phone : '');
  const [personalCpf, setPersonalCpf] = useState('');

  const [addressZip, setAddressZip] = useState(userProfileAddress?.zipCode || '');
  const [addressStreet, setAddressStreet] = useState(userProfileAddress?.street || '');
  const [addressNumber, setAddressNumber] = useState(userProfileAddress?.number || '');
  const [addressComplement, setAddressComplement] = useState(userProfileAddress?.complement || '');
  const [addressNeighborhood, setAddressNeighborhood] = useState(userProfileAddress?.neighborhood || '');
  const [addressCity, setAddressCity] = useState(userProfileAddress?.city || '');
  const [addressState, setAddressState] = useState(userProfileAddress?.state || '');

  React.useEffect(() => {
    if (isLoggedIn && userProfile) {
      if (userProfile.name) setPersonalName(userProfile.name);
      if (userProfile.email) setPersonalEmail(userProfile.email);
      if (userProfile.phone) setPersonalPhone(userProfile.phone);
      if (userProfile.addresses && userProfile.addresses.length > 0) {
        const addr = userProfile.addresses[0];
        if (addr.zipCode) setAddressZip(addr.zipCode);
        if (addr.street) setAddressStreet(addr.street);
        if (addr.number) setAddressNumber(addr.number);
        if (addr.complement) setAddressComplement(addr.complement);
        if (addr.neighborhood) setAddressNeighborhood(addr.neighborhood);
        if (addr.city) setAddressCity(addr.city);
        if (addr.state) setAddressState(addr.state);
      }
    }
  }, [isLoggedIn, userProfile, userEmail, userProfileAddress]);

  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express'>('standard');
  const [paymentMethod, setPaymentMethod] = useState<'PIX' | 'Cartão' | 'Boleto' | 'Open Banking'>('PIX');

  // Open Banking states
  const [selectedBank, setSelectedBank] = useState<{ id: string; name: string; color: string; text: string; badge: string } | null>(null);
  const [payerCpf, setPayerCpf] = useState(personalCpf || '');
  const [payerName, setPayerName] = useState(personalName || '');
  const [openBankingStatus, setOpenBankingStatus] = useState<'idle' | 'connecting' | 'authenticating' | 'authorizing' | 'completed'>('idle');
  const [openBankingProgress, setOpenBankingProgress] = useState(0);

  // Sync Open Banking details with personal step entries
  React.useEffect(() => {
    if (personalCpf) {
      setPayerCpf(personalCpf);
    }
  }, [personalCpf]);

  React.useEffect(() => {
    if (personalName) {
      setPayerName(personalName);
    }
  }, [personalName]);

  // Credit card states
  const [cardNum, setCardNum] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardFocused, setCardFocused] = useState(false); // flips card on CVV focus
  const [cardInstallments, setCardInstallments] = useState('1');

  // Final Order creation state
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);
  const [pixCopied, setPixCopied] = useState(false);

  // Math Calculations
  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const shippingCost = subtotal >= 400 ? 0 : (shippingMethod === 'standard' ? 15.00 : 29.00);
  
  let discountAmount = 0;
  if (activeCoupon && subtotal >= activeCoupon.minPurchase) {
    if (activeCoupon.discountType === 'percentage') {
      discountAmount = subtotal * (activeCoupon.value / 100);
    } else {
      discountAmount = activeCoupon.value;
    }
  }

  // PIX and Open Banking get extra 5% off
  const pixDiscount = (paymentMethod === 'PIX' || paymentMethod === 'Open Banking') ? (subtotal - discountAmount) * 0.05 : 0;
  const grandTotal = Math.max(0, subtotal - discountAmount - pixDiscount + shippingCost);

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep((prev) => (prev + 1) as any);
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep((prev) => (prev - 1) as any);
    }
  };

  const finalizeOrder = () => {
    const mockOrderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date().toISOString().split('T')[0];

    const finalAddress: Address = {
      id: `addr_check_${Date.now()}`,
      label: "Entrega do Pedido",
      street: addressStreet,
      number: addressNumber,
      complement: addressComplement,
      neighborhood: addressNeighborhood,
      city: addressCity,
      state: addressState,
      zipCode: addressZip
    };

    const newOrder: Order = {
      id: mockOrderId,
      date: now,
      customerName: personalName,
      customerEmail: personalEmail,
      customerPhone: personalPhone || undefined,
      customerCpf: personalCpf || undefined,
      items: cartItems.map(item => ({
        productId: item.product.id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        color: item.selectedColor,
        size: item.selectedSize,
        image: item.product.images[0]
      })),
      subtotal,
      discountAmount: discountAmount + pixDiscount,
      shippingCost,
      total: grandTotal,
      status: "Pendente",
      paymentMethod,
      shippingAddress: finalAddress,
      couponCode: activeCoupon?.code
    };

    // Save order
    onNewOrderCreated(newOrder);
    setCreatedOrder(newOrder);
    onClearCart();
    setStep(4);
  };

  const getPixCode = (amount: number) => {
    const amountStr = amount.toFixed(2);
    const valLength = amountStr.length.toString().padStart(2, '0');
    const basePix = 
      "000201" + 
      "26580014BR.GOV.BCB.PIX01368b2864c3-6c67-453b-b8e0-f7b9f622d2f4" + 
      "52040000" + 
      "5303986" + 
      "54" + valLength + amountStr + 
      "5802BR" + 
      "5914SARTO IMPERIAL" + 
      "6009SAO PAULO" + 
      "62070503***" + 
      "6304";
      
    // CRC16 CCITT
    let crc = 0xFFFF;
    for (let c = 0; c < basePix.length; c++) {
      crc ^= basePix.charCodeAt(c) << 8;
      for (let i = 0; i < 8; i++) {
        if ((crc & 0x8000) !== 0) {
          crc = ((crc << 1) ^ 0x1021) & 0xFFFF;
        } else {
          crc = (crc << 1) & 0xFFFF;
        }
      }
    }
    const crcHex = crc.toString(16).toUpperCase().padStart(4, '0');
    return basePix + crcHex;
  };

  const copyPixCode = () => {
    navigator.clipboard.writeText(getPixCode(grandTotal));
    setPixCopied(true);
    setTimeout(() => setPixCopied(false), 3000);
  };

  return (
    <div id="checkout-view-container" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Upper Stepper progress tracker */}
      <div className="max-w-3xl mx-auto mb-10">
        <div className="flex items-center justify-between relative">
          {/* Progress connectors lines */}
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[2px] bg-gray-200 -z-10" />
          <div 
            className="absolute left-0 top-1/2 -translate-y-1/2 h-[2px] bg-amber-500 transition-all duration-500 -z-10"
            style={{ width: `${((step - 1) / 3) * 100}%` }}
          />

          {/* Step circles */}
          {[
            { s: 1, label: "Identificação" },
            { s: 2, label: "Endereço & Envio" },
            { s: 3, label: "Pagamento" },
            { s: 4, label: "Confirmação" }
          ].map((item) => (
            <div key={item.s} className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono font-bold transition-all duration-300 ${
                step > item.s 
                  ? 'bg-amber-500 text-black' 
                  : step === item.s 
                    ? 'bg-black text-white ring-4 ring-gray-100' 
                    : 'bg-white border border-gray-300 text-gray-400'
              }`}>
                {step > item.s ? <Check className="w-4 h-4" /> : item.s}
              </div>
              <span className={`text-[10px] font-mono uppercase tracking-wider mt-2 bg-white px-1.5 py-0.5 ${
                step === item.s ? 'text-black font-bold' : 'text-gray-400'
              }`}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {step < 4 ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* LEFT: Wizard Inputs (Lg: 7 cols) */}
          <div className="lg:col-span-7">
            
            {/* STEP 1: Personal Identification Form */}
            {step === 1 && (
              <form onSubmit={handleNextStep} className="space-y-6 bg-white border border-gray-100 p-6 sm:p-8 rounded-xs shadow-xs animate-in fade-in duration-300">
                <h3 className="text-sm font-mono uppercase tracking-widest text-black font-semibold border-b border-gray-100 pb-3">
                  1. Dados Pessoais de Identificação
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="text-xs font-mono text-gray-600 uppercase tracking-wider block mb-1">Nome Completo</label>
                    <input
                      id="checkout-name"
                      type="text"
                      required
                      placeholder="Ex: Carlos Gabriel Silva"
                      value={personalName}
                      onChange={(e) => setPersonalName(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 text-xs p-3 focus:bg-white focus:border-black focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono text-gray-600 uppercase tracking-wider block mb-1">E-mail para Receber Rastreio</label>
                    <input
                      id="checkout-email"
                      type="email"
                      required
                      placeholder="carlos@exemplo.com"
                      value={personalEmail}
                      onChange={(e) => setPersonalEmail(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 text-xs p-3 focus:bg-white focus:border-black focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono text-gray-600 uppercase tracking-wider block mb-1">Celular / WhatsApp</label>
                    <input
                      id="checkout-phone"
                      type="tel"
                      required
                      placeholder="(11) 99999-9999"
                      value={personalPhone}
                      onChange={(e) => setPersonalPhone(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 text-xs p-3 focus:bg-white focus:border-black focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono text-gray-600 uppercase tracking-wider block mb-1">CPF (Obrigatório para Nota Fiscal)</label>
                    <input
                      id="checkout-cpf"
                      type="text"
                      required
                      placeholder="000.000.000-00"
                      value={personalCpf}
                      onChange={(e) => setPersonalCpf(e.target.value.replace(/\D/g, '').replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4").slice(0, 14))}
                      className="w-full bg-gray-50 border border-gray-200 text-xs p-3 focus:bg-white focus:border-black focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    id="checkout-step1-next"
                    type="submit"
                    className="bg-black hover:bg-gray-800 text-white text-xs font-mono px-8 py-3.5 uppercase tracking-widest flex items-center gap-2"
                  >
                    Prosseguir para Endereço <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            {/* STEP 2: Address and Delivery Shipping Form */}
            {step === 2 && (
              <form onSubmit={handleNextStep} className="space-y-6 bg-white border border-gray-100 p-6 sm:p-8 rounded-xs shadow-xs animate-in fade-in duration-300">
                <h3 className="text-sm font-mono uppercase tracking-widest text-black font-semibold border-b border-gray-100 pb-3">
                  2. Endereço de Entrega & Modalidade de Envio
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                  <div className="sm:col-span-4">
                    <label className="text-xs font-mono text-gray-600 uppercase tracking-wider block mb-1">CEP</label>
                    <input
                      id="checkout-zip"
                      type="text"
                      required
                      placeholder="00000-000"
                      value={addressZip}
                      onChange={(e) => setAddressZip(e.target.value.replace(/\D/g, '').replace(/(\d{5})(\d{3})/, "$1-$2").slice(0, 9))}
                      className="w-full bg-gray-50 border border-gray-200 text-xs p-3 focus:bg-white focus:border-black focus:outline-hidden"
                    />
                  </div>

                  <div className="sm:col-span-8">
                    <label className="text-xs font-mono text-gray-600 uppercase tracking-wider block mb-1">Rua / Logradouro</label>
                    <input
                      id="checkout-street"
                      type="text"
                      required
                      placeholder="Ex: Avenida Paulista"
                      value={addressStreet}
                      onChange={(e) => setAddressStreet(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 text-xs p-3 focus:bg-white focus:border-black focus:outline-hidden"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label className="text-xs font-mono text-gray-600 uppercase tracking-wider block mb-1">Número</label>
                    <input
                      id="checkout-number"
                      type="text"
                      required
                      placeholder="Ex: 1000"
                      value={addressNumber}
                      onChange={(e) => setAddressNumber(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 text-xs p-3 focus:bg-white focus:border-black focus:outline-hidden"
                    />
                  </div>

                  <div className="sm:col-span-9">
                    <label className="text-xs font-mono text-gray-600 uppercase tracking-wider block mb-1">Complemento / Referência</label>
                    <input
                      id="checkout-complement"
                      type="text"
                      placeholder="Ex: Apto 152 Bloco B"
                      value={addressComplement}
                      onChange={(e) => setAddressComplement(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 text-xs p-3 focus:bg-white focus:border-black focus:outline-hidden"
                    />
                  </div>

                  <div className="sm:col-span-5">
                    <label className="text-xs font-mono text-gray-600 uppercase tracking-wider block mb-1">Bairro</label>
                    <input
                      id="checkout-neighborhood"
                      type="text"
                      required
                      placeholder="Bela Vista"
                      value={addressNeighborhood}
                      onChange={(e) => setAddressNeighborhood(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 text-xs p-3 focus:bg-white focus:border-black focus:outline-hidden"
                    />
                  </div>

                  <div className="sm:col-span-5">
                    <label className="text-xs font-mono text-gray-600 uppercase tracking-wider block mb-1">Cidade</label>
                    <input
                      id="checkout-city"
                      type="text"
                      required
                      placeholder="São Paulo"
                      value={addressCity}
                      onChange={(e) => setAddressCity(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 text-xs p-3 focus:bg-white focus:border-black focus:outline-hidden"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-xs font-mono text-gray-600 uppercase tracking-wider block mb-1">UF / Estado</label>
                    <input
                      id="checkout-state"
                      type="text"
                      required
                      placeholder="SP"
                      value={addressState}
                      onChange={(e) => setAddressState(e.target.value.toUpperCase().slice(0, 2))}
                      className="w-full bg-gray-50 border border-gray-200 text-xs p-3 focus:bg-white focus:border-black focus:outline-hidden text-center"
                    />
                  </div>
                </div>

                {/* Delivery Options selection */}
                <div className="space-y-3 pt-4 border-t border-gray-100">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-gray-500 font-semibold mb-2">Opção de Envio</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Standard option */}
                    <label className={`border p-4 rounded-xs flex items-center justify-between cursor-pointer transition-all ${
                      shippingMethod === 'standard' 
                        ? 'border-black bg-gray-50/50' 
                        : 'border-gray-200 hover:border-black'
                    }`}>
                      <div className="flex items-center gap-3">
                        <input
                          id="shipping-standard"
                          type="radio"
                          name="shipping_opt"
                          checked={shippingMethod === 'standard'}
                          onChange={() => setShippingMethod('standard')}
                          className="text-black focus:ring-black"
                        />
                        <div className="text-left">
                          <p className="text-xs font-mono font-bold text-black uppercase">Entrega Padrão (Sartor Express)</p>
                          <p className="text-[11px] text-gray-500 font-sans">Prazo estimado: 5 a 8 dias úteis</p>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-semibold text-gray-900">
                        {subtotal >= 400 ? 'Grátis' : 'R$ 15,00'}
                      </span>
                    </label>

                    {/* Express option */}
                    <label className={`border p-4 rounded-xs flex items-center justify-between cursor-pointer transition-all ${
                      shippingMethod === 'express' 
                        ? 'border-black bg-gray-50/50' 
                        : 'border-gray-200 hover:border-black'
                    }`}>
                      <div className="flex items-center gap-3">
                        <input
                          id="shipping-express"
                          type="radio"
                          name="shipping_opt"
                          checked={shippingMethod === 'express'}
                          onChange={() => setShippingMethod('express')}
                          className="text-black focus:ring-black"
                        />
                        <div className="text-left">
                          <p className="text-xs font-mono font-bold text-black uppercase">Entrega Sedex Premium</p>
                          <p className="text-[11px] text-gray-500 font-sans">Prazo estimado: 2 a 3 dias úteis</p>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-semibold text-gray-900">
                        {subtotal >= 400 ? 'Grátis' : 'R$ 29,00'}
                      </span>
                    </label>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="text-xs font-mono uppercase tracking-widest text-gray-500 hover:text-black flex items-center gap-1.5"
                  >
                    <ChevronLeft className="w-4 h-4" /> Voltar
                  </button>

                  <button
                    id="checkout-step2-next"
                    type="submit"
                    className="bg-black hover:bg-gray-800 text-white text-xs font-mono px-8 py-3.5 uppercase tracking-widest flex items-center gap-2 animate-pulse"
                  >
                    Ir para Pagamento <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            {/* STEP 3: Complete Secure Payment Selection */}
            {step === 3 && (
              <div className="space-y-6 bg-white border border-gray-100 p-6 sm:p-8 rounded-xs shadow-xs animate-in fade-in duration-300">
                <h3 className="text-sm font-mono uppercase tracking-widest text-black font-semibold border-b border-gray-100 pb-3">
                  3. Selecione o Método de Pagamento
                </h3>

                {/* Tabs selection triggers */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'PIX', label: 'PIX (5% OFF)', icon: <QrCode className="w-4 h-4" /> },
                    { id: 'Open Banking', label: 'Open Banking (5%)', icon: <Building2 className="w-4 h-4" /> },
                    { id: 'Cartão', label: 'Cartão Crédito', icon: <CreditCard className="w-4 h-4" /> },
                    { id: 'Boleto', label: 'Boleto Bancário', icon: <Barcode className="w-4 h-4" /> }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setPaymentMethod(tab.id as any)}
                      className={`py-3.5 text-xs font-mono uppercase flex flex-col sm:flex-row items-center justify-center gap-2 border transition-all rounded-xs ${
                        paymentMethod === tab.id
                          ? 'border-black bg-black text-white font-semibold'
                          : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {tab.icon}
                      <span className="text-[10px] sm:text-xs">{tab.label}</span>
                    </button>
                  ))}
                </div>

                {/* Tab content 1: PIX payment instructions */}
                {paymentMethod === 'PIX' && (
                  <div className="bg-gray-50 p-6 border border-gray-100 rounded-xs space-y-4 text-center animate-in fade-in duration-250">
                    <div className="max-w-xs mx-auto bg-white p-4 border border-gray-200 rounded-xs shadow-xs flex flex-col items-center justify-center space-y-2">
                      <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(getPixCode(grandTotal))}`}
                        alt="PIX QR Code Dinâmico"
                        className="w-40 h-40 object-contain"
                        referrerPolicy="no-referrer"
                      />
                      <span className="text-[9px] font-mono text-gray-400 uppercase tracking-widest block">Código QR de R$ {grandTotal.toFixed(2)}</span>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-mono font-bold text-gray-900 uppercase">Instruções para Pagamento Instantâneo via PIX</p>
                      <p className="text-xs text-gray-500 max-w-md mx-auto">Scaneie o QR Code acima ou use a chave copia e cola abaixo. O processamento é imediato, garantindo despacho rápido do pedido.</p>
                    </div>

                    <div className="max-w-md mx-auto flex gap-2">
                      <input
                        id="pix-code-field"
                        type="text"
                        readOnly
                        value={getPixCode(grandTotal)}
                        className="flex-1 bg-white border border-gray-200 text-[10px] font-mono p-2.5 text-gray-500 select-all"
                      />
                      <button
                        onClick={copyPixCode}
                        className="bg-black hover:bg-gray-800 text-white font-mono text-[11px] px-4 py-2 flex items-center gap-1 rounded-xs flex-shrink-0"
                      >
                        {pixCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        {pixCopied ? 'Copiado!' : 'Copiar'}
                      </button>
                    </div>
                  </div>
                )}

                {/* Tab content 4: Open Banking payment */}
                {paymentMethod === 'Open Banking' && (
                  <div className="bg-gray-50 p-6 border border-gray-100 rounded-xs space-y-6 animate-in fade-in duration-250">
                    <div className="space-y-1 text-center">
                      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 text-[9px] font-mono uppercase tracking-wider font-semibold">
                        <ShieldCheck className="w-3 h-3" /> Transação Segura via Open Finance
                      </div>
                      <h4 className="text-xs font-mono font-bold text-gray-900 uppercase">Transferência Bancária Autorizada (Open Banking)</h4>
                      <p className="text-xs text-gray-500 max-w-lg mx-auto">
                        Pague diretamente através do aplicativo do seu banco de forma rápida e segura. O processamento é instantâneo via infraestrutura Pix.
                      </p>
                    </div>

                    {openBankingStatus === 'idle' && (
                      <div className="space-y-4">
                        {/* Passo 1: Escolha do Banco */}
                        <div className="space-y-2">
                          <label className="text-[10px] font-mono text-gray-500 uppercase tracking-wider block font-bold">1. Escolha o seu Banco de Origem</label>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {[
                              { id: 'itau', name: 'Itaú Unibanco', color: 'bg-orange-600', text: 'text-orange-600', badge: 'Orange' },
                              { id: 'bradesco', name: 'Bradesco', color: 'bg-rose-600', text: 'text-rose-600', badge: 'Red' },
                              { id: 'nubank', name: 'Nubank', color: 'bg-purple-700', text: 'text-purple-700', badge: 'Purple' },
                              { id: 'bb', name: 'Banco do Brasil', color: 'bg-amber-400 text-blue-900', text: 'text-amber-500', badge: 'Yellow' },
                              { id: 'santander', name: 'Santander', color: 'bg-red-600', text: 'text-red-600', badge: 'Red' },
                              { id: 'inter', name: 'Banco Inter', color: 'bg-orange-500', text: 'text-orange-500', badge: 'Orange' },
                              { id: 'caixa', name: 'Caixa Econômica', color: 'bg-blue-600', text: 'text-blue-600', badge: 'Blue' },
                              { id: 'c6', name: 'C6 Bank', color: 'bg-zinc-800', text: 'text-zinc-800', badge: 'Charcoal' }
                            ].map((bank) => (
                              <button
                                key={bank.id}
                                type="button"
                                onClick={() => setSelectedBank(bank)}
                                className={`p-3 border text-center font-mono text-xs transition-all relative flex flex-col items-center justify-center gap-1.5 h-16 ${
                                  selectedBank?.id === bank.id
                                    ? 'border-black bg-white ring-1 ring-black shadow-xs'
                                    : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-700'
                                }`}
                              >
                                <div className="flex items-center gap-1">
                                  <span className={`w-2.5 h-2.5 rounded-full ${bank.color} inline-block`} />
                                  <span className="font-semibold tracking-tight text-[11px] truncate max-w-[100px]">{bank.name}</span>
                                </div>
                                {selectedBank?.id === bank.id && (
                                  <span className="absolute top-1 right-1 w-2 h-2 bg-black rounded-full" />
                                )}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Passo 2: Dados do Titular */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                          <div className="space-y-1">
                            <label className="text-[10px] font-mono text-gray-500 uppercase tracking-wider block font-bold">2. CPF do Titular da Conta</label>
                            <input
                              type="text"
                              required
                              placeholder="000.000.000-00"
                              value={payerCpf}
                              onChange={(e) => {
                                const v = e.target.value.replace(/\D/g, '');
                                let val = v;
                                if (v.length > 3) val = v.slice(0,3) + '.' + v.slice(3);
                                if (v.length > 6) val = val.slice(0,7) + '.' + val.slice(7);
                                if (v.length > 9) val = val.slice(0,11) + '-' + val.slice(11,13);
                                setPayerCpf(val.slice(0, 14));
                              }}
                              className="w-full bg-white border border-gray-200 text-xs p-3 focus:border-black focus:outline-hidden font-mono"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-mono text-gray-500 uppercase tracking-wider block font-bold">Nome Completo do Titular</label>
                            <input
                              type="text"
                              required
                              placeholder="Nome conforme registro no banco"
                              value={payerName}
                              onChange={(e) => setPayerName(e.target.value)}
                              className="w-full bg-white border border-gray-200 text-xs p-3 focus:border-black focus:outline-hidden font-sans uppercase"
                            />
                          </div>
                        </div>

                        {/* Botão para Conectar e Autorizar */}
                        <div className="pt-2 text-center">
                          <button
                            type="button"
                            disabled={!selectedBank || !payerCpf || !payerName}
                            onClick={() => {
                              if (!selectedBank) return;
                              setOpenBankingStatus('connecting');
                              setOpenBankingProgress(10);
                              
                              setTimeout(() => {
                                setOpenBankingStatus('authenticating');
                                setOpenBankingProgress(40);
                              }, 1200);

                              setTimeout(() => {
                                setOpenBankingStatus('authorizing');
                                setOpenBankingProgress(75);
                              }, 2400);

                              setTimeout(() => {
                                setOpenBankingStatus('completed');
                                setOpenBankingProgress(100);
                              }, 3600);
                            }}
                            className={`w-full sm:w-auto px-8 py-3.5 font-mono text-xs uppercase tracking-wider font-bold transition-all ${
                              selectedBank && payerCpf && payerName
                                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md'
                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            }`}
                          >
                            Autorizar Pagamento de R$ {grandTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </button>
                          {!selectedBank && (
                            <p className="text-[10px] text-gray-400 mt-2 font-mono">Selecione o seu banco para habilitar a autorização.</p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Estados de Progresso da Conexão Open Banking */}
                    {openBankingStatus !== 'idle' && openBankingStatus !== 'completed' && (
                      <div className="py-8 text-center space-y-6 max-w-md mx-auto animate-in fade-in duration-300">
                        <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
                          <Loader2 className="w-12 h-12 text-emerald-600 animate-spin" />
                          <span className="absolute text-[10px] font-mono font-bold text-emerald-700">{openBankingProgress}%</span>
                        </div>
                        
                        <div className="space-y-2">
                          <p className="text-xs font-mono uppercase tracking-wider font-bold text-gray-900 animate-pulse">
                            {openBankingStatus === 'connecting' && 'Estabelecendo Conexão Segura...'}
                            {openBankingStatus === 'authenticating' && 'Autenticando Titularidade Open Finance...'}
                            {openBankingStatus === 'authorizing' && 'Solicitando Autorização de Débito...'}
                          </p>
                          <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                            <div 
                              className="bg-emerald-600 h-full transition-all duration-300" 
                              style={{ width: `${openBankingProgress}%` }}
                            />
                          </div>
                          <p className="text-[10px] text-gray-500 font-sans leading-relaxed">
                            {openBankingStatus === 'connecting' && `Criando um canal criptografado de ponta a ponta com o ${selectedBank?.name}...`}
                            {openBankingStatus === 'authenticating' && `Validando as chaves de segurança e certificações para o CPF ${payerCpf}...`}
                            {openBankingStatus === 'authorizing' && `Enviando a ordem de transferência de R$ ${grandTotal.toFixed(2)} para sua aprovação direta no app.`}
                          </p>
                        </div>
                        
                        <div className="bg-amber-500/10 border border-amber-500/20 p-3 text-[10px] text-amber-900 font-mono text-left space-y-1 rounded-xs">
                          <p className="font-bold uppercase">⚠️ Não feche esta tela</p>
                          <p className="font-sans leading-normal">Seu banco abrirá um consentimento de segurança de forma automatizada em segundo plano para o Iniciador de Pagamento Sarto S.A.</p>
                        </div>
                      </div>
                    )}

                    {/* Tela de Sucesso da Autorização do Open Banking */}
                    {openBankingStatus === 'completed' && (
                      <div className="space-y-4 animate-in zoom-in-95 duration-300 text-center">
                        <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-100 shadow-xs">
                          <Check className="w-6 h-6 stroke-[3px]" />
                        </div>
                        
                        <div className="space-y-1">
                          <h5 className="text-xs font-mono uppercase tracking-wider text-emerald-700 font-bold">Transferência Autorizada com Sucesso!</h5>
                          <p className="text-[11px] text-gray-500 font-sans max-w-md mx-auto">
                            O Open Banking confirmou a autorização do débito no seu banco {selectedBank?.name}. O pagamento foi processado instantaneamente através da chave Pix comercial.
                          </p>
                        </div>

                        {/* COMPROVANTE DETALHADO */}
                        <div className="bg-white border border-gray-200 p-4 rounded-xs text-left text-[10px] font-mono space-y-2 max-w-sm mx-auto shadow-xs text-gray-600">
                          <div className="text-center border-b border-gray-100 pb-2 mb-2 font-bold text-gray-900 uppercase tracking-wider text-[9px]">
                            Comprovante de Consentimento Open Finance
                          </div>
                          <div className="flex justify-between">
                            <span>ID de Consentimento:</span>
                            <span className="text-black font-semibold">ITP-{Math.floor(1000000 + Math.random() * 9000000)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Banco de Origem:</span>
                            <span className="text-black">{selectedBank?.name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Favorecido:</span>
                            <span className="text-black font-semibold">Sarto Imperial S.A.</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Chave Pix Favorecido:</span>
                            <span className="text-black">8b28...d2f4</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Titular:</span>
                            <span className="text-black truncate max-w-[150px] uppercase">{payerName}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>CPF Titular:</span>
                            <span className="text-black">{payerCpf}</span>
                          </div>
                          <div className="flex justify-between border-t border-gray-100 pt-2 font-bold text-black text-[11px]">
                            <span>Valor Autorizado:</span>
                            <span className="text-emerald-600">R$ {grandTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                          </div>
                        </div>

                        <div className="flex justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setOpenBankingStatus('idle');
                              setOpenBankingProgress(0);
                            }}
                            className="px-4 py-2 text-[10px] font-mono uppercase border border-gray-200 hover:bg-gray-50 text-gray-500"
                          >
                            Alterar Banco / Conta
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Tab content 2: Interactive Card layout & form */}
                {paymentMethod === 'Cartão' && (
                  <div className="space-y-6 animate-in fade-in duration-250">
                    
                    {/* Visual CSS Interactive credit card representation */}
                    <div className="flex justify-center py-4">
                      <div className={`relative w-80 h-48 rounded-2xl shadow-xl p-6 text-white font-mono transition-all duration-700 transform [transform-style:preserve-3d] ${
                        cardFocused ? '[transform:rotateY(180deg)] bg-gray-900' : 'bg-gradient-to-br from-gray-900 via-amber-950 to-black'
                      }`}>
                        {/* CARD FRONT */}
                        <div className="absolute inset-0 p-6 flex flex-col justify-between [backface-visibility:hidden] z-10">
                          <div className="flex justify-between items-start">
                            <span className="text-[9px] tracking-widest text-amber-500 uppercase font-semibold">SARTO IMPERIAL SIGNATURE</span>
                            <div className="w-10 h-7 bg-amber-500/20 rounded-xs border border-amber-500/30 flex items-center justify-center">
                              <span className="w-4 h-4 rounded-full bg-white/20 -mr-1" />
                              <span className="w-4 h-4 rounded-full bg-amber-500/50" />
                            </div>
                          </div>
                          
                          {/* Card number chip */}
                          <div className="text-lg tracking-widest text-white/90 text-center py-2">
                            {cardNum || '•••• •••• •••• ••••'}
                          </div>

                          <div className="flex justify-between items-end">
                            <div className="text-left">
                              <span className="text-[8px] text-white/50 block uppercase">Titular do Cartão</span>
                              <span className="text-xs uppercase tracking-wider block truncate max-w-[180px]">{cardName || 'NOME IMPRESSO'}</span>
                            </div>
                            <div className="text-right">
                              <span className="text-[8px] text-white/50 block uppercase">Expira</span>
                              <span className="text-xs tracking-widest block">{cardExpiry || 'MM/AA'}</span>
                            </div>
                          </div>
                        </div>

                        {/* CARD BACK */}
                        <div className="absolute inset-0 p-6 flex flex-col justify-between [backface-visibility:hidden] [transform:rotateY(180deg)] bg-gray-950 rounded-2xl">
                          <div className="w-full h-10 bg-black -mx-6 mt-1" />
                          <div className="flex items-center justify-end gap-3 pt-2">
                            <span className="text-[7px] text-white/40 uppercase">Assinatura autorizada</span>
                            <div className="bg-white text-black font-mono text-xs px-2 py-1 text-right italic rounded-xs w-16">
                              {cardCvv || '•••'}
                            </div>
                          </div>
                          <p className="text-[6px] text-white/30 text-center leading-normal">
                            Este cartão é propriedade da Sarto Imperial, exclusivo para portadores qualificados em compras virtuais seguras.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Card inputs Form */}
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                      <div className="sm:col-span-8">
                        <label className="text-xs font-mono text-gray-600 uppercase tracking-wider block mb-1">Número do Cartão de Crédito</label>
                        <input
                          id="card-number-input"
                          type="text"
                          required
                          placeholder="0000 0000 0000 0000"
                          value={cardNum}
                          onChange={(e) => setCardNum(e.target.value.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, "$1 ").slice(0, 19))}
                          className="w-full bg-gray-50 border border-gray-200 text-xs p-3 focus:bg-white focus:border-black focus:outline-hidden font-mono"
                        />
                      </div>

                      <div className="sm:col-span-4">
                        <label className="text-xs font-mono text-gray-600 uppercase tracking-wider block mb-1">Parcelamento</label>
                        <select
                          id="card-installments-select"
                          value={cardInstallments}
                          onChange={(e) => setCardInstallments(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-200 text-xs p-3 focus:bg-white focus:border-black focus:outline-hidden font-mono"
                        >
                          {[...Array(10)].map((_, i) => {
                            const months = i + 1;
                            const installmentVal = grandTotal / months;
                            return (
                              <option key={months} value={months}>
                                {months}x de R$ {installmentVal.toFixed(2)} (Sem Juros)
                              </option>
                            );
                          })}
                        </select>
                      </div>

                      <div className="sm:col-span-12">
                        <label className="text-xs font-mono text-gray-600 uppercase tracking-wider block mb-1">Nome Gravado no Cartão</label>
                        <input
                          id="card-name-input"
                          type="text"
                          required
                          placeholder="CARLOS G SILVA"
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value.toUpperCase())}
                          className="w-full bg-gray-50 border border-gray-200 text-xs p-3 focus:bg-white focus:border-black focus:outline-hidden uppercase font-mono"
                        />
                      </div>

                      <div className="sm:col-span-6">
                        <label className="text-xs font-mono text-gray-600 uppercase tracking-wider block mb-1">Data de Expiração</label>
                        <input
                          id="card-expiry-input"
                          type="text"
                          required
                          placeholder="MM/AA"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value.replace(/\D/g, '').replace(/(\d{2})(\d{2})/, "$1/$2").slice(0, 5))}
                          className="w-full bg-gray-50 border border-gray-200 text-xs p-3 focus:bg-white focus:border-black focus:outline-hidden font-mono text-center"
                        />
                      </div>

                      <div className="sm:col-span-6">
                        <label className="text-xs font-mono text-gray-600 uppercase tracking-wider block mb-1">CVV (Código de Segurança)</label>
                        <input
                          id="card-cvv-input"
                          type="text"
                          required
                          placeholder="123"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                          onFocus={() => setCardFocused(true)} // flip
                          onBlur={() => setCardFocused(false)} // flip back
                          className="w-full bg-gray-50 border border-gray-200 text-xs p-3 focus:bg-white focus:border-black focus:outline-hidden font-mono text-center"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab content 3: Boleto Instructions */}
                {paymentMethod === 'Boleto' && (
                  <div className="bg-gray-50 p-6 border border-gray-100 rounded-xs space-y-4 text-center animate-in fade-in duration-250">
                    <div className="max-w-md mx-auto space-y-2">
                      <Barcode className="w-16 h-16 mx-auto text-gray-600" />
                      <p className="text-xs font-mono font-bold text-gray-900 uppercase">Boleto Bancário Digital Sarto S/A</p>
                      <p className="text-xs text-gray-500">
                        O boleto será gerado após a confirmação. O pagamento pode ser feito em qualquer banco ou aplicativo de pagamentos. O prazo de compensação é de até 1 dia útil após o pagamento.
                      </p>
                    </div>

                    <div className="max-w-md mx-auto border border-dashed border-gray-300 p-3 bg-white font-mono text-[10px] text-gray-600 flex items-center justify-between">
                      <span>34191.79001 01043.513184 91020.150008 7 981200000{grandTotal.toFixed(0)}</span>
                      <button 
                        onClick={() => alert('Código do boleto copiado!')} 
                        className="text-[10px] text-amber-700 underline font-semibold flex items-center gap-1 shrink-0"
                      >
                        Copiar Linha Digitável
                      </button>
                    </div>
                  </div>
                )}

                {/* Final step buttons */}
                <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="text-xs font-mono uppercase tracking-widest text-gray-500 hover:text-black flex items-center gap-1.5"
                  >
                    <ChevronLeft className="w-4 h-4" /> Voltar
                  </button>

                  <div className="flex flex-col items-end gap-1.5">
                    {paymentMethod === 'Open Banking' && openBankingStatus !== 'completed' && (
                      <span className="text-[10px] font-mono text-rose-600 animate-pulse uppercase tracking-wider font-bold">
                        ⚠️ Autorização Open Banking Pendente
                      </span>
                    )}
                    <button
                      id="finalize-checkout-order-btn"
                      disabled={paymentMethod === 'Open Banking' && openBankingStatus !== 'completed'}
                      onClick={finalizeOrder}
                      className={`font-semibold text-xs font-mono px-8 py-4 uppercase tracking-[0.2em] flex items-center gap-2 shadow-lg transition-all ${
                        paymentMethod === 'Open Banking' && openBankingStatus !== 'completed'
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                          : 'bg-amber-500 hover:bg-amber-600 text-black cursor-pointer'
                      }`}
                    >
                      Concluir Pedido <Check className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* RIGHT: Sophisticated Cart Resumo summary sticky (Lg: 5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="border border-gray-100 bg-white rounded-xs p-6 shadow-xs space-y-6">
              <h3 className="text-xs font-mono uppercase tracking-wider text-black font-semibold flex items-center gap-1.5 border-b border-gray-50 pb-3">
                <ShoppingBag className="w-4 h-4 text-amber-600" /> Resumo do Pedido ({cartItems.length})
              </h3>

              {/* Items scroll rail mini */}
              <div className="divide-y divide-gray-50 max-h-64 overflow-y-auto pr-1">
                {cartItems.map((item) => (
                  <div key={item.id} className="py-3 first:pt-0 flex gap-3">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      referrerPolicy="no-referrer"
                      className="w-10 h-12 object-cover object-top rounded-xs border border-gray-100 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-sans text-gray-900 truncate">{item.product.name}</h4>
                      <p className="text-[10px] text-gray-400 font-mono">
                        Qtd: {item.quantity} • Tam: {item.selectedSize}
                      </p>
                    </div>
                    <span className="text-xs font-mono text-gray-900 font-medium">
                      R$ {(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Math summaries */}
              <div className="space-y-2 border-t border-gray-100 pt-4 text-xs font-sans">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-mono">R$ {subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-amber-700 font-semibold">
                    <span>Desconto do Cupom</span>
                    <span className="font-mono">-R$ {discountAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                )}

                {pixDiscount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Desconto {paymentMethod === 'Open Banking' ? 'Open Banking' : 'PIX'} à vista (5%)</span>
                    <span className="font-mono">-R$ {pixDiscount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                )}

                <div className="flex justify-between text-gray-600">
                  <span>Envio e Frete</span>
                  <span className="font-mono">{shippingCost === 0 ? 'Grátis' : `R$ ${shippingCost.toFixed(2)}`}</span>
                </div>
              </div>

              {/* Grand Total */}
              <div className="flex justify-between items-baseline pt-4 border-t border-gray-100">
                <span className="text-xs font-mono uppercase tracking-wider font-semibold text-black">Total a Pagar</span>
                <span className="text-xl font-mono font-bold text-black">
                  R$ {grandTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>

              {/* Secured lock note */}
              <div className="p-3 bg-gray-50 text-[10px] text-gray-400 font-sans flex items-center gap-2 justify-center rounded-xs">
                <Lock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                Dados criptografados via protocolo TLS 1.3 de ponta-a-ponta.
              </div>
            </div>
          </div>

        </div>
      ) : (
        /* STEP 4: Success confirmation Screen */
        <div className="max-w-2xl mx-auto bg-white border border-gray-100 rounded-xs shadow-lg p-8 sm:p-12 text-center space-y-6 sm:space-y-8 animate-in zoom-in-95 duration-500">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-100 shadow-xs">
            <Check className="w-8 h-8 stroke-[3px]" />
          </div>

          <div className="space-y-3">
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-amber-600 font-semibold block">Pedido Processado com Sucesso</span>
            <h2 className="text-2xl sm:text-3xl font-sans font-bold text-gray-900 tracking-tight">Obrigado pela sua Compra!</h2>
            <p className="text-sm text-gray-500 max-w-md mx-auto">
              Nossa equipe está separando suas peças com carinho. A confirmação detalhada do pedido foi enviada para o seu e-mail cadastrado.
            </p>
          </div>

          {/* Details of confirmation */}
          {createdOrder && (
            <div className="bg-gray-50 border border-gray-100 rounded-xs p-6 max-w-lg mx-auto text-left space-y-3 font-mono text-xs text-gray-700">
              <div className="flex justify-between font-bold border-b border-gray-200 pb-2">
                <span>Código do Pedido:</span>
                <span className="text-black">{createdOrder.id}</span>
              </div>
              <div className="flex justify-between">
                <span>Data do Pedido:</span>
                <span>{new Date(createdOrder.date).toLocaleDateString('pt-BR')}</span>
              </div>
              <div className="flex justify-between">
                <span>Forma de Pagamento:</span>
                <span>{createdOrder.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span>Método de Entrega:</span>
                <span>{shippingMethod === 'standard' ? 'Sartor Express' : 'Sedex Premium'}</span>
              </div>
              <div className="flex justify-between text-black font-semibold border-t border-gray-200 pt-2 text-sm">
                <span>Total Pago:</span>
                <span>R$ {createdOrder.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          )}

          {/* Return CTA */}
          <div className="pt-4 flex flex-col sm:flex-row justify-center gap-3">
            <button
              id="back-to-home-checkout"
              onClick={onClose}
              className="bg-black hover:bg-gray-800 text-white text-xs font-mono px-8 py-3.5 uppercase tracking-widest transition-colors cursor-pointer"
            >
              Voltar para a Home
            </button>
            
            <button
              id="view-orders-checkout"
              onClick={onClose} // in parent App we will route to 'customer'
              className="bg-transparent text-gray-600 hover:text-black border border-gray-300 hover:border-black text-xs font-mono px-8 py-3.5 uppercase tracking-widest transition-all cursor-pointer"
            >
              Acompanhar Meus Pedidos
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
