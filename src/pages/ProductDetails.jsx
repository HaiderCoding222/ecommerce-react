import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/LoadingSpinner';
import '../styles.css';

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();
  const [product, setProduct] = useState(null);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [filteredRecommended, setFilteredRecommended] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState(
    JSON.parse(localStorage.getItem(`reviews-${id}`)) || []
  );
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [cartAnimation, setCartAnimation] = useState(null);
  const [recSortBy, setRecSortBy] = useState('default');
  const imageRef = useRef(null);

  const fetchProduct = async (retries = 3, delay = 1000) => {
    try {
      setIsLoading(true);
      setError(null);
      if (!id) throw new Error('Invalid product ID');

      let response;
      if (id.startsWith('fake-')) {
        const fakeId = id.replace('fake-', '');
        response = await fetch(`https://fakestoreapi.com/products/${fakeId}`);
        if (!response.ok) throw new Error('Product not found in FakeStoreAPI');
        const item = await response.json();
        const fetchedProduct = {
          id: `fake-${item.id}`,
          name: item.title,
          price: item.price,
          imageUrl: item.image,
          images: [item.image],
          category: item.category.charAt(0).toUpperCase() + item.category.slice(1),
          rating: item.rating.rate,
          description: item.description,
          stock: Math.floor(Math.random() * 50) + 1,
        };
        setProduct(fetchedProduct);
        const recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed')) || [];
        const updatedViewed = [
          { id: fetchedProduct.id, name: fetchedProduct.name, price: fetchedProduct.price, imageUrl: fetchedProduct.imageUrl, category: fetchedProduct.category },
          ...recentlyViewed.filter(p => p.id !== id),
        ].slice(0, 3);
        localStorage.setItem('recentlyViewed', JSON.stringify(updatedViewed));
      } else if (id.startsWith('dummy-')) {
        const dummyId = id.replace('dummy-', '');
        response = await fetch(`https://dummyjson.com/products/${dummyId}`);
        if (!response.ok) throw new Error('Product not found in DummyJSON');
        const item = await response.json();
        const fetchedProduct = {
          id: `dummy-${item.id}`,
          name: item.title,
          price: item.price,
          imageUrl: item.thumbnail,
          images: item.images,
          category: item.category.charAt(0).toUpperCase() + item.category.slice(1),
          rating: item.rating,
          description: item.description,
          stock: Math.floor(Math.random() * 50) + 1,
        };
        setProduct(fetchedProduct);
        const recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed')) || [];
        const updatedViewed = [
          { id: fetchedProduct.id, name: fetchedProduct.name, price: fetchedProduct.price, imageUrl: fetchedProduct.imageUrl, category: fetchedProduct.category },
          ...recentlyViewed.filter(p => p.id !== id),
        ].slice(0, 3);
        localStorage.setItem('recentlyViewed', JSON.stringify(updatedViewed));
      } else {
        throw new Error('Invalid product ID format');
      }
      setIsLoading(false);
    } catch (err) {
      if (retries > 0) {
        setTimeout(() => fetchProduct(retries - 1, delay * 2), delay);
      } else {
        setError('Unable to load product details. Please try again.');
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchRecommendations = async () => {
    try {
      const fakeStoreResponse = await fetch('https://fakestoreapi.com/products');
      const fakeStoreData = await fakeStoreResponse.json();
      const fakeStoreProducts = fakeStoreData.map(item => ({
        id: `fake-${item.id}`,
        name: item.title,
        price: item.price,
        imageUrl: item.image,
        category: item.category.charAt(0).toUpperCase() + item.category.slice(1),
        rating: item.rating.rate,
        stock: Math.floor(Math.random() * 50) + 1,
      }));

      const dummyJsonResponse = await fetch('https://dummyjson.com/products?limit=30');
      const dummyJsonData = await dummyJsonResponse.json();
      const dummyJsonProducts = dummyJsonData.products.map(item => ({
        id: `dummy-${item.id}`,
        name: item.title,
        price: item.price,
        imageUrl: item.thumbnail,
        category: item.category.charAt(0).toUpperCase() + item.category.slice(1),
        rating: item.rating,
        stock: Math.floor(Math.random() * 50) + 1,
      }));

      const allProducts = [...fakeStoreProducts, ...dummyJsonProducts];
      if (product) {
        const recommendations = allProducts
          .filter(p => p.category === product.category && p.id !== product.id)
          .slice(0, 6);
        setRecommendedProducts(recommendations);
        setFilteredRecommended(recommendations);
      }
    } catch (err) {
      console.error('Failed to fetch recommendations:', err);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, [product]);

  useEffect(() => {
    let result = [...recommendedProducts];
    if (recSortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (recSortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (recSortBy === 'rating-desc') {
      result.sort((a, b) => b.rating - a.rating);
    }
    setFilteredRecommended(result);
  }, [recSortBy, recommendedProducts]);

  const handleRating = (value) => {
    setRating(value);
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!rating || !review.trim()) {
      toast.error('Please provide a rating and review.');
      return;
    }
    const newReview = {
      id: Date.now(),
      rating,
      text: review,
      user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).fullName : 'Anonymous',
      date: new Date().toLocaleDateString(),
    };
    const updatedReviews = [...reviews, newReview];
    setReviews(updatedReviews);
    localStorage.setItem(`reviews-${id}`, JSON.stringify(updatedReviews));
    toast.success('Review submitted successfully!');
    setRating(0);
    setReview('');
  };

  const handleQuantityChange = (change) => {
    const newQuantity = Math.max(1, quantity + change);
    if (product && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    } else {
      toast.error(`Only ${product.stock} items in stock!`);
    }
  };

  const handleImageChange = (index) => {
    setCurrentImageIndex(index);
  };

  const handleAddToCart = (e) => {
    if (quantity > product.stock) {
      toast.error(`Only ${product.stock} items in stock!`);
      return;
    }
    addToCart({ ...product, quantity });
    const rect = e.target.getBoundingClientRect();
    setCartAnimation({
      id: product.id,
      x: rect.x,
      y: rect.y,
    });
    setTimeout(() => setCartAnimation(null), 600);
    toast.success('Added to cart!');
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    const text = `Check out this product: ${product.name} - $${product.price.toFixed(2)}`;
    let shareUrl = '';
    switch (platform) {
      case 'whatsapp':
        shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text + ' ' + url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      default:
        return;
    }
    window.open(shareUrl, '_blank');
  };

  const handleZoom = (e) => {
    const { left, top, width, height } = imageRef.current.getBoundingClientRect();
    const x = (e.clientX - left) / width;
    const y = (e.clientY - top) / height;
    imageRef.current.style.transformOrigin = `${x * 100}% ${y * 100}%`;
    imageRef.current.style.transform = 'scale(2)';
  };

  const handleZoomOut = () => {
    imageRef.current.style.transform = 'scale(1)';
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-red-500 dark:text-red-400 min-h-screen">
        <p className="text-xl">{error || 'Product not found'}</p>
        <button
          onClick={fetchProduct}
          className="mt-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-3 rounded-full hover:from-indigo-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100 min-h-screen">
      <h2 className="text-3xl sm:text-4xl font-bold mb-8">{product.name}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-xl shadow-xl p-6 overflow-hidden">
          <div
            className="relative w-full h-80 md:h-96 overflow-hidden"
            onMouseMove={handleZoom}
            onMouseLeave={handleZoomOut}
          >
            <img
              ref={imageRef}
              src={product.images[currentImageIndex] || '/placeholder-image.jpg'}
              alt={product.name}
              className="w-full h-full object-cover rounded-lg transition-transform duration-300"
              loading="lazy"
              onError={(e) => { e.target.src = '/placeholder-image.jpg'; }}
            />
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2 mt-4 overflow-x-auto">
              {product.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${product.name} ${index + 1}`}
                  className={`w-16 h-16 object-cover rounded-lg cursor-pointer border-2 ${currentImageIndex === index ? 'border-indigo-500' : 'border-gray-200 dark:border-gray-600'}`}
                  onClick={() => handleImageChange(index)}
                  loading="lazy"
                  onError={(e) => { e.target.src = '/placeholder-image.jpg'; }}
                />
              ))}
            </div>
          )}
        </div>
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-xl shadow-xl p-6">
          <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm sm:text-base">{product.description}</p>
          <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm sm:text-base">Category: {product.category}</p>
          <p className="text-2xl font-bold mb-4">$ {product.price.toFixed(2)}</p>
          <p className="text-yellow-500 mb-4 text-sm sm:text-base">
            {'★'.repeat(Math.floor(product.rating))}{'☆'.repeat(5 - Math.floor(product.rating))}
          </p>
          <p className={`mb-4 ${product.stock <= 5 ? 'text-red-500 dark:text-red-400' : 'text-green-500 dark:text-green-400'} text-sm sm:text-base`}>
            {product.stock <= 5 ? `Hurry! Only ${product.stock} left in stock` : `${product.stock} in stock`}
          </p>
          <div className="flex items-center gap-4 mb-4">
            <label className="text-sm sm:text-lg text-gray-700 dark:text-gray-300">Quantity:</label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleQuantityChange(-1)}
                className="bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-gray-100 px-3 py-1 rounded-full hover:bg-gray-300 dark:hover:bg-gray-700 transform hover:scale-105 transition-all duration-300 shadow-sm min-w-[44px] min-h-[44px]"
                disabled={quantity <= 1}
              >
                -
              </button>
              <span className="px-4 py-1 border rounded-lg bg-white/50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 text-sm sm:text-base">{quantity}</span>
              <button
                onClick={() => handleQuantityChange(1)}
                className="bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-gray-100 px-3 py-1 rounded-full hover:bg-gray-300 dark:hover:bg-gray-700 transform hover:scale-105 transition-all duration-300 shadow-sm min-w-[44px] min-h-[44px]"
                disabled={quantity >= product.stock}
              >
                +
              </button>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-full hover:from-indigo-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-md text-sm sm:text-base"
              disabled={product.stock === 0}
            >
              Add to Cart
            </button>
            <button
              onClick={() => addToWishlist(product)}
              className="flex-1 bg-gray-500 dark:bg-gray-600 text-white px-6 py-3 rounded-full hover:bg-gray-600 dark:hover:bg-gray-700 transform hover:scale-105 transition-all duration-300 shadow-md text-sm sm:text-base"
            >
              Add to Wishlist
            </button>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => handleShare('whatsapp')}
              className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transform hover:scale-105 transition-all duration-300 shadow-md text-sm sm:text-base"
            >
              WhatsApp
            </button>
            <button
              onClick={() => handleShare('twitter')}
              className="bg-blue-400 text-white px-4 py-2 rounded-full hover:bg-blue-500 transform hover:scale-105 transition-all duration-300 shadow-md text-sm sm:text-base"
            >
              Twitter
            </button>
            <button
              onClick={() => handleShare('facebook')}
              className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transform hover:scale-105 transition-all duration-300 shadow-md text-sm sm:text-base"
            >
              Facebook
            </button>
          </div>
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
      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl sm:text-2xl font-bold">Recommended Products</h3>
          <select
            value={recSortBy}
            onChange={(e) => setRecSortBy(e.target.value)}
            className="p-2 border rounded-xl bg-white/50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 transition-all duration-300 shadow-sm text-sm sm:text-base"
          >
            <option value="default">Default</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating-desc">Rating: High to Low</option>
          </select>
        </div>
        {filteredRecommended.length === 0 ? (
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 text-center">No recommendations available.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredRecommended.map((rec, index) => (
              <div
                key={rec.id}
                className="product-card bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-xl shadow-xl overflow-hidden animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <img
                  src={rec.imageUrl || '/placeholder-image.jpg'}
                  alt={rec.name}
                  className="w-full h-56 object-cover p-4"
                  loading="lazy"
                  onError={(e) => { e.target.src = '/placeholder-image.jpg'; }}
                />
                <div className="p-4">
                  <h3 className="text-sm sm:text-lg font-semibold truncate">{rec.name}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">$ {rec.price.toFixed(2)}</p>
                  <Link
                    to={`/product/${rec.id}`}
                    className="text-indigo-500 dark:text-indigo-400 hover:underline text-sm sm:text-base"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="mt-8">
        <h3 className="text-xl sm:text-2xl font-semibold mb-4 text-center">Customer Reviews</h3>
        {reviews.length === 0 ? (
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 text-center">No reviews yet. Be the first to review!</p>
        ) : (
          <div className="space-y-4">
            {reviews.map(review => (
              <div key={review.id} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-xl shadow-xl p-4">
                <div className="flex items-center gap-2">
                  <span className="text-yellow-500">
                    {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                  </span>
                  <span className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">by {review.user} on {review.date}</span>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mt-2 text-sm sm:text-base">{review.text}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="mt-8">
        <h3 className="text-xl sm:text-2xl font-semibold mb-4 text-center">Write a Review</h3>
        <form onSubmit={handleReviewSubmit} className="max-w-md mx-auto space-y-4">
          <div>
            <label className="block mb-1 text-gray-700 dark:text-gray-300 text-sm sm:text-base">Rating</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map(star => (
                <span
                  key={star}
                  className={`cursor-pointer text-2xl ${star <= rating ? 'text-yellow-500' : 'text-gray-300 dark:text-gray-500'}`}
                  onClick={() => handleRating(star)}
                >
                  ★
                </span>
              ))}
            </div>
          </div>
          <div>
            <label className="block mb-1 text-gray-700 dark:text-gray-300 text-sm sm:text-base">Your Review</label>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              className="w-full p-3 border rounded-xl bg-white/50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 transition-all duration-300 shadow-sm text-sm sm:text-base"
              rows="5"
              placeholder="Write your review here..."
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-3 rounded-full hover:from-indigo-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-md text-sm sm:text-base"
          >
            Submit Review
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProductDetails;