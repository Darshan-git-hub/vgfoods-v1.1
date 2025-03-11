import React, { useState } from "react";
import { Order, MenuDetails } from "./OrdersTable";

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
    switch (order.typeoforder) {
      case "menu_order":
        return order.menuDetails ? (
          <div className="space-y-1 text-sm text-gray-300">
            <p><strong>Total:</strong> ${order.menuDetails.total_amount}</p>
            <p><strong>Payment:</strong> {order.menuDetails.payment_method || "Not Specified"}</p>
            <p><strong>Address:</strong> {order.menuDetails.shipping_info?.address || order.user_address}</p>
            <p><strong>Items:</strong> {order.menuDetails.items.map((item) => `${item.name} (x${item.quantity})`).join(", ") || "None"}</p>
          </div>
        ) : <p className="text-sm text-gray-300">No details available</p>;
      case "takeaway_order":
        return order.details ? (
          <div className="space-y-1 text-sm text-gray-300">
            <p><strong>Name:</strong> {order.details.name || order.user_name}</p>
            <p><strong>Contact:</strong> {order.details.contact || order.user_contact}</p>
            <p><strong>Pickup:</strong> {order.details.pickup_time || "Not Set"}</p>
            <p><strong>Address:</strong> {order.details.address || order.user_address}</p>
          </div>
        ) : <p className="text-sm text-gray-300">No details available</p>;
      case "reservation":
        return order.details ? (
          <div className="space-y-1 text-sm text-gray-300">
            <p><strong>Name:</strong> {order.details.name || order.user_name}</p>
            <p><strong>Contact:</strong> {order.details.contact || order.user_contact}</p>
            <p><strong>Date:</strong> {order.details.date || "Not Set"}</p>
            <p><strong>Guests:</strong> {order.details.guests || 0}</p>
          </div>
        ) : <p className="text-sm text-gray-300">No details available</p>;
      case "party_order":
        return order.details ? (
          <div className="space-y-1 text-sm text-gray-300">
            <p><strong>Name:</strong> {order.details.name || order.user_name}</p>
            <p><strong>Contact:</strong> {order.details.contact || order.user_contact}</p>
            <p><strong>Event:</strong> {order.details.event_date || "Not Set"}</p>
            <p><strong>Guests:</strong> {order.details.guest_count || 0}</p>
            <p><strong>Address:</strong> {order.details.address || order.user_address}</p>
          </div>
        ) : <p className="text-sm text-gray-300">No details available</p>;
      default:
        return <p className="text-sm text-gray-300">Unknown order type</p>;
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-md p-4 border border-gray-700 hover:shadow-lg transition-all">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-white">Order #{order.id.slice(0, 8)}...</h3>
          <p className="text-sm text-gray-400">Type: {order.typeoforder || "Unknown"}</p>
          <p className="text-sm text-gray-400">Status: <span className="capitalize">{status}</span></p>
          <p className="text-sm text-gray-400">Created: {order.created_at || "Not Set"}</p>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="py-1 px-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-all text-sm"
        >
          {isExpanded ? "View Less" : "View More"}
        </button>
      </div>
      {isExpanded && (
        <div className="mt-4">
          <div className="text-sm text-gray-300">
            <p><strong>Customer:</strong> {order.user_name}</p>
            <p><strong>Email:</strong> {order.user_email}</p>
            <p><strong>Contact:</strong> {order.user_contact}</p>
            <p><strong>Address:</strong> {order.user_address}</p>
            {getOrderDetails()}
          </div>
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

export default OrderCard;