import React, { useState } from "react";
import { supabase } from "../../../lib/supabaseClient";
import { useNavigate, useLocation } from "react-router-dom";
import { Plus, Minus, ArrowLeft } from "lucide-react"; // Added ArrowLeft
import Sidebar from '../../sections/Sidebar';

interface FormData {
  name: string;
  contact: string;
  pickupTime: string;
  instructions: string;
  address: string;
}

interface MenuItem {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category: "veg" | "non-veg";
}

interface SelectedItem {
  item: MenuItem;
  quantity: number;
}

const Takeaway = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const initialFormData: FormData = (state as { formData?: FormData; selectedItems?: SelectedItem[] })?.formData || {
    name: "",
    contact: "",
    pickupTime: "",
    instructions: "",
    address: "",
  };
  const initialSelectedItems = (state as { selectedItems?: SelectedItem[] })?.selectedItems || [];
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>(initialSelectedItems);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectItems = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log("Attempting to navigate to /services/takeaway/menu with state:", { formData, selectedItems });
    try {
      navigate("/services/takeaway/menu", { state: { formData, selectedItems } });
    } catch (error) {
      console.error("Navigation failed:", error);
      setMessage("Failed to navigate to menu. Please check your network or refresh the page.");
    }
  };

  const handleQuantityChange = (itemId: string, change: number) => {
    setSelectedItems((prevItems) => {
      const updatedItems = prevItems.map((si) => {
        if (si.item.id === itemId) {
          const newQuantity = Math.max(0, si.quantity + change);
          return { ...si, quantity: newQuantity };
        }
        return si;
      }).filter((si) => si.quantity > 0);
      return updatedItems;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedItems.length === 0) {
      setMessage("Please select at least one item for your takeaway order.");
      return;
    }

    setLoading(true);
    setMessage("");

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      setMessage("Error: User not authenticated.");
      setLoading(false);
      return;
    }

    const { name, contact, pickupTime, instructions, address } = formData;

    const menuSelections = JSON.stringify(
      selectedItems.map(({ item, quantity }) => ({
        item_id: item.id,
        name: item.name,
        price: item.price,
        quantity,
      }))
    );

    const { error } = await supabase.from("takeaway_orders").insert([
      {
        user_id: user.id,
        name,
        contact,
        pickup_time: pickupTime,
        instructions,
        address,
        menu_selections: menuSelections,
      },
    ]);

    if (error) {
      setMessage(`Error submitting order: ${error.message}`);
    } else {
      setMessage("Order successfully submitted!");
      setFormData({
        name: "",
        contact: "",
        pickupTime: "",
        instructions: "",
        address: "",
      });
      setSelectedItems([]);
    }

    setLoading(false);
  };

  return (
    <>
      <Sidebar />
      <section className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center py-10 px-4">
        {/* Back Button (Mobile Only) */}
        <button
          onClick={() => navigate(-1)}
          className="md:hidden flex items-center text-gray-900 dark:text-white mb-4 self-start"
        >
          <ArrowLeft className="w-6 h-6 mr-2" />
          Back
        </button>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 mt-8">Takeaway</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 text-center">
          Pick up your order fresh and hot from our restaurant.
        </p>

        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 w-full max-w-lg">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Place Your Order
          </h2>
          {message && <p className="text-center text-red-500 mb-4">{message}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            <div>
              <label
                htmlFor="contact"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Contact Number
              </label>
              <input
                type="tel"
                name="contact"
                id="contact"
                value={formData.contact}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            <div>
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Address
              </label>
              <input
                type="text"
                name="address"
                id="address"
                value={formData.address}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            <div>
              <label
                htmlFor="pickupTime"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Pickup Time
              </label>
              <input
                type="datetime-local"
                name="pickupTime"
                id="pickupTime"
                value={formData.pickupTime}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                Selected Items
              </h3>
              {selectedItems.length === 0 ? (
                <p className="text-gray-600 dark:text-gray-400">No items selected yet.</p>
              ) : (
                <ul className="space-y-2">
                  {selectedItems.map(({ item, quantity }) => (
                    <li
                      key={item.id}
                      className="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-700 rounded-md"
                    >
                      <span className="text-gray-900 dark:text-white">
                        {item.name}
                      </span>
                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() => handleQuantityChange(item.id, -1)}
                          className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"
                          disabled={quantity === 0}
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="text-gray-900 dark:text-white w-8 text-center">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleQuantityChange(item.id, 1)}
                          className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                        <span className="text-gray-600 dark:text-gray-400">
                          £{(item.price * quantity).toFixed(2)}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              <button
                type="button"
                onClick={handleSelectItems}
                className="mt-2 w-full px-4 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded-md font-semibold"
              >
                {selectedItems.length === 0 ? "Select Menu Items" : "Modify Menu Items"}
              </button>
            </div>

            <div>
              <label
                htmlFor="instructions"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Special Instructions
              </label>
              <textarea
                name="instructions"
                id="instructions"
                value={formData.instructions}
                onChange={handleInputChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-orange-500 focus:border-orange-500"
                rows={3}
              ></textarea>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 text-white bg-orange-500 hover:bg-orange-600 rounded-md font-semibold"
            >
              {loading ? "Submitting..." : "Submit Order"}
            </button>
          </form>
        </div>

        <div className="mt-10 w-full max-w-4xl">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 text-center">
            Find Us Here
          </h2>
          <div className="w-full h-64 bg-gray-300 dark:bg-gray-700 rounded-lg flex items-center justify-center">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2431.6894714420105!2d-1.9639870839685437!3d52.41752297979243!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4870bdfa5d0ee4e9%3A0x6c5e7e2a9c4e1b1a!2s855%20Bristol%20Rd%20S%2C%20Birmingham%20B31%202PA%2C%20UK!5e0!3m2!1sen!2sus!4v1645789012345!5m2!1sen!2sus"
              className="w-full h-64 rounded-lg"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </section>
    </>
  );
};

export default Takeaway;