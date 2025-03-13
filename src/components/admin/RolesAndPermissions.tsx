import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext"; // Assuming an auth context

interface User {
  id: string;
  email: string;
  full_name?: string | null;
  role?: string | null; // Tracks whether the user is an admin or not
}

const RolesAndPermissions = () => {
  const { user } = useAuth(); // Get the current logged-in user
  const [users, setUsers] = useState<User[]>([]);
  const [admins, setAdmins] = useState<User[]>([]); // Separate state for admins
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.email === "vgfoodsuk@gmail.com") { // Only fetch users if the admin is vgfoodsuk@gmail.com
      fetchUsers();
    }
  }, [user]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      // Fetch all users from the profiles table
      const { data: usersData, error: usersError } = await supabase
        .from("profiles")
        .select("id, email, full_name, role");
      if (usersError) throw usersError;

      const allUsers = usersData || [];
      setUsers(allUsers);
      // Filter out admins for separate display
      setAdmins(allUsers.filter((u) => u.role === "admin"));
    } catch (error: any) {
      toast.error("Failed to load users: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMakeAdmin = async () => {
    if (!selectedUser) {
      toast.error("Please select a customer or user to make admin");
      return;
    }
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ role: "admin" }) // Set the user's role to "admin"
        .eq("id", selectedUser);
      if (error) throw error;

      const updatedUsers = users.map((user) =>
        user.id === selectedUser ? { ...user, role: "admin" } : user
      );
      setUsers(updatedUsers);
      setAdmins(updatedUsers.filter((u) => u.role === "admin")); // Update admins list
      setSelectedUser(null); // Reset selection after update
      toast.success("User has been made an admin successfully");
    } catch (error: any) {
      toast.error("Failed to make user admin: " + error.message);
    }
  };

  const handleDeleteAdmin = async (userId: string) => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ role: "user" }) // Reset role to "user" (or null if preferred)
        .eq("id", userId);
      if (error) throw error;

      const updatedUsers = users.map((user) =>
        user.id === userId ? { ...user, role: "user" } : user
      );
      setUsers(updatedUsers);
      setAdmins(updatedUsers.filter((u) => u.role === "admin")); // Update admins list
      toast.success("Admin role removed successfully");
    } catch (error: any) {
      toast.error("Failed to remove admin role: " + error.message);
    }
  };

  // Restrict access to only vgfoodsuk@gmail.com
  if (!user || user.email !== "vgfoodsuk@gmail.com") {
    return (
      <div className="text-center p-5 text-gray-400">
        Access denied. Only admin (vgfoodsuk@gmail.com) can manage admin roles.
      </div>
    );
  }

  if (loading) return <div className="text-center p-5 text-gray-400">Loading...</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="p-6 bg-orange-50 dark:bg-gray-800 rounded-lg shadow-lg"
    >
      <h1 className="font-display text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6 text-center sm:text-left">
        Admin Management
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-6 text-center sm:text-left">
        Manage admin roles for customers or logged-in users
      </p>

      {/* Current Admins List */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Current Admins</h2>
        {admins.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">No admins found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {admins.map((admin) => (
              <div
                key={admin.id}
                className="p-4 bg-gray-200 dark:bg-gray-700 rounded-lg shadow-md flex justify-between items-center"
              >
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {admin.full_name || admin.email}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{admin.email}</p>
                </div>
                {admin.email !== "vgfoodsuk@gmail.com" && ( // Prevent self-deletion
                  <button
                    onClick={() => handleDeleteAdmin(admin.id)}
                    className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
                  >
                    Remove Admin
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Assign Admin Role */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Assign Admin Role</h2>
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <select
            value={selectedUser || ""}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="flex-1 p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600"
          >
            <option value="">Select a Customer/User</option>
            {users
              .filter((u) => u.role !== "admin") // Exclude current admins from the dropdown
              .map((user) => (
                <option key={user.id} value={user.id}>
                  {user.full_name || user.email} ({user.email})
                </option>
              ))}
          </select>
          <button
            onClick={handleMakeAdmin}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-all"
          >
            Make Admin
          </button>
        </div>

        {selectedUser && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Selected: {users.find((u) => u.id === selectedUser)?.full_name || users.find((u) => u.id === selectedUser)?.email}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Current Role: {users.find((u) => u.id === selectedUser)?.role || "User"}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default RolesAndPermissions;