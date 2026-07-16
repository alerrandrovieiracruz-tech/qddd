/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Users, 
  ShoppingBag, 
  MapPin, 
  Mail, 
  Phone,
  FileText,
  CreditCard, 
  Search, 
  Filter, 
  Calendar, 
  ShieldCheck, 
  Truck, 
  Clock, 
  AlertCircle,
  TrendingUp
} from 'lucide-react';
import { Product, Order, Coupon, Banner } from '../types';

interface AdminPanelProps {
  products: Product[];
  orders: Order[];
  coupons: Coupon[];
  banners: Banner[];
  onAddProduct: (prod: Product) => void;
  onUpdateProduct: (prod: Product) => void;
  onDeleteProduct: (id: string) => void;
  onUpdateOrderStatus: (orderId: string, status: Order['status']) => void;
  onAddCoupon: (coupon: Coupon) => void;
  onDeleteCoupon: (id: string) => void;
  onAddBanner: (banner: Banner) => void;
  onDeleteBanner: (id: string) => void;
  onDeleteReview: (productId: string, reviewId: string) => void;
}

export default function AdminPanel({
  products,
  orders,
  onUpdateOrderStatus
}: AdminPanelProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // Filter orders based on search (customer name, email, order ID, city) and status
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.shippingAddress?.city || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'All' || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Calculate stats strictly related to buyers & orders
  const totalBuyersCount = new Set(orders.map(o => o.customerEmail)).size;
  const pendingOrdersCount = orders.filter(o => o.status === 'Pendente' || o.status === 'Processando').length;
  const deliveredOrdersCount = orders.filter(o => o.status === 'Entregue').length;

  return (
    <div id="admin-panel-container" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      
      {/* Title & Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-sans font-bold tracking-tight text-gray-900 flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-amber-600" /> Painel de Controle: Informações do Comprador
          </h1>
          <p className="text-xs text-gray-500 font-sans mt-1">
            Espaço administrativo exclusivo para monitoramento de compradores, dados cadastrais, endereços de entrega e status de pedidos.
          </p>
        </div>
      </div>

      {/* Buyer & Order Stats Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Stat 1: Total Buyers */}
        <div className="bg-white border border-gray-100 p-5 rounded-xs flex items-center justify-between shadow-xs">
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block">Clientes Únicos</span>
            <p className="text-xl sm:text-2xl font-mono font-bold text-black">{totalBuyersCount}</p>
            <span className="text-[10px] text-gray-500 font-mono">Compradores cadastrados</span>
          </div>
          <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 shrink-0">
            <Users className="w-5 h-5 text-amber-600" />
          </div>
        </div>

        {/* Stat 2: Pending Processing */}
        <div className="bg-white border border-gray-100 p-5 rounded-xs flex items-center justify-between shadow-xs">
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block">Aguardando Envio</span>
            <p className="text-xl sm:text-2xl font-mono font-bold text-black">{pendingOrdersCount}</p>
            <span className="text-[10px] text-amber-600 font-mono flex items-center gap-1">
              <Clock className="w-3 h-3" /> Requer atenção
            </span>
          </div>
          <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 shrink-0">
            <Clock className="w-5 h-5 text-amber-600" />
          </div>
        </div>

        {/* Stat 3: Completed Shipments */}
        <div className="bg-white border border-gray-100 p-5 rounded-xs flex items-center justify-between shadow-xs">
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block">Entregues</span>
            <p className="text-xl sm:text-2xl font-mono font-bold text-black">{deliveredOrdersCount}</p>
            <span className="text-[10px] text-emerald-600 font-mono">Concluídos com sucesso</span>
          </div>
          <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 shrink-0">
            <Truck className="w-5 h-5 text-emerald-600" />
          </div>
        </div>

      </div>

      {/* Interactive Filtering and Search controls */}
      <div className="bg-white border border-gray-100 p-4 rounded-xs shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Search input field */}
        <div className="relative w-full sm:max-w-md">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            id="admin-search-buyer"
            type="text"
            placeholder="Buscar por nome do comprador, e-mail, código ou cidade..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs border border-gray-200 rounded-xs bg-gray-50 focus:bg-white focus:outline-hidden focus:border-black transition-colors"
          />
        </div>

        {/* Status filtering dropdown */}
        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
          <Filter className="w-3.5 h-3.5 text-gray-400 shrink-0" />
          <span className="text-xs font-mono text-gray-500 uppercase">Filtrar Status:</span>
          <select
            id="admin-status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white border border-gray-200 p-2 text-xs rounded-xs font-mono focus:outline-hidden"
          >
            <option value="All">Todos os Pedidos</option>
            <option value="Pendente">Pendente</option>
            <option value="Processando">Processando</option>
            <option value="Enviado">Enviado</option>
            <option value="Entregue">Entregue</option>
            <option value="Cancelado">Cancelado</option>
          </select>
        </div>

      </div>

      {/* Main content: Buyers & Orders Listings */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-mono uppercase tracking-widest font-bold text-gray-900 flex items-center gap-1.5">
            <ShoppingBag className="w-4 h-4 text-black" /> Listagem Detalhada de Compradores ({filteredOrders.length} encontrados)
          </h2>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="bg-white border border-gray-100 p-12 text-center rounded-xs">
            <AlertCircle className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500 font-sans">Nenhum comprador ou pedido encontrado com os filtros atuais.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <div 
                key={order.id} 
                className="bg-white border border-gray-100 rounded-xs shadow-xs overflow-hidden hover:border-gray-200 transition-all"
              >
                
                {/* Header of the Buyer Card */}
                <div className="bg-gray-50 px-5 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-xs font-mono font-bold text-black bg-white border border-gray-200 px-2.5 py-1 rounded-xs shadow-2xs">
                      #{order.id}
                    </span>
                    <span className="text-xs text-gray-400 font-mono flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> {order.date}
                    </span>
                  </div>

                  {/* Operational Status selector directly inside header */}
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">Status:</span>
                    <select
                      id={`order-status-${order.id}`}
                      value={order.status}
                      onChange={(e) => onUpdateOrderStatus(order.id, e.target.value as any)}
                      className={`p-1.5 rounded-xs border font-mono text-[10px] tracking-wider uppercase focus:outline-hidden ${
                        order.status === 'Entregue' 
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                          : order.status === 'Processando' 
                            ? 'bg-amber-50 text-amber-800 border-amber-200' 
                            : order.status === 'Cancelado'
                              ? 'bg-red-50 text-red-800 border-red-200'
                              : 'bg-blue-50 text-blue-800 border-blue-200'
                      }`}
                    >
                      <option value="Pendente">Pendente</option>
                      <option value="Processando">Processando</option>
                      <option value="Enviado">Enviado</option>
                      <option value="Entregue">Entregue</option>
                      <option value="Cancelado">Cancelado</option>
                    </select>
                  </div>
                </div>

                {/* Body details grid */}
                <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-8 divide-y md:divide-y-0 md:divide-x divide-gray-100">
                  
                  {/* Section 1: Customer Profile Details & Shipping Address */}
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-[10px] font-mono uppercase tracking-widest text-gray-400 mb-2.5 flex items-center gap-1">
                        <Users className="w-3 h-3 text-amber-600" /> Cadastro do Comprador
                      </h4>
                      <div className="space-y-1.5">
                        <p className="text-sm font-semibold text-black leading-snug">{order.customerName}</p>
                        <p className="text-xs text-gray-600 font-mono flex items-center gap-2 truncate" title={order.customerEmail}>
                          <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0" /> {order.customerEmail}
                        </p>
                        {order.customerPhone && (
                          <p className="text-xs text-gray-600 font-mono flex items-center gap-2" title={order.customerPhone}>
                            <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" /> {order.customerPhone}
                          </p>
                        )}
                        {order.customerCpf && (
                          <p className="text-xs text-gray-600 font-mono flex items-center gap-2" title={order.customerCpf}>
                            <FileText className="w-3.5 h-3.5 text-gray-400 shrink-0" /> CPF: {order.customerCpf}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Shipping Address detail */}
                    <div className="pt-4 border-t border-gray-50">
                      <h4 className="text-[10px] font-mono uppercase tracking-widest text-gray-400 mb-2.5 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-amber-600" /> Endereço de Entrega
                      </h4>
                      {order.shippingAddress ? (
                        <div className="text-xs text-gray-600 font-sans space-y-1.5 leading-relaxed">
                          <p className="font-semibold text-gray-800">
                            {order.shippingAddress.street}, {order.shippingAddress.number}
                            {order.shippingAddress.complement && ` - ${order.shippingAddress.complement}`}
                          </p>
                          <p><span className="text-gray-400 font-mono">Bairro:</span> {order.shippingAddress.neighborhood}</p>
                          <p><span className="text-gray-400 font-mono">Cidade/UF:</span> {order.shippingAddress.city} - {order.shippingAddress.state}</p>
                          <p className="font-mono text-[11px] text-gray-700 bg-gray-50 inline-block px-2 py-0.5 border border-gray-100 rounded-2xs">CEP: {order.shippingAddress.zipCode}</p>
                        </div>
                      ) : (
                        <p className="text-xs text-gray-400 italic">Nenhum endereço cadastrado para esta remessa.</p>
                      )}
                    </div>
                  </div>

                  {/* Section 2: Items purchased & Payment Method (no prices) */}
                  <div className="md:pl-8 space-y-6 pt-6 md:pt-0">
                    <div>
                      <h4 className="text-[10px] font-mono uppercase tracking-widest text-gray-400 mb-2.5 flex items-center gap-1">
                        <ShoppingBag className="w-3 h-3 text-black" /> Artigos Adquiridos ({order.items.reduce((acc, i) => acc + i.quantity, 0)} un)
                      </h4>

                      <div className="divide-y divide-gray-100 max-h-[220px] overflow-y-auto pr-1">
                        {order.items.map((item, index) => (
                          <div key={index} className="py-2.5 flex gap-3 items-center">
                            <img 
                              src={item.image} 
                              alt={item.name} 
                              className="w-10 h-12 object-cover bg-gray-50 border border-gray-100 shrink-0"
                              referrerPolicy="no-referrer"
                            />
                            <div className="flex-grow min-w-0">
                              <p className="text-xs font-semibold text-black truncate leading-snug">{item.name}</p>
                              <p className="text-[10px] text-gray-500 font-mono flex items-center gap-2 mt-0.5">
                                <span>Tam: <strong className="text-black font-semibold">{item.size}</strong></span>
                                <span className="inline-flex items-center gap-1">
                                  Cor: 
                                  <span 
                                    className="w-2.5 h-2.5 rounded-full border border-gray-300 shrink-0 inline-block"
                                    style={{ backgroundColor: item.color }}
                                  />
                                </span>
                              </p>
                            </div>
                            <div className="text-right shrink-0">
                              <p className="text-xs font-mono font-bold text-gray-900 bg-gray-50 px-2 py-1 border border-gray-100 rounded-2xs">{item.quantity} un</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Simple Payment Mode Indicator (no money amount) */}
                    <div className="pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-2 text-xs font-mono text-gray-600 bg-amber-500/5 border border-amber-500/10 px-3 py-2.5 rounded-xs">
                        <CreditCard className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>Forma de Pagamento Preferencial: <strong className="text-black font-bold uppercase">{order.paymentMethod}</strong></span>
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
