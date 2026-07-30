import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getWishlist, addToWishlist as apiAddToWishlist, removeFromWishlist as apiRemoveFromWishlist } from '../services/userService';

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { isAuthenticated, user, updateUserState } = useAuth();
  const [wishlistIds, setWishlistIds] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      if (Array.isArray(user.wishlist)) {
        const ids = user.wishlist.map(item => (typeof item === 'object' ? item._id : item));
        setWishlistIds(ids);
      }
      fetchWishlist();
    } else {
      setWishlistIds([]);
      setWishlistItems([]);
    }
  }, [isAuthenticated, user?._id]);

  const fetchWishlist = async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const data = await getWishlist();
      if (data.success) {
        setWishlistItems(data.data);
        setWishlistIds(data.data.map(item => item._id));
      }
    } catch (err) {
      console.error('[Wishlist Fetch Error]', err);
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async (productId) => {
    if (!isAuthenticated) return { success: false, message: 'Please log in to save items' };
    if (wishlistIds.includes(productId)) return { success: true, action: 'already_added' };

    try {
      setWishlistIds(prev => [...prev, productId]);
      const res = await apiAddToWishlist(productId);
      if (res.success && res.wishlist) {
        updateUserState({ ...user, wishlist: res.wishlist });
      }
      fetchWishlist();
      return { success: true, action: 'added' };
    } catch (err) {
      console.error('[Add Wishlist Error]', err);
      return { success: false, message: 'Failed to add to wishlist' };
    }
  };

  const removeFromWishlist = async (productId) => {
    if (!isAuthenticated) return { success: false, message: 'Please log in' };

    try {
      setWishlistIds(prev => prev.filter(id => id !== productId));
      setWishlistItems(prev => prev.filter(item => item._id !== productId));
      const res = await apiRemoveFromWishlist(productId);
      if (res.success && res.wishlist) {
        updateUserState({ ...user, wishlist: res.wishlist });
      }
      return { success: true, action: 'removed' };
    } catch (err) {
      console.error('[Remove Wishlist Error]', err);
      return { success: false, message: 'Failed to remove from wishlist' };
    }
  };

  const toggleWishlist = async (productId) => {
    if (!isAuthenticated) return { success: false, message: 'Please log in to save items' };

    const isSaved = wishlistIds.includes(productId);
    if (isSaved) {
      return await removeFromWishlist(productId);
    } else {
      return await addToWishlist(productId);
    }
  };

  const isWishlisted = (productId) => {
    return wishlistIds.includes(productId);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist: wishlistItems,
        wishlistIds,
        wishlistItems,
        loading,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isWishlisted,
        wishlistCount: wishlistIds.length,
        refreshWishlist: fetchWishlist
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
