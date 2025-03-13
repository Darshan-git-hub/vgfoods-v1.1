import { useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

interface SalesData {
  dineIn: { orders: number };
  takeaway: { orders: number };
  partyOrders: { orders: number };
  menuOrders: { orders: number };
}

interface SalesChartProps {
  salesData: Record<string, SalesData>;
  isDarkMode: boolean;
}

export function SalesChart({ salesData, isDarkMode }: SalesChartProps) {
  const [timeFilter, setTimeFilter] = useState("daily");

  const currentData = salesData[timeFilter] || {
    dineIn: { orders: 0 },
    takeaway: { orders: 0 },
    partyOrders: { orders: 0 },
    menuOrders: { orders: 0 },
  };

  const pieChartData = {
    labels: ["Dine In", "Takeaway", "Party Orders", "Menu Orders"],
    datasets: [
      {
        data: [
          currentData.dineIn.orders,
          currentData.takeaway.orders,
          currentData.partyOrders.orders,
          currentData.menuOrders.orders,
        ],
        backgroundColor: ["#818cf8", "#fb923c", "#c084fc", "#34d399"], // Kept distinct colors for clarity
        borderColor: isDarkMode ? "#1f2937" : "#ffffff", // Gray-800 or white
        borderWidth: 2,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { 
          color: isDarkMode ? "#d1d5db" : "#4b5563", // Gray-300 or Gray-600
          font: { size: 14 },
        },
        position: "bottom" as const, // Consistent with Contact’s clean layout
      },
      tooltip: {
        backgroundColor: isDarkMode ? "#1f2937" : "#ffffff",
        titleColor: isDarkMode ? "#e5e7eb" : "#111827",
        bodyColor: isDarkMode ? "#e5e7eb" : "#111827",
      },
    },
  };

  const filters = ["daily", "weekly", "monthly", "yearly", "alltime"];

  return (
    <div className={`max-w-7xl mx-auto ${isDarkMode ? "bg-gray-800" : "bg-white"} rounded-lg shadow-sm p-4 sm:p-6`}>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h3 className={`text-lg font-medium ${isDarkMode ? "text-white" : "text-gray-900"} mb-2 sm:mb-0`}>
          Sales Distribution
        </h3>
        <div className="flex flex-wrap gap-2 justify-center">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setTimeFilter(filter)}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                timeFilter === filter
                  ? "bg-orange-600 text-white shadow-md"
                  : `${isDarkMode ? "bg-gray-700 text-gray-300 hover:bg-gray-600" : "bg-gray-200 text-gray-600 hover:bg-gray-300"}`
              }`}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>
      </div>
      <div className="w-full h-[250px] sm:h-[300px] flex items-center justify-center">
        <Pie data={pieChartData} options={options} />
      </div>
    </div>
  );
}