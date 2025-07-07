import React, { useState, useRef, useEffect } from "react";
import { Calendar, ChevronDown } from "lucide-react";
import { usePeriod, Period } from "../contexts/PeriodContext";
import { useLanguage } from "../contexts/LanguageContext";

interface PeriodSelectorProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const PeriodSelector: React.FC<PeriodSelectorProps> = ({ className = "", size = "md" }) => {
  const { period, setPeriod, getPeriodLabel } = usePeriod();
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const periods: Period[] = ["last7days", "last30days", "thisweek", "thismonth", "lastmonth", "thisyear", "lastyear", "alltime"];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handlePeriodChange = (selectedPeriod: Period) => {
    setPeriod(selectedPeriod);
    setIsOpen(false);
  };

  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-2 text-sm",
    lg: "px-4 py-2 text-base",
  };

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center space-x-2 bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors focus:ring-2 focus:ring-blue-700 focus:border-transparent ${sizeClasses[size]}`}
      >
        <Calendar className={`text-gray-500 dark:text-zinc-400 ${iconSizes[size]}`} />
        <span className="text-gray-900 dark:text-white font-medium">{t(`periods.${period}`) || getPeriodLabel(period)}</span>
        <ChevronDown className={`text-gray-500 dark:text-zinc-400 ${iconSizes[size]}`} />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full mt-2 w-48 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg shadow-lg py-1 z-50">
          {periods.map((periodOption) => (
            <button
              key={periodOption}
              onClick={() => handlePeriodChange(periodOption)}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors ${
                period === periodOption ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400" : "text-gray-700 dark:text-zinc-300"
              }`}
            >
              <div className="flex items-center justify-between">
                <span>{t(`periods.${periodOption}`) || getPeriodLabel(periodOption)}</span>
                {period === periodOption && <div className="w-2 h-2 bg-blue-700 dark:bg-blue-400 rounded-full"></div>}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default PeriodSelector;
