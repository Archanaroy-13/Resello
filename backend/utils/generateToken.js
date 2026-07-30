const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'resello_jwt_secret_key_2026_super_secure_faang_grade', {
    expiresIn: '7d'
  });
};

module.exports = generateToken;
