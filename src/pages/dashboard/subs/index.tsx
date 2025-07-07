import React, { Suspense, lazy } from "react";
import { useParams, Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext";
import PageLayout from "../../../layouts/page";

const ClientAdmins = lazy(() => import("./components/ClientAdmins"));
const ProductPlans = lazy(() => import("./components/ProductPlans"));
const PaymentGateways = lazy(() => import("./components/PaymentGateways"));
const Transactions = lazy(() => import("./components/Transactions"));
const Analytics = lazy(() => import("./components/Analytics"));
const ApiLicenses = lazy(() => import("./components/ApiLicenses"));
const Settings = lazy(() => import("./components/Settings"));
const OrganizersPage = lazy(() => import("./components/OrganizersPage"));
const WhiteLabelSettings = lazy(() => import("./components/WhiteLabelSettings"));
const EventsPage = lazy(() => import("./components/EventsPage"));
const AttendeesPage = lazy(() => import("./components/AttendeesPage"));
const SubAdminsPage = lazy(() => import("./components/SubAdminsPage"));
const MyEventsPage = lazy(() => import("./components/MyEventsPage"));
const AccountSettings = lazy(() => import("./components/AccountSettings"));

const SubDashboard: React.FC = () => {
  const { submenuId } = useParams<{ submenuId: string }>();
  const { user } = useAuth();

  const renderContent = (menu: string | undefined) => {
    switch (menu) {
      case "customers":
        if (user?.role !== "super_admin") return <Navigate to="/dashboard" replace />;
        return <ClientAdmins />;
      case "plans":
        if (user?.role !== "super_admin" && user?.role !== "client_admin") return <Navigate to="/dashboard" replace />;
        return <ProductPlans />;
      case "payments":
        if (user?.role !== "super_admin" && user?.role !== "client_admin") return <Navigate to="/dashboard" replace />;
        return <PaymentGateways />;
      case "transactions":
        if (user?.role !== "super_admin" && user?.role !== "client_admin") return <Navigate to="/dashboard" replace />;
        return <Transactions />;
      case "analytics":
        if (user?.role !== "super_admin" && user?.role !== "client_admin" && user?.role !== "organizer") return <Navigate to="/dashboard" replace />;
        return <Analytics />;
      case "licenses":
        if (user?.role !== "super_admin") return <Navigate to="/dashboard" replace />;
        return <ApiLicenses />;
      case "settings":
        if (user?.role !== "super_admin") return <Navigate to="/dashboard" replace />;
        return <Settings />;
      case "organizers":
        if (user?.role !== "client_admin") return <Navigate to="/dashboard" replace />;
        return <OrganizersPage />;
      case "white-label":
        if (user?.role !== "client_admin") return <Navigate to="/dashboard" replace />;
        return <WhiteLabelSettings />;
      case "events":
        if (user?.role !== "organizer" && user?.role !== "admin") return <Navigate to="/dashboard" replace />;
        return <EventsPage />;
      case "attendees":
        if (user?.role !== "organizer" && user?.role !== "admin") return <Navigate to="/dashboard" replace />;
        return <AttendeesPage />;
      case "admins":
        if (user?.role !== "organizer") return <Navigate to="/dashboard" replace />;
        return <SubAdminsPage />;
      case "my-events":
        if (user?.role !== "attendee") return <Navigate to="/dashboard" replace />;
        return <MyEventsPage />;
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

export default SubDashboard;
