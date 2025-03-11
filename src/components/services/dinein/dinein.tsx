import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../../lib/supabaseClient';
import { useUser } from '@supabase/auth-helpers-react';
import Sidebar from '../../sections/Sidebar';
import { ArrowLeft } from 'lucide-react'; // Added ArrowLeft

const DineIn: React.FC = () => {
  const navigate = useNavigate();
  const user = useUser();
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    email: '',
    date: '',
    time: '',
    guests: '',
    specialRequests: '',
  });

  const fetchUserId = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', user.email)
        .single();

      if (error) throw error;

      setUserId(data.id);
    } catch (error) {
      console.error('Error fetching user ID:', error);
      alert(`Error fetching user ID: ${(error as Error).message}`);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchUserId();
  }, [fetchUserId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === 'guests') {
      const numericValue = value.replace(/[^0-9]/g, '');
      setFormData((prev) => ({ ...prev, [name]: numericValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId) {
      alert('Error: Could not get user ID. Please log in again.');
      return;
    }

    const guests = parseInt(formData.guests, 10);
    if (isNaN(guests) || guests <= 0) {
      alert('Please enter a valid number of guests greater than 0.');
      return;
    }

    try {
      const { error } = await supabase.from('reservations').insert([
        {
          user_id: userId,
          name: formData.name,
          contact: formData.contact,
          email: formData.email || null,
          date: formData.date,
          time: formData.time,
          guests,
          special_requests: formData.specialRequests || null,
          status: 'pending',
        },
      ]);

      if (error) throw error;

      alert('Reservation submitted successfully!');
      setFormData({
        name: '',
        contact: '',
        email: '',
        date: '',
        time: '',
        guests: '',
        specialRequests: '',
      });
    } catch (error) {
      console.error('Supabase Insert Error:', error);
      alert(`Error: ${(error as Error).message}`);
    }
  };

  const handleExploreMenu = () => navigate('/menu');

  if (loading) {
    return (
      <>
        <Sidebar />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-orange-100 dark:from-gray-800 dark:via-gray-900 dark:to-gray-950">
          {/* Back Button (Mobile Only) */}
          <button
            onClick={() => navigate(-1)}
            className="md:hidden flex items-center text-gray-900 dark:text-white mb-4 absolute top-4 left-4"
          >
            <ArrowLeft className="w-6 h-6 mr-2" />
            Back
          </button>
          <p className="text-center text-lg text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Sidebar />
      <section className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 dark:from-gray-800 dark:via-gray-900 dark:to-gray-950 flex flex-col items-center py-10 px-4">
        {/* Back Button (Mobile Only) */}
        <button
          onClick={() => navigate(-1)}
          className="md:hidden flex items-center text-gray-900 dark:text-white mb-4 self-start"
        >
          <ArrowLeft className="w-6 h-6 mr-2" />
          Back
        </button>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 mt-8">Dine In</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 text-center">
          Enjoy your meal fresh and hot in our cozy restaurant.
        </p>

        <div className="max-w-4xl w-full bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
          <div className="flex flex-col md:flex-row">
            <div className="relative w-full md:w-1/2 p-6 bg-orange-500 text-white flex items-center justify-center">
              <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{ backgroundImage: "url('https://source.unsplash.com/featured/?restaurant,dining')" }}></div>
              <div className="relative z-10 text-center space-y-4">
                <h1 className="text-2xl font-bold">Reserve Your Table</h1>
                <p className="text-sm">Enjoy a luxurious dining experience. Book your table now and indulge in the finest cuisine!</p>
                <button 
                  onClick={handleExploreMenu} 
                  className="px-4 py-2 bg-white text-orange-600 font-medium rounded-md shadow hover:bg-gray-100 transition-colors"
                >
                  Explore Menu
                </button>
              </div>
            </div>
            <div className="w-full md:w-1/2 p-6 bg-gray-50 dark:bg-gray-900 flex flex-col justify-center">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Book Your Table</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                {['Full Name', 'Contact Number', 'Email', 'Date', 'Time', 'Number of Guests', 'Special Requests'].map((label) => (
                  <div key={label} className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
                    {label === 'Number of Guests' ? (
                      <input
                        type="number"
                        name="guests"
                        value={formData.guests}
                        onChange={handleChange}
                        required
                        min="1"
                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                        placeholder="Enter number of guests"
                      />
                    ) : label === 'Special Requests' ? (
                      <textarea
                        name="specialRequests"
                        value={formData.specialRequests}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 h-20 resize-none"
                      />
                    ) : (
                      <input
                        type={label.toLowerCase().includes('date') ? 'date' : label.toLowerCase().includes('time') ? 'time' : 'text'}
                        name={label.toLowerCase().replace(' ', '')}
                        value={formData[label.toLowerCase().replace(' ', '') as keyof typeof formData]}
                        onChange={handleChange}
                        required={label !== 'Email' && label !== 'Special Requests'}
                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                      />
                    )}
                  </div>
                ))}
                <button 
                  type="submit" 
                  className="w-full px-4 py-2 bg-orange-500 text-white font-medium rounded-md hover:bg-orange-600 transition-colors shadow-md"
                >
                  Reserve Now
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default DineIn;