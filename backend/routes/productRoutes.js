const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');
const { protect, isProductOwner } = require('../middleware/authMiddleware');
const { uploadProductImages } = require('../middleware/uploadMiddleware');

router.route('/')
  .get(getProducts)
  .post(protect, uploadProductImages, createProduct);

router.route('/:id')
  .get(getProductById)
  .put(protect, isProductOwner, uploadProductImages, updateProduct)
  .delete(protect, isProductOwner, deleteProduct);

module.exports = router;
