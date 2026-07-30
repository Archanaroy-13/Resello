import React, { useRef, useState } from 'react';
import { UploadCloud, X, AlertCircle, Image as ImageIcon } from 'lucide-react';

export const ImageUploader = ({ files = [], onChange, imageUrls = [], onUrlChange }) => {
  const fileInputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);

  const totalCount = files.length + imageUrls.length;
  const isValidCount = totalCount >= 3 && totalCount <= 10;

  const handleFilesAdded = (newFiles) => {
    const validImageFiles = Array.from(newFiles).filter(file => file.type.startsWith('image/'));
    const combined = [...files, ...validImageFiles];
    if (combined.length + imageUrls.length > 10) {
      alert('Maximum 10 images allowed per listing.');
      return;
    }
    onChange(combined);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFilesAdded(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const removeFile = (index) => {
    const updated = files.filter((_, i) => i !== index);
    onChange(updated);
  };

  const removeUrl = (index) => {
    const updated = imageUrls.filter((_, i) => i !== index);
    onUrlChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-slate-700">
          Product Images <span className="text-red-500">*</span>
        </label>
        <span
          className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
            isValidCount
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : 'bg-red-50 text-red-600 border-red-200'
          }`}
        >
          {totalCount} / 10 images (Min 3 required)
        </span>
      </div>

      {/* Drag and Drop Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 ${
          dragOver
            ? 'border-sage-500 bg-sage-50/50 scale-[0.99]'
            : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-300'
        }`}
      >
        <div className="w-12 h-12 rounded-2xl bg-white text-sage-600 flex items-center justify-center shadow-soft">
          <UploadCloud className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-800">
            Drag & drop images here, or <span className="text-sage-600 underline">browse</span>
          </p>
          <p className="text-xs text-slate-400 mt-1">Supports JPG, PNG, WebP up to 5MB each</p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) => e.target.files && handleFilesAdded(e.target.files)}
        />
      </div>

      {/* Validation Banner Message */}
      {!isValidCount && (
        <div className="flex items-center gap-2 text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 px-4 py-2.5 rounded-2xl">
          <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
          <span>Please select between 3 and 10 images to publish your product.</span>
        </div>
      )}

      {/* Preview Thumbnails Grid */}
      {totalCount > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 pt-2">
          {/* Existing URL Previews */}
          {imageUrls.map((url, idx) => (
            <div key={`url-${idx}`} className="relative aspect-square rounded-2xl overflow-hidden border border-slate-200 group bg-slate-100">
              <img src={url} alt={`Product ${idx}`} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeUrl(idx)}
                className="absolute top-1.5 right-1.5 p-1 bg-red-600 text-white rounded-full opacity-90 hover:opacity-100 transition-opacity shadow-sm"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}

          {/* New Selected File Previews */}
          {files.map((file, idx) => {
            const previewUrl = URL.createObjectURL(file);
            return (
              <div key={`file-${idx}`} className="relative aspect-square rounded-2xl overflow-hidden border border-slate-200 group bg-slate-100">
                <img src={previewUrl} alt={`New upload ${idx}`} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeFile(idx)}
                  className="absolute top-1.5 right-1.5 p-1 bg-red-600 text-white rounded-full opacity-90 hover:opacity-100 transition-opacity shadow-sm"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
