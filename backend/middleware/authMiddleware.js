const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Product = require('../models/Product');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'resello_jwt_secret_key_2026_super_secure_faang_grade');
      
      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'User not found, token invalid' });
      }
      return next();
    } catch (error) {
      console.error('[Auth Guard Error]', error.message);
      return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }
};

const isProductOwner = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (product.seller.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You can only modify or delete your own listings'
      });
    }

    req.product = product;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  protect,
  isProductOwner
};
