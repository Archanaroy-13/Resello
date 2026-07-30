const express = require('express');
const router = express.Router();
const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  getSellerProfile
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.get('/wishlist', protect, getWishlist);
router.post('/wishlist/:productId', protect, addToWishlist);
router.delete('/wishlist/:productId', protect, removeFromWishlist);

router.get('/seller/:id', getSellerProfile);

module.exports = router;
