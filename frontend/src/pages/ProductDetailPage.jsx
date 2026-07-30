import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useOutletContext } from 'react-router-dom';
import { getProductById, getProducts } from '../services/productService';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../hooks/useAuth';
import { ProductGrid } from '../components/product/ProductGrid';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { formatCurrency, formatDate } from '../utils/formatters';
import {
  Heart,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Calendar,
  Tag,
  ShieldCheck,
  Mail,
  Phone,
  MessageSquare,
  ArrowLeft,
  Edit,
  UserCheck
} from 'lucide-react';

export const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const outletContext = useOutletContext();
  const showToast = outletContext?.showToast;

  const { isWishlisted, toggleWishlist } = useWishlist();
  const { user, isAuthenticated } = useAuth();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [contactModalOpen, setContactModalOpen] = useState(false);

  useEffect(() => {
    fetchProductDetails();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  const fetchProductDetails = async () => {
    setLoading(true);
    try {
      const res = await getProductById(id);
      if (res.success && res.data) {
        setProduct(res.data);
        setActiveImageIndex(0);

        // Fetch related products in same category
        if (res.data.category) {
          const relRes = await getProducts({ category: res.data.category, limit: 4 });
          if (relRes.success) {
            setRelatedProducts(relRes.data.filter(item => item._id !== res.data._id));
          }
        }
      }
    } catch (err) {
      console.error('[Detail Fetch Error]', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="animate-pulse space-y-8">
          <div className="h-6 bg-slate-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="h-96 bg-slate-200 rounded-3xl"></div>
            <div className="space-y-4">
              <div className="h-8 bg-slate-200 rounded w-3/4"></div>
              <div className="h-6 bg-slate-200 rounded w-1/3"></div>
              <div className="h-24 bg-slate-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-md mx-auto my-16 text-center">
        <h2 className="text-xl font-bold text-slate-800 mb-2">Product Not Found</h2>
        <p className="text-xs text-slate-500 mb-6">The listing you are looking for has been removed or does not exist.</p>
        <Link to="/explore" className="px-4 py-2 bg-sage-500 text-white rounded-xl text-xs font-semibold">
          Back to Marketplace
        </Link>
      </div>
    );
  }

  const images = product.images && product.images.length > 0 ? product.images : [{ url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800' }];
  const currentImage = images[activeImageIndex]?.url;
  const isOwner = user && product.seller && (user._id === product.seller._id || user._id === product.seller);
  const saved = isWishlisted(product._id);
  const isSold = product.status === 'Sold';

  const handlePrevImage = () => {
    setActiveImageIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setActiveImageIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleWishlistToggle = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    const res = await toggleWishlist(product._id);
    if (res.success && showToast) {
      showToast(res.action === 'added' ? 'Saved to wishlist!' : 'Removed from wishlist', 'success');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Back Button */}
      <div>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-forest-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Marketplace</span>
        </button>
      </div>

      {/* Main Product Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: Image Gallery Carousel */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Main Hero Image Display */}
          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-slate-100 bg-slate-100 shadow-soft group">
            <img
              src={currentImage}
              alt={product.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />

            {/* Status Overlay Badge */}
            <div className="absolute top-4 left-4 z-10">
              <Badge status={product.status} />
            </div>

            {/* Navigation Overlay Buttons */}
            {images.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/80 backdrop-blur-md text-slate-700 hover:bg-white transition-colors shadow-md"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <button
                  onClick={handleNextImage}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/80 backdrop-blur-md text-slate-700 hover:bg-white transition-colors shadow-md"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
          </div>

          {/* Thumbnail Bar */}
          {images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-20 aspect-square rounded-2xl overflow-hidden border-2 transition-all shrink-0 ${
                    idx === activeImageIndex ? 'border-sage-500 scale-105 shadow-sm' : 'border-slate-200 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img.url} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Product Info & Actions */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="space-y-2 border-b border-slate-100 pb-6">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-sage-50 text-sage-700 text-xs font-bold uppercase tracking-wider">
                {product.category}
              </span>
              <span className="text-xs text-slate-400">Listed {formatDate(product.createdAt)}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-forest-900 tracking-tight leading-snug">
              {product.title}
            </h1>

            <div className="flex items-center justify-between pt-2">
              <span className="text-3xl font-extrabold text-slate-900">
                {formatCurrency(product.price)}
              </span>
              <span className="text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-xl">
                Condition: <strong className="text-slate-800">{product.condition}</strong>
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            {isOwner ? (
              <Link
                to={`/edit-listing/${product._id}`}
                className="flex-1 py-3.5 rounded-2xl bg-forest-800 hover:bg-forest-900 text-white text-sm font-bold text-center transition-all shadow-md flex items-center justify-center gap-2"
              >
                <Edit className="w-4 h-4" />
                <span>Edit My Listing</span>
              </Link>
            ) : (
              <button
                onClick={() => setContactModalOpen(true)}
                disabled={isSold}
                className="flex-1 py-3.5 rounded-2xl bg-sage-500 hover:bg-sage-600 disabled:bg-slate-300 text-white text-sm font-bold text-center transition-all shadow-md flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                <span>{isSold ? 'Item Sold' : 'Contact Seller'}</span>
              </button>
            )}

            {/* Wishlist Heart Button */}
            <button
              onClick={handleWishlistToggle}
              className={`p-3.5 rounded-2xl border transition-all shadow-sm ${
                saved
                  ? 'bg-red-500 text-white border-red-500'
                  : 'bg-white text-slate-600 border-slate-200 hover:text-red-500 hover:bg-slate-50'
              }`}
              title={saved ? 'Remove from wishlist' : 'Save to wishlist'}
            >
              <Heart className={`w-5 h-5 ${saved ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Product Specifications Table */}
          <div className="bg-slate-50 rounded-2xl p-4 space-y-2.5 border border-slate-100 text-xs">
            <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-2">Item Specifications</h4>
            <div className="grid grid-cols-2 gap-2 text-slate-600">
              <div>Brand: <strong className="text-slate-800">{product.brand}</strong></div>
              <div>Material: <strong className="text-slate-800">{product.material}</strong></div>
              <div>Size: <strong className="text-slate-800">{product.size}</strong></div>
              <div>Color: <strong className="text-slate-800">{product.color}</strong></div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Description</h4>
            <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
              {product.description}
            </p>
          </div>

          {/* Seller Information Card */}
          {product.seller && (
            <div className="bg-white rounded-3xl border border-slate-100 p-5 shadow-soft space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={product.seller.avatar?.url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'}
                    alt={product.seller.name}
                    className="w-12 h-12 rounded-full object-cover border border-slate-200"
                  />
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                      <span>{product.seller.name}</span>
                      <UserCheck className="w-4 h-4 text-sage-600" />
                    </h4>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3" />
                      {product.seller.location || 'New York, NY'}
                    </p>
                  </div>
                </div>

                <Link
                  to={`/seller/${product.seller._id || product.seller}`}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors"
                >
                  View Profile
                </Link>
              </div>

              {product.seller.bio && (
                <p className="text-xs text-slate-500 italic bg-slate-50 p-3 rounded-xl">
                  "{product.seller.bio}"
                </p>
              )}
            </div>
          )}

        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <section className="pt-10 border-t border-slate-100">
          <h3 className="text-xl font-bold text-forest-900 mb-6">More From {product.category}</h3>
          <ProductGrid products={relatedProducts} onToast={showToast} />
        </section>
      )}

      {/* Contact Seller Dialog Modal */}
      <Modal
        isOpen={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
        title={`Contact ${product.seller?.name || 'Seller'}`}
      >
        <div className="space-y-4 text-sm">
          <p className="text-slate-600 text-xs">
            Connect directly with the seller to negotiate, ask questions, or arrange local pickup.
          </p>

          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <Mail className="w-5 h-5 text-sage-600 shrink-0" />
              <div>
                <p className="text-[11px] text-slate-400">Seller Email</p>
                <a href={`mailto:${product.seller?.email}`} className="font-semibold text-slate-800 hover:text-sage-600 text-xs">
                  {product.seller?.email || 'seller@resello.com'}
                </a>
              </div>
            </div>

            {product.seller?.phone && (
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <Phone className="w-5 h-5 text-sage-600 shrink-0" />
                <div>
                  <p className="text-[11px] text-slate-400">Seller Phone</p>
                  <a href={`tel:${product.seller?.phone}`} className="font-semibold text-slate-800 hover:text-sage-600 text-xs">
                    {product.seller?.phone}
                  </a>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => setContactModalOpen(false)}
            className="w-full mt-4 py-2.5 bg-forest-800 text-white rounded-xl font-bold text-xs hover:bg-forest-900 transition-colors"
          >
            Done
          </button>
        </div>
      </Modal>

    </div>
  );
};
