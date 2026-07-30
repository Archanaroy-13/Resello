import React from 'react';

export const SkeletonCard = () => {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-3 shadow-soft animate-pulse flex flex-col justify-between h-[360px]">
      <div className="w-full h-48 bg-slate-200 rounded-xl mb-3"></div>
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <div className="h-4 bg-slate-200 rounded w-1/3"></div>
          <div className="h-4 bg-slate-200 rounded w-1/4"></div>
        </div>
        <div className="h-5 bg-slate-200 rounded w-4/5"></div>
        <div className="h-4 bg-slate-200 rounded w-1/2"></div>
      </div>
      <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
        <div className="w-7 h-7 rounded-full bg-slate-200"></div>
        <div className="h-3 bg-slate-200 rounded w-1/3"></div>
      </div>
    </div>
  );
};
