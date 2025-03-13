// src/components/admin/AdminDashboardTypes.ts
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
    created_at?: string;
  }
  
  export interface Customer {
    id: string;
    full_name: string | null;
    email: string | null;
    phone: string | null;
    address: string | null;
    total_orders: number;
  }
  
  export interface Order {
    sequentialId: number;
    id: string;
    user_id: string;
    user_name?: string;
    user_email?: string;
    user_contact?: string;
    user_address?: string;
    typeoforder?: string;
    created_at?: string;
    party_order_id?: string | undefined; // Changed from string | null | undefined
    takeaway_order_id?: string | undefined; // Changed from string | null | undefined
    reservation_id?: string | undefined; // Changed from string | null | undefined
    menuorder_id?: string | undefined; // Changed from string | null | undefined
    order_status?: string;
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
      status?: string;
      order_status?: string;
    };
    menuDetails?: MenuDetails;
  }
  
  export interface DashboardStats {
    totalReservations: number;
    totalPartyOrders: number;
    totalTakeawayOrders: number;
    totalMenuOrders: number;
    totalCustomers: number;
    averagePartyGuests: number;
    pendingOrders: number;
    completedOrders: number;
  }
  
  export interface RevenueData {
    labels: string[];
    data: number[];
  }
  
  export interface SalesData {
    dineIn: { orders: number };
    takeaway: { orders: number };
    partyOrders: { orders: number };
  }