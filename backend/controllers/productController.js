const Product = require('../models/Product');
const ApiFeatures = require('../utils/apiFeatures');

// @desc    Get all products with search, filter, sort, pagination
// @route   GET /api/v1/products
// @access  Public
const getProducts = async (req, res, next) => {
  try {
    const totalCountQuery = new ApiFeatures(Product.find(), req.query).search().filter();
    const totalProducts = await totalCountQuery.query.countDocuments();

    const apiFeatures = new ApiFeatures(Product.find().populate('seller', 'name avatar location createdAt'), req.query)
      .search()
      .filter()
      .sort()
      .paginate();

    const products = await apiFeatures.query;

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 12;
    const totalPages = Math.ceil(totalProducts / limit) || 1;

    res.status(200).json({
      success: true,
      count: products.length,
      total: totalProducts,
      totalPages,
      currentPage: page,
      data: products
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product details
// @route   GET /api/v1/products/:id
// @access  Public
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate('seller', 'name email avatar location bio createdAt');

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new product
// @route   POST /api/v1/products
// @access  Private
const createProduct = async (req, res, next) => {
  try {
    const { title, description, price, category, brand, condition, material, size, color } = req.body;

    let imageList = [];

    // Process uploaded files if available
    if (req.files && req.files.length > 0) {
      imageList = req.files.map(file => ({
        url: file.path || file.destination || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
        public_id: file.filename || null
      }));
    } else if (req.body.imageUrlStrings) {
      // Process JSON string array of image URLs if passed in body
      try {
        const urls = typeof req.body.imageUrlStrings === 'string' ? JSON.parse(req.body.imageUrlStrings) : req.body.imageUrlStrings;
        if (Array.isArray(urls)) {
          imageList = urls.map(url => ({ url, public_id: null }));
        }
      } catch (e) {
        console.error('Error parsing imageUrlStrings', e);
      }
    }

    // Validate 3 to 10 images requirement
    if (imageList.length < 3 || imageList.length > 10) {
      return res.status(400).json({
        success: false,
        message: `Product creation failed: Minimum 3 and maximum 10 images are required. Provided: ${imageList.length}`
      });
    }

    const product = await Product.create({
      title,
      description,
      price: Number(price),
      category,
      brand: brand || 'Unbranded',
      condition,
      material: material || 'N/A',
      size: size || 'Standard',
      color: color || 'Multi',
      images: imageList,
      seller: req.user._id,
      status: 'Available'
    });

    const populatedProduct = await Product.findById(product._id).populate('seller', 'name avatar location');

    res.status(201).json({
      success: true,
      message: 'Product listing created successfully',
      data: populatedProduct
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product listing (Owner Only)
// @route   PUT /api/v1/products/:id
// @access  Private (Owner Only)
const updateProduct = async (req, res, next) => {
  try {
    const product = req.product; // Loaded via isProductOwner middleware

    product.title = req.body.title || product.title;
    product.description = req.body.description || product.description;
    product.price = req.body.price !== undefined ? Number(req.body.price) : product.price;
    product.category = req.body.category || product.category;
    product.brand = req.body.brand || product.brand;
    product.condition = req.body.condition || product.condition;
    product.material = req.body.material || product.material;
    product.size = req.body.size || product.size;
    product.color = req.body.color || product.color;
    product.status = req.body.status || product.status; // Toggle 'Available' <-> 'Sold'

    // If new images provided
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => ({
        url: file.path || file.destination,
        public_id: file.filename || null
      }));

      const totalImages = product.images.length + newImages.length;
      if (totalImages > 10) {
        return res.status(400).json({
          success: false,
          message: `Cannot exceed 10 total images. Current: ${product.images.length}, New: ${newImages.length}`
        });
      }
      product.images.push(...newImages);
    }

    const updatedProduct = await product.save();
    const populated = await Product.findById(updatedProduct._id).populate('seller', 'name avatar location');

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: populated
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product listing (Owner Only)
// @route   DELETE /api/v1/products/:id
// @access  Private (Owner Only)
const deleteProduct = async (req, res, next) => {
  try {
    const product = req.product; // Loaded via isProductOwner middleware

    await Product.findByIdAndDelete(product._id);

    res.status(200).json({
      success: true,
      message: 'Product listing deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
