/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Lock, Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react';

interface PasswordGateProps {
  title: string;
  subtitle: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function PasswordGate({ title, subtitle, onSuccess, onCancel }: PasswordGateProps) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'Ale#2011') {
      setError('');
      onSuccess();
    } else {
      setError('Senha de acesso incorreta. Por favor, tente novamente.');
    }
  };

  return (
    <div id="password-gate-container" className="max-w-md mx-auto my-16 px-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="bg-white border border-gray-100 p-8 rounded-xs shadow-xs space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto text-amber-600 mb-2">
            <Lock className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-sans font-bold tracking-tight text-gray-900">{title}</h2>
          <p className="text-xs text-gray-500 font-sans leading-relaxed">{subtitle}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block">
              Senha de Acesso
            </label>
            <div className="relative">
              <input
                id="password-gate-input"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                placeholder="Digite a senha..."
                className="w-full pl-3 pr-10 py-2.5 text-xs border border-gray-200 rounded-xs focus:outline-hidden focus:border-black transition-colors bg-gray-50/50"
                required
                autoFocus
              />
              <button
                id="password-gate-toggle-visibility"
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-black transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-800 text-xs p-3 rounded-xs border border-red-100 flex items-center gap-2 font-sans">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex items-center gap-3 pt-2">
            <button
              id="password-gate-cancel-btn"
              type="button"
              onClick={onCancel}
              className="flex-1 py-2.5 px-4 text-xs font-mono uppercase tracking-wider text-gray-500 hover:text-black hover:bg-gray-50 border border-transparent rounded-xs transition-colors"
            >
              Voltar
            </button>
            <button
              id="password-gate-submit-btn"
              type="submit"
              className="flex-1 py-2.5 px-4 text-xs font-mono uppercase tracking-wider bg-black text-white hover:bg-gray-900 rounded-xs transition-all flex items-center justify-center gap-2 font-bold"
            >
              Acessar <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
