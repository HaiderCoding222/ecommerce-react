import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { toast } from 'react-toastify';
import '../styles.css';

const Profile = () => {
  const { wishlist } = useWishlist();
  const { cart } = useCart();
  const navigate = useNavigate();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || {});
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ fullName: user.fullName || '', email: user.email || '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem('user', JSON.stringify(formData));
    setUser(formData);
    setIsEditing(false);
    toast.success('Profile updated successfully!');
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    toast.info('Logged out successfully');
    navigate('/login');
  };

  const orders = cart.map(item => ({
    id: item.id,
    name: item.name,
    price: item.price,
    quantity: item.quantity,
    date: new Date().toLocaleDateString(),
  }));

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100 min-h-screen">
      <h2 className="text-4xl font-bold mb-8 text-center">My Profile</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-xl shadow-xl p-6 animate-fade-in">
          <h3 className="text-xl font-semibold mb-4">User Details</h3>
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-1 text-gray-700 dark:text-gray-300">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-xl bg-white/50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block mb-1 text-gray-700 dark:text-gray-300">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-xl bg-white/50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-full hover:from-indigo-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-md"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 bg-gray-500 text-white px-6 py-3 rounded-full hover:bg-gray-600 transform hover:scale-105 transition-all duration-300 shadow-md"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <p><strong>Name:</strong> {user.fullName || 'N/A'}</p>
              <p><strong>Email:</strong> {user.email || 'N/A'}</p>
              <button
                onClick={() => setIsEditing(true)}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-full hover:from-indigo-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-md"
              >
                Edit Profile
              </button>
              <button
                onClick={handleLogout}
                className="w-full bg-red-500 text-white px-6 py-3 rounded-full hover:bg-red-600 transform hover:scale-105 transition-all duration-300 shadow-md"
              >
                Logout
              </button>
            </div>
          )}
        </div>
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-xl shadow-xl p-6 animate-fade-in">
            <h3 className="text-xl font-semibold mb-4">Order History</h3>
            {orders.length === 0 ? (
              <p className="text-gray-600 dark:text-gray-400">No orders yet.</p>
            ) : (
              <div className="space-y-4">
                {orders.map(order => (
                  <div key={order.id} className="flex justify-between border-b pb-2">
                    <div>
                      <p className="font-semibold">{order.name}</p>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">Qty: {order.quantity}</p>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">Date: {order.date}</p>
                    </div>
                    <p className="font-semibold">$ {(order.price * order.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-xl shadow-xl p-6 animate-fade-in">
            <h3 className="text-xl font-semibold mb-4">Wishlist</h3>
            {wishlist.length === 0 ? (
              <p className="text-gray-600 dark:text-gray-400">Your wishlist is empty.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {wishlist.map(item => (
                  <div key={item.id} className="flex items-center gap-4">
                    <img
                      src={item.imageUrl || '/placeholder-image.jpg'}
                      alt={item.name}
                      className="w-16 h-16 object-contain rounded-lg"
                    />
                    <div>
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-gray-600 dark:text-gray-400">$ {item.price.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;