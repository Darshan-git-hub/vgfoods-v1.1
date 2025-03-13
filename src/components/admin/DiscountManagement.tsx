import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "../../lib/supabaseClient";
import toast from "react-hot-toast";

interface Discount {
  id: number;
  code: string;
  discount_percentage: number | null;
  expiry_date: string;
  fixed_discount: number | null;
  status: "active" | "expired";
}

const DiscountManagement = () => {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("expiryDate");
  const [filterStatus, setFilterStatus] = useState("all");
  const [newDiscount, setNewDiscount] = useState({
    code: "",
    discountPercentage: null as number | null,
    expiryDate: "",
    fixedDiscount: null as number | null,
  });
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const fetchDiscounts = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase.from("discounts").select("*");
        if (error) {
          if (error.code === "42P01") {
            toast.error("The discounts table does not exist. Please create it in your Supabase database.");
          } else {
            toast.error("Failed to fetch discounts: " + error.message);
          }
          throw error;
        }
        setDiscounts(data as Discount[]);
      } catch (error: any) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDiscounts();
  }, []);

  const handleAddDiscount = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validate that exactly one of discountPercentage or fixedDiscount is provided
    if (newDiscount.discountPercentage === null && newDiscount.fixedDiscount === null) {
      toast.error("Please provide either a Discount Percentage or a Fixed Discount.");
      return;
    }
    if (newDiscount.discountPercentage !== null && newDiscount.fixedDiscount !== null) {
      toast.error("Please provide only one of Discount Percentage or Fixed Discount, not both.");
      return;
    }
    if (!newDiscount.code || !newDiscount.expiryDate) {
      toast.error("Code and Expiry Date are required.");
      return;
    }

    try {
      const { error } = await supabase
        .from("discounts")
        .insert({
          code: newDiscount.code,
          discount_percentage: newDiscount.discountPercentage,
          expiry_date: newDiscount.expiryDate,
          fixed_discount: newDiscount.fixedDiscount,
          status: "active",
        });
      if (error) throw error;
      const { data: newData, error: fetchError } = await supabase
        .from("discounts")
        .select("*")
        .eq("code", newDiscount.code)
        .single();
      if (fetchError) throw fetchError;
      setDiscounts([...discounts, newData]);
      setNewDiscount({ code: "", discountPercentage: null, expiryDate: "", fixedDiscount: null });
      setIsAdding(false);
      toast.success("Discount added successfully!");
    } catch (error: any) {
      toast.error("Failed to add discount: " + error.message);
    }
  };

  const handleDeleteDiscount = async (id: number) => {
    try {
      const { error } = await supabase.from("discounts").delete().eq("id", id);
      if (error) throw error;
      setDiscounts(discounts.filter((discount) => discount.id !== id));
      toast.success("Discount deleted successfully!");
    } catch (error: any) {
      toast.error("Failed to delete discount: " + error.message);
    }
  };

  const handleToggleStatus = async (id: number, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "expired" : "active";
    try {
      const { error } = await supabase
        .from("discounts")
        .update({ status: newStatus })
        .eq("id", id);
      if (error) throw error;
      setDiscounts(
        discounts.map((discount) =>
          discount.id === id ? { ...discount, status: newStatus } : discount
        )
      );
      toast.success(`Discount ${newStatus === "active" ? "activated" : "expired"} successfully!`);
    } catch (error: any) {
      toast.error("Failed to update status: " + error.message);
    }
  };

  const filteredAndSortedDiscounts = discounts
    .filter((discount) =>
      discount.code.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterStatus === "all" || discount.status === filterStatus)
    )
    .sort((a, b) => {
      if (sortBy === "expiryDate") {
        return new Date(a.expiry_date).getTime() - new Date(b.expiry_date).getTime();
      }
      return 0;
    });

  if (loading) {
    return <div className="text-center p-5 text-gray-400">Loading discounts...</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="max-w-7xl mx-auto p-4"
    >
      <h1 className="font-display text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6 text-center sm:text-left">
        Discounts & Coupons Management
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-6 text-center sm:text-left">
        Manage and create discount codes
      </p>

      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
        <input
          type="text"
          placeholder="Search here"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-200 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500 w-full sm:w-1/3"
        />
        <button
          onClick={() => setIsAdding(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
        >
          + Add Discount
        </button>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-200 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <option value="expiryDate">Sort - Expiry Date</option>
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-200 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <option value="all">Filter by Status - All</option>
          <option value="active">Active</option>
          <option value="expired">Expired</option>
        </select>
      </div>

      {isAdding && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-gray-800 p-6 rounded-lg shadow-lg mb-6"
        >
          <h2 className="text-xl font-bold text-white mb-4">Add New Discount</h2>
          <form onSubmit={handleAddDiscount} className="space-y-4">
            <input
              type="text"
              placeholder="Discount Code"
              value={newDiscount.code}
              onChange={(e) => setNewDiscount({ ...newDiscount, code: e.target.value })}
              className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
            <input
              type="number"
              placeholder="Discount Percentage (%)"
              value={newDiscount.discountPercentage || ""}
              onChange={(e) =>
                setNewDiscount({
                  ...newDiscount,
                  discountPercentage: e.target.value ? parseFloat(e.target.value) : null,
                  fixedDiscount: null, // Reset fixedDiscount when percentage is set
                })
              }
              className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <input
              type="number"
              placeholder="Fixed Discount (Amount)"
              value={newDiscount.fixedDiscount || ""}
              onChange={(e) =>
                setNewDiscount({
                  ...newDiscount,
                  fixedDiscount: e.target.value ? parseFloat(e.target.value) : null,
                  discountPercentage: null, // Reset discountPercentage when fixed is set
                })
              }
              className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <input
              type="date"
              value={newDiscount.expiryDate}
              onChange={(e) => setNewDiscount({ ...newDiscount, expiryDate: e.target.value })}
              className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
            <div className="flex space-x-2">
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      )}

      <div className="overflow-x-auto rounded-lg shadow-lg border border-gray-700">
        <table className="min-w-full bg-gray-800 text-white">
          <thead className="bg-blue-900">
            <tr>
              {["S.No", "Discount ID", "Code", "Discount Percentage", "Expiry Date", "Fixed Discount", "Status", "Actions"].map((header) => (
                <th key={header} className="px-4 py-3 text-left text-sm font-semibold">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedDiscounts.map((discount, index) => (
              <tr key={discount.id} className={index % 2 === 0 ? "bg-gray-900" : "bg-gray-800"}>
                <td className="px-4 py-3 text-sm">{index + 1}</td>
                <td className="px-4 py-3 text-sm">{discount.id}</td>
                <td className="px-4 py-3 text-sm">{discount.code}</td>
                <td className="px-4 py-3 text-sm">
                  {discount.discount_percentage ? `${discount.discount_percentage}%` : "-"}
                </td>
                <td className="px-4 py-3 text-sm">{discount.expiry_date}</td>
                <td className="px-4 py-3 text-sm">{discount.fixed_discount ? `$${discount.fixed_discount}` : "-"}</td>
                <td className="px-4 py-3 text-sm">{discount.status}</td>
                <td className="px-4 py-3 text-sm flex space-x-2">
                  <button
                    onClick={() => handleToggleStatus(discount.id, discount.status)}
                    className="p-1 bg-green-600 rounded-full hover:bg-green-700 transition-all"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDeleteDiscount(discount.id)}
                    className="p-1 bg-red-600 rounded-full hover:bg-red-700 transition-all"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default DiscountManagement;