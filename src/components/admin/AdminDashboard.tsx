import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import {
  BarChart3,
  Users,
  ShoppingBag,
  DollarSign,
  LayoutDashboard,
  Settings,
  LogOut,
  Menu as MenuIcon,
  X,
  Percent,
  Mail,
  Phone,
  MapPin,
  Tag,
  Calendar,
  Clock,
  ShoppingCart,
  Package2,
  CreditCard,
  User as UserIcon,
} from "lucide-react";
import { RevenueChart } from "./Chart/RevenueChart";
import { SalesChart } from "./Chart/SalesChart";
import MenuManagement from "./MenuManagement";
import RolesAndPermissions from "./RolesAndPermissions";
import { RevenueData } from "./AdminDashboardTypes";

// Interfaces
export interface MenuItem {
  item_id?: string;
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
  created_at?: string;
}

export interface Order {
  sequentialId: number;
  id: string;
  typeoforder?: string;
  details?: any;
  created_at?: string;
  menuDetails?: MenuDetails;
  user_id: string;
  user_email?: string;
  user_name?: string;
  user_contact?: string;
  user_address?: string;
  party_order_id?: string;
  takeaway_order_id?: string;
  reservation_id?: string;
  menuorder_id?: string;
  order_status?: string;
}

interface Profile {
  id: string;
  full_name?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  created_at?: string | null;
  role?: string | null;
  updated_at?: string | null;
}

interface Customer {
  id: string;
  full_name: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  total_orders: number;
}

interface DashboardStats {
  totalReservations: number;
  totalPartyOrders: number;
  totalTakeawayOrders: number;
  totalMenuOrders: number;
  totalCustomers: number;
  averagePartyGuests: number;
  pendingOrders: number;
  completedOrders: number;
}

interface SalesData {
  dineIn: { orders: number };
  takeaway: { orders: number };
  partyOrders: { orders: number };
  menuOrders: { orders: number };
}

interface OrdersTableProps {
  orders: Order[];
  onOrderUpdate?: (updatedOrder: Order) => void;
}

// StatCard Component (unchanged)
function StatCard({ icon: Icon, title, value, trend }: { icon: React.ElementType; title: string; value: string; trend: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="bg-orange-50 dark:bg-gray-800 rounded-lg p-3 sm:p-5 shadow-lg hover:shadow-xl transition-all transform hover:scale-105 w-full"
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-600 dark:text-gray-400 text-xs mb-1">{title}</p>
          <h3 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">{value}</h3>
          <p className={`text-[10px] sm:text-xs mt-1 ${trend.includes('+') ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
            {trend}
          </p>
        </div>
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-orange-600 flex items-center justify-center flex-shrink-0">
          <Icon size={16} className="text-white" />
        </div>
      </div>
    </motion.div>
  );
}

// AdminSidebar Component (unchanged)
const AdminSidebar = () => {
  const location = useLocation();
  const { signOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
    { icon: ShoppingBag, label: "All Orders", path: "/admin/orders/all" },
    { icon: Users, label: "Customers", path: "/admin/customers" },
    { icon: Percent, label: "Discounts & Coupons", path: "/admin/discounts" },
    { icon: Settings, label: "Menu", path: "/admin/menu" },
    { icon: Settings, label: "Settings", path: "/admin/settings" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-20 p-2 rounded-lg bg-gray-100 dark:bg-gray-800"
      >
        <MenuIcon className="w-6 h-6" />
      </button>

      <div
        className={`
          fixed lg:static inset-y-0 left-0 z-10 w-64 bg-white dark:bg-gray-800 shadow-lg transform 
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"} 
          lg:translate-x-0 transition-transform duration-200 ease-in-out
        `}
      >
        <div className="flex flex-col h-full">
          <div className="p-4">
            <h1 className="text-2xl font-bold text-orange-600">Admin Panel</h1>
          </div>

          <nav className="flex-1 px-4 space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors
                  ${isActive(item.path) ? "bg-orange-600 text-white" : "text-gray-600 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-gray-700"}
                `}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={signOut}
              className="flex items-center space-x-3 px-4 py-3 w-full rounded-lg text-gray-600 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <LogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

// OrdersTable Component (Updated with takeaway details)
const OrdersTable = ({ orders, onOrderUpdate }: OrdersTableProps) => {
  const { user, loading } = useAuth();
  const [role, setRole] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [sortField, setSortField] = useState<"sequentialId" | "user_name" | "order_status">("sequentialId");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    if (loading) return;
    const fetchRole = async () => {
      if (user?.id) {
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single() as { data: Profile | null; error: any };
        if (error) throw error;
        setRole(profile?.role || "user");
      }
    };
    fetchRole().catch(() => toast.error("Failed to load user role"));
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

      if (onOrderUpdate) onOrderUpdate({ ...order, order_status: newStatus });
      setSelectedOrder((prev) => (prev && prev.id === order.id ? { ...prev, order_status: newStatus } : prev));
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
    } else if (order.typeoforder === "takeaway_order" && order.details) {
      // Calculate total from items if total_amount is not provided
      const items = order.details.menu_selections || [];
      const total = items.reduce((sum: number, item: MenuItem) => sum + item.price * item.quantity, 0);
      return `$${total.toFixed(2)}`;
    } else if (order.typeoforder === "reservation") {
      return "$0.00"; // Adjust if reservations have a price
    }
    return "N/A";
  };

  const getOrderDetails = (order: Order) => {
    const customerInfo = [
      { label: "Order ID", value: order.sequentialId.toString(), icon: <Tag className="w-4 h-4 text-blue-600" /> },
      { label: "Customer Name", value: order.user_name || "Unknown", icon: <Users className="w-4 h-4 text-blue-600" /> },
      { label: "Email", value: order.user_email || "No Email", icon: <Mail className="w-4 h-4 text-blue-600" /> },
      { label: "Phone", value: order.user_contact || "No Contact", icon: <Phone className="w-4 h-4 text-blue-600" /> },
      { label: "Address", value: order.user_address || "No Address", icon: <MapPin className="w-4 h-4 text-blue-600" /> },
    ];

    const orderSummary = [
      { label: "Type", value: order.typeoforder || "Unknown", icon: <Tag className="w-4 h-4 text-blue-600" /> },
      { label: "Total Amount", value: getTotalPrice(order), icon: <DollarSign className="w-4 h-4 text-green-600" /> },
      { label: "Order Date", value: order.created_at || "Not Set", icon: <Calendar className="w-4 h-4 text-blue-600" /> },
      { label: "Status", value: order.order_status || "pending", icon: <Clock className="w-4 h-4 text-blue-600" /> },
    ];

    let specificDetails: { label: string; value: string; icon: React.ReactNode }[] = [];
    let orderedItems: { name: string; price: string; quantity: string; image: string }[] = [];

    if (order.typeoforder === "menuorder" && order.menuDetails) {
      specificDetails = [
        { label: "Shipping Address", value: order.menuDetails.shipping_info?.address || order.user_address || "Not Provided", icon: <MapPin className="w-4 h-4 text-blue-600" /> },
        { label: "Payment Method", value: order.menuDetails.payment_method || "Not Specified", icon: <CreditCard className="w-4 h-4 text-blue-600" /> },
      ];
      orderedItems = order.menuDetails.items.map((item) => ({
        name: item.name,
        price: `$${item.price.toFixed(2)}`,
        quantity: item.quantity.toString(),
        image: item.image_url || "https://via.placeholder.com/40",
      }));
    } else if (order.typeoforder === "party_order" && order.details) {
      specificDetails = [
        { label: "Event Date", value: order.details.event_date || "Not Set", icon: <Calendar className="w-4 h-4 text-blue-600" /> },
        { label: "Guests", value: order.details.guest_count?.toString() || "0", icon: <Users className="w-4 h-4 text-blue-600" /> },
        { label: "Dish Selections", value: order.details.dish_selections || "None", icon: <ShoppingCart className="w-4 h-4 text-blue-600" /> },
      ];
    } else if (order.typeoforder === "takeaway_order" && order.details) {
      specificDetails = [
        { label: "Pickup Time", value: order.details.pickup_time || "Not Set", icon: <Clock className="w-4 h-4 text-blue-600" /> },
        { label: "Instructions", value: order.details.instructions || "None", icon: <Tag className="w-4 h-4 text-blue-600" /> },
      ];
      orderedItems = (order.details.menu_selections || []).map((item: MenuItem) => ({
        name: item.name,
        price: `$${item.price.toFixed(2)}`,
        quantity: item.quantity.toString(),
        image: item.image_url || "https://via.placeholder.com/40",
      }));
    } else if (order.typeoforder === "reservation" && order.details) {
      specificDetails = [
        { label: "Date", value: order.details.date || "Not Set", icon: <Calendar className="w-4 h-4 text-blue-600" /> },
        { label: "Time", value: order.details.time || "Not Set", icon: <Clock className="w-4 h-4 text-blue-600" /> },
        { label: "Guests", value: order.details.guests?.toString() || "0", icon: <Users className="w-4 h-4 text-blue-600" /> },
      ];
    }

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden w-full max-w-3xl border border-gray-200 dark:border-gray-700"
      >
        {/* Header */}
        <div className="bg-blue-600 px-4 py-3 sm:px-6 sm:py-4">
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
                <Package2 className="w-5 h-5 text-blue-600" />
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
                <UserIcon className="w-5 h-5 text-blue-600" />
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

  const handleSort = (field: "sequentialId" | "user_name" | "order_status") => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const sortedOrders = [...orders].sort((a, b) => {
    if (sortField === "sequentialId") {
      return sortOrder === "asc" ? a.sequentialId - b.sequentialId : b.sequentialId - a.sequentialId;
    } else if (sortField === "user_name") {
      return sortOrder === "asc"
        ? (a.user_name || "").localeCompare(b.user_name || "")
        : (b.user_name || "").localeCompare(a.user_name || "");
    } else if (sortField === "order_status") {
      return sortOrder === "asc"
        ? (a.order_status || "").localeCompare(b.order_status || "")
        : (b.order_status || "").localeCompare(a.order_status || "");
    }
    return 0;
  });

  if (orders.length === 0) return <div className="text-center p-4 text-gray-400 text-sm">No orders found.</div>;

  return (
    <>
      <div className="overflow-x-auto rounded-lg shadow-lg border border-gray-700">
        <table className="min-w-full bg-gray-800 text-white text-xs sm:text-sm">
          <thead className="bg-gray-700">
            <tr>
              {[
                { label: "Order ID", field: "sequentialId" },
                { label: "Customer Name", field: "user_name" },
                { label: "Contact", field: null },
                { label: "Email", field: null },
                { label: "Type", field: null },
                { label: "Total Amount", field: null },
                { label: "Status", field: "order_status" },
                { label: "Action", field: null },
              ].map((header) => (
                <th
                  key={header.label}
                  className="px-2 py-2 sm:px-4 sm:py-3 text-left text-xs sm:text-sm font-semibold cursor-pointer"
                  onClick={header.field ? () => handleSort(header.field as any) : undefined}
                >
                  {header.label}
                  {header.field && sortField === header.field && (sortOrder === "asc" ? " ↑" : " ↓")}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedOrders.map((order) => (
              <tr key={order.id} className="border-t border-gray-700 hover:bg-gray-750 transition-all">
                <td className="px-2 py-2 sm:px-4 sm:py-3 truncate max-w-[60px] sm:max-w-[100px]">{order.sequentialId}</td>
                <td className="px-2 py-2 sm:px-4 sm:py-3 truncate max-w-[100px] sm:max-w-[150px]">{order.user_name || "Unknown"}</td>
                <td className="px-2 py-2 sm:px-4 sm:py-3 truncate max-w-[80px] sm:max-w-[120px]">{order.user_contact || "No Contact"}</td>
                <td className="px-2 py-2 sm:px-4 sm:py-3 truncate max-w-[100px] sm:max-w-[150px]">{order.user_email || "No Email"}</td>
                <td className="px-2 py-2 sm:px-4 sm:py-3 truncate max-w-[60px] sm:max-w-[100px]">{order.typeoforder || "Unknown"}</td>
                <td className="px-2 py-2 sm:px-4 sm:py-3">{getTotalPrice(order)}</td>
                <td className="px-2 py-2 sm:px-4 sm:py-3 capitalize truncate max-w-[60px] sm:max-w-[100px]">{order.order_status || "pending"}</td>
                <td className="px-2 py-2 sm:px-4 sm:py-3 flex items-center space-x-1 sm:space-x-2">
                  {role === "admin" && (
                    <select
                      value={order.order_status || "pending"}
                      onChange={(e) => handleUpdateStatus(order, e.target.value)}
                      className="p-1 sm:p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-orange-500 text-[10px] sm:text-xs"
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
                    className="py-1 px-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-all text-[10px] sm:text-xs"
                  >
                    View
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

// OrderCard Component (unchanged)
interface OrderCardProps {
  order: Order;
  onCancel: (orderId: string) => void;
  onUpdateStatus: (orderId: string, newStatus: string) => void;
  isAdmin: boolean;
}

const OrderCard: React.FC<OrderCardProps> = ({ order, onCancel, onUpdateStatus, isAdmin }) => {
  const [status, setStatus] = useState<string>(order.order_status || "pending");
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => setStatus(e.target.value);

  const handleSaveStatus = () => {
    if (isAdmin && status !== order.order_status) {
      onUpdateStatus(order.id, status);
      setIsEditing(false);
    }
  };

  const getOrderDetails = () => {
    const details = [];
    details.push(<p key="name"><strong>Name:</strong> {order.user_name || "Unknown"}</p>);
    details.push(<p key="email"><strong>Email:</strong> {order.user_email || "No Email"}</p>);
    details.push(<p key="contact"><strong>Contact:</strong> {order.user_contact || "No Contact"}</p>);
    details.push(<p key="address"><strong>Address:</strong> {order.user_address || "No Address"}</p>);

    if (order.typeoforder === "party_order" && order.details) {
      details.push(<p key="event"><strong>Event Date:</strong> {order.details.event_date || "Not Set"}</p>);
      details.push(<p key="guests"><strong>Guests:</strong> {order.details.guest_count || 0}</p>);
      details.push(<p key="dishes"><strong>Dish Selections:</strong> {order.details.dish_selections || "None"}</p>);
      details.push(<p key="delivery"><strong>Delivery Method:</strong> {order.details.delivery_method || "Not Specified"}</p>);
      details.push(<p key="requests"><strong>Special Requests:</strong> {order.details.special_requests || "None"}</p>);
      details.push(<p key="total"><strong>Total Amount:</strong> ${order.details.total_amount?.toFixed(2) || "N/A"}</p>);
    } else if (order.typeoforder === "takeaway_order" && order.details) {
      details.push(<p key="pickup"><strong>Pickup Time:</strong> {order.details.pickup_time || "Not Set"}</p>);
      details.push(<p key="instructions"><strong>Instructions:</strong> {order.details.instructions || "None"}</p>);
      details.push(<p key="menu"><strong>Menu Selections:</strong> {order.details.menu_selections?.map((item: MenuItem) => `${item.name} (x${item.quantity})`).join(", ") || "None"}</p>);
      details.push(<p key="total"><strong>Total Amount:</strong> ${order.details.total_amount?.toFixed(2) || "N/A"}</p>);
    } else if (order.typeoforder === "reservation" && order.details) {
      details.push(<p key="date"><strong>Date:</strong> {order.details.date || "Not Set"}</p>);
      details.push(<p key="time"><strong>Time:</strong> {order.details.time || "Not Set"}</p>);
      details.push(<p key="guests"><strong>Guests:</strong> {order.details.guests || 0}</p>);
      details.push(<p key="requests"><strong>Special Requests:</strong> {order.details.special_requests || "None"}</p>);
    } else if (order.typeoforder === "menuorder" && order.menuDetails) {
      details.push(
        <p key="items">
          <strong>Items:</strong>{" "}
          {order.menuDetails.items.map((item) => `${item.name} (x${item.quantity}, $${item.price.toFixed(2)})`).join(", ") || "No Items"}
        </p>
      );
      details.push(<p key="total"><strong>Total Amount:</strong> ${order.menuDetails.total_amount.toFixed(2)}</p>);
      details.push(<p key="shipping"><strong>Shipping Address:</strong> {order.menuDetails.shipping_info?.address || order.user_address || "Not Provided"}</p>);
      details.push(<p key="payment"><strong>Payment Method:</strong> {order.menuDetails.payment_method || "Not Specified"}</p>);
    }
    return <div className="space-y-1 text-xs sm:text-sm text-gray-300">{details}</div>;
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-md p-3 sm:p-4 border border-gray-700 hover:shadow-lg transition-all w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div className="mb-2 sm:mb-0">
          <h3 className="text-base sm:text-lg font-semibold text-white">Order #{order.sequentialId}</h3>
          <p className="text-xs sm:text-sm text-gray-400">Type: {order.typeoforder || "Unknown"}</p>
          <p className="text-xs sm:text-sm text-gray-400">Status: <span className="capitalize">{status}</span></p>
          <p className="text-xs sm:text-sm text-gray-400">Created: {order.created_at || "Not Set"}</p>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="py-1 px-2 sm:px-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-all text-xs sm:text-sm w-full sm:w-auto"
        >
          {isExpanded ? "Hide Details" : "View Details"}
        </button>
      </div>
      {isExpanded && (
        <div className="mt-3 sm:mt-4">
          {getOrderDetails()}
          {isAdmin && (
            <div className="mt-3 sm:mt-4">
              {isEditing ? (
                <div className="space-y-2">
                  <select
                    value={status}
                    onChange={handleStatusChange}
                    className="w-full p-1 sm:p-2 rounded-lg bg-gray-700 text-white border border-gray-600 text-xs sm:text-sm"
                  >
                    {["pending W", "confirmed", "completed", "cancelled"].map((s) => (
                      <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                    ))}
                  </select>
                  <div className="flex space-x-2">
                    <button
                      onClick={handleSaveStatus}
                      className="flex-1 py-1 sm:py-2 px-2 sm:px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all text-xs sm:text-sm"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="flex-1 py-1 sm:py-2 px-2 sm:px-4 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all text-xs sm:text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex-1 py-1 sm:py-2 px-2 sm:px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all text-xs sm:text-sm"
                  >
                    Edit Status
                  </button>
                  <button
                    onClick={() => onCancel(order.id)}
                    className="flex-1 py-1 sm:py-2 px-2 sm:px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all text-xs sm:text-sm"
                  >
                    Cancel Order
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// CustomersTable Component (unchanged)
const CustomersTable = ({ customers }: { customers: Customer[] }) => {
  if (customers.length === 0) return <div className="text-center p-4 text-gray-400 text-sm">No customers found.</div>;

  return (
    <div className="overflow-x-auto rounded-lg shadow-lg border border-gray-700">
      <table className="min-w-full bg-gray-800 text-white text-xs sm:text-sm">
        <thead className="bg-gray-700">
          <tr>
            {["S.No", "Name", "Phone", "Email", "Address", "Total Orders"].map((header) => (
              <th key={header} className="px-2 py-2 sm:px-4 sm:py-3 text-left text-xs sm:text-sm font-semibold">{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {customers.map((customer, index) => (
            <tr key={customer.id} className="border-t border-gray-700 hover:bg-gray-750 transition-all">
              <td className="px-2 py-2 sm:px-4 sm:py-3">{index + 1}</td>
              <td className="px-2 py-2 sm:px-4 sm:py-3 truncate max-w-[100px] sm:max-w-[150px]">{customer.full_name || "Unknown"}</td>
              <td className="px-2 py-2 sm:px-4 sm:py-3 truncate max-w-[80px] sm:max-w-[120px]">{customer.phone || "No Phone"}</td>
              <td className="px-2 py-2 sm:px-4 sm:py-3 truncate max-w-[100px] sm:max-w-[150px]">{customer.email || "No Email"}</td>
              <td className="px-2 py-2 sm:px-4 sm:py-3 truncate max-w-[100px] sm:max-w-[150px]">{customer.address || "No Address"}</td>
              <td className="px-2 py-2 sm:px-4 sm:py-3">{customer.total_orders}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// AdminDashboard Component (Updated fetch logic for takeaway)
const AdminDashboard = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [stats, setStats] = useState<DashboardStats>({
    totalReservations: 0,
    totalPartyOrders: 0,
    totalTakeawayOrders: 0,
    totalMenuOrders: 0,
    totalCustomers: 0,
    averagePartyGuests: 0,
    pendingOrders: 0,
    completedOrders: 0,
  });
  const [activeTab, setActiveTab] = useState<"dashboard" | "menu" | "orders" | "customers" | "settings">("dashboard");
  const [activeOrderTab, setActiveOrderTab] = useState<"all" | "party" | "takeaway" | "menu" | "dinein">("all");
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [revenueData, setRevenueData] = useState<Record<string, RevenueData>>({
    daily: { labels: [], data: [] },
    weekly: { labels: [], data: [] },
    monthly: { labels: [], data: [] },
    yearly: { labels: [], data: [] },
    alltime: { labels: ["All Time"], data: [0] },
  });
  const [salesData, setSalesData] = useState<Record<string, SalesData>>({
    daily: { dineIn: { orders: 0 }, takeaway: { orders: 0 }, partyOrders: { orders: 0 }, menuOrders: { orders: 0 } },
    weekly: { dineIn: { orders: 0 }, takeaway: { orders: 0 }, partyOrders: { orders: 0 }, menuOrders: { orders: 0 } },
    monthly: { dineIn: { orders: 0 }, takeaway: { orders: 0 }, partyOrders: { orders: 0 }, menuOrders: { orders: 0 } },
    yearly: { dineIn: { orders: 0 }, takeaway: { orders: 0 }, partyOrders: { orders: 0 }, menuOrders: { orders: 0 } },
    alltime: { dineIn: { orders: 0 }, takeaway: { orders: 0 }, partyOrders: { orders: 0 }, menuOrders: { orders: 0 } },
  });
  const isDarkMode = true;

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setLoading(true);

        if (!user || !user.id) throw new Error("User not authenticated");

        const { data: adminProfile, error: adminProfileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();
        if (adminProfileError) throw adminProfileError;
        const userRole = adminProfile?.role || "user";
        setIsAdmin(userRole === "admin");
        if (userRole !== "admin") {
          setFetchError("You do not have permission to access the admin dashboard.");
          setLoading(false);
          return;
        }

        const { data: ordersData, error: ordersError } = await supabase
          .from("orders")
          .select(`
            id,
            user_id,
            typeoforder,
            created_at,
            reservation_id,
            party_order_id,
            takeaway_order_id,
            menuorder_id,
            profiles!left (
              id,
              full_name,
              email,
              phone,
              address
            )
          `);
        if (ordersError) throw ordersError;

        const detailedOrders: Order[] = await Promise.all(
          (ordersData || []).map(async (order: any, index: number) => {
            const profile = order.profiles || {};
            const customerName = profile.full_name || order.details?.name || "Guest";
            const customerEmail = profile.email || order.details?.email || "No Email";
            const customerContact = profile.phone || order.details?.contact || "No Contact";
            const customerAddress = profile.address || order.details?.address || "No Address";

            let details: any = {};
            let menuDetails: MenuDetails | undefined;

            if (order.typeoforder === "party_order" && order.party_order_id) {
              const { data, error } = await supabase
                .from("party_orders")
                .select("*")
                .eq("id", order.party_order_id)
                .single();
              if (!error && data) {
                details = {
                  name: data.name || customerName,
                  contact: data.contact || customerContact,
                  email: data.email || customerEmail,
                  address: data.address || customerAddress,
                  guest_count: data.guest_count || 0,
                  event_date: data.event_date || "Not Set",
                  dish_selections: data.dish_selections || "None",
                  delivery_method: data.delivery_method || "Not Specified",
                  special_requests: data.special_requests || "None",
                  status: data.status || "pending",
                  total_amount: data.total_amount || 0,
                };
              }
            } else if (order.typeoforder === "takeaway_order" && order.takeaway_order_id) {
              const { data, error } = await supabase
                .from("takeaway_orders")
                .select("name, contact, address, pickup_time, instructions, menu_selections, order_status, total_amount, created_at")
                .eq("id", order.takeaway_order_id)
                .single();
              if (!error && data) {
                details = {
                  name: data.name || customerName,
                  contact: data.contact || customerContact,
                  address: data.address || customerAddress,
                  pickup_time: data.pickup_time || "Not Set",
                  instructions: data.instructions || "None",
                  menu_selections: data.menu_selections || [], // Expecting array of items
                  order_status: data.order_status || "pending",
                  total_amount: data.total_amount || data.menu_selections?.reduce((sum: number, item: MenuItem) => sum + item.price * item.quantity, 0) || 0,
                  created_at: data.created_at || order.created_at || "Not Set",
                };
              }
            } else if (order.typeoforder === "reservation" && order.reservation_id) {
              const { data, error } = await supabase
                .from("reservations")
                .select("*")
                .eq("id", order.reservation_id)
                .single();
              if (!error && data) {
                details = {
                  name: data.name || customerName,
                  contact: data.contact || customerContact,
                  email: data.email || customerEmail,
                  date: data.date || "Not Set",
                  time: data.time || "Not Set",
                  guests: data.guests || 0,
                  special_requests: data.special_requests || "None",
                  status: data.status || "pending",
                  total_amount: 0,
                };
              }
            } else if (order.typeoforder === "menuorder" && order.menuorder_id) {
              const { data, error } = await supabase
                .from("menuorder")
                .select("items, total_amount, shipping_info, payment_method, status, created_at")
                .eq("id", order.menuorder_id)
                .single();
              if (!error && data) {
                menuDetails = {
                  items: data.items || [],
                  total_amount: data.total_amount || 0,
                  shipping_info: { address: data.shipping_info?.address || customerAddress },
                  payment_method: data.payment_method || "Not Specified",
                  status: data.status || "pending",
                  created_at: data.created_at || order.created_at || "Not Set",
                };
              }
            }

            return {
              sequentialId: index + 1,
              id: order.id,
              user_id: order.user_id || "unknown",
              user_name: customerName,
              user_email: customerEmail,
              user_contact: customerContact,
              user_address: customerAddress,
              typeoforder: order.typeoforder || "unknown",
              created_at: order.created_at || "Not Set",
              party_order_id: order.party_order_id,
              takeaway_order_id: order.takeaway_order_id,
              reservation_id: order.reservation_id,
              menuorder_id: order.menuorder_id,
              order_status: details.order_status || menuDetails?.status || "pending",
              details,
              menuDetails,
            };
          })
        );

        const { data: profilesData, error: profilesError } = await supabase
          .from("profiles")
          .select("id, full_name, email, phone, address");
        if (profilesError) throw profilesError;

        const customersData: Customer[] = await Promise.all(
          (profilesData || []).map(async (profile: any) => {
            const { count, error: orderCountError } = await supabase
              .from("orders")
              .select("id", { count: "exact" })
              .eq("user_id", profile.id);
            if (orderCountError) throw orderCountError;

            return {
              id: profile.id,
              full_name: profile.full_name,
              phone: profile.phone,
              email: profile.email,
              address: profile.address,
              total_orders: count || 0,
            };
          })
        );

        const revenueByTime: Record<string, RevenueData> = {
          daily: { labels: [], data: [] },
          weekly: { labels: [], data: [] },
          monthly: { labels: [], data: [] },
          yearly: { labels: [], data: [] },
          alltime: { labels: ["All Time"], data: [0] },
        };

        const now = new Date();
        const dailyRevenue: Record<string, number> = {};
        const weeklyRevenue: Record<string, number> = {};
        const monthlyRevenue: Record<string, number> = {};
        const yearlyRevenue: Record<string, number> = {};

        detailedOrders
          .filter((order) => order.created_at && order.created_at !== "Not Set")
          .forEach((order) => {
            const date = new Date(order.created_at!);
            const day = date.toLocaleDateString("en-US", { weekday: "short" });
            const week = `Week ${Math.ceil(date.getDate() / 7)}`;
            const month = date.toLocaleDateString("en-US", { month: "short" });
            const year = date.getFullYear().toString();

            let amount = 0;
            if (order.typeoforder === "menuorder" && order.menuDetails) {
              amount = order.menuDetails.total_amount || 0;
            } else if (order.typeoforder === "party_order" && order.details) {
              amount = order.details.total_amount || 0;
            } else if (order.typeoforder === "takeaway_order" && order.details) {
              amount = order.details.total_amount || 0;
            } else if (order.typeoforder === "reservation" && order.details) {
              amount = order.details.total_amount || 0;
            }

            dailyRevenue[day] = (dailyRevenue[day] || 0) + amount;
            weeklyRevenue[week] = (weeklyRevenue[week] || 0) + amount;
            monthlyRevenue[month] = (monthlyRevenue[month] || 0) + amount;
            yearlyRevenue[year] = (yearlyRevenue[year] || 0) + amount;
            revenueByTime.alltime.data[0] += amount;
          });

        revenueByTime.daily.labels = Object.keys(dailyRevenue);
        revenueByTime.daily.data = Object.values(dailyRevenue);
        revenueByTime.weekly.labels = Object.keys(weeklyRevenue);
        revenueByTime.weekly.data = Object.values(weeklyRevenue);
        revenueByTime.monthly.labels = Object.keys(monthlyRevenue);
        revenueByTime.monthly.data = Object.values(monthlyRevenue);
        revenueByTime.yearly.labels = Object.keys(yearlyRevenue);
        revenueByTime.yearly.data = Object.values(yearlyRevenue);

        setRevenueData(revenueByTime);

        const salesByTime: Record<string, SalesData> = {
          daily: { dineIn: { orders: 0 }, takeaway: { orders: 0 }, partyOrders: { orders: 0 }, menuOrders: { orders: 0 } },
          weekly: { dineIn: { orders: 0 }, takeaway: { orders: 0 }, partyOrders: { orders: 0 }, menuOrders: { orders: 0 } },
          monthly: { dineIn: { orders: 0 }, takeaway: { orders: 0 }, partyOrders: { orders: 0 }, menuOrders: { orders: 0 } },
          yearly: { dineIn: { orders: 0 }, takeaway: { orders: 0 }, partyOrders: { orders: 0 }, menuOrders: { orders: 0 } },
          alltime: { dineIn: { orders: 0 }, takeaway: { orders: 0 }, partyOrders: { orders: 0 }, menuOrders: { orders: 0 } },
        };

        detailedOrders
          .filter((order) => order.created_at && order.created_at !== "Not Set")
          .forEach((order) => {
            const date = new Date(order.created_at!);
            const dayDiff = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
            const weekDiff = Math.floor(dayDiff / 7);
            const monthDiff = Math.floor(dayDiff / 30);
            const yearDiff = now.getFullYear() - date.getFullYear();

            if (order.typeoforder === "reservation") {
              if (dayDiff <= 7) salesByTime.daily.dineIn.orders++;
              if (weekDiff <= 4) salesByTime.weekly.dineIn.orders++;
              if (monthDiff <= 12) salesByTime.monthly.dineIn.orders++;
              if (yearDiff <= 5) salesByTime.yearly.dineIn.orders++;
              salesByTime.alltime.dineIn.orders++;
            } else if (order.typeoforder === "takeaway_order") {
              if (dayDiff <= 7) salesByTime.daily.takeaway.orders++;
              if (weekDiff <= 4) salesByTime.weekly.takeaway.orders++;
              if (monthDiff <= 12) salesByTime.monthly.takeaway.orders++;
              if (yearDiff <= 5) salesByTime.yearly.takeaway.orders++;
              salesByTime.alltime.takeaway.orders++;
            } else if (order.typeoforder === "party_order") {
              if (dayDiff <= 7) salesByTime.daily.partyOrders.orders++;
              if (weekDiff <= 4) salesByTime.weekly.partyOrders.orders++;
              if (monthDiff <= 12) salesByTime.monthly.partyOrders.orders++;
              if (yearDiff <= 5) salesByTime.yearly.partyOrders.orders++;
              salesByTime.alltime.partyOrders.orders++;
            } else if (order.typeoforder === "menuorder") {
              if (dayDiff <= 7) salesByTime.daily.menuOrders.orders++;
              if (weekDiff <= 4) salesByTime.weekly.menuOrders.orders++;
              if (monthDiff <= 12) salesByTime.monthly.menuOrders.orders++;
              if (yearDiff <= 5) salesByTime.yearly.menuOrders.orders++;
              salesByTime.alltime.menuOrders.orders++;
            }
          });

        setSalesData(salesByTime);

        const totalReservations = detailedOrders.filter((o) => o.typeoforder === "reservation").length;
        const totalPartyOrders = detailedOrders.filter((o) => o.typeoforder === "party_order").length;
        const totalTakeawayOrders = detailedOrders.filter((o) => o.typeoforder === "takeaway_order").length;
        const totalMenuOrders = detailedOrders.filter((o) => o.typeoforder === "menuorder").length;
        const totalCustomers = customersData.length;
        const totalGuests = detailedOrders
          .filter((o) => o.typeoforder === "party_order")
          .reduce((sum, o) => sum + (Number(o.details?.guest_count) || 0), 0);
        const averagePartyGuests = totalPartyOrders > 0 ? totalGuests / totalPartyOrders : 0;
        const pendingOrders = detailedOrders.filter((o) => o.order_status === "pending").length;
        const completedOrders = detailedOrders.filter((o) => o.order_status === "completed").length;

        setStats({
          totalReservations,
          totalPartyOrders,
          totalTakeawayOrders,
          totalMenuOrders,
          totalCustomers,
          averagePartyGuests,
          pendingOrders,
          completedOrders,
        });
        setOrders(detailedOrders);
        setCustomers(customersData);
      } catch (error: any) {
        console.error("Fetch error:", error);
        setFetchError("Error fetching admin data: " + error.message);
        toast.error("Failed to load admin dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [user]);

  const handleCancelOrder = async (orderId: string) => {
    try {
      const order = orders.find((o) => o.id === orderId);
      if (!order) throw new Error("Order not found");

      if (order.typeoforder === "party_order" && order.party_order_id) {
        const { error } = await supabase.from("party_orders").update({ status: "cancelled" }).eq("id", order.party_order_id);
        if (error) throw error;
      } else if (order.typeoforder === "takeaway_order" && order.takeaway_order_id) {
        const { error } = await supabase.from("takeaway_orders").update({ order_status: "cancelled" }).eq("id", order.takeaway_order_id);
        if (error) throw error;
      } else if (order.typeoforder === "reservation" && order.reservation_id) {
        const { error } = await supabase.from("reservations").update({ status: "cancelled" }).eq("id", order.reservation_id);
        if (error) throw error;
      } else if (order.typeoforder === "menuorder" && order.menuorder_id) {
        const { error } = await supabase.from("menuorder").update({ status: "cancelled" }).eq("id", order.menuorder_id);
        if (error) throw error;
      }

      setOrders((prevOrders) => prevOrders.map((o) => (o.id === orderId ? { ...o, order_status: "cancelled" } : o)));
      toast.success("Order cancelled successfully.");
    } catch (error: any) {
      toast.error("Failed to cancel order: " + error.message);
    }
  };

  useEffect(() => {
    if (location.pathname === "/admin") setActiveTab("dashboard");
    else if (location.pathname.startsWith("/admin/orders")) {
      setActiveTab("orders");
      if (location.pathname.includes("party")) setActiveOrderTab("party");
      else if (location.pathname.includes("takeaway")) setActiveOrderTab("takeaway");
      else if (location.pathname.includes("menu")) setActiveOrderTab("menu");
      else if (location.pathname.includes("dinein")) setActiveOrderTab("dinein");
      else setActiveOrderTab("all");
    } else if (location.pathname === "/admin/customers") setActiveTab("customers");
    else if (location.pathname === "/admin/menu") setActiveTab("menu");
    else if (location.pathname === "/admin/settings") setActiveTab("settings");
  }, [location.pathname]);

  const filteredOrders = orders.filter((order) => {
    const statusMatch = activeFilter === "all" || order.order_status?.toLowerCase() === activeFilter;
    const typeMatch =
      activeOrderTab === "all" ||
      (activeOrderTab === "party" && order.typeoforder === "party_order") ||
      (activeOrderTab === "takeaway" && order.typeoforder === "takeaway_order") ||
      (activeOrderTab === "menu" && order.typeoforder === "menuorder") ||
      (activeOrderTab === "dinein" && order.typeoforder === "reservation");
    return statusMatch && typeMatch;
  });

  const FilterBar = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="bg-orange-50 dark:bg-gray-800 p-3 sm:p-4 rounded-lg shadow-md mb-4 sm:mb-6 flex flex-wrap justify-center gap-2"
    >
      {["all", "pending", "confirmed", "completed", "cancelled"].map((filter) => (
        <button
          key={filter}
          onClick={() => setActiveFilter(filter)}
          className={`px-2 py-1 sm:px-4 sm:py-2 rounded-full text-[10px] sm:text-sm font-medium transition-all ${
            activeFilter === filter
              ? "bg-orange-600 text-white shadow-md"
              : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
          }`}
        >
          {filter.charAt(0).toUpperCase() + filter.slice(1)}
        </button>
      ))}
    </motion.div>
  );

  const OrderTabs = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="flex flex-wrap gap-2 mb-4 sm:mb-6 justify-center"
    >
      {["all", "party", "takeaway", "menu", "dinein"].map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveOrderTab(tab as "all" | "party" | "takeaway" | "menu" | "dinein")}
          className={`px-2 py-1 sm:px-4 sm:py-2 rounded-lg text-[10px] sm:text-sm font-medium transition-all ${
            activeOrderTab === tab
              ? "bg-orange-600 text-white"
              : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
          }`}
        >
          {tab === "all" ? "All Orders" : tab === "dinein" ? "Dine-in Orders" : `${tab.charAt(0).toUpperCase() + tab.slice(1)} Orders`}
        </button>
      ))}
    </motion.div>
  );

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? "dark bg-gray-900" : "light bg-gray-50"}`}>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="loadership_YLVJQ"
        >
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </motion.div>
        <style>{`
          .loadership_YLVJQ {
            display: flex;
            position: relative;
            width: 150px;
            height: 80px;
          }
          .loadership_YLVJQ div {
            position: absolute;
            width: 10px;
            height: 10px;
            border-radius: 50%;
            top: 35px;
            background: #ea580c;
            animation-timing-function: cubic-bezier(0, 1, 1, 0);
          }
          .loadership_YLVJQ div:nth-child(1) {
            left: 30px;
            animation: loadership_YLVJQ_scale_up 0.59s infinite;
          }
          .loadership_YLVJQ div:nth-child(2) {
            left: 30px;
            animation: loadership_YLVJQ_translate 0.59s infinite;
          }
          .loadership_YLVJQ div:nth-child(3) {
            left: 60px;
            animation: loadership_YLVJQ_translate 0.59s infinite;
          }
          .loadership_YLVJQ div:nth-child(4) {
            left: 90px;
            animation: loadership_YLVJQ_translate 0.59s infinite;
          }
          .loadership_YLVJQ div:nth-child(5) {
            left: 120px;
            animation: loadership_YLVJQ_scale_down 0.59s infinite;
          }
          @keyframes loadership_YLVJQ_scale_up {
            0% { transform: scale(0); }
            100% { transform: scale(1); }
          }
          @keyframes loadership_YLVJQ_scale_down {
            0% { transform: scale(1); }
            100% { transform: scale(0); }
          }
          @keyframes loadership_YLVJQ_translate {
            0% { transform: translate(0, 0); }
            100% { transform: translate(30px, 0); }
          }
        `}</style>
      </div>
    );
  }

  if (!user) return <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center"><span className="text-gray-900 dark:text-white text-sm">Please log in.</span></div>;
  if (isAdmin === null) return <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center"><span className="text-gray-900 dark:text-white text-sm">Checking permissions...</span></div>;
  if (!isAdmin) return <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center"><span className="text-red-600 dark:text-red-400 text-sm">Access denied.</span></div>;
  if (fetchError) return <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center"><span className="text-red-600 dark:text-red-400 text-sm">{fetchError}</span></div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col lg:flex-row text-gray-900 dark:text-white">
      <AdminSidebar />
      <main className="flex-1 px-2 sm:px-6 lg:px-8 py-4 sm:py-6 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <motion.nav
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-wrap space-x-2 mb-4 sm:mb-6 bg-orange-50 dark:bg-gray-800 p-2 sm:p-2 rounded-lg shadow-lg justify-center lg:justify-start"
          >
            {[
              { label: "Dashboard", value: "dashboard", path: "/admin" },
              { label: "Orders", value: "orders", path: "/admin/orders/all" },
              { label: "Customers", value: "customers", path: "/admin/customers" },
              { label: "Menu", value: "menu", path: "/admin/menu" },
              { label: "Settings", value: "settings", path: "/admin/settings" },
            ].map((tab) => (
              <Link
                key={tab.value}
                to={tab.path}
                onClick={() => setActiveTab(tab.value as "dashboard" | "menu" | "orders" | "customers" | "settings")}
                className={`px-2 py-1 sm:px-4 sm:py-2 rounded-md text-[10px] sm:text-sm font-medium transition-all ${
                  activeTab === tab.value
                    ? "bg-orange-600 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
                }`}
              >
                {tab.label}
              </Link>
            ))}
          </motion.nav>

          {activeTab === "dashboard" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <h1 className="font-display text-2xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 text-center lg:text-left">
                Admin Dashboard
              </h1>
              <p className="text-sm sm:text-lg text-gray-600 dark:text-gray-400 mb-4 sm:mb-6 text-center lg:text-left">
                Overview of all activities
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-4 sm:mb-6">
                <StatCard icon={Users} title="Reservations" value={stats.totalReservations.toString()} trend="+2%" />
                <StatCard icon={ShoppingBag} title="Party Orders" value={stats.totalPartyOrders.toString()} trend="+12%" />
                <StatCard icon={BarChart3} title="Takeaway Orders" value={stats.totalTakeawayOrders.toString()} trend="+5%" />
                <StatCard icon={DollarSign} title="Menu Orders" value={stats.totalMenuOrders.toString()} trend="+18%" />
                <StatCard icon={Users} title="Pending Orders" value={stats.pendingOrders.toString()} trend="+5%" />
                <StatCard icon={BarChart3} title="Completed Orders" value={stats.completedOrders.toString()} trend="+10%" />
                <StatCard icon={Users} title="Total Customers" value={stats.totalCustomers.toString()} trend="+8%" />
                <StatCard icon={Users} title="Avg. Party Guests" value={stats.averagePartyGuests.toFixed(1)} trend="+3%" />
              </div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="bg-orange-50 dark:bg-gray-800 p-4 sm:p-8 rounded-lg shadow-lg mb-4 sm:mb-6"
              >
                <h2 className="font-display text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 text-center lg:text-left">
                  Sales Overview
                </h2>
                <SalesChart salesData={salesData} isDarkMode={isDarkMode} />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="bg-orange-50 dark:bg-gray-800 p-4 sm:p-8 rounded-lg shadow-lg mb-4 sm:mb-6"
              >
                <h2 className="font-display text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 text-center lg:text-left">
                  Revenue Overview
                </h2>
                <RevenueChart revenueData={revenueData} isDarkMode={isDarkMode} />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="bg-orange-50 dark:bg-gray-800 p-4 sm:p-8 rounded-lg shadow-lg mb-4 sm:mb-6"
              >
                <h2 className="font-display text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 text-center lg:text-left">
                  Recent Orders
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
                  {orders.slice(0, 3).map((order, index) => (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: index * 0.2 }}
                    >
                      <OrderCard
                        order={order}
                        onCancel={handleCancelOrder}
                        onUpdateStatus={(orderId, newStatus) => {
                          setOrders(orders.map((o) => (o.id === orderId ? { ...o, order_status: newStatus } : o)));
                        }}
                        isAdmin={true}
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}

          {activeTab === "orders" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <h1 className="font-display text-2xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 text-center lg:text-left">
                Orders Management
              </h1>
              <p className="text-sm sm:text-lg text-gray-600 dark:text-gray-400 mb-4 sm:mb-6 text-center lg:text-left">
                View and manage all orders
              </p>
              <OrderTabs />
              <FilterBar />
              <OrdersTable
                orders={filteredOrders}
                onOrderUpdate={(updatedOrder) =>
                  setOrders(orders.map((o) => (o.id === updatedOrder.id ? updatedOrder : o)))
                }
              />
            </motion.div>
          )}

          {activeTab === "customers" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <h1 className="font-display text-2xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 text-center lg:text-left">
                Customers Management
              </h1>
              <p className="text-sm sm:text-lg text-gray-600 dark:text-gray-400 mb-4 sm:mb-6 text-center lg:text-left">
                View all customer details
              </p>
              <CustomersTable customers={customers} />
            </motion.div>
          )}

          {activeTab === "menu" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <MenuManagement />
            </motion.div>
          )}

          {activeTab === "settings" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <RolesAndPermissions />
            </motion.div>
          )}
        </div>
      </main>
      <style>{`
        html {
          scroll-behavior: smooth;
        }
        main {
          -webkit-overflow-scrolling: touch;
        }
        @media (max-width: 640px) {
          .max-w-7xl {
            padding-left: 0.5rem;
            padding-right: 0.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;