import React from 'react';
import { Clock, MapPin, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Utensils, ShoppingBag, Users, MessageCircle } from 'lucide-react';
import Sidebar from './Sidebar';

const Button = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate('/menu')}
      className="flex justify-center gap-2 items-center mt-8 mx-auto shadow-xl text-lg text-black bg-yellow-50 backdrop-blur-md lg:font-semibold isolation-auto border-yellow-50 before:absolute before:w-full before:transition-all before:duration-700 before:hover:w-full before:-left-full before:hover:left-0 before:rounded-full before:bg-orange-500 hover:text-black before:-z-10 before:aspect-square before:hover:scale-150 before:hover:duration-700 relative z-10 px-4 py-2 overflow-hidden border-2 rounded-full group"
    >
      View Menu
      <svg
        className="w-8 h-8 justify-end group-hover:rotate-90 group-hover:bg-gray-50 text-black ease-linear duration-300 rounded-full border border-gray-700 group-hover:border-none p-2 rotate-45"
        viewBox="0 0 16 19"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M7 18C7 18.5523 7.44772 19 8 19C8.55228 19 9 18.5523 9 18H7ZM8.70711 0.292893C8.31658 -0.0976311 7.68342 -0.0976311 7.29289 0.292893L0.928932 6.65685C0.538408 7.04738 0.538408 7.68054 0.928932 8.07107C1.31946 8.46159 1.95262 8.46159 2.34315 8.07107L8 2.41421L13.6569 8.07107C14.0474 8.46159 14.6805 8.46159 15.0711 8.07107C15.4616 7.68054 15.4616 7.04738 15.0711 6.65685L8.70711 0.292893ZM9 18L9 1H7L7 18H9Z"
          className="fill-gray-800 group-hover:fill-gray-800"
        />
      </svg>
    </button>
  );
};

const OrderCard = ({ 
  title, 
  image, 
  icon: Icon, 
  description 
}: { 
  title: string; 
  image: string; 
  icon: React.ElementType; 
  description: string;
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-all hover:shadow-xl sm:transform sm:hover:scale-105">
      <div className="flex flex-col sm:block h-full">
        <div className="h-24 sm:h-48 overflow-hidden">
          <img 
            src={image} 
            alt={title} 
            className="w-full h-full object-cover transition-transform duration-500 sm:hover:scale-110"
          />
        </div>
        <div className="p-3 sm:p-4 flex flex-col justify-between flex-grow">
          <div>
            <div className="flex items-center mb-1 sm:mb-2">
              <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600 mr-2" />
              <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">{title}</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm line-clamp-2">{description}</p>
          </div>
          <button className="mt-2 sm:mt-3 w-full bg-orange-600 hover:bg-orange-700 text-white text-xs sm:text-sm font-medium py-1 sm:py-2 px-3 sm:px-4 rounded-full transition-colors duration-300">
            Order Now
          </button>
        </div>
      </div>
    </div>
  );
};

const Home = () => {
  const orderOptions = [
    {
      title: "Dine In",
      image: "https://rlghpeuxrtidtcolzmkp.supabase.co/storage/v1/object/sign/website%20images/Newdinein.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ3ZWJzaXRlIGltYWdlcy9OZXdkaW5laW4uanBnIiwiaWF0IjoxNzQxNDk3NjE5LCJleHAiOjIwNTY4NTc2MTl9.UcLKhmbHSTTMyOOzfz8nbTw0chdwG2L7aXvgMeUA5Cc",
      icon: Utensils,
      description: "Enjoy our delicious meals in our cozy restaurant atmosphere."
    },
    {
      title: "Takeaway",
      image: "https://rlghpeuxrtidtcolzmkp.supabase.co/storage/v1/object/sign/website%20images/Newtakeaway.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ3ZWJzaXRlIGltYWdlcy9OZXd0YWtlYXdheS5qcGciLCJpYXQiOjE3NDE0OTc1OTUsImV4cCI6MjA1Njg1NzU5NX0.VKK0xQHo480UWtAwyLrO1wdNkRwvm92N2pOQMqqqzKs",
      icon: ShoppingBag,
      description: "Order ahead and pick up your dishes at your convenience."
    },
    {
      title: "Party Orders",
      image: "https://rlghpeuxrtidtcolzmkp.supabase.co/storage/v1/object/sign/website%20images/partyorder.avif?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ3ZWJzaXRlIGltYWdlcy9wYXJ0eW9yZGVyLmF2aWYiLCJpYXQiOjE3NDA3MjQ1MDgsImV4cCI6MjA1NjA4NDUwOH0.7CieNgKnuES08AZwNktgQ68PXiudJXL_DoJqR68kyXU",
      icon: Users,
      description: "Special catering services for your events and celebrations."
    },
    {
      title: "WhatsApp Order",
      image: "https://rlghpeuxrtidtcolzmkp.supabase.co/storage/v1/object/sign/website%20images/whatsapp%20order%20white.avif?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ3ZWJzaXRlIGltYWdlcy93aGF0c2FwcCBvcmRlciB3aGl0ZS5hdmlmIiwiaWF0IjoxNzQwNzI0NzgyLCJleHAiOjIwNTYwODQ3ODJ9.z_vOLathqoGlS9VrwhWQZWy0Uo9oLoPBzFErRJxjNTU",
      icon: MessageCircle,
      description: "Quick and easy ordering through WhatsApp messaging."
    }
  ];

  return (
    <>
      <Sidebar />
      <section id="home" className="py-16 sm:py-28 bg-gray-100 dark:bg-gray-900 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Mobile Header */}
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:text-3xl md:text-5xl">
              Welcome to <span className="text-orange-600">VG Foods</span>
            </h1>
            <p className="text-base text-gray-600 dark:text-gray-400 mb-6 sm:text-lg">
              Vegan, Veg & Non-Veg
            </p>
            <Button />
          </div>

          {/* Order Options Section */}
          <div className="mt-8 sm:mt-12 mb-12 sm:mb-16">
            <div className="text-center mb-6 sm:mb-12">
              <h1 className="text-lg font-extrabold text-gray-900 dark:text-white sm:text-xl lg:text-3xl">
                How would you like to order?
              </h1>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto">
                Choose your preferred way to enjoy our delicious food
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {orderOptions.map((option, index) => (
                <OrderCard 
                  key={index}
                  title={option.title}
                  image={option.image}
                  icon={option.icon}
                  description={option.description}
                />
              ))}
            </div>
          </div>

          {/* Get in Touch Section */}
          <div className="mt-12 sm:mt-20">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-6 sm:text-3xl sm:mb-8">
              Get in Touch
            </h2>
            <div className="grid grid-cols-3 gap-2 sm:gap-6 sm:grid-cols-3 max-w-4xl mx-auto">
              <div className="bg-white dark:bg-gray-800 p-3 sm:p-6 rounded-xl shadow-md flex flex-col items-center">
                <Phone className="w-5 h-5 sm:w-8 sm:h-8 text-orange-600 mb-2 sm:mb-4" />
                <h3 className="text-sm sm:text-lg font-semibold text-gray-900 dark:text-white mb-1 sm:mb-2 text-center">Contact Us</h3>
                <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-base text-center">07521 262119</p>
                <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-base text-center">07424 762470</p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-3 sm:p-6 rounded-xl shadow-md flex flex-col items-center">
                <MapPin className="w-5 h-5 sm:w-8 sm:h-8 text-orange-600 mb-2 sm:mb-4" />
                <h3 className="text-sm sm:text-lg font-semibold text-gray-900 dark:text-white mb-1 sm:mb-2 text-center">Location</h3>
                <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-base text-center">
                  855 Bristol Rd South, Northfield, Birmingham B31 2PA
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-3 sm:p-6 rounded-xl shadow-md flex flex-col items-center">
                <Clock className="w-5 h-5 sm:w-8 sm:h-8 text-orange-600 mb-2 sm:mb-4" />
                <h3 className="text-sm sm:text-lg font-semibold text-gray-900 dark:text-white mb-1 sm:mb-2 text-center">Opening Hours</h3>
                <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-base text-center">10 AM to 5 PM</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;