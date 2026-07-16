/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Banner } from '../types';
import { INITIAL_BANNERS } from '../data/mockProducts';

interface HeroBannerProps {
  onCtaClick: (categoryOrFilter: string) => void;
}

export default function HeroBanner({ onCtaClick }: HeroBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const banners = INITIAL_BANNERS;

  // Auto play carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 6500);
    return () => clearInterval(timer);
  }, [banners.length]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  return (
    <div id="hero-carousel" className="relative h-[480px] sm:h-[600px] lg:h-[680px] w-full overflow-hidden bg-black">
      {/* Slider Banners */}
      {banners.map((banner, index) => {
        const isActive = index === currentIndex;
        return (
          <div
            key={banner.id}
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
              isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            {/* Dark sophisticated overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10" />
            
            {/* Responsive Background image */}
            <img
              src={banner.image}
              alt={banner.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-top transform scale-102 hover:scale-105 transition-transform duration-10000"
            />

            {/* Premium content container */}
            <div className="absolute inset-0 flex items-center z-20">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="max-w-2xl text-left text-white space-y-4 sm:space-y-6">
                  {/* Subtle luxurious gold micro heading */}
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-500 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                    <span className="text-[10px] sm:text-xs font-mono tracking-[0.3em] uppercase">Sartorial Haute Couture</span>
                  </div>

                  {/* Main heading */}
                  <h1 className="text-3xl sm:text-5xl lg:text-6xl font-sans font-bold tracking-tight leading-tight text-white">
                    {banner.title}
                  </h1>

                  {/* Subtitle description */}
                  <p className="text-sm sm:text-lg text-gray-300 font-sans font-light leading-relaxed max-w-lg">
                    {banner.subtitle}
                  </p>

                  {/* Call to action button */}
                  <div className="pt-4 flex flex-wrap gap-4">
                    <button
                      onClick={() => onCtaClick(banner.link)}
                      className="group bg-white text-black hover:bg-black hover:text-white hover:border-white border border-transparent px-8 py-3.5 sm:py-4 text-xs font-mono uppercase tracking-[0.2em] transition-all duration-300 flex items-center gap-2 shadow-lg"
                    >
                      Comprar Agora
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform" />
                    </button>
                    
                    <button
                      onClick={() => onCtaClick('Premium')}
                      className="bg-transparent text-white hover:bg-white/10 border border-white/30 hover:border-white px-8 py-3.5 sm:py-4 text-xs font-mono uppercase tracking-[0.2em] transition-all duration-300"
                    >
                      Ver Coleção
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Manual Left Arrow */}
      <button
        id="hero-prev-btn"
        onClick={handlePrev}
        className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-30 p-2 sm:p-3 rounded-full bg-black/30 hover:bg-black text-white hover:text-amber-500 border border-white/10 transition-all duration-300 cursor-pointer"
        aria-label="Anterior"
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      {/* Manual Right Arrow */}
      <button
        id="hero-next-btn"
        onClick={handleNext}
        className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-30 p-2 sm:p-3 rounded-full bg-black/30 hover:bg-black text-white hover:text-amber-500 border border-white/10 transition-all duration-300 cursor-pointer"
        aria-label="Próximo"
      >
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      {/* Indicators / Progress bars */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3">
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className="group py-2 focus:outline-hidden"
          >
            <div className={`h-1.5 transition-all duration-500 rounded-full ${
              i === currentIndex ? 'w-8 bg-amber-500' : 'w-2 bg-white/40 hover:bg-white'
            }`} />
          </button>
        ))}
      </div>
    </div>
  );
}
