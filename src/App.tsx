import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { PeriodProvider } from "./contexts/PeriodContext";
import { AuthProvider } from "./contexts/AuthContext";
import { CurrencyProvider } from "./contexts/CurrencyContext";
import { useNotifications } from "./hooks/useNotifications";
import ProtectedRoute from "./components/ProtectedRoute";
import NotificationSystem from "./components/NotificationSystem";

const CheckoutPage = lazy(() => import("./pages/checkout"));
const ThankYouPage = lazy(() => import("./pages/thankYou"));
const WhiteLabelSetupPage = lazy(() => import("./pages/whiteLabelSetup"));

const LoginPage = lazy(() => import("./pages/login"));
const DashboardPage = lazy(() => import("./pages/dashboard"));
const SubDashboardPage = lazy(() => import("./pages/dashboard/subDashboard"));

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/checkout/:planId" element={<CheckoutPage />} />
      <Route path="/thank-you" element={<ThankYouPage />} />
      <Route path="/white-label-setup" element={<WhiteLabelSetupPage />} />
      {/* Root redirect */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      {/* New Dashboard */}
      <Route path="/dashboard" element={<ProtectedRoute />}>
        <Route index element={<DashboardPage />} />
        <Route path=":submenuId" element={<SubDashboardPage />} />
      </Route>
    </Routes>
  );
};

const AppLoading: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 flex items-center justify-center">
      <div className="flex items-center space-x-2">
        <Loader2 className="w-6 h-6 animate-spin text-blue-700" />
        <span className="text-gray-600 dark:text-zinc-400">Loading...</span>
      </div>
    </div>
  );
};

function App() {
  const { notifications, removeNotification } = useNotifications();

  return (
    <AuthProvider>
      <ThemeProvider>
        <LanguageProvider>
          <CurrencyProvider>
            <PeriodProvider>
              <Suspense fallback={<AppLoading />}>
                <AppRoutes />
              </Suspense>
              <NotificationSystem notifications={notifications} onRemove={removeNotification} />
            </PeriodProvider>
          </CurrencyProvider>
        </LanguageProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
