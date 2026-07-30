const User = require('../models/User');
const Product = require('../models/Product');

// @desc    Get logged in user wishlist
// @route   GET /api/v1/users/wishlist
// @access  Private
const getWishlist = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'wishlist',
      populate: { path: 'seller', select: 'name avatar location' }
    });

    res.status(200).json({
      success: true,
      count: user.wishlist.length,
      data: user.wishlist
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add product to wishlist
// @route   POST /api/v1/users/wishlist/:productId
// @access  Private
const addToWishlist = async (req, res, next) => {
  try {
    const productId = req.params.productId;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const user = await User.findById(req.user._id);
    if (!user.wishlist.includes(productId)) {
      user.wishlist.push(productId);
      await user.save();
    }

    res.status(200).json({
      success: true,
      message: 'Product added to wishlist',
      wishlist: user.wishlist
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove product from wishlist
// @route   DELETE /api/v1/users/wishlist/:productId
// @access  Private
const removeFromWishlist = async (req, res, next) => {
  try {
    const productId = req.params.productId;

    const user = await User.findById(req.user._id);
    user.wishlist = user.wishlist.filter(id => id.toString() !== productId.toString());
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Product removed from wishlist',
      wishlist: user.wishlist
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get public seller profile and active/sold listings
// @route   GET /api/v1/users/seller/:id
// @access  Public
const getSellerProfile = async (req, res, next) => {
  try {
    const seller = await User.findById(req.params.id).select('-password');
    if (!seller) {
      return res.status(404).json({ success: false, message: 'Seller profile not found' });
    }

    const products = await Product.find({ seller: req.params.id })
      .populate('seller', 'name avatar location')
      .sort({ status: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      seller,
      count: products.length,
      products
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  getSellerProfile
};
