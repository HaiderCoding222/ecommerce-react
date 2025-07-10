import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import QuickViewModal from './QuickViewModal';
import LoadingSpinner from './LoadingSpinner';
import { FaSearch, FaFilter } from 'react-icons/fa';
import '../styles.css';

const ProductList = () => {
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cartAnimation, setCartAnimation] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [ratingRange, setRatingRange] = useState([0, 5]);
  const [sortOption, setSortOption] = useState('default');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const productsPerPage = 20;

  const generateMockProducts = (count, startId) => {
    const categories = ['Electronics', 'Clothing', 'Accessories', 'Home', 'Beauty'];
    const mockProducts = [];
    for (let i = 0; i < count; i++) {
      const category = categories[Math.floor(Math.random() * categories.length)];
      mockProducts.push({
        id: `mock-${startId + i}`,
        name: `Product ${startId + i} - ${category}`,
        price: parseFloat((Math.random() * 490 + 10).toFixed(2)),
        imageUrl: `https://picsum.photos/200/300?random=${startId + i}`,
        category,
        rating: parseFloat((Math.random() * 2 + 3).toFixed(1)),
        description: `Description for Product ${startId + i} in ${category} category.`,
        stock: Math.floor(Math.random() * 50) + 1,
      });
    }
    return mockProducts;
  };

  const fetchProducts = async (retries = 3, delay = 1000) => {
    try {
      setIsLoading(true);
      setError(null);

      const fakeStoreResponse = await fetch('https://fakestoreapi.com/products');
      if (!fakeStoreResponse.ok) throw new Error('Failed to fetch from FakeStoreAPI');
      const fakeStoreData = await fakeStoreResponse.json();
      const fakeStoreProducts = fakeStoreData.map(item => ({
        id: `fake-${item.id}`,
        name: item.title,
        price: item.price,
        imageUrl: item.image,
        category: item.category.charAt(0).toUpperCase() + item.category.slice(1),
        rating: item.rating.rate,
        description: item.description,
        stock: Math.floor(Math.random() * 50) + 1,
      }));

      const dummyJsonResponse = await fetch('https://dummyjson.com/products?limit=100');
      if (!dummyJsonResponse.ok) throw new Error('Failed to fetch from DummyJSON');
      const dummyJsonData = await dummyJsonResponse.json();
      const dummyJsonProducts = dummyJsonData.products.map(item => ({
        id: `dummy-${item.id}`,
        name: item.title,
        price: item.price,
        imageUrl: item.thumbnail,
        category: item.category.charAt(0).toUpperCase() + item.category.slice(1),
        rating: item.rating,
        description: item.description,
        stock: Math.floor(Math.random() * 50) + 1,
      }));

      const apiProducts = [...fakeStoreProducts, ...dummyJsonProducts];
      const mockProducts = generateMockProducts(130, apiProducts.length + 1);
      const combinedProducts = [...apiProducts, ...mockProducts];

      setProducts(combinedProducts);
      setIsLoading(false);
    } catch (err) {
      if (retries > 0) {
        setTimeout(() => fetchProducts(retries - 1, delay * 2), delay);
      } else {
        setError('Failed to load products. Please check your connection and try again.');
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    let result = products;

    if (searchQuery) {
      result = result.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== 'All') {
      result = result.filter(product => product.category === selectedCategory);
    }

    result = result.filter(
      product => product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    result = result.filter(
      product => product.rating >= ratingRange[0] && product.rating <= ratingRange[1]
    );

    switch (sortOption) {
      case 'price-low':
        result = [...result].sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result = [...result].sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result = [...result].sort((a, b) => b.rating - a.rating);
        break;
      case 'name':
        result = [...result].sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }

    return result;
  }, [products, searchQuery, selectedCategory, priceRange, ratingRange, sortOption]);

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, startIndex + productsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddToCart = (product, e) => {
    addToCart({ ...product, quantity: 1 });
    const rect = e.target.getBoundingClientRect();
    setCartAnimation({
      id: product.id,
      x: rect.x,
      y: rect.y,
    });
    setTimeout(() => setCartAnimation(null), 600);
  };

  const SkeletonCard = () => (
    <div className="bg-white/90 dark:bg-gray-800/90 rounded-lg shadow-lg overflow-hidden animate-pulse">
      <div className="w-full h-40 sm:h-48 lg:h-56 bg-gray-200 dark:bg-gray-700" />
      <div className="p-2 sm:p-4">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2" />
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4" />
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex-1" />
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex-1" />
        </div>
      </div>
    </div>
  );

  const categories = ['All', ...new Set(products.map(product => product.category))];

  if (error) {
    return (
      <div className="text-center text-red-500 dark:text-red-400 p-4 sm:p-6 bg-white/90 dark:bg-gray-900/90 rounded-lg shadow-lg max-w-md mx-auto mt-8 sm:mt-12">
        <p className="text-base sm:text-lg font-semibold">{error}</p>
        <button
          onClick={fetchProducts}
          className="mt-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full hover:from-indigo-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg text-sm sm:text-base"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 bg-gradient-to-b from.gray-50 to.white dark:from.gray-900 dark:to.gray-800">
      <div className="mb-6 sm:mb-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-lg p-4 sm:p-6 shadow-lg">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center">
          <div className="relative w-full sm:w-1/3">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
              aria-label="Search products"
            />
          </div>
          <div className="w-full sm:w-1/4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2.5 sm:py-3 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
              aria-label="Filter by category"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <div className="w-full sm:w-1/4">
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="w-full px-4 py-2.5 sm:py-3 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
              aria-label="Sort products"
            >
              <option value="default">Sort: Default</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Rating: High to Low</option>
              <option value="name">Name: A to Z</option>
            </select>
          </div>
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="bg-indigo-500 text-white px-4 py-2.5 sm:py-3 rounded-full hover:bg-indigo-600 flex items-center gap-2 text-sm sm:text-base"
            aria-label={isFilterOpen ? 'Close filters' : 'Open filters'}
          >
            <FaFilter /> Filters
          </button>
        </div>
        {isFilterOpen && (
          <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg animate-slide-down">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Price Range: ${priceRange[0]} - ${priceRange[1]}
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="range"
                  min="0"
                  max="500"
                  step="10"
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-500"
                  aria-label="Minimum price filter"
                />
                <input
                  type="range"
                  min="0"
                  max="500"
                  step="10"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-500"
                  aria-label="Maximum price filter"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Rating Range: {ratingRange[0]} - {ratingRange[1]} Stars
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="0.5"
                  value={ratingRange[0]}
                  onChange={(e) => setRatingRange([parseFloat(e.target.value), ratingRange[1]])}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-500"
                  aria-label="Minimum rating filter"
                />
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="0.5"
                  value={ratingRange[1]}
                  onChange={(e) => setRatingRange([ratingRange[0], parseFloat(e.target.value)])}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-500"
                  aria-label="Maximum rating filter"
                />
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="mb-4 text-gray-600 dark:text-gray-400 text-sm sm:text-base">
        Showing {startIndex + 1} - {Math.min(startIndex + productsPerPage, filteredProducts.length)} of {filteredProducts.length} products
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {isLoading
          ? Array.from({ length: productsPerPage }).map((_, index) => <SkeletonCard key={index} />)
          : currentProducts.map((product, index) => (
              <div
                key={product.id}
                className="product-card bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-lg shadow-lg overflow-hidden transform transition-all duration-500 hover:shadow-xl hover:-translate-y-1"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative">
                  <img
                    src={product.imageUrl || '/placeholder-image.jpg'}
                    alt={product.name}
                    className="w-full h-40 sm:h-48 lg:h-56 object-cover p-2 sm:p-3"
                    loading="lazy"
                    onError={(e) => (e.target.src = '/placeholder-image.jpg')}
                  />
                </div>
                <div className="p-2 sm:p-4">
                  <h3 className="text-sm sm:text-base lg:text-lg font-semibold truncate">{product.name}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm mt-1">{product.category}</p>
                  <p className="text-gray-900 dark:text-gray-100 font-bold text-base sm:text-lg mt-1">
                    ${product.price.toFixed(2)}
                  </p>
                  <p className="text-yellow-500 text-xs sm:text-sm mt-1">
                    {'★'.repeat(Math.floor(product.rating))}{'☆'.repeat(5 - Math.floor(product.rating))}
                  </p>
                  <div className="flex flex-col gap-2 mt-2 sm:mt-3">
                    <Link
                      to={`/product/${product.id}`}
                      className="text-indigo-500 dark:text-indigo-400 hover:underline text-xs sm:text-sm"
                      aria-label={`View details for ${product.name}`}
                    >
                      View Details
                    </Link>
                    <button
                      onClick={() => setSelectedProduct(product)}
                      className="text-indigo-500 dark:text-indigo-400 hover:underline text-xs sm:text-sm"
                      aria-label={`Quick view for ${product.name}`}
                    >
                      Quick View
                    </button>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 mt-3 sm:mt-4">
                    <button
                      onClick={(e) => handleAddToCart(product, e)}
                      className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-3 py-2 rounded-full hover:from-indigo-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-md text-xs sm:text-sm"
                      aria-label={`Add ${product.name} to cart`}
                    >
                      Add to Cart
                    </button>
                    <button
                      onClick={() => addToWishlist(product)}
                      className="flex-1 bg-gray-500 dark:bg-gray-600 text-white px-3 py-2 rounded-full hover:bg-gray-600 dark:hover:bg-gray-700 transform hover:scale-105 transition-all duration-300 shadow-md text-xs sm:text-sm"
                      aria-label={`Add ${product.name} to wishlist`}
                    >
                      Wishlist
                    </button>
                  </div>
                </div>
                {cartAnimation && cartAnimation.id === product.id && (
                  <img
                    src={product.imageUrl || '/placeholder-image.jpg'}
                    alt={product.name}
                    className="absolute w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-full animate-fly-to-cart shadow-lg"
                    style={{ top: cartAnimation.y, left: cartAnimation.x }}
                  />
                )}
              </div>
            ))}
      </div>
      {totalPages > 1 && (
        <div className="flex flex-wrap justify-center items-center gap-2 mt-6 sm:mt-8">
          <button
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
            className="px-3 sm:px-4 py-2 sm:py-3 bg-indigo-500 text-white rounded-full disabled:bg-gray-300 dark:disabled:bg-gray-600 hover:bg-indigo-600 transition text-xs sm:text-sm"
            aria-label="First page"
          >
            First
          </button>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 sm:px-4 py-2 sm:py-3 bg-indigo-500 text-white rounded-full disabled:bg-gray-300 dark:disabled:bg-gray-600 hover:bg-indigo-600 transition text-xs sm:text-sm"
            aria-label="Previous page"
          >
            Prev
          </button>
          {(() => {
            const pageNumbers = [];
            const maxPagesToShow = 5;
            let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
            let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
            if (endPage - startPage + 1 < maxPagesToShow) {
              startPage = Math.max(1, endPage - maxPagesToShow + 1);
            }
            for (let i = startPage; i <= endPage; i++) {
              pageNumbers.push(
                <button
                  key={i}
                  onClick={() => handlePageChange(i)}
                  className={`px-3 sm:px-4 py-2 sm:py-3 rounded-full text-xs sm:text-sm ${
                    currentPage === i
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-indigo-500 hover:text-white'
                  } transition`}
                  aria-label={`Page ${i}`}
                >
                  {i}
                </button>
              );
            }
            return pageNumbers;
          })()}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 sm:px-4 py-2 sm:py-3 bg-indigo-500 text-white rounded-full disabled:bg-gray-300 dark:disabled:bg-gray-600 hover:bg-indigo-600 transition text-xs sm:text-sm"
            aria-label="Next page"
          >
            Next
          </button>
          <button
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
            className="px-3 sm:px-4 py-2 sm:py-3 bg-indigo-500 text-white rounded-full disabled:bg-gray-300 dark:disabled:bg-gray-600 hover:bg-indigo-600 transition text-xs sm:text-sm"
            aria-label="Last page"
          >
            Last
          </button>
        </div>
      )}
      {selectedProduct && (
        <QuickViewModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          addToCart={addToCart}
          addToWishlist={addToWishlist}
        />
      )}
    </div>
  );
};

export default ProductList;