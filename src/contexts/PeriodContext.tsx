import React, { createContext, useContext, useState, useEffect } from "react";

export type Period = "last7days" | "last30days" | "thisweek" | "thismonth" | "lastmonth" | "thisyear" | "lastyear" | "alltime";

interface PeriodContextType {
  period: Period;
  setPeriod: (period: Period) => void;
  getPeriodLabel: (period: Period) => string;
  getPeriodData: (baseData: any, period: Period) => any;
}

const PeriodContext = createContext<PeriodContextType | undefined>(undefined);

export const usePeriod = () => {
  const context = useContext(PeriodContext);
  if (!context) {
    throw new Error("usePeriod must be used within a PeriodProvider");
  }
  return context;
};

export const PeriodProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [period, setPeriod] = useState<Period>("thismonth");

  useEffect(() => {
    const savedPeriod = localStorage.getItem("selectedPeriod") as Period;
    if (savedPeriod) {
      setPeriod(savedPeriod);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("selectedPeriod", period);
  }, [period]);

  const getPeriodLabel = (period: Period): string => {
    const labels = {
      last7days: "Last 7 days",
      last30days: "Last 30 days",
      thisweek: "This Week",
      thismonth: "This Month",
      lastmonth: "Last Month",
      thisyear: "This Year",
      lastyear: "Last Year",
      alltime: "All Time",
    };
    return labels[period];
  };

  const getPeriodData = (baseData: any, selectedPeriod: Period) => {
    // Simulate different data based on period
    const multipliers = {
      last7days: 0.15,
      last30days: 0.65,
      thisweek: 0.12,
      thismonth: 1.0, // Base data
      lastmonth: 0.85,
      thisyear: 12.5,
      lastyear: 10.8,
      alltime: 25.3,
    };

    const multiplier = multipliers[selectedPeriod];

    if (typeof baseData === "number") {
      return Math.round(baseData * multiplier);
    }

    if (typeof baseData === "object" && baseData !== null) {
      const result = { ...baseData };
      Object.keys(result).forEach((key) => {
        if (typeof result[key] === "number") {
          result[key] = Math.round(result[key] * multiplier);
        }
      });
      return result;
    }

    return baseData;
  };

  return <PeriodContext.Provider value={{ period, setPeriod, getPeriodLabel, getPeriodData }}>{children}</PeriodContext.Provider>;
};
