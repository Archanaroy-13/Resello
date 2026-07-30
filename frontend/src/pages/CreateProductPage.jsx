import React, { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { createProduct } from '../services/productService';
import { ImageUploader } from '../components/product/ImageUploader';
import { CATEGORIES, CONDITIONS } from '../utils/formatters';
import { PlusCircle, ArrowLeft, Loader2 } from 'lucide-react';

export const CreateProductPage = () => {
  const navigate = useNavigate();
  const outletContext = useOutletContext();
  const showToast = outletContext?.showToast;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: CATEGORIES[0],
    brand: '',
    condition: CONDITIONS[0],
    material: '',
    size: '',
    color: ''
  });

  const [files, setFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const isValidCount = files.length >= 3 && files.length <= 10;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!isValidCount) {
      setErrorMsg(`Product creation requires between 3 and 10 images. You selected ${files.length}.`);
      return;
    }

    setSubmitting(true);
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => data.append(key, formData[key]));
      files.forEach(file => data.append('images', file));

      const res = await createProduct(data);
      if (res.success) {
        if (showToast) showToast('Product listing published successfully!', 'success');
        navigate(`/product/${res.data._id}`);
      }
    } catch (err) {
      console.error('[Create Listing Error]', err);
      const msg = err.response?.data?.message || 'Failed to create listing. Ensure 3 to 10 images are provided.';
      setErrorMsg(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-forest-800 transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Cancel & Back</span>
        </button>
        <h1 className="text-3xl font-extrabold text-forest-900 tracking-tight">Create New Listing</h1>
        <p className="text-xs text-slate-500 mt-1">
          List your pre-owned item on Resello marketplace. Min 3 photos required.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-100 p-8 shadow-soft space-y-6">
        
        {errorMsg && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-2xl">
            {errorMsg}
          </div>
        )}

        {/* Image Uploader */}
        <ImageUploader files={files} onChange={setFiles} />

        <div className="border-t border-slate-100 pt-6 space-y-5">
          
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              required
              placeholder="e.g. Vintage Canon AE-1 35mm SLR Camera"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-sage-400 focus:bg-white"
            />
          </div>

          {/* Category & Condition */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-sage-400 font-medium"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Condition <span className="text-red-500">*</span>
              </label>
              <select
                name="condition"
                value={formData.condition}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-sage-400 font-medium"
              >
                {CONDITIONS.map((cond) => (
                  <option key={cond} value={cond}>
                    {cond}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Price & Brand */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Price ($) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="price"
                required
                min="0"
                placeholder="120"
                value={formData.price}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-sage-400 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Brand</label>
              <input
                type="text"
                name="brand"
                placeholder="e.g. Canon, Levi's, Apple"
                value={formData.brand}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-sage-400 focus:bg-white"
              />
            </div>
          </div>

          {/* Material, Size, Color */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Material</label>
              <input
                type="text"
                name="material"
                placeholder="e.g. Leather, Cotton"
                value={formData.material}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-sage-400 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Size</label>
              <input
                type="text"
                name="size"
                placeholder="e.g. Medium, Standard"
                value={formData.size}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-sage-400 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Color</label>
              <input
                type="text"
                name="color"
                placeholder="e.g. Black, Brown"
                value={formData.color}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-sage-400 focus:bg-white"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              required
              rows={4}
              placeholder="Describe item details, condition flaws, inclusion accessories, reason for selling..."
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-sage-400 focus:bg-white resize-y"
            ></textarea>
          </div>
        </div>

        {/* Submit Action */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-5 py-2.5 rounded-2xl text-slate-600 hover:bg-slate-100 text-xs font-semibold transition-colors"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={!isValidCount || submitting}
            className="px-6 py-3 rounded-2xl bg-sage-500 hover:bg-sage-600 disabled:bg-slate-300 text-white font-bold text-sm transition-all shadow-md flex items-center gap-2"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Publishing Listing...</span>
              </>
            ) : (
              <>
                <PlusCircle className="w-4 h-4" />
                <span>Publish Product Listing</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
