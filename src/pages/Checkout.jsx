import React, { useState, useContext } from 'react';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import '../styles.css';

const Checkout = () => {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
    paymentMethod: 'credit',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName) newErrors.fullName = 'Full name is required';
    if (!formData.address) newErrors.address = 'Address is required';
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.postalCode) newErrors.postalCode = 'Postal code is required';
    if (!formData.country) newErrors.country = 'Country is required';
    if (formData.paymentMethod === 'credit') {
      if (!formData.cardNumber || !/^\d{16}$/.test(formData.cardNumber)) {
        newErrors.cardNumber = 'Valid 16-digit card number is required';
      }
      if (!formData.expiryDate || !/^(0[1-9]|1[0-2])\/\d{2}$/.test(formData.expiryDate)) {
        newErrors.expiryDate = 'Valid expiry date (MM/YY) is required';
      }
      if (!formData.cvv || !/^\d{3}$/.test(formData.cvv)) {
        newErrors.cvv = 'Valid 3-digit CVV is required';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      toast.success('Order placed successfully!');
      clearCart();
      navigate('/');
    } else {
      toast.error('Please fix the errors in the form.');
    }
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100 min-h-screen">
      <h2 className="text-4xl font-bold mb-8 text-center">Checkout</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-xl shadow-xl p-6">
          <h3 className="text-2xl font-semibold mb-4">Shipping Details</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 text-gray-700 dark:text-gray-300">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full p-3 border rounded-xl bg-white/50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 transition-all duration-300 shadow-sm"
              />
              {errors.fullName && <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.fullName}</p>}
            </div>
            <div>
              <label className="block mb-1 text-gray-700 dark:text-gray-300">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full p-3 border rounded-xl bg-white/50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 transition-all duration-300 shadow-sm"
              />
              {errors.address && <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.address}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-gray-700 dark:text-gray-300">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-xl bg-white/50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500"
                />
                {errors.city && <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.city}</p>}
              </div>
              <div>
                <label className="block mb-1 text-gray-700 dark:text-gray-300">Postal Code</label>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-xl bg-white/50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500"
                />
                {errors.postalCode && <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.postalCode}</p>}
              </div>
            </div>
            <div>
              <label className="block mb-1 text-gray-700 dark:text-gray-300">Country</label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="w-full p-3 border rounded-xl bg-white/50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500"
              />
              {errors.country && <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.country}</p>}
            </div>
            <h3 className="text-xl font-semibold mt-6 mb-2">Payment Method</h3>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="credit"
                  checked={formData.paymentMethod === 'credit'}
                  onChange={handleChange}
                  className="mr-2"
                />
                Credit Card
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="paypal"
                  checked={formData.paymentMethod === 'paypal'}
                  onChange={handleChange}
                  className="mr-2"
                />
                PayPal
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cash"
                  checked={formData.paymentMethod === 'cash'}
                  onChange={handleChange}
                  className="mr-2"
                />
                Cash
              </label>
            </div>
            {formData.paymentMethod === 'credit' && (
              <div className="space-y-4 mt-4">
                <div>
                  <label className="block mb-1 text-gray-700 dark:text-gray-300">Card Number</label>
                  <input
                    type="text"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-xl bg-white/50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500"
                    placeholder="1234 5678 9012 3456"
                  />
                  {errors.cardNumber && <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.cardNumber}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 text-gray-700 dark:text-gray-300">Expiry Date</label>
                    <input
                      type="text"
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={handleChange}
                      className="w-full p-3 border rounded-xl bg-white/50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500"
                      placeholder="MM/YY"
                    />
                    {errors.expiryDate && <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.expiryDate}</p>}
                  </div>
                  <div>
                    <label className="block mb-1 text-gray-700 dark:text-gray-300">CVV</label>
                    <input
                      type="text"
                      name="cvv"
                      value={formData.cvv}
                      onChange={handleChange}
                      className="w-full p-3 border rounded-xl bg-white/50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500"
                      placeholder="123"
                    />
                    {errors.cvv && <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.cvv}</p>}
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-xl shadow-xl p-6">
          <h3 className="text-2xl font-semibold mb-4">Order Summary</h3>
          <div className="space-y-4">
            {cart.map(item => (
              <div key={item.id} className="flex justify-between">
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Qty: {item.quantity}</p>
                </div>
                <p className="font-semibold">$ {(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
            <div className="border-t pt-4">
              <div className="flex justify-between font-bold">
                <p>Total</p>
                <p>$ {total.toFixed(2)}</p>
              </div>
            </div>
            <button
              onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-3 rounded-full hover:from-indigo-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-md"
            >
              Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;