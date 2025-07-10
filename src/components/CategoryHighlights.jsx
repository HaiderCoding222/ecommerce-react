import React from 'react';
import { Link } from 'react-router-dom';
import '../styles.css';

const categories = [
  { name: 'Electronics', image: 'https://picsum.photos/300/200?random=1', slug: 'electronics' },
  { name: 'Clothing', image: 'https://picsum.photos/300/200?random=2', slug: 'clothing' },
  { name: 'Accessories', image: 'https://picsum.photos/300/200?random=3', slug: 'accessories' },
  { name: 'Home', image: 'https://picsum.photos/300/200?random=4', slug: 'home' },
];

const CategoryHighlights = () => {
  return (
    <section className="mb-8">
      <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-center">Shop by Category</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {categories.map(category => (
          <Link
            key={category.slug}
            to={`/category/${category.slug}`}
            className="relative rounded-lg overflow-hidden shadow-lg group"
          >
            <img
              src={category.image}
              alt={category.name}
              className="w-full h-40 sm:h-48 object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <h3 className="text-lg sm:text-xl font-semibold text-white">{category.name}</h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CategoryHighlights;