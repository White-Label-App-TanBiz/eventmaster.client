import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

import { AuthProvider, CurrencyProvider, LanguageProvider, PeriodProvider, ThemeProvider } from './contexts/provider';

import { useNotifications } from './hooks';
import { ProtectedRoute } from './tools';

import { NotificationSystem } from './components/feedbacks';

const EventsPage = lazy(() => import('./pages/events'));
const EventDetailsPage = lazy(() => import('./pages/events/event-details'));
const EventRegisterPage = lazy(() => import('./pages/events/event-details/register'));
const EventThankYouPage = lazy(() => import('./pages/events/event-details/thank-you'));

const CheckoutPage = lazy(() => import('./pages/checkout'));
const ThankYouPage = lazy(() => import('./pages/thank-you'));
const WhiteLabelSetupPage = lazy(() => import('./pages/white-label-setup'));

const LoginPage = lazy(() => import('./pages/login'));
const DashboardPage = lazy(() => import('./pages/dashboard'));
const SubDashboardPage = lazy(() => import('./pages/dashboard/sub-dashboard'));

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/events" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/checkout/:plan_id" element={<CheckoutPage />} />
      <Route path="/thank-you" element={<ThankYouPage />} />
      <Route path="/white-label-setup" element={<WhiteLabelSetupPage />} />
      <Route path="/events">
        <Route index element={<EventsPage />} />
        <Route path=":event_id" element={<EventDetailsPage />} />
        <Route path=":event_id/register" element={<EventRegisterPage />} />
        <Route path=":event_id/thank-you" element={<EventThankYouPage />} />
      </Route>
      <Route path="/dashboard" element={<ProtectedRoute />}>
        <Route index element={<DashboardPage />} />
        <Route path=":submenu_id" element={<SubDashboardPage />} />
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
