import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { MenuItem } from '../../types/menu';
import toast from 'react-hot-toast';

interface MenuCardProps {
  item: MenuItem;
}

const MenuCard: React.FC<MenuCardProps> = ({ item }) => {
  const [quantity, setQuantity] = useState(0);
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    if (quantity > 0) {
      addToCart({ ...item, quantity });
      setQuantity(0);
      
      toast.custom((t) => (
        <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}>
          <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900">
                  Just added to your cart
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  {item.name} (Qty: {quantity})
                </p>
                <div className="mt-2">
                  <button
                    onClick={() => window.location.href = '#cart'}
                    className="text-sm font-medium text-orange-600 hover:text-orange-500"
                  >
                    View Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="flex border-l border-gray-200">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-orange-600 hover:text-orange-500 focus:outline-none"
            >
              Close
            </button>
          </div>
        </div>
      ), { duration: 3000 });
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transform transition-all hover:scale-105">
      <img src={item.image} alt={item.name} className="w-full h-48 object-cover" />
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{item.name}</h3>
          <span className="text-orange-600 font-semibold">£{item.price.toFixed(2)}</span>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">{item.description}</p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setQuantity(prev => Math.max(0, prev - 1))}
              className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="text-gray-900 dark:text-white w-8 text-center">{quantity}</span>
            <button
              onClick={() => setQuantity(prev => prev + 1)}
              className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          
          <button
            onClick={handleAddToCart}
            disabled={quantity === 0}
            className={`px-4 py-2 rounded-lg ${
              quantity === 0
                ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'
                : 'bg-orange-600 hover:bg-orange-700'
            } text-white transition-colors`}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuCard;