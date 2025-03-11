import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Added useNavigate
import Sidebar from '../../sections/Sidebar';
import { ArrowLeft } from 'lucide-react'; // Added ArrowLeft

const PartyOrder: React.FC = () => {
  const navigate = useNavigate(); // For back button
  const handleScrollToTop = () => {
    window.scrollTo(0, 0);
  };

  return (
    <>
      <Sidebar />
      <section className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center py-10 px-4">
        {/* Back Button (Mobile Only) */}
        <button
          onClick={() => navigate(-1)}
          className="md:hidden flex items-center text-gray-900 dark:text-white mb-4 self-start"
        >
          <ArrowLeft className="w-6 h-6 mr-2" />
          Back
        </button>
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mt-8">
            Planning a Party? Let Us Deliver Your Feast!
          </h1>
        </header>

        {/* How It Works */}
        <section className="mb-8 w-full max-w-3xl">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">How It Works</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Order your favorite dishes for your party and have them delivered to your venue.
          </p>
        </section>

        {/* Pre-Order Notice */}
        <section className="mb-8 w-full max-w-3xl">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Pre-Order Notice</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Please inform us of your dish selections at least 10 days in advance for a seamless delivery.
          </p>
        </section>

        {/* Delivery Area */}
        <section className="mb-8 w-full max-w-3xl">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Delivery Area</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            We deliver within a 10-mile radius from our restaurant.
          </p>
        </section>

        {/* Order Process */}
        <section className="mb-8 w-full max-w-3xl">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Order Process</h2>
          <ul className="list-disc pl-6 text-lg text-gray-600 dark:text-gray-300">
            <li>Select your dishes.</li>
            <li>Place the order at least 10 days ahead.</li>
            <li>We’ll ensure timely delivery on the event day.</li>
          </ul>
        </section>

        {/* Payment Options */}
        <section className="mb-8 w-full max-w-3xl">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Payment Options</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            We accept card payments, bank transfers, and other secure payment methods.
          </p>
        </section>

        {/* Delivery Time */}
        <section className="mb-8 w-full max-w-3xl">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Delivery Time</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Your party order will be delivered on time, ensuring your event goes smoothly.
          </p>
        </section>

        {/* Customer Support */}
        <section className="mb-8 w-full max-w-3xl">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Customer Support</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Need assistance with your party order? Call us at [Restaurant Phone Number].
          </p>
        </section>

        {/* Ready to Order */}
        <section className="text-center w-full max-w-3xl">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Ready to Order?</h2>
          <div className="flex justify-center space-x-4">
            <Link to="/services/partyorder/placeorder" onClick={handleScrollToTop}>
              <button className="px-6 py-2 text-white bg-orange-500 hover:bg-orange-600 rounded-full font-semibold transition">
                Place Your Party Order Now!
              </button>
            </Link>
            <Link to="/services/partyorder/eventcontact" onClick={handleScrollToTop}>
              <button className="px-6 py-2 text-white bg-gray-600 hover:bg-gray-700 rounded-full font-semibold transition">
                Contact Us to Plan Your Event
              </button>
            </Link>
          </div>
        </section>

        {/* Special Discounts */}
        <section className="mt-8 text-center w-full max-w-3xl">
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Enjoy special discounts for large party orders! Call or email for more details.
          </p>
        </section>
      </section>
    </>
  );
};

export default PartyOrder;