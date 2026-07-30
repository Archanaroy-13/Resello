const { parser } = require('../config/cloudinary');

const uploadProductImages = (req, res, next) => {
  const upload = parser.array('images', 10); // max 10 files

  upload(req, res, function (err) {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message || 'Image upload error'
      });
    }

    // Validate 3 to 10 images requirement for newly created products
    if (req.method === 'POST') {
      const fileCount = req.files ? req.files.length : 0;
      if (fileCount < 3 || fileCount > 10) {
        return res.status(400).json({
          success: false,
          message: `Product requires between 3 and 10 images. You provided ${fileCount}.`
        });
      }
    }

    next();
  });
};

const uploadAvatarImage = (req, res, next) => {
  const upload = parser.single('avatar');
  upload(req, res, function (err) {
    if (err) {
      return res.status(400).json({ success: false, message: err.message || 'Avatar upload error' });
    }
    next();
  });
};

module.exports = {
  uploadProductImages,
  uploadAvatarImage
};
