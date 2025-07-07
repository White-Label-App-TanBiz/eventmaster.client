import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";

const AppLayout: React.FC = () => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 text-gray-900 dark:text-white transition-colors">
      <div className="flex h-screen">
        <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} userRole={user?.role || "super_admin"} />
        <div className="flex-1 flex flex-col lg:ml-0 overflow-hidden">
          <Header onToggleSidebar={toggleSidebar} />
          <main className="flex-1 p-4 lg:p-6 overflow-auto">
            <div className="max-w-7xl mx-auto">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
