import { useState, useEffect, Dispatch, SetStateAction, ChangeEvent, FormEvent } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import toast from 'react-hot-toast';
import { Calendar, Clock, Users, Truck, MapPin, Phone, Mail, ChefHat, AlertCircle, ChevronDown, ChevronUp, Search, Filter, Bell, User, LogOut, Home, ShoppingBag, FileText, Settings, ArrowUpDown, Menu, X, Coffee } from 'lucide-react';

// Define interfaces for type safety
interface MenuItem {
  name: string;
  price: number;
  quantity: number;
}

interface MenuDetails {
  items: MenuItem[];
  total_amount: number;
  shipping_info?: { address?: string };
  payment_method?: string;
  status?: string;
}

interface Order {
  id: string;
  typeoforder?: string;
  details?: any;
  created_at?: string;
  menuDetails?: MenuDetails;
}

interface Profile {
  full_name?: string;
  email?: string;
  created_at?: string;
}

// StatusBadge Component
function StatusBadge({ status }: { status: string }) {
  const getStatusColor = () => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-yellow-900 dark:text-yellow-200 dark:border-yellow-700';
      case 'confirmed':
        return 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-green-900 dark:text-green-200 dark:border-green-700';
      case 'cancelled':
        return 'bg-rose-50 text-rose-700 border border-rose-200 dark:bg-red-900 dark:text-red-200 dark:border-red-700';
      case 'completed':
        return 'bg-sky-50 text-sky-700 border border-sky-200 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-700';
      default:
        return 'bg-gray-50 text-gray-700 border border-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600';
    }
  };

  return (
    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor()}`}>
      {status}
    </span>
  );
}

// InfoRow Component
function InfoRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string | null | undefined }) {
  if (value === null || value === undefined) return null;

  return (
    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
      <Icon size={16} className="flex-shrink-0 text-gray-400 dark:text-gray-500" />
      <span className="font-medium text-gray-700 dark:text-gray-300">{label}:</span>
      <span className="text-gray-600 dark:text-gray-400">{value}</span>
    </div>
  );
}

// OrderCard Component
function OrderCard({ order, onCancel }: { order: Order; onCancel: (orderId: string) => void }) {
  const [expanded, setExpanded] = useState(false);

  const getHeaderColor = () => {
    switch (order.typeoforder?.toLowerCase()) {
      case 'party_order':
      case 'takeaway_order':
      case 'reservation':
        return 'bg-orange-500 dark:bg-orange-600';
      default:
        return 'bg-gray-500 dark:bg-gray-700';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all duration-300">
      <div className={`${getHeaderColor()} px-5 py-4 flex justify-between items-center`}>
        <h2 className="text-white text-lg font-semibold capitalize">{order.typeoforder?.replace('_', ' ') || 'Order'}</h2>
        <span className="text-xs text-white bg-white/20 px-2 py-1 rounded-full">Order #{order.id.slice(0, 8)}</span>
      </div>
      <div className="p-5 space-y-3">
        <div className="flex justify-between items-center">
          <StatusBadge status={order.menuDetails?.status || 'Unknown'} />
          <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
            {order.created_at ? new Date(order.created_at).toLocaleDateString() : 'N/A'}
          </span>
        </div>

        {order.typeoforder === 'reservation' && (
          <div className="space-y-2">
            <InfoRow icon={Users} label="Name" value={order.details?.name} />
            <InfoRow icon={Calendar} label="Date" value={order.details?.date} />
            <InfoRow icon={Users} label="Guests" value={order.details?.guests?.toString()} />
          </div>
        )}
        {order.typeoforder === 'party_order' && (
          <div className="space-y-2">
            <InfoRow icon={Users} label="Name" value={order.details?.name} />
            <InfoRow icon={ChefHat} label="Dish Selections" value={order.details?.dish_selections} />
            <InfoRow icon={AlertCircle} label="Special Requests" value={order.details?.special_requests} />
          </div>
        )}
        {order.typeoforder === 'takeaway_order' && (
          <div className="space-y-2">
            <InfoRow icon={Users} label="Name" value={order.details?.name} />
            <InfoRow icon={Clock} label="Pickup Time" value={order.details?.pickup_time} />
          </div>
        )}

        {expanded && (
          <div className="pt-3 space-y-3 border-t border-gray-100 dark:border-gray-700 mt-2">
            {order.menuDetails && (
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Menu Items</h3>
                {Array.isArray(order.menuDetails.items) && order.menuDetails.items.length > 0 ? (
                  <ul className="list-disc pl-5 text-gray-600 dark:text-gray-400">
                    {order.menuDetails.items.map((item, index) => (
                      <li key={index}>
                        {item.name || 'Unknown Item'} - ${item.price || 0} (Qty: {item.quantity || 1})
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-600 dark:text-gray-400">No items available</p>
                )}
                <InfoRow icon={FileText} label="Total Amount" value={`$${order.menuDetails.total_amount || 0}`} />
                <InfoRow icon={Truck} label="Shipping" value={order.menuDetails.shipping_info?.address} />
                <InfoRow icon={FileText} label="Payment Method" value={order.menuDetails.payment_method} />
              </div>
            )}

            {order.typeoforder === 'reservation' && (
              <>
                <InfoRow icon={Phone} label="Contact" value={order.details?.contact} />
                <InfoRow icon={Mail} label="Email" value={order.details?.email} />
                <InfoRow icon={Clock} label="Time" value={order.details?.time} />
                <InfoRow icon={AlertCircle} label="Special Requests" value={order.details?.special_requests} />
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => onCancel(order.id)}
                    className="flex-1 px-4 py-2 bg-rose-50 dark:bg-red-900 text-rose-600 dark:text-red-200 rounded-lg hover:bg-rose-100 dark:hover:bg-red-800 transition-colors"
                  >
                    Cancel Reservation
                  </button>
                  <button className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 dark:hover:bg-orange-500 transition-colors">
                    Modify Booking
                  </button>
                </div>
              </>
            )}
            {order.typeoforder === 'party_order' && (
              <>
                <InfoRow icon={Phone} label="Contact" value={order.details?.contact} />
                <InfoRow icon={Calendar} label="Event Date" value={order.details?.event_date} />
                <InfoRow icon={Users} label="Guest Count" value={order.details?.guest_count?.toString()} />
                <InfoRow icon={Truck} label="Delivery Method" value={order.details?.delivery_method} />
                <InfoRow icon={MapPin} label="Address" value={order.details?.address} />
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => onCancel(order.id)}
                    className="flex-1 px-4 py-2 bg-rose-50 dark:bg-red-900 text-rose-600 dark:text-red-200 rounded-lg hover:bg-rose-100 dark:hover:bg-red-800 transition-colors"
                  >
                    Cancel Order
                  </button>
                  <button className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 dark:hover:bg-orange-500 transition-colors">
                    Modify Order
                  </button>
                </div>
              </>
            )}
            {order.typeoforder === 'takeaway_order' && (
              <>
                <InfoRow icon={Phone} label="Contact" value={order.details?.contact} />
                <InfoRow icon={AlertCircle} label="Instructions" value={order.details?.instructions} />
                <InfoRow icon={MapPin} label="Address" value={order.details?.address} />
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => onCancel(order.id)}
                    className="flex-1 px-4 py-2 bg-rose-50 dark:bg-red-900 text-rose-600 dark:text-red-200 rounded-lg hover:bg-rose-100 dark:hover:bg-red-800 transition-colors"
                  >
                    Cancel Order
                  </button>
                  <button className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 dark:hover:bg-orange-500 transition-colors">
                    Modify Time
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-center gap-1 px-4 py-2 bg-white dark:bg-gray-800 text-orange-600 dark:text-orange-300 border border-orange-100 dark:border-orange-700 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900 transition-colors"
        >
          {expanded ? (
            <>
              <ChevronUp size={16} />
              <span>View Less</span>
            </>
          ) : (
            <>
              <ChevronDown size={16} />
              <span>View More</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

// Sidebar Component with Mobile Toggle
interface SidebarProps {
  user: Profile | null;
  signOut: () => Promise<void>;
  setActiveTab: Dispatch<SetStateAction<'overview' | 'orders' | 'addresses' | 'settings'>>;
  activeTab: 'overview' | 'orders' | 'addresses' | 'settings';
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

function Sidebar({ user, signOut, setActiveTab, activeTab, isOpen, setIsOpen }: SidebarProps) {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-gray-800 shadow-xl dark:shadow-none border-r border-gray-100 dark:border-gray-700 transform transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex flex-col h-full">
          <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-orange-500 dark:bg-orange-600 flex items-center justify-center">
                <Coffee size={18} className="text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">VGFoods</h2>
            </div>
            <button
              className="p-1 rounded-md text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 lg:hidden"
              onClick={() => setIsOpen(false)}
            >
              <X size={20} />
            </button>
          </div>
          <div className="p-5 flex-1">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-full bg-orange-500 dark:bg-orange-600 p-0.5">
                <div className="w-full h-full rounded-full bg-white dark:bg-gray-800 flex items-center justify-center">
                  <User size={24} className="text-orange-600 dark:text-orange-300" />
                </div>
              </div>
              <div>
                <p className="font-semibold text-gray-800 dark:text-white">{user?.full_name || 'User'}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email || 'N/A'}</p>
              </div>
            </div>

            <nav className="space-y-1.5">
              {['overview', 'orders', 'addresses', 'settings'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab as 'overview' | 'orders' | 'addresses' | 'settings');
                    setIsOpen(false);
                  }}
                  className={`flex items-center gap-3 p-3 rounded-lg text-gray-600 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 w-full text-left ${
                    activeTab === tab ? 'bg-orange-50 dark:bg-orange-900 text-orange-600 dark:text-orange-300' : ''
                  }`}
                >
                  {tab === 'overview' && <Home size={18} />}
                  {tab === 'orders' && <ShoppingBag size={18} />}
                  {tab === 'addresses' && <MapPin size={18} />}
                  {tab === 'settings' && <Settings size={18} />}
                  <span>{tab.charAt(0).toUpperCase() + tab.slice(1)}</span>
                </button>
              ))}
            </nav>
          </div>
          <div className="p-5 border-t border-gray-100 dark:border-gray-700">
            <button
              onClick={() => {
                signOut();
                setIsOpen(false);
              }}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-200 hover:text-gray-800 dark:hover:text-white p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 w-full"
            >
              <LogOut size={18} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// Header Component with Mobile Toggle
function Header({ setIsSidebarOpen }: { setIsSidebarOpen: (isOpen: boolean) => void }) {
  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 py-4 px-5 flex justify-between items-center sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <button
          className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 lg:hidden"
          onClick={() => setIsSidebarOpen(true)}
        >
          <Menu size={20} className="text-gray-600 dark:text-gray-300" />
        </button>
        <div className="lg:hidden flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-orange-500 dark:bg-orange-600 flex items-center justify-center">
            <Coffee size={14} className="text-white" />
          </div>
          <h2 className="text-lg font-bold text-gray-800 dark:text-white">VGFoods</h2>
        </div>
      </div>

      <div className="hidden md:flex items-center gap-4 flex-1 max-w-md mx-auto">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search orders..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-600 focus:border-transparent bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200"
          />
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 relative">
          <Bell size={20} className="text-gray-600 dark:text-gray-300" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 dark:bg-red-500 rounded-full"></span>
        </button>
        <div className="w-9 h-9 rounded-full bg-orange-500 dark:bg-orange-600 p-0.5 lg:hidden">
          <div className="w-full h-full rounded-full bg-white dark:bg-gray-800 flex items-center justify-center">
            <User size={18} className="text-orange-600 dark:text-orange-300" />
          </div>
        </div>
      </div>
    </header>
  );
}

// FilterBar Component
interface FilterBarProps {
  activeFilter: string;
  setActiveFilter: Dispatch<SetStateAction<string>>;
}

function FilterBar({ activeFilter, setActiveFilter }: FilterBarProps) {
  return (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-sm mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 w-full sm:w-auto">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
            activeFilter === 'all'
              ? 'bg-orange-500 dark:bg-orange-600 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          All Orders
        </button>
        <button
          onClick={() => setActiveFilter('pending')}
          className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
            activeFilter === 'pending'
              ? 'bg-orange-500 dark:bg-orange-600 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          Pending
        </button>
        <button
          onClick={() => setActiveFilter('confirmed')}
          className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
            activeFilter === 'confirmed'
              ? 'bg-orange-500 dark:bg-orange-600 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          Confirmed
        </button>
        <button
          onClick={() => setActiveFilter('completed')}
          className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
            activeFilter === 'completed'
              ? 'bg-orange-500 dark:bg-orange-600 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          Completed
        </button>
      </div>

      <div className="flex gap-2 w-full sm:w-auto">
        <button className="flex items-center gap-1 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-600 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm">
          <Filter size={14} />
          <span>Filter</span>
        </button>
        <button className="flex items-center gap-1 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-600 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm">
          <ArrowUpDown size={14} />
          <span>Sort</span>
        </button>
      </div>
    </div>
  );
}

// StatCard Component
function StatCard({ icon: Icon, title, value, trend }: { icon: React.ElementType; title: string; value: string; trend: string }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{value}</h3>
          <p className={`text-xs mt-1 ${trend.includes('+') ? 'text-emerald-600 dark:text-green-400' : 'text-rose-600 dark:text-red-400'}`}>
            {trend}
          </p>
        </div>
        <div className="w-10 h-10 rounded-lg bg-orange-50 dark:bg-orange-900 flex items-center justify-center">
          <Icon size={20} className="text-orange-600 dark:text-orange-300" />
        </div>
      </div>
    </div>
  );
}

// Settings Component
function SettingsTab({ profile }: { profile: Profile | null }) {
  const { user } = useAuth();
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [email, setEmail] = useState(profile?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpdateProfile = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!user?.id) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('profiles')
        .update({ full_name: fullName })
        .eq('id', user.id);

      if (error) throw error;

      const { error: authError } = await supabase.auth.updateUser({ email });
      if (authError) {
        if (authError.message.includes('Email rate limit exceeded')) {
          toast.error('Email update rate limit exceeded. Please try again later.');
        } else {
          throw authError;
        }
      }

      toast.success('Profile updated successfully!');
    } catch (error: any) {
      console.error('Error updating profile:', error.message);
      toast.error(`Failed to update profile: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e: FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match!');
      return;
    }
    setLoading(true);
    try {
      if (!user?.email) throw new Error('User email not found');

      // Re-authenticate user with current password before updating
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
      });
      if (signInError) throw new Error('Current password is incorrect');

      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;

      toast.success('Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      console.error('Error updating password:', error.message);
      toast.error(`Failed to update password: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Manage your account preferences</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Update Profile</h2>
        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              value={fullName}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setFullName(e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-600 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200"
              placeholder="Enter your full name"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-600 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200"
              placeholder="Enter your email"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full px-4 py-2 bg-orange-500 dark:bg-orange-600 text-white rounded-lg hover:bg-orange-600 dark:hover:bg-orange-700 transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Updating...' : 'Update Profile'}
          </button>
        </form>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Change Password</h2>
        <form onSubmit={handleUpdatePassword} className="space-y-4">
          <div>
            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Current Password
            </label>
            <input
              type="password"
              id="currentPassword"
              value={currentPassword}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setCurrentPassword(e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-600 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200"
              placeholder="Enter your current password"
            />
          </div>
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setNewPassword(e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-600 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200"
              placeholder="Enter your new password"
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Confirm New Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-600 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200"
              placeholder="Confirm your new password"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full px-4 py-2 bg-orange-500 dark:bg-orange-600 text-white rounded-lg hover:bg-orange-600 dark:hover:bg-orange-700 transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Updating...' : 'Change Password'}
          </button>
        </form>
      </div>
    </div>
  );
}

// UserDashboard Component
const UserDashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'addresses' | 'settings'>('overview');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [visibleOrders] = useState(3); // Fixed at 3 for Recent Orders
  const [activeFilter, setActiveFilter] = useState('all');
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);

        if (!user || !user.id) {
          console.error('No authenticated user found:', user);
          throw new Error('User not authenticated');
        }

        console.log('Fetching profile for user ID:', user.id);

        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('full_name, email, created_at')
          .eq('id', user.id)
          .single();

        if (profileError) {
          console.error('Profile fetch error:', profileError.message, profileError.details);
          throw new Error(`Profile fetch failed: ${profileError.message}`);
        }
        if (!profileData) {
          console.error('No profile data returned for user ID:', user.id);
          throw new Error('No profile data found');
        }
        setProfile(profileData);

        console.log('Fetching orders for user ID:', user.id);

        const { data: ordersData, error: ordersError } = await supabase
          .from('orders')
          .select(`
            id,
            typeoforder,
            created_at,
            reservation_id,
            party_order_id,
            takeaway_order_id,
            menuorder:menuorder_id (
              items,
              total_amount,
              shipping_info,
              payment_method,
              status
            )
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (ordersError) {
          console.error('Orders fetch error:', ordersError.message, ordersError.details);
          throw new Error(`Orders fetch failed: ${ordersError.message}`);
        }
        if (!ordersData) {
          console.warn('No orders data returned for user ID:', user.id);
        }

        const detailedOrders = await Promise.all(
          (ordersData || []).map(async (order) => {
            let details = null;
            if (order.typeoforder === 'reservation' && order.reservation_id) {
              const { data, error } = await supabase.from('reservations').select('*').eq('id', order.reservation_id).single();
              if (error) console.warn('Reservation fetch error:', error.message);
              details = data || {};
            } else if (order.typeoforder === 'party_order' && order.party_order_id) {
              const { data, error } = await supabase.from('party_orders').select('*').eq('id', order.party_order_id).single();
              if (error) console.warn('Party order fetch error:', error.message);
              details = data || {};
            } else if (order.typeoforder === 'takeaway_order' && order.takeaway_order_id) {
              const { data, error } = await supabase.from('takeaway_orders').select('*').eq('id', order.takeaway_order_id).single();
              if (error) console.warn('Takeaway order fetch error:', error.message);
              details = data || {};
            }
            if (details) {
              delete details.id;
              delete details.user_id;
              delete details.created_at;
            }

            const menuOrderDataRaw = order.menuorder;
            const menuOrderData = Array.isArray(menuOrderDataRaw) ? menuOrderDataRaw[0] : menuOrderDataRaw;

            return {
              id: order.id,
              typeoforder: order.typeoforder,
              created_at: order.created_at,
              details,
              menuDetails: menuOrderData
                ? {
                    items: Array.isArray(menuOrderData.items) ? menuOrderData.items : [],
                    total_amount: Number(menuOrderData.total_amount) || 0,
                    shipping_info: menuOrderData.shipping_info || {},
                    payment_method: menuOrderData.payment_method || 'N/A',
                    status: menuOrderData.status || 'Unknown',
                  }
                : undefined,
            };
          })
        );

        console.log('Orders fetched successfully:', detailedOrders);
        setOrders(detailedOrders);
      } catch (error: any) {
        console.error('Error in fetchUserData:', error.message, error.stack);
        toast.error(`Failed to load user data: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  const handleCancel = async (orderId: string) => {
    try {
      const { data: orderData, error: fetchError } = await supabase
        .from('orders')
        .select('menuorder_id')
        .eq('id', orderId)
        .single();

      if (fetchError) throw fetchError;
      if (!orderData?.menuorder_id) throw new Error('No associated menuorder found');

      const { error } = await supabase
        .from('menuorder')
        .update({ status: 'cancelled' })
        .eq('id', orderData.menuorder_id);

      if (error) throw error;

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId && order.menuDetails
            ? { ...order, menuDetails: { ...order.menuDetails, status: 'cancelled' } }
            : order
        )
      );
      setNotificationMessage('Your order has been cancelled successfully.');
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    } catch (error: any) {
      console.error('Error cancelling order:', error.message);
      toast.error('Failed to cancel order');
    }
  };

  const handlePlaceNewOrder = () => {
    navigate('/menu');
  };

  const filteredOrders = orders.filter((order) => {
    if (activeFilter === 'all') return true;
    return order.menuDetails?.status?.toLowerCase() === activeFilter;
  });

  // Dynamically calculate stats from orders
  const totalOrders = orders.length.toString();
  const totalReservations = orders.filter((order) => order.typeoforder === 'reservation').length.toString();
  const totalTakeaways = orders.filter((order) => order.typeoforder === 'takeaway_order').length.toString();
  const totalPartyOrders = orders.filter((order) => order.typeoforder === 'party_order').length.toString();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
        <p className="mt-4 text-gray-700 dark:text-gray-300">Loading user data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      <Sidebar
        user={profile}
        signOut={signOut}
        setActiveTab={setActiveTab}
        activeTab={activeTab}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      <div className="flex-1 flex flex-col min-h-screen">
        <Header setIsSidebarOpen={setIsSidebarOpen} />

        <main className="flex-1 p-5 md:p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'overview' && (
              <>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Account Overview</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Manage your orders and profile</p>
                  </div>
                  <button
                    onClick={handlePlaceNewOrder}
                    className="mt-3 sm:mt-0 px-5 py-2.5 bg-orange-500 dark:bg-orange-600 text-white rounded-lg hover:bg-orange-600 dark:hover:bg-orange-700 transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    <ShoppingBag size={16} />
                    <span>Place New Order</span>
                  </button>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Profile Information</h2>
                  <div className="space-y-2">
                    <InfoRow icon={Users} label="Name" value={profile?.full_name} />
                    <InfoRow icon={Mail} label="Email" value={profile?.email} />
                    <InfoRow icon={Calendar} label="Member Since" value={profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : undefined} />
                    <InfoRow icon={Truck} label="Total Orders" value={totalOrders} />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <StatCard icon={ShoppingBag} title="Total Orders" value={totalOrders} trend="+12% from last month" />
                  <StatCard icon={Calendar} title="Reservations" value={totalReservations} trend="+5% from last month" />
                  <StatCard icon={Coffee} title="Takeaways" value={totalTakeaways} trend="+18% from last month" />
                  <StatCard icon={Users} title="Party Orders" value={totalPartyOrders} trend="+2% from last month" />
                </div>

                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Recent Orders</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {filteredOrders.length > 0 ? (
                    filteredOrders.slice(0, visibleOrders).map((order) => (
                      <OrderCard key={order.id} order={order} onCancel={handleCancel} />
                    ))
                  ) : (
                    <p className="text-gray-700 dark:text-gray-300">No recent orders.</p>
                  )}
                </div>
              </>
            )}

            {activeTab === 'orders' && (
              <>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">All Orders</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">View and manage all your orders</p>
                  </div>
                  <button
                    onClick={handlePlaceNewOrder}
                    className="mt-3 sm:mt-0 px-5 py-2.5 bg-orange-500 dark:bg-orange-600 text-white rounded-lg hover:bg-orange-600 dark:hover:bg-orange-700 transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    <ShoppingBag size={16} />
                    <span>Place New Order</span>
                  </button>
                </div>
                <FilterBar activeFilter={activeFilter} setActiveFilter={setActiveFilter} />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {filteredOrders.length > 0 ? (
                    filteredOrders.map((order) => (
                      <OrderCard key={order.id} order={order} onCancel={handleCancel} />
                    ))
                  ) : (
                    <p className="text-gray-700 dark:text-gray-300">No orders found.</p>
                  )}
                </div>
              </>
            )}

            {activeTab === 'settings' && <SettingsTab profile={profile} />}
          </div>

          {showNotification && (
            <div className="fixed top-4 right-4 bg-white dark:bg-gray-800 shadow-lg rounded-xl p-4 z-50 max-w-md border-l-4 border-emerald-500 dark:border-green-500 animate-fade-in">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-green-900 flex items-center justify-center">
                    <svg className="h-5 w-5 text-emerald-500 dark:text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{notificationMessage}</p>
                </div>
                <div className="ml-auto pl-3">
                  <button
                    onClick={() => setShowNotification(false)}
                    className="inline-flex rounded-md p-1.5 text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>


      </div>
    </div>
  );
};

export default UserDashboard;