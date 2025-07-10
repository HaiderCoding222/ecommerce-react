import React, { useState } from 'react';
import { FiMail, FiFacebook, FiTwitter, FiInstagram } from 'react-icons/fi';
import '../styles.css';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail('');
  };

  return (
    <footer className="bg-gray-800 dark:bg-gray-900 text-white py-8 sm:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          <div>
            <h3 className="text-lg sm:text-xl font-bold mb-4">ShopEase</h3>
            <p className="text-gray-400 text-sm sm:text-base">
              Your one-stop shop for all your needs. Quality products at unbeatable prices.
            </p>
          </div>
          <div>
            <h4 className="text-base sm:text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm sm:text-base">
              <li><a href="/" className="text-gray-400 hover:text-indigo-400">Home</a></li>
              <li><a href="/category/all" className="text-gray-400 hover:text-indigo-400">Shop</a></li>
              <li><a href="/cart" className="text-gray-400 hover:text-indigo-400">Cart</a></li>
              <li><a href="/wishlist" className="text-gray-400 hover:text-indigo-400">Wishlist</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-base sm:text-lg font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm sm:text-base">
              <li><a href="/contact" className="text-gray-400 hover:text-indigo-400">Contact Us</a></li>
              <li><a href="/faq" className="text-gray-400 hover:text-indigo-400">FAQ</a></li>
              <li><a href="/returns" className="text-gray-400 hover:text-indigo-400">Returns</a></li>
              <li><a href="/terms" className="text-gray-400 hover:text-indigo-400">Terms</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-base sm:text-lg font-semibold mb-4">Newsletter</h4>
            {subscribed ? (
              <p className="text-green-400 text-sm sm:text-base">Subscribed successfully!</p>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full p-2 sm:p-3 pl-10 rounded-full border border-gray-600 bg-gray-700 text-gray-100 text-sm sm:text-base focus:ring-2 focus:ring-indigo-500"
                  />
                  <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
                <button
                  type="submit"
                  className="bg-indigo-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full hover:bg-indigo-600 transition-all duration-300 text-sm sm:text-base"
                >
                  Subscribe
                </button>
              </form>
            )}
            <div className="flex gap-4 mt-4">
              <a href="#" className="text-gray-400 hover:text-indigo-400"><FiFacebook className="text-lg sm:text-xl" /></a>
              <a href="#" className="text-gray-400 hover:text-indigo-400"><FiTwitter className="text-lg sm:text-xl" /></a>
              <a href="#" className="text-gray-400 hover:text-indigo-400"><FiInstagram className="text-lg sm:text-xl" /></a>
            </div>
          </div>
        </div>
        <div className="mt-6 sm:mt-8 text-center text-gray-400 text-sm sm:text-base">
          &copy; {new Date().getFullYear()} ShopEase. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;