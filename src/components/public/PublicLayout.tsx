import React from "react";
import { Outlet } from "react-router-dom";
import PublicHeader from "./PublicHeader";
import PublicFooter from "./PublicFooter";
import { useTheme } from "../../contexts/ThemeContext";

const PublicLayout: React.FC = () => {
  const { theme } = useTheme();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-zinc-950 text-gray-900 dark:text-white transition-colors">
      <PublicHeader />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
      <PublicFooter />
    </div>
  );
};

export default PublicLayout;
