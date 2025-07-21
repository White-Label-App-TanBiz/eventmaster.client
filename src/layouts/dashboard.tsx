import React, { useState } from 'react';

import { useAuth } from '@/contexts/hooks';

import { Header } from '@/components/navigations';
import { Sidebar } from '@/components/navigations';

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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
        <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} userRole={user?.role || 'super_admin'} />
        <div className="flex-1 flex flex-col lg:ml-0 overflow-hidden">
          <Header onToggleSidebar={toggleSidebar} />
          <main className="flex-1 p-4 lg:p-6 overflow-auto">{children}</main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
