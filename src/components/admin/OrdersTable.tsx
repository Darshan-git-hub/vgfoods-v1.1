import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

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
  details?: {
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

      if (onOrderUpdate) onOrderUpdate({ ...order, order_status: newStatus });
      toast.success("Order status updated!");
    } catch (error: any) {
      toast.error("Failed to update status: " + error.message);
    }
  };

  if (orders.length === 0) return <div className="text-center p-5 text-gray-400">No orders found.</div>;

  return (
    <div className="overflow-x-auto rounded-lg shadow-lg border border-gray-700">
      <table className="min-w-full bg-gray-800 text-white">
        <thead className="bg-gray-700">
          <tr>
            {["Order ID", "Customer Name", "Contact", "Email", "Type", "Address", "Status", "Action"].map((header) => (
              <th key={header} className="px-4 py-3 text-left text-sm font-semibold">{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-t border-gray-700 hover:bg-gray-750 transition-all">
              <td className="px-4 py-3 text-sm">{order.id.slice(0, 8)}...</td>
              <td className="px-4 py-3 text-sm">{order.user_name}</td>
              <td className="px-4 py-3 text-sm">{order.user_contact}</td>
              <td className="px-4 py-3 text-sm">{order.user_email}</td>
              <td className="px-4 py-3 text-sm">{order.typeoforder || "Unknown"}</td>
              <td className="px-4 py-3 text-sm">{order.user_address}</td>
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
  );
};

export default OrdersTable;