import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Button from '../components/Button';

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 text-center text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-900 min-h-screen">
        <p className="text-base sm:text-xl">Your cart is empty.</p>
        <Link to="/" className="mt-4 inline-block">
          <Button variant="primary" size="lg">Shop Now</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200 min-h-screen">
      <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Your Cart</h2>
      <Button variant="danger" onClick={clearCart} className="mb-4 sm:mb-6 text-sm sm:text-base">
        Clear Cart
      </Button>
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* Cart Items */}
        <div className="lg:w-2/3">
          <div className="space-y-4 sm:space-y-6">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b py-4 border-gray-300 dark:border-gray-600"
              >
                <div className="flex items-center space-x-4 w-full sm:w-auto">
                  <img
                    src={item.imageUrl || '/placeholder-image.jpg'}
                    alt={item.name}
                    className="w-20 h-20 sm:w-24 sm:h-24 object-contain rounded"
                    loading="lazy"
                    onError={(e) => (e.target.src = '/placeholder-image.jpg')}
                  />
                  <div>
                    <h3 className="text-sm sm:text-base lg:text-lg font-semibold truncate">{item.name}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                      $ {item.price.toFixed(2)}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <label className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
                        Quantity:
                      </label>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        aria-label={`Decrease quantity of ${item.name}`}
                      >
                        -
                      </Button>
                      <span className="px-3 sm:px-4 py-1 border rounded bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-200 text-sm sm:text-base">
                        {item.quantity}
                      </span>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        aria-label={`Increase quantity of ${item.name}`}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <p className="text-base sm:text-lg font-semibold">
                    $ {(item.price * item.quantity).toFixed(2)}
                  </p>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => removeFromCart(item.id)}
                    aria-label={`Remove ${item.name} from cart`}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Order Summary */}
        <div className="lg:w-1/3 bg-gray-50 dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md mt-6 lg:mt-0">
          <h3 className="text-lg sm:text-xl font-bold mb-4">Order Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm sm:text-base">
              <span>Subtotal</span>
              <span>$ {totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm sm:text-base">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="border-t pt-3 flex justify-between font-bold text-base sm:text-lg">
              <span>Total</span>
              <span>$ {totalPrice.toFixed(2)}</span>
            </div>
          </div>
          <Link to="/checkout" className="mt-4 sm:mt-6 block">
            <Button variant="primary" size="lg" className="w-full">
              Proceed to Checkout
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;