import api from './api';

export const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  if (response.data.token) {
    localStorage.setItem('resello_token', response.data.token);
  }
  return response.data;
};

export const register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  if (response.data.token) {
    localStorage.setItem('resello_token', response.data.token);
  }
  return response.data;
};

export const logout = async () => {
  try {
    await api.post('/auth/logout');
  } catch (e) {
    // Ignore error on logout endpoint call
  } finally {
    localStorage.removeItem('resello_token');
  }
};

export const getMe = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

export const updateProfile = async (formData) => {
  const isMultipart = formData instanceof FormData;
  const config = isMultipart ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};
  const response = await api.put('/auth/profile', formData, config);
  return response.data;
};

export const changePassword = async (passwordData) => {
  const response = await api.put('/auth/password', passwordData);
  return response.data;
};
