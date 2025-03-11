import { useState } from "react";
import { 
  Home as HomeIcon, 
  Info, 
  Menu as MenuIcon, 
  Utensils, 
  ShoppingBag, 
  Users, 
  MessageCircle, 
  Phone, 
  X,
  ChevronDown 
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// Define the props interface for the Sidebar component
interface SidebarProps {
  className?: string; // Optional className prop
}

const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDiningOpen, setIsDiningOpen] = useState(false); // For toggling Dining & Orders submenu
  const navigate = useNavigate();

  const toggleSidebar = () => setIsOpen(!isOpen);
  const toggleDining = () => setIsDiningOpen(!isDiningOpen);

  const menuItems = [
    { name: 'Home', path: '/', icon: HomeIcon },
    { name: 'About', path: '/about', icon: Info },
    { name: 'Menu', path: '/menu', icon: MenuIcon },
    {
      name: 'Dining & Orders',
      icon: Utensils,
      subItems: [
        { name: 'Dine In', path: '/dine-in', icon: Utensils },
        { name: 'Takeaway', path: '/takeaway', icon: ShoppingBag },
        { name: 'Party Order', path: '/party-order', icon: Users },
        { 
          name: 'WhatsApp Order', 
          path: 'https://wa.me/9751903129?text=Hi,%20I%20would%20like%20to%20place%20an%20order.', 
          icon: MessageCircle,
          isExternal: true 
        },
      ],
    },
    { name: 'Contact', path: '/contact', icon: Phone },
  ];

  return (
    <>
      {/* Hamburger Menu Button (Mobile Only) */}
      <button
        className="fixed top-20 right-4 z-50 md:hidden p-2 bg-orange-600 text-white rounded-md"
        onClick={toggleSidebar}
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <div className="space-y-1">
            <span className="block w-6 h-0.5 bg-white"></span>
            <span className="block w-6 h-0.5 bg-white"></span>
            <span className="block w-6 h-0.5 bg-white"></span>
          </div>
        )}
      </button>

      {/* Sidebar (Visible on Mobile Only) */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out z-40 md:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } ${className || ''}`}
      >
        {/* Close Button for Mobile (Inside Sidebar) */}
        <button
          className="md:hidden absolute top-4 right-4 p-1 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          onClick={toggleSidebar}
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-4 h-full flex flex-col">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">VG Foods</h2>
          <nav className="flex-1">
            <ul className="space-y-2">
              {menuItems.map((item, index) => (
                <li key={index}>
                  {item.subItems ? (
                    <div>
                      <button
                        onClick={toggleDining}
                        className="flex items-center w-full text-left p-2 rounded-lg hover:bg-orange-100 dark:hover:bg-gray-700 transition-colors duration-200"
                      >
                        <item.icon className="w-6 h-6 text-orange-600 mr-3" />
                        <span className="text-gray-900 dark:text-white font-medium flex-1">{item.name}</span>
                        <ChevronDown
                          className={`w-5 h-5 text-gray-600 transform transition-transform ${
                            isDiningOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      {isDiningOpen && (
                        <ul className="pl-8 space-y-2 mt-2">
                          {item.subItems.map((subItem, subIndex) => (
                            <li key={subIndex}>
                              {subItem.isExternal ? (
                                <a
                                  href={subItem.path}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center w-full text-left p-2 rounded-lg hover:bg-orange-200 dark:hover:bg-gray-600 transition-colors duration-200"
                                  onClick={() => setIsOpen(false)}
                                >
                                  <subItem.icon className="w-5 h-5 text-orange-600 mr-2" />
                                  <span className="text-gray-900 dark:text-white text-sm">{subItem.name}</span>
                                </a>
                              ) : (
                                <button
                                  onClick={() => {
                                    navigate(subItem.path);
                                    setIsOpen(false);
                                  }}
                                  className="flex items-center w-full text-left p-2 rounded-lg hover:bg-orange-200 dark:hover:bg-gray-600 transition-colors duration-200"
                                >
                                  <subItem.icon className="w-5 h-5 text-orange-600 mr-2" />
                                  <span className="text-gray-900 dark:text-white text-sm">{subItem.name}</span>
                                </button>
                              )}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        navigate(item.path);
                        setIsOpen(false);
                      }}
                      className="flex items-center w-full text-left p-2 rounded-lg hover:bg-orange-100 dark:hover:bg-gray-700 transition-colors duration-200"
                    >
                      <item.icon className="w-6 h-6 text-orange-600 mr-3" />
                      <span className="text-gray-900 dark:text-white font-medium">{item.name}</span>
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      {/* Overlay (Mobile Only) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-30 md:hidden"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
};

export default Sidebar;