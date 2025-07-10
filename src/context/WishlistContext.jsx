import React, { createContext, useState, useContext, useMemo, useEffect } from 'react';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';

export const WishlistContext = createContext({
  wishlist: [],
  addToWishlist: () => {},
  removeFromWishlist: () => {},
  clearWishlist: () => {},
});

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState(JSON.parse(localStorage.getItem('wishlist')) || []);

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const addToWishlist = (item) => {
    setWishlist((prev) => {
      if (!prev.find((i) => i.id === item.id)) {
        toast.success(`${item.name} added to wishlist!`);
        return [...prev, item];
      }
      toast.info(`${item.name} is already in wishlist!`);
      return prev;
    });
  };

  const removeFromWishlist = (id) => {
    setWishlist((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      toast.info('Item removed from wishlist!');
      return updated;
    });
  };

  const clearWishlist = () => {
    setWishlist([]);
    toast.info('Wishlist cleared!');
  };

  const value = useMemo(
    () => ({ wishlist, addToWishlist, removeFromWishlist, clearWishlist }),
    [wishlist]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

WishlistProvider.propTypes = {
  children: PropTypes.node.isRequired,
};