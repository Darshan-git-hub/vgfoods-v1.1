interface TimeFilterProps {
  value: string;
  onChange: (value: string) => void;
  isDarkMode: boolean;
  options?: string[];
}

export function TimeFilter({ value, onChange, isDarkMode, options = ['Daily', 'Weekly', 'Monthly', 'Yearly', 'All Time'] }: TimeFilterProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-black'}`}
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}