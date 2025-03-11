import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Sidebar from '../../sections/Sidebar';

const EventContact: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <Sidebar />
      <section className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center py-8 px-4">
        {/* Back Button (Mobile Only) */}
        <button
          onClick={() => navigate(-1)}
          className="md:hidden flex items-center text-gray-900 dark:text-white mb-6 px-4 py-2 rounded-md shadow-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors self-start"
        >
          {/* bg-white dark:bg-gray-800 */}
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </button>
        <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <header className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Contact Us to Plan Your Event
            </h1>
          </header>
          <section className="text-center">
            <p className="text-base text-gray-600 dark:text-gray-300 mb-6">
              Choose how you'd like to reach us:
            </p>

            {/* Contact list */}
            <ul className="flex flex-col space-y-4">
              <li className="flex justify-start">
                <a
                  href="tel:+919751903129"
                  className="text-lg text-gray-600 dark:text-gray-300 hover:text-orange-600 flex items-center transition-colors w-full py-2"
                >
                  <span className="mr-3">📞</span> Call Us: <strong className="ml-2">+91 9751903129</strong>
                </a>
              </li>
              <li className="flex justify-start">
                <a
                  href="https://wa.me/9751903129?text=Hello!%20I%20would%20like%20to%20plan%20an%20event"
                  className="text-lg text-gray-600 dark:text-gray-300 hover:text-orange-600 flex items-center transition-colors w-full py-2"
                >
                  <span className="mr-3">💬</span> WhatsApp Us
                </a>
              </li>
              <li className="flex justify-start">
                <a
                  href="mailto:krisanthkris@gmail.com?subject=Event%20Planning%20Inquiry"
                  className="text-lg text-gray-600 dark:text-gray-300 hover:text-orange-600 flex items-center transition-colors w-full py-2"
                >
                  <span className="mr-3">📧</span> Email Us: <strong className="ml-2">krisanthkris@gmail.com</strong>
                </a>
              </li>
            </ul>
          </section>
        </div>
      </section>
    </>
  );
};

export default EventContact;