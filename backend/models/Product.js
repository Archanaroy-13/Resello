const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Product title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0.01, 'Price must be greater than 0']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Electronics', 'Fashion', 'Home & Living', 'Books & Hobbies', 'Vehicles', 'Beauty & Care', 'Toys & Games', 'Other'],
    index: true
  },
  brand: { type: String, trim: true, default: 'Unbranded' },
  condition: {
    type: String,
    required: [true, 'Condition is required'],
    enum: ['Brand New', 'Like New', 'Good', 'Fair', 'Refurbished']
  },
  material: { type: String, trim: true, default: 'N/A' },
  size: { type: String, trim: true, default: 'Standard' },
  color: { type: String, trim: true, default: 'Multi' },
  status: {
    type: String,
    enum: ['Available', 'Sold'],
    default: 'Available',
    index: true
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Seller reference is required'],
    index: true
  },
  images: {
    type: [{
      url: { type: String, required: true },
      public_id: { type: String, default: null }
    }],
    validate: {
      validator: function (val) {
        return Array.isArray(val) && val.length >= 3 && val.length <= 10;
      },
      message: 'Product must contain between 3 and 10 images.'
    }
  },
  views: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Single and Compound Indexes for search, filtering, and sorting
productSchema.index({ createdAt: -1 });
productSchema.index({ status: 1, createdAt: -1 });
productSchema.index({ category: 1, status: 1, price: 1 });
productSchema.index({ title: 'text', description: 'text', brand: 'text' });

module.exports = mongoose.model('Product', productSchema);
