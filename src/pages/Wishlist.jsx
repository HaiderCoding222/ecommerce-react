import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import Button from '../components/Button';
import { Helmet } from 'react-helmet-async';

const Wishlist = () => {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();

  if (wishlist.length === 0) {
    return (
      <div className="p-8 text-xl text-center text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-900 min-h-screen">
        <Helmet>
          <title>Wishlist - ShopEase</title>
          <meta name="description" content="View and manage your wishlist on ShopEase." />
        </Helmet>
        <p>Your wishlist is empty.</p>
        <Link to="/" className="mt-4 inline-block">
          <Button variant="primary">Shop Now</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200 min-h-screen">
      <Helmet>
        <title>Wishlist - ShopEase</title>
        <meta name="description" content="View and manage your wishlist on ShopEase." />
      </Helmet>
      <h2 className="text-3xl font-bold mb-6">Your Wishlist</h2>
      <Button variant="danger" onClick={clearWishlist} className="mb-6">
        Clear Wishlist
      </Button>
      <div className="space-y-6">
        {wishlist.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between border-b pb-4 border-gray-300 dark:border-gray-600"
          >
            <div className="flex items-center space-x-4">
              <img
                src={item.imageUrl || '/placeholder-image.jpg'}
                alt={item.name}
                className="w-24 h-24 object-cover rounded"
                loading="lazy"
                onError={(e) => (e.target.src = '/placeholder-image.jpg')}
              />
              <div>
                <h3 className="text-xl font-semibold">{item.name}</h3>
                <p className="text-gray-600 dark:text-gray-400">{item.category}</p>
                <p className="text-gray-600 dark:text-gray-400">$ {item.price.toFixed(2)}</p>
              </div>
            </div>
            <div className="flex gap-4">
              <Link
                to={`/product/${item.id}`}
                className="text-blue-500 dark:text-blue-400 hover:underline"
                aria-label={`View details of ${item.name}`}
              >
                View Details
              </Link>
              <Button
                variant="danger"
                size="sm"
                onClick={() => removeFromWishlist(item.id)}
                aria-label={`Remove ${item.name} from wishlist`}
              >
                Remove
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;