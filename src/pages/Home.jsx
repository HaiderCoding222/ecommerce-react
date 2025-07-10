import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import ProductList from '../components/ProductList';
import PromoBanner from '../components/PromoBanner';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import '../styles.css';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await fetch('https://fakestoreapi.com/products?limit=5');
        const data = await response.json();
        setFeaturedProducts(
          data.map(item => ({
            id: `fake-${item.id}`,
            name: item.title,
            price: item.price,
            imageUrl: item.image,
            category: item.category.charAt(0).toUpperCase() + item.category.slice(1),
          }))
        );
      } catch (err) {
        console.error('Failed to fetch featured products:', err);
      }
    };
    fetchFeatured();
  }, []);

  const nextSlide = () => {
    setCurrentIndex(prev => (prev + 1) % featuredProducts.length);
  };

  const prevSlide = () => {
    setCurrentIndex(prev => (prev - 1 + featuredProducts.length) % featuredProducts.length);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <PromoBanner />
      <section className="mb-8 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">Welcome to ShopEase</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6 text-lg sm:text-xl">
          Discover the best products at unbeatable prices!
        </p>
        <Link to="/category/all">
          <Button variant="primary" size="lg">Shop Now</Button>
        </Link>
      </section>
      <section className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-center">Featured Products</h2>
        {featuredProducts.length > 0 && (
          <div className="relative">
            <div className="relative w-full h-64 sm:h-80 md:h-96 overflow-hidden rounded-xl">
              <img
                src={featuredProducts[currentIndex].imageUrl || '/placeholder-image.jpg'}
                alt={featuredProducts[currentIndex].name}
                className="w-full h-full object-cover transition-opacity duration-500"
                loading="lazy"
                onError={e => (e.target.src = '/placeholder-image.jpg')}
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <div className="text-center">
                  <h3 className="text-xl sm:text-2xl font-semibold text-white">
                    {featuredProducts[currentIndex].name}
                  </h3>
                  <p className="text-white text-sm sm:text-base">
                    ${featuredProducts[currentIndex].price.toFixed(2)}
                  </p>
                  <Link to={`/product/${featuredProducts[currentIndex].id}`}>
                    <Button variant="primary" size="sm" className="mt-2">
                      View Now
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gray-800/50 text-white p-2 rounded-full hover:bg-gray-800/80 transition-all"
              aria-label="Previous slide"
            >
              <FaChevronLeft />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-800/50 text-white p-2 rounded-full hover:bg-gray-800/80 transition-all"
              aria-label="Next slide"
            >
              <FaChevronRight />
            </button>
          </div>
        )}
      </section>
      <section className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-center">Explore Our Products</h2>
        <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-4">
          <ProductList />
        </div>
      </section>
    </div>
  );
};

export default Home;