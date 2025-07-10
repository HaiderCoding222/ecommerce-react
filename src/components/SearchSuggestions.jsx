import React from 'react';

const SearchSuggestions = ({ searchTerm, products, setSearchTerm }) => {
  const filteredSuggestions = products
    .filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .slice(0, 5);

  return (
    <div className="absolute z-10 w-full bg-white/90 dark:bg-gray-800/90 border border-gray-300 dark:border-gray-600 rounded-b-xl shadow-lg mt-1 text-sm sm:text-base animate-slide-down">
      {filteredSuggestions.length > 0 ? (
        filteredSuggestions.map(product => (
          <div
            key={product.id}
            className="px-3 sm:px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-gray-900 dark:text-gray-200 truncate"
            onClick={() => setSearchTerm(product.name)}
          >
            {product.name}
          </div>
        ))
      ) : (
        <div className="px-3 sm:px-4 py-2 text-gray-500 dark:text-gray-400">
          No matching products found
        </div>
      )}
    </div>
  );
};

export default SearchSuggestions;