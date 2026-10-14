import React, { useState, useEffect, useRef } from 'react';
import { Lock, KeyRound, ShieldAlert, X, Check, ArrowRight, Eye, EyeOff, Sparkles } from 'lucide-react';
import { GioLogo } from './GioLogo';

interface StaffAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

// Default staff PINs accepted: 0443 (last 4 of Gio's phone 081 299 0443), 2024, or 1234
const VALID_PINS = ['0443', '2024', '1234'];

export const StaffAuthModal: React.FC<StaffAuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showPin, setShowPin] = useState(false);
  const [rememberSession, setRememberSession] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setPin('');
      setError(null);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const cleanPin = pin.trim();
    if (VALID_PINS.includes(cleanPin)) {
      if (rememberSession) {
        sessionStorage.setItem('gio_staff_authenticated', 'true');
      }
      setError(null);
      onSuccess();
    } else {
      setError('Invalid staff security PIN. Please enter the authorized PIN (e.g. 0443).');
      inputRef.current?.select();
    }
  };

  const handleQuickDemoAccess = () => {
    setPin('0443');
    if (rememberSession) {
      sessionStorage.setItem('gio_staff_authenticated', 'true');
    }
    setTimeout(() => {
      onSuccess();
    }, 200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div 
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Banner */}
        <div className="bg-slate-900 text-white px-6 py-5 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sky-400">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base text-white tracking-wide">FOUNDER / ADMIN PORTAL</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-400/30">
                  Command Center
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Gio's Laundromat · Founder &amp; Operations Command
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Cancel and close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6">
          <div className="flex justify-center mb-5">
            <GioLogo size="sm" variant="dark" />
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 mb-5 flex items-start gap-2.5 text-xs text-amber-900">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Founder / Admin Command Center:</span> Enter your authorized founder security PIN to open the command center dashboard, today's bookings, and live 10-stage dispatch pipeline.
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Staff Security PIN
              </label>
              <div className="relative">
                <input
                  ref={inputRef}
                  type={showPin ? 'text' : 'password'}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  value={pin}
                  onChange={(e) => {
                    setPin(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="Enter 4-digit PIN (e.g. 0443)"
                  className="w-full pl-11 pr-12 py-3 bg-slate-50 border border-slate-300 rounded-xl text-base font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00AEEF] focus:border-transparent transition-all tracking-widest text-center"
                />
                <KeyRound className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600"
                  tabIndex={-1}
                >
                  {showPin ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {error && (
                <p className="mt-2 text-xs font-medium text-rose-600 flex items-center gap-1.5 animate-shake">
                  <span>{error}</span>
                </p>
              )}
            </div>

            <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberSession}
                  onChange={(e) => setRememberSession(e.target.checked)}
                  className="w-4 h-4 text-[#00AEEF] rounded border-slate-300 focus:ring-[#00AEEF]"
                />
                <span>Remember this session</span>
              </label>

              <button
                type="button"
                onClick={handleQuickDemoAccess}
                className="text-xs font-semibold text-[#00AEEF] hover:underline flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3" />
                <span>Fill Staff PIN (0443)</span>
              </button>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="w-1/2 py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 text-sm font-semibold transition-colors"
              >
                Back to Site
              </button>
              <button
                type="submit"
                disabled={!pin.trim()}
                className="w-1/2 py-2.5 px-4 rounded-xl bg-[#00AEEF] hover:bg-sky-500 disabled:opacity-50 text-white text-sm font-bold shadow-md shadow-sky-100 flex items-center justify-center gap-2 transition-colors"
              >
                <span>Unlock Portal</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Alternative Methods Reference for Staff */}
          <div className="mt-6 pt-5 border-t border-slate-200">
            <h5 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
              Authorized Staff Access Methods
            </h5>
            <ul className="text-xs text-slate-600 space-y-1.5 bg-slate-50 p-3 rounded-lg border border-slate-200">
              <li className="flex items-center justify-between">
                <span>Keyboard Shortcut:</span>
                <kbd className="px-2 py-0.5 rounded bg-white border border-slate-300 font-mono text-[11px] font-bold text-slate-700 shadow-xs">
                  Ctrl + Shift + A
                </kbd>
              </li>
              <li className="flex items-center justify-between">
                <span>Direct URL Route:</span>
                <span className="font-mono text-[11px] text-[#00AEEF] font-semibold">/#admin</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Discreet Footer Lock:</span>
                <span className="text-slate-500">Subtle lock icon in footer copyright</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
