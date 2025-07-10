import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import LoadingSpinner from '../components/LoadingSpinner';
import QuickViewModal from '../components/QuickViewModal';
import '../styles.css';

const Category = () => {
  const { name } = useParams();
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [compareProducts, setCompareProducts] = useState(JSON.parse(localStorage.getItem('compareProducts')) || []);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cartAnimation, setCartAnimation] = useState(null);
  const observerRef = useRef(null);
  const loadMoreRef = useRef(null);

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

      const dummyJsonResponse = await fetch('https://dummyjson.com/products?limit=30');
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

      const combinedProducts = [...fakeStoreProducts, ...dummyJsonProducts];
      setProducts(combinedProducts);
      setIsLoading(false);
    } catch (err) {
      if (retries > 0) {
        setTimeout(() => fetchProducts(retries - 1, delay * 2), delay);
      } else {
        setError('Unable to load products. Please try again.');
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const loadProducts = (pageNum) => {
    const start = (pageNum - 1) * 10;
    const end = start + 10;
    let result = products
      .filter(product => product.category.toLowerCase() === name.toLowerCase())
      .slice(0, end);

    setFilteredProducts(result);
    setHasMore(end < products.filter(product => product.category.toLowerCase() === name.toLowerCase()).length);
  };

  useEffect(() => {
    if (products.length > 0) {
      setPage(1);
      loadProducts(1);
    }
  }, [products, name]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          setPage(prev => prev + 1);
          loadProducts(page + 1);
        }
      },
      { threshold: 0.1 }
    );
    if (loadMoreRef.current) observer.observe(loadMoreRef.current);
    observerRef.current = observer;
    return () => observer.disconnect();
  }, [hasMore, isLoading, page, products]);

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

  const handleCompare = (product) => {
    let updatedCompare = compareProducts;
    if (compareProducts.some(p => p.id === product.id)) {
      updatedCompare = compareProducts.filter(p => p.id !== product.id);
    } else if (compareProducts.length < 4) {
      updatedCompare = [...compareProducts, product];
    }
    setCompareProducts(updatedCompare);
    localStorage.setItem('compareProducts', JSON.stringify(updatedCompare));
  };

  const startComparison = () => {
    if (compareProducts.length >= 2) {
      localStorage.setItem('compareProducts', JSON.stringify(compareProducts));
      navigate('/compare');
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-red-500 dark:text-red-400 min-h-screen">
        <p className="text-xl">{error}</p>
        <button
          onClick={fetchProducts}
          className="mt-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-3 rounded-full hover:from-indigo-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100 min-h-screen">
      <h2 className="text-4xl font-bold mb-8 text-center capitalize">{name} Products</h2>
      <div className="mb-6">
        <button
          onClick={startComparison}
          disabled={compareProducts.length < 2}
          className={`px-8 py-3 rounded-full text-white shadow-lg ${compareProducts.length < 2 ? 'bg-gray-400' : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300'}`}
        >
          Compare Selected ({compareProducts.length}/4)
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.length === 0 ? (
          <p className="text-xl text-gray-500 dark:text-gray-400 col-span-full text-center">No products found in this category.</p>
        ) : (
          filteredProducts
            .filter(product => product.id && (product.id.startsWith('fake-') || product.id.startsWith('dummy-')))
            .map((product, index) => (
              <div
                key={product.id}
                className="product-card bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-xl shadow-xl overflow-hidden transform transition-all duration-500 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <input
                  type="checkbox"
                  checked={compareProducts.some(p => p.id === product.id)}
                  onChange={() => handleCompare(product)}
                  className="absolute top-4 right-4 h-5 w-5"
                />
                <img
                  src={product.imageUrl || '/placeholder-image.jpg'}
                  alt={product.name}
                  className="w-full h-56 object-contain p-4"
                  loading="lazy"
                  onError={(e) => { e.target.src = '/placeholder-image.jpg'; }}
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold truncate">{product.name}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{product.category}</p>
                  <p className="text-gray-900 dark:text-gray-100 font-bold text-lg mt-1">$ {product.price.toFixed(2)}</p>
                  <p className="text-yellow-500 text-sm mt-1">
                    {'★'.repeat(Math.floor(product.rating))}{'☆'.repeat(5 - Math.floor(product.rating))}
                  </p>
                  <div className="flex flex-col gap-2 mt-4">
                    <Link
                      to={`/product/${product.id}`}
                      className="text-indigo-500 dark:text-indigo-400 hover:underline text-sm"
                    >
                      View Details
                    </Link>
                    <button
                      onClick={() => setSelectedProduct(product)}
                      className="text-indigo-500 dark:text-indigo-400 hover:underline text-sm"
                    >
                      Quick View
                    </button>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={(e) => handleAddToCart(product, e)}
                      className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-full hover:from-indigo-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-md"
                    >
                      Add to Cart
                    </button>
                    <button
                      onClick={() => addToWishlist(product)}
                      className="flex-1 bg-gray-500 dark:bg-gray-600 text-white px-4 py-2 rounded-full hover:bg-gray-600 dark:hover:bg-gray-700 transform hover:scale-105 transition-all duration-300 shadow-md"
                    >
                      Wishlist
                    </button>
                  </div>
                </div>
                {cartAnimation && cartAnimation.id === product.id && (
                  <img
                    src={product.imageUrl || '/placeholder-image.jpg'}
                    alt={product.name}
                    className="absolute w-12 h-12 object-cover rounded-full animate-fly-to-cart shadow-lg"
                    style={{ top: cartAnimation.y, left: cartAnimation.x }}
                  />
                )}
              </div>
            ))
        )}
      </div>
      {hasMore && (
        <div ref={loadMoreRef} className="flex justify-center py-6">
          <LoadingSpinner />
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

export default Category;