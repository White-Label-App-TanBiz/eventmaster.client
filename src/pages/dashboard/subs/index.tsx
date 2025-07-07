import React from "react";
import { useParams, Navigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import PageLayout from "../../../layouts/page";
import ClientAdmins from "./components/ClientAdmins";
import ProductPlans from "./components/ProductPlans";
import PaymentGateways from "./components/PaymentGateways";
import Transactions from "./components/Transactions";
import Analytics from "./components/Analytics";
import ApiLicenses from "./components/ApiLicenses";
import Settings from "./components/Settings";
import OrganizersPage from "./components/OrganizersPage";
import WhiteLabelSettings from "./components/WhiteLabelSettings";
import EventsPage from "./components/EventsPage";
import AttendeesPage from "./components/AttendeesPage";
import SubAdminsPage from "./components/SubAdminsPage";
import MyEventsPage from "./components/MyEventsPage";
import AccountSettings from "./components/AccountSettings";

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

  return <PageLayout>{renderContent(submenuId)}</PageLayout>;
};

export default SubDashboard;
