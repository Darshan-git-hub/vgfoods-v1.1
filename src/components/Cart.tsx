import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, total } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Your cart is empty</h2>
          <p className="text-gray-600 dark:text-gray-400">Add some delicious items to your cart!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Your Cart</h2>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          {cartItems.map((item) => (
            <div key={item.id} className="flex items-center py-4 border-b border-gray-200 dark:border-gray-700">
              <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-lg" />
              
              <div className="ml-6 flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{item.name}</h3>
                <p className="text-gray-600 dark:text-gray-400">£{item.price.toFixed(2)}</p>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-gray-900 dark:text-white w-8 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
          
          <div className="mt-8 flex justify-between items-center">
            <div>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">Total: £{total.toFixed(2)}</p>
            </div>
            <button className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700">
              Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;