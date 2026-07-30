import React, { useState, useEffect } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { getProducts, deleteProduct, updateProduct } from '../services/productService';
import { useAuth } from '../hooks/useAuth';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { EmptyState } from '../components/common/EmptyState';
import { formatCurrency, formatDate } from '../utils/formatters';
import { Package, Edit, Trash2, PlusCircle, CheckCircle, RefreshCw, AlertTriangle } from 'lucide-react';

export const MyListingsPage = () => {
  const { user } = useAuth();
  const outletContext = useOutletContext();
  const showToast = outletContext?.showToast;

  const [myListings, setMyListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  useEffect(() => {
    if (user?._id) {
      fetchMyListings();
    }
  }, [user?._id]);

  const fetchMyListings = async () => {
    setLoading(true);
    try {
      const res = await getProducts({ limit: 100 });
      if (res.success && res.data) {
        // Filter user's listings
        const filtered = res.data.filter(
          item => item.seller && (item.seller._id === user._id || item.seller === user._id)
        );
        setMyListings(filtered);
      }
    } catch (err) {
      console.error('[My Listings Fetch Error]', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (item) => {
    const newStatus = item.status === 'Available' ? 'Sold' : 'Available';
    try {
      const res = await updateProduct(item._id, { status: newStatus });
      if (res.success) {
        setMyListings(prev =>
          prev.map(p => (p._id === item._id ? { ...p, status: newStatus } : p))
        );
        if (showToast) showToast(`Listing marked as ${newStatus}`, 'success');
      }
    } catch (err) {
      console.error('[Toggle Status Error]', err);
    }
  };

  const confirmDelete = (item) => {
    setItemToDelete(item);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    try {
      const res = await deleteProduct(itemToDelete._id);
      if (res.success) {
        setMyListings(prev => prev.filter(p => p._id !== itemToDelete._id));
        if (showToast) showToast('Product listing deleted', 'info');
      }
    } catch (err) {
      console.error('[Delete Error]', err);
    } finally {
      setDeleteModalOpen(false);
      setItemToDelete(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-forest-900 tracking-tight">My Product Listings</h1>
          <p className="text-slate-500 text-xs mt-1">
            Manage your active items, mark as sold, or edit listing details.
          </p>
        </div>

        <Link
          to="/create-listing"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-sage-500 hover:bg-sage-600 text-white font-bold text-xs transition-all shadow-sm hover:shadow-hover"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Post New Item</span>
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-4 border-sage-200 border-t-sage-600 rounded-full animate-spin"></div>
        </div>
      ) : myListings.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No listings published yet"
          description="You haven't listed any items for sale. Post your first product to start earning."
          actionText="Create Listing"
          actionLink="/create-listing"
        />
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {myListings.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-3xl border border-slate-100 p-4 shadow-soft hover:shadow-hover transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              {/* Product Thumbnail & Details */}
              <div className="flex items-center gap-4">
                <img
                  src={item.images?.[0]?.url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200'}
                  alt={item.title}
                  className="w-20 h-20 rounded-2xl object-cover border border-slate-200 shrink-0"
                />

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge status={item.status} />
                    <span className="text-[11px] text-slate-400">{item.category}</span>
                  </div>
                  <h3 className="font-bold text-slate-800 text-sm line-clamp-1">{item.title}</h3>
                  <p className="text-xs font-extrabold text-slate-900">{formatCurrency(item.price)}</p>
                  <p className="text-[11px] text-slate-400">Listed {formatDate(item.createdAt)}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                <button
                  onClick={() => handleToggleStatus(item)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors flex items-center gap-1.5 ${
                    item.status === 'Available'
                      ? 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
                      : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                  }`}
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Mark as {item.status === 'Available' ? 'Sold' : 'Available'}</span>
                </button>

                <Link
                  to={`/edit-listing/${item._id}`}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                  title="Edit listing"
                >
                  <Edit className="w-4 h-4" />
                </Link>

                <button
                  onClick={() => confirmDelete(item)}
                  className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
                  title="Delete listing"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Confirm Delete Listing"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-red-50 text-red-800 rounded-2xl border border-red-200 text-xs">
            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
            <span>Are you sure you want to permanently delete <strong>{itemToDelete?.title}</strong>? This action cannot be undone.</span>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={() => setDeleteModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-sm"
            >
              Delete Listing
            </button>
          </div>
        </div>
      </Modal>

    </div>
  );
};
