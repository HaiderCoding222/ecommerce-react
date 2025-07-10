import React from 'react';

const QuickViewModal = ({ product, onClose, addToCart, addToWishlist }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 max-w-lg w-full sm:max-w-md md:max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-200 truncate">{product.name}</h2>
          <button
            onClick={onClose}
            className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 text-lg sm:text-xl"
          >
            ✕
          </button>
        </div>
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-48 sm:h-64 object-contain rounded mb-4"
        />
        <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base mb-2">{product.description}</p>
        <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base mb-2">$ {product.price.toFixed(2)}</p>
        <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base mb-2">Category: {product.category}</p>
        <p className="text-yellow-500 text-sm sm:text-base mb-4">
          {'★'.repeat(Math.floor(product.rating))}{'☆'.repeat(5 - Math.floor(product.rating))}
        </p>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
          <button
            onClick={() => addToCart(product)}
            className="bg-blue-500 dark:bg-blue-600 text-white px-3 sm:px-4 py-1 sm:py-2 rounded hover:bg-blue-600 dark:hover:bg-blue-700 text-sm sm:text-base"
          >
            Add to Cart
          </button>
          <button
            onClick={() => addToWishlist(product)}
            className="bg-gray-500 dark:bg-gray-600 text-white px-3 sm:px-4 py-1 sm:py-2 rounded hover:bg-gray-600 dark:hover:bg-gray-700 text-sm sm:text-base"
          >
            Add to Wishlist
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuickViewModal;