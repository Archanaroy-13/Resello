import React from 'react';
import { PackageSearch } from 'lucide-react';
import { Link } from 'react-router-dom';

export const EmptyState = ({
  title = 'No items found',
  description = 'We couldn’t find any products matching your search criteria.',
  actionText,
  actionLink,
  onActionClick,
  icon: Icon = PackageSearch
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4 bg-white rounded-3xl border border-slate-100 shadow-soft max-w-md mx-auto my-8">
      <div className="w-16 h-16 rounded-2xl bg-sage-50 text-sage-600 flex items-center justify-center mb-4">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-bold text-slate-800 mb-1">{title}</h3>
      <p className="text-slate-500 text-sm mb-6 max-w-xs">{description}</p>
      
      {actionLink ? (
        <Link
          to={actionLink}
          className="px-5 py-2.5 rounded-xl bg-sage-500 hover:bg-sage-600 text-white font-medium text-sm transition-colors shadow-sm"
        >
          {actionText}
        </Link>
      ) : actionText && onActionClick ? (
        <button
          onClick={onActionClick}
          className="px-5 py-2.5 rounded-xl bg-sage-500 hover:bg-sage-600 text-white font-medium text-sm transition-colors shadow-sm"
        >
          {actionText}
        </button>
      ) : null}
    </div>
  );
};
