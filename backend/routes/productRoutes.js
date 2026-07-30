const express = require('express');
const router = express.Router();
const {
  getProducts,
  getMyListings,
  getProductById,
  createProduct,
  updateProduct,
  updateProductStatus,
  deleteProduct
} = require('../controllers/productController');
const { protect, isProductOwner } = require('../middleware/authMiddleware');
const { uploadProductImages } = require('../middleware/uploadMiddleware');

// Public search & filter routes
router.get('/', getProducts);

// User listings route (must be before /:id)
router.get('/my-listings', protect, getMyListings);

// Single product route
router.get('/:id', getProductById);

// Protected CRUD routes
router.post('/', protect, uploadProductImages, createProduct);
router.put('/:id', protect, isProductOwner, uploadProductImages, updateProduct);
router.patch('/:id/status', protect, isProductOwner, updateProductStatus);
router.delete('/:id', protect, isProductOwner, deleteProduct);

module.exports = router;
