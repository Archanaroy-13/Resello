import React from 'react';
import { useWishlist } from '../context/WishlistContext';
import { ProductGrid } from '../components/product/ProductGrid';
import { Heart, ShoppingBag } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';

export const WishlistPage = () => {
  const { wishlist, wishlistItems, wishlistCount, loading } = useWishlist();
  const outletContext = useOutletContext();
  const showToast = outletContext?.showToast;

  const itemsToDisplay = wishlist || wishlistItems || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center shadow-sm">
            <Heart className="w-6 h-6 fill-current" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-forest-900 tracking-tight">My Saved Wishlist</h1>
            <p className="text-xs text-slate-500 mt-1">
              Items you bookmarked while exploring the Resello marketplace
            </p>
          </div>
        </div>

        <div className="px-4 py-2 rounded-2xl bg-slate-100 text-slate-700 text-xs font-bold w-fit">
          {wishlistCount} Saved {wishlistCount === 1 ? 'Product' : 'Products'}
        </div>
      </div>

      {/* Product Grid Layout */}
      <ProductGrid
        products={itemsToDisplay}
        loading={loading}
        onToast={showToast}
        emptyTitle="No saved products yet"
        emptyDescription="Explore active listings and tap the heart icon to save pre-owned items to your personal wishlist."
      />
    </div>
  );
};
