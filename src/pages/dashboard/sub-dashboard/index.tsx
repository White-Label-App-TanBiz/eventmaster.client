import React, { Suspense, lazy } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

import { useAuth } from '@/contexts/hooks';

import { DashboardLayout } from '@/layouts';

const ClientAdmins = lazy(() => import('./contents/client-admins'));
const Plans = lazy(() => import('./contents/plans'));
const Payments = lazy(() => import('./contents/payments'));
const Transactions = lazy(() => import('./contents/transactions'));
const Analytics = lazy(() => import('./contents/analytics'));
const Licenses = lazy(() => import('./contents/licenses'));
const Settings = lazy(() => import('./contents/settings'));
const Providers = lazy(() => import('./contents/providers'));
const WhiteLabel = lazy(() => import('./contents/white-label'));
const Events = lazy(() => import('./contents/events'));
const Customers = lazy(() => import('./contents/customers'));
const Admins = lazy(() => import('./contents/admins'));
const MyEvents = lazy(() => import('./contents/my-events'));
const AccountSettings = lazy(() => import('./contents/account-settings'));

const SubDashboardPage: React.FC = () => {
  const { submenu_id } = useParams<{ submenu_id: string }>();
  const { user } = useAuth();

  const renderContent = (menu: string | undefined) => {
    switch (menu) {
      case 'client-admins':
        if (user?.role !== 'super_admin') return <Navigate to="/dashboard" replace />;
        return <ClientAdmins />;
      case 'plans':
        if (user?.role !== 'super_admin' && user?.role !== 'client_admin') return <Navigate to="/dashboard" replace />;
        return <Plans />;
      case 'payments':
        if (user?.role !== 'super_admin' && user?.role !== 'client_admin') return <Navigate to="/dashboard" replace />;
        return <Payments />;
      case 'transactions':
        if (user?.role !== 'super_admin' && user?.role !== 'client_admin') return <Navigate to="/dashboard" replace />;
        return <Transactions />;
      case 'analytics':
        if (user?.role !== 'super_admin' && user?.role !== 'client_admin' && user?.role !== 'provider') return <Navigate to="/dashboard" replace />;
        return <Analytics />;
      case 'licenses':
        if (user?.role !== 'super_admin') return <Navigate to="/dashboard" replace />;
        return <Licenses />;
      case 'settings':
        if (user?.role !== 'super_admin') return <Navigate to="/dashboard" replace />;
        return <Settings />;
      case 'providers':
        if (user?.role !== 'client_admin') return <Navigate to="/dashboard" replace />;
        return <Providers />;
      case 'white-label':
        if (user?.role !== 'client_admin') return <Navigate to="/dashboard" replace />;
        return <WhiteLabel />;
      case 'events':
        if (user?.role !== 'provider' && user?.role !== 'admin') return <Navigate to="/dashboard" replace />;
        return <Events />;
      case 'customers':
        if (user?.role !== 'provider' && user?.role !== 'admin') return <Navigate to="/dashboard" replace />;
        return <Customers />;
      case 'admins':
        if (user?.role !== 'provider') return <Navigate to="/dashboard" replace />;
        return <Admins />;
      case 'my-events':
        if (user?.role !== 'customer') return <Navigate to="/dashboard" replace />;
        return <MyEvents />;
      case 'account-settings':
        return <AccountSettings />;
      default:
        return <Navigate to="/dashboard" replace />;
    }
  };

  return (
    <DashboardLayout>
      <Suspense
        fallback={
          <div className="flex max-w-7xl mx-auto min-h-full">
            <div className="self-stretch w-full bg-gray-50 dark:bg-zinc-950 flex items-center justify-center">
              <div className="flex items-center space-x-2">
                <Loader2 className="w-6 h-6 animate-spin text-blue-700" />
                <span className="text-gray-600 dark:text-zinc-400">Loading...</span>
              </div>
            </div>
          </div>
        }
      >
        <div className="max-w-7xl mx-auto">{renderContent(submenu_id)}</div>
      </Suspense>
    </DashboardLayout>
  );
};

export default SubDashboardPage;
