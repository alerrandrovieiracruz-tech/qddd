/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Instagram, 
  Facebook, 
  Mail, 
  Send, 
  Check, 
  ShieldCheck, 
  CreditCard, 
  Truck, 
  MapPin, 
  MessageSquare
} from 'lucide-react';

interface FooterProps {
  onNavClick: (tab: 'home' | 'camisas' | 'calcas' | 'promocoes' | 'novidades' | 'contato' | 'customer' | 'admin') => void;
}

export default function Footer({ onNavClick }: FooterProps) {
  const [emailInput, setEmailInput] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    setSubscribed(true);
    setEmailInput('');
    setTimeout(() => setSubscribed(false), 5000);
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer id="app-footer" className="bg-[#111111] text-gray-300 font-sans border-t border-gray-900">
      
      {/* Top corporate value props rail */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-b border-gray-800">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs font-sans">
          
          <div className="flex items-center gap-3.5 p-2">
            <Truck className="w-8 h-8 text-amber-500 shrink-0" />
            <div>
              <h4 className="font-mono uppercase text-white font-bold tracking-wider mb-0.5">Envio Segurado</h4>
              <p className="text-gray-400">Frete grátis em todas as compras acima de R$ 400.</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-2">
            <ShieldCheck className="w-8 h-8 text-amber-500 shrink-0" />
            <div>
              <h4 className="font-mono uppercase text-white font-bold tracking-wider mb-0.5">Troca Simplificada</h4>
              <p className="text-gray-400">Primeira troca 100% gratuita em até 30 dias de uso.</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-2">
            <CreditCard className="w-8 h-8 text-amber-500 shrink-0" />
            <div>
              <h4 className="font-mono uppercase text-white font-bold tracking-wider mb-0.5">Parcelamento Facilitado</h4>
              <p className="text-gray-400">Em até 10x sem juros ou 5% de desconto no PIX.</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-2">
            <MapPin className="w-8 h-8 text-amber-500 shrink-0" />
            <div>
              <h4 className="font-mono uppercase text-white font-bold tracking-wider mb-0.5">Showroom Presencial</h4>
              <p className="text-gray-400">Visite nosso showroom exclusivo em São Paulo, SP.</p>
            </div>
          </div>

        </div>
      </div>

      {/* Main footer contents map */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Col 1: Brand details (Lg: 4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <button 
              onClick={() => onNavClick('home')}
              className="text-left"
            >
              <span className="font-sans text-xl font-bold tracking-[0.25em] text-white block">
                SARTO
              </span>
              <span className="font-mono text-[9px] tracking-[0.45em] text-amber-500 block uppercase font-medium">
                IMPERIAL
              </span>
            </button>
            
            <p className="text-xs text-gray-400 leading-relaxed max-w-sm">
              Criamos vestimentas de luxo com cortes impecáveis e tecidos de altíssima nobreza. Inspirada na alfaiataria italiana clássica para proporcionar elegância duradoura ao cavalheiro moderno.
            </p>

            <div className="flex items-center gap-3.5 pt-2">
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noreferrer" 
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-amber-500 hover:text-black flex items-center justify-center transition-all text-gray-400"
                title="Siga no Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noreferrer" 
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-amber-500 hover:text-black flex items-center justify-center transition-all text-gray-400"
                title="Curta no Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a 
                href="mailto:suporte@sartoimperial.com" 
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-amber-500 hover:text-black flex items-center justify-center transition-all text-gray-400"
                title="Mande um E-mail"
              >
                <Mail className="w-4 h-4" />
              </a>
              <a 
                href="https://wa.me/5511999999999" 
                target="_blank" 
                rel="noreferrer" 
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-amber-500 hover:text-black flex items-center justify-center transition-all text-gray-400"
                title="Converse via WhatsApp"
              >
                {/* Custom representation */}
                <MessageSquare className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Categories Shortcuts (Lg: 2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="font-mono uppercase text-white font-bold tracking-wider text-xs border-l-2 border-amber-500 pl-2.5">Coleções</h4>
            <ul className="space-y-2.5 text-xs">
              <li><button onClick={() => onNavClick('camisas')} className="text-gray-400 hover:text-white hover:translate-x-1.5 transition-transform block">Camisas Sociais</button></li>
              <li><button onClick={() => onNavClick('camisas')} className="text-gray-400 hover:text-white hover:translate-x-1.5 transition-transform block">Camisas Slim Fit</button></li>
              <li><button onClick={() => onNavClick('calcas')} className="text-gray-400 hover:text-white hover:translate-x-1.5 transition-transform block">Calças de Alfaiataria</button></li>
              <li><button onClick={() => onNavClick('calcas')} className="text-gray-400 hover:text-white hover:translate-x-1.5 transition-transform block">Calças Chino Slim</button></li>
              <li><button onClick={() => onNavClick('promocoes')} className="text-gray-400 hover:text-white hover:translate-x-1.5 transition-transform block text-amber-500">Peças em Promoção</button></li>
            </ul>
          </div>

          {/* Col 3: Institutional Information Links (Lg: 3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="font-mono uppercase text-white font-bold tracking-wider text-xs border-l-2 border-amber-500 pl-2.5">Institucional</h4>
            <ul className="space-y-2.5 text-xs">
              <li><button onClick={() => alert('Quem Somos: Sarto Imperial é uma marca fundada sob as premissas da alfaiataria premium clássica para oferecer cortes nobres masculinos.')} className="text-gray-400 hover:text-white hover:translate-x-1.5 transition-transform block">Quem Somos</button></li>
              <li><button onClick={() => alert('Nossa Política de Privacidade: Suas informações cadastrais e de tráfego estão 100% criptografadas e seguras, e jamais serão vendidas a terceiros.')} className="text-gray-400 hover:text-white hover:translate-x-1.5 transition-transform block">Política de Privacidade</button></li>
              <li><button onClick={() => alert('Trocas Grátis: A Sarto Imperial garante a primeira troca grátis em até 30 dias após o recebimento do pedido.')} className="text-gray-400 hover:text-white hover:translate-x-1.5 transition-transform block">Políticas de Trocas</button></li>
              <li><button onClick={() => alert('Devoluções Rápidas: Você pode solicitar a devolução e reembolso total em até 7 dias corridos após a entrega.')} className="text-gray-400 hover:text-white hover:translate-x-1.5 transition-transform block">Políticas de Devoluções</button></li>
              <li><button onClick={() => onNavClick('contato')} className="text-gray-400 hover:text-white hover:translate-x-1.5 transition-transform block">Fale Conosco / Contato</button></li>
            </ul>
          </div>

          {/* Col 4: Newsletter sign-up form (Lg: 3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="font-mono uppercase text-white font-bold tracking-wider text-xs border-l-2 border-amber-500 pl-2.5">Informativo VIP</h4>
            <p className="text-xs text-gray-400 leading-relaxed">Inscreva seu e-mail na lista privada para receber convites de desfiles, pré-venda de coleções e cupons especiais de 10% OFF.</p>
            
            {subscribed ? (
              <div className="bg-amber-500/10 border border-amber-500/30 text-amber-500 rounded-xs p-3 text-xs flex items-center gap-2 animate-in fade-in duration-300">
                <Check className="w-4 h-4" />
                <span>Obrigado! Seu e-mail VIP foi inscrito com sucesso.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="flex bg-white/5 border border-white/10 rounded-xs overflow-hidden px-2 py-1 items-center focus-within:border-amber-500 transition-colors">
                  <input
                    id="newsletter-footer-email"
                    type="email"
                    required
                    placeholder="Seu melhor e-mail"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="bg-transparent text-xs text-white placeholder-gray-500 py-2.5 px-1 focus:outline-hidden w-full"
                  />
                  <button
                    id="newsletter-footer-submit"
                    type="submit"
                    className="p-2 bg-amber-500 text-black hover:bg-amber-600 transition-colors rounded-xs cursor-pointer shrink-0"
                    title="Inscrever"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            )}
          </div>

        </div>
      </div>

      {/* Bottom copyright disclaimer bar */}
      <div className="bg-[#0c0c0c] text-[10px] font-mono text-gray-500 py-6 px-4 border-t border-gray-900">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-3">
          <p>© {currentYear} SARTO IMPERIAL S/A. Todos os direitos reservados. CNPJ: 12.345.678/0001-90</p>
          <p className="text-[9px] text-gray-600">Desenvolvido em conformidade com as diretrizes de marcas de alta costura e luxo internacional.</p>
        </div>
      </div>

    </footer>
  );
}
