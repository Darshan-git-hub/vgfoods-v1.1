import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";
import {
  X,
  Users,
  Mail,
  Phone,
  MapPin,
  Tag,
  Calendar,
  Clock,
  ShoppingCart,
  DollarSign,
  Package2,
  CreditCard,
  User as UserIcon,
} from "lucide-react";

export interface MenuItem {
  name: string;
  price: number;
  quantity: number;
  image_url?: string;
}

export interface MenuDetails {
  items: MenuItem[];
  total_amount: number;
  shipping_info?: { address?: string };
  payment_method?: string;
  status?: string;
}

export interface Order {
  id: string;
  created_at?: string;
  user_id: string;
  user_email?: string;
  user_name?: string;
  user_contact?: string;
  user_address?: string;
  typeoforder?: string;
  party_order_id?: string;
  takeaway_order_id?: string;
  reservation_id?: string;
  menuorder_id?: string;
  sequentialId?: number;
  details?: {
    total_amount: any;
    name?: string;
    contact?: string;
    email?: string;
    address?: string;
    pickup_time?: string;
    instructions?: string;
    menu_selections?: string;
    date?: string;
    time?: string;
    guests?: number;
    special_requests?: string;
    event_date?: string;
    guest_count?: number;
    dish_selections?: string;
    delivery_method?: string;
  };
  menuDetails?: MenuDetails;
  order_status?: string;
}

interface OrdersTableProps {
  orders: Order[];
  onOrderUpdate?: (updatedOrder: Order) => void;
}

const OrdersTable = ({ orders, onOrderUpdate }: OrdersTableProps) => {
  const { user, loading } = useAuth();
  const [role, setRole] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (loading) return;
    const fetchRole = async () => {
      if (user?.id) {
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();
        if (error) throw error;
        setRole(profile?.role || "user");
      }
    };
    fetchRole().catch((_error) => toast.error("Failed to load user role"));
  }, [loading, user?.id]);

  const handleUpdateStatus = async (order: Order, newStatus: string) => {
    if (role !== "admin") {
      toast.error("Only admins can update order status.");
      return;
    }

    try {
      let updateResult;
      if (order.menuorder_id) {
        updateResult = await supabase.from("menuorder").update({ status: newStatus }).eq("id", order.menuorder_id);
      } else if (order.party_order_id) {
        updateResult = await supabase.from("party_orders").update({ status: newStatus }).eq("id", order.party_order_id);
      } else if (order.takeaway_order_id) {
        updateResult = await supabase.from("takeaway_orders").update({ order_status: newStatus }).eq("id", order.takeaway_order_id);
      } else if (order.reservation_id) {
        updateResult = await supabase.from("reservations").update({ status: newStatus }).eq("id", order.reservation_id);
      }
      if (updateResult?.error) throw updateResult.error;

      const updatedOrder = { ...order, order_status: newStatus };
      if (onOrderUpdate) onOrderUpdate(updatedOrder);
      setSelectedOrder((prev) => (prev && prev.id === order.id ? updatedOrder : prev));
      toast.success("Order status updated!");
    } catch (error: any) {
      toast.error("Failed to update status: " + error.message);
    }
  };

  const getTotalPrice = (order: Order): string => {
    if (order.typeoforder === "menuorder" && order.menuDetails?.total_amount) {
      return `$${order.menuDetails.total_amount.toFixed(2)}`;
    } else if (order.typeoforder === "party_order" && order.details?.total_amount) {
      return `$${order.details.total_amount.toFixed(2)}`;
    } else if (order.typeoforder === "takeaway_order" && order.details?.total_amount) {
      return `$${order.details.total_amount.toFixed(2)}`;
    } else if (order.typeoforder === "reservation") {
      return "$0.00"; // Adjust if reservations have a price
    }
    return "N/A";
  };

  const getOrderDetails = (order: Order) => {
    const customerInfo = [
      { label: "Order ID", value: order.sequentialId?.toString() || order.id.slice(0, 8) + "...", icon: <Tag className="w-4 h-4 text-orange-600" /> },
      { label: "Customer Name", value: order.user_name || "Unknown", icon: <Users className="w-4 h-4 text-orange-600" /> },
      { label: "Email", value: order.user_email || "No Email", icon: <Mail className="w-4 h-4 text-orange-600" /> },
      { label: "Phone", value: order.user_contact || "No Contact", icon: <Phone className="w-4 h-4 text-orange-600" /> },
      { label: "Address", value: order.user_address || "No Address", icon: <MapPin className="w-4 h-4 text-orange-600" /> },
    ];

    const orderSummary = [
      { label: "Type", value: order.typeoforder || "Unknown", icon: <Tag className="w-4 h-4 text-orange-600" /> },
      { label: "Total Amount", value: getTotalPrice(order), icon: <DollarSign className="w-4 h-4 text-green-600" /> },
      { label: "Order Date", value: order.created_at || "Not Set", icon: <Calendar className="w-4 h-4 text-orange-600" /> },
      { label: "Status", value: order.order_status || "pending", icon: <Clock className="w-4 h-4 text-orange-600" /> },
    ];

    let specificDetails: { label: string; value: string; icon: React.ReactNode }[] = [];
    if (order.typeoforder === "menuorder" && order.menuDetails) {
      specificDetails = [
        { label: "Shipping Address", value: order.menuDetails.shipping_info?.address || "Not Set", icon: <MapPin className="w-4 h-4 text-orange-600" /> },
        { label: "Payment Method", value: order.menuDetails.payment_method || "Not Specified", icon: <CreditCard className="w-4 h-4 text-orange-600" /> },
      ];
    } else if (order.typeoforder === "party_order" && order.details) {
      specificDetails = [
        { label: "Event Date", value: order.details.event_date || "Not Set", icon: <Calendar className="w-4 h-4 text-orange-600" /> },
        { label: "Guests", value: order.details.guest_count?.toString() || "0", icon: <Users className="w-4 h-4 text-orange-600" /> },
        { label: "Dish Selections", value: order.details.dish_selections || "None", icon: <ShoppingCart className="w-4 h-4 text-orange-600" /> },
      ];
    } else if (order.typeoforder === "takeaway_order" && order.details) {
      specificDetails = [
        { label: "Pickup Time", value: order.details.pickup_time || "Not Set", icon: <Clock className="w-4 h-4 text-orange-600" /> },
        { label: "Instructions", value: order.details.instructions || "None", icon: <Tag className="w-4 h-4 text-orange-600" /> },
      ];
    } else if (order.typeoforder === "reservation" && order.details) {
      specificDetails = [
        { label: "Date", value: order.details.date || "Not Set", icon: <Calendar className="w-4 h-4 text-orange-600" /> },
        { label: "Time", value: order.details.time || "Not Set", icon: <Clock className="w-4 h-4 text-orange-600" /> },
        { label: "Guests", value: order.details.guests?.toString() || "0", icon: <Users className="w-4 h-4 text-orange-600" /> },
      ];
    }

    const orderedItems = order.typeoforder === "menuorder" && order.menuDetails?.items
      ? order.menuDetails.items.map((item) => ({
          name: item.name,
          price: `$${item.price.toFixed(2)}`,
          quantity: item.quantity.toString(),
          image: item.image_url || "https://via.placeholder.com/40",
        }))
      : [];

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden w-full max-w-3xl border border-gray-200 dark:border-gray-700"
      >
        {/* Header */}
        <div className="bg-orange-600 px-4 py-3 sm:px-6 sm:py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl sm:text-2xl font-bold text-white">Order Details</h1>
            <div className="flex items-center space-x-2">
              <span
                className={`inline-flex items-center px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-medium ${
                  (order.order_status || "pending") === "pending"
                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                    : (order.order_status || "pending") === "confirmed"
                    ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                    : (order.order_status || "pending") === "completed"
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                }`}
              >
                {(order.order_status || "pending").charAt(0).toUpperCase() + (order.order_status || "pending").slice(1)}
              </span>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6">
          {/* Order and Customer Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
            <div className="space-y-3 sm:space-y-4">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Package2 className="w-5 h-5 text-orange-600" />
                Order Information
              </h2>
              <div className="space-y-2">
                {orderSummary.map((item) => (
                  <p key={item.label} className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                    {item.icon} {item.label}: <span className="font-medium text-gray-900 dark:text-white">{item.value}</span>
                  </p>
                ))}
              </div>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <UserIcon className="w-5 h-5 text-orange-600" />
                Customer Details
              </h2>
              <div className="space-y-2">
                {customerInfo.slice(1).map((item) => (
                  <p key={item.label} className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                    {item.icon} {item.value}
                  </p>
                ))}
              </div>
            </div>
          </div>

          {/* Additional Details */}
          {specificDetails.length > 0 && (
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 sm:pt-6 space-y-3 sm:space-y-4">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Additional Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-4">
                {specificDetails.map((item) => (
                  <p key={item.label} className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                    {item.icon} {item.label}: <span className="font-medium text-gray-900 dark:text-white">{item.value}</span>
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Ordered Items */}
          {orderedItems.length > 0 && (
            <div className="mt-4 sm:mt-6 bg-gray-50 dark:bg-gray-700 rounded-lg p-3 sm:p-4">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2 sm:mb-3">Ordered Items</h2>
              <div className="space-y-2">
                {orderedItems.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2 sm:space-x-3">
                    <img src={item.image} alt={item.name} className="w-8 h-8 sm:w-10 sm:h-10 object-cover rounded" />
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">{item.name}</p>
                      <p className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400">{item.quantity} x {item.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  if (orders.length === 0) return <div className="text-center p-5 text-gray-400">No orders found.</div>;

  return (
    <>
      <div className="overflow-x-auto rounded-lg shadow-lg border border-gray-700">
        <table className="min-w-full bg-gray-800 text-white">
          <thead className="bg-gray-700">
            <tr>
              {["Order ID", "Customer Name", "Contact", "Email", "Type", "Address", "Status", "Action"].map((header) => (
                <th key={header} className="px-4 py-3 text-left text-sm font-semibold">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-t border-gray-700 hover:bg-gray-750 transition-all">
                <td className="px-4 py-3 text-sm">{order.sequentialId?.toString() || order.id.slice(0, 8) + "..."}</td>
                <td className="px-4 py-3 text-sm">{order.user_name || "Unknown"}</td>
                <td className="px-4 py-3 text-sm">{order.user_contact || "No Contact"}</td>
                <td className="px-4 py-3 text-sm">{order.user_email || "No Email"}</td>
                <td className="px-4 py-3 text-sm">{order.typeoforder || "Unknown"}</td>
                <td className="px-4 py-3 text-sm">{order.user_address || "No Address"}</td>
                <td className="px-4 py-3 text-sm capitalize">{order.order_status || "pending"}</td>
                <td className="px-4 py-3 text-sm flex items-center space-x-2">
                  {role === "admin" && (
                    <select
                      value={order.order_status || "pending"}
                      onChange={(e) => handleUpdateStatus(order, e.target.value)}
                      className="p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-orange-500"
                    >
                      {["pending", "confirmed", "completed", "cancelled"].map((status) => (
                        <option key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </option>
                      ))}
                    </select>
                  )}
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="py-1 px-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-all"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedOrder && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-0"
          onClick={() => setSelectedOrder(null)}
        >
          <div onClick={(e) => e.stopPropagation()}>{getOrderDetails(selectedOrder)}</div>
        </div>
      )}
    </>
  );
};

export default OrdersTable;