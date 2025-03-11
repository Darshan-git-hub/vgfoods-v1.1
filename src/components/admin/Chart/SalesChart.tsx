import { useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

interface SalesData {
  dineIn: { orders: number };
  takeaway: { orders: number };
  partyOrders: { orders: number };
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
  };

  const pieChartData = {
    labels: ["Dine In", "Takeaway", "Party Orders"],
    datasets: [
      {
        data: [currentData.dineIn.orders, currentData.takeaway.orders, currentData.partyOrders.orders],
        backgroundColor: ["#818cf8", "#fb923c", "#c084fc"],
        borderColor: [isDarkMode ? "#1f2937" : "#ffffff", isDarkMode ? "#1f2937" : "#ffffff", isDarkMode ? "#1f2937" : "#ffffff"],
        borderWidth: 2,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: isDarkMode ? "#e5e7eb" : "#111827" },
      },
    },
  };

  const filters = ["daily", "weekly", "monthly", "yearly", "alltime"];

  return (
    <div className={`${isDarkMode ? "bg-gray-800" : "bg-white"} rounded-xl shadow-sm p-4 sm:p-6`}>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h3 className={`text-lg font-semibold ${isDarkMode ? "text-gray-100" : "text-gray-900"} mb-2 sm:mb-0`}>
          Sales Distribution
        </h3>
        <div className="flex flex-wrap gap-2 justify-center">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setTimeFilter(filter)}
              className={`px-3 py-1 text-xs sm:text-sm rounded-full transition-all ${
                timeFilter === filter
                  ? "bg-orange-600 text-white shadow-md"
                  : "bg-gray-700 text-gray-200 hover:bg-gray-600"
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