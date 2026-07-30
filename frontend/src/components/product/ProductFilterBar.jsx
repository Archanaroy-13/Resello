import React from 'react';
import { CATEGORIES, CONDITIONS, SORT_OPTIONS } from '../../utils/formatters';
import { Filter, RotateCcw, Search, DollarSign } from 'lucide-react';

export const ProductFilterBar = ({ filters, onChange, onReset }) => {
  const handleInputChange = (field, value) => {
    onChange({ ...filters, [field]: value, page: 1 });
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-soft space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2 text-forest-900 font-bold text-base">
          <Filter className="w-5 h-5 text-sage-600" />
          <span>Filters & Search</span>
        </div>
        <button
          onClick={onReset}
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-700 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset All</span>
        </button>
      </div>

      {/* Search Input */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-2">Keyword Search</label>
        <div className="relative">
          <input
            type="text"
            placeholder="Search by title, brand, material..."
            value={filters.search || ''}
            onChange={(e) => handleInputChange('search', e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-sage-400 focus:bg-white"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Category Dropdown */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-2">Category</label>
        <select
          value={filters.category || 'All'}
          onChange={(e) => handleInputChange('category', e.target.value)}
          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-sage-400"
        >
          <option value="All">All Categories</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Condition Dropdown */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-2">Condition</label>
        <select
          value={filters.condition || 'All'}
          onChange={(e) => handleInputChange('condition', e.target.value)}
          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-sage-400"
        >
          <option value="All">All Conditions</option>
          {CONDITIONS.map((cond) => (
            <option key={cond} value={cond}>
              {cond}
            </option>
          ))}
        </select>
      </div>

      {/* Price Range */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-2">Price Range ($)</label>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <input
              type="number"
              placeholder="Min"
              value={filters.minPrice || ''}
              onChange={(e) => handleInputChange('minPrice', e.target.value)}
              className="w-full pl-6 pr-2 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-sage-400"
            />
            <DollarSign className="w-3 h-3 text-slate-400 absolute left-2 top-2.5" />
          </div>
          <span className="text-slate-300 text-xs">-</span>
          <div className="relative flex-1">
            <input
              type="number"
              placeholder="Max"
              value={filters.maxPrice || ''}
              onChange={(e) => handleInputChange('maxPrice', e.target.value)}
              className="w-full pl-6 pr-2 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-sage-400"
            />
            <DollarSign className="w-3 h-3 text-slate-400 absolute left-2 top-2.5" />
          </div>
        </div>
      </div>

      {/* Sort Option */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-2">Sort By</label>
        <select
          value={filters.sort || 'newest'}
          onChange={(e) => handleInputChange('sort', e.target.value)}
          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-sage-400"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Available Only Checkbox */}
      <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
        <input
          type="checkbox"
          id="availableOnly"
          checked={filters.availableOnly === 'true' || filters.availableOnly === true}
          onChange={(e) => handleInputChange('availableOnly', e.target.checked ? 'true' : 'false')}
          className="w-4 h-4 text-sage-600 rounded border-slate-300 focus:ring-sage-500"
        />
        <label htmlFor="availableOnly" className="text-xs font-medium text-slate-700 cursor-pointer select-none">
          Show Available Only (Hide Sold)
        </label>
      </div>
    </div>
  );
};
