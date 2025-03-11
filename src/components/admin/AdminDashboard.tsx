import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import { useAuth } from "../../context/AuthContext";
import { BarChart3, Users, ShoppingBag, DollarSign, LayoutDashboard, Settings, LogOut, Menu as MenuIcon, X } from "lucide-react";
import toast from "react-hot-toast";
import { RevenueChart } from "./Chart/RevenueChart";
import { SalesChart } from "./Chart/SalesChart";

// Define Profile interface based on your table schema
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

export interface MenuItem {
  name: string;
  price: number;
  quantity: number;
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

interface RevenueData {
  labels: string[];
  data: number[];
}

interface SalesData {
  dineIn: { orders: number };
  takeaway: { orders: number };
  partyOrders: { orders: number };
}

// StatCard Component (unchanged)
function StatCard({ icon: Icon, title, value, trend }: { icon: React.ElementType; title: string; value: string; trend: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="bg-orange-50 dark:bg-gray-800 rounded-lg p-4 sm:p-5 shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm mb-1">{title}</p>
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{value}</h3>
          <p className={`text-xs mt-1 ${trend.includes('+') ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
            {trend}
          </p>
        </div>
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-orange-600 flex items-center justify-center">
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
    { icon: ShoppingBag, label: "Orders", path: "/admin/orders" },
    { icon: Users, label: "Customers", path: "/admin/customers" },
    { icon: Settings, label: "Settings", path: "/admin/settings" },
  ];

  const isActive = (path: string) => location.pathname === path || (path === "/admin/orders" && location.pathname.startsWith("/admin/orders"));

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
    } else if (order.typeoforder === "takeaway_order" && order.details) {
      details.push(<p key="pickup"><strong>Pickup Time:</strong> {order.details.pickup_time || "Not Set"}</p>);
      details.push(<p key="instructions"><strong>Instructions:</strong> {order.details.instructions || "None"}</p>);
      details.push(<p key="menu"><strong>Menu Selections:</strong> {order.details.menu_selections || "None"}</p>);
    } else if (order.typeoforder === "reservation" && order.details) {
      details.push(<p key="date"><strong>Date:</strong> {order.details.date || "Not Set"}</p>);
      details.push(<p key="time"><strong>Time:</strong> {order.details.time || "Not Set"}</p>);
      details.push(<p key="guests"><strong>Guests:</strong> {order.details.guests || 0}</p>);
      details.push(<p key="requests"><strong>Special Requests:</strong> {order.details.special_requests || "None"}</p>);
    } else if (order.typeoforder === "menu_order" && order.menuDetails) {
      details.push(
        <p key="items"><strong>Items:</strong> {order.menuDetails.items.map((item) => `${item.name} (x${item.quantity})`).join(", ")}</p>
      );
      details.push(<p key="total"><strong>Total Amount:</strong> ${order.menuDetails.total_amount.toFixed(2)}</p>);
      details.push(<p key="shipping"><strong>Shipping Address:</strong> {order.menuDetails.shipping_info?.address || "Not Set"}</p>);
      details.push(<p key="payment"><strong>Payment Method:</strong> {order.menuDetails.payment_method || "Not Specified"}</p>);
    }
    return <div className="space-y-1 text-sm text-gray-300">{details}</div>;
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-md p-4 border border-gray-700 hover:shadow-lg transition-all">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-white">Order #{order.sequentialId}</h3>
          <p className="text-sm text-gray-400">Type: {order.typeoforder || "Unknown"}</p>
          <p className="text-sm text-gray-400">Status: <span className="capitalize">{status}</span></p>
          <p className="text-sm text-gray-400">Created: {order.created_at || "Not Set"}</p>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="py-1 px-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-all text-sm"
        >
          {isExpanded ? "Hide Details" : "View Details"}
        </button>
      </div>
      {isExpanded && (
        <div className="mt-4">
          {getOrderDetails()}
          {isAdmin && (
            <div className="mt-4">
              {isEditing ? (
                <div className="space-y-2">
                  <select
                    value={status}
                    onChange={handleStatusChange}
                    className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600"
                  >
                    {["pending", "confirmed", "completed", "cancelled"].map((s) => (
                      <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                    ))}
                  </select>
                  <div className="flex space-x-2">
                    <button
                      onClick={handleSaveStatus}
                      className="flex-1 py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="flex-1 py-2 px-4 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
                  >
                    Edit Status
                  </button>
                  <button
                    onClick={() => onCancel(order.id)}
                    className="flex-1 py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
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

// Updated OrdersTable Component with Modal Popup
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
      if (order.party_order_id) {
        updateResult = await supabase.from("party_orders").update({ status: newStatus }).eq("id", order.party_order_id);
      } else if (order.takeaway_order_id) {
        updateResult = await supabase.from("takeaway_orders").update({ order_status: newStatus }).eq("id", order.takeaway_order_id);
      } else if (order.reservation_id) {
        updateResult = await supabase.from("reservations").update({ status: newStatus }).eq("id", order.reservation_id);
      } else if (order.menuorder_id) {
        updateResult = await supabase.from("menuorder").update({ status: newStatus }).eq("id", order.menuorder_id);
      }
      if (updateResult?.error) throw updateResult.error;

      if (onOrderUpdate) onOrderUpdate({ ...order, order_status: newStatus });
      setSelectedOrder((prev) => (prev && prev.id === order.id ? { ...prev, order_status: newStatus } : prev));
      toast.success("Order status updated!");
    } catch (error: any) {
      toast.error("Failed to update status: " + error.message);
    }
  };

  const getOrderDetails = (order: Order) => {
    const customerDetails = [
      { label: "Name", value: order.user_name || "Unknown" },
      { label: "Email", value: order.user_email || "No Email" },
      { label: "Contact", value: order.user_contact || "No Contact" },
      { label: "Address", value: order.user_address || "No Address" },
    ];

    let orderDetails: { label: string; value: string | number }[] = [];
    if (order.typeoforder === "party_order" && order.details) {
      orderDetails = [
        { label: "Event Date", value: order.details.event_date || "Not Set" },
        { label: "Guests", value: order.details.guest_count || 0 },
        { label: "Dish Selections", value: order.details.dish_selections || "None" },
        { label: "Delivery Method", value: order.details.delivery_method || "Not Specified" },
        { label: "Special Requests", value: order.details.special_requests || "None" },
      ];
    } else if (order.typeoforder === "takeaway_order" && order.details) {
      orderDetails = [
        { label: "Pickup Time", value: order.details.pickup_time || "Not Set" },
        { label: "Instructions", value: order.details.instructions || "None" },
        { label: "Menu Selections", value: order.details.menu_selections || "None" },
      ];
    } else if (order.typeoforder === "reservation" && order.details) {
      orderDetails = [
        { label: "Date", value: order.details.date || "Not Set" },
        { label: "Time", value: order.details.time || "Not Set" },
        { label: "Guests", value: order.details.guests || 0 },
        { label: "Special Requests", value: order.details.special_requests || "None" },
      ];
    } else if (order.typeoforder === "menu_order" && order.menuDetails) {
      orderDetails = [
        { label: "Items", value: order.menuDetails.items.map((item) => `${item.name} (x${item.quantity})`).join(", ") },
        { label: "Total Amount", value: `$${order.menuDetails.total_amount.toFixed(2)}` },
        { label: "Shipping Address", value: order.menuDetails.shipping_info?.address || "Not Set" },
        { label: "Payment Method", value: order.menuDetails.payment_method || "Not Specified" },
      ];
    }

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className="relative bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-md border border-gray-700"
      >
        <button
          onClick={() => setSelectedOrder(null)}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>
        <h3 className="text-xl font-bold text-white mb-4">Order #{order.sequentialId}</h3>
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-semibold text-orange-500 mb-2">Customer Details</h4>
            {customerDetails.map((detail) => (
              <p key={detail.label} className="text-sm text-gray-300">
                <strong>{detail.label}:</strong> {detail.value}
              </p>
            ))}
          </div>
          <div>
            <h4 className="text-sm font-semibold text-orange-500 mb-2">Order Details</h4>
            <p className="text-sm text-gray-300"><strong>Type:</strong> {order.typeoforder || "Unknown"}</p>
            <p className="text-sm text-gray-300"><strong>Created At:</strong> {order.created_at || "Not Set"}</p>
            {orderDetails.length > 0 ? (
              orderDetails.map((detail) => (
                <p key={detail.label} className="text-sm text-gray-300">
                  <strong>{detail.label}:</strong> {detail.value}
                </p>
              ))
            ) : (
              <p className="text-sm text-gray-300">No additional details available.</p>
            )}
          </div>
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
              {["Order ID", "User Name", "Phone", "Type", "Details", "Status", "Action"].map((header) => (
                <th key={header} className="px-4 py-3 text-left text-sm font-semibold">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-t border-gray-700 hover:bg-gray-750 transition-all">
                <td className="px-4 py-3 text-sm">{order.sequentialId}</td>
                <td className="px-4 py-3 text-sm">{order.user_name || "Unknown"}</td>
                <td className="px-4 py-3 text-sm">{order.user_contact || "No Contact"}</td>
                <td className="px-4 py-3 text-sm">{order.typeoforder || "Unknown"}</td>
                <td className="px-4 py-3 text-sm">
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="py-1 px-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-all"
                  >
                    View Details
                  </button>
                </td>
                <td className="px-4 py-3 text-sm capitalize">{order.order_status || "pending"}</td>
                <td className="px-4 py-3 text-sm">
                  {role === "admin" && (
                    <select
                      value={order.order_status || "pending"}
                      onChange={(e) => handleUpdateStatus(order, e.target.value)}
                      className="p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-orange-500"
                    >
                      {["pending", "confirmed", "completed", "cancelled"].map((status) => (
                        <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
                      ))}
                    </select>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedOrder && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setSelectedOrder(null)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            {getOrderDetails(selectedOrder)}
          </div>
        </div>
      )}
    </>
  );
};

const MenuManagement = () => (
  <div className="text-center p-4">Menu Management Placeholder</div>
);

// Main AdminDashboard Component (unchanged except imports)
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
  const [activeTab, setActiveTab] = useState<"dashboard" | "menu" | "orders">("dashboard");
  const [activeOrderTab, setActiveOrderTab] = useState<"all" | "party" | "takeaway" | "menu" | "dinein">("all");
  const [orders, setOrders] = useState<Order[]>([]);
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
    daily: { dineIn: { orders: 0 }, takeaway: { orders: 0 }, partyOrders: { orders: 0 } },
    weekly: { dineIn: { orders: 0 }, takeaway: { orders: 0 }, partyOrders: { orders: 0 } },
    monthly: { dineIn: { orders: 0 }, takeaway: { orders: 0 }, partyOrders: { orders: 0 } },
    yearly: { dineIn: { orders: 0 }, takeaway: { orders: 0 }, partyOrders: { orders: 0 } },
    alltime: { dineIn: { orders: 0 }, takeaway: { orders: 0 }, partyOrders: { orders: 0 } },
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
          (ordersData || []).map(async (order: any) => {
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
                };
              }
            } else if (order.typeoforder === "takeaway_order" && order.takeaway_order_id) {
              const { data, error } = await supabase
                .from("takeaway_orders")
                .select("*")
                .eq("id", order.takeaway_order_id)
                .single();
              if (!error && data) {
                details = {
                  name: data.name || customerName,
                  contact: data.contact || customerContact,
                  address: data.address || customerAddress,
                  pickup_time: data.pickup_time || "Not Set",
                  instructions: data.instructions || "None",
                  menu_selections: data.menu_selections || "None",
                  order_status: data.order_status || "pending",
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
                };
              }
            } else if (order.typeoforder === "menu_order" && order.menuorder_id) {
              const { data, error } = await supabase
                .from("menuorder")
                .select("items, total_amount, shipping_info, payment_method, status, created_at")
                .eq("id", order.menuorder_id)
                .single();
              if (!error && data) {
                menuDetails = {
                  items: data.items || [],
                  total_amount: data.total_amount || 0,
                  shipping_info: data.shipping_info || { address: customerAddress },
                  payment_method: data.payment_method || "Not Specified",
                  status: data.status || "pending",
                  created_at: data.created_at || order.created_at || "Not Set",
                };
              } else {
                console.error(`Error fetching menu order ${order.menuorder_id}:`, error);
              }
            }

            return {
              sequentialId: 0,
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
              order_status: details.status || menuDetails?.status || "pending",
              details,
              menuDetails,
            };
          })
        );

        const sortedOrders = detailedOrders
          .sort((a, b) => {
            const dateA = a.created_at && a.created_at !== "Not Set" ? new Date(a.created_at).getTime() : 0;
            const dateB = b.created_at && b.created_at !== "Not Set" ? new Date(b.created_at).getTime() : 0;
            return dateB - dateA;
          })
          .map((order, index) => ({
            ...order,
            sequentialId: index + 1,
          }));

        const { data: profilesData, error: profilesError } = await supabase
          .from("profiles")
          .select("id");
        if (profilesError) throw profilesError;

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

        const { data: menuOrders, error: menuOrdersError } = await supabase
          .from("menuorder")
          .select("created_at, total_amount");
        if (menuOrdersError) throw menuOrdersError;

        (menuOrders || [])
          .filter((order) => order.created_at)
          .forEach((order) => {
            const date = new Date(order.created_at!);
            const day = date.toLocaleDateString("en-US", { weekday: "short" });
            const week = `Week ${Math.ceil(date.getDate() / 7)}`;
            const month = date.toLocaleDateString("en-US", { month: "short" });
            const year = date.getFullYear().toString();

            dailyRevenue[day] = (dailyRevenue[day] || 0) + (order.total_amount || 0);
            weeklyRevenue[week] = (weeklyRevenue[week] || 0) + (order.total_amount || 0);
            monthlyRevenue[month] = (monthlyRevenue[month] || 0) + (order.total_amount || 0);
            yearlyRevenue[year] = (yearlyRevenue[year] || 0) + (order.total_amount || 0);
            revenueByTime.alltime.data[0] += order.total_amount || 0;
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
          daily: { dineIn: { orders: 0 }, takeaway: { orders: 0 }, partyOrders: { orders: 0 } },
          weekly: { dineIn: { orders: 0 }, takeaway: { orders: 0 }, partyOrders: { orders: 0 } },
          monthly: { dineIn: { orders: 0 }, takeaway: { orders: 0 }, partyOrders: { orders: 0 } },
          yearly: { dineIn: { orders: 0 }, takeaway: { orders: 0 }, partyOrders: { orders: 0 } },
          alltime: { dineIn: { orders: 0 }, takeaway: { orders: 0 }, partyOrders: { orders: 0 } },
        };

        sortedOrders
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
            }
          });

        setSalesData(salesByTime);

        const totalReservations = sortedOrders.filter((o) => o.typeoforder === "reservation").length;
        const totalPartyOrders = sortedOrders.filter((o) => o.typeoforder === "party_order").length;
        const totalTakeawayOrders = sortedOrders.filter((o) => o.typeoforder === "takeaway_order").length;
        const totalMenuOrders = sortedOrders.filter((o) => o.typeoforder === "menu_order").length;
        const totalCustomers = profilesData?.length || 0;
        const totalGuests = sortedOrders
          .filter((o) => o.typeoforder === "party_order")
          .reduce((sum, o) => sum + (Number(o.details?.guest_count) || 0), 0);
        const averagePartyGuests = totalPartyOrders > 0 ? totalGuests / totalPartyOrders : 0;
        const pendingOrders = sortedOrders.filter((o) => o.order_status === "pending").length;
        const completedOrders = sortedOrders.filter((o) => o.order_status === "completed").length;

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
        setOrders(sortedOrders);
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
        const { error } = await supabase
          .from("party_orders")
          .update({ status: "cancelled" })
          .eq("id", order.party_order_id);
        if (error) throw error;
      } else if (order.typeoforder === "takeaway_order" && order.takeaway_order_id) {
        const { error } = await supabase
          .from("takeaway_orders")
          .update({ order_status: "cancelled" })
          .eq("id", order.takeaway_order_id);
        if (error) throw error;
      } else if (order.typeoforder === "reservation" && order.reservation_id) {
        const { error } = await supabase
          .from("reservations")
          .update({ status: "cancelled" })
          .eq("id", order.reservation_id);
        if (error) throw error;
      } else if (order.typeoforder === "menu_order" && order.menuorder_id) {
        const { error } = await supabase
          .from("menuorder")
          .update({ status: "cancelled" })
          .eq("id", order.menuorder_id);
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
    } else if (location.pathname === "/admin/menu") setActiveTab("menu");
  }, [location.pathname]);

  const filteredOrders = orders.filter((order) => {
    const statusMatch = activeFilter === "all" || order.order_status?.toLowerCase() === activeFilter;
    const typeMatch =
      activeOrderTab === "all" ||
      (activeOrderTab === "party" && order.typeoforder === "party_order") ||
      (activeOrderTab === "takeaway" && order.typeoforder === "takeaway_order") ||
      (activeOrderTab === "menu" && order.typeoforder === "menu_order") ||
      (activeOrderTab === "dinein" && order.typeoforder === "reservation");
    return statusMatch && typeMatch;
  });

  const FilterBar = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="bg-orange-50 dark:bg-gray-800 p-4 rounded-lg shadow-md mb-6 flex flex-wrap justify-center gap-2"
    >
      {["all", "pending", "confirmed", "completed", "cancelled"].map((filter) => (
        <button
          key={filter}
          onClick={() => setActiveFilter(filter)}
          className={`px-3 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
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
      className="flex flex-wrap gap-2 mb-6 justify-center"
    >
      {["all", "party", "takeaway", "menu", "dinein"].map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveOrderTab(tab as "all" | "party" | "takeaway" | "menu" | "dinein")}
          className={`px-3 py-1 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
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
      <>
        <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'dark bg-gray-900' : 'light bg-gray-50'}`}>
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
        </div>
        <style>{`
          .loadership_YLVJQ {
            display: flex;
            position: relative;
            width: 200px;
            height: 100px;
          }
          .loadership_YLVJQ div {
            position: absolute;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            top: 44px;
            background: #ea580c;
            animation-timing-function: cubic-bezier(0, 1, 1, 0);
          }
          .loadership_YLVJQ div:nth-child(1) {
            left: 40px;
            animation: loadership_YLVJQ_scale_up 0.59s infinite;
          }
          .loadership_YLVJQ div:nth-child(2) {
            left: 40px;
            animation: loadership_YLVJQ_translate 0.59s infinite;
          }
          .loadership_YLVJQ div:nth-child(3) {
            left: 76px;
            animation: loadership_YLVJQ_translate 0.59s infinite;
          }
          .loadership_YLVJQ div:nth-child(4) {
            left: 112px;
            animation: loadership_YLVJQ_translate 0.59s infinite;
          }
          .loadership_YLVJQ div:nth-child(5) {
            left: 148px;
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
            100% { transform: translate(36px, 0); }
          }
        `}</style>
      </>
    );
  }

  if (!user) return <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center"><span className="text-gray-900 dark:text-white">Please log in.</span></div>;
  if (isAdmin === null) return <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center"><span className="text-gray-900 dark:text-white">Checking permissions...</span></div>;
  if (!isAdmin) return <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center"><span className="text-red-600 dark:text-red-400">Access denied.</span></div>;
  if (fetchError) return <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center"><span className="text-red-600 dark:text-red-400">{fetchError}</span></div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col sm:flex-row text-gray-900 dark:text-white">
      <AdminSidebar />
      <main className="flex-1 px-4 sm:px-6 lg:px-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto pt-4">
          <motion.nav
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-wrap space-x-2 mb-6 bg-orange-50 dark:bg-gray-800 p-2 rounded-lg shadow-lg justify-center sm:justify-start"
          >
            {["dashboard", "orders", "menu"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as "dashboard" | "menu" | "orders")}
                className={`px-3 py-1 sm:px-4 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-all ${
                  activeTab === tab
                    ? "bg-orange-600 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </motion.nav>

          {activeTab === "dashboard" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <h1 className="font-display text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6 text-center sm:text-left">
                Admin Dashboard
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-6 text-center sm:text-left">
                Overview of all activities
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
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
                className="bg-orange-50 dark:bg-gray-800 p-6 sm:p-8 rounded-lg shadow-lg mb-6"
              >
                <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center sm:text-left">
                  Sales Overview
                </h2>
                <SalesChart salesData={salesData} isDarkMode={isDarkMode} />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="bg-orange-50 dark:bg-gray-800 p-6 sm:p-8 rounded-lg shadow-lg mb-6"
              >
                <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center sm:text-left">
                  Revenue Overview
                </h2>
                <RevenueChart revenueData={revenueData} isDarkMode={isDarkMode} />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="bg-orange-50 dark:bg-gray-800 p-6 sm:p-8 rounded-lg shadow-lg mb-6"
              >
                <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center sm:text-left">
                  Recent Orders
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {orders.slice(0, 3).map((order, index) => (
                    <motion.div
                      key={order.id}
                      id={`order-card-${order.id}`}
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
              <h1 className="font-display text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6 text-center sm:text-left">
                Orders Management
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-6 text-center sm:text-left">
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

          {activeTab === "menu" && <MenuManagement />}
        </div>
      </main>
      <style>{`
        html {
          scroll-behavior: smooth;
        }
        main {
          -webkit-overflow-scrolling: touch;
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;