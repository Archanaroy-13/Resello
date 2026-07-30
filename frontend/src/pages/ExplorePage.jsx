import React, { useState, useEffect } from 'react';
import { useSearchParams, useOutletContext } from 'react-router-dom';
import { getProducts } from '../services/productService';
import { ProductGrid } from '../components/product/ProductGrid';
import { ProductFilterBar } from '../components/product/ProductFilterBar';
import { useDebounce } from '../hooks/useDebounce';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const ExplorePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const outletContext = useOutletContext();
  const showToast = outletContext?.showToast;

  const initialFilters = {
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || 'All',
    condition: searchParams.get('condition') || 'All',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sort: searchParams.get('sort') || 'newest',
    availableOnly: searchParams.get('availableOnly') || 'false',
    page: Number(searchParams.get('page')) || 1
  };

  const [filters, setFilters] = useState(initialFilters);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ totalPages: 1, total: 0, currentPage: 1 });

  const debouncedSearch = useDebounce(filters.search, 350);

  useEffect(() => {
    fetchFilteredProducts();
  }, [filters.category, filters.condition, filters.minPrice, filters.maxPrice, filters.sort, filters.availableOnly, filters.page, debouncedSearch]);

  const fetchFilteredProducts = async () => {
    setLoading(true);
    try {
      const params = {
        page: filters.page,
        limit: 12,
        sort: filters.sort
      };

      if (debouncedSearch) params.search = debouncedSearch;
      if (filters.category && filters.category !== 'All') params.category = filters.category;
      if (filters.condition && filters.condition !== 'All') params.condition = filters.condition;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;
      if (filters.availableOnly === 'true') params.availableOnly = 'true';

      // Synchronize URL search params
      setSearchParams(params, { replace: true });

      const res = await getProducts(params);
      if (res.success) {
        setProducts(res.data);
        setPagination({
          totalPages: res.totalPages || 1,
          total: res.total || 0,
          currentPage: res.currentPage || 1
        });
      }
    } catch (err) {
      console.error('[Explore Fetch Error]', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    const reset = {
      search: '',
      category: 'All',
      condition: 'All',
      minPrice: '',
      maxPrice: '',
      sort: 'newest',
      availableOnly: 'false',
      page: 1
    };
    setFilters(reset);
    setSearchParams({}, { replace: true });
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setFilters(prev => ({ ...prev, page: newPage }));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-forest-900 tracking-tight">Marketplace Directory</h1>
        <p className="text-slate-500 text-sm mt-1">
          Showing {pagination.total} pre-owned listings available for discovery
        </p>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Sidebar Filters */}
        <div className="lg:col-span-3">
          <ProductFilterBar
            filters={filters}
            onChange={handleFilterChange}
            onReset={handleResetFilters}
          />
        </div>

        {/* Catalog Grid */}
        <div className="lg:col-span-9 space-y-8">
          <ProductGrid products={products} loading={loading} onToast={showToast} />

          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6">
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
                className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 disabled:opacity-40 hover:bg-slate-50 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <span className="text-xs font-semibold text-slate-700 px-4">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>

              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages}
                className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 disabled:opacity-40 hover:bg-slate-50 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
