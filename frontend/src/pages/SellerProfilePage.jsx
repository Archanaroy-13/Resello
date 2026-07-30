import React, { useState, useEffect } from 'react';
import { useParams, useOutletContext } from 'react-router-dom';
import { getSellerProfile } from '../services/userService';
import { ProductGrid } from '../components/product/ProductGrid';
import { formatDate } from '../utils/formatters';
import { MapPin, Calendar, UserCheck, Store, AtSign, Package, CheckCircle, Tag } from 'lucide-react';

export const SellerProfilePage = () => {
  const { id } = useParams();
  const outletContext = useOutletContext();
  const showToast = outletContext?.showToast;

  const [seller, setSeller] = useState(null);
  const [stats, setStats] = useState({ totalListings: 0, availableListings: 0, soldListings: 0 });
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
        setProducts(res.products || []);
        if (res.stats) {
          setStats(res.stats);
        } else {
          const total = res.products?.length || 0;
          const avail = res.products?.filter(p => p.status === 'Available').length || 0;
          const sold = res.products?.filter(p => p.status === 'Sold').length || 0;
          setStats({ totalListings: total, availableListings: avail, soldListings: sold });
        }
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

  const avatarUrl = seller.profileImage?.url || seller.avatar?.url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Seller Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-soft flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left">
        <img
          src={avatarUrl}
          alt={seller.name}
          className="w-24 h-24 rounded-full object-cover border-4 border-sage-100 shadow-md shrink-0"
        />

        <div className="space-y-3 flex-1">
          <div>
            <h1 className="text-2xl font-extrabold text-forest-900 flex items-center justify-center md:justify-start gap-2">
              <span>{seller.name}</span>
              <UserCheck className="w-5 h-5 text-sage-600" />
            </h1>

            <p className="text-xs text-slate-400 flex items-center justify-center md:justify-start gap-3 mt-1 font-medium">
              <span className="flex items-center gap-1">
                <AtSign className="w-3.5 h-3.5 text-slate-300" />
                {seller.username}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-300" />
                {seller.location || 'New York, NY'}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-300" />
                Member since {formatDate(seller.joinedDate || seller.createdAt)}
              </span>
            </p>
          </div>

          {seller.bio && (
            <p className="text-slate-600 text-xs leading-relaxed max-w-2xl bg-slate-50 p-3.5 rounded-2xl border border-slate-100 italic">
              "{seller.bio}"
            </p>
          )}

          {/* Seller Stats Bar */}
          <div className="grid grid-cols-3 gap-3 max-w-md pt-1">
            <div className="bg-sage-50/70 border border-sage-100 rounded-2xl p-2.5 text-center">
              <span className="block text-lg font-extrabold text-forest-900">{stats.totalListings}</span>
              <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Total Listings</span>
            </div>
            <div className="bg-emerald-50/70 border border-emerald-100 rounded-2xl p-2.5 text-center">
              <span className="block text-lg font-extrabold text-emerald-700">{stats.availableListings}</span>
              <span className="text-[10px] text-emerald-600 font-semibold uppercase tracking-wider">Available</span>
            </div>
            <div className="bg-red-50/70 border border-red-100 rounded-2xl p-2.5 text-center">
              <span className="block text-lg font-extrabold text-red-700">{stats.soldListings}</span>
              <span className="text-[10px] text-red-600 font-semibold uppercase tracking-wider">Sold</span>
            </div>
          </div>
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
