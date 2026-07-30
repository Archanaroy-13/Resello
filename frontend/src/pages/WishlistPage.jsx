import React from 'react';
import { useWishlist } from '../context/WishlistContext';
import { ProductGrid } from '../components/product/ProductGrid';
import { Heart } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';

export const WishlistPage = () => {
  const { wishlistItems, loading } = useWishlist();
  const outletContext = useOutletContext();
  const showToast = outletContext?.showToast;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex items-center gap-3 border-b border-slate-100 pb-6">
        <div className="w-10 h-10 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center">
          <Heart className="w-5 h-5 fill-current" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-forest-900 tracking-tight">Saved Wishlist</h1>
          <p className="text-xs text-slate-500 mt-1">
            Items you bookmarked while browsing Resello marketplace
          </p>
        </div>
      </div>

      <ProductGrid
        products={wishlistItems}
        loading={loading}
        onToast={showToast}
        emptyTitle="Your wishlist is empty"
        emptyDescription="Explore listings and click the heart icon on any item to save it for later."
      />
    </div>
  );
};
