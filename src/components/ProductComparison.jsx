import React, { useState } from 'react';
import { useWishlist } from '../context/WishlistContext';
import { FiX } from 'react-icons/fi';
import '../styles.css';

const ProductComparison = ({ products, onClose }) => {
  const { removeFromWishlist } = useWishlist();
  const [selectedProducts, setSelectedProducts] = useState(products.slice(0, 4));

  const removeProduct = (id) => {
    setSelectedProducts(selectedProducts.filter(p => p.id !== id));
    removeFromWishlist(id);
  };

  if (!selectedProducts.length) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-gray-600 dark:text-gray-400">
        <p className="text-lg">No products selected for comparison.</p>
        <button
          onClick={onClose}
          className="mt-4 bg-indigo-500 text-white px-6 py-2 rounded-full hover:bg-indigo-600 transition-all duration-300"
        >
          Close
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-white/90 dark:bg-gray-800/90 rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold">Compare Products</h2>
        <button onClick={onClose} className="text-gray-600 dark:text-gray-300 hover:text-indigo-500">
          <FiX className="text-2xl" />
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse text-sm sm:text-base">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700">
              <th className="p-2 sm:p-4"></th>
              {selectedProducts.map(product => (
                <th key={product.id} className="p-2 sm:p-4 relative">
                  <button
                    onClick={() => removeProduct(product.id)}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-600"
                  >
                    <FiX />
                  </button>
                  <img
                    src={product.imageUrl || '/placeholder-image.jpg'}
                    alt={product.name}
                    className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg mx-auto"
                    loading="lazy"
                  />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="border-t dark:border-gray-600">
              <td className="p-2 sm:p-4 font-semibold">Name</td>
              {selectedProducts.map(product => (
                <td key={product.id} className="p-2 sm:p-4 text-center">{product.name}</td>
              ))}
            </tr>
            <tr className="border-t dark:border-gray-600">
              <td className="p-2 sm:p-4 font-semibold">Price</td>
              {selectedProducts.map(product => (
                <td key={product.id} className="p-2 sm:p-4 text-center">${product.price.toFixed(2)}</td>
              ))}
            </tr>
            <tr className="border-t dark:border-gray-600">
              <td className="p-2 sm:p-4 font-semibold">Category</td>
              {selectedProducts.map(product => (
                <td key={product.id} className="p-2 sm:p-4 text-center">{product.category}</td>
              ))}
            </tr>
            <tr className="border-t dark:border-gray-600">
              <td className="p-2 sm:p-4 font-semibold">Rating</td>
              {selectedProducts.map(product => (
                <td key={product.id} className="p-2 sm:p-4 text-center text-yellow-500">
                  {'★'.repeat(Math.floor(product.rating))}{'☆'.repeat(5 - Math.floor(product.rating))}
                </td>
              ))}
            </tr>
            <tr className="border-t dark:border-gray-600">
              <td className="p-2 sm:p-4 font-semibold">Stock</td>
              {selectedProducts.map(product => (
                <td key={product.id} className="p-2 sm:p-4 text-center">{product.stock}</td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductComparison;