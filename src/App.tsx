import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";
import { SessionContextProvider, useSession } from "@supabase/auth-helpers-react";
import { supabase } from "./lib/supabaseClient";
import Navbar from "./components/Navbar";
import Home from "./components/sections/Home";
import About from "./components/sections/About";
import Services from "./components/sections/Services";
import Menu from "./components/sections/Menu";
import Contact from "./components/sections/Contact";
import Cart from "./components/sections/Cart";
import SignIn from "./components/auth/SignIn";
import SignUp from "./components/auth/SignUp";
import ForgotPassword from "./components/auth/ForgotPassword";
import ResetPassword from "./components/auth/ResetPassword";
import AuthCallback from "./components/auth/AuthCallback";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AdminDashboard from "./components/admin/AdminDashboard";
import UserDashboard from "./components/dashboard/UserDashboard";
import DineIn from "./components/services/dinein/dinein";
import Takeaway from "./components/services/takeaway/takeaway";
import PartyOrder from "./components/services/partyorder/partyorder";
import PlaceOrder from "./components/services/partyorder/placeorder";
import EventContact from "./components/services/partyorder/eventcontact";
import CheckoutForm from "./components/checkout/CheckoutForm";
import TakeawayMenu from "./components/services/takeaway/takeawaymenu";
import CompleteProfile from "./components/auth/CompleteProfile";
import Footer from "./components/Footer";
import PartyOrderMenu from "./components/services/partyorder/PartyOrderMenu";

const App = () => {
  return (
    <SessionContextProvider supabaseClient={supabase}>
      <Router>
        <ThemeProvider>
          <AuthProvider>
            <CartProvider>
              <Toaster position="top-right" />
              <div className="flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-grow pt-16">
                  <Routes>
                    {/* Authentication Routes */}
                    <Route path="/signin" element={<SignIn />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route path="/auth/callback" element={<AuthCallback />} />
                    <Route path="/complete-profile" element={<CompleteProfile />} />

                    {/* Public Pages */}
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/services" element={<Services />} />
                    <Route path="/menu" element={<Menu />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/home" element={<Home />} />

                    {/* Services Pages */}
                    <Route path="/dine-in" element={<DineIn />} />
                    <Route path="/takeaway" element={<Takeaway />} />
                    <Route path="/party-order" element={<PartyOrder />} />

                    {/* Party Order Routes */}
                    <Route path="/services/partyorder/placeorder" element={<PlaceOrderWrapper />} />
                    <Route path="/services/party-order/menu" element={<PartyOrderMenu />} />
                    <Route path="/services/partyorder/eventcontact" element={<EventContact />} />

                    {/* Takeaway-Specific Routes */}
                    <Route path="/services/takeaway/menu" element={<TakeawayMenu />} />

                    {/* Cart and Checkout Routes */}
                    <Route
                      path="/cart"
                      element={
                        <ProtectedRoute>
                          <Cart />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/checkout/CheckoutForm"
                      element={
                        <ProtectedRoute>
                          <CheckoutForm />
                        </ProtectedRoute>
                      }
                    />

                    {/* Protected Routes */}
                    <Route
                      path="/admin/*"
                      element={
                        <ProtectedRoute>
                          <AdminDashboard />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/userdashboard"
                      element={
                        <ProtectedRoute>
                          <UserDashboard />
                        </ProtectedRoute>
                      }
                    />
                  </Routes>
                </main>
                <Footer />
              </div>
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </Router>
    </SessionContextProvider>
  );
};

const PlaceOrderWrapper = () => {
  const session = useSession();
  const userId = session?.user?.id || null;
  console.log("PlaceOrderWrapper session:", session);

  if (!userId) {
    return <p className="text-center text-red-500">You must be signed in to place an order.</p>;
  }

  return <PlaceOrder userId={userId} />;
};

export default App;