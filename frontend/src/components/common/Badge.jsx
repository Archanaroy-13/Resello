import React from 'react';

export const Badge = ({ status, className = '' }) => {
  const isSold = status === 'Sold';

  if (isSold) {
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-600 text-white shadow-sm tracking-wider uppercase ${className}`}>
        SOLD
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200 ${className}`}>
      Available
    </span>
  );
};
