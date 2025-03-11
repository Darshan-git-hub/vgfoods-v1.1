import { useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import Sidebar from './Sidebar';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, total } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!user) {
      toast.error('Please sign in to proceed to checkout');
      navigate('/signin');
      return;
    }
    navigate('/checkout/CheckoutForm');
  };

  if (cartItems.length === 0) {
    return (
      <>
        <Sidebar />
        <section className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <div className="text-center max-w-md mx-auto p-6">
            <div className="mb-6">
              <ShoppingBag className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Your cart is empty</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Looks like you haven't added any items to your cart yet.
            </p>
            <button 
              onClick={() => navigate('/menu')} 
              className="inline-flex items-center justify-center space-x-2 bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Continue Shopping</span>
            </button>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <Sidebar />
      <section className="min-h-screen bg-gray-50 dark:bg-gray-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Shopping Cart</h2>
            <button
              onClick={() => navigate('/menu')}
              className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-500"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Continue Shopping
            </button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center p-6 border-b border-gray-200 dark:border-gray-700">
                    <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-lg" />
                    
                    <div className="ml-6 flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{item.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{item.description}</p>
                      <div className="mt-2 flex items-center justify-between">
                        <p className="text-lg font-medium text-orange-600">£{item.price.toFixed(2)}</p>
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                            <button
                              onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-l-lg"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="text-gray-900 dark:text-white w-8 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-r-lg"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                          
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 sticky top-24">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Order Summary</h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Subtotal</span>
                    <span>£{total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>VAT (20%)</span>
                    <span>£{(total * 0.2).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Delivery</span>
                    <span>Free</span>
                  </div>
                  
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                    <div className="flex justify-between text-lg font-semibold text-gray-900 dark:text-white">
                      <span>Total</span>
                      <span>£{(total * 1.2).toFixed(2)}</span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Including VAT</p>
                  </div>
                  
                  <button 
                    onClick={handleCheckout}
                    className="w-full bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 transition-colors mt-6"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Cart;