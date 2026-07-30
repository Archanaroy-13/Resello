import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Tag, MapPin } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../hooks/useAuth';
import { Badge } from '../common/Badge';
import { formatCurrency } from '../../utils/formatters';

export const ProductCard = ({ product, onToast }) => {
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (!product) return null;

  const isSold = product.status === 'Sold';
  const saved = isWishlisted(product._id);
  const firstImage = product.images?.[0]?.url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800';

  const handleWishlistClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    const result = await toggleWishlist(product._id);
    if (result.success && onToast) {
      onToast(result.action === 'added' ? 'Added to wishlist!' : 'Removed from wishlist', 'success');
    }
  };

  return (
    <div
      className={`group relative bg-white rounded-3xl border border-slate-100 shadow-soft hover:shadow-hover transition-all duration-300 flex flex-col overflow-hidden ${
        isSold ? 'opacity-70 grayscale-[30%] bg-slate-50/80' : 'hover:-translate-y-1'
      }`}
    >
      {/* Image Container */}
      <Link to={`/product/${product._id}`} className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100 block">
        <img
          src={firstImage}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Status Overlay Badge */}
        <div className="absolute top-3 left-3 z-10">
          <Badge status={product.status} />
        </div>

        {/* Heart Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          className={`absolute top-3 right-3 z-10 p-2.5 rounded-full backdrop-blur-md transition-all shadow-sm ${
            saved
              ? 'bg-red-500 text-white hover:bg-red-600 scale-105'
              : 'bg-white/80 text-slate-600 hover:text-red-500 hover:bg-white'
          }`}
          title={saved ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <Heart className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
        </button>

        {/* Category Tag Overlay */}
        <div className="absolute bottom-3 left-3 z-10">
          <span className="px-2.5 py-1 rounded-xl bg-slate-900/75 backdrop-blur-md text-white text-[11px] font-medium tracking-wide">
            {product.category}
          </span>
        </div>
      </Link>

      {/* Card Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="inline-flex items-center gap-1 font-medium text-sage-700 bg-sage-50 px-2 py-0.5 rounded-md">
              <Tag className="w-3 h-3" />
              {product.condition}
            </span>
            <span className="font-bold text-slate-800 text-base">
              {formatCurrency(product.price)}
            </span>
          </div>

          <Link to={`/product/${product._id}`}>
            <h3 className="font-bold text-slate-800 text-sm line-clamp-1 group-hover:text-sage-600 transition-colors">
              {product.title}
            </h3>
          </Link>

          <p className="text-xs text-slate-500 line-clamp-1 mt-1">
            {product.brand} • {product.size}
          </p>
        </div>

        {/* Seller Info Footer */}
        {product.seller && (
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <Link
              to={`/seller/${product.seller._id || product.seller}`}
              className="flex items-center gap-2 group/seller hover:opacity-80 transition-opacity"
            >
              <img
                src={product.seller.avatar?.url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                alt={product.seller.name || 'Seller'}
                className="w-6 h-6 rounded-full object-cover border border-slate-200"
              />
              <span className="text-xs font-medium text-slate-600 group-hover/seller:text-forest-800 truncate max-w-[110px]">
                {product.seller.name || 'Seller'}
              </span>
            </Link>

            {product.seller.location && (
              <span className="text-[11px] text-slate-400 flex items-center gap-0.5 truncate max-w-[90px]">
                <MapPin className="w-3 h-3 text-slate-300" />
                {product.seller.location.split(',')[0]}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
