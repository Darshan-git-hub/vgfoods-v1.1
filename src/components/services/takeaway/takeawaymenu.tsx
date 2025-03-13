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

  const formData = (state as { formData?: FormData; selectedItems?: SelectedItem[] })?.formData || {
    name: "",
    contact: "",
    pickupTime: "",
    instructions: "",
    address: ""
  };
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
    // Log the current state to debug
    console.log("Navigating back with state:", { formData, selectedItems });
    // Navigate back with the current formData and selectedItems
    navigate("/takeaway", { state: { formData, selectedItems } });
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
      <section className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          Loading Menu...
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
    <section className="py-16 bg-gray-50 dark:bg-gray-900 min-h-screen relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 text-center">
          Takeaway Menu
        </h1>
        <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 mb-8 text-center">
          Select items for your takeaway order.
        </p>

        <div className="flex flex-col space-y-4 mb-8">
          <div className="flex flex-wrap justify-center gap-2">
            <button
              onClick={() => setActiveCategory("all")}
              className={`px-3 py-1 md:px-4 md:py-2 rounded-lg text-sm md:text-base ${
                activeCategory === "all"
                  ? "bg-orange-600 text-white"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveCategory("veg")}
              className={`px-3 py-1 md:px-4 md:py-2 rounded-lg text-sm md:text-base ${
                activeCategory === "veg"
                  ? "bg-orange-600 text-white"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200"
              }`}
            >
              Veg
            </button>
            <button
              onClick={() => setActiveCategory("non-veg")}
              className={`px-3 py-1 md:px-4 md:py-2 rounded-lg text-sm md:text-base ${
                activeCategory === "non-veg"
                  ? "bg-orange-600 text-white"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200"
              }`}
            >
              Non-Veg
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <input
              type="text"
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-64 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none text-sm md:text-base"
            />
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="w-full sm:w-48 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none text-sm md:text-base"
            >
              <option value="">Sort By</option>
              <option value="a-z">A to Z</option>
              <option value="z-a">Z to A</option>
              <option value="low-high">Price: Low to High</option>
              <option value="high-low">Price: High to Low</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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

      {/* Fixed Back to Takeaway Button */}
      <div className="fixed bottom-4 left-0 right-0 px-4">
        <button
          onClick={handleBackToTakeaway}
          className="w-full sm:w-auto mx-auto block px-6 py-3 text-white bg-orange-500 hover:bg-orange-600 rounded-md font-semibold text-sm md:text-base shadow-lg"
        >
          Back to Takeaway Order
        </button>
      </div>
    </section>
  );

  function getInitialQuantity(itemId: string): number {
    const selected = selectedItems.find((si) => si.item.id === itemId);
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
        const newSelectedItems = [...updatedItems, newItem];
        console.log("Updated selectedItems after adding:", newSelectedItems); // Debug log
        return newSelectedItems;
      });
      
      toast.success(`Added ${item.name} to your takeaway order`);
    }
  };

  const handleRemoveFromTakeaway = () => {
    if (quantity > 0) {
      setSelectedItems((prevItems) => {
        const updatedItems = prevItems.filter((si) => si.item.id !== item.id);
        console.log("Updated selectedItems after removing:", updatedItems); // Debug log
        return updatedItems;
      });
      setQuantity(0);
      toast.success(`Removed ${item.name} from your takeaway order`);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transform transition-all hover:scale-105">
      <img src={item.image} alt={item.name} className="w-full h-40 md:h-48 object-cover" />
      <div className="p-3 md:p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white">{item.name}</h3>
          <span className="text-orange-600 font-semibold text-sm md:text-base">£{item.price.toFixed(2)}</span>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-xs md:text-sm mb-3 md:mb-4 line-clamp-2">
          {item.description}
        </p>

        <div className="flex items-center justify-between flex-col sm:flex-row gap-2">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setQuantity((prev) => Math.max(0, prev - 1))}
              className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              disabled={quantity === 0}
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="text-gray-900 dark:text-white w-8 text-center text-sm md:text-base">{quantity}</span>
            <button
              onClick={() => setQuantity((prev) => prev + 1)}
              className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="flex flex-col sm:flex-row space-x-0 sm:space-x-2 w-full sm:w-auto">
            <button
              onClick={handleAddToTakeaway}
              disabled={quantity === 0}
              className={`w-full sm:w-auto px-3 py-1 md:px-4 md:py-2 rounded-lg text-sm md:text-base ${
                quantity === 0
                  ? "bg-gray-300 dark:bg-gray-700 cursor-not-allowed"
                  : "bg-orange-600 hover:bg-orange-700"
              } text-white transition-colors`}
            >
              Add to Takeaway
            </button>
            {quantity > 0 && (
              <button
                onClick={handleRemoveFromTakeaway}
                className="w-full sm:w-auto mt-2 sm:mt-0 px-3 py-1 md:px-4 md:py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm md:text-base"
              >
                Remove
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TakeawayMenu;