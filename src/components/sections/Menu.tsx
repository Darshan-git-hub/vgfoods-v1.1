import React, { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { Plus, Minus, ArrowLeft } from 'lucide-react'; // Added ArrowLeft for back button
import { supabase } from '../../lib/supabaseClient';
import toast from 'react-hot-toast';
import { menuItems } from '../../data/menuItems';
import Sidebar from '../sections/Sidebar'; // Import Sidebar
import { useNavigate } from 'react-router-dom'; // Import useNavigate for back button

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'veg' | 'non-veg';
}

const Menu = () => {
  const [items, setItems] = useState<MenuItem[]>(menuItems);
  const [activeCategory, setActiveCategory] = useState<'all' | 'veg' | 'non-veg'>('all');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('');
  const navigate = useNavigate(); // For back button navigation

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('menu_items')
          .select('*')
          .order('name');

        if (error) {
          console.error('Error:', error);
          return;
        }

        if (data) {
          setItems(data.map(item => ({
            id: item.id,
            name: item.name,
            description: item.description || '',
            price: Number(item.price),
            image: item.image_url,
            category: item.category as 'veg' | 'non-veg'
          })));
        }
      } catch (error) {
        console.error('Error fetching menu items:', error);
        toast.error('Using offline menu data');
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  const filteredItems = items
    .filter(item => activeCategory === 'all' ? true : item.category === activeCategory)
    .filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortOption === 'a-z') return a.name.localeCompare(b.name);
      if (sortOption === 'z-a') return b.name.localeCompare(a.name);
      if (sortOption === 'low-high') return a.price - b.price;
      if (sortOption === 'high-low') return b.price - a.price;
      return 0;
    });

  if (loading) {
    return (
      <>
        <Sidebar /> {/* Include Sidebar in loading state */}
        <section id="menu" className="py-10 sm:py-20 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Back Button (Mobile Only) */}
            <button
              onClick={() => navigate(-1)} // Go back to previous page
              className="md:hidden flex items-center text-gray-900 dark:text-white mb-4"
            >
              <ArrowLeft className="w-6 h-6 mr-2" />
              Back
            </button>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 sm:mb-8 text-center">Our Menu</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                  <div className="h-24 sm:h-48 bg-gray-300 dark:bg-gray-700" />
                  <div className="p-3 sm:p-4">
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-2" />
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <Sidebar /> {/* Include Sidebar */}
      <section id="menu" className="py-10 sm:py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button (Mobile Only) */}
          <button
            onClick={() => navigate(-1)} // Go back to previous page
            className="md:hidden flex items-center text-gray-900 dark:text-white mb-4"
          >
            <ArrowLeft className="w-6 h-6 mr-2" />
            Back
          </button>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 sm:mb-8 text-center">Our Menu</h2>
          
          {/* Filters */}
          <div className="flex flex-col space-y-4 sm:space-y-6 mb-6 sm:mb-8">
            <div className="flex justify-center">
              <input
                type="text"
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-1/2 px-4 py-2 text-sm sm:text-base rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-center sm:space-x-4 space-y-4 sm:space-y-0">
              <div className="flex justify-center space-x-2 sm:space-x-4">
                <button
                  onClick={() => setActiveCategory('all')}
                  className={`px-3 py-2 text-sm sm:px-4 sm:py-2 sm:text-base rounded-lg ${
                    activeCategory === 'all' 
                      ? 'bg-orange-600 text-white' 
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setActiveCategory('veg')}
                  className={`px-3 py-2 text-sm sm:px-4 sm:py-2 sm:text-base rounded-lg ${
                    activeCategory === 'veg' 
                      ? 'bg-orange-600 text-white' 
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200'
                  }`}
                >
                  Veg
                </button>
                <button
                  onClick={() => setActiveCategory('non-veg')}
                  className={`px-3 py-2 text-sm sm:px-4 sm:py-2 sm:text-base rounded-lg ${
                    activeCategory === 'non-veg' 
                      ? 'bg-orange-600 text-white' 
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200'
                  }`}
                >
                  Non-Veg
                </button>
              </div>
              <div className="flex justify-center">
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="w-full sm:w-auto px-2 py-2 text-sm sm:text-base rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">Sort By</option>
                  <option value="a-z">A to Z</option>
                  <option value="z-a">Z to A</option>
                  <option value="low-high">Price: Low to High</option>
                  <option value="high-low">Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>

          {/* Menu Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredItems.map(item => (
              <MenuCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

const MenuCard: React.FC<{ item: MenuItem }> = ({ item }) => {
  const [quantity, setQuantity] = useState(0);
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    if (quantity > 0) {
      addToCart({ ...item, quantity });
      setQuantity(0);
      toast.success(`Added ${item.name} to cart`);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transform transition-all hover:scale-105">
      <div className="flex flex-row sm:flex-col items-center sm:items-stretch">
        <img 
          src={item.image} 
          alt={item.name} 
          className="w-16 h-16 sm:w-full sm:h-48 object-cover rounded-md sm:rounded-none flex-shrink-0" 
        />
        <div className="flex-1 p-3 sm:p-4 flex flex-col justify-between sm:justify-start ml-3 sm:ml-0">
          <div className="flex items-center justify-between sm:flex-col sm:items-start sm:mb-2 gap-2">
            <div className="flex items-center gap-2">
              {item.category === 'veg' ? (
                <img src="https://freesvg.org/img/1531813273.png" alt="Veg" className="w-4 h-4 sm:w-6 sm:h-6" />
              ) : (
                <img src="https://freesvg.org/img/1531813245.png" alt="Non-Veg" className="w-4 h-4 sm:w-6 sm:h-6" />
              )}
              <h3 className="text-sm sm:text-lg font-semibold text-gray-900 dark:text-white truncate">{item.name}</h3>
            </div>
            <span className="text-orange-600 font-semibold text-xs sm:text-base">£{item.price.toFixed(2)}</span>
          </div>
          <div className="flex flex-col sm:flex-col sm:mt-0 mt-1">
            <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm mb-2 sm:mb-4 line-clamp-2">{item.description}</p>
            <div className="flex items-center justify-between sm:flex-row sm:gap-2">
              <div className="flex items-center space-x-1 sm:space-x-2">
                <button
                  onClick={() => setQuantity(prev => Math.max(0, prev - 1))}
                  className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
                <span className="text-gray-900 dark:text-white w-6 sm:w-8 text-center text-xs sm:text-base">{quantity}</span>
                <button
                  onClick={() => setQuantity(prev => prev + 1)}
                  className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={quantity === 0}
                className={`px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-base rounded-lg ${
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
      </div>
    </div>
  );
};

export default Menu;