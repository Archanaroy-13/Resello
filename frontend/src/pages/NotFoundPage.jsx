import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, ArrowLeft } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 text-center">
      <div className="max-w-md bg-white rounded-3xl border border-slate-100 p-8 shadow-soft space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-extrabold text-forest-900">404 - Page Not Found</h1>
        <p className="text-xs text-slate-500">
          The page or product route you requested does not exist or has been relocated.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-sage-500 hover:bg-sage-600 text-white font-bold text-xs transition-all shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return To Homepage</span>
        </Link>
      </div>
    </div>
  );
};
