import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiShoppingCart, FiHeart, FiUser, FiMenu, FiX } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import '../styles.css';

const Navbar = ({ onSearch }) => {
  const { cart = [] } = useCart();
  const { wishlist = [] } = useWishlist();
  const { user, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(searchTerm);
    navigate('/');
    setSearchTerm('');
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    if (isProfileOpen) setIsProfileOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
    setIsMobileMenuOpen(false);
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-2xl sm:text-3xl font-bold text-indigo-600 dark:text-indigo-400">
          ShopEase
        </Link>

        {/* Desktop Search */}
        <div className="hidden md:flex flex-1 mx-4 lg:mx-8">
          <form onSubmit={handleSearch} className="w-full max-w-md">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-2.5 sm:py-3 pl-10 pr-4 rounded-full border border-gray-200 dark:border-gray-600 bg-white/80 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 transition-all duration-300 shadow-sm text-sm sm:text-base"
                aria-label="Search products"
              />
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400" size={20} />
            </div>
          </form>
        </div>

        {/* Desktop Icons */}
        <div className="hidden md:flex items-center gap-4 lg:gap-6">
          <Link to="/cart" className="relative p-2" aria-label="Cart">
            <FiShoppingCart className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors duration-200" />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cart.reduce((sum, item) => sum + (item.quantity || 0), 0)}
              </span>
            )}
          </Link>
          <Link to="/wishlist" className="relative p-2" aria-label="Wishlist">
            <FiHeart className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors duration-200" />
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </Link>
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="p-2 text-xl sm:text-2xl text-gray-600 dark:text-gray-300 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors duration-200"
              aria-label="User profile"
            >
              <FiUser />
            </button>
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl py-2 animate-slide-down z-50">
                {isLoggedIn ? (
                  <>
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-indigo-100 dark:hover:bg-indigo-900"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      to="/orders"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-indigo-100 dark:hover:bg-indigo-900"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      Orders
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-indigo-100 dark:hover:bg-indigo-900"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-indigo-100 dark:hover:bg-indigo-900"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-indigo-100 dark:hover:bg-indigo-900"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      Register
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-xl sm:text-2xl text-gray-600 dark:text-gray-300"
          onClick={toggleMobileMenu}
          aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {isMobileMenuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-md px-4 py-4 shadow-lg animate-slide-down">
          <form onSubmit={handleSearch} className="mb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-2.5 pl-10 pr-4 rounded-full border border-gray-200 dark:border-gray-600 bg-white/80 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 transition-all duration-300 shadow-sm text-sm"
                aria-label="Search products"
              />
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400" size={20} />
            </div>
          </form>
          <div className="flex flex-col space-y-2">
            <Link
              to="/"
              className="py-2 text-sm text-gray-600 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400"
              onClick={toggleMobileMenu}
            >
              Home
            </Link>
            <Link
              to="/cart"
              className="py-2 text-sm text-gray-600 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400"
              onClick={toggleMobileMenu}
            >
              Cart {cart.length > 0 && `(${cart.reduce((sum, item) => sum + (item.quantity || 0), 0)})`}
            </Link>
            <Link
              to="/wishlist"
              className="py-2 text-sm text-gray-600 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400"
              onClick={toggleMobileMenu}
            >
              Wishlist {wishlist.length > 0 && `(${wishlist.length})`}
            </Link>
            {isLoggedIn ? (
              <>
                <Link
                  to="/profile"
                  className="py-2 text-sm text-gray-600 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400"
                  onClick={toggleMobileMenu}
                >
                  Profile
                </Link>
                <Link
                  to="/orders"
                  className="py-2 text-sm text-gray-600 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400"
                  onClick={toggleMobileMenu}
                >
                  Orders
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-left py-2 text-sm text-gray-600 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="py-2 text-sm text-gray-600 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400"
                  onClick={toggleMobileMenu}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="py-2 text-sm text-gray-600 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400"
                  onClick={toggleMobileMenu}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;