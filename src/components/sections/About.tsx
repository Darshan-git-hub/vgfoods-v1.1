import { motion } from "framer-motion";
import { Utensils, ArrowLeft } from "lucide-react";
import Sidebar from './Sidebar';
import { useNavigate } from "react-router-dom";

// BackButton Component (Mobile Only) matching Menu.tsx
const BackButton: React.FC = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)} // Go back to previous page
      className="md:hidden flex items-center text-gray-900 dark:text-white mb-4" // Hidden on md+
    >
      <ArrowLeft className="w-6 h-6 mr-2" />
      Back
    </button>
  );
};

const About: React.FC = () => {
  return (
    <>
      {/* Show sidebar on mobile only (hidden on md+) */}
      <Sidebar className="md:hidden" />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-4 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button (Mobile Only) */}
          <BackButton /> {/* BackButton visible only on mobile (hidden on md+) */}
          
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8 lg:mb-16"
          >
            <Utensils className="w-10 h-10 lg:w-12 lg:h-12 text-orange-600 mx-auto mb-2 lg:mb-3" />
            <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4 lg:mb-6">
              About Us
            </h1>
            <p className="text-base sm:text-lg lg:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              At VG Foods, we take pride in offering fresh and pure home-cooked
              food that caters to all dietary preferences. Our commitment to
              quality ingredients and authentic recipes ensures that every dish we
              serve is a delightful experience.
            </p>
          </motion.div>

          {/* Details Section */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8 mb-8 lg:mb-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-4 lg:space-y-6 text-center lg:text-left"
            >
              <h2 className="font-display text-xl sm:text-2xl lg:text-2xl font-bold text-gray-900 dark:text-white">
                Our Commitment
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base lg:text-base">
                Whether you're craving traditional vegetarian delicacies, vegan
                specialties, or non-vegetarian dishes, our skilled chefs prepare
                each meal with passion and attention to detail, ensuring the best
                dining experience possible.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative h-[200px] sm:h-[300px] lg:h-[400px]"
            >
              <img
                src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"
                alt="Home-cooked food"
                className="w-full h-full object-cover rounded-lg shadow-lg"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "https://via.placeholder.com/400"; // Fallback image
                }}
              />
            </motion.div>
          </div>

          {/* Mission Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-orange-50 dark:bg-gray-800 rounded-lg p-4 sm:p-6 lg:p-8 mb-8 lg:mb-16 shadow-lg text-center"
          >
            <h2 className="font-display text-xl sm:text-2xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-4 lg:mb-8">
              Our Mission
            </h2>
            <p className="text-base sm:text-lg lg:text-lg text-center text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              To provide delicious, home-cooked meals that cater to every taste and
              dietary preference, bringing the comfort of home to your table.
            </p>
          </motion.div>

          {/* Gallery Section */}
          <div className="space-y-6">
            <h2 className="font-display text-xl sm:text-2xl lg:text-2xl font-bold text-center text-gray-900 dark:text-white">
              Our Space
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-3 lg:gap-6">
              {[
                "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
                "https://images.unsplash.com/photo-1559339352-11d035aa65de?ixlib=rb-4.0.3&auto=format&fit=crop&w=1374&q=80",
                "https://images.unsplash.com/photo-1592861956120-e524fc739696?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
              ].map((image, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  className="relative h-[150px] sm:h-[200px] lg:h-[300px]"
                >
                  <img
                    src={image}
                    alt={`Restaurant gallery ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg shadow-lg"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "https://via.placeholder.com/300"; // Fallback image
                    }}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;