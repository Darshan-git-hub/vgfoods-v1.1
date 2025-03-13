import { useState } from "react";
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
        borderColor: "#ea580c", // Orange-600 for consistency with Contact
        backgroundColor: "rgba(234, 88, 12, 0.1)", // Orange-600 with transparency
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
      tooltip: {
        backgroundColor: isDarkMode ? "#1f2937" : "#ffffff", // Gray-800 or white
        titleColor: isDarkMode ? "#e5e7eb" : "#111827",
        bodyColor: isDarkMode ? "#e5e7eb" : "#111827",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)" },
        ticks: {
          callback: (tickValue: string | number) => `$${Number(tickValue).toLocaleString()}`,
          color: isDarkMode ? "#d1d5db" : "#4b5563", // Gray-300 or Gray-600
        },
      },
      x: {
        grid: { display: false },
        ticks: { color: isDarkMode ? "#d1d5db" : "#4b5563" }, // Gray-300 or Gray-600
      },
    },
  };

  const filters = ["daily", "weekly", "monthly", "yearly", "alltime"];

  return (
    <div className={`max-w-7xl mx-auto ${isDarkMode ? "bg-gray-800" : "bg-white"} rounded-lg shadow-sm p-4 sm:p-6`}>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h3 className={`text-lg font-medium ${isDarkMode ? "text-white" : "text-gray-900"} mb-2 sm:mb-0`}>
          Revenue Trend
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
      <div className="w-full h-[250px] sm:h-[300px]">
        <Line options={options} data={lineChartData} />
      </div>
    </div>
  );
}