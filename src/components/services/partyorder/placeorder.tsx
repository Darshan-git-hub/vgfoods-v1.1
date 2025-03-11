import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { supabase } from "../../../lib/supabaseClient";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Plus, Minus } from "lucide-react";
import Sidebar from '../../sections/Sidebar';

interface PlaceOrderProps {
  userId: string;
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

const PlaceOrder: React.FC<PlaceOrderProps> = ({ userId }) => {
  const navigate = useNavigate();
  const { state } = useLocation();
  console.log("PlaceOrder received state:", state);

  const initialFormData = (state as { formData?: any; selectedItems?: SelectedItem[] })?.formData || {
    name: "",
    contact: "",
    email: "",
    eventDate: "",
    guestCount: "",
    deliveryMethod: "",
    specialRequests: "",
    address: "",
  };
  const initialSelectedItems = (state as { selectedItems?: SelectedItem[] })?.selectedItems || [];
  const [formData, setFormData] = useState(initialFormData);
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>(initialSelectedItems);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectItems = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log("Navigating to /services/party-order/menu with state:", { formData, selectedItems });
    navigate("/services/party-order/menu", { state: { formData, selectedItems } });
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
      toast.error("Please select at least one dish for your party order.");
      return;
    }

    try {
      const dishSelections = JSON.stringify(
        selectedItems.map(({ item, quantity }) => ({
          item_id: item.id,
          name: item.name,
          price: item.price,
          quantity,
        }))
      );

      console.log("Submitting party order with data:", { user_id: userId, ...formData, dishSelections });

      const { data, error } = await supabase.from("party_orders").insert([
        {
          user_id: userId,
          name: formData.name,
          contact: formData.contact,
          email: formData.email || null,
          event_date: formData.eventDate,
          guest_count: parseInt(formData.guestCount, 10),
          dish_selections: dishSelections,
          delivery_method: formData.deliveryMethod,
          special_requests: formData.specialRequests || null,
          address: formData.address,
        },
      ]).select();

      if (error) throw error;

      console.log("Party order submitted successfully:", data);
      toast.success("Party order submitted successfully!");
      setFormData({
        name: "",
        contact: "",
        email: "",
        eventDate: "",
        guestCount: "",
        deliveryMethod: "",
        specialRequests: "",
        address: "",
      });
      setSelectedItems([]);
    } catch (error: any) {
      console.error("Error submitting party order:", error);
      toast.error(error.message || "Failed to submit order. Please try again.");
    }
  };

  return (
    <>
      <Sidebar />
      <section className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center py-10 px-4">
        <button
          onClick={() => navigate(-1)}
          className="md:hidden flex items-center text-gray-900 dark:text-white mb-4 self-start"
        >
          <ArrowLeft className="w-6 h-6 mr-2" />
          Back
        </button>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 mt-8">
          Party Order
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 text-center">
          Order delicious food for your event!
        </p>

        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 w-full max-w-lg">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Place Your Order
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            <div>
              <label htmlFor="contact" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Contact Number
              </label>
              <input
                type="tel"
                name="contact"
                id="contact"
                value={formData.contact}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Address
              </label>
              <textarea
                name="address"
                id="address"
                value={formData.address}
                onChange={handleChange}
                rows={3}
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-orange-500 focus:border-orange-500"
                placeholder="Enter the event address"
              />
            </div>
            <div>
              <label htmlFor="eventDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Event Date
              </label>
              <input
                type="date"
                name="eventDate"
                id="eventDate"
                value={formData.eventDate}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            <div>
              <label htmlFor="guestCount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Number of Guests
              </label>
              <input
                type="number"
                name="guestCount"
                id="guestCount"
                value={formData.guestCount}
                onChange={handleChange}
                min="1"
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                Selected Dishes
              </h3>
              {selectedItems.length === 0 ? (
                <p className="text-gray-600 dark:text-gray-400">No dishes selected yet.</p>
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
              <label htmlFor="deliveryMethod" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Delivery or Pickup
              </label>
              <select
                name="deliveryMethod"
                id="deliveryMethod"
                value={formData.deliveryMethod}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="">Select</option>
                <option value="Delivery">Delivery</option>
                <option value="Pickup">Pickup</option>
              </select>
            </div>
            <div>
              <label htmlFor="specialRequests" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Special Requests (Optional)
              </label>
              <textarea
                name="specialRequests"
                id="specialRequests"
                value={formData.specialRequests}
                onChange={handleChange}
                rows={3}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-orange-500 focus:border-orange-500"
                placeholder="E.g., dietary preferences or delivery instructions"
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 text-white bg-orange-500 hover:bg-orange-600 rounded-md font-semibold"
            >
              Submit Party Order
            </button>
          </form>
        </div>
      </section>
    </>
  );
};

export default PlaceOrder;