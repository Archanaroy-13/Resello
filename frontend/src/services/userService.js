import api from './api';

export const getWishlist = async () => {
  const response = await api.get('/users/wishlist');
  return response.data;
};

export const addToWishlist = async (productId) => {
  const response = await api.post(`/users/wishlist/${productId}`);
  return response.data;
};

export const removeFromWishlist = async (productId) => {
  const response = await api.delete(`/users/wishlist/${productId}`);
  return response.data;
};

export const getSellerProfile = async (sellerId) => {
  const response = await api.get(`/users/seller/${sellerId}`);
  return response.data;
};
