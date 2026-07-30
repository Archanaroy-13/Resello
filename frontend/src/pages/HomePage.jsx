import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useOutletContext } from 'react-router-dom';
import { getProducts } from '../services/productService';
import { ProductGrid } from '../components/product/ProductGrid';
import { CATEGORIES } from '../utils/formatters';
import { Search, ArrowRight, ShieldCheck, Tag, PlusCircle, Sparkles, TrendingUp, RefreshCw, Star, ShoppingBag } from 'lucide-react';

export const HomePage = () => {
  const navigate = useNavigate();
  const outletContext = useOutletContext();
  const showToast = outletContext?.showToast;

  const [searchQuery, setSearchQuery] = useState('');
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newestProducts, setNewestProducts] = useState([]);
  const [availableProducts, setAvailableProducts] = useState([]);
  const [soldProducts, setSoldProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHomepageData();
  }, []);

  const fetchHomepageData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Featured / Curated products
      const featRes = await getProducts({ limit: 4, sort: 'newest' });
      if (featRes.success) {
        setFeaturedProducts(featRes.data);
      }

      // 2. Fetch Newest Available Listings
      const availRes = await getProducts({ availableOnly: 'true', limit: 8, sort: 'newest' });
      if (availRes.success) {
        setNewestProducts(availRes.data);
        setAvailableProducts(availRes.data);
      }

      // 3. Fetch Recently Sold Products for dedicated showcase
      const soldRes = await getProducts({ status: 'Sold', limit: 4, sort: 'newest' });
      if (soldRes.success) {
        setSoldProducts(soldRes.data);
      }
    } catch (err) {
      console.error('[Homepage Fetch Error]', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/explore?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="space-y-16 pb-16">
      
      {/* 1. HERO BANNER */}
      <section className="relative overflow-hidden bg-gradient-to-b from-sage-100/70 via-sage-50/40 to-surface pt-16 pb-20 px-4 sm:px-6 lg:px-8 border-b border-sage-100/50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left animate-fadeIn">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sage-200/60 text-forest-900 text-xs font-bold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-sage-600" />
              <span>Sustainable Second-Hand Marketplace</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-forest-900 tracking-tight leading-[1.15]">
              Give Pre-Owned Goods A <span className="text-sage-600 underline decoration-sage-300 decoration-wavy">Second Life.</span>
            </h1>

            <p className="text-slate-600 text-base sm:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Discover verified cameras, vintage apparel, modern tech, and home decor from trusted local sellers. Simple, fast, and eco-friendly.
            </p>

            <div className="flex items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                to="/explore"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-sage-500 hover:bg-sage-600 text-white font-bold text-sm transition-all shadow-md hover:-translate-y-0.5"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Start Shopping</span>
              </Link>
              <Link
                to="/create-listing"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 font-bold text-sm transition-all shadow-sm"
              >
                <PlusCircle className="w-4 h-4 text-sage-600" />
                <span>Sell an Item</span>
              </Link>
            </div>
          </div>

          {/* Hero Feature Visual Cards */}
          <div className="lg:col-span-5 relative hidden sm:block">
            <div className="relative mx-auto max-w-md aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-4 border-white transform rotate-2 hover:rotate-0 transition-transform duration-500">
              <img
                src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80"
                alt="Vintage Camera"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
                <span className="px-2.5 py-1 rounded-full bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-wider w-fit mb-1">
                  Verified Seller
                </span>
                <h3 className="font-bold text-lg">Vintage Canon AE-1 35mm</h3>
                <p className="text-xs text-slate-300">$185 • Electronics</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. SEARCH BAR */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6">
        <form onSubmit={handleSearchSubmit} className="relative flex items-center shadow-lg rounded-2xl bg-white border border-slate-200 p-1.5">
          <Search className="w-5 h-5 text-slate-400 absolute left-4" />
          <input
            type="text"
            placeholder="Search film cameras, Levi's jackets, Keychron keyboards, brands, conditions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-32 py-3 bg-transparent text-sm focus:outline-none text-slate-800 placeholder-slate-400 font-medium"
          />
          <button
            type="submit"
            className="absolute right-2 px-6 py-2.5 rounded-xl bg-forest-800 hover:bg-forest-900 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search</span>
          </button>
        </form>
      </section>

      {/* 3. POPULAR CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-forest-900 tracking-tight">Popular Categories</h2>
            <p className="text-xs text-slate-500 mt-1">Browse pre-owned items by department</p>
          </div>
          <Link to="/explore" className="text-xs font-bold text-sage-600 hover:text-sage-700 flex items-center gap-1">
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {CATEGORIES.slice(0, 4).map((category) => (
            <Link
              key={category}
              to={`/explore?category=${encodeURIComponent(category)}`}
              className="group p-5 bg-white rounded-3xl border border-slate-100 shadow-soft hover:shadow-hover hover:border-sage-300 transition-all duration-300 flex flex-col justify-between h-36"
            >
              <div className="w-10 h-10 rounded-2xl bg-sage-50 text-sage-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Tag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm group-hover:text-sage-600 transition-colors">{category}</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Explore deals &rarr;</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. FEATURED PRODUCTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
              <h2 className="text-2xl font-bold text-forest-900 tracking-tight">Featured Deals</h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">Handpicked quality items at exceptional prices</p>
          </div>
          <Link to="/explore" className="text-xs font-bold text-sage-600 hover:text-sage-700 flex items-center gap-1">
            <span>Explore All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <ProductGrid products={featuredProducts} loading={loading} onToast={showToast} />
      </section>

      {/* 5. NEWEST LISTINGS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-sage-600" />
              <h2 className="text-2xl font-bold text-forest-900 tracking-tight">Newest Listings</h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">Fresh arrivals just posted by community sellers</p>
          </div>
          <Link to="/explore" className="text-xs font-bold text-sage-600 hover:text-sage-700 flex items-center gap-1">
            <span>See Newest</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <ProductGrid products={newestProducts} loading={loading} onToast={showToast} />
      </section>

      {/* 6. AVAILABLE PRODUCTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <h2 className="text-2xl font-bold text-forest-900 tracking-tight">Available Now</h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">Ready for instant purchase and shipping</p>
          </div>
        </div>

        <ProductGrid products={availableProducts} loading={loading} onToast={showToast} />
      </section>

      {/* 7. RECENTLY SOLD PRODUCTS */}
      {soldProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-red-500" />
                <h2 className="text-2xl font-bold text-forest-900 tracking-tight">Recently Sold</h2>
              </div>
              <p className="text-xs text-slate-500 mt-1">Items successfully rehomed by Resello sellers</p>
            </div>
          </div>

          <ProductGrid products={soldProducts} loading={loading} onToast={showToast} />
        </section>
      )}

      {/* 8. SELL YOUR PRODUCT CALL-TO-ACTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-forest-900 rounded-3xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden">
          <div className="space-y-4 max-w-lg text-center md:text-left z-10">
            <span className="px-3 py-1 rounded-full bg-sage-500 text-white text-xs font-bold uppercase tracking-wider">
              Fast & Free Listing
            </span>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              Turn Your Unused Items Into Extra Cash.
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Snap 3+ photos, write a quick description, and connect with buyers in your area. Zero listing fees.
            </p>
            <Link
              to="/create-listing"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-sage-500 hover:bg-sage-600 text-white font-bold text-sm transition-all shadow-md hover:scale-105"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create A Listing Now</span>
            </Link>
          </div>

          <div className="relative w-full max-w-xs aspect-square rounded-2xl overflow-hidden shadow-lg border-2 border-forest-700 z-10 shrink-0 hidden md:block">
            <img
              src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=600&q=80"
              alt="Leather Bag"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

    </div>
  );
};
