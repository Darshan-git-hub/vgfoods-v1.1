import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Plus, Minus } from 'lucide-react';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'veg' | 'non-veg';
}

const menuItems: MenuItem[] = [
  {
    id: '1',
    name: 'Kal Dosa',
    description: '3 pcs with Sambar & Chutney',
    price: 5.99,
    image: 'https://images.unsplash.com/photo-1630383249896-424e482df921?auto=format&fit=crop&w=600&q=80',
    category: 'veg'
  },
  {
    id: '2',
    name: 'Medhu Vadai',
    description: '2pcs Served with Sambar & Chutney',
    price: 2.50,
    image: 'https://images.unsplash.com/photo-1630383249896-424e482df921?auto=format&fit=crop&w=600&q=80',
    category: 'veg'
  },
  // Add more menu items here...
];

const MenuCard: React.FC<{ item: MenuItem }> = ({ item }) => {
  const [quantity, setQuantity] = useState(0);
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    if (quantity > 0) {
      addToCart({ ...item });
      setQuantity(0);
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

const Menu = () => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'veg' | 'non-veg'>('all');

  const filteredItems = menuItems.filter(item => 
    activeCategory === 'all' ? true : item.category === activeCategory
  );

  return (
    <section id="menu" className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Our Menu</h2>
        
        <div className="flex justify-center space-x-4 mb-8">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-4 py-2 rounded-lg ${
              activeCategory === 'all'
                ? 'bg-orange-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveCategory('veg')}
            className={`px-4 py-2 rounded-lg ${
              activeCategory === 'veg'
                ? 'bg-orange-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200'
            }`}
          >
            Veg
          </button>
          <button
            onClick={() => setActiveCategory('non-veg')}
            className={`px-4 py-2 rounded-lg ${
              activeCategory === 'non-veg'
                ? 'bg-orange-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200'
            }`}
          >
            Non-Veg
          </button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map(item => (
            <MenuCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Menu;