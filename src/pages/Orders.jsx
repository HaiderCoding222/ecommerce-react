import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useOrder } from '../context/OrderContext';
import { toast } from 'react-toastify';

const Orders = () => {
  const navigate = useNavigate();
  const { orders, clearOrders } = useOrder();
  const isLoggedIn = localStorage.getItem('isLoggedIn');

  if (!isLoggedIn) {
    return (
      <div className="container mx-auto p-6 text-center bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200 min-h-screen">
        <h2 className="text-2xl font-bold mb-4">Please Log In</h2>
        <p className="text-lg text-gray-600 dark:text-gray-400">You need to be logged in to view your orders.</p>
        <button
          onClick={() => navigate('/login')}
          className="mt-4 bg-blue-500 dark:bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-600 dark:hover:bg-blue-700"
        >
          Go to Login
        </button>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container mx-auto p-6 text-center bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200 min-h-screen">
        <h2 className="text-2xl font-bold mb-4">No Orders Found</h2>
        <p className="text-lg text-gray-600 dark:text-gray-400">You haven't placed any orders yet.</p>
        <Link to="/" className="mt-4 inline-block bg-blue-500 dark:bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-600 dark:hover:bg-blue-700">
          Shop Now
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200 min-h-screen">
      <h2 className="text-3xl font-bold mb-6">Your Orders</h2>
      <button
        onClick={() => {
          clearOrders();
          toast.success('All orders cleared!');
        }}
        className="mb-6 bg-red-500 dark:bg-red-600 text-white px-4 py-2 rounded hover:bg-red-600 dark:hover:bg-red-700"
      >
        Clear Orders
      </button>
      <div className="space-y-6">
        {orders.map(order => (
          <div key={order.id} className="border p-4 rounded shadow bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-xl font-semibold">Order #{order.id}</h3>
                <p className="text-gray-600 dark:text-gray-400">Placed on: {order.date}</p>
              </div>
              <p className="text-lg font-bold">Total: Rs. {order.totalPrice}</p>
            </div>
            <div className="space-y-4">
              {order.items.map(item => (
                <div key={item.id} className="flex items-center justify-between border-b pb-2 border-gray-300 dark:border-gray-600">
                  <div className="flex items-center space-x-4">
                    <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover rounded" />
                    <div>
                      <h4 className="text-lg font-semibold">{item.name}</h4>
                      <p className="text-gray-600 dark:text-gray-400">Quantity: {item.quantity}</p>
                      <p className="text-gray-600 dark:text-gray-400">Price: Rs. {item.price}</p>
                    </div>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">Subtotal: Rs. {item.price * item.quantity}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;