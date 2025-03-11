import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, ArrowRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext'; // Adjust path based on your project structure

const Footer = () => {
  const { theme } = useTheme(); // Access the theme from ThemeContext

  // Define theme-based classes
  const footerClasses = theme === 'dark' 
    ? 'bg-gray-900 text-gray-300' 
    : 'bg-gray-100 text-gray-700';
  const headingClasses = theme === 'dark' 
    ? 'text-white' 
    : 'text-gray-900';
  const textClasses = theme === 'dark' 
    ? 'text-gray-400' 
    : 'text-gray-600';
  const hoverClasses = theme === 'dark' 
    ? 'hover:text-orange-500' 
    : 'hover:text-orange-600';
  const iconClasses = theme === 'dark' 
    ? 'text-orange-500' 
    : 'text-orange-600';
  const borderClasses = theme === 'dark' 
    ? 'border-gray-800' 
    : 'border-gray-200';

  return (
    <footer className={`${footerClasses} transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* About Section */}
          <div>
            <h3 className={`text-2xl font-bold ${headingClasses} mb-6`}>VG Foods</h3>
            <p className={`${textClasses} mb-6`}>
              Bringing you the finest selection of vegetarian, vegan, and non-vegetarian dishes, 
              prepared with love and served with care.
            </p>
            <div className="flex space-x-4">
              <a href="#" className={`${hoverClasses} transition-colors`}>
                <Facebook className="w-6 h-6" />
              </a>
              <a href="#" className={`${hoverClasses} transition-colors`}>
                <Instagram className="w-6 h-6" />
              </a>
              <a href="#" className={`${hoverClasses} transition-colors`}>
                <Twitter className="w-6 h-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className={`text-xl font-semibold ${headingClasses} mb-6`}>Quick Links</h4>
            <div className="grid grid-cols-2 gap-4">
              {/* Left Column */}
              <ul className="space-y-4">
                <li>
                  <a href="/" className={`flex items-center ${hoverClasses} transition-colors`}>
                    <ArrowRight className="w-4 h-4 mr-2" /> Home
                  </a>
                </li>
                <li>
                  <a href="/menu" className={`flex items-center ${hoverClasses} transition-colors`}>
                    <ArrowRight className="w-4 h-4 mr-2" /> Menu
                  </a>
                </li>
                <li>
                  <a href="/about" className={`flex items-center ${hoverClasses} transition-colors`}>
                    <ArrowRight className="w-4 h-4 mr-2" /> About Us
                  </a>
                </li>
                <li>
                  <a href="/contact" className={`flex items-center ${hoverClasses} transition-colors`}>
                    <ArrowRight className="w-4 h-4 mr-2" /> Contact
                  </a>
                </li>
              </ul>
              {/* Right Column */}
              <ul className="space-y-4">
                <li>
                  <a href="/dine-in" className={`flex items-center ${hoverClasses} transition-colors`}>
                    <ArrowRight className="w-4 h-4 mr-2" /> Dine In
                  </a>
                </li>
                <li>
                  <a href="/takeaway" className={`flex items-center ${hoverClasses} transition-colors`}>
                    <ArrowRight className="w-4 h-4 mr-2" /> Takeaway
                  </a>
                </li>
                <li>
                  <a href="/party-order" className={`flex items-center ${hoverClasses} transition-colors`}>
                    <ArrowRight className="w-4 h-4 mr-2" /> Party Order
                  </a>
                </li>
                <li>
                  <a
                    href="https://wa.me/447521262119"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center ${hoverClasses} transition-colors whitespace-nowrap`}
                  >
                    <ArrowRight className="w-4 h-4 mr-2" /> WhatsApp Order
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className={`text-xl font-semibold ${headingClasses} mb-6`}>Contact Info</h4>
            <ul className="space-y-4">
              <li className="flex items-center">
                <MapPin className={`w-5 h-5 mr-3 ${iconClasses}`} />
                <span>855 Bristol Rd South, Northfield, Birmingham B31 2PA</span>
              </li>
              <li className="flex items-center">
                <Phone className={`w-5 h-5 mr-3 ${iconClasses}`} />
                <span>07521 262119</span>
              </li>
              <li className="flex items-center">
                <Mail className={`w-5 h-5 mr-3 ${iconClasses}`} />
                <span>info@vgfoods.com</span>
              </li>
            </ul>
          </div>

          {/* Opening Hours */}
          <div>
            <h4 className={`text-xl font-semibold ${headingClasses} mb-6`}>Opening Hours</h4>
            <ul className="space-y-4">
              <li className="flex justify-between">
                <span>Monday - Friday</span>
                <span>10:00 AM - 5:00 PM</span>
              </li>
              <li className="flex justify-between">
                <span>Saturday</span>
                <span>10:00 AM - 5:00 PM</span>
              </li>
              <li className="flex justify-between">
                <span>Sunday</span>
                <span>10:00 AM - 5:00 PM</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={`border-t ${borderClasses} mt-12 pt-8 text-center`}>
          <div className="flex flex-col items-center">
            <p className={`text-sm ${textClasses}`}>
              © {new Date().getFullYear()} VG Foods. All rights reserved.
            </p>
            <p className={`text-sm ${textClasses} mt-2`}>
              <a 
                href="https://www.linkedin.com/in/krisanth-m" 
                target="_blank" 
                rel="noopener noreferrer" 
                className={`${hoverClasses} transition-colors`}
              >
                Krisanth M
              </a>
              {' & '}
              <a 
                href="https://www.linkedin.com/in/darshanuthayakumar" 
                target="_blank" 
                rel="noopener noreferrer" 
                className={`${hoverClasses} transition-colors`}
              >
                Darshan U
              </a>
            </p>
            <div className="flex space-x-6 mt-4">
              <a href="/privacy-policy" className={`text-sm ${textClasses} ${hoverClasses} transition-colors`}>
                Privacy Policy
              </a>
              <a href="/terms-of-service" className={`text-sm ${textClasses} ${hoverClasses} transition-colors`}>
                Terms of Service
              </a>
              <a href="/cookie-policy" className={`text-sm ${textClasses} ${hoverClasses} transition-colors`}>
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;