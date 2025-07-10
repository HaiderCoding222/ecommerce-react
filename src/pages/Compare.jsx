import React from 'react';
import { useWishlist } from '../context/WishlistContext';
import ProductComparison from '../components/ProductComparison';

const Compare = () => {
  const { wishlist } = useWishlist();

  return (
    <ProductComparison
      products={wishlist}
      onClose={() => window.history.back()}
    />
  );
};

export default Compare;