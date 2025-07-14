import React, { Suspense, lazy } from "react";
import { useParams, Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext";
import PageLayout from "../../../layouts/page";

const ClientAdmins = lazy(() => import("./components/clientAdmins"));
const Plans = lazy(() => import("./components/plans"));
const Payments = lazy(() => import("./components/payments"));
const Transactions = lazy(() => import("./components/transactions"));
const Analytics = lazy(() => import("./components/analytics"));
const Licenses = lazy(() => import("./components/licenses"));
const Settings = lazy(() => import("./components/settings"));
const Providers = lazy(() => import("./components/providers"));
const WhiteLabel = lazy(() => import("./components/whiteLabel"));
const Events = lazy(() => import("./components/events"));
const Customers = lazy(() => import("./components/customers"));
const Admins = lazy(() => import("./components/admins"));
const MyEvents = lazy(() => import("./components/myEvents"));
const AccountSettings = lazy(() => import("./components/accountSettings"));

const SubDashboardPage: React.FC = () => {
  const { submenuId } = useParams<{ submenuId: string }>();
  const { user } = useAuth();

  const renderContent = (menu: string | undefined) => {
    switch (menu) {
      case "client-admins":
        if (user?.role !== "super_admin") return <Navigate to="/dashboard" replace />;
        return <ClientAdmins />;
      case "plans":
        if (user?.role !== "super_admin" && user?.role !== "client_admin") return <Navigate to="/dashboard" replace />;
        return <Plans />;
      case "payments":
        if (user?.role !== "super_admin" && user?.role !== "client_admin") return <Navigate to="/dashboard" replace />;
        return <Payments />;
      case "transactions":
        if (user?.role !== "super_admin" && user?.role !== "client_admin") return <Navigate to="/dashboard" replace />;
        return <Transactions />;
      case "analytics":
        if (user?.role !== "super_admin" && user?.role !== "client_admin" && user?.role !== "provider") return <Navigate to="/dashboard" replace />;
        return <Analytics />;
      case "licenses":
        if (user?.role !== "super_admin") return <Navigate to="/dashboard" replace />;
        return <Licenses />;
      case "settings":
        if (user?.role !== "super_admin") return <Navigate to="/dashboard" replace />;
        return <Settings />;
      case "providers":
        if (user?.role !== "client_admin") return <Navigate to="/dashboard" replace />;
        return <Providers />;
      case "white-label":
        if (user?.role !== "client_admin") return <Navigate to="/dashboard" replace />;
        return <WhiteLabel />;
      case "events":
        if (user?.role !== "provider" && user?.role !== "admin") return <Navigate to="/dashboard" replace />;
        return <Events />;
      case "customers":
        if (user?.role !== "provider" && user?.role !== "admin") return <Navigate to="/dashboard" replace />;
        return <Customers />;
      case "admins":
        if (user?.role !== "provider") return <Navigate to="/dashboard" replace />;
        return <Admins />;
      case "my-events":
        if (user?.role !== "customer") return <Navigate to="/dashboard" replace />;
        return <MyEvents />;
      case "account-settings":
        return <AccountSettings />;
      default:
        return <Navigate to="/dashboard" replace />;
    }
  };

  return (
    <PageLayout>
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
        <div className="max-w-7xl mx-auto">{renderContent(submenuId)}</div>
      </Suspense>
    </PageLayout>
  );
};

export default SubDashboardPage;
