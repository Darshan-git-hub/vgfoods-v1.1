import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabaseClient";
import toast from "react-hot-toast";
import md5 from "md5"; // Ensure this package is installed: npm install md5

interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
}

const Profile = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [fullName, setFullName] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!user) return;

        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error) throw error;

        setProfile(data);
        setFullName(data.full_name || "");
      } catch (error: any) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleUpdateProfile = async () => {
    try {
      if (!user) return;

      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: fullName,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) throw error;

      setProfile((prev) => (prev ? { ...prev, full_name: fullName } : null));
      setEditing(false);
      toast.success("Profile updated successfully");
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/signin");
    } catch (error: any) {
      toast.error("Failed to sign out");
    }
  };

  const getGravatarUrl = (email: string | null | undefined) => {
    if (!email) return "";
    const hash = md5(email.trim().toLowerCase()); // Ensure a valid string is always passed
    return `https://www.gravatar.com/avatar/${hash}?d=identicon`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="relative h-32 bg-orange-600">
            <div className="absolute -bottom-16 left-8">
              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.full_name || "Profile"}
                  className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800"
                />
              ) : (
                <img
                  src={getGravatarUrl(user?.email ?? "")} // Ensures string input
                  alt="Default Gravatar"
                  className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800"
                />
              )}
            </div>
          </div>

          <div className="pt-20 pb-8 px-8">
            {editing ? (
              <div className="space-y-4">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div className="flex space-x-4">
                  <button
                    onClick={handleUpdateProfile}
                    className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => {
                      setEditing(false);
                      setFullName(profile?.full_name || "");
                    }}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {profile?.full_name || "No name set"}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">{user?.email}</p>
                </div>
                <div className="flex space-x-4">
                  <button
                    onClick={() => setEditing(true)}
                    className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                  >
                    Edit Profile
                  </button>
                  <button
                    onClick={handleSignOut}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
