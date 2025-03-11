import  { useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface RevenueData {
  labels: string[];
  data: number[];
}

interface RevenueChartProps {
  revenueData: Record<string, RevenueData>;
  isDarkMode: boolean;
}

export function RevenueChart({ revenueData, isDarkMode }: RevenueChartProps) {
  const [timeFilter, setTimeFilter] = useState("daily");

  const currentData = revenueData[timeFilter] || { labels: [], data: [] };

  const lineChartData = {
    labels: currentData.labels,
    datasets: [
      {
        label: `${timeFilter.charAt(0).toUpperCase() + timeFilter.slice(1)} Revenue`,
        data: currentData.data,
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)" },
        ticks: {
          callback: (tickValue: string | number) => `$${Number(tickValue).toLocaleString()}`,
          color: isDarkMode ? "#e5e7eb" : "#111827",
        },
      },
      x: {
        grid: { display: false },
        ticks: { color: isDarkMode ? "#e5e7eb" : "#111827" },
      },
    },
  };

  const filters = ["daily", "weekly", "monthly", "yearly", "alltime"];

  return (
    <div className={`${isDarkMode ? "bg-gray-800" : "bg-white"} rounded-xl shadow-sm p-4 sm:p-6`}>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h3 className={`text-lg font-semibold ${isDarkMode ? "text-gray-100" : "text-gray-900"} mb-2 sm:mb-0`}>
          Revenue Trend
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
      <div className="w-full h-[250px] sm:h-[300px]">
        <Line options={options} data={lineChartData} />
      </div>
    </div>
  );
}