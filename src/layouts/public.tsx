import React from 'react';

import { PublicHeader } from '@/components/navigations';
import { PublicFooter } from '@/components/navigations';

const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-zinc-950 text-gray-900 dark:text-white transition-colors">
      <PublicHeader />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
      <PublicFooter />
    </div>
  );
};

export default PublicLayout;
