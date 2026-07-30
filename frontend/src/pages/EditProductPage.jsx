import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import { getProductById, updateProduct } from '../services/productService';
import { ImageUploader } from '../components/product/ImageUploader';
import { CATEGORIES, CONDITIONS } from '../utils/formatters';
import { Save, ArrowLeft, Loader2, RefreshCw } from 'lucide-react';

export const EditProductPage = () => {
  const { id } = useParams();
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
    color: '',
    status: 'Available'
  });

  const [existingImages, setExistingImages] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  const fetchProductDetails = async () => {
    setLoading(true);
    try {
      const res = await getProductById(id);
      if (res.success && res.data) {
        const item = res.data;
        setFormData({
          title: item.title || '',
          description: item.description || '',
          price: item.price || '',
          category: item.category || CATEGORIES[0],
          brand: item.brand || '',
          condition: item.condition || CONDITIONS[0],
          material: item.material || '',
          size: item.size || '',
          color: item.color || '',
          status: item.status || 'Available'
        });

        if (item.images && Array.isArray(item.images)) {
          setExistingImages(item.images.map(img => img.url));
        }
      }
    } catch (err) {
      console.error('[Edit Fetch Error]', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    const totalCount = existingImages.length + newFiles.length;
    if (totalCount < 3 || totalCount > 10) {
      setErrorMsg(`Product requires between 3 and 10 images. Current total: ${totalCount}.`);
      return;
    }

    setSubmitting(true);
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => data.append(key, formData[key]));
      newFiles.forEach(file => data.append('images', file));

      const res = await updateProduct(id, data);
      if (res.success) {
        if (showToast) showToast('Product listing updated successfully!', 'success');
        navigate(`/product/${id}`);
      }
    } catch (err) {
      console.error('[Edit Listing Error]', err);
      const msg = err.response?.data?.message || 'Failed to update listing.';
      setErrorMsg(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-sage-600 animate-spin" />
      </div>
    );
  }

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
        <h1 className="text-3xl font-extrabold text-forest-900 tracking-tight">Edit Product Listing</h1>
        <p className="text-xs text-slate-500 mt-1">
          Update specs or toggle status between Available and Sold.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-100 p-8 shadow-soft space-y-6">
        
        {errorMsg && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-2xl">
            {errorMsg}
          </div>
        )}

        {/* Status Toggle Card */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
          <div>
            <label className="block text-xs font-bold text-slate-800">Listing Status</label>
            <p className="text-[11px] text-slate-500">Mark item as Sold to update visual badges</p>
          </div>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border focus:outline-none ${
              formData.status === 'Sold'
                ? 'bg-red-100 text-red-700 border-red-300'
                : 'bg-emerald-100 text-emerald-800 border-emerald-300'
            }`}
          >
            <option value="Available">Available</option>
            <option value="Sold">Sold</option>
          </select>
        </div>

        {/* Image Uploader */}
        <ImageUploader
          files={newFiles}
          onChange={setNewFiles}
          imageUrls={existingImages}
          onUrlChange={setExistingImages}
        />

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
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-sage-400 focus:bg-white"
            />
          </div>

          {/* Category & Condition */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Category</label>
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
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Condition</label>
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
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Price ($)</label>
              <input
                type="number"
                name="price"
                required
                min="0"
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
                value={formData.color}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-sage-400 focus:bg-white"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Description</label>
            <textarea
              name="description"
              required
              rows={4}
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
            disabled={submitting}
            className="px-6 py-3 rounded-2xl bg-forest-800 hover:bg-forest-900 disabled:bg-slate-300 text-white font-bold text-sm transition-all shadow-md flex items-center gap-2"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving Changes...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
