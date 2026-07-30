import api from './api';

export const getProducts = async (params = {}) => {
  const response = await api.get('/products', { params });
  return response.data;
};

export const getMyListings = async () => {
  const response = await api.get('/products/my-listings');
  return response.data;
};

export const getProductById = async (id) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

export const createProduct = async (formData) => {
  const isMultipart = formData instanceof FormData;
  const config = isMultipart ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};
  const response = await api.post('/products', formData, config);
  return response.data;
};

export const updateProduct = async (id, data) => {
  const isMultipart = data instanceof FormData;
  const config = isMultipart ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};
  const response = await api.put(`/products/${id}`, data, config);
  return response.data;
};

export const updateProductStatus = async (id, status) => {
  const response = await api.patch(`/products/${id}/status`, { status });
  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await api.delete(`/products/${id}`);
  return response.data;
};
