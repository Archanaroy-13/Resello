import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast = ({ message, type = 'success', onClose, duration = 3500 }) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  const bgTypes = {
    success: 'bg-emerald-900 text-emerald-50 border-emerald-700',
    error: 'bg-red-900 text-red-50 border-red-700',
    info: 'bg-slate-900 text-slate-50 border-slate-700'
  };

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />,
    info: <Info className="w-5 h-5 text-sky-400 shrink-0" />
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-fadeIn max-w-sm">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl border ${bgTypes[type] || bgTypes.info}`}>
        {icons[type]}
        <p className="text-sm font-medium pr-2">{message}</p>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
