import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabaseClient';
import { ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

interface ShippingInfo {
  firstName: string;
  lastName: string;
  company?: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  email: string;
  deliveryInstructions?: string;
}

const CheckoutForm = () => {
  const { cartItems, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'Online'>('Online');
  const [shippingInfo] = useState<ShippingInfo>({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    phone: '',
    email: user?.email || '',
    deliveryInstructions: ''
  });


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please sign in to complete your order');
      navigate('/signin');
      return;
    }

    try {
      setLoading(true);
      
      const orderData = {
        user_id: user.id,
        items: cartItems,
        total_amount: total * 1.2, // Including VAT
        shipping_info: shippingInfo,
        status: 'pending'
      };
      
      let error;
      if (paymentMethod === 'COD') {
        ({ error } = await supabase.from('menuorder').insert([{ ...orderData, payment_method: 'COD' }]));
      } else {
        ({ error } = await supabase.from('orders').insert([orderData]));
      }

      if (error) throw error;

      clearCart();
      toast.success('Order placed successfully!');
      navigate('/order-confirmation');
    } catch (error: any) {
      console.error('Error placing order:', error);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate('/cart')}
          className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-500 mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Cart
        </button>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Select Payment Method</h2>
          <div className="flex space-x-4">
            <button
              className={`flex-1 py-3 rounded-lg ${paymentMethod === 'Online' ? 'bg-orange-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-white'}`}
              onClick={() => setPaymentMethod('Online')}
            >
              Online Payment
            </button>
            <button
              className={`flex-1 py-3 rounded-lg ${paymentMethod === 'COD' ? 'bg-orange-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-white'}`}
              onClick={() => setPaymentMethod('COD')}
            >
              Cash on Delivery (COD)
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mt-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Order Summary</h3>
          <p className="text-gray-700 dark:text-gray-300">Total: £{(total * 1.2).toFixed(2)}</p>
          {paymentMethod === 'COD' ? (
            <p className="text-gray-700 dark:text-gray-300">You will pay in cash upon delivery.</p>
          ) : (
            <p className="text-gray-700 dark:text-gray-300">Please proceed with online payment.</p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 transition-colors disabled:bg-gray-400"
          >
            {loading ? 'Processing...' : 'Place Order'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CheckoutForm;