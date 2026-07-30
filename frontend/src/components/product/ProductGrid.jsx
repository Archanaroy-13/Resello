import React from 'react';
import { ProductCard } from './ProductCard';
import { SkeletonCard } from '../common/SkeletonCard';
import { EmptyState } from '../common/EmptyState';

export const ProductGrid = ({ products = [], loading = false, onToast, emptyTitle, emptyDescription }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <EmptyState
        title={emptyTitle || 'No listings found'}
        description={emptyDescription || 'Try adjusting your search keywords or filter settings.'}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} onToast={onToast} />
      ))}
    </div>
  );
};
