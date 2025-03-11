// TakeawayMenu.tsx
import { useState, useEffect } from "react";
import { Plus, Minus } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../../../lib/supabaseClient";
import toast from "react-hot-toast";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: "veg" | "non-veg";
}

interface SelectedItem {
  item: MenuItem;
  quantity: number;
}

interface FormData {
  name: string;
  contact: string;
  pickupTime: string;
  instructions: string;
  address: string;
}

const TakeawayMenu = () => {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<"all" | "veg" | "non-veg">("all");
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("");
  const { state } = useLocation();
  const navigate = useNavigate();
  const formData = (state as { formData?: FormData; selectedItems?: SelectedItem[] })?.formData;
  const initialSelectedItems = (state as { selectedItems?: SelectedItem[] })?.selectedItems || [];
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>(initialSelectedItems);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("menu_items")
          .select("*")
          .order("name");

        if (error) {
          console.error("Error:", error);
          toast.error("Failed to load menu items.");
          return;
        }

        if (data) {
          setItems(
            data.map((item) => ({
              id: item.id,
              name: item.name,
              description: item.description || "",
              price: Number(item.price),
              image: item.image_url || "",
              category: item.category as "veg" | "non-veg",
            }))
          );
        }
      } catch (error) {
        console.error("Error fetching menu items:", error);
        toast.error("Using offline menu data (if available)");
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  const handleBackToTakeaway = () => {
    navigate("/services/takeaway", { state: { formData, selectedItems } });
  };

  const filteredItems = items
    .filter((item) => (activeCategory === "all" ? true : item.category === activeCategory))
    .filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortOption === "a-z") return a.name.localeCompare(b.name);
      if (sortOption === "z-a") return b.name.localeCompare(a.name);
      if (sortOption === "low-high") return a.price - b.price;
      if (sortOption === "high-low") return b.price - a.price;
      return 0;
    });

  if (loading) {
    return (
      <section className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center py-10 px-4">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Loading Menu...</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
              <div className="h-48 bg-gray-300 dark:bg-gray-700" />
              <div className="p-4">
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center py-10 px-4">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 mt-8">Takeaway Menu</h1>
      <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 text-center">
        Select items for your takeaway order.
      </p>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-8">
          <button
            onClick={() => setActiveCategory("all")}
            className={`px-4 py-2 rounded-lg ${activeCategory === "all" ? "bg-orange-600 text-white" : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200"}`}
          >
            All
          </button>
          <button
            onClick={() => setActiveCategory("veg")}
            className={`px-4 py-2 rounded-lg ${activeCategory === "veg" ? "bg-orange-600 text-white" : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200"}`}
          >
            Veg
          </button>
          <button
            onClick={() => setActiveCategory("non-veg")}
            className={`px-4 py-2 rounded-lg ${activeCategory === "non-veg" ? "bg-orange-600 text-white" : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200"}`}
          >
            Non-Veg
          </button>
          <input
            type="text"
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none sm:w-64"
          />
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none sm:w-48"
          >
            <option value="">Sort By</option>
            <option value="a-z">A to Z</option>
            <option value="z-a">Z to A</option>
            <option value="low-high">Price: Low to High</option>
            <option value="high-low">Price: High to Low</option>
          </select>
          <button
            onClick={handleBackToTakeaway}
            className="px-4 py-2 text-white bg-orange-500 hover:bg-orange-600 rounded-md font-semibold sm:w-auto"
          >
            Back to Takeaway Order
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <MenuCard 
              key={item.id} 
              item={item} 
              initialQuantity={getInitialQuantity(item.id)}
              setSelectedItems={setSelectedItems}
            />
          ))}
        </div>
      </div>
    </section>
  );

  function getInitialQuantity(itemId: string): number {
    const selected = initialSelectedItems.find((si) => si.item.id === itemId);
    return selected ? selected.quantity : 0;
  }
};

interface MenuCardProps {
  item: MenuItem;
  initialQuantity: number;
  setSelectedItems: React.Dispatch<React.SetStateAction<SelectedItem[]>>;
}

const MenuCard: React.FC<MenuCardProps> = ({ item, initialQuantity, setSelectedItems }) => {
  const [quantity, setQuantity] = useState(initialQuantity);

  const handleAddToTakeaway = () => {
    if (quantity > 0) {
      const newItem = {
        item: {
          id: item.id,
          name: item.name,
          price: item.price,
          image: item.image,
          description: item.description,
          category: item.category
        },
        quantity: quantity
      };
      
      setSelectedItems((prevItems) => {
        const updatedItems = prevItems.filter((si) => si.item.id !== item.id);
        return [...updatedItems, newItem];
      });
      
      toast.success(`Added ${item.name} to your takeaway order`);
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
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
          {item.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setQuantity((prev) => Math.max(0, prev - 1))}
              className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              disabled={quantity === 0}
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="text-gray-900 dark:text-white w-8 text-center">{quantity}</span>
            <button
              onClick={() => setQuantity((prev) => prev + 1)}
              className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleAddToTakeaway}
              disabled={quantity === 0}
              className={`px-4 py-2 rounded-lg ${quantity === 0 ? "bg-gray-300 dark:bg-gray-700 cursor-not-allowed" : "bg-orange-600 hover:bg-orange-700"} text-white transition-colors`}
            >
              Add to Takeaway Menu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TakeawayMenu;
