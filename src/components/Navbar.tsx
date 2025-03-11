import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sun, Moon, ShoppingCart, ChevronDown, LayoutDashboard } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { supabase } from "../lib/supabaseClient";
import defaultProfileImage from "../images/up.png";

const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { cartItems } = useCart();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [profileImage] = useState<string>(defaultProfileImage); // No need for state if it’s static
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        if (error) throw error;

        setIsAdmin(data?.role === "admin");
      } catch (error) {
        console.error("Error fetching user role:", error);
      }
    };

    fetchUserRole();
  }, [user]);

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsProfileOpen(false);
      localStorage.removeItem("loginNotificationShown");
      toast.success("Logged out successfully");
      navigate("/signin");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Preload navigation targets to reduce flash
  const handleNavigation = (path: string) => {
    setIsDropdownOpen(false); // Close dropdown before navigating
    navigate(path);
  };

  return (
    <nav className="fixed w-full z-50 bg-white dark:bg-gray-900 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold text-gray-800 dark:text-white">VG Foods</span>
          </Link>

          <div className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-600 dark:text-gray-300 hover:text-orange-600 transition">Home</Link>
            <Link to="/about" className="text-gray-600 dark:text-gray-300 hover:text-orange-600 transition">About</Link>
            <Link to="/menu" className="text-gray-600 dark:text-gray-300 hover:text-orange-600 transition">Menu</Link>

            <div className="relative">
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)} 
                className="text-gray-600 dark:text-gray-300 hover:text-orange-600 transition flex items-center space-x-2"
              >
                <span>Dining & Orders</span>
                <ChevronDown className="h-4 w-4" />
              </button>

              {isDropdownOpen && (
                <div className="absolute left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                  <button onClick={() => handleNavigation("/dine-in")} className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">Dine In</button>
                  <button onClick={() => handleNavigation("/takeaway")} className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">Takeaway</button>
                  <button onClick={() => handleNavigation("/party-order")} className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">Party Order</button>
                  <a 
                    href="https://wa.me/447521262119?text=Hi,%20I%20would%20like%20to%20place%20an%20order." 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                  >
                    WhatsApp Order
                  </a>
                </div>
              )}
            </div>

            <Link to="/contact" className="text-gray-600 dark:text-gray-300 hover:text-orange-600 transition">Contact</Link>

            {isAdmin && (
              <Link to="/admin" className="text-gray-600 dark:text-gray-300 hover:text-orange-600 transition flex items-center space-x-2">
                <LayoutDashboard className="w-5 h-5" />
                <span>Admin Dashboard</span>
              </Link>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition">
              {theme === "dark" ? <Sun className="h-5 w-5 text-gray-300" /> : <Moon className="h-5 w-5 text-gray-600" />}
            </button>

            <button onClick={() => navigate("/cart")} className="relative flex items-center text-gray-600 dark:text-gray-300 hover:text-orange-600 transition space-x-2">
              <ShoppingCart className="h-5 w-5" />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-3 bg-orange-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
              <span>Cart</span>
            </button>

            {!user ? (
              <button onClick={() => navigate("/signin")} className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition">Sign In</button>
            ) : (
              <div className="relative">
                <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                  <img src={profileImage} alt="User Avatar" className="w-10 h-10 rounded-full border border-gray-300" />
                  <ChevronDown className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                </button>
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                    <button onClick={() => navigate("/userdashboard")} className="block w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">View Profile</button>
                    <button onClick={handleSignOut} className="block w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">Sign Out</button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;