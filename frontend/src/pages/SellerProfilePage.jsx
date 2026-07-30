import React, { useState, useEffect } from 'react';
import { useParams, useOutletContext } from 'react-router-dom';
import { getSellerProfile } from '../services/userService';
import { ProductGrid } from '../components/product/ProductGrid';
import { formatDate } from '../utils/formatters';
import { MapPin, Calendar, Mail, Phone, UserCheck, Store } from 'lucide-react';

export const SellerProfilePage = () => {
  const { id } = useParams();
  const outletContext = useOutletContext();
  const showToast = outletContext?.showToast;

  const [seller, setSeller] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSellerData();
  }, [id]);

  const fetchSellerData = async () => {
    setLoading(true);
    try {
      const res = await getSellerProfile(id);
      if (res.success) {
        setSeller(res.seller);
        setProducts(res.products);
      }
    } catch (err) {
      console.error('[Seller Profile Fetch Error]', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-sage-200 border-t-sage-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!seller) {
    return (
      <div className="max-w-md mx-auto my-16 text-center">
        <h2 className="text-xl font-bold text-slate-800">Seller Not Found</h2>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Seller Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-soft flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left">
        <img
          src={seller.avatar?.url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300'}
          alt={seller.name}
          className="w-24 h-24 rounded-full object-cover border-4 border-sage-100 shadow-md shrink-0"
        />

        <div className="space-y-2 flex-1">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
            <div>
              <h1 className="text-2xl font-extrabold text-forest-900 flex items-center justify-center md:justify-start gap-2">
                <span>{seller.name}</span>
                <UserCheck className="w-5 h-5 text-sage-600" />
              </h1>
              <p className="text-xs text-slate-400 flex items-center justify-center md:justify-start gap-1 mt-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>{seller.location || 'New York, NY'}</span>
                <span className="mx-1">•</span>
                <Calendar className="w-3.5 h-3.5" />
                <span>Member since {formatDate(seller.createdAt)}</span>
              </p>
            </div>

            <div className="px-4 py-2 bg-sage-50 text-sage-700 font-bold text-xs rounded-2xl border border-sage-200">
              {products.length} Active & Sold Listings
            </div>
          </div>

          {seller.bio && (
            <p className="text-slate-600 text-xs leading-relaxed max-w-2xl bg-slate-50 p-3 rounded-2xl border border-slate-100">
              "{seller.bio}"
            </p>
          )}
        </div>
      </div>

      {/* Seller Catalog */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
          <Store className="w-5 h-5 text-sage-600" />
          <h2 className="text-xl font-bold text-forest-900">Listings by {seller.name}</h2>
        </div>

        <ProductGrid products={products} loading={loading} onToast={showToast} />
      </div>

    </div>
  );
};
